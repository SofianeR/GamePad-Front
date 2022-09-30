import React, { useEffect, useState } from "react";

import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import ErrorMessageComponent from "../ErrorMessageComponent";

const LoginSignUpModal = ({ modalLogin, setModalLogin, connexion }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [switchRightModalState, setSwitchRightModalState] = useState(false);

  const [userNameSignUp, setUserNameSignUp] = useState("");
  const [mailSignUp, setMailSignUp] = useState("");
  const [passwordSignUp, setPasswordSignUp] = useState("");
  const [checkPasswordSignUp, setCheckPasswordSignUp] = useState("");

  const [mailLogin, setMailLogin] = useState("");
  const [passwordLogin, setPasswordLogin] = useState("");

  const signup = async (event) => {
    event.preventDefault();

    setIsLoading(true);
    setErrorMessage("");

    try {
      if (
        userNameSignUp &&
        mailSignUp &&
        passwordSignUp &&
        checkPasswordSignUp
      ) {
        if (passwordSignUp === checkPasswordSignUp) {
          // const url_server = "http://localhost:3000/user/signup";
          const url_server = "https://gamepad-sr.herokuapp.com/user/signup";

          const response = await axios.post(url_server, {
            username: userNameSignUp,
            mail: mailSignUp,
            password: passwordSignUp,
          });
          if (response.data.errorMessage) {
            setErrorMessage(response.data.errorMessage);
          } else {
            connexion(response.data.token, response.data.favoris);
            setModalLogin(false);
          }
        } else {
          setErrorMessage("Les mots de passe ne sont pas identiques");
        }
      } else {
        setErrorMessage("Un des champs est vide");
      }
    } catch (error) {
      setErrorMessage(error.message);
    }
    setIsLoading(false);
  };

  const login = async (event) => {
    event.preventDefault();

    setIsLoading(true);
    setErrorMessage("");

    try {
      // const url_server = "http://localhost:3000/user/login";
      const url_server = "https://gamepad-sr.herokuapp.com/user/login";

      const response = await axios.post(url_server, {
        mail: mailLogin,
        password: passwordLogin,
      });

      if (response.data.errorMessage) {
        setErrorMessage(response.data.errorMessage);
      } else {
        console.log(response.data);
        connexion(response.data.token, response.data.favoris);
      }
    } catch (error) {
      setErrorMessage(error.message);
    }
    setIsLoading(false);
    setModalLogin(false);
  };

  return (
    <div className="container-modal">
      <div className="left-modal">
        <h2>Comment ça marche ?</h2>

        <div className="left-modal-text">
          <FontAwesomeIcon icon={"user"} />
          <p>
            Connectez vous pour utilier toutes les fonctionnalités de gamepad !
          </p>
        </div>

        <div className="left-modal-text">
          <FontAwesomeIcon icon={"bookmark"} />
          <p>Ajoutez des jeux à vos favoris</p>
        </div>

        <div className="left-modal-text">
          <FontAwesomeIcon icon={"message"} />

          <p>Laissez et consultez des avis</p>
        </div>
      </div>
      <div className="right-modal">
        {switchRightModalState ? (
          <>
            <h2>Sign Up</h2>
            {errorMessage ? (
              <ErrorMessageComponent message={errorMessage} size={"15px"} />
            ) : null}
            <form
              onSubmit={(e) => {
                signup(e);
              }}>
              <input
                placeholder="Username"
                type="text"
                onChange={(e) => {
                  setUserNameSignUp(e.target.value);
                }}
              />

              <input
                placeholder="Mail"
                type="text"
                onChange={(e) => {
                  setMailSignUp(e.target.value);
                }}
              />

              <input
                placeholder="Mot de passe"
                type="text"
                onChange={(e) => {
                  setPasswordSignUp(e.target.value);
                }}
              />

              <input
                placeholder="Confirmation mot de passe"
                type="text"
                onChange={(e) => {
                  setCheckPasswordSignUp(e.target.value);
                }}
              />

              <input type="submit" id="submit-button" />
            </form>

            <span
              onClick={() => {
                setSwitchRightModalState(false);
              }}>
              Déja inscrit ? Par ici
            </span>
          </>
        ) : (
          <>
            <h2>Login</h2>

            <form
              onSubmit={(e) => {
                login(e);
              }}>
              <input
                placeholder="Email"
                type="text"
                onChange={(e) => {
                  setMailLogin(e.target.value);
                }}
              />
              <input
                placeholder="Mot de passe"
                type="password"
                onChange={(e) => {
                  setPasswordLogin(e.target.value);
                }}
              />
              <input type="submit" id="submit-button" />
            </form>

            <span
              onClick={() => {
                setSwitchRightModalState(true);
              }}>
              Pas encore de compte ? C'est par ici !
            </span>
          </>
        )}
      </div>
      <div
        className="close-modal-container"
        onClick={() => setModalLogin(false)}>
        <FontAwesomeIcon icon={"circle-xmark"} size={"2x"} />
      </div>
    </div>
  );
};

export default LoginSignUpModal;
