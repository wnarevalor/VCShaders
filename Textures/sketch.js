let lumaShader;
let img;
let grey_scale;
let rslider;
let gslider;
let easycam;
let bslider;

function preload() {
  lumaShader = readShader("images/luma.frag", { varyings: Tree.texcoords2 });
  // image source: https://en.wikipedia.org/wiki/HSL_and_HSV#/media/File:Fire_breathing_2_Luc_Viatour.jpg
  img = loadImage("images/fire_breathing.jpg");
}

function setup() {
  createCanvas(700, 500, WEBGL);
  rslider = createSlider(0, 1, 0, 0.01);
  rslider.position(10, 10);
  rslider.style("width", "80px");
  gslider = createSlider(0, 1, 0, 0.01);
  gslider.position(10, 40);
  gslider.style("width", "80px");
  bslider = createSlider(0, 1, 0, 0.01);
  bslider.position(10, 70);
  bslider.style("width", "80px");
  noStroke();
  textureMode(IMAGE);
  shader(lumaShader);
  inverted = createCheckbox("inverse", false);
  inverted.position(width - 100, 10);
  inverted.style("color", "white");
  inverted.input(() => lumaShader.setUniform("inverted", inverted.checked()));
  rslider.changed(() => {
    lumaShader.setUniform("r_scale", rslider.value());
  });
  gslider.changed(() => {
    lumaShader.setUniform("g_scale", gslider.value());
  });
  bslider.changed(() => {
    lumaShader.setUniform("b_scale", bslider.value());
  });
  lumaShader.setUniform("texture", img);
}

function draw() {
  background(0);
  orbitControl();
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
