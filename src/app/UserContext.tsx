'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface User {
    username: string;
    email: string;
    role: number;
}

interface AuthData {
    accessToken: string;
    refreshToken: string;
    user: User;
}

interface UserContextType {
    authData: AuthData | null;
    updateAuthData: (authData: AuthData) => void;
    logout: () => void;
    refreshToken: () => Promise<void>;
    logoutMessage: string | null;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [authData, setAuthData] = useState<AuthData | null>(null);
    const [logoutMessage, setLogoutMessage] = useState<string | null>(null);

    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');
        const user = localStorage.getItem('user');

        if (accessToken && refreshToken && user) {
            setAuthData({
                accessToken,
                refreshToken,
                user: JSON.parse(user),
            });
        }
    }, []);

    const updateAuthData = (authData: AuthData) => {
        setAuthData(authData);
        localStorage.setItem('accessToken', authData.accessToken);
        localStorage.setItem('refreshToken', authData.refreshToken);
        localStorage.setItem('user', JSON.stringify(authData.user));
    };

    const logout = () => {
        setAuthData(null);
        setLogoutMessage('คุณออกจากระบบสำเร็จแล้ว.');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');

        setTimeout(() => {
            setLogoutMessage(null);
        }, 3000);
    };

    const refreshToken = async () => {
        if (!authData) return;

        try {
            const response = await fetch('http://localhost:8080/auth/refresh', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ refreshToken: authData.refreshToken }), // Send refresh token in body
            });

            if (!response.ok) throw new Error('Failed to refresh token');

            const data = await response.json();
            updateAuthData({
                accessToken: data.accessToken,
                refreshToken: data.refreshToken,
                user: authData.user,
            });
        } catch (error) {
            console.error('Token refresh error:', error);
            logout(); // Log out if refresh fails
        }
    };

    return (
        <UserContext.Provider value={{ authData, updateAuthData, logout, refreshToken, logoutMessage }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = (): UserContextType => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};
