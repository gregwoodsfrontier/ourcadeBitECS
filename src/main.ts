import Phaser from 'phaser'
import Preloader from './scenes/preloader'
import Game from './scenes/game'
import EndScene from './scenes/endScene'
import UntitledGame from './scenes/untitleGame'
import BitECSExample from './scenes/bitecs'
import MatterECS from './scenes/MatterECS'

const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	width: 800,
	height: 600,
	physics: {
		default: 'matter',
		matter: {
			gravity: { y: 0 },
			debug: true
		},
		arcade: {
			gravity: { y: 0 },
			debug: true
		}
	},
	scene: [MatterECS]
}

export default new Phaser.Game(config)
