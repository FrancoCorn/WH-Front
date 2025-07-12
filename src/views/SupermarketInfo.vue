<template>
  <ion-page>
    <ion-header>
      <ToolBar :show-back-button="true" :back-button-function="backFunction"></ToolBar>
    </ion-header>
    <ion-content class="ion-padding">
      <ion-label color="primary" class="title">Información</ion-label>
      <div v-if="supermarket" class="supermarket-details">
        <h2>{{ supermarket.name }}</h2>
        <p class="details">Dirección: </p>
        <p> {{ supermarket.address }}</p>
        <p class="details">Horarios:</p>
        <ul>
          <ion-item v-for="schedule in supermarket.schedules" :key="schedule.day" class="schedule-item">
            {{ formatDay(schedule.day) }}: {{ formatHours(schedule.open, schedule.close) }}
          </ion-item>
        </ul>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonContent, IonHeader, IonPage, IonLabel, IonItem } from '@ionic/vue';
import { store } from '@/store/currentSupermarket';
import router from '@/router';
import ToolBar from './shared/ToolBar.vue';

function formatDay(day: number): string {
  const daysOfWeek = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  return daysOfWeek[day];
}

function formatHours(open: number, close: number): string {
  return `${open}:00 - ${close}:00`;
}

function backFunction() {
  router.replace('/home');
}

const supermarket = store.state.supermarket;
</script>

<style scoped>
.title {
  font-size: 2rem;
  font-weight: bold;
  display: block;
  margin-bottom: 2vh;
}

.details {
  font-size: 1rem;
  text-decoration: underline;
  margin-top: 20px;
}
</style>