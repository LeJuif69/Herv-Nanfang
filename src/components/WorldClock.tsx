import React, { useEffect, useState } from 'react';

type TZEntry = {
  id: string;
  label: string;
  tz: string; // IANA timezone, e.g. "Europe/Paris"
};

/**
 * WorldClock
 * Composant React affichant une horloge digitale pour plusieurs fuseaux horaires.
 * - Se met à jour chaque seconde
 * - Liste par défaut + possibilité d'ajouter un IANA timezone personnalisé
 */
const DEFAULT_TZS: TZEntry[] = [
  { id: 'utc', label: 'UTC', tz: 'UTC' },
  { id: 'douala', label: 'Douala (Cameroon)', tz: 'Africa/Douala' },
  { id: 'lagos', label: 'Lagos (Nigeria)', tz: 'Africa/Lagos' },
  { id: 'paris', label: 'Paris', tz: 'Europe/Paris' },
  { id: 'ny', label: 'New York', tz: 'America/New_York' }
];

function formatTimeForTZ(date: Date, tz: string) {
  const dtf = new Intl.DateTimeFormat(undefined, {
    timeZone: tz,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });
  return dtf.format(date);
}

function formatDateForTZ(date: Date, tz: string) {
  const dtf = new Intl.DateTimeFormat(undefined, {
    timeZone: tz,
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: '2-digit'
  });
  return dtf.format(date);
}

const WorldClock: React.FC = () => {
  const [now, setNow] = useState<Date>(new Date());
  const [zones, setZones] = useState<TZEntry[]>(DEFAULT_TZS);
  const [newTz, setNewTz] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const addTimezone = () => {
    const tz = newTz.trim();
    if (!tz) return;
    try {
      // Validate IANA timezone
      // @ts-ignore
      new Intl.DateTimeFormat(undefined, { timeZone: tz }).format();
      const entry: TZEntry = { id: `${tz}_${Date.now()}`, label: tz, tz };
      setZones(zs => [...zs, entry]);
      setNewTz('');
      setError(null);
    } catch (e) {
      setError('Fuseau horaire invalide (utilisez un IANA timezone comme Europe/Paris)');
    }
  };

  const removeZone = (id: string) => setZones(zs => zs.filter(z => z.id !== id));

  return (
    <div className="flex gap-4 items-center">
      <div className="hidden md:flex flex-col text-xs text-daw-500">
        <div className="font-semibold">Heure mondiale</div>
        <div className="mt-1 grid grid-cols-3 gap-2">
          {zones.slice(0, 3).map(z => (
            <div key={z.id} className="flex flex-col">
              <div className="font-medium">{z.label}</div>
              <div className="text-sm">{formatTimeForTZ(now, z.tz)}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Small controls for mobile */}
      <div className="flex items-center gap-2">
        <input
          className="hidden sm:inline-block px-2 py-1 rounded bg-daw-800 border border-daw-700 text-xs"
          placeholder="Europe/Paris"
          value={newTz}
          onChange={(e) => setNewTz(e.target.value)}
          aria-label="Ajouter fuseau horaire"
        />
        <button
          onClick={addTimezone}
          className="hidden sm:inline-flex items-center gap-2 px-2 py-1 bg-daw-800 border border-daw-700 rounded text-xs"
        >
          Ajouter
        </button>
      </div>
    </div>
  );
};

export default WorldClock;
