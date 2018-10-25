async function stageConst(sec) {
	await sleepByPromise(sec);
	stage++;
	serifData(stage);
	boss = 0;
	theme = themeList[stage-1];
	enAll.theme(theme);
	en_btAll.theme(theme);
	lsrAll.theme(theme);
	effAll.theme(theme);
	//func.addEffect({X:200,Y:150,speed:2,accele:-4,dir:270,alpha:[1,1,1],costume:'text',color:'#fff',text:'No Bonus...',algin:"center",font:'30px Courier',changeCond:[{cond:4,y:100,speed:0,accele:0},{cond:2,down:600,speed:1,accele:4},{cond:0}]});
	//func.addEffect({color:'#fff',X:0,Y:200,speed:8,dir:0,costume:'text',text:`stage${stage}`,font:'50px Courier',changeCond:[{cond:4,x:120,speed:0.5},{cond:4,x:180,speed:8},{cond:0}] });
	func.addEffect({dir_accele:-5,dir_accele_2:1,interval:[[50,0],[50,-2],[1,0]],algin:"center",color:'#fff',X:160,Y:200,tdir:0,costume:'text',bake:1,text:`STAGE${stage}`,font:'50px Courier',ch_speed:15,alpha:[1,1,0],changeCond:[{cond:2,down:30,dir_accele:0,dir_accele_2:0},{cond:2,down:100},{cond:2,down:100}] });
	func.addEffect({interval:[[50,0],[50,0],[50,-2],[1,0]],algin:"center",X:320,Y:180,tdir:0,costume:'text',bake:1,text:zone[stage-1],font:'25px Courier',ch_speed:15,alpha:[0,1,1,0],changeCond:[{cond:2,down:30,dir_accele:5,dir_accele_2:-1},{cond:2,down:30,dir_accele:0,dir_accele_2:0},{cond:2,down:70},{cond:2,down:100}] });
	game(stage,3);
}

function StageEnd() {
	del();
	player.hp <= 0 && (player.hp = 0);
	let record = bossData.TargetTime < bossTime() ? bossData.TargetTime : bossTime();
	let bonus = player.hp*(player.graze+Math.floor(bossData.TargetTime-record)*5)*10000;
	func.addEffect({X:200,Y:150,dir:270,alpha:[0,1,1,0],costume:'text',color:'#fff',text:`Interval score:${player['stageScore'][stage-1]}`,algin:"center",font:'25px Courier',color:'#eab500',changeCond:[{cond:2,down:1,speed:2,accele:-4},{cond:4,y:100,speed:0,accele:0},{cond:2,down:350,speed:1,accele:4},{cond:0}]});
	func.addEffect({X:200,Y:175,dir:270,alpha:[0,1,1,0],costume:'text',text:player.hp > 0 ? `Boss Breaking Bonus +${bonus}` : 'No Bonus...',algin:"center",font:'22px Courier',changeCond:[{cond:2,down:20,speed:2,accele:-4},{cond:4,y:125,speed:0,accele:0},{cond:2,down:330,speed:1,accele:4},{cond:0}]});
	func.addEffect({X:200,Y:200,dir:270,alpha:[0,1,1,0],costume:'text',color:'#fff',text:`graze:${player.graze}`,algin:"center",font:'20px Courier',changeCond:[{cond:2,down:40,speed:2,accele:-4},{cond:4,y:150,speed:0,accele:0},{cond:2,down:310,speed:1,accele:4},{cond:0}]});
	func.addEffect({X:200,Y:225,dir:270,alpha:[0,1,1,0],costume:'text',color:'#fff',text:`BossBreakingTime:${record}`,algin:"center",font:'20px Courier',changeCond:[{cond:2,down:40,speed:2,accele:-4},{cond:4,y:175,speed:0,accele:0},{cond:2,down:310,speed:1,accele:4},{cond:0}]});
	player.score += bonus;
	player.graze = 0;
	player.hp = 5;
	boss = false;
	stageConst(7);
}
var en_btAll = new en_bulletAll(bullet,{
	dir:0, //向き
	dir_2:0,
	speed:1, //速度
	accele:0, //加速度
	dir_accele:0, //向きの変化率
	type:[0], //挙動の種類
	color:theme, //色
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
	color:theme, //色
	size:2, //大きさ
	edir:0,//見た目(向き)
	interval:[[-1,0],[-1,0],[-1,0],[-1,0]], //typeの値を変えるタイミング
	bulletNumber:0,
	typeNumber:0,
	hp:20,
	costume:'enemy',
	collision:20,
	score:10000,
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
	color:theme,
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
	spped:0,
	accele:0,
	dir_accele:0,
	dir_accele_2:0,
	speed:0,
	size:[5],
	size_2:[0,0],
	alpha:[1,1],
	alpha_2:[0,0],
	width:[1],
	width_2:[0,0],
	interval:[[-1,0],[-1,0],[-1,0],[-1,0],[-1,0],[-1,0]],
	color:theme,
	costume:'square',
	type:0,
	typeNumber:0,
	ch_speed:6,
	tdir:0,
	algin:'start',
	changeCond:[{cond:2,down:1},{cond:2,down:50}]
})
stageConst();
var all = function() {
	input_key_buffer[79] && input_key_buffer[80] && input_key_buffer[83] && input_key_buffer[84] && sleep(10000);
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
const isCrossLines = (a, b, c, d) => {
    // a,b,c,dそれぞれはx,yを持つObject
    // a,bが線分ABの端点
    // c,dが線分CDの端点
    let stack = [
        (c.x - d.x) * (a.y - c.y) + (c.y - d.y) * (c.x - a.x),
        (c.x - d.x) * (b.y - c.y) + (c.y - d.y) * (c.x - b.x),
        (a.x - b.x) * (c.y - a.y) + (a.y - b.y) * (a.x - c.x),
        (a.x - b.x) * (d.y - a.y) + (a.y - b.y) * (a.x - d.x)
    ];

    return stack[0] * stack[1] < 0 && stack[2] * stack[3] < 0;
};
