const { ccclass, property } = cc._decorator

import AnimLabel from './AnimLabel'
import Game from './Game'
import GameObject, { GameObjectCfg } from './GameObject'

@ccclass
export default class Player extends GameObject {

  @property(AnimLabel)
  hpLabel: AnimLabel = null

  @property(AnimLabel)
  apLabel: AnimLabel = null

  @property(AnimLabel)
  mpLabel: AnimLabel = null

  @property(cc.Button)
  attackBtn: cc.Button = null

  @property(cc.Button)
  healBtn: cc.Button = null

  @property(cc.Node)
  hintLayer: cc.Node = null

  private hintLabel: cc.Label = null

  private _maxAp: number = 3
  private _currentAp: number = 0

  private _maxMp: number = 10
  private _currentMp: number = 0
  private _mpRecoveryInterval: number = 2

  private _healInterval: number = 8

  public game: Game = null

  get runOutAp(): boolean {
    return this._currentAp <= 0
  }

  onLoad() {
    this.hintLabel = this.hintLayer.getComponentInChildren(cc.Label)
    this.attackBtn.node.on('mouseenter', this.mouseEnter('attack'), this)
    this.attackBtn.node.on('mouseleave', this.mouseLeave, this)
    this.healBtn.node.on('mouseenter', this.mouseEnter('enter'), this)
    this.healBtn.node.on('mouseleave', this.mouseLeave, this)
  }

  public init(cfg: GameObjectCfg): void {
    this._currentAp = this._maxAp = cfg.maxAp
    this._currentMp = this._maxMp = cfg.maxMp
    this._healInterval = cfg.healInterval
    this._mpRecoveryInterval = cfg.mpRecoveryInterval
    super.init(cfg)
  }

  start() {
    this.hpLabel.setValue(this._currentHp, { prefix: 'HP\n', animate: false })
    this.apLabel.setValue(this._currentAp, { prefix: 'AP\n', animate: false })
    this.mpLabel.setValue(this._currentMp, { prefix: 'MP\n', animate: false })
  }

  public heal(): void {
    if (!this.game.playerRound || this._currentMp <= 0) return

    const healVal: number = Math.min(this._currentMp, this._healInterval)
    this._currentHp = Math.min(this._maxHp, this._currentHp + healVal)
    this._currentMp -= healVal

    this.updateStatus()
  }

  public attack(): void {
    if (!this.game.playerRound || this._currentAp <= 0) return

    // decrement ap value
    this._currentAp -= 1

    // mp recovery
    this.mpRecovery()

    // check enmey round
    this.game.checkEnemyRound()

    super.attack(this.game.enemy)
  }

  // invoke it when got damage or attack
  public updateStatus(): void {
    this.hpLabel.setValue(this._currentHp, { prefix: 'HP\n' })
    this.apLabel.setValue(this._currentAp, { prefix: 'AP\n' })
    this.mpLabel.setValue(this._currentMp, { prefix: 'MP\n' })
  }

  public resetAp(): void {
    this._currentAp = this._maxAp
    this.updateStatus()
  }

  private mpRecovery(): void {
    this._currentMp = Math.min(this._maxMp, this._currentMp + this._mpRecoveryInterval)
  }

  private mouseEnter(type: string): Function {
    return (): void => {
      this.hintLayer.active = true
      if (type === 'attack') {
        this.hintLabel.string = `Attack, Deals ${this._damage} damages to enemy.`
        return
      }
      this.hintLabel.string = `Healing, Heals the player for ${this._healInterval} HP.`
    }
  }

  private mouseLeave(): void {
    this.hintLayer.active = false
  }

  public incrDamage(): void {
    this._damage += 1
  }

}
