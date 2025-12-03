<template>
    <div class="">
        <NoProfile v-if="!session.details" @goto="gotoProfile()" />
        <div v-else class="">
            <ComingSoon />
        </div>
    </div>
</template>


<script lang="ts" setup>
import { ref, getCurrentInstance } from 'vue'
import { useSessionStore } from '@/stores/session';
import { useMXStore } from '@/stores/mx';
import { useRouter } from 'vue-router';
import NoProfile from '@/components/common/NoProfile.vue';
import ComingSoon from '@/components/common/ComingSoon.vue';
const router = useRouter()
const session = useSessionStore()
const { proxy } = getCurrentInstance()!
const mx = useMXStore();



function gotoProfile(){
    router.push(`/${session.user.role}/profile`)
}
</script>