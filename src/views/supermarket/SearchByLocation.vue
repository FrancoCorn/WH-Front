<template>
  <ion-page>
    <ion-header>
      <ToolBar :show-back-button="true"></ToolBar>
    </ion-header>

    <ion-content class="ion-padding">
      <ion-label color="primary" class="title">Búsqueda por ubicación</ion-label>

      <!-- Toggle para filtrar por horarios -->
      <ion-toggle labelPlacement="end" v-model="filterByHours" @ion-change="handleToggleChange">
        Filtrar por horarios
      </ion-toggle>

      <ion-select :disabled="coordinates === null" aria-label="Medida" interface="popover" placeholder="Medida"
        @ionChange="handleUnitChange" :value="medida.toString()">
        <ion-select-option value="1">Metros</ion-select-option>
        <ion-select-option value="1000">Kilómetros</ion-select-option>
      </ion-select>

      <ion-range v-model="rangeInSelectedUnit" :disabled="coordinates === null" aria-label="Range with ticks"
        :ticks="true" :snaps="true" :min="minRange" :max="maxRange" :step="stepRange" :pin="true"
        :pin-formatter="pinFormatter" @ion-change="handleRangeChange">
      </ion-range>


      <SupermarketList :supermarket-list="nearSupermarkets" :show-distance="true" :show-schedule="true" />

      <ion-button @click="updateCoordinates">Actualizar ubicación</ion-button>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import { IonPage, IonHeader, IonContent, IonLabel, IonButton, IonSelect, IonRange, IonSelectOption, IonToggle } from '@ionic/vue';
import { Geolocation } from '@capacitor/geolocation';
import { getByLocation } from '@/api/supermarket';
import { SupermarketWithSchedulesAndDistance } from '@/entities/supermarket';
import SupermarketList from './SupermarketList.vue';
import { getDistanceForSupermarkets } from '@/helper';
import ToolBar from '../shared/ToolBar.vue';

const range = ref(5000); // Siempre en metros internamente
const medida = ref(1000); // 1 para metros, 1000 para kilómetros
const filterByHours = ref(false); // Estado del toggle
let supermarketsSortedByDistance: SupermarketWithSchedulesAndDistance[] = [];
const nearSupermarkets = ref<SupermarketWithSchedulesAndDistance[]>([]);
const coordinates = ref<{ latitude: number, longitude: number } | null>(null);

const rangeInSelectedUnit = computed({
  get: () => range.value / medida.value,
  set: (newValue) => {
    range.value = newValue * medida.value;
  },
});

const minRange = computed(() => (medida.value === 1 ? 100 : 0.5));
const maxRange = computed(() => (medida.value === 1 ? 1000 : 10));
const stepRange = computed(() => (medida.value === 1 ? 100 : 0.5));

onMounted(async () => {
  const coords = await getCoordinates();
  coordinates.value = coords;
  await getSupermarketsByLocation(coords.latitude, coords.longitude);
});

async function getCoordinates() {
  const position = await Geolocation.getCurrentPosition();
  return position.coords;
}

async function getSupermarketsByLocation(latitude: number, longitude: number) {
  const supers = await getByLocation(latitude, longitude) as SupermarketWithSchedulesAndDistance[];
  const supersWithDistance = getDistanceForSupermarkets(
    { latitude, longitude },
    supers
  ) as SupermarketWithSchedulesAndDistance[];
  supermarketsSortedByDistance = supersWithDistance.sort((a, b) => a.distance - b.distance);
  updateNearSupermarkets();
}

function filterOpenBySchedule(supermarkets: SupermarketWithSchedulesAndDistance[]) {
  if (!filterByHours.value) return supermarkets;

  const currentDate = new Date();
  const currentHours = currentDate.getHours();
  const currentDayOfTheWeek = currentDate.getDay();

  return supermarkets
    .map((supermarket) => {
      const schedule = supermarket.schedules.find((sch) => sch.day === currentDayOfTheWeek);
      if (schedule && schedule.open <= currentHours && schedule.close > currentHours) {
        return { ...supermarket, schedules: [schedule] };
      }
      return null;
    })
    .filter((supermarket) => supermarket !== null) as SupermarketWithSchedulesAndDistance[];
}

function updateNearSupermarkets() {
  const maxDistance = range.value; // Siempre en metros
  let filteredSupermarkets = supermarketsSortedByDistance.filter(
    (supermarket) => supermarket.distance <= maxDistance
  );

  if (filterByHours.value) {
    filteredSupermarkets = filterOpenBySchedule(filteredSupermarkets);
  }

  nearSupermarkets.value = filteredSupermarkets;
}

async function updateCoordinates() {
  coordinates.value = await getCoordinates();
  await getSupermarketsByLocation(coordinates.value!.latitude, coordinates.value!.longitude);
}

function handleRangeChange(ev: any) {
  rangeInSelectedUnit.value = ev.detail.value;
  updateNearSupermarkets();
}

function handleUnitChange(ev: any) {
  medida.value = parseInt(ev.detail.value);
  if (medida.value === 1 && range.value > 1000) {
    range.value = 1000;
  }
  if (medida.value === 1000 && range.value < 500) {
    range.value = 500;
  }
  updateNearSupermarkets();
}

function handleToggleChange() {
  updateNearSupermarkets();
}

function pinFormatter(value: number) {
  return medida.value === 1000 ? `${value.toFixed(1)} km` : `${value} m`;
}
</script>

<style scoped>
.title {
  font-size: 2rem;
  font-weight: bold;
  display: block;
  margin-bottom: 2vh;
}

ion-toggle::part(label) {
  font-size: 0.8rem;
  color: #707070;
}

ion-select {
  margin-top: 1vh;
}

ion-range {
  padding: 0;
}
</style>
