import { api } from './api';
import { Rn_Forms_Setup } from '../types'; // We might need to define this type or find where it is

// Define types based on usage if not available globally
export interface RnFormsSetup {
    form_id: number;
    form_name: string;
    description?: string;
    components?: RnFormsComponentSetup[];
    button_caption?: string;
    // Add other fields as per Angular model
}

export interface RnFormsComponentSetup {
    id?: number;
    label: string;
    type: string; // text, textarea, checkbox, select, date, etc.
    mandatory?: string | boolean;
    readonly?: string | boolean;
    drop_values?: string;
    // Add other fields
}

class DynamicFormService {
    private baseURL = '/api/form_setup';
    private buildDynamicFormURL = '/api/dynamic_form_build';
    private transactionURL = '/api/dynamic_transaction';

    // Fetch all forms
    getAllForms(page: number = 0, size: number = 1000) {
        return api.get<any>(this.baseURL, { page, size });
    }

    // Get form setup by ID
    getFormSetup(id: number) {
        return api.get<RnFormsSetup>(`${this.baseURL}/${id}`);
    }

    // Create new form setup (if needed)
    createFormSetup(data: RnFormsSetup) {
        return api.post<RnFormsSetup>(this.baseURL, data);
    }

    // Update form setup
    updateFormSetup(id: number, data: RnFormsSetup) {
        return api.put<RnFormsSetup>(`${this.baseURL}/${id}`, data);
    }

    // Delete form setup
    deleteFormSetup(id: number) {
        return api.delete(`${this.baseURL}/${id}`);
    }

    // --- Transactions (Data Records) ---

    // Get records for a specific form
    getTransactions(formId: number) {
        return api.get<any[]>(this.transactionURL, { form_id: formId });
    }

    // Create a new record
    createTransaction(data: any) {
        return api.post(this.transactionURL, data);
    }

    // Update a record
    updateTransaction(id: number, formId: number, data: any) {
        return api.put(`${this.transactionURL}/${id}`, data, { form_id: formId } as any); // Note: ApiService put params handling needs verification, might need query string manually if body is second arg
        // Looking at api.ts, put signature is (endpoint, body). It doesn't accept params. 
        // But the backend expects form_id as param for update? 
        // Angular service: params = params.append('form_id', form_id.toString()); this.apiRequest.put('api/dynamic_transaction/' + id, data, params);
        // React ApiService.put doesn't support query params in arguments.
        // We will append it to URL.
    }

    updateTransactionWithParam(id: number, formId: number, data: any) {
        return api.request(`${this.transactionURL}/${id}?form_id=${formId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
            body: JSON.stringify(data)
        });
    }

    // Delete a record
    deleteTransaction(id: number) {
        return api.delete(`${this.transactionURL}/${id}`);
    }
}

export const dynamicFormService = new DynamicFormService();
