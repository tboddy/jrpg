const position = {x: 3, y: 3}, 
	direction = {x: 0.5, y: 0},
	plane = {x: 0, y: 0.8},
	rayHeight = gameHeight - grid * 6,
	rayWidth = gameWidth,
	treeWallImage = new Image(),
	bricks1WallImage = new Image(),
	door1Image = new Image();

treeWallImage.src = 'img/trees.png';
bricks1WallImage.src = 'img/bricks1.png';
door1Image.src = 'img/door1.png';

const bricks1WallImageHeight = grid, bricks1WallImageWidth = grid;

let map = [
	['1','1','1','1','1','1','1','1'],
	['1','.','.','.','.','.','.','1'],
	['1','.','.','1','2','1','.','1'],
	['1','.','1','1','1','1','1','1'],
	['1','.','1','1','1','1','1','1'],
	['1','.','.','.','.','.','.','1'],
	['1','.','.','.','.','.','.','1'],
	['1','1','1','1','1','1','1','1']
];

const moveTime = 8;

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
					return res.concat([current, current]);
				}, []);
			});
			map = map.reduce((res, current, index, array) => {
				return res.concat([current, current]);
			}, []);
		}, controls = () => {
			let canMove = true;
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
			}, keysUp = () => {
				canMove = true;
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

				const background = () => {
					const ceiling = () => {
						const ceilingColor = colorsNew.gray, shadowColor = colorsNew.grayDark;
						drawRect(0, 0, gameWidth, rayHeight / 2, ceilingColor);
						for(i = 0; i < rayHeight / 2; i++){
							context.save();
							context.globalAlpha = i / 75;
							drawRect(0, i, gameWidth, 1, shadowColor);
							context.restore();
						}
					}, floor = () => {
						const floorColor = colorsNew.brown, shadowColor = colorsNew.brownDark;
						drawRect(0, rayHeight / 2, gameWidth, rayHeight / 2, floorColor);
						for(i = rayHeight / 2; i < rayHeight; i++){
							const diff = rayHeight - i - 1;
							if(diff > 0){
								context.save();
								context.globalAlpha = diff / 75;
								drawRect(0, i + 1, gameWidth, 1, shadowColor);
								context.restore();
							}
						}
					};
					ceiling();
					floor();
				}, wall = () => {
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
						if(map[mapPosition.y] && (map[mapPosition.y][mapPosition.x] != '.')) hit = 1;
					}
					perpWallDist = side == 0 ? (mapPosition.x - rayPosition.x + (1 - step.x) / 2) / rayDirection.x :
						(mapPosition.y - rayPosition.y + (1 - step.y) / 2) / rayDirection.y;
					const lineHeight = rayHeight / perpWallDist;
					let drawStart = -lineHeight / 2 + rayHeight / 2;
					if(drawStart < 0) drawStart = 0;

					let wallTexture = treeWallImage, textureHeight = grid * 4;
					switch(map[mapPosition.y][mapPosition.x]){
						case '1':
							wallTexture = bricks1WallImage;
							break;
						case '2':
							wallTexture = door1Image;
							break;
					}

					context.drawImage(wallTexture, columnTextureCount, 0, 1, textureHeight, column, drawStart, 1, lineHeight);

					context.save();
					context.globalAlpha = (rayHeight - lineHeight) / 250;
					drawRect(column, drawStart, 1, lineHeight, 'black');
					context.restore();

				};

				background();
				while(column < rayWidth){
					wall();
					column++;
					columnTextureCount++;
					if(columnTextureCount >= grid * 4) columnTextureCount = 0;
				}
			},

			chrome = () => {


				const bgColor = colorsNew.grayDark, bevelColor = colorsNew.gray;
				drawRect(0, rayHeight + 1, gameWidth, gameHeight - rayHeight - 1, bgColor); // bg
				drawRect(0, rayHeight + 1, gameWidth, 1, bevelColor); // bevel

				// const info = () => {
				// 	drawRect(0, rayHeight + 1, gameWidth, 1, bevelColor);
				// 	drawRect(0, rayHeight + 1 + grid, gameWidth, 1, 'black');
				// 	// drawString('dungeon crawlin...', grid / 2, rayHeight + 6);
				// }, party = () => {

				// 	const partyMember = (member, i) => {
				// 		drawString(member.name, grid / 4, rayHeight + 6 + grid * (i + 1));
				// 	};

				// 	drawRect(0, rayHeight + 2 + grid, grid * 6, 1, bevelColor);
				// 	drawRect(0, rayHeight + 1 + grid * 2, grid * 6, 1, 'black');
				// 	drawRect(0, rayHeight + 2 + grid * 2, grid * 6, 1, bevelColor);
				// 	drawRect(0, rayHeight + 1 + grid * 3, grid * 6, 1, 'black');
				// 	drawRect(0, rayHeight + 2 + grid * 3, grid * 6, 1, bevelColor);

				// 	partyMembers.forEach(partyMember);

				// }
				// info();
				// drawRect(grid * 6, rayHeight + 2 + grid, 1, gameHeight - rayHeight - 2 - grid, 'black'); // center border
				// party();
			},

			moveForward = () => {
				if(moveForwardTimer < 2){
					const forwardTime = 1;
					let newDirX = Math.round(direction.x * 100), newDirY = Math.round(direction.y * 100);
					newDirX = newDirX / 100;
					newDirY = newDirY / 100;
					if(newDirX == 0.5 && newDirY == 0){ // east
						if(map[position.y][position.x + 1] == '.' && map[position.y - 1][position.x + 1] == '.') position.x += forwardTime;
					}
					else if(newDirX == -0.5 && newDirY == 0){ // west
						if(map[position.y][position.x - 2] == '.' && map[position.y - 1][position.x - 2] == '.') position.x -= forwardTime;
					}
					else if(newDirX == 0 && newDirY == 0.5){ // south
						if(map[position.y + 1][position.x] == '.' && map[position.y + 1][position.x - 1] == '.') position.y += forwardTime;
					}
					else if(newDirX == 0 && newDirY == -0.5){ // north
						if(map[position.y - 2][position.x] == '.' && map[position.y - 2][position.x - 1] == '.') position.y -= forwardTime;
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
				if(turnAroundTimer < moveTime){
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