"use strict";

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
let lastDrawn;
let key;
let food;
let asteroids = [];
let dead = false;
let score = 0;

function onKeyDown(e) {
	key = e.code;
}

document.addEventListener("keydown", onKeyDown);

function keyPressed() {
	const args = arguments;
	return Array.from(args).map(x => {
		return key == x;
	}).includes(true);
}

class Cell {
	constructor(x, y, w, h, c) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		this.c = c;
	}

	draw() {
		ctx.fillStyle = this.c;
		ctx.fillRect(this.x, this.y, this.w, this.h);
	};

	left(p) {
		if (this.x > 0) this.x -= p;
	}

	right(p) {
		if (this.x < 700 - this.w) this.x += p;
	}

	up(p) {
		if (this.y > 0) this.y -= p;
	}

	down(p) {
		if (this.y < 400 - this.h) this.y += p;
	}
}

const cell = new Cell(0, 195, 10, 10, "white");

class Food {
	constructor(x, y, w, h, c) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		this.c = c;
	}

	draw() {
		ctx.fillStyle = this.c;
		ctx.fillRect(this.x, this.y, this.w, this.h);
		if (this.x > cell.x - this.w && this.x < cell.x + cell.w && this.y > cell.y - this.h && this.y < cell.y + cell.h) {
			cell.w += 2;
			cell.h += 2;
			cell.x--;
			cell.y--;
			food = new Food(Math.random() * 690, Math.random() * 390, 10, 10, "gray");
		}
	}
}

food = new Food(Math.random() * 690, Math.random() * 390, 10, 10, "gray");

class Asteroid {
	constructor(x, y, w, h, c) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		this.c = c;
	}

	draw(p) {
		this.x -= p * .25;
		ctx.fillStyle = this.c;
		ctx.fillRect(this.x, this.y, this.w, this.h);
		if (this.x > cell.x - this.w && this.x < cell.x + cell.w && this.y > cell.y - this.h && this.y < cell.y + cell.h) {
			cell.w -= 10;
			cell.h -= 10;
			cell.x += 5;
			cell.y += 5;
			asteroids.forEach((item, index, object) => {
				if (item == this) {
					object.splice(index, 1);
				}
			});
		}
		if (this.x < -this.w) {
			asteroids.shift();
		}
	}
}

setInterval(() => {
	asteroids.push(new Asteroid(710, Math.random() * 390, 10, 10, "red"));
}, 250);

function die() {
	if (dead) return;
	alert("Cell died! :(");
	location.reload();
	dead = true;
}

function draw(now) {
	if (!lastDrawn) lastDrawn = now;
	const delta = now - lastDrawn;
	ctx.clearRect(0, 0, 700, 400);

	if (cell.w <= 5) {
		die();
	}

	if (score < cell.w) score = cell.w;

	if (keyPressed("KeyA", "ArrowLeft")) {
		cell.left(delta * .1);
	}
	if (keyPressed("KeyD", "ArrowRight")) {
		cell.right(delta * .1);
	}
	if (keyPressed("KeyW", "ArrowUp")) {
		cell.up(delta * .1);
	}
	if (keyPressed("KeyS", "ArrowDown")) {
		cell.down(delta * .1);
	}

	cell.draw();
	food.draw();
	asteroids.forEach(asteroid => {
		asteroid.draw(delta);
	});

	ctx.fillStyle = "white";
	ctx.fillText(`Score: ${score}`, 10, 20, 50);

	lastDrawn = now;
	requestAnimationFrame(draw);
}

requestAnimationFrame(draw);