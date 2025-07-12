
export type Schedule = {
    day: number; 
    open: number; 
    close: number; 
};

export type Supermarket = {
    id: number;
    name: string;
    address: string;
    latitude: number;
    longitude: number;
    entranceId: number;
    checkoutId: number;
}

export type SupermarketWithSchedules = Supermarket & {
    schedules: Schedule[]
}

export type SupermarketWithDistance = Supermarket & {
    distance: number;
}

export type SupermarketWithSchedulesAndDistance = SupermarketWithSchedules & SupermarketWithDistance;
