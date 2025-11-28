import React, { useState } from 'react';
import { Sparkles, Wand2, RefreshCw, Cpu, Database } from 'lucide-react';
import { GENRES, INSTRUMENTS } from '../constants';
import { generateTrackIdeas } from '../services/geminiService';
import { Track } from '../types';

interface AIPanelProps {
  onGenerate: (trackData: Partial<Track>) => void;
}

const AIPanel: React.FC<AIPanelProps> = ({ onGenerate }) => {
  const [prompt, setPrompt] = useState('');
  const [selectedGenre, setSelectedGenre] = useState(GENRES[0]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<'generate' | 'banks'>('generate');

  const handleGenerate = async () => {
    if (!prompt) return;
    setIsGenerating(true);
    
    try {
      // 1. Get Idea from Gemini
      const idea = await generateTrackIdeas(prompt, selectedGenre);
      
      // 2. Simulate "Thinking" and Audio Generation latency
      setTimeout(() => {
        onGenerate({
          name: idea.trackName || 'AI Generated',
          instrument: idea.instrument || 'Synth',
          color: '#818cf8', // Indigo
          type: 'MIDI', // Default to MIDI for generated patterns
          regions: [{
            id: `gen-${Date.now()}`,
            start: 0,
            duration: 4,
            name: idea.trackName || 'Generated Riff',
            color: '#818cf8'
          }]
        });
        setIsGenerating(false);
        setPrompt('');
      }, 2000);
    } catch (e) {
      console.error(e);
      setIsGenerating(false);
    }
  };

  return (
    <div className="w-80 bg-daw-800 border-r border-daw-700 flex flex-col h-full z-20 shadow-xl">
      {/* Tabs */}
      <div className="flex border-b border-daw-700">
        <button 
          onClick={() => setActiveTab('generate')}
          className={`flex-1 py-3 text-sm font-semibold flex items-center justify-center gap-2 ${activeTab === 'generate' ? 'bg-daw-700 text-white border-b-2 border-daw-accent' : 'text-daw-500 hover:text-white'}`}
        >
          <Sparkles size={16} /> Generator
        </button>
        <button 
          onClick={() => setActiveTab('banks')}
          className={`flex-1 py-3 text-sm font-semibold flex items-center justify-center gap-2 ${activeTab === 'banks' ? 'bg-daw-700 text-white border-b-2 border-daw-accent' : 'text-daw-500 hover:text-white'}`}
        >
          <Database size={16} /> Sound Banks
        </button>
      </div>

      <div className="p-4 flex-1 overflow-y-auto">
        {activeTab === 'generate' ? (
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-daw-400 uppercase mb-2">Prompt</label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe the sound (e.g., 'Energetic Makossa bassline with a funky groove')"
                className="w-full bg-daw-900 border border-daw-700 rounded p-3 text-sm text-white focus:border-daw-accent focus:ring-1 focus:ring-daw-accent outline-none h-24 resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-daw-400 uppercase mb-2">Genre</label>
                <select 
                  value={selectedGenre}
                  onChange={(e) => setSelectedGenre(e.target.value)}
                  className="w-full bg-daw-900 border border-daw-700 rounded p-2 text-sm text-white outline-none"
                >
                  {GENRES.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-daw-400 uppercase mb-2">Length</label>
                <select className="w-full bg-daw-900 border border-daw-700 rounded p-2 text-sm text-white outline-none">
                  <option>4 Bars</option>
                  <option>8 Bars</option>
                  <option>16 Bars</option>
                </select>
              </div>
            </div>

            <div className="p-3 bg-daw-900/50 rounded border border-daw-700/50">
                <div className="flex items-center gap-2 mb-2">
                    <Cpu size={14} className="text-daw-accent"/>
                    <span className="text-xs font-bold text-daw-300">Model Configuration</span>
                </div>
                <div className="flex justify-between text-xs text-daw-500">
                    <span>Model</span>
                    <span>Gemini 2.5 Flash</span>
                </div>
                <div className="flex justify-between text-xs text-daw-500">
                    <span>Latency</span>
                    <span>Real-time</span>
                </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={isGenerating || !prompt}
              className={`w-full py-3 rounded font-bold text-sm flex items-center justify-center gap-2 transition-all ${isGenerating ? 'bg-daw-700 text-daw-500 cursor-not-allowed' : 'bg-daw-accent hover:bg-indigo-500 text-white shadow-lg hover:shadow-indigo-500/25'}`}
            >
              {isGenerating ? <RefreshCw className="animate-spin" size={18}/> : <Wand2 size={18} />}
              {isGenerating ? 'Generating...' : 'Generate Audio'}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-sm text-daw-400 mb-4">
                Procedurally generate infinite unique sound banks using neural synthesis.
            </div>
            {INSTRUMENTS.map(inst => (
                <div key={inst} className="flex items-center justify-between p-3 bg-daw-900 rounded border border-daw-700 hover:border-daw-500 cursor-pointer group">
                    <span className="font-medium">{inst}</span>
                    <button className="opacity-0 group-hover:opacity-100 p-1 bg-daw-700 rounded text-daw-300 hover:text-white">
                        <RefreshCw size={14} />
                    </button>
                </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AIPanel;
