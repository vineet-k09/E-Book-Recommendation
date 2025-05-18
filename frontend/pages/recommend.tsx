// pages/recommendation-setup.tsx
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const genres = [
    "Fantasy", 
    "Mystery", 
    "Romance", 
    "Sci-Fi", 
    "Historical Fiction", 
    "Adventure", 
    "Horror", 
    "Crime Thriller", 
    "Comedy"
];


const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function RecommendationSetup() {
    const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/login");
        }
    }, [router]);

    const toggleGenre = (genre: string) => {
        setSelectedGenres((prev) =>
            prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
        );
    };

    const handleSubmit = async () => {
        const token = localStorage.getItem("token");
        if (!token || selectedGenres.length === 0) return;

        const res = await fetch(`${API_URL}/user/preferences`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ genres: selectedGenres }),
        });

        if(!res.ok){
            const { error } = await res.json();
            console.error("Error saving preferences:", error);
            return; // optionally show a toast or message
        }

        router.push("/");
    };

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Pick Your Preferred Genres 🎯</h1>
            <div className="flex flex-wrap gap-3 mb-6">
                {genres.map((genre) => (
                    <button
                        key={genre}
                        onClick={() => toggleGenre(genre)}
                        className={`px-4 py-2 rounded-full border transition-colors duration-200 ${selectedGenres.includes(genre)
                            ? "bg-blue-700 text-white border-blue-900 shadow-lg"
                            : "bg-gray-100 text-black hover:bg-gray-200"
                            }`
                        }
                    >
                        {genre}
                    </button>
                ))}
            </div>
            <button
                onClick={handleSubmit}
                className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
            >
                Continue to Home →
            </button>
        </div>
    );
}
