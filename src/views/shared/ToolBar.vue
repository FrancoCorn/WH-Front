<template>
    <ion-toolbar>
        <ion-buttons v-if="showBackButton" slot="start">
            <ion-back-button :icon="backButtonIcon" default-href="/" @click="backButtonFunction()"></ion-back-button>
        </ion-buttons>
        <ion-title>Where?Here!</ion-title>
        <img slot="end" src="/icono/mapa.svg" class="icon"></img>
    </ion-toolbar>
</template>

<script setup lang="ts">
import router from '@/router';
import { IonToolbar, IonTitle, IonBackButton, IonButtons, IonIcon } from '@ionic/vue';
import { arrowBackOutline } from 'ionicons/icons';

defineProps({
    showBackButton: {
        type: Boolean,
        default: false
    },
    backButtonFunction: {
        type: Function,
        default: () => router.back()
    },
    backButtonIcon: {
        type: String,
        default: arrowBackOutline
    }
});
</script>

<style scoped>
.icon {
    width: 50px;
    height: 40px;
}
</style>