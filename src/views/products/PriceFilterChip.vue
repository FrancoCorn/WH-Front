<template>
    <ion-chip v-if="show" class="price-filter-chip">
        <ion-label>Precio: {{ min }} - {{ max !== Infinity ? max : '∞' }} </ion-label>
        <ion-icon :icon="closeCircle" @click="removeFilter"></ion-icon>
    </ion-chip>
</template>

<script setup lang="ts">
import { IonIcon, IonChip, IonLabel } from '@ionic/vue';
import { closeCircle } from 'ionicons/icons';

defineProps({
    min: {
        type: Number,
        required: true,
    },
    max: {
        type: Number,
        required: true,
    },
    show: {
        type: Boolean,
        required: true,
    }
});

const emits = defineEmits(['remove']);

function removeFilter() {
    emits('remove');
}
</script>

<style scoped>
.price-filter-chip {
    margin-bottom: 10px;
}
</style>