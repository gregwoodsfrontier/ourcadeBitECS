import {
    defineSystem,
    defineQuery
} from 'bitecs'
import Phaser from 'phaser'
import { Input } from '~/components/Input';
import { Rotation } from '~/components/Rotation';
import { Velocity } from '~/components/Velocity';


export default function createSteerSystem(speed = 200)
{
    const query = defineQuery([ Rotation, Velocity, Input ])
    return defineSystem(world => {
        const entities = query(world);
        for(const id of entities)
        {
            // know if moving
            const isUp = !!Input.up[id];
            const isDown = !!Input.down[id];
            const isMoving = isUp || isDown;

            if(isMoving)
            {
                const moveDir = isUp ? 1 : -1;
                const isLeft = !!Input.left[id];
                const isRight = !!Input.right[id];

                let angle = Rotation.angle[id];

                if(isLeft)
                {
                    angle -= 1;
                } 
                else if (isRight)
                {
                    angle += 1;
                }

                Rotation.angle[id] = angle

                const rotation = Phaser.Math.DegToRad(angle);
                const vec = new Phaser.Math.Vector2();
                vec.setToPolar(rotation, 1);

                Velocity.x[id] = vec.x * speed * moveDir;
                Velocity.y[id] = vec.y * speed * moveDir;
                
            }
            else
            {
                Velocity.x[id] = 0;
                Velocity.y[id] = 0;
            }
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