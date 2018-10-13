let canvas = document.getElementById('stg');
const ctx = canvas.getContext('2d');
let bullet = {}; //弾の速度、向き、加速度、色など、全てのデータがまとめて入っている。
let address = {}; //弾をグループ化。弾にまとめて命令をだしたいときに使う。いまのところ合図にしか使っていない。
let effect = {}; //エフェクト
let laser = {}; 
let exData = {};
let player = {X:200,Y:400,spX:0,spY:0,shot:0,anim:0,alive:true,ghost:0,hp:5,score:0,score_2:0,graze:0};
let audio = {};
let input_key_buffer = [];
for(let i = 0; i <= 226; i++) input_key_buffer[i] = false;
let p_bullet = [];
let enemy = {};
let touchLs;
let touchBul;
let number = {enemy:0,bullet:0,laser:0,effect:0};
let deleteAll;
let tn = 0;
let thema;
let bossData = {};
let stage =0;
let themaList = ["#b000a3","#00af00","#39A0DA"];
let SerifElem = {num:0,length:1,r:"",max:14,bake:0,waku:320,waku_2:180}
let Serif = [];
let SerifResult = [];
let audioElem = {
	stage1:new Audio('akka.mp3'),
	bgm:new Audio('sumia.mp3'),
	enemy_crash:new Audio('magic3.mp3'),
	enemy_shot:new Audio('damage6.mp3'),
	crash:new Audio('attack1.mp3'),
	shot:new Audio('hitting1.mp3'),
	res:new Audio("tr.mp3"),
	noise:new Audio("trx01.mp3"),
	noise2:new Audio("noise03.mp3"),
	warning:new Audio("warning.mp3")
}
let boss = 0;
let tempo = 7;
let bk;
audioElem['crash'].volume = 0.6;
audioElem['bgm'].volume = 0.6;
//audioElem['res'].volume = 1.0;
console.log(rndm(0,360))

//let serif = [["Detect biological","Data analysis in ","Data Loading..."],["reaction","progress ...",""]];
class Func {
	constructor(array = null,def = null) {
		this.array = array;
		this.def = def;
	}
	thema (color) {
		this.def['color'] = color
	}
	rad(di) {
		return di/180*Math.PI;
	}
	ex(object,object_2) {
		for(let k in object) {
 			let copy;
 			typeof object[k] !== 'object' ? copy = object[k] : copy = JSON.parse(JSON.stringify(object[k]));
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
	 	return Math.sqrt(Math.pow(x2-x1,2) + Math.pow(y2-y1,2) ) 
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
	thema(thema) {
		this.def.color = thema;
	}
	bulletAdd(cp) {
		number.bullet++;
		bullet[number.bullet] = cp;
	}
	laserAdd(cp) {
		number.laser++;
		laser[number.laser] = cp;
	}
	addEffect(object) {
		number.effect++;
		effect[number.effect] = object;
	}
	dis_laser(x, y, x1, y1, x2, y2) {
		let a = x2 - x1;
		let b = y2 - y1;
		let a2 = a * a;
		let b2 = b * b;
		let r2 = a2 + b2;
		let tt = -(a*(x1-x)+b*(y1-y));
		if(tt < 0) return (x1-x)*(x1-x)+(y1-y)*(y1-y);
		if(tt > r2) return (x2-x)*(x2-x)+(y2-y)*(y2-y);
		let f1 = a*(y1-y)-b*(x1-x);
		return (f1*f1)/r2;
	}
	angle(x,y,x2,y2) {
		let r = Math.atan2(y2 - y, x2 - x);
	 	return Math.floor(r * 360 / (2 * Math.PI));
	} 
	collider() {
	  	p_bullet.forEach(function(value) {
	  		if(this.distance(exData.X,exData.Y,value['X'],value['Y']) < exData.collision){exData.hp--; player.score+=10}
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
	 		touchBul = this.distance(player.X,player.Y,X,Y) < siz*1.3;
	 		this.graze(this.distance(player.X,player.Y,X,Y) > siz*1.3 && this.distance(player.X,player.Y,X,Y) < siz*8);
	 		break;
	 		case 'big_bullet':
	 		this.draw({wid:siz*0.5,st:true});
	 		this.draw({wid:siz*0.8,st_style:cl,st:true,alpha:0.8,siz:siz*0.7});
	 		touchBul = this.distance(player.X,player.Y,exData.X,exData.Y) < siz;
	 		this.graze(this.distance(player.X,player.Y,X,Y) > siz && this.distance(player.X,player.Y,X,Y) < siz*5.5);
	 		break;
	 		case 'strange':
	 		this.draw({wid:siz*0.5,st_style:cl,st:true,X:X + Math.cos(di/180*Math.PI)*3,Y:Y + Math.sin(di/180*Math.PI)* 3,siz:siz*2,start:(di-90)/180*Math.PI,end:(di+90)/180*Math.PI});
	 		this.draw({wid:siz*1.2,st:true,fil:true});
	 		touchBul = this.distance(pX,pY,exData.X,exData.Y) < siz*1.4;
	 		this.graze(this.distance(player.X,player.Y,X,Y) > siz*1.4 && this.distance(player.X,player.Y,X,Y) < siz*3.5);
	 		break;
	 		case 'laser':
	 		touchLs = this.dis_laser(player.X,player.Y,X,Y,X + Math.cos(this.rad(di))*400,Y + Math.sin(this.rad(di))*400) < wid*1.5;
	 		tn == 1 && this.graze(this.dis_laser(player.X,player.Y,X,Y,X + Math.cos(this.rad(di))*400,Y + Math.sin(this.rad(di))*400) < wid*1.5 && this.dis_laser(player.X,player.Y,X,Y,X + Math.cos(this.rad(di))*400,Y + Math.sin(this.rad(di))*400) < wid*8.5,false);
	 		circle && this.draw({fil:true,alpha:alpha,siz:5});
	 		circle && (tn == 1 ? this.draw({st:true,siz:wid,st_style:cl,wid:wid/1.8,alpha:0.5}) : this.draw({st:true,siz:wid,st_style:cl,wid:wid/1.8,alpha:alpha}))
			ctx.beginPath();
	 		touchBul ? ctx.strokeStyle =  '#ff0000' : ctx.strokeStyle = cl;
	 		ctx.lineWidth = wid;
	 		let obj = {X:exData.X,Y:exData.Y};
	 		this.move(10,exData.dir,obj);
	 		ctx.moveTo(obj.X,obj.Y);
	 		ctx.lineTo(obj.X+ Math.cos(this.rad(di))*400,obj.Y + Math.sin(this.rad(di))*400);
	 		ctx.stroke();
	 		ctx.globalAlpha = alpha;
	 		ctx.strokeStyle = '#ffffff';
	 		ctx.lineWidth = wid/2;
	 		ctx.closePath();
	 		ctx.stroke();
	 		break;
	 		case 'enemy':
	 		this.draw({alpha:alpha,wid:siz*1.5,st_style:cl,st:true,close:true,circle:false,X:[X + Math.cos(this.rad(di))*siz*10,X + Math.cos(this.rad(di-90))*siz*10, X + Math.cos(this.rad(di))*siz*-10, X + Math.cos(this.rad(di-90))*siz*-10],Y:[Y + Math.cos(this.rad(di-90))*siz*10,Y + Math.cos(this.rad(di))*siz*-10,Y+Math.cos(this.rad(di-90))*siz*-10,Y + Math.cos(this.rad(di))*siz*10]});
	 		this.draw({alpha:alpha,wid:siz*1.5,fil_style:'#000000',siz:siz*3,st:true,fil:true,X:X,Y:Y});
			break;
			case 'star':
			this.draw({alpha:alpha,wid:siz*1.5,st_style:cl,st:true,close:true,circle:false,X:[X + Math.cos(this.rad(di))*siz*10,X + Math.cos(this.rad(di-90))*siz*10, X + Math.cos(this.rad(di))*siz*-10, X + Math.cos(this.rad(di-90))*siz*-10],Y:[Y + Math.cos(this.rad(di-90))*siz*10,Y + Math.cos(this.rad(di))*siz*-10,Y+Math.cos(this.rad(di-90))*siz*-10,Y + Math.cos(this.rad(di))*siz*10]});

			break;

			case 'square':
			this.draw({wid:wid,st_style:cl,siz:siz,st:true,close:true,circle:false,X:[X + Math.cos(this.rad(di))*siz,X + Math.cos(this.rad(di-90))*siz, X + Math.cos(this.rad(di))*siz*-1, X + Math.cos(this.rad(di-90))*siz*-1],Y:[Y + Math.cos(this.rad(di-90))*siz,Y + Math.cos(this.rad(di))*siz*-1,Y+Math.cos(this.rad(di-90))*siz*-1,Y + Math.cos(this.rad(di))*siz]});
			break;

			case 'circle':
			this.draw({wid:wid,st_style:cl,st:true,siz:siz});
			break;

			case 'warning':
			if(tn == 0) {
				ctx.font = 'italic 65px Courier','65px sans-serif';
				ctx.fillStyle = '#000';
				//ctx.strokeStyle = '#fff';
				ctx.strokeStyle = '#f00';
				ctx.lineWidth = 2.5;
				ctx.globalAlpha = alpha;
				ctx.fillText('WARNING',X-5,Y+20);
				ctx.strokeText('WARNING',X-5,Y+20);
				playerDraw(50,Y,13,45,1-alpha,'#f00',false);
				playerDraw(370,Y,13,45,1-alpha,'#f00',false);
			}
			this.draw({circle:false,X:[20,400],Y:[Y+siz,Y+siz],st_style:'#f00',st:true});
			this.draw({circle:false,X:[20,400],Y:[Y+siz*1.3,Y+siz*1.3],st_style:'#f00',st:true});
			this.draw({circle:false,X:[20,400],Y:[Y-siz,Y-siz],cl:thema,st:true,st_style:'#f00'});
			this.draw({circle:false,X:[20,400],Y:[Y-siz*1.3,Y-siz*1.3],st:true,st_style:'#f00'});
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
			touchBul = this.distance(player.X,player.Y,exData.X,exData.Y) < (siz + 3)*2;
			this.graze(this.distance(player.X,player.Y,exData.X,exData.Y) > (siz + 3)*2 && this.distance(player.X,player.Y,exData.X,exData.Y) < (siz + 3)*4)
	 	}
	 	ctx.globalAlpha = 1.0;
	 	ctx.lineWidth = 1;
	}
	graze(bool,g = true) {
		if(bool && exData.graze && player.ghost <= 0) {
	 		player.graze++;
	 		g && (exData.graze = false);
		}
	}
	changeCondition(num) {
		let object = exData['changeCond'][tn];
		switch (num) {
			case 1:
			return this.distance(object['x'], object['y'],exData.X,exData.Y) < exData.speed*1.7;
			break;
			case 2:
			object['down']--;
			return 0 >= object['down'];
			break;
			case 3:
			return object['hp'] > exData.hp;
			break;
			case 4: 
			return Math.abs(object['x']- exData.X) < exData.speed[tn]*1.3 || Math.abs(object['y']- exData.Y) < 5;
			break;
			case 5:
			return address[exData.ad] < 0;
			default:
			return exData.X > 410 || exData.X < 0 || exData.Y < 0 || exData.Y > canvas.height;
			break;
		}
	}
	colid(bool) {
		if(bool && player.ghost <= 0) { 
	    	audioElem['crash'].play();
	    	this.addEffect({costume:'circle',X:player.X,Y:player.Y,size:[1,50],width:[500,0],color:'#eab500',dir:0});
	    	this.addEffect({costume:'circle',X:player.X,Y:player.Y,size:[1,100],width:[1000,0],color:'#eab500',dir:0});
	    	player.alive = false;
	    	player.X = 200;
	    	player.Y = 500;
	    	player.ghost = 100;
	    	player.hp--;
		}
		touchBul = false;
		touchLs = false;
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
		object.color === undefined && (object.color = exData.color);
		object.st_dir === undefined && (object.st_dir = exData.dir);
		object.zikimuke && (object.st_dir = this.angle(exData.X,exData.Y,player.X,player.Y));
		object.rotaRate !== undefined && (object.st_dir += object.rotaRate);
		object.cycle === undefined && (object.cycle = 1);
		object.laser === undefined &&  (object.laser = false);
		//object.dir_accele === /rndm/ &&  (object.laser = rndm());
		if( object.reverse !== undefined) {
			object.reverse *= -1; 
			object.laser ? object['changeCond'][0]['dir_accele'] = object.reverse : object.dir_accele = object.reverse;
		}
		exData.bulletNumber % object.cycle == 0 && this.add({changeCond:object['changeCond'],chase:object['chase'],deleteMessage:object['deleteMessage'],enId:object['enId'],color:object['color'], speed:object['speed'],accele:object['accele'], dir_accele:object['dir_accele'], interval:object['interval'], size:object['size'], type:object['type'], costume:object['costume'], bulletNumber:exData.bulletNumber, Addval:object['Addval'],width:object['width'],X:object['X'],Y:object['Y']}, object['count'], object['rota'], object['st_dir'],object['laser'],object['shift']);
	}
	delete(array,index) {}
	constant() {}
} 
	
class drawAll extends Func {	
	constructor(array,def) {
	    console.log(super(array,def));
	}
	loop() {
		let deleteList = [];
		Object.keys(this.array).forEach(function (value,index,array) {
			const copy = JSON.parse(JSON.stringify(this.def));
			this.processing(value,index,array,copy,deleteList,this.array);
		},this);
		this.organize(deleteList);
	}
	processing(value,index,array,defau,deletelist,this_array) {
		exData = defau;
		super.ex(this_array[value],exData);
		tn = exData.typeNumber;
       	exData['changeCond'][tn]['chase'] && (exData.dir = this.angle(exData.X,exData.Y,player.X,player.Y));
       	typeof this.special !== 'undefined' && this.special();
       	this.dr();
       	if(exData.interval[tn][0] == 0) { 
       		exData.interval[tn][0] = exData.interval[tn][1];
       		typeof this.constant !== 'undefined' && this.constant();
       	}
       	if(super.changeCondition(exData['changeCond'][tn]['cond'])) {
       		exData['changeCond'][tn]['color'] !== undefined && (exData.color = exData['changeCond'][tn]['color']);
       		exData['changeCond'][tn]['speed'] !== undefined && (exData.speed = exData['changeCond'][tn]['speed']);
       		exData['changeCond'][tn]['accele'] !== undefined && (exData.accele = exData['changeCond'][tn]['accele']);
       		exData['changeCond'][tn]['dir'] !== undefined && (exData.dir = exData['changeCond'][tn]['dir']);
       		exData['changeCond'][tn]['dir_accele'] !== undefined && (exData.dir_accele = exData['changeCond'][tn]['dir_accele']);
       		exData['changeCond'][tn]['delAll'] && (deleteAll = exData.enId);
       		exData['changeCond'][tn+1] === undefined ? deletelist.push(value) : tn++; 
       	}
       	exData.typeNumber = tn;
       	this.delete(deletelist,value);
       	this_array[value] = exData;
	}
	organize(arr) {
		arr.forEach(function(value) {
			delete this.array[value];
		},this);
	}
}

function rndm(min,max) {
	return Math.floor(Math.random() * max) + min;
}

function playerAll() {
	if(player.alive) {
	 	window.onkeydown =function (e){
	 		input_key_buffer[e.keyCode] = true;
	 	};
	 	window.onkeyup = function (e){
	 		input_key_buffer[e.keyCode] = false;
	 	};
	 	player.spX = (2-input_key_buffer[16])*(input_key_buffer[39] - input_key_buffer[37]);
	 	player.spY = (2-input_key_buffer[16])*(input_key_buffer[40] - input_key_buffer[38]);
	 	player.X += player.spX;
	    player.Y += player.spY;
	    player.X > 400 && (player.X = 400);
	    player.X < 20 && (player.X = 20);
	    player.Y < 20 && (player.pY = 20);
	    player.Y > 460 && (player.Y = 460);
	    player.shot--;
	    player.ghost--;
	    if(input_key_buffer[90] && player.shot < 0) {
			Shot(player.X,player.Y,input_key_buffer[16]);
	    	player.shot = 10;
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
function sleepByPromise(sec) {
	return new Promise(resolve => setTimeout(resolve, sec*1000));
}
async function add_enemy(object,sec = 0){
	await sleepByPromise(sec);
	object['boss'] && (boss = true);
	number.enemy++;
	if(object.etype === undefined) object.etype = 'ad';
	object.enId = object.etype + '-' + number.enemy;
	enemy[number.enemy] = object; 
} 
function Shot(x,y,s) { p_bullet.push({X:x,Y:y,speed:0,shift:s}); }
async function bgm(sec = 0,name) {
	
	await sleepByPromise(sec);
	audioElem['bgm'].pause();
	audioElem['bgm'] = new Audio(name);
	audioElem['bgm'].play();
}
bgm(1,'sumia.mp3');
bgm(32,'akka.mp3');
class en_bulletAll extends drawAll {
	special() {
		switch(exData.effect[0]) {
	  		case 1:
	  		super.DrawingMethod(exData.size * (15-exData.effect[1])/5, exData.costume, exData.color, exData.X, exData.Y, exData.dir,exData.effect[1]/10);
	  		exData.effect[1]+= 0.1;
	  		if(exData.effect[1]>10) exData.effect[0] = 0;
	  		break;
	  	}
	  	this.colid(touchBul);
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
			this.add({X:exData.X,Y:exData.Y,deleteMessage:true,speed:0,type:[1,0],color:thema,ad:exData.enId + '-' + String(exData.bulletNumber),dir_accele:0.1,costume:0,size:1,effect:[1,0],changeCond:[{cond:5,accele:0.5,color:'#516c7f'},{cond:0}]},1,0,this.rndm(0,360));
			break;
		}
	}
	delete(array,index) {
		if(exData.deleteMessage && deleteAll == exData.enId || index <= number.bulletdel) {
			array.push(index);
			this.addEffect({costume:'circle',X:exData.X,Y:exData.Y,size:[1,exData.size*2],width:[exData.size*20,0],color:exData.color,dir:0});
		}
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
		if(exData.boss) {
			bossData.hp = exData.hp;
			bossData.dir = exData.edir;
		}
	}
	dr() {
		super.PrptUpdate();
		super.DrawingMethod(exData.size,exData.costume,exData.color,exData.X,exData.Y,exData.edir,exData.alpha,exData.width);
		super.move(exData.speed,exData.dir,exData);
	}
	delete(array,index) {
		if(exData.hp < 0 || index <= number.enemydel) {
			if(exData.hp < 0) player.score+=exData.score;
			deleteAll = exData.enId;
			array.push(index);
			this.addEffect({X:exData.X,Y:exData.Y,size:[1,exData.size*10],width:[exData.size*100,0],color:exData.color,dir:exData.edir});
       		this.addEffect({X:exData.X,Y:exData.Y,size:[1,exData.size*20],width:[exData.size*200,0],color:exData.color,dir:0});
       		
       		audioElem['enemy_crash'].load();
       		audioElem['enemy_crash'].play();
       		if(exData.boss) {
       			StageEnd();
       			stageConst();
       			this.addEffect({costume:'circle',X:exData.X,Y:exData.Y,size:[1,exData.size*50],width:[exData.size*500,0],color:exData.color,dir:exData.edir});
       			this.addEffect({costume:'circle',X:exData.X,Y:exData.Y,size:[1,exData.size*100],width:[exData.size*1000,0],color:exData.color,dir:0});
       		}
		}
	}
	constant() {
		switch(exData.type[tn]) {
			case 1:
			//audioElem['enemy_shot'].play();
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
		if (tn == 0) {exData.alpha = 0.4};
		if( tn == 1){
			this.colid(touchLs);
			 exData.alpha = 1;
		}
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
		if(exData.deleteMessage && deleteAll == exData.enId || index <= number.laserdel) {exData.typeNumber = 2; exData.alpha = 1;}
	}
}

class effectAll extends drawAll {
	PrptUpdate() {
		exData.width_2[0] = exData.width[tn] - exData.width_2[1];
		exData.width_2[1] += exData.width_2[0]/6;
		exData.size_2[0] = exData.size[tn] - exData.size_2[1];
		exData.size_2[1] += exData.size_2[0]/6;
	}
	dr() {
		this.PrptUpdate();
		this.DrawingMethod(exData.size_2[1],exData.costume,exData.color,exData.X,exData.Y,exData.dir,exData.alpha,exData.width_2[1]);
		this.move(exData.speed,exData.dir,exData);
	}
	special() {
		switch(exData.costume) {
			case 'warning':
			exData.dir += 0.1;
			exData.alpha =  Math.abs(Math.cos(exData.dir));
			break;

		}
	}
}

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

	ctx.font = '15px Wawati SC','15px Courier','15px sans-serif';
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
}

function bossInfo() {
	//siz,ty,cl,X,Y,di,alpha,wid,circle = false;
	func.DrawingMethod(6,'enemy',thema,510,260,bossData.dir,0.7,1);
	HPbar(460,340,bossData.hp,bossData.maxhp,150,10,true,thema);
	HPbar(490,350,bossData.level % 600/60,10,120,7,false,'#fff');
	bossData.level++;
	ctx.font = '15px Courier','15px sans-serif';
	ctx.globalAlpha = 1;
	ctx.fillStyle = 'fff';
	ctx.fillText('HP:',430,345);
	ctx.font = '11px Courier','11px sans-serif';
	ctx.fillText('RISKLEVEL:',430,355);
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
var func = new Func(); 
var en_btAll = new en_bulletAll(bullet,{
	dir:0, //向き
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
	graze:true
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
	score:100,
	changeCond:[{cond:0}],
	boss:false
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
	graze:true
})
var effAll = new effectAll(effect,{
	dir:0,
	speed:0,
	size:[5],
	size_2:[0,0],
	alpha:1,
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
//object,count,rota,st_dir,ls,shift
var all = function() {
	if(canvas.getContext) {
		if(input_key_buffer[88]){
	   		sleep(10000);
	   	}
		//ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.beginPath();
		ctx.globalAlpha = 1;
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

function keta(number,k) {
	let l = k - String(number).length;
	let r = "";
	for(let i = 0; i < l; i++) {
		r += "0";
	}
	return r + String(number);
}

function sleep(waitsec) {
	var startMsec = new Data();
	while(new Data() - startMsec < waitMsec);
}
async function BossComing(sec = 0) {
	await sleepByPromise(sec);
	audioElem['noise2'].play();
	audioElem['warning'].play();
	func.addEffect({X:75,Y:200,costume:'warning',changeCond:[{cond:2,down:480},{cond:2,down:20}],size:[30,0]});
	serifData('boss');
	del();
	bossData = {maxhp:250,level:0}
	add_enemy({X:200,Y:0,
		shooter:[[{}],
		[{reverse:1.5,dir_accele:0,laser:true,shift:50,rotaRate:40,cycle:3,deleteMessage:true,changeCond:[{cond:2,down:100,dir_accele:1},{cond:2,down:100,dir_accele:0},{cond:2,down:10}]},
		{rotaRate:10,speed:1,accele:2,st_dir:rndm(0,360),color:'#663884'},
		{rotaRate:-10,color:'#6481cd',speed:3,accele:-4,type:[1,0],st_dir:rndm(0,360),changeCond:[{cond:2,down:30,speed:1,accele:0.2},{cond:0}]}
		],
		[{}],
		[{count:15,rota:24,interval:[[20,20]],st_dir:90,speed:2,accele:0.5,dir_accele:1,type:[1],size:30,costume:'big_bullet',Addval:300,reverse:2,deleteMessage:true},
		],
		[{}]],
	speed:2,accele:0.1,score:10000,boss:true,changeCond:[{cond:1,x:200,y:100,speed:0,accele:0},{cond:3,hp:125,delAll:true},{cond:2,down:50},{cond:3,hp:0,delAll:true}],type:[0,1,0,1,0],interval:[[0,0],[35,35],[0,0],[1,250],[0,0]],hp:250,size:10},9);	
}

function HPbar(x,y,hp,max,width,height,value,color='#fff') {
	func.draw({X:[x,x+width],Y:[y,y],st:true,wid:height,st_style:'#999999',circle:false});
	func.draw({X:[x,x+hp*width/max],Y:[y,y],st:true,wid:height,st_style:color,circle:false});
	ctx.font = '13px Wawati SC','13px Courier','13px sans-serif';
	ctx.fillStyle = '#fff';
	value && ctx.fillText(bossData.hp,x+width/2.5,y+4);
}
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
function serifAll() {
	SerifResult = [];
	SerifElem.r = "";
	serifDisplay(SerifElem.num,SerifElem.length-1);
	lineBreak(SerifElem.r,SerifElem.max);
	
	let xx = 0;
	let yy = 0;
	if(Serif[SerifElem.num]['shake']) {
		xx = rndm(-3,3);
		yy = rndm(-3,3);
	}
	SerifResult.forEach(function(value,index,array) { 
		//ctx.font = '14px Wawati SC','14px sans-serif';
		ctx.font = '14px Courier','14px sans-serif';
		ctx.globalAlpha = 1;
		ctx.fillStyle = Serif[SerifElem.num]['color'];
		if(Serif[SerifElem.num]['bake'] && rndm(0,20) == 0) {
			SerifElem.bake = rndm(3,20);
			bk = bake(value.length);
		}
		SerifElem.bake--;
		SerifElem.bake > 0 ? ctx.fillText(bk,428+xx,200+index*20+yy) : ctx.fillText(value,428+xx,200+index*20+yy);
		if(Serif[SerifElem.num]['shake']) {
			xx = rndm(-3,3);
			ctx.globalAlpha = 0.7;
			yy = rndm(-8,8);
			ctx.fillText(value,428+xx,200+index*20+yy);	
		}
	});
	//wireless(440,290,SerifElem.length % 2);

}
function isHanEisu(str) {
	str = (str==null)?"":str;
	if(str.match(/^[a-z0-9]*$/))
		return true;
	else
		return false;
}
async function SerifSet(sec = 0) {
	console.log('set')
	await sleepByPromise(sec);
	audioElem['noise'].play();
	SerifElem.num++;
	SerifElem.length = 1;
	let l = Serif[SerifElem.num]['str'].length;
	let s = Serif[SerifElem.num]['speed'];
	for(let a = 0; a < l; a++) {feed(a*s,'length',SerifElem);}
	SerifElem.num < Serif.length && SerifSet(Serif[SerifElem.num]['wait']);
}

function StageEnd() {
	player.hp <= 0 && (player.hp = 0);
	player.score += player.hp*player.graze*5000;
	player.graze = 0;
	player.hp = 5;
	boss = false;
}
function lineBreak(str,max) {
	let l = str.length;
	let b = 0;
	let ii = 0;
	SerifResult[0] = "";
	for(let i = 1; i <= l; i++) {
 		isHanEisu(str[i-1]) ? ii+=0.5 : ii++;
		str[i-1] != "/" && (SerifResult[b] += str[i-1]);
		if(Math.floor(ii) == max || str[i-1] == "/"){ii = 0;b++; SerifResult[b] = ""}
	}
}
function serifData(p) {
	//僕がセリフ考えてるわけじゃないよ。友人がここ書いてる
	SerifElem = {num:0,length:1,r:"",max:14,bake:0,waku:320,waku_2:180};
	Serif = [];
	switch(p) {
		case 1:
		addSerif({str:"   ",wait:0,speed:0.02});
		addSerif({str:"・・・さてと通信は繋がったかな。",wait:3,speed:0.05});
		addSerif({str:"こちらアンドウ、アンドウ、応答せよ。",wait:3,speed:0.03});
		addSerif({str:"...よし、応答があった。",wait:2,speed:0.03});
		addSerif({str:"AIナンバー010君。/さっそくですまないが、君に新種のコンピュータウイルスWin killer meの駆除を頼みたい。",wait:6,speed:0.02});
		addSerif({str:"君の持っているワクチンバスターでウイルスを無力化するのは可能だが、",wait:5,speed:0.02});
		addSerif({str:"相手の能力が未知数なうえに、急造品のためバスターの出力が弱い。",wait:5,speed:0.02});
		addSerif({str:"君自身がウイルスに感染しないよう気をつけてくれ。",wait:4,speed:0.02});
		addSerif({str:"では健闘を祈る。",wait:3,speed:0.02});
		break;
		case 'boss':
		addSerif({str:"このあたりは特にウイルスの反応が高い。十分に注",wait:1.15,speed:0.05});
		addSerif({str:bake(12),wait:0.3,speed:0.01,shake:true});
		addSerif({str:"ど、どうした。応答してくれ",wait:1,speed:0.01,shake:true});
		addSerif({str:"接続がタイムアウトになりました。",wait:2,speed:0.02,shake:true,color:'#00ff00',bake:true});
		addSerif({str:"直ちにモードへ切り替えます。",wait:2,speed:0.02,shake:true,color:'#00ff00',bake:true});
	}
	SerifSet();
}
function addSerif(obj) {
	obj['shake'] === undefined && (obj['shake'] = false);
	obj['color'] === undefined && (obj['color'] = '#fff');
	//obj['color'] === undefined && (obj['color'] = '#eab500');
	obj['shake'] === undefined && (obj['shake'] = false);
	Serif.push(obj);
}

function bake(length) {
	let s = "";
	let c = ['樺','・','ェ','霊','-','喧','∆','代','ｯ','ﾕ','→','励','被','ｨ','ｩ','繕','√','w','徐','惑','ｱ'];
	for(let i = 0; i < length; i++) {
		s += c[rndm(0,c.length-1)];
	}
	return s;
}
function serifDisplay(n,l) {
	for(let i = 0; i < l; i++) SerifElem.r += Serif[n]['str'][i];
}
function wireless(x,y,anim){
	//func.draw({st:true,circle:false,X:[x-10,x+10,x+10,x-10],Y:[y+20,y+20,y-20,y-20],close:true,alpha:1});
	ctx.globalAlpha = 1;
	ctx.strokeStyle = '#fff';
	ctx.strokeRect(x-10,y-10,20,40);
}
async function feed(sec = 0,pr,obj) {
	await sleepByPromise(sec);
	obj[pr]++;
}
function game(stage) {
	switch (stage) {
		case 1:
		stage1();
		break;
		case 2:
		stage2();
		break;
		case 3:
		stage3();
		break;
	}
}
function stage1() {
		
	add_enemy({X:200,Y:0,dir:func.angle(200,0,300,200),shooter:[[{}],[{deleteMessage:true,laser:true,count:5,rota:72,shift:50,changeCond:[{cond:2,down:160,dir_accele:1},{cond:2,down:100,dir_accele:0},{cond:2,down:10}]}]],speed:2,accele:0.1,changeCond:[{cond:1,x:300,y:200,dir:90,speed:0,accele:0},{cond:2,speed:1,accele:0.4,down:200},{cond:4,y:500}],type:[0,1,0],interval:[[0,0],[10,200],[0,0]],hp:20},2);	
	add_enemy({X:200,Y:0,dir:func.angle(200,0,100,200),shooter:[[{}],[{deleteMessage:true,laser:true,count:5,rota:72,shift:50,changeCond:[{cond:2,down:160,dir_accele:1},{cond:2,down:100,dir_accele:0},{cond:2,down:10}]}]],speed:2,accele:0.1,changeCond:[{cond:1,x:100,y:200,dir:90,speed:0,accele:0},{cond:2,speed:1,accele:0.4,down:200},{cond:4,y:500}],type:[0,1,0],interval:[[0,0],[10,200],[0,0]],hp:20},2);	
	add_enemy({score:500,X:200,Y:0,size:5,dir:func.angle(200,0,200,100),shooter:[[{}],[{deleteMessage:true,laser:true,shift:50}]],speed:2,accele:0.1,changeCond:[{cond:1,x:200,y:100,dir:90,speed:0,accele:0},{cond:2,speed:1,accele:0.4,down:200},{cond:4,y2:500}],type:[0,1,0],interval:[[0,0],[10,200],[0,0]],hp:20},3);		

	for(let i = 1; i <= 3; i++) {
		add_enemy({X:100,Y:0,color:'#6481cd',shooter:[[{count:5,rota:30,st_dir:270,speed:1,accele:1,dir_accele:1}]],speed:2,type:[1],interval:[[100,100]],hp:5},i);
		add_enemy({X:300,Y:0,color:'#6481cd',shooter:[[{count:5,rota:30,st_dir:135,speed:1,accele:1,dir_accele:1}]],speed:2,type:[1],interval:[[100,100]],hp:5},i);
	}
	for(let i = 0; i <= 4; i++) {
		add_enemy({X:250+(i%2*50),Y:0,color:'#fff',shooter:[[{count:1,st_dir:180,speed:1,laser:true,changeCond:[{cond:2,down:1},{cond:2,down:460},{cond:2,down:10}],shift:30,deleteMessage:true}],[{}],[{count:3,rota:120,st_dir:rndm(0,360),rotaRate:50,speed:0,accele:0.2}],[{}]],speed:1,accele:0,type:[1,0,1,0],interval:[[10,5000],[0,0],[80,80],[0,0]],changeCond:[{cond:2,down:25},{cond:3,hp:19,speed:0.5,accele:0.15,delAll:true,color:thema},{cond:2,down:500,chase:true},{cond:0}],hp:20},i*4+8);
		add_enemy({X:150-(i%2*50),Y:0,color:'#fff',shooter:[[{count:1,st_dir:0,speed:1,laser:true,changeCond:[{cond:2,down:1},{cond:2,down:460},{cond:2,down:10}],shift:30,deleteMessage:true}],[{}],[{count:3,rota:120,st_dir:rndm(0,360),rotaRate:50,speed:0,accele:0.2}],[{}]],speed:1,accele:0,type:[1,0,1,0],interval:[[10,5000],[0,0],[80,80],[0,0]],changeCond:[{cond:2,down:25},{cond:3,hp:19,speed:0.5,accele:0.15,delAll:true,color:thema},{cond:2,down:500,chase:true},{cond:0}],hp:20},i*4+10);
	}
	for(let i = 0; i<= 9; i++) {
		add_enemy({X:0,Y:100,dir:0,color:'#fff',shooter:[[{count:5,rota:10,speed:1,accele:0.1,zikimuke:true,rotaRate:-20}]],speed:2,type:[1],interval:[[100,100]],hp:5},i*2+8);
	}
	BossComing(36);
}

function stage2() {
	//add_enemy({hp:15,X:300,Y:0,speed:5,accele:-9,shooter:[[{}],[{cycle:2,costume:1,size:2,speed:5,accele:-20,dir_accele:rndm(1,10)/10,color:'#3b59ff',changeCond:[{cond:2,down:50,accele:0.5},{cond:0}]},{costume:1,speed:4,accele:0.1}],[{}]],type:[0,1,0],interval:[[0,0],[10,10],[0,0]],changeCond:[{cond:2,down:50,speed:0,accele:0},{cond:2,down:300,speed:-1},{cond:0}]})
}
