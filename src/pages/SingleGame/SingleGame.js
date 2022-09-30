import React, { useState, useEffect } from "react";
import imageNotFound from "../../assets/images/image-not-found.png";

import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";

import LoadingComponent from "../../components/LoadingComponent";
import ErrorMessageComponent from "../../components/ErrorMessageComponent";
import Cookies from "js-cookie";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const SingleGame = ({
  modalLogin,
  setModalLogin,
  token,
  favoris,
  setFavoris,
}) => {
  const { state } = useLocation();
  const { id } = state;

  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [refresh, setRefresh] = useState(false);

  const [fullDescription, setFullDescription] = useState(false);

  const [gameData, setGameData] = useState([]);
  const [gamesSuggestion, setGamesSuggestion] = useState([]);
  const [reviewsData, setReviewsData] = useState();

  const [reviewModal, setReviewModal] = useState(false);

  const [addReviewTitle, setAddReviewTitle] = useState("");
  const [addReviewDescription, setAddReviewDescription] = useState("");

  const getGameData = async () => {
    setIsLoading(true);
    setErrorMessage("");
    setReviewsData();
    try {
      // fetch game data with id
      let url_server = `https://api.rawg.io/api/games/${id}?key=${process.env.REACT_APP_API_KEY}`;
      const responseGameData = await axios.get(url_server);

      setGameData(responseGameData.data);

      // fetch suggestion games
      let genresString = "";
      responseGameData.data.genres.map((genre) => {
        genresString += `${genre.slug},`;
        // console.log(genresString);
      });

      url_server = `https://api.rawg.io/api/games?genres=${genresString}&page_size=10&key=${process.env.REACT_APP_API_KEY}`;
      // console.log(url_server);

      const responseSuggestionData = await axios.get(url_server);

      setGamesSuggestion(responseSuggestionData.data.results);

      // fetch review for game
      // url_server = `http://localhost:3000/review/read/${id}`;
      url_server = `https://gamepad-sr.herokuapp.com/review/read/${id}`;

      const responseGetReview = await axios.post(url_server);

      if (!responseGetReview.data.errorMessage) {
        const arrayState = [];
        const promise = responseGetReview.data.result.reviews.map(
          async (review) => {
            // let promise_url_server = `http://localhost:3000/user/read/${review.userToken}`;
            let promise_url_server = `https://gamepad-sr.herokuapp.com/user/read/${review.userToken}`;

            const response = await axios.post(promise_url_server);

            const idReview = review.reviewId;
            arrayState.push({
              review: {
                reviewId: idReview,

                title: review.title,
                description: review.description,

                date: review.date,
                note: review.note,
              },
              user: { username: response.data.username, picture: "blablal" },
            });

            // console.log(arrayState);

            return arrayState;
          }
        );

        Promise.all(promise)
          .then(() => {
            setReviewsData(arrayState);
            // console.log("then => ", arrayState);
          })
          .catch((error) => {
            // console.log("error => ", error.message);
            setErrorMessage(errorMessage);
          });
      } else {
        console.log(responseGetReview.data.errorMessage);
      }

      // console.log(response.data);
    } catch (error) {
      setErrorMessage(error.message);
    }
    setIsLoading(false);
  };

  const addFavoris = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    try {
      // const url_server = "http://localhost:3000/user/favoris/add";
      const url_server = "https://gamepad-sr.herokuapp.com/user/favoris/add";

      const response = await axios.post(url_server, {
        game: {
          id: gameData.id,

          name: gameData.name,
          image: gameData.background_image,
          description: gameData.description_raw,
        },

        token: token,
      });
      if (response.data.errorMessage) {
        setErrorMessage(response.data.errorMessage);
      } else {
        // console.log(response.data);

        const favorisCopy = [...favoris];

        favorisCopy.push({
          id: gameData.id,

          name: gameData.name,
          image: gameData.background_image,
          description: gameData.description_raw,
        });

        setFavoris(favorisCopy);
      }
    } catch (error) {
      // console.log(error.message);
      setErrorMessage(error.message);
    }
    setIsLoading(false);
  };

  const addReview = async (event) => {
    event.preventDefault();

    setIsLoading(true);
    setErrorMessage("");
    try {
      // const url_server = "http://localhost:3000/review/add";
      const url_server = "https://gamepad-sr.herokuapp.com/review/add";

      const responseAddReview = await axios.post(url_server, {
        token,

        gameId: id,
        title: addReviewTitle,
        description: addReviewDescription,
      });
      if (responseAddReview.data.errorMessage) {
        setErrorMessage(responseAddReview.data.errorMessage);
      } else {
        setReviewModal(false);

        setAddReviewTitle("");
        setAddReviewDescription("");

        setRefresh((prevState) => !prevState);
      }
      // console.log(responseAddReview.data);
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const ratingsReview = async (ratingValue, reviewId, note) => {
    try {
      // const url_server = `http://localhost:3000/review/rating`;
      const url_server = "https://gamepad-sr.herokuapp.com/review/rating";

      const response = await axios.post(url_server, {
        reviewId,
        gameId: id,

        ratingValue,
        note,
      });

      // console.log(response.data);
    } catch (error) {
      setErrorMessage(error.message);
      console.log(error.message);
    }
  };

  useEffect(() => {
    getGameData();
  }, [id]);

  useEffect(() => {
    getGameData();
  }, [refresh]);

  return isLoading ? (
    <LoadingComponent />
  ) : (
    <div
      className="single-game-container"
      style={{ opacity: modalLogin ? 0.3 : 1 }}
      onClick={() => {
        setModalLogin(false);
      }}>
      {errorMessage ? (
        <ErrorMessageComponent message={errorMessage} size={"20px"} />
      ) : null}

      {gameData && (
        <>
          {!reviewModal ? (
            <>
              <h1>{gameData.name}</h1>

              <div className="game-information">
                <div className="game-image">
                  <img src={gameData.background_image} alt="" />
                </div>

                <div className="detail-informations">
                  {Cookies.get("token") ? (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        width: "100%",
                        borderColor: "red",
                        borderWidth: 1,
                      }}>
                      <button
                        onClick={(e) => {
                          addFavoris(e);
                        }}>
                        Ajouter au favoris
                      </button>
                      <div
                        className="add-review-button"
                        onClick={() => setReviewModal(true)}>
                        <p>Laisser un avis </p>
                      </div>
                    </div>
                  ) : null}
                  {!fullDescription && (
                    <>
                      <div className="detail_container">
                        <div>
                          <p>Platform</p>

                          <div className="detail">
                            {gameData.platforms && (
                              <p>
                                {gameData.platforms.map((item, index) => {
                                  if (index < gameData.platforms.length - 1) {
                                    return `${item.platform.name},`;
                                  } else {
                                    return `${item.platform.name}`;
                                  }
                                })}
                              </p>
                            )}
                          </div>
                        </div>

                        <div>
                          <p>Genre</p>

                          <div className="detail">
                            {gameData.genres &&
                              gameData.genres.map((item, index) => {
                                return <p key={index}>{item.name}</p>;
                              })}
                          </div>
                        </div>
                      </div>
                      <div className="detail_container">
                        <div>
                          <p>Date de sortie</p>

                          <div className="detail">
                            <p>{gameData.released}</p>
                          </div>
                        </div>

                        <div>
                          <p>Developers</p>

                          <div className="detail">
                            {gameData.developers &&
                              gameData.developers.map((item, index) => {
                                return <p key={index}>{item.name}</p>;
                              })}
                          </div>
                        </div>
                      </div>
                      <div className="detail_container">
                        <div>
                          <p>Editeurs</p>

                          <div className="detail">
                            {gameData.publishers &&
                              gameData.publishers.map((item, index) => {
                                return <p key={index}>{item.name}</p>;
                              })}
                          </div>
                        </div>

                        <div>
                          <p>Age Rating</p>

                          <div className="detail">
                            {gameData.esrb_rating && (
                              <p>{gameData.esrb_rating.id}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  <div className="detail_container">
                    <div>
                      <p>Description</p>

                      <div
                        className="detail"
                        style={{
                          overflow: fullDescription ? "visible" : "hidden",
                        }}
                        onClick={() => {
                          setFullDescription((prevState) => !prevState);
                        }}>
                        {gameData.description_raw && (
                          <p id="description">{gameData.description_raw}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="suggestion-contianer">
                <h2>Autres jeux comme {gameData.name}</h2>
                <div className="carrousel-container">
                  {gamesSuggestion &&
                    gamesSuggestion.map((gameSuggestion, index) => {
                      return (
                        <div
                          className="game-container"
                          key={index}
                          onClick={() => {
                            navigate(`/game/${gameSuggestion.id}`, {
                              state: { id: gameSuggestion.id },
                            });
                          }}>
                          <img
                            src={
                              gameSuggestion.background_image
                                ? gameSuggestion.background_image
                                : imageNotFound
                            }
                            alt=""
                          />
                          <div className="title-container">
                            <p style={{ color: "white" }}>
                              {gameSuggestion.name}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
              {reviewsData ? (
                <div className="review-container">
                  <h2>Review</h2>
                  <div className="review-main">
                    {reviewsData.length > 0 &&
                      reviewsData.map((reviewData, index) => {
                        return (
                          <div className="review">
                            <div className="detail-review">
                              <h3>{reviewData.review.title}</h3>
                              <p>{reviewData.review.description}</p>
                            </div>
                            <div className="user-information">
                              <div className="picture-user">
                                <div className="picture">
                                  <img
                                    src={
                                      "https://media.rawg.io/media/games/328/3283617cb7d75d67257fc58339188742.jpg"
                                    }
                                    alt=""
                                  />
                                  {/* <p>{reviewData.user.picture}</p> */}
                                </div>
                                <div className="date-username">
                                  <p className="date">
                                    {new Date(reviewData.review.date)
                                      .toString()
                                      .substring(4, 15)}
                                  </p>
                                  <h4>{reviewData.user.username}</h4>
                                </div>
                              </div>
                              <div className="rating">
                                <button
                                  style={{
                                    backgroundColor: "#424448",
                                    border: "none",
                                    color: "white",
                                    fontSize: "20px",
                                  }}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    ratingsReview(
                                      -1,
                                      reviewData.review.reviewId,
                                      reviewData.review.note
                                    );
                                  }}>
                                  <FontAwesomeIcon
                                    icon={"thumbs-down"}
                                    style={{ cursor: "pointer" }}
                                    values={-1}
                                  />
                                </button>

                                <button
                                  style={{
                                    backgroundColor: "#424448",
                                    border: "none",
                                    color: "white",
                                    fontSize: "20px",
                                  }}
                                  onClick={(e) => {
                                    e.preventDefault();

                                    ratingsReview(
                                      +1,
                                      reviewData.review.reviewId,
                                      reviewData.review.note
                                    );
                                  }}>
                                  <FontAwesomeIcon
                                    icon={"thumbs-up"}
                                    style={{ cursor: "pointer" }}
                                  />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              ) : (
                <div
                  style={{
                    height: "30vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}>
                  <h2>Aucune review disponible pour ce jeu</h2>
                </div>
              )}
            </>
          ) : (
            token && (
              <div className="add-review-container">
                <div className="review-main">
                  <div className="close-div">
                    <h1>Laisser un avis</h1>
                    <FontAwesomeIcon
                      icon={"xmark-circle"}
                      className={"close-icon"}
                      onClick={() => {
                        setReviewModal(false);
                      }}
                    />
                  </div>
                  <div className="add-review-card">
                    <form
                      onSubmit={(e) => {
                        addReview(e);
                      }}>
                      <div className="input-container">
                        <p>Titre Review</p>
                        <input
                          value={addReviewTitle}
                          type="text"
                          onChange={(e) => {
                            setAddReviewTitle(e.target.value);
                          }}
                        />
                      </div>

                      <div className="input-container">
                        <p>Texte Review</p>
                        <textarea
                          name=""
                          id=""
                          cols="35"
                          rows="10"
                          value={addReviewDescription}
                          onChange={(e) => {
                            setAddReviewDescription(e.target.value);
                          }}></textarea>
                      </div>
                      <div className="submit-button-container">
                        <input type="submit" className="submit-button" />
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            )
          )}
        </>
      )}
    </div>
  );
};

export default SingleGame;
