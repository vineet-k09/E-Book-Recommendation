import { useState } from 'react';

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

    const handleLogin = async () => {
        const data = { username, password };
        const API_URL = process.env.NEXT_PUBLIC_API_URL;

        try {
            const res = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                body: JSON.stringify(data),
                headers: { 'Content-Type': 'application/json' },
            });

            const result = await res.json();

            if (!res.ok) {
                // If response is not ok, display backend message as error
                setMessage({ type: 'error', text: result.msg || 'Login failed' });
                return;
            }

            // Save token
            localStorage.setItem('token', result.token);

            // Set user info in state
            setUser(result.user);
            setToken(result.token);

            // Show success message
            setMessage({ type: 'success', text: 'Login successful! 🎉' });

            
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
            <button onClick={handleLogin}>Login</button>

            {/* Render backend messages */}
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
