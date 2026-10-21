let audioContext;

export const DEFAULT_ALARM_SOUND = "bells";

export const ALARM_SOUNDS = [
  { id: "bells", label: "Bell" },
  { id: "birds", label: "Birds" },
  { id: "childhood", label: "Childhood" },
  { id: "classic", label: "Classic Alarm" },
  { id: "cuckoo", label: "Cuckoo" },
  { id: "flute", label: "Flute" },
  { id: "guitar", label: "Guitar" },
  { id: "happy", label: "Happy" },
  { id: "harp", label: "Harp" },
  { id: "music-box", label: "Music Box" },
  { id: "paradise-island", label: "Paradise Island" },
  { id: "piano", label: "Piano" },
  { id: "pipe", label: "Pipe" },
  { id: "pizzicato", label: "Pizzicato" },
  { id: "pulse", label: "Pulse" },
  { id: "rooster", label: "Rooster Crows" },
  { id: "savannah", label: "Savannah" },
  { id: "school", label: "School Bell" },
  { id: "shine", label: "Shine" },
  { id: "twinkle", label: "Twinkle" },
  { id: "wind-chimes", label: "Wind Chimes" },
  { id: "xylophone", label: "Xylophone" },
];

const SOUND_PATTERNS = {
  bells: {
    cycle: 1.7,
    notes: [
      [0, 880, "sine", 0.24],
      [0.34, 1174.66, "sine", 0.28],
      [0.76, 987.77, "sine", 0.25],
    ],
  },
  birds: {
    cycle: 2.2,
    notes: [
      [0, 1760, "triangle", 0.12],
      [0.18, 2093, "triangle", 0.1],
      [0.45, 1568, "triangle", 0.14],
      [0.69, 2349, "triangle", 0.1],
      [1.12, 1865, "triangle", 0.16],
    ],
  },
  childhood: {
    cycle: 2.2,
    notes: [
      [0, 523.25, "sine", 0.26],
      [0.3, 659.25, "sine", 0.26],
      [0.6, 783.99, "sine", 0.26],
      [0.9, 659.25, "sine", 0.26],
      [1.2, 880, "sine", 0.38],
    ],
  },
  classic: {
    cycle: 1.3,
    notes: [
      [0, 880, "square", 0.18],
      [0.3, 880, "square", 0.18],
      [0.6, 1046.5, "square", 0.22],
    ],
  },
  cuckoo: {
    cycle: 1.8,
    notes: [
      [0, 659.25, "square", 0.2],
      [0.34, 523.25, "square", 0.25],
      [0.9, 659.25, "square", 0.2],
      [1.24, 523.25, "square", 0.25],
    ],
  },
  flute: {
    cycle: 2.3,
    notes: [
      [0, 698.46, "sine", 0.38],
      [0.42, 880, "sine", 0.38],
      [0.84, 1046.5, "sine", 0.48],
      [1.42, 880, "sine", 0.38],
    ],
  },
  glow: {
    cycle: 2.5,
    notes: [
      [0, 523.25, "sine", 0.7],
      [0.08, 659.25, "sine", 0.7],
      [0.16, 783.99, "sine", 0.7],
      [1.05, 659.25, "sine", 0.7],
      [1.13, 783.99, "sine", 0.7],
      [1.21, 1046.5, "sine", 0.7],
    ],
  },
  guitar: {
    cycle: 2.1,
    notes: [
      [0, 329.63, "triangle", 0.24],
      [0.12, 392, "triangle", 0.24],
      [0.24, 493.88, "triangle", 0.24],
      [0.68, 440, "triangle", 0.26],
      [0.8, 554.37, "triangle", 0.26],
      [0.92, 659.25, "triangle", 0.34],
    ],
  },
  happy: {
    cycle: 1.9,
    notes: [
      [0, 783.99, "sine", 0.2],
      [0.24, 987.77, "sine", 0.2],
      [0.48, 1174.66, "sine", 0.2],
      [0.78, 1567.98, "sine", 0.36],
    ],
  },
  harp: {
    cycle: 2.5,
    notes: [
      [0, 440, "sine", 0.55],
      [0.16, 554.37, "sine", 0.55],
      [0.32, 659.25, "sine", 0.55],
      [0.48, 880, "sine", 0.7],
      [1.22, 659.25, "sine", 0.5],
      [1.38, 783.99, "sine", 0.6],
    ],
  },
  "music-box": {
    cycle: 2.1,
    notes: [
      [0, 1046.5, "triangle", 0.18],
      [0.28, 783.99, "triangle", 0.18],
      [0.56, 880, "triangle", 0.18],
      [0.84, 659.25, "triangle", 0.18],
      [1.12, 783.99, "triangle", 0.28],
    ],
  },
  "paradise-island": {
    cycle: 2.4,
    notes: [
      [0, 523.25, "sine", 0.34],
      [0.22, 659.25, "sine", 0.34],
      [0.44, 783.99, "sine", 0.34],
      [0.9, 659.25, "sine", 0.34],
      [1.12, 880, "sine", 0.48],
    ],
  },
  piano: {
    cycle: 2.3,
    notes: [
      [0, 261.63, "triangle", 0.42],
      [0.1, 329.63, "triangle", 0.42],
      [0.2, 392, "triangle", 0.42],
      [0.78, 329.63, "triangle", 0.42],
      [0.88, 392, "triangle", 0.42],
      [0.98, 523.25, "triangle", 0.54],
    ],
  },
  pipe: {
    cycle: 1.9,
    notes: [
      [0, 1046.5, "sine", 0.24],
      [0.32, 1318.51, "sine", 0.24],
      [0.64, 1567.98, "sine", 0.34],
      [1.18, 1318.51, "sine", 0.3],
    ],
  },
  pizzicato: {
    cycle: 1.8,
    notes: [
      [0, 659.25, "triangle", 0.12],
      [0.18, 783.99, "triangle", 0.12],
      [0.36, 987.77, "triangle", 0.12],
      [0.64, 783.99, "triangle", 0.12],
      [0.82, 659.25, "triangle", 0.22],
    ],
  },
  rooster: {
    cycle: 2.1,
    notes: [
      [0, 1046.5, "sawtooth", 0.16],
      [0.18, 1318.51, "sawtooth", 0.16],
      [0.36, 1567.98, "sawtooth", 0.24],
      [0.98, 1174.66, "sawtooth", 0.15],
      [1.16, 1567.98, "sawtooth", 0.15],
      [1.34, 2093, "sawtooth", 0.26],
    ],
  },
  savannah: {
    cycle: 2.6,
    notes: [
      [0, 392, "triangle", 0.42],
      [0.3, 493.88, "triangle", 0.42],
      [0.6, 587.33, "triangle", 0.42],
      [1.16, 440, "triangle", 0.42],
      [1.46, 523.25, "triangle", 0.42],
      [1.76, 659.25, "triangle", 0.5],
    ],
  },
  school: {
    cycle: 1.7,
    notes: [
      [0, 1318.51, "sine", 0.32],
      [0.46, 1318.51, "sine", 0.32],
      [0.92, 1318.51, "sine", 0.32],
    ],
  },
  twinkle: {
    cycle: 2.2,
    notes: [
      [0, 1046.5, "sine", 0.16],
      [0.24, 1318.51, "sine", 0.16],
      [0.48, 1567.98, "sine", 0.16],
      [0.72, 2093, "sine", 0.24],
      [1.16, 1567.98, "sine", 0.16],
      [1.4, 2093, "sine", 0.28],
    ],
  },
  "wind-chimes": {
    cycle: 2.7,
    notes: [
      [0, 1046.5, "sine", 0.52],
      [0.27, 1396.91, "sine", 0.5],
      [0.68, 1760, "sine", 0.58],
      [1.18, 1174.66, "sine", 0.48],
      [1.64, 1567.98, "sine", 0.62],
    ],
  },
  xylophone: {
    cycle: 2.1,
    notes: [
      [0, 783.99, "sine", 0.13],
      [0.2, 987.77, "sine", 0.13],
      [0.4, 1174.66, "sine", 0.13],
      [0.6, 1567.98, "sine", 0.13],
      [0.88, 1174.66, "sine", 0.13],
      [1.08, 987.77, "sine", 0.13],
      [1.28, 783.99, "sine", 0.25],
    ],
  },
  pulse: {
    cycle: 1.2,
    notes: [
      [0, 660, "sawtooth", 0.12],
      [0.2, 660, "sawtooth", 0.12],
      [0.4, 660, "sawtooth", 0.12],
      [0.68, 880, "sawtooth", 0.2],
    ],
  },
};

const AUDIO_SOUNDS = {
  bells: {
    source: "/sounds/bell.mp3",
    repeatInterval: 750,
  },
  birds: {
    source: "/sounds/birds.mp3",
    gain: 1.45,
  },
  childhood: {
    source: "/sounds/childhood.mp3",
    gain: 1.35,
  },
  classic: {
    source: "/sounds/classic-alarm.mp3",
  },
  cuckoo: {
    source: "/sounds/cuckoo.mp3",
    gain: 1.45,
  },
  flute: {
    source: "/sounds/flute.mp3",
  },
  guitar: {
    source: "/sounds/guitar.mp3",
  },
  happy: {
    source: "/sounds/happy.mp3",
  },
  harp: {
    source: "/sounds/harp.mp3",
  },
  "music-box": {
    source: "/sounds/music-box.mp3",
  },
  "paradise-island": {
    source: "/sounds/paradise-island.mp3",
  },
  piano: {
    source: "/sounds/piano.mp3",
  },
  pipe: {
    source: "/sounds/pipe.mp3",
  },
  pizzicato: {
    source: "/sounds/pizzicato.mp3",
  },
  savannah: {
    source: "/sounds/savannah.mp3",
  },
  school: {
    source: "/sounds/school-bell.mp3",
  },
  twinkle: {
    source: "/sounds/twinkle.mp3",
  },
  "wind-chimes": {
    source: "/sounds/wind-chimes.mp3",
  },
  xylophone: {
    source: "/sounds/xylophone.mp3",
  },
  pulse: {
    source: "/sounds/pulse.mp3",
  },
  shine: {
    source: "/sounds/shine.mp3",
    repeatInterval: 1000,
  },
  rooster: {
    source: "/sounds/rooster-crows.mp3",
  },
};

function getAudioContext() {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;

  if (!AudioContextClass) return null;

  if (!audioContext) {
    audioContext = new AudioContextClass();
  }

  if (audioContext.state === "suspended") {
    audioContext.resume().catch(() => {});
  }

  return audioContext;
}

export function unlockAudio() {
  getAudioContext();
}

function scheduleNote(context, [offset, frequency, type, duration], startAt, nodes) {
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  const start = startAt + offset;
  const end = start + duration;

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, start);
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(0.18, start + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, end);
  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start(start);
  oscillator.stop(end + 0.04);
  nodes.add(oscillator);
  oscillator.addEventListener("ended", () => nodes.delete(oscillator), {
    once: true,
  });
}

function getPattern(sound) {
  return SOUND_PATTERNS[sound] || SOUND_PATTERNS[DEFAULT_ALARM_SOUND];
}

export function previewAlarmSound(sound = DEFAULT_ALARM_SOUND) {
  const audioSound = AUDIO_SOUNDS[sound];

  if (audioSound) {
    const audio = new Audio(audioSound.source);
    audio.volume = 0.85;
    audio.play().catch(() => {
      // Browsers can block sound until the page has received a user gesture.
    });

    return () => {
      audio.pause();
      audio.currentTime = 0;
      audio.removeAttribute("src");
      audio.load();
    };
  }

  const context = getAudioContext();

  if (!context) return () => {};

  const pattern = getPattern(sound);
  const nodes = new Set();
  const startAt = context.currentTime + 0.04;

  pattern.notes.forEach((note) => scheduleNote(context, note, startAt, nodes));

  return () => {
    nodes.forEach((oscillator) => {
      try {
        oscillator.stop();
      } catch {
        // An oscillator may have completed before preview is stopped.
      }
    });
    nodes.clear();
  };
}

export function startAlarmSound({
  sound = DEFAULT_ALARM_SOUND,
  repeat = true,
} = {}) {
  const audioSound = AUDIO_SOUNDS[sound];

  if (audioSound) {
    const audio = new Audio(audioSound.source);
    audio.volume = 0.85;
    const context = getAudioContext();
    let mediaSource;
    let gainNode;

    if (context && audioSound.gain) {
      mediaSource = context.createMediaElementSource(audio);
      gainNode = context.createGain();
      gainNode.gain.setValueAtTime(audioSound.gain, context.currentTime);
      mediaSource.connect(gainNode);
      gainNode.connect(context.destination);
      audio.volume = 1;
    }

    let repeatId;

    const playAudio = () => {
      audio.currentTime = 0;
      audio.play().catch(() => {
        // Browsers can block sound until the page has received a user gesture.
      });
    };

    if (repeat && audioSound.repeatInterval) {
      audio.loop = false;
      playAudio();
      repeatId = window.setInterval(playAudio, audioSound.repeatInterval);
    } else {
      audio.loop = repeat;
      audio.play().catch(() => {
        // Browsers can block sound until the page has received a user gesture.
      });
    }

    return () => {
      window.clearInterval(repeatId);
      audio.pause();
      audio.currentTime = 0;
      audio.removeAttribute("src");
      audio.load();
      mediaSource?.disconnect();
      gainNode?.disconnect();
    };
  }

  const context = getAudioContext();

  if (!context) return () => {};

  const pattern = getPattern(sound);
  const nodes = new Set();
  let stopped = false;
  let timeoutId;

  const playCycle = () => {
    if (stopped) return;

    const startAt = context.currentTime + 0.04;
    pattern.notes.forEach((note) => scheduleNote(context, note, startAt, nodes));

    if (repeat) {
      timeoutId = window.setTimeout(playCycle, pattern.cycle * 1000);
    }
  };

  playCycle();

  return () => {
    stopped = true;
    window.clearTimeout(timeoutId);
    nodes.forEach((oscillator) => {
      try {
        oscillator.stop();
      } catch {
        // An oscillator may have completed before the alarm was dismissed.
      }
    });
    nodes.clear();
  };
}

export function playBeep({
  repeat = 3,
  frequency = 880,
  duration = 0.18,
} = {}) {
  const context = getAudioContext();

  if (!context) return;

  const startAt = context.currentTime + 0.02;

  for (let index = 0; index < repeat; index += 1) {
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    const start = startAt + index * (duration + 0.12);
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(frequency, start);
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(0.22, start + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start(start);
    oscillator.stop(start + duration + 0.03);
  }
}
