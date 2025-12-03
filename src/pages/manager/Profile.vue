<template>
    <div class="pa-2">
        <GlobalProfile />
    </div>
</template>


<script lang="ts" setup>
import { ref, getCurrentInstance } from 'vue'
import { useSessionStore } from '@/stores/session';
import { useMXStore } from '@/stores/mx';
import { useRouter } from 'vue-router';
import GlobalProfile from '@/components/GlobalProfile.vue';

const router = useRouter()
const session = useSessionStore()
const { proxy } = getCurrentInstance()!
const mx = useMXStore();



function gotoProfile(){
    router.push(`/${session.user.role}/profile`)
}
</script>