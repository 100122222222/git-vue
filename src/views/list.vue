<template>
  <div class="list_comp">
    <a-typography-title class="title" :level="2">同学列表</a-typography-title>
    <div class="tool_tab">
      <a-button class="add_btn" style="margin-bottom: 8px" type="primary" @click="addUser">新增</a-button>
    </div>
    <a-table class="list" bordered :columns="columns" :dataSource="userList">
      <template #bodyCell="{ column, record, index }">
        <template v-if="column.key === 'index'">
        <a>{{ index + 1 }}</a>
      </template>
        <template v-else-if="column.key === 'operation'">
        <!-- <span class="flex grow justify-around"> -->
        <a-space>
          <a-button type="primary" block @click="editUser(index)">编辑</a-button>
          <a-button danger block @click="deleteUser(index)">删除</a-button>         
          <a-button block @click="getYourName(record.id)">点名</a-button>
        </a-space>
        <!-- </span> -->
      </template>
    </template>
    </a-table>
    <a-modal v-model:open="showFlag" @cancel="cancelFn" @ok="submitFn" okText="确定" cancelText="取消"
            :title="isEdit ? '编辑同学' : '新增同学'">
            <a-input v-model:value="studyNum" placeholder="请输入学号" style="width: 450px;margin: 10px;"/>
            <a-input v-model:value="name" placeholder="请输入姓名" style="width: 450px;margin: 10px;">
                <template #prefix>
                    <user-outlined />
                </template>
                <template #suffix>
                    <a-tooltip title="Extra information">
                        <info-circle-outlined style="color: rgba(0, 0, 0, 0.45)" />
                    </a-tooltip>
                </template>
            </a-input>
            <a-input-number  v-model:value="age" :min="1" :max="25" placeholder="请输入年龄" style="width: 450px;margin: 10px;">
                <template #upIcon>
                    <ArrowUpOutlined />
                </template>
                <template #downIcon>
                    <ArrowDownOutlined />
                </template>
            </a-input-number>
    </a-modal>
    <div class="echart" id="mychart" style="width: auto;height: 400px;"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useUserStore } from '@/store/user';
import { UserOutlined, InfoCircleOutlined,ArrowUpOutlined,ArrowDownOutlined } from '@ant-design/icons-vue'
const userStore = useUserStore();
const { userList } = storeToRefs(userStore);
import * as echarts from "echarts";

let showFlag = ref(false);
let isEdit = ref(false);
let curIdx = ref(0);

let studyNum = ref();
let name = ref('');
let age = ref();

let myChart;

const initEcharts = () => {
  const option = {
    xAxis: {
      type: 'category',
      data: userList.value.map(user => user.userName)
    },
    yAxis: {
      type: 'value'
    },
    series: [{
      data: userList.value.map(user => user.age),
      type: 'bar'
    }]
  };
  myChart.setOption(option);
};

onMounted(() => {
  myChart = echarts.init(document.getElementById('mychart'));
  initEcharts();
  window.addEventListener('resize', () => {
    myChart.resize();
  });
});

watch(userList, () => {
  initEcharts();
}, { deep: true });

const deleteUser = (index) => {
  userStore.userList.splice(index, 1);
};

const addUser = () => {
    isEdit.value = false;
    showFlag.value = true;
};

const editUser = (index) => {
    isEdit.value = true;
    curIdx.value = index;
    const item = userStore.userList[index];
    studyNum.value = item.id;
    name.value = item.userName;
    age.value = item.age;
    showFlag.value = true;
};

const checkList = (code) => {
    for (let index = 0; index < userStore.userList.length; index++) {
        const element = userStore.userList[index];
        if (Number(code) === element.id) {
            return true;
        }
    }
    return false;
};

const addNum2name = (name) => {
    // 将姓名后面追加最新编号
    let total = 0;
    userStore.userList.map((item) => {
        if (item.userName.indexOf(name) !== -1) {
            let tempItem = item;
            let tempItemName = tempItem.userName.split('');
            tempItemName.splice(0, name.length);
            let checkItem = isNum(tempItemName.join(''));
            if (tempItemName.length === 0 || checkItem) {
                total++;
            }
        }
    });
    return `${name}${total === 0 ? '' : total}`;
};

const isNum = (val) => {
    let exg = /^\d+$/;
    if (!exg.test(val)) {
        return false;
    }
    return true;
};

const submitFn = () => {
    // 输入内容校验
    let studyNumCheck = isNum(studyNum.value);
    if (!studyNumCheck) {
        alert('学号需要为纯数字');
        return;
    }
    let tempName = addNum2name(name.value);
    if (isEdit.value) {
        // 编辑
        userStore.userList.splice(curIdx.value, 1);
        tempName = name.value;
    }
    let isStudyNumExist = checkList(studyNum.value);
    if (isStudyNumExist) {
        alert('学号已存在');
        return;
    }
    userStore.userList.unshift({
        id: studyNum.value,
        userName: tempName,
        age: age.value,
    });
    showFlag.value = false;
    studyNum.value = 0;
    name.value = '';
    age.value = 0;
};

const cancelFn = () => {
    showFlag.value = false;
    studyNum.value = 0;
    name.value = '';
    age.value = 0;
}
const getYourName = (id) => {
  const student = userStore.userList.find(item => item.id === id);
  alert(student.userName);
};

const columns=[
  {
    title: '序号',
    dataIndex: 'index',
    key: 'index',
    align:'center'
  },
  {
    title: '学号',
    dataIndex: 'id',
    key: 'id',  
    align:'center'
  },
  {
    title: '姓名',
    dataIndex: 'userName',
    key: 'userName',
    align:'center'
  },
  {
    title: '年龄',
    dataIndex: 'age',
    key: 'age',
    align:'center'
  },
  {
    title: '操作',
    // dataIndex: 'operation',
    key: 'operation',
    align:'center'
  },
]
</script>

<style lang="less" scoped>
.list_comp{
  text-align: left;
  .title{
    text-align: center;
    margin-top:20px;
  }
}
.tool_tab{
  display: flex;
  justify-content: flex-end;
  .add_btn{
    background-color: #efefef;
    color: #000000;
    margin-right: 24px;
    width: 90px;
  }
}
.list{
  padding-left: 0;
  padding: 0 24px;
  text-align: center;
}
</style>
