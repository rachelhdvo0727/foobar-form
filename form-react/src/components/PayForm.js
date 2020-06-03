import React, { useState, useEffect, useRef } from "react";
import ButtonPay from "./ButtonPay";
import { Heroku } from "../modules/Heroku";
import NumberFormat from "react-number-format";
import Dankort from "../images/dankort.png";
import MastercardIcon from "../images/mastercard.png";
import VisaIcon from "../images/visa.png";
import styles from "./PayForm.module.css";
import { useHistory } from "react-router-dom";

export default function Form(props) {
  console.log(props.orders);
  let history = useHistory();
  const [orders, setOrders] = useState([]);
  useEffect(() => {
    const ordertest = [];
    props.orders.forEach((elm) => {
      if (elm.name !== undefined) {
        ordertest.push({
          name: elm.name,
          amount: elm.count,
        });
      }
    });

    console.log(ordertest);
    setOrders(ordertest);
  }, [props.orders]);

  const cardNoMsg = useRef("");
  const cvvMsg = useRef("");
  const expireDateMsg = useRef("");
  const nameMsg = useRef("");
  const cardInput = useRef("");
  function submit(evt) {
    evt.preventDefault();
    // let validForm = true;
    // const form = document.querySelector("form");
    let cardnoInput = document.querySelector("#cardnumber > input:nth-child(1)");
    let ccvalue = cardnoInput.value.split(" ");
    const ccLength = ccvalue.join("");

    let dateInput = document.querySelector("#dateYear > input:nth-child(1)");
    let datevalue = dateInput.value.split("/");
    const dateLength = datevalue.join("");

    let cvvInput = document.querySelector("#cvvNumber > input");
    // let cvvValue = cvvInput.value.split(" ");
    // const cvvLength = cvvValue.join("");
    // let cvvLength = cvvInput.value;
    // let visa = /^4[0-9]{12}(?:[0-9]{3})?$/;
    // let master = /^(5[1-5][0-9]{14}|2(22[1-9][0-9]{12}|2[3-9][0-9]{13}|[3-6][0-9]{14}|7[0-1][0-9]{13}|720[0-9]{12}))$/;

    if (ccLength.length < 16) {
      evt.preventDefault();
      cardNoMsg.current.textContent = "Card number has to have 16 digits";
      cardNoMsg.current.style.color = "var(--pink-highlight)";
    } else if (dateLength.length < 4) {
      evt.preventDefault();
      expireDateMsg.current.textContent = "Expiry date's format is MM/YY";
      expireDateMsg.current.style.color = "var(--pink-highlight)";
    } else if (cvvInput.value.trim().length < 3) {
      evt.preventDefault();
      cvvMsg.current.textContent = "CVV number must have 3 digits";
      cvvMsg.current.style.color = "var(--pink-highlight)";
    } else {
      Heroku.postOrder(orders);
      history.push("/end");
    }
  }
  function limitCardDate(val, max) {
    if (val.length === 1 && val[0] > max[0]) {
      val = "0" + val;
    }

    if (val.length === 2) {
      if (Number(val) === 0) {
        val = "01";

        //this can happen when user paste number
      } else if (val > max) {
        val = max;
      }
    }

    return val;
  }
  function cardExpiry(val) {
    let month = limitCardDate(val.substring(0, 2), "12");
    let year = val.substring(2, 4);

    return month + (year.length ? "/" + year : "");
  }
  const onlyTextAllow = (evt) => {
    //https://stackoverflow.com/questions/29823591/html-input-do-not-allow-numbers
    let key = evt.keyCode;
    if (!(key === 8 || key === 32 || key === 46 || (key >= 35 && key <= 40) || (key >= 65 && key <= 90))) {
      evt.preventDefault();
    }

    //error msgs for name
    nameMsg.current.textContent = "E.g. John Smith";
    nameMsg.current.style.color = "var(--bright-purple-bg)";
  };
  const emptyName = () => {
    nameMsg.current.textContent = "Missing cardholder's name";
    nameMsg.current.style.color = "var(--pink-highlight)";
  };
  const hideNameEg = () => {
    nameMsg.current.textContent = "";
  };

  //Error messages
  const emptyCC = () => {
    cardNoMsg.current.textContent = "Missing card number";
    cardNoMsg.current.style.color = "var(--pink-highlight)";
  };
  const hideCCEg = () => {
    cardNoMsg.current.textContent = "";
  };
  const showCCEg = () => {
    cardNoMsg.current.textContent = "E.g. 1234 1234 1234 1234";
    cardNoMsg.current.style.color = "var(--bright-purple-bg)";
  };

  const showDateEg = () => {
    expireDateMsg.current.textContent = "E.g. MM/YY";
    expireDateMsg.current.style.color = "var(--bright-purple-bg)";
  };
  const emptyDate = () => {
    expireDateMsg.current.textContent = "Missing expiry date";
    expireDateMsg.current.style.color = "var(--pink-highlight)";
  };
  const hideDateEg = () => {
    expireDateMsg.current.textContent = "";
  };

  const emptyCVV = () => {
    cvvMsg.current.textContent = "Missing CVV number";
    cvvMsg.current.style.color = "var(--pink-highlight)";
  };
  const hideCVVEg = () => {
    cvvMsg.current.textContent = "";
  };
  const showCVVEg = () => {
    cvvMsg.current.textContent = "E.g. 123";
    cvvMsg.current.style.color = "var(--bright-purple-bg)";
  };

  return (
    <form className={styles.payForm} onSubmit={submit}>
      <div id="paymentOptionsLogo" className={styles.paymentOptionLogos}>
        <img id="dankort" src={Dankort} />
        <img id="visa" src={VisaIcon} />
        <img id="master" src={MastercardIcon} />
      </div>
      <label id="cardName" className={styles.cardHolderName}>
        Name on Card
        {/* <NameCard /> */}
        <input
          id="nameOnCard"
          type="text"
          placeholder="John Something"
          autoCapitalize="words"
          name="nameOnCard"
          onKeyDown={(evt) => {
            onlyTextAllow(evt);
          }}
          onBlur={hideNameEg}
          onInvalid={emptyName}
          required
        ></input>
        <p id="nameExample" ref={nameMsg}></p>
      </label>
      <label className={styles.cardNumber} id="cardnumber">
        Card number
        <NumberFormat
          id="cardNo"
          name="cardNo"
          format="#### #### #### ####"
          placeholder="1234 1234 1234 1234"
          onKeyDown={showCCEg}
          onBlur={hideCCEg}
          onInvalid={emptyCC}
          // onInput={(e) => {
          //   checkCCminLength(e);
          // }}
          ref={cardInput}
          value=""
          allowEmptyFormatting={false}
          required
        />
        <p id="cardNoExample" ref={cardNoMsg}></p>
      </label>
      <fieldset className={styles.fieldsetWrapper}>
        <label className={styles.expireDateLabel} id="dateYear">
          Expire
          <NumberFormat format={cardExpiry} placeholder="MM/YY" className={styles.cardExpire} onKeyDown={showDateEg} onBlur={hideDateEg} onInvalid={emptyDate} allowEmptyFormatting={false} required />
          <p id="expireDateExample" ref={expireDateMsg}></p>
        </label>
        <label className={styles.cvvLabel} id="cvvNumber">
          CVV
          <NumberFormat format="###" placeholder="123" className={styles.cardCVV} onKeyDown={showCVVEg} onBlur={hideCVVEg} onInvalid={emptyCVV} allowEmptyFormatting={false} required />
          <p id="cvvExample" ref={cvvMsg}></p>
        </label>
      </fieldset>
      <ButtonPay type="submit"></ButtonPay>
    </form>
  );
}
