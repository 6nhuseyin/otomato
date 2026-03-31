import { useState } from 'react';
import { Card, Button, Input } from '../App';

interface RngInstance {
  id: number;
  min: string;
  max: string;
  result: number | null;
}

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


  // Random Name
  const [namesText, setNamesText] = useState('');
  const [randomName, setRandomName] = useState<string | null>(null);

  const handlePickName = () => {
    const names = namesText.split('\n').map(n => n.trim()).filter(n => n !== '');
    if (names.length > 0) {
      const randomIndex = Math.floor(Math.random() * names.length);
      setRandomName(names[randomIndex]);
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
          <input type="checkbox" checked={showPicker} onChange={e => setShowPicker(e.target.checked)} /> Show Name Picker
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
                <Input label="Min" type="number" value={line.min} onChange={(e: any) => updateRngLine(line.id, 'min', e.target.value)} />
              </div>
              <div style={{ flex: 1 }}>
                <Input label="Max" type="number" value={line.max} onChange={(e: any) => updateRngLine(line.id, 'max', e.target.value)} />
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
        <Card title="Random Name Picker" infoText="Paste a list of names or options. Clicking the button will randomly select one item. Perfect for raffles or deciding who pays for lunch!">
          <Input 
            label="Paste names here (one per line)" 
            multiline 
            value={namesText}
            onChange={(e: any) => setNamesText(e.target.value)}
            placeholder="Alice&#10;Bob&#10;Charlie"
          />
          <Button onClick={handlePickName}>Pick Random Name</Button>
          <div className="output-area" style={{ fontSize: '1.5rem' }}>
            {randomName !== null ? randomName : <span className="output-placeholder">-</span>}
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
