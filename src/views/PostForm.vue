<template>
  <div class="post-form">
    <h1>{{ isEditing ? "Edit Post" : "Create New Post" }}</h1>
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="title">Title</label>
        <input type="text" id="title" v-model="title" required />
      </div>
      <div class="form-group">
        <label for="content">Content</label>
        <textarea id="content" v-model="content" rows="6" required></textarea>
      </div>
      <button type="submit">{{ isEditing ? "Update" : "Create" }} Post</button>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const title = ref("");
const content = ref("");
const isEditing = ref(false);

onMounted(() => {
  if (route.params.id) {
    isEditing.value = true;
    // Add logic to fetch post data when editing
  }
});

const handleSubmit = () => {
  // Add your submit logic here
  router.push("/"); // Redirect to home after submission
};
</script>

<style scoped>
/* .post-form {
  max-width: 800px;
  margin: 40px auto;
  padding: 20px;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
}

input,
textarea {
  width: 100%;
  padding: 8px;
  margin-bottom: 10px;
}

textarea {
  resize: vertical;
}

button {
  padding: 10px 20px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #45a049;
} */
</style>
