import api from './axiosConfig';
import { Rule } from '../types/data';

// Định nghĩa kiểu cho dữ liệu gửi đi khi tạo Rule
interface CreateRulePayload {
    name: string;
    operator: string;
    threshold: number;
    actionType: string;
}

export const getRulesForDevice = async (deviceId: number): Promise<Rule[]> => {
    const response = await api.get<Rule[]>(`/devices/${deviceId}/rules`);
    return response.data;
};

export const createRuleForDevice = async (deviceId: number, ruleData: CreateRulePayload): Promise<Rule> => {
    const response = await api.post<Rule>(`/devices/${deviceId}/rules`, ruleData);
    return response.data;
};

export const deleteRuleById = async (ruleId: number): Promise<void> => {
    await api.delete(`/rules/${ruleId}`);
}