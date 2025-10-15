export interface Gem {
    id?: string;
    name: string;
    status?: string;
    description: string;
    origin?: string;
    weight?: string;
    dimensions?: string;
    treatment?: string;
    clarity?: string;
    cut?: string;
    price: number;
    image: string;
    images: string[];
    isNew: boolean;
    category: string;
    subcategory: string;
}