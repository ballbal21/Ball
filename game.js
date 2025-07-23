/****
* Assets
****/
LK.init.shape('barrier', {width:70, height:70, color:0x3954ff, shape:'ellipse'})
LK.init.shape('barrierblock', {width:70, height:170, color:0x3954ff, shape:'box'})
LK.init.shape('bonusbarmiddle', {width:50, height:50, color:0xc3cbff, shape:'box'})
LK.init.shape('bonusend', {width:50, height:50, color:0xc3cbff, shape:'ellipse'})
LK.init.shape('dangeroverlay', {width:2048, height:500, color:0x070821, shape:'box'})
LK.init.shape('uxoverlay', {width:2048, height:500, color:0x3954ff, shape:'box'})
LK.init.shape('uxoverlay2', {width:2048, height:500, color:0x222459, shape:'box'})
LK.init.image('bubble0', {width:157, height:157, id:'666ae3d78d9daa19ed5a534a'})
LK.init.image('bubble1', {width:157, height:157, id:'666ae3d73daf3ace2d07bdea'})
LK.init.image('bubble2', {width:157, height:157, id:'666ae2ad8d9daa19ed5a533b'})
LK.init.image('bubble3', {width:157, height:157, id:'666ae3d73daf3ace2d07bde9'})
LK.init.image('bubble4', {width:157, height:157, id:'666ae3d73daf3ace2d07bde8'})
LK.init.image('bubble5', {width:157, height:157, id:'666ae3d78d9daa19ed5a5349'})
LK.init.image('countbg', {width:120, height:120, id:'66262e026b90388bb01960c1'})
LK.init.image('fireball', {width:210, height:210, id:'662621666b90388bb0195f83'})
LK.init.image('fireparticle', {width:70, height:76.09, id:'662628916b90388bb0196008'})
LK.init.image('hintbubble', {width:50, height:49.59, id:'662250c7eff7d73bc2d1d329'})
LK.init.image('removebubbleeffect', {width:900, height:450, id:'66217070f46305276d9e4c4a'})
LK.init.image('warningstripe', {width:50.91, height:50, id:'6623af081d31755ac75386fa', orientation:1})
LK.init.sound('attachCircle', {volume:0.5, start:0.026, end:0.102, id:'663494e3b624499591910501'})
LK.init.sound('circleBounce', {volume:0.3, start:0.382, end:0.454, id:'6634a10bb6244995919105c5'})
LK.init.sound('detachCircle', {volume:1, start:0.022, end:0.262, id:'66349293b6244995919104f3'})
LK.init.sound('fireBubble', {volume:0.8, start:0.014, end:0.132, id:'66349fcdb6244995919105bd'})
LK.init.sound('gameOverJingle', {volume:1, start:0, end:1, id:'6634a1ecb6244995919105d0'})
LK.init.sound('powerupSwoosh', {volume:1, start:0.01, end:0.32, id:'66349fcdb6244995919105bc'})
LK.init.sound('powerupThump', {volume:1, start:0, end:0.13, id:'6634f27b82a223d0b981ce40'})
LK.init.sound('scoreCollected', {volume:0.3, start:0.005, end:0.137, id:'6634f27b82a223d0b981ce41'})

/**** 
* Plugins
****/
var tween = LK.import("@upit/tween.v1");

/**** 
* Classes
****/
var Barrier = Container.expand(function () {
	var self = Container.call(this);
	var barrierGraphics = self.attachAsset('barrier', {
		anchorX: .5,
		anchorY: .5
	});
});
var BonusUX = Container.expand(function () {
	var self = Container.call(this);
	//Insert label here
	var barHeight = 50;
	// Dropshadow for bonusLabel
	var bonusLabelShadow = self.addChild(new Text2('Streak Bonus', {
		size: 90,
		fill: 0x000000,
		alpha: 0.35,
		font: "Impact"
	}));
	bonusLabelShadow.anchor.set(1, 1);
	bonusLabelShadow.x = -10 + 4;
	bonusLabelShadow.y = barHeight / 2 + 4;
	// Main bonusLabel
	var bonusLabel = self.addChild(new Text2('Streak Bonus', {
		size: 90,
		fill: 0xF4F5FF,
		font: "Impact"
	}));
	bonusLabel.anchor.set(1, 1);
	bonusLabel.y = barHeight / 2;
	var rightMargin = -10;
	bonusLabel.x = rightMargin;
	// Dropshadow for bonusAmountLabel
	var bonusAmountLabelShadow = self.addChild(new Text2('1x', {
		size: 170,
		fill: 0x000000,
		alpha: 0.35,
		font: "Impact"
	}));
	bonusAmountLabelShadow.anchor.set(.5, .5);
	bonusAmountLabelShadow.x = 100 + 4;
	bonusAmountLabelShadow.y = 4;
	// Main bonusAmountLabel
	var bonusAmountLabel = self.addChild(new Text2('1x', {
		size: 170,
		fill: 0xF4F5FF,
		font: "Impact"
	}));
	bonusAmountLabel.anchor.set(.5, .5);
	bonusAmountLabel.x = 100;
	var bonusBarWidth = bonusLabel.width;
	var bonusBarStart = self.attachAsset('bonusend', {
		y: 30,
		x: -bonusBarWidth + rightMargin
	});
	var bonuseBarEnd = self.attachAsset('bonusend', {
		y: 30,
		x: -bonusBarWidth + rightMargin
	});
	var bonusBarMiddle = self.attachAsset('bonusbarmiddle', {
		y: 30,
		x: -bonusBarWidth + rightMargin + barHeight / 2,
		width: 0
	});
	self.x = game.width - 270;
	self.y = game.height - 145;
	var bonusBarStepSize = (bonusBarWidth - barHeight) / 5;
	var targetWidth = 0;
	var currentWidth = 0;
	var jumpToAtEnd = 0;
	self.bonusAmount = 1;
	self.streakCount = 0;
	var maxLevel = 40;
	self.setStreakCount = function (level) {
		self.streakCount = Math.min(level, maxLevel);
		var newBonus = Math.floor(self.streakCount / 5) + 1;
		if (newBonus != self.bonusAmount) {
			for (var a = 0; a < scoreMultipliers.length; a++) {
				scoreMultipliers[a].setMultiplier(newBonus);
			}
		}
		self.bonusAmount = newBonus;
		bonusAmountLabel.setText(self.bonusAmount + 'x');
		var newbarpos = level >= maxLevel ? 5 : level % 5;
		targetWidth = newbarpos * bonusBarStepSize;
		jumpToAtEnd = targetWidth;
		if (newbarpos == 0 && level > 0) {
			targetWidth = 5 * bonusBarStepSize;
			jumpToAtEnd = 0;
		}
	};
	self.update = function () {
		var delta = targetWidth - currentWidth;
		if (delta < 1) {
			targetWidth = currentWidth = jumpToAtEnd;
		} else {
			currentWidth += delta / 8;
		}
		bonuseBarEnd.x = -bonusBarWidth + currentWidth + rightMargin;
		bonusBarMiddle.width = currentWidth;
	};
	//	bonuseBarEnd.x = -bonusLabel.width;
});
var Bubble = Container.expand(function (max_types, isFireBall, type) {
	var self = Container.call(this);
	self.isFireBall = isFireBall;
	var state = 0;
	self.isAttached = true;
	self.isFreeBubble = false;
	var speedX = 0;
	var speedY = 0;
	self.targetX = 0;
	self.targetY = 0;
	self.setPos = function (x, y) {
		self.x = self.targetX = x;
		self.y = self.targetY = y;
	};
	if (type !== undefined) {
		this.type = type;
	} else {
		max_types = max_types || 3;
		if (max_types > 4) {
			self.type = Math.floor(Math.random() * (.8 + Math.random() * .2) * max_types);
		} else {
			self.type = Math.floor(Math.random() * max_types);
		}
	}
	if (isFireBall) {
		var bubbleGraphics = self.attachAsset('fireball', {
			anchorX: 0.5,
			anchorY: 0.5
		});
		bubbleGraphics.width = 150;
		bubbleGraphics.height = 150;
	} else {
		var bubbleGraphics = self.attachAsset('bubble' + self.type, {
			anchorX: 0.5,
			anchorY: 0.5
		});
	}
	/*if (!isFireBall && self.type > 1) {
		bubbleGraphics.tint = bubbleColors[self.type];
	}*/
	self.detach = function () {
		freeBubbleLayer.addChild(self);
		LK.getSound('detachCircle').play();
		self.y += grid.y;
		self.isAttached = false;
		speedX = Math.random() * 40 - 20;
		speedY = -Math.random() * 30;
		self.down = undefined;
	};
	var spawnMod = 0;
	self.update = function () {
		if (self.isFreeBubble) {
			if (isFireBall) {
				if (++spawnMod % 2 == 0 && self.parent) {
					// Spawn fire particles every 5 ticks
					var angle = Math.random() * Math.PI * 2;
					var fireParticle = self.parent.addChild(new FireParticle(angle));
					fireParticle.x = self.x + Math.cos(angle) * self.width / 4;
					fireParticle.y = self.y + Math.sin(angle) * self.width / 4;
				}
			}
			return;
		}
		if (self.isAttached) {
			if (self.x != self.targetX) {
				self.x += (self.targetX - self.x) / 10;
			}
			if (self.y != self.targetY) {
				self.y += (self.targetY - self.y) / 10;
			}
		} else {
			self.x += speedX;
			self.y += speedY;
			speedY += 1.5;
			if (self.x < bubbleSize / 2 && speedX < 0 || self.x > game.width - bubbleSize / 2 && speedX > 0) {
				speedX = -speedX;
				LK.getSound('circleBounce').play();
			}
			// Check for collision with barriers
			for (var i = 0; i < barriers.length; i++) {
				var barrier = barriers[i];
				var dx = self.x - barrier.x;
				var dy = self.y - barrier.y;
				var distance = Math.sqrt(dx * dx + dy * dy);
				var minDist = bubbleSize / 2 + barrier.width / 2;
				if (distance < minDist) {
					// Calculate the angle of the collision
					var angle = Math.atan2(dy, dx);
					// Calculate the new speed based on the angle of collision, treating the barrier as a static billiard ball
					var newSpeed = Math.sqrt(speedX * speedX + speedY * speedY);
					speedX = Math.cos(angle) * newSpeed * .7;
					speedY = Math.sin(angle) * newSpeed * .7;
					// Move the bubble back to the point where it just touches the barrier
					var overlap = minDist - distance;
					self.x += overlap * Math.cos(angle);
					self.y += overlap * Math.sin(angle);
					LK.getSound('circleBounce').play();
				}
			}
			// Remove unattached bubbles that fall below 2732 - 500
			if (self.y > 2732 - 400) {
				self.destroy();
				scoreMultipliers[Math.floor(self.x / (2048 / 5))].applyBubble(self);
				LK.getSound('scoreCollected').play();
			}
		}
	};
});
var BubbleRemoveParticle = Container.expand(function () {
	var self = Container.call(this);
	var particle = self.attachAsset('removebubbleeffect', {
		anchorX: 0.5,
		anchorY: 0.5
	});
	particle.blendMode = 1;
	self.scale.set(.33, .33);
	var cscale = .5;
	self.update = function () {
		cscale += .02;
		self.scale.set(cscale, cscale);
		self.alpha = 1 - (cscale - .5) * 1.5;
		if (self.alpha < 0) {
			self.destroy();
		}
	};
});
var FireBallPowerupOverlay = Container.expand(function () {
	var self = Container.call(this);
	var bubbleGraphics = self.attachAsset('fireball', {
		anchorX: 0.5,
		anchorY: 0.5
	});
	self.y = game.height - 140;
	self.x = 200;
	var countBG = self.attachAsset('countbg', {
		anchorX: 0.5,
		anchorY: 0.5
	});
	countBG.x = 90;
	countBG.y = 50;
	self.fireballsLeft = 0; // Start with 0 fireballs
	// Dropshadow for label
	var labelShadow = self.addChild(new Text2(self.fireballsLeft, {
		size: 70,
		fill: 0x000000,
		alpha: 0.35,
		font: "Impact"
	}));
	labelShadow.anchor.set(.5, .5);
	labelShadow.x = 90 + 3;
	labelShadow.y = 50 + 3;
	// Main label
	var label = self.addChild(new Text2(self.fireballsLeft, {
		size: 70,
		fill: 0xFFFFFF,
		font: "Impact"
	}));
	label.anchor.set(.5, .5);
	label.x = 90;
	label.y = 50;
	self.alpha = 0.5; // Start with greyed out overlay
	self.increaseFireballCount = function () {
		self.fireballsLeft++;
		label.setText(self.fireballsLeft);
		labelShadow.setText(self.fireballsLeft);
		self.alpha = 1;
		tween(self.scale, {
			x: 1.3,
			y: 1.3
		}, {
			duration: 120,
			easing: tween.cubicOut,
			onFinish: function onFinish() {
				tween(self.scale, {
					x: 1,
					y: 1
				}, {
					duration: 220,
					easing: tween.bounceOut
				});
			}
		});
		// Spawn powerup particles
		for (var i = 0; i < 12; i++) {
			var angle = Math.random() * Math.PI * 2;
			var speed = 8 + Math.random() * 6;
			var particle = game.addChild(new PowerupParticle(angle, speed));
			particle.x = self.x + 90; // center of indicator
			particle.y = self.y + 50;
		}
	};
	self.down = function () {
		if (self.fireballsLeft > 0 && !launcher.isFireBall()) {
			self.fireballsLeft--;
			label.setText(self.fireballsLeft);
			labelShadow.setText(self.fireballsLeft);
			launcher.triggerFireBall();
			if (self.fireballsLeft == 0) {
				self.alpha = .5;
			}
		}
	};
	// State for wiggle animation
	self.isWiggling = false;
	// Update method to handle wiggle animation
	self.update = function () {
		// Check if bubbles are getting close to bottom and we have powerups
		if (self.fireballsLeft > 0 && !self.isWiggling) {
			// Get warning scores from grid
			var warningScores = grid.calculateWarningScoreList();
			var maxWarning = 0;
			for (var i = 0; i < warningScores.length; i++) {
				if (warningScores[i] > maxWarning) {
					maxWarning = warningScores[i];
				}
			}
			// If any column has high warning score (bubbles close to bottom), trigger wiggle
			if (maxWarning > 1.5) {
				// Threshold for "getting close"
				self.isWiggling = true;
				// First wiggle to the right
				tween(self, {
					rotation: 0.15
				}, {
					duration: 100,
					easing: tween.easeOut,
					onFinish: function onFinish() {
						// Then wiggle to the left
						tween(self, {
							rotation: -0.15
						}, {
							duration: 200,
							easing: tween.easeInOut,
							onFinish: function onFinish() {
								// Then wiggle to the right again
								tween(self, {
									rotation: 0.15
								}, {
									duration: 200,
									easing: tween.easeInOut,
									onFinish: function onFinish() {
										// Return to normal position
										tween(self, {
											rotation: 0
										}, {
											duration: 100,
											easing: tween.easeIn,
											onFinish: function onFinish() {
												// Reset wiggle state after a cooldown
												LK.setTimeout(function () {
													self.isWiggling = false;
												}, 2000); // 2 second cooldown before next wiggle
											}
										});
									}
								});
							}
						});
					}
				});
			}
		}
	};
});
var FireParticle = Container.expand(function (angle) {
	var self = Container.call(this);
	var particleGraphics = self.attachAsset('fireparticle', {
		anchorX: 0.5,
		anchorY: 0.5
	});
	particleGraphics.blendMode = 1;
	var speedX = Math.cos(angle) * 1;
	var speedY = Math.sin(angle) * 1;
	var rotationSpeed = Math.random() * 0.1 - 0.05;
	self.update = function () {
		self.x += speedX * self.alpha;
		self.y += speedY * self.alpha;
		particleGraphics.rotation += rotationSpeed;
		self.alpha -= 0.01;
		if (self.alpha <= 0) {
			self.destroy();
		}
	};
});
var Grid = Container.expand(function () {
	var self = Container.call(this);
	var rows = [];
	self.container = self.addChild(new Container());
	var rowCount = 0;
	function insertRow() {
		var row = [];
		var rowWidth = rowCount % 2 == 0 ? 13 : 12;
		// Determine if this row should have a powerup
		var shouldSpawnPowerup = false;
		var powerupCol = -1;
		var POWERUP_ROW_INTERVAL = 20; // Every 20th row has a powerup (was 10)
		// Move first powerup spawn to row 6, and then every POWERUP_ROW_INTERVAL after that
		if (rowCount === 6) {
			shouldSpawnPowerup = true;
			powerupCol = Math.floor(Math.random() * rowWidth);
		} else if (rowCount - 6 > 0 && (rowCount - 6) % POWERUP_ROW_INTERVAL === 0) {
			shouldSpawnPowerup = true;
			powerupCol = Math.floor(Math.random() * rowWidth);
		}
		for (var a = 0; a < rowWidth; a++) {
			var bubble;
			if (shouldSpawnPowerup && a === powerupCol) {
				bubble = new PowerupBubble();
			} else {
				bubble = new Bubble(getMaxTypes());
			}
			bubble.setPos((2048 - bubbleSize * rowWidth) / 2 + bubbleSize * a + bubbleSize / 2, -rowCount * (1.7320508076 * bubbleSize) / 2);
			self.container.addChild(bubble);
			row.push(bubble);
			/*bubble.down = function () {
			var bubbles = self.getConnectedBubbles(this);
			self.removeBubbles(bubbles);
			var disconnected = self.getDetachedBubbles();
			self.removeBubbles(disconnected);
			};*/
		}
		rows.push(row);
		rowCount++;
	}
	//Method that removes an array of bubbles from the rows array. 
	self.removeBubbles = function (bubbles) {
		for (var i = 0; i < bubbles.length; i++) {
			var bubble = bubbles[i];
			if (bubble) {
				var bubbleIndex = this.findBubbleIndex(bubble);
				if (bubbleIndex) {
					rows[bubbleIndex.row][bubbleIndex.col] = null;
					bubble.detach();
				}
			}
		}
	};
	self.getConnectedBubbles = function (bubble, ignoreType) {
		var connectedBubbles = [];
		var queue = [bubble];
		var visited = [];
		while (queue.length > 0) {
			var currentBubble = queue.shift();
			if (visited.indexOf(currentBubble) === -1) {
				visited.push(currentBubble);
				connectedBubbles.push(currentBubble);
				var neighbors = self.getNeighbors(currentBubble);
				for (var i = 0; i < neighbors.length; i++) {
					var neighbor = neighbors[i];
					if (neighbor) {
						if (neighbor.isPowerup) {
							// Powerup bubbles connect with everything
							queue.push(neighbor);
						} else if (neighbor.type === bubble.type || ignoreType) {
							queue.push(neighbor);
						}
					}
				}
			}
		}
		return connectedBubbles;
	};
	//Get a list of bubbles that are not connected to the top row, or to a chain of bubbles connected to the top row.
	self.getDetachedBubbles = function () {
		var detachedBubbles = [];
		var connectedToTop = [];
		// Mark all bubbles connected to the bottom row
		var lastRowIndex = rows.length - 1;
		for (var i = 0; i < rows[lastRowIndex].length; i++) {
			if (rows[lastRowIndex][i] !== null) {
				var bottomConnected = self.getConnectedBubbles(rows[lastRowIndex][i], true);
				connectedToTop = connectedToTop.concat(bottomConnected);
			}
		}
		// Mark all bubbles as visited or not
		var visited = connectedToTop.filter(function (bubble) {
			return bubble != null;
		});
		// Find all bubbles that are not visited and not connected to the top
		for (var row = 0; row < rows.length - 1; row++) {
			for (var col = 0; col < rows[row].length; col++) {
				var bubble = rows[row][col];
				if (bubble !== null && visited.indexOf(bubble) == -1) {
					detachedBubbles.push(bubble);
				}
			}
		}
		return detachedBubbles;
	};
	self.getNeighbors = function (bubble) {
		var neighbors = [];
		var bubbleIndex = this.findBubbleIndex(bubble);
		if (!bubbleIndex) {
			return [];
		}
		var directions = [[-1, 0], [1, 0],
		// left and right
		[0, -1], [0, 1],
		// above and below
		[-1, -1], [1, -1] // diagonals for even rows
		];
		if (bubbleIndex && rows[bubbleIndex.row] && rows[bubbleIndex.row].length == 12) {
			// Adjust diagonals for odd rows
			directions[4] = [-1, 1];
			directions[5] = [1, 1];
		}
		for (var i = 0; i < directions.length; i++) {
			var dir = directions[i];
			if (bubbleIndex && rows[bubbleIndex.row]) {
				var newRow = bubbleIndex.row + dir[0];
			}
			var newCol = bubbleIndex.col + dir[1];
			if (newRow >= 0 && newRow < rows.length && newCol >= 0 && newCol < rows[newRow].length) {
				neighbors.push(rows[newRow][newCol]);
			}
		}
		return neighbors;
	};
	self.findBubbleIndex = function (bubble) {
		for (var row = 0; row < rows.length; row++) {
			var col = rows[row].indexOf(bubble);
			if (col !== -1) {
				return {
					row: row,
					col: col
				};
			}
		}
		return null;
	};
	self.printRowsToConsole = function () {
		var gridString = '';
		for (var i = rows.length - 1; i >= 0; i--) {
			var rowString = ': ' + (rows[i].length == 13 ? '' : '  ');
			for (var j = 0; j < rows[i].length; j++) {
				var bubble = rows[i][j];
				rowString += bubble ? '[' + bubble.type + ']' : '[_]';
			}
			gridString += rowString + '\n';
		}
		console.log(gridString);
	};
	// Method to calculate path of movement based on angle and starting point
	//TODO: MAKE THIS MUCH FASTER!
	self.bubbleIntersectsGrid = function (nextX, nextY) {
		outer: for (var row = 0; row < rows.length; row++) {
			for (var col = 0; col < rows[row].length; col++) {
				var bubble = rows[row][col];
				if (bubble) {
					var dist = nextY - bubble.y - self.y;
					//Quick exit if we are nowhere near the row
					if (dist > 145 || dist < -145) {
						continue outer;
					}
					var dx = nextX - bubble.x - self.x;
					var dy = nextY - bubble.y - self.y;
					var distance = Math.sqrt(dx * dx + dy * dy);
					if (distance < (bubbleSize - 70) / 2 + bubbleSize / 2) {
						return bubble;
					}
				}
			}
		}
		return false;
	};
	self.calculatePath = function (startPoint, angle) {
		var path = [];
		var currentPoint = {
			x: startPoint.x,
			y: startPoint.y
		};
		var radians = angle;
		var stepSize = 4;
		var hitBubble = false;
		while (currentPoint.y > 0 && !hitBubble) {
			// Calculate next point
			var nextX = currentPoint.x + stepSize * Math.cos(radians);
			var nextY = currentPoint.y + stepSize * Math.sin(radians);
			// Check for wall collisions
			if (nextX < 150 / 2 || nextX > 2048 - 150 / 2) {
				radians = Math.PI - radians; // Reflect angle
				nextX = currentPoint.x + stepSize * Math.cos(radians); // Recalculate nextX after reflection
			}
			hitBubble = self.bubbleIntersectsGrid(nextX, nextY);
			// Add point to path and update currentPoint
			path.push({
				x: nextX,
				y: nextY
			});
			currentPoint.x = nextX;
			currentPoint.y = nextY;
		}
		if (hitBubble) {
			//Only increase avilable bubble type when we have actually pointed as such a bubble
			if (hitBubble.type >= 0 && hitBubble.type + 1 > maxSelectableBubble) {
				maxSelectableBubble = hitBubble.type + 1;
			}
			;
		}
		return path;
	};
	var bubblesInFlight = [];
	self.fireBubble = function (bubble, angle) {
		self.addChild(bubble);
		bubble.x = launcher.x;
		bubble.y += launcher.y - self.y;
		bubblesInFlight.push({
			bubble: bubble,
			angle: angle
		});
	};
	self.calculateWarningScoreList = function () {
		var warningScores = [];
		for (var i = 0; i < 13; i++) {
			warningScores.push(0); // Initialize all scores to 0
		}
		// Calculate the distance from the bottom for each bubble and increment the warning score based on proximity
		for (var row = 0; row < rows.length; row++) {
			for (var col = 0; col < rows[row].length; col++) {
				var bubble = rows[row][col];
				if (bubble) {
					var distanceFromBottom = 2732 - (bubble.y + self.y);
					if (distanceFromBottom < 2000) {
						// If a bubble is within 500px from the bottom
						var columnIndex = Math.floor(bubble.x / (2048 / 13));
						warningScores[columnIndex] += (2000 - distanceFromBottom) / 2000; // Increment the warning score for the column
					}
				}
			}
		}
		return warningScores;
	};
	self.update = function () {
		outer: for (var a = 0; a < bubblesInFlight.length; a++) {
			var current = bubblesInFlight[a];
			var bubble = current.bubble;
			var nextX = bubble.x;
			var nextY = bubble.y + gridSpeed;
			var prevX = bubble.x;
			var prevY = bubble.y;
			for (var rep = 0; rep < 25; rep++) {
				prevX = nextX;
				prevY = nextY;
				nextX += Math.cos(current.angle) * 4;
				nextY += Math.sin(current.angle) * 4;
				if (nextX < 150 / 2 || nextX > 2048 - 150 / 2) {
					current.angle = Math.PI - current.angle; // Reflect angle
					nextX = Math.min(Math.max(nextX, 150 / 2), 2048 - 150 / 2);
					LK.getSound('circleBounce').play();
				}
				var intersectedBubble = self.bubbleIntersectsGrid(nextX + self.x, nextY + self.y);
				if (intersectedBubble) {
					gameIsStarted = true;
					if (bubble.isFireBall) {
						self.removeBubbles([intersectedBubble]);
						var disconnected = self.getDetachedBubbles();
						self.removeBubbles(disconnected);
					} else {
						var intersectedBubblePos = self.findBubbleIndex(intersectedBubble);
						var colOffset = rows[intersectedBubblePos.row].length == 13 ? 0 : 1;
						var offsetPositions = [{
							x: intersectedBubble.targetX - bubbleSize / 2,
							y: intersectedBubble.targetY - 1.7320508076 * bubbleSize / 2,
							ro: intersectedBubblePos.row + 1,
							co: intersectedBubblePos.col - 1 + colOffset
						}, {
							x: intersectedBubble.targetX + bubbleSize / 2,
							y: intersectedBubble.targetY - 1.7320508076 * bubbleSize / 2,
							ro: intersectedBubblePos.row + 1,
							co: intersectedBubblePos.col + colOffset
						}, {
							x: intersectedBubble.targetX + bubbleSize,
							y: intersectedBubble.targetY,
							ro: intersectedBubblePos.row,
							co: intersectedBubblePos.col + 1
						}, {
							x: intersectedBubble.targetX + bubbleSize / 2,
							y: intersectedBubble.targetY + 1.7320508076 * bubbleSize / 2,
							ro: intersectedBubblePos.row - 1,
							co: intersectedBubblePos.col + colOffset
						}, {
							x: intersectedBubble.targetX - bubbleSize / 2,
							y: intersectedBubble.targetY + 1.7320508076 * bubbleSize / 2,
							ro: intersectedBubblePos.row - 1,
							co: intersectedBubblePos.col - 1 + colOffset
						}, {
							x: intersectedBubble.targetX - bubbleSize,
							y: intersectedBubble.targetY,
							ro: intersectedBubblePos.row,
							co: intersectedBubblePos.col - 1
						}];
						var closestPosition = 0;
						var closestDistance = Math.sqrt(Math.pow(offsetPositions[0].x - bubble.x, 2) + Math.pow(offsetPositions[0].y - bubble.y, 2));
						for (var i = 1; i < offsetPositions.length; i++) {
							var currentPosition = offsetPositions[i];
							var currentDistance = Math.sqrt(Math.pow(currentPosition.x - bubble.x, 2) + Math.pow(currentPosition.y - bubble.y, 2));
							if (currentDistance < closestDistance) {
								var row = rows[currentPosition.ro];
								if (currentPosition.co < 0) {
									continue;
								}
								if (row) {
									if (row[currentPosition.co]) {
										continue;
									}
									if (currentPosition.co >= row.length) {
										continue;
									}
								} else {
									var newRowLength = rows[intersectedBubblePos.row].length == 13 ? 12 : 13;
									if (currentPosition.co >= newRowLength) {
										continue;
									}
								}
								closestDistance = currentDistance;
								closestPosition = i;
							}
						}
						// Attach bubble to the closest position
						var currentMatch = offsetPositions[closestPosition];
						bubble.x = prevX;
						bubble.y = prevY;
						bubble.targetX = currentMatch.x;
						bubble.targetY = currentMatch.y;
						bubble.isFreeBubble = false;
						var row = rows[offsetPositions[closestPosition].ro];
						if (!row) {
							if (rows[intersectedBubblePos.row].length == 13) {
								row = [null, null, null, null, null, null, null, null, null, null, null, null];
							} else {
								row = [null, null, null, null, null, null, null, null, null, null, null, null, null];
							}
							rows.unshift(row);
						}
						row[offsetPositions[closestPosition].co] = bubble;
						bubblesInFlight.splice(a--, 1);
						refreshHintLine();
						var bubbles = self.getConnectedBubbles(bubble);
						if (bubbles.length > 2) {
							self.removeBubbles(bubbles);
							var disconnected = self.getDetachedBubbles();
							self.removeBubbles(disconnected);
							bonusUX.setStreakCount(bonusUX.streakCount + 1);
						} else {
							bonusUX.setStreakCount(0);
							LK.getSound('attachCircle').play();
						}
						//Add a grid movement effect when you don't do a match
						var neighbors = self.getNeighbors(bubble);
						var touched = [];
						var neighbors2 = [];
						for (var i = 0; i < neighbors.length; i++) {
							var neighbor = neighbors[i];
							if (neighbor) {
								touched.push(neighbor);
								neighbors2 = neighbors2.concat(self.getNeighbors(neighbor));
								var ox = neighbor.x - bubble.x;
								var oy = neighbor.y - bubble.y;
								var angle = Math.atan2(oy, ox);
								neighbor.x += Math.cos(angle) * 20;
								neighbor.y += Math.sin(angle) * 20;
							}
						}
						//One more layer
						for (var i = 0; i < neighbors2.length; i++) {
							var neighbor = neighbors2[i];
							if (neighbor && touched.indexOf(neighbor) == -1) {
								touched.push(neighbor);
								var ox = neighbor.x - bubble.x;
								var oy = neighbor.y - bubble.y;
								var angle = Math.atan2(oy, ox);
								neighbor.x += Math.cos(angle) * 10;
								neighbor.y += Math.sin(angle) * 10;
							}
						}
						//self.printRowsToConsole();
						continue outer;
					}
				}
			}
			bubble.x = nextX;
			bubble.y = nextY;
			if (bubble.y + self.y < -1000) {
				//Destory bubbles that somehow manages to escape at the top
				bubblesInFlight.splice(a--, 1);
				bubble.destroy();
			}
		}
		if (gameIsStarted) {
			self.y += gridSpeed;
		}
		var zeroRow = rows[rows.length - 1];
		if (zeroRow) {
			for (var a = 0; a < zeroRow.length; a++) {
				var bubble = zeroRow[a];
				if (bubble) {
					if (bubble.y + self.y > 0) {
						insertRow();
					}
					break;
				}
			}
		} else {
			insertRow();
		}
		for (var row = rows.length - 1; row >= 0; row--) {
			if (rows[row].every(function (bubble) {
				return !bubble;
			})) {
				rows.splice(row, 1);
			}
		}
		var lastRow = rows[0];
		/*if(LK.ticks % 10 == 0){
			self.printRowsToConsole()
		}*/
		if (lastRow) {
			for (var a = 0; a < zeroRow.length; a++) {
				var bubble = lastRow[a];
				if (bubble) {
					if (bubble.y + self.y > 2200) {
						LK.effects.flashScreen(0xff0000, 3000);
						LK.getSound('gameOverJingle').play();
						LK.showGameOver();
					}
					if (gameIsStarted) {
						var targetSpeed = Math.pow(Math.pow((2200 - (bubble.y + self.y)) / 2200, 2), 2) * 4 + 0.5;
						if (bubble.y + self.y > 2000) {
							targetSpeed = .2;
						}
						gridSpeed += (targetSpeed - gridSpeed) / 20;
						if (LK.ticks % 10 == 0) {
							//console.log(gridSpeed)
						}
					}
					break;
				}
			}
		}
	};
	for (var a = 0; a < 8; a++) {
		insertRow();
	}
});
var HintBubble = Container.expand(function () {
	var self = Container.call(this);
	var bubble = self.attachAsset('hintbubble', {
		anchorX: 0.5,
		anchorY: 0.5
	});
	self.setTint = function (tint) {
		bubble.tint = tint;
	};
	self.getTint = function (tint) {
		return bubble.tint;
	};
});
var Launcher = Container.expand(function () {
	var self = Container.call(this);
	var bubble = self.addChild(new Bubble(getMaxTypes(), false));
	bubble.isFreeBubble = true;
	var previewBubble;
	var lastTypes = [undefined, bubble.type];
	function createPreviewBubble() {
		var nextType;
		do {
			nextType = Math.floor(Math.random() * maxSelectableBubble);
		} while (nextType == lastTypes[0] && nextType == lastTypes[1]);
		lastTypes.shift();
		lastTypes.push(nextType);
		previewBubble = self.addChildAt(new Bubble(maxSelectableBubble, false, nextType), 0);
		previewBubble.scale.set(.7, .7);
		previewBubble.x = -90;
		previewBubble.y = 20;
		previewBubble.isFreeBubble = true;
	}
	createPreviewBubble();
	self.fire = function () {
		bulletsFired++;
		LK.getSound('fireBubble').play(); // Play sound when the ball is fired
		grid.fireBubble(bubble, self.angle);
		bubble = previewBubble;
		previewBubble.x = previewBubble.y = 0;
		previewBubble.scale.set(1, 1);
		createPreviewBubble();
	};
	self.angle = -Math.PI / 2;
	self.getBubble = function () {
		return bubble;
	};
	self.isFireBall = function () {
		return bubble.isFireBall;
	};
	self.triggerFireBall = function () {
		bubble.destroy();
		bubble = self.addChild(new Bubble(getMaxTypes(), true));
		bubble.isFreeBubble = true;
	};
});
var PowerupBubble = Container.expand(function () {
	var self = Container.call(this);
	var bubbleGraphics = self.attachAsset('fireball', {
		anchorX: 0.5,
		anchorY: 0.5
	});
	bubbleGraphics.width = 150;
	bubbleGraphics.height = 150;
	self.type = -1; // Special type for powerup
	self.isPowerup = true;
	self.isAttached = true;
	self.isFreeBubble = false;
	var speedX = 0;
	var speedY = 0;
	self.targetX = 0;
	self.targetY = 0;
	self.setPos = function (x, y) {
		self.x = self.targetX = x;
		self.y = self.targetY = y;
	};
	self.detach = function () {
		freeBubbleLayer.addChild(self);
		LK.getSound('detachCircle').play();
		self.y += grid.y;
		self.isAttached = false;
		speedX = Math.random() * 40 - 20;
		speedY = -Math.random() * 30;
		self.down = undefined;
	};
	var spawnMod = 0;
	self.update = function () {
		if (self.isFreeBubble) {
			return;
		}
		if (self.isAttached) {
			if (self.x != self.targetX) {
				self.x += (self.targetX - self.x) / 10;
			}
			if (self.y != self.targetY) {
				self.y += (self.targetY - self.y) / 10;
			}
		} else {
			self.x += speedX;
			self.y += speedY;
			speedY += 1.5;
			if (self.x < bubbleSize / 2 && speedX < 0 || self.x > game.width - bubbleSize / 2 && speedX > 0) {
				speedX = -speedX;
				LK.getSound('circleBounce').play();
			}
			// Check for collision with barriers
			for (var i = 0; i < barriers.length; i++) {
				var barrier = barriers[i];
				var dx = self.x - barrier.x;
				var dy = self.y - barrier.y;
				var distance = Math.sqrt(dx * dx + dy * dy);
				var minDist = bubbleSize / 2 + barrier.width / 2;
				if (distance < minDist) {
					var angle = Math.atan2(dy, dx);
					var newSpeed = Math.sqrt(speedX * speedX + speedY * speedY);
					speedX = Math.cos(angle) * newSpeed * .7;
					speedY = Math.sin(angle) * newSpeed * .7;
					var overlap = minDist - distance;
					self.x += overlap * Math.cos(angle);
					self.y += overlap * Math.sin(angle);
					LK.getSound('circleBounce').play();
				}
			}
			// When powerup reaches the bottom of the screen, trigger powerup earned animation
			if (self.y > 2732 - 400) {
				// Play sound
				LK.getSound('scoreCollected').play();
				// Create and start powerup earned animation
				var animation = game.addChild(new PowerupEarnedAnimation(self.x, self.y));
				animation.start();
				// Destroy the original bubble
				self.destroy();
			}
		}
	};
});
var PowerupEarnedAnimation = Container.expand(function (startX, startY) {
	var self = Container.call(this);
	// Create a 2x size powerup graphic
	var powerupGraphics = self.attachAsset('fireball', {
		anchorX: 0.5,
		anchorY: 0.5
	});
	// Create dropshadow for earnedText (not a child of self, but a global overlay)
	var earnedTextShadow = new Text2('POWERUP EARNED!', {
		size: 150,
		fill: 0x000000,
		alpha: 0.35,
		font: "Impact"
	});
	earnedTextShadow.anchor.set(0.5, 0.5);
	earnedTextShadow.y = game.height / 2 - 250 + 20 + 100 + 8;
	earnedTextShadow.x = game.width / 2 + 8;
	earnedTextShadow.alpha = 0;
	// Create main earnedText (no stroke)
	var earnedText = new Text2('POWERUP EARNED!', {
		size: 150,
		fill: 0xFFFFFF,
		font: "Impact"
	});
	earnedText.anchor.set(0.5, 0.5);
	powerupGraphics.width = 150;
	powerupGraphics.height = 150;
	earnedText.y = game.height / 2 - 250 + 20 + 100;
	earnedText.x = game.width / 2;
	earnedText.alpha = 0;
	// Set initial position
	self.x = startX;
	self.y = startY;
	// Animation phases
	var phase = 0;
	self.start = function () {
		// Add text and dropshadow to overlay (so it doesn't move with self)
		LK.getSound('powerupSwoosh').play();
		if (!earnedTextShadow.parent) {
			game.addChild(earnedTextShadow);
		}
		if (!earnedText.parent) {
			game.addChild(earnedText);
		}
		// Phase 1: Move to center of screen
		tween(powerupGraphics.scale, {
			x: 2,
			y: 2
		}, {
			duration: 300,
			easing: tween.easeIn
		});
		tween(self, {
			x: game.width / 2,
			y: game.height / 2
		}, {
			duration: 300,
			easing: tween.easeIn
		});
		// Show text and dropshadow
		tween(earnedTextShadow, {
			alpha: 0.35,
			y: game.height / 2 - 250 + 8
		}, {
			duration: 300,
			delay: 100,
			easing: tween.easeOut
		});
		tween(earnedText, {
			alpha: 1,
			y: game.height / 2 - 250
		}, {
			duration: 300,
			delay: 100,
			easing: tween.easeOut,
			onFinish: function onFinish() {
				// Wait a moment before moving to powerup counter
				LK.setTimeout(function () {
					LK.getSound('powerupSwoosh').play();
					// Get target position (powerup counter)
					var targetX = fireBallPowerupOverlay.x;
					var targetY = fireBallPowerupOverlay.y;
					// Phase 2: Move to powerup counter
					tween(self, {
						x: targetX,
						y: targetY
					}, {
						duration: 300,
						easing: tween.easeIn,
						onFinish: function onFinish() {
							LK.getSound('powerupThump').play();
							// Increment powerup counter
							fireBallPowerupOverlay.increaseFireballCount();
							// Destroy animation
							if (earnedTextShadow.parent) {
								earnedTextShadow.parent.removeChild(earnedTextShadow);
							}
							if (earnedText.parent) {
								earnedText.parent.removeChild(earnedText);
							}
							self.destroy();
						}
					});
					// Fade out text and dropshadow as we move
					tween(earnedTextShadow, {
						alpha: 0,
						y: game.height / 2 - 250 - 20 + 8
					}, {
						duration: 300,
						easing: tween.easeOut
					});
					tween(earnedText, {
						alpha: 0,
						y: game.height / 2 - 250 - 20
					}, {
						duration: 300,
						easing: tween.easeOut
					});
					// Scale down as we move to counter
					tween(powerupGraphics, {
						width: 210,
						height: 210
					}, {
						duration: 300,
						easing: tween.easeIn
					});
					tween(powerupGraphics.scale, {
						x: 1,
						y: 1
					}, {
						duration: 300,
						easing: tween.easeIn
					});
				}, 1000);
			}
		});
	};
	return self;
});
// Make active when we have fireballs
var PowerupParticle = Container.expand(function (angle, speed) {
	var self = Container.call(this);
	var particle = self.attachAsset('fireball', {
		anchorX: 0.5,
		anchorY: 0.5
	});
	particle.width = 60;
	particle.height = 60;
	self.scale.set(0.7 + Math.random() * 0.5, 0.7 + Math.random() * 0.5);
	self.alpha = 1;
	var vx = Math.cos(angle) * speed;
	var vy = Math.sin(angle) * speed;
	var gravity = 0.5 + Math.random() * 0.3;
	var life = 24 + Math.floor(Math.random() * 10);
	var tick = 0;
	self.update = function () {
		self.x += vx;
		self.y += vy;
		vy += gravity;
		self.alpha -= 0.04 + Math.random() * 0.01;
		tick++;
		if (tick > life || self.alpha <= 0) {
			self.destroy();
		}
	};
	return self;
});
var ScoreIndicatorLabel = Container.expand(function (score, type) {
	var self = Container.call(this);
	var label = new Text2(score, {
		size: 100,
		fill: "#" + bubbleColors[type].toString(16).padStart(6, '0'),
		font: "Impact"
	});
	label.anchor.set(0.5, 0);
	self.addChild(label);
	self.update = function () {
		self.y -= 7;
		self.alpha -= .05;
		if (self.alpha <= 0) {
			self.destroy();
			increaseScore(score);
		}
	};
});
var ScoreMultipliers = Container.expand(function (baseValue) {
	var self = Container.call(this);
	// Dropshadow for scoreMultiplierLabel
	var scoreMultiplierLabelShadow = new Text2(baseValue, {
		size: 100,
		fill: 0x000000,
		alpha: 0.35,
		font: "Impact"
	});
	scoreMultiplierLabelShadow.anchor.set(0.5, 0);
	self.addChild(scoreMultiplierLabelShadow);
	// Create a score label text string for ScoreMultipliers
	var scoreMultiplierLabel = new Text2(baseValue, {
		size: 100,
		fill: 0x3954FF,
		font: "Impact"
	});
	scoreMultiplierLabel.anchor.set(0.5, 0);
	self.addChild(scoreMultiplierLabel);
	var currentMultiplier = 1;
	self.applyBubble = function (bubble) {
		var scoreIndicator = game.addChild(new ScoreIndicatorLabel(baseValue * currentMultiplier, bubble.type));
		scoreIndicator.x = self.x;
		scoreIndicator.y = self.y;
		var particle = particlesLayer.addChild(new BubbleRemoveParticle());
		particle.x = bubble.x;
		particle.y = self.y + 150;
	};
	self.setMultiplier = function (multiplier) {
		currentMultiplier = multiplier;
		scoreMultiplierLabel.setText(baseValue * currentMultiplier);
		scoreMultiplierLabelShadow.setText(baseValue * currentMultiplier);
	};
});
var WarningLine = Container.expand(function () {
	var self = Container.call(this);
	var warning = self.attachAsset('warningstripe', {
		anchorX: .5,
		anchorY: .5
	});
	var warningOffset = Math.random() * 100;
	var speed = Math.random() * 1 + 1;
	self.update = function () {
		warningOffset += speed;
		warning.alpha = (Math.cos(warningOffset / 50) + 1) / 2 * 0.3 + .7;
	};
	warning.blendMode = 1;
	warning.rotation = .79;
});

/**** 
* Initialize Game
****/
var game = new LK.Game({
	backgroundColor: 0x0c0d25
});

/**** 
* Game Code
****/
var gridSpeed = .5;
function increaseScore(amount) {
	var currentScore = LK.getScore();
	var newScore = currentScore + amount;
	LK.setScore(newScore); // Update the game score using LK method
	scoreLabel.setText(newScore.toString()); // Update the score label with the new score
	scoreLabelShadow.setText(newScore.toString()); // Update the shadow as well
}
//Game size 2048x2732
/* 
Todo: 
[X] Make sure we GC nodes that drop of screen
[ ] Make preview line fade out at the end
*/
var bulletsFired = 0; //3*30+1
var bubbleSize = 150;
var gameIsStarted = false;
var bubbleColors = [0xff2853, 0x44d31f, 0x5252ff, 0xcb2bff, 0x28f2f0, 0xffc411];
var barriers = [];
var maxSelectableBubble = 3;
var warningLines = [];
for (var a = 0; a < 13; a++) {
	var wl = game.addChild(new WarningLine());
	wl.x = 2048 / 13 * (a + .5);
	wl.y = 2200;
	wl.alpha = 0;
	warningLines.push(wl);
	wl.scale.set(16, 40);
}
var warningOverlay = game.attachAsset('dangeroverlay', {});
warningOverlay.y = 2280;
var uxoverlay = game.attachAsset('uxoverlay', {});
uxoverlay.y = 2440;
var uxoverlay2 = game.attachAsset('uxoverlay2', {});
uxoverlay2.y = 2460;
for (var a = 0; a < 4; a++) {
	for (var b = 0; b < 3; b++) {
		var barrier = game.addChild(new Barrier());
		barrier.y = 2732 - 450 + b * 70;
		barrier.x = 2048 / 5 * a + 2048 / 5;
		barriers.push(barrier);
	}
	var barrierBlock = game.attachAsset('barrierblock', {});
	barrierBlock.x = 2048 / 5 * a + 2048 / 5;
	barrierBlock.y = 2732 - 450;
	barrierBlock.anchor.x = .5;
}
// Create a score label dropshadow (offset, semi-transparent)
var scoreLabelShadow = new Text2('0', {
	size: 120,
	fill: 0x000000,
	alpha: 0.35,
	font: "Impact"
});
scoreLabelShadow.anchor.set(0.5, 0);
scoreLabelShadow.x = 4;
scoreLabelShadow.y = 6;
LK.gui.top.addChild(scoreLabelShadow);
// Create a score label (main)
var scoreLabel = new Text2('0', {
	size: 120,
	fill: 0xFFFFFF,
	font: "Impact"
});
scoreLabel.anchor.set(0.5, 0);
scoreLabel.x = 0;
scoreLabel.y = 0;
LK.gui.top.addChild(scoreLabel);
var scoreMultipliers = [];
var baseScores = [100, 250, 500, 250, 100];
for (var a = 0; a < 5; a++) {
	var sm = new ScoreMultipliers(baseScores[a]);
	sm.x = 2048 / 5 * a + 2048 / 10;
	sm.y = 2300;
	scoreMultipliers.push(sm);
	game.addChild(sm);
}
var bonusUX = game.addChild(new BonusUX());
var fireBallPowerupOverlay = game.addChild(new FireBallPowerupOverlay());
var particlesLayer = game.addChild(new Container());
var grid = game.addChild(new Grid());
grid.y = 1000;
var freeBubbleLayer = game.addChild(new Container());
var hintBubblePlayer = game.addChild(new Container());
var launcher = game.addChild(new Launcher());
launcher.x = game.width / 2;
launcher.y = game.height - 138;
var hintBubbleCache = [];
var hintBubbles = [];
var isValid = false;
var path = [];
var bubbleAlpha = 1;
var hintTargetX = game.width / 2;
var hintTargetY = 0;
game.move = function (x, y, obj) {
	hintTargetX = x;
	hintTargetY = y;
	refreshHintLine();
	//	}
};
game.down = game.move;
function getMaxTypes() {
	if (bulletsFired > 30 * 3 * 3) {
		return 6;
	} else if (bulletsFired > 30 * 3) {
		return 5;
	} else if (bulletsFired > 30) {
		return 4;
	}
	return 3;
}
function refreshHintLine() {
	var ox = hintTargetX - launcher.x;
	var oy = hintTargetY - launcher.y;
	var angle = Math.atan2(oy, ox);
	launcher.angle = angle;
	isValid = angle < -.2 && angle > -Math.PI + .2;
	if (isValid) {
		path = grid.calculatePath(launcher, angle);
		//This allows updated faster than 60fps, making everyting feel better.
	}
	renderHintBubbels();
}
var hintOffset = 0;
var distanceBetweenHintbubbles = 100;
function renderHintBubbels() {
	if (isValid) {
		hintOffset = hintOffset % distanceBetweenHintbubbles;
		var distanceSinceLastDot = -hintOffset + 100;
		var hintBubbleOffset = 0;
		var lastPoint = path[0];
		var bubble = launcher.getBubble();
		var tint = bubble.isFireBall ? 0xff9c00 : bubbleColors[bubble.type];
		var updateTint = true;
		for (var a = 1; a < path.length; a++) {
			var p2 = path[a];
			var ox = p2.x - lastPoint.x;
			var oy = p2.y - lastPoint.y;
			var dist = Math.sqrt(ox * ox + oy * oy);
			distanceSinceLastDot += dist;
			if (distanceSinceLastDot >= distanceBetweenHintbubbles) {
				var amountOver = distanceSinceLastDot - distanceBetweenHintbubbles;
				var angle = Math.atan2(oy, ox);
				var currentBubble = hintBubbles[hintBubbleOffset];
				if (!currentBubble) {
					currentBubble = hintBubbles[hintBubbleOffset] = new HintBubble();
					hintBubblePlayer.addChild(currentBubble);
				}
				currentBubble.alpha = bubbleAlpha;
				currentBubble.visible = true;
				var currentTint = currentBubble.getTint();
				if (hintBubbleOffset == 0) {
					currentBubble.setTint(tint);
				} else if (updateTint && currentTint != tint || currentTint == 0xffffff) {
					currentBubble.setTint(tint);
					updateTint = false;
				}
				currentBubble.x = lastPoint.x - Math.cos(angle) * amountOver;
				currentBubble.y = lastPoint.y - Math.sin(angle) * amountOver;
				hintBubbleOffset++;
				distanceSinceLastDot = 0;
				lastPoint = currentBubble;
			} else {
				lastPoint = p2;
			}
		}
		for (var a = hintBubbleOffset; a < hintBubbles.length; a++) {
			hintBubbles[a].visible = false;
		}
	} else {
		for (var a = 0; a < hintBubbles.length; a++) {
			hintBubbles[a].alpha = bubbleAlpha;
		}
	}
}
game.update = function () {
	hintOffset += 5;
	if (isValid) {
		bubbleAlpha = Math.min(bubbleAlpha + .05, 1);
	} else {
		bubbleAlpha = Math.max(bubbleAlpha - .05, 0);
	}
	refreshHintLine();
	var alphaList = grid.calculateWarningScoreList();
	for (var a = 0; a < warningLines.length; a++) {
		var value = alphaList[a] / 3;
		warningLines[a].alpha += (Math.min(value, .6) - warningLines[a].alpha) / 100;
		warningLines[a].scale.y += (value * 60 - warningLines[a].scale.y) / 100;
	}
};
game.up = function () {
	if (isValid) {
		launcher.fire();
	}
};
;
;
;
;
;
;
;
;
;
;