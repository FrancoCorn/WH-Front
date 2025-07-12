<template>
  <ion-page>
    <ion-header>
      <ToolBar></ToolBar>
    </ion-header>

    <ion-content class="ion-padding">
      <div class="boxes-container">
        <!-- Caja para búsqueda por nombre -->
        <div class="search-box" @click="navigateTo('/search-by-name')">
          <ion-icon :icon="searchOutline" class="icon"></ion-icon>
          <ion-label class="box-title">Búsqueda por nombre</ion-label>
        </div>

        <!-- Caja para búsqueda por dirección -->
        <div class="search-box" @click="navigateTo('/search-by-address')">
          <ion-icon :icon="map" class="icon"></ion-icon>
          <ion-label class="box-title">Búsqueda por dirección</ion-label>
        </div>

        <!-- Caja para búsqueda por cercanía -->
        <div class="search-box" @click="navigateTo('/search-by-location')">
          <ion-icon :icon="locationOutline" class="icon"></ion-icon>
          <ion-label class="box-title">Búsqueda por cercanía</ion-label>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonHeader, IonContent, IonLabel, IonIcon } from '@ionic/vue';
import { searchOutline, map, locationOutline } from 'ionicons/icons';
import { useRouter } from 'vue-router';
import ToolBar from '../shared/ToolBar.vue';

const router = useRouter();

function navigateTo(path: string) {
  router.push(path);
}
</script>

<style scoped>
.boxes-container {
  display: flex;
  flex-direction: column;
  gap: 10%;
  height: 100%;
  justify-content: center;
}

/* Cajas individuales */
.search-box {
  width: 100%;
  max-width: 90%;
  height: 15%;
  min-height: 80px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  background-color: var(--ion-color-light);
  border: 2px solid var(--ion-color-primary);
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  padding: 0 20px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  margin: 0 auto;
}

.search-box:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.icon {
  font-size: 5rem;
  color: var(--ion-color-primary);
  margin-right: 15px;
}

.box-title {
  font-size: 1.2rem;
  font-weight: bold;
  color: var(--ion-color-dark);
}
</style>
