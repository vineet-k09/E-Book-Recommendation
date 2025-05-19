'use client';
import { useEffect, useState } from "react";
import Navbar from '@/components/Navbar';
import BookCard from '@/components/BookCard'; // Adjust path as needed
import styles from './index.module.css'; // Adjust path as needed
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
                alert("Please log in to see your recommendations.");
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
                setRecommended(data.recommended || {});
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
        <div>
            <Navbar />

            <div className={styles.hero}>
                <h1>Welcome to BiblioCentury</h1>
                <p className={styles['scroll-down']}>Scroll down to explore your next read 📖</p>
            </div>

            <div className={styles.section}>
                {loading ? (
                    <p>Loading books...</p>
                ) : (
                    <>
                        {recommended.length > 0 && (
                            <section>
                                <h2>✨ Recommended for You</h2>
                                <div className={styles['books-grid']}>
                                    {recommended.map(book => (
                                        <BookCard key={book._id} book={book} onInteract={logInteraction} />
                                    ))}
                                </div>
                            </section>
                        )}

                        {recommended.length > 0 && (
                            <section style={{ marginTop: "3rem" }}>
                                <h2>📚 Explore More</h2>
                                <div className={styles['books-grid']}>
                                    {explore.map(book => (
                                        <BookCard key={book._id} book={book} onInteract={logInteraction} />
                                    ))}
                                </div>
                            </section>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
