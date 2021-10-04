import {
    defineSystem,
    defineQuery
} from 'bitecs'
import Phaser from 'phaser'
import { CPU } from '../components/CPU'
import { Direction, Input } from '~/components/Input'

export default function createCPUSystem(scene: Phaser.Scene)
{
    const CPUquery = defineQuery([ CPU, Input ])
    return defineSystem(world => {
        const dt = scene.game.loop.delta;
        const entities = CPUquery(world)
        entities.forEach(id => {
            CPU.accumulatedTime[id] += dt

            // if the accumulated time is less than period then skip loop
            if (CPU.accumulatedTime[id] < CPU.timeBetweenActions[id])
            {
                return
            }

            // reset the accu time
            CPU.accumulatedTime[id] -= CPU.timeBetweenActions[id];

            const rand = Phaser.Math.Between(0,20)

            switch (rand)
            {
                // left
                case 0:
                    Input.direction[id] = Direction.Left
                    break;

                // right
                case 1:
                    Input.direction[id] = Direction.Right
                    break;

                // up
                case 2:
                    Input.direction[id] = Direction.Up
                    break;

                // down
                case 3:
                    Input.direction[id] = Direction.Down
                    break;

                default:
                    Input.direction[id] = Direction.None
                    break;
            }
        })
        
        return world
    })
}