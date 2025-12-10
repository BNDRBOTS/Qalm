class QalmBreathingApp {
  constructor() {
    this.isRunning = false
    this.currentPhase = 0
    this.currentCycle = 0
    this.animationId = null
    this.phaseTimeout = null
    this.soundEnabled = true
    this.audioContext = null

    // Breathing protocols
    this.protocols = {
      "4-7-8": [
        { name: "Inhale", duration: 4000, type: "inhale" },
        { name: "Hold", duration: 7000, type: "hold" },
        { name: "Exhale", duration: 8000, type: "exhale" },
      ],
      box: [
        { name: "Inhale", duration: 4000, type: "inhale" },
        { name: "Hold", duration: 4000, type: "hold" },
        { name: "Exhale", duration: 4000, type: "exhale" },
        { name: "Hold", duration: 4000, type: "hold" },
      ],
      coherent: [
        { name: "Inhale", duration: 5000, type: "inhale" },
        { name: "Exhale", duration: 5000, type: "exhale" },
      ],
      physiological: [
        { name: "Inhale", duration: 2000, type: "inhale" },
        { name: "Micro-inhale", duration: 500, type: "inhale" },
        { name: "Exhale", duration: 6000, type: "exhale" },
      ],
      custom: [],
    }

    this.currentProtocol = "4-7-8"
    this.customProtocol = [...this.protocols["4-7-8"]]

    this.init()
  }

  init() {
    this.bindElements()
    this.bindEvents()
    this.loadSettings()
    this.initAudio()
    this.updateUI()
  }

  bindElements() {
    this.elements = {
      circle: document.getElementById("breathing-circle"),
      phaseText: document.getElementById("phase-text"),
      timerText: document.getElementById("timer-text"),
      playPauseBtn: document.getElementById("play-pause-btn"),
      protocolSelect: document.getElementById("protocol-select"),
      soundToggle: document.getElementById("sound-toggle"),
      customPanel: document.getElementById("custom-panel"),
      helpModal: document.getElementById("help-modal"),
      helpBtn: document.getElementById("help-btn"),
      closeHelp: document.getElementById("close-help"),
      saveCustom: document.getElementById("save-custom"),
      closeCustom: document.getElementById("close-custom"),
      inhaleDuration: document.getElementById("inhale-duration"),
      hold1Duration: document.getElementById("hold1-duration"),
      exhaleDuration: document.getElementById("exhale-duration"),
      hold2Duration: document.getElementById("hold2-duration"),
    }
  }

  bindEvents() {
    // Main controls
    this.elements.playPauseBtn.addEventListener("click", () => this.toggleBreathing())
    this.elements.protocolSelect.addEventListener("change", (e) => this.changeProtocol(e.target.value))
    this.elements.soundToggle.addEventListener("click", () => this.toggleSound())

    // Custom protocol controls
    this.elements.saveCustom.addEventListener("click", () => this.saveCustomProtocol())
    this.elements.closeCustom.addEventListener("click", () => this.hideCustomPanel())

    // Duration sliders
    ;[
      this.elements.inhaleDuration,
      this.elements.hold1Duration,
      this.elements.exhaleDuration,
      this.elements.hold2Duration,
    ].forEach((slider) => {
      slider.addEventListener("input", () => this.updateCustomProtocol())
    })

    // Help modal
    this.elements.helpBtn.addEventListener("click", () => this.showHelp())
    this.elements.closeHelp.addEventListener("click", () => this.hideHelp())
    this.elements.helpModal.addEventListener("click", (e) => {
      if (e.target === this.elements.helpModal) this.hideHelp()
    })

    // Keyboard shortcuts
    document.addEventListener("keydown", (e) => this.handleKeyboard(e))

    // Resize handler with debounce
    let resizeTimeout
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimeout)
      resizeTimeout = setTimeout(() => this.handleResize(), 150)
    })

    // Prevent context menu on circle
    this.elements.circle.addEventListener("contextmenu", (e) => e.preventDefault())
  }

  initAudio() {
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)()
    } catch (e) {
      console.warn("Audio not supported")
      this.soundEnabled = false
    }
  }

  playChime(frequency = 440, duration = 200) {
    if (!this.soundEnabled || !this.audioContext) return

    try {
      const oscillator = this.audioContext.createOscillator()
      const gainNode = this.audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(this.audioContext.destination)

      oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime)
      oscillator.type = "sine"

      gainNode.gain.setValueAtTime(0, this.audioContext.currentTime)
      gainNode.gain.linearRampToValueAtTime(0.1, this.audioContext.currentTime + 0.01)
      gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration / 1000)

      oscillator.start(this.audioContext.currentTime)
      oscillator.stop(this.audioContext.currentTime + duration / 1000)
    } catch (e) {
      console.warn("Audio playback failed")
    }
  }

  toggleBreathing() {
    if (this.isRunning) {
      this.stopBreathing()
    } else {
      this.startBreathing()
    }
  }

  startBreathing() {
    if (this.audioContext && this.audioContext.state === "suspended") {
      this.audioContext.resume()
    }

    this.isRunning = true
    this.currentPhase = 0
    this.currentCycle = 0
    this.updatePlayPauseButton()
    this.runBreathingCycle()
  }

  stopBreathing() {
    this.isRunning = false
    this.currentPhase = 0

    if (this.phaseTimeout) {
      clearTimeout(this.phaseTimeout)
      this.phaseTimeout = null
    }

    if (this.animationId) {
      cancelAnimationFrame(this.animationId)
      this.animationId = null
    }

    this.elements.circle.className = "breathing-circle"
    this.elements.phaseText.textContent = "Ready"
    this.elements.timerText.textContent = ""
    this.updatePlayPauseButton()
  }

  runBreathingCycle() {
    if (!this.isRunning) return

    const protocol = this.getCurrentProtocol()
    if (protocol.length === 0) return

    const phase = protocol[this.currentPhase]
    this.executePhase(phase)

    this.phaseTimeout = setTimeout(() => {
      this.currentPhase = (this.currentPhase + 1) % protocol.length
      if (this.currentPhase === 0) {
        this.currentCycle++
      }
      this.runBreathingCycle()
    }, phase.duration)
  }

  executePhase(phase) {
    // Update UI
    this.elements.phaseText.textContent = phase.name
    this.elements.circle.style.setProperty("--duration", `${phase.duration}ms`)

    // Remove existing animation classes
    this.elements.circle.className = "breathing-circle"

    // Force reflow and add new animation class
    this.elements.circle.offsetHeight
    this.elements.circle.classList.add(phase.type)

    // Play sound
    this.playChime(this.getPhaseFrequency(phase.type), 150)

    // Start timer
    this.startPhaseTimer(phase.duration)
  }

  startPhaseTimer(duration) {
    const startTime = Date.now()
    const updateTimer = () => {
      if (!this.isRunning) return

      const elapsed = Date.now() - startTime
      const remaining = Math.max(0, duration - elapsed)
      const seconds = (remaining / 1000).toFixed(1)

      this.elements.timerText.textContent = `${seconds}s`

      if (remaining > 0) {
        this.animationId = requestAnimationFrame(updateTimer)
      }
    }

    updateTimer()
  }

  getPhaseFrequency(type) {
    const frequencies = {
      inhale: 523.25, // C5
      hold: 659.25, // E5
      exhale: 392.0, // G4
    }
    return frequencies[type] || 440
  }

  getCurrentProtocol() {
    if (this.currentProtocol === "custom") {
      return this.customProtocol
    }
    return this.protocols[this.currentProtocol]
  }

  changeProtocol(protocolName) {
    this.currentProtocol = protocolName

    if (protocolName === "custom") {
      this.showCustomPanel()
    } else {
      this.hideCustomPanel()
    }

    if (this.isRunning) {
      this.stopBreathing()
    }

    this.saveSettings()
  }

  showCustomPanel() {
    this.updateCustomSliders()
    this.elements.customPanel.classList.remove("hidden")
  }

  hideCustomPanel() {
    this.elements.customPanel.classList.add("hidden")
  }

  updateCustomSliders() {
    const sliders = [
      { element: this.elements.inhaleDuration, phase: 0 },
      { element: this.elements.hold1Duration, phase: 1 },
      { element: this.elements.exhaleDuration, phase: 2 },
      { element: this.elements.hold2Duration, phase: 3 },
    ]

    sliders.forEach(({ element, phase }) => {
      const value = this.customProtocol[phase]?.duration || 0
      element.value = value
      this.updateDurationDisplay(element)
    })
  }

  updateCustomProtocol() {
    const phases = [
      { name: "Inhale", duration: Number.parseInt(this.elements.inhaleDuration.value), type: "inhale" },
      { name: "Hold", duration: Number.parseInt(this.elements.hold1Duration.value), type: "hold" },
      { name: "Exhale", duration: Number.parseInt(this.elements.exhaleDuration.value), type: "exhale" },
      { name: "Hold", duration: Number.parseInt(this.elements.hold2Duration.value), type: "hold" },
    ]

    // Filter out phases with 0 duration
    this.customProtocol = phases.filter((phase) => phase.duration > 0)

    // Update duration displays
    ;[
      this.elements.inhaleDuration,
      this.elements.hold1Duration,
      this.elements.exhaleDuration,
      this.elements.hold2Duration,
    ].forEach((slider) => {
      this.updateDurationDisplay(slider)
    })
  }

  updateDurationDisplay(slider) {
    const display = slider.parentNode.querySelector(".duration-display")
    const seconds = (Number.parseInt(slider.value) / 1000).toFixed(1)
    display.textContent = `${seconds}s`
  }

  saveCustomProtocol() {
    this.updateCustomProtocol()
    this.saveSettings()
    this.hideCustomPanel()
  }

  toggleSound() {
    this.soundEnabled = !this.soundEnabled
    this.elements.soundToggle.querySelector(".btn-text").textContent = `Sound: ${this.soundEnabled ? "On" : "Off"}`
    this.saveSettings()
  }

  showHelp() {
    this.elements.helpModal.classList.remove("hidden")
  }

  hideHelp() {
    this.elements.helpModal.classList.add("hidden")
  }

  handleKeyboard(e) {
    // Prevent shortcuts when typing in inputs
    if (e.target.tagName === "INPUT" || e.target.tagName === "SELECT") return

    switch (e.code) {
      case "Space":
        e.preventDefault()
        this.toggleBreathing()
        break
      case "ArrowLeft":
        e.preventDefault()
        this.switchProtocol(-1)
        break
      case "ArrowRight":
        e.preventDefault()
        this.switchProtocol(1)
        break
      case "KeyS":
        e.preventDefault()
        this.toggleSound()
        break
      case "KeyH":
        e.preventDefault()
        if (this.elements.helpModal.classList.contains("hidden")) {
          this.showHelp()
        } else {
          this.hideHelp()
        }
        break
      case "Escape":
        if (!this.elements.helpModal.classList.contains("hidden")) {
          this.hideHelp()
        } else if (!this.elements.customPanel.classList.contains("hidden")) {
          this.hideCustomPanel()
        }
        break
    }
  }

  switchProtocol(direction) {
    const protocols = Object.keys(this.protocols)
    const currentIndex = protocols.indexOf(this.currentProtocol)
    const newIndex = (currentIndex + direction + protocols.length) % protocols.length

    this.elements.protocolSelect.value = protocols[newIndex]
    this.changeProtocol(protocols[newIndex])
  }

  updatePlayPauseButton() {
    const btnText = this.elements.playPauseBtn.querySelector(".btn-text")
    btnText.textContent = this.isRunning ? "Pause" : "Start"
    this.elements.playPauseBtn.setAttribute(
      "aria-label",
      this.isRunning ? "Pause breathing exercise" : "Start breathing exercise",
    )
  }

  updateUI() {
    this.updatePlayPauseButton()
    this.elements.soundToggle.querySelector(".btn-text").textContent = `Sound: ${this.soundEnabled ? "On" : "Off"}`
  }

  handleResize() {
    // Handle any resize-specific logic
    if (this.isRunning) {
      // Ensure animations continue smoothly after resize
      this.elements.circle.style.transform = ""
    }
  }

  saveSettings() {
    try {
      const settings = {
        currentProtocol: this.currentProtocol,
        soundEnabled: this.soundEnabled,
        customProtocol: this.customProtocol,
      }
      localStorage.setItem("qalm-settings", JSON.stringify(settings))
    } catch (e) {
      console.warn("Could not save settings")
    }
  }

  loadSettings() {
    try {
      const saved = localStorage.getItem("qalm-settings")
      if (saved) {
        const settings = JSON.parse(saved)
        this.currentProtocol = settings.currentProtocol || "4-7-8"
        this.soundEnabled = settings.soundEnabled !== false
        this.customProtocol = settings.customProtocol || [...this.protocols["4-7-8"]]

        this.elements.protocolSelect.value = this.currentProtocol
      }
    } catch (e) {
      console.warn("Could not load settings")
    }
  }
}

// Initialize app when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => new QalmBreathingApp())
} else {
  new QalmBreathingApp()
}

// Service Worker registration for PWA
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    const swCode = `
            const CACHE_NAME = 'qalm-v1.0';
            const urlsToCache = ['/'];
            
            self.addEventListener('install', event => {
                event.waitUntil(
                    caches.open(CACHE_NAME)
                        .then(cache => cache.addAll(urlsToCache))
                );
            });
            
            self.addEventListener('fetch', event => {
                event.respondWith(
                    caches.match(event.request)
                        .then(response => response || fetch(event.request))
                );
            });
        `

    const blob = new Blob([swCode], { type: "application/javascript" })
    const swUrl = URL.createObjectURL(blob)

    navigator.serviceWorker
      .register(swUrl)
      .then(() => console.log("SW registered"))
      .catch(() => console.log("SW registration failed"))
  })
}

// Error handling
window.addEventListener("error", (e) => {
  console.error("Qalm error:", e.error)
})

window.addEventListener("unhandledrejection", (e) => {
  console.error("Qalm promise rejection:", e.reason)
  e.preventDefault()
})
