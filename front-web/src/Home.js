import React, { Component } from "react";
//import logo from "./assets/img/logo.svg";
import "./assets/css/Home.css";

class Home extends Component {
  render() {
    return (
      <div className="Home">
        <div className="jumbotron">
          <h1>Bienvenu à la meilleure aplication de gestion de picking !</h1>
          <p>
            Utilisez le menu du haut pour accéder aux différentes fonctionnalités.
          </p>
          <p>
            Pour feedback, n'hésitez pas à nous contacter via la page GitHub du projet :
          </p>
          <p>
            <a href="https://github.com/uy-rrodriguez/uapv-m2-s2-application/" target="_blank"
               rel="noopener noreferrer">
              https://github.com/uy-rrodriguez/uapv-m2-s2-application/
            </a>
          </p>
        </div>
      </div>
    )
  }
}

export default Home;
