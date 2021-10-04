import Phaser from "phaser"
import { ImageKeys } from "../const/keys"
import {
    createWorld,
    addEntity,
    IWorld,
    addComponent,
    System,  
    removeComponent
  } from 'bitecs'

import { Position } from '../components/Position'
import { Velocity } from '../components/Velocity'
import { Sprite } from "../components/Sprite"
import { Player } from "../components/Player"
import { Rotation } from "../components/Rotation"
import { CPU } from "../components/CPU"
import { ArcadeSprite, ArcadeSpriteStatic } from "../components/ArcadeSprite"

//import { createSpriteSystem, spriteByID } from "../systems/SpriteSystem"
import createMovementSystem from "../systems/MovementSystem"
import createPlayerSystem from "../systems/PlayerSystem"
import createCPUSystem from "../systems/CPUSystems"
import { createArcadeSpriteSystem, createArcadeSpriteStaticSystem } from "../systems/SpriteSystem"
import { Input } from "~/components/Input"

//create CPU component
// create CPU system
// run CPU system
//create a bunch of CPU tanks

enum Textures
{
    TankBlue,
    TankGreen,
    TankRed,
    TreeLarge,
    TreeSmall
}

const TextureKeys = [
    'tank-blue',
    'tank-green',
    'tank-red',
    'tree-large',
    'tree-small'
]

enum SceneKeys
{
    bitecs = 'bitecs'
}

export default class BitECSExample extends Phaser.Scene
{
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys
    private world?: IWorld
    private spriteSystem?: System
    private movementSystem?: System
    private playerSystem?: System
    private CPUSystem?: System
    private arcadeSpriteSystem?: System
    private arcadeSpriteStaticSystem?: System
    private IsShown = true

    constructor()
    {
        super(SceneKeys.bitecs)
    }

    init()
    {
        this.cursors = this.input.keyboard.createCursorKeys()
    }

    preload()
    {
        this.load.image(TextureKeys[Textures.TankBlue], 'images/tank_blue.png')
        this.load.image(TextureKeys[Textures.TankGreen], 'images/tank_green.png')
        this.load.image(TextureKeys[Textures.TankRed], 'images/tank_red.png')
        this.load.image(TextureKeys[Textures.TreeLarge], 'images/treeGreen_large.png')
        this.load.image(TextureKeys[Textures.TreeSmall], 'images/treeGreen_small.png')
    }

    create()
    {
        this.world = createWorld()

        // TODO: create entities
        const tank = addEntity(this.world)

        // TODO: attach components
        addComponent(this.world, Position, tank)
        addComponent(this.world, Velocity, tank)
        addComponent(this.world, ArcadeSprite, tank)
        addComponent(this.world, Player, tank)
        addComponent(this.world, Rotation, tank)
        addComponent(this.world, Input, tank)

        // set position of the tank in array
        Position.x[tank] = 400
        Position.y[tank] = 300

        // set velocity of tank in array
        Velocity.x[tank] = 0
        Velocity.y[tank] = 0

        // set rotation of tank
        Rotation.angle[tank] = 0
        
        // set sprite texture index number
        ArcadeSprite.texture[tank] = Textures.TankRed;

        // set player number
        Player.no[tank] = 0

        // create large tree
        const largeTreeArr = [] as number[]

        for (let i = 0; i < 10; i++)
        {
            const a = addEntity(this.world);
            largeTreeArr.push(a);
            addComponent(this.world, Position, a);
            addComponent(this.world, ArcadeSpriteStatic, a);
            ArcadeSpriteStatic.texture[a] = Textures.TreeLarge;
            Position.x[a] = 32;
            Position.y[a] = 32 + i * 64;
        }

        for (let i = 0; i < 10; i++)
        {
            const a = addEntity(this.world);
            largeTreeArr.push(a);
            addComponent(this.world, Position, a);
            addComponent(this.world, ArcadeSpriteStatic, a);
            ArcadeSpriteStatic.texture[a] = Textures.TreeLarge;
            Position.x[a] = 800;
            Position.y[a] = 32 + i * 64;
        }

        for (let i = 0; i < 11; i++)
        {
            const a = addEntity(this.world);
            largeTreeArr.push(a);
            addComponent(this.world, Position, a);
            addComponent(this.world, ArcadeSpriteStatic, a);
            ArcadeSpriteStatic.texture[a] = Textures.TreeLarge;
            Position.x[a] = 96 + i * 64;
            Position.y[a] = 32;
        }

        for (let i = 0; i < 11; i++)
        {
            const a = addEntity(this.world);
            largeTreeArr.push(a);
            addComponent(this.world, Position, a);
            addComponent(this.world, ArcadeSpriteStatic, a);
            ArcadeSpriteStatic.texture[a] = Textures.TreeLarge;
            Position.x[a] = 96 + i * 64;
            Position.y[a] = 607;
        }

        this.generateTanks();

        // create CPU tanks
        // const {width, height} = this.scale
        // for (let i = 0; i < 20; ++i)
        // {
        //     const tank = addEntity(this.world)
        //     addComponent(this.world, Position, tank)
        //     addComponent(this.world, Rotation, tank)
        //     addComponent(this.world, ArcadeSprite, tank)
        //     addComponent(this.world, CPU, tank)
        //     addComponent(this.world, Velocity, tank)
        //     addComponent(this.world, Input, tank)

        //     Position.x[tank] = Phaser.Math.Between(10, 90) / 100 * width
        //     Position.y[tank] = Phaser.Math.Between(10, 90) / 100 * height

        //     Rotation.angle[tank] = Phaser.Math.Between(0,3) * 90

        //     Sprite.texture[tank] = Phaser.Math.Between(1, 2)

        //     //CPU.accumulatedTime[tank] = 0
        //     CPU.timeBetweenActions[tank] = Phaser.Math.Between(0, 500)
        // }

        const spriteGroup = this.physics.add.group();
        const spriteStaticGroup = this.physics.add.staticGroup();

        const textureArray = [
            TextureKeys[Textures.TankBlue],
            TextureKeys[Textures.TankGreen],
            TextureKeys[Textures.TankRed],
            TextureKeys[Textures.TreeLarge],
            TextureKeys[Textures.TreeSmall]
        ];
        
        // TODO: create systems
        //this.spriteSystem = createSpriteSystem(this, [ImageKeys.tankBlue, ImageKeys.tankGreen, ImageKeys.tankRed])
        this.arcadeSpriteSystem = createArcadeSpriteSystem(spriteGroup, textureArray)
        this.movementSystem = createMovementSystem(200)
        this.playerSystem = createPlayerSystem(this.cursors)
        this.arcadeSpriteStaticSystem = createArcadeSpriteStaticSystem(spriteStaticGroup, textureArray)
        this.CPUSystem = createCPUSystem(this)
        
        this.physics.add.collider(spriteGroup, spriteStaticGroup);
        //this.physics.add.collider(spriteGroup, spriteGroup);

    }

    generateTanks()
    {
        const {width, height} = this.scale;
        let tankGroup = [] as number[];
        if(!this.world)
        {
            return
        }
        const components = [Position, Velocity, Rotation, Velocity, ArcadeSprite, CPU, Input]

        for (let i = 0; i < 5; i++)
        {
            tankGroup.push(addEntity(this.world));
            components.forEach(item => {
                if(!this.world)
                {
                    return
                }
                addComponent(this.world, item, tankGroup[i])
            });
            Position.x[tankGroup[i]] = Phaser.Math.Between(width*0.25, width*0.75);
            Position.y[tankGroup[i]] = Phaser.Math.Between(height*0.25, height*0.75);
            Rotation.angle[tankGroup[i]] = Phaser.Math.Between(0,3) * 90;
            ArcadeSprite.texture[tankGroup[i]] = Phaser.Math.Between(0, 1);
            CPU.timeBetweenActions[tankGroup[i]] = Phaser.Math.Between(0, 500);

        }
    }
    

    update(t: number, dt: number)
    {
        if (!this.world || !this.arcadeSpriteSystem)
        {
            return
        }

        // TODO: run systems
        //this.spriteSystem?.(this.world)
        this.playerSystem?.(this.world)
        this.CPUSystem?.(this.world)
        this.movementSystem?.(this.world)

        this.arcadeSpriteSystem?.(this.world)
        this.arcadeSpriteStaticSystem?.(this.world)
        
        
    }

}