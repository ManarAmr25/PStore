export enum Role {
    customer,
    admin
}

export interface Comment {
    question: string;
    answer: string;
}

export interface Review {
    comments: Comment[];
    score: number;
}

export interface Product {
    id: number;
    name: string;
    description: string;
}