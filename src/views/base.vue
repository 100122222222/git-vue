<template>
<div class="base" style="display: flex;justify-content: center;">
  <a-card style="margin: 20px;border: 1px solid #000; width: 100%; max-width: 50%;">
    <a-typography-title style="margin-top: 20px;">欢迎访问学生列表</a-typography-title>
    <a-divider />
    <a-typography-title :level="2">学生名单</a-typography-title>
    <a-list item-layout="horizontal" :dataSource="userList">
      <template #renderItem="{ item }">
        <a-list-item>
          <a-list-item-meta>
            <template #avatar>
              <!-- <UserOutlined class="large-icon"/> -->
              <a-avatar src="/src/assets/icon.jpg" />
            </template>
            <template #title>
              <a href="javascript:void(0);">{{ item.userName }}</a>
            </template>
            <template #description>
              学号: {{ item.id }} 
              年龄: {{ item.age }}
            </template>
          </a-list-item-meta>
        </a-list-item>
      </template>
    </a-list>
    <a-divider />
  </a-card>
</div>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { useUserStore } from '../store/user';
// import { UserOutlined } from '@ant-design/icons-vue';
const userStore=useUserStore()
const {userList}=storeToRefs(userStore)

</script>

<style scoped>
/* .large-icon {
  font-size: 32px;
} */
</style>
