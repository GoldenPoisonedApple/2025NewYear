'use strict';

console.log('Hello, world!');

// 運勢リスト
const fortuneTitles = ["失物", "待人", "学問", "金運", "研究", "推し", "アニメ", "ゲーム", "ガチャ"];

// 待ち人、百万人来る、3人来る、行けたら行く(来ない)
// ガチャ、当たる百連を引け
// 研究、終わる、終わらせよ

// MutationObserverを設定
const observer = new MutationObserver((mutationsList, observer) => {
	mutationsList.forEach(mutation => {
			if (mutation.type === 'childList') {
					console.log('ボタンの内容が変更されました:', mutation);
			}
	});
});

// 要素取得
const fortuneSlipContainer = document.getElementById('fortune-slip-container');
const fortuneSlipCell = document.getElementById('cell-template');

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
			console.log(i + "," + j +': ボタンがクリックされました:');
		});

		fortuneSlipContainer.append(cell);
	}
}
