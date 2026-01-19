const sectionsConfig = [
  { id: 'morning', title: '🌅 Morning Routine' },
  { id: 'focus', title: '🧠 Focus Block' },
  { id: 'day', title: '🏫 Day Work' },
  { id: 'skill', title: '🚀 Skill Growth' }
];

const todayKey = new Date().toISOString().split('T')[0];
let activeSection = null;

const db = JSON.parse(localStorage.getItem('lifeCalendar')) || {};

if (!db[todayKey]) {
  db[todayKey] = { sections: {}, notes: '' };
  sectionsConfig.forEach(s => db[todayKey].sections[s.id] = []);
}

function saveDB() {
  localStorage.setItem('lifeCalendar', JSON.stringify(db));
}

function render() {
  const container = document.getElementById('sections');
  container.innerHTML = '';

  sectionsConfig.forEach(section => {
    const box = document.createElement('div');
    box.className = 'section';

    box.innerHTML = `
      <div class="section-header">
        <h3>${section.title}</h3>
        <button class="add-btn" onclick="openModal('${section.id}')">+</button>
      </div>
    `;

    db[todayKey].sections[section.id].forEach((task, i) => {
      const t = document.createElement('div');
      t.className = `task ${task.done ? 'done' : ''}`;
      t.innerHTML = `
        <label>
          <input type="checkbox" ${task.done ? 'checked' : ''} onchange="toggleDone('${section.id}',${i})">
          <span>${task.title}</span>
        </label>
        <button onclick="deleteTask('${section.id}',${i})">✕</button>
      `;
      box.appendChild(t);
    });

    container.appendChild(box);
  });

  updateProgress();
  saveDB();
}

function openModal(id) {
  activeSection = id;
  document.getElementById('taskModal').classList.remove('hidden');
}
function closeModal() {
  document.getElementById('taskModal').classList.add('hidden');
}
function saveTask() {
  const title = taskTitle.value.trim();
  if (!title) return;
  db[todayKey].sections[activeSection].push({
    title,
    done: false
  });
  taskTitle.value = '';
  closeModal();
  render();
}
function deleteTask(sec, i) {
  db[todayKey].sections[sec].splice(i,1);
  render();
}
function toggleDone(sec, i) {
  const t = db[todayKey].sections[sec][i];
  t.done = !t.done;
  render();
}

/* PROGRESS */
function updateProgress() {
  let total = 0, done = 0;
  sectionsConfig.forEach(s => {
    db[todayKey].sections[s.id].forEach(t => {
      total++;
      if (t.done) done++;
    });
  });
  const percent = total ? Math.round((done/total)*100) : 0;
  progressText.innerText = `Today: ${percent}%`;
  progressFill.style.width = percent + '%';
  updateStreak(percent);

}

/* CALENDAR */
function renderCalendar() {
  const strip = document.getElementById('calendarStrip');
  const today = new Date();
  for (let i=-3;i<=3;i++){
    const d=new Date(today);
    d.setDate(today.getDate()+i);
    const key=d.toISOString().split('T')[0];
    const div=document.createElement('div');
    div.className='calendar-day'+(key===todayKey?' active':'');
    div.innerHTML=`${d.getDate()}<br><small>${d.toLocaleDateString('en',{weekday:'short'})}</small>`;
    div.onclick=()=>location.href=`history.html?date=${key}`;
    strip.appendChild(div);
  }
}

renderCalendar();
render();
function updateStreak(percent) {
  const streakData = JSON.parse(localStorage.getItem("streakData")) || {
    current: 0,
    best: 0,
    lastDate: null
  };

  if (percent >= 70) {
    if (streakData.lastDate !== todayKey) {
      streakData.current += 1;
      streakData.lastDate = todayKey;
      if (streakData.current > streakData.best) {
        streakData.best = streakData.current;
      }
    }
  } else {
    if (streakData.lastDate !== todayKey) {
      streakData.current = 0;
      streakData.lastDate = todayKey;
    }
  }

  localStorage.setItem("streakData", JSON.stringify(streakData));

  document.getElementById("currentStreak").innerText = streakData.current;
  document.getElementById("bestStreak").innerText = streakData.best;
}

