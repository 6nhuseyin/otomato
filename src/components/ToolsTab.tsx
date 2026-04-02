import { useState } from 'react';
import { Card, Button, Input } from '../App';

interface RngInstance {
  id: number;
  min: string;
  max: string;
  result: number | null;
}

const NumberStepper = ({ label, value, onChange }: { label: string, value: string, onChange: (val: string) => void }) => {
  const handleDecrement = () => {
    const val = parseInt(value, 10);
    if (!isNaN(val)) onChange(String(val - 1));
  };

  const handleIncrement = () => {
    const val = parseInt(value, 10);
    if (!isNaN(val)) onChange(String(val + 1));
  };

  return (
    <div className="input-group" style={{ marginBottom: 0 }}>
      {label && <label>{label}</label>}
      <div style={{ display: 'flex', alignItems: 'stretch', width: '100%' }}>
        <button type="button" onClick={handleDecrement} className="stepper-btn left" aria-label="Decrease">−</button>
        <input 
          type="number" 
          className="input" 
          value={value} 
          onChange={(e) => onChange(e.target.value)} 
          style={{ borderRadius: 0, textAlign: 'center', fontWeight: '500' }}
        />
        <button type="button" onClick={handleIncrement} className="stepper-btn right" aria-label="Increase">+</button>
      </div>
    </div>
  );
};

export const ToolsTab = () => {
  const [showRNG, setShowRNG] = useState(true);
  const [showPicker, setShowPicker] = useState(true);
  const [showCoin, setShowCoin] = useState(true);

  // RNG Multi-line State
  const [rngLines, setRngLines] = useState<RngInstance[]>([{ id: Date.now(), min: '1', max: '100', result: null }]);

  const handleGenerateAllRng = () => {
    setRngLines(lines => lines.map(line => {
      const minNum = parseInt(line.min, 10);
      const maxNum = parseInt(line.max, 10);
      if (!isNaN(minNum) && !isNaN(maxNum) && minNum <= maxNum) {
        return { ...line, result: Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum };
      }
      return line;
    }));
  };

  const updateRngLine = (id: number, field: 'min' | 'max', value: string) => {
    setRngLines(lines => lines.map(line => line.id === id ? { ...line, [field]: value } : line));
  };

  const addRngLine = () => setRngLines([...rngLines, { id: Date.now(), min: '1', max: '100', result: null }]);
  const removeRngLine = (id: number) => setRngLines(rngLines.filter(line => line.id !== id));


  // Random Picker
  const [optionsText, setOptionsText] = useState('');
  const [randomPick, setRandomPick] = useState<string | null>(null);

  const handlePickRandom = () => {
    const options = optionsText.split('\n').map(n => n.trim()).filter(n => n !== '');
    if (options.length > 0) {
      const randomIndex = Math.floor(Math.random() * options.length);
      setRandomPick(options[randomIndex]);
    }
  };

  // Coin Flip
  const [coinResult, setCoinResult] = useState<string | null>(null);
  const [isFlipping, setIsFlipping] = useState(false);

  const handleCoinFlip = () => {
    setIsFlipping(true);
    setTimeout(() => {
      setCoinResult(Math.random() > 0.5 ? 'Heads' : 'Tails');
      setIsFlipping(false);
    }, 400);
  };

  const toggleStyle = { display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' as const, fontSize: '0.9rem', color: 'var(--text-secondary)' };

  return (
    <div className="tab-container fade-in">
      <div style={toggleStyle}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' }}>
          <input type="checkbox" checked={showRNG} onChange={e => setShowRNG(e.target.checked)} /> Show Number Generator
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' }}>
          <input type="checkbox" checked={showPicker} onChange={e => setShowPicker(e.target.checked)} /> Show Random Picker
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' }}>
          <input type="checkbox" checked={showCoin} onChange={e => setShowCoin(e.target.checked)} /> Show Coin Flip
        </label>
      </div>

      {showRNG && (
        <Card title="Random Number Generator" infoText="Generate secure random numbers within any range. Need more? Just add another line to roll multiple numbers simultaneously!">
          
          {rngLines.map((line, index) => (
            <div key={line.id} style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem', paddingBottom: '1rem', borderBottom: index < rngLines.length - 1 ? '1px solid var(--border-color)' : 'none' }}>
              <div style={{ flex: 1 }}>
                <NumberStepper label="Min" value={line.min} onChange={(val) => updateRngLine(line.id, 'min', val)} />
              </div>
              <div style={{ flex: 1 }}>
                <NumberStepper label="Max" value={line.max} onChange={(val) => updateRngLine(line.id, 'max', val)} />
              </div>
              <div style={{ flex: '0 0 auto', width: '80px', textAlign: 'center', display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'flex-end', paddingBottom: '0.2rem' }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.35rem', fontWeight: 500 }}>Output</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 700, backgroundColor: 'var(--bg-color)', padding: '0.55rem', borderRadius: 'var(--radius-md)', minHeight: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {line.result !== null ? line.result : '-'}
                </div>
              </div>
              {rngLines.length > 1 && (
                <button 
                  onClick={() => removeRngLine(line.id)} 
                  style={{ color: 'var(--danger-color)', alignSelf: 'flex-end', padding: '0.75rem', marginBottom: '0.4rem', cursor: 'pointer', border: 'none', background: 'none' }}
                  title="Remove Line"
                >
                  ✕
                </button>
              )}
            </div>
          ))}

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <Button variant="secondary" onClick={addRngLine} style={{ flex: 1, backgroundColor: 'transparent', border: '1px dashed var(--border-color)', color: 'var(--text-secondary)' }}>
              + Add Line
            </Button>
            <Button onClick={handleGenerateAllRng} style={{ flex: 2 }}>
              Generate All
            </Button>
          </div>
        </Card>
      )}

      {showPicker && (
        <Card title="Random Picker" infoText="Paste a list of items or options. Clicking the button will randomly select one item. Perfect for raffles, deciding what to eat, or who pays for lunch!">
          <Input 
            label="Paste options here (one per line)" 
            multiline 
            value={optionsText}
            onChange={(e: any) => setOptionsText(e.target.value)}
            placeholder="Pizza&#10;Sushi&#10;Burgers"
          />
          <Button onClick={handlePickRandom}>Pick Random Option</Button>
          <div className="output-area" style={{ fontSize: '1.5rem' }}>
            {randomPick !== null ? randomPick : <span className="output-placeholder">-</span>}
          </div>
        </Card>
      )}

      {showCoin && (
        <Card title="Coin Flip" infoText="A simple 50/50 virtual coin. Click flip to instantly get Heads or Tails.">
          <Button onClick={handleCoinFlip} disabled={isFlipping}>
            {isFlipping ? 'Flipping...' : 'Flip Coin'}
          </Button>
          <div className="output-area" style={{ transition: 'all 0.2s', opacity: isFlipping ? 0.5 : 1 }}>
            {coinResult !== null ? coinResult : <span className="output-placeholder">-</span>}
          </div>
        </Card>
      )}
    </div>
  );
};
