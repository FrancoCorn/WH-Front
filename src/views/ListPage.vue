<template>
  <ion-page>
    <ion-header>
      <ToolBar :show-back-button="true" :back-button-function="backFunction"></ToolBar>
    </ion-header>
    <ion-content class="ion-padding">
      <ion-label color="primary" class="title">Mi lista</ion-label>
      <ion-button @click="handleClick" class="search-map-button" :disabled="productList.length === 0">Ver
        recorrido</ion-button>
      <ProductList :product-list="productList" :show-list-button="true"
        :no-products-message="'No hay productos en la lista'"></ProductList>

    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonHeader, IonContent, IonLabel, IonButton } from '@ionic/vue';
import ToolBar from './shared/ToolBar.vue';
import { MUTATIONS, store } from '@/store/currentSupermarket';
import { ref, watch } from 'vue';
import { ProductFromSupermarket } from '@/entities/product';
import router from '@/router';
import { close } from 'ionicons/icons';
import ProductList from './products/ProductList.vue';

const productList = ref<ProductFromSupermarket[]>(store.state.productList);
watch(() => store.state.productList, (newProductList: ProductFromSupermarket[]) => {
  productList.value = newProductList;
});

function handleClick() {
  store.commit(MUTATIONS.SET_PRODUCTS_TO_GO, productList.value);
  router.push({
    path: '/map'
  });
}

function backFunction() {
  router.replace('/home');
}

</script>

<style scoped>
.title {
  font-size: 2rem;
  font-weight: bold;
  display: block;
  margin-bottom: 2vh;
}

.search-map-button {
  width: 100%;
}
</style>
