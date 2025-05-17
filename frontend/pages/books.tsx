const Link = require('next/link').default
import { useEffect, useState } from "react";

interface Book {
    _id: string;
    title: string;
    author: string;
}

// const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const BASE_URL = "http://localhost:5000";

export default function BookPage() {
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${BASE_URL}/api/books`)
            .then((res) => res.json())
            .then((data) => {
                setBooks(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Failed to fetch books: Book.tsx: ", err);
                setLoading(false);
            });
    }, []);
    return (
        <div style={{ padding: '2rem' }}>
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
            <h1>📖 Books List</h1>
            <p>Here we'll show all books from the backend API.</p>
        </div>
    )
}