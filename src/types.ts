/** A person participating in the sweepstake. */
export interface Participant {
  id: string;
  name: string;
}

/** A single entry (e.g. a team, horse, number) that will be drawn. */
export interface Entry {
  id: string;
  label: string;
}

/** The allocation of one or more entries to a participant. */
export interface Allocation {
  participant: Participant;
  entries: Entry[];
}

/** The full result of a sweepstake draw. */
export interface DrawResult {
  title: string;
  allocations: Allocation[];
  /** Entries that could not be assigned (participants < entries edge-case warning). */
  unassigned: Entry[];
}
