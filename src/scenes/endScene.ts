import Phaser from 'phaser'

export default class EndScene extends Phaser.Scene 
{
    reset?: Phaser.GameObjects.Text
    constructor()
    {
        super('end')
    }

    create()
    {
        const {width, height} = this.scale;
        this.add.text(width*0.5, height*0.5, 'You Win', {
            fontSize: '48px',
            fontFamily: '"Press Start 2P"',
        }).setOrigin(0.5);

        this.reset = this.add.text(width*0.5, height*0.6, 'Press Here to reset', {
            fontSize: '24px',
            fontFamily: '"Press Start 2P"',
        }).setOrigin(0.5);
        this.reset.setInteractive();

        this.reset.on(Phaser.Input.Events.GAMEOBJECT_POINTER_OVER, () => {
            this.reset!.setTint(0xffff00)
        })

        this.reset.on(Phaser.Input.Events.GAMEOBJECT_POINTER_OUT, () => {
            this.reset!.setTint(0xffffff)
        })
    }

}