function stageConst() {
	stage++;
	serifData(stage);
	boss = 0;
	thema = themaList[stage-1];
	enAll.thema(thema);
	en_btAll.thema(thema);
	lsrAll.thema(thema);
	effAll.thema(thema);
	game(stage);
}

function StageEnd() {
	player.hp <= 0 && (player.hp = 0);
	player.score += player.hp*player.graze*5000;
	player.graze = 0;
	player.hp = 5;
	boss = false;
}
var en_btAll = new en_bulletAll(bullet,{
	dir:0, //向き
	dir_2:0,
	speed:1, //速度
	accele:0, //加速度
	dir_accele:0, //向きの変化率
	type:[0], //挙動の種類
	color:thema, //色
	size:3, //大きさ
	costume:'bullet', //見た目
	interval:[[-1,0],[-1,0],[-1,0],[-1,0],[-1,0]], //typeの値を変えるタイミング
	typeNumber:0,
	changeCond:[{cond:0}],
	effect:[0,0],
	deleteMessage:false,
	graze:true,
	deru:true
});
var enAll = new enemyAll(enemy,{
	dir:90, //向き
	speed:1, //速度
	accele:0, //加速度
	dir_accele:0, //向きの変化率
	type:[0], //挙動の種類
	color:thema, //色
	size:2, //大きさ
	edir:0,//見た目(向き)
	interval:[[-1,0],[-1,0],[-1,0],[-1,0]], //typeの値を変えるタイミング
	bulletNumber:0,
	typeNumber:0,
	hp:20,
	costume:'enemy',
	collision:20,
	score:1000,
	changeCond:[{cond:0}],
	boss:false,
	audio:true
})
var lsrAll = new laserAll(laser,{
	dir:0,
	speed:0,
	ldir:90,
	interval:[[-1,0],[-1,0],[-1,0],[-1,0],[-1,0],[-1,0]],
	dir_accele:0,
	//dir_accele_2:[0,0,0],
	width:[8,15,8],
	width_2:[0,0],
	alpha:1,
	color:thema,
	costume:'laser',
	typeNumber:0,
	circle:true,
	changeCond:[{cond:2,down:100},{cond:2,down:100},{cond:2,down:10}],
	deleteMessage:false,
	graze:true,
	shot:true
})
var effAll = new effectAll(effect,{
	dir:0,
	speed:0,
	size:[5],
	size_2:[0,0],
	alpha:[1,1],
	alpha_2:[0,0],
	width:[1],
	width_2:[0,0],
	interval:[[-1,0],[-1,0],[-1,0],[-1,0],[-1,0],[-1,0]],
	color:thema,
	costume:'square',
	type:0,
	typeNumber:0,
	changeCond:[{cond:2,down:1},{cond:2,down:50}]
})
stageConst();
var all = function() {
	input_key_buffer[88] && sleep(10000);
	if(canvas.getContext) {
		//ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.beginPath();
		ctx.globalAlpha = 1;
		ctx.fillStyle = '#000000';
		ctx.fillRect(0,0,canvas.width,canvas.height);
		enAll.loop();
		en_btAll.loop();
		lsrAll.loop();
		playerAll();
		pl_bulletAll();
		effAll.loop();
		func.addressUpdate();
		deleteAll = "";
		frame();
	}
};
(function animloop(){
all();
window.requestAnimationFrame(animloop);
}());

async function del(sec = 0) {
	await sleepByPromise(sec);
	number['enemydel'] = number['enemy'];
	number['bulletdel'] = number['bullet'];
	number['laserdel'] = number['laser'];
}
