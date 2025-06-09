<template>
  <div class="post-form">
    <h1>{{ isEditing ? "Edit Post" : "Create New Post" }}</h1>
    <p v-if="error">Error updating post. Try again later.</p>
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="content">Content</label>
        <textarea
          id="content"
          v-model="content"
          rows="6"
          :placeholder="isLoading ? 'Loading post...' : ''"
          required
        ></textarea>
      </div>
      <button type="submit">{{ isEditing ? "Update" : "Publish" }}</button>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import api from "../api/axios";

const route = useRoute();
const content = ref("");
const error = ref(false);
const isEditing = ref(false);
const isLoading = ref(false);

onMounted(async () => {
  if (route.params.id) {
    isEditing.value = true;
    isLoading.value = true;

    const { data } = await api.get(`/post/${route.params.id}`);

    content.value = data.content;
    isLoading.value = false;
  }
});

const handleSubmit = async () => {
  try {
    const body = { content: content.value };
    await api.put(`/post/${route.params.id}`, body);
  } catch (err) {
    error.value = true;
    console.error("Error editing post: ", err);
  }
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
