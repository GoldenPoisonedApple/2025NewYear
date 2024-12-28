'use strict';

// モジュール化されたJavaScriptコード

// モーダル管理クラス
class ModalManager {
	constructor(modalId, videoId, resultId, luckID, titleID, articleID, fortuneTitles, fortuneContents) {
		this.modal = document.getElementById(modalId);
		this.video = document.getElementById(videoId);
		this.result = document.getElementById(resultId);
		this.luck = document.getElementById(luckID);;
		this.title = document.getElementById(titleID);;
		this.article = document.getElementById(articleID);;
		this.fortuneTitles = fortuneTitles;
		this.fortuneContents = fortuneContents;
		this.fortuneType = document.getElementById('fortune-type');

		// ビデオ終了時のイベントリスナー設定
		this.video.addEventListener('ended', this.showResult.bind(this));
	}

	// モーダルを開く
	open(i, j) {
		// 内容反映
		this.fortuneType.textContent = this.fortuneTitles[j - 1];
		this.luck.innerHTML = this.fortuneContents[j - 1][i - 1][0];
		this.title.innerHTML = this.fortuneContents[j - 1][i - 1][1];
		this.article.innerHTML = this.fortuneContents[j - 1][i - 1][2];
		this.modal.style.display = 'flex';
		this.video.style.display = 'inline-block';
		this.video.currentTime = 0;
		this.video.play();
		this.result.style.display = 'none';
	}

	// モーダルを閉じる
	close() {
		this.modal.style.display = 'none';
	}

	// 運勢表示
	showResult() {
		this.video.style.display = 'none';
		this.result.style.display = 'inline-block';
	}
}

// レンダリングクラス
class FortuneRenderer {
	constructor(wrapperId, containerId, cellTemplateId, fortuneTitles, modalManager) {
		this.wrapper = document.getElementById(wrapperId);
		this.container = document.getElementById(containerId);
		this.cellTemplate = document.getElementById(cellTemplateId);
		this.fortuneTitles = fortuneTitles;
		this.modalManager = modalManager;
		this.width = Math.min(this.wrapper.clientWidth, 600);
		this.container.style.width = `${this.width}px`;
		this.cellSize = this.width / 9;
	}

	// タイトルを描画
	renderTitles() {
		this.fortuneTitles.forEach((title, i) => {
			const text = document.createElement('p');
			text.textContent = `${i + 1}の段\n${title}`;
			text.classList.add('fortune-slip-cell');
			text.style.width = `${this.cellSize}px`;
			text.style.wordBreak = 'break-all';
			text.style.fontSize = '0.9rem';
			this.container.append(text);
		});
	}

	// 九九のボタンを描画
	renderButtons() {
		for (let i = 1; i <= 9; i++) {
			for (let j = 1; j <= 9; j++) {
				const cell = this.cellTemplate.content.cloneNode(true);
				const button = cell.querySelector('.cell-button');
				button.textContent = `${i * j}`;
				button.style.width = `${this.cellSize}px`;
				button.style.height = `${this.cellSize}px`;

				const text = document.createElement('p');
				text.textContent = `${j} × ${i}`;
				text.style.fontSize = '0.8rem';
				text.style.color = '#ff2121';
				button.appendChild(text);

				// ボタンクリック時のイベントリスナー設定
				button.addEventListener('click', () => {
					this.modalManager.open(i, j);
					// console.log(`${i}, ${j}: ボタンがクリックされました`);
				});

				this.container.append(cell);
			}
		}
	}
}

// グローバルにモーダル管理用のcloseModal関数を提供
let modalManager;
function closeModal() {
	if (modalManager) {
		modalManager.close();
	}
}
// 吉、小吉、末吉、中吉、大吉、凶、大凶、微吉、微々々々吉
// 待ち人、百万人来る、3人来る、行けたら行く(来ない)
// ガチャ、当たる百連を引け
// 研究、終わる、終わらせよ

// 初期化処理
(() => {
	const fortuneTitles = ["失物", "待人", "学問", "金", "研究", "推し", "アニメ", "ゲーム", "ガチャ"];
	const fortuneContents = [[
		["大吉", "2倍になって出てくる", "ちなみに私は寮のあのちっっっっっっっっさい部屋でスマホをかなりの頻度で失くします。部屋の小ささは失くす確率に関係ないようです。"],
		["中吉", "ベッドの下にはない", "ベッドの下に在るのは大抵、ほこり・薄い本・変態と相場が決まっています。ポッケと玄関先を探しましょう。"],
		["小吉", "ネタが無くなる", "3つ目にしてもう既にネタがない。<br>誰だよ81個もマス作ったの。81個もネタ考え無きゃいけないこっちの身にもなって欲しい。いいのか？ネタが無くなったらホシノ(ブルーアーカイブのキャラ)について今年中語っちゃうぞ。ホシノはいいぞぉ～"],
		["lim<sub style='font-size: 1rem;'>x → 大</sub>X吉", "限りなくそれに近いものが出てくる", "黒いUSBケーブルを探してたら白いUSBケーブルが出てきて、それで一件落着はしたんだけど、結局黒いUSBケーブルはどこ行ったんだ。ってなるアレ"],
		["凶", "時間が無い", "気づいたら年が明けていたと思ったら、授業が始まっていたり、卒研発表があったりします。去年とか過ぎるのかなり早かった気がするのは私だけですかね。去年の最初がインパクト大きかったのもあるかとは思いますが...<br>ちなみに卒研は順調ですか？私は塵です。こんなものを作っているなら卒研をした方がいいと思います。"],
		["", "", ""],
		["", "", ""],
		["", "", ""],
		["", "", ""]
	], [
		["吉", "大体来る", "案外呼べば人って来るよね。呼ぶのがめんどくさかったりするんですけど。あと、呼ぶと毎回来るような鬼のようにフッ軽な人ってどうなってるんだろう。液体燃料でも積んでるんですかね。"],
		["小吉", "行けたら行く", "来ない<br>でも高専生って割と「行けたら行く」で来ること多いよね。"],
		["大吉", "百万人来る", "待ち人が百万人来るでしょう。多分東京ドームでライブとかします。アルファベットチョコを買いだめしておくと良いでしょう。<br>ちなみに東京ドームの収容人数は5.5万人らしいですよ。"],
		["吉", "推し", "推しが来るでしょう。'推しに来て欲しい派閥'と'現実世界にはいて欲しくない派閥'がありますがあなたはどっち？私は'推しが存在する世界で壁になりたい派閥'所属です仲良くしましょう。"],
		["中吉", "孤高", "待ち人？知らんな。とかいう感じになるでしょう。なんだか、人と約束した用事って近づけば近づくほど億劫になってきません？家出ちゃえばどうってことないんだけど、家出る直前とか「帰ってベッドでスマホいじりたい」とか思ってる。"],
		["", "", ""],
		["", "", ""],
		["", "", ""],
		["", "", ""]
	], [
		["吉", "[資格コレクター]", "突然資格取得に目覚めて資格コレクターになる。簿記とかいいらしいですね、知らんけど。ちなみに!!!!これ自慢なんですけど!!!応用情報技術者資格受かりました!!!試験の2ヶ月半後に結果発表とかいうとんでもスケジュールでした。"],
		["大吉", "キミも情報系になろう", ""],
		["", "", ""],
		["", "", ""],
		["", "", ""],
		["", "", ""],
		["", "", ""],
		["", "", ""],
		["", "", ""]
	], [
		["吉", "割のいいバイト", "割のいいバイトがみつかるでしょう。簡単な業務のわりに報酬が高い不思議なバイトが見つかるでしょう。応募すると秘匿性の高いSNSでのやり取りが始まるでしょう。"],
		["神", "バズリ散らかす", "ニコニコ動画やってみません？動画編集楽しいですよ。なんなら一緒にやりません？自分編集できますよ。割といいなと思ったら連絡してください。YouTubeでもいいですよ"],
		["小吉", "お金なｧｧｧｧい", "∵<栗原ァｧｧｧｧｧｧｧ!!!! お金なァｧ゛ｧ゛ｧ゛ｧ゛ｧ゛ｧ゛い゛!!!!!!"],
		["凶", "Amazonでパチモン掴まされる", "今年(去年)、Amazonでイヤホンを2回買ったんですけど2回ともパチモンつかまされました。やっぱりああいうのって家電量販店とかで買うのが一番いいんすかね"],
		["吉", "散財はほどほどに", "今年コミケ行ったんですけど、行くだけでお金なくなるってどういう事ですかね。3日分のバイト代が吹き飛んだんですけど"],
		["", "", ""],
		["", "", ""],
		["", "", ""],
		["", "", ""]
	], [
		["", "", ""],
		["吉", "終わる", "終わる。終わらせよ。"],
		["", "", ""],
		["", "", ""],
		["", "", ""],
		["", "", ""],
		["", "", ""],
		["", "", ""],
		["", "", ""]
	], [
		["", "", ""],
		["", "", ""],
		["", "", ""],
		["", "", ""],
		["", "", ""],
		["", "", ""],
		["", "", ""],
		["", "", ""],
		["", "", ""]
	], [
		["", "", ""],
		["", "", ""],
		["", "", ""],
		["", "", ""],
		["", "", ""],
		["", "", ""],
		["", "", ""],
		["", "", ""],
		["", "", ""]
	], [
		["", "", ""],
		["", "", ""],
		["", "", ""],
		["", "", ""],
		["", "", ""],
		["", "", ""],
		["", "", ""],
		["", "", ""],
		["", "", ""]
	], [
		["", "", ""],
		["", "", ""],
		["", "", ""],
		["", "", ""],
		["", "", ""],
		["大吉", "百連を引け", "当たる。百連を引け"],
		["", "", ""],
		["", "", ""],
		["", "", ""]
	]];

	modalManager = new ModalManager('modal', 'fortune-video', 'fortune-result', 'fortune-result-luck', 'fortune-result-title', 'fortune-result-article', fortuneTitles, fortuneContents);
	const fortuneRenderer = new FortuneRenderer('fortune-slip-wrapper', 'fortune-slip-container', 'cell-template', fortuneTitles, modalManager);

	fortuneRenderer.renderTitles();
	fortuneRenderer.renderButtons();
})();
