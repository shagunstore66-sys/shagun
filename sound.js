/**
 * SHAGUN STORE - Procedural Web Audio API Sound Synthesizer
 * Generates instant, clear sound alerts without any external audio asset dependencies.
 * Includes universal touch/click audio unlocking for iOS Safari and Android Chrome.
 */

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.unlocked = false;
    this.setupGlobalUnlockListener();
  }

  setupGlobalUnlockListener() {
    const unlock = () => {
      this.init();
      try {
        if (this.ctx && this.ctx.state === 'running') {
          // Play silent pulse to warm up mobile hardware audio DAC
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          gain.gain.value = 0.001;
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(0);
          osc.stop(0.01);
          this.unlocked = true;
        }
      } catch (e) {}
    };

    ['touchstart', 'touchend', 'pointerdown', 'mousedown', 'keydown', 'click'].forEach(evt => {
      window.addEventListener(evt, unlock, { once: false, passive: true });
    });
  }

  init() {
    try {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx({ latencyHint: 'interactive' });
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
    } catch (e) {}
  }

  // Loud, distinctive triple chime for Staff when a new order arrives
  playNewOrderChime() {
    try {
      this.init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;

      // Note 1 (High bell)
      const osc1 = this.ctx.createOscillator();
      const gain1 = this.ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(880, now); // A5
      osc1.frequency.exponentialRampToValueAtTime(1046.5, now + 0.08); // C6
      gain1.gain.setValueAtTime(0.9, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
      osc1.connect(gain1);
      gain1.connect(this.ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.55);

      // Note 2 (Second tone after 180ms)
      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(1318.51, now + 0.18); // E6
      gain2.gain.setValueAtTime(0, now);
      gain2.gain.setValueAtTime(0.95, now + 0.18);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
      osc2.connect(gain2);
      gain2.connect(this.ctx.destination);
      osc2.start(now + 0.18);
      osc2.stop(now + 0.85);

      // Note 3 (Confirming chime)
      const osc3 = this.ctx.createOscillator();
      const gain3 = this.ctx.createGain();
      osc3.type = 'triangle';
      osc3.frequency.setValueAtTime(1760, now + 0.35); // A6
      gain3.gain.setValueAtTime(0, now);
      gain3.gain.setValueAtTime(0.9, now + 0.35);
      gain3.gain.exponentialRampToValueAtTime(0.001, now + 1.1);
      osc3.connect(gain3);
      gain3.connect(this.ctx.destination);
      osc3.start(now + 0.35);
      osc3.stop(now + 1.15);
    } catch (e) {
      console.warn("Audio chime error:", e);
    }
  }

  // Continuous Swiggy/Zomato style ringing alarm for Staff until accepted
  startOrderAlarmLoop() {
    this.stopOrderAlarmLoop();
    this.playNewOrderChime();
    this.alarmInterval = setInterval(() => {
      this.playNewOrderChime();
    }, 3500);
  }

  stopOrderAlarmLoop() {
    if (this.alarmInterval) {
      clearInterval(this.alarmInterval);
      this.alarmInterval = null;
    }
  }

  // Celebratory ascending fanfare when Customer's order is Packed & Ready for Pickup
  playOrderReadyFanfare() {
    try {
      this.init();
      if (!this.ctx) return;

      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      const now = this.ctx.currentTime;

      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const startTime = now + idx * 0.11;
        const duration = idx === notes.length - 1 ? 0.8 : 0.25;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime);
        gain.gain.setValueAtTime(0, now);
        gain.gain.setValueAtTime(0.7, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + duration + 0.05);
      });
    } catch (e) {
      console.warn("Audio fanfare error:", e);
    }
  }

  // Subtle, pleasant micro-haptic audio tap for buttons, pills and cards
  playTapSound() {
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.04);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.05);
    } catch (e) {
      // Graceful fallback
    }
  }

  // Cash register chime + Paytm/PhonePe style voice announcement
  playPaymentSuccessSoundbox(amount, lang = 'hi') {
    try {
      this.init();
      if (this.ctx) {
        const now = this.ctx.currentTime;
        // Cash register dual chime (High bell)
        [1046.50, 1318.51, 1567.98, 2093.00].forEach((freq, i) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          const t = now + i * 0.08;
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, t);
          gain.gain.setValueAtTime(0.6, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.45);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(t);
          osc.stop(t + 0.5);
        });
      }

      // Voice Soundbox Announcement (Web Speech API)
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        let text = `Shagun Store par ${amount} rupaye praapt hue.`;
        let voiceLang = 'hi-IN';
        if (lang === 'kn') {
          text = `Shagun Store nalli ${amount} roopayi sweekarisalaagide.`;
          voiceLang = 'kn-IN';
        } else if (lang === 'en') {
          text = `Received rupees ${amount} on Shagun Store.`;
          voiceLang = 'en-IN';
        }
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = voiceLang;
        utterance.rate = 1.0;
        utterance.pitch = 1.05;
        setTimeout(() => {
          window.speechSynthesis.speak(utterance);
        }, 300);
      }
    } catch (e) {
      console.warn("Soundbox announcement error:", e);
    }
  }
const sounds = new SoundEngine();
if (typeof window !== 'undefined') {
  window.sounds = sounds;
  window.SoundEngine = SoundEngine;
}

export { sounds, SoundEngine };
export default sounds;
