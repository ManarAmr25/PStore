export enum Role {
    customer,
    admin
}

export interface Comment {
    question: string;
    answer: string;
}

export interface Product {
    id: number;
    name: string;
    description: string;
}