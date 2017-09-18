const position = {x: 5, y: 3},
	lastPosition = {x: false, y: false},
	direction = {x: 0.5, y: 0.0},
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

// let map = [
// 	['1','1','1','1','1','1','1','1','1','1','1','1','1','1','1','1','1','1','1','1','1'],
// 	['1','.','2','.','.','.','.','.','2','.','.','.','.','.','1','.','2','.','1','.','1'],
// 	['1','1','1','.','1','1','1','1','1','.','1','1','1','.','1','1','1','.','1','.','1'],
// 	['1','.','.','.','1','1','1','.','.','.','1','.','1','.','2','.','1','.','1','.','1'],
// 	['1','.','1','1','1','1','1','2','1','1','1','2','1','1','1','1','1','.','1','2','1'],
// 	['1','.','1','.','.','.','1','.','.','.','.','.','.','.','.','.','.','.','.','.','1'],
// 	['1','.','1','1','1','.','1','.','1','1','1','1','1','2','1','2','1','.','1','1','1'],
// 	['1','.','1','.','2','.','1','.','2','.','.','1','.','.','1','.','1','.','2','.','1'],
// 	['1','.','1','1','1','.','1','.','1','1','1','1','1','1','1','1','1','.','1','1','1'],
// 	['1','.','1','.','.','.','1','.','.','.','1','.','2','.','.','.','.','.','1','.','1'],
// 	['1','.','1','1','1','.','1','.','1','1','1','1','1','1','1','1','1','.','1','.','1'],
// 	['1','.','.','.','2','.','1','.','2','.','1','.','.','.','1','.','2','.','1','.','1'],
// 	['1','1','1','1','1','1','1','.','1','1','1','1','2','1','1','1','1','.','1','2','1'],
// 	['1','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','1'],
// 	['1','1','1','1','1','1','1','.','1','2','1','1','1','.','1','2','1','1','1','2','1'],
// 	['1','.','.','.','.','.','1','.','1','.','1','.','2','.','1','.','1','1','1','.','1'],
// 	['1','2','1','2','1','.','1','.','1','1','1','1','1','.','1','1','1','1','1','1','1'],
// 	['1','.','1','.','1','.','2','.','1','.','.','.','1','.','2','.','1','.','1','.','1'],
// 	['1','.','1','.','1','.','1','.','1','1','2','1','1','.','1','1','1','2','1','2','1'],
// 	['1','.','1','.','1','.','1','.','.','.','.','.','.','.','.','.','.','.','.','.','1'],
// 	['1','1','1','1','1','1','1','1','1','1','1','1','1','1','1','1','1','1','1','1','1']
// ];

let map = [], currentTileMap = TileMaps.map;

// position.x = Math.round(map[0].length / 2) + 10;
// position.y = Math.round(map.length / 2) + 10;

const moveTime = 32, acceptedTiles = ['.', '2', '3']

const rotateSpeed = (Math.PI / moveTime) / 2, randomEncounterSteps = 10;

let turnRightTimer = moveTime, turnLeftTimer = moveTime, moveTimer = moveTime + 1, turnAroundTimer = moveTime * 2, canMove = true,
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
			currentTileMap.layers[0].data.forEach((cell, i) => {
				if(i % 21 == 0) map.push([]);
				cell = String(cell);
				map[map.length - 1].push(cell);
			});
			console.log('map is ' + map[0].length + 'x' + map.length);
			map.forEach((row, i) => {
				map[i] = row.reduce((res, current, index, array) => {
					let nextCurrent = current;
					// if(current == '2') nextCurrent = '3';
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
					// alert('In battle lol.')
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
					drawRect(0, rayHeight / 2 + 1, gameWidth, rayHeight / 2 - 1, floorColor);
					for(i = rayHeight / 2; i < rayHeight + 1; i++){
						let diff = (i - rayHeight / 2) / 75;
						diff = 1 - diff;
						context.save();
						context.globalAlpha = diff;
						drawRect(0, i - 1, gameWidth, 1, shadowColor);
						context.restore();
					}
				},
				wall = () => {
					const cameraX = 2 * column / rayWidth - 1,
						rayPosition = {x: position.x, y: position.y},
						sideDist = {x: 0, y: 0},
						step = {x: 0, y: 0};
						rayDirection = {
							x: direction.x + plane.x * cameraX,
							y: direction.y + plane.y * cameraX
						};
					const mapPosition = {
						x: parseInt(rayPosition.x),
						y: parseInt(rayPosition.y)
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
					perpWallDist = side == 0 ? (mapPosition.x - rayPosition.x + (1 - step.x) / 2) / rayDirection.x :
						perpWallDist = (mapPosition.y - rayPosition.y + (1 - step.y) / 2) / rayDirection.y;
					const lineHeight = (rayHeight / perpWallDist) | 0;

					let drawStart = -lineHeight / 2 + rayHeight / 2;
					if(drawStart < 0) drawStart = 0;
					let drawEnd = lineHeight / 2 + rayHeight / 2;
					if(drawEnd >= rayHeight) drawEnd = rayHeight - 1;

					let wallTexture = bricks1WallImage, textureSize = grid * 4,
						wallX = side == 0 ? rayPosition.y + perpWallDist * rayDirection.y : rayPosition.x + perpWallDist * rayDirection.x;
					wallX -= Math.floor(wallX);
					let texX = wallX * textureSize;
					if(side == 0 && rayDirection.x > 0) texX = textureSize - texX - 1;
					if(side == 1 && rayDirection.y < 0) texX = textureSize - texX - 1;
					switch(map[mapPosition.y][mapPosition.x]){
						case '1':
							wallTexture = bricks1WallImage;
							break;
					}

					context.drawImage(wallTexture, texX, 0, 1, textureSize, column, drawStart, 1, lineHeight);

					if(side == 0){
						context.save();
						context.globalAlpha = 0.2;
						drawRect(column, drawStart, 2, lineHeight, 'black')
						context.restore();
					}



					// floor casting
					const floorWall = {x: 0, y: 0}, floorTextureSize = 16;

					// 4 different wall directions possible
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

					for(var j = drawEnd + 1; j < rayHeight; j++){
							currentDist = rayHeight / (2 * j - rayHeight);

							const weight = (currentDist - distPlayer) / (distWall - distPlayer);
							const currentFloor = {
								x: weight * floorWall.x + (1 - weight) * position.x,
								y: weight * floorWall.y + (1 - weight) * position.y
							};
							const floorTex = {
								x: parseInt(currentFloor.x * floorTextureSize) % floorTextureSize,
								y: parseInt(currentFloor.y * floorTextureSize) % floorTextureSize
							};

							context.drawImage(floor1Image, floorTex.x, floorTex.y, 1, 1, column, j, 1, 1); // floor
							context.drawImage(floor1Image, floorTex.x, floorTex.y, 1, 1, column, rayHeight - j - 1, 1, 1); // ceiling
					}

				};

				ceiling();
				// floor();
				while(column < rayWidth){
					// if(column % 2 == 0)
					wall();
					column++;
				}

			},

			chrome = () => {

				const bgColor = colorsNewer[3], bevelColor = colorsNewer[4];

				const background = () => {
					drawRect(0, rayHeight + 1, gameWidth, gameHeight - rayHeight - 1, bgColor); // bg
					drawRect(0, rayHeight + 1, gameWidth, 1, bevelColor); // bevel
				},

				minimap = () => {
					const mapSize = gameHeight - rayHeight - 1 - grid / 2, mapY = rayHeight + 1 + grid / 4, mapX = grid / 4,
					mapPos = {x: parseInt(position.x), y: parseInt(position.y)};
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
								if(grid == '2'){
									if((x == mapPos.x && y == mapPos.y) ||
										(x + 1 == mapPos.x && y == mapPos.y) ||
										(x == mapPos.x && y + 1 == mapPos.y) ||
										(x + 1 == mapPos.x && y + 1 == mapPos.y)){
										drawRect(mapX + xOffset, mapY + yOffset, 2, 2, activeColor);
									} else {
										drawRect(mapX + xOffset, mapY + yOffset, 2, 2, gridColor);
									}
								}
								// else if(grid == '2'){
								// 	drawRect(mapX + xOffset, mapY + yOffset, 4, 2, doorColor);
								// }
							});
						});
					};
					frame();
					tiles();
				};

				background();
				minimap();

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