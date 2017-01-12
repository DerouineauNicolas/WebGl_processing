var main=function() {

  var arr = [];
  function funcInJsFile(index_arg,pos_x, pos_y, radius_init, x_inc_arg, y_inc_arg) {
    // Do Stuff
    var obj = {index: index_arg, x: pos_x, y: pos_y, radius: radius_init,  x_inc: x_inc_arg, y_inc: y_inc_arg };
    arr.push(obj);
  }

  //alert("coucou")

  var CANVAS=document.getElementById("your_canvas");
  CANVAS.width=window.innerWidth;
  CANVAS.height=window.innerHeight;

  step_size=100;

  console.log(CANVAS.width);
  console.log(CANVAS.height);

  funcInJsFile(0, 0+step_size,0+step_size,8,1,1);
  //funcInJsFile(1, CANVAS.width-8,CANVAS.height-8,8,0,0);

  //console.log(arr.size());

  x=0;
 

  var animate=function(time) {
      //alert("coucou")
      x=x+1;
      if(x>100)
          return;
      //
      arr.forEach(function(element) {
          console.log(element);
          if(element.x<CANVAS.width-step_size && element.x_inc==1){          
             element.x=element.x+step_size;
             //console.log("1");
          }
          else if(element.x>step_size && element.x_inc==0){
             //console.log("2");
             element.x=element.x-step_size;
          }
          else if(element.x>(CANVAS.width-step_size)&& element.x_inc==1){
             //console.log("3");             
             element.x_inc=0;
             element.x=element.x-step_size;
          }
          else {
             //console.log("4");             
             element.x_inc=1;
             element.x=element.x+step_size;
          }                  
      });
      animate(0);
      
  }
  
  animate(0);
};
