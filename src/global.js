const fps = 60, canvas = document.getElementById('canvas'), canvasEl = $('canvas'), grid = 16, gameHeight = 224, gameWidth = 256,
	browserWindow = require('electron').remote, storage = require('electron-json-storage'), analogThresh = 0.15, charImg = new Image(),
	fontImage = new Image();
const context = canvas.getContext('2d'), mainWindow = browserWindow.getCurrentWindow();
let gamepad = false, savedData = {}, startedGame = false, isFullscreen = false, loop, canGetHit = true;

charImg.src = 'img/font.png';
fontImage.src = 'img/font2.png';

const colors = {
	// medium: '#8b8b8b',
	// dark: '#6b6b6b',
	// darker: '#4b4b4b',
	// darkest: '#2f2f2f',
	// purple: '#744253',



	black: '#000000',
	grayDarker: '#595652',
	grayDark: '#696a6a',
	gray: '#847e87',
	purpleDarker: '#222034',
	purpleDark: '#45283c',
	purple: '#76428a',
	blueLight: '#5fcde4',
	mauve: '#663931',
	ochre: '#524b24',
	green: '#6abe30',
	greenDark: '#4b692f',
	cerulean: '#306082',
	red: '#ac3232',
	redLight: '#d95763'
},

colorsNew = {
	grayDark: '#4e4a4e',
	gray: '#8595a1',
	greenDark: '#346524',
	green: '#6daa2c',
	brownDark: '#442434',
	brown: '#854c30',
	blueDark: '#30346d',
	blue: '#597dce',
	red: '#d04648'
},

colorsNewer = [
	'#000000',
	'#1b1e29',
	'#362747',
	'#443f41',
	'#52524c',
	'#64647c',
	'#736150',
	'#77785b',
	'#9ea4a7',
	'#cbe8f7',
	'#e08b79',
	'#a2324e',
	'#003308',
	'#084a3c',
	'#546a00',
	'#516cbf'
],

colorsNewest = [
	'#000000',
	'#222034',
	'#45283c',
	'#663931',
	'#8f563b',
	'#df7126',
	'#d9a066',
	'#eec39a',

	'#fbf236',
	'#99e550',
	'#6abe30',
	'#37946e',
	'#4b692f',
	'#524b24',
	'#323c39',
	'#3f3f74',

	'#306082',
	'#5b6ee1',
	'#639bff',
	'#5fcde4',
	'#cbdbfc',
	'#ffffff',
	'#9badb7',
	'#847e87',

	'#696a6a',
	'#595652',
	'#76428a',
	'#ac3232',
	'#d95763',
	'#d77bba',
	'#8f974a',
	'#8a6f30'
];

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

drawString = (input, x, y, hasFloatingChrome) => {
	let lastX = 0, lastWidth = 0, totalWidth = 0;
	const stringTempArray = [], drawFloatingChrome = () => {
		let width = totalWidth - 1, chromeX = gameWidth / 2 - grid / 2;
		width += 8;
		chromeX -= 4;
		const height = grid,
			chromeY = grid,
			borderColor = colorsNewest[0],
			backgroundColor = colorsNewest[25],
			bevelColor = colorsNewest[24];
		drawRect(chromeX - 1, chromeY - 1, width + 2, height + 2, borderColor);
		drawRect(chromeX, chromeY + 1, width, height - 1, backgroundColor);
		drawRect(chromeX, chromeY, width, 1, bevelColor);
	};
	input.split('').forEach((char, i) => {
		let charX = 0, charY = 0, charWidth = 0, charHeight = 8;
		switch(char){

			// numbers and punctuation
				case '0':
					charWidth = 5;
					break;
				case '1':
					charWidth = 4;
					charX = 5;
					break;
				case '2':
					charWidth = 5;
					charX = 9;
					break;
				case '3':
					charWidth = 4;
					charX = 14;
					break;
				case '4':
					charWidth = 6;
					charX = 19;
					break;
				case '5':
					charWidth = 5;
					charX = 25;
					break;
				case '6':
					charWidth = 5;
					charX = 30;
					break;
				case '7':
					charWidth = 5;
					charX = 35;
					break;
				case '8':
					charWidth = 5;
					charX = 40;
					break;
				case '9':
					charWidth = 5;
					charX = 45;
					break;
				case '.':
					charWidth = 2;
					charX = 50;
					break;
				case ',':
					charWidth = 3;
					charX = 52;
					break;
				case '!':
					charWidth = 2;
					charX = 55;
					break;
				case ':':
					charWidth = 2;
					charX = 57;
					break;
				case ' ':
					charWidth = 2;
					charX = 59;
					break;

			// uppercase letters
				case 'A':
					charWidth = 5;
					charY = 8;
					break;
				case 'B':
					charWidth = 5;
					charY = 8;
					charX = 5;
					break;
				case 'C':
					charWidth = 5;
					charY = 8;
					charX = 10;
					break;
				case 'D':
					charWidth = 5;
					charY = 8;
					charX = 15;
					break;
				case 'E':
					charWidth = 4;
					charY = 8;
					charX = 20;
					break;
				case 'F':
					charWidth = 4;
					charY = 8;
					charX = 24;
					break;
				case 'G':
					charWidth = 5;
					charY = 8;
					charX = 28;
					break;
				case 'H':
					charWidth = 5;
					charY = 8;
					charX = 33;
					break;
				case 'I':
					charWidth = 2;
					charY = 8;
					charX = 38;
					break;
				case 'J':
					charWidth = 5;
					charY = 8;
					charX = 40;
					break;
				case 'K':
					charWidth = 5;
					charY = 8;
					charX = 45;
					break;
				case 'L':
					charWidth = 4;
					charY = 8;
					charX = 50;
					break;
				case 'M':
					charWidth = 6;
					charY = 8;
					charX = 54;
					break;
				case 'N':
					charWidth = 5;
					charY = 8;
					charX = 60;
					break;
				case 'O':
					charWidth = 5;
					charY = 8;
					charX = 65;
					break;
				case 'P':
					charWidth = 5;
					charY = 8;
					charX = 70;
					break;
				case 'Q':
					charWidth = 5;
					charY = 8;
					charX = 75;
					break;
				case 'R':
					charWidth = 5;
					charY = 8;
					charX = 80;
					break;
				case 'S':
					charWidth = 5;
					charY = 8;
					charX = 85;
					break;
				case 'T':
					charWidth = 6;
					charY = 8;
					charX = 90;
					break;
				case 'U':
					charWidth = 5;
					charY = 8;
					charX = 96;
					break;
				case 'V':
					charWidth = 6;
					charY = 8;
					charX = 101;
					break;
				case 'W':
					charWidth = 6;
					charY = 8;
					charX = 107;
					break;
				case 'X':
					charWidth = 5;
					charY = 8;
					charX = 113;
					break;
				case 'Y':
					charWidth = 6;
					charY = 8;
					charX = 118;
					break;
				case 'Z':
					charWidth = 4;
					charY = 8;
					charX = 124;
					break;

			// lowercase
				case 'a':
					charWidth = 5;
					charX = 0;
					charY = 16;
					charHeight = 9;
					break;
				case 'b':
					charWidth = 5;
					charX = 5;
					charY = 16;
					charHeight = 9;
					break;
				case 'c':
					charWidth = 4;
					charX = 10;
					charY = 16;
					charHeight = 9;
					break;
				case 'd':
					charWidth = 5;
					charX = 14;
					charY = 16;
					charHeight = 9;
					break;
				case 'e':
					charWidth = 5;
					charX = 19;
					charY = 16;
					charHeight = 9;
					break;
				case 'f':
					charWidth = 3;
					charX = 23;
					charY = 16;
					charHeight = 9;
					break;
				case 'g':
					charWidth = 5;
					charX = 27;
					charY = 16;
					charHeight = 9;
					break;
				case 'h':
					charWidth = 5;
					charX = 32;
					charY = 16;
					charHeight = 9;
					break;
				case 'i':
					charWidth = 2;
					charX = 37;
					charY = 16;
					charHeight = 9;
					break;
				case 'j':
					charWidth = 3;
					charX = 39;
					charY = 16;
					charHeight = 9;
					break;
				case 'k':
					charWidth = 5;
					charX = 42;
					charY = 16;
					charHeight = 9;
					break;
				case 'l':
					charWidth = 2;
					charX = 47;
					charY = 16;
					charHeight = 9;
					break;
				case 'm':
					charWidth = 8;
					charX = 49;
					charY = 16;
					charHeight = 9;
					break;
				case 'n':
					charWidth = 5;
					charX = 57;
					charY = 16;
					charHeight = 9;
					break;
				case 'o':
					charWidth = 5;
					charX = 62;
					charY = 16;
					charHeight = 9;
					break;
				case 'p':
					charWidth = 5;
					charX = 67;
					charY = 16;
					charHeight = 9;
					break;
				case 'q':
					charWidth = 5;
					charX = 72;
					charY = 16;
					charHeight = 9;
					break;
				case 'r':
					charWidth = 4;
					charX = 77;
					charY = 16;
					charHeight = 9;
					break;
				case 's':
					charWidth = 4;
					charX = 81;
					charY = 16;
					charHeight = 9;
					break;
				case 't':
					charWidth = 4;
					charX = 85;
					charY = 16;
					charHeight = 9;
					break;
				case 'u':
					charWidth = 5;
					charX = 89;
					charY = 16;
					charHeight = 9;
					break;
				case 'v':
					charWidth = 5;
					charX = 94;
					charY = 16;
					charHeight = 9;
					break;
				case 'w':
					charWidth = 6;
					charX = 99;
					charY = 16;
					charHeight = 9;
					break;
				case 'x':
					charWidth = 5;
					charX = 105;
					charY = 16;
					charHeight = 9;
					break;
				case 'y':
					charWidth = 5;
					charX = 110;
					charY = 16;
					charHeight = 9;
					break;
				case 'z':
					charWidth = 4;
					charX = 115;
					charY = 16;
					charHeight = 9;
					break;
		
		};
		if(!lastX) lastX = x;
		if(lastWidth) lastX = lastX + lastWidth;
		lastWidth = charWidth;
		totalWidth += charWidth;
		stringTempArray.push([fontImage, charX, charY, charWidth, charHeight, lastX, y, charWidth, charHeight]);
	});
	// if(gameClock < 1) console.log(totalWidth)
	if(hasFloatingChrome) drawFloatingChrome();
	stringTempArray.forEach(char => {
		context.drawImage(char[0], char[1], char[2], char[3], char[4], char[5], char[6], char[7], char[8]);
	});
};

getAspect = () => {
	var newWidth = $(window).width(), newHeight = $(window).height(), remHeight = $(window).width() * 0.9375,
		remWidth = $(window).height() * 1.14285714286;
	if(newWidth >= remWidth) newWidth = remWidth;
	else if(newHeight > remHeight) newHeight = remHeight;
	return {width: newWidth, height: newHeight};
},

isMinusZero = value => {
	return 1 / value === -Infinity;
},

currentCardinal = () => {
	const tempDirection = {
		x: parseInt(direction.x * 10),
		y: parseInt(direction.y * 10)
	};
	if(tempDirection.x == 5) return 'east';
	else if(tempDirection.x == -5) return 'west';
	else if(tempDirection.y == 5) return 'south';
	else if(tempDirection.y == -5) return 'north';
},

nextTile = () => {
	const nextPos = position;
	let nextX = position.x, nextY = position.y;
	switch(currentCardinal()){
		case 'east':
			nextX += 2;
			break;
		case 'west':
			nextX -= 2;
			break;
		case 'north':
			nextY -= 2;
			break;
		case 'south':
			nextY += 2;
			break;
	}
	return {x: nextX, y: nextY}
};