'use client';
import './globals.css';
import { useEffect, useState } from "react";
import Navbar from '@/components/Navbar';
import BookCard from '@/components/BookCard'; // Adjust path as needed

interface Book {
    _id: string;
    title: string;
    author: string;
    genre: string[];
    description?: string;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
export default function Home() {
    const [recommended, setRecommended] = useState<Book[]>([]);
    const [explore, setExplore] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBooks = async () => {
            const token = localStorage.getItem("token");

            if (!token) {
                console.warn("User not logged in.");
                setLoading(false);
                return;
            }

            try {
                const res = await fetch(`${BASE_URL}/user/recommendations`, {
                    headers:
                    {
                        Authorization: `Bearer ${token}`,
                    }
                });

                const data = await res.json();
                setRecommended(data.recommended);
                setExplore(data.explore);
            } catch (err) {
                alert("Failed to fetch home books:");
            } finally {
                setLoading(false);
            }
        };

        fetchBooks();
    }, []);

    const logInteraction = async (action: string, bookId: string) => {
        const token = localStorage.getItem("token");
        const user = JSON.parse(localStorage.getItem("user") || "{}");

        if (!token) {
            return console.warn("Missing token or userId for interaction.");
        }
        if (!user?.id) {
            return console.warn("user nai hai idk what -- index.tsx")
        }
        console.log("Logging interaction — user.id:", user.id);

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
            }
            );

        } catch (err) {
            console.error(`Failed to log ${action} for ${bookId}:`, err);
        }
    };


    return (
        <div style={{ padding: '2rem' }}>
            <Navbar />
            <h1>🏠 Home</h1>

            {loading ? (
                <p>Loading books...</p>
            ) : (
                <>
                    {recommended.length > 0 && (
                        <section>
                            <h2>✨ Recommended for You</h2>
                            <div style={{ display: "flex", flexWrap: "wrap" }}>
                                {recommended.map(book => (
                                    <BookCard key={book._id} book={book} onInteract={logInteraction} />
                                ))}
                            </div>
                        </section>
                    )}

                    {
                        recommended.length > 0 && (<section>
                            <h2>📚 Explore More</h2>
                            <div style={{ display: "flex", flexWrap: "wrap" }}>
                                {explore.map(book => (
                                    <BookCard key={book._id} book={book} onInteract={logInteraction} />
                                ))}
                            </div>
                        </section>
                        )}
                </>
            )}
        </div>
    );
}
