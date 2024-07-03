import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import router from './router';
import pinia from './store';
import Antd from 'ant-design-vue';
import "ant-design-vue/dist/reset.css"
// import "./tailwindcss.css"

createApp(App).use(Antd).use(pinia).use(router).mount('#app');
