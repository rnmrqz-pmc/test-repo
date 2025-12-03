<template>
    <div class="pa-2">
        <NoProfile v-if="!session.details" @goto="gotoProfile" />
        <div v-else class="">
            <Calendar 
                :events="trainerEvents" 
                :role="session.user.role"
                :busy="busy"
                :trainers="trainer_list"
                @prev="goPrev"
                @next="goNext"
                @today="goToday"
            />
        </div>
    </div>
</template>

<script lang="ts" setup>

import { ref, onMounted, getCurrentInstance } from 'vue'
import { useSessionStore } from '@/stores/session';
import { useRouter } from 'vue-router';
import { decrypt } from '@/utils/encryptDecrypt';
import NoProfile from '@/components/common/NoProfile.vue';
import Calendar from '@/components/Calendar.vue';


const session = useSessionStore()
const router = useRouter()
const { proxy } = getCurrentInstance()!


const trainerEvents = ref<any>([]);
const busy = ref(false)
const colorStat = ref<any>([
    { status: 'Planned', color: "#90CAF9", textColor: "black" },
    { status: 'On-Going', color: "#FFCC80", textColor: "black" },
    { status: 'Completed', color: "#81C784", textColor: "black" },
    { status: 'Cancelled', color: "#EF5350", textColor: "#fff" },
    { status: 'Active', color: "#388E3C", textColor: "#fff" },
])
const trainer_list = ref<any>([])

async function getTrainers(){
    const filter = {
        status: 1
    }

    const res = await proxy!.$api.getData('trainers', { filters: filter })
    if(res.data.status){
        let decrypted = decrypt(res.data.data)
        decrypted.map((item: any) => {
            delete item.password
        })
        trainer_list.value = decrypted
    }
}

async function getTrainings(options: any){
    options.status = 1
    const data = {
        filters: options,
        find_in_set_any: {
            trainers: session.user.ID
        },
        limit: 100
    }
    const response = await proxy!.$api.getData('training',data)
    if(response.data.status){
        let decrypted = decrypt(response.data.data)
        decrypted.map((item: any) => {
            item.title = item.title
           
            if(item.start_date == item.end_date){
                item.start = `${item.start_date}T${item.start_time}`
                item.end = `${item.end_date}T${item.end_time}`
            } else {
                item.rrule = {
                    freq: 'daily',
                    dtstart: `${item.start_date}T${item.start_time}`,
                    until: `${item.end_date}T${item.end_time}`
                }
            }
           
            item.color = colorStat.value.find((stat: any) => stat.status == item.training_status).color
            item.textColor = colorStat.value.find((stat: any) => stat.status == item.training_status).textColor
            item.allDay = false
            item.description = "event1"
          
            const now = new Date().toLocaleDateString('en-CA')
            let startDateTime = new Date(`${now}T${item.start_time}`)
            let endDateTime = new Date(`${now}T${item.end_time}`)
            let duration = endDateTime.getTime() - startDateTime.getTime()
            let durationHours = Math.floor(duration / (60 * 60 * 1000))
            let durationMinutes = Math.floor((duration / (60 * 1000)) % 60)
            let durationString = `${durationHours.toString().padStart(2, '0')}:${durationMinutes.toString().padStart(2, '0')}`
            item.duration = durationString
        })
        trainerEvents.value = decrypted
    }
}
function calculateDate(date : any, type : any) {
    const formDate = new Date(date);
    formDate.setMonth( type == 'start' ?  (formDate.getMonth() - 1) : (formDate.getMonth() + 2) );

    return `${formDate.getFullYear()}-${(formDate.getMonth() + 1)
        .toString()
        .padStart(2, "0")}-${formDate.getDate().toString().padStart(2, "0")}`;
}
async function goPrev( data: any, type: any ) {
    try {
        busy.value = true
        const start = calculateDate(data.start, 'start')
        const end = calculateDate(data.end, 'end')

        const options = {
            'start_date >=' : start,
            'end_date <=' : end,
        }
        await getTrainings(options)
        // await getSchedule(options)
        busy.value = false
    } catch (error) {
        console.log(error)
        busy.value = false
    } 
}
async function goNext( data: any, type: any ) {
    try {
        busy.value = true
        const start = calculateDate(data.start, 'start')
        const end = calculateDate(data.end, 'end')
        const options = {
            'start_date >=' : start,
            'end_date <=' : end,
        }
        await getTrainings(options)
        // await getSchedule(options)
        busy.value = false
    } catch (error) {
        console.log(error)
        busy.value = false
    }
}
async function goToday( data?: any ) {
    try {
        busy.value = true
        const dateNow = new Date().toLocaleDateString('en-CA')
        const start = calculateDate(dateNow, 'start')
        const end = calculateDate(dateNow, 'end')
        const options = {
            'start_date >=' : start,
            'end_date <=' : end,
        }
        await getTrainings(options)
        // await getSchedule(options)
        busy.value = false
    } catch (error) {
        console.log(error)
        busy.value = false

    }
}

const gotoProfile = () => {
    router.push('/trainer/profile')
}



onMounted(async () => {
    await goToday(),
    await getTrainers()
})



</script>