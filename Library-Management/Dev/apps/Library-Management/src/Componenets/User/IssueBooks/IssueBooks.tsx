import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from "./IssueBooks.module.css";

interface Book {
  bookId: number;
  bookName: string;
  author: string;
  datePublished: string;
  genreType: string;
  quantity: number;
}

const IssueBook: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedBook, setSelectedBook] = useState<number | "">("");
  const [selectedBookDetails, setSelectedBookDetails] = useState<Book | null>(null);
  const [dateIssued, setDateIssued] = useState<string>("");
  const [dateReturn, setDateReturn] = useState<string>("");
  const [userName, setUserName] = useState<string>("");

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch("http://localhost:14668/api/RequestBook/available-books");
        if (response.ok) {
          const data: Book[] = await response.json();
          setBooks(data);
        } else {
          toast.error("Failed to load books.");
        }
      } catch (error) {
        if (error instanceof Error) {
          toast.error("Error: " + error.message);
        } else {
          toast.error("An unexpected error occurred.");
        }
      }
    };

    fetchBooks();
  }, []);

  useEffect(() => {
    const storedUserData = sessionStorage.getItem("UserData");
    if (storedUserData) {
      try {
        const userData = JSON.parse(storedUserData);
        setUserName(userData.userName);
      } catch (error) {
        toast.error("Failed to parse user data.");
      }
    } else {
      toast.error("User data not found in session storage.");
    }
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
  
    if (!selectedBookDetails || dateIssued === "" || dateReturn === "" || !userName) {
      toast.error("Please fill in all fields.");
      return;
    }
  
    if (new Date(dateReturn) < new Date(dateIssued)) {
      toast.error("Return date cannot be before the issue date.");
      return;
    }
  
    // Format the datePublished to include the timezone
    const formattedDatePublished = new Date(selectedBookDetails.datePublished).toISOString();
  
    // Adjust the genreType field
    const updatedBook = {
      ...selectedBookDetails,
      quantity: selectedBookDetails.quantity - 1,
      datePublished: formattedDatePublished,
      genreType: selectedBookDetails.genreType || "", // Default to an empty string if genreType is not present
    };
  
    const requestData = {
      userName,
      bookName: updatedBook.bookName,
      dateIssued,
      dateReturn,
    };
  
    try {
      const response = await fetch("http://localhost:14668/api/RequestBook", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });
  
      if (response.ok) {
        // Log the updated book details
        console.log("Updated Book Details:", updatedBook);
  
        // Update book details in the backend
        const editResponse = await fetch(`http://localhost:14668/api/Book/EditBook/${updatedBook.bookId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedBook),
        });
  
        if (editResponse.ok) {
          toast.success("Book request submitted.");
        } else {
          toast.error("Failed to update book quantity.");
        }
  
        // Clear form fields
        setSelectedBook("");
        setSelectedBookDetails(null);
        setDateIssued("");
        setDateReturn("");
      } else {
        toast.error("Error submitting book request.");
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error("Error: " + error.message);
      } else {
        toast.error("An unexpected error occurred.");
      }
    }
  };
  

  const handleBookChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const bookId = Number(event.target.value);
    const book = books.find((b) => b.bookId === bookId);
    setSelectedBook(bookId);
    setSelectedBookDetails(book || null);
  };

  return (
    <section className={styles.issuebook}>
      <div className={styles.issuebookwrapper}>
        <div className={styles.issuebookformbox}>
          <form onSubmit={handleSubmit}>
            <h1>ISSUE BOOK</h1>
            <div className="row">
              <div className={`${styles["col-lg-12"]} ${styles.issuebookinputbox}`}>
                <div>
                  <span>Book Name:</span>
                  <select
                    value={selectedBook}
                    onChange={handleBookChange}
                    required
                  >
                    <option value="">Select a book</option>
                    {books.map((book) => (
                      <option key={book.bookId} value={book.bookId}>
                        {book.bookName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className={`${styles["col-lg-12"]} ${styles.issuebookinputbox}`}>
                <div>
                  <span>Date Issued:</span>
                  <input
                    type="date"
                    value={dateIssued}
                    onChange={(e) => setDateIssued(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className={`${styles["col-lg-12"]} ${styles.issuebookinputbox}`}>
                <div>
                  <span>Date Return:</span>
                  <input
                    type="date"
                    value={dateReturn}
                    onChange={(e) => setDateReturn(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>
            <button 
              className={styles.issuebookbtn} 
              type="submit"
              disabled={!selectedBook || !dateIssued || !dateReturn}
            >
              REQUEST
            </button>
          </form>
        </div>
      </div>
      <ToastContainer />
    </section>
  );
};

export default IssueBook;
