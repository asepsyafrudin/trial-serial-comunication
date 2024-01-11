import express from "express";
import cors from "cors";
import http from "http";
import { ReadlineParser, SerialPort } from "serialport";
import { Server } from "socket.io";

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

const server = http.createServer(app);

try {
  const port = new SerialPort({
    path: "COM3",
    baudRate: 9600,
    autoOpen: false,
  });

  const port4 = new SerialPort({
    path: "COM4",
    baudRate: 9600,
    autoOpen: false,
  });

  app.post("/connectserial", (req, res) => {
    console.log("api masuk");
    port.open((error) => {
      if (error) {
        console.log(error);
        res.status(400).json({
          msg: "failed",
        });
      } else {
        console.log("serial port open success");
        res.status(200).json({
          msg: "success",
        });
      }
    });
  });

  app.post("/connectserial2", (req, res) => {
    console.log("api masuk");
    port4.open((error) => {
      if (error) {
        console.log(error);
        res.status(400).json({
          msg: "failed",
        });
      } else {
        console.log("serial port open success");
        res.status(200).json({
          msg: "success",
        });
      }
    });
  });

  const io = new Server(server, {
    cors: "http:localhost:3000",
  });

  global.io = io;

  const parser = port.pipe(new ReadlineParser({ delimiter: "\r\n" }));
  const parser2 = port4.pipe(new ReadlineParser({ delimiter: "\r\n" }));

  io.on("connection", (socket) => {
    console.log(`connected with ${socket.id}`);
    socket.on("disconnect", function () {
      console.log("user disconnected");
    });
  });

  parser.on("data", (result) => {
    console.log("data dari serial", result);

    io.emit("datafromserial", { data: result }); //kirim data ke frontend
  });

  parser2.on("data", (result) => {
    console.log("data dari serial", result);

    io.emit("datafromserial2", { data: result }); //kirim data ke frontend
  });
} catch (error) {
  console.log(error);
}

server.listen(8080, () => {
  console.log("server running on Port 8080");
});
