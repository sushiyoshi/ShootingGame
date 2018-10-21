function frame (){
	ctx.fillStyle = '#000000';
	ctx.fillRect(400, 0, canvas.width, canvas.height);
	ctx.fillRect(0,0, canvas.width,20);
	ctx.fillRect(0,460, canvas.width, canvas.height);
	ctx.fillRect(0,0, 20, canvas.height);
	func.draw({circle:false,wid:1,st:true,X:[20,400,400,20,20],Y:[20,20,460,460,20]});

	ctx.font = 'italic 15px Courier','15px sans-serif';
	ctx.fillStyle = thema;
	ctx.fillText('Score',420,40);
	ctx.fillText('Life',420,80);
	ctx.fillText('Graze',420,125);

	ctx.font = 'italic 15px Courier','15px sans-serif';
	//ctx.font = '15px HanziPen TC';
	ctx.fillStyle = '#eab500';
	player.score_2 += (player.score - player.score_2) / 4;
	ctx.fillText(keta(Math.ceil(player.score_2),12),420,60);
	ctx.fillText(player.graze,420,145);
	for(let i = 0; i<player.hp; i++) playerDraw(430+i*30,100,8,player.anim,1,'#eab500',false);
	if(!boss) {
 		title(515,410,thema);
	} else{
		bossInfo();
	}
	SerifElem.waku_2 += (SerifElem.waku - SerifElem.waku_2)/10;
	func.draw({st:true,circle:false,X:[420,630,630,420],Y:[180,180,SerifElem.waku_2,SerifElem.waku_2],close:true});
	if(Serif[SerifElem.num]!== undefined ){
		SerifElem.waku = 320;
		serifAll();
	} else if(boss){
		SerifElem.waku = 450;
	} else {
		SerifElem.waku = 180;
	}
	bossTime();
}

function bossInfo() {
	//siz,ty,cl,X,Y,di,alpha,wid,circle = false;
	func.DrawingMethod(6,'enemy',thema,510,260,bossData.dir,0.7,1);
	HPbar(460,340,bossData.hp,bossData.maxhp,150,10,true,thema);
	HPbar(430,348,bossData.level%300,300,200,4,false,'#fff');
	HPbar(430,356,300-bossData.level%300,300,200,4,false,'#fff');
	bossData.level++;
	ctx.font = '15px Courier','15px sans-serif';
	ctx.globalAlpha = 1;
	ctx.fillStyle = '#fff';
	ctx.fillText('HP:',430,345);
	ctx.font = '11px Courier','11px sans-serif';
	ctx.fillText('TIME ATTACK:',430,400);
	ctx.font = '15px Courier','15px sans-serif';
	ctx.fillText(bossTime(),510,400);
	ctx.fillStyle = '#eab500';
	ctx.fillText('Week Point',560,220);
	func.draw({wid:3,circle:false,X:[560,520,510],Y:[220,220,260],st:true,alpha:0.7,st_style:'#eab500'});
}

function title(X,Y,cl) {
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
function bossTime() {
	bossData.d2 = new Date();
	return (bossData.d2.getTime() - bossData.d1.getTime())/1000;
}
