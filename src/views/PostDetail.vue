<template>
  <div class="post-detail">
    <!-- Loading state -->
    <div v-if="isLoading">Loading post...</div>

    <!-- Error state -->
    <div v-else-if="error">{{ error }}</div>

    <!-- Post content -->
    <div v-else-if="post" class="post-content">
      <h1>{{ post.title }}</h1>
      <div class="post-meta">
        <span>Posted by: {{ post.author }}</span>
        <span>Date: {{ new Date(post.createdAt).toLocaleDateString() }}</span>
      </div>
      <div class="post-body">
        {{ post.content }}
      </div>

      <!-- If the post belongs to current user, show edit button -->
      <div v-if="isCurrentUserPost" class="post-actions">
        <router-link :to="`/post/form/${post.id}`" class="edit-button">
          Edit Post
        </router-link>
      </div>
    </div>

    <!-- Not found state -->
    <div v-else>Post not found</div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import { useAuthStore } from "../stores/auth";
import api from "../api/axios";

const route = useRoute();
const authStore = useAuthStore();
const post = ref(null);
const isLoading = ref(true);
const error = ref(null);

// Compute if the post belongs to current user
const isCurrentUserPost = computed(() => {
  if (!post.value || !authStore.user) return false;
  return post.value.author === authStore.user.username;
});

const fetchPost = async () => {
  try {
    const { data } = await api.get(`/post/${route.params.id}`);
    console.log("-> ", data);

    post.value = data;
  } catch (err) {
    error.value = "Failed to load post. Please try again later.";
    console.error("Error fetching post:", err);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchPost();
});
</script>
