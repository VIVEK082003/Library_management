import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Styles from "./ListBooksUser.module.css";

interface Book {
  bookName: string;
  author: string;
  datePublished: string;
  quantity: number;
}

const ListBooksUser: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch available books from the API
    const fetchBooks = async () => {
      try {
        const response = await fetch("http://localhost:14668/api/RequestBook/available-books");
        if (response.ok) {
          const data: Book[] = await response.json();
          setBooks(data);
        } else {
          console.error("Failed to fetch books.");
        }
      } catch (error) {
        if (error instanceof Error) {
          console.error("Error fetching books: " + error.message);
        } else {
          console.error("An unexpected error occurred.");
        }
      }
    };

    fetchBooks();
  }, []);

  return (
    <div className={Styles.container}>
      <div className={Styles.header}>
        <h1>LIST OF BOOKS</h1>
      </div>
      <div className="row justify-content-center">
        <div className="col-lg-12">
          <div className={`${Styles.tableContainer} row`}>
            <div className="table-responsive col-lg-12">
              <table className={`table ${Styles.table}`}>
                <thead>
                  <tr>
                    <th>Book Name</th>
                    <th>Author</th>
                    <th>Date Published</th>
                    <th>Quantity</th>
                  </tr>
                </thead>
                <tbody>
                  {books.map((book, index) => (
                    <tr key={index}>
                      <td>{book.bookName}</td>
                      <td>{book.author}</td>
                      <td>{book.datePublished}</td>
                      <td>{book.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListBooksUser;
