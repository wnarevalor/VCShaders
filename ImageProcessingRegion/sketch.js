let maskShader;
let img;
let luma;
let video_src;
let video_on;
let mask;

function preload() {
  maskShader = readShader("images/mask.frag", {
    varyings: Tree.texcoords2,
  });
  img = loadImage("images/fire_breathing.jpg");
}

function setup() {
  // shaders require WEBGL mode to work
  createCanvas(800, 600, WEBGL);
  noStroke();
  textureMode(NORMAL);
  mask = createCheckbox("ridges", false);
  mask.position(10, 10);
  mask.style("color", "white");
  shader(maskShader);
  maskShader.setUniform("texture", img);
  emitTexOffset(maskShader, img, "texOffset");
}

function draw() {
  background(0);
  if (!mask.checked()) {
    maskShader.setUniform("mask", [-1, -1, -1, -1, 8, -1, -1, -1, -1]);
    maskShader.setUniform("ridges", mask.checked());
    const mx = map(mouseX, 0, width, 0.0, 1.0);
    const my = map(mouseY, 0, height, 0.0, 1.0);
    maskShader.setUniform("uResolution", [width, height]);
    maskShader.setUniform("uMouse", [mx, my]);
  } else {
    maskShader.setUniform("mask", [0, 0, 0, 0, 1, 0, 0, 0, 0]);
    maskShader.setUniform("ridges", mask.checked());
  }

  quad(
    -width / 2,
    -height / 2,
    width / 2,
    -height / 2,
    width / 2,
    height / 2,
    -width / 2,
    height / 2
  );
}
