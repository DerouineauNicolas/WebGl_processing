var renderer, scene, camera;
var geometry, material, mesh, ctx;


function init(){
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
    camera.position.z = 1000;

    geometry = new THREE.BoxGeometry( 200, 200, 200 );
    material = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe: true } );

    mesh = new THREE.Mesh( geometry, material );
    scene.add( mesh );

    var CANVAS=document.getElementById("your_canvas");
    renderer = new THREE.WebGLRenderer({ canvas: CANVAS } );
    renderer.setSize( window.innerWidth, window.innerHeight );
}


var main=function() {

  var arr = [];
  function funcInJsFile(index_arg,pos_x, pos_y, radius_init, x_inc_arg, y_inc_arg) {
    // Do Stuff
    var obj = {index: index_arg, x: pos_x, y: pos_y, radius: radius_init,  x_inc: x_inc_arg, y_inc: y_inc_arg };
    arr.push(obj);
  }

  function Evoluate(Points, step_size){
          
          if(Points.x<CANVAS.width-step_size && Points.x_inc==1){          
             Points.x=Points.x+step_size;
             //console.log("1");
          }
          else if(Points.x>step_size && Points.x_inc==0){
             //console.log("2");
             Points.x=Points.x-step_size;
          }
          else if(Points.x>(CANVAS.width-step_size)&& Points.x_inc==1){
             //console.log("3");             
             Points.x_inc=0;
             Points.x=Points.x-step_size;
          }
          else {
             //console.log("4");             
             Points.x_inc=1;
             Points.x=Points.x+step_size;
          }

          if(Points.y<CANVAS.height-step_size && Points.y_inc==1){          
             Points.y=Points.y+step_size;
             //console.log("1");
          }
          else if(Points.y>step_size && Points.y_inc==0){
             //console.log("2");
             Points.y=Points.x-step_size;
          }
          else if(Points.y>(CANVAS.width-step_size)&& Points.y_inc==1){
             //console.log("3");             
             Points.y_inc=0;
             Points.y=Points.y-step_size;
          }
          else {
             //console.log("4");             
             Points.y_inc=1;
             Points.y=Points.y+step_size;
          }
  }

  //alert("coucou")

  var CANVAS=document.getElementById("your_canvas");
  CANVAS.width=window.innerWidth;
  CANVAS.height=window.innerHeight;

  step_size=100;

  console.log(CANVAS.width);
  console.log(CANVAS.height);

  init();

  funcInJsFile(0, 0+step_size,0+step_size,8,1,1);
  funcInJsFile(1, CANVAS.width-8,CANVAS.height-8,8,0,0);

  //console.log(arr.size());

  x=0;

  //var m_context = CANVAS.getContext(‘2d’);

  var animate=function() {
      //alert("coucou")
      /*x=x+1;
      if(x>100)
          return;*/
      //
      arr.forEach(function(element) {
          //console.log(element);
          Evoluate(element,step_size);                  
      });
      //animate(0);

      window.requestAnimationFrame(animate);

      mesh.rotation.x += 0.01;
      mesh.rotation.y += 0.02;

      renderer.render(scene, camera);      
      
  }

  animate();
  
};
