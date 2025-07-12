import { createRouter, createWebHistory } from "@ionic/vue-router";
import { RouteRecordRaw } from "vue-router";
import TabsPage from "../views/TabsPage.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: "/home",
  },
  {
    path: "/search-by-name",
    component: () => import("@/views/supermarket/SearchByName.vue"),
  },
  {
    path: "/search-by-address",
    component: () => import("@/views/supermarket/SearchByAddress.vue"),
  },
  {
    path: "/search-by-location",
    component: () => import("@/views/supermarket/SearchByLocation.vue"),
  },
  {
    path: "/home",
    component: () => import("@/views/supermarket/SupermarketPage.vue"),
  },
  {
    path: "/tabs/",
    component: TabsPage,
    children: [
      {
        path: "",
        redirect: "/tabs/products",
      },
      {
        path: "products",
        component: () => import("@/views/ProductsSearchPage.vue"),
      },
      {
        path: "list",
        component: () => import("@/views/ListPage.vue"),
      },

      {
        path: "info",
        component: () => import("@/views/SupermarketInfo.vue"),
      },
      {
        path: "products/category",
        component: () => import("@/views/products/CategoryPage.vue"),
        props: (route) => ({
          productList: JSON.parse(route.query.productList as string),
          categoryName: route.query.categoryName,
        }),
      },
      {
        path: "products/product/:productId",
        component: () => import("@/views/products/ProductPage.vue"),
      },
    ],
  },
  {
    path: "/map",
    component: () => import("@/views/shared/MapPage.vue"),
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
