const Link = require('next/link').default
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";

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
        const fetchBooks = async () => {
            const token = localStorage.getItem("token"); // get token

            if (!token) {
                console.warn("No token found! User might not be logged in.");
                setLoading(false);
                return;
            }

            try {
                const res = await fetch(`${BASE_URL}/api/books`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!res.ok) {
                    throw new Error(`Failed to fetch books: ${res.statusText}`);
                }

                const data = await res.json();
                setBooks(data);
            } catch (err) {
                console.error("Failed to fetch books: Book.tsx: ", err);
            } finally {
                setLoading(false);
            }
        };

        fetchBooks();
    }, []);

    return (
        <div style={{ padding: '2rem' }}>
            <Navbar />
            <h1>📖 Books List</h1>
            {loading ? (
                <p>Loading books...</p>
            ) : books.length > 0 ? (
                <ul>
                    {books.map((book) => (
                        <li key={book._id}>
                            <strong>{book.title}</strong> — {book.author}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No books found or not authorized.</p>
            )}
        </div>
    )
}