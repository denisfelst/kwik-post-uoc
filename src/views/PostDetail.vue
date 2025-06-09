<template>
  <div class="post-detail">
    <!-- Loading state -->
    <div v-if="isLoading">Loading post...</div>

    <!-- Error state -->
    <div v-else-if="error">{{ error }}</div>

    <!-- Post content -->
    <div v-else-if="post" class="post-content">
      <!-- Author info section -->
      <div class="author-info">
        <router-link :to="`/profile/${post.user.username}`">
          <img
            :src="post.user.profileImg"
            :alt="post.user.username"
            class="author-avatar"
          />
          <div class="author-details">
            <span class="author-name"
              >{{ post.user.name }} {{ post.user.surname }}</span
            >
            <span class="author-username">@{{ post.user.username }}</span>
          </div>
        </router-link>
      </div>

      <!-- Post content section -->
      <div class="post-body">
        <p>{{ post.content }}</p>
      </div>

      <!-- Post metadata -->
      <div class="post-meta">
        <span class="post-date">
          {{ new Date(post.publishDate).toLocaleString() }}
        </span>
        <div class="post-stats">
          <span class="likes">{{ post.nLikes }} likes</span>
          <span class="replies">{{ post.nReplies }} replies</span>
        </div>
      </div>

      <!-- Action buttons -->
      <div class="post-actions">
        <button @click="handleLike" :disabled="isLiking">
          {{ isLiking ? "Liking..." : "Like" }}
        </button>
        <button @click="isReplyFormVisible = !isReplyFormVisible">Reply</button>
        <!-- Edit button only for post author -->
        <button
          v-if="isCurrentUserPost"
          @click="$router.push(`/post/form/${post.id}`)"
        >
          Edit
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
            @click="handleReply"
            :disabled="isSubmittingReply || !replyContent.trim()"
          >
            {{ isSubmittingReply ? "Sending..." : "Send" }}
          </button>
          <button @click="cancelReply">Cancel</button>
        </div>
      </div>

      <!-- Replies section -->
      <div v-if="post.replies.length > 0" class="replies-section">
        <h3>Replies</h3>
        <div v-for="reply in post.replies" :key="reply.id" class="reply">
          <div class="reply-author">
            <router-link :to="`/profile/${reply.user.username}`">
              <img
                :src="reply.user.profileImg"
                :alt="reply.user.username"
                class="reply-avatar"
              />
              <span>{{ reply.user.name }}</span>
            </router-link>
          </div>
          <div class="reply-content">{{ reply.content }}</div>
          <div class="reply-date">
            {{ new Date(reply.publishDate).toLocaleString() }}
          </div>
        </div>
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

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const post = ref(null);
const isLoading = ref(true);
const error = ref(null);
const isLiking = ref(false);
const isReplyFormVisible = ref(false);
const replyContent = ref("");
const isSubmittingReply = ref(false);

// Compute if the post belongs to current user
const isCurrentUserPost = computed(() => {
  if (!post.value || !authStore.user) return false;
  return post.value.userId === authStore.user.id;
});

const fetchPost = async () => {
  try {
    const { data } = await api.get(`/post/${route.params.id}`);
    post.value = data;
    console.log("post.value ::: ", post.value);
  } catch (err) {
    error.value = "Failed to load post. Please try again later.";
    console.error("Error fetching post:", err);
  } finally {
    isLoading.value = false;
  }
};

const handleLike = async () => {
  if (isLiking.value) return;

  isLiking.value = true;
  try {
    await api.post(`/post/${post.value.id}/like`);
    post.value.nLikes++;
  } catch (err) {
    console.error("Error liking post:", err);
  } finally {
    isLiking.value = false;
  }
};

const handleReply = async () => {
  if (isSubmittingReply.value || !replyContent.value.trim()) return;

  isSubmittingReply.value = true;
  try {
    await api.post(`/post/${post.value.id}/reply`, {
      content: replyContent.value,
    });
    // Refresh post data to get new reply
    await fetchPost();
    // Reset reply form
    cancelReply();
  } catch (err) {
    console.error("Error submitting reply:", err);
  } finally {
    isSubmittingReply.value = false;
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
