import { useEffect, useState } from "react";

interface Book {
    _id: string;
    title: string;
    author: string;
    genre: string[];
    description?: string;
}

interface Props {
    book: Book;
    onInteract: (action: string, bookId: string) => void;
}

export default function BookCard({ book, onInteract }: Props) {
    const [cover, setCover] = useState<string>("");
//enable when finalized
    // useEffect(() => {
    //     const fetchCover = async () => {
    //         try {
    //             const res = await fetch(
    //                 `https://www.googleapis.com/books/v1/volumes?q=intitle:${encodeURIComponent(book.title)}&maxResults=1`
    //             );
    //             const data = await res.json();
    //             const imageLink = data.items?.[0]?.volumeInfo?.imageLinks?.thumbnail;
    //             if (imageLink) setCover(imageLink);
    //         } catch (err) {
    //             console.error("Error fetching cover:", err);
    //         }
    //     };

    //     fetchCover();
    // }, [book.title]);

    return (
        <div style={{
            border: '1px solid #ccc',
            borderRadius: '8px',
            padding: '1rem',
            width: '250px',
            margin: '1rem',
            boxShadow: '0 0 10px rgba(0,0,0,0.1)'
        }}>
            <img src={cover || "/placeholder.jpg"} alt={book.title} style={{ width: '100%', height: 'auto', borderRadius: '6px' }} />
            <h2>{book.title}</h2>
            <p><strong>Author:</strong> {book.author}</p>
            <p><strong>Genres:</strong> {book.genre.join(', ')}</p>

            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {["click", "like", "dislike", "bookmark", "read"].map((action) => (
                    <button
                        key={action}
                        onClick={() => onInteract(action, book._id)}
                        style={{
                            padding: "4px 8px",
                            fontSize: "0.8rem",
                            borderRadius: "5px",
                            backgroundColor: "#f0f0f0",
                            cursor: "pointer"
                        }}
                    >
                        {action}
                    </button>
                ))}
            </div>
        </div>
    );
}
