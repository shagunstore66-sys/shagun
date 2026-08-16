/**
 * SHAGUN STORE - High-Fidelity Web Audio Synthesizer
 * Authentic Delivery Partner Alert Engine (Zomato & Swiggy Merchant Style)
 * - Ascending Marimba Arpeggio + Dual-Tone Siren Alert
 * - Hardware Audio DAC Unlocking for iOS Safari & Android Chrome
 * - Web Speech API Voice Synthesizer (English / Hindi / Kannada)
 */

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.unlocked = false;
    this.alarmInterval = null;
    this.setupGlobalUnlockListener();
  }

  setupGlobalUnlockListener() {
    const unlock = () => {
      this.init();
      try {
        if (this.ctx && this.ctx.state === 'running') {
          // Play silent warm-up pulse
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

  // Authentic Zomato / Swiggy Delivery Partner Order Ringtone
  playNewOrderChime(order = null) {
    try {
      this.init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;

      // Dynamics Compressor for maximum commercial loudness without clipping
      let dest = this.ctx.destination;
      try {
        const comp = this.ctx.createDynamicsCompressor();
        comp.threshold.setValueAtTime(-18, now);
        comp.knee.setValueAtTime(30, now);
        comp.ratio.setValueAtTime(16, now);
        comp.attack.setValueAtTime(0.002, now);
        comp.release.setValueAtTime(0.2, now);
        comp.connect(this.ctx.destination);
        dest = comp;
      } catch (e) {}

      // --- 1. Iconic Zomato Ascending Marimba Arpeggio ---
      const zomatoNotes = [
        { f: 587.33,  t: 0.00, dur: 0.14 }, // D5
        { f: 739.99,  t: 0.10, dur: 0.14 }, // F#5
        { f: 880.00,  t: 0.20, dur: 0.15 }, // A5
        { f: 1174.66, t: 0.32, dur: 0.18 }, // D6
        { f: 1479.98, t: 0.46, dur: 0.22 }, // F#6
        { f: 1760.00, t: 0.62, dur: 0.28 }, // A6
        { f: 2349.32, t: 0.82, dur: 0.45 }  // D7 (High Bell Climax)
      ];

      zomatoNotes.forEach(n => {
        const osc = this.ctx.createOscillator();
        const harm = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        harm.type = 'sine';
        osc.frequency.setValueAtTime(n.f, now + n.t);
        harm.frequency.setValueAtTime(n.f * 2, now + n.t);

        gain.gain.setValueAtTime(0, now);
        gain.gain.setValueAtTime(0.95, now + n.t);
        gain.gain.exponentialRampToValueAtTime(0.001, now + n.t + n.dur);

        osc.connect(gain);
        harm.connect(gain);
        gain.connect(dest);

        osc.start(now + n.t);
        harm.start(now + n.t);
        osc.stop(now + n.t + n.dur + 0.05);
        harm.stop(now + n.t + n.dur + 0.05);
      });

      // --- 2. Iconic Swiggy/Zomato Dual-Tone Urgent Siren Beep-Beep ---
      const sirenPulses = [
        { f: 2093.00, t: 1.25, dur: 0.09 }, // High
        { f: 1567.98, t: 1.38, dur: 0.09 }, // Low
        { f: 2093.00, t: 1.51, dur: 0.09 }, // High
        { f: 1567.98, t: 1.64, dur: 0.12 }  // Low
      ];

      sirenPulses.forEach(p => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(p.f, now + p.t);

        gain.gain.setValueAtTime(0, now);
        gain.gain.setValueAtTime(0.85, now + p.t);
        gain.gain.exponentialRampToValueAtTime(0.001, now + p.t + p.dur);

        osc.connect(gain);
        gain.connect(dest);

        osc.start(now + p.t);
        osc.stop(now + p.t + p.dur + 0.02);
      });

      // --- 3. Phone Haptic Vibration Pulse ---
      if (navigator.vibrate) {
        navigator.vibrate([250, 100, 250, 100, 500]);
      }

      // --- 4. Voice Announcement (Paytm/Soundbox style) ---
      if (order && order.token) {
        setTimeout(() => {
          this.announceNewOrderVoice(order.token, order.totalAmount);
        }, 1800);
      }
    } catch (e) {
      console.warn("Delivery partner chime error:", e);
    }
  }

  // Voice Announcement: "New Order! Token SG-..."
  announceNewOrderVoice(token, amount) {
    try {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const cleanToken = (token || '').replace('#', '');
        const text = `New Order received. Token ${cleanToken}. Amount ${amount} rupees.`;
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.05;
        utterance.pitch = 1.1;
        utterance.lang = 'en-IN';
        window.speechSynthesis.speak(utterance);
      }
    } catch (e) {}
  }

  // Continuous Swiggy/Zomato Alarm Loop until staff taps Accept
  startOrderAlarmLoop(order = null) {
    this.stopOrderAlarmLoop();
    this.playNewOrderChime(order);
    this.alarmInterval = setInterval(() => {
      this.playNewOrderChime(order);
    }, 2800);
  }

  stopOrderAlarmLoop() {
    if (this.alarmInterval) {
      clearInterval(this.alarmInterval);
      this.alarmInterval = null;
    }
    try {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    } catch (e) {}
  }

  // Customer Order Ready Fanfare (Ascending celebration)
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
        gain.gain.setValueAtTime(0.75, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + duration + 0.05);
      });
    } catch (e) {}
  }

  // UI Tap Click
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

      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.05);
    } catch (e) {}
  }

  // Soundbox Voice Announcement for Payment
  playPaymentSuccessSoundbox(amount, lang = 'hi') {
    try {
      this.init();
      if (this.ctx) {
        const now = this.ctx.currentTime;
        [1046.50, 1318.51, 1567.98, 2093.00].forEach((freq, i) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          const t = now + i * 0.08;
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, t);
          gain.gain.setValueAtTime(0.65, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.45);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(t);
          osc.stop(t + 0.5);
        });
      }

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
    } catch (e) {}
  }
}

const sounds = new SoundEngine();
if (typeof window !== 'undefined') {
  window.sounds = sounds;
  window.SoundEngine = SoundEngine;
}

export { sounds, SoundEngine };
export default sounds;
