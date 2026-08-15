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
      if (this.ctx && this.ctx.state === 'running') {
        this.unlocked = true;
        ['touchstart', 'touchend', 'mousedown', 'keydown', 'click'].forEach(evt => {
          document.removeEventListener(evt, unlock);
        });
      }
    };

    ['touchstart', 'touchend', 'mousedown', 'keydown', 'click'].forEach(evt => {
      document.addEventListener(evt, unlock, { once: false, passive: true });
    });
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  // Loud, distinctive double chime for Staff when a new order arrives
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
      gain1.gain.setValueAtTime(0.75, now);
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
      gain2.gain.setValueAtTime(0.85, now + 0.18);
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
      gain3.gain.setValueAtTime(0.8, now + 0.35);
      gain3.gain.exponentialRampToValueAtTime(0.001, now + 1.1);
      osc3.connect(gain3);
      gain3.connect(this.ctx.destination);
      osc3.start(now + 0.35);
      osc3.stop(now + 1.15);
    } catch (e) {
      console.warn("Audio chime error:", e);
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

  // Subtle tap click
  playTapSound() {
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.06);
    } catch (e) {}
  }
}

export const sounds = new SoundEngine();
