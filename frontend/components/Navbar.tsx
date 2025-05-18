import Link from 'next/link';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
    const { user, logout } = useAuth();

    return (
        <nav style={{ marginBottom: '20px' }}>
            <Link href="/"><button>Home</button></Link>
            {!user ? (
                <>
                    <Link href="/login"><button>Login</button></Link>
                    <Link href="/register"><button>Register</button></Link>
                </>
            ) : (
                <>
                    <Link href="/books"><button>Books</button></Link>
                    <Link href="/profile"><button>Profile</button></Link>
                    <button onClick={logout}>Logout</button>
                    <span style={{ marginLeft: '10px' }}>Welcome, {user.name}</span>
                </>
            )}
        </nav>
    );
}