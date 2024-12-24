import Phaser from 'phaser'
import LoaderScene from './scenes/LoaderScene'
import MenuScene from './scenes/menu'
import LoreScene from './scenes/Lore'
import knightScene from './scenes/Knight'
import devilScene from './scenes/Devil'
import GameOverScene from './scenes/GameOver'
import GameWonScene from './scenes/GameWon'
import Strategy from './scenes/Strategy'
import Trivia from './scenes/Trivia'
import CreatorScene from './scenes/Center'
import StatisticScene from './scenes/Stat'

const font = new FontFace("GameFont", "url(assets/MinimalPixel.ttf)");
font.load().then(() => {
    document.fonts.add(font);
    const config = {
      type: Phaser.AUTO,
      width: 800,
      height: 500,
      pixelArt: true,
      physics: {
        default: 'arcade',
        arcade: {
          gravity: {
            y: 100
          },
          debug: false,
        }
      },
      scene: [
        LoaderScene,
        MenuScene,
        LoreScene,
        CreatorScene,
        knightScene,
        devilScene,
        Strategy,
        Trivia,
        GameWonScene,
        GameOverScene,
        StatisticScene
      ],
      dom: {
        createContainer: true
      },
      parent: 'app',
    }
    const game = new Phaser.Game(config);
  });    