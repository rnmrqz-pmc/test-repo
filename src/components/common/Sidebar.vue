<template>
  <!-- Sidebar -->
    <v-app-bar v-if="session.user" app height="70" 
    :class="`pa-0 ma-0`" fixed :color="mx.isMobile || mx.isTablet ? 'blue-accent-4' : 'white'" elevation="2" >
     <v-toolbar-title class=" drawer-title --bg-main align-content-center" style="width: 250px;">
      <div class="d-flex justify-center">
          <img class="py-2"
            src="../../assets/images/Basecamp.png"
            alt="Basecamp"
            max-height="50"
            style="width: 80%;"
          />
      </div>
      
      </v-toolbar-title>
    <v-app-bar-nav-icon @click="drawer = !drawer" class="d-flex justify-space-between"/>
    <h3 v-if="!(mx.isMobile || mx.isTablet)">
      {{ userSession.full_name }}
    </h3>
    <div v-else class="d-flex justify-center" style="width: 100%;">
          <img class="py-2 pa-2"
            src="../../assets/images/Basecamp.png"
            alt="Basecamp"
            max-height="50"
            :style="`max-height: ${mx.isMobile ? '80px' : '80px'};`"
          />
      </div>
    <v-spacer />
    <div class="mx-4 pa-2 d-flex" >   
      
      <!-- <NotificationBell /> -->

      <v-btn v-if="!(mx.isMobile || mx.isTablet)" @click="logoutDialog = true"
      class="special-btn" variant="outlined" rounded="pill">Logout</v-btn>
      <!-- <v-speed-dial
        location="bottom center"
        transition="fade-transition"
      >
        <template v-slot:activator="{ props: activatorProps }">
          <v-fab
            v-bind="activatorProps"
            size="default"
            icon>
            <v-icon>mdi-account</v-icon>
        </v-fab>
        </template>

        <div key="0" class="" style="width: 120px;">
          <v-hover>
              <v-list-item link color="primary" class="bg-grey-lighten-2 text-center" key="1">
                <span class="mx-2 text-center ">Profile</span>
              </v-list-item>
          </v-hover>
        </div>
        <div key="0" class="" style="width: 120px;">
          <v-hover>
              <v-list-item link color="primary" class="bg-grey-lighten-2 text-center" key="1">
                <span class="mx-2 text-center ">Logout</span>
              </v-list-item>
          </v-hover>
        </div>



      </v-speed-dial> -->
    </div>
  </v-app-bar>


    <v-navigation-drawer v-if="session.user" app
      :model-value="drawer"
      @update:model-value="emit('update:modelValue', $event)"
    :temporary="isMobile"
    class="--bg-main"
    disable-resize-watcher
  >
    <v-list>
      <v-list-item @click="drawer = (mx.isMobile || mx.isTablet ? false : true)"
        v-for="link in activeLinks"
        :key="link.to"
        :to="link.to"
        link class="text-white d-flex customNav"
      >
      <div class="d-flex ">
        <v-icon v-if="link.icon" class="mx-2">{{ link.icon }}</v-icon>
        <p :class="route.path === link.to ? 'font-weight-bold' : ''">{{ link.text }}</p>
      </div>    
      </v-list-item>
    </v-list>
    
    <div class="profile-bottom py-4">
      <v-list-item class="" link :to="`/${session.user ? session.user.role : ''}/profile`">
        <div class="d-flex justify-space-between text-white">
          <div class="d-flex">
            <v-icon size="30">mdi-account</v-icon>
            <h3 class="align-self-center mx-2">Profile</h3>
          </div>
          <p class="align-self-center"
          style="font-size: 12px; font-weight: 600; float: right;"
          >{{ userSession.role.toUpperCase() }}</p>
        </div>
          
      </v-list-item>
    </div>
  </v-navigation-drawer>
  <ConfirmDialog 
    v-model="logoutDialog"
    title="Logout"
    message="Are you sure you want to logout? All unsaved changes will be lost."
    confirmText="Yes"
    cancelText="No"
    @confirm="logout"
  />

</template>

<script lang="ts" setup>
import { ref, computed, getCurrentInstance } from 'vue'
import { useDisplay } from 'vuetify'
import { useRoute, useRouter } from 'vue-router'
import { useSessionStore } from '@/stores/session'
import { useMXStore } from '@/stores/mx'
import ConfirmDialog from './ConfirmDialog.vue'
import NotificationBell from '../NotificationBell.vue'

const { proxy } = getCurrentInstance()!
const mx = useMXStore();
const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const session = useSessionStore()
const route = useRoute()
const router = useRouter()

const drawer = ref( mx.isMobile || mx.isTablet ? false :  true )
const userSession = computed(() => session.user || {})
const logoutDialog = ref(false)

const sidebarLinks = ref<any>([
  { to: '/', text: 'Home', role: 'admin|manager|supervisor' },
  { to: '/about', text: 'About', role: 'admin|manager|supervisor' },
  { to: '/contact', text: 'Contact', role: 'admin|manager|supervisor' },
  // Trainer Tab links
  { role: 'trainer', to: '/trainer', text: 'Dashboard', icon: 'mdi-view-dashboard' },
  { role: 'trainer', to: '/trainer/trainings', text: 'Trainings', icon: 'mdi-account-group' },
  { role: 'trainer', to: '/trainer/calendar', text: 'Calendar', icon: 'mdi-calendar' },
  { role: 'trainer', to: '/trainer/performance', text: 'Performance', icon: 'mdi-star' },
  // Supervisor links
  { role: 'supervisor', to: '/supervisor', text: 'Dashboard', icon: 'mdi-view-dashboard' },
  { role: 'supervisor', to: '/supervisor/trainers', text: 'Trainers Profile', icon: 'mdi-account-supervisor' },
  { role: 'supervisor', to: '/supervisor/trainings', text: 'Trainings', icon: 'mdi-file-document-check-outline' },
  { role: 'supervisor', to: '/supervisor/calendar', text: 'Calendar of Activities', icon: 'mdi-calendar-month' },
  { role: 'supervisor', to: '/supervisor/trainer_availability', text: 'Trainer Availability', icon: 'mdi-account-clock' },
  { role: 'supervisor', to: '/supervisor/performance_review', text: 'Performance Review', icon: 'mdi-star' },
  { role: 'supervisor', to: '/supervisor/reports', text: 'Report', icon: 'mdi-finance' },
  // Manager links
  { role: 'manager', to: '/manager', text: 'Dashboard', icon: 'mdi-view-dashboard' },
  { role: 'manager', to: '/manager/trainers', text: 'Trainers Profile', icon: 'mdi-account-supervisor' },
  { role: 'manager', to: '/manager/trainings', text: 'Trainings', icon: 'mdi-file-document-check-outline' },
  { role: 'manager', to: '/manager/calendar', text: 'Calendar of Activities', icon: 'mdi-calendar-month' },
  { role: 'manager', to: '/manager/trainer_availability', text: 'Trainer Availability', icon: 'mdi-account-clock' },
  { role: 'manager', to: '/manager/performance_review', text: 'Performance Review', icon: 'mdi-star' },
  { role: 'manager', to: '/manager/reports', text: 'Report', icon: 'mdi-finance' },
    // Admin links
  { role: 'admin', to: '/admin', text: 'Dashboard', icon: 'mdi-view-dashboard' },
  { role: 'admin', to: '/admin/trainers', text: 'Trainers Profile', icon: 'mdi-account-supervisor' },
  { role: 'admin', to: '/admin/trainings', text: 'Trainings', icon: 'mdi-file-document-check-outline' },
  { role: 'admin', to: '/admin/calendar', text: 'Calendar of Activities', icon: 'mdi-calendar-month' },
  { role: 'admin', to: '/admin/trainer_availability', text: 'Trainer Availability', icon: 'mdi-account-clock' },
  { role: 'admin', to: '/admin/performance_review', text: 'Performance Review', icon: 'mdi-star' },
  { role: 'admin', to: '/admin/reports', text: 'Report', icon: 'mdi-finance' },

])

// Filter sidebar links based on the user's role
const activeLinks = computed(() => {
  return sidebarLinks.value.filter((link:any) => link.role === userSession.value.role)
})


//  Logs the user out and redirects to the login page.
const logout = async () => {
  await proxy!.$api.logout()
  session.logout()
  router.replace({name: 'Login'})
}

// Detect mobile screen size using Vuetify's display service
const { smAndDown } = useDisplay()
const isMobile = computed(() => smAndDown.value)
</script>
