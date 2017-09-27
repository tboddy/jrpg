const position = {x: 3, y: 3},
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
		{tile: 3, image: knightImage, action: 'talk'}
	];

const rotateSpeed = (Math.PI / moveTime) / 2, randomEncounterSteps = 10;

let turnRightTimer = moveTime, turnLeftTimer = moveTime, moveTimer = moveTime + 1, turnAroundTimer = moveTime * 2, canMove = true, currentSteps = 0,
	inBattle = false, spriteShowing = false, currentSprite, doingAction = false, atDoor = false, atTalk = false;

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

				startTalk(){
					console.log('started talking..');
					// atTalk = false;
				},

				init(){
					if(doingAction){
						let actionType = false;
						if(atDoor) actionType = 'door';
						else if(atTalk) actionType = 'talk';
						if(actionType){
							switch(actionType){
								case 'door': actions.openDoor(); break;
								case 'talk': actions.startTalk(); break;
							}
						}
					}
				}

			}
			//doingAction

			raycast();
			chrome();
			raycastMoveAnimations.init();
			actions.init();

		};

		draw();

	}

};