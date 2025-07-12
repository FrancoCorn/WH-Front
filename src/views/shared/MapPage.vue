<template>
  <ion-page>
    <ion-header>
      <ToolBar :show-back-button="true"></ToolBar>
    </ion-header>
    <ion-content :scroll-y="false">
      <iframe v-if="mapObjects.length > 0 && productsToGo.length > 0" key="mapIframe" class="map"
        :src="mapUrl + '/?supermarketId=' + supermarketId + '&entranceId=' + entranceId + '&checkoutId=' + checkoutId + '&products=' + JSON.stringify(mapObjects) + '&goToProducts=' + JSON.stringify(productsToGo)"></iframe>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonHeader, IonContent } from '@ionic/vue';
import ToolBar from './ToolBar.vue';
import { store } from '@/store/currentSupermarket';
import { ref, watch } from 'vue';
import { ProductFromSupermarket } from '@/entities/product';

const supermarketId = store.state.supermarket?.id as number;
const entranceId = store.state.supermarket?.entranceId as number;
const checkoutId = store.state.supermarket?.checkoutId as number;
const products = ref<ProductFromSupermarket[]>(store.state.products);
const mapUrl = import.meta.env.VITE_MAP_BACKEND_BASE_URL as string;

const mapObjects = ref(parseProductsToMapObjects(products.value));
const productsToGo: number[] = store.state.productsToGo.map((product) => product.id);

watch(() => store.state.products, (newProducts: ProductFromSupermarket[]) => {
  mapObjects.value = parseProductsToMapObjects(newProducts);
});

function parseProductsToMapObjects(products: ProductFromSupermarket[]): any[] {
  return products.map((product) => {
    return {
      name: product.name,
      id: product.id,
      location_x: product.location_x,
      location_y: product.location_y,
      description: product.description,
    };
  });
}

</script>

<style scoped>
.map {
  border: none;
  width: 100%;
  height: 100%;
}
</style>
