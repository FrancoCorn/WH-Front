
export type Product = {
    id: number;
    name: string;
    description: string;
    image: string;
    categoryId: number;
}

export type ProductsToSupermarkets = {
    supermarketId: number;
    productId: number;
    stock: number;
    price: number;
}

export type ProductFromSupermarket = Product & {
    stock: number;
    price: number;
    location_x: number;
    location_y: number;
}


