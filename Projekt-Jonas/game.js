

class Position{
    
        constructor(x,y){
        this.x=x;
        this.y=y;
        }
}

class Size{
    
        constructor(width, height){
        this.width=width;
        this.height=height;
        }
    
}

var Constants={};
    Constants.canvasWidth=1920;
    Constants.canvasHeight=1080;
    Constants.labelYPos=Constants.canvasWidth/10;
    
    Constants.playerLP=100;
    Constants.playerHeight= Constants.canvasHeight/10;
    Constants.playerWidth=Constants.playerHeight/2;
    Constants.playerSize=new Size(Constants.playerWidth,Constants.playerHeight);
    Constants.playerColor="red";   
    Constants.stepSize=Constants.canvasWidth/100+Constants.playerWidth;
   
    
    Constants.groundHeight=Constants.canvasHeight/100;
    Constants.groundWidth=Constants.canvasWidth;
    Constants.groundSize=new Size(Constants.groundWidth,Constants.groundHeight);
    Constants.groundPosition=new Position(0,Constants.canvasHeight-Constants.groundHeight);  
    Constants.obstacleColor="green";
    Constants.obstacleDamage=0;

    Constants.fenceHeight=Constants.playerHeight*2;
    Constants.fenceWidth=Constants.playerWidth*2;
    Constants.fenceSize=new Size(Constants.fenceWidth, Constants.fenceHeight);
    Constants.fencePositon=new Position(Constants.canvasWidth/2,Constants.canvasHeight-Constants.fenceHeight-Constants.groundHeight);  
    Constants.fenceName="fence";
    
    Constants.playerStartY=Constants.canvasHeight- Constants.playerHeight-Constants.groundHeight;
    Constants.playerLeftStartX=Constants.canvasWidth/4;
    Constants.playerRightStartX=Constants.canvasWidth-Constants.playerLeftStartX;
    Constants.playerOneStartPosition=new Position(Constants.playerLeftStartX, Constants.playerStartY);
    Constants.playerTwoStartPosition=new Position(Constants.playerRightStartX, Constants.playerStartY);
    Constants.playerOneId=1;
    Constants.playerTwoId=2;
    
    Constants.standardMissileType="standardMissile";    
    Constants.bananaMissileType="MissileTypes['bananaMissile']";
    Constants.maximumNumberOfMissles=1;




var MissileTypes = {};
MissileTypes.standardMissile={
            name:"Einfaches Geschoss",
            id:0,
            damage:10,
            height: Constants.playerHeight/2,
            width:  Constants.playerHeight/2,
            throwDistance:1/4,
            throwingAngle:45,
            speed:100    
            };
MissileTypes.bananaMissile={
            name:"Fliegende Banana",
            id:1,
            damage:20,
            height: Constants.playerHeight/2,
            width:  Constants.playerHeight/2,
            throwDistance:1/4,
            throwingAngle:45,
            speed:10   
        };

var neighbourList=new Array();
var obstacleList=new Array();
var missileListLeft=new Array();
missileListLeft.length=Constants.maximumNumberOfMissles;
var missileListRight=new Array();
missileListRight.length=Constants.maximumNumberOfMissles;
var gameIsOn=false;
var gameCountDown = countDown(30000); 


class Game{
        
    constructor(canvasId){
    gameIsOn=true;    
    this.ground=new Obstacle(Constants.groundSize, Constants.groundPosition);
    this.fence=new Obstacle(Constants.fenceSize,  Constants.fencePositon);
    this.fence.name=Constants.fenceName;   
    this.obstacles= new Array(this.ground,this.fence);
    this.leftNeighbour=new Neighbour(Constants.playerLP,Constants.playerSize, Constants.playerOneStartPosition, Constants.playerOneId, this.obstacles);
    this.rightNeighbour=new Neighbour(Constants.playerLP,Constants.playerSize, Constants.playerTwoStartPosition, Constants.playerTwoId, this.obstacles);
    this.neighbours=new Array(this.leftNeighbour, this.rightNeighbour);
    neighbourList.push(this.leftNeighbour);
    neighbourList.push(this.rightNeighbour);
    obstacleList.push(this.ground);
    obstacleList.push(this.fence);
    this.canvasHeight=Constants.canvasHeight;
    this.canvasWidth=Constants.canvasWidth;
    initKeyCodes(this.leftNeighbour, this.rightNeighbour);
    drawPermanent(canvasId);
   
    writeLog("Game constructed");       
   
    }
}



function startNewGame(){
    var game=new Game();
}

function drawPermanent(canvasId){  
    if(canvasId!==null){    
    var myVar = setInterval(function(){updateGame(canvasId) }, 300);
    writeLog("I drawPermanent");
    }

    else{writeLog("can't drawPermanent");}
    
        
}

//direct in mitte erstellen
//canvas stauchen feste px
function updateGame(canvasId){  

      
     canvas  = document.getElementById(canvasId);
     if(canvas!==null)
     if(canvas.getContext){
        var context = canvas.getContext('2d');   
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);   
        drawAllObstacles(context);
        drawAllNeighbours(context);           
        drawMisslesFly(context); 
        drawTimeAndOtherLables(context);
      // checkCollisionsOfMissles();         
        destroyDeadObjects();     
        checkIfGameIsOver();      
               
    //context.strokeRect(x, y, 20, 20); 
    writeLog("updated Game time"+gameCountDown());
    }
   
}

function drawGameField(context){      
  context.clearRect(0, 0, context.canvas.width, context.canvas.height);   
    context.canvas.width=Constants.canvasWidth;
    context.canvas.height=Constants.canvasHeight;    
   
    context.fillRect(0, 0, context.canvas.width, context.canvas.height);
  
  
}

function drawTimeAndOtherLables(context){
     context.font = "30px Comic Sans MS";
    context.fillStyle = "red";
    context.textAlign = "center";
    context.fillText("timeLeft:" +gameCountDown(), canvas.width/2, Constants.labelYPos); 
    context.fillText("Player One Lp:" +neighbourList[0].lp, Constants.playerOneStartPosition.x, Constants.labelYPos); 
    context.fillText("Player Two Lp:" +neighbourList[1].lp,  Constants.playerTwoStartPosition.x, Constants.labelYPos); 

}

function drawNeighbour(context, neighbour){
    this.neighbour=neighbour;
    if(this.neighbour!==undefined){
        if(this.neighbour.position!==undefined){
             var neighbourFigure=drawFigure(Constants.playerWidth, Constants.playerHeight, Constants.playerColor, this.neighbour.position.x, this.neighbour.position.y, context); 
         writeLog("neighbour drawn "+this.neighbour.id);   
        }
          else    writeLog("neighbour position undefined");  
    }

    else    writeLog("neighbour undefined");  
   
}

function drawObstacle(context, obstacle){
    this.obstacle=obstacle;
    if(this.obstacle!==undefined){
        if(this.obstacle.position!==undefined){
            var obstacleFigure=drawFigure(obstacle.width, obstacle.height, Constants.obstacleColor, this.obstacle.position.x, this.obstacle.position.y, context);  
            writeLog("obstacle drawn");  
        }
        else  {  writeLog("drawObstacle obstacle position undefined "+obstacle.name);  }
    }

    else writeLog("obstacle undefined");     
    
}

function drawFigure(width, height, color, x, y, context) {    
    this.x = x;
    this.y = y; 
    this.width = width;
    this.height = height;
    this.context = context;
    context.fillStyle = color;
    context.fillRect(this.x, this.y, this.width, this.height);
}


function drawAllObstacles(context){
     //drawGameField(context);
        if(obstacleList!==undefined&&obstacleList!==null){
            for(let index in obstacleList){             
              drawObstacle(context, obstacleList[index]);               
              }             
        }

        else{writeLog("obstacles couldnt be drawn");}

}

function drawAllNeighbours(context){
     //drawGameField(context);
        if(neighbourList!==undefined&&neighbourList!==null){
            for(let index in neighbourList){
                if(neighbourList[index]!==undefined){
                drawNeighbour(context, neighbourList[index]);  
                }  
                 else{writeLog("drawAllNeighbours couldnt be drawn as neighbour is undefined");}           
                             
              }             
        }

        else{writeLog("neighbours couldnt be drawn");}

}


function drawMisslesFly(context){
    for(index in missileListLeft){
        if(missileListLeft[index]!==null&&missileListLeft[index]!==undefined){
            if(missileListLeft[index]!==undefined&&missileListLeft[index]!==null){
               missileListLeft[index].fly();
               drawObstacle(context, missileListLeft[index]);
               writeLog("drawMisslesFly x y "+missileListLeft[index].name+" x "+missileListLeft[index].x+" y "+missileListLeft[index].y);
            }  
            else{writeLog("drawMisslesFly couldnt be drawn as neighbour is undefined");}           
        }
        else{writeLog("drawMisslesFly Left couldnt be drawn");}
        
    }

    for(index in missileListRight){
        if(missileListRight[index]!==null&&missileListRight[index]!==undefined){
            if(missileListRight[index]!==undefined&&missileListLeft[index]!==null){
            missileListRight[index].fly();
            drawObstacle(context, missileListRight[index]);
            }  
            else{writeLog("drawAllNeighbours couldnt be drawn as neighbour is undefined");} 
        }
        else{writeLog("drawMisslesFly Right couldnt be drawn");}
   
    }
}


function destroyDeadObjects(){

    for(index in missileListLeft){
        if(missileListLeft[index]!==null&&missileListLeft[index]!==undefined){
            if( missileListLeft[index].lp<=0){
            missileListLeft.splice(index,1);
            }
        }
    }

    for(index in missileListRight){
        if(missileListRight[index]!==null&&missileListRight[index]!==undefined){
            if( missileListRight[index].lp<=0){
            missileListRight.splice(index,1);
            }
        }
   }
           
   
    
}

function checkCollisionsOfMissles(){
    for(index in obstacleList){
       //missle, object  
       for(missileindex in missileListLeft){
         if(missileListLeft[missileindex]!==undefined&&missileListLeft[missileindex]!==null){
      //      checkForCollision(missileListLeft[missileindex],obstacleList[index]); 
            writeLog("checkCollisionsOfMissles left x:"+missileListLeft[missileindex].x+"y: "+missileListLeft[missileindex].y);  
       } 
       }
       

       if(missileListRight[0]!==undefined&&missileListRight!==null){
        //checkForCollision(missileListRight[0],obstacleList[index]); 
        // writeLog("checkCollisionsOfMissles right x:"+missileListRight[0].x+"y: "+missileListRight[0].y);  
       } 
        
    }


}

function checkIfGameIsOver(){
    for(let index=0;index<neighbourList.length; index++){
         writeLog("checkIfGameIsOver "+index +" "+neighbourList.length+" "+neighbourList[index].lp);
            if(neighbourList[index].lp<=0){
            writeLog("Game Over Player "+neighbourList[index].id+" lost");
            return true;
            }

          
    }
}




    


class Neighbour{    
    constructor(lp, size, position, id, obstacles){
        this.name="neighbour "+id;        
        this.lp=lp;
        this.height=size.height;
        this.width=size.width;
        this.position=position;
        this.id=id;
        this.obstacles=obstacles;
         writeLog("Neighbour constructed pos "+this.position.x);
    }
    
    throwMissile(){

        if(this.position!==undefined){
     
        console.log("Neighbour throws missle "+Constants.standardMissileType);        
        var enemyID=(this.id===1 ? 1:2);
        var misslePosition=new Position(this.position.x, this.position.y);
        var missile=new Missile(misslePosition, this.obstacles, enemyID,  MissileTypes.standardMissile);
        this.addMissleToList(missile); 
        missile.fly();   
        writeLog("Missile thrown enemyID: "+enemyID+" "+this.position);
        }   

        else{writeLog("Neighbour couldn't throw missle "+this.position.x);}  
         
    }

    addMissleToList(missile){
        if(this.id===Constants.playerOneId){
            this.overWriteOldMissile(missileListLeft, missile);
        }

        else{
            this.overWriteOldMissile(missileListRight, missile);           
        }
    }

    overWriteOldMissile(missileList, missile){
        var index = missileList.indexOf(missile);
        if (index !== -1) {
        missileList[index] = missile;
        }

        else{missileList[0] = missile;
        }
    }
    
    moveLeft(){
         this.position.x-= Constants.stepSize;
         this.isHittingFence();
        console.log("Neighbour moves forward"+this.position.x);        
        this.isHittingFence();
         
       
    }
    
    moveRight(){
        this.position.x+= Constants.stepSize;
        console.log("Neighbour moves backwards"+ this.position.x);       
        this.isHittingFence();
   
                
        
    }
    
    onHitSomething(damage){
        this.lp=this.lp-damage;
        writeLog("neighbour onHitSomething"+this.id+" lp "+this.lp);
    }

    isHittingFence(){
      
        for(let index in obstacleList){
           
            if(obstacleList[index].name==="fence"){
            writeLog("isHittingFence"+this.position.x+" "+obstacleList[index].position.x);

                    if(this.id===Constants.playerOneId){
                            if(this.position.x>obstacleList[index].position.x){                        
                              this.position.x-=Constants.stepSize*3;  
                            } 

                            if(this.position.x<Constants.canvasWidth-Constants.canvasWidth){
                                  this.position.x+=Constants.stepSize*3; 
                            }                     
                    }           
                    

                    else{ 
                            if(this.position.x<obstacleList[index].position.x+obstacleList[index].width){                           
                              this.position.x+=Constants.stepSize*3; 
                            }    

                            if(this.position.x>Constants.canvasWidth){
                                  this.position.x-=Constants.stepSize*3; 
                            }                         
                        }

            }    
        }            
    }
}
   
        
  
    





class Missile{  
        
        constructor(position, obstacles, enemyID, missileType){
        this.name="missile";
        this.lp=1;
        this.missileType=missileType;
        if(this.missileType===undefined){this.missileType=MissileTypes.standardMissile;}
        this.position= position;
        if(this.position.x===NaN||this.position.y===NaN||this.position===undefined){
            this.position=Constants.playerTwoStartPosition;
            writeLog("Missile constructor position undefined or NaN x: "+ this.position.x +" y "+this.position.y+" position "+ this.position);    
        }
        this.height=this.missileType.height;
        this.width=this.missileType.width;       
        this.throwDistance=this.missileType.throwDistance;
        this.angle=-this.missileType.throwingAngle;
        this.obstacles=obstacles;
        this.enemyID=enemyID;
        this.speed=this.missileType.speed;      
        this.damage=this.missileType.damage;    
        this.id=null;
      
        writeLog("Missile constructed");
        
        }

        startFlying(){
       
        var xdirection=Math.cos(this.angle)*this.speed;        
        var ydirection=Math.sin(this.angle)*this.speed;
        this.angle+=this.throwDistance;
            
         if(this.position!==undefined){
            if(this.enemyID===Constants.playerOneId){
                this.position.x+=xdirection;
            }

            else{this.position.x-=xdirection;}
           
            this.position.y+=ydirection;

            console.log("Missile is flying x "+this.position.x+" y "+this.position.y); 
            this.findCollisions(this);
         }
         else{writeLog("couldn't startFlying position "+this.position);}
           
            

      
        }
    
        //calculates the direction of the missile
        //and updates the missile position
        fly(){     
               
        this.startFlying();     
        console.log("Missile is flying");
      //  this.findCollisions();
        
        }          
        
        findCollisions(missile){                       
           console.log("findCollisions x "+missile.position.x+" y "+missile.position.x);          
            if(this.enemyID===Constants.playerTwoId){
                checkForCollision(missile, neighbourList[0]);                
                }
               else{checkForCollision(missile, neighbourList[1]);
               }

            for(let index in obstacleList){
                checkForCollision(missile, obstacleList[index]);
            }
            
            return this.damage;
        }  

        onHitSomething(damage){
            this.lp=0;
        }    


}

class Obstacle{
       constructor(size, position){
        this.name="obstacle";
        this.size=size; 
        this.position=position;
        this.height=size.height;
        this.width=size.width;
        this.id=null;
        this.damage=Constants.obstacleDamage;
        writeLog("Obstacle constructed");
        
        }
        
        tellmeWhereIam(){
            console.log(""+this.position.x +" , "+ this.position.y);
        }
        
        onHitSomething(damage){
            //doNothing
        }
}
    


function checkForCollision(missile, object){
  //   writeLog("checkForCollision missile x y"+missile.position.x +" "+missile.position.y);

    if(missile!==undefined&&object!==undefined){
         writeLog("checkForCollision checks possible collisions"+missile.position.x +" "+missile.position.y+" "+object.name);
         if(isColliding(missile, object)){
            writeLog("do doCollisionAction");           
            doCollisionAction(missile,object);         
              
        }    
    }
    else{writeLog("checkForCollision undefined problem missile: "+missile+" object: "+object);}
   
}

function doCollisionAction(missile, object){
        missile.onHitSomething(missile.damage);
        object.onHitSomething(missile.damage);
        writeLog("doCollisionAction did doCollisionAction "+object.name);       
     
}

function isColliding(missile, object){
    /*
       (0,0) ----------------------------------------------------------------------------------------------------------
        -      topleft         topRight              ..........
        -       ................                      missile...............        
                .              .                     ..........            .
        -       .              .                            .    object  .............
        -       ................                            ................  missile.
        -      downLeft        downRight                                 .............
        -    

    */


    if(missile!==undefined&&object!==undefined){

    let missileTopY=missile.position.y;
    let missileLeftX=missile.position.x;
    let missileDownY=missile.position.y+missile.height;
    let missileRightX=missile.position.x+missile.width;
    

    let objectTopY=object.position.y;
    let objectDownY=object.position.y+object.height;
    let objectLeftX=object.position.x;
    let objectRightX=object.position.x+object.width;

    
  /*  writeLog("isCollidingmissile checks possible collisions"+missile.position.x +" "+missile.position.y+" "+object.name+" "+missile.name);           
    writeLog("isCollidingobjecte checks possible collisions"+object.position.x +" "+object.position.y+" "+object.name+" "+missile.name);
    writeLog("isCollidingcomparechecks  possible collisions "+ object.name+" "+missile.name+" "+ missileLeftX+"mLx <oRx "+objectRightX);
    writeLog("isCollidingcomparechecks2 +&&" +missileRightX+"mRx >oLx "+objectLeftX+" && "+missileTopY+"mTy<oDy "+objectDownY+" &&oTy "+missileDownY+"mDY > "+objectTopY);*/
    if(checkRectCollision(missileTopY, missileDownY, missileLeftX, missileRightX, objectTopY, objectDownY, objectLeftX, objectRightX)){
         writeLog("isColliding missile and object collied ");
         return true;
    }

    else{return false;}
    
 
}

else{writeLog("isColliding undefined problem");}
    
}

function checkRectCollision(missileTopY, missileDownY, missileLeftX, missileRightX, objectTopY, objectDownY, objectLeftX, objectRightX) {
  return (missileLeftX < objectRightX && missileRightX > objectLeftX && missileTopY < objectDownY && missileDownY > objectTopY);
}



//listens for the key event and controlls neighbour-actions
function initKeyCodes(neighbourLeft, neighbourRight){
    document.onkeydown=function(event){
       switch(event.keyCode){
        //d
        case 65:neighbourLeft.moveLeft();
            writeLog("left neighbour moves left");
            break;         
        //a           
        case 68: neighbourLeft.moveRight();
          writeLog("left neighbour moves right");
                break;
        //backs
        case 32: neighbourLeft.throwMissile();
          writeLog("left neighbour throws missile");
                break;
        //LeftArrow
        case 37: neighbourRight.moveLeft();
          writeLog("right neighbour moves left");
            break;
        //RightArrow
        case 39:neighbourRight.moveRight();
          writeLog("right neighbour moves right");
            break;
        //numpad 0
        case 96: neighbourRight.throwMissile();
          writeLog("right neighbour throws missile");
                break;
       }
    }
}

function writeLog(message){
    console.log(message);
}

function countDown(timeLeft) {
    var startTime = Date.now();
    return function() {
        var timeInMillis=timeLeft - ( Date.now() - startTime );
        var timeInSeconds=Number((timeInMillis/1000).toFixed(0));       
       return  timeInSeconds;
    }
}

 


