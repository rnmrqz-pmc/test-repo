<template>
    <div>
        <v-row class=" pa-0 ma-0" >
            <v-col cols="12" lg="7" md="6" sm="6" class="pa-0 ma-0 d-flex">
                <v-icon size="30" class="align-self-center me-1">mdi-bookmark</v-icon>
                <h3 class="align-self-center">{{ tableTitle }}</h3>
            </v-col>
            <v-col cols="12" lg="5" md="6" sm="6"
            class="d-flex justify-end px-0">
                <v-select 
                    v-model="localRowLimit"
                    :items="[10,20,50,100,500]"
                    variant="outlined"
                    color="black"
                    class="me-2 white-input"
                    max-width="100"
                    density="comfortable"
                    hide-details="auto"
                    rounded="large"
                    ></v-select>
                <v-text-field v-model="localSearch"
                    variant="outlined" 
                    color="black" 
                    class="white-input me-1" 
                    density="comfortable"
                    hide-details="auto" 
                    placeholder="Search" 
                    prepend-inner-icon="mdi-magnify"
                    rounded="large"/>
                <v-btn v-if="permission.includes('add')" @click="addButton"
                    class="mx-1 text-white align-self-center" icon color="green-darken-2">
                    <v-icon size="30">mdi-plus</v-icon>
                </v-btn>
            </v-col>
        </v-row>
        <v-card class="pb-2 globalRadius" variant="elevated" elevation="2">
            <v-data-table class="CustomTable"
                :headers="tableHeaders"
                :items="tableItems"
                :items-per-page="props.limit"
                :page="props.page"
                :hide-default-footer="true" 
                :loading="tableBusy" color="red"
                >
                <template v-slot:item.title="{ item }">
                    <div class="d-flex align-center nowrap">
                        {{ (item as any).title }}
                    </div>
                </template>
                <template v-slot:item.start_date="{ item }">
                    <div class="d-flex align-center nowrap">
                        {{ (item as any).start_date }}
                    </div>
                </template>
                <template v-slot:item.end_date="{ item }">
                    <div class="d-flex align-center nowrap">
                        {{ (item as any).end_date }}
                    </div>
                </template>
                <template v-slot:item.actions="{ item }">
                    <v-tooltip text="Edit" location="top" 
                    v-if="permission.includes('edit') && (item.training_status == 'Planned' || !(new Date(item.start_date) <= new Date()) ) 
                    && !(item.training_status == 'Completed' || item.training_status == 'Cancelled')">
                        <template v-slot:activator="{ props }">
                            <v-btn @click="edit(item)" class="align-self-center mx-1 text-black" color="grey-lighten-1" 
                            density="compact" rounded="pill" min-width="20px" v-bind="props">
                                <v-icon size="small">mdi-pencil</v-icon>
                            </v-btn>
                        </template>
                    </v-tooltip>
                   <v-tooltip text="View" location="top" 
                   v-if="permission.includes('view') && (item.training_status == 'Completed' || item.training_status == 'Cancelled')">
                        <template v-slot:activator="{ props }">
                            <v-btn @click="view(item)" class="align-self-center mx-1" color="blue-accent-4"
                            density="compact" rounded="pill" min-width="20px" v-bind="props">
                                <v-icon size="small">mdi-eye</v-icon>
                            </v-btn>
                        </template>
                    </v-tooltip>
                    <v-tooltip text="Complete" location="top" 
                    v-if="permission.includes('complete') && (item.training_status == 'On-Going' && new Date(item.start_date) <= new Date())">
                        <template v-slot:activator="{ props }">
                            <v-btn @click="complete(item)" class="align-self-center mx-1 text-white" color="green-accent-4"
                            density="compact" rounded="pill" min-width="20px" v-bind="props">
                                <v-icon size="16">mdi-calendar-check</v-icon>
                            </v-btn>
                        </template>
                    </v-tooltip>
                     <v-tooltip text="Remove" location="top" v-if="permission.includes('remove') && item.training_status != 'Completed'">
                        <template v-slot:activator="{ props }">
                            <v-btn @click="remove(item)" class="align-self-center mx-1" color="red-darken-2"
                            density="compact" rounded="pill" min-width="20px" v-bind="props">
                                <v-icon size="small">mdi-delete</v-icon>
                            </v-btn>
                        </template>
                    </v-tooltip>
                     <v-tooltip text="Cancel" location="top" v-if="permission.includes('cancel') && (item.training_status == 'Planned' || item.training_status == 'On-Going')">
                        <template v-slot:activator="{ props }">
                            <v-btn @click="cancel(item)" class="align-self-center mx-1" color="red-darken-2"
                            density="compact" rounded="pill" min-width="20px" v-bind="props">
                                <v-icon size="small">mdi-cancel</v-icon>
                            </v-btn>
                        </template>
                    </v-tooltip>
                </template>
                <template v-slot:item.training_status="{ item }">
                    <b v-if="item.training_status == 'Planned'" class="text-blue-darken-4">Planned</b>
                    <b v-if="item.training_status == 'On-Going'" class="text-orange">On-Going</b>
                    <b v-if="item.training_status == 'Completed'" class="text-green-darken-3">Completed</b>
                    <b v-if="item.training_status == 'Cancelled'" class="text-red">Cancelled</b>
                </template>
            </v-data-table>
             <v-pagination
                v-model="localPage" variant="flat"
                :length="Math.ceil(props.dataCount / props.limit)"
                :total-visible="7" color="grey" active-color="blue-accent-4" 
            ></v-pagination>
        </v-card>
    </div>
</template>

<script lang="ts" setup>
import { ref, computed, setTransitionHooks } from 'vue'

const props = defineProps<{
    tableTitle: String,
    tableHeaders: Array<any>,
    tableItems: Array<any>,
    tableBusy: boolean,
    permission: Array<any>,
    search: any,
    limit: any,
    page: any,
    dataCount: any
}>()

const tableSearch = ref('')

const tableDetails = ref({
    search: '',
    page: 1,
    itemsPerPage: 10
})

interface Emits {
  (e: 'update:limit', value: number): void
  (e: 'update:page', value: number): void
  (e: 'update:search', value: string): void
  (e: 'add', value: any): void
  (e: 'view', value: any): void
  (e: 'edit', value: any): void
  (e: 'remove', value: any): void
  (e: 'cancel', value: any): void
  (e: 'complete', value: any): void

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

const computedItems = computed(() => {
    const start = (tableDetails.value.page - 1) * tableDetails.value.itemsPerPage
    const items = props.tableItems.slice(start, start + tableDetails.value.itemsPerPage)
    return items
})



// const emit = defineEmits(['add', 'view', 'edit', 'remove', 'complete'])

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
function cancel(item: any){
    emit('cancel', item)
}
function complete(item: any){
    emit('complete', item)
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
</style>
