const sectionsConfig = [
  { id: 'morning', title: '🌅 Morning Routine' },
  { id: 'focus', title: '🧠 Focus Block' },
  { id: 'day', title: '🏫 Day Work' },
  { id: 'skill', title: '🚀 Skill Growth' }
];

let activeSection = null;

const todayKey = new Date().toISOString().split('T')[0];
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
    const card = document.createElement('div');
    card.className = 'section';

    card.innerHTML = `
      <div class="section-header">
        <h2>${section.title}</h2>
        <button class="add-btn" onclick="openModal('${section.id}')">+</button>
      </div>
    `;

    db[todayKey].sections[section.id].forEach((task, index) => {
      const taskDiv = document.createElement('div');
      taskDiv.className = `task ${task.done ? 'done' : ''}`;

      taskDiv.innerHTML = `
        <label>
          <input 
            type="checkbox"
            ${task.done ? 'checked' : ''}
            onchange="toggleDone('${section.id}', ${index})"
          >
          <span>
            ${task.title}<br>
            <small>${task.start} – ${task.end}</small>
          </span>
        </label>
        <button onclick="deleteTask('${section.id}', ${index})">✕</button>
      `;

      card.appendChild(taskDiv);
    });

    container.appendChild(card);
  });
updateProgress();

  saveDB();
}

function openModal(sectionId) {
  activeSection = sectionId;
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
    start: startTime.value,
    end: endTime.value,
    done: false
  });

  taskTitle.value = '';
  startTime.value = '';
  endTime.value = '';

  closeModal();
  render();
}

function deleteTask(sectionId, index) {
  db[todayKey].sections[sectionId].splice(index, 1);
  render();
}

function toggleDone(sectionId, index) {
  const task = db[todayKey].sections[sectionId][index];
  task.done = !task.done;
  render();
}

/* Date & Time */
function updateTime() {
  const now = new Date();
  todayDate.innerText = now.toDateString();
  liveTime.innerText = now.toLocaleTimeString();
}

setInterval(updateTime, 1000);
updateTime();
render();
function updateProgress() {
  let total = 0;
  let done = 0;

  sectionsConfig.forEach(section => {
    db[todayKey].sections[section.id].forEach(task => {
      total++;
      if (task.done) done++;
    });
  });

  const percent = total === 0 ? 0 : Math.round((done / total) * 100);

  const text = document.getElementById('progressText');
  const fill = document.getElementById('progressFill');

  if (text && fill) {
    text.innerText = `Today: ${percent}% completed`;
    fill.style.width = percent + '%';
  }
}
.calendar-strip {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding: 10px 12px;
  margin-bottom: 10px;
}

.calendar-day {
  min-width: 52px;
  padding: 8px;
  text-align: center;
  border-radius: 12px;
  background: rgba(255,255,255,0.1);
  font-size: 12px;
  cursor: pointer;
}

.calendar-day.active {
  background: #00c853;
  color: #000;
  font-weight: 600;
}

