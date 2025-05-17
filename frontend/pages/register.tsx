import { useState } from 'react';

export default function Home() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    type User = {
        id: string;
        name: string;
    };

    const [user, setUser] = useState<User | null>(null);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

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

            if (!res.ok) {
                // Show backend error message if provided
                setMessage({ type: 'error', text: result.msg || 'Registration failed' });
                return;
            }
            setUser(result.user);

            setMessage({ type: 'success', text: result.msg || 'Registration successful! 🎉' });
        } catch (err) {
            console.error(err);
            setMessage({ type: 'error', text: 'Server error. Please try again later. 😢' });
        }
    };

    return (
        <div style={{ padding: '20px' }}>
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
            <button onClick={handleRegister}>Register</button>

            {/* Show backend messages */}
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
            {message?.type === 'success' && user && (
                <div style={{ marginTop: '20px' }}>
                    <h3>Welcome, {user.name}!</h3>
                    <p>User ID: {user.id}</p>
                </div>
            )}
        </div>
    );
}
