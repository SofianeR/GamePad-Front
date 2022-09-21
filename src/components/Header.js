import React from "react";

import { Link, useNavigate } from "react-router-dom";

import Logo from "../assets/images/logo.png";
import LoginSignUpModal from "./LoginSignUpModal/LoginSignUpModal";

const Header = ({ modalLogin, setModalLogin, connexion, token }) => {
  const navigate = useNavigate();
  return (
    <>
      <header>
        <div className="logo">
          {/* <img src={Logo} alt="" /> */}
          <span
            onClick={() => {
              navigate("/");
              setModalLogin(false);
            }}>
            Gamepad
          </span>
        </div>
        <div className="header-buttons">
          <Link to={"/favoris"} id="collection-link">
            My Collections
          </Link>
          {token ? (
            <button onClick={() => connexion(null)}>Deconnexion</button>
          ) : (
            <button onClick={() => setModalLogin(true)}>Login</button>
          )}
        </div>
      </header>
      {modalLogin ? (
        <LoginSignUpModal setModalLogin={setModalLogin} connexion={connexion} />
      ) : null}
    </>
  );
};

export default Header;
