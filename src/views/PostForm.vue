<template>
  <div class="form-post">
    <h1>{{ isEditing ? "Edit Post" : "Create New Post" }}</h1>
    <p v-if="error">Error updating post. Try again later.</p>
    <form @submit.prevent="handleSubmit" class="form-post__form">
      <div class="form-post__form-content">
        <img
          :src="authStore.profileImg"
          alt="profile picture of user"
          class="form-post__image"
        />
        <textarea
          id="content"
          v-model="content"
          rows="6"
          :placeholder="
            isLoading ? 'Loading post...' : 'Share your thoughts...'
          "
          required
        ></textarea>
      </div>
      <div>
        <button type="submit" class="btn btn--share">
          {{ isEditing ? "Update" : "Share" }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import api from "../api/axios";
import { useAuthStore } from "../stores/auth";

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

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
    if (isEditing.value) {
      await api.put(`/post/${route.params.id}`, body);
    } else {
      await api.post("/post", { content: content.value });
    }
    router.push("/");
  } catch (err) {
    error.value = true;
    console.error("Error handling post: ", err);
  }
};
</script>

<style scoped>
/* Post form main container */
.form-post {
  display: flex;
  flex-direction: column;
  padding: 10px;
  margin: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #fff;
  position: relative;
}

/* Image of the user */
.form-post__image {
  flex-shrink: 0;
  width: 30px;
  height: 30px;
  border-radius: 50%;
}

/* Form */
.form-post__form {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.form-post__form-content {
  display: flex;
  flex-direction: row;
}

.form-post__form .btn--share {
  justify-self: c;
}

.form-post__form textarea {
  display: block;
  width: 100%;
  padding: 10px;
  border: 0;
  resize: none;
}
</style>
