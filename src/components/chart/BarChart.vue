<template>
  <div class="h-full" style="width: 100%; height: 100%;">
    <Bar
      :id="chartId"
      :data="data"
      :options="options"
      :width="width"
      :height="height"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { Bar } from "vue-chartjs";
import type { ChartData, ChartOptions } from "chart.js";

interface Dataset {
  label: string;
  data: number[];
  backgroundColor?: string | string[];
  borderColor?: string | string[];
  borderWidth?: number;
  fill?: boolean;
}

interface Props {
  chartId?: string;
  width?: number;
  height?: number;
  labels: string[];
  datasets: Dataset[];
  options?: ChartOptions<"bar">;
}

const props = withDefaults(defineProps<Props>(), {
  chartId: "bar-chart",
  width: 600,
  height: 300,
  options: () => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "bottom" },
      title: { display: false, text: "" },
    },
    scales: {
      x: { grid: { display: false } },
      y: { beginAtZero: true },
    },
  }),
});

const data = computed<ChartData<"bar">>(() => ({
  labels: props.labels,
  datasets: props.datasets,
}));
</script>
