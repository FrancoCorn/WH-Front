<template>
    <ion-item class="custom-ion-item">
        <div class="skeleton-container">
            <ion-thumbnail class="custom-thumbnail">
                <ion-skeleton-text animated class="custom-skeleton"></ion-skeleton-text>
            </ion-thumbnail>
            <ion-label class="custom-label">
                <p>
                    <ion-skeleton-text animated style="width: 30%; height: 20px; margin-top: 20px;"></ion-skeleton-text>
                </p>
                <p>
                    <ion-skeleton-text animated style="width: 60%; height: 20px;"></ion-skeleton-text>
                </p>
                <h3>
                    <ion-skeleton-text animated
                        style="width: 30%; height: 20px; margin-left: 20px;"></ion-skeleton-text>
                    <ion-skeleton-text animated
                        style="width: 30%; height: 20px; margin-left: 20px; margin-top: 10px;"></ion-skeleton-text>
                </h3>
            </ion-label>
        </div>
    </ion-item>
</template>

<script setup lang="ts">
import { IonItem, IonLabel, IonThumbnail, IonSkeletonText } from '@ionic/vue';
</script>

<style scoped>
.custom-ion-item {
    width: 100%;
    padding: 10px;
}

.skeleton-container {
    display: flex;
    flex-direction: column;
    width: 100%;
}

.custom-thumbnail {
    flex: 0;
    width: 400px;
    height: 400px;
}

.custom-label {
    flex: 1;
    width: 300px;
}

.custom-skeleton {
    width: 100%;
    height: 300px;
}
</style>