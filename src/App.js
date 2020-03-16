import React, { useState, useEffect } from "react";

import "./App.scss";

function App() {
  const [rates, setRates] = useState([]);
  const [amount, setAmount] = useState("50");
  const [from, setFrom] = useState("TRY");
  const [to, setTo] = useState("USD");
  const [result, setResult] = useState("");
  const [recentConversions, setRecentConversions] = useState([]);

  useEffect(() => {
    fetch("https://api.exchangeratesapi.io/latest")
      .then(res => res.json())
      .then(data => {
        setRates(Object.entries(data.rates));
      });
  }, []);

  const onChangeAmount = e => {
    setAmount(e.target.value);
  };

  const onChangeFrom = e => {
    setFrom(e.target.value);
  };

  const onChangeTo = e => {
    setTo(e.target.value);
  };

  const getRecentConversionFormat = ({ amount, from, to, result }) => {
    const date = new Date();

    const formattedDate = new Intl.DateTimeFormat("tr-TR", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      second: "numeric",
      minute: "numeric"
    }).format(date);

    return `(${formattedDate}): ${amount} ${from} = ${result} ${to}`;
  };

  const onClickConvert = () => {
    console.log(from, to, amount);

    fetch("https://api.exchangeratesapi.io/latest?base=" + from)
      .then(res => res.json())
      .then(data => {
        const result = parseFloat(data.rates[to] * amount).toFixed(2);
        setResult(result + " " + to);

        setRecentConversions([
          ...recentConversions,
          getRecentConversionFormat({ from, to, amount, result })
        ]);
      });
  };

  return (
    <div className="App">
      {recentConversions.length ? (
        <div>
          <h3>Recent Conversions</h3>
          <ul>
            {recentConversions.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      ) : (
        ""
      )}
      <div className="container">
        <div className="amount">
          Amount:
          <input type="text" value={amount} onChange={onChangeAmount} />
        </div>
        <div className="from">
          From:
          <select value={from} onChange={onChangeFrom}>
            {rates.map((rate, i) => (
              <option key={i}>{rate[0]}</option>
            ))}
          </select>
        </div>
        <div className="to">
          To:
          <select value={to} onChange={onChangeTo}>
            {rates.map((rate, i) => (
              <option key={i}>{rate[0]}</option>
            ))}
          </select>
        </div>
        <div className="submit">
          <button onClick={onClickConvert}>CONVERT</button>
        </div>
      </div>
      {result ? (
        <div className="container ">
          <h3>
            Result: <span className="result">{result}</span>
          </h3>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

export default App;
