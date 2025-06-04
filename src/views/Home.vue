<template>
  <div class="home">
    <template v-if="authStore.isAuthenticated">
      <h1>Posts Feed - displaying {{ posts.length }} of {{ totalPosts }}</h1>

      <!-- Loading state -->
      <div v-if="isLoadingMore">Loading posts...</div>

      <!-- Error state -->
      <div v-else-if="error">{{ error }}</div>

      <!-- Posts list -->
      <div v-else>
        <div v-for="post in posts" :key="post.id" class="post">
          <h2>{{ post.title }}</h2>
          <p>{{ post.content }}</p>
          <div class="post-meta">
            <span>By: {{ post.author }}</span>
            <span
              >Posted: {{ new Date(post.createdAt).toLocaleDateString() }}</span
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
    error.value = "Failed to load more posts. Please try again.";
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
