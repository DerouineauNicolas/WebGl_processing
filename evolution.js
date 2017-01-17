var renderer, scene, camera;
//var geometry, material, mesh, ctx;
var num_cubes=0;
var cubes_size=0;
var cubes_index=0;


function init(){
    scene = new THREE.Scene();

    camera = new THREE.OrthographicCamera( 0, window.innerWidth , 0, window.innerHeight , 0.1, 1000 );
    camera.position.x = 0;
    camera.position.y = -1000;
    camera.position.z = 0;
    camera.lookAt(scene.position);

    var CANVAS=document.getElementById("your_canvas");
    renderer = new THREE.WebGLRenderer({ canvas: CANVAS } );
    renderer.setSize( window.innerWidth, window.innerHeight );
}



var Display=function() {

  var arr = [];
  function Add_new_being(index_arg,pos_x, pos_y, radius_init, x_inc_arg, y_inc_arg) {
    // Do Stuff
    var geometry = new THREE.BoxGeometry( radius_init, radius_init, radius_init );
    var material = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe: true } );
    var mesh = new THREE.Mesh( geometry, material );

    var obj = {m_index: index_arg,
               m_x: pos_x, 
               m_y: pos_y,
               m_radius: radius_init,
               m_x_inc: x_inc_arg, 
               m_y_inc: y_inc_arg,
               m_mesh: mesh,
               m_isinscene: 0,
               };
    arr.push(obj);
    cubes_index++;
  }


  function Divide() {
    // Do Stuff
      var index_intersection=[];
      arr.forEach(function(element_on_scope) {          
          arr.forEach(function(element_to_check) {          
               if(element_on_scope.m_index==element_to_check.m_index){
                   //console.log("same");
               }
               else{
                   //console.log("not  same");
                   if((Math.abs(element_on_scope.m_x - element_to_check.m_x) * 2 < (element_on_scope.m_radius + element_to_check.m_radius)) &&
                      (Math.abs(element_on_scope.m_y - element_to_check.m_y) * 2 < (element_on_scope.m_radius + element_to_check.m_radius))){
                       
                       //console.log("Intersection");
                       element_on_scope.m_x_inc= (element_on_scope.m_x_inc==1)?0:1;
                       element_on_scope.m_y_inc= (element_on_scope.m_y_inc==1)?0:1;
                   }
               }
          });                  
      });
      
  }

  function Evoluate(Points, step_size){
          
          if(Points.m_x<CANVAS.width-(Points.m_radius/2) && Points.m_x_inc==1){          
             Points.m_x=Points.m_x+step_size;
             //console.log("1");
          }
          else if(Points.m_x>(Points.m_radius/2) && Points.m_x_inc==0){
             //console.log("2");
             Points.m_x=Points.m_x-step_size;
          }
          else if(Points.m_x>(CANVAS.width-(Points.m_radius/2))&& Points.m_x_inc==1){
             //console.log("3");             
             Points.m_x_inc=0;
             Points.m_x=Points.m_x-step_size;
          }
          else {
             //console.log("4");             
             Points.m_x_inc=1;
             Points.m_x=Points.m_x+step_size;
          }

          if(Points.m_y<CANVAS.height-(Points.m_radius/2) && Points.m_y_inc==1){          
             Points.m_y=Points.m_y+step_size;
             //console.log("1");
          }
          else if(Points.m_y>(Points.m_radius/2) && Points.m_y_inc==0){
             //console.log("2");
             Points.m_y=Points.m_y-step_size;
          }
          else if(Points.m_y>(CANVAS.height-(Points.m_radius/2))&& Points.m_y_inc==1){
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

  init();

  var scene_init=0;
  //console.log(num_cubes);

  var animate=function() {
      if(scene_init<num_cubes){
          Add_new_being(scene_init,CANVAS.width*Math.random()-(cubes_size/2), CANVAS.height*Math.random()-(cubes_size/2), cubes_size, 0, 0);
          scene_init++;
          //console.log(arr);
      }
      arr.forEach(function(element) {
      
          if(element.m_isinscene==0){
              scene.add( element.m_mesh );
              element.m_isinscene=1;
          }
          element.m_mesh.position.set(element.m_x, 0, element.m_y)              
         
          Evoluate(element,step_size);                  
      });

      Divide(arr);

      window.requestAnimationFrame(animate);
      renderer.render(scene, camera);   
  }       
      

  animate();
  
};

function main() {

        /*var canvas=document.getElementById("your_canvas");
        var ctx = canvas.getContext("2d");
        ctx.font = "30px Arial";
        ctx.fillText("Hello World",10,50);*/

        stats = createStats();
        control = new function () {

            this.numberToAdd = 50;
            this.Cubesize = 5;

            this.Run = function () {
                console.log("Running main app");
                num_cubes=this.numberToAdd;
                cubes_size=this.Cubesize;
                Display();
            }

        };
        addControls(control);

        
}

function addControls(controlObject) {

        var gui = new dat.GUI();
        gui.add(controlObject, 'Cubesize');
        gui.add(controlObject, 'numberToAdd');
        gui.add(controlObject, 'Run');

}

function createStats() {
        var stats = new Stats();
        stats.setMode(0);

        stats.domElement.style.position = 'absolute';
        stats.domElement.style.left = '0px';
        stats.domElement.style.top = '0px';

        return stats;
}
