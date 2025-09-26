import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
    const token = localStorage.getItem('token');

    // Nếu có token (đã đăng nhập) -> cho phép render các route con (Outlet)
    // Nếu không có token -> điều hướng về trang /login
    return token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;