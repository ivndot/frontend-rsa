import React from "react";
import { Link } from "react-router-dom";
import "../css/Navbar.css";

const Navbar = (props) => {
  if (props.hide === undefined) {
    //show Navbar
    return (
      <nav className="nav">
        {/* Logo and title */}
        <Link to="/inicio" className="nav__logo">
          <i className="fas fa-code logo__img"></i>
          <h1 className="logo__title">&nbsp;Cifrado RSA</h1>
        </Link>
        {/* Links */}
        <div className="nav__routes">
          <Link to="/inicio" className="routes__link">
            Inicio
          </Link>
          <Link to="/generar-llaves" className="routes__link">
            Generar llaves
          </Link>
          <Link to="/cifrar" className="routes__link">
            Cifrar
          </Link>
          <Link to="/descifrar" className="routes__link">
            Descifrar
          </Link>
        </div>
      </nav>
    );
  }

  //hide Navbar
  return null;
};

export default Navbar;
