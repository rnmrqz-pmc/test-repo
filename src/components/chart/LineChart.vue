<script setup lang="ts">
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale } from "chart.js";
import { Line } from "vue-chartjs";
import { defineProps, computed } from "vue";

// Register Chart.js modules
ChartJS.register(Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale);

// Props
const props = defineProps<{
  labels: string[];
  values: number[];
  label?: string;
  borderColor?: string;
  backgroundColor?: string;
}>();

// Chart Data
const chartData = computed(() => ({
  labels: props.labels,
  datasets: [
    {
      label: props.label ?? "Dataset",
      data: props.values,
      borderColor: "#1976D2",
      backgroundColor: "#42A5F5",
      fill: false,
      tension: 0,
    },
  ],
}));

// Chart Options
const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
  },
};
</script>

<template>
  <Line :data="chartData" :options="chartOptions" style="height: 290px !important; width: 100%;"/>
</template>
