<template>
  <div class="profile">
    <!-- Loading state -->
    <div v-if="isLoadingMore">Loading posts...</div>

    <!-- Error state -->
    <div v-else-if="error">{{ error }}</div>

    <div v-else>
      <template v-if="profile">
        <div class="user-info">
          <div class="user-info__avatar">
            <img :src="authStore.profileImg" alt="profile picture of user" />
          </div>
          <div class="user-info__fullname">
            <span>{{ authStore.user.name }} {{ authStore.user.surname }}</span>
          </div>
          <div class="user-info__username">
            <span>@{{ authStore.user.username }}</span>
          </div>
          <div class="user-info__bio">
            <span
              >Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Quisquam, quos.</span
            >
          </div>
          <div class="user-info__join-date">
            <span
              >Joined in
              {{
                new Date(authStore.registrationDate).toLocaleString("en-US", {
                  month: "long",
                  year: "numeric",
                })
              }}</span
            >
          </div>
        </div>

        <div class="posts">
          <div v-for="post in posts" :key="post.id" class="post">
            <router-link :to="'/post/' + post.id">
              <div class="post-detail">
                <p>{{ post.content }}</p>
                <p class="time">
                  {{ new Date(post.publishDate).toLocaleDateString() }}
                  {{ new Date(post.publishDate).toLocaleTimeString() }}
                </p>
              </div>
              <div class="interactions">
                <span class="icon">{{ post.nLikes ?? "0" }} Likes</span
                ><span class="icon">{{ post.nReplies ?? "0" }} Replies</span>
              </div>
            </router-link>
          </div>

          <!-- Load more button -->
          <button
            v-if="hasMorePosts"
            @click="loadPosts"
            :disabled="isLoadingMore"
            class="btn load-more"
          >
            {{ isLoadingMore ? "Loading more..." : "Load more" }}
          </button>
        </div>
      </template>
    </div>

    <div
      class="btn--logout"
      v-if="route.params.username === authStore.user?.username"
    >
      <button @click="handleLogout">logout</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import api from "../api/axios";
import { useAuthStore } from "../stores/auth";

const limit = 10;

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const profile = ref(null);
const posts = ref([]);
const offset = ref(0);
const isLoadingMore = ref(false);
const hasMorePosts = ref(true);
const totalPosts = ref(0);
const error = ref(null);

const loadPosts = async () => {
  if (isLoadingMore.value) return;

  isLoadingMore.value = true;

  try {
    const { data } = await api.get(
      `/user/${route.params.username}/posts?limit=${limit}&offset=${offset.value}`
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

    profile.value = {
      username: route.params.username,
      posts: posts.value.length,
      joinDate: new Date().toLocaleDateString(),
    };
  } catch (err) {
    error.value = "Failed to load more posts. Please try again.";
  } finally {
    isLoadingMore.value = false;
    offset.value += limit;
    hasMorePosts.value = posts.value.length < totalPosts.value;
  }
};

const handleLogout = () => {
  authStore.logout();
  router.push("/");
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

/* .logout-btn {
  margin-top: 10px;
  margin-bottom: 10px;
  text-align: center;
} */

/******************************* PROFILE VIEW *******************************/

/* Header of the profile page */
.user-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  align-items: center;
  width: 100%;
  padding-bottom: 10px;
  border-bottom: 1px solid #ddd;
  position: relative;
}

.user-info__fullname {
  font-weight: 600;
}

.user-info__username {
  font-size: 12px;
  color: #555;
}

.user-info__bio {
  font-size: 14px;
  font-weight: 500;
  color: #222;
}

.user-info__join-date {
  font-size: 12px;
  color: #555;
}

/* Avatar */
.user-info__avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  overflow: hidden;
}
.user-info__avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Logout button */
/* Logout button */
.btn--logout {
  position: absolute;
  top: 10px;
  right: 10px;
  border: none;
  font-size: 20px;
  cursor: pointer;
}
</style>
