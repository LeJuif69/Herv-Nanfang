import { InstrumentPatch, SynthParameters } from '../../types';

/**
 * SoundBankService
 * - Génère des descripteurs de sons à partir d'un prompt textuel (IA ou fallback local)
 * - Transforme des descripteurs en patches jouables
 * - Enregistre les instruments localement
 *
 * Notes :
 * - Essaie d'appeler l'API interne /api/generateSoundBank si disponible (server-side Gemini/Felu)
 * - Fournit un fallback heuristique si l'API n'est pas disponible
 */
export class SoundBankService {
  private registry: Map<string, InstrumentPatch> = new Map();

  constructor() {}

  /**
   * generateDescriptor
   * Prend un prompt textuel (ex: "Makossa Bass tight, punchy") et retourne un descripteur de synthèse
   */
  async generateDescriptor(prompt: string): Promise<any> {
    // Try server-side API first
    try {
      const resp = await fetch('/api/generateSoundBank', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });
      if (resp.ok) {
        const json = await resp.json();
        return json.descriptor || json;
      }
    } catch (e) {
      // continue to fallback
      console.warn('SoundBankService: API call failed, using fallback generator', e);
    }

    // Fallback heuristic generator
    return this.fallbackGenerateDescriptor(prompt);
  }

  /**
   * Fallback local generator: convert a textual prompt to a simple descriptor
   */
  fallbackGenerateDescriptor(prompt: string) {
    const lower = prompt.toLowerCase();
    const descriptor: any = {
      name: prompt,
      oscillator: { type: 'sawtooth', detune: 0 },
      envelope: { attack: 0.01, decay: 0.2, sustain: 0.8, release: 0.3 },
      filter: { type: 'lowpass', frequency: 1200, Q: 1 },
      lfo: { rate: 5, depth: 0.02 },
      grain: null,
      metadata: { tags: [] }
    };

    if (lower.includes('bass') || lower.includes('808')) {
      descriptor.oscillator.type = 'sine';
      descriptor.envelope = { attack: 0.005, decay: 0.12, sustain: 0.9, release: 0.2 };
      descriptor.filter.frequency = 900;
      descriptor.metadata.tags.push('bass');
    }
    if (lower.includes('makossa') || lower.includes('bikutsi') || lower.includes('afro')) {
      descriptor.oscillator.type = 'square';
      descriptor.envelope = { attack: 0.01, decay: 0.25, sustain: 0.75, release: 0.35 };
      descriptor.filter.frequency = 1800;
      descriptor.lfo = { rate: 4.5, depth: 0.03 };
      descriptor.metadata.tags.push('afro');
    }
    if (lower.includes('shaker') || lower.includes('percu') || lower.includes('dry')) {
      descriptor.oscillator.type = 'noise';
      descriptor.grain = { grainSize: 0.05, density: 0.8, texture: 'white' };
      descriptor.envelope = { attack: 0.001, decay: 0.06, sustain: 0.0, release: 0.05 };
      descriptor.metadata.tags.push('percussion');
    }

    return descriptor;
  }

  /**
   * createPatchFromDescriptor
   * Transforme un descripteur en InstrumentPatch (conforme aux types du projet)
   */
  createPatchFromDescriptor(descriptor: any): InstrumentPatch {
    const params: SynthParameters = {
      oscillatorType: (descriptor.oscillator && descriptor.oscillator.type) || 'sine',
      envelope: descriptor.envelope || { attack: 0.01, decay: 0.2, sustain: 0.8, release: 0.3 },
      filter: {
        type: (descriptor.filter && descriptor.filter.type) || 'lowpass',
        frequency: (descriptor.filter && descriptor.filter.frequency) || 1200,
        Q: (descriptor.filter && descriptor.filter.Q) || 1
      },
      lfo: descriptor.lfo || undefined
    };

    const patch: InstrumentPatch = {
      id: `patch_${Date.now()}`,
      name: descriptor.name || 'AI Patch',
      type: 'synth',
      parameters: params
    };

    return patch;
  }

  /**
   * registerInstrument
   * Enregistre le patch dans le registre local et renvoie son id
   */
  registerInstrument(patch: InstrumentPatch): string {
    this.registry.set(patch.id, patch);
    // Persist to localStorage for simple persistence
    try {
      const all = Array.from(this.registry.values());
      localStorage.setItem('jam_instruments', JSON.stringify(all));
    } catch (e) {
      // ignore storage errors
    }
    return patch.id;
  }

  /**
   * getInstrument
   */
  getInstrument(id: string): InstrumentPatch | undefined {
    return this.registry.get(id);
  }

  /**
   * loadFromStorage
   */
  loadFromStorage() {
    try {
      const raw = localStorage.getItem('jam_instruments');
      if (!raw) return;
      const arr: InstrumentPatch[] = JSON.parse(raw);
      arr.forEach(p => this.registry.set(p.id, p));
    } catch (e) {
      console.warn('SoundBankService: failed to load instruments', e);
    }
  }
}