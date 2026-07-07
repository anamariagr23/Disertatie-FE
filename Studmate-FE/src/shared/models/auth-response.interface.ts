export interface AuthResponse {
  message: string;
  data: {
    id: number;
    email: string;
    id_role: number;
    token: string;
    details_completed: boolean;
  };
}
