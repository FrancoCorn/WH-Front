<template>
  <ion-card v-if="productList.length > 0" v-for="p in productList" :key="p.id" @click="handleProductClick(p)">
    <ion-card-header class="header">
      <ion-card-title class="card-title">{{ p.name }}</ion-card-title>
      <div class="nav-content" @click="handleNavigationClick($event, p)">
        <ion-icon :icon="navigateCircleOutline" class="navigate-icon"></ion-icon>
        <span class="nav-text">Ver en mapa</span>
      </div>
    </ion-card-header>
    <ion-card-content>
      <ion-chip v-if="p.stock === 0" color="danger" class="stock-chip">Sin Stock</ion-chip>
      <ion-chip v-else class="stock-chip" color="medium">{{ p.stock }} unidades</ion-chip>
      <br><ion-chip class="stock-chip" color="medium">${{ p.price }}</ion-chip>

      <div class="button-container" v-if="showListButton && p.stock > 0">
        <ion-button v-if="!isProductInList(p)" fill="clear" color="primary" @click="handleAddClick($event, p)">
          <ion-icon :icon="addCircleOutline" slot="start"></ion-icon>
          Agregar a la lista
        </ion-button>

        <ion-button v-else fill="clear" color="danger" @click="handleRemoveClick($event, p)">
          <ion-icon :icon="removeCircleOutline" slot="start"></ion-icon>
          Quitar de la lista
        </ion-button>
      </div>
    </ion-card-content>
  </ion-card>
  <ion-label v-else class="unavailable-text">{{ noProductsMessage }}</ion-label>
</template>

<script setup lang="ts">
import { IonIcon } from '@ionic/vue';
import { addCircleOutline, navigateCircleOutline, removeCircleOutline } from 'ionicons/icons';
import { ProductFromSupermarket } from '@/entities/product';
import { IonCard, IonCardHeader, IonButton, IonCardContent, IonCardTitle, IonLabel, IonChip } from '@ionic/vue';
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { MUTATIONS, store } from '@/store/currentSupermarket';

const props = defineProps({
  productList: {
    type: Array<ProductFromSupermarket>,
    required: true
  },
  noProductsMessage: {
    type: String,
    default: 'No hay productos disponibles'
  },
  showListButton: {
    type: Boolean,
    default: false
  }
});

const router = useRouter();
const productList = ref<(ProductFromSupermarket)[]>(props.productList);


watch(() => props.productList, (newValue: ProductFromSupermarket[]) => {
  productList.value = newValue;
});

function handleProductClick(product: ProductFromSupermarket) {
  router.push({
    path: `/tabs/products/product/${product.id}`
  });
}

function isProductInList(product: ProductFromSupermarket) {
  for (const p of store.state.productList) {
    if (p.id === product.id) {
      return true;
    }
  }
  return false;
};

function handleAddClick(event: any, product: ProductFromSupermarket) {
  event.stopPropagation();
  store.commit(MUTATIONS.ADD_PRODUCT_TO_LIST, product);
}

function handleRemoveClick(event: any, product: ProductFromSupermarket) {
  event.stopPropagation();
  store.commit(MUTATIONS.DELETE_PRODUCT_FROM_LIST, product);
}


function handleNavigationClick(event: any, product: ProductFromSupermarket) {
  event.stopPropagation();
  store.commit(MUTATIONS.SET_PRODUCTS_TO_GO, [product]);
  router.push({
    path: '/map'
  });
}

</script>

<style scoped>
.info-container {
  gap: 1vh;
}

.button-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 1vh;
}

.chip-container {
  flex: 1;
}

.header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 5vw;

}

.card-title {
  flex: 1;
  min-width: 0;
}

.nav-content {
  display: flex;
  flex-direction: column;
  color: var(--ion-color-primary);
  /* Change to column layout */
  align-items: center;
}

.nav-text {
  white-space: normal;
  /* Allow text to wrap */
  text-align: center;
  font-size: 12px;
  /* Make text slightly smaller */
  line-height: 1.2;
}

.navigate-icon {
  width: 24px;
  height: 24px;
}

.unavailable-text {
  text-align: center;
  width: 100%;
  display: block;
  margin: 2vh 0;
  color: var(--ion-color-medium);
  font-style: italic;
}

.stock-chip {
  width: max-content;
}
</style>
