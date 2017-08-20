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