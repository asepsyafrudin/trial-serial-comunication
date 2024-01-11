import React, { useEffect, useState } from "react";
import socketIO from "socket.io-client";
import axios from "axios";

const socket = socketIO.connect("http://localhost:8080");

function App() {
  const [data, setData] = useState("No Available");
  const [status, setStatus] = useState("Close");
  const [data2, setData2] = useState("No Available");

  useEffect(() => {
    socket.on("datafromserial", (object) => {
      setData(object.data);
    });

    socket.on("datafromserial2", (data) => {
      setData2(data.data);
    });
  }, []);

  const handleOpenSerial2 = () => {
    axios
      .post("http://localhost:8080/connectserial2")
      .then((result) => {
        window.alert("open success");
      })
      .catch((error) => {
        console.log(error);
        window.alert("Open Port Failed");
      });
  };

  const handleOpenSerial = () => {
    axios
      .post("http://localhost:8080/connectserial")
      .then((result) => {
        window.alert("open success");
      })
      .catch((error) => {
        console.log(error);
        window.alert("Open Port Failed");
      });
  };
  return (
    <div className="App">
      <div>
        <button onClick={handleOpenSerial}>Open Serial</button>
        <button onClick={handleOpenSerial2}>Open Serial 2</button>
      </div>
      <h1>Serial Status : {status}</h1>
      <h1>Serial Port 1 Result : {data}</h1>
      <h1>Serial Port 2 Result : {data2}</h1>
    </div>
  );
}

export default App;
