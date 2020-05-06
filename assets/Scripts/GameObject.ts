export interface GameObjectCfg {
  damage: number,
  maxHp: number,
  maxAp?: number,
  maxMp?: number,
  healInterval?: number,
  mpRecoveryInterval?: number
}

export default class GameObject extends cc.Component {

  protected _maxHp: number = 25

  protected _currentHp: number = 0
  
  protected _damage: number = 5

  get isDead(): boolean {
    return this._currentHp <= 0
  }

  public init(cfg: GameObjectCfg): void {
    this._currentHp = this._maxHp = cfg.maxHp
    this._damage = cfg.damage
  }

  public attack(target: GameObject): void {
    target.damage(this._damage)
    this.updateStatus()
  }

  public damage(count: number): void {
    this._currentHp = Math.max(0, this._currentHp - count)
    this.updateStatus()
  }

  protected updateStatus(): void {
    // implement it in children
  }

}
