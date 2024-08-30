import React, { useState, useEffect, ChangeEvent } from 'react';
import { Modal, Button } from 'react-bootstrap';
import axios from 'axios';

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from './ListBooks.module.css';

interface Book {
  bookId: number;
  bookName: string;
  author: string;
  datePublished: string;
  genreType: string;
  quantity: number;
}

const ListBooks: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [bookIdToDelete, setBookIdToDelete] = useState<number | null>(null);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editedBook, setEditedBook] = useState<Partial<Book>>({});

  const handleCloseAddModal = () => setShowAddModal(false);
  const handleShowAddModal = () => setShowAddModal(true);

  const handleCloseDeleteModal = () => setShowDeleteModal(false);
  const handleShowDeleteModal = (bookId: number) => {
    setBookIdToDelete(bookId);
    setShowDeleteModal(true);
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await axios.get<Book[]>('http://localhost:14668/api/Book/GetAllBooks');
      setBooks(response.data);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  const deleteBook = async () => {
    if (bookIdToDelete === null) return;

    try {
      await axios.delete(`http://localhost:14668/api/Book/DeleteBook/${bookIdToDelete}`);
      fetchBooks();
      handleCloseDeleteModal();
      toast.success('Book deleted successfully!');
    } catch (error) {
      console.error('Error deleting book:', error);
      toast.error('Failed to delete the book. Please try again.');
    }
  };

  const startEditing = (index: number) => {
    setEditIndex(index);
    setEditedBook({ ...books[index] });
  };

  const handleEditChange = (e: ChangeEvent<HTMLInputElement>, field: keyof Book) => {
    const value = field === 'quantity' ? Number(e.target.value) : e.target.value;
    setEditedBook(prevState => ({
      ...prevState,
      [field]: value,
    }));
  };

  const saveEdit = async (bookId: number) => {
    try {
      await axios.put(`http://localhost:14668/api/Book/EditBook/${bookId}`, editedBook);
      fetchBooks();
      setEditIndex(null);
      setEditedBook({});
      toast.success('Book updated successfully!');
    } catch (error) {
      console.error('Error updating book:', error);
      toast.error('Failed to update the book. Please try again.');
    }
  };

  const [bookName, setBookName] = useState('');
  const [author, setAuthor] = useState('');
  const [datePublished, setDatePublished] = useState('');
  const [genreType, setGenreType] = useState('');
  const [quantity, setQuantity] = useState(0);

  const handleAddBook = async () => {
    const newBook: Book = { bookId: 0, bookName, author, datePublished, genreType, quantity };
    try {
      const response = await axios.post('http://localhost:14668/api/Book/AddBook', newBook);
      setBooks([...books, { ...newBook,bookId: response.data.id }]);
      setBookName('');
      setAuthor('');
      setDatePublished('');
      setGenreType('');
      setQuantity(0);
      handleCloseAddModal();
      toast.success('Book added successfully!');
    } catch (error) {
      console.error('Error adding book:', error);
      
      toast.error('Failed to add the book. Please try again.');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>LIST OF BOOKS</h1>
      </div>
      <div className="row justify-content-center">
        <div className="col-lg-12">
          <div className={styles.tableContainer}>
            <div className="col-lg-12">
              <Button variant="primary" className={styles.addBtn} onClick={handleShowAddModal}>
                ADD BOOKS
              </Button>
              <Modal show={showAddModal} onHide={handleCloseAddModal} centered>
                <Modal.Header closeButton></Modal.Header>
                <Modal.Body className="p-0">
                  <section className={styles.addbooks}>
                    <div className={styles.addbookswrapper}>
                      <div className={styles.addbooksformbox}>
                        <form onSubmit={(e) => {
                          e.preventDefault();
                          handleAddBook();
                        }}>
                          <h1>ADD BOOKS</h1>
                          <div className="row">
                            <div className={`col-lg-12 ${styles.addbooksinputbox}`}>
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
                            <div className={`col-lg-6 ${styles.addbooksinputbox}`}>
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
                            <div className={`col-lg-6 ${styles.addbooksinputbox}`}>
                              <div>
                                <span>Genre :</span>
                                <input
                                  type="text"
                                  placeholder="Genre"
                                  value={genreType}
                                  onChange={(e) => setGenreType(e.target.value)}
                                  required
                                />
                              </div>
                            </div>
                          </div>
                          <div className="row">
                            <div className={`col-lg-6 ${styles.addbooksinputbox}`}>
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
                            <div className={`col-lg-6 ${styles.addbooksinputbox}`}>
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
                          <button className={styles.addbooksbtn} type="submit">
                            ADD BOOK TO LIBRARY
                          </button>
                        </form>
                      </div>
                    </div>
                  </section>
                </Modal.Body>
              </Modal>
            </div>
            <div className="table-responsive col-lg-12">
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Book Name</th>
                    <th>Author</th>
                    <th>Date Published</th>
                    <th>Genre</th>
                    <th>Quantity</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {books.map((book, index) => (
                    <tr key={book.bookId}>
                      {editIndex === index ? (
                        <>
                          <td>
                            <input
                              type="text"
                              value={editedBook.bookName || ''}
                              onChange={(e) => handleEditChange(e, 'bookName')}
                              className="form-control"
                              style={{ maxWidth: '150px' }}
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              value={editedBook.author || ''}
                              onChange={(e) => handleEditChange(e, 'author')}
                              className="form-control"
                              style={{ maxWidth: '150px' }}
                            />
                          </td>
                          <td>
                            <input
                              type="date"
                              value={editedBook.datePublished || ''}
                              onChange={(e) => handleEditChange(e, 'datePublished')}
                              className="form-control"
                              style={{ maxWidth: '150px' }}
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              value={editedBook.genreType || ''}
                              onChange={(e) => handleEditChange(e, 'genreType')}
                              className="form-control"
                              style={{ maxWidth: '150px' }}
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              value={editedBook.quantity || 0}
                              onChange={(e) => handleEditChange(e, 'quantity')}
                              className="form-control"
                              style={{ maxWidth: '100px' }}
                            />
                          </td>
                          <td>
                            <button className="btn" onClick={() => saveEdit(book.bookId)}>
                              💾
                            </button>
                            <button className="btn" onClick={() => setEditIndex(null)}>
                              ❌
                            </button>
                          </td>
                        </>
                      ) : (
                        <>
                          <td>{book.bookName}</td>
                          <td>{book.author}</td>
                          <td>{book.datePublished}</td>
                          <td>{book.genreType}</td>
                          <td>{book.quantity}</td>
                          <td>
                            <button className="btn" onClick={() => startEditing(index)}>
                              ✏️
                            </button>
                            <button className="btn" onClick={() => handleShowDeleteModal(book.bookId)}>
                              🗑️
                            </button>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
              <Modal show={showDeleteModal} onHide={handleCloseDeleteModal} centered>
                <Modal.Header closeButton></Modal.Header>
                <Modal.Body>
                  <h4>Are you sure you want to delete this book?</h4>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={handleCloseDeleteModal}>
                    Cancel
                  </Button>
                  <Button variant="danger" onClick={deleteBook}>
                    Delete
                  </Button>
                </Modal.Footer>
              </Modal>
              <ToastContainer />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListBooks;
