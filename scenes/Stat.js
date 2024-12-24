import Phaser from 'phaser'

export default class StatisticScene extends Phaser.Scene {

  constructor() {
    super('stastic-scene')
  }

  preload() {
  }

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
    const menuBox = this.add.image(400, 250, 'menu-box').setScale(4, 4.4);
    let knightAccuracy = this.registry.get('knight-accurate') || 0;
    let devilAccuracy = this.registry.get('devil-accurate') || 0;
    let wizardAccuracy = this.registry.get('wizard-accurate') || 0;
    const menuText = this.add.text(290, 125, "Statistic", {fontFamily: "GameFont", fontSize: "50px"})
    const startText = this.add.text(300, 225, "K-AI: " + knightAccuracy.toFixed(1) + "%", {fontFamily: "GameFont", fontSize: "30px"})
    const aboutText = this.add.text(300, 275, "D-AI: " + devilAccuracy.toFixed(1) + "%", {fontFamily: "GameFont", fontSize: "30px"})
    const otherText = this.add.text(300, 325, "W-AI: " + wizardAccuracy.toFixed(1) + "%", {fontFamily: "GameFont", fontSize: "30px"})
    this.healthElement = document.getElementsByTagName("h1")[0];
    this.borderElement = document.getElementById("app");
    this.healthElement.style.color = "#fff";
    this.borderElement.style.borderColor = "#fff";
  }
}