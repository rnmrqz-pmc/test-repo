<template>
    <div class="">
        <NoProfile v-if="!session.details" @goto="gotoProfile()" />
        <div v-else class="">
            <ComingSoon v-if="!moduleStat" />
            <div v-else class="px-5 py-2">
                <!-- Main Data Table -->
                <DataTable 
                    :tableTitle="'Training Activities'" 
                    :tableHeaders="tableData.headers" 
                    :tableItems="tableData.items" 
                    :tableBusy="tableData.loading"
                    :permission="getPermissions()"
                    :role="session.user.role"
                    v-model:search="tableData.search"
                    v-model:limit="tableData.limit"
                    v-model:page="tableData.page"
                    :dataCount="tableData.count"
                    @add="handleAdd"
                    @view="handleView"
                    @edit="handleEdit"
                    @delete="handleDelete"
                    @export="handleExport"
                >
                    <template v-if="session.user.role == 'admin'" #header="{ customItem }">
                        <v-tooltip :text="`Turn 2FA ${customItem.with_2fa == 1 ? 'OFF' : 'ON'}`" location="top">
                            <template v-slot:activator="{ props }">
                                <v-btn @click="toggle2FA(customItem)" v-bind="props"
                                class="mx-1 text-white align-self-center" 
                                color="green-darken-2" size="small" rounded="pill" :variant="customItem.with_2fa == 1 ? 'flat' : 'outlined'">
                                    <v-icon size="24">mdi-two-factor-authentication</v-icon>
                                </v-btn>
                            </template>
                        </v-tooltip>
                    </template>
                </DataTable>
                <v-overlay v-model="dialog.busy" class="align-center d-flex justify-center" contained>
                    <v-progress-circular indeterminate size="74" width="6" class="text-primary" />
                </v-overlay>
            </div>
        </div>

        <!-- Main Dialog for Add/Edit -->
        <v-dialog v-model="dialog.main.status" :max-width="dialogWidth" :persistent="true">
            <v-card class="globalRadius">
                <v-card-title class="d-flex justify-center gradient-bg text-white">
                    <!-- <span/> -->
                    <h3 class="p-title">{{ dialog.main.mode === 'add' ? 'Add Trainer' : 'Edit Trainer' }}</h3>
                    <!-- <v-btn class="close-btn" size="small" @click="closeMainDialog()" icon>
                        <v-icon class="" color="white" size="x-large">mdi-close</v-icon>
                    </v-btn> -->
                </v-card-title>
                <v-card-text class="px-4 pt-4 pb-0">
                    <v-form ref="trainerForm" v-model="formValid">
                        <v-row class="pa-0 ma-0">
                            <v-col class="py-0" cols="12" sm="6">
                                <label class="p-text p-bold">Employee No <span class="text-red">*</span></label>
                                <v-text-field 
                                    v-model="dialog.main.data.employeeNo" 
                                    variant="outlined" 
                                    density="compact"
                                    :rules="[required_rule]"
                                    :disabled="dialog.main.mode === 'edit' && session.user.role != 'admin'"
                                />
                            </v-col>
                            <v-col class="py-0" cols="12" sm="6">
                                <label class="p-text p-bold">Status <span class="text-red">*</span></label>
                                <v-select
                                    v-model="dialog.main.data.status"
                                    variant="outlined"
                                    density="compact"
                                    :items="statusOptions"
                                    item-title="text"
                                    item-value="value"
                                />
                            </v-col>
                            <v-col class="py-0" cols="12" sm="4">
                                <label class="p-text p-bold">Last Name <span class="text-red">*</span></label>
                                <v-text-field 
                                    v-model="dialog.main.data.last_name" 
                                    variant="outlined" 
                                    density="compact"
                                    :rules="[required_rule]"
                                    :disabled="dialog.main.mode === 'edit' && session.user.role != 'admin'"
                                />
                            </v-col>
                               <v-col class="py-0" cols="4" sm="4">
                                <label class="p-text p-bold">First Name <span class="text-red">*</span></label>
                                <v-text-field 
                                    v-model="dialog.main.data.first_name" 
                                    variant="outlined" 
                                    density="compact"
                                    :rules="[required_rule]"
                                    :disabled="dialog.main.mode === 'edit' && session.user.role != 'admin'"
                                />
                            </v-col>
                               <v-col class="py-0" cols="4" sm="4">
                                <label class="p-text p-bold">Middle Name <span class="text-red">*</span></label>
                                <v-text-field 
                                    v-model="dialog.main.data.middle_name" 
                                    variant="outlined" 
                                    density="compact"
                                    :disabled="dialog.main.mode === 'edit' && session.user.role != 'admin'"
                                />
                            </v-col>
                            <v-col class="py-0" cols="12" sm="12">
                                <label class="p-text p-bold">Email <span class="text-red">*</span></label>
                                <v-text-field 
                                    v-model="dialog.main.data.email" 
                                    variant="outlined" 
                                    density="compact"
                                    :rules="[required_rule, email_rule]"
                                    :disabled="dialog.main.mode === 'edit' && session.user.role != 'admin'"
                                />
                            </v-col>

                            <v-col class="py-0" cols="12" sm="6">
                                <label class="p-text p-bold">Team <span class="text-red">*</span></label>
                                <v-combobox 
                                    v-model="dialog.main.data.team"
                                    :items="CUURENT_TEAMS"
                                    variant="outlined"
                                    density="compact"
                                    :disabled="dialog.main.mode === 'edit' && session.user.role != 'admin'"
                                />
                            </v-col>
                            <v-col class="py-0" cols="12" sm="6">
                                <label class="p-text p-bold">Position <span class="text-red">*</span></label>
                                <v-combobox 
                                    v-model="dialog.main.data.position"
                                    :items="CURRENT_POSITIONS"
                                    variant="outlined"
                                    density="compact"
                                    :disabled="dialog.main.mode === 'edit' && session.user.role != 'admin'"
                                />
                            </v-col>
                            <v-col class="pa-2" cols="12" sm="12">
                                <label class="p-text p-bold">Role <span class="text-red">*</span></label>
                                <v-select
                                    v-model="selectedRole"
                                    variant="outlined"
                                    density="compact"
                                    :items="userRoleOptions"
                                    item-title="text"
                                    item-value="value"
                                    @update:model-value="updateRoleFlags"
                                />
                            </v-col>
                        </v-row>
                        <div class="input-form pa-0">
                            <v-row v-if="dialog.main.mode === 'edit' && session.user.role != 'supervisor' " class="pa-0 ma-0">
                                <v-col cols="12" md="6">
                                    <v-text-field v-model="model.licenseName"
                                        label="License Name"
                                        variant="outlined"
                                        density="comfortable"
                                        hide-details
                                    />
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-file-input
                                        @change="onFileChange($event)"
                                        label="Accepted formats: JPEG, PNG, PDF | Max File Size: 5MB"
                                        variant="outlined"
                                        density="comfortable"
                                        hide-details
                                        accept="image/jpeg, image/png, image/jpg, application/pdf"
                                        prepend-inner-icon="mdi-paperclip"
                                        prepend-icon=""
                                    />
                                </v-col>
                                <v-col class="d-flex justify-end" cols="12" md="12">
                                    <v-btn @click="AddLicense()" 
                                    variant="elevated" color="success" width="120" rounded="pill">Add</v-btn>
                                </v-col>
                            </v-row>
                        </div>
                        <v-row v-if="dialog.main.mode === 'edit' && session.user.role != 'supervisor' " class="pt-1 pa-0 ma-0">
                            <v-col v-for="(lc,id) in list.license" class="pa-1 ma-0" cols="12" sm="12">
                                <div class="card-item pa-3 d-flex justify-space-between">
                                    <div>
                                        <p class="p-text p-bold align-self-center">Name: {{ lc.name }}</p>
                                        <p class="p-caption align-self-center">File: {{ lc.file.name }}</p>
                                    </div>
                                    <v-btn @click="RemoveLicense(id)" size="small" color="red" variant="text" class="mx-1" icon>
                                        <v-icon size="small">mdi-close</v-icon>
                                    </v-btn>
                                </div>
                            </v-col>
                        </v-row>
                        
                        <!-- <v-row v-if="dialog.main.mode === 'edit' && session.user.role != 'supervisor' " class="pa-0 ma-0">
                            test
                        </v-row> -->
                    </v-form>
                </v-card-text>
            
                <v-card-actions class="d-flex justify-center pa-0 mb-2">
                    <v-btn @click="confirmStatus = true" variant="outlined" 
                        color="black" class="mx-1" width="120" rounded="pill">Cancel</v-btn>
                    <v-btn @click="saveTrainer()" :loading="saving"
                        :disabled="!formValid"
                        class="--bg-main text-white" width="120" rounded="pill">Save</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- View Dialog -->
        <v-dialog v-model="dialog.view.status" :max-width="dialogWidth">
            <v-card class="globalRadius">
                <v-card-title class="d-flex justify-space-between gradient-bg text-white">
                    <span/>
                    <h3 class="p-title">Trainer Profile</h3>
                    <v-btn class="close-btn" size="small" @click="dialog.view.status = false" icon>
                        <v-icon class="" color="white" size="x-large">mdi-close</v-icon>
                    </v-btn>
                </v-card-title>
                <v-card-text class="px-0 pt-2" style="max-height: 84vh; overflow-y: scroll;">
                    <div class="text-center mb-4">
                        <v-avatar v-if="dialog.view.details" size="160" class="mb-2 border" >
                            <v-img :src="mx.getFile(dialog.view.details.picture || {})"></v-img>
                        </v-avatar>
                        <v-avatar v-else size="160" class="mb-2 border" >
                            <v-icon size="80" color="grey-lighten-1">mdi-account</v-icon>
                        </v-avatar>
                        <h3 class="p-section">{{ dialog.view.data.name }}</h3>
                        <p class="" style="line-height: 12px;">{{ dialog.view.data.employeeNo }}</p>
                        <!-- <v-chip :color="getStatusColor(dialog.view.data.status)" size="small">
                            {{ getStatusText(dialog.view.data.status) }}
                        </v-chip> -->
                    </div>
                    <div class="px-4">
                        <div class="mb-6">
                            <h3 class="p-section">Information</h3>
                            <v-divider class="mb-2 mt-2"></v-divider>
                            <v-row class="pa-0 ma-0">
                                <v-col class="px-1 py-1 ma-0" cols="12" sm="6">
                                    <div class="card-item card-hover-x py-3 px-4">
                                        <p class="p-caption uppercase">TEAM</p>
                                        <p class="p-text">{{ dialog.view.data.team }}</p>
                                    </div>
                                </v-col>
                                <v-col class="px-1 py-1 ma-0" cols="12" sm="6">
                                    <div class="card-item card-hover-x py-3 px-4">
                                        <p class="p-caption uppercase">Position</p>
                                        <p class="p-text">{{ dialog.view.data.position }}</p>
                                    </div>
                                </v-col>
                                <v-col class="px-1 py-1 ma-0" cols="12" sm="6">
                                    <div class="card-item card-hover-x py-3 px-4">
                                        <p class="p-caption uppercase">Email</p>
                                        <p class="p-text">{{ dialog.view.data.email }}</p>
                                    </div>
                                </v-col>
                                <v-col class="px-1 py-1 ma-0" cols="12" sm="6">
                                    <div class="card-item card-hover-x py-3 px-4">
                                        <p class="p-caption uppercase">Phone</p>
                                        <p class="p-text">{{ dialog.view.details?.phone || 'No Input' }}</p>
                                    </div>
                                </v-col>
                            </v-row>
                        </div>
                        <div class="mb-6" v-if="dialog.view.details">
                            <h3 class="p-section">Credentials & Certifications</h3>
                            <v-divider class="mb-4 mt-2"></v-divider>
                            <p class="p-text p-bold pb-2">Academic Qualification</p>
                            <p class="p-caption" v-if="dialog.view.details.academic.length == 0">No academic qualifications available</p>
                            <v-row class="pa-0 mx-0 mt-0 mb-4">
                                <v-col v-for="(qual, i) in dialog.view.details.academic" :key="i" 
                                class="px-1 py-0 ma-0 mb-2" cols="12">
                                <div class="card-item card-hover-x py-3 px-4">
                                    <p class="p-text p-bold">{{ qual.course }}
                                        <v-chip class="mx-1" 
                                        color="blue" variant="tonal" size="small">
                                            {{ qual.start }} - {{ qual.end }}
                                        </v-chip>
                                    </p>
                                    <p class="p-caption">{{ qual.university }}</p>
                                </div>
                                </v-col>
                            </v-row>
                            <p class="p-text p-bold pb-2">Proffessional Certification</p>
                            <v-row class="pa-0 mx-0 mt-0 mb-4">
                                <v-col v-for="(pro, i) in dialog.view.details.professional" :key="i" 
                                class="px-1 py-0 mx-0 mt-0 mb-2" cols="12">
                                <div class="card-item card-hover-x py-3 px-4">
                                    <p class="p-text p-bold mb-1">{{ pro.certificate }}</p>
                                       <v-chip v-if="pro.issued_on" class="" 
                                        color="green" variant="tonal" size="small">
                                            Issued On: {{ pro.issued_on }}
                                        </v-chip> 
                                        <v-chip v-if="pro.valid_until" class="mx-1" 
                                        color="orange" variant="tonal" size="small">
                                            Valid Until: {{ pro.valid_until }}
                                        </v-chip>
                                </div>
                                </v-col>
                            </v-row>
                            <p class="p-text p-bold pb-2">Language</p>
                            <v-row class="pa-0 mx-0 mt-0 mb-4">
                                <v-chip v-for="(lang, i) in dialog.view.details.language" :key="i"
                                    class="mx-1" color="blue-darken-2" variant="tonal">
                                    {{ lang.name }}
                                </v-chip>
                          
                            </v-row>
                            <p class="p-text p-bold pb-2">License</p>
                            <v-row class="pa-0 mx-0 mt-0 mb-4">
                                <v-col v-for="(lic, i) in dialog.view.details.license" :key="i" 
                                class="px-1 py-0 ma-0" cols="12">
                                <div class="card-item card-hover-x d-flex py-3 px-4">
                                    <p class="p-text p-bold mb-1 align-self-center">{{ lic.name }}</p>
                                    <a :href="mx.getFile(lic.file)" target="_blank" class="mx-1">
                                        <v-btn size="small" color="blue-darken-2" variant="text" class="mx-1" icon>
                                        <v-icon size="small">mdi-open-in-new</v-icon>
                                    </v-btn>
                                    </a>
                                </div>
                                </v-col>
                            </v-row>
                            <p v-if="dialog.view.details.license.length == 0" class="p-caption mx-3">No uploaded license</p>
                        </div>
                        <div class="mb-5" v-if="dialog.view.details">
                            <h3 class="p-section">Performance Snapshot</h3>
                            <v-divider class="mb-4 mt-2"></v-divider>
                            <v-row class="pa-0 mx-0 mt-0 mb-4">
                                <v-col class="px-1 py-1 ma-0" cols="12" sm="4">
                                    <div class="simple-card card-hover-y pa-4">
                                        <p class="p-text p-bold text-grey-darken-2">Total Training Hours</p>
                                        <p class="p-title text-blue-darken-2 text-center"> {{ dialog.view.kpi?.DELIVERED_HOURS || 0 }}
                                            <span class="p-text">hours</span>
                                        </p>
                                    </div>
                                </v-col>
                                <v-col class="px-1 py-1 ma-0" cols="12" sm="4">
                                    <div class="simple-card card-hover-y pa-4">
                                        <p class="p-text p-bold text-grey-darken-2">Session Conducted</p>
                                        <p class="p-title text-green-darken-2 text-center"> {{ dialog.view.kpi?.SESSION_CONDUCTED || 0 }}
                                            <span class="p-text">sessions</span>
                                        </p>
                                    </div>
                                </v-col>
                                <v-col class="px-1 py-1 ma-0" cols="12" sm="4">
                                    <div class="simple-card card-hover-y pa-4">
                                        <p class="p-text p-bold text-grey-darken-2">Average Rating</p>
                                        <p class="p-title text-orange-darken-2 text-center"> {{dialog.view.kpi?.AVG_SCORE || 0}} / 5.0 
                                        </p>
                                    </div>
                                </v-col>
                            </v-row>
                        </div>
                    </div>
                </v-card-text>
            </v-card>
        </v-dialog>
  
       
        <!-- Delete Confirmation Dialog -->
        <!-- <v-dialog v-model="dialog.delete.status" max-width="400">
            <v-card class="globalRadius">
                <v-card-title class="gradient-bg text-white">
                    <h3>Confirm Delete</h3>
                </v-card-title>
                <v-card-text class="pa-4">
                    <div class="text-center">
                        <v-icon size="48" color="warning" class="mb-2">mdi-alert</v-icon>
                        <p>Are you sure you want to delete this trainer?</p>
                        <p class="font-weight-bold">{{ dialog.delete.data.name }}</p>
                        <p class="text-caption text-error">This action cannot be undone.</p>
                    </div>
                </v-card-text>
                <v-card-actions class="d-flex justify-center pa-0 mb-2">
                    <v-btn @click="dialog.delete.status = false" variant="outlined" 
                        color="black" class="mx-1" width="120" rounded="pill">Cancel</v-btn>
                    <v-btn @click="confirmDelete()" :loading="deleting"
                        color="error" width="120" rounded="pill">Delete</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog> -->

        <!-- Cancel Confirmation Dialog -->
        <ConfirmDialog 
            v-model="confirmStatus"
            title="Cancel"
            type="warning"
            cancelText="No"
            confirmText="Yes"
            confirmColor="success"
            message="Are you sure you want to cancel? All unsaved changes will be lost."
            @confirm="closeMainDialog()"
        />
    </div>
</template>

<script lang="ts" setup>
import { ref, getCurrentInstance, onMounted, watch, computed } from 'vue'
import { useSessionStore } from '@/stores/session';
import { useMXStore } from '@/stores/mx';
import { useRouter } from 'vue-router';
import { decrypt } from '@/utils/encryptDecrypt';
import { debounce } from '@/utils/debounce';
import { useAlertStore } from '@/stores/alert';
import { required_rule, email_rule } from '@/utils/rules';
import bcrypt from 'bcryptjs';
import NoProfile from '@/components/common/NoProfile.vue';
import ComingSoon from '@/components/common/ComingSoon.vue';
import DataTable from '@/components/DataTable.vue';
import { CURRENT_POSITIONS, CUURENT_TEAMS } from '@/constants/data';
import ConfirmDialog from '@/components/common/ConfirmDialog.vue';


const router = useRouter()
const session = useSessionStore()
const { proxy } = getCurrentInstance()!
const mx = useMXStore();
const alertStore = useAlertStore();

const moduleStat = ref(true);
const formValid = ref(false);
const saving = ref(false);
const deleting = ref(false);
const trainerForm = ref(null);
const selectedRole = ref('trainer');
const confirmStatus = ref(false);


// Options for dropdowns
const statusOptions = [
    { text: 'Active', value: 1 },
    { text: 'Inactive', value: 0 }
]

const roleOptions = [
    { text: 'Admin', value: 'admin' },
    { text: 'Manager', value: 'manager' },
    { text: 'Supervisor', value: 'supervisor' },
    { text: 'Trainer', value: 'trainer' }
]

const userRoleOptions = computed(() => {
    let roles = []
    if(session.user.role == 'supervisor'){
        roles = [
            // { text: 'Manager', value: 'manager' },
            { text: 'Supervisor', value: 'supervisor' },
            { text: 'Trainer', value: 'trainer' }
        ]
        return roles
    }
    if(session.user.role == 'manager'){
        roles = [
            { text: 'Manager', value: 'manager' },
            { text: 'Supervisor', value: 'supervisor' },
            { text: 'Trainer', value: 'trainer' }
        ]
        return roles
    }
    return roleOptions
})


const TABLE_HEADERS = [
    { title: 'ID', key: 'ID', align: 'center', sortable: false },
    { title: 'Employee No', key: 'employeeNo', align: 'center', sortable: false },
    { title: 'Name', key: 'name', align: 'start', sortable: false },
    { title: 'Email', key: 'email', align: 'center', sortable: false },
    // { title: 'Team', key: 'team', align: 'center', sortable: false },
    // { title: 'Position', key: 'position', align: 'center', sortable: false },
    { title: 'Role', key: 'role', align: 'center', sortable: false },
    { title: 'Status', key: 'status', align: 'center', sortable: false },
    { title: 'Actions', key: 'actions', align: 'center', sortable: false }
]

const trainerModel = ref({
    ID: '',
    employeeNo: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    team: '',
    position: '',
    status: 1,
    admin: 0,
    manager: 0,
    supervisor: 0,
    trainer: 1,
    password: '',
    hireDate: '',
    notes: ''
})

const dialog = ref<any>({
    main: {
        status: false,
        mode: 'add', // 'add' or 'edit'
        data: {}
    },
    view: {
        status: false,
        data: {},
        details: {}
    },
    delete: {
        status: false,
        data: {}
    }
})

const tableData = ref({
    status: false,
    headers: TABLE_HEADERS,
    items: [] as any[],
    search: '',
    limit: 10,
    page: 1,
    count: 1,
    loading: false
})

const model = ref<any>({
    licenseName: '',
    documents: null
})

const list = ref<any>({
    academic: [],
    professional: [],
    language: [],
    license: [],
    documents: []
})

const dialogWidth = computed(() => {
    if(mx.isMobile) return '100%'
    else if(mx.isTablet) return '100%'
    else if(mx.isDesktop) return '50%'
    else return '50%'
})


const getTrainers = async () => {
    tableData.value.loading = true
    try {
        let payload: any = {
            filters: {},
            limit: tableData.value.limit,
            page: tableData.value.page,
            search: tableData.value.search
        }
        
        if (session.user.role == 'supervisor') {
            payload.filters.team = session.user.team
            payload.filters.manager = 0
            payload.filters.admin = 0
        } else if (session.user.role == 'manager') {
            payload.filters.admin = 0
        }

        const res = await proxy!.$api.getData('trainers', payload)
        if (res.data.status) {
            let decrypted = decrypt(res.data.data)
            decrypted.map((item: any) => {
                delete item.password
                item.name = `${item.last_name}, ${item.first_name} ${item.middle_name?.substring(0, 1) || ''}`
                // Combine first and last name
                // item.name = `${item.firstName || ''} ${item.lastName || ''}`.trim()
                
                // Set role display
                if (item.admin == 1) {
                    item.role = 'Admin'
                } else if (item.manager == 1) {
                    item.role = 'Manager'
                } else if (item.supervisor == 1) {
                    item.role = 'Supervisor'
                } else if (item.trainer == 1) {
                    item.role = 'Trainer'
                }
            })
            tableData.value.items = decrypted
            tableData.value.count = res.data.meta.total_count
        }
    } catch (error) {
        console.error('Failed to load trainer data:', error)
        alertStore.showAlert('error', 'Error', 'Failed to load trainer data', true)
    }
    tableData.value.loading = false
}

// Permission handling
const getPermissions = () => {
    const userRole = session.user.role;
    if (userRole === 'admin') {
        return ['view', 'edit', 'add', 'delete'];
    } else if (userRole === 'manager') {
        return ['view', 'edit'];
    } else if (userRole === 'supervisor') {
        return ['view', 'edit'];
    }
    return ['view'];
}

// Event handlers
const handleAdd = () => {
    dialog.value.main.mode = 'add'
    dialog.value.main.data = { ...trainerModel.value }
    selectedRole.value = 'trainer'
    dialog.value.main.status = true
}

const handleEdit = async (item: any) => {
    dialog.value.main.mode = 'edit'
    dialog.value.main.data = { ...item }
    let filters = {
        trainerID: item.ID
    }
    const promise = new Promise((resolve, reject) => {
        proxy!.$api.getData('trainer_details', {filters}).then(response => resolve(response)).catch(error => reject(error));
    })
    const res : any = await promise;

    if(res.data.status){
        let decrypted = decrypt(res.data.data)
        decrypted.map((item: any) => {
            item.academic = JSON.parse(item.academic)
            item.professional = JSON.parse(item.professional)
            item.license = JSON.parse(item.license) 
            item.language = JSON.parse(item.language) 
            item.documents = JSON.parse(item.documents)
        })
        const { academic, professional, license, language, documents } = decrypted[0] || {}
        list.value.academic = academic || []
        list.value.professional = professional || []
        list.value.license = license || []
        list.value.language = language || []
        list.value.documents = documents || []
    }
    // Set selected role based on flags
    if (item.admin == 1) selectedRole.value = 'admin'
    else if (item.manager == 1) selectedRole.value = 'manager'
    else if (item.supervisor == 1) selectedRole.value = 'supervisor'
    else selectedRole.value = 'trainer'
    
    dialog.value.main.status = true
}

const handleView = async (item: any) => {
    dialog.value.busy = true
    let filters = {
        trainerID: item.ID
    }
    const promise = new Promise((resolve, reject) => {
        proxy!.$api.getData('trainer_details', {filters}).then(response => resolve(response)).catch(error => reject(error));
    })
    const res : any = await promise;
    if (res.data.status) {
        let decrypted = decrypt(res.data.data)
        decrypted.map((item: any) => {
            item.academic = JSON.parse(item.academic)
            item.professional = JSON.parse(item.professional)
            item.license = JSON.parse(item.license) 
            item.language = JSON.parse(item.language) 
            item.picture = JSON.parse(item.picture) 
        })
        dialog.value.view.details = decrypted[0] 
    }
    let month = new Date().getMonth() + 1
    let year = new Date().getFullYear()
    const data = {
        TR_MONTH: month,
        TR_YEAR: year,
        ID: item.ID
    }
    const promise2 = new Promise((resolve, reject) => {
        proxy!.$api.getData('trainer_kpi_view', {filters: data}).then(response => resolve(response)).catch(error => reject(error));
    })
    const res2 :any = await promise2

    if (res2.data.status) {
        let decrypted = decrypt(res2.data.data)
        dialog.value.view.kpi = decrypted[0] || {}
    }

    dialog.value.view.data = { ...item }
    dialog.value.view.status = true
    dialog.value.busy = false
}

const handleDelete = (item: any) => {
    dialog.value.delete.data = { ...item }
    dialog.value.delete.status = true
}

const handleExport = (items: any) => {
    // console.log('Export clicked:', items)
}
function onFileChange(event: Event){
    const target = event.target as HTMLInputElement;
    if (target.files && target.files[0]) {
        const file = target.files[0];
        model.value.documents = file
    }
}

const AddLicense = async () => {
    if(model.value.licenseName == ''){
        return alertStore.showAlert('warning', '', 'License Name is required', true)
    }else if(model.value.documents == null){
        return alertStore.showAlert('warning', '', 'Document is required', true)
    }

   const formData = new FormData();
    formData.append('image', model.value.documents);
    formData.append('filePath', `images/profile/trainer/${session.user.employeeNo}/license`);
    try {
        const response = await proxy!.$api.uploadImg(formData)
        let decrypted = decrypt(response.data.data)
        let data = {
            name: model.value.licenseName,
            file: decrypted
        }
        list.value.license.push(data)  
        return response
    } catch (error) {
        return error
    }
}

const RemoveLicense = (index: number) => {
    list.value.license.splice(index, 1)
}

const closeMainDialog = () => {
    dialog.value.main.status = false
}

const updateRoleFlags = () => {
    // Reset all role flags
    dialog.value.main.data.admin = 0
    dialog.value.main.data.manager = 0
    dialog.value.main.data.supervisor = 0
    dialog.value.main.data.trainer = 1
    
    // Set the selected role flag
    dialog.value.main.data[selectedRole.value] = 1
}

const saveTrainer = async () => {
    if (!formValid.value) return
    
    saving.value = true
    try {
        let payload = { ...dialog.value.main.data }
                
        // Generate password if not provided for new trainers
        if (dialog.value.main.mode === 'add' && !payload.password) {
            let plainPassword = 'Pmc@' + new Date().getFullYear()
            const hashedPassword = await bcrypt.hash(plainPassword, 12);
            payload.password = hashedPassword
            payload.created_by  = session.user.ID
            payload.created_on = new Date()
        }else{
            payload.updated_by  = session.user.ID
            payload.updated_on = new Date()
        }
        
        payload.unique_by = JSON.stringify(['employeeNo'])
        const res = await proxy!.$api.saveData('trainers', payload)
        if (res.data.status) {
            if(list.value.academic.length > 0){
                let details = {
                    trainerID: payload.ID,
                    academic: JSON.stringify(list.value.academic),
                    professional: JSON.stringify(list.value.professional),
                    license: JSON.stringify(list.value.license),
                    language: JSON.stringify(list.value.language),
                    documents: JSON.stringify(list.value.documents),
                    // created_by: session.user.ID,
                    // created_on: new Date(),
                    updated_by: session.user.ID,
                    updated_on: new Date(),
                    unique_by: JSON.stringify(['trainerID'])
                }

                const detailsRes = await proxy!.$api.saveData('trainer_details', details)
                if (!detailsRes.data.status) {
                    alertStore.showAlert('error', 'Error', 'Failed to save trainer details', true)
                    saving.value = false
                    dialog.value.main.status = false
                    return
                }
            }

            dialog.value.main.status = false
            alertStore.showAlert('success', 'Success', 
                `Trainer ${dialog.value.main.mode === 'add' ? 'added' : 'updated'} successfully`, true)
            await getTrainers()
        } else {
            alertStore.showAlert('error', 'Error', 'Failed to save trainer', true)
        }
    } catch (error) {
        console.error('Save trainer error:', error)
        alertStore.showAlert('error', 'Error', 'Failed to save trainer', true)
    }
    saving.value = false
}

// const confirmDelete = async () => {
//     deleting.value = true
//     try {
//         const res = await proxy!.$api.deleteData('trainers', dialog.value.delete.data.ID)
//         if (res.data.status) {
//             dialog.value.delete.status = false
//             alertStore.showAlert('success', 'Success', 'Trainer deleted successfully', true)
//             await getTrainers()
//         } else {
//             alertStore.showAlert('error', 'Error', 'Failed to delete trainer', true)
//         }
//     } catch (error) {
//         console.error('Delete trainer error:', error)
//         alertStore.showAlert('error', 'Error', 'Failed to delete trainer', true)
//     }
//     deleting.value = false
// }

// Utility functions
const toggle2FA = async (item: any) => {
    try {
        const res = await proxy!.$api.saveData('trainers', {
            ID: item.ID,
            with_2fa: item.with_2fa == 1 ? 0 : 1
        })
        if(res.data.status){
            alertStore.showAlert('success', 'Success', '2FA toggled successfully', true)
            await getTrainers()
        }else{
            alertStore.showAlert('error', res.data.error, res.data.message, true)
        }
    } catch (error) {
        console.error('Toggle 2FA error:', error)
    }
}

const getStatusColor = (status: number): string => {
    return status === 1 ? 'success' : 'error'
}

const getStatusText = (status: number): string => {
    return status === 1 ? 'Active' : 'Inactive'
}

// Debounced search
let timeoutId: number;
const performSearch = async () => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(async () => {
        await getTrainers();
    }, 250);
};

const debouncedSearch = debounce(performSearch, 500);

// Watchers
watch(() => tableData.value.search, () => {
    debouncedSearch();
})

watch(() => tableData.value.page, async () => {
    await getTrainers()
})

watch(() => tableData.value.limit, async () => {
    await getTrainers()
})

// Lifecycle
onMounted(async () => {
    await getTrainers()
})

function gotoProfile() {
    router.push(`/${session.user.role}/profile`)
}
</script>
