/**
 * ============================================================================
 * ROMANTIC BIRTHDAY SURPRISE - SCRIPT (VANILLA JAVASCRIPT)
 * Features:
 *   1. Canvas Particle System (Floating Hearts, Rose Petals, Twinkling Stars, Cursor Trail)
 *   2. Romantic Web Audio API Synthesizer (Generative Piano Melodies & Chimes) + Custom Audio Support
 *   3. Interactive 3D Cake with Blowable Candles & Smoke Puff
 *   4. Realistic 3D Envelope & Typewriter Animation for Love Letter
 *   5. Photo Memories Gallery with Local Storage & Fullscreen Lightbox
 *   6. Mystery Gift Chest with Interactive Love Coupons & Confetti
 *   7. Customization Engine with Shareable URL Generation & Local Storage
 * ============================================================================
 */

(function () {
  'use strict';

  // --------------------------------------------------------------------------
  // 1. Default Configuration & State Management
  // --------------------------------------------------------------------------
  const DEFAULT_CONFIG = {
    recipientName: "Gulu Gulu",
    senderName: "Yours Forever",
    greetingTitle: "Hey Gulu Gulu ❤️",
    greetingSubtitle: "Someone has a special surprise just for you...",
    birthdayHeadline: "Happy Birthday, Gulu Gulu! 🎂",
    letterGreeting: "Gulu Gulu ❤️,",
    letterBody: "Oyeeeee Panditayin Jiiiiiiii! 🥹❤️🎀\n\nJanamdin ki dher saari shubhkaamnayein! 😂💗 Bhagwan aapki zindagi ko khushiyon, pyaar, sukoon aur endless success se bhar de. Aapki har wish poori ho, chehre par hamesha ye pyaari si smile bani rahe aur life mein kabhi kisi cheez ki kami na ho. 🧿✨\n\nAise hi hasti-muskurati rahiye, thodi si pagal aur bahut saari pyaari banate rahiye! 😂❤️\n\nMay this year bring you countless beautiful memories, unexpected surprises and everything your heart wishes for.\n\nHappiest Birthday, Panditayin Jiiiiiiii! 🎂🥳❤️",
    letterSignoff: "Forever & Always With All My Love,",
    specialSurpriseMessage: "My heart is, and will always be, entirely yours. Today, tomorrow, and through all our tomorrows together.",
    customMusicUrl: ""
  };

  // State container
  const state = {
    config: { ...DEFAULT_CONFIG },
    audioPlaying: false,
    candlesLit: true,
    envelopeOpened: false,
    letterTyped: false,
    typewriterTimer: null,
    giftChestOpened: false,
    sparklesEnabled: true
  };

  // --------------------------------------------------------------------------
  // 2. Pre-loaded Romantic Artwork for Gallery (SVG Data URIs)
  // --------------------------------------------------------------------------
  // Elegant vector illustrations depicting romantic memories
  const DEFAULT_MEMORIES = [
    {
      id: "mem-1",
      title: "Our First Date",
      date: "The Day Magic Began",
      liked: true,
      url: "data:image/svg+xml;utf8," + encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" width="600" height="450" viewBox="0 0 600 450">
          <defs>
            <linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#2b1055"/>
              <stop offset="50%" stop-color="#7597de"/>
              <stop offset="100%" stop-color="#ff758c"/>
            </linearGradient>
            <radialGradient id="moon" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="#ffffff"/>
              <stop offset="100%" stop-color="#ffe3ec"/>
            </radialGradient>
          </defs>
          <rect width="600" height="450" fill="url(#g1)"/>
          <circle cx="480" cy="110" r="45" fill="url(#moon)" opacity="0.9" filter="drop-shadow(0 0 20px #fff)"/>
          <!-- Starlit silhouette hills -->
          <path d="M0,450 Q180,320 380,410 T600,380 L600,450 Z" fill="#150529"/>
          <!-- Romantic bench with two silhouettes holding hands -->
          <rect x="250" y="340" width="100" height="8" rx="3" fill="#ff758c"/>
          <rect x="260" y="348" width="6" height="25" fill="#ff758c"/>
          <rect x="334" y="348" width="6" height="25" fill="#ff758c"/>
          <!-- Figures -->
          <circle cx="280" cy="305" r="14" fill="#fce4ec"/>
          <circle cx="315" cy="308" r="13" fill="#fce4ec"/>
          <path d="M268,335 C270,318 290,318 292,335 Z" fill="#fce4ec"/>
          <path d="M305,335 C307,320 325,320 327,335 Z" fill="#fce4ec"/>
          <path d="M292,325 Q300,322 305,325" stroke="#fce4ec" stroke-width="4" stroke-linecap="round"/>
          <text x="300" y="270" text-anchor="middle" fill="#ffd166" font-size="28" font-family="serif">✨ ❤️ ✨</text>
        </svg>
      `)
    },
    {
      id: "mem-2",
      title: "Sunset Strolls",
      date: "Every Step With You",
      liked: true,
      url: "data:image/svg+xml;utf8," + encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" width="600" height="450" viewBox="0 0 600 450">
          <defs>
            <linearGradient id="sunset" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#ff758c"/>
              <stop offset="35%" stop-color="#ff7eb3"/>
              <stop offset="70%" stop-color="#fbc2eb"/>
              <stop offset="100%" stop-color="#ffd166"/>
            </linearGradient>
          </defs>
          <rect width="600" height="450" fill="url(#sunset)"/>
          <circle cx="300" cy="220" r="60" fill="#fff9c4" opacity="0.85"/>
          <!-- Sea & reflections -->
          <rect y="280" width="600" height="170" fill="#764ba2" opacity="0.75"/>
          <path d="M0,280 Q150,275 300,280 T600,278" stroke="#ffd166" stroke-width="4" fill="none" opacity="0.6"/>
          <!-- Couple walking on shore -->
          <circle cx="285" cy="310" r="13" fill="#200122"/>
          <circle cx="312" cy="315" r="12" fill="#200122"/>
          <path d="M275,355 C275,325 295,325 295,355" fill="#200122"/>
          <path d="M303,355 C303,330 321,330 321,355" fill="#200122"/>
          <text x="300" y="100" text-anchor="middle" fill="#ffffff" font-size="22" font-family="serif" letter-spacing="2">GOLDEN HOUR DREAMS</text>
        </svg>
      `)
    },
    {
      id: "mem-3",
      title: "Late Night Talks",
      date: "Lost In Your Voice",
      liked: true,
      url: "data:image/svg+xml;utf8," + encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" width="600" height="450" viewBox="0 0 600 450">
          <defs>
            <linearGradient id="night" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#0f0c29"/>
              <stop offset="50%" stop-color="#302b63"/>
              <stop offset="100%" stop-color="#24243e"/>
            </linearGradient>
          </defs>
          <rect width="600" height="450" fill="url(#night)"/>
          <!-- Window frame with stars -->
          <rect x="80" y="60" width="440" height="300" rx="16" fill="rgba(255,255,255,0.06)" stroke="#ff758c" stroke-width="3"/>
          <line x1="300" y1="60" x2="300" y2="360" stroke="#ff758c" stroke-width="2"/>
          <line x1="80" y1="210" x2="520" y2="210" stroke="#ff758c" stroke-width="2"/>
          <!-- Moon and constellations -->
          <circle cx="210" cy="140" r="28" fill="#ffeaa7"/>
          <text x="300" y="415" text-anchor="middle" fill="#fbc2eb" font-size="20" font-family="serif">"Hours feel like seconds with you..."</text>
        </svg>
      `)
    },
    {
      id: "mem-4",
      title: "Cozy Coffee Mornings",
      date: "Warmth & Hugs",
      liked: true,
      url: "data:image/svg+xml;utf8," + encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" width="600" height="450" viewBox="0 0 600 450">
          <defs>
            <linearGradient id="cozy" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#ff9a9e"/>
              <stop offset="99%" stop-color="#fecfef"/>
            </linearGradient>
          </defs>
          <rect width="600" height="450" fill="url(#cozy)"/>
          <!-- Two coffee cups with heart steam -->
          <rect x="180" y="240" width="90" height="100" rx="12" fill="#ffffff" filter="drop-shadow(0 8px 16px rgba(0,0,0,0.2))"/>
          <rect x="330" y="240" width="90" height="100" rx="12" fill="#ffffff" filter="drop-shadow(0 8px 16px rgba(0,0,0,0.2))"/>
          <path d="M270,265 C295,265 295,305 270,305" stroke="#ffffff" stroke-width="8" fill="none" stroke-linecap="round"/>
          <path d="M420,265 C445,265 445,305 420,305" stroke="#ffffff" stroke-width="8" fill="none" stroke-linecap="round"/>
          <!-- Heart in latte foam -->
          <text x="225" y="300" text-anchor="middle" font-size="34">☕</text>
          <text x="375" y="300" text-anchor="middle" font-size="34">☕</text>
          <text x="300" y="180" text-anchor="middle" fill="#d81b60" font-size="45">❤️</text>
          <text x="300" y="390" text-anchor="middle" fill="#4a0e4e" font-size="22" font-family="serif">SWEETEST MORNINGS</text>
        </svg>
      `)
    },
    {
      id: "mem-5",
      title: "Adventures & Roadtrips",
      date: "Anywhere As Long As It's You",
      liked: true,
      url: "data:image/svg+xml;utf8," + encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" width="600" height="450" viewBox="0 0 600 450">
          <defs>
            <linearGradient id="road" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#a18cd1"/>
              <stop offset="100%" stop-color="#fbc2eb"/>
            </linearGradient>
          </defs>
          <rect width="600" height="450" fill="url(#road)"/>
          <!-- Mountains -->
          <polygon points="120,300 240,150 360,300" fill="#6a11cb" opacity="0.6"/>
          <polygon points="260,320 400,120 540,320" fill="#2575fc" opacity="0.5"/>
          <!-- Winding road -->
          <path d="M300,240 Q320,320 300,450" stroke="#ffffff" stroke-width="40" fill="none" opacity="0.9"/>
          <path d="M300,240 Q320,320 300,450" stroke="#ffd166" stroke-width="4" stroke-dasharray="15,10" fill="none"/>
          <text x="300" y="90" text-anchor="middle" fill="#200122" font-size="26" font-family="serif">FOREVER ADVENTURES</text>
        </svg>
      `)
    },
    {
      id: "mem-6",
      title: "Laughing at Silly Jokes",
      date: "My Favorite Smile",
      liked: true,
      url: "data:image/svg+xml;utf8," + encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" width="600" height="450" viewBox="0 0 600 450">
          <defs>
            <linearGradient id="laugh" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#ff758c"/>
              <stop offset="100%" stop-color="#ff7eb3"/>
            </linearGradient>
          </defs>
          <rect width="600" height="450" fill="url(#laugh)"/>
          <circle cx="300" cy="225" r="140" fill="rgba(255,255,255,0.15)"/>
          <text x="300" y="240" text-anchor="middle" font-size="80">✨💖✨</text>
          <text x="300" y="330" text-anchor="middle" fill="#ffffff" font-size="24" font-family="serif">Pure Joy In Every Second</text>
        </svg>
      `)
    }
  ];

  // --------------------------------------------------------------------------
  // 3. Web Audio API - Romantic Synthesizer & Music Box Engine
  // --------------------------------------------------------------------------
  class RomanticAudioEngine {
    constructor() {
      this.ctx = null;
      this.isPlaying = false;
      this.timer = null;
      this.currentNoteIndex = 0;
      this.customAudio = null;

      // Romantic chord melody frequencies (Canon / Reverie inspired arpeggios in C Major & A Minor)
      // Notes: C4, E4, G4, B4, C5, D5, E5, G5, A4, F4
      this.melody = [
        { note: 261.63, dur: 0.6 }, // C4
        { note: 329.63, dur: 0.6 }, // E4
        { note: 392.00, dur: 0.6 }, // G4
        { note: 493.88, dur: 0.8 }, // B4 (Cmaj7)
        { note: 523.25, dur: 1.2 }, // C5
        { note: 392.00, dur: 0.6 }, // G4
        { note: 329.63, dur: 0.6 }, // E4
        { note: 293.66, dur: 0.8 }, // D4

        { note: 220.00, dur: 0.6 }, // A3
        { note: 261.63, dur: 0.6 }, // C4
        { note: 329.63, dur: 0.6 }, // E4
        { note: 440.00, dur: 0.8 }, // A4 (Am7)
        { note: 392.00, dur: 1.2 }, // G4
        { note: 329.63, dur: 0.6 }, // E4
        { note: 261.63, dur: 0.8 }, // C4

        { note: 174.61, dur: 0.6 }, // F3
        { note: 261.63, dur: 0.6 }, // C4
        { note: 329.63, dur: 0.6 }, // E4
        { note: 349.23, dur: 0.8 }, // F4 (Fmaj7)
        { note: 392.00, dur: 1.2 }, // G4
        { note: 329.63, dur: 0.6 }, // E4
        { note: 261.63, dur: 0.8 }, // C4

        { note: 196.00, dur: 0.6 }, // G3
        { note: 246.94, dur: 0.6 }, // B3
        { note: 293.66, dur: 0.6 }, // D4
        { note: 392.00, dur: 1.0 }, // G4
        { note: 493.88, dur: 1.4 }  // B4
      ];
    }

    initContext() {
      if (!this.ctx) {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (AudioContextClass) {
          this.ctx = new AudioContextClass();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    playTone(freq, duration, type = 'sine', gainVal = 0.15) {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      // Soft music box / Rhodes warm harmonics
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      // Delicate acoustic envelope: soft attack, gentle decay
      gain.gain.setValueAtTime(0, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(gainVal, this.ctx.currentTime + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    }

    playSparkleChime() {
      this.initContext();
      if (!this.ctx) return;
      const chimes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      chimes.forEach((f, i) => {
        setTimeout(() => {
          this.playTone(f, 0.8, 'sine', 0.1);
        }, i * 70);
      });
    }

    playCandleBlowSound() {
      this.initContext();
      if (!this.ctx) return;
      // White noise / breath puff sound
      const bufferSize = this.ctx.sampleRate * 0.4;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, this.ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(100, this.ctx.currentTime + 0.4);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.4);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);
      noise.start();
    }

    startMelodyLoop() {
      if (this.isPlaying) return;
      this.initContext();
      this.isPlaying = true;
      this.scheduleNextNote();
    }

    scheduleNextNote() {
      if (!this.isPlaying) return;
      const step = this.melody[this.currentNoteIndex];
      // Play warm fundamental and soft harmonic octave
      this.playTone(step.note, step.dur * 1.5, 'sine', 0.12);
      this.playTone(step.note * 2, step.dur, 'triangle', 0.03);

      this.currentNoteIndex = (this.currentNoteIndex + 1) % this.melody.length;
      this.timer = setTimeout(() => {
        this.scheduleNextNote();
      }, step.dur * 1000);
    }

    stopMelodyLoop() {
      this.isPlaying = false;
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
    }

    toggle() {
      if (state.config.customMusicUrl) {
        // Handle custom audio file/stream
        if (!this.customAudio) {
          this.customAudio = new Audio(state.config.customMusicUrl);
          this.customAudio.loop = true;
        }
        if (this.isPlaying) {
          this.customAudio.pause();
          this.isPlaying = false;
        } else {
          this.customAudio.play().catch(() => {
            // Fallback to synth if custom audio fails
            this.startMelodyLoop();
          });
          this.isPlaying = true;
        }
      } else {
        if (this.isPlaying) {
          this.stopMelodyLoop();
        } else {
          this.startMelodyLoop();
        }
      }
      return this.isPlaying;
    }
  }

  const audioEngine = new RomanticAudioEngine();

  // --------------------------------------------------------------------------
  // 4. Canvas Particle Engine (Floating Hearts, Rose Petals, Twinkles & Trail)
  // --------------------------------------------------------------------------
  class ParticleEngine {
    constructor(canvasId) {
      this.canvas = document.getElementById(canvasId);
      if (!this.canvas) return;
      this.ctx = this.canvas.getContext('2d');
      this.particles = [];
      this.confetti = [];
      this.mouseTrail = [];
      this.width = window.innerWidth;
      this.height = window.innerHeight;

      this.init();
    }

    init() {
      this.resize();
      window.addEventListener('resize', () => this.resize());

      // Create fixed pool of ambient particles (hearts, petals, stars)
      const count = window.innerWidth < 768 ? 25 : 45;
      for (let i = 0; i < count; i++) {
        this.particles.push(this.createParticle(true));
      }

      // Mouse/touch sparkles
      window.addEventListener('mousemove', (e) => this.addTrail(e.clientX, e.clientY));
      window.addEventListener('touchmove', (e) => {
        if (e.touches && e.touches[0]) {
          this.addTrail(e.touches[0].clientX, e.touches[0].clientY);
        }
      });

      this.animate();
    }

    resize() {
      this.width = window.innerWidth;
      this.height = window.innerHeight;
      this.canvas.width = this.width;
      this.canvas.height = this.height;
    }

    createParticle(randomY = false) {
      const types = ['heart', 'petal', 'star'];
      const type = types[Math.floor(Math.random() * types.length)];
      return {
        x: Math.random() * this.width,
        y: randomY ? Math.random() * this.height : this.height + 20,
        size: Math.random() * 12 + 8,
        speedY: -(Math.random() * 0.8 + 0.3),
        speedX: (Math.random() - 0.5) * 0.5,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.02,
        opacity: Math.random() * 0.5 + 0.25,
        type: type,
        color: type === 'heart'
          ? (Math.random() > 0.5 ? '#ff758c' : '#ff4b6e')
          : (type === 'petal' ? '#fda085' : '#ffd166')
      };
    }

    addTrail(x, y) {
      if (!state.sparklesEnabled) return;
      if (this.mouseTrail.length > 20) this.mouseTrail.shift();
      this.mouseTrail.push({
        x: x + (Math.random() - 0.5) * 10,
        y: y + (Math.random() - 0.5) * 10,
        size: Math.random() * 8 + 5,
        opacity: 0.9,
        life: 1
      });
    }

    drawHeart(x, y, size, color, opacity, rotation) {
      const ctx = this.ctx;
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);
      ctx.globalAlpha = opacity;
      ctx.fillStyle = color;
      ctx.beginPath();
      const topCurveHeight = size * 0.3;
      ctx.moveTo(0, topCurveHeight);
      ctx.bezierCurveTo(0, 0, -size / 2, 0, -size / 2, topCurveHeight);
      ctx.bezierCurveTo(-size / 2, (size + topCurveHeight) / 2, 0, size * 0.85, 0, size);
      ctx.bezierCurveTo(0, size * 0.85, size / 2, (size + topCurveHeight) / 2, size / 2, topCurveHeight);
      ctx.bezierCurveTo(size / 2, 0, 0, 0, 0, topCurveHeight);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }

    drawPetal(x, y, size, color, opacity, rotation) {
      const ctx = this.ctx;
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);
      ctx.globalAlpha = opacity;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.ellipse(0, 0, size * 0.4, size * 0.8, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    drawStar(x, y, size, opacity) {
      const ctx = this.ctx;
      ctx.save();
      ctx.translate(x, y);
      ctx.globalAlpha = opacity;
      ctx.fillStyle = '#ffd166';
      ctx.beginPath();
      ctx.arc(0, 0, size * 0.25, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    animate() {
      requestAnimationFrame(() => this.animate());
      this.ctx.clearRect(0, 0, this.width, this.height);

      if (!state.sparklesEnabled) return;

      // 1. Draw bounded ambient particles
      for (let i = 0; i < this.particles.length; i++) {
        const p = this.particles[i];
        p.y += p.speedY;
        p.x += p.speedX;
        p.rotation += p.rotSpeed;

        if (p.type === 'heart') {
          this.drawHeart(p.x, p.y, p.size, p.color, p.opacity, p.rotation);
        } else if (p.type === 'petal') {
          this.drawPetal(p.x, p.y, p.size, p.color, p.opacity, p.rotation);
        } else {
          this.drawStar(p.x, p.y, p.size, p.opacity);
        }

        // Reset if moved offscreen
        if (p.y < -30 || p.x < -30 || p.x > this.width + 30) {
          this.particles[i] = this.createParticle(false);
        }
      }

      // 2. Draw temporary confetti bursts (which expire cleanly)
      for (let i = 0; i < this.confetti.length; i++) {
        const c = this.confetti[i];
        c.x += c.speedX;
        c.y += c.speedY;
        c.speedY += 0.15; // gentle gravity
        c.rotation += c.rotSpeed;
        c.life -= 0.016;

        if (c.life > 0) {
          const alpha = Math.max(0, c.life);
          if (c.type === 'heart') {
            this.drawHeart(c.x, c.y, c.size, c.color, alpha, c.rotation);
          } else {
            this.drawPetal(c.x, c.y, c.size, c.color, alpha, c.rotation);
          }
        }
      }
      this.confetti = this.confetti.filter(c => c.life > 0);

      // 3. Draw interactive touch/cursor trail
      for (let i = 0; i < this.mouseTrail.length; i++) {
        const t = this.mouseTrail[i];
        t.y -= 0.8;
        t.opacity -= 0.04;
        if (t.opacity > 0) {
          this.drawHeart(t.x, t.y, t.size, '#ffd166', t.opacity, 0);
        }
      }
      this.mouseTrail = this.mouseTrail.filter(t => t.opacity > 0);
    }

    burstConfetti(originX, originY) {
      const colors = ['#ff758c', '#ffd166', '#a18cd1', '#ff4b6e', '#fbc2eb', '#ffffff'];
      for (let i = 0; i < 35; i++) {
        const angle = Math.random() * Math.PI * 2;
        const velocity = Math.random() * 6 + 3;
        this.confetti.push({
          x: originX,
          y: originY,
          size: Math.random() * 10 + 6,
          speedX: Math.cos(angle) * velocity,
          speedY: Math.sin(angle) * velocity - 2,
          rotation: Math.random() * Math.PI,
          rotSpeed: (Math.random() - 0.5) * 0.1,
          life: 1.0,
          type: Math.random() > 0.4 ? 'heart' : 'petal',
          color: colors[Math.floor(Math.random() * colors.length)]
        });
      }
    }
  }

  let particleEngine = null;

  // --------------------------------------------------------------------------
  // 5. DOM Initialization & Event Handlers
  // --------------------------------------------------------------------------
  function initApp() {
    loadSavedOrUrlConfig();
    particleEngine = new ParticleEngine('ambient-canvas');

    renderDynamicContent();
    setupNavigation();
    setupMusicControls();
    setupStageInteractions();
    setupMemoriesGallery();
    setupSpecialSurpriseChest();
    setupLightbox();

    console.log("Romantic Birthday Surprise app initialized successfully! ❤️");
  }

  // --------------------------------------------------------------------------
  // 6. Configuration Management (URL Hash & LocalStorage)
  // --------------------------------------------------------------------------
  function loadSavedOrUrlConfig() {
    // 1. Check URL parameters for shareable gifts (e.g., ?c=... or #config=...)
    const urlParams = new URLSearchParams(window.location.search);
    const hashParam = window.location.hash.replace('#', '');
    const encodedData = urlParams.get('c') || (hashParam.startsWith('config=') ? hashParam.replace('config=', '') : null);

    if (encodedData) {
      try {
        const decoded = JSON.parse(decodeURIComponent(atob(encodedData)));
        state.config = { ...DEFAULT_CONFIG, ...decoded };
        return;
      } catch (err) {
        console.warn("Could not decode shareable link config", err);
      }
    }

    // 2. Fall back to LocalStorage if user previously customized
    try {
      const saved = localStorage.getItem('romantic_birthday_surprise_config');
      if (saved) {
        state.config = { ...DEFAULT_CONFIG, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.warn("LocalStorage access restricted or unavailable", e);
    }
  }

  // --------------------------------------------------------------------------
  // 7. Dynamic Text & Headline Rendering
  // --------------------------------------------------------------------------
  function renderDynamicContent() {
    const cfg = state.config;

    // Greeting elements
    const greetingTitleEl = document.getElementById('opening-title-text');
    if (greetingTitleEl) greetingTitleEl.textContent = cfg.greetingTitle || "Hey Beautiful ❤️";

    const greetingSubEl = document.getElementById('opening-subtitle-text');
    if (greetingSubEl) greetingSubEl.textContent = cfg.greetingSubtitle || DEFAULT_CONFIG.greetingSubtitle;

    // Birthday Celebration Section
    const bdayHeadlineEl = document.getElementById('birthday-headline-text');
    if (bdayHeadlineEl) {
      bdayHeadlineEl.textContent = cfg.birthdayHeadline.replace('{name}', cfg.recipientName);
    }

    // Letter elements
    const letterGreetingEl = document.getElementById('letter-greeting-text');
    if (letterGreetingEl) letterGreetingEl.textContent = cfg.letterGreeting.replace('{name}', cfg.recipientName);

    const letterSignoffEl = document.getElementById('letter-signoff-text');
    if (letterSignoffEl) letterSignoffEl.textContent = cfg.letterSignoff;

    const letterAuthorEl = document.getElementById('letter-author-text');
    if (letterAuthorEl) letterAuthorEl.textContent = cfg.senderName;

    // Special Surprise Section
    const specialMsgEl = document.getElementById('special-message-quote');
    if (specialMsgEl) specialMsgEl.textContent = `"${cfg.specialSurpriseMessage}"`;

    const specialAuthorEl = document.getElementById('special-message-author');
    if (specialAuthorEl) specialAuthorEl.textContent = `— ${cfg.senderName}`;

    // Document Title
    document.title = `Happy Birthday, ${cfg.recipientName}! ❤️`;
  }

  // --------------------------------------------------------------------------
  // 8. Navigation & Smooth Transitions with Mobile Scrollspy
  // --------------------------------------------------------------------------
  function setupNavigation() {
    const navButtons = document.querySelectorAll('[data-target-section]');
    const mobileDockButtons = document.querySelectorAll('.mobile-dock-btn');
    const desktopNavButtons = document.querySelectorAll('.nav-link-btn');

    const updateActiveNav = (targetId) => {
      mobileDockButtons.forEach(btn => {
        const matches = btn.getAttribute('data-target-section') === targetId;
        btn.classList.toggle('active', matches);
      });
      desktopNavButtons.forEach(btn => {
        const matches = btn.getAttribute('data-target-section') === targetId;
        btn.classList.toggle('active', matches);
      });
    };

    navButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = btn.getAttribute('data-target-section');
        const targetSection = document.getElementById(targetId);
        if (targetSection) {
          audioEngine.playSparkleChime();
          updateActiveNav(targetId);
          targetSection.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });

    // Mobile ScrollSpy using IntersectionObserver
    if ('IntersectionObserver' in window) {
      const sectionIds = [
        'section-opening',
        'section-celebration',
        'section-letter',
        'section-gallery',
        'section-surprise',
        'section-final'
      ];
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            updateActiveNav(entry.target.id);
          }
        });
      }, {
        root: null,
        rootMargin: '-20% 0px -40% 0px',
        threshold: 0.1
      });

      sectionIds.forEach(id => {
        const el = document.getElementById(id);
        if (el) observer.observe(el);
      });
    }

    // Toggle sparkles button in top nav
    const toggleSparklesBtn = document.getElementById('btn-toggle-sparkles');
    if (toggleSparklesBtn) {
      toggleSparklesBtn.addEventListener('click', () => {
        state.sparklesEnabled = !state.sparklesEnabled;
        toggleSparklesBtn.classList.toggle('active', state.sparklesEnabled);
        showToast(state.sparklesEnabled ? "Sparkles & Petals On ✨" : "Sparkles Paused ⏸️");
      });
    }
  }

  // --------------------------------------------------------------------------
  // 9. Music Player Controls
  // --------------------------------------------------------------------------
  function setupMusicControls() {
    const musicBtn = document.getElementById('music-toggle-btn');
    const musicText = document.getElementById('music-btn-text');

    if (!musicBtn) return;

    musicBtn.addEventListener('click', () => {
      const isPlaying = audioEngine.toggle();
      state.audioPlaying = isPlaying;
      updateMusicUI(isPlaying);
    });

    // Auto-start music softly upon first user interaction anywhere if allowed
    const startAudioOnFirstClick = () => {
      if (!state.audioPlaying) {
        state.audioPlaying = true;
        audioEngine.startMelodyLoop();
        updateMusicUI(true);
      }
      window.removeEventListener('click', startAudioOnFirstClick);
    };
    window.addEventListener('click', startAudioOnFirstClick, { once: true });
  }

  function updateMusicUI(isPlaying) {
    const musicBtn = document.getElementById('music-toggle-btn');
    const musicText = document.getElementById('music-btn-text');
    if (!musicBtn) return;

    if (isPlaying) {
      musicBtn.classList.add('playing');
      if (musicText) musicText.textContent = "Playing Melody ✨";
    } else {
      musicBtn.classList.remove('playing');
      if (musicText) musicText.textContent = "Romantic Music";
    }
  }

  // --------------------------------------------------------------------------
  // 10. Stage 1: Opening Screen & Gift Box Interaction
  // --------------------------------------------------------------------------
  function setupStageInteractions() {
    const giftBox = document.getElementById('opening-gift-box');
    const openSurpriseBtn = document.getElementById('btn-open-surprise');

    const handleOpenSurprise = (e) => {
      if (e) e.preventDefault();
      if (giftBox) giftBox.classList.add('opened');

      // Play audio & sound effects
      audioEngine.playSparkleChime();
      if (!state.audioPlaying) {
        state.audioPlaying = true;
        audioEngine.startMelodyLoop();
        updateMusicUI(true);
      }

      // Confetti burst
      const rect = giftBox ? giftBox.getBoundingClientRect() : { left: window.innerWidth / 2, top: window.innerHeight / 2 };
      if (particleEngine) {
        particleEngine.burstConfetti(rect.left + 90, rect.top + 90);
      }

      // Smooth scroll to Section 2: Birthday Celebration
      setTimeout(() => {
        const bdaySection = document.getElementById('section-celebration');
        if (bdaySection) {
          bdaySection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 700);
    };

    if (giftBox) giftBox.addEventListener('click', handleOpenSurprise);
    if (openSurpriseBtn) openSurpriseBtn.addEventListener('click', handleOpenSurprise);

    // Stage 2: Interactive Birthday Cake & Candles
    const cakeWrapper = document.getElementById('birthday-cake-wrapper');
    const blowCandlesBtn = document.getElementById('btn-blow-candles');

    const handleBlowCandles = (e) => {
      if (e) e.preventDefault();
      if (!cakeWrapper || !state.candlesLit) return;

      state.candlesLit = false;
      cakeWrapper.classList.add('blown-out');

      // Audio breath & celebration chimes
      audioEngine.playCandleBlowSound();
      setTimeout(() => {
        audioEngine.playSparkleChime();
      }, 400);

      // Huge celebratory confetti & flower petals burst
      const rect = cakeWrapper.getBoundingClientRect();
      if (particleEngine) {
        particleEngine.burstConfetti(rect.left + rect.width / 2, rect.top + 20);
        setTimeout(() => {
          particleEngine.burstConfetti(rect.left + rect.width / 2, rect.top + 60);
        }, 300);
      }

      showToast("🎂 Your wish has been sent to the stars! ✨");

      const promptText = document.getElementById('cake-prompt-text');
      if (promptText) {
        promptText.innerHTML = "🎉 All your wishes will come true! ❤️";
      }

      if (blowCandlesBtn) {
        blowCandlesBtn.textContent = "Candles Extinguished! 🕯️✨";
        blowCandlesBtn.style.opacity = "0.7";
      }
    };

    if (cakeWrapper) cakeWrapper.addEventListener('click', handleBlowCandles);
    if (blowCandlesBtn) blowCandlesBtn.addEventListener('click', handleBlowCandles);

    // Stage 3: Envelope & Typewriter Love Letter
    const envelope = document.getElementById('romantic-envelope');
    const waxSeal = document.getElementById('wax-seal-btn');
    const skipTypewriterBtn = document.getElementById('btn-skip-typewriter');
    const replayTypewriterBtn = document.getElementById('btn-replay-typewriter');

    const handleOpenEnvelope = (e) => {
      if (e) e.preventDefault();
      if (!envelope || state.envelopeOpened) return;

      state.envelopeOpened = true;
      envelope.classList.add('opened');
      audioEngine.playSparkleChime();

      if (particleEngine) {
        const rect = envelope.getBoundingClientRect();
        particleEngine.burstConfetti(rect.left + rect.width / 2, rect.top + 100);
      }

      // Start typewriter effect after letter slides out
      setTimeout(() => {
        startTypewriter();
      }, 700);
    };

    if (waxSeal) waxSeal.addEventListener('click', handleOpenEnvelope);
    if (envelope) envelope.addEventListener('click', handleOpenEnvelope);

    if (skipTypewriterBtn) {
      skipTypewriterBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        skipTypewriter();
      });
    }

    if (replayTypewriterBtn) {
      replayTypewriterBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        startTypewriter(true);
      });
    }
  }

  // --------------------------------------------------------------------------
  // 11. Typewriter Animation for Romantic Love Letter
  // --------------------------------------------------------------------------
  function startTypewriter(forceRestart = false) {
    const textEl = document.getElementById('letter-body-text');
    if (!textEl) return;

    if (state.typewriterTimer) {
      clearInterval(state.typewriterTimer);
      state.typewriterTimer = null;
    }

    const fullText = state.config.letterBody;
    let charIndex = 0;
    textEl.innerHTML = '';

    // Create cursor span
    const cursor = document.createElement('span');
    cursor.className = 'typewriter-cursor';
    textEl.appendChild(cursor);

    state.letterTyped = false;

    state.typewriterTimer = setInterval(() => {
      if (charIndex < fullText.length) {
        const char = fullText.charAt(charIndex);
        if (char === '\n') {
          cursor.insertAdjacentHTML('beforebegin', '<br>');
        } else {
          cursor.insertAdjacentText('beforebegin', char);
        }
        charIndex++;
      } else {
        clearInterval(state.typewriterTimer);
        state.typewriterTimer = null;
        state.letterTyped = true;
      }
    }, 28);
  }

  function skipTypewriter() {
    const textEl = document.getElementById('letter-body-text');
    if (!textEl) return;

    if (state.typewriterTimer) {
      clearInterval(state.typewriterTimer);
      state.typewriterTimer = null;
    }

    const fullText = state.config.letterBody;
    textEl.innerHTML = fullText.replace(/\n/g, '<br>') + '<span class="typewriter-cursor"></span>';
    state.letterTyped = true;
    showToast("Letter revealed! 💌");
  }

  // --------------------------------------------------------------------------
  // 12. Memories Gallery (Polaroid Frames, Local Storage, Custom Uploads)
  // --------------------------------------------------------------------------
  function setupMemoriesGallery() {
    const grid = document.getElementById('memories-grid-container');
    const uploadInput = document.getElementById('photo-file-input');

    if (!grid) return;

    // Load custom memories from localStorage if any
    let storedMemories = [];
    try {
      const data = localStorage.getItem('romantic_memories_gallery');
      if (data) storedMemories = JSON.parse(data);
    } catch (e) {
      console.warn("Could not load stored memories", e);
    }

    const allMemories = [...storedMemories, ...DEFAULT_MEMORIES];
    renderMemoriesGrid(allMemories);

    // Photo file upload handler
    if (uploadInput) {
      uploadInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
          showToast("Please select a valid image file.");
          return;
        }

        // Limit size to ~5MB to avoid exceeding browser localStorage limits
        if (file.size > 5 * 1024 * 1024) {
          showToast("Please choose an image under 5MB.");
          return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
          const userCaption = prompt("Enter a sweet title or memory for this photo:", "Our Sweet Memory ❤️") || "Our Special Moment";
          const newMemory = {
            id: "user-mem-" + Date.now(),
            title: userCaption,
            date: "Cherished Moment",
            liked: true,
            isUserUploaded: true,
            url: event.target.result
          };

          storedMemories.unshift(newMemory);
          try {
            localStorage.setItem('romantic_memories_gallery', JSON.stringify(storedMemories));
          } catch (storageErr) {
            console.warn("Storage quota exceeded", storageErr);
            showToast("Photo added for this session! (Storage limit reached)");
          }

          renderMemoriesGrid([...storedMemories, ...DEFAULT_MEMORIES]);
          showToast("New memory added to your gallery! 📸💖");
          audioEngine.playSparkleChime();
        };

        reader.readAsDataURL(file);
      });
    }
  }

  function renderMemoriesGrid(memories) {
    const grid = document.getElementById('memories-grid-container');
    if (!grid) return;

    grid.innerHTML = '';

    memories.forEach((mem) => {
      const card = document.createElement('article');
      card.className = 'polaroid-card';
      card.setAttribute('data-id', mem.id);

      card.innerHTML = `
        <div class="polaroid-pin"></div>
        ${mem.isUserUploaded ? `<button class="polaroid-delete-btn" title="Delete Photo" aria-label="Delete Photo">✕</button>` : ''}
        <div class="polaroid-img-wrapper">
          <img src="${mem.url}" alt="${mem.title}" class="polaroid-img" loading="lazy" />
        </div>
        <h4 class="polaroid-caption">${mem.title}</h4>
        <p class="polaroid-date">${mem.date}</p>
        <button class="polaroid-heart-btn" aria-label="Like memory">${mem.liked ? '❤️' : '🤍'}</button>
      `;

      // Fullscreen Lightbox trigger
      card.querySelector('.polaroid-img-wrapper').addEventListener('click', () => {
        openLightbox(mem.url, mem.title);
      });

      // Heart toggle
      const heartBtn = card.querySelector('.polaroid-heart-btn');
      heartBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        mem.liked = !mem.liked;
        heartBtn.textContent = mem.liked ? '❤️' : '🤍';
        audioEngine.playSparkleChime();
      });

      // Delete user photo
      if (mem.isUserUploaded) {
        const deleteBtn = card.querySelector('.polaroid-delete-btn');
        if (deleteBtn) {
          deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (confirm("Remove this photo from your gallery?")) {
              removeUserMemory(mem.id);
            }
          });
        }
      }

      grid.appendChild(card);
    });
  }

  function removeUserMemory(id) {
    try {
      let stored = JSON.parse(localStorage.getItem('romantic_memories_gallery') || '[]');
      stored = stored.filter(m => m.id !== id);
      localStorage.setItem('romantic_memories_gallery', JSON.stringify(stored));
      renderMemoriesGrid([...stored, ...DEFAULT_MEMORIES]);
      showToast("Photo removed from gallery.");
    } catch (e) {
      console.warn(e);
    }
  }

  // --------------------------------------------------------------------------
  // 13. Stage 5: Special Mystery Gift Chest & Romantic Love Coupons
  // --------------------------------------------------------------------------
  function setupSpecialSurpriseChest() {
    const chest = document.getElementById('mystery-gift-chest');
    const revealArea = document.getElementById('coupons-reveal-area');
    const redeemButtons = document.querySelectorAll('.coupon-redeem-btn');

    if (chest) {
      chest.addEventListener('click', () => {
        if (state.giftChestOpened) return;
        state.giftChestOpened = true;

        audioEngine.playSparkleChime();
        if (particleEngine) {
          const rect = chest.getBoundingClientRect();
          particleEngine.burstConfetti(rect.left + rect.width / 2, rect.top + rect.height / 2);
          setTimeout(() => {
            particleEngine.burstConfetti(rect.left + rect.width / 2, rect.top);
          }, 350);
        }

        if (revealArea) {
          revealArea.classList.add('active');
          revealArea.scrollIntoView({ behavior: 'smooth' });
        }

        showToast("Surprise unlocked! Love coupons revealed! 🎁✨");
      });
    }

    redeemButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        btn.classList.add('redeemed');
        btn.textContent = "Redeemed with Love! ❤️";
        audioEngine.playSparkleChime();
        if (particleEngine) {
          const rect = btn.getBoundingClientRect();
          particleEngine.burstConfetti(rect.left + 50, rect.top);
        }
        showToast("Coupon redeemed! I can't wait to make this happen for you! 🌹");
      });
    });

  }

  // --------------------------------------------------------------------------
  // 14. Lightbox Modal
  // --------------------------------------------------------------------------
  function setupLightbox() {
    const modal = document.getElementById('lightbox-modal');
    const closeBtn = document.getElementById('lightbox-close-btn');

    if (!modal) return;

    const closeModal = () => modal.classList.remove('active');

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeModal();
      }
    });
  }

  function openLightbox(imgUrl, captionText) {
    const modal = document.getElementById('lightbox-modal');
    const imgEl = document.getElementById('lightbox-img');
    const capEl = document.getElementById('lightbox-caption');

    if (!modal || !imgEl) return;

    imgEl.src = imgUrl;
    if (capEl) capEl.textContent = captionText || "";
    modal.classList.add('active');
  }


  // --------------------------------------------------------------------------
  // 16. Romantic Notification Toast
  // --------------------------------------------------------------------------
  let toastTimeout = null;
  function showToast(message) {
    let toast = document.getElementById('toast-notification');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'toast-notification';
      toast.className = 'toast-msg';
      document.body.appendChild(toast);
    }

    toast.innerHTML = `<span>💖</span> <span>${message}</span>`;
    toast.classList.add('show');

    if (toastTimeout) clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 3200);
  }

  // Start when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }
})();
