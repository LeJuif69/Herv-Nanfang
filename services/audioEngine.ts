
import { Track, MidiNote, InstrumentPatch } from '../types';

/**
 * Singleton Audio Engine for Jam
 * Handles Web Audio Context, Scheduling, and Synthesis
 */
class AudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private isPlaying: boolean = false;
  private bpm: number = 120;
  private lookahead: number = 25.0; // ms
  private scheduleAheadTime: number = 0.1; // seconds
  private nextNoteTime: number = 0.0;
  private current16thNote: number = 0;
  private timerID: number | null = null;
  
  // Track specific nodes
  private trackNodes: Map<string, GainNode> = new Map();

  constructor() {
    // Lazy initialization handled in init() to respect browser autoplay policies
  }

  public init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.masterGain = this.ctx.createGain();
      this.masterGain.connect(this.ctx.destination);
    }
  }

  public async resume() {
    if (this.ctx && this.ctx.state === 'suspended') {
      await this.ctx.resume();
    }
  }

  public setBpm(bpm: number) {
    this.bpm = bpm;
  }

  public start() {
    if (!this.ctx) this.init();
    this.isPlaying = true;
    this.current16thNote = 0;
    this.nextNoteTime = this.ctx!.currentTime + 0.1;
    this.scheduler();
  }

  public stop() {
    this.isPlaying = false;
    if (this.timerID) window.clearTimeout(this.timerID);
  }

  private scheduler() {
    if (!this.ctx) return;

    // While there are notes that will need to play before the next interval, 
    // schedule them and advance the pointer.
    while (this.nextNoteTime < this.ctx.currentTime + this.scheduleAheadTime)