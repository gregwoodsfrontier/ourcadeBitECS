import Phaser from 'phaser'
import { AnimKeys, ImageKeys, SceneKeys } from '../const/keys'
import WebFontFile from '~/../files/WebFontFile'

export default class UntitledGame extends Phaser.Scene
{
    tilesetName = "sokobanMaze";
    wallLayer?: Phaser.Tilemaps.TilemapLayer
    boxLayer?: Phaser.Tilemaps.TilemapLayer
    cursors?: Phaser.Types.Input.Keyboard.CursorKeys
    player?: Phaser.Physics.Arcade.Sprite
    shadow?: Phaser.Physics.Arcade.Sprite
    box?: Phaser.Physics.Arcade.Sprite
    boxGroup?: Phaser.Physics.Arcade.Group

    constructor()
    {
        super('untitledgame')
    }

    init()
    {
        this.cursors = this.input.keyboard.createCursorKeys();
    }

    preload()
    {
        //this.load.image('maze', 'maps/maze.png');
        //this.load.tilemapTiledJSON('tilemap', 'maps/maze.json');
        this.load.image('sokoban1', 'maps/sokoban_tileset.png');
    }

    create()
    {
        //this.add.image(0, 0, 'maze').setOrigin(0,0);

        const map = this.make.tilemap({
            key: 'tilemap',
            tileWidth: 64,
            tileHeight: 64
        });

        const tileset = map.addTilesetImage(this.tilesetName, 'sokoban1');

        this.wallLayer = map.createLayer('wall', tileset).setDepth(3);
        //this.boxLayer = map.createLayer('boxes', tileset).setDepth(3);
        map.createLayer('floor1', tileset).setDepth(0);
        map.createLayer('floor2', tileset).setDepth(0);
        map.createLayer('start', tileset).setDepth(1);
        map.createLayer('end', tileset).setDepth(1);

        this.wallLayer.setCollisionByProperty({
            collides: true
        });

        /* this.boxLayer.setCollisionByProperty({
            collides: true
        }) */

        const { width, height } = this.scale;
        this.player = this.physics.add.sprite(96, 96, ImageKeys.sokoban, 52)
        .setSize(40, 24)
        .setOffset(12, 32);
        this.player.play(AnimKeys.downIdle);
        this.player.setDepth(5);

        this.shadow = this.physics.add.sprite(width - 96, 96, ImageKeys.sokoban, 52)
        .setSize(40, 24)
        .setOffset(12, 32);
        this.shadow.setTint(0x4B4242);
        this.shadow.play(AnimKeys.downIdle);
        this.shadow.setDepth(5);

        //this.debugColor();

        this.boxGroup = this.physics.add.group();
        this.boxGroup.setDepth(3);
        this.createBoxes();
        //this.box = this.physics.add.sprite(64*4.5, 64*4.5, ImageKeys.sokoban, 6).setDepth(3);
        
       // this.collisionHandler();
               
        this.physics.add.collider(this.player, this.wallLayer);
        this.physics.add.collider(this.shadow, this.wallLayer);

        this.physics.add.collider(this.boxGroup, this.wallLayer, () => {
            console.log('box collide with wall')    
        })

        console.log(this.boxGroup)
        this.physics.add.collider(this.player, this.boxGroup, (p, b) => {
            const box = b as Phaser.Physics.Arcade.Sprite;
            //box.setVelocity(0);
            
        });

        //this.physics.add.collider(this.player, this.boxLayer);
        //this.physics.add.collider(this.shadow, this.boxLayer);

        //this.physics.add.collider(this.boxLayer, this.wallLayer);
        //this.physics.add.collider(this.player, this.boxGroup);

        //this.wallLayer.renderDebug(this.add.graphics().setDepth(4));

        const debugGraphics = this.add.graphics().setAlpha(0.75).setDepth(4);
        this.wallLayer.renderDebug(debugGraphics, {
            tileColor: null,
            collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255),
            faceColor: new Phaser.Display.Color(40, 39, 37, 255),
        })

    }

    private handlePlayerBoxCollision(player: Phaser.Physics.Arcade.Sprite, box: Phaser.Physics.Arcade.Sprite)
    {
        if (player.body.x > box.body.x)
        {
            box.body.x = player.body.x - 64;
            box.setVelocity(0,0);
        }
        else if (player.body.x < box.body.x)
        {
            box.body.x = player.body.x + 64;
            box.setVelocity(0,0);
        }

        /* if (player.body.y > box.body.y)
        {
            box.body.y = player.body.y - 64;
            box.setVelocity(0,0);
        }
        else if (player.body.y < box.body.y)
        {
            box.body.y = player.body.y + 64;
            box.setVelocity(0,0);
        } */
    }

    private createBoxes()
    {
        const { width } = this.scale;

        this.boxGroup!.get(64*4.5, 64*4.5, ImageKeys.sokoban, 6);
        this.boxGroup!.get(64*9.5, 64*4.5, ImageKeys.sokoban, 6);
        
    }

    private debugColor()
    {
        const debugGraphics = this.add.graphics().setAlpha(0.75);
        this.wallLayer!.renderDebug(debugGraphics, {
            tileColor: null,
            collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255),
            faceColor: new Phaser.Display.Color(40, 39, 37, 255),
        })
    }

    update()
    {
        this.updatePlayerAndShadow();

    }

    private updatePlayerAndShadow()
    {
        const speed = 200;

        if(!this.player!.active)
        {
            return
        }

        if (this.cursors?.left.isDown) 
        {
            this.player?.setVelocity(-speed, 0);
            this.player?.play(AnimKeys.leftWalk, true);
            this.shadow?.setVelocity(speed, 0);
            this.shadow?.play(AnimKeys.rightWalk, true);
        }
        else if (this.cursors?.right.isDown)
        {
            this.player?.setVelocity(speed, 0);
            this.player?.play(AnimKeys.rightWalk, true);
            this.shadow?.setVelocity(-speed, 0);
            this.shadow?.play(AnimKeys.leftWalk, true);
        }
        else if (this.cursors?.up.isDown) 
        {
            this.player?.setVelocity(0, -speed);
            this.player?.play(AnimKeys.upWalk, true);
            this.shadow?.setVelocity(0, -speed);
            this.shadow!.play(AnimKeys.upWalk, true);
        }
        else if (this.cursors?.down.isDown)
        {
            this.player?.setVelocity(0, speed);
            this.player?.play(AnimKeys.downWalk, true);
            this.shadow?.setVelocity(0, speed);
            this.shadow!.play(AnimKeys.downWalk, true);
        }
        else
        {
            this.player?.setVelocity(0, 0);
            const key = this.player?.anims.currentAnim.key as string
            const parts = key?.split('-') as string[]
            const direction = parts[0]
            this.player?.play(`${direction}-idle`);

            this.shadow?.setVelocity(0, 0);
            const Skey = this.shadow?.anims.currentAnim.key as string
            const Sparts = Skey?.split('-') as string[]
            const Sdirection = Sparts[0]
            this.shadow?.play(`${Sdirection}-idle`);
        }

    }

}