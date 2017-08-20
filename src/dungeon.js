const dungeonPlayer = {x: 0, y: 0, direction: 0}, dungeonMap = {}, mapSize = 32, cameraObj = {};

skyboxImg = new Image(), wallImg = new Image();
skyboxImg.src = 'img/skybox.png';
wallImg.src = 'img/wall.png';

const columnPerspective = 1, frontOffset = grid * 4.25;
const map = [
	['X', 'X', 'X', 'X', 'X'],

	['X', 'c', 'c', 'c', 'X'],

	['X', 'c', 'X', 'c', 'X'],

	['X', 'c', 'c', 'c', 'X'],

	['X', 'X', 'X', 'X', 'X']
], currentPosition = {x: 1, y: 1}, frontHeight = gameHeight / 2 - frontOffset / 2, wallColor = '#6abe30';
let currentDirection = 's';

const dungeon = {

	setup(){

		
		const controls = () => {
			let canMove = true;
			const keysDown = e => {
				if(canMove){
					canMove = false;
					console.log(currentDirection, currentPosition.x, currentPosition.y);
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

		const rayCast = () => {

			const drawBg = () => {
				// context.save();
				context.drawImage(skyboxImg, 0, 0);
				// let gridNum = 0;
				// while(gridNum < 15 && context.globalAlpha > 0){
				// 	context.fillStyle = 'black';
				// 	context.globalAlpha = 0.667 - (gridNum / 10);
				// 	context.fillRect(0, (gameHeight / 2) + (gridNum * (grid / 2)), gameWidth, grid / 2)
				// 	gridNum++;
				// }
				// context.restore();
			},

			drawColumns = () => {
				const currentBlock = map[currentPosition.y][currentPosition.x];
				let frontBlock, leftBlock, rightBlock;
				switch(currentDirection){
					case 'n':
						frontBlock = map[currentPosition.y - 1][currentPosition.x];
						leftBlock = map[currentPosition.y][currentPosition.x - 1];
						rightBlock = map[currentPosition.y][currentPosition.x + 1];
					case 's':
						frontBlock = map[currentPosition.y + 1][currentPosition.x];
						leftBlock = map[currentPosition.y][currentPosition.x + 1];
						rightBlock = map[currentPosition.y][currentPosition.x - 1];
						break;
					case 'e':
						frontBlock = map[currentPosition.y][currentPosition.x + 1];
						leftBlock = map[currentPosition.y - 1][currentPosition.x];
						rightBlock = map[currentPosition.y + 1][currentPosition.x];
						break;
					case 'w':
						frontBlock = map[currentPosition.y][currentPosition.x - 1];
						leftBlock = map[currentPosition.y + 1][currentPosition.x];
						rightBlock = map[currentPosition.y - 1][currentPosition.x];
						break;
				}
				let currentColumn = 0;
				while(currentColumn < gameWidth){
					let columnX = currentColumn, columnHeight = gameHeight - currentColumn * 2, columnY = currentColumn;
					if(columnHeight < 0) {
						columnHeight = columnHeight * -1;
						columnY = gameHeight - columnY;
					}
					const drawShadow = alpha => {
						context.save();
						context.globalAlpha = alpha;
						drawRect(columnX, columnY, 1, columnHeight, 'black');
						context.restore();
					};
					if(columnX < gameWidth / 3){
						if(leftBlock == 'X'){
							drawRect(columnX, columnY, 1, columnHeight, wallColor);
							if(columnX >= (gameWidth / 6)){
								let alpha = 0.1;
								if(columnX >= (gameWidth / 6) + (gameWidth / 10) - 2) alpha = 0.2;
								drawShadow(alpha);
							}
						}
					} else if(columnX >= ((gameWidth / 3) * 2) - grid){
						columnX = columnX + (grid - 1);
						if(rightBlock == 'X'){
							drawRect(columnX, columnY, 1, columnHeight, wallColor);
							if(columnX < ((gameWidth / 3) * 2) + ((gameWidth / 12) * 2) - 1){
								let alpha = 0.2;
								if(columnX >= ((gameWidth / 3) * 2) + (gameWidth / 14)) alpha = 0.1;
								drawShadow(alpha);
							}
						}
					}
					else if(frontBlock == 'X'){
						const columnWidthHack = columnX > ((gameWidth / 3) * 2) - (grid * 2) ? grid : 1;
						drawRect(columnX, frontHeight, columnWidthHack, frontOffset, wallColor);
						context.save();
						context.globalAlpha = 0.3;
						drawRect(columnX, frontHeight, columnWidthHack, frontOffset, 'black');
						context.restore();
					}
					currentColumn++;
				}
			};

			drawBg();
			drawColumns();

		};

		rayCast();

	}

};