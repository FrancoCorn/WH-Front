import { Product, ProductFromSupermarket } from "@/entities/product";
import { getApiService } from "./api";
import { API_ENDPOINTS } from "./endpoints";
import { Category } from "@/entities/category";

export async function getAll(id: number): Promise<ProductFromSupermarket[]> {
    const api = getApiService();
    return await api.get(API_ENDPOINTS.PRODUCT_GET_ALL(id));
}

export async function getBySearch(idSupermarket: number, search: string): Promise<ProductFromSupermarket[]> {
    const api = getApiService();
    return await api.get(API_ENDPOINTS.PRODUCT_GET_BY_SEARCH(idSupermarket, search));
}

export async function getAllCategories(idSupermarket: number): Promise<Category[]> {
    const api = getApiService();
    return await api.get(API_ENDPOINTS.CATEGORY_GET_ALL(idSupermarket));
}

export async function getProductById(supermarketId: number, productId: number): Promise<ProductFromSupermarket> {
    const api = getApiService();
    return await api.get(API_ENDPOINTS.PRODUCT_GET_BY_ID(supermarketId, productId));
}