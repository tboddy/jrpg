const enemyArcherImg = new Image(), enemyZombieImg = new Image();
enemyArcherImg.src = 'img/enemy-bowman.png';
enemyZombieImg.src = 'img/enemy-zombie.png';

const bestiary = {

	enemies: {

		archer(){
			return {
				name: 'archer',
				img: enemyArcherImg,
				width: 40,
				height: 56,
				hp: 40,
				selected: true,
				weaknesses: {
					e: true
				}
			}
		},

		zombie(){
			return {
				name: 'zombie',
				img: enemyZombieImg,
				width: 64,
				height: 64,
				hp: 60,
				selected: false,
				weaknesses: {
					f: true
				}
			}
		}

	}

};