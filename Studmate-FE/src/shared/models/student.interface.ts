export interface Category {
    category: string;
    score: number;
}

export interface Student {
    id: number;
    firstname: string;
    lastname: string;
    status?: string;
    major: string | null;
    id_major?: number | null;
    id_sex?: number | null;
    sex?: string | null;
    dorm_id?: number | null;
    dorm?: string | null;
    year_of_study: number | null;
    description: string;
    avatar_link: string | null;
    total_score?: number | null;
    categories?: Category[] | null;
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

export interface StudentPreferences {
    sex: number | null;
    dorm: number | null;
    major: number | null;
    description: string | null;
    year_of_study: number | null;
    cat_sleep: number | null;
    cat_noise: number | null;
    cat_clean: number | null;
    cat_social: number | null;
    cat_sharing: number | null;
    cat_lifestyle: number | null;
    cat_hobby1: number | null;
    cat_hobby2: number | null;
    cat_hobby3: number | null;
    imp_sleep: number | null;
    imp_noise: number | null;
    imp_clean: number | null;
    imp_social: number | null;
    imp_sharing: number | null;
    imp_lifestyle: number | null;
    imp_hobbies: number | null;
}
export interface StudentPreferencesResponse {
    preferences: StudentPreferences;
}