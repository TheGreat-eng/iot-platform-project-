import React, { useEffect, useState } from 'react';
import type { SensorData } from '../types/data';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

function App() {
    const [data, setData] = useState<SensorData[]>([]);

    // Fetch dữ liệu ban đầu khi component được tải
    useEffect(() => {
        fetch('http://localhost:8080/api/data')
            .then(response => response.json())
            .then((result: SensorData[]) => setData(result.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())))
            .catch(error => console.error('Error fetching initial data:', error));
    }, []);

    // Thiết lập và quản lý kết nối WebSocket
    useEffect(() => {
        const socket = new SockJS('http://localhost:8080/ws');
        const stompClient = Stomp.over(socket);

        stompClient.connect({}, () => {
            console.log('Connected to WebSocket');
            stompClient.subscribe('/topic/data', message => {
                const newRecord: SensorData = JSON.parse(message.body);
                console.log('Received new data:', newRecord);
                // Cập nhật state, thêm dữ liệu mới vào đầu danh sách
                setData(prevData => [newRecord, ...prevData]);
            });
        });

        // Cleanup function: Ngắt kết nối khi component bị unmount
        return () => {
            if (stompClient?.connected) {
                stompClient?.disconnect();
            }
        };
    }, []); // Mảng rỗng để đảm bảo effect này chỉ chạy 1 lần

    return (
        <div className="App">
            <h1>IoT Data Stream (Real-time)</h1>
            <ul>
                {data.map(item => (
                    <li key={item.id}>
                        Device: {item.deviceId} - Value: {item.value} - Time: {new Date(item.timestamp).toLocaleString()}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default App;