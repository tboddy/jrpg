const position = {x: 9, y: 3}, 
	direction = {x: 0.5, y: 0},
	plane = {x: 0, y: 1},
	rayHeight = gameHeight - grid * 6,
	rayWidth = gameWidth,
	treeWallImage = new Image(),
	bricks1WallImage = new Image(),
	door1Image = new Image(),
	door2Image = new Image(),
	vineTexture = new Image(),
	floor1Image = new Image();

treeWallImage.src = 'img/trees.png';
bricks1WallImage.src = 'img/bricks1.png';
door1Image.src = 'img/door1.png';
door2Image.src = 'img/door2.png';
vineTexture.src = 'img/vines.png';
floor1Image.src = 'img/floor1.png';

const bricks1WallImageHeight = grid, bricks1WallImageWidth = grid;

let map = [
	['1','1','1','1','1','1','1','1','1','1','1','1','1','1','1','1','1','1','1','1','1'],
	['1','.','2','.','.','.','.','.','2','.','.','.','.','.','1','.','2','.','1','.','1'],
	['1','1','1','.','1','1','1','1','1','.','1','1','1','.','1','1','1','.','1','.','1'],
	['1','.','.','.','1','1','1','.','.','.','1','.','1','.','2','.','1','.','1','.','1'],
	['1','.','1','1','1','1','1','2','1','1','1','2','1','1','1','1','1','.','1','2','1'],
	['1','.','1','.','.','.','1','.','.','.','.','.','.','.','.','.','.','.','.','.','1'],
	['1','.','1','1','1','.','1','.','1','1','1','1','1','2','1','2','1','.','1','1','1'],
	['1','.','1','.','2','.','1','.','2','.','.','1','.','.','1','.','1','.','2','.','1'],
	['1','.','1','1','1','.','1','.','1','1','1','1','1','1','1','1','1','.','1','1','1'],
	['1','.','1','.','.','.','1','.','.','.','1','.','2','.','.','.','.','.','1','.','1'],
	['1','.','1','1','1','.','1','.','1','1','1','1','1','1','1','1','1','.','1','.','1'],
	['1','.','.','.','2','.','1','.','2','.','1','.','.','.','1','.','2','.','1','.','1'],
	['1','1','1','1','1','1','1','.','1','1','1','1','2','1','1','1','1','.','1','2','1'],
	['1','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','1'],
	['1','1','1','1','1','1','1','.','1','2','1','1','1','.','1','2','1','1','1','2','1'],
	['1','.','.','.','.','.','1','.','1','.','1','.','2','.','1','.','1','1','1','.','1'],
	['1','2','1','2','1','.','1','.','1','1','1','1','1','.','1','1','1','1','1','1','1'],
	['1','.','1','.','1','.','2','.','1','.','.','.','1','.','2','.','1','.','1','.','1'],
	['1','.','1','.','1','.','1','.','1','1','2','1','1','.','1','1','1','2','1','2','1'],
	['1','.','1','.','1','.','1','.','.','.','.','.','.','.','.','.','.','.','.','.','1'],
	['1','1','1','1','1','1','1','1','1','1','1','1','1','1','1','1','1','1','1','1','1']
];

// position.x = Math.round(map[0].length / 2) + 10;
// position.y = Math.round(map.length / 2) + 10;

const moveTime = 8, acceptedTiles = ['.', '2', '3']

const rotateSpeed = (Math.PI / moveTime) / 2, randomEncounterSteps = 12;

let turnRightTimer = moveTime, turnLeftTimer = moveTime, moveForwardTimer = moveTime, turnAroundTimer = moveTime * 2,
	currentSteps = 0, inBattle = false;

const partyMembers = [
	{
		name: 'boddy'
	}, {
		name: 'bala'
	}, {
		name: 'kilo'
	}
];

const dungeon = {

	setup(){

		const parseMap = () => {
			console.log('map is ' + map[0].length + 'x' + map.length);
			map.forEach((row, i) => {
				map[i] = row.reduce((res, current, index, array) => {
					let nextCurrent = current;
					if(current == '2') nextCurrent = '3';
					return res.concat([current, nextCurrent]);
				}, []);
			});
			map = map.reduce((res, current, index, array) => {
				return res.concat([current, current]);
			}, []);
		}, controls = () => {
			let canMove = true;
			const keysDown = e => {
				if(canMove){
					// canMove = false;
					switch(e.which){
						case 38: forward(); break;
						case 37: turnLeft(); break;
						case 39: turnRight(); break;
						case 40: turnAround(); break;
						// case 13: select(); break;
						// case 8: back(); break;
					};
				}
			}, keysUp = () => {
				// setTimeout(() => {canMove = true;}, moveTime);
				// canMove = true;
			}, forward = () => {
				moveForwardTimer = 0;
				currentSteps++;
				if(currentSteps == randomEncounterSteps){
					inBattle = true;
					currentSteps = 0;
					// alert('In battle lol.')
				}
			}, turnAround = () => { turnAroundTimer = 0;
			}, turnRight = () => { turnRightTimer = 0;
			}, turnLeft = () => { turnLeftTimer = 0;
			};
			document.addEventListener('keydown', keysDown);
			document.addEventListener('keyup', keysUp);
		};

		parseMap();
		controls();

	},

	loop(){

		const draw = () => {

			const raycast = () => {
				let column = 0, columnTextureCount = 0;

				const ceiling = () => {
					const ceilingColor = colorsNewer[1], shadowColor = colorsNewer[0];
					drawRect(0, 0, gameWidth, rayHeight / 2, ceilingColor);
					for(i = 0; i < rayHeight / 2; i++){
						context.save();
						context.globalAlpha = i / 75;
						drawRect(0, i, gameWidth, 1, shadowColor);
						context.restore();
					}
				}, floor = () => {
					let floorTextureCount = 0;
					const floorColor = colorsNewer[3], shadowColor = colorsNewer[1], textureSize = 16; 
					// drawRect(0, rayHeight / 2 + 1, gameWidth, rayHeight / 2 - 1, floorColor);
					for(i = rayHeight / 2; i < rayHeight; i++){
						const diff = rayHeight - i - 1;

						const rowOffset = diff * 2;
						const rowWidth = (gameWidth - (diff * 4)) * 2;

						context.drawImage(floor1Image, 0, floorTextureCount, gameWidth, 1, rowOffset, i + 1, rowWidth, 1);



						// if(diff > 0){
						// 	context.save();
						// 	context.globalAlpha = diff / 75;
						// 	drawRect(0, i + 1, gameWidth, 1, shadowColor);
						// 	context.drawImage(floor1Image, 0, floorTextureCount, textureSize, 1, 0, i + 1, textureSize, textureSize);
						// 	context.restore();
						// }
						floorTextureCount++;
						if(floorTextureCount >= 16) floorTextureCount = 0;
					}

				},
				wall = () => {
					const cameraX = 2 * column / rayWidth - 1, rayPosition = {x: position.x, y: position.y}, sideDist = {x: 0, y: 0}, step = {x: 0, y: 0};
						rayDirection = {x: direction.x + plane.x * cameraX, y: direction.y + plane.y * cameraX};
					const mapPosition = {x: rayPosition.x, y: rayPosition.y}, deltaDist = {
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
						if(sideDist.x < sideDist.y){
							sideDist.x += deltaDist.x;
							mapPosition.x += step.x;
							side = 0;
						} else {
							sideDist.y += deltaDist.y;
							mapPosition.y += step.y;
							side = 1;
						}
						if(map[mapPosition.y] && acceptedTiles.indexOf(map[mapPosition.y][mapPosition.x]) == -1) hit = 1;
					}
					perpWallDist = side == 0 ? Math.abs((mapPosition.x - rayPosition.x + (1 - step.x) / 2) / rayDirection.x) :
						perpWallDist = Math.abs((mapPosition.y - rayPosition.y + (1 - step.y) / 2) / rayDirection.y);
					const lineHeight = Math.abs((rayHeight / perpWallDist) | 0);
					let drawStart = -lineHeight / 2 + rayHeight / 2;
					if(drawStart < 0) drawStart = 0;
					let wallTexture = bricks1WallImage, textureHeight = grid * 4;
					switch(map[mapPosition.y][mapPosition.x]){
						case '1':
							wallTexture = bricks1WallImage;
							break;
						// case '2':
						// 	wallTexture = door2Image;
						// 	break;
						// case '3':
						// 	wallTexture = door1Image;
						// 	break;
					}
					// if(lineHeight >= grid / 2){
						context.drawImage(wallTexture, columnTextureCount, 0, 1, textureHeight, column, drawStart, 1, lineHeight);
						if(lineHeight <= rayHeight / 2){
							context.save();
							context.globalAlpha = (rayHeight / 2 - lineHeight) / 125;
							drawRect(column, drawStart, 1, lineHeight, 'black');
							context.restore();
						}
						context.save();
						context.globalAlpha = 0.67;
						context.drawImage(vineTexture, columnTextureCount, 0, 1, textureHeight, column, drawStart - 4, 1, lineHeight + 8);
						context.restore();
					// }
				};

				ceiling();
				floor();
				while(column < rayWidth){
					wall();
					column++;
					columnTextureCount++;
					if(columnTextureCount >= grid * 4) columnTextureCount = 0;
				}
			},

			chrome = () => {

				const bgColor = colorsNewer[3], bevelColor = colorsNewer[4];

				const background = () => {
					drawRect(0, rayHeight + 1, gameWidth, gameHeight - rayHeight - 1, bgColor); // bg
					drawRect(0, rayHeight + 1, gameWidth, 1, bevelColor); // bevel
				},

				minimap = () => {
					const mapSize = gameHeight - rayHeight - 1 - grid / 2, mapY = rayHeight + 1 + grid / 4, mapX = grid / 4;
					const frame = () => {
						drawRect(mapX, mapY, mapSize + 1, mapSize + 1, colorsNewer[0]); // bg border
						drawRect(mapX + 1, mapY + 1, mapSize - 1, mapSize - 1, colorsNewer[1]); // bg
						drawRect(mapX, mapY + mapSize + 1, mapSize + 1, 1, bevelColor);
					}, tiles = () => {
						let bgColor = colorsNewer[1],
							gridColor = colorsNewer[3],
							activeColor = colorsNewer[15],
							doorColor = colorsNewer[14];
						map.forEach((row, y) => {
							row.forEach((grid, x) => {
								const xOffset = 2 * (x + 1), yOffset = 2 * (y + 1);
								if(grid == '.'){
									if((x == position.x && y == position.y) ||
										(x + 1 == position.x && y == position.y) ||
										(x == position.x && y + 1 == position.y) ||
										(x + 1 == position.x && y + 1 == position.y)){
										drawRect(mapX + xOffset, mapY + yOffset, 2, 2, activeColor);
									} else {
										drawRect(mapX + xOffset, mapY + yOffset, 2, 2, gridColor);
									}
								} else if(grid == '2'){
									drawRect(mapX + xOffset, mapY + yOffset, 4, 2, doorColor);
								}
							});
						});
					};
					frame();
					tiles();
				};

				background();
				minimap();

			},

			moveForward = () => {
				if(moveForwardTimer < 2){

					const canPass = input => {
						return acceptedTiles.indexOf(input) > -1 ? true : false;
					};

					const forwardTime = 1;
					let newDirX = Math.round(direction.x * 100), newDirY = Math.round(direction.y * 100);
					newDirX = newDirX / 100;
					newDirY = newDirY / 100;
					if(newDirX == 0.5 && newDirY == 0){ // east

						// if(map[position.x + direction.y * forwardTime] && (map[position.x + direction.y * forwardTime][position.y])){
						// 	const newPos = direction.x * forwardTime;
						// 	console.log(newPos)
						// 	position.x += direction.x * 1;
						// }


						// if(worldMap[(posX + dirX * moveSpeed) | 0][posY | 0] == 0) posX += dirX * moveSpeed;

						if(canPass(map[position.y][position.x + 1]) && canPass(map[position.y - 1][position.x + 1])) position.x += forwardTime;

						// console.log(position.x + direction.x * forwardTime)

						// if(canPass(map[position.y][position.x + direction.x * forwardTime])) position.x += forwardTime;

					}
					else if(newDirX == -0.5 && newDirY == 0){ // west
						if(canPass(map[position.y][position.x - 2]) && canPass(map[position.y - 1][position.x - 2])) position.x -= forwardTime;
					}
					else if(newDirX == 0 && newDirY == 0.5){ // south
						if(canPass(map[position.y + 1][position.x]) && canPass(map[position.y + 1][position.x - 1])) position.y += forwardTime;
					}
					else if(newDirX == 0 && newDirY == -0.5){ // north
						if(canPass(map[position.y - 2][position.x]) && canPass(map[position.y - 2][position.x - 1])) position.y -= forwardTime;
					} 
				}
				moveForwardTimer++;
			}

			turnRight = () => {
				if(turnRightTimer < moveTime){
					const oldDirX = direction.x, oldPlaneX = plane.x;
					direction.x = direction.x * Math.cos(rotateSpeed) - direction.y * Math.sin(rotateSpeed);
					direction.y = oldDirX * Math.sin(rotateSpeed) + direction.y * Math.cos(rotateSpeed);
					plane.x = plane.x * Math.cos(rotateSpeed) - plane.y * Math.sin(rotateSpeed);
					plane.y = oldPlaneX * Math.sin(rotateSpeed) + plane.y * Math.cos(rotateSpeed);
				}
				turnRightTimer++;
			},

			turnLeft = () => {
				if(turnLeftTimer < moveTime){
					const oldDirX = direction.x, oldPlaneX = plane.x;
					direction.x = direction.x * Math.cos(-rotateSpeed) - direction.y * Math.sin(-rotateSpeed);
					direction.y = oldDirX * Math.sin(-rotateSpeed) + direction.y * Math.cos(-rotateSpeed);
					plane.x = plane.x * Math.cos(-rotateSpeed) - plane.y * Math.sin(-rotateSpeed);
					plane.y = oldPlaneX * Math.sin(-rotateSpeed) + plane.y * Math.cos(-rotateSpeed);
				}
				turnLeftTimer++;
			},

			turnAround = () => {
				if(turnAroundTimer < moveTime * 2){
					const oldDirX = direction.x, oldPlaneX = plane.x;
					direction.x = direction.x * Math.cos(rotateSpeed) - direction.y * Math.sin(rotateSpeed);
					direction.y = oldDirX * Math.sin(rotateSpeed) + direction.y * Math.cos(rotateSpeed);
					plane.x = plane.x * Math.cos(rotateSpeed) - plane.y * Math.sin(rotateSpeed);
					plane.y = oldPlaneX * Math.sin(rotateSpeed) + plane.y * Math.cos(rotateSpeed);
				}
				turnAroundTimer++;
			};

			raycast();
			chrome();
			moveForward();
			turnRight();
			turnLeft();
			turnAround();

		};

		draw();

	}

};