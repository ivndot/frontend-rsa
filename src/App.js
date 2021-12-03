import React from "react";
//react router
import { BrowserRouter, Route, Routes } from "react-router-dom";
//components
import Home from "./routes/Home";
import Login from "./routes/Login";
import GenerateKeys from "./routes/GenerateKeys";
import Encrypt from "./routes/Encrypt";
import Decrypt from "./routes/Decrypt";
//styles
import "./css/App.css";

export default class App extends React.Component {
  state = {
    isLogged: false,
  };

  /**
   * Function to change the value of isLogged to `true`
   */
  handleLogin = () => {
    this.setState({ isLogged: !this.state.isLogged });
  };

  render() {
    return (
      <div>
        {/* Navigation */}
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={<Login isLogged={this.state.isLogged} handleLogin={this.handleLogin} />}
            />
            <Route path="/inicio" element={<Home isLogged={this.state.isLogged} />} />
            <Route path="/generar-llaves" element={<GenerateKeys isLogged={this.state.isLogged} />} />
            <Route path="/cifrar" element={<Encrypt isLogged={this.state.isLogged} />} />
            <Route path="/descifrar" element={<Decrypt isLogged={this.state.isLogged} />} />
          </Routes>
        </BrowserRouter>
      </div>
    );
  }
}
