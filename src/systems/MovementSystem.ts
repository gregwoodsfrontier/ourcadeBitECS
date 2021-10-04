import {
    defineSystem,
    defineQuery
} from 'bitecs'

import { Position } from '~/components/Position'
import { Velocity } from '~/components/Velocity'
import { Rotation } from '~/components/Rotation'
import { Input, Direction } from '~/components/Input'

export default function createMovementSystem(spd = 1)
{   
    // any entities have position and velocity
    const query = defineQuery([Position, Velocity, Rotation, Input])
    return defineSystem(world => {
        const entities = query(world)
        entities.forEach((id) => {

            // set direction
            const direction = Input.direction[id]

            switch (direction) {
                case Direction.Left:
                    Velocity.x[id] = -spd
                    Velocity.y[id] = 0
                    Rotation.angle[id] = 90
                    break;

                case Direction.Right:
                    Velocity.x[id] = spd
                    Velocity.y[id] = 0
                    Rotation.angle[id] = 270
                    break;

                case Direction.Up:
                    Velocity.x[id] = 0
                    Velocity.y[id] = -spd
                    Rotation.angle[id] = 180
                    break;

                case Direction.Down:
                    Velocity.x[id] = 0
                    Velocity.y[id] = spd
                    Rotation.angle[id] = 0
                    break;

                case Direction.None:
                    Velocity.x[id] = 0
                    Velocity.y[id] = 0
                    break;
            }

            Position.x[id] += Velocity.x[id]
            Position.y[id] += Velocity.y[id]
        })

        return world
    })
}