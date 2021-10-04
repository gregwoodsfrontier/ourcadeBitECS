import {    
    defineQuery,
    enterQuery,
    exitQuery,   
    defineSystem
  } from 'bitecs'

import { ArcadeSprite, ArcadeSpriteStatic } from '../components/ArcadeSprite'
import { Position } from '../components/Position'
import { Rotation } from '../components/Rotation'
import { Sprite } from '../components/Sprite'
import { Velocity } from '../components/Velocity'

export const spriteByID = new Map<number, Phaser.GameObjects.Sprite>()

export const createArcadeSpriteStaticSystem = (group: Phaser.Physics.Arcade.StaticGroup, textures: string[]) => {
    const spriteQuery = defineQuery([Position, ArcadeSpriteStatic])
    const spriteQueryEnter = enterQuery(spriteQuery)
    const spriteQueryExit = exitQuery(spriteQuery)
    const spriteByID = new Map<number, Phaser.Physics.Arcade.Sprite>()

    return defineSystem(world => {
        const enterEntities = spriteQueryEnter(world)
        enterEntities.forEach((id) => {
            // matching to tank
            const textid = ArcadeSpriteStatic.texture[id]
            const texture = textures[textid]

            const sprite = group.get(Position.x[id], Position.y[id], texture);

            spriteByID.set(id, sprite)
        })

        // add the entity to our scene
        const entities = spriteQuery(world)
        entities.forEach(id => {
            const sprite = spriteByID.get(id)

            if (!sprite)
            {
                return
            }

            sprite.setPosition(Position.x[id], Position.y[id])
        })

        // exit the entity from our sprite
        const exitEntities = spriteQueryExit(world)
        exitEntities.forEach(id => {
            const sprite = spriteByID.get(id)

            if (!sprite)
            {
                return
            }

            // do your thing here
            group.killAndHide(sprite);
            group.remove(sprite, true, true)
            spriteByID.delete(id)
        })

        return world
    });
};

export const createArcadeSpriteSystem = (group: Phaser.Physics.Arcade.Group, textures: string[]) => {
    const spriteQuery = defineQuery([Position, Rotation, Velocity, ArcadeSprite])
    const spriteQueryEnter = enterQuery(spriteQuery)
    const spriteQueryExit = exitQuery(spriteQuery)
    const spriteByID = new Map<number, Phaser.Physics.Arcade.Sprite>()

    return defineSystem(world => {
        const enterEntities = spriteQueryEnter(world)
        enterEntities.forEach((id) => {
            // matching to tank
            const textid = ArcadeSprite.texture[id]
            const texture = textures[textid]

            const sprite = group.get(Position.x[id], Position.y[id], texture);

            spriteByID.set(id, sprite)
        })

        // add the entity to our scene
        const entities = spriteQuery(world)
        entities.forEach(id => {
            const sprite = spriteByID.get(id)

            if (!sprite)
            {
                return
            }

            sprite.setVelocity(Velocity.x[id], Velocity.y[id]);
            sprite.angle = Rotation.angle[id]
        })

        // exit the entity from our sprite
        const exitEntities = spriteQueryExit(world)
        exitEntities.forEach(id => {
            const sprite = spriteByID.get(id)

            if (!sprite)
            {
                return
            }

            // do your thing here
            group.killAndHide(sprite);
            spriteByID.delete(id)
        })

        return world
    });
};

export function createSpriteSystem(scene: Phaser.Scene, textures: string[])
{
    
    const spriteQuery = defineQuery([Sprite, Position, Rotation])
    const spriteQueryEnter = enterQuery(spriteQuery)
    const spriteQueryExit = exitQuery(spriteQuery)

    return defineSystem(world => {
        const enterEntities = spriteQueryEnter(world)
        enterEntities.forEach((id) => {
            // matching to tank
            const textid = Sprite.texture[id]
            const texture = textures[textid]
            spriteByID.set(id, scene.add.sprite(0, 0, texture))
        })

        // add the entity to our scene
        const entities = spriteQuery(world)
        entities.forEach(id => {
            const sprite = spriteByID.get(id)

            if (!sprite)
            {
                return
            }

            sprite.x = Position.x[id]
            sprite.y = Position.y[id]
            sprite.angle = Rotation.angle[id]
        })

        // exit the entity from our sprite
        const exitEntities = spriteQueryExit(world)
        exitEntities.forEach(id => {
            const sprite = spriteByID.get(id)

            if (!sprite)
            {
                return
            }

            // do your thing here
            sprite.destroy()
            spriteByID.delete(id)
        })

        return world
    })
} 
