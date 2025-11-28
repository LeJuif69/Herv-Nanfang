import React from 'react';
import { Play, Square, FastForward, Rewind, Activity } from 'lucide-react';

interface TransportProps {
  isPlaying: boolean;
  bpm: number;
  time: number; // in seconds
  onPlayPause: () => void;
  onStop: () => void;
  onBpmChange: (bpm: number) => void;
}

const Transport: React.FC<TransportProps> = ({ isPlaying, bpm, time, onPlayPause, onStop, onBpmChange }) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 100);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
  };

  return (
    <div className="h-16 bg-daw-800 border-t border-daw-700 flex items-center justify-between px-6 select-none z-50">
      
      {/* Controls */}
      <div className="flex items-center gap-4">
        <button className="text-daw-600 hover:text-white transition-colors">
          <Rewind size={20} />
        </button>
        <button 
          onClick={onStop}
          className="text-daw-600 hover:text-white transition-colors"
        >
          <Square size={20} fill="currentColor" />
        </button>
        <button 
          onClick={onPlayPause}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${isPlaying ? 'bg-daw-accent text-white shadow-[0_0_15px_rgba(99,102,241,0.5)]' : 'bg-daw-700 text-white hover:bg-daw-600'}`}
        >
          {isPlaying ? <span className="font-bold text-xs">II</span> : <Play size={18} fill="currentColor" className="ml-1" />}
        </button>
        <button className="text-daw-600 hover:text-white transition-colors">
          <FastForward size={20} />
        </button>
      </div>

      {/* Display */}
      <div className="bg-daw-900 px-6 py-2 rounded border border-daw-700 font-mono text-xl text-daw-accent tracking-widest shadow-inner">
        {formatTime(time)}
      </div>

      {/* Metronome & Settings */}
      <div className="flex items-center gap-6">
        <div className="flex flex-col items-center group cursor-pointer">
           <span className="text-xs text-daw-600 uppercase font-bold tracking-wider group-hover:text-daw-accent">Tempo</span>
           <div className="flex items-center gap-1">
             <input 
              type="number" 
              value={bpm}
              onChange={(e) => onBpmChange(Number(e.target.value))}
              className="bg-transparent w-12 text-center text-white font-mono outline-none border-b border-transparent focus:border-daw-accent"
             />
             <span className="text-xs text-daw-500">BPM</span>
           </div>
        </div>
        
        <div className="flex flex-col items-center">
            <span className="text-xs text-daw-600 uppercase font-bold tracking-wider">CPU</span>
            <div className="w-20 h-2 bg-daw-900 rounded-full mt-1 overflow-hidden">
                <div className="h-full bg-emerald-500 w-1/4 animate-pulse"></div>
            </div>
        </div>

        <div className="text-daw-600 hover:text-white cursor-pointer" title="Collaborators Active">
          <Activity size={20} />
        </div>
      </div>
    </div>
  );
};

export default Transport;
