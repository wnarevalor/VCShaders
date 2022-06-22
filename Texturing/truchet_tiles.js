let pg;
let truchetShader;

function preload() {
  // shader adapted from here: https://thebookofshaders.com/09/
  truchetShader = readShader("truchet2.frag", {
    matrices: Tree.NONE,
    varyings: Tree.NONE,
  });
}

function setup() {
  createCanvas(700, 700, WEBGL);
  // create frame buffer object to render the procedural texture
  pg = createGraphics(700, 700, WEBGL);
  textureMode(NORMAL);
  noStroke();
  pg.noStroke();
  pg.textureMode(NORMAL);
  // use truchetShader to render onto pg
  pg.shader(truchetShader);
  // emitResolution, see:
  // https://github.com/VisualComputing/p5.treegl#macros
  pg.emitResolution(truchetShader);
  // https://p5js.org/reference/#/p5.Shader/setUniform
  truchetShader.setUniform("u_zoom", 3);
  // pg clip-space quad (i.e., both x and y vertex coordinates ∈ [-1..1])
  pg.quad(-1, -1, 1, -1, 1, 1, -1, 1);
  // set pg as texture
  texture(pg);
}

function draw() {
  background(33);
  orbitControl();
  rotateX(millis() / 1000);
  rotateY(millis() / 1000);
  torus(150, 50);
}

function mouseMoved() {
  // https://p5js.org/reference/#/p5.Shader/setUniform
  truchetShader.setUniform("u_zoom", int(map(mouseX, 0, width, 1, 30)));
  // pg clip-space quad (i.e., both x and y vertex coordinates ∈ [-1..1])
  pg.quad(-1, -1, 1, -1, 1, 1, -1, 1);
}
