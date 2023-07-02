import React, { useState } from "react";
import "./css/receive.css";
import { useSelector } from "react-redux";

const Receiver = () => {
  const user = useSelector((state) => state.User);

  const [category, setCat] = useState();
  const [container, setContainer] = useState([]);
  const [pin, setPin] = useState("");
  const [city, setCity] = useState();

  const handlePin = (e) => {
    document.querySelector('#checkPIN').innerHTML='Check';
    setCity();
    setPin(e.target.value);
  };
  const sendPin = async () => {
    document.querySelector('#checkPIN').innerHTML='Checking';
    if (pin.length === 6) {
      const res = await fetch(
        `https://thezipcodes.com/api/v1/search?zipCode=${pin}&countryCode=IN&apiKey=581f1dd4c36d7c2b8775ff66499e0426`
      );
      const data = await res.json();
      console.log(data);
      setCity(data.location[0].county || data.location[0].city);
    }
  };

  const handleCat = (e) => {
    setCat(e.target.value);
  };

  const error = document.querySelector(".error");
  const search = document.querySelector("#search");

  const searchAdv = async () => {
    document.querySelector(".btn").innerHTML = "Searching";
    if (!category) {
      alert("Choose Category");
      document.querySelector(".btn").innerHTML = "Search";
      return;
    }
    const userID = user.phone;
    const res = await fetch("/receive", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ category, city, userID }),
    });

    const data = await res.json();

    if (res.status === 200) {
      setContainer(data);
      search.style.display = "none";
      error.classList.add("hide");
    }
    if (res.status === 500) {
      document.querySelector(".btn").innerHTML = "Search";
      error.classList.remove("hide");
    }
  };

  return (
    <div id="receive-box">
      <div className="error hide">No posts available</div>
      <div id="search">
        <h6>Tip: Enter PinCode of your City</h6>
        <input
          type="number"
          placeholder="Pin Code"
          value={pin}
          onChange={handlePin}
          accept="number"
        ></input>
        {city ? (
          <>
            <input type="text" placeholder="City" value={city} disabled></input>
            <select
              id="category"
              className="advInfo"
              name="category"
              onChange={handleCat}
            >
              <option value="" disabled hidden selected id="catplace">
                CATEGORY
              </option>
              <option value="Books">BOOKS</option>
              <option value="Clothes">CLOTHES</option>
              <option value="Utensil">UTENSILS</option>
              <option value="Other">OTHER</option>
            </select>
            <button
              className="btn btn-outline-success"
              type="submit"
              onClick={searchAdv}
            >
              Search
            </button>
          </>
        ) : (
          <button
            className="btn btn-outline-success"
            type="submit"
            id='checkPIN'
            onClick={sendPin}
          >
            Check
          </button>
        )}
      </div>
      {container.map((item) => {
        return (
          <div className="card">
            <div id="cardimg">
              <img
                src={item.AdvPhoto}
                alt="img"
                max-height="100%"
                max-width="100%"
              ></img>
            </div>

            <div className="card-body">
              <h5 className="card-title">{item.title}</h5>
              <p className="card-title">
                <span>
                  <b>City: </b>
                </span>
                {item.city}
              </p>
              <p className="card-text">
                <span>
                  <b>Advertiser: </b>
                </span>
                {item.name}
              </p>
              <p className="card-text">
                <span>
                  <b>Contact: </b>
                </span>
                {item.phone}
              </p>
              <p className="card-text">{item.description}</p>
              {/* <button className="btn btn-primary seepost"
                                onClick={showInterest}
                            >Get</button> */}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Receiver;
