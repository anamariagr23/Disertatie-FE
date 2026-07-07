export interface Category {
    category: string;
    score: number;
}

export interface Student {
    id: number;
    firstname: string;
    lastname: string;
    status: string;
    major: string;
    year_of_study: number;
    description: string;
    avatar_link: string | null;
    total_score: number;
    categories: Category[];
}

export interface StudentMatchesResponse {
    students: Student[];
}


export interface StudentsResponse {
    students: Student[];
}

export interface Major {
    id: number;
    name: string;
}

export interface MajorResponse {
    majors: Major[]
}
export interface Dorm {
    id: number;
    name: string;
}
export interface DormResponse {
    dorms: Dorm[];
}

export interface Sex {
    id: number;
    name: string;
}
export interface SexResponse {
    sexes: Sex[];
}