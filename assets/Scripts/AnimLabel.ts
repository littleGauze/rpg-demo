const { ccclass, property } = cc._decorator

interface ValueOpts {
  prefix?: string,
  subfix?: string,
  animate?: boolean
}

@ccclass
export default class AnimLabel extends cc.Component {

  private label: cc.Node = null
  private animLabel: cc.Node = null
  private currentValue: number = 0

  onLoad() {
    this.label = cc.find('label', this.node)
    this.animLabel = cc.find('animLabel', this.node)
  }

  public setColor(color: cc.Color): void {
    this.animLabel.color = color
  }

  public setValue(val: number, { prefix = '', subfix = '', animate = true }: ValueOpts): void {
    const delta = val - this.currentValue
    if (this.currentValue && animate && delta) {
      if (delta > 0) {
        this.setColor(cc.Color.GREEN)
      } else {
        this.setColor(cc.Color.RED)
      }
      this.animLabel.getComponent(cc.Label).string = delta > 0 ? `+${delta}` : `${delta}`
      this.playAnim()
    }
    this.currentValue = val
    this.label.getComponent(cc.Label).string = `${prefix}${val}${subfix}`
  }

  public playAnim(interval: number = 0.3): void {
    const seq: cc.ActionInterval = cc.sequence(
      cc.spawn(
        cc.fadeIn(interval),
        cc.moveBy(interval, cc.v2(0, 40))
      ),
      cc.spawn(
        cc.fadeOut(interval),
        cc.moveBy(interval, cc.v2(0, 40))
      ),
      cc.callFunc(() => {
        this.animLabel.setPosition(cc.v2(0, 0))
      })
    )
    this.animLabel.runAction(seq)
  }

}
