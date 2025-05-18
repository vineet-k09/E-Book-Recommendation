// pages/profile.tsx
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import BookCard from "@/components/BookCard"; // Reusing it 😘

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

interface Book {
    _id: string;
    title: string;
    author: string;
    genre: string[];
    description?: string;
}

interface Log {
    action: string;
    bookId: string;
}

const tabs = ["like", "read", "bookmark", "dislike"];

export default function Profile() {
    const [books, setBooks] = useState<Book[]>([]);
    const [logs, setLogs] = useState<Log[]>([]);
    const [activeTab, setActiveTab] = useState<string>("liked");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem("token");
            const user = JSON.parse(localStorage.getItem("user") || "{}");

            if (!token) {
                console.warn("User not logged in");
                setLoading(false);
                return;
            }

            try {
                const [bookRes, logRes] = await 
                Promise.all([
                    fetch(`${BASE_URL}/books`, {
                        headers: { Authorization: `Bearer ${token}` }
                    }),
                    fetch(`${BASE_URL}/interact?userId=${user.id}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    })
                ]);

                const bookData = await bookRes.json();
                const logData = await logRes.json();

                setBooks(bookData);
                setLogs(logData.logs);
            } catch (err) {
                console.error("Error loading profile page:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const filteredBookIds = logs
        .filter(log => log.action.toLowerCase() === activeTab.toLowerCase())
        .map(log => log.bookId);  

    const filteredBooks = books.filter(book => filteredBookIds.includes(book._id));

    return (
        <div style={{ padding: "2rem" }}>
            <Navbar />
            <h1>👤 Your Profile</h1>

            <div style={{ marginBottom: "1rem", display: "flex", gap: "1rem" }}>
                {tabs.map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        style={{
                            padding: "8px 16px",
                            borderRadius: "6px",
                            backgroundColor: tab === activeTab ? "#333" : "#eee",
                            color: tab === activeTab ? "#fff" : "#000",
                            border: "none",
                            cursor: "pointer"
                        }}
                    >
                        {tab.toUpperCase()}
                    </button>
                ))}
            </div>

            {loading ? (
                <p>Loading...</p>
            ) : filteredBooks.length > 0 ? (
                <div style={{ display: "flex", flexWrap: "wrap" }}>
                    {filteredBooks.map(book => (
                        <BookCard key={book._id} book={book} onInteract={() => { }} />
                    ))}
                </div>
            ) : (
                <p>No books found in "{activeTab}"</p>
            )}
        </div>
    );
}
