import { useEffect, useState } from 'react';
import { SensorData } from '../types/data';
import { getDeviceDataHistory } from '../api/deviceApi';
import { getUsernameFromToken } from '../utils/auth';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

// Định nghĩa kiểu cho payload nhận từ WebSocket để code an toàn hơn
interface WebSocketPayload {
    sensorData: SensorData;
    deviceId: number;
}

interface DeviceDataViewProps {
    deviceId: string; // Nhận device ID từ URL (luôn là string)
}

const DeviceDataView = ({ deviceId }: DeviceDataViewProps) => {
    const [data, setData] = useState<SensorData[]>([]);
    const [error, setError] = useState('');
    const [isConnected, setIsConnected] = useState(false);
    const username = getUsernameFromToken();

    // Chuyển đổi deviceId từ string sang number để so sánh
    const numericDeviceId = parseInt(deviceId, 10);

    // 1. Fetch dữ liệu lịch sử khi component được tải lần đầu hoặc khi deviceId thay đổi
    useEffect(() => {
        // Đảm bảo numericDeviceId là một số hợp lệ trước khi gọi API
        if (isNaN(numericDeviceId)) {
            setError('Invalid Device ID format.');
            return;
        }

        setError(''); // Reset lỗi cũ
        setData([]); // Xóa dữ liệu cũ khi chuyển sang xem device khác
        setIsConnected(false); // Reset trạng thái kết nối

        getDeviceDataHistory(numericDeviceId)
            .then(history => {
                setData(history);
            })
            .catch(() => {
                setError('Failed to fetch data history. Please check if the device exists.');
            });
    }, [numericDeviceId]); // Effect này sẽ chạy lại mỗi khi deviceId trên URL thay đổi

    // 2. Thiết lập và quản lý kết nối WebSocket
    useEffect(() => {
        // Chỉ thực hiện kết nối khi có username và deviceId hợp lệ
        if (!username || isNaN(numericDeviceId)) {
            return;
        }

        const socket = new SockJS('http://localhost:8080/ws');
        const stompClient = Stomp.over(socket);

        // Tắt log debug mặc định của stompjs ra console để đỡ rối
        stompClient.debug = () => { };

        stompClient.connect({},
            () => { // Callback khi kết nối thành công
                console.log('WebSocket Connected!');
                setIsConnected(true);

                // Lắng nghe trên kênh riêng của user, ví dụ: /topic/data/testuser
                stompClient.subscribe(`/topic/data/${username}`, message => {
                    try {
                        const payload: WebSocketPayload = JSON.parse(message.body);

                        // DÒNG LOGIC QUAN TRỌNG NHẤT:
                        // Chỉ cập nhật state nếu dữ liệu mới này thuộc về thiết bị đang xem
                        if (payload.deviceId === numericDeviceId) {
                            const newRecord = payload.sensorData;
                            setData(prevData => [newRecord, ...prevData]);
                        }
                    } catch (error) {
                        console.error("Error parsing WebSocket message:", error);
                    }
                });
            },
            (error) => { // Callback khi kết nối thất bại
                console.error('WebSocket connection error:', error);
                setError('Could not connect to real-time service.');
                setIsConnected(false);
            }
        );

        // Cleanup function: Sẽ được gọi khi component bị unmount (người dùng chuyển trang)
        return () => {
            if (stompClient && stompClient.connected) {
                stompClient.disconnect(() => {
                    console.log('WebSocket Disconnected.');
                });
            }
        };
    }, [username, numericDeviceId]); // Chạy lại effect nếu username hoặc deviceId thay đổi

    return (
        <div>
            <div style={{ marginBottom: '1rem' }}>
                Status:
                <span style={{ color: isConnected ? 'green' : 'red', fontWeight: 'bold' }}>
                    {isConnected ? ' Connected to Real-time Service' : ' Disconnected'}
                </span>
            </div>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            {data.length === 0 && !error && <p>Waiting for data...</p>}

            <ul style={{ listStyle: 'none', padding: 0 }}>
                {data.map((item, index) => (
                    <li key={`${item.id}-${index}`} style={{ border: '1px solid #eee', padding: '8px', marginBottom: '5px' }}>
                        <strong>Value: {item.value.toFixed(2)}</strong> -
                        <span style={{ color: '#555' }}> Received at: {new Date(item.timestamp).toLocaleString()}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default DeviceDataView;