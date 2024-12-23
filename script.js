'use strict';

console.log('Hello, world!');

const fortuneSlip = document.getElementById('fortune-slip');
const fortuneSlipCell = document.getElementById('cell-template');

const cell = fortuneSlipCell.content.cloneNode(true)
fortuneSlip.append(cell);