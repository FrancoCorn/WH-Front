import { InjectionKey } from 'vue'
import { createStore, Store } from 'vuex'
import { ProductFromSupermarket } from '@/entities/product'
import { Supermarket, SupermarketWithSchedules } from '@/entities/supermarket'

export interface State {
  supermarket: SupermarketWithSchedules | null;
  products: ProductFromSupermarket[];
  productsToGo: ProductFromSupermarket[];
  productList: ProductFromSupermarket[];
}

export const key: InjectionKey<Store<State>> = Symbol()

export const MUTATIONS = {
  SET_SUPERMARKET: 'SET_SUPERMARKET',
  SET_PRODUCTS: 'SET_PRODUCTS',
  DELETE_PRODUCTS: 'DELETE_PRODUCTS',
  CLEAR_STATE: 'CLEAR_STATE',
  SET_PRODUCTS_TO_GO: 'SET_PRODUCTS_TO_GO',
  DELETE_PRODUCTS_TO_GO: 'DELETE_PRODUCTS_TO_GO',

  ADD_PRODUCT_TO_LIST: 'ADD_PRODUCT_TO_LIST',
  DELETE_PRODUCT_FROM_LIST: 'DELETE_PRODUCT_FROM_LIST',
}

export const store = createStore<State>({
  state: {
    supermarket: null,
    products: [],
    productsToGo: [],
    productList: []
  },
  mutations: {
    [MUTATIONS.SET_SUPERMARKET](state, supermarket: SupermarketWithSchedules) {
      state.supermarket = supermarket;
    },
    [MUTATIONS.SET_PRODUCTS](state, products: ProductFromSupermarket[]) {
      state.products = products;
    },
    [MUTATIONS.DELETE_PRODUCTS](state) {
      state.products = [];
    },
    [MUTATIONS.CLEAR_STATE](state) {
      state.supermarket = null;
      state.products = [];
      state.productsToGo = [];
    },
    [MUTATIONS.SET_PRODUCTS_TO_GO](state, products: ProductFromSupermarket[]) {
      state.productsToGo = products;
    },
    [MUTATIONS.DELETE_PRODUCTS_TO_GO](state) {
      state.productsToGo = [];
    },
    [MUTATIONS.ADD_PRODUCT_TO_LIST](state, product: ProductFromSupermarket) {
      state.productList.push(product);
    },
    [MUTATIONS.DELETE_PRODUCT_FROM_LIST](state, product: ProductFromSupermarket) {
      state.productList = state.productList.filter(p => p.id !== product.id);
    }
  }
});

