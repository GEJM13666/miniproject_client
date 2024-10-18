// _app.tsx
import React from 'react';
import { AppProps } from 'next/app';
import { UserProvider } from './UserContext'; // Adjust the path as necessary

const MyApp = ({ Component, pageProps }: AppProps) => {
    return (
        <UserProvider>
            <Component {...pageProps} />
        </UserProvider>
    );
};

export default MyApp;
