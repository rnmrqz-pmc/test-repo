<script setup lang="ts">
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from "chart.js";
import { Pie } from "vue-chartjs";
import { defineProps, computed } from "vue";

// Register chart.js modules
ChartJS.register(Title, Tooltip, Legend, ArcElement);

// Props
const props = defineProps<{
  labels: string[];
  values: number[];
  colors?: string[];
}>();

// Build chart data
const chartData = computed(() => ({
  labels: props.labels,
  datasets: [
    {
      data: props.values,
      backgroundColor: props.colors ?? ["#9be67e", "#baff9e", "#00ad09", "#009c69", "#006e16"],
    },
  ],
}));

const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: "bottom" as const,
    },
  },
};
</script>

<template>
  <Pie :data="chartData" :options="chartOptions" 
  :key="props.values.join('-')" 
  style="height: 250px !important;"/>
</template>
