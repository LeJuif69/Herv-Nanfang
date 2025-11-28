import React, { useState, useEffect, useRef } from 'react';
import Transport from './components/Transport';
import Mixer from './components/Mixer';
import Timeline from './components/Timeline';
import AIPanel from './components/AIPanel';
import { INITIAL_TRACKS } from './constants';
import { Track, ProjectState } from './types';
import { Settings, Share2, Menu, Bell } from 'lucide-react';

const App: React.FC = () => {
  const [project, setProject] = useState<ProjectState>({
    id: 'proj_1',
    name: 'Untitled Jam 1',
    bpm: 120,
    isPlaying: false,
    currentTime: 0,
    tracks: INITIAL_TRACKS
  });

  const [zoomLevel, setZoomLevel] = useState(1);
  const [showMixer, setShowMixer] = useState(true);
  const playbackInterval = useRef<number | null>(null);

  // Playback Engine Simulation
  useEffect(() => {
    if (project.isPlaying) {
      const startTime = Date.now() - (project.currentTime * 1000);
      playbackInterval.current = window.setInterval(() => {
        const now = Date.now();
        const nextTime = (now - startTime) / 1000;
        
        // Loop at 16 bars (32 seconds at 120bpm)
        const loopLength = (60 / project.bpm) * 4 * 16;
        
        setProject(p => ({
          ...p,
          currentTime: nextTime % loopLength
        }));
      }, 16); // ~60fps
    } else {
      if (playbackInterval.current) {
        clearInterval(playbackInterval.current);
      }
    }
    return () => {
      if (playbackInterval.current) clearInterval(playbackInterval.current);
    };
  }, [project.isPlaying, project.bpm]);

  const handlePlayPause = () => {
    setProject(p => ({ ...p, isPlaying: !p.isPlaying }));
  };

  const handleStop = () => {
    setProject(p => ({ ...p, isPlaying: false, currentTime: 0 }));
  };

  const handleBpmChange = (bpm: number) => {
    setProject(p => ({ ...p, bpm }));
  };

  const handleVolumeChange = (trackId: string, val: number) => {
    setProject(p => ({
      ...p,
      tracks: p.tracks.map(t => t.id === trackId ? { ...t, volume: val } : t)
    }));
  };

  const handleToggleMute = (trackId: string) => {
    setProject(p => ({
      ...p,
      tracks: p.tracks.map(t => t.id === trackId ? { ...t, muted: !t.muted } : t)
    }));
  };

  const handleToggleSolo = (trackId: string) => {
    setProject(p => ({
      ...p,
      tracks: p.tracks.map(t => t.id === trackId ? { ...t, solo: !t.solo } : t)
    }));
  };

  const handleGenerateTrack = (trackData: Partial<Track>) => {
    const newTrack: Track = {
      id: `t-${Date.now()}`,
      name: trackData.name || 'AI Track',
      type: trackData.type || 'AUDIO',
      color: trackData.color || '#a78bfa',
      muted: false,
      solo: false,
      volume: 0.8,
      pan: 0,
      instrument: trackData.instrument || 'Synth',
      regions: trackData.regions || []
    };

    setProject(p => ({
      ...p,
      tracks: [...p.tracks, newTrack]
    }));
  };

  return (
    <div className="flex flex-col h-screen bg-daw-900 text-white font-sans overflow-hidden">
      {/* Header */}
      <header className="h-12 bg-daw-900 border-b border-daw-700 flex items-center justify-between px-4 z-50">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 bg-daw-accent rounded-lg flex items-center justify-center font-bold text-xl shadow-lg shadow-indigo-500/20">J</div>
          <div className="flex flex-col">
             <span className="font-bold text-sm tracking-wide">{project.name}</span>
             <span className="text-[10px] text-daw-500 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                Saved to Cloud
             </span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
            <button className="h-8 px-4 bg-daw-800 border border-daw-600 rounded-full text-xs font-bold text-daw-300 hover:text-white hover:border-daw-400 flex items-center gap-2 transition-all">
                <Share2 size={14} /> Collaborate
            </button>
            <div className="h-6 w-[1px] bg-daw-700 mx-2"></div>
            <button className="p-2 hover:bg-daw-800 rounded-full text-daw-400 hover:text-white">
                <Bell size={18} />
            </button>
            <button className="p-2 hover:bg-daw-800 rounded-full text-daw-400 hover:text-white">
                <Settings size={18} />
            </button>
            <button className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-orange-400 border-2 border-daw-900"></button>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: AI Tools */}
        <AIPanel onGenerate={handleGenerateTrack} />

        {/* Center: DAW */}
        <div className="flex-1 flex flex-col min-w-0">
          <Timeline 
            tracks={project.tracks} 
            currentTime={project.currentTime}
            zoom={zoomLevel}
            onTimeUpdate={(t) => setProject(p => ({ ...p, currentTime: t }))}
          />
          
          {showMixer && (
            <Mixer 
              tracks={project.tracks} 
              onVolumeChange={handleVolumeChange}
              onToggleMute={handleToggleMute}
              onToggleSolo={handleToggleSolo}
            />
          )}
        </div>
      </div>

      {/* Bottom Transport */}
      <Transport 
        isPlaying={project.isPlaying}
        bpm={project.bpm}
        time={project.currentTime}
        onPlayPause={handlePlayPause}
        onStop={handleStop}
        onBpmChange={handleBpmChange}
      />
    </div>
  );
};

export default App;
