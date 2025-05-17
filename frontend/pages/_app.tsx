import type { AppProps } from 'next/app';
import { AuthProvider } from '@/context/AuthContext';
import './globals.css'; // adjust if needed

export default function MyApp({ Component, pageProps }: AppProps) {
    return (
        <AuthProvider>
            <Component {...pageProps} />
        </AuthProvider>
    );
}
