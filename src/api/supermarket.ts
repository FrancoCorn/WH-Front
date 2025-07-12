import { Supermarket, SupermarketWithSchedules } from "@/entities/supermarket";
import { getApiService } from "./api";
import { API_ENDPOINTS } from "./endpoints";

export async function getAll(): Promise<SupermarketWithSchedules[]> {
    const api = getApiService();
    return await api.get(API_ENDPOINTS.SUPERMARKET_GET_ALL);
}

export async function getById(id: number): Promise<SupermarketWithSchedules> {
    const api = getApiService();
    return await api.get(API_ENDPOINTS.SUPERMARKET_GET_BY_ID(id));
}

export async function getBySearch(search: string): Promise<SupermarketWithSchedules[]> {
    const api = getApiService();
    return await api.get(API_ENDPOINTS.SUPERMARKET_GET_BY_SEARCH(search));
}

export async function getByLocation(latitude: number, longitude: number): Promise<SupermarketWithSchedules[]> {
    const api = getApiService();
    return await api.get(API_ENDPOINTS.SUPERMARKET_GET_BY_LOCATION(latitude, longitude));
}

export async function getBySchedule(day: number, hourStart: number, hourEnd: number): Promise<SupermarketWithSchedules[]> {
    const api = getApiService();
    return await api.get(API_ENDPOINTS.SUPERMARKET_GET_BY_SCHEDULE(day, hourStart, hourEnd));
}