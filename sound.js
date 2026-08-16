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

  // Commercial Merchant Siren (Blinkit / Swiggy / Zomato Partner Terminal Style)
  playNewOrderChime() {
    try {
      this.init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;

      // Master Compressor for maximum loudness without distortion
      let dest = this.ctx.destination;
      try {
        const comp = this.ctx.createDynamicsCompressor();
        comp.threshold.setValueAtTime(-15, now);
        comp.knee.setValueAtTime(30, now);
        comp.ratio.setValueAtTime(12, now);
        comp.attack.setValueAtTime(0.002, now);
        comp.release.setValueAtTime(0.2, now);
        comp.connect(this.ctx.destination);
        dest = comp;
      } catch (e) {}

      // --- Part 1: Punchy Ascending Urgent Siren Chime ---
      const sirenChirps = [
        { f1: 880, f2: 1174.66, t: 0.00, dur: 0.12, type: 'triangle' }, // A5 -> D6
        { f1: 1174.66, f2: 1567.98, t: 0.13, dur: 0.14, type: 'sine' },     // D6 -> G6
        { f1: 1567.98, f2: 2093.00, t: 0.28, dur: 0.18, type: 'triangle' }, // G6 -> C7
        { f1: 2093.00, f2: 2637.02, t: 0.47, dur: 0.25, type: 'sine' }      // C7 -> E7 (Peak)
      ];

      sirenChirps.forEach(c => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = c.type;
        osc.frequency.setValueAtTime(c.f1, now + c.t);
        osc.frequency.exponentialRampToValueAtTime(c.f2, now + c.t + c.dur * 0.85);

        gain.gain.setValueAtTime(0, now);
        gain.gain.setValueAtTime(0.95, now + c.t);
        gain.gain.exponentialRampToValueAtTime(0.001, now + c.t + c.dur);

        osc.connect(gain);
        gain.connect(dest);
        osc.start(now + c.t);
        osc.stop(now + c.t + c.dur + 0.05);
      });

      // --- Part 2: Rapid Dual-Tone Alarm Staccato (The iconic Delivery Partner Beep-Beep) ---
      const beeps = [
        { f: 1760.00, t: 0.76, dur: 0.09 }, // High
        { f: 1318.51, t: 0.88, dur: 0.09 }, // Low
        { f: 1760.00, t: 1.00, dur: 0.09 }, // High
        { f: 1318.51, t: 1.12, dur: 0.12 }  // Low resolve
      ];

      beeps.forEach(b => {
        const osc = this.ctx.createOscillator();
        const subOsc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        subOsc.type = 'sine';
        osc.frequency.setValueAtTime(b.f, now + b.t);
        subOsc.frequency.setValueAtTime(b.f / 2, now + b.t);

        gain.gain.setValueAtTime(0, now);
        gain.gain.setValueAtTime(0.85, now + b.t);
        gain.gain.exponentialRampToValueAtTime(0.001, now + b.t + b.dur);

        osc.connect(gain);
        subOsc.connect(gain);
        gain.connect(dest);

        osc.start(now + b.t);
        subOsc.start(now + b.t);
        osc.stop(now + b.t + b.dur + 0.02);
        subOsc.stop(now + b.t + b.dur + 0.02);
      });

      // Part 3: Haptic motor vibration pulse
      if (navigator.vibrate) {
        navigator.vibrate([200, 80, 200, 80, 400]);
      }
    } catch (e) {
      console.warn("Delivery siren error:", e);
    }
  }

  // Continuous Swiggy/Zomato/Blinkit style ringing siren alarm for Staff until accepted
  startOrderAlarmLoop() {
    this.stopOrderAlarmLoop();
    this.playNewOrderChime();
    this.alarmInterval = setInterval(() => {
      this.playNewOrderChime();
    }, 2200);
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
}

const sounds = new SoundEngine();
if (typeof window !== 'undefined') {
  window.sounds = sounds;
  window.SoundEngine = SoundEngine;
}

export { sounds, SoundEngine };
export default sounds;
