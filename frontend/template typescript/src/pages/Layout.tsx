import { useState } from 'react';
import { Layout, Menu, Typography, Button, Avatar, Popover, Breadcrumb } from 'antd';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { DashboardOutlined, UserOutlined, SettingOutlined, LogoutOutlined } from '@ant-design/icons';
import { getUsernameFromToken } from '../utils/auth';

const { Header, Content, Footer, Sider } = Layout;
const { Title } = Typography;

const AppLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [collapsed, setCollapsed] = useState(false);
    const username = getUsernameFromToken();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const userMenu = (
        <Menu>
            <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
                Logout
            </Menu.Item>
        </Menu>
    );

    // Logic để tạo Breadcrumb
    const pathSnippets = location.pathname.split('/').filter(i => i);
    const breadcrumbItems = [
        <Breadcrumb.Item key="home">
            <Link to="/">Dashboard</Link>
        </Breadcrumb.Item>,
        ...pathSnippets.map((_, index) => {
            const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
            // Logic để hiển thị tên thay vì ID (sẽ cần cải tiến sau)
            const name = pathSnippets[index];
            return (
                <Breadcrumb.Item key={url}>
                    <Link to={url}>{name}</Link>
                </Breadcrumb.Item>
            );
        }),
    ];

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
                <div style={{ height: 32, margin: 16, background: 'rgba(255, 255, 255, 0.2)', textAlign: 'center', color: 'white', lineHeight: '32px' }}>
                    IoT
                </div>
                <Menu theme="dark" defaultSelectedKeys={['/']} mode="inline">
                    <Menu.Item key="/" icon={<DashboardOutlined />}>
                        <Link to="/">Dashboard</Link>
                    </Menu.Item>
                    <Menu.Item key="/profile" icon={<UserOutlined />}>
                        <Link to="/profile">Profile</Link>
                    </Menu.Item>
                    <Menu.Item key="/settings" icon={<SettingOutlined />}>
                        <Link to="/settings">Settings</Link>
                    </Menu.Item>
                </Menu>
            </Sider>
            <Layout>
                <Header style={{ padding: '0 24px', background: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Breadcrumb>{breadcrumbItems}</Breadcrumb>
                    {username && (
                        <Popover placement="bottomRight" content={userMenu} trigger="click">
                            <Avatar style={{ cursor: 'pointer' }} icon={<UserOutlined />} />
                            <span style={{ marginLeft: 8 }}>Welcome, {username}</span>
                        </Popover>
                    )}
                </Header>
                <Content style={{ margin: '24px 16px 0' }}>
                    <div style={{ padding: 24, minHeight: 360, background: '#fff', borderRadius: 8 }}>
                        <Outlet />
                    </div>
                </Content>
                <Footer style={{ textAlign: 'center' }}>
                    IoT Platform ©{new Date().getFullYear()} - Graduation Project
                </Footer>
            </Layout>
        </Layout>
    );
};

export default AppLayout;