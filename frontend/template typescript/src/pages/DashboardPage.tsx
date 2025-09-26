import { useEffect, useState } from 'react';
import { getMyDevices, createNewDevice } from '../api/deviceApi';
import { Device } from '../types/device';
import { Link } from 'react-router-dom';

const DashboardPage = () => {
    const [devices, setDevices] = useState<Device[]>([]);
    const [newDeviceName, setNewDeviceName] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchDevices = async () => {
            try {
                const userDevices = await getMyDevices();
                setDevices(userDevices);
            } catch (err) {
                setError('Failed to fetch devices.');
            } finally {
                setLoading(false);
            }
        };
        fetchDevices();
    }, []);

    const handleCreateDevice = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newDeviceName.trim()) return;
        try {
            const newDevice = await createNewDevice(newDeviceName);
            setDevices(prevDevices => [...prevDevices, newDevice]);
            setNewDeviceName('');
        } catch (err) {
            setError('Failed to create device.');
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div style={{ color: 'red' }}>{error}</div>;

    return (
        <div>
            <h2>My Devices</h2>

            {/* Form tạo device mới */}
            <form onSubmit={handleCreateDevice}>
                <input
                    type="text"
                    value={newDeviceName}
                    onChange={(e) => setNewDeviceName(e.target.value)}
                    placeholder="New device name (e.g., Living Room Sensor)"
                />
                <button type="submit">Create Device</button>
            </form>

            {/* Danh sách các device */}
            <div style={{ marginTop: '2rem' }}>
                {devices.length === 0 ? (
                    <p>You have no devices yet. Create one!</p>
                ) : (
                    devices.map(device => (
                        <div key={device.id} style={{ border: '1px solid #ccc', padding: '1rem', marginBottom: '1rem' }}>
                            <h3>{device.name}</h3>
                            <p><strong>Device ID:</strong> <code>{device.deviceId}</code></p>
                            <p><strong>Secret Key:</strong> <code>{device.secretKey}</code> (Use this in your simulator)</p>
                            <Link to={`/devices/${device.id}`}>View Real-time Data</Link>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default DashboardPage;