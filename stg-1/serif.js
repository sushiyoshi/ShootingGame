function serifAll() {
	ctx.textAlign = "start";
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
	if(!(SerifElem.bake > 0 && rndm(0,10) == 0)){
		wireless(440,285,Math.floor(SerifElem.length % 8 / 4));
	}

}
function isHanEisu(str) {
	str = (str==null)?"":str;
	if(str.match(/^[a-z0-9]*$/))
		return true;
	else
		return false;
}
async function SerifSet(sec = 0) {
	await sleepByPromise(sec);
	audioElem['noise'].play();
	SerifElem.num++;
	SerifElem.length = 1;
	let l = Serif[SerifElem.num]['str'].length;
	let s = Serif[SerifElem.num]['speed'];
	for(let a = 0; a < l; a++) {feed(a*s,'length',SerifElem);}
	SerifElem.num < Serif.length && SerifSet(Serif[SerifElem.num]['wait']);
}

function serifData(p) {
	SerifElem = {num:-1,length:1,r:"",max:14,bake:0,waku:320,waku_2:180};
	Serif = [];
	switch(p) {
		case 1:
		addSerif({str:"・・・さてと通信は繋がったかな。",wait:3,speed:0.05});
		addSerif({str:"こちらアンドウ、アンドウ、応答せよ。",wait:3,speed:0.03});
		addSerif({str:"...よし、応答があった。",wait:2,speed:0.03});
		addSerif({str:"AIナンバー010君。/さっそくですまないが、君に新種のコンピュータウイルスWin killer meの駆除を頼みたい。",wait:6,speed:0.02});
		addSerif({str:"君の持っているワクチンバスターでウイルスを無力化するのは可能だが、",wait:5,speed:0.02});
		addSerif({str:"相手の能力が未知数なうえに、急造品のためバスターの出力が弱い。",wait:5,speed:0.02});
		addSerif({str:"君自身がウイルスに感染しないよう気をつけてくれ。",wait:4,speed:0.02});
		addSerif({str:"では健闘を祈る。",wait:3,speed:0.02});
		break;
		case 'boss1':
		addSerif({str:"このあたりは特にウイルスの反応が高い。十分に注",wait:1.15,speed:0.05});
		addSerif({str:bake(12),wait:0.3,speed:0.01,shake:true});
		addSerif({str:"ど、どうした。応答してくれ",wait:1,speed:0.01,shake:true});
		addSerif({str:"接続がタイムアウトになりました。",wait:2,speed:0.02,shake:true,color:'#00ff00',bake:true});
		addSerif({str:"直ちに敵の情報をスキャンします。",wait:2,speed:0.02,shake:true,color:'#00ff00',bake:true});
		break;
		case 2:
		addSerif({str:"ネットワークが回復しました。",wait:1,speed:0.02,color:'#00ff00'});
		addSerif({str:"...大丈夫か？",wait:0.5,speed:0.01});
		addSerif({str:"得に異常はなさそうだな。",wait:1,speed:0.03});
		addSerif({str:"ネットワークにウイルスが侵入するとは私が考えていたよりウイルスの影響を受けていたようだな。",wait:6,speed:0.02});
		addSerif({str:"新しい武器と回線の耐ウイルスプログラムを送る。",wait:6,speed:0.02});
		addSerif({str:"少しでも役に立ててくれ。",wait:3,speed:0.02});
		addSerif({str:"兵装「ワクチンデストロイヤー」プログラムをインストールしました。",wait:4,speed:0.02,color:'#00ff00'});
		break;
		case 'boss2':
		addSerif({str:"非常に高いウイルス反応がある。",wait:2,speed:0.03});
		addSerif({str:"さっきのものと少し似ているが微妙に違う。",wait:2,speed:0.03});
		addSerif({str:"おそらく前回戦った時の敵よりも能力が高い個体だ。",wait:2,speed:0.03});
		addSerif({str:"十分に気をつけてくれ。",wait:2,speed:0.03});
		break;
		case 3:
		addSerif({str:"ここはウイルスの汚染濃度が高い。",wait:3,shake:true,speed:0.03});
		addSerif({str:"おそらく通信できるのもここまでだろう。",wait:3,speed:0.03,bake:true,shake:true});
		addSerif({str:"ここからはサポートできなくなると思うが。",wait:3,speed:0.03,bake:true,shake:true});
		addSerif({str:"ここまでいけた君ならできるはずだ。",wait:3,speed:0.03,bake:true,shake:true});
		addSerif({str:"健闘を祈る。",wait:0.5,speed:0.03,bake:true,shake:true});
		addSerif({str:bake(12),wait:1,speed:0.01,bake:true,shake:true});
		addSerif({str:"接続がタイムアウトになりました。",wait:5,speed:0.02,color:'#00ff00'});
		break;
		case 'end':
		addSerif({str:"ウイルス検査中...",wait:4,speed:0.03,color:'#00ff00'});
		addSerif({str:"ウイルス反応消失",wait:1,speed:0.03,color:'#00ff00'});
		addSerif({str:"マザーウイルス Win killer meの駆除を確認",wait:2,speed:0.03,color:'#00ff00'});
		addSerif({str:"AIプログラムをウイルスソフトにスキャンします...",wait:3,speed:0.03,color:'#00ff00'});
		addSerif({str:"AIプログラムに異常は見つかりませんでした。",wait:4,speed:0.03,color:'#00ff00'});
		addSerif({str:"どうやら異常はないみたいだ。",wait:3,speed:0.03});
		addSerif({str:"急造品の武器だけで決行した無茶な作戦だったが、よくここまで戦ってくれた。",wait:3,speed:0.03});
		addSerif({str:"これでウイルスの脅威も去った。",wait:3,speed:0.03});
		addSerif({str:"これから君の回収に入る。",wait:3,speed:0.03});
		addSerif({str:"お疲れ様。",wait:3,speed:0.03});
		break;

	}
	SerifSet();
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
function addSerif(obj) {
	obj['shake'] === undefined && (obj['shake'] = false);
	obj['color'] === undefined && (obj['color'] = '#fff');
	//obj['color'] === undefined && (obj['color'] = '#eab500');
	obj['shake'] === undefined && (obj['shake'] = false);
	Serif.push(obj);
}

function bake(length) {
	let s = "";
	let c = ['樺','・','ェ','霊','-','喧','∆','代','ｯ','ﾕ','→','励','被','ｨ','ｩ','繕','√','w','徐','惑','ｱ','譁','ｭ','怜','縺','縺','縲','枚','蟄','繝','峨'];
	for(let i = 0; i < length; i++) {
		s += c[rndm(0,c.length-1)];
	}
	return s;
}
function serifDisplay(n,l) {
	for(let i = 0; i < l; i++) SerifElem.r += Serif[n]['str'][i];
}
async function feed(sec = 0,pr,obj) {
	await sleepByPromise(sec);
	obj[pr]++;
}
function wireless(x,y,anim){
	func.draw({st:true,circle:false,X:[x-10,x+10,x+10,x-10],Y:[y+35,y+35,y-10,y-10],close:true});
	func.draw({st:true,circle:false,X:[x-8,x+8,x+8,x-8],Y:[y+25+anim*3,y+25+anim*3,y+15-anim*5,y+15-anim*5],close:true});
	func.draw({st:true,circle:false,X:[x-8,x+8,x+8,x-8],Y:[y+3,y+3,y-5,y-5],close:true});

	func.draw({st:true,circle:false,X:[x-10,x-5],Y:[y+25+anim*3,y+15-anim*5]});
	func.draw({st:true,circle:false,X:[x-5,x],Y:[y+25+anim*3,y+15-anim*5]});
	func.draw({st:true,circle:false,X:[x+5,x+10],Y:[y+25+anim*3,y+15-anim*5]});
	func.draw({st:true,circle:false,X:[x,x+5],Y:[y+25+anim*3,y+15-anim*5]});

	func.draw({st:true,circle:false,X:[x-5,x-5],Y:[y-10,y-25]});

	func.draw({st_style:'#eab500',st:true,circle:false,X:[x-6+anim*2,x-4+anim*2,x-2+anim*2],Y:[y+1,y-1,y+1],close:true});

	func.draw({fil_style:'#eab500',fil:true,X:x-5,Y:y-25,siz:3});
/*
	func.draw({st:true,circle:false,X:[x+10,x+5],Y:[y+25+anim*5,y+15-anim*5]});
	func.draw({st:true,circle:false,X:[x+5,x],Y:[y+25+anim*5,y+15-anim*5]});
	func.draw({st:true,circle:false,X:[x,x-5],Y:[y+25+anim*5,y+15-anim*5]});
	func.draw({st:true,circle:false,X:[x-5,x-10],Y:[y+25+anim*5,y+15-anim*5]});*/
}
