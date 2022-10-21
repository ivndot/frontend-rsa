import React, { useState } from "react";
import { Navigate } from "react-router-dom";
//components
import Navbar from "../components/Navbar";
import Loader from "../components/Loader";
//requests
import { requestGenerateKeys } from "../util/requests";
//styles
import "../css/GenerateKeys.css";

const GenerateKeys = props => {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    // get the files
    await requestGenerateKeys();
    setLoading(false);
  };

  return (
    <div>
      <Navbar />
      <div className="container">
        {/* title */}
        <h1 className="title">
          <span className="highlight">Generador de llaves</span>
        </h1>
        {/* content */}
        <div className="content">
          <p className="content__text">
            Para cifrar y decifrar se necesita de una llave p&uacute;blica y una llave privada.
          </p>
          <br />
          <p className="content__text">
            Si no cuenta previamente con estas llaves, presione el bot&oacute;n de abajo para descargar una
            llave p&uacute;blica y privada de 4096 bits.
          </p>
          <div className="content__btn">
            <button className="btn btn--center" type="button" onClick={handleClick}>
              {loading ? (
                <Loader label="Descargando llaves" />
              ) : (
                <>
                  <i className="fas fa-key btn__icon"></i>Generar llaves
                </>
              )}
            </button>
          </div>
          {/* redirect to `/` if its not logged in*/}
          {props.isLogged === false ? <Navigate replace to="/" /> : null}
        </div>
      </div>
    </div>
  );
};

export default GenerateKeys;
