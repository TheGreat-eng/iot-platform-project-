// src/types/data.ts
export interface SensorData {
    id: number;
    deviceId: string;
    value: number;
    timestamp: string; // Dữ liệu từ JSON là chuỗi, ta sẽ xử lý sau
}