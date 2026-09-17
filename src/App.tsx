import { useEffect, useState } from 'react';
import { useStore } from './lib/store';
import { ROUTES, type RouteId } from './lib/router';
import Onboarding from './features/onboarding/Onboarding';
import Today from './features/today/Today';
import Outfits from './features/outfits/Outfits';
import Closet from './features/closet/Closet';
import History from './features/history/History';
import Profile from './features/profile/Profile';
import Travel from './features/travel/Travel';
import StyleDNA from './features/style-dna/StyleDNA';

export default function App() {
  const onboarded = useStore((s) => s.onboarded);
  const theme = useStore((s) => s.theme);
  const toggleTheme = useStore((s) => s.toggleTheme);
  const [route, setRoute] = useState<RouteId>('today');

  useEffect(() => {
    const h = new Date().getHours();
    const night = h < 7 || h >= 19;
    const resolved = theme === 'auto' ? (night ? 'dark' : 'light') : theme;
    document.documentElement.setAttribute('data-theme', resolved);
  }, [theme]);

  if (!onboarded) return <Onboarding />;

  const currentRoute = ROUTES.find(r => r.id === route) || ROUTES[0];

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="sidebar__brand">
          <span className="sidebar__mark">S</span>
          <span className="sidebar__name">StyleApp</span>
        </div>
        <nav className="sidebar__nav">
          {ROUTES.map(r => (
            <button
              key={r.id}
              className={`nav-link ${route === r.id ? 'is-active' : ''}`}
              onClick={() => setRoute(r.id)}
            >
              <span className="nav-link__ico">{r.icon}</span>
              {r.label}
            </button>
          ))}
        </nav>
        <div className="sidebar__foot">v18 · 2026</div>
      </aside>

      <header className="topbar">
        <div className="topbar__left">
          <span className="topbar__greet">StyleApp</span>
          <h1 className="topbar__title">{currentRoute.title}</h1>
        </div>
        <button className="icon-btn" onClick={toggleTheme}>☾</button>
      </header>

      <main className="main">
        {route === 'today' && <Today />}
        {route === 'style-dna' && <StyleDNA />}
        {route === 'travel' && <Travel />}
        {route === 'outfits' && <Outfits />}
        {route === 'closet' && <Closet />}
        {route === 'history' && <History />}
        {route === 'profile' && <Profile />}
      </main>

      <nav className="tabbar">
        {ROUTES.map(r => (
          <button
            key={r.id}
            className={`tab ${route === r.id ? 'is-active' : ''}`}
            onClick={() => setRoute(r.id)}
          >
            <span className="tab__ico">{r.icon}</span>
            <span className="tab__lbl">{r.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}