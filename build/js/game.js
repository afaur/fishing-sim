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

class Stage {
  constructor(gameObjects) {
    this.game = gameObjects
    this.started = false
    this.fishNetMovingUp = false
    this.fishInterval = null
    this.fishNetInterval = null
    this.fishNetVelocity = 0.02
    this.pageBody = document.getElementById("body")
    this.playButton = document.getElementById("playButton")
    this.endButton = document.getElementById("endButton")
    this.pageBody.onclick = (evt) => {
      if ( evt.target.id === 'playButton' || evt.target.id === 'endButton' ) {
      } else {
        if ( this.started === true && this.fishNetMovingUp === false ) {
          this.pushUpNet()
        }
      }
    }
    this.playButton.onclick = (evt) => {
      evt.preventDefault()
      this.play()
    }
    this.endButton.onclick = (evt) => {
      evt.preventDefault()
      this.end()
    }
    this.game.fishNet.set(0)
  }
  play() {
    if (this.fishInterval) { clearInterval(this.fishInterval) }
    if (this.fishNetInterval) { clearInterval(this.fishNetInterval) }
    this.fishInterval = setInterval(() => {
      let random = Math.random()
      this.game.fish.set(random)
    }, 2000)
    this.fishNetInterval = setInterval(() => {
      if ( this.fishNetMovingUp === false ) {
        let current = this.game.fishNet.get()
        let velocity = this.fishNetVelocity
        if ( (current - velocity) > 0 ) {
          this.game.fishNet.set(current - velocity)
        } else {
          this.game.fishNet.set(0)
        }
      }
    }, 100)
    this.started = true
  }
  end() {
    clearInterval(this.fishInterval)
    clearInterval(this.fishNetInterval)
    this.game.fish.set(0)
    this.game.fishNet.set(0)
    this.started = false
  }
  pushUpNet() {
    if ( this.fishNetMovingUp === false ) {
      if ( (this.game.fishNet.get() + 0.05) < 1 ) {
        this.game.fishNet.set( this.game.fishNet.get() + 0.05 )
        this.fishNetMovingUp = true
        setTimeout(() => {
          this.fishNetMovingUp = false
        }, 100)
      } else {
        this.game.fishNet.set(1)
      }
      this.fishNetMovingUp = true
      setTimeout(() => {
        this.fishNetMovingUp = false
      }, 100)
    }
  }
}

class Reel {
  constructor(el, options = {}) {
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

class Progress {
  constructor(el, options = {}) {
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

class Fish {
  constructor(el, options = {}) {
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
}

class FishNet {
  constructor(el, options = {}) {
    this.el = el
    this.el.style.left = '170px'
    this.ceil = options.ceil || 55
    this.floor = options.floor || 835
    this.set(options.value || 0)
  }
  set (value) {
    this.value = value
    const revValue = Math.abs(value - 1)
    this.position = ((this.floor - this.ceil) * revValue) + this.ceil
    this.el.style.top = this.position + 'px'
  }
  get () {
    return this.value
  }
}

const fish = new Fish(document.querySelector('.ic-fish'), {})
const fishNet = new FishNet(document.querySelector('.ic-fishnet'), {})
const progress = new Progress(document.querySelector('.progress'), {})
const reel = new Reel(document.querySelector('.reel-wrapper'), {})

const stage = new Stage({
  fish, fishNet, progress, reel
})
