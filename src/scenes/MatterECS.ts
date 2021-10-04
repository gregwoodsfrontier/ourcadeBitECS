import Phaser from "phaser";
import {
    createWorld,
    addEntity,
    addComponent,
    IWorld,
    pipe,
    removeComponent
} from 'bitecs'

import { Position } from "~/components/Position";
import { Rotation } from "~/components/Rotation";
import { MatterSprite, MatterStaticSprite } from "~/components/MatterSprite";
import { Velocity } from "~/components/Velocity";
import { Player } from "~/components/Player";
import { Input } from "~/components/Input";
import { 
    createMatterSpriteSyncSystem, 
    createMatterSpriteSystem, 
    createMatterPhysicsSystem, 
    createMatterStaticSpriteSystem
} from "~/systems/Matter";
import createPlayerSystem from "~/systems/PlayerSystem";
import createSteerSystem from "~/systems/SteerSystem";


enum Textures {
    TankBlue,
    TankGreen,
    TankRed,
    TreeLarge,
    TreeSmall
}

const textureKeys = [
    'tank-blue',
    'tank-green',
    'tank-red',
    'tree-large',
    'tree-small'
]

export default class MatterECS extends Phaser.Scene
{
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys
    private world?: IWorld
    private pipeline?: (world: IWorld) => void
    private afterPhysicsPipeline?: (world: IWorld) => void

    constructor()
    {
        super('matter-ecs')
    }

    init()
    {
        this.cursors = this.input.keyboard.createCursorKeys();

        const onAfterUpdate = () => {
            if(!this.afterPhysicsPipeline || !this.world)
            {
                return
            }

            this.afterPhysicsPipeline(this.world);
        }

        this.matter.world.on(Phaser.Physics.Matter.Events.AFTER_UPDATE, onAfterUpdate);

        // destroys the update functions
        this.events.on(Phaser.Scenes.Events.SHUTDOWN, () => {
            this.matter.world.off(Phaser.Physics.Matter.Events.AFTER_UPDATE, onAfterUpdate);

        })
    }

    preload()
    {
        this.load.image(textureKeys[Textures.TankBlue], 'images/tank_blue.png')
        this.load.image(textureKeys[Textures.TankGreen], 'images/tank_green.png')
        this.load.image(textureKeys[Textures.TankRed], 'images/tank_red.png')
        this.load.image(textureKeys[Textures.TreeLarge], 'images/treeGreen_large.png')
        this.load.image(textureKeys[Textures.TreeSmall], 'images/treeGreen_small.png')
        console.log('preload finished')
    }

    create()
    {
        // create world
        this.world = createWorld();

        //create entity
        const tank = addEntity(this.world);
        const treeLarge = addEntity(this.world);

        // attach components to entity
        addComponent(this.world, Position, tank);
        addComponent(this.world, Velocity, tank);
        addComponent(this.world, Rotation, tank);
        addComponent(this.world, Player, tank);
        addComponent(this.world, Input, tank);

        addComponent(this.world, Position, treeLarge);
        addComponent(this.world, MatterSprite, treeLarge);
        addComponent(this.world, MatterStaticSprite, treeLarge);

        Position.x[tank] = 200;
        Position.y[tank] = 200;
        Velocity.x[tank] = 0;
        Velocity.y[tank] = 0;
        Rotation.angle[tank] = 0;
        Player[tank] = 0;

        addComponent(this.world, MatterSprite, tank);
        MatterSprite.texture[tank] = Textures.TankBlue;

        Position.x[treeLarge] = 300;
        Position.y[treeLarge] = 500;
        MatterSprite.texture[treeLarge] = Textures.TreeLarge;



        //create systems
        this.pipeline = pipe(
            createMatterSpriteSystem(this.matter, textureKeys),
            createMatterStaticSpriteSystem(),
            createPlayerSystem(this.cursors),
            createSteerSystem(2),
            createMatterPhysicsSystem()
        );

        this.afterPhysicsPipeline = pipe(
            createMatterSpriteSyncSystem()
        )
    }

    update(t: number, dt: number)
    {
        if(!this.world || !this.pipeline)
        {
            return
        }

        this.pipeline(this.world);
    }
}