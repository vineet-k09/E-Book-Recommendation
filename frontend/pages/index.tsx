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

//interface for pyspark recommendations n popular choice
interface RecEntry {
    user_id: string;
    recommendations: { book_id: string; score: number }[];
}

interface PopularEntry {
    book_id: string;
    rating_count: number;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
export default function Home() {
    const [spRecommended, setSpRecommended] = useState<Book[]>([]);
    const [popular, setPopular] = useState<PopularEntry[]>([]);
    const [recommended, setRecommended] = useState<Book[]>([]);
    const [explore, setExplore] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBooks = async () => {
            const token = localStorage.getItem("token");
            const user = JSON.parse(localStorage.getItem("user") || "{}");

            if (!token) {
                console.warn("User not logged in.");
                alert("Please log in to see your recommendations.");
                setLoading(false);
                return;
            }

            try {
                // 1) pyspark - recommendations.json fetching data
                const recRes = await fetch('/recommendations.json');
                const recData: RecEntry[] = await recRes.json();

                // 2) Grab only this user's recs
                const userRec = recData.find(r => r.user_id === user.id);
                const bookIds = userRec?.recommendations.map(r => r.book_id) || [];

                // 3) Fetch book details for those recommended IDs
                //    (Assuming you have an API to fetch books by ID)
                const recoBooks: Book[] = await Promise.all(
                    bookIds.map(id =>
                        fetch(`${BASE_URL}/books/${id}`, {
                            headers:
                            {
                                Authorization: `Bearer ${token}`,
                            }
                        })
                            .then(r => r.json())
                    )
                );
                setSpRecommended(recoBooks);
                console.log("Spark Recommended books:", recoBooks);

                // mongodb fetching data 
                const res = await fetch(`${BASE_URL}/user/recommendations`, {
                    headers:
                    {
                        Authorization: `Bearer ${token}`,
                    }
                });

                const data = await res.json();
                setRecommended(data.recommended || {});

                // 4) Fetch popular books JSON, then fetch their details
                const popRes = await fetch('/popular_books.json');
                const popData: PopularEntry[] = await popRes.json();
                setPopular(popData.slice(0, 15));  // top 15

                const popBookIds = popData.slice(0, 15).map(p => p.book_id);
                const popBooks: Book[] = await Promise.all(
                    popBookIds.map(id =>
                        fetch(`${BASE_URL}/books/${id}`, {
                            headers:
                            {
                                Authorization: `Bearer ${token}`,
                            }
                        })
                            .then(r => r.json())
                    )
                );

                setExplore(popBooks);

                // setExplore(data.explore);
            } catch (err) {

                console.error(err);
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
                <h1>Welcome to BiblioVerse</h1>
                <p className={styles['scroll-down']}>Scroll down to explore your next read 📖</p>
            </div>

            <div className={styles.section}>
                {loading ? (
                    <p>Loading books...</p>
                ) : (
                    <>{spRecommended.length > 0 && (
                        <section>
                            <h2>✨ Recommended for you ~ By PySpark </h2>
                            <div className={styles['books-grid']}>
                                {spRecommended.map(book => (
                                    <BookCard key={book._id} book={book} onInteract={logInteraction} />
                                ))}
                            </div>
                        </section>
                    )}
                        {recommended.length > 0 && (
                            <section>
                                <h2>✨ Your Choices</h2>
                                <div className={styles['books-grid']}>
                                    {recommended.map(book => (
                                        <BookCard key={book._id} book={book} onInteract={logInteraction} />
                                    ))}
                                </div>
                            </section>
                        )}

                        {recommended.length > 0 && (
                            <section style={{ marginTop: "3rem" }}>
                                <h2>Trending Now ~ 📚 Explore More </h2>
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
