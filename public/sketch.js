// Create connection to Node.JS Server
const socket = io();
let sizeSlider;
let bSize = 30;

let canvas;
let gui; 
let drawIsOn = false;
let button;

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent("sketch-container"); 
  canvas.mousePressed(canvasMousePressed);//we only want to start draw when clicking on canvas element

  //add our gui
  gui = select("#gui-container");
  gui.addClass("open");//forcing it open at the start, remove if you want it closed

  // add the color sliders here


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
}

function draw() {

  if(drawIsOn){
    fill(0);
    circle(mouseX,mouseY,bSize);
  }

}

//we only want to draw if the click is on the canvas not on our GUI
function canvasMousePressed(){
  drawIsOn = true;
}

function mouseReleased(){
  drawIsOn = false;
}

function mouseDragged() {

  //don't emit if we aren't drawing on the canvas
  if(!drawIsOn){
    return;
  }

  socket.emit("drawing", {
    xpos: mouseX / width,
    ypos: mouseY / height,
    userS: bSize / width
  });

}

function onDrawingEvent(data){
  fill(0);
  circle(data.xpos * width,data.ypos * height,data.userS * width);
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