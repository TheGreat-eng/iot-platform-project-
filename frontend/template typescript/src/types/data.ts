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

// ... các interface Device, SensorData đã có

export enum Operator {
    GREATER_THAN = 'GREATER_THAN',
    LESS_THAN = 'LESS_THAN',
}

export enum ActionType {
    SEND_EMAIL = 'SEND_EMAIL',
}

export interface Rule {
    id: number;
    name: string;
    operator: Operator;
    threshold: number;
    actionType: ActionType;
}