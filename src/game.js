let gameLoopInterval, isGameOver = false, gameClock = 0;

const initGame = () => {
	$(window).resize(resizeGame);
	loop = gameLoop;
	battle.controls();
	canvasEl.show();
	window.requestAnimationFrame(loop);
},

gameLoop = () => {
	clearGame();
	battle.loop();
	gameClock++;
	window.requestAnimationFrame(loop);
};