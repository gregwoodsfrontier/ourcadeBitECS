import {
    defineSystem,
    defineQuery
} from 'bitecs'
import Phaser from 'phaser'
import { Player } from '~/components/Player'
import { Input } from '~/components/Input'

export default function createPlayerSystem(cursors: Phaser.Types.Input.Keyboard.CursorKeys)
{
    const query = defineQuery([ Player, Input ])
    return defineSystem(world => {
        const entities = query(world);
        for(const id of entities)
        {
            //set left, right, up, down values
            Input.left[id] = cursors.left.isDown ? 1 : 0;
            Input.right[id] = cursors.right.isDown ? 1 : 0;
            Input.up[id] = cursors.up.isDown ? 1 : 0;
            Input.down[id] = cursors.down.isDown ? 1 : 0;
        }
        
        return world
    })
}

// boilerplate code
/*
export default function createPlayerSystem(cursors: Phaser.Types.Input.Keyboard.CursorKeys)
{
    const query = defineQuery([ Player, Input ])
    return defineSystem(world => {
        const entities = query(world);
        for(let i = 0; i < entities.length; ++i)
        {
            const id = entities[i]
            //set left, right, up, down values
        }
        
        return world
    })
}
*/