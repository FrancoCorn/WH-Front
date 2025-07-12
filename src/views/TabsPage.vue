<template>
  <ion-page>
    <ion-tabs v-if="supermarket">
      <ion-router-outlet :key="$route.fullPath">
      </ion-router-outlet>
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="products" href="/tabs/products">
          <ion-icon aria-hidden="true" :icon="pricetag"/>
          <ion-label>Productos</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="map" href="/tabs/list">
          <ion-icon aria-hidden="true" :icon="listOutline" />
          <ion-label>Lista</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="info" href="/tabs/info">
          <ion-icon aria-hidden="true" :icon="informationCircleOutline" />
          <ion-label>Información  </ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { IonTabBar, IonTabButton, IonTabs, IonLabel, IonIcon, IonPage, IonRouterOutlet } from '@ionic/vue';
import { informationCircleOutline, listOutline, pricetag } from 'ionicons/icons';
import { getAll } from '@/api/product';
import { MUTATIONS, store } from '@/store/currentSupermarket';

const route = useRoute();
const router = useRouter();
const supermarket = ref(store.state.supermarket);

store.commit(MUTATIONS.DELETE_PRODUCTS);
onMounted(async () => {
  if (!supermarket.value) {
    router.replace('/home');
    return;
  }
  const products = await getAll(store.state.supermarket?.id as number);
  store.commit(MUTATIONS.SET_PRODUCTS, products);
});
</script>