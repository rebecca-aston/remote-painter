# remote-painter
 
This is a web-sockets with socket.io multi-user drawing example. 

The live example can be seen on [Render](https://render.com/): [https://remote-painter.onrender.com/](https://remote-painter.onrender.com/)


## To test locally:

Once you have downloaded or cloned the repo. In VS Code open the terminal, make sure you are in the root directory (you can run the command `pwd` to double check).

1. Run `npm install`

2. Run `node app.js` to start the server

3. You will then need to go to http://localhost:3000/ in your browser window(s) to test the multiplayer functionality locally on your machine. Optionally, specify a port by supplying the `port` variable in app.js. `process.env.PORT` variable will be used instead when available (e.g. on Render.com).
