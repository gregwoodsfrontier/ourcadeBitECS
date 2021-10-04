import Phaser from 'phaser'
import {    
    defineQuery,
    enterQuery,
    exitQuery,   
    defineSystem
} from 'bitecs'

import { Position } from '../components/Position'
import { MatterSprite, MatterStaticSprite } from '~/components/MatterSprite'
import { Rotation } from '~/components/Rotation'
import { Velocity } from '~/components/Velocity'

const matterSpritesByID = new Map<number, Phaser.Physics.Matter.Sprite>()

export function createMatterSpriteSystem(matter: Phaser.Physics.Matter.MatterPhysics, textures: string[])
{
    const query = defineQuery([Position, MatterSprite])

    //enter query
    const onQueryEnter = enterQuery(query);    

    //exit query
        
    return defineSystem(world => {
        //create matter sprite on enter
        const enterEntities = onQueryEnter(world);
        for(let i = 0; i < enterEntities.length; ++i)
        {
            const id = enterEntities[i];

            const x = Position.x[id];
            const y = Position.y[id];
            const textureId = MatterSprite.texture[id];

            const sprite = matter.add.sprite(x, y, textures[textureId]);

            matterSpritesByID.set(id, sprite);
        }

        //logger
        //logger(world);

        return world
    })
}

function logger(world)
{
    const query = defineQuery([Position, MatterSprite]);
    const ent = query(world)
    for(let i = 0; i < ent.length; ++i)
    {
        const id = ent[i]
        console.log(`${Position.x[id]} ; ${Position.y[id]}`)
    }
}

export function createMatterSpriteSyncSystem() {
    // create query
    const query = defineQuery([Position, MatterSprite]);

    return defineSystem(world => {
        //sync simu values back into components
        const entities = query(world)
        for (let i = 0; i < entities.length; ++i)
        {
            const id = entities[i];
            const sprite = matterSpritesByID.get(id);

            if(!sprite)
            {
                continue
            }

            Position.x[id] = sprite.x;
            Position.y[id] = sprite.y;
        }

        return world
    })
}

export function createMatterPhysicsSystem()
{
    const query = defineQuery([ Rotation, Velocity, MatterSprite ])
    return defineSystem(world => {
        const entities = query(world);
        for(let i = 0; i < entities.length; ++i)
        {
            const id = entities[i]
            const sprite = matterSpritesByID.get(id);
            if(!sprite)
            {
                continue
            }
            //set the rotation
            sprite.angle = Rotation.angle[id]

            //set the velocity
            sprite.setVelocity(
                Velocity.x[id],
                Velocity.y[id]
            )
        }
        
        return world
    })
}

export function createMatterStaticSpriteSystem()
{
    const query = defineQuery([ Position, MatterSprite, MatterStaticSprite ])

    const onQueryEnter = enterQuery(query)

    const onQueryExit = exitQuery(query)

    return defineSystem(world => {
        const enteredEntities = onQueryEnter(world);
        for(const id of enteredEntities)
        {
            const sprite = matterSpritesByID.get(id);
            if(!sprite)
            {
                continue
            }

            sprite.setStatic(true);
        }

        const exitEnt = onQueryExit(world);
        for(const id of exitEnt)
        {
            const sprite = matterSpritesByID.get(id);
            if(!sprite)
            {
                continue
            }

            sprite.setStatic(false);
        }
        
        return world
    })
}