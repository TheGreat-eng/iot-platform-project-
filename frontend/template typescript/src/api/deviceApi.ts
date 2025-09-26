import api from './axiosConfig';
import { Device } from '../types/data';
import { SensorData } from '../types/data';

export const getMyDevices = async (): Promise<Device[]> => {
    const response = await api.get<Device[]>('/devices');
    return response.data;
};

export const createNewDevice = async (name: string): Promise<Device> => {
    const response = await api.post<Device>('/devices', { name });
    return response.data;
};

export const getDeviceDataHistory = async (deviceId: number): Promise<SensorData[]> => {
    const response = await api.get<SensorData[]>(`/devices/${deviceId}/data`);
    return response.data;
}