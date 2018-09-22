let canvas = document.getElementById('stg');
const ctx = canvas.getContext('2d');
let bullet = {}; //弾の速度、向き、加速度、色など、全てのデータがまとめて入っている。
let address = {}; //弾をグループ化。弾にまとめて命令をだしたいときに使う。いまのところ合図にしか使っていない。
let effect = {}; //エフェクト
let laser = {}; 
let exData = {};
let player = {X:300,Y:300,spX:0,spY:0,shot:0};
let input_key_buffer = [];
for(let i = 0; i <= 226; i++) input_key_buffer[i] = false;
let p_bullet = [];
let enemy = {};
let touch;
let number = {enemy:0,bullet:0,laser:0,effect:0};
let deleteAll;
let tn = 0;

class Func {
	constructor(array = null,def = null) {
		this.array = array;
		this.def = def;
	}
	rad(di) {
		return di/180*Math.PI;
	}
	ex(object,object_2) {
		for(let k in object) {
 			let copy;
 			typeof object[k] !== 'object' ? copy = object[k] : copy = Object.assign({}, object[k]);
 			copy !== undefined && (object_2[k] = copy);
 		}
	}
	PrptUpdate () {
		exData.speed +=  exData.accele / 100;
	    exData.dir +=  exData.dir_accele /5;
		exData.interval[tn][0]--;
	}
	move(dis,di,object) {
		object.X += Math.cos(this.rad(di))*dis;
		object.Y += Math.sin(this.rad(di))*dis;

		object.X = parseFloat(object['X'].toFixed(3));
		object.Y = parseFloat(object['Y'].toFixed(3));
	}
	distance(x1,y1,x2,y2) {
	 	return Math.sqrt( Math.pow( x2-x1, 2 ) + Math.pow( y2-y1, 2 ) ) 
	}
	add(object,count,rota,st_dir,ls = false,shift = 0) {
		let dt = object;
		dt.X === undefined && (dt.X = exData.X);
		dt.Y === undefined && (dt.Y = exData.Y);
		dt.enId === undefined && (dt.enId = exData.enId);
		st_dir === undefined && (st_dir = 0);
		shift === undefined && (shift = 0);
		if(dt.Addval != null && dt.bulletNumber !== undefined) {
			address[dt.enId + '-' + String(dt.bulletNumber)] = dt.Addval;
			delete dt.Addval;
		}
		let direc = st_dir;
		dt.dir = 0;
		for(let j = 1; j <= count; j++) {
			dt.dir = direc;
			const copy = Object.assign({}, dt);
			this.move(shift,dt.dir,copy);
			ls ? this.laserAdd(copy) : this.bulletAdd(copy);
			direc += rota;
		}
	}
	bulletAdd(cp) {
		number.bullet++;
		bullet[number.bullet] = cp;
	}
	laserAdd(cp) {
		number.laser++;
		laser[number.laser] = cp;
	}
	dis_laser(x,y,x1,y1,x2,y2) {
	 	let a = y1-y2;
	 	let b = x2-x1;
	 	let c = (b*-1*y1)+(a*-1*x1);
	 	return Math.abs(a*x + b*y + c)/Math.sqrt(Math.pow(a,2) + Math.pow(b,2));
	}
	angle(x,y,x2,y2) {
		let r = Math.atan2(y2 - y, x2 - x);
	 	return Math.floor(r * 360 / (2 * Math.PI));
	} 
	collider() {
	  	p_bullet.forEach(function(value) {
	  		this.distance(exData.X,exData.Y,value['X'],value['Y']) < exData.collision && exData.hp--;
	  	},this);
	}
	draw(obj) {
		ctx.beginPath();
		let exD = {
			wid:1,
			fil_style:'#ffffff',
			st_style:'#ffffff',
			st:false,
			fil:false,
			siz:exData.size,
			alpha:1,
			circle:true,
			close:false,
			X:exData.X,
			Y:exData.Y,
			start:0,
			end:Math.PI*2
		}
		this.ex(obj,exD);
		ctx.beginPath();
	 	ctx.lineWidth = exD.wid;
	 	ctx.strokeStyle = exD.st_style;
	 	ctx.fillStyle = exD.fil_style;
	 	ctx.globalAlpha = exD.alpha;
	 	if(exD.circle) {
	 		ctx.arc(exD.X,exD.Y,exD.siz,exD.start,exD.end,false);
	 	} else {
	 		moveTo(exD.X[0],exD.Y[0]);
	 		Object.keys(exD['X']).forEach(function(index) {
 				ctx.lineTo(exD.X[index],exD.Y[index]);
 			});
	 		exD.close && ctx.closePath();
	 	}
	 	exD.st && ctx.stroke();
	 	exD.fil && ctx.fill();
	}
	dr() {
		this.PrptUpdate();
		this.DrawingMethod(exData.size,exData.costume,exData.color,exData.X,exData.Y,exData.dir,exData.alpha,exData.width);
		this.move(exData.speed,exData.dir,exData);
	}
	DrawingMethod (siz,ty,cl,X,Y,di,alpha,wid,circle = false) {
		ctx.globalAlpha = alpha;
	 	switch(ty) {
	 		case 'bullet':
	 		this.draw({wid:siz*1.2,st_style:cl,st:true,fil:true,alpha:alpha});
	 		touch = this.distance(player.X,player.Y,exData.X,exData.Y) < siz*1.4
	 		break;
	 		case 'big_bullet':
	 		this.draw({wid:siz*0.5,st:true});
	 		this.draw({wid:siz*0.8,st_style:cl,st:true,alpha:0.8,siz:siz*0.7});
	 		touch = this.distance(player.X,player.Y,exData.X,exData.Y) < siz*1.4
	 		break;
	 		case 'strange':
	 		this.draw({wid:siz*0.5,st_style:cl,st:true,X:X + Math.cos(di/180*Math.PI)*3,Y:Y + Math.sin(di/180*Math.PI)* 3,siz:siz*2,start:(di-90)/180*Math.PI,end:(di+90)/180*Math.PI});
	 		this.draw({wid:siz*1.2,st:true,fil:true});
	 		touch = this.distance(pX,pY,exData.X,exData.Y) < siz*1.4
	 		break;
	 		case 'laser':
	 		circle && this.draw({fil:true,alpha:alpha,siz:5});
	 		circle && (tn == 1 ? this.draw({st:true,siz:wid,st_style:cl,wid:wid/1.8,alpha:0.5}) : this.draw({st:true,siz:wid,st_style:cl,wid:wid/1.8,alpha:alpha}))
			ctx.beginPath();
	 		ctx.strokeStyle = cl;
	 		ctx.lineWidth = wid;
	 		let obj = {X:exData.X,Y:exData.Y};
	 		this.move(10,exData.dir,obj);
	 		ctx.moveTo(obj.X,obj.Y);
	 		ctx.lineTo(obj.X+ Math.cos(this.rad(di))*1000,obj.Y + Math.sin(this.rad(di))*1000);
	 		ctx.stroke();
	 		ctx.globalAlpha = alpha;
	 		ctx.strokeStyle = '#ffffff';
	 		ctx.lineWidth = wid/2;
	 		ctx.closePath();
	 		ctx.stroke();
	 		touch = this.dis_laser(player.X,player.Y,X,Y,X + Math.cos(this.rad(di))*1000,Y + Math.sin(this.rad(di))*1000) < 5;

	 		case 'enemy':
	 		this.draw({wid:siz*1.5,st_style:cl,st:true,close:true,circle:false,X:[X + Math.cos(this.rad(di))*siz*10,X + Math.cos(this.rad(di-90))*siz*10, X + Math.cos(this.rad(di))*siz*-10, X + Math.cos(this.rad(di-90))*siz*-10],Y:[Y + Math.cos(this.rad(di-90))*siz*10,Y + Math.cos(this.rad(di))*siz*-10,Y+Math.cos(this.rad(di-90))*siz*-10,Y + Math.cos(this.rad(di))*siz*10]});
	 		this.draw({wid:siz*1.5,fil_style:'#000000',siz:siz*3,st:true,fil:true});
			break;

			case 'square':
			this.draw({wid:wid,st_style:cl,st:true,close:true,circle:false,X:[X + Math.cos(this.rad(di))*siz,X + Math.cos(this.rad(di-90))*siz, X + Math.cos(this.rad(di))*siz*-1, X + Math.cos(this.rad(di-90))*siz*-1],Y:[Y + Math.cos(this.rad(di-90))*siz,Y + Math.cos(this.rad(di))*siz*-1,Y+Math.cos(this.rad(di-90))*siz*-1,Y + Math.cos(this.rad(di))*siz]});
			break;
			case 'circle':
			this.draw({wid:wid,st_style:cl,st:true});
			break;

	 	}
	 	if(typeof ty == 'number') {
	 		di+= 90;
	 		const mag = 23 + ty*1.5;
	 		const a = -4*mag + 131;
	 		let x_dif = Math.cos(this.rad(di))* siz*mag/3;
	 		let y_dif = Math.sin(this.rad(di))* siz*mag/3;
	 		this.draw({st_style:cl,wid:siz*2,X:X + x_dif,Y:Y + y_dif,siz:siz*9.5,start:this.rad(di+180-a),end:this.rad(di+180+a),st:true,fil:true,alpha:alpha});
	 		this.draw({st_style:cl,wid:siz*2,X:X - x_dif,Y:Y - y_dif,siz:siz*9.5,start:this.rad(di-a),end:this.rad(di+a),st:true,fil:true,alpha:alpha});
			touch = this.distance(player.X,player.Y,exData.X,exData.Y) < (siz + 3)*1.4;
	 	}
	 	ctx.globalAlpha = 1.0;
	 	ctx.lineWidth = 1;
	}
	changeCondition(num) {
		let object = exData['changeCond'];
		switch (num) {
			case 1:
			return this.distance(object[`x${tn}`], object[`y${tn}`],exData.X,exData.Y) < exData.speed*1.3;
			break;

			case 2:
			object[`down${tn}`]--;
			return 0 >= object[`down${tn}`];
			break;

			case 3:
			return object[`hp${tn}`] > exData.hp;
			break;

			case 4: 
			return Math.abs(object[`x${tn}`]- exData.X) < exData.speed[tn]*1.3 || Math.abs(object[`y${tn}`]- exData.Y) < 5;
			break;

			case 5:
			return address[exData.ad] < 0;
			default:
			return exData.X > canvas.width || exData.X < 0 || exData.Y < 0 || exData.Y > canvas.height;
			break;
		}
	}
	colid(bool,ctx) {
		if(bool) {
	    	//エラーがでる
	    	//const audio = document.getElementById("audio"); audio.play();
	    	//console.log("touch");
	    	ctx.beginPath();
	    	ctx.fillStyle = '#b000a3';
	    	ctx.arc(player.X,player.Y,5,0,Math.PI*2,false);
	    	ctx.fill();
		}
	}
	rndm(min,max) {
		return Math.floor(Math.random() * max) + min;
	}
	addressUpdate() {
		for(let key in address) {
		    address[key]--;
		    (address[key] <= -100) && (delete address[key]);
		}
	}
	AddProcessing(object) {
		object.count === undefined  && (object.count = 10);
		object.rota === undefined && (object.rota = 36);
		object.st_dir === undefined && (object.st_dir = exData.dir);
		object.zikimuke && (object.st_dir = this.angle(exData.X,exData.Y,player.X,player.Y));
		object.rotaRate !== undefined && (object.st_dir += object.rotaRate);
		object.cycle === undefined && (object.cycle = 1);
		object.laser === undefined &&  (object.laser = false);
		if( object.reverse !== undefined) {
			object.reverse *= -1; 
			object.laser ? object['changeCond']['dir_accele0'] = object.reverse : object.dir_accele = object.reverse;
		}
		exData.bulletNumber % object.cycle == 0 && this.add({changeCond:object['changeCond'],chase:object['chase'],deleteMessage:object['deleteMessage'],enId:object['enId'],color:object['color'], speed:object['speed'],accele:object['accele'], dir_accele:object['dir_accele'], interval:object['interval'], size:object['size'], type:object['type'], costume:object['costume'], bulletNumber:exData.bulletNumber, Addval:object['Addval'],width:object['width'],X:object['X'],Y:object['Y']}, object['count'], object['rota'], object['st_dir'],object['laser'],object['shift']);
	}
	delete(array) {}
	constant() {}
} 
	
class drawAll extends Func {	
	constructor(array,def) {
	    super(array,def);
	}
	loop() {
		let deleteList = [];
		Object.keys(this.array).forEach(function (value,index,array) {
			const copy = Object.assign({}, this.def);
			this.processing(value,index,array,copy,deleteList);
		},this);
		this.organize(deleteList);
	}
	processing(value,index,array,defau,deletelist) {
		exData = defau;
		super.ex(this.array[value],exData);
		tn = exData.typeNumber;
       		exData['changeCond'][`chase${tn}`] && (exData.dir = this.angle(exData.X,exData.Y,player.X,player.Y));
       		typeof this.special !== 'undefined' && this.special();
       		this.dr();
       		if(exData.interval[tn][0] == 0) {
       			exData.interval[tn][0] = exData.interval[tn][1];
       			console.log(value);
       			typeof this.constant !== 'undefined' && this.constant();
       		}
		if(super.changeCondition(exData['changeCond'][`cond${tn}`])) {
			exData['changeCond'][`color${tn}`] !== undefined && (exData.color = exData['changeCond'][`color${tn}`]);
			exData['changeCond'][`speed${tn}`] !== undefined && (exData.speed = exData['changeCond'][`speed${tn}`]);
			exData['changeCond'][`accele${tn}`] !== undefined && (exData.accele = exData['changeCond'][`accele${tn}`]);
			exData['changeCond'][`dir${tn}`] !== undefined && (exData.dir = exData['changeCond'][`dir${tn}`]);
			exData['changeCond'][`dir_accele${tn}`] !== undefined && (exData.dir_accele = exData['changeCond'][`dir_accele${tn}`]);
			exData['changeCond'][`delAll${tn}`] && (deleteAll = exData.enId);
			exData['changeCond'][`cond${tn + 1}`] === undefined ? deletelist.push(value) : tn++; 
		}
		exData.typeNumber = tn;
		this.delete(deletelist,value);
		this.array[value] = exData;
	}
	organize(arr) {
		arr.forEach(function(value) {
			delete this.array[value];
		},this);
	}
}

function playerAll() {
 	window.onkeydown = function (e){
 		input_key_buffer[e.keyCode] = true;
 	};
 	window.onkeyup = function (e){
 		input_key_buffer[e.keyCode] = false;
 	};
 	player.spX = (2-input_key_buffer[16])*(input_key_buffer[39] - input_key_buffer[37]);
 	player.spY = (2-input_key_buffer[16])*(input_key_buffer[40] - input_key_buffer[38]);
 	player.X += player.spX;
	player.Y += player.spY;
	player.X > canvas.width && (player.X = canvas.width);
	player.X < 0 && (player.X = 0);
	player.Y < 0 && (player.pY = 0);
	player.Y > canvas.height && (player.Y = canvas.height);
	player.shot--;
	if(input_key_buffer[90] && player.shot < 0) {
		Shot(player.X,player.Y);
	player.shot = 10;
	}
	ctx.beginPath();
	ctx.strokeStyle = '#ffffff';
	ctx.lineWidth = 5;
	ctx.arc(player.X,player.Y,10,0,Math.PI*2,false);
	ctx.stroke();
}
function addEffect(object) {
	number.effect++;
	effect[number.effect] = object;
}
function pl_bulletAll() {
  	p_bullet.forEach(function(value,index,array) {
  		exData = {};
  		exData.kakoY = value.Y;
  		value.speed += 0.7;
  		value.Y -= value.speed;
  		en_btAll.ex(value,exData);
  		ctx.beginPath();
  		ctx.strokeStyle = '#ffffff';
  		ctx.lineWidth = 2;
  		ctx.moveTo(exData.X,exData.kakoY +10);
  		ctx.lineTo(exData.X,exData.Y+10);

  		let Attack_range = (15-(5*input_key_buffer[16])) /2;

  		ctx.moveTo(exData.X -Attack_range,exData.kakoY+5);
  		ctx.lineTo(exData.X -Attack_range,exData.Y+5);
  		ctx.moveTo(exData.X +Attack_range,exData.kakoY+5);
  		ctx.lineTo(exData.X +Attack_range,exData.Y+5);

  		Attack_range = 15-(5*input_key_buffer[16]);

  		ctx.moveTo(exData.X -Attack_range,exData.kakoY);
  		ctx.lineTo(exData.X -Attack_range,exData.Y);
  		ctx.moveTo(exData.X +Attack_range,exData.kakoY);
  		ctx.lineTo(exData.X +Attack_range,exData.Y);
  		ctx.stroke();

  	});
}
function sleepByPromise(sec) {
	return new Promise(resolve => setTimeout(resolve, sec*1000));
}
async function add_enemy(object,sec = 0){
	await sleepByPromise(sec);
	number.enemy++;
	if(object.etype === undefined) object.etype = 'ad';
	object.enId = object.etype + '-' + number.enemy;
	enemy[number.enemy] = object; 
} 
function Shot(x,y) { p_bullet.push({X:x,Y:y,speed:0}); }

class en_bulletAll extends drawAll {
	special() {
		switch(exData.effect[0]) {
	  		case 1:
	  		super.DrawingMethod(exData.size * (15-exData.effect[1])/5, exData.costume, exData.color, exData.X, exData.Y, exData.dir,exData.effect[1]/10);
	  		exData.effect[1]+= 0.1;
	  		if(exData.effect[1]>10) exData.effect[0] = 0;
	  		break;
	  	}
	}
	dr() {
		if(exData.effect[0] == 0) {
			super.DrawingMethod(exData.size,exData.costume,exData.color,exData.X,exData.Y,exData.dir,exData.alpha,exData.width);
			super.PrptUpdate();
			super.move(exData.speed,exData.dir,exData);
		}
	}
	constant () {
		switch(exData.type[tn]) {
			case 1:
			this.add({deleteMessage:true,speed:0,type:[1,0],color:'#b000a3',ad:exData.enId + '-' + String(exData.bulletNumber),dir_accele:0.1,costume:0,size:1,effect:[1,0],changeCond:{cond0:5,accele0:0.5,color0:'#516c7f',cond1:0}},1,0,this.rndm(0,360));
			break;
		}
	}
	delete(array,index) {
		if(exData.deleteMessage && deleteAll == exData.enId) {array.push(index);}
	}
}

class enemyAll extends drawAll {
	special() {
		switch(exData.costume) {
			default:
			exData.speed == 0 ? exData.edir +=  3 : exData.edir += exData.speed;
			break;
		}
		super.collider();
	}
	dr() {
		super.PrptUpdate();
		super.DrawingMethod(exData.size,exData.costume,exData.color,exData.X,exData.Y,exData.edir,exData.alpha,exData.width);
		super.move(exData.speed,exData.dir,exData);
	}
	delete(array,index) {
		if(exData.hp < 0) {
			deleteAll = exData.enId;
			array.push(index);
			addEffect({X:exData.X,Y:exData.Y,size:[1,exData.size*10],width:[exData.size*100,0],width_2:[0,0],color:exData.color,type:1,dir:exData.edir});
       			addEffect({X:exData.X,Y:exData.Y,size:[1,exData.size*20],width:[exData.size*200,0],width_2:[0,0],color:exData.color,type:1,dir:0});
		}
	}
	constant() {
		switch(exData.type[tn]) {
			case 1:
			exData.shooter[tn].forEach(function(value) {
				this.AddProcessing(value);
			},this);
			break;
		}
		exData.bulletNumber++;
	}
}

class laserAll extends drawAll {
	special() {
		tn == 0 && (exData.alpha = 0.4);
		if(tn == 1){this.colid(touch,ctx); exData.alpha = 1;}
		tn == 2 && (exData.alpha -= exData.alpha/5);
	}
	PrptUpdate() {
		exData.width_2[0] = exData.width[tn] - exData.width_2[1];
		exData.width_2[1] += exData.width_2[0]/5;
		exData.dir += exData.dir_accele/5;
		//exData.dir_accele += exData.dir_accele_2[tn];
	}
	dr() {
		this.PrptUpdate();
		this.DrawingMethod(exData.size,exData.costume,exData.color,exData.X,exData.Y,exData.dir,exData.alpha,exData.width_2[1],exData.circle);
		this.move(exData.speed,exData.ldir,exData);
	}
	delete(array,index) {
		if(exData.deleteMessage && deleteAll == exData.enId) {exData.typeNumber = 2; exData.alpha = 1;}
	}
}

class effectAll extends drawAll {
	PrptUpdate() {
		exData.width_2[0] = exData.width[tn] - exData.width_2[1];
		exData.width_2[1] += exData.width_2[0]/5;
		exData.size_2[0] = exData.size[tn] - exData.size_2[1];
		exData.size_2[1] += exData.size_2[0]/5;
	}
	dr() {
		this.PrptUpdate();
		this.DrawingMethod(exData.size_2[1],exData.costume,exData.color,exData.X,exData.Y,exData.dir,exData.alpha,exData.width_2[1]);
		this.move(exData.speed,exData.dir,exData);
	}
}

var en_btAll = new en_bulletAll(bullet,{
	dir:0, //向き
	speed:1, //速度
	accele:0, //加速度
	dir_accele:0, //向きの変化率
	type:[0], //挙動の種類
	color:'#ffffff', //色
	size:3, //大きさ
	costume:'bullet', //見た目
	interval:[[-1,0],[-1,0],[-1,0],[-1,0],[-1,0]], //typeの値を変えるタイミング
	typeNumber:0,
	changeCond:{cond0:0},
	effect:[0,0],
	deleteMessage:false
});
var enAll = new enemyAll(enemy,{
	dir:90, //向き
	speed:1, //速度
	accele:0, //加速度
	dir_accele:0, //向きの変化率
	type:[0], //挙動の種類
	color:'#ffffff', //色
	size:2, //大きさ
	edir:0,//見た目(向き)
	interval:[[-1,0],[-1,0],[-1,0],[-1,0]], //typeの値を変えるタイミング
	bulletNumber:0,
	typeNumber:0,
	hp:20,
	costume:'enemy',
	collision:20,
	changeCond:{cond0:0}
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
	color:'#ffffff',
	costume:'laser',
	typeNumber:0,
	circle:true,
	changeCond:{cond0:2,down0:100,cond1:2,down1:100,cond2:2,down2:10},
	deleteMessage:false
})
var effAll = new effectAll(effect,{
	dir:0,
	speed:0,
	size:[0],
	size_2:[0,0],
	alpha:1,
	alpha_2:[0,0],
	width:[5],
	width_2:[0,0],
	interval:[[-1,0],[-1,0],[-1,0],[-1,0],[-1,0],[-1,0]],
	color:'#ffffff',
	costume:'square',
	type:0,
	typeNumber:0,
	changeCond:{cond0:2,down0:1,cond1:2,down1:50}
})
//object,count,rota,st_dir,ls,shift
var func = new Func(); 
var all = function() {
	if(canvas.getContext) {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.beginPath();
		ctx.fillStyle = '#000000';
		ctx.fillRect(0,0,canvas.width,canvas.height);
		playerAll();
		pl_bulletAll();
		enAll.loop();
		en_btAll.loop();
		lsrAll.loop();
		effAll.loop();
		func.addressUpdate();
		deleteAll = "";
	}
};
game();
(function animloop(){
all();
window.requestAnimationFrame(animloop);
}());

function game() {
	add_enemy({X:300,Y:0,color:'#b000a3',dir:func.angle(300,0,400,200),shooter:[[{}],[{deleteMessage:true,color:'#b000a3',laser:true,count:5,rota:72,shift:50,changeCond:{cond0:2,down0:160,dir_accele0:1,cond1:2,down1:100,dir_accele1:0,cond2:2,down2:10}}]],speed:2,accele:0.1,changeCond:{cond0:1,x0:400,y0:200,dir0:90,speed0:0,accele0:0,cond1:2,speed1:1,accele1:0.4,down1:200,cond2:4,y2:500},type:[0,1,0],interval:[[0,0],[10,200],[0,0]],hp:20},1);	
	add_enemy({X:300,Y:0,color:'#b000a3',dir:func.angle(300,0,200,200),shooter:[[{}],[{deleteMessage:true,color:'#b000a3',laser:true,count:5,rota:72,shift:50,changeCond:{cond0:2,down0:160,dir_accele0:1,cond1:2,down1:100,dir_accele1:0,cond2:2,down2:10}}]],speed:2,accele:0.1,changeCond:{cond0:1,x0:200,y0:200,dir0:90,speed0:0,accele0:0,cond1:2,speed1:1,accele1:0.4,down1:200,cond2:4,y2:500},type:[0,1,0],interval:[[0,0],[10,200],[0,0]],hp:20},1);	
	add_enemy({X:300,Y:0,color:'#b000a3',size:5,dir:func.angle(300,0,300,100),shooter:[[{}],[{deleteMessage:true,color:'#b000a3',laser:true,shift:50}]],speed:2,accele:0.1,changeCond:{cond0:1,x0:300,y0:100,dir0:90,speed0:0,accele0:0,cond1:2,speed1:1,accele1:0.4,down1:200,cond2:4,y2:500},type:[0,1,0],interval:[[0,0],[10,200],[0,0]],hp:20},3);		

	for(let i = 1; i <= 3; i++) {
		add_enemy({X:150,Y:0,shooter:[[{count:5,rota:30,st_dir:270,speed:1,accele:1,dir_accele:1}]],speed:2,type:[1],interval:[[100,100]],hp:5},i);
		add_enemy({X:450,Y:0,shooter:[[{count:5,rota:30,st_dir:135,speed:1,accele:1,dir_accele:1}]],speed:2,type:[1],interval:[[100,100]],hp:5},i);
	}
	for(let i = 0; i <= 4; i++) {
		add_enemy({X:350+(i%2*50),Y:0,shooter:[[{count:1,st_dir:180,speed:1,laser:true,changeCond:{cond0:2,down0:1,cond1:2,down1:460,cond2:2,down2:10},shift:30,deleteMessage:true}],[{}],[{count:3,rota:120,st_dir:func.rndm(0,360),rotaRate:50,speed:0,accele:0.2,color:'#b000a3'}],[{}]],speed:1,accele:0,type:[1,0,1,0],interval:[[10,5000],[0,0],[80,80],[0,0]],changeCond:{cond0:2,down0:25,cond1:3,hp1:19,speed1:0.5,accele1:0.15,delAll1:true,color1:'#b000a3',chase2:true,cond2:2,down2:500,speed2:2,cond3:0},hp:20},i*4+8);
		add_enemy({X:250-(i%2*50),Y:0,shooter:[[{count:1,st_dir:0,speed:1,laser:true,changeCond:{cond0:2,down0:1,cond1:2,down1:460,cond2:2,down2:10},shift:30,deleteMessage:true}],[{}],[{count:3,rota:120,st_dir:func.rndm(0,360),rotaRate:50,speed:0,accele:0.2,color:'#b000a3'}],[{}]],speed:1,accele:0,type:[1,0,1,0],interval:[[10,5000],[0,0],[80,80],[0,0]],changeCond:{cond0:2,down0:25,cond1:3,hp1:19,speed1:0.5,accele1:0.15,delAll1:true,color1:'#b000a3',chase2:true,cond2:2,down2:500,speed2:2,cond3:0},hp:20},i*4+10);
	}
	for(let i = 0; i<= 9; i++) {
		add_enemy({X:0,Y:100,dir:0,shooter:[[{count:5,rota:10,speed:1,accele:0.1,zikimuke:true,rotaRate:-20}]],speed:2,type:[1],interval:[[100,100]],hp:5},i*2+8);
	}
	add_enemy({X:300,Y:0,color:'#b000a3',
		shooter:[[{}],
		[{reverse:1.5,dir_accele:0,color:'#b000a3',laser:true,shift:50,rotaRate:40,cycle:3,deleteMessage:true,changeCond:{cond0:2,down0:100,dir_accele0:1,cond1:2,down1:100,dir_accele1:0,cond2:2,down2:10}},
		{rotaRate:10,speed:1,accele:2,st_dir:func.rndm(0,360)},
		{rotaRate:-10,speed:3,accele:-4,type:[1,0],st_dir:func.rndm(0,360),changeCond:{cond0:2,down0:30,speed0:1,accele0:0.2,cond1:0}}],
		[{}],
		[{interval:[[20,20]],speed:2,accele:0.5,dir_accele:1,type:[1],color:'#b000a3',size:30,costume:'big_bullet',Addval:300,reverse:2,deleteMessage:true}],
		[{}]],
	speed:2,accele:0.1,changeCond:{cond0:1,x0:300,y0:100,speed0:0,accele0:0,cond1:3,hp1:140,delAll1:true,cond2:2,down2:50,cond3:3,hp3:0,delAll3:true},type:[0,1,0,1,0],interval:[[0,0],[35,35],[0,0],[1,250],[0,0]],hp:150,size:10},35);
}
