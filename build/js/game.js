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

class CatchArea {
  constructor(el, options = {}) {
    this.el = el
    this.el.style.left = '170px'
    this.ceil = options.ceil || 55
    this.floor = options.floor || 835
    this.set(options.value || 0)
  }
  set (value) {
    const revValue = Math.abs(value - 1)
    this.value = ((this.floor - this.ceil) * revValue) + this.ceil
    this.el.style.top = this.value + 'px'
  }
}

const fish = new Fish(document.querySelector('.ic-fish'), {})
const catcharea = new CatchArea(document.querySelector('.ic-catcharea'), {})
const progress = new Progress(document.querySelector('.progress'), {})
const reel = new Reel(document.querySelector('.reel-wrapper'), {})
