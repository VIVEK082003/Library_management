import React, { useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import Styles from "./AddGenre.module.css";

const AddGenres: React.FC = () => {
  const [genreId, setGenreId] = useState<string>("");
  const [genreType, setGenreType] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:14668/api/users/AddGenre", {
        genreId: genreId,
        genreType: genreType,
      });
      if (response.status === 200) {
        setMessage("Genre added successfully!");
        setGenreId("");
        setGenreType("");
      }
    } catch (error) {
      setMessage("Error adding genre. Please try again.");
    }
  };

  const handleGenreIdChange = (e: ChangeEvent<HTMLInputElement>) => {
    setGenreId(e.target.value);
  };

  const handleGenreTypeChange = (e: ChangeEvent<HTMLInputElement>) => {
    setGenreType(e.target.value);
  };

  return (
    <>
      <section className={Styles.addgeneres}>
        <div className={Styles.addgenereswrapper}>
          <div className={Styles.addgeneresformbox}>
            <form onSubmit={handleSubmit}>
              <h1>ADD GENRES</h1>
              <div className="row">
                <div className={`col-lg-12 ${Styles.addgeneresinputbox}`}>
                  <div>
                    <span>Enter Genre ID</span>
                    <input
                      type="text"
                      placeholder="Genre ID"
                      value={genreId}
                      onChange={handleGenreIdChange}
                      required
                    />
                  </div>
                </div>
                <div className={`col-lg-12 ${Styles.addgeneresinputbox}`}>
                  <div>
                    <span>Enter Genre Type</span>
                    <input
                      type="text"
                      placeholder="Genre Type You Want To Add"
                      value={genreType}
                      onChange={handleGenreTypeChange}
                      required
                    />
                  </div>
                </div>
              </div>
              <button className={Styles.addgeneresbtn} type="submit">
                ADD GENRE
              </button>
            </form>
            {message && <p>{message}</p>}
          </div>
        </div>
      </section>
    </>
  );
};

export default AddGenres;
