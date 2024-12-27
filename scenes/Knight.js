import Phaser from "phaser";
import Timer from "./Timer";
import Respect from "./Respect";

export default class knightScene extends Phaser.Scene {
  constructor() {
    super("knight-scene");
  }

  preload() {}

  create() {
    this.add.image(150, 150, "sky");
    this.add.image(450, 150, "sky");
    this.add.image(750, 150, "sky");
    this.add.image(150, 170, "cloud");
    this.add.image(470, 170, "cloud");
    this.add.image(790, 170, "cloud");
    this.add.image(150, 250, "rock-mountain");
    this.add.image(450, 250, "rock-mountain");
    this.add.image(750, 250, "rock-mountain");
    this.add.image(150, 310, "sky-mountain");
    this.add.image(450, 310, "sky-mountain");
    this.add.image(750, 310, "sky-mountain");
    this.add.image(80, 410, "tree");
    this.add.image(680, 410, "tree").setFlip(true);
    this.add.image(220, 410, "tree");
    this.add.image(550, 410, "tree").setFlip(true);
    let ground1 = this.physics.add.staticImage(100, 530, "ground");
    let ground2 = this.physics.add.staticImage(375, 530, "ground");
    let ground3 = this.physics.add.staticImage(650, 530, "ground");
    let ground4 = this.physics.add.staticImage(800, 530, "ground");

    this.anims.create({
      key: "idle",
      frames: this.anims.generateFrameNumbers("knight-idle", {
        frames: [0, 1, 2, 3, 4, 5, 6],
      }),
      frameRate: 8,
      repeat: -1,
    });

    this.anims.create({
      key: "object",
      frames: this.anims.generateFrameNumbers("objects", {
        frames: [0, 1],
      }),
      frameRate: 8,
      repeat: 0,
    });

    this.anims.create({
      key: "grass",
      frames: this.anims.generateFrameNumbers("vegetation", {
        frames: [0, 1, 2, 3, 4],
      }),
      frameRate: 8,
      repeat: -1,
    });

    this.anims.create({
      key: "rocks",
      frames: this.anims.generateFrameNumbers("vegetation", {
        frames: [15, 16, 17],
      }),
      frameRate: 8,
      repeat: -1,
    });

    this.swordHit = this.sound.add("sword_slash");
    this.soundHurt = this.sound.add("impact");
    this.shield = this.sound.add("shield");

    this.knight = this.physics.add.sprite(100, 400, "knight-idle");
    this.knight.play("idle", true).setScale(1.5);

    this.knight.body.setSize(38, 32);
    this.knight.body.setOffset(34, 30);

    this.enemy = this.physics.add.sprite(700, 400, "knight-idle");
    this.enemy.play("idle", true).setScale(1.5).setFlip(2);

    this.enemy.body.setSize(38, 32);
    this.enemy.body.setOffset(26, 30);

    this.knight.setDrag(0.99);
    this.knight.setMaxVelocity(150);

    this.enemy.setDrag(0.99);
    this.enemy.setMaxVelocity(100);

    this.attackHits = 0;
    this.successfulAttackHits = 0;
    this.knightAccurate = 0;

    this.anims.create({
      key: "walking",
      frames: this.anims.generateFrameNumbers("knight-walking", {
        frames: [0, 1, 2, 3, 4, 5, 6, 7],
      }),
      frameRate: 8,
      repeat: -1,
    });

    this.anims.create({
      key: "jumping",
      frames: this.anims.generateFrameNumbers("knight-jumping", {
        frames: [0, 1, 2, 3, 4],
      }),
      frameRate: 8,
      repeat: -1,
    });

    this.anims.create({
      key: "attack-1",
      frames: this.anims.generateFrameNumbers("knight-attack-1", {
        start: 0,
        end: 5,
      }),
      frameRate: 8,
    });

    this.anims.create({
      key: "attack-2",
      frames: this.anims.generateFrameNumbers("knight-attack-2", {
        start: 0,
        end: 4,
      }),
      frameRate: 8,
    });

    this.anims.create({
      key: "attack-3",
      frames: this.anims.generateFrameNumbers("knight-attack-3", {
        start: 0,
        end: 5,
      }),
      frameRate: 8,
    });

    this.anims.create({
      key: "defend",
      frames: this.anims.generateFrameNumbers("knight-defend", {
        start: 0,
        end: 5,
      }),
      frameRate: 8,
    });

    this.anims.create({
      key: "hurt",
      frames: this.anims.generateFrameNumbers("knight-hurt", {
        start: 0,
        end: 3,
      }),
      frameRate: 8,
    });

    this.anims.create({
      key: "death",
      frames: this.anims.generateFrameNumbers("knight-death", {
        start: 0,
        end: 11,
      }),
      frameRate: 8,
    });

    this.physics.add.collider(
      [this.knight, this.enemy, this.grass, this.rock],
      [ground1, ground2, ground3, ground4]
    );

    this.physics.add.overlap(
      this.knight,
      this.enemy,
      this.knightHitsEnemy,
      null,
      this
    );
    this.physics.add.overlap(
      this.enemy,
      this.knight,
      this.enemyHitsKnight,
      null,
      this
    );

    this.cursors = this.input.keyboard.createCursorKeys();
    this.attackKeys = this.input.keyboard.addKeys({
      One: Phaser.Input.Keyboard.KeyCodes.ONE, 
      Two: Phaser.Input.Keyboard.KeyCodes.TWO, 
      Three: Phaser.Input.Keyboard.KeyCodes.THREE, 
      Four: Phaser.Input.Keyboard.KeyCodes.FOUR,
    });
  
    this.drums = this.sound.add("war-druming", { loop: true, volume: 0.5 });
    this.drums.play();

    this.healthElement = document.getElementsByTagName("h1")[0];
    this.borderElement = document.getElementById("app");

    this.isAttacking = false;
    this.enemyHurt = false;
    this.knightHurt = false;
    this.isEnemyAttacking = false;

    this.knightDefend = false;
    this.enemyDefend = false;

    this.enemyAttackDistance = 70;
    this.enemyWalkDistance = 400;

    this.knightHP = 100;
    this.enemyHP = 100;

    this.knight.isDead = false;
    this.enemy.isDead = false;

    this.attackCooldown = false;
    this.EnemyattackCooldown = false;

    this.add.image(95, 25, "tile-box").setScale(4);
    this.add.image(25, 25, "heart-hp");
    this.knightHPText = this.add.text(45, 18, this.knightHP, {
      fontSize: "20px",
      fontFamily: "GameFont",
      fill: "#fff",
    });

    this.add.image(710, 25, "tile-box").setScale(4).setFlip(true);
    this.add.image(620, 25, "heart-hp");
    this.enemyHPText = this.add.text(640, 18, this.enemyHP, {
      fontSize: "20px",
      fontFamily: "GameFont",
      fill: "#fff",
    });

    this.add.image(400, 22, "tile-box").setScale(5);
    this.respect = new Respect();
    this.respectText = this.add.text(
      280,
      20,
      `Respect: ${this.respect.getValue()}`,
      { fontSize: "20px", fontFamily: "GameFont", fill: "#fff" }
    );

    this.timer = new Timer();
    this.timerText = this.add.text(
      420,
      20,
      `Time: ${this.timer.getTimeLeft()}`,
      { fontSize: "20px", fontFamily: "GameFont", fill: "#fff" }
    );

    this.timer.setCallback((timeLeft) => {
      this.timerText.setText(`Time: ${timeLeft}`);
      if (timeLeft <= 0) {
        this.knightAccurate = (this.successfulAttackHits/this.attackHits)*100;
        console.log("Knight Accurate Hit %: " + this.knightAccurate)
        this.registry.set('knight-accurate', this.knightAccurate); 
        this.scene.start("game-over-scene");
      }
    });

    this.timer.start();
    this.events.on("wake", this.wake, this);
  }

  wake() {
    this.respectText.setText(`Respect: ${this.respect.getValue()}`);
    this.timer.setCallback((timeLeft) => {
      this.timerText.setText(`Time: ${timeLeft}`);
      if (timeLeft <= 0) {
        this.knightAccurate = (this.successfulAttackHits/this.attackHits)*100;
        console.log("Knight Accurate Hit %: " + this.knightAccurate)
        this.registry.set('knight-accurate', this.knightAccurate); 
        this.scene.start("game-over-scene");
      }
    });
  }

  knightHitsEnemy(knight, enemy) {
    if (
      this.isAttacking &&
      !this.enemyHurt &&
      !this.enemyDefend &&
      this.enemyHP > 0 &&
      !this.attackCooldown
    ) {
      this.attackCooldown = true;
      this.enemyHurt = true;
      this.soundHurt.play();
      enemy.play("hurt", true);
      enemy.setTint(0xff0000);

      if (this.knight.x > this.enemy.x) {
        this.enemy.x -= 25;
        this.knight.x += 15;
      } else {
        this.enemy.x += 25;
        this.knight.x -= 15;
      }

      this.enemyHP -= this.calculateDamage();
      this.time.delayedCall(500, () => {
        enemy.clearTint();
        enemy.play("idle", true);
        this.enemyHurt = false;
        this.attackCooldown = false;
        this.soundHurt.stop();
      });
    }
  }

  enemyHitsKnight(enemy, knight) {
    if (
      this.isEnemyAttacking &&
      !this.knightHurt &&
      !this.knightDefend &&
      this.knightHP > 0 &&
      !this.EnemyattackCooldown
    ) {
      this.successfulAttackHits += 1;
      this.EnemyattackCooldown = true;
      this.knightHurt = true;
      knight.play("hurt", true);
      this.soundHurt.play();
      knight.setTint(0xff0000);

      if (this.knight.x > this.enemy.x) {
        this.knight.x += 25;
        this.enemy.x -= 15;
      } else {
        this.knight.x -= 25;
        this.enemy.x += 15;
      }

      this.knightHP -= this.calculateDamage();
      this.time.delayedCall(500, () => {
        knight.clearTint();
        knight.play("idle", true);
        this.knightHurt = false;
        this.EnemyattackCooldown = false;
        this.soundHurt.stop();
      });
    }
  }

  calculateDamage() {
    console.log(this.attackValue);
    if (this.attackValue === 3) {
      return 15;
    } else if (this.attackValue === 2) {
      return 10;
    } else {
      return 5;
    }
  }

  update() {
    if (this.knightHP <= 0 && this.knight.anims.currentAnim.key !== "death") {
      this.knight.isDead = true;
      this.knight.setVelocityX(0);
      this.knight.play("death", true);
      this.knight.once("animationcomplete", (animation) => {
        if (animation.key === "death") {
          console.log("Knight Died");
          this.time.delayedCall(2000, () => {
            this.drums.stop();
            this.knightAccurate = (this.successfulAttackHits/this.attackHits)*100;
            console.log("Knight Accurate Hit %: " + this.knightAccurate)
            this.registry.set('knight-accurate', this.knightAccurate); 
            this.scene.switch("game-over-scene");
          });
        }
      });
    }

    if (this.enemyHP <= 0 && this.enemy.anims.currentAnim.key !== "death") {
      this.enemy.isDead = true;
      this.enemy.setVelocityX(0);
      this.enemy.play("death", true);
      this.enemy.once("animationcomplete", (animation) => {
        if (animation.key === "death") {
          console.log("Enemy Died");
          this.time.delayedCall(2000, () => {
            this.drums.stop();
            this.knightAccurate = (this.successfulAttackHits/this.attackHits)*100;
            console.log("Knight Accurate Hit %: " + this.knightAccurate)
            this.registry.set('knight-accurate', this.knightAccurate); 
            this.scene.switch("game-won-scene");
          });
        }
      });
    }

    if (!this.isAttacking && !this.knightHurt && !this.knightDefend) {
      if (this.cursors.right.isDown) {
        this.knight.setVelocityX(80);
        if (this.knight.anims.currentAnim.key !== "walking") {
          this.knight.play("walking", true);
        }
      } else if (this.cursors.left.isDown) {
        this.knight.setVelocityX(-70);
        if (this.knight.anims.currentAnim.key !== "walking") {
          this.knight.play("walking", true);
        }
      } else {
        this.knight.setVelocityX(0);
        if (
          !this.knight.isDead &&
          !this.enemy.isDead &&
          this.knight.anims.currentAnim.key !== "idle"
        ) {
          this.knight.play("idle", true);
        }
      }

      if (this.attackKeys.One.isDown) {
        this.knightDefend = true;
        if (this.knight.anims.currentAnim.key !== "defend") {
          this.knight.play("defend", true);
          this.shield.play();
        }

        this.knight.off("animationcomplete");

        this.knight.once("animationcomplete", (animation) => {
          if (animation.key === "defend") {
            this.knightDefend = false;
            this.shield.stop();
            this.knight.play("idle", true);
          }
        });
      }

      if (this.attackKeys.Two.isDown) {
        this.knightAttack("attack-3", 3);
      } else if (this.attackKeys.Three.isDown) {
        this.knightAttack("attack-2", 2);
      } else if (this.attackKeys.Four.isDown) {
        this.knightAttack("attack-1", 1);
      }
    }

    const distanceToPlayer = Phaser.Math.Distance.Between(
      this.enemy.x,
      this.enemy.y,
      this.knight.x,
      this.knight.y
    );

    if (
      distanceToPlayer <= this.enemyAttackDistance &&
      !this.isEnemyAttacking &&
      !this.enemyDefend &&
      this.enemyHP > 0
    ) {
      aiChoiceAD.call(this);
    } else if (
      distanceToPlayer <= this.enemyWalkDistance &&
      distanceToPlayer > this.enemyAttackDistance &&
      !this.isEnemyAttacking &&
      !this.enemyDefend &&
      this.knightHP > 0
    ) {
      if (this.knight.x > this.enemy.x) {
        this.enemyMoveLeft();
      } else {
        this.enemyMoveRight();
      }

      if (this.enemy.anims.currentAnim.key !== "walking") {
        this.enemy.play("walking", true);
      }
    } else {
      this.enemy.setVelocityX(0);
      if (
        this.enemy.anims.currentAnim.key !== "idle" &&
        !this.isEnemyAttacking &&
        !this.enemyDefend &&
        !this.enemy.isDead &&
        !this.knight.isDead
      ) {
        this.enemy.play("idle", true);
      }
    }

    this.knightHPText.setText("Knight HP: " + this.knightHP);
    this.enemyHPText.setText("Enemy HP: " + this.enemyHP);

    this.physics.world.wrap(this.knight, 0);
    this.physics.world.wrap(this.enemy, 0);

    if (this.knight.x > this.enemy.x) {
      this.knight.setFlip(true);
      this.enemy.setFlip(false);
      this.knight.body.setOffset(24, 30);
      this.enemy.body.setOffset(34, 30);
    }

    if (this.enemy.x > this.knight.x) {
      this.knight.setFlip(false);
      this.enemy.setFlip(true);
      this.knight.body.setOffset(34, 30);
      this.enemy.body.setOffset(24, 30);
    }

    if (this.cursors.shift.isDown) {
      this.quitToCreator();
    }

    function aiChoiceAD() {
      let current_respect = this.respect.getValue();
      let prob = Phaser.Math.Between(1, 2);
      if (current_respect > 80) {
        if (prob == 1) {
          enemyAction.call(this);
        } else {
          this.enemyAttack1() ||
            this.enemyAttack2() ||
            this.enemyAttack3() ||
            this.enemyDefense();
        }
      } else {
        enemyAction.call(this);
      }
    }

    async function getEnemyAction(gameState) {
      try {
        const response = await fetch("https://ai-backend-xkbh.onrender.com/predict_simple_action", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(gameState),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        if (data && data.action !== undefined) {
          return data.action;
        } else {
          throw new Error("Unexpected response format: 'action' is missing");
        }
      } catch (error) {
        console.error("Error fetching enemy action:", error.message);
        return null;
      }
    }

    async function enemyAction() {
      if (this.enemyHP <= 0 || this.knightHP <= 0) {
        return;
      }

      const gameState = {
        ai_hp: this.enemyHP,
        player_hp: this.knightHP,
        total_distance: Phaser.Math.Distance.Between(
          this.enemy.x,
          this.enemy.y,
          this.knight.x,
          this.knight.y
        ),
        x_distance: this.knight.x - this.enemy.x,
        remaining_time: this.timer.getTimeLeft(),
        is_attacking: this.isAttacking ? 1 : 0,
        knight_defending: this.enemyDefend ? 1 : 0,
      };

      console.log(gameState);

      const action = await getEnemyAction(gameState);

      switch (action) {
        case 0:
          this.enemyAttack1();
          break;
        case 1:
          this.enemyAttack2();
          break;
        case 2:
          this.enemyAttack3();
          break;
        case 3:
          this.enemyDefense();
          break;
        case 4:
          this.enemyMoveLeft();
          break;
        case 5:
          this.enemyMoveRight();
          break;
      }
    }

    if (this.isAttacking && this.isEnemyAttacking) {
      console.warn("Both players are attacking at the same time. Resetting states.");
      this.isAttacking = false;
      this.isEnemyAttacking = false;
    }

    if (this.enemyDefend && this.knightDefend) {
      console.warn("Both players are defending at the same time. Resetting states.");
      this.isAttacking = false;
      this.isEnemyAttacking = false;
    }

    if (this.healthElement && this.borderElement) {
      if (this.knightHP > 60) {
        this.healthElement.style.color = "#25e24e";
        this.borderElement.style.borderColor = "#25e24e"; 
      } else if (this.knightHP > 30) {
        this.healthElement.style.color = "#e0f615";
        this.borderElement.style.borderColor = "#e0f615"; 
      } else {
        this.healthElement.style.color = "#e71e1e";
        this.borderElement.style.borderColor = "#e71e1e"; 
      }
    }
    console.log("Total Distance Between Two: " + distanceToPlayer);
    console.log("X-Axis Distance Between Two: " + (this.knight.x - this.enemy.x));    
  }

  knightAttack(animationKey, attackValue) {
    this.isAttacking = true;
    this.attackValue = attackValue;
    this.knight.play(animationKey, true);
    this.swordHit.play();
    this.knight.off("animationcomplete");
    this.knight.once("animationcomplete", (animation) => {
      if (animation.key === animationKey) {
        this.isAttacking = false;
        this.knight.play("idle", true);
        this.swordHit.stop();
      }
    });
  }

  enemyDefense() {
    if (
      !this.enemyDefend &&
      !this.isEnemyAttacking &&
      this.enemyHP > 0 &&
      this.knightHP > 0
    ) {
      this.enemyDefend = true;
      console.log("Enemy is defending.");

      this.enemy.play("defend", true);
      this.shield.play();
      this.enemy.off("animationcomplete");

      this.enemy.once("animationcomplete", (animation) => {
        if (animation.key === "defend") {
          this.enemyDefend = false;
          console.log("Enemy finished defending.");
          this.shield.stop();
          this.enemy.play("idle", true);
        }
      });
    } else {
      console.log("Enemy is already defending or cannot defend.");
    }
  }

  enemyAttack1() {
    if (
      !this.isEnemyAttacking &&
      !this.enemyDefend &&
      this.enemyHP > 0 &&
      this.knightHP > 0 &&
      !this.knightDefend
    ) {
      this.attackHits += 1;
      this.isEnemyAttacking = true;
      this.attackValue = 1;

      let enemyAttackAnim = "attack-1";

      this.enemy.play(enemyAttackAnim, true);
      this.swordHit.play();

      console.log("Enemy is attacking with " + enemyAttackAnim);

      this.enemy.off("animationcomplete");

      this.enemy.once("animationcomplete", (animation) => {
        if (animation.key === enemyAttackAnim) {
          this.isEnemyAttacking = false;
          console.log("Enemy finished attacking.");
          this.swordHit.stop();
          this.enemy.play("idle", true);
        }
      });
    } else {
      console.log("Enemy is already attacking, defending, or cannot attack.");
    }
  }

  enemyAttack2() {
    if (
      !this.isEnemyAttacking &&
      !this.enemyDefend &&
      this.enemyHP > 0 &&
      this.knightHP > 0 &&
      !this.knightDefend
    ) {
      this.attackHits += 1;
      this.isEnemyAttacking = true;
      this.attackValue = 2;

      let enemyAttackAnim = "attack-2";

      this.enemy.play(enemyAttackAnim, true);
      this.swordHit.play();

      console.log("Enemy is attacking with " + enemyAttackAnim);

      this.enemy.off("animationcomplete");

      this.enemy.once("animationcomplete", (animation) => {
        if (animation.key === enemyAttackAnim) {
          this.isEnemyAttacking = false;
          this.swordHit.stop();
          console.log("Enemy finished attacking.");
          this.enemy.play("idle", true);
        }
      });
    } else {
      console.log("Enemy is already attacking, defending, or cannot attack.");
    }
  }

  enemyAttack3() {
    if (
      !this.isEnemyAttacking &&
      !this.enemyDefend &&
      this.enemyHP > 0 &&
      this.knightHP > 0 &&
      !this.knightDefend
    ) {
      this.attackHits += 1;
      this.isEnemyAttacking = true;
      this.attackValue = 3;

      let enemyAttackAnim = "attack-3";

      this.enemy.play(enemyAttackAnim, true);
      this.swordHit.play();

      console.log("Enemy is attacking with " + enemyAttackAnim);

      this.enemy.off("animationcomplete");

      this.enemy.once("animationcomplete", (animation) => {
        if (animation.key === enemyAttackAnim) {
          this.isEnemyAttacking = false;
          this.swordHit.stop();
          console.log("Enemy finished attacking.");
          this.enemy.play("idle", true);
        }
      });
    } else {
      console.log("Enemy is already attacking, defending, or cannot attack.");
    }
  }

  enemyMoveLeft() {
    let current_respect = this.respect.getValue();
    if (current_respect < 50) {
      this.enemy.setVelocityX(75);
    } else {
      this.enemy.setVelocityX(50);
    }
    this.enemy.setFlip(true);
    this.knight.setFlip(false);
  }

  enemyMoveRight() {
    let current_respect = this.respect.getValue();
    if (current_respect < 50) {
      this.enemy.setVelocityX(-75);
    } else {
      this.enemy.setVelocityX(-50);
    }
    this.enemy.setFlip(true);
    this.knight.setFlip(false);
  }

  quitToCreator() {
    this.shutdown();
    this.respect.decrease(20);
    this.drums.stop();
    this.scene.stop("knight-scene");
    this.scene.switch("creator-scene");
  }

  shutdown() {
    if (this.attackKeys) {
        Object.values(this.attackKeys).forEach((key) => {
            this.input.keyboard.removeKey(key);
        });
    }

    this.input.keyboard.off('keydown-W');
    this.input.keyboard.off('keydown-S');
    this.input.keyboard.off('keydown-A');
    this.input.keyboard.off('keydown-D');
  }

}