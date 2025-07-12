<template>
    <ion-card v-if="supermarketList.length > 0" v-for="s in supermarketList" :key="s.id"
        @click="handleSupermarketClick(s)">
        <ion-card-header>
            <ion-card-title>{{ s.name }}</ion-card-title>
            <ion-card-subtitle>{{ s.address }}</ion-card-subtitle>
        </ion-card-header>

        <ion-card-content>
            <div class="info-container">
                <!-- Display Distance -->
                <div v-if="showDistance" class="distance-info">
                    <ion-icon :icon="locationOutline" class="distance-icon"></ion-icon>
                    <ion-label v-if="(s as SupermarketWithDistance).distance < 1000">{{ Math.round((s as
                        SupermarketWithDistance).distance / 10) * 10 }} mts</ion-label>
                    <ion-label v-else>{{ Math.round((s as SupermarketWithDistance).distance / 1000 * 10) / 10 }}
                        kms</ion-label>
                </div>

                <!-- Display Schedule -->
                <div v-if="showSchedule" class="schedule-info">
                    <div v-if="getScheduleForToday(s as SupermarketWithSchedules)">
                        <ion-label>
                            <strong>Horario de apertura:</strong> {{ getScheduleForToday(s as
                                SupermarketWithSchedules)!.open }}hs
                        </ion-label>
                        <ion-label>
                            <strong>Horario de cierre:</strong> {{ getScheduleForToday(s as
                                SupermarketWithSchedules)!.close }}hs
                        </ion-label>
                    </div>
                    <div v-else>
                        <ion-label>Sin horarios disponibles para hoy.</ion-label>
                    </div>
                </div>
            </div>
        </ion-card-content>
    </ion-card>

    <ion-label v-else class="unavailable-text">No hay supermercados disponibles</ion-label>
</template>

<script setup lang="ts">
import { Supermarket, SupermarketWithDistance, SupermarketWithSchedules, SupermarketWithSchedulesAndDistance } from '@/entities/supermarket';
import { IonCard, IonCardHeader, IonCardContent, IonCardTitle, IonCardSubtitle, IonIcon, IonLabel } from '@ionic/vue';
import { useRouter } from 'vue-router';
import { ref, watch } from 'vue';
import { locationOutline } from 'ionicons/icons';
import { MUTATIONS, store } from '@/store/currentSupermarket';

const props = defineProps({
    supermarketList: {
        type: Array<SupermarketWithSchedulesAndDistance>,
        required: true
    },
    showDistance: {
        type: Boolean,
        default: false
    },
    showSchedule: {
        type: Boolean,
        default: false
    }
});

const router = useRouter();
const supermarketList = ref<(SupermarketWithSchedulesAndDistance)[]>(props.supermarketList);

watch(() => props.supermarketList, (newValue: SupermarketWithSchedulesAndDistance[]) => {
    newValue.sort((a, b) => a.distance - b.distance);
    supermarketList.value = newValue as SupermarketWithSchedulesAndDistance[];
    if (props.showDistance && props.supermarketList.length > 0 && props.supermarketList.some(s => (s as SupermarketWithSchedulesAndDistance).distance === undefined)) {
        throw new Error('Supermarket list must have distance property');
    }

    if (props.showSchedule && props.supermarketList.length > 0 && props.supermarketList.some(s => (s as SupermarketWithSchedulesAndDistance).schedules === undefined)) {
        throw new Error('Supermarket list must have schedules property');
    }
});

function handleSupermarketClick(supermarket: Supermarket) {
    store.commit(MUTATIONS.SET_SUPERMARKET, supermarket);
    router.push({
        path: '/tabs/products'
    });
}

function getScheduleForToday(supermarket: SupermarketWithSchedules) {
    const currentDayOfTheWeek = new Date().getDay();
    return supermarket.schedules.find(schedule => schedule.day === currentDayOfTheWeek);
}
</script>

<style scoped>
.info-container {
    gap: 1vh;
}

.distance-info {
    display: flex;
    align-items: center;
}

.distance-icon {
    font-size: 1.5rem;
    color: var(--ion-color-primary);
}

.schedule-info {
    background-color: var(--ion-color-light);
    padding: 10px;
    border-radius: 8px;
    margin-top: 10px;
    font-size: 0.9rem;
}

.schedule-info ion-label {
    display: block;
    margin: 5px 0;
}

.unavailable-text {
    text-align: center;
    width: 100%;
    display: block;
    margin: 2vh 0;
    color: var(--ion-color-medium);
    font-style: italic;
}
</style>
