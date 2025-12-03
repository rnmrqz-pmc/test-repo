<template>
    <div>
        <v-row class=" py-3 ma-0" >
            <v-col class="py-0 px-1 ma-0" cols="4" sm="1">
                <v-select 
                v-model="localRowLimit"
                :items="[10,20,50,100,500]"
                variant="outlined"
                color="black"
                class="mb-1 white-input"
                density="comfortable"
                :hide-details="true"
                rounded="large"
                ></v-select>
            </v-col>
            <v-col class="py-0 px-1 ma-0" cols="8" sm="4">
                <v-text-field v-model="localSearch"
                variant="outlined" 
                color="black" 
                class="white-input" 
                density="comfortable"
                :hide-details="true" 
                placeholder="Search" 
                prepend-inner-icon="mdi-magnify"
                rounded="large"/>
            </v-col>
            <v-col class="py-0 px-1 ma-0" cols="12" sm="2">
                <v-autocomplete v-model="filterModel.role"
                :items="filterRoles"
                variant="outlined"
                color="black"
                class="mb-1 white-input"
                density="comfortable"
                :hide-details="true"
                rounded="large"
                prepend-inner-icon="mdi-account"
                ></v-autocomplete>
            </v-col>
            <v-col class="py-0 px-1 ma-0" cols="10" sm="2">
                <v-autocomplete v-model="filterModel.status"
                :items="['All', 'Active', 'Inactive']"
                variant="outlined"
                color="black"
                class="mb-1 white-input"
                density="comfortable"
                :hide-details="true"
                rounded="large"
                prepend-inner-icon="mdi-list-status"
                ></v-autocomplete>
            </v-col>
    
            <v-col cols="2" sm="3"
            class="d-flex justify-end pa-0 ma-0">
                <v-btn v-if="permission.includes('add')" @click="addButton"
                    class="mx-1 text-white align-self-center" icon color="green-darken-2">
                    <v-icon size="30">mdi-plus</v-icon>
                </v-btn>
            </v-col>
        </v-row>
        <v-card class="pb-2 globalRadius" variant="elevated" elevation="2">
            <v-data-table class="CustomTable"
                :headers="tableHeaders"
                :items="computedItems"
                :items-per-page="props.limit"
                :page="props.page"
                :hide-default-footer="true" 
                :loading="tableBusy" color="red"
                >
                <template v-slot:item.name="{ item }">
                    <div class="d-flex align-center nowrap">
                        {{ (item as any).name }}
                    </div>
                </template>
                <template v-slot:item.actions="{ item }">
                    <div class="d-flex justify-center">                    
                    <v-tooltip text="Edit" location="top" v-if="permission.includes('edit')">
                        <template v-slot:activator="{ props }">
                            <v-btn @click="edit(item)" class="align-self-center mx-1 text-black" color="grey-lighten-1" 
                            density="compact" rounded="pill" min-width="20px" v-bind="props">
                                <v-icon size="small">mdi-pencil</v-icon>
                            </v-btn>
                        </template>
                    </v-tooltip>
                   <v-tooltip text="View" location="top" v-if="permission.includes('view')">
                        <template v-slot:activator="{ props }">
                            <v-btn @click="view(item)" class="align-self-center mx-1" color="blue-accent-4"
                            density="compact" rounded="pill" min-width="20px" v-bind="props">
                                <v-icon size="small">mdi-eye</v-icon>
                            </v-btn>
                        </template>
                    </v-tooltip>
                    <v-tooltip text="Complete" location="top" v-if="permission.includes('complete')">
                        <template v-slot:activator="{ props }">
                            <v-btn @click="complete(item)" class="align-self-center mx-1 text-white" color="green-accent-4"
                            density="compact" rounded="pill" min-width="20px" v-bind="props">
                                <v-icon size="16">mdi-calendar-check</v-icon>
                            </v-btn>
                        </template>
                    </v-tooltip>
                     <v-tooltip text="Remove" location="top" v-if="permission.includes('remove')">
                        <template v-slot:activator="{ props }">
                            <v-btn @click="remove(item)" class="align-self-center mx-1" color="red-darken-2"
                            density="compact" rounded="pill" min-width="20px" v-bind="props">
                                <v-icon size="small">mdi-delete</v-icon>
                            </v-btn>
                        </template>
                    </v-tooltip>
                    <slot :customItem="item" name="header"></slot>
                    </div>
                </template>
                <template v-slot:item.status="{ item }">
                    <v-chip class="text-white" size="small"
                    :color="ChipStatus[(item.status)].color" rounded="pill" variant="elevated">
                        {{ ChipStatus[(item.status)].text }}
                    </v-chip>
                </template>
            </v-data-table>
            <v-row class="pa-0 ma-0">
                <v-col class="pa-0 ma-0" cols="12" sm="2">

                </v-col>
                 <v-col class="d-flex justify-center pa-0 ma-0" cols="12" sm="8">
                    <v-pagination
                        v-model="localPage" variant="flat"
                        :length="filterModel.role != 'All' || filterModel.status != 'All' ? Math.ceil(computedItems.length / localRowLimit) : Math.ceil(props.dataCount / props.limit)"
                        :total-visible="7" color="grey" active-color="blue-accent-4" 
                    ></v-pagination>
                </v-col>
                 <v-col class="d-flex pa-0 ma-0" :class="mx.isDesktop ? 'justify-center' : 'justify-end'" cols="12" md="2">
                    <!-- <v-btn v-if="props.role != 'supervisor'" @click="exportCSV()" class="mx-4 align-self-center" variant="outlined" height="38">
                        <v-icon size="20" class="align-self-center me-1">mdi-download</v-icon>
                        Export
                    </v-btn> -->
                </v-col>
            </v-row>
            <div class="d-flex justify-space-between">
                <span style="width: 120px;"/>               
            </div>
        </v-card>
    </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { useMXStore } from '@/stores/mx';

const mx = useMXStore();

const props = defineProps<{
    tableTitle: String,
    tableHeaders: Array<any>,
    tableItems: Array<any>,
    tableBusy: boolean,
    permission: Array<any>,
    search: any,
    limit: any,
    page: any,
    dataCount: any,
    role: any
}>()


const filterModel = ref<any>({ 
    role: 'All',
    status: 'All'
})

const ChipStatus : any = ref({
    '0': { text: 'Inactive', color: 'red' },
    '1': { text: 'Active', color: 'green' },
    '2': { text: 'Resigned', color: 'yellow' },
    '3': { text: 'Terminated', color: 'red' },
    '4': { text: 'Retired', color: 'black' },
    '5': { text: 'Hidden', color: 'black' }, 
})

interface Emits {
  (e: 'update:limit', value: number): void
  (e: 'update:page', value: number): void
  (e: 'update:search', value: string): void
  (e: 'add', value: any): void
  (e: 'view', value: any): void
  (e: 'edit', value: any): void
  (e: 'remove', value: any): void
  (e: 'complete', value: any): void
  (e: 'export', value: any): void

}
const emit = defineEmits<Emits>()

const localRowLimit = computed({
  get: () => props.limit,
  set: (value: number) => emit('update:limit', value)
})

const localPage = computed({
  get: () => props.page,
  set: (value: number) => emit('update:page', value)
})

const localSearch = computed({
  get: () => props.search,
  set: (value: string) => emit('update:search', value)
})

const filterRoles = computed(() => {
    if(props.role == 'admin'){
        return ['All', 'Admin', 'Manager', 'Supervisor', 'Trainer']
    } else if(props.role == 'manager'){
        return ['All', 'Manager', 'Supervisor', 'Trainer']
    } else {
        return ['All', 'Supervisor', 'Trainer']
    }
})

const computedItems = computed(() => {
    let items = props.tableItems
    if(filterModel.value.role != 'All'){
        items = items.filter((item: any) => item.role == filterModel.value.role)
    }
    if(filterModel.value.status != 'All'){
        let stat = filterModel.value.status == 'Active' ? 1 : 0
        items = items.filter((item: any) => item.status == stat)
    }
    return items
})





function addButton(item: any){
    emit('add', item)
}

function view(item: any){
    emit('view', item)
}

function edit(item: any){
    emit('edit', item)
}

function remove(item: any){
    emit('remove', item)
}
function complete(item: any){
    emit('complete', item)
}

function exportCSV(){
    emit('export', computedItems.value)
}

</script>

<style>
.CustomTable div table thead{
    background-color: var(--color-primary) !important;
}
.CustomTable div table thead tr th div span{
    /* color: white !important; */
    color: white;
    font-weight: 800;
}
.CustomTable div table thead tr th div{
    justify-content: center !important;
}
</style>
