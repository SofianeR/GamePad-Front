import React, { useState, useEffect } from "react";

// import packages
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// import components
import LoadingComponent from "../components/LoadingComponent";
import ErrorMessageComponent from "../components/ErrorMessageComponent";
import GamesListComponent from "../components/GamesListComponent";

const Home = ({ modalLogin, setModalLogin }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const [gamesData, setGamesData] = useState([]);
  const [gamesDataByFilter, setGamesDataByFilter] = useState([]);

  const [genresData, setGenresData] = useState([]);
  const [platformsData, setPlatformsData] = useState([]);

  const [searchInputValue, setSearchInputValue] = useState("");
  const [filterOrdering, setFilterOrdering] = useState("");
  const [genreQueryArray, setGenreQueryArray] = useState([]);
  const [platformQueryArray, setPlatformQueryArray] = useState([]);

  const [modalFilter, setModalFilter] = useState();
  const [arrayFilterModal, setArrayFilterModal] = useState([
    false,
    false,
    false,
  ]);

  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState();

  const fetchGamesData = async () => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      let url_server = `https://api.rawg.io/api/games?page=${page}&ordering=-updated&key=${process.env.REACT_APP_API_KEY}`;

      let response = await axios.get(url_server);

      setGamesDataByFilter([]);

      setGamesData(response.data);
    } catch (error) {
      setErrorMessage(error.message);
    }
    setIsLoading(false);
  };

  const toggleArrayFilter = (index) => {
    const arrayFilterModalCopy = [...arrayFilterModal];
    arrayFilterModalCopy[index] = !arrayFilterModalCopy[index];
    setArrayFilterModal(arrayFilterModalCopy);
  };

  const setStateQueryArrayFilter = async (
    item,
    setStateQuery,
    stateQuery,
    queryParameter
  ) => {
    const copyStateQuery = [...stateQuery];

    const check = copyStateQuery.indexOf(item);
    if (check === -1) {
      copyStateQuery.push(item);
    } else {
      copyStateQuery.splice(check, 1);
    }
    setStateQuery(copyStateQuery);

    if (copyStateQuery.length > 0) {
      setIsLoading(true);
      try {
        const url_server = `https://api.rawg.io/api/games?${queryParameter}=${copyStateQuery.join(
          ","
        )}&key=${process.env.REACT_APP_API_KEY}`;

        const response = await axios.get(url_server);

        setGamesDataByFilter(response.data);
        console.log(response.data);
      } catch (error) {
        setErrorMessage(error.message);
      }
      setIsLoading(false);
    } else {
      setGamesDataByFilter([]);
    }
  };

  const orderFetchData = async (valueFilter) => {
    setIsLoading(true);
    setErrorMessage("");
    try {
      const url_server = `https://api.rawg.io/api/games?page=1&ordering=${valueFilter}&key=${process.env.REACT_APP_API_KEY}`;

      const response = await axios.get(url_server);

      setGamesDataByFilter([]);

      setGamesData(response.data.results);
    } catch (error) {
      setErrorMessage(error.message);
    }
    setIsLoading(false);
  };

  const searchData = async () => {
    setIsLoading(true);
    setErrorMessage("");
    try {
      // fetch games to display : all games,
      const newSlugFromInput = searchInputValue.replace(" ", "-").toLowerCase();

      let url_server = `https://api.rawg.io/api/games?page=${page}&${
        searchInputValue
          ? `search=${newSlugFromInput}&search_precise=true&`
          : ""
      }key=5a7e7999c8a14a108f0f48bf46b98f7b`;

      let response = await axios.get(url_server);
      console.log(response.data);

      setGamesData(response.data);

      const pageMax = Math.floor(response.data.count / 20);
      let arrayPagination = [];

      for (let i = 1; i < pageMax; i++) {
        if (i >= page - 3 && i <= page + 3) {
          arrayPagination.push(
            <div
              className="pagination-block"
              onClick={() => {
                setPage(i);
              }}
              style={page === i ? { backgroundColor: "#ff7b6f" } : null}
              key={i}>
              <p>{i}</p>
            </div>
          );
        }
      }

      setPagination(arrayPagination);

      url_server = `https://api.rawg.io/api/genres?key=${process.env.REACT_APP_API_KEY}`;
      response = await axios.get(url_server);

      setGenresData(response.data.results);

      url_server = `https://api.rawg.io/api/platforms?key=${process.env.REACT_APP_API_KEY}`;
      response = await axios.get(url_server);

      setPlatformsData(response.data.results);
    } catch (error) {
      setErrorMessage(error.message);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    searchData();
  }, [page]);

  useEffect(() => {
    searchData();
  }, [searchInputValue]);

  return (
    <>
      <div
        className="home-container"
        style={{ opacity: modalLogin ? 0.3 : 1 }}
        onClick={() => {
          setModalLogin(false);
        }}>
        <div className="search-container">
          <h1>Gamepad</h1>
          <div className="bar-filter">
            <div className="search-bar">
              <input
                value={searchInputValue}
                type="text"
                placeholder="Search for games"
                onChange={(e) => {
                  setSearchInputValue(e.target.value);
                }}
              />

              <FontAwesomeIcon
                icon={"magnifying-glass"}
                color={"black"}
                className="search-icon"
                onClick={(e) => {}}
              />
            </div>
            <FontAwesomeIcon
              icon={"filter"}
              onClick={() => {
                setModalFilter((prevState) => !prevState);
              }}
            />
          </div>
          {searchInputValue && !isLoading ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}>
              <h2>Search Results for "{searchInputValue}"</h2>
              <p>{gamesData.count} jeu(x) trouvé(s)</p>
            </div>
          ) : (
            !isLoading && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}>
                <p>{gamesData.count} jeux</p>
              </div>
            )
          )}
          {modalFilter ? (
            <div className="filter-container">
              {!arrayFilterModal[1] && !arrayFilterModal[2] && (
                <div className="arrayFilter-container">
                  <h4
                    onClick={() => {
                      toggleArrayFilter(0);
                    }}>
                    Genres
                  </h4>
                  {arrayFilterModal[0] && (
                    <div className="active">
                      {arrayFilterModal[0] &&
                        genresData &&
                        genresData.map((genre, index) => {
                          return (
                            <div className="filter" key={index}>
                              <input
                                value={genre.slug}
                                type="checkbox"
                                onChange={(e) => {
                                  setStateQueryArrayFilter(
                                    e.target.value,
                                    setGenreQueryArray,
                                    genreQueryArray,
                                    "genres"
                                  );
                                }}
                              />
                              <p>{genre.name}</p>
                            </div>
                          );
                        })}
                    </div>
                  )}
                </div>
              )}

              {!arrayFilterModal[0] && !arrayFilterModal[2] && (
                <div className="arrayFilter-container">
                  <h4
                    onClick={() => {
                      toggleArrayFilter(1);
                    }}>
                    Plateforme
                  </h4>
                  {arrayFilterModal[1] && (
                    <div className="active">
                      {platformsData &&
                        platformsData.map((platform, index) => {
                          return (
                            <div className="filter" key={index}>
                              <input
                                value={platform.id}
                                type="checkbox"
                                onChange={(e) => {
                                  const test = () => {
                                    const copy = [...platformQueryArray];
                                  };
                                  test();
                                  setStateQueryArrayFilter(
                                    e.target.value,
                                    setPlatformQueryArray,
                                    platformQueryArray,
                                    "platforms"
                                  );
                                }}
                              />
                              <p>{platform.name}</p>
                            </div>
                          );
                        })}
                    </div>
                  )}
                </div>
              )}
              {!arrayFilterModal[0] && !arrayFilterModal[1] && (
                <div className="order-container">
                  <h4
                    onClick={() => {
                      toggleArrayFilter(2);
                    }}>
                    Ordres résultats
                  </h4>
                  {arrayFilterModal[2] && (
                    <div className="active">
                      <p
                        onClick={(e) => {
                          orderFetchData(e.target.textContent.toLowerCase());
                        }}>
                        Name
                      </p>

                      <p
                        onClick={(e) => {
                          orderFetchData(e.target.textContent.toLowerCase());
                        }}>
                        Released
                      </p>

                      <p
                        onClick={(e) => {
                          orderFetchData(e.target.textContent.toLowerCase());
                        }}>
                        Rating
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : null}
        </div>
        {isLoading ? (
          <LoadingComponent />
        ) : (
          <>
            {errorMessage ? (
              <ErrorMessageComponent message={errorMessage} size={"20px"} />
            ) : null}
            <h1>Most Relevant games</h1>

            <GamesListComponent
              gamesData={
                gamesDataByFilter.results &&
                gamesDataByFilter.results.length > 0
                  ? gamesDataByFilter.results
                  : gamesData && gamesData.results
              }
              setPage={setPage}
              pagination={pagination}
            />
          </>
        )}
      </div>
    </>
  );
};

export default Home;
