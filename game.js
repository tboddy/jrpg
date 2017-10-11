(function(name,data){
 if(typeof onTileMapLoaded === 'undefined') {
  if(typeof TileMaps === 'undefined') TileMaps = {};
  TileMaps[name] = data;
 } else {
  onTileMapLoaded(name,data);
 }
 if(typeof module === 'object' && module && module.exports) {
  module.exports = data;
 }})("map",
{ "height":12,
 "layers":[
        {
         "data":[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 3, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 2, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 2, 1, 1, 5, 1, 1, 1, 2, 1, 1, 1, 1, 2, 5, 2, 2, 2, 5, 2, 2, 1, 2, 1, 1, 2, 1, 2, 2, 2, 1, 1, 2, 1, 2, 1, 1, 2, 1, 1, 1, 5, 1, 1, 2, 2, 2, 1, 1, 2, 1, 2, 1, 2, 2, 1, 2, 1, 1, 1, 1, 2, 2, 2, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2, 2, 1, 1, 2, 1, 1, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
         "height":12,
         "name":"Tile Layer 1",
         "opacity":1,
         "type":"tilelayer",
         "visible":true,
         "width":12,
         "x":0,
         "y":0
        }],
 "nextobjectid":1,
 "orientation":"orthogonal",
 "renderorder":"right-down",
 "tiledversion":"1.0.3",
 "tileheight":16,
 "tilesets":[
        {
         "firstgid":1,
         "source":"..\/..\/Desktop\/tiles1.tsx"
        }],
 "tilewidth":16,
 "type":"map",
 "version":1,
 "width":12
});
const enemyArcherImg = new Image(), enemyZombieImg = new Image();
enemyArcherImg.src = 'img/enemy-bowman.png';
enemyZombieImg.src = 'img/enemy-zombie.png';

const bestiary = {

	enemies: {

		archer(){
			return {
				name: 'archer',
				img: enemyArcherImg,
				width: 40,
				height: 56,
				hp: 40,
				selected: true,
				weaknesses: {
					e: true
				}
			}
		},

		zombie(){
			return {
				name: 'zombie',
				img: enemyZombieImg,
				width: 64,
				height: 64,
				hp: 60,
				selected: false,
				weaknesses: {
					f: true
				}
			}
		}

	}

};
const npcs = {
	coith: {
		name: 'Coith',
		dialog: {
			copy: 'Greasy goblor has stolen my dump load! Will you help me dump my load?'
			choices: [
				{
					label: 'Yes',
					result: {
						copy: 'Praise Jebus! You will find the Load Ripper on the third floor.'
					}
				},
				{
					label: 'No',
					result: {
						copy: 'Fine! Just fine! Forget all about my load then.'
					}
				}
			]
		}
	}
};
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
		if(totalWidth >= gameWidth - grid){
			totalWidth = 0;
			lastWidth = 0;
			y += grid * 0.75;
			lastX = 0;
		}
	});
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
},

drawBox = (x, y, width, height) => {
	const bgColor = colorsNewest[25], borderColor = colorsNewest[0], bevelColor = colorsNewest[24];
	drawRect(x - 1, y - 1, width + 2, height + 2, borderColor);
	drawRect(x, y + 1, width, height - 1, bgColor);
	drawRect(x, y, width, 1, bevelColor);
};
const images = [], textureSize = grid * 4;

let gameLoopInterval, isGameOver = false, gameClock = 0, imageData, buffer;

const initTextureLoad = (textures, success) => {
	let counter = 0;
	const callback = () => {
		counter++;
		// console.log(counter + ' of ' + textures.length + ' textures recieved');
		if(counter == textures.length) success();
	}
	textures.forEach(texture => {
		const image = new Image();
		image.onload = callback;
		image.src = texture;
		image.id = texture;
		images.push(image);
	});
}, getTextures = () => {
	const textures = [];
	images.forEach(image => {
		const cvs = document.createElement('canvas');
		cvs.width = image.width;
		cvs.height = image.height;
		const ctx = cvs.getContext('2d');
		ctx.drawImage(image, 0, 0);
		const imageData = ctx.getImageData(0, 0, image.width, image.height),
			rgbArray = new Array(image.width * image.height);
		for(var j = 0; j < image.width * image.height; j++){
			rgbArray[j] = [imageData.data[4 * j], imageData.data[4 * j + 1], imageData.data[4 * j + 2]];
		}
		textures.push(rgbArray);
	});
	return textures;
};

const textureFiles = [
	'img/bricks1.png', 'img/purplefloor.png', 'img/purpleceiling.png',
	'img/door1.png', 'img/door2.png'
];

const initGame = () => {
	$(window).resize(resizeGame);
	initTextureLoad(textureFiles, () => {
		imageData = context.getImageData(0, 0, gameWidth, gameHeight);
		buffer = imageData.data;
		loop = gameLoop;
		dungeon.setup();
		canvasEl.show();
		window.requestAnimationFrame(loop);
	});
},

gameLoop = () => {
	clearGame();
	dungeon.loop();
	gameClock++;
	window.requestAnimationFrame(loop);
};
const partyData = [

	{
		name: 'Dookie Crumb',
		active: true,
		hp: 10,
		hpMax: 14,
		mp: 5,
		mpMax: 10,
		skills: [
			{title: 'fire', info: 'light fire damage', active: true},
			{title: 'fire 2', info: 'medium fire damage', active: false},
			{title: 'ice', info: 'light ice damage', active: false},
			{title: 'ice 2', info: 'medium ice damage', active: false},
			{title: 'bolt', info: 'light electric damage', active: false},
			{title: 'bolt 2', info: 'medium electric damage', active: false},
			{title: 'earth', info: 'light earth damage', active: false},
			{title: 'earth 2', info: 'medium earth damage', active: false}
		]
	},

	{
		name: 'Meaty Sock',
		active: false,
		hp: 4,
		hpMax: 12,
		mp: 14,
		mpMax: 16,
		skills: [
		]
	},

	{
		name: 'Diarrhea Banana',
		active: false,
		hp: 7,
		hpMax: 14,
		mp: 8,
		mpMax: 8,
		skills: [
		]
	}

];

const inventoryData = [
	
	{
		title: 'potion',
		info: 'heal 10hp',
		active: true
	}

];
const position = {x: 5, y: 3},
	lastPosition = {x: false, y: false},
	direction = {x: 0.5, y: 0.0},
	plane = {x: 0, y: 0.78},
	rayHeight = gameHeight - grid * 3,
	rayWidth = gameWidth,
	foundTiles = [],
	mapTileSize = 12;

const chimeraImage = new Image(),
	knightImage = new Image(),
	minimapBackImage = new Image();
chimeraImage.src = 'img/chimera.png';
knightImage.src = 'img/knight.png';
minimapBackImage.src = 'img/minimapback.png';

let map = [], currentTileMap = TileMaps.map, texture = [];

const moveTime = 32, acceptedTiles = ['.', '2', '3'],
	spriteTiles = [
		{tile: 3, image: knightImage, action: 'talk', npc: 'coith'}
	];

const rotateSpeed = (Math.PI / moveTime) / 2, randomEncounterSteps = 10;

let turnRightTimer = moveTime, turnLeftTimer = moveTime, moveTimer = moveTime + 1, turnAroundTimer = moveTime * 2, canMove = true, currentSteps = 0,
	inBattle = false, spriteShowing = false, currentSprite, doingAction = false, atDoor = false, atTalk = false, logged = false,
	tempSpriteAction, currentDialogLevel = 0;

const dungeon = {

	setup(){
		texture = getTextures();
		const parseMap = () => {
			currentTileMap.layers[0].data.forEach((cell, i) => {
				if(i % mapTileSize == 0) map.push([]);
				cell = String(cell);
				map[map.length - 1].push(cell);
			});
			// console.log('map is ' + map[0].length + 'x' + map.length);
			map.forEach((row, i) => {
				map[i] = row.reduce((res, current, index, array) => {
					let nextCurrent = current;
					// switch(current){
					// 	case '4': nextCurrent = '$'; break;
					// }
					return res.concat([current, nextCurrent]);
				}, []);
			});
			map = map.reduce((res, current, index, array) => {
				return res.concat([current, current]);
			}, []);
		}, controls = () => {
			const keysDown = e => {
				const activeKeys = [38, 37, 39, 40, 65]
				if(canMove && activeKeys.indexOf(e.which) > -1){
					canMove = false;
					switch(e.which){
						case 38: forward(); break;
						case 37: turnLeft(); break;
						case 39: turnRight(); break;
						case 40: turnAround(); break;
						case 65: action(); break;
					};
				}
			}, keysUp = () => {},
			forward = () => {
				moveTimer = 0;
				currentSteps++;
				if(currentSteps == randomEncounterSteps){
					inBattle = true;
					currentSteps = 0;
				}
			}, turnAround = () => { turnAroundTimer = 0;
			}, turnRight = () => { turnRightTimer = 0;
			}, turnLeft = () => { turnLeftTimer = 0;
			}, action = () => { doingAction = true;
			};
			document.addEventListener('keydown', keysDown);
			// document.addEventListener('keyup', keysUp);
		};
		parseMap();
		controls();
	},

	loop(){

		const draw = () => {

			const raycast = () => {
				let column = 0;

				const drawColumn = () => {
					const cameraX = 2 * column / rayWidth - 1,
						rayPosition = {x: position.x, y: position.y},
						sideDist = {x: 0, y: 0},
						step = {x: 0, y: 0};
						rayDirection = {
							x: direction.x + plane.x * cameraX,
							y: direction.y + plane.y * cameraX
						};
					const mapPosition = {
						x: parseInt(rayPosition.x) | 0,
						y: parseInt(rayPosition.y) | 0
					},
					deltaDist = {
						x: Math.sqrt(1 + (rayDirection.y * rayDirection.y) / (rayDirection.x * rayDirection.x)),
						y: Math.sqrt(1 + (rayDirection.x * rayDirection.x) / (rayDirection.y * rayDirection.y))
					};
					let perpWallDist, hit = 0, side;
					if(rayDirection.x < 0){
						step.x = -1;
						sideDist.x = (rayPosition.x - mapPosition.x) * deltaDist.x;
					} else {
						step.x = 1;
						sideDist.x = (mapPosition.x + 1 - rayPosition.x) * deltaDist.x;
					}
					if(rayDirection.y < 0){
						step.y = -1;
						sideDist.y = (rayPosition.y - mapPosition.y) * deltaDist.y;
					} else {
						step.y = 1;
						sideDist.y = (mapPosition.y + 1 - rayPosition.y) * deltaDist.y;
					}
					while(hit == 0){
						side = sideDist.x > sideDist.y;
						if(side == 0) {
							sideDist.x += deltaDist.x;
							mapPosition.x += step.x;
						} else {
							sideDist.y += deltaDist.y;
							mapPosition.y += step.y;
						}
						if(map[mapPosition.y] && acceptedTiles.indexOf(map[mapPosition.y][mapPosition.x]) == -1) hit = 1;
					}
					perpWallDist = side == 0 ? Math.abs((mapPosition.x - rayPosition.x + (1 - step.x) / 2) / rayDirection.x) :
						Math.abs((mapPosition.y - rayPosition.y + (1 - step.y) / 2) / rayDirection.y);
					const lineHeight = Math.abs((rayHeight / perpWallDist) | 0);

					let drawStart = ((rayHeight - lineHeight) / 2) | 0;
					if(drawStart < 0)  drawStart = 0;
					let drawEnd = ((rayHeight + lineHeight) / 2) | 0;
					if(drawEnd >= rayHeight) drawEnd = rayHeight - 1;

					let wallTex = texture[0], wallX = side == 0 ? rayPosition.y + perpWallDist * rayDirection.y : rayPosition.x + perpWallDist * rayDirection.x;
					wallX -= Math.floor(wallX);
					let texX = wallX * textureSize;
					if(side == 0 && rayDirection.x > 0) texX = textureSize - texX - 1;
					if(side == 1 && rayDirection.y < 0) texX = textureSize - texX - 1;

					switch(map[mapPosition.y][mapPosition.x]){
						case '1':
							wallTex = texture[0];
							break;
						// case '4':
						// 	wallTex = texture[3];
						// 	break;
						case '5': // door
							wallTex = texture[3];
							if(map[mapPosition.y + 1][mapPosition.x] == '5' && map[mapPosition.y][mapPosition.x - 1] == '2') wallTex = texture[4]; // east wall
							else if(map[mapPosition.y - 1][mapPosition.x] == '5' && map[mapPosition.y][mapPosition.x + 1] == '2') wallTex = texture[4]; // west wall
							else if(map[mapPosition.y][mapPosition.x + 1] == '5' && map[mapPosition.y + 1][mapPosition.x] == '2') wallTex = texture[4]; // north wall
							else if(map[mapPosition.y][mapPosition.x - 1] == '5' && map[mapPosition.y - 1][mapPosition.x] == '2') wallTex = texture[4]; // south wall
							break;
					}

					for(j = drawStart; j < rayHeight; j++){
						const d = (j * 256 - rayHeight * 128 + lineHeight * 128) | 0;
						let texY = ((d * textureSize) / (lineHeight * 256)), color;
						if(texY < 0) texY = 0;

						texX |= 0;
						texY |= 0;
						color = wallTex[textureSize * texY + texX];

						let shade = (rayHeight - lineHeight) / 400
						if(shade < 0) shade = 0;
						shade = 1 - shade
						if(side == 1) shade += 0.15;
						if(shade > 1) shade = 1;

						const i = 4 * (gameWidth * j) + 4 * column;
						if(color){
							buffer[i + 0] = color[0] * shade;
							buffer[i + 1] = color[1] * shade;
							buffer[i + 2] = color[2] * shade;
							buffer[i + 3] = 255;
						}
					}

					const floorWall = {x: 0, y: 0}, floorTexture = texture[1], ceilingTexture = texture[2];

					if(side == 0 && rayDirection.x > 0){
						floorWall.x = mapPosition.x;
						floorWall.y = mapPosition.y + wallX;
					} else if(side == 0 && rayDirection.x < 0){
						floorWall.x = mapPosition.x + 1;
						floorWall.y = mapPosition.y + wallX;
					} else if(side == 1 && rayDirection.y > 0){
						floorWall.x = mapPosition.x + wallX;
						floorWall.y = mapPosition.y;
					} else {
						floorWall.x = mapPosition.x + wallX;
						floorWall.y = mapPosition.y + 1;
					}

					let distWall = perpWallDist, distPlayer = 0, currentDist;
					if(drawEnd < 0) drawEnd = rayHeight;

					for(j = drawEnd; j < rayHeight; j++){
						currentDist = rayHeight / (2 * j - rayHeight);

						const weight = (currentDist - distPlayer) / (distWall - distPlayer);
						const currentFloor = {
							x: weight * floorWall.x + (1 - weight) * position.x,
							y: weight * floorWall.y + (1 - weight) * position.y
						};
						const floorTex = {
							x: parseInt(currentFloor.x * textureSize) % textureSize,
							y: parseInt(currentFloor.y * textureSize) % textureSize
						};
						let shade = j / 120;
						shade += 0.15;
						if(shade > 1) shade = 1;
						let i;
						color = floorTexture[textureSize * (floorTex.y | 0) + (floorTex.x | 0)];
						if(color){
							i = 4 * (gameWidth * j) + 4 * column;
							buffer[i+0] = color[0] * shade;
							buffer[i+1] = color[1] * shade;
							buffer[i+2] = color[2] * shade;
							buffer[i+3] = 255;
						}

						color = ceilingTexture[textureSize * (floorTex.y | 0) + (floorTex.x | 0)];
						if(color){
							i = 4 * (gameWidth * (rayHeight - j - 1)) + 4 * column;
							buffer[i+0] = color[0] * shade;
							buffer[i+1] = color[1] * shade;
							buffer[i+2] = color[2] * shade;
							buffer[i+3] = 255;
						}
					}
				},

				drawSprite = () => {
					if(lastPosition.x != position.x || lastPosition.y != position.y){
						lastPosition.x = position.x;
						lastPosition.y = position.y;
						let spriteShowingTemp = false;
						spriteTiles.forEach(spriteTile => {
							if(spriteTile.tile == map[parseInt(lastPosition.y)][parseInt(lastPosition.x)]){
								spriteShowingTemp = true;
								currentSprite = spriteTile;
							}
						});
						spriteShowing = spriteShowingTemp ? true : false;
					}
					if(spriteShowing){

						// draw the sprite
						const spriteX = gameWidth / 2 - currentSprite.image.width / 2,
							spriteY = (rayHeight / 2 - currentSprite.image.height / 2) + grid * 0.75;
						context.drawImage(currentSprite.image, spriteX, spriteY);

						// draw action prompt
						if(currentSprite.action){
							const drawActionBox = string => {
								const x = gameWidth / 2 - grid / 2, y = grid;
								drawString(string, x, y + 4, true);
							};
							switch(currentSprite.action){
								case 'talk':
									drawActionBox('Talk');
									atTalk = true;
									break;
							}
						}
					}
				};

				while(column < rayWidth){
					drawColumn();
					column++;
				}

				context.putImageData(imageData, 0, 0);
				drawSprite();

			},

			chrome = () => {

				const bgColor = colorsNewest[25], borderColor = colorsNewest[0], bevelColor = colorsNewest[24], chromeHeight = gameHeight - rayHeight,
					padding = 4;

				const info = () => {
					const xOffset = 2; yOffset = rayHeight - grid - 2;
					drawRect(xOffset, yOffset, gameWidth - 4, grid, borderColor);
					drawRect(xOffset + 1, yOffset + 1, gameWidth - 6, grid - 2, bgColor);
					drawRect(xOffset + 1, yOffset + 1, gameWidth - 6, 1, bevelColor);
					drawString('Share My Life...', xOffset + 1 + padding, yOffset + 1 + 3);
				},

				minimap = () => {
					const mapSize = grid * 3.5, mapX = 5, mapY = 5, mapPos = {x: parseInt(position.x), y: parseInt(position.y)};
					const frame = () => {
						drawRect(4, 4, mapSize, 1, borderColor); // top
						drawRect(6, 6, mapSize - 4, 1, borderColor);
						drawRect(5, 5, mapSize - 2, 1, bgColor);

						drawRect(4, mapSize + 3, mapSize, 1, borderColor); // bottom
						drawRect(6, mapSize + 1, mapSize - 4, 1, borderColor);
						drawRect(5, mapSize + 2, mapSize - 2, 1, bgColor);

						drawRect(4, 5, 1, mapSize - 2, borderColor); // left
						drawRect(6, 7, 1, mapSize - 6, borderColor);
						drawRect(5, 6, 1, mapSize - 4, bgColor);

						drawRect(mapSize + 3, 5, 1, mapSize - 2, borderColor); // right
						drawRect(mapSize + 1, 7, 1, mapSize - 6, borderColor);
						drawRect(mapSize + 2, 6, 1, mapSize - 4, bgColor);

						context.fillStyle = context.createPattern(minimapBackImage, 'repeat'); // bg
						context.fillRect(7, 7, mapSize - 6, mapSize - 6);
					}, tiles = () => {
						const activeColor = colorsNewest[18];
						let activeCount = 0, inactiveCount = 0;
						map.forEach((row, y) => {
							row.forEach((grid, x) => {
								const xOffset = 2 * (x + 1) + 1, yOffset = 2 * (y + 1) + 1;
								if(acceptedTiles.indexOf(grid) > -1){
									if((x == mapPos.x && y == mapPos.y) ||
										(x + 1 == mapPos.x && y == mapPos.y) ||
										(x == mapPos.x && y + 1 == mapPos.y) ||
										(x + 1 == mapPos.x && y + 1 == mapPos.y)){
										const tempDirection = {
											x: parseInt(direction.x * 10),
											y: parseInt(direction.y * 10)
										}
										if(activeCount == 0){
											drawRect(mapX + xOffset, mapY + yOffset, 5, 5, borderColor);
											drawRect(mapX + xOffset + 1, mapY + yOffset + 1, 3, 3, activeColor);
										}
										// 	switch(activeCount){
										// 		case 0: drawRect(mapX + xOffset + 1, mapY + yOffset + 1, 2, 3, activeColor); break;
										// 		case 1: drawRect(mapX + xOffset + 1, mapY + yOffset + 2, 1, 1, activeColor); break;
										// 	}
										activeCount++;
										const pushTiles = () => {
											foundTiles.push({x: x, y: y});
										};
										if(foundTiles.length){
											let canPush = true;
											foundTiles.forEach(tile => {
												if(tile.x == x && tile.y == y) canPush = false;
											});
											if(canPush) pushTiles();
										} else pushTiles();
									} else {
										if(foundTiles.length){
											foundTiles.forEach(tile => {
												if(tile.y == y && x == tile.x){
													if(tile.y % 2 == 0 && tile.x % 2 == 0){
														drawRect(mapX + xOffset, mapY + yOffset, 5, 5, borderColor);
														drawRect(mapX + xOffset + 1, mapY + yOffset + 1, 3, 3, bgColor);
													}
												}
											});
										}
									}
								}
							});
						});
					};
					frame();
					tiles();
				},

				party = () => {
					drawRect(0, rayHeight + 1, gameWidth, gameHeight - rayHeight - 1, bgColor); // bg
					drawRect(0, rayHeight + 1, gameWidth, 1, bevelColor); // bg
					partyData.forEach((partyMember, i) => {
						let width = (grid * 5.25) + 1;
						const barHeight = grid / 2 + 5;
						let xOffset = width * i + 1, yOffset = rayHeight + 1;
						if(i == 1) width = width - 1;
						const barWidth = width - padding - 2 - grid;
						if(i > 0) drawRect(xOffset - 1, yOffset, 1, chromeHeight, borderColor);
						if(i == 0) xOffset -= 1;

						drawString(partyMember.name, xOffset + padding, yOffset + padding); // name

						const hpOffset = yOffset + grid - 1,
							hpWidth = parseInt(barWidth * (partyMember.hp / partyMember.hpMax)),
							hpString = partyMember.hp < 10 ? '0' + String(partyMember.hp) : String(partyMember.hp);
						drawRect(xOffset + grid, hpOffset, barWidth + 2, barHeight, borderColor); // hp bg
						drawRect(xOffset + grid + 1, hpOffset + 1, hpWidth, barHeight - 2, colorsNewest[27]); // hp in
						drawRect(xOffset + grid + 1, hpOffset + 1, hpWidth, 1, colorsNewest[28]); // hp bev in
						drawRect(xOffset + grid, hpOffset + barHeight, barWidth + 2, 1, bevelColor); // hp bev
						drawString('HP', xOffset + padding, hpOffset + 3);
						drawString(hpString, xOffset + 3 + grid, hpOffset + 3);

						const mpOffset = yOffset + grid + barHeight + 1,
							mpWidth = parseInt(barWidth * (partyMember.mp / partyMember.mpMax)),
							mpString = partyMember.mp < 10 ? '0' + String(partyMember.mp) : String(partyMember.mp);
						drawRect(xOffset + grid, mpOffset, barWidth + 2, barHeight, borderColor); // mp bg
						drawRect(xOffset + grid + 1, mpOffset + 1, mpWidth, barHeight - 2, colorsNewest[17]); // mp in
						drawRect(xOffset + grid + 1, mpOffset + 1, mpWidth, 1, colorsNewest[18]); // hp bev in
						drawRect(xOffset + grid, mpOffset + barHeight, barWidth + 2, 1, bevelColor); // mp bev
						drawString('MP', xOffset + padding, mpOffset + 3);
						drawString(mpString, xOffset + 3 + grid, mpOffset + 3);

					});
				},

				doors = () => {
					const tempDirection = {
						x: parseInt(direction.x * 10),
						y: parseInt(direction.y * 10)
					}, drawDoor = () => {
						const x = gameWidth / 2 - grid / 2, y = grid;
						drawString('Open', x, y + 4, true);
						atDoor = true;
					};
					if(map[nextTile().y] && (map[nextTile().y][nextTile().x] == '5') &&
						turnRightTimer >= moveTime &&
						turnLeftTimer >= moveTime &&
						moveTimer >= moveTime + 1 &&
						turnAroundTimer >= moveTime) drawDoor();
					else atDoor = false;
				};

				// info();
				party();
				minimap();
				doors();

			},

			raycastMoveAnimations = {

				moveForward(){
					if(moveTimer < moveTime){
						const moveForwardTime = 0.125;
						if(map[parseInt(position.y)] &&
							(map[parseInt(position.y)][parseInt(position.x + direction.x * (moveForwardTime * 16))] &&
							(acceptedTiles.indexOf(map[parseInt(position.y)][parseInt(position.x + direction.x * (moveForwardTime * 16))]) > -1))) {
							position.x += direction.x * moveForwardTime;
					}
						if(map[parseInt(position.y + direction.y * (moveForwardTime * 16))] &&
							(map[parseInt(position.y + direction.y * (moveForwardTime * 16))][parseInt(position.x)] &&
							(acceptedTiles.indexOf(map[parseInt(position.y + direction.y * (moveForwardTime * 16))][parseInt(position.x)]) > -1))) position.y += direction.y * moveForwardTime;
					} else if(moveTimer == moveTime){
						position.x = parseInt(position.x);
						position.y = parseInt(position.y);
						if(position.x % 2 == 0) position.x++;
						if(position.y % 2 == 0) position.y++;
						canMove = true;
					}
					moveTimer++;
				},

				turnRight(){
					if(turnRightTimer < moveTime){
						const oldDirX = direction.x, oldPlaneX = plane.x;
						direction.x = direction.x * Math.cos(rotateSpeed) - direction.y * Math.sin(rotateSpeed);
						direction.y = oldDirX * Math.sin(rotateSpeed) + direction.y * Math.cos(rotateSpeed);
						plane.x = plane.x * Math.cos(rotateSpeed) - plane.y * Math.sin(rotateSpeed);
						plane.y = oldPlaneX * Math.sin(rotateSpeed) + plane.y * Math.cos(rotateSpeed);
					} else if(turnRightTimer == moveTime) {
						canMove = true;
					}
					turnRightTimer++;
				},

				turnLeft(){
					if(turnLeftTimer < moveTime){
						const oldDirX = direction.x, oldPlaneX = plane.x;
						direction.x = direction.x * Math.cos(-rotateSpeed) - direction.y * Math.sin(-rotateSpeed);
						direction.y = oldDirX * Math.sin(-rotateSpeed) + direction.y * Math.cos(-rotateSpeed);
						plane.x = plane.x * Math.cos(-rotateSpeed) - plane.y * Math.sin(-rotateSpeed);
						plane.y = oldPlaneX * Math.sin(-rotateSpeed) + plane.y * Math.cos(-rotateSpeed);
					} else if(turnLeftTimer == moveTime) {
						canMove = true;
					}
					turnLeftTimer++;
				},

				turnAround(){
					if(turnAroundTimer < moveTime){
						const oldDirX = direction.x, oldPlaneX = plane.x;
						direction.x = direction.x * Math.cos(rotateSpeed * 2) - direction.y * Math.sin(rotateSpeed * 2);
						direction.y = oldDirX * Math.sin(rotateSpeed * 2) + direction.y * Math.cos(rotateSpeed * 2);
						plane.x = plane.x * Math.cos(rotateSpeed * 2) - plane.y * Math.sin(rotateSpeed * 2);
						plane.y = oldPlaneX * Math.sin(rotateSpeed * 2) + plane.y * Math.cos(rotateSpeed * 2);
					} else if(turnAroundTimer == moveTime) {
						canMove = true;
					}
					turnAroundTimer++;
				},

				init(){
					raycastMoveAnimations.moveForward();
					raycastMoveAnimations.turnRight();
					raycastMoveAnimations.turnLeft();
					raycastMoveAnimations.turnAround();
				}

			},

			actions = {

				openDoor(){
					map[nextTile().y][nextTile().x] = '2';
					map[nextTile().y][nextTile().x - 1] = '2';
					atDoor = false;
					doingAction = false;
					canMove = true;
				},

				doTalk(){

					const npc = npcs[currentSprite.npc];

					const dialogStep = () => {

						const drawArrow = () => {
							let arrowX = boxX + boxWidth - grid / 2 - 4, arrowY = boxY + boxHeight - grid / 2, arrowSize = grid / 2;
							const animationCount = 32;
							if((gameClock % animationCount) < animationCount / 2) arrowY -= 1;
							drawRect(arrowX, arrowY + 1, grid / 2, 1, 'black');
							drawRect(arrowX + 1, arrowY + 2, grid / 2 - 2, 1, 'black');
							drawRect(arrowX + 2, arrowY + 3, grid / 2 - 4, 1, 'black');
							drawRect(arrowX + 3, arrowY + 4, grid / 2 - 6, 1, 'black');
							drawRect(arrowX, arrowY, grid / 2, 1, 'white');
							drawRect(arrowX + 1, arrowY + 1, grid / 2 - 2, 1, 'white');
							drawRect(arrowX + 2, arrowY + 2, grid / 2 - 4, 1, 'white');
							drawRect(arrowX + 3, arrowY + 3, grid / 2 - 6, 1, 'white');
						};

						tempSpriteAction = currentSprite.action; // important for re-use
						currentSprite.action = false;
						// atTalk = false;

						if(!logged){
							console.log(npc.dialog.data);
							logged = true;
						}

						let currentDialog = npc.dialog;

						const boxHeight = grid * 2.5;
						const boxY = rayHeight - boxHeight - 4, boxX = 4, boxWidth = gameWidth - 8;
						drawBox(boxX, boxY, boxWidth, boxHeight);
						drawString(npc.name, boxX + 4, boxY + 4);
						drawString(currentDialog.copy, boxX + 4, boxY + grid);
						drawArrow();

					};
					
				},

				init(){
					if(doingAction){
						let actionType = false;
						if(atDoor) actionType = 'door';
						else if(atTalk) actionType = 'talk';
						if(actionType){
							switch(actionType){
								case 'door': actions.openDoor(); break;
								case 'talk': actions.doTalk(); break;
							}
						}
					}
				}

			}

			raycast();
			chrome();
			raycastMoveAnimations.init();
			actions.init();

		};

		draw();

	}

};
const actionsData = [
	{
		title: 'attack',
		info: 'attack an enemy',
		active: true
	},
	{
		title: 'skill',
		info: 'use a skill',
		active: false,
		subMenu: 'skills'
	},
	{
		title: 'item',
		info: 'use an item',
		active: false,
		subMenu: 'items'
	},
	{
		title: 'guard',
		info: 'guard until next round',
		active: false
	}
];

const menuHeight = grid * 6, partyWidth = grid * 8, partyHeight = grid * 2, menuPadding = grid / 3, scrollUpImg = new Image(),
	scrollDownImg = new Image(), alertPadding = grid / 2, actionHallImg = new Image(), actionHeight = grid * 6, menuBgImg = new Image(),
	enemySelectImg = new Image();

const menuOffset = gameHeight - menuHeight;
scrollUpImg.src = 'img/menu-scroll-up.png';
scrollDownImg.src = 'img/menu-scroll-down.png';
actionHallImg.src = 'img/battle-hall.png';
menuBgImg.src = 'img/menu-bg.png';
enemySelectImg.src = 'img/select-arrow.png';

let currentMenu = actionsData, currentMenuType, currentAction = false, selectingEnemy = false, attackingEnemy = false,
	selectingPartyMember = false;

const currentEnemiesData = [
	bestiary.enemies.archer(),
	bestiary.enemies.zombie()
];

const currentEnemy = () => {
	let returnEnemy;
	currentEnemiesData.forEach((enemy, i) => {
		enemy.index = i;
		if(enemy.selected) returnEnemy = enemy;
	});
	return returnEnemy;
},

currentPartyMember = () => {
	let returnPartyMember;
	partyData.forEach((partyMember, i) => {
		partyMember.index = i;
		if(partyMember.active) returnPartyMember = partyMember;
	});
	return returnPartyMember;
};

const battle = {

	controls(){

		let canMoveMenu = true, currentItem;

		const keysDown = e => {
			if(canMoveMenu){
				canMoveMenu = false;
				getCurrentItem();
				switch(e.which){
					case 38: moveUp(); break;
					case 40: moveDown(); break;
					case 37: moveLeft(); break;
					case 39: moveRight(); break;
					case 13: select(); break;
					case 8: back(); break;
				};
			}
		}, moveUp = () => {
			if(currentMenu[currentItem.index - 1] && !currentAction && !selectingEnemy){
				currentMenu[currentItem.index].active = false;
				currentMenu[currentItem.index - 1].active = true;
				doScroll();
			};
		}, moveDown = () => {
			if(currentMenu[currentItem.index + 1] && !currentAction && !selectingEnemy){
				currentMenu[currentItem.index].active = false;
				currentMenu[currentItem.index + 1].active = true;
				doScroll();
			};
		}, moveLeft = () => {
			if(currentEnemiesData[currentEnemy().index - 1] && selectingEnemy){
				const currentI = currentEnemy().index;
				currentEnemiesData[currentI].selected = false;
				currentEnemiesData[currentI - 1].selected = true;
			}
		}, moveRight = () => {
			if(currentEnemiesData[currentEnemy().index + 1] && selectingEnemy){
				const currentI = currentEnemy().index;
				currentEnemiesData[currentI].selected = false;
				currentEnemiesData[currentI + 1].selected = true;
			}
		}, select = () => {
			const doSubMenu = () => {
				switch(currentItem.subMenu){
					case 'skills':
						partyData.forEach(member => {
							if(member.active){
								currentMenu = member.skills;
								currentMenuType = 'skills';
							}
						});
						break;
					case 'items':
						currentMenu = inventoryData;
						currentMenuType = 'items';
						break;
				}
			}, doAttack = () => {
				selectingEnemy = 'attack';
			}, doAttackFinish = () => {
				currentAction = currentItem;
				currentAction.type = 'attack';
				attackingEnemy = true;
			}, doSkill = () => {
				selectingEnemy = 'skill';
			}, doSkillFinish = () => {
				currentAction = currentItem;
				currentAction.type = 'skill';
				attackingEnemy = true;
			}, doItem = () => {
				currentAction = currentItem;
				currentAction.type = 'selectItem';
			}, doGuard = () => {
				currentAction = currentItem;
				currentAction.type = 'guard';
			};
			if(currentAction){
				const lastSkill = currentAction.type;
				currentAction.type = false;
				currentAction = false;
				if(selectingEnemy) selectingEnemy = false;
				if(attackingEnemy){
					currentEnemiesData.splice(currentEnemy().index, 1);
					if(currentEnemiesData.length) currentEnemiesData[0].selected = true;
					attackingEnemy = false;
				} else if(selectingPartyMember){
					console.log(selectingPartyMember);
					nextTurn();
					// switch(selectingPartyMember){
					// }
				}
				switch(lastSkill){
					case 'attack': nextTurn(); break;
					case 'skill': nextTurn(); break;
					case 'guard': nextTurn(); break;
				}
			} else if(selectingEnemy){
				switch(selectingEnemy){
					case 'attack': doAttackFinish(); break;
					case 'skill': doSkillFinish(); break;
				}
			}
			else if(currentItem.title == 'attack') doAttack();
			else if(currentItem.title == 'guard') doGuard();
			else if(currentItem.subMenu) doSubMenu();
			else if(currentMenuType && currentMenuType == 'skills') doSkill();
			else if(currentMenuType && currentMenuType == 'items') doItem();
		}, back = () => {
			if(selectingEnemy) selectingEnemy = false;
			if(selectingPartyMember) selectingPartyMember = false;
			if(currentMenu != actionsData && !currentAction){
				currentMenu.forEach((item, i) => {
					item.y = false;
					item.active = i == 0 ? true : false;
				});
				currentMenu = actionsData;
			} else if(currentAction){
				if(currentAction.type == 'selectItem') currentAction = false;
			}
		}, getCurrentItem = () => {
			currentMenu.forEach((item, i) => {
				if(item.active){
					currentItem = item;
					currentItem.index = i;
				}
			});
		}, keysUp = () => { canMoveMenu = true;
		}, doScroll = () => {
			const scrollUp = () => {
				currentMenu.forEach(item => {
					item.y += item.height;
				});
			}, scrollDown = () => {
				currentMenu.forEach(item => {
					item.y -= item.height;
				});
			}
			if(currentItem.y >= gameHeight + grid) scrollDown();
			else if(currentItem.y <= menuOffset) scrollUp();
		}, nextTurn = () => {
			back();
			const resetMenu = () => {
				currentMenu.forEach((item, i) => {
					item.active = i == 0 ? true : false;
				});
			};
			const nextPartyMemberIndex = currentPartyMember().index + 1 < partyData.length ? currentPartyMember().index + 1 : 0;
			partyData[currentPartyMember().index].active = false;
			partyData[nextPartyMemberIndex].active = true;
			resetMenu();
		};

		document.addEventListener('keydown', keysDown);
		document.addEventListener('keyup', keysUp);

	},

	loop(){

		const update = () => {

		},

		draw = () => {

			const action = () => {
				const background = () => {
					context.drawImage(actionHallImg, 0, grid * 2);
				},
				enemies = () => {
					if(currentEnemiesData.length){
						let prevWidth = 0, xOffset = 0;
						const findXOffset = () => {
							let groupWidth = 0;
							currentEnemiesData.forEach(enemy => {
								groupWidth += enemy.width;
							});
							xOffset = (gameWidth / 2) - (groupWidth / 2);
						}, drawEnemy = (enemy, i) => {
							const yOffset = actionHeight - enemy.height + (grid * 2) - 2, animationTime = 96;
							if(enemy.selected && selectingEnemy){
								const selectOffset = (xOffset + prevWidth) + (enemy.width / 2) - (grid / 2);
								context.drawImage(enemySelectImg, selectOffset, yOffset - grid);
							}
							const animationOffset = gameClock % animationTime < (animationTime / 2) ? 0 : enemy.width;
							context.drawImage(enemy.img, animationOffset, 0, enemy.width, enemy.height, xOffset + prevWidth, yOffset, enemy.width, enemy.height);
							prevWidth = enemy.width;
						};
						findXOffset();
						currentEnemiesData.forEach(drawEnemy);
					}
				},
				alerts = () => {
					if(currentAction){
						const alertX = gameWidth / 4, alertWidth = gameWidth / 2;
						let alertHeight, alertY;
						const doAttack = () => {
							alertHeight = Math.floor((grid * 2.5) + menuPadding - 1 + alertPadding);
							alertY = (menuOffset / 2) - (alertHeight / 2);
							doBg();
							drawString('attacked', alertX + alertPadding, alertY + alertPadding); // attack
							drawString(currentEnemy().name + ' for', alertX + alertPadding, alertY + menuPadding + grid); // enemy
							drawString('34 hp', alertX + alertPadding, alertY + (menuPadding * 2) + (grid * 1.5)); // result
							drawString('x', alertX + alertWidth - grid, alertY + (menuPadding * 2) + (grid * 1.5), true); // confirm
						}, doSkill = () => {
							alertHeight = Math.floor((grid * 2.5) + menuPadding - 1 + alertPadding);
							alertY = (menuOffset / 2) - (alertHeight / 2);
							doBg();
							drawString(currentAction.title + ' hit', alertX + alertPadding, alertY + alertPadding); // skill name
							drawString(currentEnemy().name + ' for', alertX + alertPadding, alertY + menuPadding + grid); // enemy
							drawString('34 hp', alertX + alertPadding, alertY + (menuPadding * 2) + (grid * 1.5)); // result
							drawString('x', alertX + alertWidth - grid, alertY + (menuPadding * 2) + (grid * 1.5), true); // confirm
						}, doItem = () => {
							alertHeight = Math.floor((grid * 2.5) + menuPadding - 1 + alertPadding);
							alertY = (menuOffset / 2) - (alertHeight / 2);
							doBg();
							drawString('item', alertX + alertPadding, alertY + alertPadding); // skill name
						}, doGuard = () => {
							alertHeight = Math.floor((grid * 1.5) + menuPadding - 1 + alertPadding);
							alertY = (menuOffset / 2) - (alertHeight / 2);
							doBg();
							drawString('guarding until', alertX + alertPadding, alertY + alertPadding);
							drawString('next round', alertX + alertPadding, alertY + menuPadding + grid);
							drawString('x', alertX + alertWidth - grid, alertY + menuPadding + grid, true); // confirm
						}, doBg = () => {
							drawRect(alertX, alertY, alertWidth, alertHeight, colors.black); // border
							drawRect(alertX + 1, alertY + 1, alertWidth - 2, alertHeight - 2, colors.grayDarker); // bg
							drawRect(alertX + 1, alertY + 1, alertWidth - 2, 1, colors.gray); // bevel
						};
						switch(currentAction.type){
							case 'attack': doAttack(); break;
							case 'skill': doSkill(); break;
							case 'item': doItem(); break;
							case 'guard': doGuard(); break;
						}
					}
				};
				background();
				enemies();
				alerts();
			}, menu = () => {
				const targetBg = () => {
					drawRect(0, 1, gameWidth, (grid * 2) - 2, colors.grayDarker); // bg
					drawRect(0, 1, gameWidth, 1, colors.gray); // top bevel
				}, target = () => {
					if(selectingEnemy){
						let targetString = '', fDisabled = true, iDisabled = true, bDisabled = true, eDisabled = true;
						const enemyTarget = enemy => {
							targetString = enemy.name + ' hp ' + enemy.hp;
							if(enemy.weaknesses){
								if(enemy.weaknesses.f) fDisabled = false;
								if(enemy.weaknesses.i) iDisabled = false;
								if(enemy.weaknesses.b) bDisabled = false;
								if(enemy.weaknesses.e) eDisabled = false;
							}
						};
						currentEnemiesData.forEach(enemy => {
							if(enemy.selected) enemyTarget(enemy);
						});
						drawString(targetString, menuPadding, menuPadding + 1);
						drawString('f', menuPadding, (menuPadding * 2) + (grid / 2), false, fDisabled);
						drawString('i', menuPadding + grid, (menuPadding * 2) + (grid / 2), false, iDisabled);
						drawString('b', menuPadding + grid * 2, (menuPadding * 2) + (grid / 2), false, bDisabled);
						drawString('e', menuPadding + (grid * 3), (menuPadding * 2) + (grid / 2), false, eDisabled);
					}
				}, infoBg = () => {
					drawRect(0, actionHeight + (grid * 2) + 1, gameWidth, grid - 1, colors.grayDarker); // bg
					drawRect(0, actionHeight + (grid * 2) + 1, gameWidth, 1, colors.gray); // top bevel
				}, info = () => {
					let infoString = '';
					if(currentAction && (currentAction.type == 'selectItem')){
						infoString = 'select a party member';
						selectingPartyMember = true;
					} else {
						currentMenu.forEach(item => {
							if(item.active && item.info) infoString = item.info;
						});
					}
					drawString(infoString, menuPadding, actionHeight + (grid * 2) + menuPadding);
				}, background = () => {
					const bgPattern = context.createPattern(menuBgImg, 'repeat');
					context.fillStyle = bgPattern;
					context.fillRect(0, menuOffset, gameWidth, menuHeight);
					drawRect(0, menuOffset, gameWidth, 1, colors.black); // top border
					drawRect(partyWidth, menuOffset, 1, menuHeight, colors.black) // divider
				}, party = () => {
					const partyMember = (member, i) => {
						const offset = menuOffset + (partyHeight * i), stringStat = input => {
							input = String(input);
							if(input.length == 2) input = '0' + input;
							else if(input.length == 1) input = '00' + input;
							return input;
						}, isRed = member.active ? true : false;
						drawRect(0, menuOffset + (partyHeight * i) + 1, partyWidth, partyHeight, colors.grayDarker); // bg
						drawRect(0, menuOffset + (partyHeight * i) + 1, partyWidth, 1, colors.gray); // top bevel
						drawRect(0, menuOffset + (partyHeight * (i + 1)), partyWidth, 1, colors.black); // bottom border
						drawString(member.name, menuPadding, offset + menuPadding, isRed); // name
						drawString('hp ' + stringStat(member.hp), grid * 4.75, offset + menuPadding, isRed); // hp
						drawString('mp ' + stringStat(member.mp), grid  * 4.75, offset + partyHeight - (grid / 2) - menuPadding + 2, isRed); // mp
					};
					partyData.forEach(partyMember);
				}, actions = () => {
					const drawItem = (item, i) => {
						const offset = menuOffset + (grid * i), isRed = item.active ? true : false;
						if(!item.x) item.x = partyWidth;
						if(!item.y) item.y = offset + grid;
						if(!item.height) item.height = grid;
						if(item.y <= menuOffset) context.globalAlpha = 0;
						drawRect(item.x + 1, item.y - grid + 1, partyWidth - 1, grid, colors.grayDarker); // bg
						drawRect(item.x + 1, item.y - grid + 1, partyWidth - 1, 1, colors.gray); // top bevel
						drawRect(item.x, item.y, partyWidth, 1, colors.black); // bottom border
						drawString(item.title, item.x + menuPadding, item.y + menuPadding - grid, isRed); // title
						if(item.y <= menuOffset) context.globalAlpha = 1;
					}, scrollIndicators = () => {
						const showTop = () => {
							context.drawImage(scrollUpImg, gameWidth - (grid / 2) - menuPadding, menuOffset + menuPadding);
						}, showBottom = () => {
							context.drawImage(scrollDownImg, gameWidth - (grid / 2) - menuPadding, gameHeight - grid + menuPadding);
						};
						let topVisible = false, bottomVisible = false;
						currentMenu.forEach(item => {
							if(item.y >= gameHeight + grid) bottomVisible = true;
							if(item.y <= menuOffset) topVisible = true;
						});
						if(topVisible) showTop();
						if(bottomVisible) showBottom();
					};
					currentMenu.forEach(drawItem);
					scrollIndicators();
				};
				targetBg();
				target();
				infoBg();
				info();
				background();
				party();
				actions();
			};

			action();
			menu();

		};

		update();
		draw();

	}

};