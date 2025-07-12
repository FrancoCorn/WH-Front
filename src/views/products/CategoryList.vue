<template>
  <ion-card v-if="categoryList.length > 0" v-for="s in categoryList" :key="s.id"
      @click="handleClick(s)">
      <ion-card-header>
          <ion-card-title>{{ s.name }}</ion-card-title>
      </ion-card-header>

  </ion-card>

  <ion-label v-else class="unavailable-text">No hay categorias disponibles</ion-label>
</template>

<script setup lang="ts">
import { Category } from '@/entities/category';
import { IonCard, IonCardHeader, IonCardTitle, IonLabel } from '@ionic/vue';
import { ref, watch } from 'vue';

const props = defineProps({
  categoryList: {
      type: Array<Category>,
      required: true
  },
});

const emit = defineEmits(["categoryClick"])
const categoryList = ref<(Category)[]>(props.categoryList);

watch(() => props.categoryList, (newValue: Category[]) => {
  categoryList.value = newValue;
});

function handleClick(category: Category) {
  emit('categoryClick', category);
}

</script>

<style scoped>
.info-container {
  gap: 1vh;
}

.unavailable-text {
  text-align: center;
  width: 100%;
  display: block;
  margin: 2vh 0;
  color: var(--ion-color-medium);
  font-style: italic;
}
</style>
