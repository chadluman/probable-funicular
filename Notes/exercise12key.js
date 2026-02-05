/* =========================================================
   ANSWER KEY — VIDEO GAME OOP (FILLED IN)
   ========================================================= */

/* 1 */
class Hero {
  constructor(name, health) {
    this.name = name;
    this.health = health;
  }
}
const h1 = new Hero("Aria", 100);
console.log(h1.name, h1.health);

/* 2 */
class HeroV2 {
  constructor(name, health) {
    this.name = name;
    this.health = health;
  }

  heal(amount) {
    this.health = this.health + amount;
  }

  status() {
    console.log(`${this.name} has ${this.health} health.`);
  }
}
const h2 = new HeroV2("Nova", 80);
h2.heal(20);
h2.status();

/* 3 */
class Enemy {
  constructor(name, health, power) {
    this.name = name;
    this.health = health;
    this.power = power;
  }

  attack(target) {
    target.health = target.health - this.power;
    console.log(`${this.name} attacks ${target.name} for ${this.power} damage!`);
  }
}
const goblin = new Enemy("Goblin", 50, 10);
goblin.attack(h2);
h2.status();

/* 4 */
class HeroV3 {
  constructor(name, health) {
    this.name = name;
    this.health = health;
  }

  takeDamage(amount) {
    this.health = this.health - amount;
    if (this.health < 0) {
      this.health = 0;
    }
  }

  status() {
    console.log(`${this.name} has ${this.health} health.`);
  }
}
const h3 = new HeroV3("Rex", 40);
h3.takeDamage(15);
h3.status();
h3.takeDamage(999);
h3.status();

/* 5 */
class HeroV4 {
  #health = 0;

  constructor(name, health) {
    this.name = name;
    this.#health = health;
  }

  get health() {
    return this.#health;
  }

  heal(amount) {
    this.#health = this.#health + amount;
  }
}
const h4 = new HeroV4("Mira", 60);
h4.heal(10);
console.log(h4.name, h4.health);

/* 6 */
class CharacterBase {
  constructor(name, health) {
    this.name = name;
    this.health = health;
  }

  status() {
    console.log(`${this.name} has ${this.health} health.`);
  }
}

class Mage extends CharacterBase {
  constructor(name, health, mana) {
    super(name, health);
    this.mana = mana;
  }
}
const m1 = new Mage("Zane", 70, 50);
m1.status();
console.log(m1.mana);

/* 7 */
class Warrior extends CharacterBase {
  status() {
    console.log(`WARRIOR ${this.name} has ${this.health} health!`);
  }
}
const w1 = new Warrior("Kai", 120);
w1.status();

/* 8 */
class HeroV5 {
  constructor(name, health, power) {
    this.name = name;
    this.health = health;
    this.power = power;
  }

  attack(target) {
    target.health = target.health - this.power;
    console.log(`${this.name} hits ${target.name} for ${this.power}!`);
  }
}

class EnemyV2 {
  constructor(name, health, power) {
    this.name = name;
    this.health = health;
    this.power = power;
  }

  attack(target) {
    target.health = target.health - this.power;
    console.log(`${this.name} hits ${target.name} for ${this.power}!`);
  }
}

const hero = new HeroV5("Luna", 100, 25);
const enemy = new EnemyV2("Slime", 60, 5);
hero.attack(enemy);
console.log(enemy.name, enemy.health);

/* 9 */
class Archer extends HeroV5 {
  constructor(name, health, power, arrows) {
    super(name, health, power);
    this.arrows = arrows;
  }

  shoot(target) {
    if (this.arrows === 0) {
      console.log("Out of arrows!");
      return;
    }
    this.arrows = this.arrows - 1;
    target.health = target.health - (this.power + 10);
    console.log(`${this.name} shoots ${target.name}!`);
  }
}

const a1 = new Archer("Ezra", 90, 15, 2);
const e2 = new EnemyV2("Orc", 80, 12);

a1.shoot(e2);
console.log("Orc health:", e2.health);
console.log("Arrows left:", a1.arrows);
