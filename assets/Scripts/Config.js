
window.cfg = {}

Object.defineProperty(window.cfg, 'player', {
  get() {
    return {
      maxHp: 25,
      damage: 5,
      maxAp: 3,
      maxMp: 10,
      mpRecoveryInterval: 2,
      healInterval: 8
    }
  }
})

Object.defineProperty(window.cfg, 'enemy', {
  get() {
    return {
      maxHp: 25,
      damage: 2
    }
  }
})