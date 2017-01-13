var renderer, scene, camera;
//var geometry, material, mesh, ctx;
var num_beings=0;


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



var main=function() {

  var arr = [];
  function Add_new_being(index_arg,pos_x, pos_y, radius_init, x_inc_arg, y_inc_arg) {
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
               //m_geometry: geometry,
               //m_material: material,
               m_mesh: mesh,
               m_isinscene: 0,
               };
    arr.push(obj);
    num_beings++;
  }

  function GetID(array,index_to_find) {      
      return array.index = index_to_find;
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
                       
                       console.log("Intersection");
                       index_intersection.push(element_on_scope.m_index);
                       index_intersection.push(element_to_check.m_index);
                       element_on_scope.m_mesh.material.dispose();
                       element_on_scope.m_mesh.geometry.dispose();
                       element_to_check.m_mesh.material.dispose();
                       element_to_check.m_mesh.geometry.dispose();
                       /*if(num_beings<5)
                       
                           Add_new_being(num_beings, 
                                         element_to_check.m_y+element_to_check.m_radius,
                                         element_to_check.m_x+element_to_check.m_radius,
                                         element_to_check.m_radius/2,0,0);*/
                   }
               }
          });                  
      });

      //console.log(index_intersection);

      index_intersection.forEach(function(intersecting_box) {
          var result=arr.findIndex(GetID,intersecting_box);
          if(result>-1)
              arr.splice(intersecting_box,1);

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
             Points.m_y=Points.m_y-(Points.m_radius/2);
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

  Add_new_being(0, 0, 0, 50,1,1);
  Add_new_being(1, CANVAS.width,CANVAS.height,50,0,0);
  Add_new_being(2, CANVAS.width, 0, 50,1,1);


  var animate=function() {
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
