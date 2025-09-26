import { jwtDecode } from 'jwt-decode';

export const getUsernameFromToken = (): string | null => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    try {
        const decoded: { sub: string } = jwtDecode(token);
        return decoded.sub; // 'sub' là subject, chính là username
    } catch (error) {
        console.error("Failed to decode token", error);
        return null;
    }
};