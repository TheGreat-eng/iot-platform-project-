import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Device, Rule, Operator, ActionType } from '../types/data';
import { getDeviceById } from '../api/deviceApi';
import { getRulesForDevice, createRuleForDevice, deleteRuleById } from '../api/ruleApi';
import DeviceDataView from '../component/DeviceDataView';
import { Row, Col, Card, Typography, Form, Input, Select, InputNumber, Button, List, Popconfirm, message } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { Option } = Select;

const DeviceDetailPage = () => {
    const { deviceId } = useParams<{ deviceId: string }>();
    const numericDeviceId = parseInt(deviceId || '0', 10);

    const [device, setDevice] = useState<Device | null>(null);
    const [rules, setRules] = useState<Rule[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [form] = Form.useForm();

    // Fetch thông tin device và các rule của nó
    useEffect(() => {
        if (isNaN(numericDeviceId) || numericDeviceId === 0) {
            setError('Invalid Device ID.');
            setLoading(false);
            return;
        }

        const fetchData = async () => {
            try {
                setLoading(true);
                const deviceData = await getDeviceById(numericDeviceId);
                setDevice(deviceData);
                const rulesData = await getRulesForDevice(numericDeviceId);
                setRules(rulesData);
            } catch (err) {
                setError('Failed to fetch device details.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [numericDeviceId]);

    // Handler để xóa rule
    const handleDeleteRule = async (ruleId: number) => {
        try {
            await deleteRuleById(ruleId);
            setRules(prevRules => prevRules.filter(rule => rule.id !== ruleId));
            message.success('Rule deleted successfully!');
        } catch (err) {
            message.error('Failed to delete rule.');
        }
    };

    const onFinishRule = async (values: any) => {
        const ruleData = {
            name: values.name,
            operator: values.operator,
            threshold: values.threshold,
            actionType: ActionType.SEND_EMAIL,
        };
        try {
            const newRule = await createRuleForDevice(numericDeviceId, ruleData);
            setRules(prev => [...prev, newRule]);
            form.resetFields();
            message.success('Rule created successfully!');
        } catch (err) {
            message.error('Failed to create rule.');
        }
    };

    if (loading) return <div>Loading device details...</div>;
    if (error) return <div style={{ color: 'red' }}>{error}</div>;
    if (!device) return <div>Device not found. <Link to="/">Go back to Dashboard</Link></div>;

    return (
        <div>
            <Title level={2}>Device: {device.name}</Title>

            <Row gutter={[16, 16]}>
                <Col xs={24} lg={16}>
                    <Card title="Real-time Data Stream">
                        <DeviceDataView deviceId={deviceId!} />
                    </Card>
                </Col>

                <Col xs={24} lg={8}>
                    <Card title="Rules & Alerts">
                        <List
                            dataSource={rules}
                            locale={{ emptyText: "No rules defined." }}
                            renderItem={rule => (
                                <List.Item
                                    actions={[
                                        <Popconfirm
                                            key="delete"
                                            title="Delete the rule"
                                            description="Are you sure to delete this rule?"
                                            onConfirm={() => handleDeleteRule(rule.id)}
                                            okText="Yes"
                                            cancelText="No"
                                        >
                                            <Button type="text" danger icon={<DeleteOutlined />} />
                                        </Popconfirm>
                                    ]}
                                >
                                    <List.Item.Meta
                                        title={rule.name}
                                        description={`IF value is ${rule.operator.replace('_', ' ').toLowerCase()} ${rule.threshold}`}
                                    />
                                </List.Item>
                            )}
                        />
                        <Form form={form} layout="vertical" onFinish={onFinishRule} style={{ marginTop: '2rem' }}>
                            <Title level={4}>Create a New Rule</Title>
                            <Form.Item name="name" label="Rule Name" rules={[{ required: true, message: 'Please input rule name!' }]}>
                                <Input placeholder="e.g., High Temp Alert" />
                            </Form.Item>
                            <Row gutter={8}>
                                <Col span={14}>
                                    <Form.Item name="operator" label="Condition" initialValue={Operator.GREATER_THAN}>
                                        <Select>
                                            <Option value={Operator.GREATER_THAN}>Greater Than</Option>
                                            <Option value={Operator.LESS_THAN}>Less Than</Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col span={10}>
                                    <Form.Item name="threshold" label="Threshold" rules={[{ required: true, message: 'Please input threshold!' }]}>
                                        <InputNumber style={{ width: '100%' }} />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Form.Item>
                                <Button type="primary" htmlType="submit" icon={<PlusOutlined />}>Create Rule</Button>
                            </Form.Item>
                        </Form>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default DeviceDetailPage;