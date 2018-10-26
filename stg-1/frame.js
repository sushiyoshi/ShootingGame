function frame (){
	ctx.textAlign = 'start';
	ctx.globalAlpha = 1;
	ctx.fillStyle = '#000000';
	ctx.fillRect(400, 0, canvas.width, canvas.height);
	ctx.fillRect(0,0, canvas.width,20);
	ctx.fillRect(0,460, canvas.width, canvas.height);
	ctx.fillRect(0,0, 20, canvas.height);
	func.draw({circle:false,alpha:0.7,st:true,X:[20,400,400,20,20],Y:[20,20,460,460,20]});

	ctx.font = 'italic 15px Courier','15px sans-serif';
	ctx.fillStyle = theme;
	ctx.fillText('Score',420,30);
	ctx.fillText('Life',420,70);
	ctx.fillText('Bomb',420,110);
	ctx.fillText('Graze',420,150);

	ctx.font = 'italic 15px Courier','15px sans-serif';
	//ctx.font = '15px Wawati sc';
	ctx.fillStyle = '#eab500';
	player.score = player.stageScore[0] + player.stageScore[1] + player.stageScore[2]
	player.score_2 += (player.score - player.score_2) / 4;
	ctx.fillText(keta(Math.ceil(player.score_2),12),420,50);
	ctx.fillText(player.graze,420,170);
	for(let i = 0; i<player.hp; i++) playerDraw(430+i*30,88,7,player.anim,1,'#eab500',false);
	for(let i = 0; i<player.bombCount; i++) bombCountDraw(430+i*30,123,5,player.anim,1,'#eab500',false);
 	title(515,410,themeList[stage]);
	SerifElem.waku_2 += (SerifElem.waku - SerifElem.waku_2)/10;
	func.draw({alpha:0.7,st:true,circle:false,X:[420,630,630,420],Y:[180,180,SerifElem.waku_2,SerifElem.waku_2],close:true});
	if(Serif[SerifElem.num]!== undefined ){
		SerifElem.waku = 320;
		serifAll();
	} else if(boss){
		bossInfo();
		SerifElem.waku = 340;
	} else {
		SerifElem.waku = 180;
	}
	bossTime();
}
let test = [10,465,430];
let test_2 = [45,27,90];
function bossInfo() {
	ctx.textAlign = 'start';
	//siz,ty,cl,X,Y,di,alpha,wid,circle = false;
	let bossCos = ['enemy','star_boss','enemy_5'];
	stage != 2 ? func.DrawingMethod(8,bossCos[stage-1],theme,495,260,bossData.dir,0.7,1) : func.DrawingMethod(4,bossCos[stage-1],theme,495,260,bossData.dir,0.7,1);
	HPbar(460,310,bossData.hp,bossData.maxhp,160,10,true,theme);
	//func.DrawingMethod(8,bossCos[stage-1],theme,495,260,bossData.dir,0.7,1) 

	ctx.font = '11px Courier','11px sans-serif';
	ctx.globalAlpha = 1;
	ctx.fillStyle = '#fff';
	/*
	ctx.fillText(`Name:${bossData.name}`,430,195);
	ctx.fillText(`ID:${bossData.id}`,430,210);
	ctx.fillText(`RiskLevel:${bossData.level}`,430,225);*/
	ctx.textAlign = "end";

	ctx.fillText('Name:',620-bossData['name'].length*7.5,265);
	ctx.fillText('ID:',620-bossData['id'].length*7.5,280);
	ctx.fillText('RiskLevel:',620-bossData['level'].length*7.5,295);
	ctx.fillStyle = '#eab500';
	ctx.fillText(bossData.name,620,265);
	ctx.fillText(bossData.id,620,280);
	ctx.fillText(bossData.level,620,295);

	ctx.textAlign = "start";
	ctx.fillStyle = '#fff';
	ctx.fillText('TIME ATTACK:',430,328);
	ctx.font = '15px Courier','15px sans-serif';
	ctx.fillText('HP:',430,315);
	ctx.fillStyle = '#eab500';
	ctx.fillText('Week Point',530,210);
	ctx.fillText(bossTime(),510,328);
	func.draw({wid:3,circle:false,X:[530,510,500],Y:[210,210,240],st:true,alpha:0.7,st_style:'#eab500'});
}

function title(X,Y,cl) {
	ctx.textAlign = 'start';
	ctx.font = 'oblique 50px Courier','50px sans-serif';
	ctx.strokeStyle = cl;
	ctx.fillStyle = '#000000';
	ctx.lineWidth = 2;
	ctx.globalAlpha = 1;
	ctx.fillText('CAT',X-100,Y-20);
	ctx.strokeText('CAT',X-100,Y-20);
	ctx.fillText('BLASTER',X-100,Y+20);
	ctx.strokeText('BLASTER',X-100,Y+20);
}

function keta(number,k) {
	let l = k - String(number).length;
	let r = "";
	for(let i = 0; i < l; i++) {
		r += "0";
	}
	return r + String(number);
}

function sleep(waitsec) {
	var startMsec = new Date();
	while(new Date() - startMsec < waitMsec);
}
function HPbar(x,y,hp,max,width,height,value,color='#fff') {
	func.draw({X:[x,x+width],Y:[y,y],st:true,wid:height,st_style:'#999999',circle:false});
	func.draw({X:[x,x+hp*width/max],Y:[y,y],st:true,wid:height,st_style:color,circle:false});
	ctx.font = '15px Courier','15px sans-serif';
	ctx.fillStyle = '#fff';
	value && ctx.fillText(bossData.hp,x+width/2.5,y+4);
}
function bossTime() {
	bossData.d2 = new Date();
	return (bossData.d2.getTime() - bossData.d1.getTime())/1000;
}
