import { useEffect, useState } from 'react';
import type { SensorData } from './types/data';
// Import vào

// Tạm thời dùng any, sau này sẽ định nghĩa interface chặt chẽ
function App() {
  const [data, setData] = useState<SensorData[]>([]); // Sử dụng kiểu dữ liệu

  useEffect(() => {
    // Fetch data from the backend
    fetch('http://localhost:8080/api/data')
      .then(response => response.json())
      .then(result => setData(result))
      .catch(error => console.error('Error fetching data:', error));
  }, []); // Mảng rỗng đảm bảo useEffect chỉ chạy 1 lần

  return (
    <div>
      <h1>IoT Data Stream</h1>
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