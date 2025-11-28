import React, { useRef, useEffect, useState } from 'react';
import { Track, Region } from '../types';

interface TimelineProps {
  tracks: Track[];
  currentTime: number;
  zoom: number;
  onTimeUpdate: (time: number) => void;
}

const PIXELS_PER_BAR = 100;

const Timeline: React.FC<TimelineProps> = ({ tracks, currentTime, zoom, onTimeUpdate }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [playheadX, setPlayheadX] = useState(0);

  useEffect(() => {
    // 120 BPM assumed for visual calculation (2s per bar)
    const pxPerSecond = PIXELS_PER_BAR / 2; 
    setPlayheadX(currentTime * pxPerSecond * zoom);
  }, [currentTime, zoom]);

  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left + (scrollContainerRef.current?.scrollLeft || 0);
    const pxPerSecond = PIXELS_PER_BAR / 2;
    const newTime = x / (pxPerSecond * zoom);
    onTimeUpdate(Math.max(0, newTime));
  };

  return (
    <div className="flex-1 bg-daw-900 overflow-hidden flex flex-col relative">
      {/* Ruler */}
      <div className="h-8 bg-daw-800 border-b border-daw-700 flex sticky top-0 z-10" style={{ marginLeft: '200px' }}>
         <div 
            className="flex-1 relative overflow-hidden" 
            ref={scrollContainerRef}
         >
            <div className="absolute inset-0 flex" style={{ width: `${100 * PIXELS_PER_BAR * zoom}px` }}>
                {[...Array(50)].map((_, i) => (
                    <div key={i} className="flex-shrink-0 border-l border-daw-600 h-full text-[10px] text-daw-500 pl-1" style={{ width: `${PIXELS_PER_BAR * zoom}px`}}>
                        {i + 1}
                    </div>
                ))}
            </div>
         </div>
      </div>

      {/* Track Headers & Grid */}
      <div className="flex-1 flex overflow-y-auto">
        {/* Track Headers */}
        <div className="w-[200px] flex-shrink-0 bg-daw-800 border-r border-daw-700 z-20">
            {tracks.map(track => (
                <div key={track.id} className="h-24 border-b border-daw-700 p-3 flex flex-col justify-between relative group hover:bg-daw-700/50 transition-colors">
                    <div className="absolute left-0 top-0 bottom-0 w-1" style={{ backgroundColor: track.color }}></div>
                    <div className="font-bold text-sm truncate pl-2">{track.name}</div>
                    <div className="flex gap-2 pl-2">
                         <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                         <div className="text-[10px] text-daw-500 uppercase">{track.type}</div>
                    </div>
                </div>
            ))}
            {/* Add Track Button Placeholder */}
            <div className="h-24 flex items-center justify-center border-b border-daw-700 border-dashed border-daw-600 text-daw-500 hover:text-white cursor-pointer hover:bg-daw-800/80">
                + Add Track
            </div>
        </div>

        {/* Grid & Regions */}
        <div 
            className="flex-1 relative bg-daw-900 cursor-crosshair overflow-x-auto"
            onClick={handleTimelineClick}
        >
            {/* Background Grid */}
            <div className="absolute inset-0 pointer-events-none" style={{ 
                width: `${100 * PIXELS_PER_BAR * zoom}px`,
                backgroundSize: `${PIXELS_PER_BAR * zoom}px 100%`,
                backgroundImage: 'linear-gradient(to right, #334155 1px, transparent 1px)'
            }}></div>

            {/* Tracks Container */}
            <div className="relative" style={{ width: `${100 * PIXELS_PER_BAR * zoom}px` }}>
                {tracks.map(track => (
                    <div key={track.id} className="h-24 border-b border-daw-800 relative">
                        {track.regions.map(region => (
                            <div 
                                key={region.id}
                                className="absolute top-2 bottom-2 rounded-md shadow-lg flex items-center px-2 overflow-hidden border-l-4 border-white/20 hover:brightness-110 cursor-pointer"
                                style={{
                                    left: `${region.start * PIXELS_PER_BAR * zoom}px`,
                                    width: `${region.duration * PIXELS_PER_BAR * zoom}px`,
                                    backgroundColor: region.color
                                }}
                            >
                                <span className="text-xs font-bold text-black/70 drop-shadow-none truncate">{region.name}</span>
                                {/* Fake Waveform */}
                                <svg className="absolute bottom-0 left-0 right-0 h-1/2 opacity-30 pointer-events-none" preserveAspectRatio="none">
                                    <path d={`M0 10 Q 10 0 20 10 T 40 10 T 60 10 T 80 10 T 100 10 V 20 H 0 Z`} fill="black" />
                                </svg>
                            </div>
                        ))}
                    </div>
                ))}
            </div>

            {/* Playhead */}
            <div 
                className="absolute top-0 bottom-0 w-[2px] bg-red-500 z-30 pointer-events-none shadow-[0_0_10px_rgba(239,68,68,0.8)]"
                style={{ left: `${playheadX}px` }}
            >
                <div className="w-3 h-3 bg-red-500 -ml-[5px] rotate-45 transform origin-center"></div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Timeline;
