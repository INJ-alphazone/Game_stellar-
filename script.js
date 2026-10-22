const intro=document.getElementById('intro'),mission=document.getElementById('mission'),finale=document.getElementById('finale');
const backdrop=document.getElementById('modalBackdrop'),closeModal=document.getElementById('closeModal'),modalEyebrow=document.getElementById('modalEyebrow'),modalTitle=document.getElementById('modalTitle'),modalText=document.getElementById('modalText'),challengeArea=document.getElementById('challengeArea'),feedback=document.getElementById('feedback'),modalAction=document.getElementById('modalAction'),progressCount=document.getElementById('progressCount');
const stars=[
{name:'АЛЬТАИР',title:'Первый сигнал пойман',text:'Бортовой компьютер спрашивает: что лучше всего помогает пережить понедельник?',label:'ВЫБЕРИ САМЫЙ КОСМИЧЕСКИЙ ОТВЕТ',choices:['Отменить понедельник на всей планете','Кофе и вид, будто всё под контролем','Переехать на Сатурн и не оставлять адрес'],correct:1,success:'Принято. Кофе официально признан топливом земной цивилизации.'},
{name:'ВЕГА',title:'Проверка на любопытство',text:'Ты обнаружил(а) инопланетный чемодан. Что внутри? Учёные нервничают и ждут твою версию.',label:'ТВОЯ ГИПОТЕЗА',choices:['Запасные носки для межгалактических путешествий','Кнопка «ещё пять минут»','Очень маленький запасной космос'],correct:2,success:'Невероятно. Внутри действительно помещается ещё один космос. Не спрашивай как.'},
{name:'СИРИУС',title:'Последняя проверка',text:'Корабль просит пароль, чтобы открыть финальный сектор. Подсказка: это слово помогает даже в самый странный день.',label:'ВЫБЕРИ СВОЙ ВАРИАНТ',choices:['Любопытство','Печенька','Секрет'],correct:0,success:'Доступ открыт. Любопытство — самый надёжный двигатель исследователя.'}];
let completed=new Set(),activeStar=null,selectedChoice=null,solvedCurrent=false;
function startMission(){intro.classList.add('hidden');finale.classList.add('hidden');mission.classList.remove('hidden');completed.clear();document.querySelectorAll('.star-node').forEach(n=>n.classList.remove('done'));updateProgress();window.scrollTo({top:0,behavior:'smooth'});}
function updateProgress(){progressCount.textContent=completed.size;if(completed.size===stars.length){mission.classList.add('hidden');finale.classList.remove('hidden');window.scrollTo({top:0,behavior:'smooth'});}}
function openStar(index){if(completed.has(index))return;activeStar=index;selectedChoice=null;solvedCurrent=false;const s=stars[index];modalEyebrow.textContent=`СИГНАЛ / ${String(index+1).padStart(2,'0')} — ${s.name}`;modalTitle.textContent=s.title;modalText.textContent=s.text;challengeArea.innerHTML=`<span class="challenge-label">${s.label}</span><div class="choice-list"></div>`;const list=challengeArea.querySelector('.choice-list');s.choices.forEach((choice,i)=>{const b=document.createElement('button');b.className='choice';b.type='button';b.textContent=choice;b.addEventListener('click',()=>{selectedChoice=i;list.querySelectorAll('.choice').forEach(x=>x.classList.remove('selected'));b.classList.add('selected');feedback.textContent='';modalAction.disabled=false;});list.appendChild(b);});feedback.textContent='';modalAction.disabled=true;modalAction.innerHTML='Подтвердить выбор <b>↗</b>';backdrop.classList.remove('hidden');}
function confirmChoice(){if(activeStar===null)return;const s=stars[activeStar];if(!solvedCurrent){if(selectedChoice===null)return;feedback.textContent=selectedChoice===s.correct?s.success:'Версия принята! В космосе не бывает неправильных теорий — только очень смелые.';solvedCurrent=true;modalAction.disabled=false;modalAction.innerHTML='Забрать координаты <b>↗</b>';challengeArea.querySelectorAll('.choice').forEach(b=>b.disabled=true);return;}completed.add(activeStar);document.querySelector(`.star-node[data-star="${activeStar}"]`).classList.add('done');backdrop.classList.add('hidden');activeStar=null;updateProgress();}
function closeActiveModal(){backdrop.classList.add('hidden');activeStar=null;}
document.getElementById('startBtn').addEventListener('click',startMission);document.getElementById('againBtn').addEventListener('click',startMission);
document.querySelectorAll('.star-node').forEach(n=>n.addEventListener('click',()=>openStar(Number(n.dataset.star))));
modalAction.addEventListener('click',confirmChoice);closeModal.addEventListener('click',closeActiveModal);backdrop.addEventListener('click',e=>{if(e.target===backdrop)closeActiveModal();});document.addEventListener('keydown',e=>{if(e.key==='Escape')closeActiveModal();});


// Ambient cosmic sound is generated locally with Web Audio (no external audio file).
// Browsers require a user gesture before audio can begin.
const soundToggle = document.getElementById('soundToggle');
const soundIcon = document.getElementById('soundIcon');
const soundLabel = document.getElementById('soundLabel');
let audioContext = null;
let masterGain = null;
let soundEnabled = false;
let soundNodes = [];
let twinkleTimer = null;

function startCosmicSound() {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) {
    soundLabel.textContent = 'ЗВУК НЕДОСТУПЕН';
    return;
  }
  if (!audioContext) {
    audioContext = new AudioContextClass();
    masterGain = audioContext.createGain();
    masterGain.gain.value = 0;
    masterGain.connect(audioContext.destination);

    // Gentle, low-volume ambient drone.
    const drone1 = audioContext.createOscillator();
    const drone2 = audioContext.createOscillator();
    const droneGain = audioContext.createGain();
    const filter = audioContext.createBiquadFilter();
    drone1.type = 'sine';
    drone2.type = 'triangle';
    drone1.frequency.value = 55;
    drone2.frequency.value = 82.4;
    drone2.detune.value = 7;
    filter.type = 'lowpass';
    filter.frequency.value = 260;
    droneGain.gain.value = 0.18;
    drone1.connect(filter);
    drone2.connect(filter);
    filter.connect(droneGain);
    droneGain.connect(masterGain);
    drone1.start();
    drone2.start();
    soundNodes.push(drone1, drone2, droneGain, filter);

    // Slow, barely audible pulsing of the atmosphere.
    const lfo = audioContext.createOscillator();
    const lfoGain = audioContext.createGain();
    lfo.type = 'sine';
    lfo.frequency.value = 0.12;
    lfoGain.gain.value = 0.035;
    lfo.connect(lfoGain);
    lfoGain.connect(droneGain.gain);
    lfo.start();
    soundNodes.push(lfo, lfoGain);
  }
  audioContext.resume();
  masterGain.gain.cancelScheduledValues(audioContext.currentTime);
  masterGain.gain.setTargetAtTime(0.22, audioContext.currentTime, 0.8);
  soundEnabled = true;
  soundToggle.setAttribute('aria-pressed', 'true');
  soundIcon.textContent = '♫';
  soundLabel.textContent = 'ЗВУК: ВКЛ';
  if (!twinkleTimer) twinkleTimer = window.setInterval(playCosmicTwinkle, 4200);
}

function playCosmicTwinkle() {
  if (!soundEnabled || !audioContext || !masterGain) return;
  const now = audioContext.currentTime;
  const osc = audioContext.createOscillator();
  const gain = audioContext.createGain();
  const panner = audioContext.createStereoPanner ? audioContext.createStereoPanner() : null;
  const frequencies = [659.25, 783.99, 987.77, 1174.66, 1318.51];
  osc.type = 'sine';
  osc.frequency.value = frequencies[Math.floor(Math.random() * frequencies.length)];
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.045, now + 0.08);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);
  if (panner) {
    panner.pan.value = Math.random() * 1.4 - 0.7;
    osc.connect(gain);
    gain.connect(panner);
    panner.connect(masterGain);
  } else {
    osc.connect(gain);
    gain.connect(masterGain);
  }
  osc.start(now);
  osc.stop(now + 1.85);
  osc.onended = () => {
    osc.disconnect();
    gain.disconnect();
    if (panner) panner.disconnect();
  };
}

function stopCosmicSound() {
  if (!audioContext || !masterGain) return;
  masterGain.gain.cancelScheduledValues(audioContext.currentTime);
  masterGain.gain.setTargetAtTime(0, audioContext.currentTime, 0.25);
  soundEnabled = false;
  soundToggle.setAttribute('aria-pressed', 'false');
  soundIcon.textContent = '♫';
  soundLabel.textContent = 'ЗВУК: ВЫКЛ';
}

soundToggle.addEventListener('click', () => {
  if (soundEnabled) stopCosmicSound();
  else startCosmicSound();
});
