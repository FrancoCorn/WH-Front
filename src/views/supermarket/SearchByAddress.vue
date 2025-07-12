<template>
  <ion-page>
    <ion-header>
      <ToolBar :show-back-button="true"></ToolBar>
    </ion-header>

    <ion-content class="ion-padding">
      <ion-label color="primary" class="title">Búsqueda por dirección</ion-label>

      <ion-searchbar placeholder="Busca por dirección" :debounce="200" @ion-input="searchSupermarketsByAddress">
      </ion-searchbar>

      <ion-toggle class="toggle-margin" labelPlacement="end" v-model="filterByHours" @ion-change="handleToggleChange">
        Filtrar por horarios
      </ion-toggle>

      <ion-select aria-label="Medida" interface="popover" placeholder="Medida" @ionChange="handleUnitChange"
        :value="medida.toString()">
        <ion-select-option value="1">Metros</ion-select-option>
        <ion-select-option value="1000">Kilómetros</ion-select-option>
      </ion-select>

      <ion-range v-model="rangeInSelectedUnit" aria-label="Range with ticks" :disabled="!address" :ticks="true"
        :snaps="true" :min="minRange" :max="maxRange" :step="stepRange" :pin="true" :pin-formatter="pinFormatter"
        @ion-change="handleRangeChange">
      </ion-range>

      <SupermarketList style="position:relative" :supermarket-list="supermarketListFiltered" :show-distance="true"
        :show-schedule="true">
      </SupermarketList>

      <ion-toast
        :is-open="toastOpen"
        :message="toastMessage"
        duration="3000"
        color="danger"
        @didDismiss="() => (toastOpen = false)"
      ></ion-toast>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { IonPage, IonHeader, IonContent, IonLabel, IonSearchbar, IonSelect, IonRange, IonSelectOption, IonToggle, IonToast } from '@ionic/vue';
import ToolBar from '../shared/ToolBar.vue';
import SupermarketList from './SupermarketList.vue';
import { SupermarketWithSchedules, SupermarketWithSchedulesAndDistance } from '@/entities/supermarket';
import { getAll } from '@/api/supermarket';
import { getDistanceForSupermarkets } from '@/helper';

const medida = ref(1000);
const range = ref(5000);
const supermarketList = ref<SupermarketWithSchedules[]>([]);
const supermarketListFiltered = ref<SupermarketWithSchedulesAndDistance[]>([]);
const filterByHours = ref(false);
const address = ref('');
let currentCoordinates = ref<{ latitude: number; longitude: number } | null>(null);
const toastOpen = ref(false);
const toastMessage = ref('');

const rangeInSelectedUnit = computed({
  get: () => range.value / medida.value,
  set: (newValue) => {
    range.value = newValue * medida.value;
  },
});

const minRange = computed(() => (medida.value === 1 ? 100 : 0.5));
const maxRange = computed(() => (medida.value === 1 ? 1000 : 10));
const stepRange = computed(() => (medida.value === 1 ? 100 : 0.5));

async function getCoordinates(address: string) {
  try {
    const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`);
    const data = await response.json();

    if (data.length > 0) {
      return {
        latitude: parseFloat(data[0].lat),
        longitude: parseFloat(data[0].lon),
      };
    } else {
      throw new Error('No se pudo obtener la ubicación');
    }
  } catch (error) {
    console.error('Error al obtener las coordenadas:', error);
    throw new Error('No se pudo obtener la ubicación');
  }
}

function filterOpenByDistanceAndSchedule(supermarkets: SupermarketWithSchedulesAndDistance[]) {
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

async function searchSupermarketsByAddress(event: any) {
  const newAddress = event.detail.value;
  address.value = newAddress;

  if (!address.value) {
    supermarketList.value = [];
    supermarketListFiltered.value = [];
    currentCoordinates.value = null;
    return;
  }

  try {
    const coordinates = await getCoordinates(address.value);
    currentCoordinates.value = coordinates;

    const allSupermarkets = await getAll();
    supermarketList.value = allSupermarkets;

    const supermarketsWithDistance = getDistanceForSupermarkets(coordinates, supermarketList.value) as SupermarketWithSchedulesAndDistance[];
    supermarketListFiltered.value = filterOpenByDistanceAndSchedule(
      supermarketsWithDistance.filter((s) => s.distance <= range.value)
    );
  } catch (error) {
    supermarketList.value = [];
    supermarketListFiltered.value = [];
    currentCoordinates.value = null;
    showToast('La dirección ingresada no existe. Inténtalo de nuevo.');
  }
}

function showToast(message: string) {
  toastMessage.value = message;
  toastOpen.value = true;
}

function handleRangeChange(ev: any) {
  rangeInSelectedUnit.value = ev.detail.value;
  if (currentCoordinates.value) {
    updateFilteredSupermarkets();
  }
}

function updateFilteredSupermarkets() {
  if (!currentCoordinates.value || supermarketList.value.length === 0) return;

  const supermarketsWithDistance = getDistanceForSupermarkets(currentCoordinates.value, supermarketList.value) as SupermarketWithSchedulesAndDistance[];
  supermarketListFiltered.value = filterOpenByDistanceAndSchedule(
    supermarketsWithDistance.filter((s) => s.distance <= range.value)
  );
}

function handleUnitChange(ev: any) {
  medida.value = parseInt(ev.detail.value);
  if (medida.value === 1 && range.value > 1000) range.value = 1000;
  if (medida.value === 1000 && range.value < 500) range.value = 500;
  updateFilteredSupermarkets();
}

function handleToggleChange() {
  if (filterByHours.value) {
    supermarketListFiltered.value = filterOpenByDistanceAndSchedule(supermarketListFiltered.value);
  } else {
    updateFilteredSupermarkets();
  }
}

function pinFormatter(value: number) {
  return medida.value === 1000 ? `${value.toFixed(1)} km` : `${value} m`;
}
</script>

<style scoped>
.title {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 2vh;
}

ion-toggle::part(label) {
  font-size: 0.8rem;
  color: #707070;
}

.toggle-margin {
  margin: 1vh 1vh;
}

ion-range {
  padding: 0;
}
</style>
