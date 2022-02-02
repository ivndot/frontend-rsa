import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
//components
import Navbar from "../components/Navbar";
//styles
import "../css/Home.css";

const Home = (props) => {
  const navigate = useNavigate();
  useEffect(() => {
    //redirect to /
    if (!props.isLogged) navigate("/");
  });

  return (
    <div>
      <Navbar />
      <div className="container">
        {/* information */}
        <section className="info">
          <h3 className="info__header">Cifrado RSA</h3>
          <p className="info__content">
            El nombre RSA proviene de las iniciales de sus tres creadores, Rivest, Shamir y Adleman, allá por
            1997. Se trata de un algoritmo de cifrado asimétrico, o de clave pública, y es uno de los más
            utilizados en la actualidad. De hecho, la mayor parte de los sitios web hoy integran seguridad
            SSL/TLS, y permiten la autenticación mediante RSA.
          </p>
          <br />
          <p className="info__content">
            RSA, al ser un cifrador asimétrico, trabaja con dos claves, una pública y una privada. Todo el
            contenido de texto plano, o contenido sin cifrar, que se haya encriptado con la clave pública,
            podrá ser descifrado mediante la clave privada, y viceversa, todo contenido cifrado con la clave
            privada podrá ser descifrado mediante la clave pública.
          </p>
        </section>
        <div className="buttonsContainer">
          <Link to="/cifrar" className="btn">
            <i className="fas fa-lock btn__icon"></i>Cifrar
          </Link>
          <Link to="/descifrar" className="btn">
            <i className="fas fa-unlock btn__icon"></i>Descifrar
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
