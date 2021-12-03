import React from "react";

const Result = (props) => (
  <div>
    <form onSubmit={props.handleSubmitDownload}>
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
  </div>
);

export default Result;
