import { useState } from 'react';
import { Card, Input } from '../App';

const getLocalYMD = (date: Date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

const getIslamicDateString = (dateString: string) => {
  if (!dateString) return '-';
  const partsList = dateString.split('-');
  if (partsList.length !== 3) return '-';
  
  const d = new Date(parseInt(partsList[0], 10), parseInt(partsList[1], 10) - 1, parseInt(partsList[2], 10));
  if (isNaN(d.getTime())) return '-';

  try {
    const formatter = new Intl.DateTimeFormat('en-US', {
      calendar: 'islamic-umalqura',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
    const parts = formatter.formatToParts(d);
    const day = parts.find(p => p.type === 'day')?.value;
    const month = parts.find(p => p.type === 'month')?.value;
    const year = parts.find(p => p.type === 'year')?.value;
    const yearClean = year?.replace(/\D/g, '') || year;
    return `${day} ${month} ${yearClean}`;
  } catch (e) {
    return '-';
  }
};

export const ConvertersTab = () => {
  const [showHijri, setShowHijri] = useState(true);
  const [showWeight, setShowWeight] = useState(true);
  const [showDistance, setShowDistance] = useState(true);
  const [showLength, setShowLength] = useState(true);

  // Length Converter
  const [cm, setCm] = useState('');
  const [inches, setInches] = useState('');

  const handleCmChange = (e: any) => {
    const val = e.target.value;
    setCm(val);
    if (val === '') {
      setInches('');
      return;
    }
    const num = parseFloat(val);
    if (!isNaN(num)) {
      setInches((num / 2.54).toFixed(2));
    }
  };

  const handleInchesChange = (e: any) => {
    const val = e.target.value;
    setInches(val);
    if (val === '') {
      setCm('');
      return;
    }
    const num = parseFloat(val);
    if (!isNaN(num)) {
      setCm((num * 2.54).toFixed(2));
    }
  };

  // Hijri Converter
  const [hijriDateInput, setHijriDateInput] = useState(() => getLocalYMD(new Date()));
  const isToday = hijriDateInput === getLocalYMD(new Date());

  // Weight Converter
  const [kg, setKg] = useState('');
  const [lbs, setLbs] = useState('');

  const handleKgChange = (e: any) => {
    const val = e.target.value;
    setKg(val);
    if (val === '') {
      setLbs('');
      return;
    }
    const num = parseFloat(val);
    if (!isNaN(num)) {
      setLbs((num * 2.20462).toFixed(2));
    }
  };

  const handleLbsChange = (e: any) => {
    const val = e.target.value;
    setLbs(val);
    if (val === '') {
      setKg('');
      return;
    }
    const num = parseFloat(val);
    if (!isNaN(num)) {
      setKg((num / 2.20462).toFixed(2));
    }
  };

  // Distance Converter
  const [km, setKm] = useState('');
  const [miles, setMiles] = useState('');

  const handleKmChange = (e: any) => {
    const val = e.target.value;
    setKm(val);
    if (val === '') {
      setMiles('');
      return;
    }
    const num = parseFloat(val);
    if (!isNaN(num)) {
      setMiles((num * 0.621371).toFixed(2));
    }
  };

  const handleMilesChange = (e: any) => {
    const val = e.target.value;
    setMiles(val);
    if (val === '') {
      setKm('');
      return;
    }
    const num = parseFloat(val);
    if (!isNaN(num)) {
      setKm((num / 0.621371).toFixed(2));
    }
  };

  return (
    <div className="tab-container fade-in">
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' }}>
          <input type="checkbox" checked={showHijri} onChange={e => setShowHijri(e.target.checked)} /> Show Islamic Calendar
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' }}>
          <input type="checkbox" checked={showWeight} onChange={e => setShowWeight(e.target.checked)} /> Show Weight
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' }}>
          <input type="checkbox" checked={showDistance} onChange={e => setShowDistance(e.target.checked)} /> Show Distance
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' }}>
          <input type="checkbox" checked={showLength} onChange={e => setShowLength(e.target.checked)} /> Show Length
        </label>
      </div>

      {showHijri && (
      <Card title="Islamic Calendar Converter" infoText="Select a Gregorian date to convert to the Islamic Calendar (Hijri) date. By default, it automatically displays today's Hijri date.">
        <Input 
          label="Gregorian Date" 
          type="date" 
          value={hijriDateInput} 
          onChange={(e: any) => setHijriDateInput(e.target.value)} 
        />
        <div className="output-area" style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', padding: '1.75rem 1rem' }}>
          {isToday && (
            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 800, color: 'var(--primary-color)', backgroundColor: 'var(--bg-color)', padding: '0.35rem 1rem', borderRadius: '100px', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border-color)' }}>
              TODAY
            </span>
          )}
          <span style={{ fontSize: '1.8rem', fontWeight: 800, letterSpacing: '-0.01em', color: isToday ? 'var(--primary-color)' : 'var(--text-primary)' }}>
            {getIslamicDateString(hijriDateInput)}
          </span>
        </div>
      </Card>
      )}

      {showWeight && (
      <Card title="Weight Converter" infoText="Input kilograms to instantly get pounds, or vice versa. The conversion updates automatically.">
        <div className="flex-row">
          <Input 
            label="Kilograms (kg)" 
            type="number" 
            value={kg} 
            onChange={handleKgChange} 
            placeholder="0"
          />
          <Input 
            label="Pounds (lbs)" 
            type="number" 
            value={lbs} 
            onChange={handleLbsChange} 
            placeholder="0"
          />
        </div>
      </Card>
      )}

      {showDistance && (
      <Card title="Distance Converter" infoText="Easily convert kilometers to miles. Useful for travel planning or fitness tracking.">
        <div className="flex-row">
          <Input 
            label="Kilometers (km)" 
            type="number" 
            value={km} 
            onChange={handleKmChange} 
            placeholder="0"
          />
          <Input 
            label="Miles (mi)" 
            type="number" 
            value={miles} 
            onChange={handleMilesChange} 
            placeholder="0"
          />
        </div>
      </Card>
      )}

      {showLength && (
      <Card title="Length Converter" infoText="Easily convert centimeters to inches, or vice versa.">
        <div className="flex-row">
          <Input 
            label="Centimeters (cm)" 
            type="number" 
            value={cm} 
            onChange={handleCmChange} 
            placeholder="0"
          />
          <Input 
            label="Inches (in)" 
            type="number" 
            value={inches} 
            onChange={handleInchesChange} 
            placeholder="0"
          />
        </div>
      </Card>
      )}
    </div>
  );
};
