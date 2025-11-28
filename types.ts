
export enum TrackType {
  AUDIO = 'AUDIO',
  MIDI = 'MIDI',
  HYBRID = 'HYBRID'
}

export enum GeneratorMode {
  COMPOSITION = 'COMPOSITION',
  INSTRUMENT = 'INSTRUMENT',
  STEMS = 'STEMS'
}

export interface Region {
  id: string;
  start: number; // in bars
  duration: number; // in bars
  name: string;
  color: string;
  // For MIDI regions, we'd have notes here in a real app
  notes?: MidiNote[];
}

export interface MidiNote {
  midi: number;
  time: number; // relative to region start in beats
  duration: number;
  velocity: number;
}

export interface InstrumentPatch {
  id: string;
  name: string;
  type: 'synth' | 'sampler' | 'procedural';
  parameters: SynthParameters;
}

export interface SynthParameters {
  oscillatorType?: 'sine' | 'square' | 'sawtooth' | 'triangle' | 'custom';
  envelope?: {
    attack: number;
    decay: number;
    sustain: number;
    release: number;
  };
  filter?: {
    type: BiquadFilterType;
    frequency: number;
    Q: number;
  };
  lfo?: {
    rate: number;
    depth: number;
  };
}

export interface Track {
  id: string;
  name: string;
  type: TrackType;
  color: string;
  muted: boolean;
  solo: boolean;
  volume: number; // 0 to 1
  pan: number; // -1 to 1
  regions: Region[];
  instrument?: string; // e.g., "Kora", "808 Bass"
  patch?: InstrumentPatch; // The actual sound definition
}

export interface ProjectState {
  id: string;
  name: string;
  bpm: number;
  isPlaying: boolean;
  currentTime: number; // in seconds
  tracks: Track[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}
