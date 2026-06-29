import type { Entry, Participant, DrawResult, Allocation } from './types.js';

/**
 * Fisher-Yates shuffle — returns a new shuffled copy of the array.
 */
function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Perform the sweepstake draw.
 *
 * Rules:
 *  - Every participant is guaranteed at least one entry (if entries >= participants).
 *  - Remaining entries (entries > participants) are distributed round-robin after
 *    the initial allocation.
 *  - If participants > entries some participants receive no entry; they are still
 *    included in allocations with an empty entries array so the caller can warn.
 */
export function draw(
  title: string,
  participants: Participant[],
  entries: Entry[],
): DrawResult {
  const shuffledEntries = shuffle(entries);
  const shuffledParticipants = shuffle(participants);

  const allocationMap = new Map<string, Allocation>(
    shuffledParticipants.map((p) => [p.id, { participant: p, entries: [] }]),
  );

  shuffledEntries.forEach((entry, index) => {
    const participant = shuffledParticipants[index % shuffledParticipants.length];
    allocationMap.get(participant.id)!.entries.push(entry);
  });

  const allocations = shuffledParticipants.map((p) => allocationMap.get(p.id)!);

  return { title, allocations, unassigned: [] };
}
