import React from "react";
import { Navigate } from "react-router-dom";
//components
import Navbar from "../components/Navbar";
import Result from "../components/Result";
//requests
import { requestEncrypt, requestDownloadEncrypt } from "../util/requests";
//styles
import "../css/Encrypt.css";

const initialState = {
  encryptedText: "",
  publicKey: "",
  textToEncrypt: "",
  fileToEncrypt: "",
  fileName: "",
  errorEncryptMssg: "",
  errorDownloadMssg: "",
};

export default class Encrypt extends React.Component {
  state = initialState;

  /**
   *Function to handle the input data
   * @param {Event} e
   */
  handleInput = (e) => {
    //set values to the state
    this.setState({
      [e.target.name]: e.target.type === "file" ? e.target.files[0] : e.target.value,
    });

    //set file name
    if (e.target.name === "fileToEncrypt") this.setState({ fileName: e.target.value });
  };

  /**
   * Function to handle the submited data in the encrypt form
   * @param {Event} e
   */
  handleSubmit = async (e) => {
    e.preventDefault();
    // error message
    let errorEncryptMssg = "";
    //get values
    const { fileToEncrypt: file, textToEncrypt: text, publicKey } = this.state;
    let { encryptedText } = this.state;

    //validate form
    if (!this.isEncryptFormEmpty(file, text, publicKey)) {
      //form ok
      //make request
      const resp = await requestEncrypt(file, text, publicKey);
      if (resp.code === 100 && resp.status === "ok") {
        //OK: succesfull request
        encryptedText = resp.encryptedText;
        console.log(resp.encryptedText);
      } else if (resp.code === 201 && resp.status === "error") {
        //ERROR: there was en error encrypting the content
        errorEncryptMssg =
          "Hubo un error durante el cifrado, por favor verifica que la llave pública sea correcta o intenta con un texto más corto";
      } else if (resp.code === 202 && resp.status === "error") {
        //ERROR: public key empty
        errorEncryptMssg = "No se envió la llave pública";
      }
    } else {
      //ERROR: some fields are empty
      errorEncryptMssg = "Llena todos los campos";
    }

    //make a copy of initial state
    const cleanState = { ...initialState };

    if (errorEncryptMssg) {
      //ERROR: there was an error
      //clean all except errorEncryptMssg
      cleanState.errorEncryptMssg = errorEncryptMssg;
      this.setState(cleanState);
    } else {
      //OK: there was no error encrypting
      //clean all except the encryptedText
      cleanState.encryptedText = encryptedText;
      this.setState(cleanState);
    }
    console.log(cleanState);
  };

  /**
   * Function  to validate if the fields of the encrypt form are empty
   * @param {File} file The file to encrypt
   * @param {string} text Text to be encrypted
   * @param {string} publicKey The public key
   * @returns
   */
  isEncryptFormEmpty = (file, text, publicKey) => {
    if (
      ((file !== null && file !== "") || (text !== null && text !== "")) &&
      publicKey !== null &&
      publicKey !== ""
    ) {
      //file or text have content and publicKey too
      return false;
    }
    //one or more fields are empty
    return true;
  };

  /**
   * Function to handle the download file form
   * @param {Event} e
   */
  handleSubmitDownload = async (e) => {
    e.preventDefault();
    //error message
    let errorDownloadMssg = "";
    //get values
    const { encryptedText } = this.state;

    if (encryptedText !== null && encryptedText !== "") {
      //all fields have content

      //make the request
      await requestDownloadEncrypt(encryptedText);
    } else {
      //ERROR: there are fields empty
      errorDownloadMssg = "No hay contenido para descargar";
    }

    //make a copy of initial state
    const cleanState = { ...initialState };
    if (errorDownloadMssg) {
      //ERROR: there was an error
      cleanState.errorDownloadMssg = errorDownloadMssg;
      this.setState(cleanState);
    } else {
      //OK: there was no error
      this.setState(cleanState);
    }
  };

  render() {
    return (
      <div>
        <Navbar />
        <div className="container">
          {/* title */}
          <h1 className="title">
            <span className="highlight">Cifrar</span>
          </h1>
          {/* content */}
          <div className="content">
            <p className="content__text">
              Introduce la clave p&uacute;blica de 4096 bits codificada en base64 en la caja de texto,
              posteriormente introduce el contenido a cifrar, puede ser texto o el contenido de un archivo.
            </p>
          </div>
          {/* form to encrypt */}
          <form onSubmit={this.handleSubmit}>
            {/* public key field */}
            <div className="field">
              <label htmlFor="publicKey" className="field__label">
                Llave p&uacute;blica (base64)
              </label>
              <textarea
                id="publicKey"
                name="publicKey"
                className="field__textArea"
                placeholder="Escribe o pega la llave p&uacute;blica aqu&iacute;"
                value={this.state.publicKey}
                onChange={this.handleInput}
              ></textarea>
            </div>
            {/* text or file */}
            <div className="encryptContainer">
              {/* text field  */}
              <div className="field field--inline">
                <label htmlFor="textToEncrypt" className="field__label">
                  Texto
                </label>
                <textarea
                  id="textToEncrypt"
                  name="textToEncrypt"
                  className="field__textArea"
                  placeholder="Escribe el texto que deseas cifrar aqu&iacute;"
                  value={this.state.textToEncrypt}
                  onChange={this.handleInput}
                  disabled={this.state.fileToEncrypt ? "disabled" : ""}
                ></textarea>
              </div>
              <p>-&oacute;-</p>
              {/* file field */}
              <div className="field field--inline">
                <label htmlFor="fileToEncrypt" className="field__label">
                  Archivo
                </label>
                <input
                  type="file"
                  id="fileToEncrypt"
                  name="fileToEncrypt"
                  className="field__file"
                  value={this.state.fileName}
                  onChange={this.handleInput}
                  disabled={this.state.textToEncrypt ? "disabled" : ""}
                />
              </div>
            </div>
            <button type="submit" className="btn btn--block">
              <i className="fas fa-lock btn__icon"></i>Cifrar
            </button>
          </form>
          <p className="errorMssg">{this.state.errorEncryptMssg}</p>

          {/*show result */}
          <Result
            type="encrypt"
            handleSubmit={this.handleSubmitDownload}
            value={this.state.encryptedText}
            onChange={this.handleInput}
            text={this.state.encryptedText}
          />
          {/* redirect to `/` if its not logged in*/}
          {this.props.isLogged === false ? <Navigate replace to="/" /> : null}
        </div>
      </div>
    );
  }
}
