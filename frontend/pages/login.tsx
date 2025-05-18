import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/router';
import Navbar from '@/components/Navbar';
import { useEffect } from 'react';

export default function Home() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { login, logout, token, user } = useAuth();
    const [message, setMessage] = useState<{
        type: 'success' | 'error'; text:
        string
    } | null>(null);
    const [redirect, setredirect] = useState(false);

    const handleLogin = async () => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;

        try {
            const res = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            const result = await res.json();

            if (!res.ok) {
                setMessage({ type: 'error', text: result.msg || 'Login failed' });
                return;
            }

            // Call login from context
            login(result.user, result.token);

            setMessage({ type: 'success', text: 'Login successful! 🎉' });

            // redirect
            setredirect(true)
        } catch (err) {
            console.error(err);
            setMessage({ type: 'error', text: 'Server error. Please try again later. 😢' });
        }
    };

    const router = useRouter();
    useEffect(() => {
        if (redirect) {
            const timer = setTimeout(() => {
                router.push('/recommend');
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [redirect, router]);


    const handleLogout = () => {
        logout();
        setMessage({ type: 'success', text: 'Logout successful! 🎉' });
    };

    return (
        <div style={{ padding: '20px' }}>

            <Navbar />
            <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                style={{ display: 'block', margin: '10px 0' }}
            />
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                style={{ display: 'block', margin: '10px 0' }}
            />

            {!token ? (
                <button onClick={handleLogin}>Login</button>
            ) : (
                <button onClick={handleLogout} style={{ marginLeft: '10px' }}>Logout</button>
            )}

            {message && (
                <p
                    style={{
                        color: message.type === 'success' ? 'green' : 'red',
                        marginTop: '20px',
                    }}
                >
                    {message.text}
                </p>
            )}

            {user && (
                <div style={{ marginTop: '20px' }}>
                    <h3>Welcome, {user.name}!</h3>
                    <p>User ID: {user.id}</p>
                    <p>Session ID: {token}</p>
                </div>
            )}
        </div>
    );
}
