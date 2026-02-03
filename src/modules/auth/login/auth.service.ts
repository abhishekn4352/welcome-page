import { api } from '../../../services/api';

export interface LoginResponse {
    operationStatus: string;
    operationMessage: string;
    item: {
        token: string;
        userId: number;
        fullname: string;
        email: string;
        firstName: string;
        roles: string[];
    };
}

export const authService = {
    login: async (email: string, password: string): Promise<LoginResponse> => {
        return api.post<LoginResponse>('/token/session', { email, password });
    },

    signup: async (username: string, email: string, password: string): Promise<any> => {
        return api.post('/signup', { username, email, password });
    }
};
