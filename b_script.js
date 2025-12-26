// Buddy System + CPU Scheduling (FCFS/SJF/NPP/RR) — NOTEBOOK STYLE
// ✅ Dynamic buddy blocks columns (keeps duplicates like 8,16,8 or 32,16,8,8)
// ✅ Placement HYBRID:
//    - Prefer EXACT column size match first
//    - Otherwise place into first larger column that fits
// ✅ Display label = Job + MR (A10, B6, C7, D20 ...)
// ✅ IE = Σ(Allocated block size - MR)
// ✅ EF (NOTEBOOK): EF = total free memory ONLY when there is waiting; else EF = 0
// ✅ OUT (FIXED):
//    - FCFS: WAITING ONLY
//    - Others: WAITING if any; else FINISHED-at-that-time
// ✅ Gantt Chart (NEW):
//    - Automatically shows IDLE when CPU has no runnable process between events (based on AT/BT)
function toggleSidePanel() {
    document.getElementById('sidePanel').classList.toggle('active');
}

function addProcess(prefill) {
  const tbody = document.getElementById('jobsBody');
  if (!tbody) return;

  const nextName = (() => {
    const existing = [...tbody.querySelectorAll('tr[data-proc]')]
      .map(tr => tr.getAttribute('data-proc'))
      .filter(Boolean);

    let code = 65;
    if (existing.length) {
      const max = Math.max(...existing.map(x => x.charCodeAt(0)));
      code = max + 1;
    }
    if (code <= 90) return String.fromCharCode(code);
    return `P${existing.length + 1}`;
  })();

  const p = prefill || { name: nextName, at: 0, bt: 1, mr: 1, priority: 1 };

  const tr = document.createElement('tr');
  tr.setAttribute('data-proc', p.name);

  const cpuAlgo = document.getElementById('cpuAlgo')?.value || 'fcfs';
  const priorityDisplay = cpuAlgo === 'npp' ? 'table-cell' : 'none';

  tr.innerHTML = `
    <td class="job-cell"><input class="job-name" value="${escapeHtml(p.name)}" maxlength="6" /></td>
    <td><input type="number" class="job-at" min="0" step="1" value="${Number(p.at) || 0}" /></td>
    <td><input type="number" class="job-bt" min="1" step="1" value="${Number(p.bt) || 1}" /></td>
    <td><input type="number" class="job-mr" min="1" step="1" value="${Number(p.mr) || 1}" /></td>
    <td class="priority-cell" style="display:${priorityDisplay};">
      <input type="number" class="job-priority" min="1" step="1" value="${Number(p.priority) || 1}" />
    </td>
  `;
  tbody.appendChild(tr);
}

function clearTable() {
  const tbody = document.getElementById('jobsBody');
  if (tbody) tbody.innerHTML = '';
  const ganttChart = document.getElementById('ganttChart');
  if (ganttChart) ganttChart.innerHTML = '';
  const resultBody = document.getElementById('resultBody');
  if (resultBody) resultBody.innerHTML = '';
  const info = document.getElementById('systemInfo');
  if (info) info.textContent = '';

  const theadRow = document.querySelector('.result-table thead tr');
  if (theadRow) {
    theadRow.innerHTML = `
      <th>Time</th>
      <th>Memory Space</th>
      <th>IE</th>
      <th>EF</th>
      <th>MU</th>
    `;
  }
}

function escapeHtml(str) {
  return String(str)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function showError(message) {
  const existing = document.querySelector('.error-notification');
  if (existing) existing.remove();

  const notification = document.createElement('div');
  notification.className = 'error-notification';
  notification.textContent = message;
  document.body.appendChild(notification);

  setTimeout(() => notification.remove(), 3000);
}

// ---------- Theme ----------
if (localStorage.getItem('theme') === 'dark') {
  document.body.setAttribute('data-theme', 'dark');
  const btn = document.querySelector('.theme-toggle');
  if (btn) btn.innerHTML = '☀️ Light';
}

function toggleTheme() {
  const body = document.body;
  const button = document.querySelector('.theme-toggle');
  if (!button) return;

  if (body.getAttribute('data-theme') === 'dark') {
    body.removeAttribute('data-theme');
    button.innerHTML = '🌙 Dark';
    localStorage.setItem('theme', 'light');
  } else {
    body.setAttribute('data-theme', 'dark');
    button.innerHTML = '☀️ Light';
    localStorage.setItem('theme', 'dark');
  }
}

// ---------- Helpers ----------
function isPowerOfTwo(n) {
  return Number.isInteger(n) && n > 0 && (n & (n - 1)) === 0;
}

function nextPowerOfTwo(n) {
  let p = 1;
  while (p < n) p <<= 1;
  return p;
}

function togglePriorityColumn() {
  const cpuAlgo = document.getElementById('cpuAlgo')?.value || 'fcfs';
  const priorityHeader = document.getElementById('priorityHeader');
  const priorityCells = document.querySelectorAll('.priority-cell');
  const quantumLabel = document.getElementById('quantumLabel');
  const timeQuantum = document.getElementById('timeQuantum');

  if (cpuAlgo === 'npp') {
    if (priorityHeader) priorityHeader.style.display = 'table-cell';
    priorityCells.forEach(cell => cell.style.display = 'table-cell');
  } else {
    if (priorityHeader) priorityHeader.style.display = 'none';
    priorityCells.forEach(cell => cell.style.display = 'none');
  }

  if (cpuAlgo === 'rr') {
    if (quantumLabel) quantumLabel.style.display = 'inline';
    if (timeQuantum) timeQuantum.style.display = 'inline';
  } else {
    if (quantumLabel) quantumLabel.style.display = 'none';
    if (timeQuantum) timeQuantum.style.display = 'none';
  }
}

window.addEventListener('DOMContentLoaded', () => {
  const memoryInput = document.getElementById('userSpace');
  if (!memoryInput) return;

  const validate = () => {
    const v = parseInt(memoryInput.value);
    if (!isPowerOfTwo(v)) {
      showError('Memory Space must be a power of 2 (2, 4, 8, 16, 32, 64, etc.)');
      memoryInput.value = 16;
    }
  };

  memoryInput.addEventListener('blur', validate);
  memoryInput.addEventListener('change', validate);
});

function readJobsFromTable() {
  const tbody = document.getElementById('jobsBody');
  const rows = tbody ? [...tbody.querySelectorAll('tr')] : [];

  const jobs = rows.map(tr => {
    const name = tr.querySelector('.job-name')?.value?.trim() || '';
    const at = Number(tr.querySelector('.job-at')?.value);
    const bt = Number(tr.querySelector('.job-bt')?.value);
    const mr = Number(tr.querySelector('.job-mr')?.value);
    const priority = Number(tr.querySelector('.job-priority')?.value) || 1;
    return { name, at, bt, mr, priority };
  }).filter(j =>
    j.name &&
    Number.isFinite(j.at) && j.at >= 0 &&
    Number.isFinite(j.bt) && j.bt > 0 &&
    Number.isFinite(j.mr) && j.mr > 0
  );

  return jobs.map(j => ({
    ...j,
    name: j.name.length === 1 ? j.name.toUpperCase() : j.name
  }));
}

// ---------- Buddy Memory ----------
function createBuddyMemory(total) {
  return [{ start: 0, size: total, job: null }];
}

function splitUntilFit(memory, index, neededSize) {
  while (memory[index].size > neededSize) {
    const b = memory[index];
    const half = b.size / 2;
    memory.splice(index, 1,
      { start: b.start, size: half, job: null },
      { start: b.start + half, size: half, job: null }
    );
  }
}

function buddyAllocate(memory, job, totalMemory) {
  const needed = nextPowerOfTwo(job.mr);
  if (needed > totalMemory) return { ok: false, reason: 'Need > total' };

  for (let i = 0; i < memory.length; i++) {
    const b = memory[i];
    if (!b.job && b.size >= needed) {
      splitUntilFit(memory, i, needed);
      memory[i].job = job;
      job._allocSize = needed;
      job._start = memory[i].start;
      return { ok: true, allocated: needed };
    }
  }
  return { ok: false, reason: 'No block available' };
}

function buddyFree(memory, job) {
  for (const b of memory) {
    if (b.job && b.job.name === job.name) b.job = null;
  }

  let merged = true;
  while (merged) {
    merged = false;
    memory.sort((a, b) => a.start - b.start);

    for (let i = 0; i < memory.length - 1; i++) {
      const a = memory[i];
      const b = memory[i + 1];
      if (a.job || b.job) continue;
      if (a.size !== b.size) continue;

      if (b.start === a.start + a.size && (a.start % (2 * a.size) === 0)) {
        memory.splice(i, 2, { start: a.start, size: a.size * 2, job: null });
        merged = true;
        break;
      }
    }
  }
}

function freeTotal(memory) {
  return memory.filter(b => !b.job).reduce((s, b) => s + b.size, 0);
}

// ---------- NOTEBOOK: Buddy Blocks columns (keep duplicates) ----------
function parseBuddyColumns() {
  const raw = document.getElementById('buddyBlocks')?.value ?? '';
  return raw
    .split(/[\s,]+/g)
    .map(s => s.trim())
    .filter(Boolean)
    .map(Number)
    .filter(n => Number.isFinite(n) && n > 0);
}

function buildNotebookRowCells(columns, memorySnapshot) {
  const allocated = memorySnapshot
    .filter(b => b.job)
    .sort((a, b) => a.start - b.start)
    .map(b => ({
      name: b.job.name,
      mr: b.job.mr,
      allocSize: b.size
    }));

  const slots = columns.map((size, idx) => ({ idx, size, filled: false, text: '', allocated: false }));

  for (const blk of allocated) {
    let target = slots.find(s => !s.filled && s.size === blk.allocSize);
    if (!target) target = slots.find(s => !s.filled && s.size > blk.allocSize);
    if (!target) continue;

    target.filled = true;
    target.allocated = true;
    target.text = `${blk.name}${blk.mr}`;
  }

  return slots.map(s => ({ text: s.text, allocated: s.allocated }));
}

// ---------- Simulation ----------
function simulate() {
  const info = document.getElementById('systemInfo');
  const resultBody = document.getElementById('resultBody');
  if (info) info.textContent = '';
  if (resultBody) resultBody.innerHTML = '';

  const totalMemory = Number(document.getElementById('userSpace')?.value);
  const cpuAlgo = document.getElementById('cpuAlgo')?.value || 'fcfs';

  if (!Number.isFinite(totalMemory) || totalMemory <= 0 || !isPowerOfTwo(totalMemory)) {
    showError('Memory Space must be a power of 2 (2, 4, 8, 16, 32, 64, etc.)');
    const ms = document.getElementById('userSpace');
    if (ms) ms.value = 16;
    return;
  }

  const columns = parseBuddyColumns();
  if (!columns.length) {
    showError('Please enter Buddy Blocks like: 8,16,8 or 32,16,8,8');
    return;
  }

  const jobsInput = readJobsFromTable();
  if (!jobsInput.length) {
    if (info) info.textContent = '⚠️ Please add at least one process with AT/BT/MR.';
    return;
  }

  const jobsCopy = jobsInput
    .map(j => ({ ...j }))
    .sort((a, b) => (a.at - b.at) || String(a.name).localeCompare(String(b.name)));

  const events = new Set(jobsCopy.map(j => j.at));
  let time = Math.min(...jobsCopy.map(j => j.at));
  if (!Number.isFinite(time) || time < 0) time = 0;

  let waiting = [];
  let cpuQueue = [];
  let running = null;
  let finishedNow = [];

  const memory = createBuddyMemory(totalMemory);
  const results = [];
  const ganttData = [];

  function snapshot() {
    memory.sort((a, b) => a.start - b.start);

    let IE = 0;
    for (const b of memory) {
      if (b.job) IE += (b.size - b.job.mr);
    }

    const totalFree = freeTotal(memory);
    const EF = (waiting.length > 0) ? totalFree : 0;

    const usedMem = totalMemory - totalFree;
    const MU = Math.max(0, Math.min(100, Math.round((usedMem / totalMemory) * 100)));

    const waitingOut = waiting.map(j => j.name).join(', ');
    const finishedOut = finishedNow.join(', ');

    // ✅ OUT fix (FCFS waiting-only)
    const OUT = (cpuAlgo === 'fcfs')
      ? (waitingOut || '')
      : (waitingOut || finishedOut || '');

    results.push({
      time,
      IE,
      EF,
      MU,
      out: OUT,
      memorySnapshot: memory.map(b => ({
        start: b.start,
        size: b.size,
        job: b.job ? { name: b.job.name, mr: b.job.mr } : null
      }))
    });
  }

  function admitArrivedJobs() {
    for (let i = 0; i < jobsCopy.length;) {
      if (jobsCopy[i].at === time) {
        waiting.push(jobsCopy[i]);
        jobsCopy.splice(i, 1);
      } else i++;
    }

    let progressed = true;
    while (progressed) {
      progressed = false;
      for (let i = 0; i < waiting.length; i++) {
        const j = waiting[i];
        const res = buddyAllocate(memory, j, totalMemory);
        if (res.ok) {
          cpuQueue.push({ ...j, started: false, finished: false, endTime: null, executedTime: 0 });
          cpuQueue.sort((a, b) => (a.at - b.at) || String(a.name).localeCompare(String(b.name)));
          waiting.splice(i, 1);
          progressed = true;
          break;
        }
      }
    }
  }

  // ---------------- CPU SCHEDULERS ----------------
  // (hindi gagalawin logic ng SJF/FCFS/NPP/RR — same decisions)
  function scheduleCPU_FCFS() {
    if (running) return;
    const next = cpuQueue.find(j => !j.finished && !j.started);
    if (next) {
      running = next;
      running.started = true;
      running.endTime = time + running.bt;
      events.add(running.endTime);
    }
  }

  function scheduleCPU_SJF() {
    if (running) return;
    const candidates = cpuQueue.filter(j => !j.finished && !j.started);
    if (!candidates.length) return;

    candidates.sort((a, b) =>
      (a.bt - b.bt) || (a.at - b.at) || String(a.name).localeCompare(String(b.name))
    );

    running = candidates[0];
    running.started = true;
    running.endTime = time + running.bt;
    events.add(running.endTime);
  }

  function scheduleCPU_NPP() {
    if (running) return;

    const ready = cpuQueue.filter(j => !j.finished && !j.started);
    if (!ready.length) return;

    ready.sort((a, b) =>
      (a.priority - b.priority) ||
      (a.at - b.at) ||
      String(a.name).localeCompare(String(b.name))
    );

    running = ready[0];
    running.started = true;
    running.endTime = time + running.bt;
    events.add(running.endTime);
  }

  function scheduleCPU_RR() {
    if (running) return;

    const candidates = cpuQueue.filter(j => !j.finished && !j.started);
    if (!candidates.length) return;

    const quantum = Number(document.getElementById('timeQuantum')?.value) || 2;

    const next = candidates[0];
    running = next;
    running.started = true;

    const remainingTime = running.bt - (running.executedTime || 0);
    const executeTime = Math.min(quantum, remainingTime);

    running.endTime = time + executeTime;
    running.executedTime = (running.executedTime || 0) + executeTime;

    events.add(running.endTime);
  }

  function completeCPUIfNeeded() {
    if (running && running.endTime === time) {
      // Gantt record for full-run algorithms (FCFS/SJF/NPP)
      ganttData.push({ job: running.name, start: time - running.bt, end: time });

      finishedNow.push(running.name);
      buddyFree(memory, running);
      running.finished = true;
      running = null;
    }
  }

  function completeCPU_RR() {
    if (!running || running.endTime !== time) return;

    const quantum = Number(document.getElementById('timeQuantum')?.value) || 2;
    const slice = Math.min(quantum, running.executedTime || quantum);

    ganttData.push({ job: running.name, start: time - slice, end: time });

    if ((running.executedTime || 0) >= running.bt) {
      finishedNow.push(running.name);
      buddyFree(memory, running);
      running.finished = true;
      running = null;
    } else {
      running.started = false; // back to queue
      running = null;
    }
  }

  // helper: check if any runnable job exists now
  function hasRunnableNow() {
    return cpuQueue.some(j => !j.finished && !j.started);
  }

  // initial
  finishedNow = [];
  admitArrivedJobs();

  if (cpuAlgo === 'sjf') scheduleCPU_SJF();
  else if (cpuAlgo === 'npp') scheduleCPU_NPP();
  else if (cpuAlgo === 'rr') scheduleCPU_RR();
  else scheduleCPU_FCFS();

  snapshot();

  while (jobsCopy.length || waiting.length || running || cpuQueue.some(j => !j.finished)) {
    const nextTimes = [...events].filter(t => t > time).sort((a, b) => a - b);
    if (!nextTimes.length) break;

    const nextTime = nextTimes[0];

    // ✅ NEW: AUTO IDLE SEGMENT (depends on given AT/BT)
    // If CPU has no running job and no runnable job now,
    // then CPU is idle until the next event time (usually next arrival).
    if (!running && !hasRunnableNow() && nextTime > time) {
      ganttData.push({ job: 'IDLE', start: time, end: nextTime });
    }

    time = nextTime;
    finishedNow = [];

    if (cpuAlgo === 'rr') completeCPU_RR();
    else completeCPUIfNeeded();

    admitArrivedJobs();

    if (cpuAlgo === 'sjf') scheduleCPU_SJF();
    else if (cpuAlgo === 'npp') scheduleCPU_NPP();
    else if (cpuAlgo === 'rr') scheduleCPU_RR();
    else scheduleCPU_FCFS();

    snapshot();
  }

  // render headers
  const theadRow = document.querySelector('.result-table thead tr');
  if (theadRow) {
    theadRow.innerHTML = `
      <th>Time</th>
      ${columns.map(c => `<th>${escapeHtml(String(c))}</th>`).join('')}
      <th>IE</th>
      <th>EF</th>
      <th>Out</th>
      <th>%MU</th>
    `;
  }

  // render rows
  if (resultBody) {
    resultBody.innerHTML = results.map(r => {
      const cells = buildNotebookRowCells(columns, r.memorySnapshot);

      const memoryCellsHtml = cells.map(c => {
        const cls = c.allocated ? 'block-allocated' : 'block-free';
        return `<td class="memory-block-cell ${cls}">${escapeHtml(c.text)}</td>`;
      }).join('');

      return `
        <tr>
          <td>${r.time}</td>
          ${memoryCellsHtml}
          <td>${r.IE}</td>
          <td>${r.EF}</td>
          <td>${escapeHtml(r.out || '')}</td>
          <td>${r.MU}%</td>
        </tr>
      `;
    }).join('');
  }

  if (info) {
    info.innerHTML =
      `Memory Space = <b>${totalMemory}</b> | Buddy Blocks = <b>${escapeHtml(document.getElementById('buddyBlocks')?.value || '')}</b> | CPU Algo = <b>${cpuAlgo.toUpperCase()}</b>`;
  }

  // gantt render
  const ganttChart = document.getElementById('ganttChart');
  if (ganttChart) {
    if (!ganttData.length) {
      ganttChart.innerHTML = '<p>Run simulation to see Gantt chart</p>';
      return;
    }

    let html = '<div class="gantt-timeline">';
    let timeHtml = '<div class="gantt-times">';

    let currentTime = ganttData[0].start ?? 0;
    timeHtml += `<div class="gantt-time" style="flex:0; min-width:20px; text-align:left;">${currentTime}</div>`;

    ganttData.forEach(item => {
      const dur = item.end - item.start;
      html += `<div class="gantt-segment" style="flex:${dur}">${escapeHtml(item.job)}${dur}</div>`;
      currentTime = item.end;
      timeHtml += `<div class="gantt-time" style="flex:${dur}; text-align:right;">${currentTime}</div>`;
    });

    html += '</div>';
    timeHtml += '</div>';
    ganttChart.innerHTML = html + timeHtml;
  }
}
