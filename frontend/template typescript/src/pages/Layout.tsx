import { Outlet, Link } from 'react-router-dom';

const Layout = () => {
    // Tạm thời chỉ có Navbar đơn giản
    return (
        <div>
            <nav style={{ padding: '1rem', background: '#eee', marginBottom: '1rem' }}>
                <Link to="/" style={{ marginRight: '1rem' }}>Home</Link>
                <Link to="/login" style={{ marginRight: '1rem' }}>Login</Link>
                <Link to="/register">Register</Link>
            </nav>
            <main>
                {/* Đây là nơi các route con (HomePage) sẽ được render */}
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;