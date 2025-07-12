<template>
    <ion-page>
        <ion-header>
            <ToolBar :show-back-button="true"></ToolBar>
        </ion-header>
        <ion-content class="ion-padding">
            <ion-label color="primary" class="title">{{ categoryName }}</ion-label>

            <ion-searchbar placeholder="Buscar producto/marca" @ionInput="searchProduct"></ion-searchbar>
            <ion-toggle labelPlacement="end" class="toggle-margin" @ion-change="handleFilterByStock">Mostrar
                productos con
                stock</ion-toggle>
            <!-- Filtro de precio -->
            <PriceFilterChip v-if="isPriceFilterApplied" class="toggle-margin" :min="(priceMin as number)"
                :max="(priceMax as number)" :show="isPriceFilterApplied" @remove="removePriceFilter" />
            <ProductList :product-list="productListFiltered" :show-list-button="true"></ProductList>

            <!-- Botón para abrir modal de filtro de precio -->
            <ion-fab horizontal="end" vertical="bottom" slot="fixed">
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
                        <ion-input type="number" @ion-input="handleFilterPriceInputChange($event, 'min')"
                            label-placement="floating" label="Precio mínimo"></ion-input>
                    </ion-item>
                    <ion-item>
                        <ion-input type="number" @ion-input="handleFilterPriceInputChange($event, 'max')"
                            label-placement="floating" label="Precio máximo"></ion-input>
                    </ion-item>
                    <ion-button expand="full" class="modal-button" :disabled="priceMin === 0 && priceMax === Infinity"
                        @click="applyPriceFilter">Confirmar</ion-button>
                </ion-content>
            </ion-modal>

        </ion-content>
    </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonHeader, IonContent, IonLabel, IonSearchbar, IonToggle, IonFab, IonFabButton, IonIcon, IonModal, IonToolbar, IonTitle, IonButtons, IonInput, IonItem, IonButton, IonFabList } from '@ionic/vue';
import { chevronUpCircle } from 'ionicons/icons';
import ToolBar from '../shared/ToolBar.vue';
import { cashOutline } from 'ionicons/icons';
import ProductList from './ProductList.vue';
import { ref } from 'vue';
import PriceFilterChip from './PriceFilterChip.vue';
import { ProductFromSupermarket } from '@/entities/product';

const props = defineProps({
    productList: {
        type: Array<ProductFromSupermarket>,
        required: true
    },
    categoryName: {
        type: String,
        required: true
    }
});

const productListFiltered = ref(props.productList);
const productSearchQuery = ref<string>('');
const isPriceFilterModalOpen = ref(false);
const priceMin = ref<number>(0);
const priceMax = ref<number>(Infinity);
const isPriceFilterApplied = ref(false);
const isStockToggleApplied = ref(false);

function searchProduct(event: any) {
    const search = event.detail.value as string;
    productSearchQuery.value = search;
    applyFilters();
}

function handleFilterByStock() {
    isStockToggleApplied.value = !isStockToggleApplied.value;
    applyFilters();
}

function applyPriceFilter() {
    isPriceFilterApplied.value = true;
    applyFilters();
    closePriceFilterModal();
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
    productListFiltered.value = props.productList;
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

function closePriceFilterModal() {
    isPriceFilterModalOpen.value = false;
}


function removePriceFilter() {
    priceMin.value = 0;
    priceMax.value = Infinity;
    isPriceFilterApplied.value = false;
    applyFilters();
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

ion-toggle::part(label) {
    font-size: 0.8rem;
    color: #707070;
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