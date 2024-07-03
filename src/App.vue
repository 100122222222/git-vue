<script setup>
import { ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useUserStore } from '@/store/user';
// import { useMouse } from "@/utils/hooks";

const userStore = useUserStore();
// 此时userStore 并不是响应式数据 需要变成响应式的
const { name } = storeToRefs(userStore);
// 方法不需要是响应式的 storeToRefs 不会去处理方法 需要去userStore结构
const { updateName } = userStore;
</script>

<template>
    <div class="nav-wrapper">
      <div
        class="mr-10"
        :class="{active: type === item}"
        v-for="(item, index) in ['base', 'list','model','cc']"
        :key="`nav_${index}`"
        @click="type = item"
      >
        <RouterLink :to="`/${item}`">{{item}}</RouterLink>
      </div>
    </div>
  <main>
    <router-view />
  </main>
</template>

<style scoped>
.mr-10 {
  display: inline-block;
  margin-right: 10px;
}
.nav-wrapper {
  height: 64px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgb(115, 139, 199);
  /* border-bottom: 1px solid rgba(0, 0, 0, 0.4); */
}
</style>
