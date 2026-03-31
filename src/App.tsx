import { useState, useEffect } from 'react';
import './App.css';
import { ToolsTab } from './components/ToolsTab';
import { ConvertersTab } from './components/ConvertersTab';
import { MoneyTab } from './components/MoneyTab';

// Reusable Components
export const Card = ({ children, title, infoText, className = '' }: { children: React.ReactNode, title?: string, infoText?: string, className?: string }) => {
  const [showInfo, setShowInfo] = useState(false);
  return (
    <div className={`card ${className}`}>
      {title && (
        <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <h2 className="card-title" style={{ margin: 0 }}>{title}</h2>
            {infoText && (
               <button 
                 onClick={() => setShowInfo(!showInfo)}
                 style={{ width: '1.25rem', height: '1.25rem', borderRadius: '50%', border: '1px solid var(--text-muted)', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', background: showInfo ? 'var(--bg-color)' : 'transparent', marginLeft: '0.5rem', outline: 'none' }}
                 title="More info"
               >
                 i
               </button>
            )}
          </div>
          {infoText && showInfo && (
            <div className="fade-in" style={{ marginTop: '0.75rem', padding: '0.75rem', backgroundColor: 'var(--bg-color)', color: 'var(--text-secondary)', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', lineHeight: '1.5', borderLeft: '3px solid var(--primary-color)' }}>
              {infoText}
            </div>
          )}
        </div>
      )}
      {children}
    </div>
  );
};

export const Button = ({ children, variant = 'primary', ...props }: any) => (
  <button className={`btn btn-${variant}`} {...props}>
    {children}
  </button>
);

export const Input = ({ label, multiline = false, helpText, ...props }: any) => {
  const [showHelp, setShowHelp] = useState(false);
  return (
    <div className="input-group">
      {label && (
        <label style={{ display: 'flex', alignItems: 'center' }}>
          {label}
          {helpText && (
             <button 
               type="button"
               onClick={() => setShowHelp(!showHelp)}
               style={{ width: '1rem', height: '1rem', borderRadius: '50%', border: '1px solid var(--text-muted)', color: showHelp ? 'var(--primary-color)' : 'var(--text-muted)', borderColor: showHelp ? 'var(--primary-color)' : 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', fontWeight: 700, cursor: 'pointer', background: showHelp ? 'var(--bg-color)' : 'transparent', marginLeft: '0.4rem', outline: 'none' }}
               title="Toggle detailed explanation"
             >
               i
             </button>
          )}
        </label>
      )}
      {helpText && showHelp && (
        <div className="fade-in" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.1rem', marginBottom: '0.35rem', lineHeight: '1.3' }}>
          {helpText}
        </div>
      )}
      {multiline ? (
        <textarea className="input" {...props} />
      ) : (
        <input className="input" {...props} />
      )}
    </div>
  );
};

export const SectionHeader = ({ title, helpText }: { title: string, helpText?: string }) => {
  const [showHelp, setShowHelp] = useState(false);
  return (
    <div style={{ marginTop: '1.5rem', marginBottom: '0.75rem' }}>
      <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center' }}>
        {title}
        {helpText && (
           <button 
             type="button"
             onClick={() => setShowHelp(!showHelp)}
             style={{ width: '1.25rem', height: '1.25rem', borderRadius: '50%', border: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', background: showHelp ? 'var(--primary-color)' : 'var(--border-color)', color: showHelp ? '#fff' : 'var(--text-secondary)', marginLeft: '0.5rem', outline: 'none' }}
             title="Toggle detailed explanation"
           >
             i
           </button>
        )}
      </div>
      {helpText && showHelp && (
        <div className="fade-in" style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.4rem', lineHeight: '1.4' }}>
          {helpText}
        </div>
      )}
    </div>
  );
};

function App() {
  const [activeTab, setActiveTab] = useState('Tools');
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true';
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', String(darkMode));
  }, [darkMode]);

  const tabs = ['Tools', 'Converters', 'Money'];

  return (
    <div className="app-container">
      <header className="header">
        <div className="title-group">
          <h1>⚡ Quick Tools</h1>
          <p className="subtitle">Everyday utilities & simple calculators</p>
        </div>
        <button className="theme-toggle" onClick={() => setDarkMode(!darkMode)} aria-label="Toggle themes">
          {darkMode ? '☀️' : '🌙'}
        </button>
      </header>
      
      <nav className="tabs">
        {tabs.map(tab => (
          <button 
            key={tab} 
            className={`tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </nav>

      <main className="content fade-in" key={activeTab}>
        {activeTab === 'Tools' && <ToolsTab />}
        {activeTab === 'Converters' && <ConvertersTab />}
        {activeTab === 'Money' && <MoneyTab />}
      </main>
    </div>
  );
}

export default App;
