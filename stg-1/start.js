let canvas = document.getElementById('stg');
const ctx = canvas.getContext('2d');
let bullet = {}; //敵の弾データ
let address = {}; //弾をグループ化。弾にまとめて命令をだしたいときに使う。いまのところ合図にしか使っていない。
//アドレスシステムはまた未完成なので、バグが多いかもしれない。
let effect = {}; //エフェクトデータ
let laser = {}; //レーザーデータ
let exData = {}; //展開したデータをここにいれる
let player = {X:200,Y:400,spX:0,spY:0,shot:0,anim:0,alive:true,ghost:0,hp:5,stageScore:[0,0,0],score:0,score_2:0,graze:0,bomb:0,bombCount:5};
//X,Y:座標　spX,spY:移動速度 shot:ショット間隔 anim:猫耳ぴょこぴょこ alive:生死　ghost:被弾後の無敵状態 hp:hp score,score_2:スコア graze:グレイズ
let input_key_buffer = [];//キー入力
for(let i = 0; i <= 226; i++) input_key_buffer[i] = false;//押してない状態を初期値とする
let p_bullet = [];//プレイヤーの弾データ
let enemy = {};//敵データ
let touchLs;//レーザーの判定
let touchBul;//弾の判定
let number = {enemy:0,bullet:0,laser:0,effect:0};//敵、弾、レーザー、エフェクトの総数（削除されたものも含む)
let deleteAll;//指定された敵idの弾を全削除する　発火の恐れあり。
let tn = 0;　//exData.typeNumberの値を入れてる。いちいち記述するのが面倒なので
let theme;//ゲーム全体の色を決める。ステージごとに変わる。
let bossData = {d1:new Date(),d2:new Date()};//ボス情報表示。
let stage =	0;//ステージ番号
let themeList = ['#fff',"#b000a3","#00af00","#39A0DA"];//左からステージ1、ステージ2、ステージ3のテーマ。
let SerifElem = {num:0,length:1,r:"",max:14,bake:0,waku:320,waku_2:180}
//num:処理する台詞の要素番号　length:表示する台詞の文字数　r:行分け前の台詞　max:一行に表示できる文字数　bake:文字化け　waku:枠の幅
let Serif = []//台詞データ
let SerifResult = [];//採集敵に表示する（行分け後）の台詞
let audioElem = {
	bgm:new Audio('sumia.mp3'),
	enemy_crash:new Audio('audio/magic3.mp3'),
	enemy_shot:new Audio('audio/damage6.mp3'),
	crash:new Audio('audio/attack1.mp3'),
	res:new Audio("audio/tr.mp3"),
	noise:new Audio("audio/trx01.mp3"),
	noise2:new Audio("audio/noise03.mp3"),
	warning:new Audio("audio/warning.mp3"),
	graze:new Audio("audio/automatic_pencil1.mp3"),
	address:new Audio("audio/magic_wave3.mp3"),
	laser:new Audio("audio/laser.mp3"),
	star_crash:new Audio("audio/sen_fa_maho_kougeki06.mp3"),
	bomb:new Audio("audio/sen_fa_maho_kougeki05.mp3")
}//bgm,効果音
let audioLoading = 0;
let boss;//ボス真偽
let tempo = 7;//猫耳ぴょこぴょこの速さ　音楽に合わせて変化させたい
let bombInfo = {size:0,X:0,Y:0};//未実装ボム
let bk;　//文字化けテキストを入れる場所　なぜかグローバル変数
let zone = ['PINKZONE','GREENZONE','BLUEZONE']
audioElem['crash'].volume = 0.6;
audioElem['address'].volume = 0.5;
audioElem['bgm'].volume = 0.6;
audioElem['enemy_shot'].volume = 0.5;
audioElem['laser'].volume = 0.5;
