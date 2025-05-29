<template>
  <div class="profile">
    <div v-if="profile" class="profile-content">
      <h1>{{ profile.username }}'s Profile</h1>
      <div class="profile-info">
        <div class="profile-stats">
          <div>Posts: {{ profile.posts }}</div>
          <div>Joined: {{ profile.joinDate }}</div>
        </div>
      </div>
      <div class="user-posts">
        <h2>Recent Posts</h2>
        <!-- Add user posts list here -->
      </div>
    </div>
    <div v-else>Loading...</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const profile = ref(null);

onMounted(() => {
  // Add logic to fetch profile data using route.params.username
  // For now, we'll use dummy data
  profile.value = {
    username: route.params.username,
    posts: 0,
    joinDate: new Date().toLocaleDateString(),
  };
});
</script>

<style scoped>
.profile {
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
</style>
