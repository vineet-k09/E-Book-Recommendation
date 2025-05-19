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
        <div className="book-card">
            <img
                src={cover || "/placeholder.jpg"}
                alt={book.title}
                className="book-cover"
            />
            <h2 className="book-title">{book.title}</h2>
            <p className="book-author"><strong>Author:</strong> {book.author}</p>
            <p className="book-genres"><strong>Genres:</strong> {book.genre.join(", ")}</p>

            <div className="book-actions">
                {["click", "like", "dislike", "bookmark", "read"].map((action) => (
                    <button
                        key={action}
                        onClick={() => onInteract(action, book._id)}
                        className="book-action-btn"
                    >
                        {action}
                    </button>
                ))}
            </div>
        </div>
      );
}
