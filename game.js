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
{ "height":21,
 "layers":[
        {
         "data":[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 3, 2, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 4, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 2, 2, 2, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
         "height":21,
         "name":"Tile Layer 1",
         "opacity":1,
         "type":"tilelayer",
         "visible":true,
         "width":21,
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
 "width":21
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
const fps = 60, canvas = document.getElementById('canvas'), canvasEl = $('canvas'), grid = 16, gameHeight = 224, gameWidth = 256,
	browserWindow = require('electron').remote, storage = require('electron-json-storage'), analogThresh = 0.15, charImg = new Image();
const context = canvas.getContext('2d'), mainWindow = browserWindow.getCurrentWindow();
let gamepad = false, savedData = {}, startedGame = false, isFullscreen = false, loop, canGetHit = true;

charImg.src = 'img/font.png';

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
		remWidth = $(window).height() * 1.14285714286;
	if(newWidth >= remWidth) newWidth = remWidth;
	else if(newHeight > remHeight) newHeight = remHeight;
	return {width: newWidth, height: newHeight};
};

isMinusZero = value => {
	return 1 / value === -Infinity;
};
const images = [], textureSize = grid * 4;

let gameLoopInterval, isGameOver = false, gameClock = 0, imageData, buffer;

const initTextureLoad = (textures, success) => {
	let counter = 0;
	const callback = () => {
		counter++;
		console.log(counter + ' of ' + textures.length + ' textures recieved');
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
		name: 'boddy',
		active: true,
		hp: 420,
		mp: 95,
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
		name: 'kilodog',
		active: false,
		hp: 380,
		mp: 132,
		skills: [
		]
	},

	{
		name: 'balacat',
		active: false,
		hp: 666,
		mp: 23,
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
const position = {x: 13, y: 3},
	lastPosition = {x: false, y: false},
	direction = {x: 0.5, y: 0.0},
	plane = {x: 0, y: 1},
	rayHeight = gameHeight - grid * 6,
	rayWidth = gameWidth,
	foundTiles = [];

const chimeraImage = new Image(),
	knightImage = new Image();
chimeraImage.src = 'img/chimera.png';
knightImage.src = 'img/knight.png';

let map = [], currentTileMap = TileMaps.map, texture = [];

const moveTime = 32, acceptedTiles = ['.', '2', '3'],
	spriteTiles = [
		{tile: 3, image: knightImage, action: 'talk'}
	];

const rotateSpeed = (Math.PI / moveTime) / 2, randomEncounterSteps = 10;

let turnRightTimer = moveTime, turnLeftTimer = moveTime, moveTimer = moveTime + 1, turnAroundTimer = moveTime * 2, canMove = true, currentSteps = 0,
	inBattle = false, spriteShowing = false, currentSprite;

const dungeon = {

	setup(){
		texture = getTextures();
		const parseMap = () => {
			currentTileMap.layers[0].data.forEach((cell, i) => {
				if(i % 21 == 0) map.push([]);
				cell = String(cell);
				map[map.length - 1].push(cell);
			});
			console.log('map is ' + map[0].length + 'x' + map.length);
			map.forEach((row, i) => {
				map[i] = row.reduce((res, current, index, array) => {
					let nextCurrent = current;
					if(current == '4') nextCurrent = '$';
					return res.concat([current, nextCurrent]);
				}, []);
			});
			map = map.reduce((res, current, index, array) => {
				return res.concat([current, current]);
			}, []);
		}, controls = () => {
			const keysDown = e => {
				if(canMove){
					canMove = false;
					switch(e.which){
						case 38: forward(); break;
						case 37: turnLeft(); break;
						case 39: turnRight(); break;
						case 40: turnAround(); break;
						// case 13: select(); break;
						// case 8: back(); break;
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
						case '4':
							wallTex = texture[3];
							break;
						case '$':
							wallTex = texture[4];
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
							switch(currentSprite.action){
								case 'talk':

									let boxWidth = grid * 3, boxHeight = grid * 1.5; xOffset = gameWidth / 2 - boxWidth / 2, yOffset = grid * 0.5;
									drawRect(xOffset, yOffset, boxWidth, boxHeight, colorsNewer[0]); // border
									drawRect(xOffset + 1, yOffset + 1, boxWidth - 2, boxHeight - 2, colorsNewer[3]); // bg
									drawRect(xOffset + 1, yOffset + 1, boxWidth - 2, 1, colorsNewer[4]); // bevel
									drawString('talk', xOffset + grid / 2, yOffset + grid / 2); // string

									// boxWidth = gameWidth - grid / 2;
									// boxHeight = grid * 3.25;
									// xOffset = grid / 4;
									// yOffset = grid * 4.5;
									// drawRect(xOffset, yOffset, boxWidth, boxHeight, colorsNewer[0]); // border
									// drawRect(xOffset + 1, yOffset + 1, boxWidth - 2, boxHeight - 2, colorsNewer[3]); // bg
									// drawRect(xOffset + 1, yOffset + 1, boxWidth - 2, 1, colorsNewer[4]); // bevel
									// drawString('general moisty:', xOffset + grid / 2, yOffset + grid / 2); // string
									// drawString('i have lost my beef coith.', xOffset + grid / 2, yOffset + grid / 2 + grid); // string
									// drawString('can you reclaim my coith ...', xOffset + grid / 2, yOffset + grid / 2 + grid * 1.75); // string

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

				const bgColor = colorsNewer[3], bevelColor = colorsNewer[4], chromeHeight = gameHeight - rayHeight;

				const background = () => {
					drawRect(0, rayHeight + 1, gameWidth, gameHeight - rayHeight - 1, bgColor); // bg
					drawRect(0, rayHeight + 1, gameWidth, 1, bevelColor); // bevel
					drawRect(chromeHeight, rayHeight, 1, chromeHeight, colorsNewer[0]) // divider
				},

				minimap = () => {
					const mapSize = gameHeight - rayHeight - 1 - grid / 2, mapY = rayHeight + 1 + grid / 4, mapX = grid / 4,
					mapPos = {x: parseInt(position.x), y: parseInt(position.y)};
					const frame = () => {
						drawRect(mapX, mapY, mapSize + 1, mapSize + 1, colorsNewer[0]); // bg border
						drawRect(mapX + 1, mapY + 1, mapSize - 1, mapSize - 1, colorsNewer[1]); // bg
						drawRect(mapX, mapY + mapSize + 1, mapSize + 1, 1, bevelColor);
					}, tiles = () => {
						const bgColor = colorsNewer[1], gridColor = colorsNewer[3], activeColor = colorsNewer[15], doorColor = colorsNewer[14];
						map.forEach((row, y) => {
							row.forEach((grid, x) => {
								const xOffset = 2 * (x + 1), yOffset = 2 * (y + 1);
								if(acceptedTiles.indexOf(grid) > -1){
									if((x == mapPos.x && y == mapPos.y) ||
										(x + 1 == mapPos.x && y == mapPos.y) ||
										(x == mapPos.x && y + 1 == mapPos.y) ||
										(x + 1 == mapPos.x && y + 1 == mapPos.y)){
										drawRect(mapX + xOffset, mapY + yOffset, 2, 2, activeColor);
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
												if(tile.y == y && x == tile.x) drawRect(mapX + xOffset, mapY + yOffset, 2, 2, gridColor);
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
					partyData.forEach((partyMember, i) => {
						if(gameClock < 1) console.log(partyMember)
						const yOffset = rayHeight + ((chromeHeight / 3) * i);
						if(i > 0){
							drawRect(chromeHeight + 1, yOffset, gameWidth - chromeHeight - 1, 1, colorsNewer[0]);
							drawRect(chromeHeight + 1, yOffset + 1, gameWidth - chromeHeight - 1, 1, bevelColor);
						}
						drawString(partyMember.name, chromeHeight + grid / 4 + 2, yOffset + grid / 4 + 2); // name

						const barWidth = grid * 4.5 - 1, barHeight = grid / 2;

						drawRect(chromeHeight + grid / 4 + 2, yOffset + grid / 4 + grid - 1, barWidth, barHeight, colorsNewer[1]) // hp
						drawRect(chromeHeight + grid / 4 + 2, yOffset + grid / 4 + grid - 1 + barHeight, barWidth, 1, bevelColor) // hp b

						drawRect(chromeHeight + grid / 4 + 2 + barWidth + grid / 4 + 3, yOffset + grid / 4 + grid - 1, barWidth, barHeight, colorsNewer[1]) // mp
						drawRect(chromeHeight + grid / 4 + 2 + barWidth + grid / 4 + 3, yOffset + grid / 4 + grid - 1 + barHeight, barWidth, 1, bevelColor) // mp b
					});
				};

				background();
				minimap();
				party();

			},

			controlAnimations = {

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
					controlAnimations.moveForward();
					controlAnimations.turnRight();
					controlAnimations.turnLeft();
					controlAnimations.turnAround();
				}

			};

			raycast();
			chrome();
			controlAnimations.init();

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