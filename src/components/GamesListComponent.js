import React from "react";

import imageNotFound from "../assets/images/image-not-found.png";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { useNavigate } from "react-router-dom";
import axios from "axios";

const GamesListComponent = ({
  gamesData,
  setPage,
  pagination,
  isFavoris,
  setFavoris,
  token,
}) => {
  const navigate = useNavigate();

  const deleteFavoris = async ({ index }) => {
    console.log(gamesData);
    const favorisCopy = [...gamesData];
    console.log(favorisCopy);

    favorisCopy.splice(index, 1);
    console.log(favorisCopy);

    setFavoris(favorisCopy);
    const url_server = "http://localhost:3000/user/favoris/delete";

    const response = await axios.post(url_server, {
      favoris: favorisCopy,
      token,
    });

    console.log(response.data);
  };
  return (
    <>
      <div className="main-container">
        {gamesData &&
          gamesData.map((game, index) => {
            return (
              <div className="game-container" key={index}>
                {isFavoris ? (
                  <div className="favoris-label-container">
                    <FontAwesomeIcon
                      icon={"bookmark"}
                      color={"red"}
                      size={"lg"}
                      onClick={() => {
                        deleteFavoris(index);
                      }}
                    />
                  </div>
                ) : null}
                <img
                  src={
                    game.background_image
                      ? game.background_image
                      : game.image
                      ? game.image
                      : imageNotFound
                  }
                  alt=""
                  onClick={() => {
                    navigate(`/game/${game.id}`, { state: { id: game.id } });
                  }}
                />
                <div className="title-container">
                  <p>{game.name}</p>
                </div>
              </div>
            );
          })}
      </div>
      {isFavoris ? null : (
        <div className="pagination-container">
          <FontAwesomeIcon
            icon={"chevron-circle-left"}
            size={"2x"}
            onClick={() => {
              setPage((prevState) => prevState - 1);
            }}
          />
          {pagination}
          <FontAwesomeIcon
            icon={"chevron-circle-right"}
            size={"2x"}
            onClick={() => {
              setPage((prevState) => prevState + 1);
            }}
          />
        </div>
      )}
    </>
  );
};

export default GamesListComponent;
