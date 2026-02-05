/* =========================================================
   OOP EXERCISES — VIDEO GAME THEME (FILL IN THE BLANK)
   ---------------------------------------------------------
   RULES:
   - Fill in ONLY the blanks marked:  ______
   ========================================================= */


/* =========================
   1) BUILD A BASIC CLASS
   =========================
   GOAL: Create a Hero class with a constructor and 2 properties.
*/
class ________ {
  constructor(______, ______) {
    this.______ = ______;
    this.______ = ______;
  }
}

const h1 = new ________("Aria", 100);
console.log(h1.name, h1.health); // Aria 100


/* =========================
   2) ADD METHODS (INSTANCE METHODS)
   =========================
   GOAL: Add 2 methods:
   - heal(amount): adds amount to health
   - status(): logs "NAME has HEALTH health."
*/
class HeroV2 {
  constructor(name, health) {
    this.name = name;
    this.health = health;
  }

  ______(amount) {
    this.health = this.health + amount;
  }

  ______() {
    console.log(`${this.name} has ${this.health} health.`);
  }
}

const h2 = new HeroV2("Nova", 80);
h2.heal(20);
h2.status(); // Nova has 100 health.


/* =========================
   3) BUILD AN ENEMY CLASS
   =========================
   GOAL: Enemy has:
   - name
   - health
   - power
   AND a method:
   - attack(target): subtracts power from target.health
*/
class Enemy {
  constructor(______, ______, ______) {
    this.name = name;
    this.health = health;
    this.power = power;
  }

  attack(______) {
    target.health = target.health - this.power;
    console.log(`${this.name} attacks ${target.name} for ${this.power} damage!`);
  }
}

const goblin = new Enemy("Goblin", 50, 10);
goblin.attack(h2);
h2.status(); // Nova has 90 health.


/* =========================
   4) ADD A "TAKE DAMAGE" METHOD
   =========================
   GOAL: Add takeDamage(amount) to HeroV3:
   - subtracts amount from health
   - if health goes below 0, set it to 0
*/
class HeroV3 {
  constructor(name, health) {
    this.name = name;
    this.health = health;
  }

  takeDamage(______) {
    this.health = this.health - amount;
    if (this.health < ______) {
      this.health = ______;
    }
  }

  status() {
    console.log(`${this.name} has ${this.health} health.`);
  }
}

const h3 = new HeroV3("Rex", 40);
h3.takeDamage(15);
h3.status(); // Rex has 25 health.
h3.takeDamage(999);
h3.status(); // Rex has 0 health.


/* =========================
   5) ENCAPSULATION WITH PRIVATE FIELDS (#)
   =========================
   GOAL: Create HeroV4 with:
   - private field #health
   - getter health() that returns #health
   - method heal(amount) adds amount to #health
   NOTE: Outside code should use hero.health (getter), NOT hero.#health
*/
class HeroV4 {
  ________ = 0;

  constructor(name, health) {
    this.name = name;
    this.________ = health;
  }

  get ______() {
    return this.________;
  }

  heal(amount) {
    this.________ = this.________ + amount;
  }
}

const h4 = new HeroV4("Mira", 60);
h4.heal(10);
console.log(h4.name, h4.health); // Mira 70


/* =========================
   6) INHERITANCE: EXTENDS + SUPER
   =========================
   GOAL: Create a base class CharacterBase with:
   - name, health
   - status() method
   Then create a child class Mage that extends CharacterBase with:
   - mana
*/
class CharacterBase {
  constructor(______, ______) {
    this.name = name;
    this.health = health;
  }

  status() {
    console.log(`${this.name} has ${this.health} health.`);
  }
}

class Mage extends ________ {
  constructor(name, health, mana) {
    ________(name, health);
    this.mana = mana;
  }
}

const m1 = new Mage("Zane", 70, 50);
m1.status(); // Zane has 70 health.
console.log(m1.mana); // 50


/* =========================
   7) POLYMORPHISM: OVERRIDE A METHOD
   =========================
   GOAL: Warrior extends CharacterBase and OVERRIDES status()
   - Instead of: "NAME has HEALTH health."
   - It logs: "WARRIOR NAME has HEALTH health!"
*/
class Warrior extends CharacterBase {
  ________() {
    console.log(`WARRIOR ${this.name} has ${this.health} health!`);
  }
}

const w1 = new Warrior("Kai", 120);
w1.status(); // WARRIOR Kai has 120 health!


/* =========================
   8) MINI BUILD-UP: HERO VS ENEMY WITH ATTACK
   =========================
   GOAL:
   - Add attack(target) method to HeroV5:
     subtract this.power from target.health
   - Use HeroV5 and EnemyV2 to fight once
*/
class HeroV5 {
  constructor(name, health, power) {
    this.name = name;
    this.health = health;
    this.power = power;
  }

  attack(______) {
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
console.log(enemy.name, enemy.health); // Slime 35


/* =========================
   9) CHALLENGE: CHILD CLASS WITH NEW METHOD
   =========================
   GOAL: Archer extends HeroV5 and adds:
   - arrows (number)
   - shoot(target): uses 1 arrow and deals power + 10 damage
   - if arrows is 0, log "Out of arrows!"
*/
class Archer extends ________ {
  constructor(name, health, power, arrows) {
    ________(name, health, power);
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
