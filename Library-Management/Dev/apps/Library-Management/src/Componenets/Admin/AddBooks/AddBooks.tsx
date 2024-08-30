import React, { useState } from "react";
import Styles from "./AddBooks.module.css";

const AddBooks: React.FC = () => {
  const [bookName, setBookName] = useState("");
  const [author, setAuthor] = useState("");
  const [genre, setGenre] = useState("");
  const [datePublished, setDatePublished] = useState("");
  const [quantity, setQuantity] = useState(0);

  const handleAddBook = async () => {
    const bookData = {
      bookName,
      author,
      genre,
      datePublished,
      quantity,
    };

    try {
      const response = await fetch("http://localhost:14668/api/Book/AddBook", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookData),
      });

      if (response.ok) {
        // Handle success
        alert("Book added successfully!");
      } else {
        // Handle error
        alert("Failed to add book.");
      }
    } catch (error) {
      console.error("Error adding book:", error);
      alert("Error adding book.");
    }
  };

  return (
    <>
      <section className={Styles.addbooks}>
        <div className={Styles.addbookswrapper}>
          <div className={Styles.addbooksformbox}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAddBook();
              }}
            >
              <h1>ADD BOOKS</h1>
              <div className="row">
                <div className={`col-lg-12 ${Styles.addbooksinputbox}`}>
                  <div>
                    <span>Book-Name :</span>
                    <input
                      type="text"
                      placeholder="Book-Name"
                      value={bookName}
                      onChange={(e) => setBookName(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className={`col-lg-6 ${Styles.addbooksinputbox}`}>
                  <div>
                    <span>Author :</span>
                    <input
                      type="text"
                      placeholder="Author"
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className={`col-lg-6 ${Styles.addbooksinputbox}`}>
                  <div>
                    <span>Genre :</span>
                    <input
                      type="text"
                      placeholder="Genre"
                      value={genre}
                      onChange={(e) => setGenre(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className={`col-lg-6 ${Styles.addbooksinputbox}`}>
                  <div>
                    <span>Date-Published :</span>
                    <input
                      type="date"
                      value={datePublished}
                      onChange={(e) => setDatePublished(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className={`col-lg-6 ${Styles.addbooksinputbox}`}>
                  <div>
                    <span>Quantity :</span>
                    <input
                      type="number"
                      placeholder="Quantity"
                      value={quantity}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                      required
                    />
                  </div>
                </div>
              </div>
              <button className={Styles.addbooksbtn} type="submit">
                ADD BOOK TO LIBRARY
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default AddBooks;
