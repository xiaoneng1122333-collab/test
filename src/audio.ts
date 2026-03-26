export class AudioManager {
  private static audioContext: AudioContext | null = null;
  private static initialized = false;

  static initialize() {
    if (this.initialized) return;

    try {
      // Initialize audio context
      const AudioContextClass = (window as any).AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        this.audioContext = new AudioContextClass();
        this.initialized = true;
      }
    } catch (e) {
      console.warn('AudioContext not supported in this browser');
    }
  }

  static playSound(frequency: number, duration: number, type: 'click' | 'win' | 'lose' = 'click') {
    if (!this.audioContext || !this.initialized) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    switch (type) {
      case 'click':
        oscillator.frequency.value = frequency;
        oscillator.type = 'sine';
        gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
        break;

      case 'win':
        oscillator.frequency.setValueAtTime(523.25, this.audioContext.currentTime); // C5
        oscillator.frequency.exponentialRampToValueAtTime(1046.50, this.audioContext.currentTime + duration); // C6
        oscillator.type = 'sine';
        gainNode.gain.setValueAtTime(0.15, this.audioContext.currentTime);
        break;

      case 'lose':
        oscillator.frequency.setValueAtTime(220, this.audioContext.currentTime); // A3
        oscillator.frequency.exponentialRampToValueAtTime(110, this.audioContext.currentTime + duration); // A2
        oscillator.type = 'sawtooth';
        gainNode.gain.setValueAtTime(0.15, this.audioContext.currentTime);
        break;
    }

    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + duration);
  }

  static playClick() {
    this.playSound(800, 0.1, 'click');
  }

  static playCardSound() {
    // Create a realistic card dealing sound - multiple layers for complexity
    if (!this.audioContext || !this.initialized) return;

    const now = this.audioContext.currentTime;

    // Layer 1: Main card "flick" sound
    const oscillator1 = this.audioContext.createOscillator();
    const gainNode1 = this.audioContext.createGain();
    const filter1 = this.audioContext.createBiquadFilter();

    oscillator1.connect(filter1);
    filter1.connect(gainNode1);
    gainNode1.connect(this.audioContext.destination);

    // Card dealing - short, crisp "flick"
    oscillator1.frequency.setValueAtTime(1200, now);
    oscillator1.frequency.exponentialRampToValueAtTime(300, now + 0.15);
    oscillator1.type = 'square';

    // Highpass filter for paper-like quality
    filter1.type = 'highpass';
    filter1.frequency.value = 800;

    gainNode1.gain.setValueAtTime(0.1, now);
    gainNode1.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

    oscillator1.start(now);
    oscillator1.stop(now + 0.15);

    // Layer 2: Secondary "slap" sound for more realism
    const oscillator2 = this.audioContext.createOscillator();
    const gainNode2 = this.audioContext.createGain();

    oscillator2.connect(gainNode2);
    gainNode2.connect(this.audioContext.destination);

    oscillator2.frequency.setValueAtTime(400, now + 0.05);
    oscillator2.frequency.exponentialRampToValueAtTime(100, now + 0.1);
    oscillator2.type = 'sine';

    gainNode2.gain.setValueAtTime(0.05, now + 0.05);
    gainNode2.gain.exponentialRampToValueAtTime(0.01, now + 0.1);

    oscillator2.start(now + 0.05);
    oscillator2.stop(now + 0.1);
  }

  static playBetSound() {
    // Create a realistic casino chip/money sound - layered approach
    if (!this.audioContext || !this.initialized) return;

    const now = this.audioContext.currentTime;

    // Layer 1: Primary chip "clink"
    const oscillator1 = this.audioContext.createOscillator();
    const gainNode1 = this.audioContext.createGain();
    const filter1 = this.audioContext.createBiquadFilter();

    oscillator1.connect(filter1);
    filter1.connect(gainNode1);
    gainNode1.connect(this.audioContext.destination);

    // Metallic chip sound with multiple frequency harmonics
    oscillator1.frequency.setValueAtTime(800, now);
    oscillator1.frequency.setValueAtTime(1200, now + 0.01);
    oscillator1.frequency.setValueAtTime(600, now + 0.03);
    oscillator1.type = 'triangle';

    // Bandpass filter for metallic resonance
    filter1.type = 'bandpass';
    filter1.frequency.value = 800;
    filter1.Q.value = 8;

    gainNode1.gain.setValueAtTime(0.2, now);
    gainNode1.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

    oscillator1.start(now);
    oscillator1.stop(now + 0.08);

    // Layer 2: Secondary metallic ring
    const oscillator2 = this.audioContext.createOscillator();
    const gainNode2 = this.audioContext.createGain();
    const filter2 = this.audioContext.createBiquadFilter();

    oscillator2.connect(filter2);
    filter2.connect(gainNode2);
    gainNode2.connect(this.audioContext.destination);

    oscillator2.frequency.setValueAtTime(1000, now + 0.02);
    oscillator2.frequency.exponentialRampToValueAtTime(400, now + 0.08);
    oscillator2.type = 'triangle';

    filter2.type = 'bandpass';
    filter2.frequency.value = 1000;
    filter2.Q.value = 12;

    gainNode2.gain.setValueAtTime(0.1, now + 0.02);
    gainNode2.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

    oscillator2.start(now + 0.02);
    oscillator2.stop(now + 0.08);
  }

  static playWinSound() {
    this.playSound(523.25, 0.3, 'win');
  }

  static playLoseSound() {
    this.playSound(220, 0.3, 'lose');
  }
}