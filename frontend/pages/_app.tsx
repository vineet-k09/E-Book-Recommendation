import type { AppProps } from 'next/app';
import { AuthProvider } from '@/context/AuthContext';
import './globals.css'; // Adjust if needed

export default function MyApp({ Component, pageProps }: AppProps) {
    return (
        <AuthProvider>
            <div className="mx-auto px-4 sm:px-6 md:px-8 max-w-7xl w-[75vw]">
                <Component {...pageProps} />
            </div>
        </AuthProvider>
    );
}
