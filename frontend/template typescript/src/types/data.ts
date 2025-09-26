// src/types/data.ts
export interface SensorData {
    id: number;
    deviceId: string;
    value: number;
    timestamp: string; // Dữ liệu nhận từ API ban đầu là một chuỗi ISO
}