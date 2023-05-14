/* Animation config */
var renderNodenum =
  location.hash != "" ? parseInt(location.hash.replace("#", "")) : 25;
var renderNodes = []; // Array for generated nodes
var renderFrames = 60; // Animation Frames per second (FPS)

/* Get the canvas object and upscale it to the complete window size */
var canvasElement = document.getElementById("spectrum");
var canvasContext = canvasElement.getContext("2d");
var canvasLengthX = window.innerWidth;
var canvasLengthY = window.innerHeight;
canvasElement.setAttribute("width", canvasLengthX);
canvasElement.setAttribute("height", canvasLengthY);

/**
 * The animation init function will
 * clear the canvas and generate the
 * array with all nodes in it.
 */
function animationInit() {
  clearCanvasElement();
  for (var i = 0; i < renderNodenum; i++) {
    renderNodes.push(new node());
  }
}

/**
 * The node class contains all parameters
 * and functions of a single node.
 *
 * px: The node's position on the x axis
 * py: The node's position on the y axis
 * sx: Randomly chosen (50:50) move direction and move speed (0 - 1) on the x axis
 * sy: Randomly chosen (50:50) move direction and move speed (0 - 1) on the y axis
 *
 * draw: Method to draw the node in canvas
 */
function node() {
  this.px = Math.random() * canvasLengthX;
  this.py = Math.random() * canvasLengthY;
  this.sx = Math.random() > 0.5 ? Math.random() : -Math.random();
  this.sy = Math.random() > 0.5 ? Math.random() : -Math.random();

  this.draw = function () {
    canvasContext.fillStyle = "#ffffff";
    canvasContext.fillRect(this.px, this.py, 0, 0);
  };
}

/**
 * The render function will be called every frame.
 * It will redraw the nodes in the canvas and randomly
 * link them together.
 */
function renderNodespectrum() {
  /* Clear canvas */
  clearCanvasElement();

  /* Move every node */
  for (var i = 0; i < renderNodes.length; i++) {
    /* Get node from array */
    var node = renderNodes[i];

    /* Change the node's position */
    node.px += node.sx;
    node.py += node.sy;

    /* Check if the node hasn't reached the canvas' border */
    if (node.px > canvasLengthX || node.px < 0) node.sx = -node.sx;
    if (node.py > canvasLengthY || node.py < 0) node.sy = -node.sy;

    /* Redraw node */
    node.draw();
  }

  /* Link nodes together */
  for (var i = 0; i < renderNodes.length; i++) {
    /* Get node from array */
    var node = renderNodes[i];

    /* Get all the other nodes */
    for (var j = 0; j < renderNodes.length; j++) {
      /* Get node from array and calculate difference to other node */
      var nodes = renderNodes[j];
      var diffX = node.px - nodes.px;
      var diffY = node.py - nodes.py;
      var diffT = Math.sqrt(diffX * diffX + diffY * diffY);

      /* Draw line if total difference between the nodes isn't to big */
      if (diffT < canvasLengthX / 4) {
        canvasContext.beginPath();
        canvasContext.moveTo(node.px, node.py);
        canvasContext.lineTo(nodes.px, nodes.py);
        canvasContext.strokeStyle = "rgba(255, 255, 255, 0.65)";
        canvasContext.lineWidth = 0.15;
        canvasContext.stroke();
      }
    }
  }
}

/**
 * This function will clear the canvas by
 * drawing a dull sized black square in it
 */
function clearCanvasElement() {
  canvasContext.fillStyle = "#1f64cb";
  canvasContext.fillRect(0, 0, canvasLengthX, canvasLengthY);
}

/**
 * Request the browsers animation frame API
 * to get a solid framerate
 */
window.requestAnimFrame = (function () {
  return (
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function (callback) {
      window.setTimeout(callback, 1000 / renderFrames);
    }
  );
})();

/**
 * The loop function that will call
 * the render function every frame using
 * the browser's animframe API
 */
function animationLoop() {
  renderNodespectrum();
  requestAnimFrame(animationLoop);
}

/* Initialize and start animation */
animationInit();
animationLoop();
