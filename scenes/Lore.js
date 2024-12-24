import Phaser from "phaser";

export default class LoreScene extends Phaser.Scene {
  constructor() {
    super("lore-scene");
  }

  preload() {}

  create() {
    this.add.image(150, 170, "sky").setScale(1.2);
    this.add.image(450, 170, "sky").setScale(1.2);
    this.add.image(750, 170, "sky").setScale(1.2);
    this.add.image(150, 200, "cloud");
    this.add.image(470, 200, "cloud");
    this.add.image(790, 200, "cloud");
    this.add.image(150, 290, "rock-mountain");
    this.add.image(450, 290, "rock-mountain");
    this.add.image(750, 290, "rock-mountain");
    this.add.image(150, 350, "sky-mountain");
    this.add.image(450, 350, "sky-mountain");
    this.add.image(750, 350, "sky-mountain");
    this.healthElement = document.getElementsByTagName("h1")[0];
    this.borderElement = document.getElementById("app");
    this.healthElement.style.color = "#fff";
    this.borderElement.style.borderColor = "#fff";
    this.add
      .text(50, 50, "All You Need To Do Is Win!", {
        font: "900 35px GameFont", // Font weight, size, and family combined
        fill: "#00250e",
        wordWrap: { width: 500 },
      })
      .setAlign("center");

    this.add.text(50, 125, "Defeat Shapeshifter & Glory Is Yours", {
      font: "900 35px GameFont", // Font weight, size, and family combined
      fill: "#00250e",
      wordWrap: { width: 700 },
    });

    this.add
      .text(50, 200, "Or Die Trying.", {
        font: "900 35px GameFont", // Font weight, size, and family combined
        fill: "#790202",
        wordWrap: { width: 500 },
      })
      .setAlign("center");

    this.add
      .text(600, 350, "Goodluck", {
        font: "900 35px GameFont", // Font weight, size, and family combined
        fill: "#00250e",
        wordWrap: { width: 500 },
      })
      .setAlign("center");

    this.add.image(675, 425, "menu-button").setScale(3, 3.2);

    this.add
      .text(650, 415, "Play", { fontFamily: "GameFont", fontSize: "25px", fill: "#fff" })
      .setInteractive()
      .on("pointerdown", () => {
        this.scene.switch("creator-scene");
      });
  }
}
