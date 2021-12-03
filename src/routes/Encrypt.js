import React from "react";
import { Navigate } from "react-router-dom";
//components
import Navbar from "../components/Navbar";
//requests
import { requestEncrypt, requestDownloadEncrypt } from "../util/requests";

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
        <h1>Cifrar</h1>
        <form onSubmit={this.handleSubmit}>
          <label htmlFor="publicKey">Llave p&uacute;blica</label>
          <textarea
            id="publicKey"
            name="publicKey"
            cols={30}
            rows={10}
            placeholder="Escribe o pega la llave p&uacute;blica aqu&iacute;"
            value={this.state.publicKey}
            onChange={this.handleInput}
          ></textarea>

          <label>Texto</label>
          <textarea
            name="textToEncrypt"
            cols={30}
            rows={10}
            placeholder="Escribe el texto que deseas cifrar aqu&iacute;"
            value={this.state.textToEncrypt}
            onChange={this.handleInput}
            disabled={this.state.fileToEncrypt ? "disabled" : ""}
          ></textarea>

          <label htmlFor="fileToEncrypt">Archivo</label>
          <input
            type="file"
            id="fileToEncrypt"
            name="fileToEncrypt"
            value={this.state.fileName}
            onChange={this.handleInput}
            disabled={this.state.textToEncrypt ? "disabled" : ""}
          />

          <button type="submit">Cifrar</button>
        </form>
        <p style={{ color: "red" }}>{this.state.errorEncryptMssg}</p>

        <form onSubmit={this.handleSubmitDownload}>
          <label>Texto cifrado</label>
          <textarea
            name="encryptedText"
            cols={30}
            rows={10}
            placeholder="Resultado"
            readOnly
            value={this.state.encryptedText}
            onChange={this.handleInput}
          ></textarea>
          {this.state.encryptedText ? <button type="submit">Descargar texto cifrado</button> : null}
        </form>
        <p style={{ color: "red" }}>{this.state.errorDownloadMssg}</p>
        {/* redirect to `/` if its not logged in*/}
        {this.props.isLogged === false ? <Navigate replace to="/" /> : null}
      </div>
    );
  }
}
