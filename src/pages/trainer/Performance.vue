<template>
    <div>
        <NoProfile v-if="!session.details" @goto="gotoProfile" />
        <div v-else>
            <ComingSoon style="overflow-y: hidden;"
                :target-date="'2024-12-31T00:00:00'"
                :show-countdown="true"
                :progress="85"
            />
        </div>
    </div>
</template>

<script lang="ts" setup>
import NoProfile from '@/components/common/NoProfile.vue';
import ComingSoon from '@/components/common/ComingSoon.vue';
import { useSessionStore } from '@/stores/session';
import { useRouter } from 'vue-router';

const session = useSessionStore()
const router = useRouter()

const gotoProfile = () => {
    router.push('/trainer/profile')
}
</script>