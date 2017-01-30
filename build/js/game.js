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

class Scene { }
class Entity extends EventEmitter { }

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

class GameScene extends Scene {
  constructor () {
    super()
    this.game = {
      fish: new Fish(document.querySelector('.ic-fish'), {}),
      fishNet: new FishNet(document.querySelector('.ic-fishnet'), {}),
      progress: new Progress(document.querySelector('.progress'), {}),
      reel: new Reel(document.querySelector('.reel-wrapper'), {}),
    }
    this.started = false
    this.fishInterval = null
    this.pageBody = document.getElementById("body")
    this.playButton = document.getElementById("playButton")
    this.endButton = document.getElementById("endButton")
    this.playButton.onclick = (evt) => {
      evt.preventDefault()
      evt.stopPropagation()
      this.play()
    }
    this.endButton.onclick = (evt) => {
      evt.preventDefault()
      evt.stopPropagation()
      this.end()
    }
  }

  update () {
    if (this.started) {
      this.game.fish.update()
      this.game.fishNet.update()
    }
  }
  
  play () {
    this.started = true
  }

  end() {
    this.started = false
    this.game.fish.set(0)
    this.game.fishNet.set(0)
  }
}

class Reel extends Entity {
  constructor(el, options = {}) {
    super()
    this.el = el
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
  constructor(el, options = {}) {
    super()
    this.el = el
    this.el.style.bottom = '59px'
    this.el.style.right = '49px'
    this.ceil = options.ceil || 1147
    this.floor = options.floor || 0
    this.set(options.value || 0)
  }
  set(value) {
    if (value <= 1) { this.el.style.backgroundColor = 'green' }
    if (value <= 0.75) { this.el.style.backgroundColor = 'lightgreen' }
    if (value <= 0.5) { this.el.style.backgroundColor = 'orange' }
    if (value <= 0.25) { this.el.style.backgroundColor = 'red' }
    this.value = (this.ceil - this.floor) * value
    this.el.style.height = this.value + 'px'
  }
}

class Fish extends Entity {
  constructor(el, options = {}) {
    super()
    this.el = el
    this.el.style.left = '165px'
    this.ceil = options.ceil || 55
    this.floor = options.floor || 1100
    this.set(options.value || 0)
  }
  set(value) {
    const revValue = Math.abs(value - 1)
    this.value = ((this.floor - this.ceil) * revValue) + this.ceil
    this.el.style.top = this.value + 'px'
  }
  update () {
    let random = Math.random()
    this.set(random)
  }
}

class FishNet extends Entity {
  constructor(el, options = {}) {
    super()
    this.el = el
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

  get () {
    return this.value
  }

  update () {
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
  }

  run () {
    const stage = new GameScene()
    const time = Math.round(1000 / this.fps)
    setInterval(() => {
      stage.update()
    }, time)
  }
}

new Game().run()
