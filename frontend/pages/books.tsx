const Link = require('next/link').default
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import BookCard from "@/components/BookCard";

interface Book {
    _id: string;
    title: string;
    author: string;
    genre: string[];
    description?: string;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export default function BookPage() {
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);


    const logInteraction = async (action: string, bookId: string) => {
        const token = localStorage.getItem("token");
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        try {
            await fetch(`${BASE_URL}/interact`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    bookId,
                    action,
                    userId: user.id,
                }),
            });
        } catch (err) {
            console.error("Failed to log interaction", err);
        }
    };


    useEffect(() => {
        const fetchBooks = async () => {
            const token = localStorage.getItem("token"); // get token

            if (!token) {
                console.warn("No token found! User might not be logged in.");
                setLoading(false);
                return;
            }

            try {
                const res = await fetch(`${BASE_URL}/books`, {
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
                <div style={{ display: "flex", flexWrap: "wrap" }}>
                    {books.map((book) => (
                        <BookCard key={book._id} book={book} onInteract={logInteraction} />
                    ))}
                </div>
            ) : (
                <p>No books found or not authorized.</p>
            )}
        </div>
    )
}