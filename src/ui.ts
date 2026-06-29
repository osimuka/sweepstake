import type { DrawResult } from './types.js';

// ── Helpers ────────────────────────────────────────────────────────────────

function getEl<T extends HTMLElement>(id: string): T {
  const el = document.getElementById(id);
  if (!el) throw new Error(`Element #${id} not found`);
  return el as T;
}

function show(el: HTMLElement): void {
  el.classList.remove('hidden');
}

function hide(el: HTMLElement): void {
  el.classList.add('hidden');
}

// ── Badge update ───────────────────────────────────────────────────────────

export function updateBadge(badgeId: string, count: number): void {
  getEl(badgeId).textContent = String(count);
}

// ── Tag list rendering ─────────────────────────────────────────────────────

/**
 * Render a list of tags inside `listEl`. Each tag has a remove button that
 * calls `onRemove(id)`.
 */
export function renderTagList(
  listEl: HTMLUListElement,
  items: Array<{ id: string; label: string }>,
  onRemove: (id: string) => void,
): void {
  listEl.innerHTML = '';
  items.forEach(({ id, label }) => {
    const li = document.createElement('li');
    li.className = 'name-tag';
    li.dataset['itemId'] = id;

    const span = document.createElement('span');
    span.textContent = label;

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.setAttribute('aria-label', `Remove ${label}`);
    btn.textContent = '×';
    btn.addEventListener('click', () => onRemove(id));

    li.appendChild(span);
    li.appendChild(btn);
    listEl.appendChild(li);
  });
}

// ── Validation message ─────────────────────────────────────────────────────

export function showValidation(message: string): void {
  const el = getEl('validationMsg');
  el.textContent = message;
  show(el);
}

export function clearValidation(): void {
  hide(getEl('validationMsg'));
}

// ── Results rendering ──────────────────────────────────────────────────────

export function renderResults(result: DrawResult): void {
  // Update title
  getEl('resultsTitle').textContent = result.title || 'Results';

  const grid = getEl('resultsGrid');
  grid.innerHTML = '';

  result.allocations.forEach(({ participant, entries }, index) => {
    const card = document.createElement('div');
    card.className = 'result-item';
    card.style.animationDelay = `${index * 60}ms`;

    const nameEl = document.createElement('div');
    nameEl.className = 'participant-name';
    nameEl.textContent = participant.name;
    card.appendChild(nameEl);

    if (entries.length === 0) {
      const noEntry = document.createElement('div');
      noEntry.className = 'entries-label';
      noEntry.textContent = 'No entry drawn';
      card.appendChild(noEntry);
    } else {
      const label = document.createElement('div');
      label.className = 'entries-label';
      label.textContent = entries.length === 1 ? 'Entry' : 'Entries';
      card.appendChild(label);

      entries.forEach(({ label: entryLabel }) => {
        const pill = document.createElement('span');
        pill.className = 'entry-pill';
        pill.textContent = entryLabel;
        card.appendChild(pill);
      });
    }

    grid.appendChild(card);
  });

  if (result.unassigned.length > 0) {
    showValidation(
      `⚠️ ${result.unassigned.length} entr${result.unassigned.length === 1 ? 'y' : 'ies'} could not be assigned.`,
    );
  }

  show(getEl('resultsSection'));
  getEl('resultsSection').scrollIntoView({ behavior: 'smooth' });
}

// ── Bulk textarea toggle ───────────────────────────────────────────────────

export function toggleBulkArea(areaId: string, saveId: string): void {
  const area = getEl(areaId);
  const saveBtn = getEl(saveId);
  const isHidden = area.classList.contains('hidden');
  if (isHidden) {
    show(area);
    show(saveBtn);
    area.focus();
  } else {
    hide(area);
    hide(saveBtn);
  }
}

// ── Section visibility ─────────────────────────────────────────────────────

export function showSetup(): void {
  show(getEl('setupSection'));
  hide(getEl('resultsSection'));
}

export function hideSetup(): void {
  hide(getEl('setupSection'));
}
