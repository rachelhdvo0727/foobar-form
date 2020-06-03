import React from "react";
import { Button } from "muicss/react";
import styles from "./Landingpage.modules.css";
import { useHistory } from "react-router-dom";
import Logo from "../images/final-logo.png";

export default function Landing_page(props) {
  let history = useHistory();

  return (
    <>
      <header className="landing-header">
        <img src={Logo} className="fooBarLogo"></img>
      </header>
      <main className="landingpage-main">
        <article className="wrapper-vertical">
          <h1 id="landingpage-h1">Welcome to Foobar!</h1>

          <button
            className="orderButton"
            onClick={() => {
              props.getState("Start order");
              history.push("/select");
            }}
          >
            Order now
          </button>
        </article>
      </main>
    </>
  );
}
