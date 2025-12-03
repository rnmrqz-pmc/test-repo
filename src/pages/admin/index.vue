<template>
    <div class="pa-4">
        <TrainingTable 
        :tableTitle="'User List'"
        :tableHeaders="tableHeaders" 
        :tableItems="tableItems" 
        :tableBusy="false"
        :permission="['add','view','edit','remove']"
        @add="addButton"
        />
        <v-btn class="mx-1 --bg-main text-white"  width="120" rounded="pill" @click="alertButton">Enroll</v-btn>
        <v-dialog v-model="dialog.status" max-width="600" :persistent="true">
            <v-card class="pa-4 bg-white" variant="tonal"  >
                <v-card-title class="pa-2 ma-0 font-weight-bold ">User Enrollment</v-card-title>    
                <v-card-text class="pa-2">
                    <v-text-field v-model="dialog.data.employeeNo"
                    label="Employee No." 
                    variant="outlined" 
                    color="black" 
                    class="" 
                    density="comfortable"
                    placeholder="Enter your employee no"/>
                     <v-text-field v-model="dialog.data.name"
                    label="Name" 
                    variant="outlined" 
                    color="black" 
                    class="" 
                    density="comfortable"/>
                     <v-text-field v-model="dialog.data.team"
                    label="Team" 
                    variant="outlined" 
                    color="black" 
                    class="" 
                    density="comfortable"/>
                     <v-text-field v-model="dialog.data.position"
                    label="Position" 
                    variant="outlined" 
                    color="black" 
                    class="" 
                    density="comfortable"/>
                     <v-text-field v-model="dialog.data.email"
                    label="Email" 
                    variant="outlined" 
                    color="black" 
                    class="" 
                    density="comfortable"/>
                    <v-autocomplete v-model="dialog.data.userTypeID"
                        label="User Type"
                        variant="outlined"
                        color="black"
                        class=""
                        density="comfortable"
                        :items="['Admin', 'User']"
                    ></v-autocomplete>
                </v-card-text>
                {{ dialog.data }}
                <v-card-actions class="d-flex justify-end pa-0">
                    <v-btn @click="close_dialog" variant="outlined" 
                    color="black" class="mx-1" width="120" rounded="pill">Cancel</v-btn>
                    <v-btn class="--bg-main text-white"  width="120" rounded="pill">Enroll</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script lang="ts" setup>
import { ref, getCurrentInstance, onBeforeMount } from 'vue'
import type { DataTableHeader } from 'vuetify'
import TrainingTable from '@/components/TrainingTable.vue'
import { useAlertStore } from "@/stores/alert";

const alertStore = useAlertStore();

const { proxy } = getCurrentInstance()!

interface TMS_USERS {
  ID: number
  name: string
  team: string
  position: string
  email: string
  UserType: string
  registered_on: string
  enrolled_on: string
  enrolled_by: string
  status: string
}
const tableItems = ref<TMS_USERS[]>([])

const tableHeaders: DataTableHeader<TMS_USERS>[] = [
  { title: 'ID', key: 'ID', align: 'start', sortable: true },
  { title: 'Name', key: 'name', align: 'start', sortable: true },
  { title: 'Team', key: 'team', align: 'start', sortable: true },
  { title: 'Position', key: 'position', align: 'start', sortable: true },
//   { title: 'Email', key: 'email', align: 'start', sortable: true },
  { title: 'User Type', key: 'UserType', align: 'start', sortable: true },
  { title: 'Status', key: 'status', align: 'center', sortable: false },
  { title: 'Actions', key: 'actions', align: 'center', sortable: false },
]

const tableSearch = ref<string>('')

const dialog = ref({
  status: false,
  data: {
    employeeNo: '',
    username: '',
    name: '',
    team: '',
    position: '',
    email: '',
    userTypeID: ''
  }
})

function alertButton(){
  alertStore.showAlert("success", '', "Operation completed successfully!", true);
}







// Functions
async function getUsers(){
  try {
    const res = await proxy!.$api.masterselect({
        database: "tms_admin",
        table: 'users_view'
    })
    let result = res.data
    // items.value = result
    tableItems.value = result
    
  } catch (error) {
    console.log(error) 
  }
}

function addButton() {
  dialog.value.status = true
  dialog.value.data = {
    employeeNo: '',
    username: '',
    name: '',
    team: '',
    position: '',
    email: '',
    userTypeID: ''
  }
}
function close_dialog() {
  dialog.value.status = false   
}


// Initialization
onBeforeMount(() => {
  getUsers()
})


</script>
