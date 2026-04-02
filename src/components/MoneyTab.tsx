import { useState } from 'react';
import { Card, Input, SectionHeader } from '../App';

export const MoneyTab = () => {
  const [showCurrency, setShowCurrency] = useState(true);
  const [showProfit, setShowProfit] = useState(true);

  // Static currency rates setup
  const STATIC_RATES: Record<string, number> = {
    GBP: 1,
    USD: 1.25,
    EUR: 1.17,
    TRY: 40.5
  };

  const [amt1, setAmt1] = useState('1');
  const [cur1, setCur1] = useState('GBP');
  const [amt2, setAmt2] = useState('1.25');
  const [cur2, setCur2] = useState('USD');

  const handleAmt1 = (val: string) => {
    setAmt1(val);
    const num = parseFloat(val);
    if (!isNaN(num)) {
      setAmt2(((num / STATIC_RATES[cur1]) * STATIC_RATES[cur2]).toFixed(2));
    } else {
      setAmt2('');
    }
  };

  const handleAmt2 = (val: string) => {
    setAmt2(val);
    const num = parseFloat(val);
    if (!isNaN(num)) {
      setAmt1(((num / STATIC_RATES[cur2]) * STATIC_RATES[cur1]).toFixed(2));
    } else {
      setAmt1('');
    }
  };

  const handleCur1 = (newCur: string) => {
    setCur1(newCur);
    const num = parseFloat(amt1);
    if (!isNaN(num)) {
      setAmt2(((num / STATIC_RATES[newCur]) * STATIC_RATES[cur2]).toFixed(2));
    }
  };

  const handleCur2 = (newCur: string) => {
    setCur2(newCur);
    const num = parseFloat(amt1);
    if (!isNaN(num)) {
      setAmt2(((num / STATIC_RATES[cur1]) * STATIC_RATES[newCur]).toFixed(2));
    }
  };

  // Profit Calculator States
  const [buyPrice, setBuyPrice] = useState('');
  const [sellPrice, setSellPrice] = useState('');
  const [expectedSellPrice, setExpectedSellPrice] = useState('');
  const [fees, setFees] = useState('');
  const [shipping, setShipping] = useState('');
  
  const [milesDriven, setMilesDriven] = useState('');
  const [costPerMile, setCostPerMile] = useState('0.25');
  const [timeSpent, setTimeSpent] = useState('');
  const [hourlyValue, setHourlyValue] = useState('8');
  const [repairCost, setRepairCost] = useState('');
  
  const [riskLevel, setRiskLevel] = useState('Low');
  const [expectedDays, setExpectedDays] = useState('');
  const [profitTarget, setProfitTarget] = useState('15');
  const [highEffort, setHighEffort] = useState(false);
  const [realityMode, setRealityMode] = useState(false);

  // Calculations
  const buy = parseFloat(buyPrice) || 0;
  const sell = parseFloat(sellPrice) || 0;
  const f = parseFloat(fees) || 0;
  const s = parseFloat(shipping) || 0;

  // Expected Sell Fallback & Reality Adjustment
  const baseExpectedSell = expectedSellPrice !== '' ? (parseFloat(expectedSellPrice) || 0) : sell;
  const adjustedSell = realityMode ? (baseExpectedSell * 0.9) : baseExpectedSell;

  const miles = parseFloat(milesDriven) || 0;
  const cpm = parseFloat(costPerMile) || 0;
  const travelCost = miles * cpm;

  const minutes = parseFloat(timeSpent) || 0;
  const hv = parseFloat(hourlyValue) || 0;
  const timeCost = (minutes / 60) * hv;

  const repair = parseFloat(repairCost) || 0;

  const riskMapping: { [key: string]: number } = { Low: 0, Medium: 5, High: 12 };
  let baseRiskCost = riskMapping[riskLevel] || 0;
  let effectiveRiskCost = baseRiskCost;
  
  if (realityMode && riskLevel === 'Low') {
    effectiveRiskCost = riskMapping['Medium']; // 5
  }

  let effectiveFrictionCost = 0;
  if (highEffort) {
    effectiveFrictionCost = 4;
  } else if (realityMode) {
    effectiveFrictionCost = 3;
  }

  const days = parseInt(expectedDays, 10) || 0;
  const target = parseFloat(profitTarget) || 0;

  const cashProfit = adjustedSell - buy - f - s;
  const trueProfit = cashProfit - travelCost - timeCost - repair - effectiveRiskCost - effectiveFrictionCost;

  const effectiveHourly = minutes > 0 ? (trueProfit / (minutes / 60)) : 0;

  let hourlyHint = '';
  if (minutes > 0) {
    if (effectiveHourly < 6) hourlyHint = 'Weak use of time';
    else if (effectiveHourly >= 6 && effectiveHourly < 10) hourlyHint = 'Acceptable';
    else hourlyHint = 'Good use of time';
  } else if (trueProfit > 0) {
    hourlyHint = 'Good use of time';
  }

  // Verdict Logic
  let verdict = 'SKIP';
  let verdictColor = 'var(--danger-color)';

  if (trueProfit < 0) {
    verdict = 'SKIP';
    verdictColor = 'var(--danger-color)';
  } else if (trueProfit >= 0 && trueProfit < target) {
    verdict = 'NEGOTIATE';
    verdictColor = '#f59e0b';
  } else if (trueProfit >= target && riskLevel !== 'High') {
    verdict = 'BUY';
    verdictColor = 'var(--success-color)';
  } else if (trueProfit >= target && riskLevel === 'High') {
    verdict = 'NEGOTIATE';
    verdictColor = '#f59e0b';
  }

  // Deal Quality Logic
  let dealQuality = 'WEAK';
  let dealColor = 'var(--danger-color)';
  
  if (trueProfit >= 20) {
    dealQuality = 'STRONG';
    dealColor = '#166534'; // darker green
  } else if (trueProfit >= 12 && trueProfit < 20) {
    dealQuality = 'GOOD';
    dealColor = 'var(--success-color)';
  } else if (trueProfit >= 8 && trueProfit < 12) {
    dealQuality = 'BORDERLINE';
    dealColor = '#f59e0b'; // orange
  } else {
    dealQuality = 'WEAK';
    dealColor = 'var(--danger-color)';
  }

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
    gap: '1rem',
    marginBottom: '1rem'
  };

  return (
    <div className="tab-container fade-in">
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' }}>
          <input type="checkbox" checked={showCurrency} onChange={e => setShowCurrency(e.target.checked)} /> Show Currency
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' }}>
          <input type="checkbox" checked={showProfit} onChange={e => setShowProfit(e.target.checked)} /> Show Profit Calculator
        </label>
      </div>

      {showCurrency && (
      <Card title="Currency Converter" infoText="A quick look at standard, static conversion rates. Convert freely between any pair.">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', backgroundColor: 'var(--primary-light)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <input type="number" className="input" style={{ flex: 1, fontSize: '1.25rem', fontWeight: 600, padding: '1rem', backgroundColor: 'var(--card-bg)' }} value={amt1} onChange={(e) => handleAmt1(e.target.value)} placeholder="0.00" />
            <select className="input" style={{ width: '130px', flex: 'none', fontWeight: 600, backgroundColor: 'var(--card-bg)' }} value={cur1} onChange={(e) => handleCur1(e.target.value)}>
              <option value="GBP">GBP (£)</option>
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="TRY">TRY (₺)</option>
            </select>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'center', margin: '-0.35rem 0' }}>
            <button 
              type="button"
              onClick={() => {
                const tempCur = cur1; setCur1(cur2); setCur2(tempCur);
                const tempAmt = amt1; setAmt1(amt2); setAmt2(tempAmt);
              }}
              style={{ width: '2.5rem', height: '2.5rem', borderRadius: '50%', backgroundColor: 'var(--bg-color)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-secondary)', transition: 'all var(--transition-bounce)', zIndex: 2 }}
              title="Swap Currencies"
              onMouseOver={(e) => { e.currentTarget.style.color = 'var(--primary-color)'; e.currentTarget.style.borderColor = 'var(--primary-color)'; e.currentTarget.style.transform = 'scale(1.1)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }}
              onMouseOut={(e) => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              ⇅
            </button>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <input type="number" className="input" style={{ flex: 1, fontSize: '1.25rem', fontWeight: 600, padding: '1rem', backgroundColor: 'var(--card-bg)' }} value={amt2} onChange={(e) => handleAmt2(e.target.value)} placeholder="0.00" />
            <select className="input" style={{ width: '130px', flex: 'none', fontWeight: 600, backgroundColor: 'var(--card-bg)' }} value={cur2} onChange={(e) => handleCur2(e.target.value)}>
              <option value="GBP">GBP (£)</option>
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="TRY">TRY (₺)</option>
            </select>
          </div>
        </div>
      </Card>
      )}

      {showProfit && (
      <Card title="Optimism-Adjusted Profit Calculator" infoText="Evaluate 2nd-hand deals realistically. Calculate true profit by capturing hidden costs like prep, travel, time, and risk. Use Reality Mode to automatically safeguard your margins by reducing the expected sell price and penalizing friction.">
        
        <SectionHeader 
          title="Purchase & Selling" 
          helpText="Base numbers for acquiring the item and your revenue. You can log an optimistic baseline (Sell Price) and a more conservative one (Expected)." 
        />
        <div style={gridStyle}>
          <Input label="Buy Price (£)" type="number" value={buyPrice} onChange={(e: any) => setBuyPrice(e.target.value)} placeholder="0.00" />
          <Input label="Sell Price (£)" type="number" value={sellPrice} onChange={(e: any) => setSellPrice(e.target.value)} placeholder="0.00" />
          <Input 
            label="Expected Sell Price (£)" 
            type="number" 
            value={expectedSellPrice} 
            onChange={(e: any) => setExpectedSellPrice(e.target.value)} 
            placeholder="Fallback: Sell Price" 
            helpText="A realistic haircut exactly. If left blank, it falls back unconditionally to your standard Sell Price above."
          />
        </div>
        
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.95rem', fontWeight: 600, color: 'var(--primary-color)', padding: '0.5rem 0.75rem', backgroundColor: 'var(--bg-color)', borderRadius: 'var(--radius-md)', cursor: 'pointer', border: '1px solid var(--border-color)' }}>
            <input 
              type="checkbox" 
              checked={realityMode} 
              onChange={(e) => setRealityMode(e.target.checked)} 
              style={{ width: '1.1rem', height: '1.1rem' }}
            />
            Reality Mode (safer estimate)
          </label>
        </div>

        <div style={gridStyle}>
          <Input label="Fees (£)" type="number" value={fees} onChange={(e: any) => setFees(e.target.value)} placeholder="0.00" />
          <Input label="Shipping (£)" type="number" value={shipping} onChange={(e: any) => setShipping(e.target.value)} placeholder="0.00" />
        </div>

        <SectionHeader 
          title="Targets & Time" 
          helpText="Sets your personal rules of engagement. What is the absolute minimum you'll flip for, and how long cash is tied up." 
        />
        <div style={gridStyle}>
          <Input label="Min Profit Target (£)" type="number" value={profitTarget} onChange={(e: any) => setProfitTarget(e.target.value)} placeholder="15" />
          <Input label="Exp. Days to Sell" type="number" value={expectedDays} onChange={(e: any) => setExpectedDays(e.target.value)} placeholder="e.g. 7" />
        </div>
        {days > 10 && (
          <div style={{ color: 'var(--danger-color)', fontSize: '0.85rem', fontWeight: 600, marginTop: '-0.5rem', marginBottom: '1rem' }}>
            ⚠️ Slow-moving item — consider lower price or skip
          </div>
        )}

        <SectionHeader 
          title="Effort" 
          helpText="Captures the invisible overhead of travel, collection, and pure labor time that silently drains theoretical margins." 
        />
        <div style={gridStyle}>
          <Input label="Total Miles (Round Trip)" type="number" value={milesDriven} onChange={(e: any) => setMilesDriven(e.target.value)} placeholder="e.g. 6" />
          <Input 
            label="Cost/Mile (£)" 
            type="number" 
            value={costPerMile} 
            onChange={(e: any) => setCostPerMile(e.target.value)} 
            placeholder="0.25" 
            helpText="Standard vehicle run cost logic (fuel + tires + wear). Try between 0.25 and 0.45."
          />
          <Input label="Time Spent (mins)" type="number" value={timeSpent} onChange={(e: any) => setTimeSpent(e.target.value)} placeholder="0" />
          <Input 
            label="Hourly Val (£)" 
            type="number" 
            value={hourlyValue} 
            onChange={(e: any) => setHourlyValue(e.target.value)} 
            placeholder="8" 
            helpText="What is your hard time uniquely worth per hour?"
          />
        </div>
        <div style={{ marginTop: '0.5rem', marginBottom: '1rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
            <input 
              type="checkbox" 
              checked={highEffort} 
              onChange={(e) => setHighEffort(e.target.checked)} 
              style={{ width: '1rem', height: '1rem' }}
            />
            High effort deal (waiting / coordination)
          </label>
        </div>

        <SectionHeader 
          title="Prep & Risk" 
          helpText="Unforeseen damage buffers or explicitly hazardous deals that lack clarity or trusted seller history." 
        />
        <div style={{ display: 'flex', gap: '1rem' }}>
          <div style={{ flex: 1 }}>
            <Input label="Prep/Repair Cost (£)" type="number" value={repairCost} onChange={(e: any) => setRepairCost(e.target.value)} placeholder="0.00" />
          </div>
          <div style={{ flex: 1 }}>
            <div className="input-group">
              <label style={{ display: 'flex', alignItems: 'center' }}>
                Risk Level
                <button type="button" onClick={() => alert('Low: £0 penalty.\nMedium: £5 penalty.\nHigh: £12 penalty and enforces NEGOTIATE.')} style={{ width: '1rem', height: '1rem', borderRadius: '50%', border: '1px solid var(--text-muted)', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', fontWeight: 700, cursor: 'pointer', background: 'transparent', marginLeft: '0.4rem', outline: 'none' }}>i</button>
              </label>
              <select className="input" value={riskLevel} onChange={(e) => setRiskLevel(e.target.value)}>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>
        </div>

        <SectionHeader 
          title="Result" 
          helpText="Your final calculated summary mapping exactly how 'True profit' was derived, and the definitive buying strategy badge." 
        />
        <div style={{ backgroundColor: 'var(--bg-color)', padding: '1.5rem', borderRadius: 'var(--radius-md)' }}>
          
          {realityMode && (
            <div style={{ padding: '0.75rem 1rem', backgroundColor: 'var(--border-color)', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', marginBottom: '1.5rem', borderLeft: '3px solid var(--primary-color)' }}>
              <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>Reality adjustments applied:</div>
              <ul style={{ margin: '0 0 0 1.25rem', padding: 0, color: 'var(--text-secondary)' }}>
                <li>Expected sell price reduced by 10% (Using £{adjustedSell.toFixed(2)})</li>
                {riskLevel === 'Low' && <li>Minimum medium risk applied</li>}
                {!highEffort && <li>Friction buffer applied</li>}
              </ul>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)', textAlign: 'center' }}>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Travel Cost</div>
              <div style={{ fontWeight: 600 }}>£{travelCost.toFixed(2)}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Time Cost</div>
              <div style={{ fontWeight: 600 }}>£{timeCost.toFixed(2)}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Risk Cost</div>
              <div style={{ fontWeight: 600 }}>£{effectiveRiskCost.toFixed(2)}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Friction</div>
              <div style={{ fontWeight: 600 }}>£{effectiveFrictionCost.toFixed(2)}</div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Cash Profit</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>£{cashProfit.toFixed(2)}</div>
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--primary-color)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>True Profit</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--primary-color)' }}>£{trueProfit.toFixed(2)}</div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Eff. Hourly</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>£{effectiveHourly.toFixed(2)}</div>
              {hourlyHint && (
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>{hourlyHint}</div>
              )}
            </div>
          </div>

          <div style={{ marginTop: '2rem', textAlign: 'center' }}>
            <div style={{ fontSize: '0.8rem', color: dealColor, marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 800 }}>
              {dealQuality} DEAL
            </div>
            <div style={{ 
              display: 'inline-block', 
              padding: '0.75rem 2.5rem', 
              backgroundColor: verdictColor, 
              color: '#fff', 
              fontWeight: 800, 
              fontSize: '1.5rem', 
              borderRadius: '2rem',
              letterSpacing: '0.05em'
            }}>
              {verdict}
            </div>
          </div>
          
        </div>

      </Card>
      )}
    </div>
  );
};
