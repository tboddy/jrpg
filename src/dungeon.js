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