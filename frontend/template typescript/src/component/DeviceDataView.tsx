import { useEffect, useState } from 'react';
import { SensorData } from '../types/data';
import { getDeviceDataHistory } from '../api/deviceApi';
import { getUsernameFromToken } from '../utils/auth';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Typography, Tag, Spin } from 'antd';

interface WebSocketPayload {
    deviceId: number;
    sensorData: SensorData;
}

interface DeviceDataViewProps {
    deviceId: string;
}

const DeviceDataView = ({ deviceId }: DeviceDataViewProps) => {
    const [data, setData] = useState<SensorData[]>([]);
    const [error, setError] = useState('');
    const [isConnected, setIsConnected] = useState(false);
    const username = getUsernameFromToken();
    const numericDeviceId = parseInt(deviceId, 10);

    // Load historical data
    useEffect(() => {
        if (isNaN(numericDeviceId)) {
            setError('Invalid device ID');
            return;
        }

        getDeviceDataHistory(numericDeviceId)
            .then(history => {
                const sortedHistory = history.sort((a, b) =>
                    new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
                );
                setData(sortedHistory);
            })
            .catch(() => setError('Failed to fetch data history.'));
    }, [numericDeviceId]);

    // WebSocket connection
    useEffect(() => {
        if (!username || isNaN(numericDeviceId)) return;

        const socket = new SockJS('http://localhost:8080/ws');
        const stompClient = Stomp.over(socket);

        stompClient.connect({}, () => {
            setIsConnected(true);
            stompClient.subscribe(`/topic/data/${username}`, message => {
                try {
                    const payload: WebSocketPayload = JSON.parse(message.body);
                    if (payload.deviceId === numericDeviceId) {
                        const newRecord = payload.sensorData;
                        setData(prevData => [...prevData, newRecord].slice(-50));
                    }
                } catch (error) {
                    console.error('Error parsing WebSocket message:', error);
                }
            });
        }, (error: any) => {
            setIsConnected(false);
            console.error('WebSocket connection error:', error);
        });

        return () => {
            if (stompClient.connected) {
                stompClient.disconnect();
            }
            setIsConnected(false);
        };
    }, [username, numericDeviceId]);

    return (
        <div>
            <div style={{ marginBottom: '1rem' }}>
                <Typography.Text>Status: </Typography.Text>
                <Tag color={isConnected ? 'green' : 'red'}>
                    {isConnected ? 'CONNECTED' : 'DISCONNECTED'}
                </Tag>
            </div>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            {data.length === 0 && !error && <Spin tip="Waiting for data..." />}

            {data.length > 0 && (
                <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            dataKey="timestamp"
                            tickFormatter={(timeStr) => new Date(timeStr).toLocaleTimeString()}
                        />
                        <YAxis />
                        <Tooltip
                            labelFormatter={(label) => new Date(label).toLocaleString()}
                            formatter={(value) => [value, 'Sensor Value']}
                        />
                        <Legend />
                        <Line
                            type="monotone"
                            dataKey="value"
                            stroke="#8884d8"
                            activeDot={{ r: 8 }}
                            strokeWidth={2}
                        />
                    </LineChart>
                </ResponsiveContainer>
            )}
        </div>
    );
};

export default DeviceDataView;