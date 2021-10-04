import Phaser from 'phaser'
import WebFontFile from '../../files/WebFontFile'
import { SceneKeys, ImageKeys, AnimKeys } from '../const/keys'

export default class Preloader extends Phaser.Scene 
{
    animFrameRate: number = 10;
    constructor()
    {
        super(SceneKeys.preloader)
    }

    preload()
    {
        this.load.spritesheet(ImageKeys.sokoban, 'textures/sokoban_tilesheet.png', {
            frameWidth: 64
        });
        this.load.image(ImageKeys.bear, 'textures/bear.png');
        this.load.image(ImageKeys.chicken, 'textures/chicken.png');
        this.load.image(ImageKeys.duck, 'textures/duck.png');
        this.load.image(ImageKeys.gorilla, 'textures/gorilla.png');
        this.load.image(ImageKeys.penguin, 'textures/penguin.png');

        this.load.image('maze', 'maps/maze.png');
        this.load.tilemapTiledJSON('tilemap', 'maps/maze.json');

        this.load.addFile(new WebFontFile(this.load, 'Press Start 2P'))
    }

    create()
    {
        this.anims.create({
            key: AnimKeys.downIdle,
            frames: [{
                key: ImageKeys.sokoban,
                frame: 52
            }]
        })

        this.anims.create({
            key: AnimKeys.downWalk,
            frames: this.anims.generateFrameNumbers(ImageKeys.sokoban, {
                start: 52,
                end: 54
            }),
            frameRate: this.animFrameRate,
            repeat: -1
        })

        // up idle and animation
        this.anims.create({
            key: AnimKeys.upIdle,
            frames: [{
                key: ImageKeys.sokoban,
                frame: 55
            }]
        })

        this.anims.create({
            key: AnimKeys.upWalk,
            frames: this.anims.generateFrameNumbers(ImageKeys.sokoban, {
                start: 55,
                end: 57
            }),
            frameRate: this.animFrameRate,
            repeat: -1
        })
        
        // right idle and animation
        this.anims.create({
            key: AnimKeys.rightIdle,
            frames: [{
                key: ImageKeys.sokoban,
                frame: 78
            }]
        })

        this.anims.create({
            key: AnimKeys.rightWalk,
            frames: this.anims.generateFrameNumbers(ImageKeys.sokoban, {
                start: 78,
                end: 80
            }),
            frameRate: this.animFrameRate,
            repeat: -1
        })

        // left idle and animation
        this.anims.create({
            key: AnimKeys.leftIdle,
            frames: [{
                key: ImageKeys.sokoban,
                frame: 81
            }]
        })

        this.anims.create({
            key: AnimKeys.leftWalk,
            frames: this.anims.generateFrameNumbers(ImageKeys.sokoban, {
                start: 81,
                end: 83
            }),
            frameRate: this.animFrameRate,
            repeat: -1
        })

        //this.scene.start('game')

        this.scene.start('untitledgame')
    }
}