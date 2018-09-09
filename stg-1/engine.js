let canvas = document.getElementById('stg');
let dta = []; //弾の速度、向き、加速度、色など、全てのデータがまとめて入っている。
let address = {}; //弾をグループ化。弾にまとめて命令をだしたいときに使う。いまのところ合図にしか使っていない。
let effect = []; //エフェクト
let laser = []; 
let exData = {};
let pX = 300;
let pY = 300;
let pspX = 0;
let pspY = 0;
let input_key_buffer = [];
for(let i = 0; i <= 226; i++) input_key_buffer[i] = false;
let p_bullet = [];
let enemy = [];
let shot = 0;
let touch;
let enem_num = 0;
let deleteAll;

game();

var all = function() {
	if(canvas.getContext) {
		const ctx = canvas.getContext('2d');
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.beginPath();
		ctx.fillStyle = '#000000';
		ctx.fillRect(0,0,canvas.width,canvas.height);
		player(ctx);
		en_bullet(ctx);
		pl_bullet(ctx);
		enemyAll(ctx);
		laserAll(ctx);
		effectAll(ctx);
	}
};

(function animloop(){
all();
window.requestAnimationFrame(animloop);
}());
/**/
function move(dis,di,object) {
	object.X += Math.cos(rad(di))*dis;
	object.Y += Math.sin(rad(di))*dis;

	object.X = parseFloat(object['X'].toFixed(3));
	object.Y = parseFloat(object['Y'].toFixed(3));
}


function add(i,object,count,rota,st_dir,ls,shift) {
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
		move(shift,dt.dir,copy);
		ls ? laser.push(copy) : dta.push(copy);
		direc += rota;
	}
}

function ex(object,object_2) {
 	for(let k in object) {
 		let copy;
 		typeof object[k] !== 'object' ? copy = object[k] : copy = Object.assign({}, object[k]);
 		copy !== undefined && (object_2[k] = copy);
 	};
 }

function BltDrw(ctx,siz,ty,cl,X,Y,di,alpha) {
 	ctx.globalAlpha = alpha;
 	touch = distance(pX,pY,exData.X,exData.Y) < siz*1.4
 	switch(ty) {
 		case 1:
 		ctx.beginPath();
 		ctx.lineWidth = 0.5*siz;
 		ctx.strokeStyle = '#ffffff';
 		ctx.arc(X,Y,siz,0,Math.PI*2,false);
 		ctx.stroke();
 		ctx.beginPath();
 		ctx.lineWidth = 0.8*siz;
 		ctx.globalAlpha = 0.8;
 		ctx.strokeStyle = cl;
 		ctx.arc(X,Y,siz * 0.7,0,Math.PI*2,false);
 		ctx.stroke();
 		break;
 		case 2:
 		ctx.beginPath();
 		ctx.strokeStyle = cl;
 		ctx.fillStyle = '#ffffff';
 		ctx.lineWidth = siz*0.5;
 		ctx.arc(X + Math.cos(di/180*Math.PI)* 3,Y + Math.sin(di/180*Math.PI)* 3,siz*2,(di-90)/180*Math.PI,(di+90)/180*Math.PI,false);
 		ctx.stroke();
 		ctx.beginPath();
 		ctx.beginPath();
 		ctx.lineWidth = siz*1.2;
 		ctx.arc(X,Y,siz,0,Math.PI*2,false);
 		ctx.stroke();
 		ctx.fill();
 		break;
 		case 3:
 		break;
 		case 4:
 		break;
 		case 5:
 		break;
 		case 6:
 		break;
 		case 7:
 		break;
 		default:
 		ctx.beginPath();
 		ctx.lineWidth = siz*1.2;
 		ctx.strokeStyle = cl;
 		ctx.fillStyle = '#ffffff';
 		ctx.arc(X,Y,siz,0,Math.PI*2,false);
 		ctx.stroke();
 		ctx.fill();
 		break;

 	}
 	if(ty >= 3 && ty <= 7) {
 		di+= 90;
 		let mag = 23 + (ty-3)*1.5;
 		let a = -4*mag + 131;
 		let x_dif = Math.cos(rad(di))* siz*mag/3;
 		let y_dif = Math.sin(rad(di))* siz*mag/3;
 		ctx.beginPath();
 		ctx.strokeStyle = cl;
 		ctx.fillStyle = '#ffffff';
 		ctx.lineWidth = siz*2;
 		ctx.arc(X + x_dif,Y + y_dif,siz*10,rad(di+180-a),rad(di+180+a),false);
 		ctx.arc(X - x_dif,Y - y_dif,siz*10,rad(di-a),rad(di+a),false);
 		ctx.stroke();
 		ctx.fill();
    	touch = distance(pX,pY,exData.X,exData.Y) < (siz + 3)*1.4;
 	}
 	ctx.globalAlpha = 1.0;
 	ctx.lineWidth = 1;
}

function rad(di) {
	return di/180*Math.PI;
}

function rndm(min,max) {
	return Math.floor(Math.random() * max) + min;
}
function angle(x,y,x2,y2) {
	let r = Math.atan2(y2 - y, x2 - x);
 	return Math.floor(r * 360 / (2 * Math.PI));
} 
function distance(x1,y1,x2,y2) {
 	return Math.sqrt( Math.pow( x2-x1, 2 ) + Math.pow( y2-y1, 2 ) ) 
}

function condition(object) {
	switch(object.deletion) {
 		case 1:
 		return distance(object.X,object.Y,object.goalX[2],object.goalY[3]) <= 10;
 		break;
 		case 2:
 		return object.down[2] == 0;
 		default:
 		return object.X > canvas.width || object.X < 0 || object.Y < 0 || object.Y > canvas.height;
 		break;
 	}
}

function shinsu(num) {
	const array = ['0','1','2','3','4','5','6','7','8','9','a','b','c','d','e','f'];
	let a = num;
	let b = 0;
	let result = "";
	while(a / 16 != 0) {
		b = a % 16;
		a = (a - b) / 16;
		result += array[b];
		console.log(a);
	}

	result = rev(result);
	return result == "" ? "00" : keta(result);
}

function rev(s) {
 	let rv = "";
 	for (var i = 0, n = s.length; i < n; i++) rv += s[n - i - 1];
 	return rv;
}

function keta(s) {
 	return s.length < 2 ? '0' + s : s;
}

function dis_laser(x,y,x1,y1,x2,y2) {
 	let a = y1-y2;
 	let b = x2-x1;
 	let c = (b*-1*y1)+(a*-1*x1);
 	return Math.abs(a*x + b*y + c)/Math.sqrt(Math.pow(a,2) + Math.pow(b,2));
}

function player(ctx) {
 	window.onkeydown = function (e){
 		input_key_buffer[e.keyCode] = true;
 	};
 	window.onkeyup = function (e){
 		input_key_buffer[e.keyCode] = false;
 	};
 	pspX = (2-input_key_buffer[16])*(input_key_buffer[39] - input_key_buffer[37]);
 	pspY = (2-input_key_buffer[16])*(input_key_buffer[40] - input_key_buffer[38]);
 	pX += pspX;
    pY += pspY;
    pX > canvas.width && (pX = canvas.width);
    pX < 0 && (pX = 0);
    pY < 0 && (pY = 0);
    pY > canvas.height && (pY = canvas.height);
    shot--;
    if(input_key_buffer[90] && shot < 0) {
        Shot(pX,pY);
        shot = 10;
    }
    ctx.beginPath();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 5;
    ctx.arc(pX,pY,10,0,Math.PI*2,false);
    ctx.stroke();
}


function en_bullet(ctx) {
   	let length = dta.length;
   	for(let i = 0; i < length; i++) {
       //デフォルト値を設定
       exData = {
           dir:0, //向き
           speed:1, //速度
           accele:0, //加速度
           dir_accele:0, //向きの変化率
           type:[0], //挙動の種類
           color:'#ffffff', //色
           size:3, //大きさ
           btype:0, //見た目
           down:-1, //typeの値を変えるタイミング
           deletion:0, //削除される条件
           type_number:0,
           effect:[0],
           delete_:false
        }
    	//デフォルト値更新
    	ex(dta[i],exData);
	    if(exData.effect[0] == 0) {
	    	move(exData.speed,  exData.dir,exData);
       		exData.speed +=  exData.accele / 100;
	       	exData.dir +=  exData.dir_accele /5;
	       	exData.down--;
       		BltDrw(ctx, exData.size, exData.btype, exData.color, exData.X, exData.Y, exData.dir,1);
       		colid(touch,ctx);
	       	(exData.down == 0 || address[exData.ad] < 0)  && special();   	
	    } else { eff(ctx); }
	    //データ更新
	    dta[i] = exData;
	    if(condition(i,exData) || (exData.delete_ && deleteAll == exData.enId)) {
	       	dta.splice(i,1);
	        length--;
	        i--;
	    }

	}
	for(let key in address) {
	    address[key]--;
	    (address[key] <= -100) && (delete address[key]);
	}
}

function pl_bullet(ctx) {
  	let length = p_bullet.length;
  	for(let i = 0; i < length; i++) {
  		exData = {};
  		exData.kakoY = p_bullet[i].Y;
  		p_bullet[i].speed += 0.7;
  		p_bullet[i].Y -= p_bullet[i].speed;
  		ex(p_bullet[i],exData);
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
  	}
}

function Shot(x,y) { p_bullet.push({X:x,Y:y,speed:0}); }

function eff(ctx) {
  	switch(exData.effect[0]) {
  		case 1:
  		BltDrw(ctx, exData.size * (15-exData.effect[1])/5, exData.btype, exData.color, exData.X, exData.Y, exData.dir,exData.effect[1]/10);
  		exData.effect[1]+= 0.1;
  		if(exData.effect[1]>10) exData.effect[0] = 0;
  		break;
  	}
}

function special() {
  	switch(exData.type[exData.type_number]) {
  		case 1:
  		if(exData.accele_2 !== undefined) exData.accele =  exData.accele_2;
  		if(exData.speed_2 !== undefined) exData.speed =  exData.speed_2;
  		if(exData.dir_accele_2 !== undefined) exData.dir_accele =  exData.dir_accele_2;
  		if(exData.color_2 !== undefined) exData.color =  exData.color_2;
  		break;
  		case 2:
  		add(0,{delete_:true,X:exData.X,Y:exData.Y,speed:0,type:[1,0],color:'#b000a3',ad:exData.enId + '-' + String(exData.bulletNumber),accele_2:0.5,dir_accele:0.1,color_2:'#516c7f',btype:3,size:1,effect:[1,0]},1,0,rndm(0,360));
  		exData.down = 20;
  		break;
  	}
  	exData.type_number++;
}
function enemyAll(ctx) {
    let length = enemy.length;
    let delete_ = false;
    for(let i = 0; i < length; i++) {
    	exData = {
           X:0, //x座標
           Y:0, //y座標
           dir:[90], //向き
           speed:[1], //速度
           accele:[0], //加速度
           dir_accele:[0], //向きの変化率
           type:[0], //挙動の種類
           color:'#ffffff', //色
           size:2, //大きさ
           edir:0,//見た目(向き)
           down:[-1,0], //typeの値を変えるタイミング
           deletion:0, //削除される条件
           bulletNumber:0,
           typeNumber:0,
           hp:20,
           collision:20,
           changeCond:{cond0:0},
           chase:false
        }
    	ex(enemy[i],exData);
    	tn = exData.typeNumber;
    	EnmDrw(ctx,exData.size,exData.etype,exData.color,exData.X,exData.Y,exData.edir,1);
    	exData.speed[tn] +=  exData.accele[tn] / 100;
    	exData.dir[tn] +=  exData.dir_accele[tn] /5;
       	exData.down[tn][0]--;
       	(exData['changeCond'][`chase${tn}`]) && (exData.dir[tn] = angle(exData.X,exData.Y,pX,pY));
       	move(exData.speed[tn],exData.dir[tn],exData);
       	en_anim(exData.etype,exData.speed[tn]);
       	if(changeCondition(exData['changeCond'][`cond${tn}`])) {
       		exData['changeCond'][`delAll${tn}`] && (deleteAll = exData.enId);
       		exData['changeCond'][`color${tn}`] !== undefined && (exData.color = exData['changeCond'][`color${tn}`]);
       		if(exData['changeCond'][`cond${tn+1}`] === undefined) {
       			delete_ = true;
       		} else {
       			tn++;
	       		arrayUpdate(exData.dir,tn);
	       		arrayUpdate(exData.speed,tn);
	       		arrayUpdate(exData.accele,tn);
	       		arrayUpdate(exData.dir_accele,tn);
	       	}

       	}
       	exData.typeNumber = tn;
       	(exData.down[tn][0] == 0) && en_special(exData.type[tn],exData.shooter[tn]);
       	collider();
       	enemy[i] = exData;
       	if(exData.hp < 0 || delete_) {
       		if(exData.hp < 0) {
       			addEffect({X:exData.X,Y:exData.Y,size:[1,exData.size*10],width:[300,0],down:[1,50],color:exData.color,type:1,dir:exData.edir});
       			addEffect({X:exData.X,Y:exData.Y,size:[1,exData.size*20],width:[500,0],down:[1,50],color:exData.color,type:1,dir:0});
       			//addEffect({X:exData.X,Y:exData.Y,size:[1,exData.size*15],width:[200,0],down:[1,50],color:exData.color});
       		}      		
       		exData.hp < 0 && (deleteAll = exData.enId);
       		enemy.splice(i,1);
			length--;
			i--;
			delete_ = false;
       	}
    }
}

function EnmDrw(ctx,siz,ty,cl,X,Y,di,alpha) {
	ctx.globalAlpha = alpha;
   	switch(exData.etype) {
    	default:
    	ctx.beginPath();
    	ctx.strokeStyle = cl;
    	ctx.lineWidth = siz*1.5;
    	ctx.moveTo(X + Math.cos(rad(di))*siz*10,Y + Math.cos(rad(di-90))*siz*10);
    	ctx.lineTo(X + Math.cos(rad(di-90))*siz*10,Y + Math.cos(rad(di))*siz*-10);
    	ctx.lineTo(X + Math.cos(rad(di))*siz*-10,Y + Math.cos(rad(di-90))*siz*-10);
    	ctx.lineTo(X + Math.cos(rad(di-90))*siz*-10,Y + Math.cos(rad(di))*siz*10);
    	ctx.closePath();
    	ctx.stroke();
    	ctx.beginPath();
    	ctx.strokeStyle = '#ffffff';
    	ctx.fillStyle = '#000000';
    	ctx.arc(X,Y,siz*3,0,Math.PI*2,false);
    	ctx.stroke();
		ctx.fill();
    	break;
    }
    ctx.globalAlpha = 1;
}

function en_anim(num,speed) {
	switch(num) {
		default:
		speed == 0 ? exData.edir +=  3 : exData.edir += speed;
	}
}
function en_special(num,dt) {
	switch(num) {
		case 1:
		dt.forEach(function(value) {
			let object = value;
			object.count === undefined  && (object.count = 10);
			object.rota === undefined && (object.rota = 36);
			object.st_dir === undefined && (object.st_dir = exData.dir[tn]);
			object.zikimuke && (object.st_dir = angle(exData.X,exData.Y,pX,pY));
			object.rotaRate !== undefined && (object.st_dir += object.rotaRate);
			object.cycle === undefined && (object.cycle = 1);
			object.laser === undefined &&  (object.laser = false);
			if( object.reverse !== undefined) {
				object.reverse *= -1; 
				object.laser ? object.dir_accele[1] = object.reverse : object.dir_accele = object.reverse;
			}
			exData.bulletNumber % object.cycle == 0 && add(0,{chase:object['chase'],delete_:object['delete_'],enId:object['enId'],color:object['color'], speed:object['speed'],speed_2:object['speed_2'], accele:object['accele'],accele_2:object['accele_2'],dir_accele_2:object['dir_accele_2'], dir_accele:object['dir_accele'], down:object['down'], size:object['size'], type:object['type'], btype:object['btype'], bulletNumber:exData.bulletNumber, Addval:object['Addval'],width:object['width'],X:object['X'],Y:object['Y']}, object['count'], object['rota'], object['st_dir'],object['laser'],object['shift']);
		});
		break;
	}
	exData.bulletNumber++;
	exData.down[tn][0] = exData.down[tn][1];
}

function changeCondition(num) {
	let object = exData['changeCond'];
	switch (num) {
		case 1:
		return distance(object[`x${tn}`], object[`y${tn}`],exData.X,exData.Y) < exData.speed[tn]*1.3;
		break;

		case 2:
		object[`start${tn}`]++;
		return object[`start${tn}`] >= object[`goal${tn}`];
		break;

		case 3:
		return object[`hp${tn}`] > exData.hp;
		break;

		case 4: 
		return Math.abs(object[`x${tn}`]- exData.X) < exData.speed[tn]*1.3 || Math.abs(object[`y${tn}`]- exData.Y) < 5;
		break;
		default:
		return exData.X > canvas.width || exData.X < 0 || exData.Y < 0 || exData.Y > canvas.height;
		break;
	}
}

async function add_enemy(object,sec = 0){
	await sleepByPromise(sec);
	enem_num++;
	if(object.etype === undefined) object.etype = 'ad';
	object.enId = object.etype + '-' + enem_num;
	//console.log(object.enId);
	enemy.push(object); 
}

function arrayUpdate(array,n,value){
	if(array[n] === undefined) array[n] = array[n-1];
}

function collider() {
	let length = p_bullet.length;
  	for(let i = 0; i < length; i++) distance(exData.X,exData.Y,p_bullet[i]['X'],p_bullet[i]['Y']) < exData.collision && exData.hp--;
}
function effectAll(ctx) {
	let length = effect.length;
  	for(let i = 0; i < length; i++) {
		exData = {
			X:0,
			Y:0,
			dir:0,
			speed:0,
			size:[0],
			size_2:[0,0],
			alpha:[1,1],
			alpha_2:[0,0],
			width:[5],
			width_2:[0,0],
			down:[1,100],
			color:'ffffff',
			type:0,
			typeNumber:0,
			deletion:2
		}
		ex(effect[i],exData);
		tn = exData.typeNumber;
		exData.width_2[0] = exData.width[tn] - exData.width_2[1];
		exData.width_2[1] += exData.width_2[0]/5;
		exData.size_2[0] = exData.size[tn] - exData.size_2[1];
		exData.size_2[1] += exData.size_2[0]/5;
		/*
		exData.alpha_2[0] = exData.alpha[tn] - exData.alpha_2[1];
		exData.alpha_2[1] += exData.alpha_2[0]/500;*/
		//move(exData.speed,exData.dir,exData);
		EffDrw(ctx,exData.width_2[1],exData.size_2[1],exData.type,exData.color,exData.X,exData.Y,exData.dir,exData.alpha_2[1]);
		exData.down[tn]--;
		if(exData.down[tn] == 0) tn++;
		exData.typeNumber = tn;
		effect[i] = exData;
		
		if(exData.down[1] == 0)
       	{
       		effect.splice(i,1);
	        length--;
	        i--;
       	}
	}
	
}

function addEffect(object) {
	console.log('add');
	effect.push(object);
}

function EffDrw(ctx,wid,siz,ty,cl,X,Y,di,alpha) {
	switch(ty) {
		case 1:
		ctx.beginPath();
		ctx.lineWidth = wid;
		ctx.globalAlpha = 1;
		ctx.strokeStyle = cl;
    	ctx.moveTo(X + Math.cos(rad(di))*siz*1,Y + Math.cos(rad(di-90))*siz*1);
    	ctx.lineTo(X + Math.cos(rad(di-90))*siz*1,Y + Math.cos(rad(di))*siz*-1);
    	ctx.lineTo(X + Math.cos(rad(di))*siz*-1,Y + Math.cos(rad(di-90))*siz*-1);
    	ctx.lineTo(X + Math.cos(rad(di-90))*siz*-1,Y + Math.cos(rad(di))*siz*1);
    	ctx.closePath();
    	ctx.stroke();
    	console.log(di);
		break;
		default:
		ctx.beginPath();
		ctx.lineWidth = wid;
		ctx.globalAlpha = 1;
		ctx.strokeStyle = cl;
		ctx.arc(X,Y,siz,0,Math.PI*2,false);
		ctx.stroke();
		break;
	}

	ctx.globalAlpha = 1.0;
 	ctx.lineWidth = 1;
}
function laserAll(ctx) {
  	let length = laser.length;
  	for(let i = 0; i < length; i++) {
		exData = {
			X:0,
			Y:0,
			dir:0,
			speed:0,
			dir_2:90,
			dir_accele:[0,0,0],
			dir_accele_2:[0,0,0],
			width:[8,15,8],
			width_2:0,
			width_3:0,
			alpha:1,
			color:'#ffffff',
			type:0,
			typeNumber:0,
			deletion:2,
			down:[100,100,10],
			circle:true,
			delete_:false
		}
		ex(laser[i],exData);
		tn = exData.typeNumber;
		move(exData.speed,exData.dir_2,exData);
		exData.width_2 = exData.width[tn] - exData.width_3;
		exData.width_3 += exData.width_2/5;
		exData.dir += exData.dir_accele[tn]/5;
		exData.dir_accele[tn] += exData.dir_accele_2[tn];
		tn == 0 && (exData.alpha = 0.4);
		LsrDrw(ctx,exData.width_3,exData.type,exData.color,exData.X,exData.Y,exData.dir,exData.alpha,exData.circle);
		if(tn == 1){colid(touch,ctx); exData.alpha = 1;}
		tn == 2 && (exData.alpha -= 0.1);
		exData.down[tn]--;
		exData.down[tn] == 0 && tn++;
		exData.typeNumber = tn;
		if(exData.delete_ && deleteAll == exData.enId) { exData.typeNumber = 2; exData.alpha = 1;}
		laser[i] = exData;

		if(condition(exData)) {
	       	laser.splice(i,1);
	        length--;
	        i--;
	    }
		

	}
	deleteAll = '';
}

function LsrDrw(ctx,wid,ty,cl,X,Y,di,alpha,circle) {
	switch(ty) {
		default:
		ctx.beginPath();
		ctx.globalAlpha = alpha;
		ctx.fillStyle = '#ffffff';
		circle && ctx.arc(X,Y,5,0,Math.PI*2,false);
		ctx.fill();
		ctx.beginPath();
		tn == 1 && (ctx.globalAlpha = 0.5);
		ctx.lineWidth = wid/1.8;
		ctx.strokeStyle = cl;
		circle && ctx.arc(X,Y,wid,0,Math.PI*2,false);
		ctx.stroke();
		ctx.beginPath();
 		ctx.strokeStyle = cl;
 		ctx.lineWidth = wid;
 		let obj = {X:exData.X,Y:exData.Y};
 		move(10,exData.dir,obj);
 		ctx.moveTo(obj.X,obj.Y);
 		ctx.lineTo(obj.X+ Math.cos(rad(di))*1000,obj.Y + Math.sin(rad(di))*1000);
 		ctx.stroke();
 		ctx.globalAlpha = alpha;
 		ctx.strokeStyle = '#ffffff';
 		ctx.lineWidth = wid/2;
 		ctx.closePath();
 		ctx.stroke();

 		touch = dis_laser(pX,pY,X,Y,X + Math.cos(rad(di))*1000,Y + Math.sin(rad(di))*1000) < 5;
 		break;
	}
	ctx.globalAlpha = 1.0;
 	ctx.lineWidth = 1;

}

function colid(bool,ctx) {
	if(bool) {
    	//エラーがでる
    	//const audio = document.getElementById("audio"); audio.play();
    	//console.log("touch");
    	ctx.beginPath();
    	ctx.fillStyle = '#b000a3';
    	ctx.arc(pX,pY,5,0,Math.PI*2,false);
    	ctx.fill();
	}
}
function sleepByPromise(sec) {
	return new Promise(resolve => setTimeout(resolve, sec*1000));
}

function game() {
	
	add_enemy({X:300,Y:0,color:'#b000a3',dir:[angle(300,0,400,200),90],shooter:[[{}],[{delete_:true,down:[160,100,10],dir_accele:[0,1.5,0],color:'#b000a3',laser:true,count:5,rota:72,shift:50}]],speed:[2,0,1],accele:[0.1,0,0.4],changeCond:{cond0:1,x0:400,y0:200,cond1:2,start1:0,goal1:200,cond2:4,y2:500},type:[0,1,0],down:[[0,0],[10,200],[0,0]],hp:20},1);		
	
	add_enemy({X:300,Y:0,color:'#b000a3',dir:[angle(300,0,200,200),90],shooter:[[{}],[{delete_:true,down:[160,100,10],dir_accele:[0,-1.5,0],color:'#b000a3',laser:true,count:5,rota:72,shift:50}]],speed:[2,0,1],accele:[0.1,0,0.4],changeCond:{cond0:1,x0:200,y0:200,cond1:2,start1:0,goal1:200,cond2:4,y2:500},type:[0,1,0],down:[[0,0],[10,200],[0,0]],hp:20},1);

	add_enemy({X:300,Y:0,size:5,color:'#b000a3',dir:[angle(300,0,300,100),90],shooter:[[{}],[{delete_:true,color:'#b000a3',laser:true,shift:60}]],speed:[2,0,1],accele:[0.1,0,0.4],changeCond:{cond0:1,x0:300,y0:100,cond1:2,start1:0,goal1:200,cond2:4,y2:500},type:[0,1,0],down:[[0,0],[10,200],[0,0]],hp:30},3);

	add_enemy({X:450,Y:0,shooter:[[{count:5,rota:30,st_dir:135,speed:1,accele:1,dir_accele:1}]],speed:[2],type:[1],down:[[100,100]],hp:5},1);
	add_enemy({X:150,Y:0,shooter:[[{count:5,rota:30,st_dir:270,speed:1,accele:1,dir_accele:1}]],speed:[2],type:[1],down:[[100,100]],hp:5},1);

	add_enemy({X:450,Y:0,shooter:[[{count:5,rota:30,st_dir:135,speed:1,accele:1,dir_accele:1}]],speed:[2],type:[1],down:[[100,100]],hp:5},2);
	add_enemy({X:150,Y:0,shooter:[[{count:5,rota:30,st_dir:270,speed:1,accele:1,dir_accele:1}]],speed:[2],type:[1],down:[[100,100]],hp:5},2);

	add_enemy({X:450,Y:0,shooter:[[{count:5,rota:30,st_dir:135,speed:1,accele:1,dir_accele:1}]],speed:[2],type:[1],down:[[100,100]],hp:5},3);
	add_enemy({X:150,Y:0,shooter:[[{count:5,rota:30,st_dir:270,speed:1,accele:1,dir_accele:1}]],speed:[2],type:[1],down:[[100,100]],hp:5},3);

	add_enemy({X:350,Y:0,shooter:[[{count:1,st_dir:180,speed:1,laser:true,down:[1,460,10],shift:30,delete_:true}],[{}],[{count:3,rota:120,st_dir:rndm(0,360),rotaRate:50,speed:0,accele:0.2,color:'#b000a3'}],[{}]],speed:[1,1,0.5,4],accele:[0,0,0.15,0.1],type:[1,0,1,0],down:[[10,30],[0,0],[80,80],[0,0]],changeCond:{cond0:2,start0:0,goal0:25,cond1:3,hp1:19,delAll1:true,color1:'#b000a3',chase2:true,cond2:2,start2:0,goal2:500,cond3:0},hp:20},8);
	add_enemy({X:200,Y:0,shooter:[[{count:1,st_dir:0,speed:1,laser:true,down:[1,460,10],shift:30,delete_:true}],[{}],[{count:3,rota:120,st_dir:rndm(0,360),rotaRate:50,speed:0,accele:0.2,color:'#b000a3'}],[{}]],speed:[1,1,0.5,4],accele:[0,0,0.15,0.1],type:[1,0,1,0],down:[[10,30],[0,0],[80,80],[0,0]],changeCond:{cond0:2,start0:0,goal0:25,cond1:3,hp1:19,delAll1:true,color1:'#b000a3',chase2:true,cond2:2,start2:0,goal2:500,cond3:0},hp:20},10);
	add_enemy({X:400,Y:0,shooter:[[{count:1,st_dir:180,speed:1,laser:true,down:[1,460,10],shift:30,delete_:true}],[{}],[{count:3,rota:120,st_dir:rndm(0,360),rotaRate:50,speed:0,accele:0.2,color:'#b000a3'}],[{}]],speed:[1,1,0.5,4],accele:[0,0,0.15,0.1],type:[1,0,1,0],down:[[10,30],[0,0],[80,80],[0,0]],changeCond:{cond0:2,start0:0,goal0:25,cond1:3,hp1:19,delAll1:true,color1:'#b000a3',chase2:true,cond2:2,start2:0,goal2:500,cond3:0},hp:20},12);
	add_enemy({X:200,Y:0,shooter:[[{count:1,st_dir:0,speed:1,laser:true,down:[1,460,10],shift:30,delete_:true}],[{}],[{count:3,rota:120,st_dir:rndm(0,360),rotaRate:50,speed:0,accele:0.2,color:'#b000a3'}],[{}]],speed:[1,1,0.5,4],accele:[0,0,0.15,0.1],type:[1,0,1,0],down:[[10,30],[0,0],[80,80],[0,0]],changeCond:{cond0:2,start0:0,goal0:25,cond1:3,hp1:19,delAll1:true,color1:'#b000a3',chase2:true,cond2:2,start2:0,goal2:500,cond3:0},hp:20},14);
	add_enemy({X:400,Y:0,shooter:[[{count:1,st_dir:180,speed:1,laser:true,down:[1,460,10],shift:30,delete_:true}],[{}],[{count:3,rota:120,st_dir:rndm(0,360),rotaRate:50,speed:0,accele:0.2,color:'#b000a3'}],[{}]],speed:[1,1,0.5,4],accele:[0,0,0.15,0.1],type:[1,0,1,0],down:[[10,30],[0,0],[80,80],[0,0]],changeCond:{cond0:2,start0:0,goal0:25,cond1:3,hp1:19,delAll1:true,color1:'#b000a3',chase2:true,cond2:2,start2:0,goal2:500,cond3:0},hp:20},16);
	add_enemy({X:200,Y:0,shooter:[[{count:1,st_dir:0,speed:1,laser:true,down:[1,460,10],shift:30,delete_:true}],[{}],[{count:3,rota:120,st_dir:rndm(0,360),rotaRate:50,speed:0,accele:0.2,color:'#b000a3'}],[{}]],speed:[1,1,0.5,4],accele:[0,0,0.15,0.1],type:[1,0,1,0],down:[[10,30],[0,0],[80,80],[0,0]],changeCond:{cond0:2,start0:0,goal0:25,cond1:3,hp1:19,delAll1:true,color1:'#b000a3',chase2:true,cond2:2,start2:0,goal2:500,cond3:0},hp:20},18);
	add_enemy({X:400,Y:0,shooter:[[{count:1,st_dir:180,speed:1,laser:true,down:[1,460,10],shift:30,delete_:true}],[{}],[{count:3,rota:120,st_dir:rndm(0,360),rotaRate:50,speed:0,accele:0.2,color:'#b000a3'}],[{}]],speed:[1,1,0.5,4],accele:[0,0,0.15,0.1],type:[1,0,1,0],down:[[10,30],[0,0],[80,80],[0,0]],changeCond:{cond0:2,start0:0,goal0:25,cond1:3,hp1:19,delAll1:true,color1:'#b000a3',chase2:true,cond2:2,start2:0,goal2:500,cond3:0},hp:20},20);
	add_enemy({X:250,Y:0,shooter:[[{count:1,st_dir:0,speed:1,laser:true,down:[1,460,10],shift:30,delete_:true}],[{}],[{count:3,rota:120,st_dir:rndm(0,360),rotaRate:50,speed:0,accele:0.2,color:'#b000a3'}],[{}]],speed:[1,1,0.5,4],accele:[0,0,0.15,0.1],type:[1,0,1,0],down:[[10,30],[0,0],[80,80],[0,0]],changeCond:{cond0:2,start0:0,goal0:25,cond1:3,hp1:19,delAll1:true,color1:'#b000a3',chase2:true,cond2:2,start2:0,goal2:500,cond3:0},hp:20},22);
	
	
	add_enemy({X:0,Y:100,dir:[0],shooter:[[{count:5,rota:10,speed:1,accele:0.1,zikimuke:true,rotaRate:- 20}]],speed:[2],type:[1],down:[[100,100]],hp:5},8);
	add_enemy({X:0,Y:100,dir:[0],shooter:[[{count:5,rota:10,speed:1,accele:0.1,zikimuke:true,rotaRate:- 20}]],speed:[2],type:[1],down:[[100,100]],hp:5},10);
	add_enemy({X:0,Y:100,dir:[0],shooter:[[{count:5,rota:10,speed:1,accele:0.1,zikimuke:true,rotaRate:- 20}]],speed:[2],type:[1],down:[[100,100]],hp:5},12);
	add_enemy({X:0,Y:100,dir:[0],shooter:[[{count:5,rota:10,speed:1,accele:0.1,zikimuke:true,rotaRate:- 20}]],speed:[2],type:[1],down:[[100,100]],hp:5},14);
	add_enemy({X:0,Y:100,dir:[0],shooter:[[{count:5,rota:10,speed:1,accele:0.1,zikimuke:true,rotaRate:- 20}]],speed:[2],type:[1],down:[[100,100]],hp:5},16);
	add_enemy({X:0,Y:100,dir:[0],shooter:[[{count:5,rota:10,speed:1,accele:0.1,zikimuke:true,rotaRate:- 20}]],speed:[2],type:[1],down:[[100,100]],hp:5},18);
	add_enemy({X:0,Y:100,dir:[0],shooter:[[{count:5,rota:10,speed:1,accele:0.1,zikimuke:true,rotaRate:- 20}]],speed:[2],type:[1],down:[[100,100]],hp:5},20);
	add_enemy({X:0,Y:100,dir:[0],shooter:[[{count:5,rota:10,speed:1,accele:0.1,zikimuke:true,rotaRate:- 20}]],speed:[2],type:[1],down:[[100,100]],hp:5},22);
	add_enemy({X:0,Y:100,dir:[0],shooter:[[{count:5,rota:10,speed:1,accele:0.1,zikimuke:true,rotaRate:- 20}]],speed:[2],type:[1],down:[[100,100]],hp:5},24);




	add_enemy({X:300,Y:0,color:'#b000a3',
		shooter:[[{}],
		[{reverse:1.5,dir_accele:[0,1.5,0],color:'#b000a3',laser:true,shift:50,rotaRate:40,down:[100,100,10],cycle:3,delete_:true},
		{rotaRate:10,speed:1,accele:2,st_dir:rndm(0,360)},
		{rotaRate:-10,speed:3,accele:-4,down:30,speed_2:1,accele_2:0.2,type:[1,0],st_dir:rndm(0,360)}],
		[{}],
		[{speed:2,accele:0.5,dir_accele:1.0,type:[2,2,2,2,2,2,2],color:'#b000a3',size:30,btype:1,down:20,Addval:300,reverse:1,delete_:true}],
		[{}]],
	speed:[2,0,0,0],accele:[0.1,0,0,0],changeCond:{cond0:1,x0:300,y0:100,cond1:3,hp1:70,delAll1:true,cond2:2,start2:0,goal2:50,cond3:3,hp3:0,delAll3:true},type:[0,1,0,1,0],down:[[0,0],[35,35],[0,0],[0,250],[0,0]],hp:150,size:10},35);
	
}	
