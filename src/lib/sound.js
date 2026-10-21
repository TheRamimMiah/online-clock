let audioContext;

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
