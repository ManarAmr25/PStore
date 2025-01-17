export enum Constants {
    SCORE_UPPER_BOUND = 5,
    SCORE_LOWER_BOUND = 0
}

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