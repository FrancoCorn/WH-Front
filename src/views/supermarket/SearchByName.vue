<template>
  <ion-page>
    <ion-header>
      <ToolBar :show-back-button="true"></ToolBar>
    </ion-header>

    <ion-content class="ion-padding">
      <ion-label color="primary" class="title">Búsqueda por nombre</ion-label>

      <!-- Campo de búsqueda -->
      <ion-searchbar :debounce="200" placeholder="Busca tu supermercado" @ionInput="handleSearch">
      </ion-searchbar>

      <!-- Toggle para filtrar por horarios -->
      <ion-toggle class="toggle-margin" labelPlacement="end" v-model="filterByHours" @ion-change="handleToggleChange">
        Filtrar por horarios
      </ion-toggle>

      <!-- Lista de supermercados filtrados -->
      <SupermarketList :supermarket-list="supermarketListFiltered" :show-distance="true" :show-schedule="true">
      </SupermarketList>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { IonPage, IonHeader, IonContent, IonLabel, IonSearchbar, IonToggle } from '@ionic/vue';
import { Geolocation } from '@capacitor/geolocation';
import { getBySearch } from '@/api/supermarket';
import { getDistanceForSupermarkets } from '@/helper';
import { SupermarketWithSchedulesAndDistance } from '@/entities/supermarket';
import SupermarketList from './SupermarketList.vue';
import ToolBar from '../shared/ToolBar.vue';

const supermarketList = ref<SupermarketWithSchedulesAndDistance[]>([]);
const supermarketListFiltered = ref<SupermarketWithSchedulesAndDistance[]>([]);
const filterByHours = ref(false);
const coordinates = ref<{ latitude: number, longitude: number } | null>(null);

async function handleSearch(event: any) {
  const search = event.detail.value; // Valor ingresado por el usuario
  const supers = await getBySearch(search); // Llamada a la API para buscar supermercados

  // Calcular distancias desde la ubicación del usuario
  const supersWithDistance = getDistanceForSupermarkets(coordinates.value!, supers) as SupermarketWithSchedulesAndDistance[];

  supermarketList.value = supersWithDistance;
  supermarketListFiltered.value = filterOpen(supersWithDistance); // Filtrar según el estado del toggle
}

function filterOpen(supermarkets: SupermarketWithSchedulesAndDistance[]) {
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

function handleToggleChange() {
  supermarketListFiltered.value = filterOpen(supermarketList.value); // Refiltrar al cambiar el toggle
}

async function getUserCoordinates() {
  const position = await Geolocation.getCurrentPosition();
  return position.coords;
}

onMounted(async () => {
  try {
    coordinates.value = await getUserCoordinates(); // Obtener ubicación del usuario
    const supers = await getBySearch(''); // Carga inicial sin filtro
    const supersWithDistance = getDistanceForSupermarkets(coordinates.value!, supers) as SupermarketWithSchedulesAndDistance[];

    supermarketList.value = supersWithDistance;
    supermarketListFiltered.value = filterOpen(supersWithDistance); // Inicializar lista filtrada
  } catch (e) {
    console.error('Error al cargar supermercados o ubicación:', e);
  }
});
</script>

<style scoped>
.title {
  font-size: 1.8rem;
  font-weight: bold;
  display: block;
  margin-bottom: 2vh;
}

ion-toggle::part(label) {
  font-size: 0.8rem;
  color: #707070;
}

ion-input {
  margin-bottom: 2vh;
}

.toggle-margin {
  margin: 1vh 1vh;
}
</style>
