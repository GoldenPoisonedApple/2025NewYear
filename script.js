'use strict';

// モジュール化されたJavaScriptコード

// モーダル管理クラス
class ModalManager {
	constructor(modalId, videoId, resultId, fortuneTitles) {
		this.modal = document.getElementById(modalId);
		this.video = document.getElementById(videoId);
		this.result = document.getElementById(resultId);
		this.fortuneTitles = fortuneTitles;
		this.fortuneType = document.getElementById('fortune-type');

		// ビデオ終了時のイベントリスナー設定
		this.video.addEventListener('ended', this.showResult.bind(this));
	}

	// モーダルを開く
	open(i, j) {
		this.fortuneType.textContent = this.fortuneTitles[j - 1];
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
					console.log(`${i}, ${j}: ボタンがクリックされました`);
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

// 初期化処理
(() => {
	const fortuneTitles = ["失物", "待人", "学問", "金運", "研究", "推し", "アニメ", "ゲーム", "ガチャ"];

	modalManager = new ModalManager('modal', 'fortune-video', 'fortune-result', fortuneTitles);
	const fortuneRenderer = new FortuneRenderer('fortune-slip-wrapper', 'fortune-slip-container', 'cell-template', fortuneTitles, modalManager);

	fortuneRenderer.renderTitles();
	fortuneRenderer.renderButtons();
})();
