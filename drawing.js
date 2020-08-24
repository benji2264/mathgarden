const BCKG_COLOR = '#000000';
const LINE_COLOR = '#FFFFFF';
const LINE_WIDTH = 15;

var canvas;
var context;

var currentX = 0;
var currentY = 0;
var previousX = 0;
var previousY = 0;

var isDrawing = false;

function prepareCanvas() {
  canvas = document.getElementById('canvas1');
  context = canvas.getContext('2d');

  context.fillStyle = BCKG_COLOR;
  context.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);

  context.strokeStyle = LINE_COLOR;
  context.lineWidth = LINE_WIDTH;
  context.lineJoin = 'round';

  // -------- On Desktop --------
  document.addEventListener('mousedown', function (event) {
    currentX = event.clientX - canvas.offsetLeft;
    currentY = event.clientY - canvas.offsetTop;
    isDrawing = true;
    // console.log('Mouse Pressed');
  });

  document.addEventListener('mousemove', function (event) {
    if (isDrawing) {
      previousX = currentX;
      previousY = currentY;

      currentX = event.clientX - canvas.offsetLeft;
      currentY = event.clientY - canvas.offsetTop;

      draw();
      // console.log('X: ' + currentX);
      // console.log('Y: ' + currentY);
    }
  });

  document.addEventListener('mouseup', function (event) {
    isDrawing = false;
    // console.log('Mouse Released');
  });

  canvas.addEventListener('mouseleave', function (event) {
    isDrawing = false;
  });


  // -------- On Mobile --------
  canvas.addEventListener('touchstart', function (event) {
    currentX = event.touches[0].clientX - canvas.offsetLeft;
    currentY = event.touches[0].clientY - canvas.offsetTop;
    isDrawing = true;
    // console.log('Touch Pressed');

    if (event.target == canvas) {
      event.preventDefault();
    }
  });

  canvas.addEventListener('touchmove', function (event) {

    if (event.target == canvas) {
      event.preventDefault();
    }

    if (isDrawing) {
      previousX = currentX;
      previousY = currentY;

      currentX = event.touches[0].clientX - canvas.offsetLeft;
      currentY = event.touches[0].clientY - canvas.offsetTop;

      draw();
    }

  });

  canvas.addEventListener('touchend', function (event) {

    if (event.target == canvas) {
      event.preventDefault();
    }

    isDrawing = false;
    // console.log('Touch Released');
  });


  canvas.addEventListener('touchleave', function (event) {

    if (event.target == canvas) {
      event.preventDefault();
    }

    isDrawing = false;
  });
}

function clearCanvas () {

  currentX = 0;
  currentY = 0;
  previousX = 0;
  previousY = 0;

  // canvas = document.getElementById('canvas1');
  // context = canvas.getContext('2d');

  context.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);

}

function draw() {
  context.beginPath();
  context.moveTo(previousX, previousY);
  context.lineTo(currentX, currentY);
  context.closePath();
  context.stroke();
}
