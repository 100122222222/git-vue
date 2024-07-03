<template> 
<div class="container">
    <canvas ref="canvasRef" class="canvas"></canvas>
    <div class="sidebar">
      <div class="chart-box" ref="chartRef1"></div>
      <div class="chart-box" ref="chartRef2"></div>
    </div>  
    <div class="sidebar">
      <div class="chart-box" ref="chartRef3"></div>
      <div class="chart-box" ref="chartRef4"></div>
    </div>
  </div>  
    <!-- <canvas ref="canvasRef" style="width: 100%; height: 100vh;"></canvas> -->
</template>
  
<script setup>
import { ref, onMounted } from 'vue';
import * as BABYLON from '@babylonjs/core';
import '@babylonjs/loaders';
import earcut from 'earcut';
import * as echarts from 'echarts';
import { storeToRefs } from 'pinia';
import { useUserStore } from '@/store/user';
// 导入 Message 组件
import { message } from 'ant-design-vue';

const userStore = useUserStore();
const { userList } = storeToRefs(userStore);

const canvasRef = ref(null);
const chartRef1 = ref(null);
const chartRef2 = ref(null);
const chartRef3 = ref(null);
const chartRef4 = ref(null);

const initEngine = async () => {
    if (canvasRef.value) {
        const engine = new BABYLON.Engine(canvasRef.value, true);
        const scene = new BABYLON.Scene(engine);
  
        // 创建镜头
        const camera = new BABYLON.ArcRotateCamera(
            'camera',
            BABYLON.Tools.ToRadians(45),
            BABYLON.Tools.ToRadians(45),
            1,
            BABYLON.Vector3.Zero(),
            scene
        );
  
        camera.attachControl(canvasRef.value, true);
        camera.position = new BABYLON.Vector3(0, 1, -1);

        // 加载模型
        BABYLON.SceneLoader.Append("/model/", "library_draco.glb", scene, (scene) => {
        // 调整模型的位置或缩放以适应镜头视角
        scene.createDefaultCameraOrLight(true, true, true);
        });
        
        const light = new BABYLON.DirectionalLight(
            'light',
            new BABYLON.Vector3(0, -1, 0),
            scene
        );
        light.position = new BABYLON.Vector3(10, 10, 10);
        light.intensity = 2;
        // light.diffuse=new BABYLON.Color3(1, 0.84, 0.66); // 暖黄色光源
        
        engine.runRenderLoop(() => {
            scene.render();
        });
    
        window.addEventListener('resize', () => {
            engine.resize();
        });
    }
};

const initBarChart = (element) => {
  const myChart = echarts.init(element);
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

const initPieChart = (element) => {
  const myChart = echarts.init(element);
  const ageCount = {};
  userList.value.forEach(user => {
    if (ageCount[user.age]) {
      ageCount[user.age]++;
    } else {
      ageCount[user.age] = 1;
    }
  });
  
  const data = Object.keys(ageCount).map(age => ({
    name: age,
    value: ageCount[age]
  }));
  
  const option = {
    series: [{
      type: 'pie',
      data: data
    }]
  };
  myChart.setOption(option);
   // 添加点击事件处理
    myChart.on('click', (params) => {
        const age = params.name; // 获取点击的年龄
        const count = params.value; // 获取点击的人数

        // 显示年龄和人数信息
        message.info({
            content: `年龄：${age}岁，人数：${count}人`,
            duration: 1 // 显示1秒后自动关闭
        });
    });
};

const initLineChart = (element) => {
  const myChart = echarts.init(element);
  const ageCount = {};
  userList.value.forEach(user => {
    if (ageCount[user.age]) {
      ageCount[user.age]++;
    } else {
      ageCount[user.age] = 1;
    }
  });

  const data = Object.keys(ageCount).map(age => ({
    name: `${age}岁`,
    value: ageCount[age]
  }));

  const option = {
    xAxis: {
      type: 'category',
      data: Object.keys(ageCount).map(age => `${age}岁`) // 横坐标改为年龄
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: '{value}人' // 纵坐标显示单位为人
      }
    },
    series: [{
      data: Object.values(ageCount),
      type: 'line'
    }]
  };
  myChart.setOption(option);
  // 添加点击事件处理
  myChart.on('click', (params) => {
    const age = params.name; // 获取点击的年龄
    const count = params.value; // 获取点击的人数

    // 显示年龄和人数信息
    message.info({
      content: `年龄：${age}，人数：${count}人`,
      duration: 1 // 显示1秒后自动关闭
    });
  });
};

const initScatterChart = (element) => {
  const myChart = echarts.init(element);
  const ageCount = {};
  userList.value.forEach(user => {
    if (ageCount[user.age]) {
      ageCount[user.age]++;
    } else {
      ageCount[user.age] = 1;
    }
  });

  const data = Object.keys(ageCount).map(age => ({
    name: `${age}岁`,
    value: [age, ageCount[age]]
  }));

  const option = {
    xAxis: {
      type: 'value',
      axisLabel: {
        formatter: '{value}岁' // 横坐标显示单位为岁
      }
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: '{value}人' // 纵坐标显示单位为人
      }
    },
    series: [{
      data: data,
      type: 'scatter'
    }]
  };
  myChart.setOption(option);
  // 添加点击事件处理
  myChart.on('click', (params) => {
    const age = params.name; // 获取点击的年龄
    const count = params.value[1]; // 获取点击的人数，散点图的 value 是一个数组 [x, y]

    // 显示年龄和人数信息
    message.info({
      content: `年龄：${age}，人数：${count}人`,
      duration: 1 // 显示1秒后自动关闭
    });
  });
};

onMounted(() => {
    initEngine();
    if (chartRef1.value) {
        initBarChart(chartRef1.value);
    }
    if (chartRef2.value) {
        initPieChart(chartRef2.value);
    }
    if (chartRef3.value) {
        initLineChart(chartRef3.value);
    }
    if (chartRef4.value) {
        initScatterChart(chartRef4.value);
    }  
});
</script>
  
<style scoped>
    /* canvas {
        display: block;
    } */
.container {
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: 100vh;
  position: relative;
}

.sidebar {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  width: 20%;
  padding: 10px;
  box-sizing: border-box;
  z-index: 1; /* 确保侧栏在canvas之上 */
}

.chart-box {
  width: 100%;
  height: 45%;
  display: flex;
  justify-content: center;
  align-items: center;
  /* background-color: #fff; */
  border: 1px solid #dcdcdc;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0; /* 确保canvas在最底层 */
}
</style>  