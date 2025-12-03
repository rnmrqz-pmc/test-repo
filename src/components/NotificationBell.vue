<template>
    <div>
        <v-menu
        v-model="notifMenu"
        location="start"
        transition="scale-transition"
        :close-on-content-click="false">
        <template #activator="{ props }">
          <v-badge
            class="mx-4 align-self-center"
            :content="unReadCount > 99 ? '99+' : unReadCount"
            :value="unReadCount > 0"
            :color="unReadCount > 0 ? 'red' : ''"
            overlap
            offset-x="3"
            offset-y="3"
          >
            <v-icon
              v-bind="props"
              size="x-large" color="yellow-darken-2"
              :class="unReadCount > 0 ? 'strong-shake' : ''"
            >
              mdi-bell
            </v-icon>
          </v-badge>
        </template>

        <v-card min-width="380" class="globalRadius">
            <div class="d-flex justify-space-between py-2 gradient-bg">
                <p class="mx-2  p-bold uppercase align-self-center text-white ">New Notifications ({{ unReadCount }})</p>
                <v-btn icon size="x-small" class="mx-2"
                @click="fetchUserNotif">
                    <v-icon size="x-large" color="black">mdi-refresh</v-icon>
                </v-btn>
            </div>
            <v-divider/>
            <v-list style="max-height: 350px; overflow-y: auto;">
                <v-list-item v-for="(nt, id) in notifications" :key="id" 
                @click="openNotif(nt, id)"
                :class="nt.is_read === 0 ? 'bg-grey-lighten-3' : ''"
                class="border-bottom ">
                <div class="d-flex justify-space-between">
                    <p class="p-bold">{{ nt.title }}</p>
                    <p class="p-caption">{{ mx.formatDate(nt.created_on) }}</p>
                </div>
                <p class="p-caption">{{ nt.caption }}</p>
                </v-list-item>
            </v-list>
            <v-btn @click="addLimitCount" :loading="loading"
            class="" color="primary" variant="text" block>See more</v-btn>
        </v-card>
      </v-menu>

      <v-dialog v-model="dialog" max-width="60%" :persistent="true">
        <v-card class="globalRadius">
            <v-card-title class="gradient-bg text-white d-flex justify-space-between">
                <h3>Unread Notifications ({{ unReadCount }})</h3>
                <v-btn class="close-btn" size="small" @click="dialog = false" icon>
                    <v-icon class="" color="white" size="x-large">mdi-close</v-icon>
                </v-btn>
            </v-card-title>
            <v-card-text class="pa-4">
                <v-row class="pa-0 ma-0">
                    <v-col class="pa-0 ma-0" cols="12" sm="5">
                        <v-list class="px-0 ma-0 py-1 pe-1" style="max-height: 450px; overflow-y: auto;">
                            <v-list-item v-for="(nt, id) in notifications" :key="id" 
                            @click="viewNotification(nt, id)"
                            :class="activeID == id ? 'bg-grey-lighten-3' : ''"
                            class="card-item card-item card-hover-y my-1 " rounded="lg">
                                <div class="d-flex justify-space-between">
                                    <p class="p-bold d-flex">
                                        <v-icon v-if="nt.is_read === 0" 
                                        class="pt-1 me-1"
                                        size="12" color="red">mdi-circle</v-icon>
                                        {{ nt.title }}
                                    </p>
                                    <p class="p-caption">{{ mx.formatDate(nt.created_on) }}</p>
                                </div>
                                <p class="p-caption">{{ nt.caption }}</p>                      
                            </v-list-item>
                        </v-list>
                        <v-btn @click="addLimitCount" :loading="loading"
                        class="" color="primary" variant="text" block>See more</v-btn>
                    </v-col>
                    <v-col class="pa-0 ma-0" cols="12" sm="7" style="max-height: 450px;;">
                        <div class="px-6 py-2">
                            <p class="p-bold">{{ activeNotif.title }}</p>
                            <p class="p-caption">{{ activeNotif.created_on }}</p>
                            <p class="p-text pt-2">{{ activeNotif.caption }}</p>
                            <p class="p-subtitle">{{ activeNotif.message }}</p>
                        </div>
                        <!-- <v-card class="mx-2 pa-2 " style="height: 100%;">
                            {{ activeNotif }}
                        </v-card> -->
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>
      </v-dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, getCurrentInstance, onMounted } from 'vue'
import { useMXStore } from '@/stores/mx'
import { useSessionStore } from '@/stores/session'
import { decrypt } from '@/utils/encryptDecrypt'

const mx = useMXStore()
const { proxy } = getCurrentInstance()!
const session = useSessionStore()

const notifLimit = ref(20)
const pageNo = ref(1)
const unReadTotal = ref(0)
const activeNotif = ref<any>({})
const activeID = ref(0)
const notifMenu = ref(false)
const notifications = ref<any>([
  { ID: 1, trainer_id: 1, title: 'Notifications 1', created_on: '10-27-2025 10:00:00', caption: 'Caption', message: 'Message', is_read: 0 },
  { ID: 2, trainer_id: 1, title: 'Notifications 2', created_on: '10-27-2025 10:00:00', caption: 'Caption', message: 'Message', is_read: 0 },
  { ID: 3, trainer_id: 1, title: 'Notifications 3', created_on: '10-27-2025 10:00:00', caption: 'Caption', message: 'Message', is_read: 0 },
  { ID: 4, trainer_id: 1, title: 'Notifications 4', created_on: '10-27-2025 10:00:00', caption: 'Caption', message: 'Message', is_read: 0 },
  { ID: 5, trainer_id: 1, title: 'Notifications 5', created_on: '10-27-2025 10:00:00', caption: 'Caption', message: 'Message', is_read: 0 },
])
const dialog = ref(false)
const loading = ref(false)


const unReadCount = computed(() => {
    return unReadTotal.value 
})


const fetchUserNotif = async () => {
    loading.value = true
    try {
        const res = await proxy!.$api.getNotif({ 
            filters: { user: session.user.ID }, 
            limit: notifLimit.value, 
            // page: pageNo.value,
            order_by: {
                is_read: 'asc',
                created_on: 'desc',
            }
        })
        unReadTotal.value = res.data.unread
        let decrypted = decrypt(res.data.data)
        notifications.value = decrypted
    } catch (error) {
        console.log(error)
    }
    loading.value = false
}

const addLimitCount = () => {
    notifLimit.value += 20
    fetchUserNotif()
}

const openNotif = (item: any, index: number) => {
    notifMenu.value = false
    dialog.value = true
    viewNotification(item, index)
}

const viewNotification = async (item: any, index: number) => {
    activeNotif.value = item
    activeID.value = index
    if(item.is_read == 0){
        await handleReadNotif(item)
        unReadTotal.value--
        notifications.value[index].is_read = 1
    }
}

const handleReadNotif = async (item: any) => {
    let datenow = new Date().toLocaleDateString('en-CA', { year: 'numeric', month: '2-digit', day: '2-digit' })
    let timenow = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })
    let datetime = datenow + ' ' + timenow
    let data = {
        ID: item.ID,
        user: session.user.ID,
        datetime: datetime
    }
    await proxy!.$api.readNotif(data)
}

onMounted(async () => {
    await fetchUserNotif()
    setInterval(async () => {
        await fetchUserNotif()
    }, 30000);
})


</script>