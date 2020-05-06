import Enemy from './Enemy'
import Player from './Player'

const { ccclass, property } = cc._decorator
enum Round {
  Enemy = 1,
  Player
}

@ccclass
export default class Game extends cc.Component {
  @property(cc.Node)
  enemyNode: cc.Node = null

  @property(cc.Node)
  playerNode: cc.Node = null

  @property(cc.Button)
  nextRoomButton: cc.Button = null

  @property(cc.Node)
  bg: cc.Node = null

  @property(cc.Label)
  levelLabel: cc.Label = null

  @property(cc.Label)
  roundLabel: cc.Label = null

  public level: number = 1
  public player: Player = null
  public enemy: Enemy = null
  private _round: Round = Round.Player

  get playerRound(): boolean {
    return this._round === Round.Player
  }

  get enemyRound(): boolean {
    return this._round === Round.Enemy
  }

  onLoad() {
    this.player = this.playerNode.getComponent(Player)
    this.player.game = this
    this.player.init(window.cfg.player) // eslint-disable-line
    this.enemy = this.enemyNode.getComponent(Enemy)
    this.enemy.game = this
    this.enemy.init(window.cfg.enemy) // eslint-disable-line
  }

  checkEnemyRound(): void {
    if (this.player.runOutAp) {
      this._round = Round.Enemy
      setTimeout(() => {
        // enemy round
        this.enemy.attack()

        // reset player's ap
        this.player.resetAp()

        this._round = Round.Player
      }, 800)
    }
  }

  nextRoom(): void {
    this.level++
    this.player.incrDamage()
    this.levelLabel.string = `Level: ${this.level}`
    this.enemy.init(window.cfg.enemy)

    // reset player's ap
    this.player.resetAp()
    this.player.updateStatus()
    this.enemy.updateStatus()

    this.loadTransition()
  }

  loadTransition(): void {
      this.enemyNode.active = true
      this.nextRoomButton.node.active = false
      this.bg.opacity = 0
      const seq: cc.ActionInterval = cc.sequence(cc.fadeIn(.8), cc.callFunc(() => {
        this._round = Round.Player
      }))
      this.bg.runAction(seq)
  }

  checkDead(): void {
    if (this.player.isDead)
      cc.director.loadScene('game')
  }

  update() {
    if (this.enemy && this.enemy.isDead && !this.enemy.isAnimPlaying) {
      this._round = Round.Enemy
      this.enemyNode.active = false
      this.nextRoomButton.node.active = true
    }

    this.checkDead()

    this.roundLabel.string = `Round: ${this.playerRound ? 'Player' : 'Enemy'}`
  }
}
