export const BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL || 'http://localhost:3000';

export const API_ENDPOINTS = {
    // Supermarkets
    SUPERMARKET_GET_ALL: `/supermarket`,
    SUPERMARKET_GET_BY_LOCATION: (latitude: number, longitude: number) => `/supermarket/location?latitude=${latitude}&longitude=${longitude}`,
    SUPERMARKET_GET_BY_SEARCH: (searchQuery: string) => `/supermarket/search?query=${searchQuery}`,
    SUPERMARKET_GET_BY_SCHEDULE: (day: number, hourStart: number, hourEnd: number) => `/supermarket/schedule?day=${day}&hourStart=${hourStart}&hourEnd=${hourEnd}`,
    SUPERMARKET_GET_BY_ID: (id: number) => `/supermarket/id/${id}`,

    //Products
    PRODUCT_GET_BY_SEARCH: (id: number, search: string) => `/products/search/name?query=${search}&supermarketId=${id}`,
    PRODUCT_GET_ALL: (id: number) => `/products?supermarketId=${id}`,
    PRODUCT_GET_BY_ID: (supermarketId: number, productId: number) => `/products/${supermarketId}/${productId}`,

    //Categories
    CATEGORY_GET_ALL: (id: number) => `/products/category?supermarketId=${id}`,

}
