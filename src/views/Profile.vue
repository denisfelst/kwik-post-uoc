<template>
  <div class="profile">
    <div v-if="isLoadingMore">Loading posts...</div>

    <div v-else-if="error">{{ error }}</div>

    <div v-else>
      <template v-if="profile">
        <div class="user-info">
          <div class="user-info__avatar">
            <img :src="profile.profileImg" alt="profile picture of user" />
          </div>

          <div class="user-info__fullname">
            <span>{{ profile.name }} {{ profile.surname }}</span>
          </div>

          <div class="user-info__username">
            <span>@{{ profile.username }}</span>
          </div>

          <div class="user-info__bio">
            <span
              >Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Quisquam, quos.</span
            >
          </div>

          <div class="user-info__join-date">
            <span
              >Joined in
              {{
                new Date(authStore.user.registrationDate).toLocaleString(
                  "en-US",
                  {
                    month: "long",
                    year: "numeric",
                  }
                )
              }}</span
            >
          </div>

          <div
            class="btn load-more logout-btn"
            v-if="route.params.username === authStore.user?.username"
          >
            <button @click="handleLogout">Logout</button>
          </div>
        </div>

        <div class="posts">
          <PostCard
            v-for="post in posts"
            :key="post.id"
            :post="post"
            :with-user-info="false"
          />

          <button
            v-if="hasMorePosts"
            @click="loadPosts"
            :disabled="isLoadingMore"
            class="btn load-more"
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
import { useRoute, useRouter } from "vue-router";
import api from "../api/axios";
import { useAuthStore } from "../stores/auth";
import PostCard from "../shared/PostCard.vue";

const limit = 10;

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const profile = ref(null); // user
const posts = ref([]);
const offset = ref(0);
const isLoadingMore = ref(false);
const hasMorePosts = ref(true);
const totalPosts = ref(0);
const error = ref(null);

const loadUser = async () => {
  try {
    const { data } = await api.get(`/user/${route.params.username}`);
    profile.value = data;
  } catch (err) {
    console.error("Error loading user: ", err);
    error.value = "Failed to load user. Please try again.";
  }
};

const resolveData = async (data) => {
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
};

const loadPosts = async () => {
  if (isLoadingMore.value) return;

  isLoadingMore.value = true;

  try {
    const { data } = await api.get(
      `/user/${route.params.username}/posts?limit=${limit}&offset=${offset.value}`
    );
    await resolveData(data);
  } catch (err) {
    error.value = "Failed to load more posts. Please try again.";
  } finally {
    isLoadingMore.value = false;
    offset.value += limit;
    hasMorePosts.value = posts.value.length < totalPosts.value;
  }
};

const handleLogout = () => {
  console.log("logout");
  authStore.logout();
  router.push("/");
};

onMounted(() => {
  loadUser();
  loadPosts();
});
</script>

<style scoped>
/******************************* POST *******************************/

.post {
  display: flex;
  flex-direction: column;
  padding: 10px;
  background-color: #fff;
  position: relative;
  cursor: pointer;
  margin: 4px 8px;
}

.post a {
  text-decoration: none;
  color: inherit !important;
}

.post-detail {
  margin-bottom: 10px;
}

.post-detail p {
  margin: 0;
  font-size: 14px;
}

.post-detail .time {
  font-size: 12px;
}

.interactions {
  display: flex;
  justify-content: flex-start;
  gap: 10px;
}

.interactions .icon {
  font-size: 12px;
  color: #555;
}

/******************************* PAGINATED POSTS LIST *******************************/

.posts-list {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.post {
  margin-top: 10px;
}

.post:not(:last-child) {
  border-bottom: 1px solid #ddd;
  padding-bottom: 20px;
}

.btn.load-more {
  margin: 10px auto;
  min-width: 200px;
  text-align: center;
}

.btn.logout-btn {
  background-color: #aa0000;
  color: #fff;
}

/******************************* PROFILE VIEW *******************************/

.user-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  align-items: center;
  width: 100%;
  padding-bottom: 10px;
  border-bottom: 1px solid #ddd;
  position: relative;
}

.user-info__fullname {
  font-weight: 600;
}

.user-info__username {
  font-size: 12px;
  color: #555;
}

.user-info__bio {
  font-size: 14px;
  font-weight: 500;
  color: #222;
}

.user-info__join-date {
  font-size: 12px;
  color: #555;
}

.user-info__avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  overflow: hidden;
}
.user-info__avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
