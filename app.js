//global variables
let filling = true;
const canvas_size = { w: 450, h: 500 };
let coord_history = [];
let count_roll = 1;
let count_file = 1;

//canvas
const canvas = document.querySelector("#myCanvas");
const ctx = canvas.getContext("2d");
canvas.width = canvas_size.w;
canvas.height = canvas_size.h;

//>>slider set
const slider = document.querySelector("#mySlider");
ctx.lineWidth = slider.value;

slider.addEventListener("input", () => {
  const val = slider.value;
  ctx.lineWidth = val;
});

//>>drawing set
const toDetect = (e) => {
  const mx = e.offsetX;
  const my = e.offsetY;

  window.requestAnimationFrame(() => {
    coord_history.push([mx, my]);

    ctx.lineTo(mx, my);
    ctx.stroke();
  });
};

const toSpot = (e) => {
  if (filling) {
    canvas.addEventListener("mousemove", toDetect);
    canvas.addEventListener("mouseup", toEnd);
    canvas.addEventListener("mouseout", toEnd);

    const mx = e.offsetX;
    const my = e.offsetY;
    coord_history = [[mx, my]];

    ctx.beginPath();
    ctx.moveTo(mx, my);
  } else {
    ctx.fillRect(0, 0, canvas_size.w, canvas_size.h);
  }
};

const toEnd = (e) => {
  canvas.removeEventListener("mousemove", toDetect);
  canvas.removeEventListener("mouseup", toEnd);
  canvas.removeEventListener("mouseout", toEnd);
};

// cancel functionality
const undoT = () => {
  //base case
  if (coord_history.length == 0) {
    return;
  }

  const stroke_color = ctx.strokeStyle;
  ctx.beginPath();
  ctx.moveTo(coord_history[0][0], coord_history[0][1]);

  while (coord_history.length != 0) {
    let prev_point = coord_history.shift();

    window.requestAnimationFrame(() => {
      ctx.lineTo(prev_point[0], prev_point[1]);

      ctx.strokeStyle = "#fff";

      ctx.lineWidth = ctx.lineWidth + 0.4;
      ctx.stroke();

      //reset
      ctx.lineWidth = ctx.lineWidth - 0.4;
      ctx.strokeStyle = stroke_color;
    });
  }
};

// undo event set
const handleKey = (e) => {
  if (e.ctrlKey === true && e.key == "z") {
    undoT();
  }
};

// handling contextmenu event
const handleCtx = (e) => {
  e.preventDefault();
};

//rotate canvas with handle
const myHandle = document.querySelector("#myHandle");

const calcAngle = (e) => {
  //   if (count_roll > 4) {
  //     count_roll = 1;
  //   }

  const angle = count_roll++ * 90;
  myHandle.style.transform = `rotate(${angle}deg)`;
  canvas.style.transform = `rotate(${angle}deg)`;
};

myHandle.addEventListener("click", calcAngle);

// mode switch
const mode = document.querySelector("#mode");

mode.addEventListener("click", () => {
  filling = !filling;
  const content = mode.textContent;
  mode.textContent = mode.dataset.mode;
  mode.dataset.mode = content;
});

// implement save as image functionality
const saveNow = document.querySelector("#down");
const myModal = document.querySelector("#myModal");
const inpModal = document.querySelector("#q1");
const confirm = document.querySelector("#confirm");
const myConfirm = document.querySelector("#confirm>a");
const back = document.querySelector("#back");

saveNow.addEventListener("click", (e) => {
  //>>modal
  inpModal.value = `note ${count_file}`;
  myModal.style.display = "flex";
});
confirm.addEventListener("click", () => {
  const val = inpModal.value;

  //>> name file
  if (val) {
    const img_uri = canvas.toDataURL("image/png");
    myConfirm.href = img_uri;

    count_file++;

    myConfirm.download = val;
    myModal.style.display = "none";
  } else {
    e.preventDefault();
    myModal.style.display = "none";
    return;
  }
});
back.addEventListener("click", () => {
  myModal.style.display = "none";
  return;
});

//color set
const myColors = document.querySelectorAll("#myColors>div");

function aa(all) {
  all.forEach((one) => {
    //background color set
    const color = one.dataset.color;
    one.style.backgroundColor = color;

    //click event
    one.addEventListener("click", (e) => {
      ctx.strokeStyle = color;
      ctx.fillStyle = color;
    });
  });
}
aa(myColors);

if (canvas) {
  canvas.addEventListener("mousedown", toSpot);
  window.addEventListener("keydown", handleKey);
  canvas.addEventListener("contextmenu", handleCtx);
}
