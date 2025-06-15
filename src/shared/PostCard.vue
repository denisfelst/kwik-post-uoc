<template>
  <div class="post">
    <router-link :to="'/post/' + post?.id">
      <div v-if="withUserInfo" class="user-info">
        <router-link :to="'/profile/' + post?.user?.username">
          <img
            class="user-info__avatar"
            :src="post?.user?.profileImg"
            :alt="`profile img of ${post?.user?.username}`"
          />
        </router-link>

        <router-link :to="'/profile/' + post?.user?.username">
          <div class="user-info__user">
            <span>{{ post?.user?.name }} {{ post?.user?.surname }}</span>
            <span class="username">@{{ post?.user?.username }}</span>
          </div>
        </router-link>
      </div>
      <div class="post-detail">
        <p>{{ post?.content }}</p>
        <p class="time">
          {{ new Date(post?.publishDate).toLocaleString() }}
        </p>
      </div>
      <div class="interactions">
        <span class="icon">{{ post?.nLikes ?? "0" }} Likes</span
        ><span class="icon">{{ post?.nReplies ?? "0" }} Replies</span>
      </div>
    </router-link>
  </div>
</template>

<script setup>
import { onMounted } from "vue";

const props = defineProps({
  post: {
    type: Object,
    required: true,
    validator: (post) => {
      return post.id && post.content && post.publishDate;
    },
  },
  withUserInfo: {
    type: Boolean,
    required: false,
  },
});
</script>

<style scoped>
.post {
  display: flex;
  flex-direction: column;
  padding: 10px;
  background-color: #fff;
  position: relative;
  cursor: pointer;
  margin: 4px 8px;
}

.post:not(:last-child) {
  border-bottom: 1px solid #ddd;
  padding-bottom: 20px;
}

.post a {
  text-decoration: none;
  color: inherit !important;
}

.user-info {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.user-info__user {
  display: flex;
  flex-direction: column;
}

.user-info__user .username {
  font-size: 12px;
  color: #555;
}

.user-info__avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
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
</style>
