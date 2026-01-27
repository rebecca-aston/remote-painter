//Glitch uses ES Lint to show errors, this does not play nicely with external libraries like p5, the line below will turn off those errors:
/*eslint no-undef: 0*/ 

/*
This is a very simple multi-user painting app. If you wanted to expand this, it would be better to use an offscreen buffer:
https://p5js.org/reference/#/p5/createGraphics

That way you could create a drawing that the user can zoom in and out of rather than scaling the drawing to the user's screen.
*/

// Create connection to Node.JS Server
const socket = io();
let sizeSlider;
let bSize = 30;

let canvas;
let gui; 
let drawIsOn = false;
let button;
let brushColor;

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent("sketch-container"); 
  canvas.mousePressed(startDrawing);//we only want to start draw when clicking on canvas element
  canvas.touchStarted(startDrawing);
  
  //add our gui
  gui = select("#gui-container");
  gui.addClass("open");//forcing it open at the start, remove if you want it closed


  // before you add the size slider
  sizeSlider = createSlider(1,100, bSize);
  sizeSlider.parent(gui);
  sizeSlider.addClass("slider");

  //call the handleSliderInputChange callback function on change to slider value
  sizeSlider.input(handleSliderInputChange);
  
  //call this once at start so the color matches our mapping to slider width
  handleSliderInputChange();

  //add our gui menu panel button
  button = createButton(">");
  button.addClass("button");

  //Add the button to the parent gui HTML element
  button.parent(gui);
  
  //Adding a mouse pressed event listener to the button 
  button.mousePressed(handleButtonPress); 
 
  //set styling for the sketch
  background(255);
  noStroke();
  
  //give a random color when you first load the sketch in the browser
  brushColor = color(random(255),random(255),random(255));
}

function draw() {

  if(drawIsOn){
    fill(brushColor);
    circle(mouseX,mouseY,bSize);
  }

}

//Make this work on both mobile touch devices and computers
//we only want to draw if the click is on the canvas not on our GUI
//touch and mouse start events will call this callback
function startDrawing(){
  drawIsOn = true;
}

//for end of interaction and movement we want to capture event even if not on canvas
function mouseReleased(){
  drawIsOn = false;
}

function touchEnded(){
  drawIsOn = false;
}

function mouseDragged() {

  //don't emit if we aren't drawing on the canvas
  if(!drawIsOn){
    return;
  }

 emitData();

}

function touchMoved() {
  if(!drawIsOn){
    return;
  }
  
 emitData();
  
}

function emitData(){
   socket.emit("drawing", {
    xpos: mouseX / width,
    ypos: mouseY / height,
    userR: red(brushColor), //get the color channels
    userG: green(brushColor),
    userB: blue(brushColor),
    userS: bSize  // userS: bSize / width  //see what's it's like to scale to users window
  });
}


function onDrawingEvent(data){
  fill(data.userR,data.userG,data.userB);
  // circle(data.xpos * width,data.ypos * height,data.userS*width);//scale to users window
  circle(data.xpos * width,data.ypos * height,data.userS);
}

function handleButtonPress()
{
    gui.toggleClass("open");//remove or add the open class to animate our gui in and out
}

function handleSliderInputChange(){
  bSize = sizeSlider.value();
}

//Events we are listening for
// Connect to Node.JS Server
socket.on("connect", () => {
  console.log(socket.id);
});

// Callback function on the event we disconnect
socket.on("disconnect", () => {
  console.log(socket.id);
});

// Callback function to recieve message from Node.JS
socket.on("drawing", (data) => {
  console.log(data);

  onDrawingEvent(data);

});

function windowResized() {

  //wipes out the history of drawing if resized, potential fix, draw to offscreen buffer
  //https://p5js.org/reference/#/p5/createGraphics
 // resizeCanvas(windowWidth, windowHeight);

}