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
		button.style.width = `${cellSize}px`;
		button.style.height = `${cellSize}px`;
		button.style.position = 'relative'; // 内部のボーダー線に備える
		button.style.display = 'flex'; // 中央寄せのため
		button.style.alignItems = 'center';
		button.style.justifyContent = 'center';

		// 下部に式を表示
		const text = document.createElement('p');
		text.textContent = `${i} × ${j}`;
		text.style.fontSize = '0.8rem';
		text.style.color = '#ff2121';
		button.appendChild(text);

		fortuneSlipContainer.append(cell);
	}
}
