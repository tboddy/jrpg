const mapWidth = 24,
	mapHeight = 24,
	position = {x: 1, y: 2}, lastPosition = {x: 0, y: 0},
	direction = {x: 0.5, y: 0},
	plane = {x: 0, y: 1},
	rayHeight = gameHeight - grid * 6,
	rayWidth = gameWidth;

let map = [
	['1','1','1','1','1','1','1','1','1','1','1','1','1','1','1','1','1','1','1','1','1','1','1','1'],
	['1','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','1'],
	['1','.','.','.','.','2','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','1'],
	['1','.','.','.','2','2','2','2','2','2','2','.','.','.','.','.','.','.','.','.','.','.','.','1'],
	['1','.','.','2','2','2','2','2','2','2','2','.','.','.','.','3','.','3','.','3','.','.','.','1'],
	['1','.','.','2','2','2','2','.','.','.','2','.','.','.','.','.','.','.','.','.','.','.','.','1'],
	['1','.','.','2','2','2','2','.','.','.','2','.','.','.','.','3','.','.','.','3','.','.','.','1'],
	['1','.','.','2','2','2','2','.','.','.','2','.','.','.','.','.','.','.','.','.','.','.','.','1'],
	['1','.','.','2','2','2','2','2','.','2','2','.','.','.','.','3','.','3','.','3','.','.','.','1'],
	['1','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','1'],
	['1','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','1'],
	['1','.','.','4','4','3','2','3','4','.','.','.','.','.','.','.','.','.','.','.','.','.','.','1'],
	['1','.','.','4','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','1'],
	['1','.','.','4','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','1'],
	['1','.','.','4','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','1'],
	['1','.','.','4','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','1'],
	['1','.','.','4','4','4','4','4','4','.','.','.','.','.','.','.','.','.','.','.','.','.','.','1'],
	['1','.','.','4','.','.','.','.','4','.','.','.','.','.','.','.','.','.','.','.','.','.','.','1'],
	['1','.','.','4','.','.','5','.','4','.','.','.','.','.','.','.','.','.','.','.','.','.','.','1'],
	['1','.','.','4','.','.','.','.','4','.','.','.','.','.','.','.','.','.','.','.','.','.','.','1'],
	['1','.','.','4','4','4','4','4','4','.','.','.','.','.','.','.','.','.','.','.','.','.','.','1'],
	['1','.','.','4','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','1'],
	['1','4','4','4','4','4','4','4','4','.','.','.','.','.','.','.','.','.','.','.','.','.','.','1'],
];

// map.forEach((row, i) => {
// 	console.log(row)
// });

// map = map.reverse()

const rotateSpeed = 90 / 500;

const dungeon = {

	setup(){

		const controls = () => {
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
			}, keysUp = () => { canMove = true;
			}, forward = () => {
				if(direction.x == 0.5 && direction.y == 0){ // go east
					if(map[position.y][position.x + 1] == '.') position.x = position.x + 1;
				}
				// else if(direction.x = -0.5 && direction.y == 0){ // go west
				// 	if(map[position.y][position.x - 1] == '.') position.x = position.x - 1;
				// }
			}, turnAround = () => {

			}, turnRight = () => {

				const oldDirX = direction.x, oldPlaneX = plane.x;
				direction.x = direction.x * Math.cos(rotateSpeed) - direction.y * Math.sin(rotateSpeed);
				direction.y = oldDirX * Math.sin(rotateSpeed) + direction.y * Math.cos(rotateSpeed);
	      plane.x = plane.x * Math.cos(rotateSpeed) - plane.y * Math.sin(rotateSpeed);
	      plane.y = oldPlaneX * Math.sin(rotateSpeed) + plane.y * Math.cos(rotateSpeed);

			}, turnLeft = () => {

				const oldDirX = direction.x, oldPlaneX = plane.x;
				direction.x = direction.x * Math.cos(-rotateSpeed) - direction.y * Math.sin(-rotateSpeed);
				direction.y = oldDirX * Math.sin(-rotateSpeed) + direction.y * Math.cos(-rotateSpeed);
	      plane.x = plane.x * Math.cos(-rotateSpeed) - plane.y * Math.sin(-rotateSpeed);
	      plane.y = oldPlaneX * Math.sin(-rotateSpeed) + plane.y * Math.cos(-rotateSpeed);

			};
			document.addEventListener('keydown', keysDown);
			document.addEventListener('keyup', keysUp);
		};

		controls();

	},

	loop(){

		const draw = () => {

			const raycast = () => {
				let column = 0;

				const background = () => {
					const ceiling = () => {
						drawRect(0, 0, gameWidth, rayHeight / 2, colors.black);
					}, floor = () => {

						const floorColor = colors.greenDark, shadowColor = colors.ochre;

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
					let drawStart = -lineHeight / 2 + rayHeight / 2, drawEnd = lineHeight / 2 + rayHeight / 2;
					if(drawStart < 0) drawStart = 0;
					if(drawEnd >= rayHeight) drawEnd = rayHeight - 1;

					let wallColor = 'pink', shadowColor = 'black';
					switch(map[mapPosition.y][mapPosition.x]){
						case '1':
							wallColor = colors.green;
							shadowColor = colors.greenDark;
							break;
						case '2':
							wallColor = colors.redLight;
							shadowColor = colors.red;
							break;
					}
					drawRect(column, drawStart, 1, lineHeight, wallColor);
					context.save();
					context.globalAlpha = (rayHeight - lineHeight) / 150;
					drawRect(column, drawStart, 1, lineHeight, shadowColor);
					context.restore();

				};

				background();
				while(column < rayWidth){
					wall();
					column++;
				}
			},

			chrome = () => {
				drawRect(0, rayHeight + 1, gameWidth, gameHeight - rayHeight - 1, colors.purpleDarker); // bg
				drawRect(0, rayHeight + 1, gameWidth, 1, colors.purpleDark); // top bevel
				drawRect(grid * 6, rayHeight + 1, 1, gameHeight - rayHeight - 1, 'black'); // center border

			};

			raycast();
			chrome();

		};

		draw();

	}

};