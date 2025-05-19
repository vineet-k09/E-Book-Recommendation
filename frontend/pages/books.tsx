//frontend/pages/books.tsx
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

    // paging
    const [currentPage, setCurrentPage] = useState(1);
    const booksPerPage = 15;

    const indexOfLastBook = currentPage * booksPerPage;
    const indexOfFirstBook = indexOfLastBook - booksPerPage;
    const currentBooks = books.slice(indexOfFirstBook, indexOfLastBook);

    const totalPages = Math.ceil(books.length / booksPerPage);

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };


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
            <h1 className="text-4xl font-bold mb-6 text-center">📖 Books List</h1>

            {loading ? (
                <p className="text-center">Loading books...</p>
            ) : books.length > 0 ? (
                <>
                    <div className="flex flex-wrap justify-center gap-6">
                        {currentBooks.map((book) => (
                            <BookCard key={book._id} book={book} onInteract={logInteraction} />
                        ))}
                    </div>

                    {/* Pagination */}
                    <div className="mt-10 flex justify-center items-center gap-4">
                        <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                            ⬅️ Prev
                        </button>
                        {[...Array(totalPages)].map((_, i) => (
                            <button
                                key={i}
                                onClick={() => handlePageChange(i + 1)}
                                style={{
                                    fontWeight: currentPage === i + 1 ? "bold" : "normal",
                                    textDecoration: currentPage === i + 1 ? "underline" : "none",
                                    padding: "0.4rem 0.8rem",
                                    backgroundColor: "transparent",
                                    color: "var(--foreground)",
                                    border: "1px solid var(--primary)",
                                    borderRadius: "8px",
                                }}
                            >
                                {i + 1}
                            </button>
                        ))}
                        <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                            Next ➡️
                        </button>
                    </div>
                </>
            ) : (
                <p className="text-center">No books found or not authorized.</p>
            )}
        </div>
    )
}