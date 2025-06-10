<template>
  <div class="home">
    <template v-if="authStore.isAuthenticated">
      <h1>Feed</h1>
      <p>({{ posts.length }} of {{ totalPosts }})</p>

      <!-- Loading state -->
      <div v-if="isLoadingMore">Loading posts...</div>

      <!-- Error state -->
      <div v-else-if="error" class="error">{{ error }}</div>

      <!-- Posts list -->
      <div v-else>
        <div class="posts-list">
          <div v-for="post in posts" :key="post.id" class="post">
            <router-link :to="'/post/' + post.id">
              <div class="user-info">
                <router-link :to="'/profile/' + post.user.username">
                  <img
                    class="user-info__avatar"
                    :src="post.user.profileImg"
                    :alt="`profile img of ${post.user.username}`"
                  />
                </router-link>

                <router-link :to="'/profile/' + post.user.username">
                  <div class="user-info__user">
                    <span> {{ post.user.name }} {{ post.user.surname }} </span>
                    <span class="username">@{{ post.user.username }}</span>
                  </div>
                </router-link>
              </div>
              <div class="post-detail">
                <p>{{ post.content }}</p>
                <p class="time">
                  {{ new Date(post.publishDate).toLocaleString() }}
                </p>
              </div>
              <div class="interactions">
                <span class="icon">{{ post.nLikes ?? "0" }} Likes</span
                ><span class="icon">{{ post.nReplies ?? "0" }} Replies</span>
              </div>
            </router-link>
          </div>
        </div>

        <!-- Load more button -->
        <button
          v-if="hasMorePosts"
          @click="loadPosts"
          :disabled="isLoadingMore"
          class="btn"
        >
          {{ isLoadingMore ? "Loading more..." : "Load more" }}
        </button>
      </div>
    </template>

    <template v-else>
      <h3>
        <router-link to="/login">Login</router-link> to connect with your
        community.
      </h3>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import api from "../api/axios";
import { useAuthStore } from "../stores/auth";

const limit = 10;

const authStore = useAuthStore();

const posts = ref([]);
const isLoadingMore = ref(false);
const error = ref(null);
const offset = ref(0);
const hasMorePosts = ref(true);
const totalPosts = ref(0);

const loadPosts = async () => {
  if (isLoadingMore.value) return;

  isLoadingMore.value = true;

  try {
    const { data } = await api.get(
      `/posts?limit=${limit}&offset=${offset.value}`
    );

    if (!data || data.result.length === 0) {
      hasMorePosts.value = false;
      return;
    }

    if (posts.value.length === 0) {
      totalPosts.value = data.paginator.total;
      posts.value = data.result;
    } else {
      posts.value = [...posts.value, ...data.result];
    }
  } catch (err) {
    console.error("Error loading posts:", err);
  } finally {
    isLoadingMore.value = false;
    offset.value += limit;
    hasMorePosts.value = posts.value.length < totalPosts.value;
  }
};

onMounted(() => {
  loadPosts();
});
</script>

<style scoped>
/******************************* POST *******************************/

/* Post container */
.post {
  display: flex;
  flex-direction: column;
  padding: 10px;
  background-color: #fff;
  position: relative;
  cursor: pointer;
  margin: 4px 8px;
  /* border-bottom: 1px solid #e0e0e0; */
}

/* Link inside a post */
.post a {
  text-decoration: none;
  color: inherit !important;
}

/* Post user info container */
.user-info {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.user-info__user {
  display: flex;
  flex-direction: column;
}

.user-info__user .username {
  font-size: 12px;
  color: #555;
}

.user-info__avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
}

/* Post content container */
.post-detail {
  margin-bottom: 10px;
}

.post-detail p {
  margin: 0;
  font-size: 14px;
}

.post-detail .time {
  font-size: 12px;
}

/* Contains likes and replies count and buttons*/
.interactions {
  display: flex;
  justify-content: flex-start;
  gap: 10px;
}

.interactions .icon {
  font-size: 12px;
  color: #555;
}

/******************************* PAGINATED POSTS LIST *******************************/

/* Posts list container */
.posts-list {
  flex: 1;
  display: flex;
  flex-direction: column;
}

/* Post container */

.post {
  margin-top: 10px;
}

.post:not(:last-child) {
  border-bottom: 1px solid #ddd;
  padding-bottom: 20px;
}

/* Load more posts button */
.btn.load-more {
  margin: 10px auto;
  min-width: 200px;
}
</style>
