const { ccclass, property } = cc._decorator

import AnimLabel from './AnimLabel'
import Game from './Game'
import GameObject, { GameObjectCfg } from './GameObject'

@ccclass
export default class Enemy extends GameObject {

  @property(cc.Node)
  enemyNode: cc.Node = null

  @property(AnimLabel)
  hpLabel: AnimLabel = null

  public game: Game = null

  public animation: cc.Animation = null

  get isAnimPlaying(): boolean {
    return this.animation.getAnimationState('hurt').isPlaying || this.animation.getAnimationState('attack').isPlaying
  }
  
  onLoad() {
    this.animation = this.getComponent(cc.Animation)
  }

  public init(cfg: GameObjectCfg): void {
    cfg.maxHp = cfg.maxHp + (2 * this.game.level)
    cfg.damage = cfg.damage + (this.game.level - 1)
    super.init(cfg)
  }

  start() {
    this.hpLabel.setValue(this._currentHp, { subfix: 'hp', animate: false })
  }

  public attack(): void {
    if (!this.game.enemyRound || this._currentHp <= 0) return
    super.attack(this.game.player)
    this.playAttackAnimation()
  }

  public damage(val: number): void {
    super.damage(val)
    this.playHurtAnimation()
  }

  // invoke it when got damage or attack
  public updateStatus(): void {
    this.hpLabel.setValue(this._currentHp, { subfix: 'hp' })
  }

  public playHurtAnimation(): void {
    this.animation.play('hurt')
  }

  public playAttackAnimation(): void {
    this.animation.play('attack')
  }
}
