const fps = 60, canvas = document.getElementById('canvas'), canvasEl = $('canvas'), grid = 16, gameHeight = 240, gameWidth = 256,
	browserWindow = require('electron').remote, storage = require('electron-json-storage'), analogThresh = 0.15, charImg = new Image();
const context = canvas.getContext('2d'), mainWindow = browserWindow.getCurrentWindow();
let gamepad = false, savedData = {}, startedGame = false, isFullscreen = false, loop, canGetHit = true;

charImg.src = 'img/font.png';

const colors = {
	medium: '#8b8b8b',
	dark: '#6b6b6b',
	darker: '#4b4b4b',
	darkest: '#2f2f2f',
	purple: '#744253',



	black: '#000000',
	grayDarker: '#595652',
	grayDark: '#696a6a',
	gray: '#847e87',
	purpleDarker: '#222034',
	purpleDark: '#45283c',
	purple: '#76428a',
	blueLight: '#5fcde4'
},

jrpg = {},

circle = Math.PI * 2,

resizeGame = () => {
	var canvasWidth = getAspect().width, canvasHeight = getAspect().height;
	canvasEl.css('width', canvasWidth + 'px').css('height', canvasHeight + 'px').css('margin-left', -(canvasWidth / 2) + 'px').css('margin-top', -(canvasHeight / 2) + 'px');
},

clearGame = () => {
	resizeGame();
	context.clearRect(0, 0, getAspect().width, getAspect().height);
},

drawRect = (x, y, width, height, color) => {
	context.beginPath();
	context.rect(x, y, width, height);
	context.fillStyle = color;
	context.fill();
},

drawString = (input, x, y, isRed, isDisabled) => {
	input.split('').forEach((char, i) => {
		drawChar(char, x + (i * (grid / 2)), y, isRed, isDisabled);
	});
},

drawChar = (input, x, y, isRed, isDisabled) => {
	let charLeft = 0, charTop = 0;
	const size = grid / 2;
	switch(input){
		// case '0': charLeft = numStart; break;
		case '1': charLeft = size; break;
		case '2': charLeft = size * 2; break;
		case '3': charLeft = size * 3; break;
		case '4': charLeft = size * 4; break;
		case '5': charLeft = size * 5; break;
		case '6': charLeft = size * 6; break;
		case '7': charLeft = size * 7; break;
		case '8': charLeft = size * 8; break;
		case '9': charLeft = size * 9; break;

		case 'a': charLeft = size * 10; break;
		case 'b': charLeft = size * 11; break;
		case 'c': charLeft = size * 12; break;
		case 'd': charLeft = size * 13; break;
		case 'e': charLeft = size * 14; break;
		case 'f': charLeft = size * 15; break;
		case 'g': charLeft = size * 16; break;
		case 'h': charLeft = size * 17; break;
		case 'i': charLeft = size * 18; break;
		case 'j': charLeft = size * 19; break;
		case 'k': charLeft = size * 20; break;
		case 'l': charLeft = size * 21; break;
		case 'm': charLeft = size * 22; break;
		case 'n': charLeft = size * 23; break;
		case 'o': charLeft = size * 24; break;
		case 'p': charLeft = size * 25; break;
		case 'q': charLeft = size * 26; break;
		case 'r': charLeft = size * 27; break;
		case 's': charLeft = size * 28; break;
		case 't': charLeft = size * 29; break;
		case 'u': charLeft = size * 30; break;
		case 'v': charLeft = size * 31; break;
		case 'w': charLeft = size * 32; break;
		case 'x': charLeft = size * 33; break;
		case 'y': charLeft = size * 34; break;
		case 'z': charLeft = size * 35; break;
		case ':': charLeft = size * 36; break;
		case '.': charLeft = size * 37; break;
		case ' ': charLeft = size * 38; break;
	};
	if(isRed) charTop = size;
	else if(isDisabled) charTop = size * 2;
	context.drawImage(charImg, charLeft, charTop, size, size, x, y, size, size);
}, 

getAspect = () => {
	var newWidth = $(window).width(), newHeight = $(window).height(), remHeight = $(window).width() * 0.9375,
		remWidth = $(window).height() * 1.066666666667;
	if(newWidth >= remWidth) newWidth = remWidth;
	else if(newHeight > remHeight) newHeight = remHeight;
	return {width: newWidth, height: newHeight};
};