import { api } from '../../../services/api';

export const dashboardService = {
    getAllDashboards: async (): Promise<any[]> => {
        return api.get<any[]>('/get_Dashboard_header');
    },

    getDashboardById: async (id: number | string): Promise<any> => {
        return api.get<any>(`/get_dashboard_headerbyid/${id}`);
    },

    saveDashboard: async (dashboardData: any): Promise<any> => {
        let payload = { ...dashboardData };
        if (payload.items && typeof payload.items !== 'string') {
            const modelObj = { dashboard: payload.items };
            payload.model = JSON.stringify(modelObj);
        }

        if (dashboardData.id && dashboardData.id !== 0 && dashboardData.id !== 'new') {
            return api.put<any>(`/update_Dashbord1_Lineby_id/${dashboardData.id}`, payload);
        } else {
            return api.post<any>('/Savedata', payload);
        }
    },

    deleteDashboard: async (id: number | string): Promise<any> => {
        return api.delete<any>(`/delete_by_header_id/${id}`);
    },

    getChartData: async (
        tableName: string,
        jobType: string,
        xAxis: string,
        yAxes: string,
        sureId?: number,
        parameter?: string,
        parameterValue?: string,
        filters?: string
    ): Promise<any> => {
        const params: any = {
            tableName,
            xAxis,
            yAxes, // API expects 'yAxes' plural
        };

        if (sureId) params.sureId = sureId;
        if (parameter) params.parameter = parameter;
        if (parameterValue) params.parameterValue = parameterValue;
        if (filters) params.filters = filters;

        // Legacy URL convention: /chart/getdashjson/{jobType}
        return api.get<any>(`/chart/getdashjson/${jobType}`, params);
    }
};
