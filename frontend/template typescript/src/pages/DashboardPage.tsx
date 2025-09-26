import { useEffect, useState } from 'react';
import { List, Card, Form, Input, Button, Typography, Spin, Empty, message, Popover } from 'antd';
import { Link } from 'react-router-dom';
import { getMyDevices, createNewDevice } from '../api/deviceApi';
import { Device } from '../types/data';
import { PlusOutlined } from '@ant-design/icons';

const { Title, Text } = Typography; // ✅ Thêm Text vào đây

const DashboardPage = () => {
    const [devices, setDevices] = useState<Device[]>([]);
    const [loading, setLoading] = useState(true);
    const [form] = Form.useForm(); // Sử dụng hook của AntD Form

    useEffect(() => {
        const fetchDevices = async () => {
            try {
                const userDevices = await getMyDevices();
                setDevices(userDevices);
            } catch (err) {
                message.error('Failed to fetch devices.');
            } finally {
                setLoading(false);
            }
        };
        fetchDevices();
    }, []);

    const onFinish = async (values: { name: string }) => {
        try {
            const newDevice = await createNewDevice(values.name);
            setDevices(prev => [...prev, newDevice]);
            form.resetFields(); // Xóa text trong form sau khi tạo thành công
            message.success(`Device "${values.name}" created successfully!`);
        } catch (err) {
            message.error('Failed to create device.');
        }
    };

    if (loading) return <Spin size="large" />;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <Title level={2} style={{ margin: 0 }}>My Devices</Title>
                {/* Form tạo device mới đặt trong Popover */}
                <Popover
                    content={
                        <Form form={form} onFinish={onFinish}>
                            <Form.Item name="name" rules={[{ required: true, message: 'Please input a device name!' }]}>
                                <Input placeholder="e.g., Living Room Sensor" />
                            </Form.Item>
                            <Button type="primary" htmlType="submit">Create</Button>
                        </Form>
                    }
                    title="Create a New Device"
                    trigger="click"
                >
                    <Button type="primary" icon={<PlusOutlined />}>Add Device</Button>
                </Popover>
            </div>

            <List
                grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 3, xl: 4, xxl: 4 }}
                dataSource={devices}
                locale={{ emptyText: <Empty description="You have no devices yet. Create one!" /> }}
                renderItem={device => (
                    <List.Item>
                        <Card
                            title={device.name}
                            hoverable
                            actions={[
                                <Link to={`/devices/${device.id}`}>View Data</Link>,
                            ]}
                        >
                            <Text strong>Device ID:</Text> <Text copyable>{device.deviceId}</Text>
                            <br />
                            <Text strong>Secret Key:</Text> <Text copyable>{device.secretKey}</Text>
                        </Card>
                    </List.Item>
                )}
            />
        </div>
    );
};

export default DashboardPage;