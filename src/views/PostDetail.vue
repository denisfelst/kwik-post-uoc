<template>
  <div class="post-detail">
    <!-- Loading state -->
    <div v-if="isLoading">Loading post...</div>

    <!-- Error state -->
    <div v-else-if="error" class="error">{{ error }}</div>

    <!-- Post content -->
    <div v-else-if="post" class="main-post">
      <PostCard :post="post" />

      <!-- Action buttons -->
      <div class="actions-wrapper">
        <button class="btn" @click="isReplyFormVisible = !isReplyFormVisible">
          Reply
        </button>
        <!-- Edit button only for post author -->
        <button
          v-if="isCurrentUserPost"
          class="btn"
          @click="$router.push(`/post/form/${post.id}`)"
        >
          Edit
        </button>
        <button v-if="isCurrentUserPost" class="btn" @click="handleDelete">
          Delete
        </button>
      </div>

      <!-- Reply form -->
      <div v-if="isReplyFormVisible" class="reply-form">
        <textarea
          v-model="replyContent"
          placeholder="Write your reply..."
          rows="3"
        ></textarea>
        <div class="reply-actions">
          <button
            class="btn btn--cta"
            @click="handleReply"
            :disabled="isSubmittingReply || !replyContent.trim()"
          >
            {{ isSubmittingReply ? "Sending..." : "Send" }}
          </button>
          <button class="btn" @click="cancelReply">Cancel</button>
        </div>
      </div>

      <!-- Replies section -->
      <div v-if="post.replies.length > 0" class="replies-list">
        <h3>Replies</h3>
        <PostCard v-for="reply in post.replies" :key="reply.id" :post="reply" />
      </div>
    </div>

    <!-- Not found state -->
    <div v-else>Post not found</div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";
import api from "../api/axios";
import PostCard from "../shared/PostCard.vue";

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const post = ref(null);
const isLoading = ref(true);
const error = ref(null);
const isReplyFormVisible = ref(false);
const replyContent = ref("");
const isSubmittingReply = ref(false);

// Re-compute if the post belongs to current user
const isCurrentUserPost = computed(() => {
  if (!post.value || !authStore.user) {
    return false;
  }
  return post.value.userId === authStore.user.id;
});

const fetchPost = async () => {
  try {
    const { data } = await api.get(`/post/${route.params.id}`);
    post.value = data;
  } catch (err) {
    error.value = "Failed to load post. Please try again later.";
    console.error("Error fetching post:", err);
  } finally {
    isLoading.value = false;
  }
};

const handleReply = async () => {
  if (isSubmittingReply.value || !replyContent.value.trim()) {
    return;
  }

  isSubmittingReply.value = true;
  try {
    await api.post(`/post/${post.value.id}/reply`, {
      content: replyContent.value,
    });

    await fetchPost();

    cancelReply();
  } catch (err) {
    console.error("Error submitting reply:", err);
    error.value = "Failed to submit reply. Please try again.";
  } finally {
    isSubmittingReply.value = false;
  }
};

const handleDelete = async () => {
  try {
    await api.delete(`/post/${post.value.id}`);
    router.push("/");
  } catch (err) {
    console.error("Error deleting post:", err);
    error.value = "Failed to delete post. Please try again.";
  }
};
const cancelReply = () => {
  isReplyFormVisible.value = false;
  replyContent.value = "";
};

onMounted(() => {
  fetchPost();
});
</script>

<style scoped>
.main-post {
  border: 1px solid #ddd;
  border-radius: 20px;
  padding: 10px;
}

.actions-wrapper {
  display: flex;
  justify-content: flex-end;
  gap: 20px;
  margin-top: 10px;
  margin-right: 10px;
}

.replies-list {
  margin: 20px 0;
  border-left: 2px solid var(--primary-color);
}

.replies-list h3 {
  margin: 0 20px 10px;
  color: var(--grey-color);
}

.reply-form {
  margin: 20px 0;
}

.reply-actions {
  display: flex;
  justify-content: flex-start;
  gap: 20px;
}
</style>
