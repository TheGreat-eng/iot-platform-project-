export interface Device {
    id: number;
    deviceId: string;
    name: string;
    secretKey: string;
}

export interface SensorData {
    id: number;
    value: number;
    timestamp: string;
    deviceId?: string; // Thêm field này nếu cần
}