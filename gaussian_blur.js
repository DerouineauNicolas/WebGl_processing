
var main=function() {
  var CANVAS=document.getElementById("your_canvas");
  CANVAS.width=window.innerWidth;
  CANVAS.height=window.innerHeight;

  /*========================= CAPTURE MOUSE EVENTS ========================= */

  var AMORTIZATION=0.95;
  var drag=false;


  var old_x, old_y;

  var dX=0, dY=0;
  var mouseDown=function(e) {
    drag=true;
    old_x=e.pageX, old_y=e.pageY;
    e.preventDefault();
    return false;
  };

  var mouseUp=function(e){
    drag=false;
  };

  var mouseMove=function(e) {
    if (!drag) return false;
    dX=(e.pageX-old_x)*2*Math.PI/CANVAS.width,
      dY=(e.pageY-old_y)*2*Math.PI/CANVAS.height;
    THETA+=dX;
    PHI+=dY;
    old_x=e.pageX, old_y=e.pageY;
    e.preventDefault();
  };

  CANVAS.addEventListener("mousedown", mouseDown, false);
  CANVAS.addEventListener("mouseup", mouseUp, false);
  CANVAS.addEventListener("mouseout", mouseUp, false);
  CANVAS.addEventListener("mousemove", mouseMove, false);

  /*========================= GET WEBGL CONTEXT ========================= */
  var GL;
  try {
    GL = CANVAS.getContext("experimental-webgl", {antialias: true});
  } catch (e) {
    alert("You are not webgl compatible :(") ;
    return false;
  }

  /*========================= SHADERS ========================= */
  /*jshint multistr: true */

  var shader_vertex_source="\n\
attribute vec3 position;\n\
uniform mat4 Pmatrix;\n\
uniform mat4 Vmatrix;\n\
uniform mat4 Mmatrix;\n\
attribute vec2 uv;\n\
varying vec2 vUV;\n\
void main(void) { //pre-built function\n\
gl_Position = Pmatrix*Vmatrix*Mmatrix*vec4(position, 1.);\n\
vUV=uv;\n\
}";


  var shader_fragment_source="\n\
precision mediump float;\n\
uniform sampler2D sampler;\n\
varying vec2 vUV;\n\
varying vec2 delta;\n\
//declare uniforms\n\
uniform sampler2D u_texture;\n\
uniform float resolution;\n\
uniform float radius;\n\
uniform vec2 dir;\n\
varying vec4 vColor;\n\
varying vec2 vTexCoord;\n\
uniform int apply_filter;\n\
\n\
\n\
float normpdf(in float x, in float sigma)\n\
{\n\
	return 0.39894*exp(-0.5*x*x/(sigma*sigma))/sigma;\n\
}\n\
void main() {\n\
    //this will be our RGBA sum\n\
    vec4 sum = vec4(0.0);\n\
    vec2 tc = vUV;\n\
    float blur = radius/512.0;; \n\
    float hstep = 1.0; \n\
    float vstep = 1.0; \n\
    if(apply_filter==0){\n\
        sum = texture2D(u_texture, vec2(tc.x, tc.y));\n\
    }\n\
    else {\n\
        sum += texture2D(u_texture, vec2(tc.x - 4.0*blur*hstep, tc.y - 4.0*blur*vstep)) * 0.0162162162;\n\
        sum += texture2D(u_texture, vec2(tc.x - 3.0*blur*hstep, tc.y - 3.0*blur*vstep)) * 0.0540540541;\n\
        sum += texture2D(u_texture, vec2(tc.x - 2.0*blur*hstep, tc.y - 2.0*blur*vstep)) * 0.1216216216;\n\
        sum += texture2D(u_texture, vec2(tc.x - 1.0*blur*hstep, tc.y - 1.0*blur*vstep)) * 0.1945945946;\n\
        \n\
        sum += texture2D(u_texture, vec2(tc.x, tc.y)) * 0.2270270270;\n\
        \n\
        sum += texture2D(u_texture, vec2(tc.x + 1.0*blur*hstep, tc.y + 1.0*blur*vstep)) * 0.1945945946;\n\
        sum += texture2D(u_texture, vec2(tc.x + 2.0*blur*hstep, tc.y + 2.0*blur*vstep)) * 0.1216216216;\n\
        sum += texture2D(u_texture, vec2(tc.x + 3.0*blur*hstep, tc.y + 3.0*blur*vstep)) * 0.0540540541;\n\
        sum += texture2D(u_texture, vec2(tc.x + 4.0*blur*hstep, tc.y + 4.0*blur*vstep)) * 0.0162162162;\n\
    }\n\
\n\
    //discard alpha for our simple demo, multiply by vertex color and return\n\
    gl_FragColor = vec4(sum.rgb, 1.0);\n\
}";

  var get_shader=function(source, type, typeString) {
    var shader = GL.createShader(type);
    GL.shaderSource(shader, source);
    GL.compileShader(shader);
    if (!GL.getShaderParameter(shader, GL.COMPILE_STATUS)) {
      alert("ERROR IN "+typeString+ " SHADER : " + GL.getShaderInfoLog(shader));
      return false;
    }
    return shader;
  };

  var shader_vertex=get_shader(shader_vertex_source, GL.VERTEX_SHADER, "VERTEX");
  var shader_fragment=get_shader(shader_fragment_source, GL.FRAGMENT_SHADER, "FRAGMENT");

  var SHADER_PROGRAM=GL.createProgram();
  GL.attachShader(SHADER_PROGRAM, shader_vertex);
  GL.attachShader(SHADER_PROGRAM, shader_fragment);

  GL.linkProgram(SHADER_PROGRAM);

  var _Pmatrix = GL.getUniformLocation(SHADER_PROGRAM, "Pmatrix");
  var _Vmatrix = GL.getUniformLocation(SHADER_PROGRAM, "Vmatrix");
  var _Mmatrix = GL.getUniformLocation(SHADER_PROGRAM, "Mmatrix");
  var _dofiltering = GL.getUniformLocation(SHADER_PROGRAM, "apply_filter");
  var _greyscality=GL.getUniformLocation(SHADER_PROGRAM, "greyscality");
  var _sampler = GL.getUniformLocation(SHADER_PROGRAM, "sampler");
  var _uv = GL.getAttribLocation(SHADER_PROGRAM, "uv");
  var _radius = GL.getUniformLocation(SHADER_PROGRAM, "radius");

  var _color = GL.getAttribLocation(SHADER_PROGRAM, "color");
  var _position = GL.getAttribLocation(SHADER_PROGRAM, "position");



  GL.enableVertexAttribArray(_uv);
  GL.enableVertexAttribArray(_position);

  GL.useProgram(SHADER_PROGRAM);

  GL.uniform1i(_sampler, 0);

  /*========================= THE CUBE ========================= */
  //POINTS :
  var cube_vertex=[
    -1,-1,-1,    0,0,
    1,-1,-1,     1,0,
    1, 1,-1,     1,1,
    -1, 1,-1,    0,1,

    -1,-1, 1,    0,0,
    1,-1, 1,     1,0,
    1, 1, 1,     1,1,
    -1, 1, 1,    0,1,

    -1,-1,-1,    0,0,
    -1, 1,-1,    1,0,
    -1, 1, 1,    1,1,
    -1,-1, 1,    0,1,

    1,-1,-1,     0,0,
    1, 1,-1,     1,0,
    1, 1, 1,     1,1,
    1,-1, 1,     0,1,

    -1,-1,-1,    0,0,
    -1,-1, 1,    1,0,
    1,-1, 1,     1,1,
    1,-1,-1,     0,1,

    -1, 1,-1,    0,0,
    -1, 1, 1,    1,0,
    1, 1, 1,     1,1,
    1, 1,-1,     0,1
  ];

  var CUBE_VERTEX= GL.createBuffer ();
  GL.bindBuffer(GL.ARRAY_BUFFER, CUBE_VERTEX);
  GL.bufferData(GL.ARRAY_BUFFER,
                new Float32Array(cube_vertex),
    GL.STATIC_DRAW);

  //FACES :
  var cube_faces = [
    0,1,2,
    0,2,3,

    4,5,6,
    4,6,7,

    8,9,10,
    8,10,11,

    12,13,14,
    12,14,15,

    16,17,18,
    16,18,19,

    20,21,22,
    20,22,23

  ];
  var CUBE_FACES= GL.createBuffer ();
  GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, CUBE_FACES);
  GL.bufferData(GL.ELEMENT_ARRAY_BUFFER,
                new Uint16Array(cube_faces),
    GL.STATIC_DRAW);
  /*========================= MATRIX ========================= */

  var PROJMATRIX=LIBS.get_projection(40, CANVAS.width/CANVAS.height, 1, 100);
  var MOVEMATRIX=LIBS.get_I4();
  var MOVEMATRIX2=LIBS.get_I4();
  var VIEWMATRIX=LIBS.get_I4();

  LIBS.translateZ(VIEWMATRIX, -6);
  var THETA=0,
      PHI=0;

  /*========================= THE VIDEO TEXTURE ========================= */
  var get_texture=function(image_URL){
    var image=new Image();
    image.src=image_URL;
    image.webglTexture=false;
    image.onload=function(e) {
      GL.uniform1f(_radius, 2.0);

      var texture=GL.createTexture();
      GL.pixelStorei(GL.UNPACK_FLIP_Y_WEBGL, true);

      GL.bindTexture(GL.TEXTURE_2D, texture);

      GL.texImage2D(GL.TEXTURE_2D, 0, GL.RGBA, GL.RGBA, GL.UNSIGNED_BYTE, image);

      GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MAG_FILTER, GL.LINEAR);

      GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, GL.LINEAR);

      GL.bindTexture(GL.TEXTURE_2D, null);

      image.webglTexture=texture;
    };

    return image;
  };

  var cube_texture=get_texture("Lenna_p2.jpg");
  
  var refresh_texture=function() {
    GL.bindTexture(GL.TEXTURE_2D, videoTexture);
    GL.texImage2D(GL.TEXTURE_2D, 0, GL.RGBA, GL.RGBA, GL.UNSIGNED_BYTE, video);
  };

  /*========================= DRAWING ========================= */
  GL.enable(GL.DEPTH_TEST);
  GL.depthFunc(GL.LEQUAL);
  GL.clearColor(0.0, 0.0, 0.0, 0.0);
  GL.clearDepth(1.0);

  var time_old=0;
  var animate=function(time) {
    var dt=time-time_old;
    if (!drag) {
      dX*=AMORTIZATION, dY*=AMORTIZATION;
      THETA+=dX, PHI+=dY;
    }
    LIBS.set_I4(MOVEMATRIX);
    LIBS.set_I4(MOVEMATRIX2);
    var radius=2; //half distance between the cube centers
    var pos_x=radius*Math.cos(PHI)*Math.cos(THETA);
    var pos_y=-radius*Math.sin(PHI);
    var pos_z=-radius*Math.cos(PHI)*Math.sin(THETA);

    LIBS.set_position(MOVEMATRIX, pos_x, pos_y, pos_z);
    LIBS.set_position(MOVEMATRIX2, -pos_x, -pos_y, -pos_z);

    LIBS.rotateZ(MOVEMATRIX, -PHI);
    LIBS.rotateZ(MOVEMATRIX2, -PHI);

    LIBS.rotateY(MOVEMATRIX, THETA);
    LIBS.rotateY(MOVEMATRIX2, THETA);

    time_old=time;

    GL.viewport(0.0, 0.0, CANVAS.width, CANVAS.height);
    GL.clear(GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT);
    GL.uniformMatrix4fv(_Pmatrix, false, PROJMATRIX);
    GL.uniformMatrix4fv(_Vmatrix, false, VIEWMATRIX);
    GL.uniformMatrix4fv(_Mmatrix, false, MOVEMATRIX);
    if(pos_z>0){
        GL.uniform1i(_dofiltering, 1);
        GL.uniform1f(_radius, (pos_z*10.0));
    }
    else
       GL.uniform1i(_dofiltering, 0);
    if (cube_texture.webglTexture) {

      GL.activeTexture(GL.TEXTURE0);

      GL.bindTexture(GL.TEXTURE_2D, cube_texture.webglTexture);
    }
    GL.bindBuffer(GL.ARRAY_BUFFER, CUBE_VERTEX);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false,4*(3+2),0);
    GL.vertexAttribPointer(_uv, 2, GL.FLOAT, false,4*(3+2),3*4);
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, CUBE_FACES);
    GL.drawElements(GL.TRIANGLES, 6*2*3, GL.UNSIGNED_SHORT, 0);
    _dofiltering
    if(pos_z<0){
       GL.uniform1i(_dofiltering, 1);
       GL.uniform1f(_radius, (pos_z*10.0));
    }
    else
       GL.uniform1i(_dofiltering, 0);

    if (cube_texture.webglTexture) {

      GL.activeTexture(GL.TEXTURE0);

      GL.bindTexture(GL.TEXTURE_2D, cube_texture.webglTexture);
    }
    GL.uniformMatrix4fv(_Mmatrix, false, MOVEMATRIX2);


    GL.drawElements(GL.TRIANGLES, 6*2*3, GL.UNSIGNED_SHORT, 0);
    GL.flush();

    window.requestAnimationFrame(animate);
  };
  animate(0);
};
