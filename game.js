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
		remWidth = $(window).height() * 1.14285714286;
	if(newWidth >= remWidth) newWidth = remWidth;
	else if(newHeight > remHeight) newHeight = remHeight;
	return {width: newWidth, height: newHeight};
};
let gameLoopInterval, isGameOver = false, gameClock = 0;

const initGame = () => {
	$(window).resize(resizeGame);
	loop = gameLoop;
	dungeon.setup();
	canvasEl.show();
	window.requestAnimationFrame(loop);
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
const dungeonPlayer = {x: 0, y: 0, direction: 0}, dungeonMap = {}, mapSize = 32, cameraObj = {};

skyboxImg = new Image(), wallImg = new Image();
skyboxImg.src = 'img/skybox.png';
wallImg.src = 'img/wall.png';

const columnPerspective = 1, frontOffset = grid * 4.25;
const map = [
	['X', 'X', 'X', 'X', 'X', 'X'],
	['X', 'c', 'c', 'c', 'c', 'X'],
	['X', 'c', 'X', 'X', 'c', 'X'],
	['X', 'c', 'X', 'X', 'c', 'X'],
	['X', 'c', 'c', 'c', 'c', 'X'],
	['X', 'X', 'X', 'X', 'X', 'X']
	], currentPosition = {x: 1, y: 1}, frontHeight = gameHeight / 2 - frontOffset / 2, wallColor = '#6abe30', groundColor = '#37946e',
	skyColor = '#5fcde4', rayHeight = grid * 9;
let currentDirection = 's', overlayVisible = false;

const dungeon = {

	setup(){
		
		const controls = () => {
			let canMove = true;
			const keysDown = e => {
				if(canMove){
					canMove = false;
					switch(e.which){
						case 38: forward(); break;
						case 37: turnLeft(); break;
						case 39: turnRight(); break;
						// case 40: moveBack(); break;
						// case 13: select(); break;
						// case 8: back(); break;
					};
				}
			}, keysUp = () => { canMove = true;
			}, forward = () => {
				switch(currentDirection){
					case 'n': if(map[currentPosition.y - 1] && (map[currentPosition.y - 1][currentPosition.x] != 'X')) currentPosition.y -= 1; break;
					case 's': if(map[currentPosition.y + 1] && (map[currentPosition.y + 1][currentPosition.x] != 'X')) currentPosition.y += 1; break;
					case 'e':
						if(map[currentPosition.y][currentPosition.x + 1] && (map[currentPosition.y][currentPosition.x + 1] != 'X'))currentPosition.x += 1; break;
					case 'w':
						if(map[currentPosition.y][currentPosition.x - 1] && (map[currentPosition.y][currentPosition.x - 1] != 'X')) currentPosition.x -= 1; break;
				}
			}, turnLeft = () => {
				switch(currentDirection){
					case 'n': currentDirection = 'w'; break;
					case 's': currentDirection = 'e'; break;
					case 'e': currentDirection = 'n'; break;
					case 'w': currentDirection = 's'; break;
				}
			}, turnRight = () => {
				switch(currentDirection){
					case 'n': currentDirection = 'e'; break;
					case 's': currentDirection = 'w'; break;
					case 'e': currentDirection = 's'; break;
					case 'w': currentDirection = 'n'; break;
				}
			};
			document.addEventListener('keydown', keysDown);
			document.addEventListener('keyup', keysUp);
		};

		controls();

	},

	loop(){

		const chrome = () => {

			const drawBg = () => {
				drawRect(0, 0, gameWidth, gameHeight, colors.darkest); // main
			}, drawBorders = () => {
				const rowHeight = (gameHeight - rayHeight) / 4, rowWidth = grid * 7, leftSide = () => {
					drawRect(0, rayHeight + rowHeight * 2, rowWidth, 1, 'black');
					drawRect(0, rayHeight + rowHeight * 3, rowWidth, 1, 'black');
				}, rightSide = () => {

				};
				drawRect(0, rayHeight, gameWidth, 1, 'black'); // raycast
				drawRect(0, rayHeight + rowHeight, gameWidth, 1, 'black'); // info
				drawRect(rowWidth, rayHeight + rowHeight, 1, rowHeight * 3, 'black');  // vertical divider 
				leftSide();
				rightSide();
			};

			drawBg();
			drawBorders();

		},

		rayCast = () => {
			// drawColumns = () => {
				// 		let currentColumn = 0;
				// 		while(currentColumn < gameWidth){
				// 			let columnX = currentColumn, columnHeight = gameHeight - currentColumn * 2, columnY = currentColumn;
				// 			if(columnHeight < 0) {
				// 				columnHeight = columnHeight * -1;
				// 				columnY = gameHeight - columnY;
				// 			}
				// 			const drawShadow = alpha => {
				// 				context.save();
				// 				context.globalAlpha = alpha;
				// 				drawRect(columnX, columnY, 1, columnHeight, 'black');
				// 				context.restore();
				// 			};
				// 			if(columnX < gameWidth / 3){
				// 				if(leftBlock == 'X'){
				// 					drawRect(columnX, columnY, 1, columnHeight, wallColor);
				// 					if(columnX >= (gameWidth / 6)){
				// 						let alpha = 0.1;
				// 						if(columnX >= (gameWidth / 6) + (gameWidth / 10) - 2) alpha = 0.2;
				// 						drawShadow(alpha);
				// 					}
				// 				}
				// 			} else if(columnX >= ((gameWidth / 3) * 2) - grid){
				// 				columnX = columnX + (grid - 1);
				// 				if(rightBlock == 'X'){
				// 					drawRect(columnX, columnY, 1, columnHeight, wallColor);
				// 					if(columnX < ((gameWidth / 3) * 2) + ((gameWidth / 12) * 2) - 1){
				// 						let alpha = 0.2;
				// 						if(columnX >= ((gameWidth / 3) * 2) + (gameWidth / 14)) alpha = 0.1;
				// 						drawShadow(alpha);
				// 					}
				// 				}
				// 			} else if(frontBlock == 'X'){
				// 				const columnWidthHack = columnX > ((gameWidth / 3) * 2) - (grid * 2) ? grid : 1;
				// 				drawRect(columnX, frontHeight, columnWidthHack, frontOffset, wallColor);
				// 				context.save();
				// 				context.globalAlpha = 0.3;
				// 				drawRect(columnX, frontHeight, columnWidthHack, frontOffset, 'black');
				// 				context.restore();
				// 			} else {
				// 				if(furtherRightBlock && (furtherRightBlock == 'X')){
				// 					columnX = columnX + (grid - 1);
				// 					if(columnX	>= (gameWidth / 5) * 3){
				// 						drawRect(columnX, columnY, 1, columnHeight, wallColor);
				// 						drawShadow(0.3);
				// 					}
				// 				}
				// 				if(furtherLeftBlock && (furtherLeftBlock == 'X')){
				// 					if(columnX	<= (gameWidth / 5) * 3){
				// 						drawRect(columnX, columnY, 1, columnHeight, 'red');
				// 						// drawShadow(0.3);
				// 					}
				// 				}
				// 			}
				// 			currentColumn++;
				// 		}
				// };

				// drawBg();
			// drawColumns();

			const drawBg = () => {
				context.drawImage(skyboxImg, 0, 0);
			}, drawColumns = () => {
				const currentBlock = map[currentPosition.y][currentPosition.x];
				let frontBlock, leftBlock, rightBlock, furtherLeftBlock, furtherRightBlock, furtherFrontBlock;
				switch(currentDirection){
					case 'n':
						frontBlock = map[currentPosition.y - 1][currentPosition.x];
						leftBlock = map[currentPosition.y][currentPosition.x - 1];
						rightBlock = map[currentPosition.y][currentPosition.x + 1];
						furtherLeftBlock = map[currentPosition.y - 1][currentPosition.x - 1];
						furtherRightBlock = map[currentPosition.y - 1][currentPosition.x + 1];
						break;
					case 's':
						frontBlock = map[currentPosition.y + 1][currentPosition.x];
						leftBlock = map[currentPosition.y][currentPosition.x + 1];
						rightBlock = map[currentPosition.y][currentPosition.x - 1];
						furtherLeftBlock = map[currentPosition.y + 1][currentPosition.x + 1];
						furtherRightBlock = map[currentPosition.y + 1][currentPosition.x - 1];
						break;
					case 'e':
						frontBlock = map[currentPosition.y][currentPosition.x + 1];
						leftBlock = map[currentPosition.y - 1][currentPosition.x];
						rightBlock = map[currentPosition.y + 1][currentPosition.x];
						furtherLeftBlock = map[currentPosition.y - 1][currentPosition.x + 1];
						furtherRightBlock = map[currentPosition.y + 1][currentPosition.x + 1];
						break;
					case 'w':
						frontBlock = map[currentPosition.y][currentPosition.x - 1];
						leftBlock = map[currentPosition.y + 1][currentPosition.x];
						rightBlock = map[currentPosition.y - 1][currentPosition.x];
						furtherLeftBlock = map[currentPosition.y + 1][currentPosition.x - 1];
						furtherRightBlock = map[currentPosition.y - 1][currentPosition.x - 1];
						break;
				}
				// console.log(currentDirection)
				let currentColumn = 0;
				while(currentColumn < gameWidth){
					const columnX = currentColumn * 2,
						columnHeight = rayHeight - currentColumn * 2,
						columnY = currentColumn;
					const drawWall = () => {
						drawRect(columnX - grid, columnY, 2, columnHeight, wallColor);
					}, drawShadow = alpha => {
						context.save();
						context.globalAlpha = alpha;
						drawRect(columnX - grid, columnY, 2, columnHeight, 'black');
						context.restore();
					};

					// left
					if(columnX <= gameWidth / 4 + grid){
						if(leftBlock == 'X') drawWall();
						else if(columnX <= gameWidth / 4 + grid && furtherLeftBlock == 'X') drawRect(0, grid * 2.5, gameWidth / 4 + 2, grid * 4, wallColor);
					}
					// right
					if(columnX > (gameWidth / 4) * 3 + grid - 2){
						if(rightBlock == 'X') drawWall();
						else if(furtherRightBlock == 'X') {
							drawRect(grid * 12, grid * 2.5, gameWidth / 4 + 2, grid * 4, wallColor);
						}
					}

					// front
					if(frontBlock == 'X'){
						drawRect(gameWidth / 4 + 2, grid * 2.5, gameWidth / 2 - 2, grid * 4, wallColor);
					} else {
						// further left
						if(columnX > gameWidth / 4 + grid && columnX <= gameWidth / 2 && furtherLeftBlock == 'X'){
							drawWall();
							drawShadow(0.1);
						}
						// further right
						if(columnX > gameWidth / 2 + (grid * 2) && columnX <= (gameWidth / 4) * 3 + grid - 2 && furtherRightBlock == 'X'){
							drawWall();
							drawShadow(0.1);
						}
					}




					currentColumn++;
				};
			};

			drawBg();
			drawColumns();

		},

		overlay = () => {
			const xOffset = grid * 2, yOffset = grid * 6, height = grid * 5;
			const width = gameWidth - xOffset * 2;
			drawRect(xOffset, yOffset, width, height, 'black');
			drawRect(xOffset + 1, yOffset + 1, width - 2, 1, colors.medium); // top
			drawRect(xOffset + 1, height + yOffset - 2, width - 2, 1, colors.medium); // bottom
			drawRect(xOffset + 1, yOffset + 1, 1, height - 2, colors.medium); // left
			drawRect(gameWidth - grid * 2 - 2, yOffset + 1, 1, height - 2, colors.medium); // right
		};

		chrome();
		rayCast();
		if(overlayVisible) overlay();

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