let gameLoopInterval, isGameOver = false, gameClock = 0;

const initGame = function(){
	$(window).resize(resizeGame);
	loop = gameLoop;
	battle.controls();
	canvasEl.show();
	window.requestAnimationFrame(loop);
},

gameLoop = function(){
	clearGame();
	battle.loop();
	gameClock++;
	window.requestAnimationFrame(loop);
};