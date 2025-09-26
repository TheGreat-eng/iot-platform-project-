import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const RegisterPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // Kiểm tra password khớp nhau
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        // Kiểm tra độ dài password
        if (password.length < 6) {
            setError('Password must be at least 6 characters long');
            setLoading(false);
            return;
        }

        try {
            // 1. Gọi API register
            const response = await axios.post('http://localhost:8080/api/auth/register', {
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
            } else {
                setError('Registration successful but no token received. Please login.');
                // Nếu không có token, chuyển về trang login
                navigate('/login');
            }
        } catch (err: any) {
            if (err.response?.status === 409) {
                setError('Username already exists. Please choose a different username.');
            } else if (err.response?.status === 400) {
                setError('Invalid input. Please check your information.');
            } else {
                setError('Failed to register. Please try again.');
            }
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '2rem auto', padding: '2rem' }}>
            <h2>Create Account</h2>
            <form onSubmit={handleRegister}>
                <div style={{ marginBottom: '1rem' }}>
                    <label>Username:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        minLength={3}
                        style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
                        placeholder="Enter your username"
                    />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={6}
                        style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
                        placeholder="Enter your password"
                    />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                    <label>Confirm Password:</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        minLength={6}
                        style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
                        placeholder="Confirm your password"
                    />
                </div>
                {error && <p style={{ color: 'red', marginBottom: '1rem' }}>{error}</p>}
                <button
                    type="submit"
                    disabled={loading}
                    style={{
                        width: '100%',
                        padding: '0.75rem',
                        backgroundColor: loading ? '#ccc' : '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: loading ? 'not-allowed' : 'pointer'
                    }}
                >
                    {loading ? 'Creating Account...' : 'Register'}
                </button>
            </form>
            <p style={{ textAlign: 'center', marginTop: '1rem' }}>
                Already have an account? <Link to="/login">Login here</Link>
            </p>
        </div>
    );
};

export default RegisterPage;