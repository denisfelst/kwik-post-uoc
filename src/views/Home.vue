<template>
  <div class="home">
    <template v-if="authStore.isAuthenticated">
      <h1>Feed</h1>

      <p v-if="!isLoadingMore">({{ posts.length }} of {{ totalPosts }})</p>

      <div v-if="isLoadingMore">Loading posts...</div>

      <div v-else-if="error" class="error">{{ error }}</div>

      <div v-else class="posts-list">
        <PostCard v-for="post in posts" :key="post.id" :post="post" />

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

    <template v-else>
      <h3 class="login-invite">
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
import PostCard from "../shared/PostCard.vue";

const limit = 10;

const authStore = useAuthStore();

const posts = ref([]);
const isLoadingMore = ref(false);
const error = ref(null);
const offset = ref(0);
const hasMorePosts = ref(true);
const totalPosts = ref(0);

const resolveData = async (data) => {
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
};

const loadPosts = async () => {
  if (isLoadingMore.value) {
    return;
  }

  isLoadingMore.value = true;
  try {
    const { data } = await api.get(
      `/posts?limit=${limit}&offset=${offset.value}`
    );
    await resolveData(data);
  } catch (err) {
    console.error("Error loading posts:", err);
    error.value = "Failed to load posts. Please try again.";
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

.post {
  display: flex;
  flex-direction: column;
  padding: 10px;
  background-color: #fff;
  position: relative;
  cursor: pointer;
  margin: 4px 8px;
}

.post a {
  text-decoration: none;
  color: inherit !important;
}

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

.btn.load-more {
  margin: 10px auto;
  min-width: 200px;
  text-align: center;
}

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

.posts-list {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.post {
  margin-top: 10px;
}

.post:not(:last-child) {
  border-bottom: 1px solid #ddd;
  padding-bottom: 20px;
}

.btn .load-more {
  margin: 10px auto;
  min-width: 200px;
}

.login-invite {
  padding: 4px 20px;
  text-align: center;
}
</style>
