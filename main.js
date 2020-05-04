var handles = [];
var answers = [];
var n = 8;
var colors = [[0, 0, 0], [0, 0, 0], [255, 0, 0], [210, 210, 0], [0, 190, 0], [0, 190, 230], [0, 0, 255], [210, 0, 210]];
var colorName = ["", "", "red", "yellow", "green", "sky", "blue", "violet"];
var canvas, context, width, height;
var canvas2, context2, height2;
var holding;
var mouseX, mouseY;

function euclid(dx, dy) { return Math.sqrt(dx * dx + dy * dy); }

function init() {
  canvas = document.getElementById("canvas");
  context = canvas.getContext("2d");
  width = canvas.width;
  height = canvas.height;


  canvas2 = document.getElementById("canvas2");
  context2 = canvas2.getContext("2d");
  height2 = Math.random() * 200 + 400;
  canvas2.height = height2;
  canvas2.width = height2 * width / height;
  canvas2.style.marginLeft = (Math.random() * 700 + 100) + "px";

  handles = [];
  answers = [];

  var x = Math.floor(Math.random() * (width - 24) + 12);
  handles.push([x, 12]);
  answers.push([x, 12]);
  x = Math.floor(Math.random() * (width - 24) + 12);
  handles.push([x, height - 12]);
  answers.push([x, height - 12]);
  while (handles.length < n) {
    var x = Math.floor(Math.random() * (width - 24) + 12);
    var y = Math.floor(Math.random() * (height - 24) + 12);
    if (handles.every(a => (50 < euclid(a[0] - x, a[1] - y))))
      handles.push([x, y]);
  }
  while (answers.length < n) {
    var x = Math.floor(Math.random() * (width - 24) + 12);
    var y = Math.floor(Math.random() * (height - 24) + 12);
    if (answers.every(a => (50 < euclid(a[0] - x, a[1] - y))))
      answers.push([x, y]);
  }
  draw2();

  canvas.onmousedown = (event) => {
    event.preventDefault();
    mouseX = event.offsetX;
    mouseY = event.offsetY;
    for (var i = 2; i < n; i++) {
      if (euclid(handles[i][0] - mouseX, handles[i][1] - mouseY) < 10) holding = handles[i];
    }
    update();
  };
  canvas.onmousemove = (event) => {
    event.preventDefault();
    mouseX = event.offsetX;
    mouseY = event.offsetY;
  };
  canvas.onmouseup = canvas.ontouchend = (event) => {
    event.preventDefault();
    holding = null;
  };
  let control = document.getElementById("control");
  control.innerText = "";
  for (var i = 2; i < colors.length; i++) {
    a = document.createElement("option");
    a.innerText = colorName[i];
    a.style.backgroundColor = "rgb(" + colors[i] + ")";
    a.value = "" + i;
    if (i == 2) a.selected = true;
    control.appendChild(a);
  }
  control.onchange = () => {
    var select = +document.getElementById("control").value;
    control.style.backgroundColor = "rgb(" + colors[select] + ")";
  };
  control.style.backgroundColor = "rgb(" + colors[2] + ")";

  document.getElementById("pitch").value = "100";

  canvas.addEventListener("touchstart", (event) => {
    event.preventDefault();
    const rect = canvas.getBoundingClientRect();
    Array.from(event.changedTouches).forEach(touch => {
      const stroke = {
        id: touch.identifier,
        log: [{ x: touch.clientX - rect.left, y: touch.clientY - rect.top }],
      };
      strokes.push(stroke);
      strokeStart(stroke);
    });
  }, false);
  canvas.addEventListener("touchmove", (event) => {
    event.preventDefault();
    const rect = canvas.getBoundingClientRect();
    Array.from(event.changedTouches).forEach(touch => {
      const stroke = strokes.find(x => x.id === touch.identifier);
      if (stroke === undefined)
        return;
      stroke.log.push({ x: touch.clientX - rect.left, y: touch.clientY - rect.top });
      strokeMove(stroke);
    });
  }, false);
  canvas.addEventListener("touchend", (event) => {
    event.preventDefault();
    Array.from(event.changedTouches).forEach(touch => {
      const strokeIndex = strokes.findIndex(x => x.id === touch.identifier);
      if (strokeIndex === -1)
        return;
      const stroke = strokes[strokeIndex];
      strokes.splice(strokeIndex, 1); // remove it; we're done
      strokeEnd(stroke);
    });
  }, false);
  canvas.addEventListener("touchcancel", (event) => {
    event.preventDefault();
    Array.from(event.changedTouches).forEach(touch => {
      const strokeIndex = strokes.findIndex(x => x.id === touch.identifier);
      if (strokeIndex === -1)
        return;
      strokes.splice(strokeIndex, 1); // remove it; we're done
    });
  }, false);
  draw();
}

function getPitch() {
  var x = +document.getElementById("pitch").value * 0.01;
  var a = 20;
  var b = 3;
  return a * (Math.exp(b * x) - 1) / b + 1;
}

function left() {
  var select = +document.getElementById("control").value;
  handles[select][0] -= getPitch();
  if (handles[select][0] < 0) handles[select][0] = 0;
  draw();
}
function right() {
  var select = +document.getElementById("control").value;
  handles[select][0] += getPitch();
  if (width < handles[select][0]) handles[select][0] = width;
  draw();
}
function up() {
  var select = +document.getElementById("control").value;
  handles[select][1] -= getPitch();
  if (handles[select][1] < 0) handles[select][1] = 0;
  draw();
}
function down() {
  var select = +document.getElementById("control").value;
  handles[select][1] += getPitch();
  if (height < handles[select][1]) handles[select][1] = height;
  draw();
}

function update() {
  if (!holding) return;

  holding[0] = mouseX;
  holding[1] = mouseY;
  draw();

  setTimeout(update, 16);
}

function draw2() {
  context2.clearRect(0, 0, width, height);
  for (var i = 0; i < n; i++) {
    context2.fillStyle = "rgba(" + colors[i] + ", 0.8)";
    context2.beginPath();
    context2.arc(answers[i][0] * height2 / height, answers[i][1] * height2 / height, 10 * height2 / height, 0, 2 * Math.PI);
    context2.fill();
  }
}

function test() {
  var sum = 0;
  context.clearRect(0, 0, width, height);
  for (var i = 0; i < n; i++) {
    context.fillStyle = "rgba(" + colors[i] + ", 0.8)";
    context.beginPath();
    context.arc(handles[i][0], handles[i][1], 10, 0, 2 * Math.PI);
    context.fill();
    context.fillStyle = "rgba(" + colors[i] + ", 0.5)";
    context.beginPath();
    context.arc(answers[i][0], answers[i][1], 10, 0, 2 * Math.PI);
    context.fill();
    sum += euclid(handles[i][0] - answers[i][0], handles[i][1] - answers[i][1]);
  }
  score = Math.floor(10000 / (1 + 10 * sum / height / (n - 2))) / 100;
  setTimeout(() => alert(Math.floor(sum * 100) / 100 + "px の誤差\n" + score + "点"), 10);
}

window.onload = init;


const strokes = [];
function strokeStart(stroke) {
}
function strokeMove(stroke) {
  draw();
}
function strokeEnd(stroke) {
  draw();
  switch(isFrick(stroke)) {
    case "left": left(); break;
    case "right": right(); break;
    case "up": up(); break;
    case "down": down(); break;
  }
}
function draw() {
  context.clearRect(0, 0, width, height);
  for (var i = 0; i < n; i++) {
    context.fillStyle = "rgba(" + colors[i] + ", 0.8)";
    context.beginPath();
    context.arc(handles[i][0], handles[i][1], 10, 0, 2 * Math.PI);
    context.fill();
  }
  console.log(JSON.stringify(strokes));

  context.fillStyle = "rgba(0, 0, 0, 0.5)";
  strokes.forEach((stroke) => {
    switch (isFrick(stroke)) {
      case "left":
        {
          context.beginPath();
          context.moveTo(stroke.log[0].x, stroke.log[0].y);
          context.lineTo(stroke.log[0].x - 50, stroke.log[0].y - 50);
          context.lineTo(stroke.log[0].x - 50, stroke.log[0].y + 50);
          context.closePath();
          context.fill();
        }
        break;
      case "right":
        {
          context.beginPath();
          context.moveTo(stroke.log[0].x, stroke.log[0].y);
          context.lineTo(stroke.log[0].x + 50, stroke.log[0].y - 50);
          context.lineTo(stroke.log[0].x + 50, stroke.log[0].y + 50);
          context.closePath();
          context.fill();
        }
        break;
      case "up":
        {
          context.beginPath();
          context.moveTo(stroke.log[0].x, stroke.log[0].y);
          context.lineTo(stroke.log[0].x - 50, stroke.log[0].y - 50);
          context.lineTo(stroke.log[0].x + 50, stroke.log[0].y - 50);
          context.closePath();
          context.fill();
        }
        break;
      case "down":
        {
          context.beginPath();
          context.moveTo(stroke.log[0].x, stroke.log[0].y);
          context.lineTo(stroke.log[0].x - 50, stroke.log[0].y + 50);
          context.lineTo(stroke.log[0].x + 50, stroke.log[0].y + 50);
          context.closePath();
          context.fill();
        }
        break;
    }
  });
}
const flickRange = 50;
function isFrick(stroke) {
  const dx = stroke.log[stroke.log.length - 1].x - stroke.log[0].x;
  const dy = stroke.log[stroke.log.length - 1].y - stroke.log[0].y;
  if (dx * dx + dy * dy < flickRange * flickRange)
    return null;
  if (Math.abs(dy) < Math.abs(dx)) {
    return (0 < dx) ? "right" : "left";
  }
  else {
    return (0 < dy) ? "down" : "up";
  }
}
