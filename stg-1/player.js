function playerAll() {
	if(player.alive) {
	 	window.onkeydown =function (e){
	 		input_key_buffer[e.keyCode] = true;
	 	};
	 	window.onkeyup = function (e){
	 		input_key_buffer[e.keyCode] = false;
	 	};
	 	player.spX = (4-input_key_buffer[16]*2)*(input_key_buffer[39] - input_key_buffer[37]);
	 	player.spY = (4-input_key_buffer[16]*2)*(input_key_buffer[40] - input_key_buffer[38]);
	 	player.X += player.spX;
	    player.Y += player.spY;
	    player.X > 400 && (player.X = 400);
	    player.X < 20 && (player.X = 20);
	    player.Y < 20 && (player.pY = 20);
	    player.Y > 460 && (player.Y = 460);
	    player.shot--;
	    player.bomb--;
	    player.ghost--;
	    if(input_key_buffer[90] && player.shot < 0) {
			Shot(player.X,player.Y,input_key_buffer[16]);
	    	player.shot = 10;
	   	}
	   	if(player.bombCount > 0 && input_key_buffer[88] && player.bomb < 0) {
	   		bombAdd(player.X,player.Y);
	   		player.bomb = 350;
	   		player.bombCount--;

	   	}
	} else {
		player.Y += (350-player.Y)/25;
		if(func.distance(player.X,player.Y,200,350) < 5) {
			player.alive = true;
		}

	}
    player.anim+= tempo;
    player.ghost <= 0 ? player.alpha = 1 : player.alpha = 0.4;
    playerDraw(player.X,player.Y,13,player.anim,player.alpha,'#eab500',input_key_buffer[16]);
}
function Shot(x,y,s) { p_bullet.push({X:x,Y:y,speed:0,shift:s}); }
function pl_bulletAll() {
  	p_bullet.forEach(function(value,index,array) {
  		exData = {};
  		exData.kakoY = value.Y;
  		value.speed += 0.7;
  		value.Y -= value.speed;
  		en_btAll.ex(value,exData);
  		ctx.beginPath();
  		ctx.strokeStyle = '#eab500';
  		ctx.lineWidth = 2;
  		ctx.moveTo(exData.X,exData.kakoY +10);
  		ctx.lineTo(exData.X,exData.Y+10);

  		let Attack_range = (15-(5*value.shift)) /2;

  		ctx.moveTo(exData.X -Attack_range,exData.kakoY+5);
  		ctx.lineTo(exData.X -Attack_range,exData.Y+5);
  		ctx.moveTo(exData.X +Attack_range,exData.kakoY+5);
  		ctx.lineTo(exData.X +Attack_range,exData.Y+5);

  		Attack_range = 15-(5*value.shift);

  		ctx.moveTo(exData.X -Attack_range,exData.kakoY);
  		ctx.lineTo(exData.X -Attack_range,exData.Y);
  		ctx.moveTo(exData.X +Attack_range,exData.kakoY);
  		ctx.lineTo(exData.X +Attack_range,exData.Y);
  		ctx.stroke();

  	});
}

function playerDraw(x,y,size,anim,alpha,cl='#eab500',circle = false) {
	let a = 12*size/13+Math.cos(func.rad(anim))*size/13*3;
	func.draw({alpha:alpha,circle:true,X:x,Y:y,start:func.rad(-180),end:func.rad(0),st:true,fil:false,siz:size,wid:size*0.2,st_style:cl});
	func.draw({alpha:alpha,circle:true,X:x,Y:y-size/13*8,start:func.rad(40),end:func.rad(-220),st:true,fil:false,siz:size*1.2,wid:size*0.2,st_style:cl});
	func.draw({alpha:alpha,X:[x-size*0.3,x-size,x-size*0.8],Y:[y-size,y-a,y-size*0.3],st:true,circle:false,wid:size*0.2,st_style:cl});
	func.draw({alpha:alpha,X:[x+size*0.3,x+size,x+size*0.8],Y:[y-size,y-a,y-size*0.3],st:true,circle:false,wid:size*0.2,st_style:cl});
	circle && func.draw({wid:size*0.3,alpha:alpha,X:x,Y:y,siz:3,fil:true,st:true,st_style:cl,fil_style:'#fff'})

}
function bombAdd(x,y) {
	func.addEffect({ch_speed:20,costume:'bomb',dir_accele:5,X:x,Y:y,size:[200,500],width:[5,5],alpha:[0,1],changeCond:[{cond:2,down:300},{cond:2,down:40}]})
}
