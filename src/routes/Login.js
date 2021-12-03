import React from "react";
import { Navigate } from "react-router-dom";
import { requestLogin } from "../util/requests";

const initialState = {
  user: "",
  password: "",
  errorMssg: "",
};

export default class Login extends React.Component {
  state = initialState;

  /**
   * Function to handle the value of the fields
   * @param {Event} e
   */
  handleInput = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  /**
   * Function to handle the login form
   * @async
   * @param {Event} e
   */
  handleSubmit = async (e) => {
    e.preventDefault();
    //error message
    let errorMssg = "";
    // get user and password
    const { user, password } = this.state;
    //validate form

    if (!this.isFormEmpty(user, password)) {
      //the form is not empty

      //make the post request to "API/login"
      const resp = await requestLogin(user, password);

      if (resp.code === 100 && resp.status === "ok") {
        //OK: user and password are correct, logged in
        //change value of isLogged
        this.props.handleLogin();
      } else if (resp.code === 200 && resp.status === "error") {
        // ERROR: the user or password is not correct
        errorMssg = "El usuario o la contraseña no son correctos";
      }
    } else {
      //ERROR: the form is empty
      errorMssg = "Llene todos los campos";
    }

    if (errorMssg) {
      //there was an error
      //clean user and password and store the error message
      this.setState({ user: "", password: "", errorMssg });
    } else {
      //there was no error
      //clean all fields
      this.setState(initialState);
    }
  };

  /**
   * Function to validate the form
   * @param {string} user Username
   * @param {string} password Password
   */
  isFormEmpty = (user, password) => {
    if (user !== null && user !== "" && password !== null && password !== "") {
      //user and password have content
      return false;
    }
    //one or more fields are empty
    return true;
  };

  render() {
    /* manage login, if logged redirect to /inicio */
    if (this.props.isLogged) {
      return <Navigate replace to="/inicio" />;
    }

    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <h3>Login</h3>
          <p>Introduce el usuario y la contrase&ntilde;a</p>
          <input
            type="text"
            name="user"
            placeholder="Usuario"
            onChange={this.handleInput}
            value={this.state.user}
          />
          <input
            type="password"
            name="password"
            placeholder="Contrase&ntilde;a"
            onChange={this.handleInput}
            value={this.state.password}
          />
          <button type="submit">Ingresar</button>
        </form>
        <p style={{ color: "red" }}>{this.state.errorMssg}</p>
      </div>
    );
  }
}
