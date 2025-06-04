<template>
  <div class="profile">
    <!-- Loading state -->
    <div v-if="isLoadingMore">Loading posts...</div>

    <!-- Error state -->
    <div v-else-if="error">{{ error }}</div>

    <div v-else>
      <template v-if="profile">
        <!-- Posts List -->
        <h1>{{ route.params.username }}'s Profile</h1>
        <div class="profile-info">
          <div class="profile-stats">
            <div>Posts: {{ profile.posts }}</div>
            <div>Joined: {{ profile.joinDate }}</div>
          </div>
        </div>
        <div class="user-posts">
          <h2>Recent Posts - {{ posts.length }} of {{ totalPosts }}</h2>
          <div v-for="post in posts" :key="post.id" class="post">
            <h2>{{ post.title }}</h2>
            <p>{{ post.content }}</p>
            <div class="post-meta">
              <span>By: {{ post.author }}</span>
              <span
                >Posted:
                {{ new Date(post.createdAt).toLocaleDateString() }}</span
              >
            </div>
            <router-link :to="'/post/' + post.id">Read more</router-link>
          </div>

          <!-- Load more button -->
          <button
            v-if="hasMorePosts"
            @click="loadPosts"
            :disabled="isLoadingMore"
          >
            {{ isLoadingMore ? "Loading more..." : "Load more" }}
          </button>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import api from "../api/axios";
import { useAuthStore } from "../stores/auth";

const limit = 10;

const route = useRoute();
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
    console.log("-> ", data);

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
    console.log("-> ", err);
    error.value = "Failed to load more posts. Please try again.";
  } finally {
    isLoadingMore.value = false;
    offset.value += limit;
    hasMorePosts.value = posts.value.length < totalPosts.value;
  }
};

onMounted(() => {
  console.log("on mounted");
  loadPosts();
});
</script>

<style scoped>
/* .profile {
  max-width: 800px;
  margin: 40px auto;
  padding: 20px;
}

.profile-info {
  margin: 20px 0;
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 8px;
}

.profile-stats {
  display: flex;
  gap: 20px;
  color: #666;
}

.user-posts {
  margin-top: 30px; 
}
*/
</style>
