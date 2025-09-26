import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault(); // Ngăn form submit và tải lại trang
        setError('');

        try {
            // 1. Gọi API login
            const response = await axios.post('http://localhost:8080/api/auth/login', {
                username,
                password,
            });

            // 2. Kiểm tra xem có nhận được token không
            if (response.data && response.data.accessToken) {
                // 3. Lưu token vào localStorage
                localStorage.setItem('token', response.data.accessToken);

                // 4. Chuyển hướng người dùng về trang chủ
                navigate('/');
                window.location.reload(); // Tải lại trang để các component khác cập nhật trạng thái đăng nhập
            }
        } catch (err) {
            setError('Failed to login. Please check your credentials.');
            console.error(err);
        }
    };

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <div>
                    <label>Username:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default LoginPage;