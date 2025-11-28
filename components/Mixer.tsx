import React from 'react';
import { Track } from '../types';
import { Mic, Music, Volume2 } from 'lucide-react';

interface MixerProps {
  tracks: Track[];
  onVolumeChange: (id: string, val: number) => void;
  onToggleMute: (id: string) => void;
  onToggleSolo: (id: string) => void;
}

const MixerStrip: React.FC<{ 
  track: Track; 
  onVolumeChange: (val: number) => void; 
  onMute: () => void; 
  onSolo: () => void;
}> = ({ track, onVolumeChange, onMute, onSolo }) => {
  return (
    <div className="w-24 bg-daw-800 border-r border-daw-900 flex flex-col pb-2 relative group">
      {/* Header */}
      <div className="h-8 bg-daw-700 flex items-center justify-center text-xs font-bold truncate px-1" style={{ borderTop: `2px solid ${track.color}`}}>
        {track.name}
      </div>

      {/* EQ Preview (Visual Only) */}
      <div className="h-16 bg-daw-900 m-2 rounded opacity-50 flex items-end justify-center gap-[2px] p-1">
         {[...Array(6)].map((_, i) => (
             <div key={i} className="w-2 bg-daw-600 rounded-t-sm" style={{ height: `${Math.random() * 80 + 20}%`}}></div>
         ))}
      </div>

      {/* Pan Knob (Visual) */}
      <div className="flex justify-center my-2">
        <div className="w-8 h-8 rounded-full border-2 border-daw-600 flex items-center justify-center transform rotate-[-45deg] cursor-pointer hover:border-daw-400">
           <div className="w-1 h-3 bg-white -mt-3 rounded-full"></div>
        </div>
      </div>

      {/* Volume Fader Area */}
      <div className="flex-1 flex justify-center py-2 relative">
         <div className="h-full w-2 bg-daw-900 rounded-full relative">
            <input 
              type="range" 
              min="0" 
              max="1" 
              step="0.01"
              orient="vertical"
              value={track.volume}
              onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
              className="absolute inset-0 w-full h-full opacity-0 cursor-ns-resize z-10"
              style={{ appearance: 'slider-vertical' } as any}
            />
            {/* Custom Fader Handle */}
            <div 
                className="absolute w-8 h-4 bg-daw-400 rounded shadow-md left-1/2 transform -translate-x-1/2 pointer-events-none"
                style={{ bottom: `${track.volume * 100}%`, marginBottom: '-8px' }}
            >
                <div className="w-full h-[1px] bg-black opacity-50 mt-[7px]"></div>
            </div>
         </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-center gap-2 mt-2 px-2">
        <button 
          onClick={onMute}
          className={`w-6 h-6 rounded text-xs font-bold ${track.muted ? 'bg-red-500 text-white' : 'bg-daw-700 text-daw-400 hover:bg-daw-600'}`}
        >M</button>
        <button 
          onClick={onSolo}
          className={`w-6 h-6 rounded text-xs font-bold ${track.solo ? 'bg-yellow-500 text-black' : 'bg-daw-700 text-daw-400 hover:bg-daw-600'}`}
        >S</button>
      </div>
      
      {/* Icon */}
      <div className="mt-2 flex justify-center text-daw-500">
         {track.instrument?.includes('Drum') ? <Music size={16} /> : <Volume2 size={16} />}
      </div>
    </div>
  );
}

const Mixer: React.FC<MixerProps> = ({ tracks, onVolumeChange, onToggleMute, onToggleSolo }) => {
  return (
    <div className="h-64 bg-daw-800 border-t border-daw-700 flex overflow-x-auto">
      <div className="flex min-w-full">
        {tracks.map(track => (
          <MixerStrip 
            key={track.id} 
            track={track}
            onVolumeChange={(val) => onVolumeChange(track.id, val)}
            onMute={() => onToggleMute(track.id)}
            onSolo={() => onToggleSolo(track.id)}
          />
        ))}
        
        {/* Master Channel */}
        <div className="w-28 bg-daw-900 border-l border-daw-700 flex flex-col pb-2 ml-auto shadow-2xl z-10">
            <div className="h-8 bg-daw-900 flex items-center justify-center text-xs font-bold text-daw-accent">MASTER</div>
            <div className="flex-1 flex justify-center py-4">
                 {/* Simple Master VU Meter */}
                 <div className="flex gap-1 h-full">
                    <div className="w-3 bg-daw-800 rounded-full overflow-hidden flex flex-col-reverse">
                        <div className="h-[70%] w-full bg-gradient-to-t from-green-500 via-yellow-500 to-red-500 opacity-80"></div>
                    </div>
                    <div className="w-3 bg-daw-800 rounded-full overflow-hidden flex flex-col-reverse">
                        <div className="h-[65%] w-full bg-gradient-to-t from-green-500 via-yellow-500 to-red-500 opacity-80"></div>
                    </div>
                 </div>
            </div>
             <div className="flex justify-center mt-2">
                <span className="text-xs font-mono text-daw-400">-3.2dB</span>
             </div>
        </div>
      </div>
    </div>
  );
};

export default Mixer;
