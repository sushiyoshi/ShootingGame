/*
var game = function() {
    let n = [0,0,0,0,0,0,0,0,0]; //テストプレイ用
    let t = 0;
    setInterval(function() {
        if(n[8] <= 0) {
          n[1]+= 13;
          add(0,{color:`#${shinsu(n[3]*5)}cccc`,speed:0.5,accele:0.5,effect:[1,0],size:7},5,72,n[1]);
          add(0,{color:`#cccc${shinsu(n[3]*5)}`,speed:0.5,accele:0.5,effect:[1,0],size:7},5,72,n[1]*-1);
          n[3]++;
          if(n[3] >= 45) {
           add(0,{btype:8,other:[300],color:'#ff0000',ad:"ad1",bulletNumber:1,Addval:100,size:10},10,36,0);
           n = [0,0,0,0,0,0,0,0,0];
           n[3] = 30;
           n[8] = 3;
           n[1] = 2;
           } 
        } else {
          if(n[3] <= 0) {
            n[0] = rndm(0,360);
            n[1]*= -1;
            n[2]++;
            add(0,{speed:2,accele:0.5,dir_accele:1.0*n[1],type:2,color:'#b000a3',size:30,btype:1,bulletNumber:n[2],down:20,other:[30,15],Addval:300,effect:[1,0]},8,45,n[0]);
            n[3] = 16;
            } else {
               n[3]--;
            }

        }
    },250);

}*/

console(10050);