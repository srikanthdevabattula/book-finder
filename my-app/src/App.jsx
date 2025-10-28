import { useState } from "react";

export default function App() {
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const searchBooks = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError("");
    setBooks([]);

    try {
      const res = await fetch(
        `https://openlibrary.org/search.json?title=${query}`
      );
      const data = await res.json();
      setBooks(data.docs.slice(0, 20));
    } catch (err) {
      setError("Something went wrong. Try again!");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold text-center mb-6">
        📚 Book Finder
      </h1>

      {/* Search Bar */}
      <div className="flex justify-center gap-2 max-w-md mx-auto">
        <input
          type="text"
          className="px-4 py-2 border rounded-lg w-full"
          placeholder="Search book title..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && searchBooks()}
        />
        <button
          onClick={searchBooks}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Search
        </button>
      </div>

      {loading && <p className="text-center mt-5">Loading...</p>}
      {error && <p className="text-center text-red-500 mt-5">{error}</p>}

      {/* Books Grid */}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-8">
        {books.map((book, i) => {
          const coverId = book.cover_i;
          const imgSrc = coverId
            ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`
            : "https://via.placeholder.com/150x220?text=No+Cover";

          return (
            <div
              key={i}
              className="bg-white p-4 shadow rounded-lg flex flex-col items-center"
            >
              <img
                className="w-32 h-48 object-cover rounded-md"
                src={imgSrc}
                alt={book.title}
              />
              <h3 className="text-lg font-semibold mt-3 text-center">
                {book.title}
              </h3>
              <p className="text-sm text-gray-600 text-center">
                {book.author_name?.[0] || "Unknown Author"}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {book.first_publish_year || "N/A"}
              </p>
            </div>
          );
        })}
      </div>

      {!loading && books.length === 0 && query && (
        <p className="text-center mt-6 text-gray-600">No books found</p>
      )}
    </div>
  );
}
