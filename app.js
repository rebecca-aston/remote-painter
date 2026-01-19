// Import Libraries and Setup

import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);//socket io needs an http server
const io = new Server(server);
const port = process.env.PORT || 3000;

// Tell our Node.js Server to host our P5.JS sketch from the public folder.
app.use(express.static("public"));

// Setup Our Node.js server to listen to connections from chrome, and open chrome when it is ready
server.listen(port, () => {
  console.log("listening on: "+port);
});

let printEveryMessage = false; 

// Callback function for what to do when our P5.JS sketch connects and sends us messages
io.on("connection", (socket) => {
  console.log("a user connected");

  // Code to run every time we get a message from front-end P5.JS
  socket.on("drawing", (data) => {

    //do something
    socket.broadcast.emit('drawing', data);//broadcast.emit means send to everyone but the sender

    // Print it to the Console
    if (printEveryMessage) {
      console.log(data);
    }
  });
});

