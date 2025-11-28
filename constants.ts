import { Track, TrackType } from './types';

export const INITIAL_TRACKS: Track[] = [
  {
    id: 't1',
    name: 'Afrobeat Drums',
    type: TrackType.AUDIO,
    color: '#ef4444', // Red
    muted: false,
    solo: false,
    volume: 0.8,
    pan: 0,
    instrument: 'Drum Kit',
    regions: [
      { id: 'r1', start: 0, duration: 4, name: 'Main Groove', color: '#ef4444' },
      { id: 'r2', start: 4, duration: 4, name: 'Fill', color: '#ef4444' },
    ]
  },
  {
    id: 't2',
    name: 'Makossa Bass',
    type: TrackType.MIDI,
    color: '#3b82f6', // Blue
    muted: false,
    solo: false,
    volume: 0.75,
    pan: 0,
    instrument: 'Electric Bass',
    regions: [
      { id: 'r3', start: 0, duration: 8, name: 'Walking Bass', color: '#3b82f6' },
    ]
  },
  {
    id: 't3',
    name: 'Balafon Lead',
    type: TrackType.MIDI,
    color: '#f59e0b', // Amber
    muted: false,
    solo: false,
    volume: 0.6,
    pan: 0.2,
    instrument: 'Balafon',
    regions: [
      { id: 'r4', start: 2, duration: 6, name: 'Solo', color: '#f59e0b' },
    ]
  }
];

export const GENRES = [
  'Afrobeat',
  'Makossa',
  'Bikutsi',
  'Highlife',
  'Amapiano',
  'Trap',
  'Lo-Fi',
  'Cinematic'
];

export const INSTRUMENTS = [
  'Balafon',
  'Kora',
  'Talking Drum',
  'Mbira',
  'Synthesizer',
  'Grand Piano',
  '808 Bass',
  'Electric Guitar'
];
