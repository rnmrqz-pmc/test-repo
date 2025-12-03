<template>
  <v-container class="pa-0">
    <v-row class="pa-0 ma-0">
      <v-col class="pa-0 ma-0" cols="12" >
        <v-menu
          v-model="menu"
          :close-on-content-click="false"
          transition="scale-transition"
          offset-y
        >
          <template v-slot:activator="{ props }">
            <v-text-field
              v-bind="props"
              v-model="dateTimeFormatted" 
              readonly variant="outlined" :density="props.density as any || 'comfortable'"
              append-inner-icon="mdi-calendar-clock"
            />
          </template>

          <v-card style="max-width: 332px;">
            <!-- Step 1: Date Picker -->
            <v-date-picker
              v-if="!stepTime"
              v-model="selectedDate"
              @update:modelValue="goToTime"
              :hide-header="false"
            />

            <!-- Step 2: Time Picker -->
            <v-time-picker
              v-else
              v-model="selectedTime"
              format="24hr"
            />

            <v-divider></v-divider>

            <v-card-actions>
              <v-spacer></v-spacer>

              <!-- Back button shown in time picker step -->
              <v-btn
                v-if="stepTime"
                text
                @click="stepTime = false"
              >
                <v-icon size="25">mdi-chevron-left</v-icon>
              </v-btn>

              <v-btn text @click="reset">Cancel</v-btn>

              <v-btn
                v-if="stepTime"
                text
                color="primary"
                @click="saveDateTime"
              >
                OK
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-menu>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";

const props = defineProps<{
    modelValue?: string,
    density?: string,
    label?: string
}>()
const returnValue = ref<any>("");

const emit = defineEmits(["update:modelValue"]);

const menu = ref(false);
const selectedDate = ref<any>(null);
const selectedTime = ref<any>(null);
const dateTimeFormatted = ref("");
const stepTime = ref(false);

const goToTime = () => {
  stepTime.value = true; // move to time picker
};

const reset = () => {
  stepTime.value = false;
  selectedDate.value = null;
  selectedTime.value = null;
  menu.value = false;
};

const saveDateTime = () => {
  if (selectedDate.value && selectedTime.value) {
    dateTimeFormatted.value = `${selectedDate.value} ${selectedTime.value}`;

    returnValue.value = dateTimeFormatted.value;
    emit("update:modelValue", dateTimeFormatted.value);

    const date = new Date(selectedDate.value);
    const time = selectedTime.value.split(":");
    date.setHours(parseInt(time[0]));
    date.setMinutes(parseInt(time[1]));
    dateTimeFormatted.value = new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);

  }
  reset();
};

watch(
  () => props.modelValue,
  (val) => {
    returnValue.value = val;
  },
  { immediate: true }
);
</script>
