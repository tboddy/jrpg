const images = [], textureSize = grid * 4;

let gameLoopInterval, isGameOver = false, gameClock = 0, imageData, buffer;

const initTextureLoad = (textures, success) => {
	let counter = 0;
	const callback = () => {
		counter++;
		console.log(counter + ' of ' + textures.length + ' textures recieved');
		if(counter == textures.length) success();
	}
	textures.forEach(texture => {
		const image = new Image();
		image.onload = callback;
		image.src = texture;
		image.id = texture;
		images.push(image);
	});
}, getTextures = () => {
	const textures = [];
	images.forEach(image => {
		const cvs = document.createElement('canvas');
		cvs.width = image.width;
		cvs.height = image.height;
		const ctx = cvs.getContext('2d');
		ctx.drawImage(image, 0, 0);
		const imageData = ctx.getImageData(0, 0, image.width, image.height),
			rgbArray = new Array(image.width * image.height);
		for(var j = 0; j < image.width * image.height; j++){
			rgbArray[j] = [imageData.data[4 * j], imageData.data[4 * j + 1], imageData.data[4 * j + 2]];
		}
		textures.push(rgbArray);
	});
	return textures;
};

const textureFiles = [
	'img/bricks1.png', 'img/purplefloor.png', 'img/purpleceiling.png',
	'img/door1.png', 'img/door2.png'
];

const initGame = () => {
	$(window).resize(resizeGame);
	initTextureLoad(textureFiles, () => {
		imageData = context.getImageData(0, 0, gameWidth, gameHeight);
		buffer = imageData.data;
		loop = gameLoop;
		dungeon.setup();
		canvasEl.show();
		window.requestAnimationFrame(loop);
	});
},

gameLoop = () => {
	clearGame();
	dungeon.loop();
	gameClock++;
	window.requestAnimationFrame(loop);
};