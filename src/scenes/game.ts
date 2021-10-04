import Phaser from 'phaser'
import { AnimKeys, ImageKeys, SceneKeys } from '../const/keys'
import CountdownController from './countdownController'

const level = [
    [4, 1, 2],
    [1, 2, 3],
    [3, 4, 0]
]
export default class Game extends Phaser.Scene 
{
    player?: Phaser.Physics.Arcade.Sprite
    cursors?: Phaser.Types.Input.Keyboard.CursorKeys
    boxGroup?: Phaser.Physics.Arcade.StaticGroup;
    itemGroup?: Phaser.GameObjects.Group;
    activeBox?: Phaser.Physics.Arcade.Sprite;
    selectedBoxes: { box: Phaser.Physics.Arcade.Sprite, item: Phaser.GameObjects.Sprite }[] = [];
    matchesCount: number = 0;
    totalMatches: number = 4;
    countDown?: CountdownController;

    constructor()
    {
        super(SceneKeys.game)
    }

    init()
    {
        this.cursors = this.input.keyboard.createCursorKeys();
    }

    preload()
    {

    }

    create()
    {
        const { width, height } = this.scale;
        this.player = this.physics.add.sprite(width * 0.5, height * 0.6, ImageKeys.sokoban, 52)
        .setSize(40, 16)
        .setOffset(12, 32);
        this.player.play(AnimKeys.downIdle)

        this.boxGroup = this.physics.add.staticGroup();        
        this.createBoxes();

        const timeLabel = this.add.text(width * 0.5, height/12, '45', {
            fontSize: '48px',
            fontFamily: '"Press Start 2P"',
        }).setOrigin(0.5);

        this.countDown = new CountdownController(this, timeLabel);
        this.countDown.start(this.handleCountdownFinished.bind(this));

        this.itemGroup = this.add.group();

        //@ts-ignore
        this.physics.add.collider(this.player, this.boxGroup, this.handlePlayerBoxCollide, undefined, this);
    }

    handleCountdownFinished()
    {
        this.player!.active = false;
        const { width, height } = this.scale;
        this.add.text(width * 0.5, height * 0.5, 'You Lose', {
            fontSize: '48px',
            fontFamily: '"Press Start 2P"',
        })
    }

    handlePlayerBoxCollide(player: Phaser.Physics.Arcade.Sprite, box: Phaser.Physics.Arcade.Sprite)
    {
        if (box.getData('opened'))
        {
            return
        }

        if (this.activeBox)
        {
            return
        }

        this.activeBox = box

        this.activeBox.setFrame(9)
    }

    openBox(box: Phaser.Physics.Arcade.Sprite)
    {
        if (!box)
        {
            return
        }

        const itemType = box.getData('itemType');

        console.log(itemType);

        let item: Phaser.GameObjects.Sprite

        switch(itemType)
        {
            case 0:
                item = this.itemGroup?.get(box.x, box.y);
                item.setTexture(ImageKeys.bear);
                break
            case 1:
                item = this.itemGroup?.get(box.x, box.y);
                item.setTexture(ImageKeys.chicken);
                break
            case 2:
                item = this.itemGroup?.get(box.x, box.y);
                item.setTexture(ImageKeys.duck);
                break
            case 3:
                item = this.itemGroup?.get(box.x, box.y);
                item.setTexture(ImageKeys.gorilla);
                break
            case 4:
                item = this.itemGroup?.get(box.x, box.y);
                item.setTexture(ImageKeys.penguin);
                break
        }

        //@ts-ignore
        if (!item)
        {
            return
        }

        box.setData('opened', true);

        item.setData('sorted', true);        
        item.setDepth(2000);

        item.alpha = 0;
        item.scale = 0;

        this.selectedBoxes.push({box, item});

        this.tweens.add({
            targets: item,
            y: '-=50',
            alpha: 1,
            scale: 0.5,
            duration: 500,
            onComplete: () => {
                if (itemType === 0)
                {
                    this.handleBearSelected();
                    return
                }

                if(this.selectedBoxes.length < 2)
                {
                    return
                }

                this.checkForMatch();
            }
        })

        this.activeBox = undefined;
    }

    handleBearSelected()
    {
        //@ts-ignore
        const  { box, item } = this.selectedBoxes.pop();

        item.setTint(0xff0000);
        box.setFrame(7);
        
        this.player!.active = false;
        this.player!.setVelocity(0, 0);

        this.time.delayedCall(1000, () => {
            item.setTint(0xffffff);
            box.setFrame(10);
            box.setData('opened', false);

            this.tweens.add({
                targets: item,
                y: '+=50',
                alpha: 0,
                scale: 0,
                duration: 300,
                onComplete: () => {
                    this.player!.active = true
                }
            })
        })
    }

    checkForMatch()
    {
        const second = this.selectedBoxes.pop();
        const first = this.selectedBoxes.pop();

        if (first!.item.texture !== second!.item.texture)
        {
            this.player!.active = false;
            this.player!.setVelocity(0, 0);

            this.tweens.add({
                targets: [first!.item, second!.item],
                y: '+=50',
                alpha: 0,
                scale: 0,
                delay: 1000,
                duration: 300,
                onComplete: () => {
                    first!.box.setData('opened', false);
                    first!.box.setFrame(10);

                    second!.box.setData('opened', false);
                    second!.box.setFrame(10);

                    this.player!.active = true
                }
            })
            return
        }

        ++this.matchesCount;

        this.time.delayedCall(1000, () => {
            first!.box.setFrame(8);
            second!.box.setFrame(8);

            
            if (this.matchesCount >= this.totalMatches)
            {
                // game won
                this.countDown!.stop();
                
                this.player!.active = false;
                this.player!.setVelocity(0, 0);
                this.scene.run('end');

                
            }
        })

        
    }

    updatePlayer()
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
        }
        else if (this.cursors?.right.isDown)
        {
            this.player?.setVelocity(speed, 0);
            this.player?.play(AnimKeys.rightWalk, true);
        }
        else if (this.cursors?.up.isDown) 
        {
            this.player?.setVelocity(0, -speed);
            this.player?.play(AnimKeys.upWalk, true);
        }
        else if (this.cursors?.down.isDown)
        {
            this.player?.setVelocity(0, speed);
            this.player?.play(AnimKeys.downWalk, true);
        }
        else
        {
            this.player?.setVelocity(0, 0);
            const key = this.player?.anims.currentAnim.key as string
            const parts = key?.split('-') as string[]
            const direction = parts[0]
            this.player?.play(`${direction}-idle`)
        }

        const spaceJustPressed = Phaser.Input.Keyboard.JustUp(this.cursors!.space)

        if (spaceJustPressed && this.activeBox)
        {
            this.openBox(this.activeBox!);
        }
    }

    updateActiveBox()
    {
        if (!this.activeBox)
        {
            return
        }

        const distance = Phaser.Math.Distance.Between(
            this.player!.x, this.player!.y,
            this.activeBox.x, this.activeBox.y
        );

        if (distance < 64)
        {
            return
        }

        this.activeBox.setFrame(10)
        this.activeBox = undefined;
    }

    createBoxes()
    {
        const width = this.scale.width
        let xPer = 0.25;
        let y = 150;
        for (let row = 0; row < level.length; row++)
        {
            for (let col = 0; col < level[row].length; col++)
            {
                const box = this.boxGroup!.get(width * xPer, y, ImageKeys.sokoban, 10) as Phaser.Physics.Arcade.Sprite;
                box.setSize(64, 32);
                box.setOffset(0, 32);
                box.setData('itemType', level[row][col]);
                
                xPer += 0.25;
            }
            xPer = 0.25;
            y += 150;
        }
    }

    update()
    {
        this.updatePlayer();

        this.updateActiveBox();

        this.children.each(c => {
            const child = c as Phaser.Physics.Arcade.Sprite

            if (child.getData('sorted'))
            {
                return
            }

            child.setDepth(child.y)
        })

        this.countDown!.update();
    }
}