import React, { useState, useEffect } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { GoXCircleFill } from "react-icons/go";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Styles from "./Requests.module.css";

interface BookRequest {
  requestBookId: number; 
  userName: string;
  bookName: string;
  genre: string;
  dateIssued: string;
  dateReturn: string;
  status?: string;
}

const Requests: React.FC = () => {
  const [pendingBooks, setPendingBooks] = useState<BookRequest[]>([]);
  const [processedBooks, setProcessedBooks] = useState<BookRequest[]>([]);
  const [approvedBooks, setApprovedBooks] = useState<BookRequest[]>([]); 

  useEffect(() => {
    fetch("http://localhost:14668/api/RequestBook")
      .then((response) => response.json())
      .then((data) => setPendingBooks(data))
      .catch((error) => console.error("Error fetching pending books:", error));

    fetch("http://localhost:14668/api/RequestBook/approved-books")
      .then((response) => response.json())
      .then((data) => setApprovedBooks(data))
      .catch((error) => console.error("Error fetching approved books:", error));
  }, []);

  const deleteRequest = async (requestBookId: number) => {
    try {
      const response = await fetch(`http://localhost:14668/api/RequestBook/${requestBookId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        return true;
      } else {
        throw new Error('Failed to delete book request');
      }
    } catch (error) {
      console.error("Error deleting book request:", error);
      return false;
    }
  };

  const handleApprove = async (requestBookId: number) => {
    try {
      const response = await fetch(`http://localhost:14668/api/RequestBook/${requestBookId}/approve`, {
        method: 'POST',
      });

      if (response.status === 204) { 
        const book = pendingBooks.find((book) => book.requestBookId === requestBookId);
        if (book) {
          const deleteSuccess = await deleteRequest(requestBookId);
          if (deleteSuccess) {
            setPendingBooks(pendingBooks.filter((b) => b.requestBookId !== requestBookId));
            setApprovedBooks([...approvedBooks, { ...book, status: "Approved" }]);
            toast.success("Request approved successfully.");
          }
        }
      } else {
        throw new Error('Failed to approve book');
      }
    } catch (error) {
      console.error("Error approving book:", error);
      toast.error("Error approving request.");
    }
  };

  const handleReject = async (requestBookId: number) => {
    try {
      const response = await fetch(`http://localhost:14668/api/RequestBook/${requestBookId}/reject`, {
        method: 'POST',
      });

      if (response.status === 204) { 
        const book = pendingBooks.find((book) => book.requestBookId === requestBookId);
        if (book) {
          const deleteSuccess = await deleteRequest(requestBookId); 
          if (deleteSuccess) {
            setPendingBooks(pendingBooks.filter((b) => b.requestBookId !== requestBookId));
            setProcessedBooks([...processedBooks, { ...book, status: "Rejected" }]);
            toast.success("Request rejected successfully.");
          }
        }
      } else {
        throw new Error('Failed to reject book');
      }
    } catch (error) {
      console.error("Error rejecting book:", error);
      toast.error("Error rejecting request.");
    }
  };

  return (
    <div className={Styles.container}>
      <div className={Styles.header}>
        <h1>BOOK REQUESTS</h1>
      </div>
      <div className="row justify-content-center">
        <div className="col-lg-12">
          <div className={`${Styles.tableContainer} row`}>
            <div className="table-responsive col-lg-12">
              <h2>Pending Requests</h2>
              <table className={Styles.table}>
                <thead>
                  <tr>
                    <th>Username</th>
                    <th>Book Name</th>
                    <th>Date Issued</th>
                    <th>Date Return</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingBooks.map((book) => (
                    <tr key={book.requestBookId}>
                      <td>{book.userName}</td>
                      <td>{book.bookName}</td>
                      <td>{book.dateIssued}</td>
                      <td>{book.dateReturn}</td>
                      <td>
                        <button
                          className={Styles.editButton}
                          onClick={() => handleApprove(book.requestBookId)}
                        >
                          <FaCheckCircle className={`${Styles.requesticon} text-success`} />
                        </button>
                        <button
                          className={Styles.deleteButton}
                          onClick={() => handleReject(book.requestBookId)}
                        >
                          <GoXCircleFill className={`${Styles.requesticon} text-danger`} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="table-responsive col-lg-12">
              <h2>Rejected Requests</h2>
              <table className={Styles.table}>
                <thead>
                  <tr>
                    <th>Username</th>
                    <th>Book Name</th>
                    <th>Date Issued</th>
                    <th>Date Return</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {processedBooks.map((book) => (
                    <tr key={book.requestBookId}>
                      <td>{book.userName}</td>
                      <td>{book.bookName}</td>
                      <td>{book.dateIssued}</td>
                      <td>{book.dateReturn}</td>
                      <td>{book.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="table-responsive col-lg-12">
              <h2>Approved Requests</h2>
              <table className={Styles.table}>
                <thead>
                  <tr>
                    <th>Username</th>
                    <th>Book Name</th>
                    <th>Date Issued</th>
                    <th>Date Return</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {approvedBooks.map((book) => (
                    <tr key={book.requestBookId}>
                      <td>{book.userName}</td>
                      <td>{book.bookName}</td>
                      <td>{book.dateIssued}</td>
                      <td>{book.dateReturn}</td>
                      <td>{book.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Requests;
