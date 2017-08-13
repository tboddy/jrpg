const actionsData = [
	{
		title: 'attack',
		info: 'attack an enemy',
		active: true
	},
	{
		title: 'skill',
		info: 'use a skill',
		active: false,
		subMenu: 'skills'
	},
	{
		title: 'item',
		info: 'use an item',
		active: false,
		subMenu: 'items'
	},
	{
		title: 'guard',
		info: 'guard until next round',
		active: false
	}
];

const menuHeight = grid * 6, partyWidth = grid * 8, partyHeight = grid * 2, menuPadding = grid / 3, scrollUpImg = new Image(),
	scrollDownImg = new Image(), alertPadding = grid / 2, actionHallImg = new Image(), actionHeight = grid * 6, menuBgImg = new Image(),
	enemySelectImg = new Image();

const menuOffset = gameHeight - menuHeight;
scrollUpImg.src = 'img/menu-scroll-up.png';
scrollDownImg.src = 'img/menu-scroll-down.png';
actionHallImg.src = 'img/battle-hall.png';
menuBgImg.src = 'img/menu-bg.png';
enemySelectImg.src = 'img/select-arrow.png';

let currentMenu = actionsData, currentMenuType, currentAction = false, selectingEnemy = false, attackingEnemy = false,
	selectingPartyMember = false;

const currentEnemiesData = [
	bestiary.enemies.archer(),
	bestiary.enemies.zombie()
];

const currentEnemy = () => {
	let returnEnemy;
	currentEnemiesData.forEach((enemy, i) => {
		enemy.index = i;
		if(enemy.selected) returnEnemy = enemy;
	});
	return returnEnemy;
},

currentPartyMember = () => {
	let returnPartyMember;
	partyData.forEach((partyMember, i) => {
		partyMember.index = i;
		if(partyMember.active) returnPartyMember = partyMember;
	});
	return returnPartyMember;
};

const battle = {

	controls(){

		let canMoveMenu = true, currentItem;

		const keysDown = e => {
			if(canMoveMenu){
				canMoveMenu = false;
				getCurrentItem();
				switch(e.which){
					case 38: moveUp(); break;
					case 40: moveDown(); break;
					case 37: moveLeft(); break;
					case 39: moveRight(); break;
					case 13: select(); break;
					case 8: back(); break;
				};
			}
		}, moveUp = () => {
			if(currentMenu[currentItem.index - 1] && !currentAction && !selectingEnemy){
				currentMenu[currentItem.index].active = false;
				currentMenu[currentItem.index - 1].active = true;
				doScroll();
			};
		}, moveDown = () => {
			if(currentMenu[currentItem.index + 1] && !currentAction && !selectingEnemy){
				currentMenu[currentItem.index].active = false;
				currentMenu[currentItem.index + 1].active = true;
				doScroll();
			};
		}, moveLeft = () => {
			if(currentEnemiesData[currentEnemy().index - 1] && selectingEnemy){
				const currentI = currentEnemy().index;
				currentEnemiesData[currentI].selected = false;
				currentEnemiesData[currentI - 1].selected = true;
			}
		}, moveRight = () => {
			if(currentEnemiesData[currentEnemy().index + 1] && selectingEnemy){
				const currentI = currentEnemy().index;
				currentEnemiesData[currentI].selected = false;
				currentEnemiesData[currentI + 1].selected = true;
			}
		}, select = () => {
			const doSubMenu = () => {
				switch(currentItem.subMenu){
					case 'skills':
						partyData.forEach(member => {
							if(member.active){
								currentMenu = member.skills;
								currentMenuType = 'skills';
							}
						});
						break;
					case 'items':
						currentMenu = inventoryData;
						currentMenuType = 'items';
						break;
				}
			}, doAttack = () => {
				selectingEnemy = 'attack';
			}, doAttackFinish = () => {
				currentAction = currentItem;
				currentAction.type = 'attack';
				attackingEnemy = true;
			}, doSkill = () => {
				selectingEnemy = 'skill';
			}, doSkillFinish = () => {
				currentAction = currentItem;
				currentAction.type = 'skill';
				attackingEnemy = true;
			}, doItem = () => {
				currentAction = currentItem;
				currentAction.type = 'selectItem';
			}, doGuard = () => {
				currentAction = currentItem;
				currentAction.type = 'guard';
			};
			if(currentAction){
				const lastSkill = currentAction.type;
				currentAction.type = false;
				currentAction = false;
				if(selectingEnemy) selectingEnemy = false;
				if(attackingEnemy){
					currentEnemiesData.splice(currentEnemy().index, 1);
					if(currentEnemiesData.length) currentEnemiesData[0].selected = true;
					attackingEnemy = false;
				} else if(selectingPartyMember){
					console.log(selectingPartyMember);
					nextTurn();
					// switch(selectingPartyMember){
					// }
				}
				switch(lastSkill){
					case 'attack': nextTurn(); break;
					case 'skill': nextTurn(); break;
					case 'guard': nextTurn(); break;
				}
			} else if(selectingEnemy){
				switch(selectingEnemy){
					case 'attack': doAttackFinish(); break;
					case 'skill': doSkillFinish(); break;
				}
			}
			else if(currentItem.title == 'attack') doAttack();
			else if(currentItem.title == 'guard') doGuard();
			else if(currentItem.subMenu) doSubMenu();
			else if(currentMenuType && currentMenuType == 'skills') doSkill();
			else if(currentMenuType && currentMenuType == 'items') doItem();
		}, back = () => {
			if(selectingEnemy) selectingEnemy = false;
			if(selectingPartyMember) selectingPartyMember = false;
			if(currentMenu != actionsData && !currentAction){
				currentMenu.forEach((item, i) => {
					item.y = false;
					item.active = i == 0 ? true : false;
				});
				currentMenu = actionsData;
			} else if(currentAction){
				if(currentAction.type == 'selectItem') currentAction = false;
			}
		}, getCurrentItem = () => {
			currentMenu.forEach((item, i) => {
				if(item.active){
					currentItem = item;
					currentItem.index = i;
				}
			});
		}, keysUp = () => { canMoveMenu = true;
		}, doScroll = () => {
			const scrollUp = () => {
				currentMenu.forEach(item => {
					item.y += item.height;
				});
			}, scrollDown = () => {
				currentMenu.forEach(item => {
					item.y -= item.height;
				});
			}
			if(currentItem.y >= gameHeight + grid) scrollDown();
			else if(currentItem.y <= menuOffset) scrollUp();
		}, nextTurn = () => {
			back();
			const resetMenu = () => {
				currentMenu.forEach((item, i) => {
					item.active = i == 0 ? true : false;
				});
			};
			const nextPartyMemberIndex = currentPartyMember().index + 1 < partyData.length ? currentPartyMember().index + 1 : 0;
			partyData[currentPartyMember().index].active = false;
			partyData[nextPartyMemberIndex].active = true;
			resetMenu();
		};

		document.addEventListener('keydown', keysDown);
		document.addEventListener('keyup', keysUp);

	},

	loop(){

		const update = () => {

		},

		draw = () => {

			const action = () => {
				const background = () => {
					context.drawImage(actionHallImg, 0, grid * 2);
				},
				enemies = () => {
					if(currentEnemiesData.length){
						let prevWidth = 0, xOffset = 0;
						const findXOffset = () => {
							let groupWidth = 0;
							currentEnemiesData.forEach(enemy => {
								groupWidth += enemy.width;
							});
							xOffset = (gameWidth / 2) - (groupWidth / 2);
						}, drawEnemy = (enemy, i) => {
							const yOffset = actionHeight - enemy.height + (grid * 2) - 2, animationTime = 96;
							if(enemy.selected && selectingEnemy){
								const selectOffset = (xOffset + prevWidth) + (enemy.width / 2) - (grid / 2);
								context.drawImage(enemySelectImg, selectOffset, yOffset - grid);
							}
							const animationOffset = gameClock % animationTime < (animationTime / 2) ? 0 : enemy.width;
							context.drawImage(enemy.img, animationOffset, 0, enemy.width, enemy.height, xOffset + prevWidth, yOffset, enemy.width, enemy.height);
							prevWidth = enemy.width;
						};
						findXOffset();
						currentEnemiesData.forEach(drawEnemy);
					}
				},
				alerts = () => {
					if(currentAction){
						const alertX = gameWidth / 4, alertWidth = gameWidth / 2;
						let alertHeight, alertY;
						const doAttack = () => {
							alertHeight = Math.floor((grid * 2.5) + menuPadding - 1 + alertPadding);
							alertY = (menuOffset / 2) - (alertHeight / 2);
							doBg();
							drawString('attacked', alertX + alertPadding, alertY + alertPadding); // attack
							drawString(currentEnemy().name + ' for', alertX + alertPadding, alertY + menuPadding + grid); // enemy
							drawString('34 hp', alertX + alertPadding, alertY + (menuPadding * 2) + (grid * 1.5)); // result
							drawString('x', alertX + alertWidth - grid, alertY + (menuPadding * 2) + (grid * 1.5), true); // confirm
						}, doSkill = () => {
							alertHeight = Math.floor((grid * 2.5) + menuPadding - 1 + alertPadding);
							alertY = (menuOffset / 2) - (alertHeight / 2);
							doBg();
							drawString(currentAction.title + ' hit', alertX + alertPadding, alertY + alertPadding); // skill name
							drawString(currentEnemy().name + ' for', alertX + alertPadding, alertY + menuPadding + grid); // enemy
							drawString('34 hp', alertX + alertPadding, alertY + (menuPadding * 2) + (grid * 1.5)); // result
							drawString('x', alertX + alertWidth - grid, alertY + (menuPadding * 2) + (grid * 1.5), true); // confirm
						}, doItem = () => {
							alertHeight = Math.floor((grid * 2.5) + menuPadding - 1 + alertPadding);
							alertY = (menuOffset / 2) - (alertHeight / 2);
							doBg();
							drawString('item', alertX + alertPadding, alertY + alertPadding); // skill name
						}, doGuard = () => {
							alertHeight = Math.floor((grid * 1.5) + menuPadding - 1 + alertPadding);
							alertY = (menuOffset / 2) - (alertHeight / 2);
							doBg();
							drawString('guarding until', alertX + alertPadding, alertY + alertPadding);
							drawString('next round', alertX + alertPadding, alertY + menuPadding + grid);
							drawString('x', alertX + alertWidth - grid, alertY + menuPadding + grid, true); // confirm
						}, doBg = () => {
							drawRect(alertX, alertY, alertWidth, alertHeight, colors.black); // border
							drawRect(alertX + 1, alertY + 1, alertWidth - 2, alertHeight - 2, colors.grayDarker); // bg
							drawRect(alertX + 1, alertY + 1, alertWidth - 2, 1, colors.gray); // bevel
						};
						switch(currentAction.type){
							case 'attack': doAttack(); break;
							case 'skill': doSkill(); break;
							case 'item': doItem(); break;
							case 'guard': doGuard(); break;
						}
					}
				};
				background();
				enemies();
				alerts();
			}, menu = () => {
				const targetBg = () => {
					drawRect(0, 1, gameWidth, (grid * 2) - 2, colors.grayDarker); // bg
					drawRect(0, 1, gameWidth, 1, colors.gray); // top bevel
				}, target = () => {
					if(selectingEnemy){
						let targetString = '', fDisabled = true, iDisabled = true, bDisabled = true, eDisabled = true;
						const enemyTarget = enemy => {
							targetString = enemy.name + ' hp ' + enemy.hp;
							if(enemy.weaknesses){
								if(enemy.weaknesses.f) fDisabled = false;
								if(enemy.weaknesses.i) iDisabled = false;
								if(enemy.weaknesses.b) bDisabled = false;
								if(enemy.weaknesses.e) eDisabled = false;
							}
						};
						currentEnemiesData.forEach(enemy => {
							if(enemy.selected) enemyTarget(enemy);
						});
						drawString(targetString, menuPadding, menuPadding + 1);
						drawString('f', menuPadding, (menuPadding * 2) + (grid / 2), false, fDisabled);
						drawString('i', menuPadding + grid, (menuPadding * 2) + (grid / 2), false, iDisabled);
						drawString('b', menuPadding + grid * 2, (menuPadding * 2) + (grid / 2), false, bDisabled);
						drawString('e', menuPadding + (grid * 3), (menuPadding * 2) + (grid / 2), false, eDisabled);
					}
				}, infoBg = () => {
					drawRect(0, actionHeight + (grid * 2) + 1, gameWidth, grid - 1, colors.grayDarker); // bg
					drawRect(0, actionHeight + (grid * 2) + 1, gameWidth, 1, colors.gray); // top bevel
				}, info = () => {
					let infoString = '';
					if(currentAction && (currentAction.type == 'selectItem')){
						infoString = 'select a party member';
						selectingPartyMember = true;
					} else {
						currentMenu.forEach(item => {
							if(item.active && item.info) infoString = item.info;
						});
					}
					drawString(infoString, menuPadding, actionHeight + (grid * 2) + menuPadding);
				}, background = () => {
					const bgPattern = context.createPattern(menuBgImg, 'repeat');
					context.fillStyle = bgPattern;
					context.fillRect(0, menuOffset, gameWidth, menuHeight);
					drawRect(0, menuOffset, gameWidth, 1, colors.black); // top border
					drawRect(partyWidth, menuOffset, 1, menuHeight, colors.black) // divider
				}, party = () => {
					const partyMember = (member, i) => {
						const offset = menuOffset + (partyHeight * i), stringStat = input => {
							input = String(input);
							if(input.length == 2) input = '0' + input;
							else if(input.length == 1) input = '00' + input;
							return input;
						}, isRed = member.active ? true : false;
						drawRect(0, menuOffset + (partyHeight * i) + 1, partyWidth, partyHeight, colors.grayDarker); // bg
						drawRect(0, menuOffset + (partyHeight * i) + 1, partyWidth, 1, colors.gray); // top bevel
						drawRect(0, menuOffset + (partyHeight * (i + 1)), partyWidth, 1, colors.black); // bottom border
						drawString(member.name, menuPadding, offset + menuPadding, isRed); // name
						drawString('hp ' + stringStat(member.hp), grid * 4.75, offset + menuPadding, isRed); // hp
						drawString('mp ' + stringStat(member.mp), grid  * 4.75, offset + partyHeight - (grid / 2) - menuPadding + 2, isRed); // mp
					};
					partyData.forEach(partyMember);
				}, actions = () => {
					const drawItem = (item, i) => {
						const offset = menuOffset + (grid * i), isRed = item.active ? true : false;
						if(!item.x) item.x = partyWidth;
						if(!item.y) item.y = offset + grid;
						if(!item.height) item.height = grid;
						if(item.y <= menuOffset) context.globalAlpha = 0;
						drawRect(item.x + 1, item.y - grid + 1, partyWidth - 1, grid, colors.grayDarker); // bg
						drawRect(item.x + 1, item.y - grid + 1, partyWidth - 1, 1, colors.gray); // top bevel
						drawRect(item.x, item.y, partyWidth, 1, colors.black); // bottom border
						drawString(item.title, item.x + menuPadding, item.y + menuPadding - grid, isRed); // title
						if(item.y <= menuOffset) context.globalAlpha = 1;
					}, scrollIndicators = () => {
						const showTop = () => {
							context.drawImage(scrollUpImg, gameWidth - (grid / 2) - menuPadding, menuOffset + menuPadding);
						}, showBottom = () => {
							context.drawImage(scrollDownImg, gameWidth - (grid / 2) - menuPadding, gameHeight - grid + menuPadding);
						};
						let topVisible = false, bottomVisible = false;
						currentMenu.forEach(item => {
							if(item.y >= gameHeight + grid) bottomVisible = true;
							if(item.y <= menuOffset) topVisible = true;
						});
						if(topVisible) showTop();
						if(bottomVisible) showBottom();
					};
					currentMenu.forEach(drawItem);
					scrollIndicators();
				};
				targetBg();
				target();
				infoBg();
				info();
				background();
				party();
				actions();
			};

			action();
			menu();

		};

		update();
		draw();

	}

};