export interface Gem {
    id: string;
    name: string;
    description: string;
    price?: number;
    images: string[];
    isNew?: boolean;
    carat?: number;
    color?: string;
    origin?: string;
}
