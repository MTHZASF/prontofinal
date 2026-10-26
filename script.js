const form = document.getElementById('answer-form');
const answer = document.getElementById('answer');
const intro = document.getElementById('intro');
const casefile = document.getElementById('casefile');
const ending = document.getElementById('ending');
const countdown = document.getElementById('countdown');
const impact = document.getElementById('impact');
const bloodLayer = document.getElementById('blood-layer');
const credits = document.querySelector('.credits');
const replay = document.getElementById('replay');

let timers = [];
function clearTimers() {
  timers.forEach(clearTimeout);
  timers = [];
}
function later(fn, delay) {
  const id = setTimeout(fn, delay);
  timers.push(id);
}
function showEnding() {
  casefile.classList.add('hidden');
  ending.classList.remove('hidden');
  impact.classList.remove('fire');
  void impact.offsetWidth;
  impact.classList.add('fire');
  // Som seco e curto, sintetizado localmente; não precisa de arquivo externo.
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (AudioCtx) {
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(115, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(38, ctx.currentTime + 0.16);
      gain.gain.setValueAtTime(0.22, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.19);
      osc.connect(gain); gain.connect(ctx.destination);
      osc.start(); osc.stop(ctx.currentTime + 0.2);
      osc.onended = () => ctx.close();
    }
  } catch (e) {}
  bloodLayer.innerHTML = '';
  for (let i = 0; i < 19; i++) {
    const drop = document.createElement('span');
    drop.className = 'drip';
    drop.style.left = `${(i * 5.37 + Math.random() * 4) % 100}%`;
    drop.style.width = `${10 + Math.random() * 22}px`;
    drop.style.animationDelay = `${Math.random() * 0.7}s`;
    bloodLayer.appendChild(drop);
  }
  later(() => credits.classList.add('show'), 900);
}
form.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!answer.value.trim()) return;
  clearTimers();
  intro.classList.add('hidden');
  ending.classList.add('hidden');
  casefile.classList.remove('hidden');
  countdown.textContent = 'A VERDADE ESTÁ SE APROXIMANDO...';
  let seconds = 10;
  countdown.textContent = `O ARQUIVO SERÁ ENCERRADO EM ${seconds}...`;
  const tick = () => {
    seconds--;
    if (seconds > 0) {
      countdown.textContent = `O ARQUIVO SERÁ ENCERRADO EM ${seconds}...`;
      timers.push(setTimeout(tick, 1000));
    } else {
      countdown.textContent = 'CASO ENCERRADO.';
      showEnding();
    }
  };
  timers.push(setTimeout(tick, 1000));
});
replay.addEventListener('click', () => {
  clearTimers();
  credits.classList.remove('show');
  ending.classList.add('hidden');
  intro.classList.remove('hidden');
  answer.value = '';
  bloodLayer.innerHTML = '';
  answer.focus();
});
