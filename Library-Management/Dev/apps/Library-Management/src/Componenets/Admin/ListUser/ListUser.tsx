import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { Modal, Button } from 'react-bootstrap';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Styles from './ListUser.module.css';

interface User {
  userId: string;
  userName: string;
  email: string;
  password: string;
  isAdmin: boolean;
}

const ListUser: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [userIdToDelete, setUserIdToDelete] = useState<string | null>(null);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editedUser, setEditedUser] = useState<Partial<User>>({});

  const [formData, setFormData] = useState<Partial<User>>({
    userName: '',
    email: '',
    password: '',
    isAdmin: false,
  });

  const handleCloseAddModal = () => setShowAddModal(false);
  const handleShowAddModal = () => setShowAddModal(true);

  const handleCloseDeleteModal = () => setShowDeleteModal(false);
  const handleShowDeleteModal = (userId: string) => {
    setUserIdToDelete(userId);
    setShowDeleteModal(true);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get<User[]>('http://localhost:14668/api/Users/GetAllUsers');
      setUsers(response.data);
    } catch (error) {
      toast.error('Error fetching users');
      console.error('Error fetching users:', error);
    }
  };

  const deleteUser = async () => {
    if (!userIdToDelete) return;
    try {
      await axios.delete(`http://localhost:14668/api/Users/DeleteUser/${userIdToDelete}`);
      fetchUsers();
      handleCloseDeleteModal();
      toast.success('User deleted successfully');
    } catch (error) {
      toast.error('Error deleting user');
      console.error('Error deleting user:', error);
    }
  };

  const startEditing = (index: number) => {
    setEditIndex(index);
    setEditedUser({ ...users[index] });
  };

  const handleEditChange = (e: ChangeEvent<HTMLInputElement>, field: keyof User) => {
    const value = field === 'isAdmin' ? e.target.checked : e.target.value;
    setEditedUser(prevState => ({
      ...prevState,
      [field]: value,
    }));
  };

  const saveEdit = async (userId: string) => {
    try {
      await axios.put(`http://localhost:14668/api/Users/EditUser/${userId}`, editedUser);
      fetchUsers();
      setEditIndex(null);
      setEditedUser({});
      toast.success('User updated successfully');
    } catch (error) {
      toast.error('Error updating user');
      console.error('Error updating user:', error);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:14668/api/Users/AddUser', formData);
      fetchUsers();
      handleCloseAddModal();
      setFormData({
        userName: '',
        email: '',
        password: '',
        isAdmin: false,
      });
      toast.success('User added successfully');
    } catch (error) {
      toast.error('Error adding user');
      console.error('Error adding user:', error);
    }
  };

  return (
    <div className={Styles.container}>
      <div className={Styles.header}>
        <h1>LIST OF USERS</h1>
      </div>
      <div className="row justify-content-center">
        <div className="col-lg-12">
          <div className={`row ${Styles.tableContainer}`}>
            <div className="col-lg-12">
              <Button variant="primary" className={Styles.addButton} onClick={handleShowAddModal}>
                ADD USER
              </Button>
              <Modal show={showAddModal} onHide={handleCloseAddModal} centered>
                <Modal.Header closeButton></Modal.Header>
                <Modal.Body className="p-0">
                  <section className={Styles.adduser}>
                    <div className={Styles.adduserwrapper}>
                      <div className={Styles.adduserformbox}>
                        <form onSubmit={handleSubmit}>
                          <h1>ADD USER</h1>
                          <div className="row">
                            <div className={`col-lg-12 ${Styles.adduserinputbox}`}>
                              <div>
                                <span>User-Name :</span>
                                <input
                                  type="text"
                                  name="userName"
                                  placeholder="User-Name"
                                  value={formData.userName || ''}
                                  onChange={handleChange}
                                  required
                                />
                              </div>
                            </div>
                          </div>
                          <div className="row">
                            <div className={`col-lg-6 ${Styles.adduserinputbox}`}>
                              <div>
                                <span>Email :</span>
                                <input
                                  type="email"
                                  name="email"
                                  placeholder="Email"
                                  value={formData.email || ''}
                                  onChange={handleChange}
                                  required
                                />
                              </div>
                            </div>
                            <div className={`col-lg-6 ${Styles.adduserinputbox}`}>
                              <div>
                                <span>Password :</span>
                                <input
                                  type="password"
                                  name="password"
                                  placeholder="Password"
                                  value={formData.password || ''}
                                  onChange={handleChange}
                                  required
                                />
                              </div>
                            </div>
                          </div>
                          <div className="row">
                            <div className={`col-lg-12 ${Styles.adduserinputbox}`}>
                              <div>
                                <span>Admin :</span>
                                <input
                                  type="checkbox"
                                  name="isAdmin"
                                  checked={formData.isAdmin || false}
                                  onChange={handleChange}
                                />
                              </div>
                            </div>
                          </div>
                          <button className={Styles.adduserbtn} type="submit">
                            ADD USER
                          </button>
                        </form>
                      </div>
                    </div>
                  </section>
                </Modal.Body>
              </Modal>
            </div>
            <div className={`table-responsive col-lg-12 ${Styles.tableResponsive}`}>
              <table className={Styles.table}>
                <thead>
                  <tr>
                    <th>UserId</th>
                    <th>UserName</th>
                    <th>Email</th>
                    <th>Password</th>
                    <th>IsAdmin</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => (
                    <tr key={index}>
                      <td>{user.userId}</td>
                      <td>
                        {editIndex === index ? (
                          <input
                            type="text"
                            value={editedUser.userName || user.userName}
                            onChange={(e) => handleEditChange(e, 'userName')}
                          />
                        ) : (
                          user.userName
                        )}
                      </td>
                      <td>
                        {editIndex === index ? (
                          <input
                            type="text"
                            value={editedUser.email || user.email}
                            onChange={(e) => handleEditChange(e, 'email')}
                          />
                        ) : (
                          user.email
                        )}
                      </td>
                      <td>
                        {editIndex === index ? (
                          <input
                            type="password"
                            value={editedUser.password || user.password}
                            onChange={(e) => handleEditChange(e, 'password')}
                          />
                        ) : (
                          user.password
                        )}
                      </td>
                      <td>
                        {editIndex === index ? (
                          <input
                            type="checkbox"
                            checked={editedUser.isAdmin || user.isAdmin}
                            onChange={(e) => handleEditChange(e, 'isAdmin')}
                          />
                        ) : user.isAdmin ? (
                          'Yes'
                        ) : (
                          'No'
                        )}
                      </td>
                      <td>
                        {editIndex === index ? (
                          <>
                            <button className={`btn ${Styles.editButton}`} onClick={() => saveEdit(user.userId)}>
                              💾
                            </button>
                            <button className={`btn ${Styles.editButton}`} onClick={() => setEditIndex(null)}>
                              ❌
                            </button>
                          </>
                        ) : (
                          <button className={`btn ${Styles.editButton}`} onClick={() => startEditing(index)}>
                            ✏️
                          </button>
                        )}
                        <button className={`btn ${Styles.deleteButton}`} onClick={() => handleShowDeleteModal(user.userId)}>
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <Modal show={showDeleteModal} onHide={handleCloseDeleteModal} centered>
                <Modal.Body>
                  <h4>Are you sure you want to delete this user?</h4>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={handleCloseDeleteModal}>
                    Cancel
                  </Button>
                  <Button variant="danger" onClick={deleteUser}>
                    Delete
                  </Button>
                </Modal.Footer>
              </Modal>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default ListUser;
