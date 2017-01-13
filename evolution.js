var renderer, scene, camera;
//var geometry, material, mesh, ctx;


function init(){
    scene = new THREE.Scene();

    //camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
    camera = new THREE.OrthographicCamera( 0, window.innerWidth , 0, window.innerHeight , 1, 1000 );
    //camera.position.z = 0;
    camera.position.x = 0;
    camera.position.y = -1000;
    camera.position.z = 0;
    camera.lookAt(scene.position);

    var CANVAS=document.getElementById("your_canvas");
    renderer = new THREE.WebGLRenderer({ canvas: CANVAS } );
    renderer.setSize( window.innerWidth, window.innerHeight );
}



var main=function() {

  var arr = [];
  function funcInJsFile(index_arg,pos_x, pos_y, radius_init, x_inc_arg, y_inc_arg) {
    // Do Stuff
    var geometry = new THREE.BoxGeometry( radius_init, radius_init, radius_init );
    var material = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe: true } );
    var mesh = new THREE.Mesh( geometry, material );
    //mesh.position = new THREE.Vector3(pos_x, pos_y, 0)

    var obj = {m_index: index_arg,
               m_x: pos_x, 
               m_y: pos_y,
               m_radius: radius_init,
               m_x_inc: x_inc_arg, 
               m_y_inc: y_inc_arg,
               m_geometry: geometry,
               m_material: material,
               m_mesh: mesh,
               m_isinscene: 0,
               };
    arr.push(obj);
  }

  function Evoluate(Points, step_size){
          
          if(Points.m_x<CANVAS.width-step_size && Points.m_x_inc==1){          
             Points.m_x=Points.m_x+step_size;
             //console.log("1");
          }
          else if(Points.m_x>step_size && Points.m_x_inc==0){
             //console.log("2");
             Points.m_x=Points.m_x-step_size;
          }
          else if(Points.m_x>(CANVAS.width-step_size)&& Points.m_x_inc==1){
             //console.log("3");             
             Points.m_x_inc=0;
             Points.m_x=Points.m_x-step_size;
          }
          else {
             //console.log("4");             
             Points.m_x_inc=1;
             Points.m_x=Points.m_x+step_size;
          }

          if(Points.m_y<CANVAS.height-step_size && Points.m_y_inc==1){          
             Points.m_y=Points.m_y+step_size;
             //console.log("1");
          }
          else if(Points.m_y>step_size && Points.m_y_inc==0){
             //console.log("2");
             Points.m_y=Points.m_y-step_size;
          }
          else if(Points.m_y>(CANVAS.width-step_size)&& Points.m_y_inc==1){
             //console.log("3");             
             Points.m_y_inc=0;
             Points.m_y=Points.m_y-step_size;
          }
          else {
             //console.log("4");             
             Points.m_y_inc=1;
             Points.m_y=Points.m_y+step_size;
          }
  }


  var CANVAS=document.getElementById("your_canvas");
  CANVAS.width=window.innerWidth;
  CANVAS.height=window.innerHeight;

  step_size=3;

  console.log(CANVAS.width);
  console.log(CANVAS.height);

  init();

  funcInJsFile(0, 0, 0,50,1,1);
  funcInJsFile(1, CANVAS.width,CANVAS.height,50,0,0);


  var animate=function() {
      arr.forEach(function(element) {
          
          if(element.m_isinscene==0){
              scene.add( element.m_mesh );
              element.m_isinscene=1;
          }
          element.m_mesh.position.set(element.m_x, 0, element.m_y)              
              
          console.log(element);
          
          Evoluate(element,step_size);                  
      });

      window.requestAnimationFrame(animate);
      renderer.render(scene, camera);      
      
  }

  animate();
  
};
