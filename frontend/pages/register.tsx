'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router'; // if using app dir -> 'next/navigation'
import Navbar from '@/components/Navbar';

export default function Home() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    type User = {
        id: string;
        name: string;
    };

    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const router = useRouter();

    const handleRegister = async () => {
        const data = { username, password };
        const API_URL = process.env.NEXT_PUBLIC_API_URL;

        try {
            const res = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                body: JSON.stringify(data),
                headers: { 'Content-Type': 'application/json' },
            });

            const result = await res.json();

            if (!res.ok || result.msg?.toLowerCase().includes('exist')) {
                setMessage({ type: 'error', text: result.msg || 'Registration failed' });
                return;
            }

            setUser(result.user);
            setMessage({ type: 'success', text: result.msg || 'Registration successful! 🎉' });

            // Only redirect if truly registered
            setTimeout(() => {
                router.push('/login');
            }, 3000);

        } catch (err) {
            console.error(err);
            setMessage({ type: 'error', text: 'Server error. Please try again later. 😢' });
        }
    };

    return (
        <div className="page-container">
            <Navbar />
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    handleRegister();
                }}
                className="auth-form"
            >
                <input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                    style={{ display: 'block', margin: '10px 0' }}
                    className="auth-input"
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    style={{ display: 'block', margin: '10px 0' }}
                    className="auth-input"
                />
                <button type="submit" className="auth-btn">Register</button> {/* ✅ No onClick */}
            </form>
            {message && (
                <p
                    className={`message ${message.type === 'success' ? 'success' : 'error'}`}
                >
                    {message.text}
                </p>
            )}

            {/* Show welcome and redirect info if registered */}
            {message?.type === 'success' && user && (
                <div style={{ marginTop: '20px' }}>
                    <h3>Welcome, {user.name}!</h3>
                    <p>User ID: {user.id}</p>
                    <p>Redirecting to login page in 3 seconds...</p>
                    <button className="auth-btn" onClick={() => router.push('/login')} style={{ marginTop: '10px' }}>
                        Go to Login Now
                    </button>
                </div>
            )}
        </div>
    );
}
