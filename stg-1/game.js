async function game(stage,sec) {
	await sleepByPromise(sec);
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
	bgm(0,'sumia.mp3');
	
	for(let i = 0; i <= 3; i++) {
		add_enemy({X:100,Y:0,speed:2,shooter:[
			[{st_dir:0,count:1,speed:0.5,accele:1,costume:'strange'},
			{st_dir:0,count:1,speed:0.5,accele:2,costume:'strange'},
			{st_dir:0,count:1,speed:0.5,accele:3,costume:'strange'},
			{st_dir:0,count:1,speed:0.5,accele:4,costume:'strange'},
			{st_dir:0,count:1,speed:0.5,accele:5,costume:'strange'}]
			],
		interval:[[15,30]],type:[1]},i*3);
		add_enemy({X:300,Y:480,dir:270,speed:2,shooter:[
			[{st_dir:180,count:1,speed:0.5,accele:1,costume:'strange'},
			{st_dir:180,count:1,speed:0.5,accele:2,costume:'strange'},
			{st_dir:180,count:1,speed:0.5,accele:3,costume:'strange'},
			{st_dir:180,count:1,speed:0.5,accele:4,costume:'strange'},
			{st_dir:180,count:1,speed:0.5,accele:5,costume:'strange'}]
			],
		interval:[[30,30]],type:[1]},i*3+1.5);
	}

	add_enemy({X:200,Y:0,dir:func.angle(200,0,300,200),shooter:[[{}],[{deleteMessage:true,laser:true,count:5,rota:72,shift:50,changeCond:[{cond:2,down:160,dir_accele:1},{cond:2,down:100,dir_accele:0},{cond:2,down:10}]}]],speed:2,accele:0.1,changeCond:[{cond:1,x:300,y:200,dir:90,speed:0,accele:0},{cond:2,speed:1,accele:0.4,down:200},{cond:4,y:500}],type:[0,1,0],interval:[[0,0],[10,200],[0,0]],hp:20},12);
	add_enemy({X:200,Y:0,dir:func.angle(200,0,100,200),shooter:[[{}],[{deleteMessage:true,laser:true,count:5,rota:72,shift:50,changeCond:[{cond:2,down:160,dir_accele:1},{cond:2,down:100,dir_accele:0},{cond:2,down:10}]}]],speed:2,accele:0.1,changeCond:[{cond:1,x:100,y:200,dir:90,speed:0,accele:0},{cond:2,speed:1,accele:0.4,down:200},{cond:4,y:500}],type:[0,1,0],interval:[[0,0],[10,200],[0,0]],hp:20},12);
	add_enemy({score:100000,X:200,Y:0,size:5,dir:func.angle(200,0,200,100),shooter:[[{}],[{deleteMessage:true,laser:true,shift:50}]],speed:2,accele:0.1,changeCond:[{cond:1,x:200,y:100,dir:90,speed:0,accele:0},{cond:2,speed:1,accele:0.4,down:200},{cond:4,y2:500}],type:[0,1,0],interval:[[0,0],[10,200],[0,0]],hp:20},14);

	for(let i = 1; i <= 3; i++) {
		add_enemy({X:100,Y:0,color:'#6481cd',shooter:[[{count:5,rota:30,st_dir:270,speed:1,accele:1,dir_accele:1}]],speed:2,type:[1],interval:[[100,100]],hp:5},i+12);
		add_enemy({X:300,Y:0,color:'#6481cd',shooter:[[{count:5,rota:30,st_dir:135,speed:1,accele:1,dir_accele:1}]],speed:2,type:[1],interval:[[100,100]],hp:5},i+12);
	}

	add_enemy({X:20,Y:0,color:'#fff',shooter:[ [ {count:1,st_dir:0,speed:1,laser:true,changeCond:[ {cond:2,down:1},{cond:2,down:460},{cond:2,down:10} ],shift:30,deleteMessage:true }],[{}],[{count:3,rota:120,st_dir:rndm(0,360),rotaRate:50,speed:0,accele:0.2}],[{}]],speed:1,accele:0,type:[1,0,1,0],interval:[[10,5000],[0,0],[80,80],[0,0]],changeCond:[{cond:2,down:25},{cond:3,hp:29,speed:0.5,accele:0.15,delAll:true,color:theme,costume:'enemy_2'},{cond:2,down:500,chase:true},{cond:0}],hp:30},20);
	add_enemy({X:400,Y:0,color:'#fff',shooter:[[{count:1,st_dir:180,speed:1,laser:true,changeCond:[{cond:2,down:1},{cond:2,down:460},{cond:2,down:10}],shift:30,deleteMessage:true}],[{}],[{count:3,rota:120,st_dir:rndm(0,360),rotaRate:50,speed:0,accele:0.2}],[{}]],speed:1,accele:0,type:[1,0,1,0],interval:[[10,5000],[0,0],[80,80],[0,0]],changeCond:[{cond:2,down:25},{cond:3,hp:29,speed:0.5,accele:0.15,delAll:true,color:theme,costume:'enemy_2'},{cond:2,down:500,chase:true},{cond:0}],hp:30},22);

	for(let i = 0; i <= 4; i++) {
		add_enemy({X:250+(i%2*50),Y:0,color:'#fff',shooter:[[{count:1,st_dir:180,speed:1,laser:true,changeCond:[{cond:2,down:1},{cond:2,down:460},{cond:2,down:10}],shift:30,deleteMessage:true}],[{}],[{count:3,rota:120,st_dir:rndm(0,360),rotaRate:50,speed:0,accele:0.2}],[{}]],speed:1,accele:0,type:[1,0,1,0],interval:[[10,5000],[0,0],[80,80],[0,0]],changeCond:[{cond:2,down:25},{cond:3,hp:39,speed:0.5,accele:0.15,delAll:true,color:theme,costume:'enemy_2'},{cond:2,down:500,chase:true},{cond:0}],hp:40},i*4+25);
		add_enemy({X:150-(i%2*50),Y:0,color:'#fff',shooter:[[{count:1,st_dir:0,speed:1,laser:true,changeCond:[{cond:2,down:1},{cond:2,down:460},{cond:2,down:10}],shift:30,deleteMessage:true}],[{}],[{count:3,rota:120,st_dir:rndm(0,360),rotaRate:50,speed:0,accele:0.2}],[{}]],speed:1,accele:0,type:[1,0,1,0],interval:[[10,5000],[0,0],[80,80],[0,0]],changeCond:[{cond:2,down:25},{cond:3,hp:39,speed:0.5,accele:0.15,delAll:true,color:theme,costume:'enemy_2'},{cond:2,down:500,chase:true},{cond:0}],hp:40},i*4+27);
	}
	for(let i = 0; i<= 9; i++) {
		add_enemy({X:0,Y:100,dir:0,color:'#fff',shooter:[[{count:5,rota:10,speed:1,accele:0.1,zikimuke:true,rotaRate:-20}]],speed:2,type:[1],interval:[[100,100]],hp:5},i*2+25);
	}
	del(53);

	for(let i = 0; i <= 3; i++) {
		add_enemy({X:100,Y:0,speed:2,shooter:[
			[{st_dir:0,count:1,speed:0.5,accele:1,costume:'strange'},
			{st_dir:0,count:1,speed:0.5,accele:2,costume:'strange'},
			{st_dir:0,count:1,speed:0.5,accele:3,costume:'strange'},
			{st_dir:0,count:1,speed:0.5,accele:4,costume:'strange'},
			{st_dir:0,count:1,speed:0.5,accele:5,costume:'strange'}]
			],
		interval:[[15,30]],type:[1]},i*3+54);
		add_enemy({X:300,Y:480,dir:270,speed:2,shooter:[
			[{st_dir:180,count:1,speed:0.5,accele:1,costume:'strange'},
			{st_dir:180,count:1,speed:0.5,accele:2,costume:'strange'},
			{st_dir:180,count:1,speed:0.5,accele:3,costume:'strange'},
			{st_dir:180,count:1,speed:0.5,accele:4,costume:'strange'},
			{st_dir:180,count:1,speed:0.5,accele:5,costume:'strange'}]
			],
		interval:[[30,30]],type:[1]},i*3+55.5);
	}
	for(let i = 1; i<=2; i++) {
		add_enemy({hp:3,color:'#6481cd',X:200,Y:0,speed:6,accele:-10,shooter:[[{}],
			[{zikimuke:true,count:1,speed:0.5,accele:1,costume:'strange'},
			{zikimuke:true,count:1,speed:0.5,accele:2,costume:'strange'},
			{zikimuke:true,count:1,speed:0.5,accele:3,costume:'strange'},
			{zikimuke:true,count:1,speed:0.5,accele:4,costume:'strange'},
			{zikimuke:true,count:1,speed:0.5,accele:5,costume:'strange'}]
			],
		interval:[[0,0],[60,60]],type:[0,1],changeCond:[{cond:4,y:100,speed:1,accele:0},{cond:0}]},i*4+54);
	}
	
	BossComing(71,1);
}

function stage2() {
	bgm(0,'m-art_Principia.mp3');

	for(let i = 0; i < 25; i++) {
		l =Math.floor(rndm(0,3)/2);
		for(let j = 0; j < l; j++) {
			let xx = rndm(50,350);
			add_enemy({costume:'enemy_2',hp:3,X:xx,Y:0,type:[0,1,0],speed:4,accele:-6,interval:[[0,0],[10,1000],[0,0]],changeCond:[{cond:4,y:130,speed:0,accele:0},{cond:2,down:10,speed:4,dir:xx >= 200 ? 45 : 135,accele:0.5},{cond:0}],
				shooter:[[{}],
				[{count:3,rota:15,zikimuke:true,rotaRate:-15,speed:5,accele:-20,changeCond:[{cond:2,down:20,speed:1,accele:0.2},{cond:0}]},
				{count:3,rota:15,zikimuke:true,rotaRate:-15,speed:7.5,accele:-30,changeCond:[{cond:2,down:20,speed:1,accele:0.2},{cond:0}]},
				{count:3,rota:15,zikimuke:true,rotaRate:-15,speed:10,accele:-40,changeCond:[{cond:2,down:20,speed:1,accele:0.2},{cond:0}]}
				]
			]},i/5);
		}
	}

	add_enemy({costume:'enemy_3',hp:15,X:300,Y:0,speed:5,accele:-9,shooter:[[{}],[{costume:1,cycle:3,size:2,speed:5,accele:-20,dir_accele:'rndm,-005,005',color:'#3b59ff',changeCond:[{cond:2,down:50,accele:2.5},{cond:0}]},{costume:2,rotaRate:1,speed:4,accele:0.1}],[{}]],type:[0,1,0],interval:[[0,0],[10,10],[0,0]],changeCond:[{cond:2,down:50,speed:0,accele:0},{cond:2,down:300,speed:-4},{cond:0}]},6);
	add_enemy({costume:'enemy_3',hp:15,X:100,Y:0,speed:5,accele:-9,shooter:[[{}],[{cycle:3,costume:1,size:2,speed:5,accele:-20,dir_accele:'rndm,-005,005',color:'#3b59ff',changeCond:[{cond:2,down:50,accele:2.5},{cond:0}]},{costume:2,rotaRate:-1,speed:4,accele:0.1}],[{}]],type:[0,1,0],interval:[[0,0],[10,10],[0,0]],changeCond:[{cond:2,down:50,speed:0,accele:0},{cond:2,down:300,speed:-4},{cond:0}]},6);

	//add_enemy({costume:'enemy',hp:30,X:0,Y:200,dir:0,speed:1,interval:[[0,0],[10,1000],[0,0]],type:[0,1,0],changeCond:[{cond:1,x:20,y:200,speed:0},{cond:2,down:70,speed:-1},{cond:0}],shooter:[[{}],[{st_dir:80,laser:true,dir_accele:0,count:1,changeCond:[{cond:2,down:10,dir_accele:-4},{cond:2,down:60},{cond:2,down:10}]}]]},0);
	//add_enemy({costume:'enemy',hp:30,X:410,Y:200,dir:180,speed:1,interval:[[0,0],[10,1000],[0,0]],type:[0,1,0],changeCond:[{cond:1,x:400,y:200,speed:0},{cond:2,down:70,speed:-1},{cond:0}],shooter:[[{}],[{st_dir:80,laser:true,dir_accele:0,count:1,changeCond:[{cond:2,down:10,dir_accele:4},{cond:2,down:60},{cond:2,down:10}]}]]},1);

	for(let i = 0; i < 3; i++) {
		add_enemy({costume:'enemy_3',color:'#3b59ff',speed:7,accele:-10,X:300,Y:0,interval:[[0,0],[10,10],[0,0]],type:[0,1,0],changeCond:[{cond:4,y:100,speed:1,accele:0,dir:170},{cond:4,x:200,speed:5,dir:270},{cond:0}],shooter:[[{}],
			[{count:5,rota:72,speed:2,accele:3,rotaRate:30},{count:5,rota:72,speed:2,accele:4.5,rotaRate:30},{count:5,rota:72,speed:2,accele:6,rotaRate:30}],
			[{}]]
		},i*4+20);
		add_enemy({costume:'enemy_3',speed:7,accele:-10,X:100,Y:0,interval:[[0,0],[10,10],[0,0]],type:[0,1,0],changeCond:[{cond:4,y:100,speed:1,accele:0,dir:10},{cond:4,x:200,speed:5,dir:270},{cond:0}],shooter:[[{}],
			[{count:5,rota:72,speed:2,accele:3,rotaRate:30},{count:5,rota:72,speed:2,accele:4.5,rotaRate:30},{count:5,rota:72,speed:2,accele:6,rotaRate:30}],
			[{}]]
		},i*4+22);
	}

	add_enemy({costume:'enemy_3',type:[0,1,0],interval:[[0,0],[10,25],[0,0]],speed:4,accele:-6,hp:100,X:200,Y:0,shooter:[[{}],
		[{dir_accele:'rndm,-002,002',st_dir:'rndm,000,360',size:1,costume:'star_bullet',speed:2,accele:0.1,color:'#eab500'},
		{st_dir:'rndm,000,360',cycle:3,size:4,costume:'star_bullet',speed:4,accele:0.6,dir_accele:-1},
		{st_dir:'rndm,000,360',cycle:3,size:3,costume:'star_bullet',speed:3,accele:0.6,dir_accele:1,color:'#bb0000'},
		{st_dir:'rndm,000,360',cycle:3,size:2,costume:'star_bullet',speed:2,accele:0.6,dir_accele:-1,color:'#3b59ff'}],[{}]
		],
	changeCond:[{cond:4,y:130,speed:0,accele:0},{cond:2,down:500,speed:-4},{cond:0}]},33);

	BossComing(47,2);
}
function stage3() {
	
	bgm(0,'m-art_rule90.mp3');
	
	for(i = 1;i <= 10;i++) {
		add_enemy({X:i*40,Y:0,dir:95,type:[0,1,0],interval:[[0,0],[10,100],[0,0]],costume:'enemy_5',speed:6,accele:-18,changeCond:[{cond:4,y:50,speed:0,accele:0},{cond:2,down:20,speed:3,accele:3},{cond:0}],hp:1,shooter:[[{}],
			[{zikimuke:true,count:3,rota:15,speed:0.5,accele:1,costume:'strange',rotaRate:-15},
			//{zikimuke:true,count:3,rota:15,speed:0.5,accele:2,costume:'strange',rotaRate:-15},
			{zikimuke:true,count:3,rota:15,speed:0.5,accele:3,costume:'strange',rotaRate:-15},
			//{zikimuke:true,count:3,rota:15,speed:0.5,accele:4,costume:'strange',rotaRate:-15},
			{zikimuke:true,count:3,rota:15,speed:0.5,accele:5,costume:'strange',rotaRate:-15}],
			[{}]]
		},i*0.3);
	}
	for(i = 1; i <= 10; i++) {
		add_enemy({X:0,Y:i*40,dir:0,type:[1,1,0],speed:5,interval:[[10,30]],costume:'enemy_5',accele:-12,hp:2,changeCond:[{cond:2,down:100}],shooter:[
			[{speed:1,accele:1,count:1,size:'rndm,004,008',st_dir:'angl,000,000'}]
			]
		},i*0.5+5);
		add_enemy({X:400,Y:480-i*40,dir:180,type:[1,1,0],speed:5,interval:[[10,30]],costume:'enemy_5',accele:-12,hp:2,changeCond:[{cond:2,down:100}],shooter:[
			[{speed:1,accele:1,count:1,size:'rndm,004,008',st_dir:'angl,000,000'}]
			]
		},i*0.5+5.5);
	}

	add_enemy({hp:200,size_accele:-0.5,X:200,Y:10,size:20,costume:'enemy_5',speed:5,interval:[[0,0],[5,5]],type:[0,1],changeCond:[{cond:4,y:200,speed:0},{cond:7,size:0}],shooter:[[{}],[{effect:[1,0],count:1,rotaRate:30,costume:'big_bullet',size:34,color:"#b000a3",speed:6,accele:-25,shift:50,deru:false,changeCond:[{cond:2,down:10,speed:1,accele:5},{cond:0}]},{effect:[1,0],count:1,shift:50,rotaRate:-30,deru:false,costume:'big_bullet',size:34,speed:6,accele:-25,changeCond:[{cond:2,down:10,speed:1,accele:5},{cond:0}]}]] },11);

	for(i = 1; i <= 5; i++) {
		add_enemy({X:170,Y:10,speed:2,type:[1],hp:3,interval:[[10,75]],costume:'enemy_5',dir_accele:'mcos,000,016,002',changeCond:[{cond:0}],shooter:[
			[{count:1,shift:10,rota:120,st_dir:'rndm,000,360',speed:1,accele:1.5,dir_accele:'rndm,-002,002',size:'rndm,004,008'},{count:1,shift:10,rota:120,st_dir:'rndm,000,360',speed:1,accele:1.5,dir_accele:'rndm,-002,002',size:'rndm,004,008'},{count:1,shift:10,rota:120,st_dir:'rndm,000,360',speed:1,accele:1.5,dir_accele:'rndm,-002,002',size:'rndm,004,008'},{count:1,shift:10,rota:120,st_dir:'rndm,000,360',speed:1,accele:1.5,dir_accele:'rndm,-002,002',size:'rndm,004,008'},{count:1,shift:10,rota:120,st_dir:'rndm,000,360',speed:1,accele:1.5,dir_accele:'rndm,-002,002',size:'rndm,004,008'}]
			],
		},i*0.5+21);
	}

	for(i = 1; i <= 5; i++) {
		add_enemy({color:'#b000a3',X:320,Y:10,speed:2,type:[1],hp:3,interval:[[10,75]],costume:'enemy_5',dir_accele:'mcos,000,016,-002',changeCond:[{cond:0}],shooter:[
			[{color:'#b000a3',count:1,shift:10,rota:120,st_dir:'rndm,000,360',speed:1,accele:1.5,dir_accele:'rndm,-002,002',size:'rndm,004,008'},{count:1,shift:10,rota:120,st_dir:'rndm,000,360',speed:1,accele:1.5,dir_accele:'rndm,-002,002',size:'rndm,004,008'},{count:1,shift:10,rota:120,st_dir:'rndm,000,360',speed:1,accele:1.5,dir_accele:'rndm,-002,002',size:'rndm,004,008'},{count:1,shift:10,rota:120,st_dir:'rndm,000,360',speed:1,accele:1.5,dir_accele:'rndm,-002,002',size:'rndm,004,008'},{count:1,shift:10,rota:120,st_dir:'rndm,000,360',speed:1,accele:1.5,dir_accele:'rndm,-002,002',size:'rndm,004,008'},{count:1,shift:10,rota:120,st_dir:'rndm,000,360',speed:1,accele:1.5,dir_accele:'rndm,-002,002',size:'rndm,004,008'},{count:1,shift:10,rota:120,st_dir:'rndm,000,360',speed:1,accele:1.5,dir_accele:'rndm,-002,002',size:'rndm,004,008'}]
			],
		},i*0.5+25);
	}
	for(i = 1; i <= 5; i++) {
		add_enemy({X:10,Y:140,speed:2,dir:0,type:[1],hp:3,interval:[[10,75]],costume:'enemy_5',dir_accele:'mcos,000,016,-002',changeCond:[{cond:0}],shooter:[
			[{count:1,shift:10,rota:120,st_dir:'rndm,000,360',speed:1,accele:1.5,dir_accele:'rndm,-002,002',size:'rndm,004,008'},{count:1,shift:10,rota:120,st_dir:'rndm,000,360',speed:1,accele:1.5,dir_accele:'rndm,-002,002',size:'rndm,004,008'},{count:1,shift:10,rota:120,st_dir:'rndm,000,360',speed:1,accele:1.5,dir_accele:'rndm,-002,002',size:'rndm,004,008'},{count:1,shift:10,rota:120,st_dir:'rndm,000,360',speed:1,accele:1.5,dir_accele:'rndm,-002,002',size:'rndm,004,008'},{count:1,shift:10,rota:120,st_dir:'rndm,000,360',speed:1,accele:1.5,dir_accele:'rndm,-002,002',size:'rndm,004,008'},{count:1,shift:10,rota:120,st_dir:'rndm,000,360',speed:1,accele:1.5,dir_accele:'rndm,-002,002',size:'rndm,004,008'},{count:1,shift:10,rota:120,st_dir:'rndm,000,360',speed:1,accele:1.5,dir_accele:'rndm,-002,002',size:'rndm,004,008'}]
			],
		},i*0.5+23);
	}
	for(i = 1; i <= 5; i++) {
		add_enemy({color:'#b000a3',X:400,Y:280,speed:2,dir:180,type:[1],hp:3,interval:[[10,75]],costume:'enemy_5',dir_accele:'mcos,000,016,-002',changeCond:[{cond:0}],shooter:[
			[{color:'#b000a3',count:1,shift:10,rota:120,st_dir:'rndm,000,360',speed:1,accele:1.5,dir_accele:'rndm,-002,002',size:'rndm,004,008'},{count:1,shift:10,rota:120,st_dir:'rndm,000,360',speed:1,accele:1.5,dir_accele:'rndm,-002,002',size:'rndm,004,008'},{count:1,shift:10,rota:120,st_dir:'rndm,000,360',speed:1,accele:1.5,dir_accele:'rndm,-002,002',size:'rndm,004,008'},{count:1,shift:10,rota:120,st_dir:'rndm,000,360',speed:1,accele:1.5,dir_accele:'rndm,-002,002',size:'rndm,004,008'},{count:1,shift:10,rota:120,st_dir:'rndm,000,360',speed:1,accele:1.5,dir_accele:'rndm,-002,002',size:'rndm,004,008'},{count:1,shift:10,rota:120,st_dir:'rndm,000,360',speed:1,accele:1.5,dir_accele:'rndm,-002,002',size:'rndm,004,008'},{count:1,shift:10,rota:120,st_dir:'rndm,000,360',speed:1,accele:1.5,dir_accele:'rndm,-002,002',size:'rndm,004,008'}]
			],
		},i*0.5+27);
	}
	BossComing(40,3);
}
async function BossComing(sec = 0,stage = 1) {
	await sleepByPromise(sec);
	audioElem['noise2'].play();
	audioElem['warning'].play();
	audioElem['bgm'].volume = 0.6;
	func.addEffect({X:75,Y:200,costume:'warning',changeCond:[{cond:2,down:480},{cond:2,down:20}],size:[30,0]});
	stage != 3  && serifData(`boss${stage}`);
	del();
	bossData = {d1:new Date(),d2:new Date()};
	switch(stage) {
		case 1:
		bossData.name = 'Dalet';
		bossData.id = 'שמונה-עשר';
		bossData.level = 'תשע';
		bossData.maxhp = 250;
		bossData.TargetTime = 70;
		bgm(9,'departure.mp3');
		add_enemy({X:200,Y:0,
			shooter:[[{}],
			[{reverse:1.5,dir_accele:0,laser:true,shift:50,rotaRate:40,cycle:3,deleteMessage:true,changeCond:[{cond:2,down:100,dir_accele:1},{cond:2,down:100,dir_accele:0},{cond:2,down:10}]},
			{costume:'strange',rotaRate:10,speed:1,accele:2,color:'#663884'},
			{costume:'strange',rotaRate:-10,color:'#6481cd',speed:3,accele:-4,type:[1,0],changeCond:[{cond:2,down:30,speed:1,accele:0.2},{cond:0}]}
			],
			[{}],
			[{count:12,rota:30,interval:[[20,20]],st_dir:90,speed:2,accele:0.5,dir_accele:1,type:[1],size:30,costume:'big_bullet',Addval:300,reverse:2,deleteMessage:true},
			],
			[{}]],
		speed:2,accele:0.1,score:1000000,boss:true,changeCond:[{cond:1,x:200,y:100,speed:0,accele:0},{cond:3,hp:125,delAll:true},{cond:2,down:50},{cond:3,hp:0,delAll:true}],type:[0,1,0,1,0],interval:[[0,0],[35,35],[0,0],[1,250],[0,0]],hp:250,size:10},9);
		break;

		case 2:
		bossData.maxhp = 500;
		bossData.name = 'Yud';
		bossData.id = 'אחדתשע-אחדתשע';
		bossData.level = 'חמישה';
		bossData.TargetTime = 100;
		bgm(9,'m-art_IntoTheWonderland.mp3');
		add_enemy({X:200,Y:0,costume:'star_boss',
			shooter:[
			[{}],
			[
			{color:'#39a0da,#cef442',deleteMessage:true,size:5,Addval:350,X:110,Y:165,dir_2:270,count:1,speed:4.1,st_dir:0,type:[2,2,2,2,2],interval:[[5,5],[5,5],[5,5],[5,5],[5,5]],changeCond:[{cond:2,down:45,dir:'madd,144,000'},{cond:2,down:45,dir:'madd,144,000'},{cond:2,down:45,dir:'madd,144,000'},{cond:2,down:45,dir:'madd,144,000'},{cond:2,down:45}]},
			{color:'#39a0da,#cef442',deleteMessage:true,size:5,Addval:350,X:110,Y:165,dir_2:150,count:1,speed:4.1,st_dir:0,type:[2,2,2,2,2],interval:[[5,5],[5,5],[5,5],[5,5],[5,5]],changeCond:[{cond:2,down:45,dir:'madd,144,000'},{cond:2,down:45,dir:'madd,144,000'},{cond:2,down:45,dir:'madd,144,000'},{cond:2,down:45,dir:'madd,144,000'},{cond:2,down:45}]},
			{color:'#39a0da,#cef442',deleteMessage:true,size:5,Addval:350,X:110,Y:165,dir_2:30,count:1,speed:4.1,st_dir:0,type:[2,2,2,2,2],interval:[[5,5],[5,5],[5,5],[5,5],[5,5]],changeCond:[{cond:2,down:45,dir:'madd,144,000'},{cond:2,down:45,dir:'madd,144,000'},{cond:2,down:45,dir:'madd,144,000'},{cond:2,down:45,dir:'madd,144,000'},{cond:2,down:45}]},

			{costume:1,deleteMessage:true,size:2,st_dir:36,Addval:350,X:165,Y:140,color:'#eab500',dir_2:'ange,200,150',count:1,speed:2,type:[2,2,2,2,2],interval:[[10,10],[10,10],[10,10],[10,10],[10,10]],changeCond:[{cond:2,down:60,dir:'madd,144,000'},{cond:2,down:60,dir:'madd,144,000'},{cond:2,down:60,dir:'madd,144,000'},{cond:2,down:60,dir:'madd,144,000'},{cond:2,down:60}]},
			],
			[{}],
			[{Y:0,costume:'star_bullet',size:10,count:1,Addval:200,speed:1,accele:3,type:[3,4],changeCond:[{cond:4,y:470,speed:0,accele:0},{cond:2,down:2}],interval:[[10,20],[1,100]]}],
			[{}],
			[{}]
			],
		speed:2,accele:0.1,score:1000000,boss:true,changeCond:[{cond:1,x:200,y:200,speed:0,accele:0},{cond:3,hp:350,delAll:true},{cond:2,down:4},{cond:3,hp:0,delAll:true}],type:[0,1,0,1,0],interval:[[0,0],[1,350],[0,0],[1,1000],[0,0]],hp:500,size:7},9);
		break;
		case 3:
		bgm(9,'m-art_Fractal.mp3')
		bossData.maxhp = 500;
		bossData.name = 'Efes';
		bossData.id = 'שלוששישה-ארבעה';
		bossData.level = 'חמישה';
		bossData.TargetTime = 500;
		add_enemy({boss:true,hp:500,X:200,Y:10,speed:5,costume:'enemy_5',size:10,alpha:0.7,changeCond:[{cond:4,y:200,speed:0},{cond:3,hp:450,delAll:true},{cond:2,down:4},{cond:3,hp:350,delAll:true},{cond:2,down:4},{cond:3,hp:250,delAll:true},{cond:2,down:4},{cond:3,hp:150,delAll:true,dir:270,speed:4},{cond:4,y:130,speed:0,size_hp:true},{cond:4,hp:0}],interval:[[0,0],[1,20],[1,20],[1,20],[1,20],[1,20],[1,20],[1,20],[0,0],[1,1]],type:[0,1,1,1,1,1,1,1,0,1],shooter:[
			[{}],
			[{deleteMessage:true,count:30,rota:12,speed:4,accele:-10,size:2,color:'#b000a3',shift:40,costume:0,changeCond:[{cond:2,down:20,speed:0,accele:5,dir_accele:2},{cond:0}]},{deleteMessage:true,count:30,rota:12,speed:4,accele:-10,size:2,color:'#b000a3',shift:40,costume:0,changeCond:[{cond:2,down:20,speed:0,accele:5,dir_accele:-2},{cond:0}]},{deleteMessage:true,st_dir:'angl,000,000',cycle:2,costume:'big_bullet',deru:false,effect:[1,0],count:1,size:30,accele:0.3,speed:4}],
			[{deleteMessage:true,cycle:1,laser:true,count:4,rota:90,st_dir:0,changeCond:[{cond:2,down:50,dir_accele:1,dir_accele_2:0.01},{cond:3,hp:250,dir_accele_2:-1},{cond:2,down:20}] }],
			[{count:8,rota:45,speed:1.5,color:'#eab500'} ],
			[{deleteMessage:true,cycle:1,laser:true,count:6,rota:60,st_dir:0,changeCond:[{cond:2,down:50,dir_accele:1,dir_accele_2:0.01},{cond:3,hp:250,dir_accele_2:-1},{cond:2,down:20}]} ],
			[{count:8,rota:45,speed:1.5,color:'#eab500'}  ],
			[{deleteMessage:true,cycle:1,laser:true,count:8,rota:45,st_dir:0,changeCond:[{cond:2,down:50,dir_accele:1,dir_accele_2:0.01},{cond:3,hp:250,dir_accele_2:-1},{cond:2,down:20}]}],
			[{count:8,rota:45,speed:1.5,color:'#eab500'}  ],
			[{}],
			[{shift:50,count:3,rota:120,size:'rndm,004,008',st_dir:'rndm,000,360',speed:'rndm,002,005',accele:1}]
			]
		},9);
		break;
	}
}
