import React from "react";
import { Navigate } from "react-router-dom";
//components
import Navbar from "../components/Navbar";
//requests
import { requestDecrypt, requestDownloadDecrypt } from "../util/requests";

const initialState = {
  originalText: "",
  privateKey: "",
  textToDecrypt: "",
  fileToDecrypt: "",
  fileName: "",
  errorDecryptMssg: "",
  errorDownloadMssg: "",
};

export default class Decrypt extends React.Component {
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
    if (e.target.name === "fileToDecrypt") this.setState({ fileName: e.target.value });
  };

  /**
   * Function to handle the submited data in the decrypt form
   * @param {Event} e
   */
  handleSubmit = async (e) => {
    e.preventDefault();
    // error message
    let errorDecryptMssg = "";
    //get values
    const { fileToDecrypt: file, textToDecrypt: text, privateKey } = this.state;
    let { originalText } = this.state;

    //validate form
    if (!this.isDecryptFormEmpty(file, text, privateKey)) {
      //form ok
      //make request
      const resp = await requestDecrypt(file, text, privateKey);
      if (resp.code === 100 && resp.status === "ok") {
        //OK: succesfull request
        originalText = resp.originalText;
        console.log(resp.originalText);
      } else if (resp.code === 201 && resp.status === "error") {
        //ERROR: there was en error decrypting the content
        errorDecryptMssg =
          "Hubo un error durante el descifrado, por favor verifica que la llave privada y el archivo o texto sea correcto";
      } else if (resp.code === 202 && resp.status === "error") {
        //ERROR: private key empty
        errorDecryptMssg = "No se envió la llave privada";
      }
    } else {
      //ERROR: some fields are empty
      errorDecryptMssg = "Llena todos los campos";
    }

    //make a copy of initial state
    const cleanState = { ...initialState };

    if (errorDecryptMssg) {
      //ERROR: there was an error
      //clean all except errorDecryptMssg
      cleanState.errorDecryptMssg = errorDecryptMssg;
      this.setState(cleanState);
    } else {
      //OK: there was no error decrypting
      //clean all except the originalText
      cleanState.originalText = originalText;
      this.setState(cleanState);
    }
    console.log(cleanState);
  };

  /**
   * Function  to validate if the fields of the decrypt form are empty
   * @param {File} file The file to decrypt
   * @param {string} text Text to be decrypted
   * @param {string} privateKey The private key
   * @returns {boolean}
   */
  isDecryptFormEmpty = (file, text, privateKey) => {
    if (
      ((file !== null && file !== "") || (text !== null && text !== "")) &&
      privateKey !== null &&
      privateKey !== ""
    ) {
      //file or text have content and privateKey too
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
    const { originalText } = this.state;

    if (originalText !== null && originalText !== "") {
      //all fields have content

      //make the request
      await requestDownloadDecrypt(originalText);
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
        <h1>Descifrar</h1>
        <form onSubmit={this.handleSubmit}>
          <label htmlFor="privateKey">Llave privada</label>
          <textarea
            id="privateKey"
            name="privateKey"
            cols={30}
            rows={10}
            placeholder="Escribe o pega la llave privada aqu&iacute;"
            value={this.state.privateKey}
            onChange={this.handleInput}
          ></textarea>

          <label>Texto</label>
          <textarea
            name="textToDecrypt"
            cols={30}
            rows={10}
            placeholder="Escribe el texto que deseas descifrar aqu&iacute;"
            value={this.state.textToDecrypt}
            onChange={this.handleInput}
            disabled={this.state.fileToDecrypt ? "disabled" : ""}
          ></textarea>

          <label htmlFor="fileToDecrypt">Archivo</label>
          <input
            type="file"
            id="fileToDecrypt"
            name="fileToDecrypt"
            value={this.state.fileName}
            onChange={this.handleInput}
            disabled={this.state.textToDecrypt ? "disabled" : ""}
          />

          <button type="submit">Descifrar</button>
        </form>
        <p style={{ color: "red" }}>{this.state.errorDecryptMssg}</p>

        <form onSubmit={this.handleSubmitDownload}>
          <label>Texto descifrado</label>
          <textarea
            name="originalText"
            cols={30}
            rows={10}
            placeholder="Resultado"
            readOnly
            value={this.state.originalText}
            onChange={this.handleInput}
          ></textarea>
          {this.state.originalText ? <button type="submit">Descargar texto descifrado</button> : null}
        </form>
        <p style={{ color: "red" }}>{this.state.errorDownloadMssg}</p>
        {/* redirect to `/` if its not logged in*/}
        {this.props.isLogged === false ? <Navigate replace to="/" /> : null}
      </div>
    );
  }
}
