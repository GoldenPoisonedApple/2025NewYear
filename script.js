'use strict';

console.log('Hello, world!');

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
	const title = fortuneSlipCell.content.cloneNode(true);
	title.firstElementChild.textContent = `${i}の段`;
	title.firstElementChild.style.width = `${cellSize}px`;
	title.firstElementChild.style.wordBreak = "break-all";
	title.firstElementChild.style.fontSize = "0.9rem";
	fortuneSlipContainer.append(title);
}

// ボタン設置
for (let i = 1; i < 10; i++) {
	for (let j = 1; j < 10; j++) {
		const cell = fortuneSlipCell.content.cloneNode(true);
		// ボタン要素を取得して文字を設定
		const button = cell.querySelector('.cell-button');
		button.textContent = `${i * j}`; // i*j の値をボタンに設定
		// セルの大きさを設定
		cell.firstElementChild.style.width = `${cellSize}px`;
		cell.firstElementChild.style.height = `${cellSize}px`;
		fortuneSlipContainer.append(cell);
	}
}
