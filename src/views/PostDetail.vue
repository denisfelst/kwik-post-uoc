<template>
  <div class="post-detail">
    <div v-if="post" class="post-content">
      <h1>{{ post.title }}</h1>
      <div class="post-meta">
        <span>Posted by: {{ post.author }}</span>
        <span>Date: {{ post.date }}</span>
      </div>
      <div class="post-body">
        {{ post.content }}
      </div>
    </div>
    <div v-else>Loading...</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const post = ref(null);

onMounted(() => {
  // Add logic to fetch post data using route.params.id
  // For now, we'll use dummy data
  post.value = {
    title: "Sample Post",
    author: "John Doe",
    date: new Date().toLocaleDateString(),
    content: "This is a sample post content.",
  };
});
</script>

<style scoped>
/* .post-detail {
  max-width: 800px;
  margin: 40px auto;
  padding: 20px;
}

.post-meta {
  color: #666;
  margin: 10px 0;
}

.post-meta span {
  margin-right: 20px;
}

.post-body {
  margin-top: 20px;
  line-height: 1.6;
} */
</style>
