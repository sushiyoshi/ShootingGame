function draw() {
	let canvas = document.getElementById('stg');
	let dta = []; //弾の速度、向き、加速度、色など、全てのデータがまとめて入っている。
	let address = {}; //弾をグループ化。弾にまとめて命令をだしたいときに使う。いまのところ合図にしか使っていない。
	let effect = []; //エフェクト
	let exData = {};
	let pX = 300;
	let pY = 300;
	let pspX = 0;
	let pspY = 0;
	let input_key_buffer = [];
	for(let i = 0; i <= 226; i++) {
		input_key_buffer[i] = false;
	}
	let p_bullet = [];
	let enemy = [];
	let shot = 0;


	let n = [0,0,0,0,0,0,0,0,0]; //テストプレイ用
	let t = 0;
  /*
  setInterval(function() {
      if(canvas.getContext) {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.beginPath();
        ctx.fillStyle = '#000000';
        ctx.fillRect(0,0,canvas.width,canvas.height);
        EnmDrw(ctx,1,1,'#ffffff',300,300,t,1);
        t++;
      }
  },10);
  */
  	/*
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
  				add(0,{speed:2,accele:0.5,dir_accele:1.0*n[1],type:[2,2,2,2,2,2,2],color:'#b000a3',size:30,btype:1,bulletNumber:n[2],down:20,other:[30,15],Addval:300,effect:[1,0]},8,45,n[0]);
  				n[3] = 16;
  			} else {
  				n[3]--;
  			}
  		}
  	},250);
  */

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
     	}
  	};

 	(function animloop(){
    	all();
    	window.requestAnimationFrame(animloop);
 	}());
/**/
  	function move(dis,di,i) {
  		exData.X += Math.cos(rad(di))*dis;
  		exData.Y += Math.sin(rad(di))*dis;

  		exData.X = parseFloat(exData['X'].toFixed(3));
  		exData.Y = parseFloat(exData['Y'].toFixed(3));
	}


  	function add(i,object,count,rota,st_dir) {
  		let dt = object;
  		//console.log(object.type);
  		if ( dt.X === undefined ) dt.X = exData.X;
  		if ( dt.Y === undefined ) dt.Y = exData.Y;
  		if ( dt.enId === undefined ) dt.enId = exData.etype;
  		if ( count === undefined ) count = 1;
  		if ( rota === undefined ) rota = 0;
  		if ( st_dir === undefined ) st_dir = 0;
  		if(dt.btype == 8) {
  			dt.other[1] = 0.8;
  			dt.deletion = 2;
  		}
  		if(dt.Addval != null && dt.bulletNumber !== undefined) {
  			address[dt.enId + String(dt.bulletNumber)] = dt.Addval;
       		//console.log(dt.enId + String(dt.bulletNumber));
       		delete dt.Addval;
    	}
    	let direc = st_dir;
    	dt.dir = 0;
    	for(let j = 1; j <= count; j++) {
    		dt.dir = direc;
    		//dt.X += Math.cos(rad(direc))*10;
    		//dt.Y += Math.sin(rad(direc))*10;
    		const copy = Object.assign({}, dt);
    		dta.push(copy);  		
    		direc += rota;
    	}
	}

	function ex(i,object,object_2) {
	 	for(let k in object) {
	 		if(object[k] !== undefined) object_2[k] = object[k];
	 	}
	 }

	function BltDrw(ctx,siz,ty,cl,X,Y,di,alpha) {
	 	ctx.globalAlpha = alpha;
	 	let touch = distance(pX,pY,exData.X,exData.Y) < siz*1.4;
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
	 		case 8:
	 		ctx.beginPath();
	 		ctx.strokeStyle = cl;
	 		ctx.lineWidth = siz;
	 		ctx.moveTo(X,Y);
	 		ctx.lineTo(X+ Math.cos(rad(di))*1000,Y + Math.sin(rad(di))*1000);
	 		ctx.stroke();
	 		ctx.strokeStyle = '#ffffff';
	 		ctx.lineWidth = siz/2;
	 		ctx.closePath();
	 		ctx.stroke();
	 		touch = dis_laser(pX,pY,X,Y,X + Math.cos(rad(di))*1000,Y + Math.sin(rad(di))*1000) < 5;
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
	 	if(touch) {
	    	const audio = document.getElementById("audio");
	    	//audio.play();
	    	//console.log("touch");
	    }
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

	function condition(i,object) {
		switch(object.deletion) {
	 		case 1:
	 		return distance(object.X,object.Y,object.other[2],object.other[3]) <= 10;
	 		break;
	 		case 2:
	 		return object.other[0] < 0;
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
		}

		result = rev(result);
	 	if(result == "") 
			return "00";
		else 
	    	return keta(result);
	}

	function rev(s) {
	 	let rv = "";
	 	for (var i = 0, n = s.length; i < n; i++) {
	 		rv += s[n - i - 1];
	 	}
	 	return rv;
	}

	function keta(s) {
	 	if(s.length < 2)
	 		return '0' + s;
	 	else
	 		return s;	
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
	 		//console.log(`${e.keyCode}番キー`);
	 	};
	 	window.onkeyup = function (e){
	 		input_key_buffer[e.keyCode] = false;
	 	};
	 	pspX = (2-input_key_buffer[16])*(input_key_buffer[39] - input_key_buffer[37]);
	 	pspY = (2-input_key_buffer[16])*(input_key_buffer[40] - input_key_buffer[38]);
	 	pX += pspX;
	    pY += pspY;
	    shot--;
	    if(input_key_buffer[90] && shot < 0) {
	        Shot(pX,pY);
	        shot = 10;
	    }
	    ctx.beginPath();
	    ctx.fillStyle = '#ffffff';
	    ctx.arc(pX,pY,5,0,Math.PI*2,false);
	    ctx.fill();
	}

	  function en_bullet(ctx) {
	   	let length = dta.length;
	   	for(let i = 0; i < length; i++) {
	       //デフォルト値を設定
	       exData = {
	           X:0, //x座標
	           Y:0, //y座標
	           dir:0, //向き
	           enId:'ad', //弾を出した敵の種類
	           speed:1, //速度
	           accele:0, //加速度
	           dir_accele:0, //向きの変化率
	           type:[0], //挙動の種類
	           color:'#ffffff', //色
	           size:3, //大きさ
	           btype:0, //見た目
	           ad:"", //アドレス
	           bulletNumber:0, //弾
	           down:-1, //typeの値を変えるタイミング
	           deletion:0, //削除される条件
	           other:0, //その他（実数）
	           other_2:"", //その他（文字列）
	           effect:[0], //エフェクト
	           type_number:0
	        }
	    	//デフォルト値更新
	    	ex(i,dta[i],exData);
		    if(exData.effect[0] == 0) {
		       	if(exData.btype != 8) {
		       		BltDrw(ctx, exData.size, exData.btype, exData.color, exData.X, exData.Y, exData.dir,1);
		       		move(exData.speed,  exData.dir,i);
		       		exData.speed +=  exData.accele / 100;

		       	} else {
		       		BltDrw(ctx, exData.size, exData.btype, exData.color, exData.X, exData.Y, exData.dir,exData.other[1]);

		       		if(address[exData.ad] < 0) {
		       			exData.other[1] = 1;
		       			exData.other[0]--;
		       		}

		       	}
		       	exData.dir +=  exData.dir_accele /5;
		       	exData.down--;
		       	if( exData.down == 0 || address[exData.ad] < 0) special();
		    } else { eff(ctx); }
		    //データ更新
		    cp = Object.assign({}, exData);
		    dta[i] = cp;

		    if(condition(i,cp)) {
		       	dta.splice(i,1);
		        //console.log('delete');
		        length--;
		        i--;
		    }

		}
		for(let key in address) {
		    address[key]--;
		    if(address[key] <= -100) {
		    	delete address[key];
		   	} 	
		}
	}

	function pl_bullet(ctx) {
	  	let length = p_bullet.length;
	  	for(let i = 0; i < length; i++) {
	  		exData = {};
	  		exData.kakoY = p_bullet[i].Y;
	  		p_bullet[i].speed += 0.7;
	  		p_bullet[i].Y -= p_bullet[i].speed;
	  		ex(i,p_bullet[i],exData);
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
	  		if(exData.other[0] != undefined) exData.accele =  exData.other[0];
	  		if(exData.other[1] != undefined) exData.dir_accele =  exData.other[1];
	  		if(exData.other_2[0] != undefined) exData.color =  exData.other_2[0];
	  		break;
	  		case 2:
	  		add(0,{X:exData.X,Y:exData.Y,speed:0,type:[1,0],color:'#b000a3',ad:exData.enId + String(exData.bulletNumber),other:[0.2,0.1],other_2:['#516c7f'],btype:3,size:1,effect:[1,0]},1,0,rndm(0,360));
	  		exData.down = 20;
	  		break;
	  	}
	  	exData.type_number++;
	}
	function enemyAll(ctx) {
	    let length = enemy.length;
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
	           etype:'ad', //見た目
	           edir:0,//見た目(向き)
	           down:[-1,0], //typeの値を変えるタイミング
	           deletion:0, //削除される条件
	           bulletNumber:0,
	           changeCond:{},
	           typeNumber:0,
	           shooter:[{}],
	           hp:20,
	           collision:10,
	           other:[]
	        }
	    	ex(i,enemy[i],exData);
	    	tn = exData.typeNumber;
	    	EnmDrw(ctx,exData.size,exData.etype,exData.color,exData.X,exData.Y,exData.edir,1);
	    	exData.speed[tn] +=  exData.accele[tn] / 100;
	    	exData.dir[tn] +=  exData.dir_accele[tn] /5;
	       	exData.down[0]--;
	       	move(exData.speed[tn],exData.dir[tn],i);
	       	en_anim(exData.etype);
	       	if(changeCondition(exData['changeCond'][`cond${tn}`])) {
	       		tn++;
	       		arrayUpdate(exData.dir,tn);
	       		arrayUpdate(exData.speed,tn);
	       		arrayUpdate(exData.accele,tn);
	       		arrayUpdate(exData.dir_accele,tn);

	       	}
	       	//console.log(exData['changeCond'][`cond${tn}`]);
	       	exData.typeNumber = tn;
	       	if(exData.down[0] == 0) en_special(exData.type[tn],exData.shooter[tn]);
	       	collider();
	       	if(exData.hp < 0) {
	       		enemy.splice(i,1);
				length--;
				i--;
	       	}
	    	console.log(exData.hp);
	    	enemy[i] = exData;
	    }
	}

	function EnmDrw(ctx,siz,ty,cl,X,Y,di,alpha) {
		ctx.globalAlpha = alpha;
	   	switch(exData.etype) {
	    	default:
	    	ctx.beginPath();
	    	ctx.strokeStyle = cl;
	    	ctx.lineWidth = siz;
	    	ctx.moveTo(X + Math.cos(rad(di))*siz*10,Y + Math.cos(rad(di-90))*siz*10);
	    	ctx.lineTo(X + Math.cos(rad(di-90))*siz*10,Y + Math.cos(rad(di))*siz*-10);
	    	ctx.lineTo(X + Math.cos(rad(di))*siz*-10,Y + Math.cos(rad(di-90))*siz*-10);
	    	ctx.lineTo(X + Math.cos(rad(di-90))*siz*-10,Y + Math.cos(rad(di))*siz*10);
	    	ctx.closePath();
	    	ctx.stroke();
	    	break;
	    }
	    ctx.globalAlpha = 1;
	}

	function en_anim(num) {
		switch(num) {
			default:
			exData.edir +=  3;
		}
	}
	function en_special(num,dt) {
		switch(num) {
			case 1:
			let object = dt;
			if ( object.count === undefined ) object.count = 10;
			if ( object.rota === undefined ) object.rota = 36;
			if ( object.st_dir === undefined ) object.st_dir = exData.dir[tn];
			if ( object.rotaRate !== undefined) object.st_dir += object.rotaRate;
			if ( exData.other[0] == 1) {exData.other[1] *= -1; object.dir_accele = exData.other[1];}
			add(0,{color:object['color'],speed:object['speed'],type:n,accele:object['accele'],dir_accele:object['dir_accele'],down:object['down'],size:object['size'],type:object['type'],other:object['other'],btype:object['btype'],bulletNumber:exData.bulletNumber,Addval:object['Addval']},object['count'],object['rota'],object['st_dir']);
			break;
		}
		exData.bulletNumber++;
		exData.down[0] = exData.down[1];
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

			default:
			return exData.down[0] == 0;
			break;
		}
	}

	function add_enemy(object) { enemy.push(object); }

	function arrayUpdate(array,n,value){
		if(array[n] === undefined) {
			array[n] = array[n-1];
		}
	}

	function collider() {
		let length = p_bullet.length;
	  	for(let i = 0; i < length; i++) {
	  		if (distance(exData.X,exData.Y,p_bullet[i]['X'],p_bullet[i]['Y']) < exData.collision) {
	  			exData.hp--;
	  		}
	  	}
	}
	function effectAll() {
		exData = {
			X:0,
			Y:0,
			dir:0,
			speed:0,
			size:0,
			alpha:0,
			color:'ffffff',
			type:0
		}
		move(exData.speed,exData.dir,i);
		effect[i] = exData;
	}

	function addEffect() {

	}
	//add_enemy({X:300,Y:0,dir:90,speed:5,accele:-7,changeCond:{cond0:1,x0:300,y0:100,cond1:1,x1:300,y1:0},type:[0,1,0],down:[10,10]});
	//add(0,{speed:2,accele:0.5,dir_accele:1.0*n[1],type:[2,2,2,2,2,2,2],color:'#b000a3',size:30,btype:1,bulletNumber:n[2],down:20,other:[30,15],Addval:300,effect:[1,0]},8,45,n[0]);
	//add_enemy({X:300,Y:0});
	//add_enemy({X:300,Y:0,shooter:[{},{speed:3,accele:-4,down:60,other:[0.4],type:[1,0],rotaRate:10}],speed:[2,0,1],accele:[0.1,0,0.4],changeCond:{cond0:1,x0:300,y0:100,cond1:2,start1:0,goal1:300},type:[0,1,0],down:[20,20]},other:[1,1]);
	add_enemy({X:300,Y:0,other:[1,2],shooter:[{},{speed:2,accele:0.5,dir_accele:1.0*n[1],type:[2,2,2,2,2,2,2],color:'#b000a3',size:30,btype:1,bulletNumber:n[2],down:20,other:[30,15],Addval:300}],speed:[2,0,1],accele:[0.1,0,0.4],changeCond:{cond0:1,x0:300,y0:100,cond1:2,start1:0,goal1:800},type:[0,1,0],down:[250,250],hp:30});

}
