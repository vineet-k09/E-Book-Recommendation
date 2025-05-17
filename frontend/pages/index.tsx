import Link from 'next/link'
import './globals.css';

export default function Home() {
    return (
        <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
            <h1>📚 Welcome to the Book API Frontend</h1>
            <p>This is the main page connected to your backend.</p>

            <nav style={{ marginTop: '1rem' }}>
                <Link href="/books">
                    <button style={{ marginRight: '1rem' }}>View Books</button>
                </Link>
                <Link href="/login">
                    <button style={{ marginRight: '1rem' }}>Login</button>
                </Link>
                <Link href="/register">
                    <button>Register</button>
                </Link>
            </nav>
        </div>
    )
}