import { useState } from 'react';
import { Card, Input } from '../App';

const getLocalYMD = (date: Date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

const parseLocalDate = (dateString: string) => {
  if (!dateString) return null;
  const parts = dateString.split('-');
  if (parts.length !== 3) return null;
  return new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
};

export const TimeTab = () => {
  const [showDifference, setShowDifference] = useState(true);
  const [showRelative, setShowRelative] = useState(true);
  const [showAddSub, setShowAddSub] = useState(true);

  // Date Add/Subtract State
  const [baseDate, setBaseDate] = useState(() => getLocalYMD(new Date()));
  const [daysToAdd, setDaysToAdd] = useState('');

  // Date Difference State
  const [startDate, setStartDate] = useState(() => getLocalYMD(new Date()));
  const [endDate, setEndDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return getLocalYMD(d);
  });

  // Relative Date State
  const [targetDate, setTargetDate] = useState('');

  const calculateDifference = (start: string, end: string) => {
    const s = parseLocalDate(start);
    const e = parseLocalDate(end);
    if (!s || !e) return null;
    
    const diffTime = e.getTime() - s.getTime();
    return Math.round(diffTime / (1000 * 60 * 60 * 24));
  };

  const diffDays = calculateDifference(startDate, endDate);
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const relativeDays = targetDate ? calculateDifference(getLocalYMD(today), targetDate) : null;

  const calculateDerivedDate = (base: string, daysStr: string) => {
    const d = parseLocalDate(base);
    const offset = parseInt(daysStr, 10);
    if (!d || isNaN(offset)) return null;
    
    d.setDate(d.getDate() + offset);
    
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(d);
  };
  const derivedDateStr = calculateDerivedDate(baseDate, daysToAdd);

  return (
    <div className="tab-container fade-in">
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' }}>
          <input type="checkbox" checked={showDifference} onChange={e => setShowDifference(e.target.checked)} /> Show Date Difference
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' }}>
          <input type="checkbox" checked={showRelative} onChange={e => setShowRelative(e.target.checked)} /> Show Relative Time
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' }}>
          <input type="checkbox" checked={showAddSub} onChange={e => setShowAddSub(e.target.checked)} /> Show Add/Subtract Days
        </label>
      </div>

      {showDifference && (
      <Card title="Date Difference" infoText="Calculate the exact number of days between any two specific dates.">
        <div className="flex-row">
          <Input 
            label="Start Date" 
            type="date" 
            value={startDate} 
            onChange={(e: any) => setStartDate(e.target.value)} 
          />
          <Input 
            label="End Date" 
            type="date" 
            value={endDate} 
            onChange={(e: any) => setEndDate(e.target.value)} 
          />
        </div>
        <div className="output-area" style={{ padding: '2rem' }}>
          {diffDays !== null ? (
            <div>
              <div style={{ fontSize: '3.5rem', fontWeight: 800, lineHeight: 1 }}>{Math.abs(diffDays)}</div>
              <div style={{ fontSize: '1rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '0.75rem' }}>
                Days {diffDays < 0 ? 'Apart (Reversed)' : 'Apart'}
              </div>
            </div>
          ) : (
            <span className="output-placeholder">Select both dates</span>
          )}
        </div>
      </Card>
      )}

      {showRelative && (
      <Card title="Days From / Until" infoText="Find out exactly how many days have passed since a past event, or how many days are left until a future one.">
        <Input 
          label="Target Date" 
          type="date" 
          value={targetDate} 
          onChange={(e: any) => setTargetDate(e.target.value)} 
        />
        <div className="output-area" style={{ padding: '2rem' }}>
          {relativeDays !== null ? (
            <div>
              <div style={{ fontSize: '3.5rem', fontWeight: 800, lineHeight: 1, color: relativeDays < 0 ? 'var(--text-primary)' : 'var(--primary-color)' }}>{Math.abs(relativeDays)}</div>
              <div style={{ fontSize: '1rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '0.75rem' }}>
                Days {relativeDays < 0 ? 'Ago' : relativeDays === 0 ? 'Today' : 'From Now'}
              </div>
            </div>
          ) : (
            <span className="output-placeholder">Select a date</span>
          )}
        </div>
      </Card>
      )}

      {showAddSub && (
      <Card title="Add / Subtract Days" infoText="Calculate a future or past date by adding or subtracting a specific number of days from a given base date.">
        <div className="flex-row" style={{ alignItems: 'flex-start' }}>
          <Input 
            label="Base Date" 
            type="date" 
            value={baseDate} 
            onChange={(e: any) => setBaseDate(e.target.value)} 
          />
          <Input 
            label="Days (Add / Subtract)" 
            type="number" 
            value={daysToAdd} 
            onChange={(e: any) => setDaysToAdd(e.target.value)} 
            placeholder="e.g. 30, or -15" 
            helpText="Use a negative number to subtract days."
          />
        </div>
        <div className="output-area" style={{ padding: '2rem' }}>
          {derivedDateStr !== null ? (
            <div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, letterSpacing: '-0.01em', color: 'var(--primary-color)' }}>
                {derivedDateStr}
              </div>
            </div>
          ) : (
            <span className="output-placeholder">Select a date and enter days</span>
          )}
        </div>
      </Card>
      )}
    </div>
  );
};
