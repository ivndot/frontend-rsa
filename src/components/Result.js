import React from "react";

const attributes = {
  title: "",
  name: "",
  placeHolder: "",
  labelButton: "",
};

/**
 * Function to select attributes of the form
 * @param {string} type The form type [encrypt, decrypt]
 */
const selectForm = (type) => {
  if (type === "encrypt") {
    //form to encrypt
    attributes.title = "Contenido cifrado";
    attributes.name = "encryptedText";
    attributes.placeHolder = "El texto cifrado aparecerá aquí";
    attributes.labelButton = "Descargar contenido cifrado";
  } else if (type === "decrypt") {
    //form to decrypt
    attributes.title = "Contenido descifrado";
    attributes.name = "originalText";
    attributes.placeHolder = "El texto descifrado aparecerá aquí";
    attributes.labelButton = "Descargar contenido descifrado";
  }
};

const Result = (props) => {
  //select form
  selectForm(props.type);

  return (
    <div>
      <div className="separator"></div>
      <form onSubmit={props.handleSubmit}>
        <div className="field">
          <label htmlFor={attributes.name} className="field__label">
            {attributes.title}
          </label>
          <textarea
            id={attributes.name}
            name={attributes.name}
            className="field__textArea"
            placeholder={attributes.placeHolder}
            readOnly
            value={props.value}
            onChange={props.handleInput}
          ></textarea>
        </div>
        {props.text ? (
          <button type="submit" className="btn">
            <i className="fas fa-file-download btn__icon"></i>
            {attributes.labelButton}
          </button>
        ) : null}
      </form>
      <p className="errorMssg">{props.errorMssg}</p>
    </div>
  );
};

export default Result;
