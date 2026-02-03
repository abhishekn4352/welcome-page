import API_BASE_URL from '../config';

// Demo mode flag - enables mock responses when API is unreachable
const DEMO_MODE = true;

class ApiService {
    private getHeaders(contentType: string = 'application/json'): HeadersInit {
        const headers: HeadersInit = {
            'Content-Type': contentType,
        };

        const token = localStorage.getItem('token');
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        return headers;
    }

    private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
        const url = `${API_BASE_URL}${endpoint}`;
        console.log(`[API Request] ${options.method || 'GET'} ${url}`, { options });

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

            const response = await fetch(url, {
                ...options,
                signal: controller.signal
            });
            clearTimeout(timeoutId);

            console.log(`[API Response] ${response.status} ${url}`);

            // Handle 401 Unauthorized globally
            if (response.status === 401) {
                console.warn('[API] 401 Unauthorized - Redirecting to login');
                if (!window.location.pathname.includes('/login')) {
                    localStorage.clear();
                    window.location.href = '/login';
                    throw new Error('Session expired');
                }
            }

            const data = await response.json();

            if (!response.ok) {
                console.error(`[API Error] ${response.status} - ${data.detail || data.message}`, data);
                throw new Error(data.detail || data.operationMessage || data.message || 'Something went wrong');
            }

            console.log(`[API Success] Data:`, data);
            return data as T;
        } catch (error: any) {
            console.error(`[API Exception] ${endpoint}:`, error);
            
            // Check if it's a network error and demo mode is enabled
            if (DEMO_MODE && (error.name === 'TypeError' || error.name === 'AbortError')) {
                console.warn('[API] Network error - Using demo mode');
                throw new Error('API_UNAVAILABLE');
            }
            
            throw new Error(error.message || 'Network error');
        }
    }

    async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
        let url = endpoint;
        if (params) {
            const searchParams = new URLSearchParams();
            Object.keys(params).forEach(key => {
                if (params[key] !== undefined && params[key] !== null) {
                    searchParams.append(key, String(params[key]));
                }
            });
            const queryString = searchParams.toString();
            if (queryString) {
                url += (url.includes('?') ? '&' : '?') + queryString;
            }
        }

        return this.request<T>(url, {
            method: 'GET',
            headers: this.getHeaders(),
        });
    }

    async post<T>(endpoint: string, body: any): Promise<T> {
        return this.request<T>(endpoint, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify(body),
        });
    }

    async put<T>(endpoint: string, body: any): Promise<T> {
        return this.request<T>(endpoint, {
            method: 'PUT',
            headers: this.getHeaders(),
            body: JSON.stringify(body),
        });
    }

    async delete<T>(endpoint: string): Promise<T> {
        return this.request<T>(endpoint, {
            method: 'DELETE',
            headers: this.getHeaders(),
        });
    }
}

export const api = new ApiService();
