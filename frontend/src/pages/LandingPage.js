import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();
  const pillars = [92, 84, 78, 70, 62, 54, 46, 34, 18, 34, 46, 54, 62, 70, 78, 84, 92];
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <style>
        {`
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes subtlePulse {
            0%, 100% { opacity: 0.8; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.03); }
          }
          .animate-fadeInUp { animation: fadeInUp 0.8s ease-out forwards; }
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { margin: 0; padding: 0; overflow-x: hidden; }
        `}
      </style>

      <section style={{ position: 'relative', isolation: 'isolate', height: '100vh', overflow: 'hidden', background: '#000', color: '#fff' }}>
        <div aria-hidden="true" style={{ position: 'absolute', inset: 0, zIndex: -30, backgroundImage: [
          "radial-gradient(80% 55% at 50% 52%, rgba(252,166,154,0.45) 0%, rgba(214,76,82,0.46) 27%, rgba(61,36,47,0.38) 47%, rgba(39,38,67,0.45) 60%, rgba(8,8,12,0.92) 78%, rgba(0,0,0,1) 88%)",
          "radial-gradient(85% 60% at 14% 0%, rgba(255,193,171,0.65) 0%, rgba(233,109,99,0.58) 30%, rgba(48,24,28,0.0) 64%)",
          "radial-gradient(70% 50% at 86% 22%, rgba(88,112,255,0.40) 0%, rgba(16,18,28,0.0) 55%)",
          "linear-gradient(to bottom, rgba(0,0,0,0.25), rgba(0,0,0,0) 40%)"
        ].join(","), backgroundColor: '#000' }} />

        <div aria-hidden="true" style={{ position: 'absolute', inset: 0, zIndex: -20, background: 'radial-gradient(140% 120% at 50% 0%, transparent 60%, rgba(0,0,0,0.85))' }} />

        <div aria-hidden="true" style={{ pointerEvents: 'none', position: 'absolute', inset: 0, zIndex: -10, mixBlendMode: 'screen', opacity: 0.3, backgroundImage: [
          "repeating-linear-gradient(90deg, rgba(255,255,255,0.09) 0 1px, transparent 1px 96px)",
          "repeating-linear-gradient(90deg, rgba(255,255,255,0.05) 0 1px, transparent 1px 24px)",
          "repeating-radial-gradient(80% 55% at 50% 52%, rgba(255,255,255,0.08) 0 1px, transparent 1px 120px)"
        ].join(","), backgroundBlendMode: 'screen' }} />

        <header style={{ position: 'relative', zIndex: 10 }}>
          <div style={{ margin: '0 auto', display: 'flex', width: '100%', maxWidth: '1280px', alignItems: 'center', justifyContent: 'space-between', padding: '24px 32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ height: '24px', width: '24px', borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>⚙</div>
              <span style={{ fontSize: '18px', fontWeight: 600, letterSpacing: '-0.025em' }}>GearGuard</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button onClick={() => navigate('/login')} style={{ borderRadius: '9999px', padding: '8px 16px', fontSize: '14px', color: 'rgba(255,255,255,0.8)', background: 'none', border: 'none', cursor: 'pointer' }} onMouseEnter={(e) => e.target.style.color = '#fff'} onMouseLeave={(e) => e.target.style.color = 'rgba(255,255,255,0.8)'}>Sign in</button>
              <button onClick={() => navigate('/login')} style={{ borderRadius: '9999px', background: '#fff', padding: '8px 16px', fontSize: '14px', fontWeight: 500, color: '#000', boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)', transition: 'background 0.15s', border: 'none', cursor: 'pointer' }} onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.9)'} onMouseLeave={(e) => e.target.style.background = '#fff'}>Get Started</button>
            </div>
          </div>
        </header>

        <div style={{ position: 'relative', zIndex: 10, margin: '0 auto', display: 'grid', width: '100%', maxWidth: '1024px', placeItems: 'center', padding: '64px 24px 96px' }}>
          <div style={{ margin: '0 auto', textAlign: 'center' }}>
            <span className={isMounted ? 'animate-fadeInUp' : ''} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', borderRadius: '9999px', background: 'rgba(255,255,255,0.05)', padding: '4px 12px', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)', opacity: isMounted ? 1 : 0 }}>
              <span style={{ height: '6px', width: '6px', borderRadius: '50%', background: 'rgba(255,255,255,0.7)' }} /> maintenance toolkit
            </span>
            <h1 className={isMounted ? 'animate-fadeInUp' : ''} style={{ marginTop: '24px', fontSize: '60px', fontWeight: 700, letterSpacing: '-0.025em', lineHeight: 1.1, opacity: isMounted ? 1 : 0, animationDelay: '200ms' }}>
              Track, Manage & Maintain Your Assets
            </h1>
            <p className={isMounted ? 'animate-fadeInUp' : ''} style={{ margin: '20px auto 0', maxWidth: '768px', fontSize: '18px', lineHeight: 1.6, color: 'rgba(255,255,255,0.8)', opacity: isMounted ? 1 : 0, animationDelay: '300ms' }}>
              Complete maintenance management system for tracking equipment, managing teams, and streamlining workflows—from breakdown repairs to preventive maintenance scheduling.
            </p>
            <div className={isMounted ? 'animate-fadeInUp' : ''} style={{ marginTop: '32px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: '12px', opacity: isMounted ? 1 : 0, animationDelay: '400ms' }}>
              <a onClick={() => navigate('/login')} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', borderRadius: '9999px', background: '#fff', padding: '12px 24px', fontSize: '14px', fontWeight: 600, color: '#000', boxShadow: '0 1px 3px 0 rgba(0,0,0,0.1)', transition: 'background 0.15s', textDecoration: 'none', cursor: 'pointer' }} onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.9)'} onMouseLeave={(e) => e.target.style.background = '#fff'}>Get Started Free</a>
              <a onClick={() => navigate('/login')} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', borderRadius: '9999px', border: '1px solid rgba(255,255,255,0.2)', padding: '12px 24px', fontSize: '14px', fontWeight: 600, color: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(8px)', background: 'transparent', textDecoration: 'none', cursor: 'pointer' }} onMouseEnter={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.4)'} onMouseLeave={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.2)'}>View Demo</a>
            </div>
          </div>
        </div>

        <div style={{ position: 'relative', zIndex: 10, margin: '40px auto 0', width: '100%', maxWidth: '1152px', padding: '0 24px 96px' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: '40px 40px', opacity: 0.7 }}>
            {['Equipment Tracking', 'Team Management', 'Maintenance Requests', 'Kanban Workflow', 'Calendar Scheduling', 'Smart Automation', 'Real-time Analytics', 'Dashboard Insights'].map((brand) => (
              <div key={brand} style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.7)' }}>{brand}</div>
            ))}
          </div>
        </div>

        <div style={{ pointerEvents: 'none', position: 'absolute', bottom: '128px', left: '50%', zIndex: 0, height: '144px', width: '112px', transform: 'translateX(-50%)', borderRadius: '6px', background: 'linear-gradient(to bottom, rgba(255,255,255,0.75), rgba(252,166,154,0.6), transparent)', animation: 'subtlePulse 6s ease-in-out infinite' }} />

        <div style={{ pointerEvents: 'none', position: 'absolute', insetInline: 0, bottom: 0, zIndex: 0, height: '54vh' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #000, rgba(0,0,0,0.9), transparent)' }} />
          <div style={{ position: 'absolute', insetInline: 0, bottom: 0, display: 'flex', height: '100%', alignItems: 'flex-end', gap: '1px', padding: '0 2px' }}>
            {pillars.map((h, i) => (
              <div key={i} style={{ flex: 1, background: '#000', height: isMounted ? `${h}%` : '0%', transition: 'height 1s ease-in-out', transitionDelay: `${Math.abs(i - Math.floor(pillars.length / 2)) * 60}ms` }} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default LandingPage;
