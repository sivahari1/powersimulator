class SoundManager {
  constructor() {
    this.sounds = {};
    this.isEnabled = true;
    this.volume = 0.3;
    this.audioContext = null;
    this.initAudioContext();
    this.initSounds();
  }

  initAudioContext() {
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    } catch (error) {
      console.log('Web Audio API not supported, sounds will be disabled');
      this.isEnabled = false;
    }
  }

  initSounds() {
    // Create simple beep sounds using Web Audio API
    this.sounds.deviceOn = () => this.createBeep(800, 0.1, 'sine');
    this.sounds.deviceOff = () => this.createBeep(400, 0.1, 'sine');
    this.sounds.powerOn = () => this.createBeep(1000, 0.2, 'sine');
    this.sounds.powerOff = () => this.createBeep(300, 0.2, 'sine');
    this.sounds.fuseTrip = () => this.createBeep(200, 0.3, 'sawtooth');
    this.sounds.fuseReset = () => this.createBeep(600, 0.2, 'square');
    this.sounds.warning = () => this.createBeep(500, 0.15, 'triangle');
    this.sounds.success = () => this.createBeep(1200, 0.1, 'sine');
    this.sounds.tooltip = () => this.createBeep(700, 0.05, 'sine');
    this.sounds.modeToggle = () => this.createBeep(900, 0.1, 'sine');
  }

  createBeep(frequency, duration, type = 'sine') {
    if (!this.audioContext || !this.isEnabled) return;
    
    try {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
      oscillator.type = type;
      
      gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(this.volume, this.audioContext.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration);
      
      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + duration);
    } catch (error) {
      console.log('Sound effect error:', error);
    }
  }

  play(soundName) {
    if (!this.isEnabled || !this.sounds[soundName]) return;
    
    try {
      // Resume audio context if suspended (required for user interaction)
      if (this.audioContext && this.audioContext.state === 'suspended') {
        this.audioContext.resume();
      }
      
      this.sounds[soundName]();
    } catch (error) {
      console.log('Sound effect error:', error);
    }
  }

  setVolume(volume) {
    this.volume = Math.max(0, Math.min(1, volume));
  }

  enable() {
    this.isEnabled = true;
  }

  disable() {
    this.isEnabled = false;
  }

  // Device interaction sounds
  playDeviceToggle(isOn) {
    this.play(isOn ? 'deviceOn' : 'deviceOff');
  }

  playPowerToggle(isOn) {
    this.play(isOn ? 'powerOn' : 'powerOff');
  }

  playFuseTrip() {
    this.play('fuseTrip');
  }

  playFuseReset() {
    this.play('fuseReset');
  }

  playWarning() {
    this.play('warning');
  }

  playSuccess() {
    this.play('success');
  }

  playTooltip() {
    this.play('tooltip');
  }

  playModeToggle() {
    this.play('modeToggle');
  }
}

// Create global sound manager instance
const soundManager = new SoundManager();

export default soundManager; 