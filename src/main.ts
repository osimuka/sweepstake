import type { Participant, Entry } from './types.js';
import { draw } from './draw.js';
import {
  updateBadge,
  renderTagList,
  showValidation,
  clearValidation,
  renderResults,
  toggleBulkArea,
  showSetup,
} from './ui.js';

// ── State ──────────────────────────────────────────────────────────────────

let participants: Participant[] = [];
let entries: Entry[] = [];

let nextParticipantId = 1;
let nextEntryId = 1;

// ── Helpers ────────────────────────────────────────────────────────────────

function getInput(id: string): HTMLInputElement {
  return document.getElementById(id) as HTMLInputElement;
}

function getTextarea(id: string): HTMLTextAreaElement {
  return document.getElementById(id) as HTMLTextAreaElement;
}

function getUl(id: string): HTMLUListElement {
  return document.getElementById(id) as HTMLUListElement;
}

// ── Participants ───────────────────────────────────────────────────────────

function addParticipant(name: string): void {
  const trimmed = name.trim();
  if (!trimmed) return;
  participants.push({ id: `p${nextParticipantId++}`, name: trimmed });
  renderParticipants();
}

function removeParticipant(id: string): void {
  participants = participants.filter((p) => p.id !== id);
  renderParticipants();
}

function renderParticipants(): void {
  renderTagList(
    getUl('participantList'),
    participants.map((p) => ({ id: p.id, label: p.name })),
    removeParticipant,
  );
  updateBadge('participantCount', participants.length);
}

// ── Entries ────────────────────────────────────────────────────────────────

function addEntry(label: string): void {
  const trimmed = label.trim();
  if (!trimmed) return;
  entries.push({ id: `e${nextEntryId++}`, label: trimmed });
  renderEntries();
}

function removeEntry(id: string): void {
  entries = entries.filter((e) => e.id !== id);
  renderEntries();
}

function renderEntries(): void {
  renderTagList(
    getUl('itemList'),
    entries.map((e) => ({ id: e.id, label: e.label })),
    removeEntry,
  );
  updateBadge('itemCount', entries.length);
}

// ── Draw ───────────────────────────────────────────────────────────────────

function handleDraw(): void {
  clearValidation();

  if (participants.length === 0) {
    showValidation('Please add at least one participant.');
    return;
  }
  if (entries.length === 0) {
    showValidation('Please add at least one entry.');
    return;
  }

  const title = getInput('sweepstakeTitle').value.trim() || 'Sweepstake Draw';
  const result = draw(title, participants, entries);
  renderResults(result);
}

// ── Reset ──────────────────────────────────────────────────────────────────

function handleReset(): void {
  participants = [];
  entries = [];
  nextParticipantId = 1;
  nextEntryId = 1;

  renderParticipants();
  renderEntries();
  clearValidation();
  getInput('sweepstakeTitle').value = '';
  getInput('participantInput').value = '';
  getInput('itemInput').value = '';

  showSetup();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ── Bulk input helpers ─────────────────────────────────────────────────────

function parseBulk(text: string): string[] {
  return text
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length > 0);
}

// ── Wire up event listeners ────────────────────────────────────────────────

function init(): void {
  // --- Participants ---
  const participantInput = getInput('participantInput');
  document.getElementById('addParticipantBtn')!.addEventListener('click', () => {
    addParticipant(participantInput.value);
    participantInput.value = '';
    participantInput.focus();
  });
  participantInput.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      addParticipant(participantInput.value);
      participantInput.value = '';
    }
  });

  // Bulk participants
  document.getElementById('bulkParticipantBtn')!.addEventListener('click', () => {
    toggleBulkArea('bulkParticipantArea', 'bulkParticipantSave');
  });
  document.getElementById('bulkParticipantSave')!.addEventListener('click', () => {
    parseBulk(getTextarea('bulkParticipantArea').value).forEach(addParticipant);
    getTextarea('bulkParticipantArea').value = '';
    toggleBulkArea('bulkParticipantArea', 'bulkParticipantSave');
  });

  // --- Entries ---
  const itemInput = getInput('itemInput');
  document.getElementById('addItemBtn')!.addEventListener('click', () => {
    addEntry(itemInput.value);
    itemInput.value = '';
    itemInput.focus();
  });
  itemInput.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      addEntry(itemInput.value);
      itemInput.value = '';
    }
  });

  // Bulk entries
  document.getElementById('bulkItemBtn')!.addEventListener('click', () => {
    toggleBulkArea('bulkItemArea', 'bulkItemSave');
  });
  document.getElementById('bulkItemSave')!.addEventListener('click', () => {
    parseBulk(getTextarea('bulkItemArea').value).forEach(addEntry);
    getTextarea('bulkItemArea').value = '';
    toggleBulkArea('bulkItemArea', 'bulkItemSave');
  });

  // --- Draw ---
  document.getElementById('drawBtn')!.addEventListener('click', handleDraw);

  // --- Reset ---
  document.getElementById('resetBtn')!.addEventListener('click', handleReset);

  // --- Print ---
  document.getElementById('printBtn')!.addEventListener('click', () => window.print());
}

// ── Bootstrap ──────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', init);
