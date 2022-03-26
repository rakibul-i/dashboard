import "./App.css";

import React, { useEffect, useState } from "react";

const App = () => {
  const [dashboardTitle, setDashboardTitle] = useState("");
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [number, setNumber] = useState(null);

  // load fake data from JSON file
  useEffect(() => {
    setLoading(true);
    fetch("./staticData.json")
      .then((res) => res.json())
      .then((result) => {
        setData(result.data);
        setClicked(false);
        setLoading(false);
        setDashboardTitle("Load JSON Data");
      });
  }, []);

  // load new data from database
  const loadNewData = () => {
    setLoading(true);
    fetch(
      `https://still-eyrie-85728.herokuapp.com/api/products?page=${1}&&size=${4}`
    )
      .then((res) => res.json())
      .then((result) => {
        let newArr = [];
        const allData = result.data;
        for (let i = 0; i < allData.length; i++) {
          const element = allData[i];
          newArr.push(element.price);
        }
        setDashboardTitle("Dynamic Data loaded from database");
        setData(newArr);
        setLoading(false);
        setClicked(true);
      });
  };

  // load previous data
  const loadPreviousData = () => {
    setDashboardTitle("Load JSON Data");
    setLoading(true);
    fetch("./staticData.json")
      .then((res) => res.json())
      .then((result) => {
        setData(result.data);
        setClicked(false);
        setLoading(false);
      });
  };

  // addNumber
  const addNumber = () => {
    if (number <= 0) {
      setNumber(0);
      alert("Please enter a valid number");
    } else {
      let newArrdata = [];
      for (let i = 0; i < data.length; i++) {
        const element = data[i];
        newArrdata.push(parseFloat(element) + parseFloat(number));
      }
      setData(newArrdata);
      setDashboardTitle(`Afer adding ${number} `);
    }
  };
  return (
    <div className="App">
      <header className="App-header">
        {/* load new data */}
        <div>
          {!clicked && (
            <button disabled={clicked} onClick={loadNewData}>
              Load New Data
            </button>
          )}
          {clicked && (
            <button disabled={!clicked} onClick={loadPreviousData}>
              Load Previous Data
            </button>
          )}
        </div>

        {/* // add number with loaded data */}
        <div>
          <input
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            type="number"
            placeholder="Enter your number"
          />
          <button onClick={addNumber}>Add Number</button>
        </div>

        {loading && <p>Data loading</p>}

        {!loading && (
          <>
            {/* dashboard title */}
            <p>{dashboardTitle}</p>

            {/* dashboard statics */}
            <table>
              <thead>
                <tr>
                  <th>Mean</th>
                  <th>Median</th>
                  <th>StdDev</th>
                  <th>Mode</th>
                </tr>
              </thead>

              {/* // dynamic data */}
              <tbody>
                <tr>
                  {data?.map((num, i) => {
                    return <td key={i}>{num}</td>;
                  })}
                </tr>
              </tbody>
            </table>
          </>
        )}
      </header>
    </div>
  );
};

export default App;
