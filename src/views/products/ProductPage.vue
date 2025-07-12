<template>
    <ion-page>
        <ion-header>
            <ToolBar :show-back-button="true"></ToolBar>
        </ion-header>
        <ion-content class="ion-padding">
            <div v-if="product">
                <ion-card>
                    <div class="image-container">
                        <div class="image-placeholder" v-if="imageLoading">
                            <ion-spinner name="dots" color="dark" />
                        </div>
                        <ion-img :src="product.image" alt="Product Image" class="product-image"
                            @load="imageLoading = false" />
                    </div>
                    <ion-card-header>
                        <ion-card-title>{{ product.name }}</ion-card-title>
                    </ion-card-header>
                    <ion-card-content>
                        <p>{{ product.description }}</p>
                        <ion-item lines="full">
                            <ion-label>Precio: ${{ product.price }}</ion-label>
                        </ion-item>
                        <ion-item lines="full">
                            <ion-label>Stock: {{ product.stock }}</ion-label>
                        </ion-item>
                    </ion-card-content>
                </ion-card>
            </div>
            <div v-else>
                <ProductSkeleton />
            </div>
        </ion-content>
    </ion-page>
</template>

<script setup lang="ts">
import { getProductById } from '@/api/product';
import { IonCard, IonCardContent, IonContent, IonPage, IonItem, IonLabel, IonSpinner, IonCardHeader, IonCardTitle, IonImg, IonHeader } from '@ionic/vue';
import { ProductFromSupermarket } from '@/entities/product';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import ProductSkeleton from './ProductSkeleton.vue';
import ToolBar from '../shared/ToolBar.vue';
import { store } from '@/store/currentSupermarket';

const route = useRoute();
const product = ref<ProductFromSupermarket | null>(null);
const imageLoading = ref(true);
const supermarketId = store.state.supermarket?.id as number;
const productId = Number(route.params.productId);

onMounted(async () => {
    product.value = await getProductById(supermarketId, productId);
});
</script>

<style scoped>
.image-container {
    position: relative;
    width: 100%;
    height: 300px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: black;
}

.image-placeholder {
    position: absolute;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.product-image {
    position: absolute;
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
}
</style>
