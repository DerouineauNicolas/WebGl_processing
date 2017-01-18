var renderer, scene, camera;
//var geometry, material, mesh, ctx;
var CANVAS
var num_cubes=0;
var cubes_size=0;
var cubes_index=0;
var arr = [];


function init(){
    scene = new THREE.Scene();

    camera = new THREE.OrthographicCamera( 0, window.innerWidth , 0, window.innerHeight , 0.1, 1000 );
    camera.position.x = 0;
    camera.position.y = -1000;
    camera.position.z = 0;
    camera.lookAt(scene.position);

    renderer = new THREE.WebGLRenderer({ canvas: CANVAS } );
    renderer.setSize( window.innerWidth, window.innerHeight );
}



var Display=function() {
  step_size=1;

  init();

  var scene_init=0;
  arr=[];

  var animate=function() {
      
      if(scene_init<num_cubes){
          var pos_x=Math.round((CANVAS.width-cubes_size)*Math.random())+cubes_size/2;
          var pos_y=Math.round((CANVAS.height-cubes_size)*Math.random())+cubes_size/2;
          var result=false;
          result=if_position_isavailable(arr,pos_x,pos_y,cubes_size);
          if(result==true){
              Add_new_being(scene_init,pos_x, pos_y, cubes_size, 1, 1);
              scene_init++;
          }
      }

      Divide(arr);

      
      arr.forEach(function(element) {
      
          if(element.m_isinscene==0){
              scene.add( element.m_mesh );
              element.m_isinscene=1;
          }
          element.m_mesh.position.set(element.m_x, 0, element.m_y)              
         
          Evoluate(element,step_size);
          element.m_collision_resolved_x=0;
          element.m_collision_resolved_y=0;                   
      });

      

      window.requestAnimationFrame(animate);
      renderer.render(scene, camera);   
  }       
      

  animate();
  
};

function main() {

        CANVAS=document.getElementById("your_canvas");
        CANVAS.width=window.innerWidth;
        CANVAS.height=window.innerHeight;
        stats = createStats();
        control = new function () {

            this.numberToAdd = 5;
            this.Cubesize = 200;

            this.Run = function () {
                console.log("Running main app");
                num_cubes=this.numberToAdd;
                cubes_size=this.Cubesize;
                Display();
            }

        };
        addControls(control);

        
}

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
               m_collision_resolved_x: 0,
               m_collision_resolved_y: 0,
               };
    arr.push(obj);
}

function Divide() {
    // Do Stuff
      var index_intersection=[];
      arr.forEach(function(element_on_scope) {          
          arr.forEach(function(element_to_check) {          
               if(element_on_scope.m_index==element_to_check.m_index){
               }
               else{
                      if (element_on_scope.m_x < element_to_check.m_x + element_to_check.m_radius &&
                          element_on_scope.m_x + element_on_scope.m_radius > element_to_check.m_x &&
                          element_on_scope.m_y < element_to_check.m_y + element_to_check.m_radius &&
                          element_on_scope.m_y + element_on_scope.m_radius > element_to_check.m_y){                              
                              element_on_scope.m_x_inc=(-1)*element_on_scope.m_x_inc;
                              element_on_scope.m_y_inc=(-1)*element_on_scope.m_y_inc;}

                      
               }
          });                  
      });
      
}


function if_position_isavailable(Obj_list, m_x , m_y, m_radius){
      result=true;
      Obj_list.forEach(function(element_on_scope) { 
                      if (element_on_scope.m_x < m_x + m_radius &&
                      element_on_scope.m_x + element_on_scope.m_radius > m_x &&
                      element_on_scope.m_y < m_y + m_radius &&
                      element_on_scope.m_radius + element_on_scope.m_y > m_y){
                           //console.log("Intersection");
                           result=false;
                      }                     
      });
      return result;
}

function Evoluate(Points, step_size){
          
          if(Points.m_x>=CANVAS.width-(Points.m_radius/2) || Points.m_x<=(Points.m_radius/2)){     
             Points.m_x_inc=(-1)*Points.m_x_inc;
          }
          Points.m_x=Points.m_x+((Points.m_x_inc)*(step_size));

          if(Points.m_y>=CANVAS.height-(Points.m_radius/2) || Points.m_y<=(Points.m_radius/2)){
             Points.m_y_inc=(-1)*Points.m_y_inc;        
          }
          Points.m_y=Points.m_y+((Points.m_y_inc)*(step_size));            
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
