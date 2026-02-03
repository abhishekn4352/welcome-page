import { api } from './api';

// Define types based on usage if not available globally
export interface RnFormsSetup {
    form_id: number;
    form_name: string;
    description?: string;
    components?: RnFormsComponentSetup[];
    button_caption?: string;
}

export interface RnFormsComponentSetup {
    id?: number;
    label: string;
    type: string; // text, textarea, checkbox, select, date, etc.
    mandatory?: string | boolean;
    readonly?: string | boolean;
    drop_values?: string;
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
        return api.put(`${this.transactionURL}/${id}?form_id=${formId}`, data);
    }

    // Delete a record
    deleteTransaction(id: number) {
        return api.delete(`${this.transactionURL}/${id}`);
    }
}

export const dynamicFormService = new DynamicFormService();
