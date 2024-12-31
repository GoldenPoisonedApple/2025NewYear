'use strict';

const random = (min, max) => Math.random() * (max - min + 1) + min | 0;
const MAX_COUNT = 20;
//吹き出しの数
let speech_bubble_count = 0;
const speech_bubble_text = [
	'あけおめ！',
	'ｱｹｵﾒ!',
	'ハッピーニューイヤー！',
	'Happy New Year!',
	'あけましておめでとうございます。',
	'今年もよろしくお願いします。',
	'あけおめ～！ことよろ～！',
	'あけましておめでございます',
	'Webサイト作り終わらなさすぎて年越せるかギリギリだった',
	'今年もなんとか年を越せました',
	'来年もよろしくぅ！',
	'今現在製作中(12/31 19:58) 完成のめど立たず',
	'おめでとー',
	'今年は巳年らしいですよ！',
	'主はまだお酒が飲めないお年頃でございます',
	'よく気づいたねぇこれに',
	'隠し要素バレちゃった！',
	'謎の技術力',
	'HTMLを書く程度の能力',
	'レポートをHTMLで書くことで培った技術',
	'おみくじのアニメーションは3Dモデリングから作りました',
	'今回のWebページはほとんど全部自作ですね',
	'おめでございます',
	'81個もネタ書いたの狂気まじで',
	'81個も書いたから途中からコンセプトずれまくって日記みたいになった',
	'毎回年越し寸前まで作ってるのおかしいよね',
	'本当はオープニングアニメーション入れたかったけど時間ないっす...'
];

//エレメント取得
let speech_bubbles_parent = document.getElementById('speech_bubbles');

//クリック時呼び出し
function js_onclick() {
	if (speech_bubble_count < MAX_COUNT) {
		speech_bubble_count++;
		// 要素作成
		var balloonDiv = document.createElement("div");
		balloonDiv.classList.add("balloon");
		var pElement = document.createElement("p");
		pElement.textContent = speech_bubble_text[random(0, speech_bubble_text.length-1)];
		balloonDiv.appendChild(pElement);

		// 要素内の最後に追加
		speech_bubbles_parent.appendChild(balloonDiv);

		//一定時間で削除
		setTimeout(function() {
			balloonDiv.style.animation = "feed-out 1s 0s"; 
		}, 6000);
		setTimeout(function() { 
			balloonDiv.remove();
			speech_bubble_count--;
		}, 7000);
	}
}