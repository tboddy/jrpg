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