'use strict';

// まあURL入れれば見れるけどさ、見れるけどさ。文字化けしとるやろそれ、もはや根性やなすごいわ

// モジュール化されたJavaScriptコード

// モーダル管理クラス
class ModalManager {
	constructor(modalId, videoId, resultId, luckID, titleID, articleID, fortuneTitles, fortuneContents, comicsData) {
		this.modal = document.getElementById(modalId);
		this.video = document.getElementById(videoId);
		this.result = document.getElementById(resultId);
		this.luck = document.getElementById(luckID);;
		this.title = document.getElementById(titleID);;
		this.article = document.getElementById(articleID);;
		this.fortuneTitles = fortuneTitles;
		this.fortuneContents = fortuneContents;
		this.comicsData = comicsData;
		this.fortuneType = document.getElementById('fortune-type');
		this.comic = document.getElementById('reccomend-comic');

		// ビデオ終了時のイベントリスナー設定
		this.video.addEventListener('ended', this.showResult.bind(this));
	}

	// モーダルを開く
	open(i, j) {
		// 内容反映
		// 運勢関係
		this.fortuneType.textContent = this.fortuneTitles[j - 1];
		this.luck.innerHTML = this.fortuneContents[j - 1][i - 1][0];
		this.title.innerHTML = this.fortuneContents[j - 1][i - 1][1];
		this.article.innerHTML = this.fortuneContents[j - 1][i - 1][2];
		// 漫画関係
		document.getElementById("preview-link").textContent = this.comicsData[j - 1][i - 1][0];
		document.getElementById("preview-description").textContent = this.comicsData[j - 1][i - 1][1];
		document.getElementById("preview-image").src = this.comicsData[j - 1][i - 1][2];
		document.getElementById("preview-link").href = this.comicsData[j - 1][i - 1][3];

		this.modal.style.display = 'flex';
		this.video.style.display = 'inline-block';
		this.video.currentTime = 0;
		this.video.play();
		this.result.style.display = 'none';
		this.comic.style.display = 'none';
	}

	// モーダルを閉じる
	close() {
		this.modal.style.display = 'none';
	}

	// 運勢表示
	showResult() {
		this.video.style.display = 'none';
		this.result.style.display = 'inline-block';
		this.comic.style.display = 'flex';
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
			const title_div = document.createElement('div');
			// 段
			const stage = document.createElement('p');
			stage.textContent = `${i + 1}の段`;
			stage.style.whiteSpace = 'nowrap';
			stage.style.fontSize = '1rem';
			title_div.appendChild(stage);
			// 運type
			const type = document.createElement('p');
			type.textContent = `${title}`;
			type.style.fontSize = '0.8rem';
			type.style.whiteSpace = 'nowrap';
			title_div.appendChild(type);
			// スタイル適応
			title_div.classList.add('fortune-slip-cell');
			title_div.style.width = `${this.cellSize}px`;
			title_div.style.height = `${this.cellSize}px`;
			title_div.style.flexDirection = 'column';
			this.container.append(title_div);
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

// ["失物", "待人", "学問", "金", "研究", "推し", "アニメ", "マンガ", "ガチャ"];


// 初期化処理
(() => {
	const fortuneTitles = ["失物", "待人", "学問", "金", "研究", "推し", "マンガ", "ガチャ", "その他"];
	const fortuneContents = [[
		["大吉", "2倍になって出てくる", "ちなみに私は寮のあのちっっっっっっっっさい部屋でスマホをかなりの頻度で失くします。部屋の小ささは失くす確率に関係ないようです。"],
		["中吉", "ベッドの下にはない", "ベッドの下に在るのは大抵、ほこり・薄い本・変態と相場が決まっています。ポッケと玄関先を探しましょう。"],
		["小吉", "ネタが無くなる", "3つ目にしてもう既にネタがない。<br>誰だよ81個もマス作ったの。81個もネタ考え無きゃいけないこっちの身にもなって欲しい。いいのか？ネタが無くなったらホシノ(ブルーアーカイブのキャラ)について今年中語っちゃうぞ。ホシノはいいぞぉ～"],
		["lim<sub style='font-size: 1rem;'>x → 大</sub>X吉", "限りなくそれに近いものが出てくる", "黒いUSBケーブルを探してたら白いUSBケーブルが出てきて、それで一件落着はしたんだけど、結局黒いUSBケーブルはどこ行ったんだ。ってなるアレ"],
		["凶", "時間が無い", "気づいたら年が明けていたと思ったら、授業が始まっていたり、卒研発表があったりします。去年とか過ぎるのかなり早かった気がするのは私だけですかね。去年の最初がインパクト大きかったのもあるかとは思いますが...<br>ちなみに卒研は順調ですか？私は塵です。こんなものを作っているなら卒研をした方がいいと思います。"],
		["大吉", "芋づる式", "失くしものをがっつり探してみると、案外いろいろなものが見つかったりしますよね。チャンスですよ。500円とか出てくるかもしれません"],
		["中吉", "冷蔵庫にはない", "何故か探し物をするとき、冷蔵庫を開けたくなる謎の心理現象。そんなところに探し物は無い。けど消費期限ギリギリの食べ物は発見できるかも"],
		["吉", "気づかない", "鍵とかスマホ以外の大抵の失くしものってそうですよね。失くしたというより「どこやったっけ」に近い感じ。多分ここら辺にあるんだよなって所探して無かったらかなりの大仕事になる事間違いなし。どこに物を置くかは決めておこう！(一敗)"],
		["小吉", "ネタがない", "ネタが無さ過ぎて錯綜しまくってる。もはやおみくじではなく日記とか記事の域にいってる。吉とかの運勢とかもはや関係なくなってきている。でもやらないと作り終わらないのでこのままです。あと10時間で年があけるのにまだ半分も終わっていませんﾀｽｹﾃ"]
	], [
		["吉", "大体来る", "案外呼べば人って来るよね。呼ぶのがめんどくさかったりするんですけど。あと、呼ぶと毎回来るような鬼のようにフッ軽な人ってどうなってるんだろう。液体燃料でも積んでるんですかね。"],
		["小吉", "行けたら行く", "来ない<br>でも高専生って割と「行けたら行く」で来ること多いよね。"],
		["大吉", "百万人来る", "待ち人が百万人来るでしょう。多分東京ドームでライブとかします。アルファベットチョコを買いだめしておくと良いでしょう。<br>ちなみに東京ドームの収容人数は5.5万人らしいですよ。今年の冬コミの2日目は15万人来たらしいですよ。"],
		["吉", "推し", "推しが来るでしょう。'推しに来て欲しい派閥'と'現実世界にはいて欲しくない派閥'がありますがあなたはどっち？私は'推しが存在する世界で壁になりたい派閥'所属です仲良くしましょう。"],
		["中吉", "孤高", "待ち人？知らんな。とかいう感じになるでしょう。なんだか、用事って近づけば近づくほど億劫になってきません？家出ちゃえばどうってことないんだけど、家出る直前とか「帰ってベッドでスマホいじりたい」とか思ってる。"],
		["中吉", "待宵", "待宵 : 待宵は来るはずの人を待つ宵のこと。ちなみに宵は昔は気象庁で使われ、午後6～午後9時と定義していたそうです。ただ、宵の意味は「日が暮れてまだ間もない頃」のため季節によって変わってしまう事もあり使われなくなったそうです"],
		["吉", "遅れてきたヒーロー", "待ち人は少し遅れて到着するでしょう。でもそれはヒーローの常です。「なんか渋滞しててさ」とか言いながら颯爽と現れるかも。許してあげましょう。"],
		["小吉", "予定時刻±10分", "特にゲームの予定とかはゲームの予定時刻から30分たったらで大体全員くるかなって感覚としてありますよね。予定時刻に一人ぽつんとボイチャにいるあなたには大吉ですよホント、幸あれ"],
		["中吉", "来ぬのなら 私が行こう ホトトギス", "来ないなら自分が行けばいいの精神。推しが二次元から出てこないなら我々が二次元に行けばいいのです。確実で間違いないですね。"]
	], [
		["吉", "資格コレクター", "突然資格取得に目覚めて資格コレクターになる。簿記とかいいらしいですね、知らんけど。ちなみに!!!!これ自慢なんですけど!!!応用情報技術者資格受かりました!!!試験の2ヶ月半後に結果発表とかいうとんでもスケジュールでした。"],
		["大吉", "キミもプログラムをやってみよう", "プログラムで一番難しいのはプログラムを書くのじゃなくてプログラムを書く環境を作る事なんですよね。それでオススメなんですけどProgateっていうサイトは環境構築から丁寧に教えてくれるので本当におススメです。高専生なら全部無料なんで今なら簡単に始められます。ぜひ、おすすめです"],
		["神", "夢で女神さまが教えてくれたんだ", "学問運は最高、とんでもないひらめきが来たらノートに式をメモしておくと良いでしょう。証明は人に任せておいてひらめき続ければ歴史に名を残すこと間違いなし"],
		["小吉", "明日の自分がなんとかする", "ほら、睡眠って大事だからさ。眠い中やっても効率悪いからさ、ヨシ！寝よう！明日の自分が何とかしてくれるさ！"],
		["大吉", "二択は直観を信じよ", "二択の問題で確定しなかったら、直観を信じて最初に思った方の答えを書くと良いでしょう。"],
		["吉", "学問って運要素ある？", "作ってて思ったんですよけど学問に運要素ってそんなに無くないかな、って思い始めてしまった。でもテストは運なので大丈夫です。国語って運ゲーだよね?"],
		["大吉", "ピックアップ期間", "適当に選んだ選択肢が当たる確率のピックアップ期間来てます。余談ですが、TOEICの最後の2～3行って埋まらなく無いですか？あれ全部当たるか当たらないかでかなりの差が発生する気がします"],
		["吉", "教科書", "案外技術系の教科書は使えるから捨てない方が良いってTwitterで流れてきたのでそれを信じてます。国語の教科書は要らないんだけど、使うとしたらどうやって使うんでしょうね。"],
		["Great吉", "English", "There are times when it's okay to use Japanese. For those times, it's a good idea to set your smartphone's settings to English. I recommend it because it becomes extremely difficult to use.<br>日本語でおｋとなるタイミングがあります。そんなときのためにスマホの機種設定を英語にしておくと良いでしょう。割と使いづらくなります。"]
	], [
		["凶", "割のいいバイト", "割のいいバイトがみつかるでしょう。簡単な業務のわりに報酬が高い不思議なバイトが見つかるでしょう。応募すると秘匿性の高いSNSでのやり取りが始まるでしょう。"],
		["神", "バズリ散らかす", "ニコニコ動画やってみません？動画編集楽しいですよ。なんなら一緒にやりません？自分編集できますよ。割といいなと思ったら連絡してください。YouTubeでもいいですよ"],
		["小吉", "お金なｧｧｧｧい", "∵<栗原ァｧｧｧｧｧｧｧ!!!! お金なァｧ゛ｧ゛ｧ゛ｧ゛ｧ゛ｧ゛い゛!!!!!!"],
		["凶", "Amazonでパチモン掴まされる", "今年(去年)、Amazonでイヤホンを2回買ったんですけど2回ともパチモンつかまされました。やっぱりああいうのって家電量販店とかで買うのが一番いいんすかね"],
		["吉", "散財はほどほどに", "一昨日(12/30)コミケ行ったんですけど、いやすごかった。財布の紐とかどっか行っちゃって、めっちゃ買っちゃいました。悔いはない。悩んでる時間も猶予もない状況だと恐ろしいほどに買うハードルが下がるって事を実感しました"],
		["中吉", "ATMは味方", "コンビニのATMの反応がちょっと良くなるでしょう。ちなみにATMは(Automatic Teller Machine)の略でTellerは銀行などの窓口を指すそうです。ATMができる前はCD(Cash Dispenser)やAD(Automatic Deposit machine)という機体があったらしいですね"],
		["吉", "クーポン.お前は味方なのか", "アプリだったりレシートについて来たりするクーポンが良く貰えそうです。ただ、時々ある条件を満たしてるはずなのに謎に使えないクーポンの確率が例年より高まっている予報です。お気を付けください"],
		["中吉", "ポイントは正義", "割とポイントキャンペーンに当たりやすい年となるでしょう。どうなるとどのくらい溜まるのか。本当に溜まっているのかある程度確認しておくと良いでしょう。"],
		["小吉", "自販機の当選確率", "自販機の当選確率が例年の2倍となるでしょう。あれ当たったこと無いんですけど、当たると同じのをもう一本なのか、もう一本好きなの貰えるのかどっちなんですかね。調べたらDyDoの自販機は後者らしいですね。30秒以内に選ばないと無効になるらしいですよ"]
	], [
		["末吉", "循環参照", "研究で分からない単語が出てきて調べた時に循環参照になってる事あってどうしようも無い時ありますよね。今はchatGPTあるのでギリセーフですね"],
		["吉", "終わる", "終わる。終わらせよ。終わらせねば終わらぬ。全然関係ないんだけど台パン力測定、アレ研究にしても良かったなってわりと思ってる。面白いし"],
		["凶", "素人質問で恐縮ですが", "それって先行研究とか特許との進歩性ってどうなってますかね?(死亡)となる気がするので気を付けましょう。というか気を付けます。俺絶対言われる気がする。"],
		["中吉", "研究って運要素少なくない？", "モチベーションが長続きするでしょう。1/15が予稿〆切となっております。皆さん順調でしょうか？私はこれを作っているせいで全然手を付けられておりません。何やってんだ一体、もうこれ卒研でいいだろ"],
		["凶", "バックアップ", "うぉぉぉぉｫｫｫｫｫｫｫ研究データのバックアップを取っておくんだ。パワポも資料も全部だ！！！USB一つじゃ甘い！！研究室サーバがあるなら研究室サーバにも保存しておくんだ！今できるなら今だ！！！！月初めで1ヶ月毎にやるんだ！！！！今年の春にHDD2000GBのデータを失った者として言えるのはこのくらいだ！！！！"],
		["大吉", "いけるいける", "できることを全部ちゃんとやっとけば何とかなります。うんうん何とかなる。何とかするしかない。こう考えると先輩方よくやってたな...って思いますよね"],
		["凶", "バックアップ", "マジで！！！！ホントに！！！！バックアップ大事だから！！！！！いつPCがぶっ壊れるか分からないから！！！！！ホントに！！！USB1だけでもいいから！！！ホントはクラウドとかにも保存すると安心だけど！！！！データ消えた時本当に3日ぐらいうつ伏せから復帰できないから(今年の春の体験談より)"],
		["小吉", "特許検索", "特許検索のJ-PlatPatは1/6(月)09:00までメンテ中なのでお気を付けて。詳細情報は公式ホームページへ。年末年始はどこもやってませんね..."],
		["吉", "ネタがない", "研究に運なんてありません。頑張り次第です。本当に書くことがありません。あと3時間で18個も残ってますﾀｽｹﾃ。あと2025年は昭和100念らしいですよ。エヴァの作中時間から10年が経過し、ターミネーターT-800ができるまであと4年、ドラえもんができるまであと87年ですね。"]
	], [
		["大吉", "ラッキー属性<BR>元気っ子属性", "いいですよね人なつっこい系の元気っ子 後輩であって欲しい いつもちょっかいかけて弄ってくるんですけどこっちが元気無さそうにしてくると一変大人しくなるんですよねわかります自分わかります"],
		["中吉", "ラッキー属性<BR>だらだら系", "いいですよね。何もしてないの「うへ～、つかれたよぉ～」とか言ってぐでぇ....ってつぶれててほしいですよねわかりますわかりますホシノって言うんですけどこの時期は布団からなかなか出てこないんですよね"],
		["大吉", "ラッキー属性<BR>無口キャラ", "いいですよね無口キャラ、喋る必要性を感じていないというか特に我関せずのスタンスだったり、でもそれがちょっとコンプレックスで頑張って喋ろうとする姿が一番良いですよね。長門有希(ハルヒ)とか綾波レイ(エヴァ)とか岩崎みなみ(らき☆すた)とかいいですよねわかります"],
		["吉", "ラッキー属性<BR>長身糸目京都弁キャラ", "いいですよね糸目キャラ。強い。糸目は京都弁であってほしいし狐耳がついていて欲しい。語気強めの正論京都弁で実力のある高身長細目キャラが壮絶な戦いの末、痛々しい姿で「ごめんな、負けてもた」と淡々と今の状況や敵の弱点を言って主人公に全てを託すシーンが見たいですよね分かります"],
		["大吉", "ラッキー属性<BR>闊達カリスマ系", "いいですよねカリスマ系 勝手に人が集まっていくタイプ。先輩であって欲しい。誰もいないところで嗚咽するように泣いている所を見られて「恥ずかしいから皆には内緒...ね？」って泣き腫らした顔といつもの声で笑いかけてくるんですよねわかります。"],
		["中吉", "ラッキー属性<BR>能筋天才キャラ", "いいですよね天才キャラ。普段は「威力が足りない？火薬の量を2倍にすればいいのさ！」とかこいつ頭いいのか悪いのかどっちなんだみたいな感じてあって欲しい。ピンチの時は、針に糸を通すような緻密な頭脳戦に勝利した後に「言っただろう？私は大天才だって」とかどや顔で言うんですよねわかります。 頭いい人との会話だといつもとは違う感じで楽しそうに訳わからないこと話してて欲しいですよねわかります"],
		["大吉", "ラッキー属性<BR>最愛の人を失い闇に身を染めたキャラ", "いいですよねわかります。自分「鬼滅の刃」の狛治さんが一番好きなんですよね。自暴自棄になって闇に染まって主人公の前に立ちはだかって欲しい。最愛の人の記憶を何よりも大事にしてて過去編が始まろうとすると、マンガのコマの外から「お前らにも誰にも俺の大事な記憶は見せねぇよ。」とか言って過去が謎のままでいて欲しいですよねわかります"],
		["吉", "ラッキー属性<BR>アンドロイド系キャラ", "いいですよねアンドロイド系キャラ。アンドロイドであることに謎の自信をもってて欲しいし有効活用してて欲しいですよね。「私は製造から3年なので幼児料金でいけますよね！」とか自信満々に言ってて欲しい分かります分かります。"],
		["中吉", "ラッキー属性<BR>天然系キャラ", "いいですよね天然系キャラ。普段アホなこと言ってる割に行き詰まったときとかに「え、これって○○じゃだめなの？」とか言って回りをハッとさせるキーパーソンであって欲しい。でも普段はアホなことしか言ってないので無下に扱われてて大抵「はいはい」「そうだね」って返事されててセリフの外に”なんか雑じゃない？”とか書いてて欲しいですよね分かります分かります"],		
	], [
		["大吉", "アクション系", "いいですよねアクション系。やっぱり王道。読み始めたらずっと戦っててずっとアツいシーンだから止まらないですよね。画力もさながら能力や戦略も面白い最強ジャンルオススメです。"],
		["中吉", "人間ドラマ", "いいですよね人間ドラマ。王道。個人的には普通の人間と普通じゃない人との作品がかなりおススメです。違いを受け入れながら過ごしていく様がとても良い。普通から離れれば離れるほど面白いと思っているジャンルです。オススメ！"],
		["大吉", "異世界なろう系", "いいですよね異世界なろう系。最初に読むものと言えばやっぱりなろう系。難しい事考えずにサクサクと敵を倒していくのは爽快そのもの。中盤から読み続ける人が減ってきてしまうものも多いですが、やっぱり楽しいジャンルなのでおススメです"],
		["吉", "ホラー・SF系", "いいですよねSFとかホラー系。得体の知れない怖さがありながらも戦ったり逃げたりするジャンル。得体の知れないものが最後まで分からないものも多くて読了後も想像の余地がある作品が多くておススメです。"],
		["大吉", "日常系", "いいですよね日常系。ただ淡々と日常を友人と過ごしていく話。会話の面白さに作者さんの腕が問われるジャンル。単話を続けていくタイプが多いのでしっかり物語が好きな人は苦手かも。静かで面白いジャンルなので割とオススメです。"],
		["大吉", "スポーツ系", "いいですよねスポーツ系。だんだんと仲間が集まってきて強くなっていくあの感じはスポーツ系ならではですね。個人的にはフェンシング・水球・カバディ等のマイナースポーツのマンガもかなり好きなのでオススメです"],
		["大吉", "読切系", "いいですよね読切マンが。個人的に一番好きな形態のマンガです。一話完結型のマンガでジャンプ+等で読めます。何が良いかって1番は1話で起承転結が終わる事。長引いたマンガはうまく終わらない事もありますが読切にはありません。大体60～8oPで完結して、マンガ家の凄さをギュッと濃縮して味わえるのでとてもオススメです。実は有名な作品も読切から始まってることがありますよ。"],
		["中吉", "レポ漫画系", "いいですよねレポ漫画系。Twitterとかで一番流れてくるタイプの実際に体験したことに少しフィクションを混ぜた漫画。確定申告だったり、手術だったり、旅行だったり、ためになるものが多いのでおススメです。"],
		["大吉", "軍事系", "いいですよねミリタリー系。どこまでも泥臭く着実に戦っていく華のない戦いが良い！話が複雑になりがちなジャンルだけど分かりやすくて面白い作品も沢山あるのでオススメです"]
	], [
		["大吉", "当たる", "100連を引け<br>※効果には個人差があります。運勢は効果を保証するものではありません。"],
		["吉", "当てる", "当たるまで引けば当たるんですよ。そう、天井ならね。諦めなければどんなガチャも当たるって古事記にも書いてある。書いてないっすか、その古事記アプデした方がいいっすよ"],
		["末吉", "無我の境地", "やっぱり欲にまみれてると出るもんもでないですね。寝起きで引きましょう。ちなみにガチャは1965年にアメリカからカプセルトイが日本に入ってきたのが始まりらしいです。だいたい60年くらいの歴史があるんですねぇ"],
		["凶", "確率を求めてみよう", "はい、確率の勉強のお時間です。復元抽出ですね。x%のガチャを99%以上の確率で獲得するためには何回引けばいいかを計算してみましょ～。n回引いて全部はずれる確率は(1-x)^nなのでそれが1%(0.01)にするようにすると、<br> (1-x)^n = 0.01より <br> n = log_(1-x) 0.01 = log0.01 / log(1-x) = -2 / log(1-x) で -2 / log(1-x) 回引けば99％の確率で当てることができますね！ちなみに1%の場合は458回引けば99%当たる計算です。"],
		["中吉", "南南西の方角が吉", "2025年の恵方は西南西の方角らしいので西南西に向かって引いてみましょう。ちなみに恵方は歳徳神と呼ばれるその年度における福徳を司る神がいる方角らしいですよ。"],
		["大吉", "おみくじもガチャでは？", "作ってて思ったんですけどおみくじもガチャですよね。調べたら今のおみくじのような様式ができたのは江戸時代。中国から入ってきた天竺霊籤を変化させてできた三大師百籖が元、明治時代に神仏分離で仏教由来の三大師百籖を使えなくなった神社がおみくじを使い始めた。ということらしいですね。"],
		["小吉", "ガチャの実装", "ガチャの実装って案外めんどいんですよね。まず、新しいキャラの追加が容易でなければならない。天井もあれば100連最低保証、さらにはピックアップガチャもあるなんてなったら大変。ちゃんと設計しないとキャラ・イベントを追加するときに編集するコードがあちこちに、、、なんて地獄になりかねません(一敗)"],
		["中吉", "運をあなたに", "一昨日(12/30)初めてコミケに行ってきたんですけどお目当てのサークルがほとんど売り切れてて膝から崩れ落ちそうになったので、まだ運が残ってるはずです。うんそうだそうに違いない。それをちょっとだけお裾分け～。ちなみにコミケはちゃんと人がアホの量居ました！凄かった！！！"],
		["中吉", "正式名称", "ガチャはガチャガチャからきててガチャガチャの正式名称はカプセルトイらしいですね。耳馴染みのあるガチャガチャ・ガチャポン・ガシャポン・ガチャはいずれも企業の登録商標らしいです。どこなんだろうと調べようとしたらJ-PlatPatが1/6までメンテ中でした..."]
	], [
		["中吉", "VTuber面白いっすよ", "分かります。VTuber見る前はVTuber見始めたら成れ果てヲタクになってしまうと思ってた。実際なりますけど、ならないのもあります。そんな人にはにじさんじという企業にいるおっさんたちがオススメです。おっさんなのでアイドルアイドルしません。ラジオ企画とかやります。個人的なオススメは「ジョーカー(じょーりきいち)」です。ぜひ「ジョーカー　一口嘘ニュース」で調べてみて下さい。本当面白いです"],
		["大吉", "ファミレスを享受せよ", "2024年面白かったゲームです。ブラウザで「ファミレスを享受せよ」と調べるとできるのでぜひ。寝れない夜にピッタリのゲーム。綺麗な効果音とゆったりした絵柄と不思議な世界観のファミレスで永久に等しい時を過ごす話。なんとドリンクバーもある.....。寝れない夜におススメのゲーム。"],
		["吉", "コミケ楽しかった", "今年始めてコミケ行ってきたんですけど楽しかったっすね。まず人がアホの量いてテンションが上がります。想像より治安が良かった。サークルの行列の最後尾看板を参加者が持つ位には治安がいいです。でも場内は戦場でした。想像していたよりも早く、圧倒的に早く売り切れてしまうので皆必死に歩いてます。靴は踏みますし踏まれます。人の流れにのる技術を身に付けるか背の高い奴を連れていくといいと思います。吟味する時間なんてないので前日までに吟味を済ませて置かないといけなかったです。入場は2時間前にならび始めても余裕で売り切れてます。コスプレを見るのはかなり楽しいかったです。係の人もコスプレしてて良かったです。コミケは楽しかったです。"],
		["中吉", "コスプレ楽しいよ", "今年も文化祭でコスプレしたんですけど、楽しいですよ。オススメはお面です。顔を隠せるとわりかし好き勝手できて楽しいです。顔出してコスプレする勇気は自分も無いです。やるときは階段移動を気をつけて下さい。いつかコミケでコスプレしてみたいとか思ったり思わなかったり"],
		["大吉", "マイクラ楽しいよ", "今年久しぶりにPVP大会のテストプレイをしたんですけど、楽しかったですね。やっぱりアドレナリンが出ますね。マイクラだと戦略性もかなりあるので楽しいですね。どんどん企画するのでぜひ！いつか大人数で大規模にPVPしてみたいなぁ～って思ったりしてます。ぜひ！"],
		["吉", "メーカーフェア", "今年始めてメーカーフェア行ったんですけど楽しかったですね。会場はビックサイトでコミケの技術版みたいな感じでした。ファミコンのラジコンだったり、水蒸気ホログラムだったり、新しい楽器だったり、個人から企業まで面白い物が沢山展示してあって楽しかったです。少しおススメです。東京遠いからね..."],
		["大吉", "カラオケオール", "今年始めてカラオケオールしたんですけど楽しかったですね。声は3日間くらい死んでましたが。深夜テンションでウルトラマンシリーズ熱唱しました。誰もウルトラマン知らないのに。おススメかと言われると普通に行った方がいいかなって感じです"],
		["大吉", "動画製作楽しいよ", "今年は5Sの展示企画と将棋部の宣伝動画の編集を担当したんですけど楽しかったですね。映画の予告編っぽく作るのは、作りやすいしクオリティもそこそこ出るし何より楽しいのでおススメです。初めての人は「ゆっくりムービーメーカー4」っていうソフトが一番使いやすいと思うのでやってみたいな～って人はぜひ"],
		["小吉", "コート買ってみました", "今年始めてコートなるものを買ってみたんですけどいいですねあれ。そこまであったかく無いので、屋内でも暑くならないのが利点。普段がっつり外に出ない人間にとってはあれで十分です。ロングコートだとマトリックスごっこもできます。"]
	]];

	const comicsData = [
		[
			["芋虫少女とコミュ障男子", "美人で成績優秀で優しくて何もかも完璧な幼馴染みは自分に恋をしている。そんな彼女からの告白を僻みから断ってしまい、彼女は人外に身を落とす決断をする――…。静かな話で'無くし物'の意味合いが強い作品", "https://piccoma.kakaocdn.net/dn/b88h03/btqEd5oAPlm/bnCacQbKjGYc6XQBeYXQwk/cover_x2", "https://piccoma.com/web/product/28139?etype=episode"],
			["エロ漫画家おねーさんとお疲れリーマン", "36歳バツイチのサラリーマン・勅使河原三蔵が引っ越したマンションの隣にはエロ漫画家・只野くおんが住んでいた。ふとしたきっかけから只野と仲良く？　なり、なぜか一緒にご飯を食べる間柄に!?　自由奔放な只野に終始振り回される勅使河原だが、そんな関係も嫌じゃない？　焦れったい二人のドキドキラブコメディ。", "https://piccoma.kakaocdn.net/dn/b069Zh/btsts5ELALb/95VnfJaPkyvi1yuOfX1LsK/cover_x2", "https://piccoma.com/web/product/141227?etype=episode"],
			["作者の画力が足りない。", "漫画の中で当たり前に描かれている背景や小物の数々…。 もしもそれらが作者の『画力』の都合でまともに描かれなかったとしたら…？ 画力の足りない作者に振り回される、不憫なふたりの男の奮闘物語!!", "https://piccoma.kakaocdn.net/dn/dkG57a/btqEVUgfvhA/KUGres9RavkiBFZxnCeQD1/cover_x2", "https://piccoma.com/web/product/32918?etype=episode"],
			["マーブルビターチョコレート", "パパ活を繰り返す、りこの前に現れた新しいパパは、女性の東。 何もかも対称的なふたりだが、触れ合うにつれ、互いに心を許し合ってゆく。 しかし東には「パパ活ルポルタージュ」を執筆するという裏の目的があり……。 若さが誘う生と死、そして恋の物語。", "https://piccoma.kakaocdn.net/dn/cLvz2Z/btreibHk0an/Kv5fKlKesqcayaGjczXub0/cover_x2", "https://piccoma.com/web/product/73218"],
			["三十路病の唄", "30歳、高校の同窓会で再会した6人。皆、社会に出てそれなりの生活を送っていたが、なんだか物足りない思いがあった。高校時代には、それぞれ夢があった。プロゲーマー、ミュージシャン、芸人…。誰かが言った「もう一度夢に向かってもがこうぜ」。6人は仕事を辞め、シェアハウスに集まった。30歳から夢を追う、大人の青春物語。", "https://piccoma.kakaocdn.net/dn/bm9WqJ/btsrhZG2S7V/uGFwl3khf6cGiCk3eQNUr0/cover_x2", "https://piccoma.com/web/product/75248?etype=episode"],
			["日本沈没", "１１月の東京・新宿。潜水艇操縦士の小野寺俊夫は立ち寄った飲み屋で「ビルが突然地中に飲みこまれる」という不可解な事件に遭遇する。偶然居合わせたレスキュー隊員の機転で窮地を脱したかに思われたが、それは日本に起こる災厄の序章にすぎなかった…", "https://piccoma.kakaocdn.net/dn/zwMmd/btsJTfx5jZl/G9ZtUy2dE05ZbztKW0oDs0/cover_x2", "https://piccoma.com/web/product/2677?etype=episode"],
			["幸せをあなたに", "アボガド６がこれまでウェブで発表してきた短編のうち、表題作を含む厳選された１５作品を収録。生と死を巡るアボガド６の物語センスがここに結晶化する。", "https://piccoma.kakaocdn.net/dn/hEu6m/btqwHe8kDzk/qrmrPITSTHFSKnFcGumKp0/cover_x2", "https://piccoma.com/web/product/9194?etype=episode"],
			["スカベンジャーズアナザースカイ", "怪しい研究施設“停留所(バスストップ)”を拠点に活動する武装少女“収集隊(スカベンジャー)”…　彼女たちが派遣されるのはお宝が眠る異界“BP(ブラックパレード)”　そこに潜んでいたのは異形の幽霊…!?　探索! 撃破!! 収集!!! 100万ドルを集めて自由の身となるため少女たちは命懸けのゴミ拾いを遂行する!!　「第一種猟銃免許」所持のリアルガンナー漫画家『狩猟のユメカ』の古部亮が描く、少女異界ガンアクション!!", "https://piccoma.kakaocdn.net/dn/svZFa/btsI7Xl3Q2K/LBF5AZ6CeqxNHGkIhuFcxK/cover_x2", "https://piccoma.com/web/product/138830?etype=volume"],
			["ヲタクに恋は難しい", "隠れ腐女子のOL・成海(なるみ)と、ルックス良く有能だが重度のゲーヲタである宏嵩(ひろたか)とのヲタク同士の不器用な恋愛を描いたラブコメディ。『次にくるマンガ大賞2014』の〝本にして欲しいWebマンガ部門〟第1位、pixiv内オリジナルコミックブックマーク数歴代1位の大人気作品", "https://piccoma.kakaocdn.net/dn/bodzHb/btsLxNU4UL9/VRN7ELySns3xBBm6CdXJMk/cover_x2", "https://piccoma.com/web/product/12973?etype=episode"],
		],
		[
			["宇崎ちゃんは遊びたい！", "SNSを中心に話題沸騰！ウザいけれどカワイイ巨乳後輩宇崎ちゃんとのドタバタラブコメが単行本化！静かに放課後を過ごしたい大学3年生、桜井真一だが、毎度毎度宇崎ちゃんがウザ絡みをしてきて―――？", "https://piccoma.kakaocdn.net/dn/ck0Jf8/btsLA76YOUh/5yRySwQhaP0KhXDrb8i4cK/cover_x2", "https://piccoma.com/web/product/11206?etype=episode"],
			["メイドインアビス", "隅々まで探索されつくした世界に、唯一残された秘境の大穴『アビス』。どこまで続くとも知れない深く巨大なその縦穴には、奇妙奇怪な生物たちが生息し、今の人類では作りえない貴重な遺物が眠っていた。アビスの不可思議に満ちた姿は人々を魅了し、冒険へと駆り立てた。そうして幾度も大穴に挑戦する冒険者たちは、次第に『探窟家』と呼ばれるようになっていく。アビスの緑に築かれた街『オース』に暮らす孤児のリコは、いつか母のような偉大な探窟家になり、アビスの謎を解き明かすことを夢見ていた。そんなある日、リコはアビスを探窟中に、少年の姿をしたロボットを拾い…？幻想と機械が入り混じる大冒険活劇", "https://piccoma.kakaocdn.net/dn/DtrIr/btsLfCsFi8F/aYOGkOSbkMGAgQN2HkKfek/cover_x2", "https://piccoma.com/web/product/61?etype=episode"],
			["キングダム", "時は紀元前――。いまだ一度も統一されたことのない中国大陸は、500年の大戦争時代。苛烈な戦乱の世に生きる少年・信は、自らの腕で天下に名を成すことを目指す!! 2013年、第17回手塚治虫文化賞マンガ大賞受賞！", "https://piccoma.kakaocdn.net/dn/g754O/btsLmTN7JEY/56f4R8BkHJMRz75Bj8VOI1/cover_x2", "https://piccoma.com/web/product/4127?etype=episode"],
			["【推しの子】", "「この芸能界（せかい）において嘘は武器だ」　地方都市で、産婦人科医として働くゴロー。芸能界とは無縁の日々。一方、彼の“推し”のアイドル・星野アイは、スターダムを上り始めていた。そんな二人が“最悪”の出会いを果たし、運命が動き出す…!?　“赤坂アカ×横槍メンゴ”の豪華タッグが全く新しい切り口で“芸能界”を描く衝撃作開幕!!", "https://piccoma.kakaocdn.net/dn/eChFQg/btsLmmwxYEO/eiLEUPBxD3oo7RHKZb8fN0/cover_x2", "https://piccoma.com/web/product/37428?etype=volume"],
			["ガールクラッシュ", "歌もダンスもできてスタイル抜群の百瀬天花（ももせ・てんか）は高校1年生。なんでも上手にこなせるけど、恋だけはうまくいかない。そんなとき、K-POPが大好きな佐藤恵梨杏（さとう・えりあん）に出会い、そのひたむきな姿に目がくらんで――。少女たちの青春は、K-POPアイドルの夢に向かって動き出す!!", "https://piccoma.kakaocdn.net/dn/brOxC4/btsIqTx9hKO/vk8LhxFMBU7a9hNm7MMNgK/cover_x2", "https://piccoma.com/web/product/64703?etype=episode"],
			["人間のいない国", "この街は不気味で、何処かやさしい――。 「シイ」が目を覚ますとそこは、人間が消え文明だけが取り残された世界だった。 謎の「三角頭」から逃げ惑うなか、彼女は一つ目のゴーレム「バルブ」と出逢う。 ゴーレムは'人間への奉仕'を行う自律式人形で……？ これは、命有る者と無き者との絆が世界を変える物語。 異種間マンガの旗手が紡ぎだすのは「人外×少女」の新境地――！", "https://piccoma.kakaocdn.net/dn/bGaHqd/btsDLuQiU9j/7L8p5uGVBYUSSP7zyCq5sk/cover_x2", "https://piccoma.com/web/product/23939?etype=episode"],
			["アイアムアヒーロー 完全版", "鈴木英雄、35歳。漫画家のさえないアシスタント生活を過ごす中、 悶々とした現実に勝つため時に妄想に逃げ込み、 救いであるはずの恋人にも不安と不満が募る。 だがある日、気付かぬうちに謎の感染症が蔓延し始め… 現実の世界が壊れ、姿を変えていく…⁉ 迷い込んだのは、日常と非日常、平凡と狂気が交差する世界。 極私的サバイバルパニックホラーここに開幕‼", "https://piccoma.kakaocdn.net/dn/bkKOZo/btsFYshYnfi/ce2s5vqPKX9tZwKwlQjexk/cover_x2", "https://piccoma.com/web/product/79510?etype=episode"],
			["ふたり明日もそれなりに", "募る想いに、恋の駆け引き――そんな段階を通り過ぎ、一緒に暮らすことになって2ヵ月目の社会人カップル、愛田優弥と相原里央。恋人以上、結婚未満のふたりの同棲生活は、今日もそれなりに幸せです。ふつーな毎日が愛おしい。SNSでも大人気の同棲日常ラブコメディ！", "https://piccoma.kakaocdn.net/dn/bFqnXk/btrSUb9V1za/q2FkN4lTYk2VFqNbfyYZk0/cover_x2", "https://piccoma.com/web/product/59427?etype=episode"],
			["ブルータル 殺人警察官の告白", "錦戸亮主演でTVドラマ化され、大ヒットとなった『トレース 科捜研法医研究員の追想』、漆黒のスピンオフ――。法で裁けない極悪人に、最悪の死を与える男がいる。警視庁捜査第一課、壇浩輝。元警視総監の父を持ち、キャリア組で出世街道を邁進する彼の裏の顔は、100人を超える悪人たちを殺してきたシリアルキラー。悪人に、死刑を超える私刑を贈る純黒のサスペンス――。", "https://piccoma.kakaocdn.net/dn/SuVo5/btsLfxkNEnv/87U6uYUfntMRowfOVayCl0/cover_x2", "https://piccoma.com/web/product/14195?etype=episode"]
		],
		[
			["葬送のフリーレン", "魔王を倒した勇者一行の後日譚ファンタジー魔王を倒した勇者一行の“その後”。魔法使いフリーレンはエルフであり、他の３人と違う部分があります。彼女が”後”の世界で生きること、感じることとは－－残った者たちが紡ぐ、葬送と祈りとは－－物語は“冒険の終わり”から始まる。英雄たちの“生き様”を物語る、後日譚（アフター）ファンタジー！", "https://piccoma.kakaocdn.net/dn/bWmZjl/btsLcv1QIvv/xP17kbaPYEkyCTKKhzM9e1/cover_x2", "https://piccoma.com/web/product/40768?etype=episode"],
			["SE", "SE（システムエンジニア）を目指す主人公・丘史郎が就職した先の社長は型破りな「天才SE」で「女子高生」??　しかも開発するのは男がお世話になる×××××で…!？　ハイテンションでマジメな本格SEコミック!!", "https://piccoma.kakaocdn.net/dn/dSpvUd/btqsIoHN3Uf/TvXkt3NT6Vq4f761kbF0u1/cover_x2", "https://piccoma.com/web/product/5383?etype=episode"],
			["最果てのパラディン", "これは罰なのか。それとも――― “生”に挫折し、生きることを手放した男に与えられたものは、新たな人生と不思議で歪な家族だった。 磊落（らいらく）な骸骨の剣士・ブラッド、淑やかなミイラの神官・マリー、偏屈な幽霊の魔法使い・ガス。 三人の不死人の庇護のもと、かつて滅びた死者の街で暮らす少年・ウィリアム。 彼は前世を悔い、再び生まれ落ちたこの新たな世界で“生き直す”ことを決意するのだった。 「小説家になろう」発、王道ハイファンタジー開幕！", "https://piccoma.kakaocdn.net/dn/6IjVp/btsF1Tz67VX/Btgzlc6X5MoZrWl19r8rK0/cover_x2", "https://piccoma.com/web/product/3796?etype=episode"],
			["サイケまたしても", "葛代斎下は、将来の夢も特別な能力もない、どこにでもいる、ごく普通の中学三年生。平凡で退屈な毎日を過ごすサイケだったが、ある日、幼なじみの蜜柑が事故で死んでしまう。絶望したサイケが池に飛び込むと、蜜柑が事故で死んだ“今日”が再び始まった。蜜柑を救うべく、問題の“今日”を繰り返すサイケだが…？あなたにはやり直したい一日はありますか？", "https://piccoma.kakaocdn.net/dn/boh96b/btqs62v9HEn/K7mMw4UopSv8c4NTU4dhq1/cover_x2", "https://piccoma.com/web/product/4818?etype=episode"],
			["今際の国のアリス", "やりきれない日常に苛立つ高校生・有栖（アリス）良平が悪友の苅部（カルベ）や張太（チョータ）とブラつく夜、街は突然巨大な花火に包まれ、気づけば周囲の人気は消えていた。夜、ふらりと入った神社で告げられる「げぇむ」の始まり。一歩誤れば命が奪われる理不尽な難題の数々を前に、アリスの眠っていた能力が目覚め始める…「呪法解禁！！ハイド＆クローサー」の麻生羽呂が全くスタイルを変えて挑む戦慄のサバイバル・サスペンス、開幕！", "https://piccoma.kakaocdn.net/dn/bF6hTT/btsLfv8and7/bFkktcqmeLdIg8lJqUiHr1/cover_x2", "https://piccoma.com/web/product/3810?etype=episode"],
			["ここは今から倫理です。", "「倫理」とは人倫の道であり、道徳の規範となる原理。学ばずとも将来、困る事はない学問。しかし、この授業には人生の真実が詰まっている。クールな倫理教師・高柳が生徒たちの抱える問題と独自のスタンスで向かい合う――。新時代、教師物語!!", "https://piccoma.kakaocdn.net/dn/SqqWj/btsHq4NUyJd/vqPMSxL98ewBEUNFl43Ej0/cover_x2", "https://piccoma.com/web/product/6302?etype=episode"],
			["だんしんち", "立川にあるボロアパートで一人暮らしをする大学２年生・壇野心志、 通称「だんしん」の部屋は友人達の溜り場になっていた。 3C男子（童貞・コミュ症・貯金ゼロ）のだんしんを筆頭に、 天然マイナスイオン系男子・ぐーぐー、 ドＳなサブカルクソメガネ・シャンピが集う部屋には、 ゆるっと楽しい時間が流れていく…。", "https://piccoma.kakaocdn.net/dn/yaHmV/btqobijTpGX/KfSapD58YLYo2B9Q9ldvNk/cover_x2", "https://piccoma.com/web/product/3195?etype=episode"],
			["の、ような。", "それは人生の劇的変化…。一人暮らしの希夏帆の前に恋人・愁人が連れてきた二人の少年。二人は愁人の親戚で両親を失ったばかりの兄弟だという。希夏帆の家で生真面目な中学2年生の冬真、天真爛漫な5歳の春陽、そして愁人の4人は同居生活をすることに。戸惑う日々の中、彼らの新たな関係が始まるーー。", "https://piccoma.kakaocdn.net/dn/fvNKQ/btsLjmEuzkw/wAxYttpWqojz9Dsi2bomF0/cover_x2", "https://piccoma.com/web/product/10682?etype=episode"],
			["ヘテロゲニア　リンギスティコ　～異種族言語学入門～", "怪我をした教授に代わり、魔界でモンスターとの言語的＆非言語的コミュニケーションの調査を任されたハカバ君。ガイドのススキと共に魔界を旅をする、新人研究者の苦悩と日常を描いたモンスター研究コメディ！", "https://piccoma.kakaocdn.net/dn/bIWdHi/btsKscBoeww/vEz6uKsIIVOKwwVnTzhEu0/cover_x2", "https://piccoma.com/web/product/14600?etype=episode"]
		],
		[
			["夏とレモンとオーバーレイ", "本業の仕事はほぼゼロ、配信でのわずかな投げ銭とバイトで食い繋いでいる声優の「ゆにまる。」は、大企業勤めのOL・紺野さやかから「私のお葬式で遺書を読み上げてほしい」という予想もしない依頼をされる。訝しみつつも金額に目がくらみ、依頼を受けることにしたゆにまる。だったが、肝心のさやかは遺書の内容を決めるための会議と称して遊びまわっていて…。「第3回百合文芸小説コンテスト」百合姫賞作品原作、夢、生活、人生の豊かさ…“世界（レイヤー）”の違う二人、一度きりの夏の物語。", "https://piccoma.kakaocdn.net/dn/fjAOf/btrWeX1CcXv/KkBJ2QsCjzpXNAfquCrfu0/cover_x2", "https://piccoma.com/web/product/124171?etype=episode"],
			["ミワさんなりすます", "なりすまし家政婦×イケオジ俳優の恋愛劇映画マニアのフリーター・久保田ミワは、敬愛する国民的俳優・八海崇が家政婦を募集していることを知る。八海邸へ偵察に行ったミワは、偶然の事故により、マネージャーに本物の家政婦と間違えられ、その日から“なりすまし”家政婦として、彼の家で働くことになってしまう。", "https://piccoma.kakaocdn.net/dn/4sCjU/btsJQCgrriz/p82oQVjPlZDSdKjS2JUVSK/cover_x2", "https://piccoma.com/web/product/74528?etype=episode"],
			["変な絵（コミック）", "【『変な家』著者・雨穴の最高傑作を完全コミカライズ！】オカルトサークルに所属する佐々木は、後輩の栗原からとあるブログの存在を教えられる。 そこには、『あなたが犯した罪』という不穏なメッセージと共に投稿者の妻”ユキ”が描いた「絵」が掲載されていた――。9枚の絵に秘められた謎を解き明かす戦慄の国民的スケッチ・ミステリー！ その謎が解けたとき、すべての事件が一つにつながる……!!", "https://piccoma.kakaocdn.net/dn/bMb2Dh/btsJ7mFjZoZ/TOug3QuMdVQnXd8O9Vf5YK/cover_x2", "https://piccoma.com/web/product/172888?etype=episode"],
			["ふかふかダンジョン攻略記 ～俺の異世界転生冒険譚～", "全冒険者、必読。　複数の国家と軍でも攻略しきれぬ最強最悪の超巨大ダンジョン「深き不可知の迷宮」（通称・ふかふかダンジョン）。その攻略に挑むジャンは、ひょんなことから異世界に転生した一介の元・派遣社員だった…！「魔法少女プリティ☆ベル」のKAKERUが描く、異世界転生を「転生」させる超王道ファンタジー！！", "https://piccoma.kakaocdn.net/dn/Wc7tH/btsLbxTwqoU/JRXuXsHHro6LG6AOckuQHk/cover_x2", "https://piccoma.com/web/product/26221?etype=episode"],
			["賭博黙示録 カイジ", "上京後、自堕落な日々を過ごしていた伊藤開司（カイジ）は、ある日金融業者の遠藤により、かつて自分が保証人になっていた借金を押しつけられる。遠藤に誘われるままカイジは負債者に借金一括返済のチャンスを与えるというギャンブル船「エスポワール」に乗り込む。そこで行われるのはカード12枚を使った「限定ジャンケン」。うまく勝てば借金は帳消しだが、負ければ命の保証は無いというものだった……。", "https://piccoma.kakaocdn.net/dn/bOQ37u/btsCBMp5Otw/TLxxIssTMyKojJKZ7sg6gK/cover_x2", "https://piccoma.com/web/product/800?etype=episode"],
			["ib －インスタントバレット－", "この世界のすべては敵だ。周囲から疎まれ、孤立している深瀬クロは、クリスマスイブの夜に魔法使いを名乗る少女・セラと出会う。セラの魔法が「視えた」クロは彼女に誘われ、街なかに現れた化け物を協力して退治することになる。しかし、その化け物の正体はクロと関係があり……。", "https://piccoma.kakaocdn.net/dn/lNv8J/btqoULLRsN4/brgBu9tgrOBMcmWEtOMFfK/cover_x2", "https://piccoma.com/web/product/3435?etype=episode"],
			["うたかたダイアログ", "とあるショッピングモールのドラッグストアでアルバイトをする高校生、宇多川と片野。部活で全国優勝を目指したり、胸を焦がすような恋愛をしてみたり、不思議な力を使って世界を救ったり、異世界に召喚されて魔王を倒したり…そんなドラマとは一切無縁な二人の高校生活。基本的には無駄口を叩いているだけですが…それが、何だかとても楽しいんです。", "https://piccoma.kakaocdn.net/dn/bfGQsa/btsLsPflLyo/KnsP5KPuqsuREI4XdEoDQ1/cover_x2", "https://piccoma.com/web/product/13599?etype=episode"],
			["BEASTARS", "肉食獣と草食獣が共存する世界。そこには、希望も恋も不安もいっぱいあるんだ。チェリートン学園の演劇部員レゴシは、狼なのにとっても繊細。そんな彼が多くの動物たちと青春していく動物群像劇が始まる!!", "https://piccoma.kakaocdn.net/dn/J9lgM/btsLqz9MBIE/agSl0EVM0i6W1KdeDOTbA1/cover_x2", "https://piccoma.com/web/product/2132?etype=episode"],
			["人間工場", "人が人を造る「人間製造計画」が発令された未来。会社員の磯原は恋人欲しさに謎の少年・大嶽が工場長を務める「人間工場」を訪れるが…。生命を巡る人間譚", "https://piccoma.kakaocdn.net/dn/hGN3w/btslRRBoG6m/GnNP0d50aR10BSqJdLk0tK/cover_x2", "https://piccoma.com/web/product/2041?etype=episode"]
		],
		[
			["紅殻のパンドラ", "【電子版ならではの巻末設定資料が士郎氏自らオールカラー化！】全身を機械化した「全身義体」を持ちながら、天涯孤独な天然少女が初めて心を許したのは…謎めいた美女と、地上最凶の美少女型戦闘アンドロイド！？", "https://piccoma.kakaocdn.net/dn/TPQ7v/btsKCkUzafV/wgaBl0XlRJkosddcUfOS1k/cover_x2", "https://piccoma.com/web/product/17934?etype=episode"],
			["少女終末旅行", "終末世界でふたりぼっちになってしまったチトとユーリは、愛車のケッテンクラートに乗って延々と広がる廃墟をあてもなくさまよう。日々の食事さえも事欠く、明日の見えない毎日。だけどそんな「日常」も、ふたり一緒だと、どこか楽しげだったりもして……。", "https://piccoma.kakaocdn.net/dn/7zFLz/btsLjoBtaDQ/xANFzydD8J8Od5NfN4Zx1k/cover_x2", "https://piccoma.com/web/product/1348?etype=episode"],
			["理系が恋に落ちたので証明してみた。", "「……私、貴方のこと好きみたい」「よし！ この恋、証明するぞ！」研究に情熱をそそぐ、理系女子と理系男子がもし恋に落ちたら？ 個性的な理系達が集う大学の研究室を舞台に、山本アリフレッドが描く、笑いありキュンキュンありの『恋の定義から始まる』実験理系ラブコメディ登場!! 『理系女子』×『理系男子』＝理ア充!?", "https://piccoma.kakaocdn.net/dn/WyNbp/btsIvNxp9uV/rDfss0qVoqkmd60R6FVGCk/cover_x2", "https://piccoma.com/web/product/42665?etype=episode"],
			["蜘蛛ですが、なにか？", "女子高生だった私が目覚めると…何故か異世界で「蜘蛛」に転生していた！ 種族底辺の蜘蛛として迷い込んだ先は毒ガエル・大蛇・果ては龍も跋扈する最悪ダンジョン！？メンタル最強女子が生き抜く迷宮生存戦略！！", "https://piccoma.kakaocdn.net/dn/drT41i/btsLees2VNK/EvkY9Q0Tcvu6KGlMoEu2l0/cover_x2", "https://piccoma.com/web/product/7261?etype=episode"],
			["星屑家族", "家族を「許可」するのは、子ども。「扶養審査官」という名のもとに、子どもたちが親を審査する――。子どもを持つ事が免許制になり、人々は「理想」の社会を手に入れた。「扶養審査官」のヒカリは、日々、親たちの審査を繰り返すうちに、ある日、訳アリの夫婦と出会う。家族のカタチを見つめなおす、SFファミリーストーリー。", "https://piccoma.kakaocdn.net/dn/FCPak/btrYkFSg6t5/w2ewnY7Ct7skdrDaucVaNK/cover_x2", "https://piccoma.com/web/product/126392?etype=episode"],
			["姉を好きなお姉さんと", "とある事情から仮の住まいを探していた、男運の悪いOL・日代きのめ。姉から居候先として紹介された水城あけびは、姉に恋をしていた!? 実は売れっ子マンガ家兼小説家な彼女は、めちゃくちゃピュアピュアで……。二人の関係にもだえる社会人同居百合", "https://piccoma.kakaocdn.net/dn/ngv2T/btrrEF301kx/n0CbW0fij6Yz6ntaDjhAlk/cover_x2", "https://piccoma.com/web/product/55763?etype=episode"],
			["戦士に愛を", "おびただしい弾雨 鼻をつく火気 鼓膜を破る着弾 その戦場の最前線にあなたはいる！ 読む者を戦場へと引きずり込むその臨場感!! かつてないほど戦場に近いコミック!!! 近未来を舞台に、人間の代わりに戦う人造人間達の物語。 先の大戦で世界は夥しく汚染された。その大地を浄化し街を再構築した人造人間達。大きな社会貢献を果たしながらも、彼らは人間達から差別と迫害を受け続ける。", "https://piccoma.kakaocdn.net/dn/b8puc3/btsKIFwd52d/iBiaj13dbhWSq8bndYbLZ1/cover_x2", "https://piccoma.com/web/product/16075?etype=episode"],
			["終の退魔師 ―エンダーガイスター―", "この主人公、破天荒にして最強の退魔師＜エクソシスト＞日本のとある都市で起きた超常現象事件を調査しに、ドイツから派遣されたS級退魔師アキラ。相棒の美人退魔師チカゲと共に異世界よりやってきたクリーチャー共を撃ち！殴り！ぶったおしまくる！！ハリウッド級超爽快アクション漫画がここより開幕！！", "https://piccoma.kakaocdn.net/dn/l4B9D/btsLoy31PMj/lZ63ifYBqZ4nU80z0Bi73k/cover_x2", "https://piccoma.com/web/product/23834?etype=episode"],
			["はるかリセット", "締め切りに追われる作家のはるかが、忙しい毎日の合間を縫ってわずかな時間で気持ちをリセット。ご近所散策、銭湯、近場グルメ、公園満喫…まとまった休みが取れなくても、遠くへ旅行に行けなくても、少しの発想の切り替えで、ワクワクできる「休み」は満喫できる! 休みが足りないすべての人に、はるかがステキな休日を贈ります!", "https://piccoma.kakaocdn.net/dn/jhykk/btsLmIAAwK0/z3GYQMzqGgy8kt6ETzTitk/cover_x2", "https://piccoma.com/web/product/78836?etype=episode"]
		],
		[
			["ご主人様と獣耳の少女メル", "人間に似ていることと、可愛らしい容姿で生活のパートナーとして広まりつつある獣人。いつか自分のもとを訪れる“ご主人様”を待っていた獣人の少女メルは、引き取られたお屋敷で、美しく孤独な女主人と共に、ささやかだけど、確かな幸せを育んでいくのでした。庇護する者と、庇護される者との間に生まれる深い愛情。一線を越えるぎりぎりの主従関係が紡ぐ、優しきイノセントワールド、はじまりはじまり♪", "https://piccoma.kakaocdn.net/dn/bYjemS/btqCWd3xr9m/xrGVtVOKLmatkFBllV1mL0/cover_x2", "https://piccoma.com/web/product/22591?etype=episode"],
			["田中くんはいつもけだるげ", "ため息、片ひじ、ねむそうな目…なんだかいつもけだるげな田中くん。そんな田中くんと、彼をほっておけない大きくて無口な太田くんがおくる、ユルユルまったり、にぶにぶなインセンシティブ青春コメディ。", "https://piccoma.kakaocdn.net/dn/b6ZlLP/btqE0Bn0Eg7/1xv3LuD15KkBVBdkrWi50K/cover_x2", "https://piccoma.com/web/product/33940?etype=episode"],
			["ニシハラさんのわかりにくい恋", "職業イベント会社の営業マン。ランチも雑談もノーセンキューな一人好き。バーベキュー中でも気兼ねなく読書を始めちゃいます。噂では会社の稼ぎ頭で、顧客からの信頼もかなり厚いらしい…。そんな不思議なニシハラさんに恋をしたのは、美大を中退し就職したばかりの同じく風変りな主人公・ハルコ（22歳）。この人、1ミリもぶれない価値観で生きてる。", "https://piccoma.kakaocdn.net/dn/bKtFBb/btrSUAoxy4F/8V6vxWgrLqUqseHuRMwvLK/cover_x2", "https://piccoma.com/web/product/119809?etype=episode"],
			["鋼の錬金術師", "2人の若き天才錬金術師は、幼いころ、病気で失った母を甦らせるため禁断の人体錬成を試みる。しかしその代償はあまりにも高すぎた…。錬成は失敗、エドワードはみずからの左足と、ただ一人の肉親・アルフォンスを失ってしまう。かけがえのない弟をこの世に呼び戻すため、エドワードは自身の右腕を代価とすることで、弟の魂を錬成し、鎧に定着させることに成功。そして兄弟は、すべてを取り戻すための長い旅に出る…。", "https://piccoma.kakaocdn.net/dn/byyTfF/btsLfyD1xbh/ynrCGicoS7WalqLN9h4NwK/cover_x2", "https://piccoma.com/web/product/29849?etype=volume"],
			["わたしが恋人になれるわけないじゃん、ムリムリ！", "勝ち取るんだ最高の学園生活を！　ぼっちな中学生時代から変わるため、高校デビューを果たした甘織れな子。しかし根が陰キャ気質のせいで、憧れの陽キャ生活に馴染めず窒息寸前に…。そんなとき高校のスーパースター、王塚真唯とひょんなことから意気投合。お互いの悩みを共有し、無二の友人となった、はずが…。", "https://piccoma.kakaocdn.net/dn/6VuZJ/btsLkaP3z5z/X3Agw22Ss6MBLUec17ecyk/cover_x2", "https://piccoma.com/web/product/49088?etype=episode"],
			["魔法少女プリティ☆ベル", "神威の呼び鈴「リィン・ロッド」を使い変身する魔法少女プリティ☆ベルは、可憐な美少女!…ではなくボディービルダー・高田厚志だった!?", "https://piccoma.kakaocdn.net/dn/ShDAV/btr7dYh3vTd/B9nXwieOSZZmRwC9XikmK0/cover_x2", "https://piccoma.com/web/product/35334?etype=episode"],
			["リィンカーネーションの花弁", "自分に極度の劣等感を持つ少年・扇寺東耶は、ある日巷を騒がす大量殺人鬼と遭遇してしまう。男の正体は、自身の前世から才能を蘇らせた「廻り者」だった。間一髪のところで宮本武蔵の「廻り者」である同級生・灰都に助けられた東耶は、「自分も廻り者になって劣等感を払拭したい」と考えるのだが…。", "https://piccoma.kakaocdn.net/dn/yPCzK/btsLfweWEoj/91gMChLKBAYau1Wq3qflr0/cover_x2", "https://piccoma.com/web/product/2064?etype=episode"],
			["甘えたい日はそばにいて。", "人と区別のないアンドロイドが働く世界。お手伝いアンドロイドのひなげしは、高校生小説家の楓に片想い中。しかし彼女は…恋心がバレたら処分される運命で…！ 恋のライバル、謎の脅迫電話、甘い青春…《秘密の片想い》の物語は、最後の1ページで急転する！？", "https://piccoma.kakaocdn.net/dn/dMYStf/btsmd1XdZ2M/NoRt8U8zF2H2kD5HPkROXk/cover_x2", "https://piccoma.com/web/product/26387?etype=episode"],
			["なぜだ内藤", "内藤は高校入学早々、伊藤にいきなり土下座で求婚するが華麗にフラれる。しかし、内藤は諦めずに毎日求婚し、伊藤は冷たくあしらうのだが…。ギザ歯男子と毒舌女子がおくる、ポジティブ系一方通行コメディー!!", "https://piccoma.kakaocdn.net/dn/cUqV3l/btqNZLuOloV/bH6PXpejKnmsY4i1Ksi36k/cover_x2", "https://piccoma.com/web/product/51970?etype=episode"]
		],
		[
			["創世のタイガ", "生の実感が薄い青年・タイガは大学のゼミ仲間7人と訪れたオーストラリアで洞窟の崩落に巻き込まれてしまう。命からがら脱出したタイガ達の眼前に広がるのはマンモスの歩く太古の風景だった…！原始の世界で青年は目覚める!!!", "https://piccoma.kakaocdn.net/dn/hZLIq/btsLf1TMmww/LQ2WPQk1kKgGnHENnZXQK1/cover_x2", "https://piccoma.com/web/product/141681?etype=episode"],
			["お前、タヌキにならねーか？", "大事なことは、タヌキになったら見つかるかも。タヌキのこがね丸は、今日も山の住人を増やそうと人間たちをスカウトしに街へ繰り出す。「お前、タヌキにならねーか?」仕事に疲れたOL、 性格に難ありのホスト、親との関係に悩むいじめっ子など、様々な問題をかかえた人々が、タヌキになってみたことで人生で本当に大切なことを見つけなおしていく。がんばりすぎてるあなたの心にふっかり寄り添うハートフルタヌキストーリーの開幕です。", "https://piccoma.kakaocdn.net/dn/il35G/btsLwIG1H0e/969rDdLjb1WySZoboghlW1/cover_x2", "https://piccoma.com/web/product/63635?etype=episode"],
			["ダンジョンの中のひと", "――ダンジョンで働く事になってしまった――シーフギルドに所属する少女・クレイ。父から厳しい教えを受け、鍛錬を積んだ彼女は前人未踏とされるダンジョンの地下８階を踏破。さらに深層へと向かうが、そこで待ち受けていたのは…管理人を名乗る魔法使いで!? 双見酔が描く、秘められし迷宮の裏側の世界。", "https://piccoma.kakaocdn.net/dn/HvOfF/btsH4JoQBLj/ySpOdkRkp1TrAVqLK0ZEJ1/cover_x2", "https://piccoma.com/web/product/57587?etype=episode"],
			["見える子ちゃん", "ある日突然、普通の人には見えない異形な存在が見えるようになってしまった「みこ」。彼女は彼らから逃げるでもなく、立ち向かうでもなく…精一杯シカトしつづける事に。怖いようで怖くない、新感覚ホラーコメディ!", "https://piccoma.kakaocdn.net/dn/AO7EJ/btsLh49OC8F/v2v867HpwyWL3KqkqWi6B1/cover_x2", "https://piccoma.com/web/product/13241?etype=episode"],
			["ふりだしにおちる！", "女子高生の“良さ”がギュッと詰まった、見ているだけで笑顔になれる日常コメディ！女子高生らしくないことを悩む女子高生・青井鳩と、その友達が過ごすふんわりゆったりガールズライフ。一緒におしゃべりしたり、ご飯を食べたり、公園に行ったり、それだけなのにこれってとっても女子高生なのでは？友達や先輩から学んで、鳩は立派な女子高生を目指します！", "https://piccoma.kakaocdn.net/dn/7Qkp7/btqEcfMRSKo/SyEjT9Vkx6Y1zSrlsko0e0/cover_x2", "https://piccoma.com/web/product/28192?etype=episode"],
			["スラムダンク", "ピッコマにないけどこれ以上のスポーツ漫画を見たことがないからおすすめ", "https://th.bing.com/th/id/OIP.MOlVCEhVXi_jf4s43uNqTwAAAA?rs=1&pid=ImgDetMain", ""],
			["世界のおわりのペンフレンド", "滅びかけた世界の文房具屋で、少女と元アニメーターの男が交わす言葉は―『株式会社マジルミエ』の岩田雪花と『仄見える少年』の松浦健人が贈るディストピア文通物語。", "https://cdn-scissors.gigaviewer.com/image/scale/f07463c6ce102733b978044a84c875785051783a/enlarge=0;height=484;no_unsharpmask=1;quality=90;version=1;width=484/https%3A%2F%2Fcdn-ak-img.shonenjumpplus.com%2Fpublic%2Fseries-thumbnail%2F3269754496608480314-4d493a2db42803ed4a0df61870464822%3F1724983564", "https://shonenjumpplus.com/episode/3269754496608480325"],
			["鍋に弾丸を受けながら", "50000点の美味を求めて世界各地の危険地帯に赴くのは…二次元の過剰摂取により自分はおろか周囲すべての人間が美少女に見えてしまう人だった！？現地の怪しくも魅惑的な料理の数々を堪能しまくるノンフィクション＆カオス＆ハードグルメリポートコミック！", "https://piccoma.kakaocdn.net/dn/gsBGV/btsJZ5oZ3Qz/sXL9zMygP7MLMLa69HKJb1/cover_x2", "https://piccoma.com/web/product/82964?etype=episode"],
			["幼女戦記", "超合理主義エリートサラリーマンが転生したのは、なぜか幼女だった!?　魔法と小銃の入り乱れる異世界で、軍での出世＆安全な後方勤務を目指すが、なぜかエースとして祭り上げられ……？", "https://piccoma.kakaocdn.net/dn/mTTGP/btsLyuOiQXu/MyWHg98OmqTkNFvhJgDBs0/cover_x2", "https://piccoma.com/web/product/9529?etype=episode"]

		],
		[
			["ヤンキー君と白杖ガール", "街を牛耳る最恐ヤンキー・黒川森生（18）と盲学校高等部に通う「弱視」の赤座ユキコ（16）。出会ってしまった運命のふたり――！", "https://piccoma.kakaocdn.net/dn/bBfr9J/btsISeohNT5/k8t49cQqlcutevH5TWvrJK/cover_x2", "https://piccoma.com/web/product/18440?etype=episode"],
			["アエカナル", "死に場所を求め山奥に分け入るサダイは、アエカなる不思議な少女と出逢う。彼女は廃墟で百五十年もの間姿無き神に仕えてきたと話すが…。死にそびれた男と神さびた未亡人、人生を棒に振った二人の第二の生が始まる。", "https://piccoma.kakaocdn.net/dn/cpAcCc/btrMyfjT3hA/5BK2MyH2KZT9b1jxKmq9Z1/cover_x2", "https://piccoma.com/web/product/55512?etype=episode"],
			["疲れきった女が死ぬほど癒やされるために。", "ボロボロな私のもとに突然天使が舞い降りた!? スランプ真っただ中の小説家・坂井千尋(32)。 担当編集の恐ろし過ぎる圧力で3徹しても頭は働かないし、指は動かない…。 「も、文字ってどうやって打つんだっけ…?」 限界のその先へ突入しそうになった千尋がペットショップから持ち帰ったのは 正体不明の女(26)!?。 弱った心に沁みる、女ふたり暮らしスタートです♪", "https://piccoma.kakaocdn.net/dn/P1iRo/btqFHmKlMGS/cKxh3dBSmTq6wQE5bZjzA1/cover_x2", "https://piccoma.com/web/product/13001?etype=episode"],
			["とんで火に入るゆりの犬", "元カレの付きまといに悩まされている大学生のゆりは、バイト先で自分に一目惚れしたという男子高校生の正宗と「制約付きの恋人」として付き合うことに。「性交渉はなし」「飲み物はシェアしない」「手は繋いでもいい」――　一途な正宗と、どこか心に壁のあるゆりの不思議な恋人関係がはじまる。", "https://piccoma.kakaocdn.net/dn/cum005/btrFtljxZpj/EnpATcApDuC6KwsDhonWQK/cover_x2", "https://piccoma.com/web/product/60873?etype=episode"],
			["ニーチェ先生～コンビニに、さとり世代の新人が舞い降りた～", "「神は死んだ」――閲覧数4000000数以上!!!　Twitterを騒然とさせたさとり世代のコンビニ店員、ニーチェ先生ついに解禁!!", "https://piccoma.kakaocdn.net/dn/RjlKR/btsJgaZxOA1/K4ozT1lkVcpBmy1NGkO5mK/cover_x2", "https://piccoma.com/web/product/11126?etype=episode"],
			["魔法少女なんてもういいですから。", "生ごみを漁る奇妙な生物に「魔法少女の素質がある」と話しかけられたゆずか。 なりゆきで変身してしまったが、服は水着!? 別に敵もいないし人助けもアイテム集めもしなくていい!? 特に目的の無い魔法少女生活が始まった･･･。", "https://piccoma.kakaocdn.net/dn/bwoLpF/btrSTyYADvD/TN9Th1hb2U5K98rjHr4ri0/cover_x2", "https://piccoma.com/web/product/2652?etype=episode"],
			["生き残った６人によると", "ゾンビパンデミック×シェアハウス、かつてない恋の物語が始まる。成田空港に到着した１機の航空機、それが全ての始まりだった。1人の乗客によって持ち込まれたウイルスが、またたく間に感染拡大。日本政府は、千葉県境を封鎖することを決定。ゾンビが町に溢れるなかで、6人の男女が幕張のショッピングモールに逃げ込んだ。安全と食料を確保した彼らは……恋に夢中になっていた。", "https://piccoma.kakaocdn.net/dn/QDeMM/btsLhLibzGf/5bm4Y426S8NWZmh23bhVM0/cover_x2", "https://piccoma.com/web/product/73593?etype=episode"],
			["旦那が何を言っているかわからない件", "真面目で仕事熱心なOLのカオルと、某巨大ネット掲示板に入り浸りのダンナが繰り広げる、コミカルなWeb漫画「旦那が何を言っているかわからない件」が単行本化！新規描き下ろしを大量に加え、ますますいちゃラブワールドが加速する！ニヤつくもよし、壁を殴るもよし。身近な幸せに気づかされるこの１冊で、少しだけ温かくなってみませんか。", "https://piccoma.kakaocdn.net/dn/vmmIT/btqwtFMFA6h/cSvRa6WV75msFFLWitozHK/cover_x2", "https://piccoma.com/web/product/8919?etype=episode"],
			["今年の三石さんはどこかおかしい", "無気力系男子のハジメくんになにかと世話を焼いてくれる隣のクラスの三石さん。クールな優等生だった彼女をこの一年で豹変させた理由とは？", "https://piccoma.kakaocdn.net/dn/cFdomv/btsLmTu2R4V/4VPLjU6ZWFJEKJK4fXBjz0/cover_x2", "https://piccoma.com/web/product/57663?etype=episode"]
		],
		[
			["ミステリと言う勿れ", "その主人公は、たった一人の青年！しかも謎めいた、天然パーマの久能　整（くのう　ととのう）なのです！！解決解読青年・久能　整、颯爽登場！！冬のある、カレー日和。アパートの部屋で大学生・整がタマネギをザク切りしていると・・・警察官がやってきて・・・！？突然任意同行された整に、近隣で起こった殺人事件の容疑がかけられる。しかもその被害者は、整の同級生で・・・。次々に容疑を裏付ける証拠を突きつけられた整はいったいどうなる・・・？？？", "https://piccoma.kakaocdn.net/dn/bRpZwU/btsLvzBL23Y/YRbSaW3wF0y6qm9yMkYh81/cover_x2", "https://piccoma.com/web/product/4804?etype=episode"],
			["幸色のワンルーム", "その日、少女は誘拐された。しかし、それは少女にとって一縷の希望にかけた生活の始まりだった。少女は誘拐犯に結婚を誓い、誘拐犯は少女にたくさんの“幸せ”を捧ぐ。被害者と誘拐犯の関係なのに―――どうしてこんなに温かいの？", "https://piccoma.kakaocdn.net/dn/iCReT/btr6AgwYYP7/a4gJfHq4dfqyhe9uUS2bFk/cover_x2", "https://piccoma.com/web/product/19948?etype=episode"],
			["イチャイチャするとお金が湧いちゃう２人の話", "ぶっきらぼうだが心優しい男子・アキと、ほんわかした女子・ハル。貧乏大学生である２人がイチャイチャすると、なぜかお金が湧き…？", "https://piccoma.kakaocdn.net/dn/cimR3G/btrM8k6iMiG/Qyp8q9JJKb48EjcpujBbCK/cover_x2", "https://piccoma.com/web/product/38015?etype=episode"],
			["彼女の腕は掴めない", "世間一般から＜私＞に向けられる感情は、およそ二通り――好奇か憐憫。…生まれつき腕の無い遼は、そんな同情が入り混じった視線に晒されて生きてきた。そんなある日、彼女は腕の欠損に興奮を覚えるアポテムノフィリアの男・白鷺に、誘拐・軟禁されてしまう。逃げ出す機会をうかがっていた彼女だが、その男が己に向ける感情が、憐れみなどではなく、純粋な愛だと気付いて――？", "https://piccoma.kakaocdn.net/dn/TyYyM/btsofPgzO9b/2QJyKBUYdk0ea5NUrF1Okk/cover_x2", "https://piccoma.com/web/product/16155?etype=episode"],
			["殺し愛", "クールな女性殺し屋と、彼女をストーキングする最強の男性殺し屋。その執着の理由ははたして…!?", "https://piccoma.kakaocdn.net/dn/g0XCM/btsGS3PHsPv/IXIPV3NDr7Bse2KfuK9am1/cover_x2", "https://piccoma.com/web/product/3188?etype=episode"],
			["性別「モナリザ」の君へ。", "この世界で人間は12歳を迎える頃、自分がなりたい性へと次第に身体が変化していき、14歳になる頃には男性か女性へと姿を変えてゆく。でも自分だけは性別がないまま、18度目の春を迎えた…。", "https://piccoma.kakaocdn.net/dn/CJuaV/btrSXq6LoUN/zYBMiIoViNqPts0KaitrC0/cover_x2", "https://piccoma.com/web/product/15184?etype=episode"],
			["ノケモノたちの夜", "不死の悪魔と不幸な少女、孤独を分かつ物語孤独な夜、退屈な夜、闇の中で出会った悪魔と少女は光を求めて手を取り合う――傍にいる悪魔が、救い。傍にある少女が、暇潰し。19世紀末、大英帝国の片隅での2人の出会いが居場所を求め彷徨う物語を紡ぎ出す。孤独を分かつ者たちに囁く悪魔と少女の常夜奇譚", "https://piccoma.kakaocdn.net/dn/bIgkfN/btq4OskCxPr/wPMvPD57jsCMZp05KgLYK1/cover_x2", "https://piccoma.com/web/product/29848?etype=episode"],
			["兄だったモノ", "兄が死んだ。私は兄の恋人だったひとと、兄の墓参りに来ている──……。これは、兄の恋人と私と「兄だったモノ」のおぞましい恋の話", "https://piccoma.kakaocdn.net/dn/ckkHyk/btsLAs4D0fk/jgilNgFrrv2pGyHF0ig9p0/cover_x2", "https://piccoma.com/web/product/80506?etype=episode"],
			["恋文と１３歳の女優", "芸能事務所で経理として働く一色文は、ある日営業へと部署異動を言い渡される。担当するまだ13歳の子役の少女、羽賀文乃は、妙に文のことを気に入ったようで…？子供でありながら大人よりも大人らしく振る舞う、プロの役者の子役の少女と、そのマネージャーが紡ぐ、ドラマチックストーリー！", "https://piccoma.kakaocdn.net/dn/bBPkLg/btsLoJFJyG2/boPHOHpWfTZak6bjIbJls0/cover_x2", "https://piccoma.com/web/product/135277?etype=episode"]
		],

	];

	modalManager = new ModalManager('modal', 'fortune-video', 'fortune-result', 'fortune-result-luck', 'fortune-result-title', 'fortune-result-article', fortuneTitles, fortuneContents, comicsData);
	const fortuneRenderer = new FortuneRenderer('fortune-slip-wrapper', 'fortune-slip-container', 'cell-template', fortuneTitles, modalManager);

	fortuneRenderer.renderTitles();
	fortuneRenderer.renderButtons();
})();
