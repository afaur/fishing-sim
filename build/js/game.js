function number (min, max) {
  if (max === null) {
    max = min
    min = 0
  }
  return min + Math.floor(Math.random() * (max - min + 1));
}

class EventEmitter {
  constructor() {
    this.events = []
  }
  emit(type, ...args) {
    this.events.forEach(function(event) {
      if (event.type === type) { event.callback(...args) }
    })
  }
  on(type, callback) {
    this.events.push({
      type,
      callback
    })
  }
}

class Scene {
  update () {}
}

class Entity extends EventEmitter {
  constructor (className) {
    super()
    const el = document.createElement('div')
    el.className = className
    document.getElementById('stage').appendChild(el)
    this.el = el
  }
}

class Sound {
  constructor (name) {
    this.myAudio = new Audio('./audio/' + name + '.wav')
    this.myAudio.volume = 0.25
    this.myAudio.addEventListener('ended', () => {
      this.currentTime = 0
      this.play()
    }, false)
  }

  play () {
    this.myAudio.play()
  }

  pause () {
    this.myAudio.pause()
  }
}

class LoadingScene extends Scene {
  constructor () {
    super()
    this.start = new StartButton({})
    this.start.on('start', () => {
      window.game.setScene(GameScene)
    })
  }
}

class WonScene extends Scene {
  constructor () {
    super()
    this.title = new Title({text: 'You won!'})
    this.start = new StartButton({})
    this.start.on('start', () => {
      window.game.setScene(GameScene)
    })
  }
}

class LostScene extends Scene {
  constructor () {
    super()
    this.title = new Title({text: 'You lost! ]:'})
    this.start = new StartButton({})
    this.start.on('start', () => {
      window.game.setScene(GameScene)
    })
  }
}

class GameScene extends Scene {
  constructor () {
    super()
    this.gameGUI = new GameGUI({})
    this.fishNet = new FishNet({})
    this.fish = new Fish({})
    this.progress = new Progress({})
    this.reel = new Reel({})
    this.isCatching = false
    this.fishNet.on('on', () => {
      this.isCatching = true
    })
    this.fishNet.on('off', () => {
      this.isCatching = false
    })
    this.progress.on('full', () => {
      window.game.setScene(WonScene)
    })
    this.progress.on('empty', () => {
      window.game.setScene(LostScene)
    })
  }

  update () {
    this.fish.update()
    this.fishNet.update({
      fishTop: this.fish.el.style.top,
      fishHeight: this.fish.el.style.height,
    })
    this.progress.update(this.isCatching)
  }
}

class Reel extends Entity {
  constructor(options = {}) {
    super('reel-wrapper')
    this.degree = 0
    this.speed = options.initialSpeed || 50
    this.playing = false
  }
  start() {
    this.interval = setInterval(() => {
      this.degree += 45
      if (this.degree > 720) { this.degree -= 360 }
      this.el.style.transform = 'rotate(' + this.degree +'deg)'
    }, this.speed)
    this.playing = true
  }
  stop() {
    clearInterval(this.interval)
    this.playing = false
  }
  setSpeed(speed) {
    this.speed = speed
    this.el.style.transition = 'all ' + speed + 'ms ease;'
    if (this.playing) {
      this.stop()
      this.start()
    }
  }
}

class Progress extends Entity {
  constructor(options = {}) {
    super('progress')
    this.el.style.bottom = '59px'
    this.el.style.right = '49px'
    this.ceil = options.ceil || 1147
    this.floor = options.floor || 0
    this.set(options.value || 0)
  }
  set (value) {
    if (value > 1) { value = 1 }
    if (value < 0) { value = 0 }
    if (value <= 1) { this.el.style.backgroundColor = 'green' }
    if (value <= 0.75) { this.el.style.backgroundColor = 'lightgreen' }
    if (value <= 0.5) { this.el.style.backgroundColor = 'orange' }
    if (value <= 0.25) { this.el.style.backgroundColor = 'red' }
    if (value === 1) {
      this.emit('full')
    } else if (value === 0) {
      this.emit('empty')
    }
    this.value = value
    this.position = (this.ceil - this.floor) * value
    this.el.style.height = this.position + 'px'
  }
  update (state) {
    this.set( state ? this.value + 0.02 : this.value - 0.02 )
  }
}

class GameGUI extends Entity {
  constructor () {
    super('ic-gui')
  }
}

class StartButton extends Entity {
  constructor () {
    super('start-button')
    this.el.addEventListener('click', () => {
      this.emit('start')
    })
  }
}

class Title extends Entity {
  constructor ({ text }) {
    super('title')
    this.el.innerText = text
  }
}

class Fish extends Entity {
  constructor(options = {}) {
    super('ic-fish')
    this.el.style.left = '165px'
    this.ceil = options.ceil || 55
    this.floor = options.floor || 1100
    this.set(options.value || 0)
    this.goingUp = true
  }
  set(value) {
    if (value >= 1) { value = 1 }
    if (value <= 0) { value = 0 }
    const revValue = Math.abs(value - 1)
    this.value = value
    this.position = ((this.floor - this.ceil) * revValue) + this.ceil
    this.el.style.top = this.position + 'px'
  }
  update () {
    if (number(1, 10) === 1 || this.value === 1 || this.value === 0) {
      this.goingUp = !this.goingUp
    }
    const random = number(1, 10) / 200
    this.set(this.value + (this.goingUp ? random * -1 : random))
  }
}

class FishNet extends Entity {
  constructor(options = {}) {
    super('ic-fishnet')
    this.start = 0
    this.el.style.left = '170px'
    this.ceil = options.ceil || 55
    this.floor = options.floor || 835
    this.set(options.value || 0)
    document.body.addEventListener('mousedown', () => {
      this.start = Math.round(performance.now())
      this.clicking = true
    })
    document.body.addEventListener('mouseup', () => {
      this.start = Math.round(performance.now())
      this.clicking = false
    })
  }

  set (value) {
    if (value >= 1) { value = 1 }
    if (value <= 0) { value = 0 }
    this.value = value
    const revValue = Math.abs(this.value - 1)
    const position = ((this.floor - this.ceil) * revValue) + this.ceil
    this.el.style.top = position + 'px'
  }

  update ({ fishHeight, fishTop }) {
    fishTop = parseInt(fishTop, 10)
    const height = this.el.offsetHeight
    const top = parseInt(this.el.style.top, 10)
    const on = (fishTop < (height + top) && fishTop > top)
    this.emit(on ? 'on' : 'off')
    var time = Math.round(performance.now()) - this.start
    var diff  = (time + 100) / 2000
    if (this.clicking) {
      this.set(this.value + diff)
    } else {
      this.set(this.value - diff)
    }
  }
}

class Game {
  constructor (fps) {
    this.fps = fps || 10
    this.scene = null
  }

  setScene (obj) {
    this.scene = null
    const stage = document.getElementById('stage')
    while (stage.hasChildNodes()) {
      stage.removeChild(stage.lastChild)
    }
    this.scene = new obj()
  }

  run () {
    const time = Math.round(1000 / this.fps)
    setInterval(() => {
      if (this.scene) {
        this.scene.update()
      }
    }, time)
  }
}

window.game = new Game()
window.game.setScene(LoadingScene)
window.game.run()
