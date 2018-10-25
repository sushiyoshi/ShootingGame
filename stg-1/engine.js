//敵や敵が撃つ弾やレーザーを描画するメソッドを定義しているクラス..のはずだったのだが、このクラスに色々な処理を詰め込みすぎて最終的に意味の分からないものになってしまった。
class Func {
	constructor(array = null,def = null) {
		this.array = array;
		this.def = def;
	}
	//ステージ毎に呼び出される。テーマが変わるだけ。
	theme (color) {
		this.def['color'] = color
	}
	//ラジアン角
	rad(di) {
		return di/180*Math.PI;
	}
	//データを展開している。デフォルト値が代入されているexDataの値を定義している部分のみ書き換える。
	ex(object,object_2) {
		for(let k in object) {
 			let copy;
 			typeof object[k] !== 'object' ? copy = object[k] : copy = JSON.parse(JSON.stringify(object[k]));
 			copy !== undefined && (object_2[k] = copy);
 		}
	}
	//正規表現を使って色々してる
	RgEp(obj,pr) {
		let r;
		if(typeof obj[pr] === 'string') {
			let result = obj[pr].split(/,/);
			if(obj[pr].match(/^\w{4},-?\d{3},-?\d{3}$/)) {
				switch (result[0]) {
					case 'rndm':
					r = rndm(Number(result[1]),Number(result[2]));
					break;
					case 'mcos':
					result[1] = Number(result[1])+5;
					result[1] = keta(result[1],3);
					obj[pr] = obj[pr].replace(/-?\d{3},/,result[1] + ',');
					r = Math.cos(this.rad(Number(result[1])))*Number(result[2])
					break;
					case 'msin':
					result[1] = Number(result[1])+5;
					result[1] = keta(result[1],3);
					obj[pr] = obj[pr].replace(/-?\d{3},/,result[1] + ',');
					r = Math.sin(this.rad(Number(result[1])))*Number(result[2])
					break;
					case 'madd':
					r = exData[pr] + Number(result[1]);
					break;
					case 'angl':
					r = this.angle(exData.X,exData.Y,player.X,player.Y);
					break;
					case 'ange':
					r = this.angle(Number(result[1]),Number(result[2]),player.X,player.Y);
					break;
				}
				return r;
			} else if(obj[pr].match(/^#[a-z0-9]{6},#[a-z0-9]{6}$/)) {
				r = exData.bulletNumber % 2 == 0 ? result[0] : result[1];
				return r;
			}
		}
		return obj[pr];
	}
	//オブジェクトのプロパティ更新
	PrptUpdate () {
		exData.speed +=  exData.accele / 100;
	    exData.dir +=  exData.dir_accele /5;
		exData.interval[tn][0]--;
	}
	//移動
	move(dis,di,object) {
		object.X += Math.cos(this.rad(di))*dis;
		object.Y += Math.sin(this.rad(di))*dis;

		object.X = parseFloat(object['X'].toFixed(3));
		object.Y = parseFloat(object['Y'].toFixed(3));
	}
	//距離を求める
	distance(x1,y1,x2,y2) {
	 	return Math.sqrt(Math.pow(x2-x1,2) + Math.pow(y2-y1,2) )
	}
	//データ追加
	add(object,count,rota,ls = false,shift = 0) {
		let dt = object;
		dt.X === undefined && (dt.X = exData.X);
		dt.Y === undefined && (dt.Y = exData.Y);
		dt.enId === undefined && (dt.enId = exData.enId);
		dt.st_dir === undefined && (dt.st_dir = 0);
		shift === undefined && (shift = 0);
		if(dt.Addval != null && dt.bulletNumber !== undefined) {
			address[dt.enId + '-' + String(dt.bulletNumber)] = dt.Addval;
			delete dt.Addval;
		}
		dt.dir = 0;
		let direc = dt.st_dir;
		for(let j = 1; j <= count; j++) {
			dt.dir = direc;
			const copy = Object.assign({}, dt);
			this.move(shift,dt.dir,copy);
			ls ? this.laserAdd(copy) : this.bulletAdd(copy);
			direc += rota;
		}
	}
	//弾追加
	bulletAdd(cp) {
		number.bullet++;
		bullet[number.bullet] = cp;
	}
	//レーザー追加
	laserAdd(cp) {
		number.laser++;
		laser[number.laser] = cp;
	}
	//エフェクト追加
	addEffect(object) {
		number.effect++;
		effect[number.effect] = object;
	}
	//レーザー判定　線分と点の距離を求める
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
	//二つの座標から向きを求める
	angle(x,y,x2,y2) {
		let r = Math.atan2(y2 - y, x2 - x);
	 	return Math.floor(r * 360 / (2 * Math.PI));
	}
	//敵とプレイヤー弾のあたり判定　ここ改善の余地あり
	collider() {
	  	p_bullet.forEach(function(value) {
	  		if(this.distance(exData.X,exData.Y,value['X'],value['Y']) < exData.collision){exData.hp--; player['stageScore'][stage-1]+=100}
	  	},this);
	}
	//描画メソッド。beginPathとかの簡略化を狙ったんだけど可読性だめかな？
	draw(obj) {
		ctx.beginPath();
		let exD = {
			wid:2,//lineWidth
			fil_style:'#ffffff',//fillStyle
			st_style:'#ffffff',//strokeStyle
			st:false,//stroke();するかどうか
			fil:false,//fill();するどうか
			siz:exData.size,//大きさ
			alpha:1,//alpha
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
	 		//円の描画
	 		ctx.arc(exD.X,exD.Y,exD.siz,exD.start,exD.end,false);
	 	} else {
	 		//線の描画。線の場合の座標指定は配列にしている。
	 		moveTo(exD.X[0],exD.Y[0]);
	 		Object.keys(exD['X']).forEach(function(index) {
 				ctx.lineTo(exD.X[index],exD.Y[index]);
 			});
	 		exD.close && ctx.closePath();
	 	}
	 	exD.st && ctx.stroke();
	 	exD.fil && ctx.fill();
	}
	//クラスによって動作が微妙に違うので、よくオーバーライドされるメソッド
	dr() {
		this.PrptUpdate();
		this.DrawingMethod(exData.size,exData.costume,exData.color,exData.X,exData.Y,exData.dir,exData.alpha,exData.width);
		this.move(exData.speed,exData.dir,exData);
	}
	//敵や弾の描画方法を設定している
	DrawingMethod (siz,ty,cl,X,Y,di,alpha,wid,circle = false) {
		ctx.globalAlpha = alpha;
	 	switch(ty) {
			//弾
	 		case 'bullet':
	 		this.draw({wid:siz*1.2,st_style:cl,st:true,fil:true,alpha:alpha});
	 		touchBul = this.distance(player.X,player.Y,X,Y) < siz*1.3;
	 		this.graze(this.distance(player.X,player.Y,X,Y) > siz*1.3 && this.distance(player.X,player.Y,X,Y) < siz*15);
	 		break;
			//大玉
	 		case 'big_bullet':
	 		this.draw({wid:siz*0.5,st:true});
	 		this.draw({wid:siz*0.8,st_style:cl,st:true,alpha:0.8,siz:siz*0.7});
	 		touchBul = this.distance(player.X,player.Y,exData.X,exData.Y) < siz;
	 		this.graze(this.distance(player.X,player.Y,X,Y) > siz && this.distance(player.X,player.Y,X,Y) < siz*5.5);
	 		break;
			//星型弾
	 		case 'star_bullet':
	 		exData.dir_2+=exData.speed;
	 		this.DrawingMethod (siz,'star',cl,X,Y,exData.dir_2,1,wid);
	 		this.DrawingMethod (siz*0.8,'star',cl,X,Y,exData.dir_2,0.7,wid);
	 		this.draw({siz:siz*4,st:true,alpha:0.6,wid:siz*2});
	 		this.draw({siz:siz*3,fil:true,alpha:1});
	 		touchBul = this.distance(player.X,player.Y,X,Y) < siz*6;
	 		this.graze(this.distance(player.X,player.Y,X,Y) > siz*6 && this.distance(player.X,player.Y,X,Y) < siz*15);
	 		break;
			//変な弾
	 		case 'strange':
	 		this.draw({wid:siz*1.2,st_style:cl,st:true,X:X + Math.cos(di/180*Math.PI)*3,Y:Y + Math.sin(di/180*Math.PI)* 3,siz:siz*2,start:(di-90)/180*Math.PI,end:(di+90)/180*Math.PI});
	 		this.draw({wid:siz*1.2,st:true,fil:true});
	 		touchBul = this.distance(player.X,player.Y,exData.X,exData.Y) < siz*1.4;
	 		this.graze(this.distance(player.X,player.Y,X,Y) > siz*1.4 && this.distance(player.X,player.Y,X,Y) < siz*3.5);
	 		break;
			//レーザー
	 		case 'laser':
	 		//touchLs = this.dis_laser(player.X,player.Y,X,Y,X + Math.cos(this.rad(di))*400,Y + Math.sin(this.rad(di))*400) < wid*1.5;
	 		touchLs = isCrossLines({x:X,y:Y},{x:X + Math.cos(this.rad(di))*400,y:Y + Math.sin(this.rad(di))*400},{x:player.X+player.spX/2,y:player.Y+player.spY/2},{x:player.X-player.spX/2,y:player.Y-player.spY/2});
	 		tn == 1 && this.graze(this.dis_laser(player.X,player.Y,X,Y,X + Math.cos(this.rad(di))*400,Y + Math.sin(this.rad(di))*400) < wid*1.5 && this.dis_laser(player.X,player.Y,X,Y,X + Math.cos(this.rad(di))*400,Y + Math.sin(this.rad(di))*400) < wid*20,false);
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
			//四角形の敵
	 		case 'enemy':
	 		this.draw({alpha:alpha,wid:siz*1.5,st_style:cl,st:true,close:true,circle:false,X:[X + Math.cos(this.rad(di))*siz*10,X + Math.cos(this.rad(di-90))*siz*10, X + Math.cos(this.rad(di))*siz*-10, X + Math.cos(this.rad(di-90))*siz*-10],Y:[Y + Math.cos(this.rad(di-90))*siz*10,Y + Math.cos(this.rad(di))*siz*-10,Y+Math.cos(this.rad(di-90))*siz*-10,Y + Math.cos(this.rad(di))*siz*10]});
	 		this.draw({alpha:alpha,wid:siz*1.5,fil_style:'#000000',siz:siz*3,st:true,fil:true,X:X,Y:Y});
			break;
			//四角形の敵が壊れた感じのやつ
			case 'enemy_2':
			this.draw({alpha:alpha,wid:siz*1.5,st_style:cl,st:true,close:true,circle:false,X:[X + Math.cos(this.rad(di))*siz*10,X + Math.cos(this.rad(di-90))*siz*10,X + Math.cos(this.rad(di-135))*siz*10],Y:[Y + Math.cos(this.rad(di-90))*siz*10,Y + Math.cos(this.rad(di))*siz*-10,Y + Math.cos(this.rad(di))*siz*10]});
			this.draw({alpha:alpha,wid:siz*1.5,st_style:cl,st:true,close:true,circle:false,X:[X + Math.cos(this.rad(di))*siz*-10,X + Math.cos(this.rad(di-90))*siz*-10,X + Math.cos(this.rad(di-135))*siz*-10],Y:[Y + Math.cos(this.rad(di-90))*siz*-10,Y + Math.cos(this.rad(di))*siz*10,Y + Math.cos(this.rad(di))*siz*-10]});
			/*
			this.draw({alpha:alpha,wid:siz*1.5,st_style:cl,st:true,close:true,circle:false,X:[X + Math.cos(this.rad(di))*siz*10,X + Math.cos(this.rad(di-90))*siz*10,X + Math.cos(this.rad(di))*siz*10],Y:[Y + Math.cos(this.rad(di-90))*siz*10,Y + Math.cos(this.rad(di))*siz*-10,Y + Math.cos(this.rad(di))*siz*10]});
			this.draw({alpha:alpha,wid:siz*1.5,st_style:cl,st:true,close:true,circle:false,X:[X + Math.cos(this.rad(di))*siz*-10,X + Math.cos(this.rad(di-90))*siz*-10,X + Math.cos(this.rad(di))*siz*-10],Y:[Y + Math.cos(this.rad(di-90))*siz*-10,Y + Math.cos(this.rad(di))*siz*10,Y + Math.cos(this.rad(di))*siz*-10]});
			*/
			this.draw({alpha:alpha,wid:siz*1.5,fil_style:'#000',fil:true,st:true,siz:siz*3});
			break;
			//星型敵　後ろで逆回転してる星有
			case 'enemy_3':
			this.DrawingMethod (siz,'star',cl,X,Y,di,alpha,wid);
			this.DrawingMethod (siz*1.5,'star',cl,X,Y,di,0.7,wid);
			this.DrawingMethod (siz*1.5,'star',cl,X,Y,di*-1,0.7,wid);
			this.draw({alpha:alpha,wid:siz*3.6,fil_style:'#000000',siz:siz*3,st:true,fil:true,X:X,Y:Y});
			break;
			//星型敵　後ろで逆回転してる星なし
			case 'enemy_4':
			this.DrawingMethod (siz,'star',cl,X,Y,di,alpha,wid);
			this.DrawingMethod (siz*1.5,'star',cl,X,Y,di,0.7,wid);
			this.draw({alpha:alpha,wid:siz*3.6,fil_style:'#000000',siz:siz*3,st:true,fil:true,X:X,Y:Y});
			break;
			//2面ボス
			case 'star_boss':
			this.DrawingMethod (siz,'star',cl,X,Y,di,alpha,wid);
			this.DrawingMethod (siz*1.5,'star',cl,X,Y,di,alpha,wid);
			this.DrawingMethod (siz*2.0,'star','#008400',X,Y,di,alpha,wid);
			this.DrawingMethod (siz*2.0,'star','#008400',X,Y,di*-1,0.7,wid);
			this.draw({alpha:alpha,wid:siz*3.6,fil_style:'#000000',siz:siz*3,st:true,fil:true,X:X,Y:Y});
			break;
			//星
			case 'star':
			this.draw({alpha:alpha,wid:siz*1.5,st_style:cl,st:true,close:true,circle:false,X:[X + Math.cos(this.rad(di))*siz*10,X + Math.cos(this.rad(di+144))*siz*10, X + Math.cos(this.rad(di+288))*siz*10, X + Math.cos(this.rad(di+432))*siz*10,X+Math.cos(this.rad(di+576))*siz*10],Y:[Y + Math.sin(this.rad(di))*siz*10,Y + Math.sin(this.rad(di+144))*siz*10,Y+Math.sin(this.rad(di+288))*siz*10,Y + Math.sin(this.rad(di+432))*siz*10,Y + Math.sin(this.rad(di+576))*siz*10]});
			break;
			//矩形
			case 'square':
			this.draw({wid:wid,st_style:cl,siz:siz,st:true,close:true,circle:false,X:[X + Math.cos(this.rad(di))*siz,X + Math.cos(this.rad(di-90))*siz, X + Math.cos(this.rad(di))*siz*-1, X + Math.cos(this.rad(di-90))*siz*-1],Y:[Y + Math.cos(this.rad(di-90))*siz,Y + Math.cos(this.rad(di))*siz*-1,Y+Math.cos(this.rad(di-90))*siz*-1,Y + Math.cos(this.rad(di))*siz]});
			break;
			//円
			case 'circle':
			this.draw({wid:wid,st_style:cl,st:true,siz:siz});
			break;
			//判定なしの弾
			case 'bullet_circle':
	 		this.draw({wid:siz*1.1,st_style:cl,st:true,fil:true,siz:siz,alpha:alpha});
	 		break;
			//ボス前の演出　WARNING
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
			this.draw({circle:false,X:[20,400],Y:[Y-siz,Y-siz],cl:theme,st:true,st_style:'#f00'});
			this.draw({circle:false,X:[20,400],Y:[Y-siz*1.3,Y-siz*1.3],st:true,st_style:'#f00'});
			break;
			case 'bomb':
			exData.dir+=(500-siz)/80;
			bombInfo.X = exData.X;
			bombInfo.Y = exData.Y;
			bombInfo.size = exData.size_2[1];
			func.draw({circle:false,st:true,cl:'#fff',wid:5,close:true,
				X:[X+Math.cos(this.rad(di))*siz,X+Math.cos(this.rad(di+45))*siz,X+Math.cos(this.rad(di+90))*siz,X+Math.cos(this.rad(di+135))*siz,X+Math.cos(this.rad(di+180))*siz,X+Math.cos(this.rad(di+225))*siz,X+Math.cos(this.rad(di+270))*siz,X+Math.cos(this.rad(di+315))*siz],
				Y:[Y+Math.sin(this.rad(di))*siz,Y+Math.sin(this.rad(di+45))*siz,Y+Math.sin(this.rad(di+90))*siz,Y+Math.sin(this.rad(di+135))*siz,Y+Math.sin(this.rad(di+180))*siz,Y+Math.sin(this.rad(di+225))*siz,Y+Math.sin(this.rad(di+270))*siz,Y+Math.sin(this.rad(di+315))*siz],
			});
			func.draw({circle:false,st:true,cl:'#fff',wid:5,close:true,
				X:[X+Math.cos(this.rad(di*-1))*siz,X+Math.cos(this.rad(di*-1+45))*siz,X+Math.cos(this.rad(di*-1+90))*siz,X+Math.cos(this.rad(di*-1+135))*siz,X+Math.cos(this.rad(di*-1+180))*siz,X+Math.cos(this.rad(di*-1+225))*siz,X+Math.cos(this.rad(di*-1+270))*siz,X+Math.cos(this.rad(di*-1+315))*siz],
				Y:[Y+Math.sin(this.rad(di*-1))*siz,Y+Math.sin(this.rad(di*-1+45))*siz,Y+Math.sin(this.rad(di*-1+90))*siz,Y+Math.sin(this.rad(di*-1+135))*siz,Y+Math.sin(this.rad(di*-1+180))*siz,Y+Math.sin(this.rad(di*-1+225))*siz,Y+Math.sin(this.rad(di*-1+270))*siz,Y+Math.sin(this.rad(di*-1+315))*siz],
			});
			
			break;
			case 'text':
			ctx.rotate(this.rad(exData.tdir));
			ctx.font = exData.font;
			ctx.textAlign = exData.algin;
			ctx.globalAlpha = alpha;
			ctx.lineWidth = wid;
			ctx.fillStyle = cl;
			exData.bake > 0 ?  ctx.fillText(bake(exData.text.length),X,Y) : ctx.fillText(exData.text,X,Y);
			ctx.rotate(this.rad(exData.tdir*-1));
			break;
	 	}
		//細長い弾。costumeに数字が入れられている時はこちらとみなす。数字がでかいほど弾は細長くなる。
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
	//グレイズしたときの処理
	graze(bool,g = true) {
		if(bool && exData.graze && player.ghost <= 0) {
	 		player.graze++;
	 		player.stageScore[stage-1] += 10;
	 		audioElem['graze'].load();
	 		audioElem['graze'].play();
	 		g && (exData.graze = false);
		}
	}
	//弾や敵の動きが変化する条件。
	changeCondition(num) {
		let object = exData['changeCond'][tn];
		switch (num) {
			//指定された座標に移動したら
			case 1:
			return this.distance(object['x'], object['y'],exData.X,exData.Y) < exData.speed*1.7;
			break;
			//一定時間が過ぎたら
			case 2:
			object['down']--;
			return 0 >= object['down'];
			break;
			//hpが指定された値より少なくなったら
			case 3:
			return object['hp'] > exData.hp;
			break;
			//指定されたx座標y座標いずれかに相当したら
			case 4:
			return Math.abs(object['x']- exData.X) < 5 || Math.abs(object['y']- exData.Y) < 5;
			break;
			//所持しているアドレスの値が0より小さくなったら
			case 5:
			return address[exData.ad] < 0;
			//枠の外側に出たら
			default:
			return exData.X > 410 || exData.X < 0 || exData.Y < 0 || exData.Y > canvas.height;
			break;
		}
	}
	//プレイヤーと弾、レーザーの判定
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
	//アドレスの値を更新
	addressUpdate() {
		for(let key in address) {
		    address[key]--;
		    (address[key] <= -100) && (delete address[key]);
		    if (address[key] == 0) { audioElem['address'].load(); audioElem['address'].play(); }
		}
	}
	//敵が弾やレーザーを撃つときの処理
	AddProcessing(object) {
		object.count === undefined  && (object.count = 10);
		object.rota === undefined && (object.rota = 36);
		object.color === undefined && (object.color = exData.color);
		object.st_dir === undefined && (object.st_dir = exData.dir);
		object.zikimuke && (object.st_dir = this.angle(exData.X,exData.Y,player.X,player.Y));
		object.rotaRate !== undefined && (object.st_dir += object.rotaRate);
		object.cycle === undefined && (object.cycle = 1);
		object.laser === undefined &&  (object.laser = false);
		if( object.reverse !== undefined) {
			object.reverse *= -1;
			object.laser ? object['changeCond'][0]['dir_accele'] = object.reverse : object.dir_accele = object.reverse;
		}
		exData.bulletNumber % object.cycle == 0 && this.add({changeCond:object['changeCond'],chase:object['chase'],deleteMessage:object['deleteMessage'],enId:object['enId'],color:this.RgEp(object,'color'), speed:object['speed'],accele:object['accele'], dir_accele:this.RgEp(object,'dir_accele'), interval:object['interval'], size:object['size'], type:object['type'], costume:object['costume'], bulletNumber:exData.bulletNumber, Addval:object['Addval'],width:object['width'],X:object['X'],Y:object['Y'],dir_2:object['dir_2'],st_dir:this.RgEp(object,'st_dir')}, object['count'], object['rota'],object['laser'],object['shift']);
	}
	delete(array,index) {}
	constant() {}
}

//描画ベースクラス。敵や弾の描画はこれを継承して行われる。
class drawAll extends Func {
	constructor(array,def) {
		//デフォルト値問題の名残。デバッグしやすいのでそのままにしてる
	    console.log(super(array,def));
	}
	//processingメソッドのをデータの数だけ処理している
	loop() {
		//削除するデータの要素番号を格納する場所
		let deleteList = [];
		Object.keys(this.array).forEach(function (value,index,array) {
			//参照渡し防止
			const copy = JSON.parse(JSON.stringify(this.def));
			this.processing(value,index,array,copy,deleteList,this.array);
		},this);
		this.organize(deleteList);
	}
	processing(value,index,array,defau,deletelist,this_array) {
		//exDataにデフォルト値を代入
		exData = defau;
		//オブジェクトのデータをexDataに展開
		super.ex(this_array[value],exData);
		//exData.typeNumberといちいち記述するのめんどい
		tn = exData.typeNumber;
		//chaseがtrueの時自機を追いかける
       	exData['changeCond'][tn]['chase'] && (exData.dir = this.angle(exData.X,exData.Y,player.X,player.Y));
       	//drawAllを継承したクラスがこの空メソッドをオーバーライドして特別な処理をする。無理やり多態性を実装。
       	typeof this.special !== 'undefined' && this.special();
       	this.dr();
       	if(exData.interval[tn][0] == 0) {
       		//任意の間隔で行われる処理。この処理もクラスによって違う。
       		exData.interval[tn][0] = exData.interval[tn][1];
       		typeof this.constant !== 'undefined' && this.constant();
       	}
       	if(super.changeCondition(exData['changeCond'][tn]['cond'])) {
       		//任意の条件になったら、指定された値が更新される。
       		/*
       		例:

       		[{cond:4,y:40,speed:0},{cond:2,down:100,speed:4},{cond:0}]

       		0:y座標が40になるまで移動。40まで移動したらspeedを0にする（←ここわかりにくいから後悔してる）
       		1:100フレーム待つ、100フレーム後にspeedに4が代入。
       		2:画面端まで行ったら削除される。

       		tn番目の要素が処理される。
       		*/
       		exData['changeCond'][tn]['color'] !== undefined && (exData.color = exData['changeCond'][tn]['color']);
       		exData['changeCond'][tn]['speed'] !== undefined && (exData.speed = exData['changeCond'][tn]['speed']);
       		exData['changeCond'][tn]['accele'] !== undefined && (exData.accele = exData['changeCond'][tn]['accele']);
       		//正規表現により元の値に任意の値を足したものを代入することができる。
       		exData['changeCond'][tn]['dir'] !== undefined && (exData.dir = this.RgEp(exData['changeCond'][tn],'dir'));
       		exData['changeCond'][tn]['costume'] !== undefined && (exData.costume = exData['changeCond'][tn]['costume']);
       		exData['changeCond'][tn]['dir_accele'] !== undefined && (exData.dir_accele = exData['changeCond'][tn]['dir_accele']);
       		exData['changeCond'][tn]['dir_accele_2'] !== undefined && (exData.dir_accele_2 = exData['changeCond'][tn]['dir_accele_2']);
       		exData['changeCond'][tn]['delAll'] && (deleteAll = exData.enId);
       		//最後の条件となったら削除リストに追加
       		exData['changeCond'][tn+1] === undefined ? deletelist.push(value) : tn++;
       	}
       	//tnの値をexData.typeNumberさんにきちんとお返しする。
       	exData.typeNumber = tn;
       	//changeCond以外に消す条件を定義する時にオーバーライドする。
       	this.delete(deletelist,value);
       	//オブジェクトのデータを更新
       	this_array[value] = exData;
	}
	//deleteListに入れられてる要素を削除する
	organize(arr) {
		arr.forEach(function(value) {
			delete this.array[value];
		},this);
	}
}
//↓ここくそポイント
var func = new Func();

//乱数
function rndm(min,max) {
	return Math.floor(Math.random() * max) + min;
}

//非同期処理　sec秒待つ
function sleepByPromise(sec) {
	return new Promise(resolve => setTimeout(resolve, sec*1000));
}

//sec秒後に敵を出現させる
async function add_enemy(object,sec = 0){
	await sleepByPromise(sec);
	//ボスかどうか
	object['boss'] && (boss = true);
	number.enemy++;
	//ここはアドレスに敵の名前を入れようかと思ったけど未実装。etypeなんてプロパティ使ってません。そのため的や弾が所持している全てのアドレスはad-...で始まる。
	if(object.etype === undefined) object.etype = 'ad';
	object.enId = object.etype + '-' + number.enemy;
	enemy[number.enemy] = object;
}
//sec秒後に音を鳴らす
async function bgm(sec = 0,name) {
	await sleepByPromise(sec);
	audioElem['bgm'].pause();
	audioElem['bgm'] = new Audio(name);
	audioElem['bgm'].loop = 'true';
	audioElem['bgm'].play();
}
//弾の描画クラス drawAllを継承。
class en_bulletAll extends drawAll {
	special() {
		switch(exData.effect[0]) {
			//弾が出現する時のエフェクト　強引な実装方法は気にしないで
	  		case 1:
	  		super.DrawingMethod(exData.size * (15-exData.effect[1])/5, exData.costume, exData.color, exData.X, exData.Y, exData.dir,exData.effect[1]/10);
	  		exData.effect[1]+= 0.1;
	  		if(exData.effect[1]>10) exData.effect[0] = 0;
	  		break;
	  	}
	  	if(exData.deru) {
	  		//弾が出現する時の波紋？
	  		this.addEffect({dir:exData.dir,costume:'bullet_circle',X:exData.X,Y:exData.Y,color:exData.color,size:[exData.size,exData.size*2,exData.size*5],alpha:[0,1,0],changeCond:[{cond:2,down:1},{cond:2,down:5},{cond:2,down:50}]});
	  		exData.deru = false;
	  	}
	  	//判定
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
		//弾から弾だす処理です。普通にAddProcessingをオーバーライドすれば楽だし見やすかったんだろうけどなぜそうしなかったんだろうか
		switch(exData.type[tn]) {
			//1面ボス2個目の弾幕-1
			case 1:
			this.add({X:exData.X,Y:exData.Y,st_dir:rndm(0,360),deleteMessage:true,speed:0,color:theme,ad:exData.enId + '-' + String(exData.bulletNumber),dir_accele:0.1,costume:0,size:1.5,effect:[1,0],changeCond:[{cond:5,accele:0.5,color:'#516c7f'},{cond:0}]},1,0);
			break;
			//2-1-1
			case 2:
			this.add({deleteMessage:true,color:exData.color,costume:exData.costume,X:exData.X,Y:exData.Y,deleteMessage:true,speed:0,size:exData.size,ad:exData.enId + '-' + String(exData.bulletNumber),changeCond:[{cond:5,speed:5*(1+(exData.speed == 2)*0.6),accele:-9*(1+(exData.speed == 2)*0.6),dir:exData.dir_2},{cond:2,down:50,speed:0,accele:0.5,dir_accele:2,dir:Math.cos(this.rad(exData['changeCond'][tn]['down']/70*180))*90+exData.dir+90},{cond:2,down:50,dir_accele:0},{cond:0}]},1,0);
			break;
			//2-2-1
			case 3:
			this.add({deleteMessage:true,X:exData.X,Y:exData.Y,st_dir:rndm(0,360),deleteMessage:true,speed:0,color:exData.color,ad:exData.enId + '-' + String(exData.bulletNumber),dir_accele:0.1,size:exData.size,changeCond:[{cond:5,accele:0.7,color:'#516c7f'},{cond:0}]},1,0);
			break;
			//2-2-2
			case 4:
			audioElem['star_crash'].load();
			audioElem['star_crash'].play();
			if(exData.size > 5) {
				for(let i = 0; i<4; i++) {
					//敵のIDを渡してる
					let result = exData.enId.split(/-/);
					exData.enId =`${result[0]}-${Number(result[1])+10}`;
					this.add({deleteMessage:true,bulletNumber:exData.bulletNumber,X:exData.X,Y:exData.Y,st_dir:rndm(0,360),color:themeList[rndm(0,3)],deleteMessage:true,costume:'star_bullet',size:exData.size-2,count:1,Addval:100,enId:exData.enId,speed:1,accele:3,type:[0,3,4],changeCond:[{cond:2,down:20},{cond:0},{cond:2,down:100}],interval:[[0,0],[10,20],[1,100]]},1,0);
				}

			}
			this.addEffect({dir:exData.dir,costume:'bullet_circle',X:exData.X,Y:exData.Y,color:exData.color,size:[exData.size,exData.size*10,exData.size*50],alpha:[0,1,0],changeCond:[{cond:2,down:1},{cond:2,down:5},{cond:2,down:50}]});
			break;
		}
	}
	delete(array,index) {
		//親（その弾を撃った敵）が倒されたかつdeleteMessageが真なら、または全削除命令を受けた時削除
		if(exData.deleteMessage && deleteAll == exData.enId || index <= number.bulletdel || (player.bomb > 0 && this.distance(exData.X,exData.Y,bombInfo.X,bombInfo.Y)< bombInfo.size)) {
			array.push(index);
			this.addEffect({costume:'circle',X:exData.X,Y:exData.Y,size:[1,exData.size*2],width:[exData.size*20,0],color:exData.color,dir:0});
		}
	}
}
//敵の描画クラス
class enemyAll extends drawAll {
	special() {
		//敵の回転
		switch(exData.costume) {
			default:
			exData.speed == 0 ? exData.edir +=  5/exData.size : exData.edir += exData.speed;
			break;
		}
		super.collider();
		if(exData.boss) {
			//ボスの場合
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
		//hpがなくなった時または全削除命令を受けた時
		if(exData.hp < 0 || index <= number.enemydel || (player.bomb > 0 && !exData.boss && this.distance(exData.X,exData.Y,bombInfo.X,bombInfo.Y)< bombInfo.size)) {
			if(exData.hp < 0) player['stageScore'][stage-1]+=exData.score;
			deleteAll = exData.enId;
			array.push(index);
			this.addEffect({X:exData.X,Y:exData.Y,size:[1,exData.size*10],width:[exData.size*100,0],color:exData.color,dir:exData.edir});
       		this.addEffect({X:exData.X,Y:exData.Y,size:[1,exData.size*20],width:[exData.size*200,0],color:exData.color,dir:0});
       		audioElem['enemy_crash'].load();
       		audioElem['enemy_crash'].play();
       		if(exData.boss) {
       			StageEnd();
       			this.addEffect({costume:'circle',X:exData.X,Y:exData.Y,size:[1,exData.size*50],width:[exData.size*500,0],color:exData.color,dir:exData.edir});
       			this.addEffect({costume:'circle',X:exData.X,Y:exData.Y,size:[1,exData.size*100],width:[exData.size*1000,0],color:exData.color,dir:0});
       		}
		}
	}
	constant() {
		switch(exData.type[tn]) {
			case 1:
			//弾を撃つ
			exData.audio && audioElem['enemy_shot'].play();
			exData.shooter[tn].forEach(function(value) {
				this.AddProcessing(value);
			},this);
			break;
		}
		//bulletNumberは弾がいつ撃たれたかを表しているので、アドレスを表現する時の重大な要素となっている。
		exData.bulletNumber++;
	}
}
class laserAll extends drawAll {
	special() {
		/*
		このstgのレーザーは予告線式である。
		tnが0のとき:予告線
		1:出てる←このときだけ判定が働く
		2:出し終わって消えてる
		*/
		if (tn == 0) {exData.alpha = 0.4};
		if( tn == 1){
			/*
			なぜかここの判定がはたらかず、当たっているのにすり抜けてしまうことがある。
			移動速度が原因かと思っていたが、止まっている状態のすり抜けバグも見受けられるので何か別に原因があるのではないかと考えていたり。
			どこかでtnの値が書き換わってる可能性が微レ存？
			最悪バグではなく仕様で押し通すつもり
			*/
			this.colid(touchLs);
			exData.alpha = 1;
			if(exData.shot) {
				audioElem['laser'].play();
				exData.shot=false;
			}
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
		if(exData.deleteMessage && deleteAll == exData.enId || index <= number.laserdel || player.bomb > 0) {exData.typeNumber = 2; exData.alpha = 1;}
	}
}

//エフェクト描画。敵撃破時の爆風とかボス前のwarningとか色々。
class effectAll extends drawAll {
	PrptUpdate() {
		exData.width_2[0] = exData.width[tn] - exData.width_2[1];
		exData.width_2[1] += exData.width_2[0]/exData.ch_speed;
		exData.size_2[0] = exData.size[tn] - exData.size_2[1];
		exData.size_2[1] += exData.size_2[0]/exData.ch_speed;
		exData.alpha_2[0] = exData.alpha[tn] - exData.alpha_2[1];
		exData.alpha_2[1] += exData.alpha_2[0]/exData.ch_speed;
		exData.tdir +=  exData.dir_accele /5;
		exData.speed +=  exData.accele / 100;
		exData.dir_accele += exData.dir_accele_2/5;
	}
	dr() {
		this.PrptUpdate();
		this.DrawingMethod(exData.size_2[1],exData.costume,exData.color,exData.X,exData.Y,exData.dir,exData.alpha_2[1],exData.width_2[1]);
		this.move(exData.speed,exData.dir,exData);
	}
	special() {
		switch(exData.costume) {
			case 'warning':
			exData.dir += 0.1;
			exData.alpha_2[1] =  Math.abs(Math.cos(exData.dir));
			break;
			case 'text':
			if(typeof exData.bake !== 'undefined') {
				exData.bake--;
				exData.interval[tn][0] += exData.interval[tn][1];
				if(exData.bake <= 0 && rndm(0,exData.interval[tn][0]) == 0) {
					exData.bake = rndm(1,5);
				}
			}
			break;

		}
	}
}
