import { Supermarket, SupermarketWithDistance } from "./entities/supermarket";

export function getDistanceForSupermarkets(coordinates: { latitude: number, longitude: number }, supermarkets: Supermarket[]): SupermarketWithDistance[] {
    const supermarketsWithDistance = supermarkets.map(supermarket => {
        const distance = calculateDistance(coordinates, { latitude: supermarket.latitude, longitude: supermarket.longitude });
        return { ...supermarket, distance };
    });

    return supermarketsWithDistance;
}


function calculateDistance(point1: { latitude: number, longitude: number }, point2: { latitude: number, longitude: number }): number {
    const toRadians = (degrees: number) => degrees * (Math.PI / 180);
    const R = 6371000; // Radius of the Earth in meters
    const lat1 = toRadians(point1.latitude);
    const lon1 = toRadians(point1.longitude);
    const lat2 = toRadians(point2.latitude);
    const lon2 = toRadians(point2.longitude);

    const dLat = lat2 - lat1;
    const dLon = lon2 - lon1;

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1) * Math.cos(lat2) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
}