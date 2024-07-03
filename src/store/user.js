import { reactive } from 'vue';
import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', () => {
  let userList = reactive([
    {
      id: 220812021,
      userName: '杨欢',
      age: 17
    },
    {
      id: 220812019,
      userName: '高亚',
      age: 19
    },
    {
      id: 220812009,
      userName: '张菲',
      age: 16
    },
    {
      id: 220812022,
      userName: '刘淑文',
      age: 17
    },
    {
      id: 220812008,
      userName: '蔡欣怡',
      age: 19
    },
    {
      id: 220812030,
      userName: '龙依',
      age: 18
    }
  ]);
  
  const setUserList = (newList) => {
    userList = newList;
  };

  return {
    userList,
    setUserList
  };
});