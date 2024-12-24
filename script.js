'use strict';

// カスみたいなjavascriptへようこそ
// cellの所はstyleに書ける

// モーダルを開く
function openModal(i, j) {
	// 表示変更
	fortuneType.textContent = `${fortuneTitles[j-1]}`;
	// モーダル表示
	document.getElementById('modal').style.display = 'flex';
	// ビデオ再生
	video.style.display = 'inline-block';
	video.currentTime = 0;
	video.play();
	// 結果非表示
	result.style.display = 'none';
}

// モーダルを閉じる
function closeModal() {
	document.getElementById('modal').style.display = 'none';
}

// 運勢リスト
const fortuneTitles = ["失物", "待人", "学問", "金運", "研究", "推し", "アニメ", "ゲーム", "ガチャ"];

// 待ち人、百万人来る、3人来る、行けたら行く(来ない)
// ガチャ、当たる百連を引け
// 研究、終わる、終わらせよ

// MutationObserverを設定
const observer = new MutationObserver((mutationsList, observer) => {});

// 結果表示欄取得
const result = document.getElementById('fortune-result');
// ビデオ要素を取得
const video = document.getElementById('fortune-video');
// ビデオが終了したら結果表示
video.addEventListener('ended', () => {
	video.style.display = 'none';
	result.style.display = 'inline-block';
});

// 要素取得
const fortuneSlipContainer = document.getElementById('fortune-slip-container');
const fortuneSlipCell = document.getElementById('cell-template');
const fortuneType = document.getElementById('fortune-type');


// 幅取得 大きすぎる場合は600pxに設定
const width = Math.min(document.getElementById('fortune-slip-wrapper').clientWidth, 600);
fortuneSlipContainer.style.width = `${width}px`;

// セルの幅設定
const cellSize = width / 9;

// タイトル設置
for (let i = 1; i < 10; i++) {
	const text = document.createElement('p');
	text.textContent = `${i}の段\n${fortuneTitles[i - 1]}`;
	text.classList.add('fortune-slip-cell');
	text.style.width = `${cellSize}px`;
	text.style.wordBreak = "break-all";
	text.style.fontSize = "0.9rem";
	fortuneSlipContainer.append(text);
}

// ボタン設置
for (let i = 1; i < 10; i++) {
	for (let j = 1; j < 10; j++) {
		const cell = fortuneSlipCell.content.cloneNode(true);
		// ボタン要素を取得して文字を設定
		const button = cell.querySelector('.cell-button');
		button.textContent = `${i * j}`; // i*j の値をボタンに設定
		// セルの大きさを設定
		button.style.width = `${cellSize}px`;
		button.style.height = `${cellSize}px`;
		button.style.position = 'relative'; // 内部のボーダー線に備える
		button.style.display = 'flex'; // 中央寄せのため
		button.style.alignItems = 'center';
		button.style.justifyContent = 'center';

		// 下部に式を表示
		const text = document.createElement('p');
		text.textContent = `${j} × ${i}`;
		text.style.fontSize = '0.8rem';
		text.style.color = '#ff2121';
		button.appendChild(text);

		// オブザーバーをボタンに登録
		observer.observe(button, { childList: true, subtree: true });
		// リスナー設定
		button.addEventListener('click', () => {
			openModal(i, j);			
			console.log(i + "," + j +': ボタンがクリックされました:');
		});

		fortuneSlipContainer.append(cell);
	}
}
