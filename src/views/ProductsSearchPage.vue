<template>
  <ion-page>
    <ion-header>
      <ToolBar :show-back-button="true" :back-button-function="backFunction"></ToolBar>
    </ion-header>
    <ion-content class="ion-padding">
      <ion-label color="primary" class="title">{{ store.state.supermarket?.name }}</ion-label>

      <!-- Ion Segment for selecting search type -->
      <ion-segment :value="selectedSegment" @ionChange="segmentChanged">
        <ion-segment-button value="producto">
          <ion-label>Productos</ion-label>
        </ion-segment-button>
        <ion-segment-button value="categoria">
          <ion-label>Categorías</ion-label>
        </ion-segment-button>
      </ion-segment>

      <!-- Searchbars depending on selected segment -->
      <div v-if="selectedSegment === 'producto'">
        <!-- Toggle for stock only visible in 'producto' segment -->
        <ion-searchbar placeholder="Buscar producto/marca" @ionInput="searchProduct">
        </ion-searchbar>
        <ion-toggle labelPlacement="end" class="toggle-margin" @ion-change="handleFilterByStock">
          Mostrar productos con stock
        </ion-toggle>
        <PriceFilterChip v-if="isPriceFilterApplied" class="toggle-margin" :min="priceMin!" :max="priceMax!"
          :show="isPriceFilterApplied" @remove="removePriceFilter" />
        <ProductList :product-list="productListFiltered" :show-list-button="true">
        </ProductList>
      </div>
      <div v-else-if="selectedSegment === 'categoria'">
        <ion-searchbar placeholder="Buscar categoría" @ionInput="searchCategory">
        </ion-searchbar>
        <CategoryList :category-list="categoryListFiltered" @category-click="handleCategoryClick">
        </CategoryList>
      </div>

      <ion-fab horizontal="end" vertical="bottom" slot="fixed" v-if="selectedSegment === 'producto'">
        <ion-fab-button color="primary">
          <ion-icon :icon="chevronUpCircle"></ion-icon>
        </ion-fab-button>
        <ion-fab-list side="top">
          <ion-fab-button color="primary" data-desc="Filtrar por precio" @click="openPriceFilterModal">
            <ion-icon :icon="cashOutline"></ion-icon>
          </ion-fab-button>
        </ion-fab-list>
      </ion-fab>

      <!-- Price Filter Modal -->
      <ion-modal :is-open="isPriceFilterModalOpen" @didDismiss="closePriceFilterModal" class="price-filter-modal">
        <ion-header>
          <ion-toolbar>
            <ion-title>Filtrar por precio</ion-title>
            <ion-buttons slot="end">
              <ion-button @click="closePriceFilterModal">Cerrar</ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>
        <ion-content class="ion-padding">
          <ion-item>
            <ion-input type="number" @ion-input="handleFilterPriceInputChange($event, 'min')" label-placement="floating"
              label="Precio mínimo"></ion-input>
          </ion-item>
          <ion-item>
            <ion-input type="number" @ion-input="handleFilterPriceInputChange($event, 'max')" label-placement="floating"
              label="Precio máximo"></ion-input>
          </ion-item>
          <ion-button expand="full" class="modal-button" :disabled="priceMin === 0 && priceMax === Infinity"
            @click="applyPriceFilter">Confirmar</ion-button>
        </ion-content>
      </ion-modal>

    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonHeader, IonContent, IonLabel, IonSearchbar, IonSegment, IonSegmentButton, IonItem, IonButton, IonModal, IonToolbar, IonTitle, IonButtons, IonInput } from '@ionic/vue';
import { IonFab, IonFabButton, IonIcon, IonFabList, IonToggle } from '@ionic/vue';
import { chevronUpCircle, cashOutline } from 'ionicons/icons';
import ToolBar from './shared/ToolBar.vue';
import { getBySearch, getAll, getAllCategories } from '@/api/product';
import { onMounted, ref } from 'vue';
import { ProductFromSupermarket } from '@/entities/product';
import ProductList from './products/ProductList.vue';
import CategoryList from './products/CategoryList.vue';
import { ErrorView } from '@/api/errors/errorView';
import { Category } from '@/entities/category';
import PriceFilterChip from './products/PriceFilterChip.vue';
import { store } from '@/store/currentSupermarket';
import { useRouter } from 'vue-router';

const supermarketId = store.state.supermarket?.id as number;
const productList = ref<ProductFromSupermarket[]>([]);
const productListFiltered = ref<ProductFromSupermarket[]>([]);
const categoryList = ref<Category[]>([]);
const categoryListFiltered = ref<Category[]>([]);
const selectedSegment = ref("producto");
const productSearchQuery = ref<string>('');
const router = useRouter();

const isPriceFilterModalOpen = ref(false);
const priceMin = ref<number>(0);
const priceMax = ref<number>(Infinity);
const isPriceFilterApplied = ref(false);
const isStockToggleApplied = ref(false);

onMounted(async () => {
  await loadInitialData();
});

async function loadInitialData() {
  try {
    const products = await getAll(supermarketId);
    productList.value = products;
    productListFiltered.value = products;
  } catch (error) {
    if (error instanceof ErrorView) {
      error.showError();
    }
  }
  try {
    const categories = await getAllCategories(supermarketId);
    categoryList.value = categories;
    categoryListFiltered.value = categoryList.value;
  } catch (error) {
    if (error instanceof ErrorView) {
      error.showError();
    }
  }
}

function handleFilterPriceInputChange(event: any, type: 'min' | 'max') {
  const priceString = event.detail.value as string;
  try {
    const price = parseFloat(priceString);
    if (Number.isNaN(price)) {
      throw new Error('Price is not a number');
    }
    if (type === 'min') {
      priceMin.value = price;
    } else {
      priceMax.value = price;
    }
  } catch (error) {
    if (type === 'min') {
      priceMin.value = 0;
    } else {
      priceMax.value = Infinity;
    }
  }
}

function searchProduct(event: any) {
  const search = event.detail.value as string;
  productSearchQuery.value = search;
  applyFilters();
}

async function searchCategory(event: any) {
  const searchQuery = event.detail.value as string;
  categoryListFiltered.value = categoryList.value.filter(category => category.name.toLowerCase().includes(searchQuery.toLowerCase()));
}

function segmentChanged(event: any) {
  selectedSegment.value = event.detail.value;
}

function handleCategoryClick(category: Category) {
  const productListFilteredByCategory = productList.value.filter(product => product.categoryId === category.id);
  router.push({
    path: 'products/category',
    query: {
      productList: JSON.stringify(productListFilteredByCategory),
      categoryName: category.name
    }
  });
}

function handleFilterByStock() {
  isStockToggleApplied.value = !isStockToggleApplied.value;
  applyFilters();
}

function filterBySearch() {
  productListFiltered.value = productListFiltered.value.filter(product => product.name.toLowerCase().startsWith(productSearchQuery.value.toLowerCase()));
}

function filterByStock() {
  if (isStockToggleApplied.value) {
    productListFiltered.value = productListFiltered.value.filter(product => product.stock > 0);
  }
}

function filterByPrice() {
  if (isPriceFilterApplied.value) {
    productListFiltered.value = productListFiltered.value.filter(product => product.price >= priceMin.value!);
    productListFiltered.value = productListFiltered.value.filter(product => product.price <= priceMax.value!);
  }
}

function applyFilters() {
  productListFiltered.value = productList.value;
  filterBySearch();
  filterByStock();
  filterByPrice();
}

function openPriceFilterModal() {
  if (isPriceFilterApplied.value) {
    removePriceFilter();
  }
  isPriceFilterModalOpen.value = true;
}

function closePriceFilterModal() {
  isPriceFilterModalOpen.value = false;
}

function applyPriceFilter() {
  isPriceFilterApplied.value = true;
  applyFilters();
  closePriceFilterModal();
}

function removePriceFilter() {
  priceMin.value = 0;
  priceMax.value = Infinity;
  isPriceFilterApplied.value = false;
  applyFilters();
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

.toggle-margin {
  margin: 1vh 1vh;
}

ion-fab-button[data-desc] {
  position: relative;
}

ion-fab-button[data-desc]::after {
  position: absolute;
  content: attr(data-desc);
  z-index: 1;
  right: 55px;
  bottom: 4px;
  background-color: var(--ion-color-light);
  padding: 9px;
  border-radius: 15px;
  color: var(--ion-color-dark);
  box-shadow: 0 3px 5px -1px rgba(0, 0, 0, 0.2), 0 6px 10px 0 rgba(0, 0, 0, 0.14), 0 1px 18px 0 rgba(0, 0, 0, 0.12);
}

ion-toggle::part(label) {
  font-size: 0.8rem;
  color: #707070;
}

.price-filter-modal {
  --width: 300px;
  --height: 275px;
  --border-radius: 10px;
  --box-shadow: 0 3px 5px -1px rgba(0, 0, 0, 0.2), 0 6px 10px 0 rgba(0, 0, 0, 0.14), 0 1px 18px 0 rgba(0, 0, 0, 0.12);
}

.modal-button {
  margin-top: 10%;
}
</style>
