import React, { useState, useEffect } from 'react';
import { getVisitAnalytics, getCertificateRecords, CertificateRecord, VisitRecord } from '../utils/analyticsStore';

interface AdminPanelProps {
  onBackToHome: () => void;
  onGoToTools: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onBackToHome, onGoToTools }) => {
  // Authentication with sessionStorage persistence
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('ekta_admin_auth') === 'true';
  });
  const [usernameInput, setUsernameInput] = useState<string>('');
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loginError, setLoginError] = useState<string>('');

  const [activeTab, setActiveTab] = useState<'visitors' | 'certificates'>('visitors');
  const [analytics, setAnalytics] = useState(() => getVisitAnalytics());
  const [certificates, setCertificates] = useState<CertificateRecord[]>(() => getCertificateRecords());

  // Search & Filters
  const [dateSearch, setDateSearch] = useState<string>('');
  const [certSearch, setCertSearch] = useState<string>('');

  // Certificate Modal Preview
  const [selectedCert, setSelectedCert] = useState<CertificateRecord | null>(null);

  // Sync latest data on load
  useEffect(() => {
    setAnalytics(getVisitAnalytics());
    setCertificates(getCertificateRecords());
  }, []);

  const handleRefresh = () => {
    setAnalytics(getVisitAnalytics());
    setCertificates(getCertificateRecords());
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const u = usernameInput.trim().toLowerCase();
    const p = passwordInput.trim();

    // Valid credentials:
    // Username: aditya072 (or email)
    // Password: Aditya#1234
    if ((u === 'aditya072' || u === 'ektacommunication3@gmail.com') && p === 'Aditya#1234') {
      sessionStorage.setItem('ekta_admin_auth', 'true');
      setIsAuthenticated(true);
      setLoginError('');
    } else {
      setLoginError('गलत यूजरनेम या पासवर्ड! (Invalid Username or Password). सही विवरण दर्ज करें।');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('ekta_admin_auth');
    setIsAuthenticated(false);
    setUsernameInput('');
    setPasswordInput('');
  };

  // Filtered visit history
  const filteredVisits = analytics.history.filter((v: VisitRecord) =>
    v.date.toLowerCase().includes(dateSearch.toLowerCase()) ||
    v.displayDate.toLowerCase().includes(dateSearch.toLowerCase())
  );

  // Filtered certificates
  const filteredCerts = certificates.filter((c: CertificateRecord) =>
    c.candidateName.toLowerCase().includes(certSearch.toLowerCase()) ||
    c.candidatePhone.includes(certSearch) ||
    c.certSerial.toLowerCase().includes(certSearch.toLowerCase())
  );

  // ============================================================
  // LOGIN SCREEN (WHEN NOT AUTHENTICATED)
  // ============================================================
  if (!isAuthenticated) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, var(--blue-deep) 0%, #061942 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        boxSizing: 'border-box'
      }}>
        <div style={{
          background: '#ffffff',
          borderRadius: '20px',
          padding: 'clamp(24px, 5vw, 40px) clamp(18px, 4vw, 32px)',
          maxWidth: '440px',
          width: '100%',
          boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
          textAlign: 'center',
          boxSizing: 'border-box'
        }}>
          {/* Logo / Lock Icon */}
          <div style={{
            width: '68px',
            height: '68px',
            borderRadius: '50%',
            background: 'var(--orange-light)',
            color: 'var(--orange)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.9rem',
            margin: '0 auto 16px',
            border: '2px solid rgba(247,108,27,0.2)'
          }}>
            <i className="fa-solid fa-shield-halved"></i>
          </div>

          <h2 style={{ fontFamily: 'var(--font-head)', color: 'var(--blue-deep)', fontSize: '1.5rem', margin: '0 0 4px', lineHeight: 1.2 }}>
            EKTA COMMUNICATION
          </h2>
          <p style={{ color: 'var(--gray-600)', fontSize: '0.86rem', margin: '0 0 24px', fontWeight: 600 }}>
            सुरक्षित एडमिन लॉगिन (Admin Security Portal)
          </p>

          <form onSubmit={handleLogin} style={{ textAlign: 'left' }}>
            {/* Username Input */}
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--gray-800)', marginBottom: '6px' }}>
                यूजरनेम (Username)
              </label>
              <div style={{ position: 'relative' }}>
                <i className="fa-solid fa-user" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}></i>
                <input
                  type="text"
                  placeholder="अपना यूजरनेम दर्ज करें"
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '12px 14px 12px 40px',
                    borderRadius: '10px',
                    border: '1.5px solid #cbd5e1',
                    fontSize: '0.95rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>

            {/* Password Input */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--gray-800)', marginBottom: '6px' }}>
                पासवर्ड (Password)
              </label>
              <div style={{ position: 'relative' }}>
                <i className="fa-solid fa-lock" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}></i>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '12px 42px 12px 40px',
                    borderRadius: '10px',
                    border: '1.5px solid #cbd5e1',
                    fontSize: '0.95rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: '#64748b',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    padding: '4px'
                  }}
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  <i className={showPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'}></i>
                </button>
              </div>
            </div>

            {loginError && (
              <div style={{
                background: '#fee2e2',
                border: '1px solid #fca5a5',
                color: '#dc2626',
                padding: '10px 14px',
                borderRadius: '8px',
                fontSize: '0.82rem',
                marginBottom: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <i className="fa-solid fa-circle-exclamation"></i>
                <span>{loginError}</span>
              </div>
            )}

            <button
              type="submit"
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, var(--orange), var(--orange-dark))',
                color: '#fff',
                border: 'none',
                padding: '13px',
                borderRadius: '10px',
                fontWeight: 800,
                fontSize: '1rem',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(247,108,27,0.35)',
                transition: 'transform 0.2s'
              }}
            >
              <i className="fa-solid fa-right-to-bracket" style={{ marginRight: '8px' }}></i>
              लॉगिन करें (Login to Dashboard)
            </button>
          </form>

          <button
            onClick={onBackToHome}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--blue-mid)',
              fontWeight: 700,
              fontSize: '0.86rem',
              marginTop: '18px',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            ← वापस मुख्य वेबसाइट पर जाएँ (Back to Home)
          </button>
        </div>
      </div>
    );
  }

  // ============================================================
  // AUTHENTICATED ADMIN DASHBOARD
  // ============================================================
  return (
    <div style={{ minHeight: '100vh', background: '#f1f5f9', color: '#1e293b' }}>
      
      {/* Admin Top Header - Fully Mobile Friendly */}
      <header style={{
        background: 'var(--blue-deep)',
        color: '#ffffff',
        padding: '12px 0',
        borderBottom: '3.5px solid var(--orange)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div className="container" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '10px'
        }}>
          
          {/* Shop & Admin Info */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: '220px' }}>
            <button
              onClick={onBackToHome}
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.18)',
                border: '1.5px solid rgba(255,255,255,0.3)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1rem',
                cursor: 'pointer',
                flexShrink: 0
              }}
              title="Return to Website Home"
            >
              <i className="fa-solid fa-arrow-left"></i>
            </button>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                <span style={{
                  background: 'var(--orange)',
                  color: '#fff',
                  fontSize: '0.65rem',
                  fontWeight: 800,
                  padding: '2px 6px',
                  borderRadius: '4px',
                  textTransform: 'uppercase'
                }}>
                  Admin Portal
                </span>
                <h1 style={{ fontFamily: 'var(--font-head)', fontSize: 'clamp(1rem, 3.5vw, 1.25rem)', margin: 0, color: 'var(--white)', lineHeight: 1.1 }}>
                  EKTA COMMUNICATION
                </h1>
              </div>
              <div style={{ fontSize: '0.72rem', color: '#cbd5e1', marginTop: '2px' }}>
                Near Registry Office, Ekma (Saran) • <strong>Real Analytics</strong>
              </div>
            </div>
          </div>

          {/* Action Buttons: Refresh, Tools, Logout */}
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={handleRefresh}
              style={{
                background: 'rgba(255,255,255,0.14)',
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.25)',
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}
              title="Refresh Data"
            >
              <i className="fa-solid fa-rotate"></i>
              <span>रिफ्रेश</span>
            </button>

            <button
              onClick={onGoToTools}
              style={{
                background: 'var(--orange)',
                color: '#fff',
                border: 'none',
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}
              title="Open Online Tools"
            >
              <i className="fa-solid fa-screwdriver-wrench"></i>
              <span>Tools</span>
            </button>

            <button
              onClick={handleLogout}
              style={{
                background: 'rgba(239, 68, 68, 0.25)',
                color: '#fca5a5',
                border: '1px solid rgba(239, 68, 68, 0.4)',
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}
              title="Logout from Admin Panel"
            >
              <i className="fa-solid fa-arrow-right-from-bracket"></i>
              <span>लॉगआउट</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Admin Content Container */}
      <main className="container" style={{ padding: '20px 0 60px' }}>
        
        {/* KPI Counter Cards Row - 100% Real Authentic Data */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '12px',
          marginBottom: '24px'
        }}>
          {/* 1. Total Real Website Visits */}
          <div style={{
            background: '#ffffff',
            borderRadius: '14px',
            padding: '16px',
            border: '1.5px solid #e2e8f0',
            boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
            borderLeft: '5px solid var(--blue-mid)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--gray-600)', textTransform: 'uppercase' }}>
                Total Website Visits
              </span>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--blue-pale)', color: 'var(--blue-deep)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem' }}>
                <i className="fa-solid fa-chart-line"></i>
              </div>
            </div>
            <div style={{ fontSize: 'clamp(1.6rem, 5vw, 2.1rem)', fontWeight: 800, color: 'var(--blue-deep)', lineHeight: 1.1 }}>
              {analytics.totalVisits.toLocaleString('en-IN')}
            </div>
            <div style={{ fontSize: '0.74rem', color: '#16a34a', fontWeight: 700, marginTop: '6px' }}>
              <i className="fa-solid fa-check-double"></i> वास्तविक कुल विज़िटर्स (Real Count)
            </div>
          </div>

          {/* 2. Today's Real Visits */}
          <div style={{
            background: '#ffffff',
            borderRadius: '14px',
            padding: '16px',
            border: '1.5px solid #e2e8f0',
            boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
            borderLeft: '5px solid var(--orange)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--gray-600)', textTransform: 'uppercase' }}>
                Today's Visits (आज)
              </span>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--orange-light)', color: 'var(--orange)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem' }}>
                <i className="fa-solid fa-users"></i>
              </div>
            </div>
            <div style={{ fontSize: 'clamp(1.6rem, 5vw, 2.1rem)', fontWeight: 800, color: 'var(--orange)', lineHeight: 1.1 }}>
              {analytics.todayVisits.toLocaleString('en-IN')}
            </div>
            <div style={{ fontSize: '0.74rem', color: 'var(--gray-600)', fontWeight: 600, marginTop: '6px' }}>
              कल (Yesterday): {analytics.yesterdayVisits} विज़िट्स
            </div>
          </div>

          {/* 3. Real Certificates Downloaded */}
          <div style={{
            background: '#ffffff',
            borderRadius: '14px',
            padding: '16px',
            border: '1.5px solid #e2e8f0',
            boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
            borderLeft: '5px solid #16a34a'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--gray-600)', textTransform: 'uppercase' }}>
                Certificates Downloaded
              </span>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem' }}>
                <i className="fa-solid fa-award"></i>
              </div>
            </div>
            <div style={{ fontSize: 'clamp(1.6rem, 5vw, 2.1rem)', fontWeight: 800, color: '#16a34a', lineHeight: 1.1 }}>
              {certificates.length}
            </div>
            <div style={{ fontSize: '0.74rem', color: '#16a34a', fontWeight: 700, marginTop: '6px' }}>
              <i className="fa-solid fa-id-card"></i> नाम व मोबाइल नंबर सहित
            </div>
          </div>

          {/* 4. Active Location */}
          <div style={{
            background: '#ffffff',
            borderRadius: '14px',
            padding: '16px',
            border: '1.5px solid #e2e8f0',
            boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
            borderLeft: '5px solid #0d9488'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--gray-600)', textTransform: 'uppercase' }}>
                Registry Office
              </span>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#ccfbf1', color: '#0d9488', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem' }}>
                <i className="fa-solid fa-location-dot"></i>
              </div>
            </div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--blue-deep)', lineHeight: 1.2 }}>
              Ekma, Saran
            </div>
            <div style={{ fontSize: '0.74rem', color: 'var(--gray-600)', fontWeight: 600, marginTop: '6px' }}>
              Bihar Sub-Registrar Complex
            </div>
          </div>
        </div>

        {/* Admin Navigation Tabs */}
        <div style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '18px',
          borderBottom: '2px solid #e2e8f0',
          paddingBottom: '10px',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={() => setActiveTab('visitors')}
            style={{
              padding: '9px 16px',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 800,
              fontSize: 'clamp(0.82rem, 2.5vw, 0.92rem)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: activeTab === 'visitors' ? 'var(--blue-deep)' : '#ffffff',
              color: activeTab === 'visitors' ? '#ffffff' : '#334155',
              boxShadow: activeTab === 'visitors' ? '0 2px 8px rgba(10,36,99,0.2)' : 'none',
              transition: 'all 0.2s',
              flex: '1 1 auto',
              justifyContent: 'center',
              minWidth: '180px'
            }}
          >
            <i className="fa-solid fa-chart-simple" style={{ color: activeTab === 'visitors' ? 'var(--orange)' : 'inherit' }}></i>
            वेबसाइट विज़िटर व पिछली तिथियाँ ({analytics.history.length})
          </button>

          <button
            onClick={() => setActiveTab('certificates')}
            style={{
              padding: '9px 16px',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 800,
              fontSize: 'clamp(0.82rem, 2.5vw, 0.92rem)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: activeTab === 'certificates' ? 'var(--blue-deep)' : '#ffffff',
              color: activeTab === 'certificates' ? '#ffffff' : '#334155',
              boxShadow: activeTab === 'certificates' ? '0 2px 8px rgba(10,36,99,0.2)' : 'none',
              transition: 'all 0.2s',
              flex: '1 1 auto',
              justifyContent: 'center',
              minWidth: '180px'
            }}
          >
            <i className="fa-solid fa-certificate" style={{ color: activeTab === 'certificates' ? 'var(--orange)' : 'inherit' }}></i>
            डाउनलोड किए गए सर्टिफिकेट ({certificates.length})
          </button>
        </div>

        {/* ============================================================
            TAB 1: WEBSITE VISITORS & PAST DATE ANALYTICS
        ============================================================ */}
        {activeTab === 'visitors' && (
          <div style={{
            background: '#ffffff',
            borderRadius: '16px',
            padding: 'clamp(16px, 3vw, 24px)',
            border: '1.5px solid #e2e8f0',
            boxShadow: '0 2px 14px rgba(0,0,0,0.04)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '18px' }}>
              <div>
                <h2 style={{ fontFamily: 'var(--font-head)', color: 'var(--blue-deep)', fontSize: '1.25rem', margin: '0 0 4px' }}>
                  वेबसाइट विज़िट्स हिस्ट्री (Past Date Visitor Breakdown)
                </h2>
                <p style={{ color: '#64748b', fontSize: '0.82rem', margin: 0 }}>
                  पिछली तिथियों में कितने लोगों ने वेबसाइट खोली, उसका रियल-टाइम रिकॉर्ड।
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', maxWidth: '320px' }}>
                <div style={{ position: 'relative', width: '100%' }}>
                  <i className="fa-solid fa-magnifying-glass" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}></i>
                  <input
                    type="text"
                    placeholder="तारीख खोजें (उदा: 2026 या Oct)..."
                    value={dateSearch}
                    onChange={(e) => setDateSearch(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px 8px 34px',
                      borderRadius: '8px',
                      border: '1.5px solid #cbd5e1',
                      fontSize: '0.85rem',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Mobile Scrollable Table */}
            <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.86rem', minWidth: '420px' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0', color: 'var(--blue-deep)' }}>
                    <th style={{ padding: '10px 14px', fontWeight: 800 }}>तारीख (Date)</th>
                    <th style={{ padding: '10px 14px', fontWeight: 800 }}>दैनिक विज़िटर्स</th>
                    <th style={{ padding: '10px 14px', fontWeight: 800 }}>ट्रैफिक बार (Traffic)</th>
                    <th style={{ padding: '10px 14px', fontWeight: 800 }}>स्थिति</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredVisits.length > 0 ? (
                    filteredVisits.map((v: VisitRecord, idx: number) => {
                      const isToday = v.date === new Date().toISOString().split('T')[0];
                      const maxDaily = Math.max(...analytics.history.map((h: VisitRecord) => h.count), 10);
                      const barPct = Math.min(Math.round((v.count / maxDaily) * 100), 100);

                      return (
                        <tr key={v.date} style={{
                          borderBottom: '1px solid #e2e8f0',
                          background: isToday ? '#fffbeb' : idx % 2 === 0 ? '#ffffff' : '#fcfcfd'
                        }}>
                          <td style={{ padding: '10px 14px', fontWeight: isToday ? 800 : 600 }}>
                            {v.displayDate}
                            {isToday && (
                              <span style={{
                                marginLeft: '6px',
                                background: 'var(--orange)',
                                color: '#fff',
                                fontSize: '0.65rem',
                                padding: '2px 6px',
                                borderRadius: '99px',
                                fontWeight: 800
                              }}>
                                आज (TODAY)
                              </span>
                            )}
                          </td>
                          <td style={{ padding: '10px 14px', fontWeight: 800, color: 'var(--blue-deep)', fontSize: '0.98rem' }}>
                            {v.count} <span style={{ fontSize: '0.72rem', fontWeight: 500, color: '#64748b' }}>visits</span>
                          </td>
                          <td style={{ padding: '10px 14px', minWidth: '120px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <div style={{ flex: 1, background: '#e2e8f0', height: '8px', borderRadius: '99px', overflow: 'hidden' }}>
                                <div style={{
                                  width: `${Math.max(barPct, 8)}%`,
                                  background: isToday ? 'var(--orange)' : 'linear-gradient(90deg, var(--blue-mid), var(--blue-light))',
                                  height: '100%',
                                  borderRadius: '99px'
                                }}></div>
                              </div>
                              <span style={{ fontSize: '0.72rem', color: '#64748b', minWidth: '30px' }}>{v.count}</span>
                            </div>
                          </td>
                          <td style={{ padding: '10px 14px' }}>
                            <span style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              fontSize: '0.74rem',
                              fontWeight: 700,
                              color: '#16a34a'
                            }}>
                              <i className="fa-solid fa-circle" style={{ fontSize: '0.45rem' }}></i>
                              Active
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={4} style={{ textAlign: 'center', padding: '24px', color: '#64748b' }}>
                        कोई तारीख नहीं मिली।
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ============================================================
            TAB 2: DOWNLOADED CERTIFICATES & CANDIDATE MOBILE LOG
        ============================================================ */}
        {activeTab === 'certificates' && (
          <div style={{
            background: '#ffffff',
            borderRadius: '16px',
            padding: 'clamp(16px, 3vw, 24px)',
            border: '1.5px solid #e2e8f0',
            boxShadow: '0 2px 14px rgba(0,0,0,0.04)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '18px' }}>
              <div>
                <h2 style={{ fontFamily: 'var(--font-head)', color: 'var(--blue-deep)', fontSize: '1.25rem', margin: '0 0 4px' }}>
                  डाउनलोड किए गए प्रमाणपत्रों की सूची (Candidate Certificates)
                </h2>
                <p style={{ color: '#64748b', fontSize: '0.82rem', margin: 0 }}>
                  उम्मीदवारों के नाम, मोबाइल नंबर, स्पीड (WPM) व एक्यूरेसी का रियल-टाइम डेटा।
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', maxWidth: '320px' }}>
                <div style={{ position: 'relative', width: '100%' }}>
                  <i className="fa-solid fa-magnifying-glass" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}></i>
                  <input
                    type="text"
                    placeholder="उम्मीदवार, मोबाइल या ID खोजें..."
                    value={certSearch}
                    onChange={(e) => setCertSearch(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px 8px 34px',
                      borderRadius: '8px',
                      border: '1.5px solid #cbd5e1',
                      fontSize: '0.85rem',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>
            </div>

            {/* If zero certificates exist (authentic fresh start) */}
            {filteredCerts.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '40px 20px',
                background: '#f8fafc',
                borderRadius: '12px',
                border: '1.5px dashed #cbd5e1'
              }}>
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  background: 'var(--orange-light)',
                  color: 'var(--orange)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.6rem',
                  margin: '0 auto 12px'
                }}>
                  <i className="fa-solid fa-file-circle-check"></i>
                </div>
                <h3 style={{ fontFamily: 'var(--font-head)', color: 'var(--blue-deep)', margin: '0 0 6px', fontSize: '1.15rem' }}>
                  अभी तक कोई सर्टिफिकेट डाउनलोड नहीं हुआ है (No Real Certificates Yet)
                </h3>
                <p style={{ color: '#64748b', fontSize: '0.86rem', maxWidth: '520px', margin: '0 auto 18px', lineHeight: 1.5 }}>
                  सभी डेमो रिकॉर्ड हटा दिए गए हैं। जैसे ही कोई अभ्यर्थी ऑनलाइन टाइपिंग टेस्ट पूरा करेगा और अपना नाम व मोबाइल नंबर दर्ज कर सर्टिफिकेट डाउनलोड करेगा, उनका डेटा यहाँ तुरंत दिखेगा।
                </p>
                <button
                  type="button"
                  onClick={onGoToTools}
                  style={{
                    background: 'var(--orange)',
                    color: '#ffffff',
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '8px',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <i className="fa-solid fa-keyboard"></i> टाइपिंग टेस्ट पोर्टल पर जाएँ व टेस्ट करें
                </button>
              </div>
            ) : (
              <>
                {/* Mobile Friendly Cards for Small Screens (< 768px) */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '12px' }}>
                  {filteredCerts.map((c: CertificateRecord, idx: number) => (
                    <div
                      key={c.id || idx}
                      style={{
                        background: '#ffffff',
                        border: '1.5px solid #e2e8f0',
                        borderRadius: '12px',
                        padding: '14px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                        transition: 'transform 0.15s'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                        <div>
                          <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--blue-deep)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <i className="fa-solid fa-user-graduate" style={{ color: 'var(--orange)' }}></i>
                            {c.candidateName}
                          </div>
                          <span style={{
                            display: 'inline-block',
                            background: c.language === 'english' ? 'var(--blue-pale)' : '#fed7aa',
                            color: c.language === 'english' ? 'var(--blue-deep)' : '#9a3412',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            fontWeight: 700,
                            fontSize: '0.7rem',
                            marginTop: '4px'
                          }}>
                            {c.language === 'english' ? 'English' : 'हिंदी'} • Level {c.level}
                          </span>
                        </div>

                        <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>
                          #{c.certSerial}
                        </span>
                      </div>

                      {/* Phone & WhatsApp */}
                      <div style={{
                        background: '#f8fafc',
                        borderRadius: '8px',
                        padding: '8px 10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '10px'
                      }}>
                        <div style={{ fontSize: '0.82rem', color: '#334155' }}>
                          <i className="fa-solid fa-phone" style={{ color: '#64748b', marginRight: '6px' }}></i>
                          <strong>+91 {c.candidatePhone || 'Not Provided'}</strong>
                        </div>

                        {c.candidatePhone && c.candidatePhone.length === 10 && (
                          <a
                            href={`https://wa.me/91${c.candidatePhone}?text=Hello%20${encodeURIComponent(c.candidateName)}%2C%20greetings%20from%20Ekta%20Communication%20Ekma.%20We%20verified%20your%20typing%20certificate.`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              background: '#25d366',
                              color: '#fff',
                              padding: '3px 8px',
                              borderRadius: '6px',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              textDecoration: 'none',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                          >
                            <i className="fa-brands fa-whatsapp"></i> Chat
                          </a>
                        )}
                      </div>

                      {/* Speed & Accuracy Grid */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '10px' }}>
                        <div style={{ background: '#f1f5f9', borderRadius: '6px', padding: '6px 8px', textAlign: 'center' }}>
                          <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--blue-deep)' }}>
                            {c.netWpm} <span style={{ fontSize: '0.7rem' }}>WPM</span>
                          </div>
                          <div style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 700 }}>गति (Speed)</div>
                        </div>

                        <div style={{ background: '#f1f5f9', borderRadius: '6px', padding: '6px 8px', textAlign: 'center' }}>
                          <div style={{ fontSize: '1.1rem', fontWeight: 800, color: c.accuracyPct >= 90 ? '#16a34a' : '#ea580c' }}>
                            {c.accuracyPct}%
                          </div>
                          <div style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 700 }}>सटीकता (Accuracy)</div>
                        </div>
                      </div>

                      {/* Download Date & View Button */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #e2e8f0', paddingTop: '8px' }}>
                        <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                          <i className="fa-regular fa-clock" style={{ marginRight: '4px' }}></i>
                          {c.downloadedAt || c.date}
                        </span>

                        <button
                          type="button"
                          onClick={() => setSelectedCert(c)}
                          style={{
                            background: 'var(--blue-deep)',
                            color: '#ffffff',
                            border: 'none',
                            padding: '5px 12px',
                            borderRadius: '6px',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <i className="fa-solid fa-eye"></i> सर्टिफिकेट देखें
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

      </main>

      {/* ============================================================
          CERTIFICATE PREVIEW MODAL FOR ADMIN (MOBILE FRIENDLY)
      ============================================================ */}
      {selectedCert && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.75)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '12px',
          boxSizing: 'border-box'
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '16px',
            maxWidth: '760px',
            width: '100%',
            maxHeight: '92vh',
            overflowY: 'auto',
            padding: 'clamp(14px, 3vw, 22px)',
            position: 'relative',
            boxSizing: 'border-box'
          }}>
            {/* Modal Close Button */}
            <button
              onClick={() => setSelectedCert(null)}
              style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                background: '#fee2e2',
                color: '#dc2626',
                border: 'none',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                fontSize: '1rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              aria-label="Close modal"
            >
              ✕
            </button>

            <h3 style={{ fontFamily: 'var(--font-head)', color: 'var(--blue-deep)', margin: '0 0 12px', fontSize: '1.2rem', paddingRight: '36px' }}>
              📜 उम्मीदवार प्रमाणपत्र विवरण (#{selectedCert.certSerial})
            </h3>

            {/* Rendered Certificate Card inside Admin */}
            <div style={{
              background: '#fffdf9',
              borderRadius: '10px',
              padding: 'clamp(16px, 3vw, 24px) clamp(10px, 2vw, 16px)',
              position: 'relative',
              border: '6px solid var(--blue-deep)',
              outline: '2.5px solid #d97706',
              outlineOffset: '-4px',
              textAlign: 'center',
              marginBottom: '16px',
              boxSizing: 'border-box'
            }}>
              {/* Header with Scaled Printer Logo */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '8px', flexWrap: 'wrap' }}>
                <svg style={{ width: '56px', height: '56px', flexShrink: 0 }} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="12" y="28" width="46" height="30" rx="6" fill="#3a7bd5" />
                  <rect x="22" y="14" width="26" height="16" rx="3" fill="#1b4fa8" />
                  <rect x="27" y="8" width="16" height="12" rx="2" fill="#f0f4ff" stroke="#1b4fa8" strokeWidth="1.5" />
                  <rect x="24" y="50" width="22" height="16" rx="2" fill="#f0f4ff" stroke="#1b4fa8" strokeWidth="1.5" />
                  <line x1="28" y1="56" x2="42" y2="56" stroke="#1b4fa8" strokeWidth="2" strokeLinecap="round" />
                  <line x1="28" y1="60" x2="40" y2="60" stroke="#1b4fa8" strokeWidth="2" strokeLinecap="round" />
                  <circle cx="50" cy="38" r="3" fill="#1b4fa8" />
                  <rect x="42" y="6" width="22" height="17" rx="5" fill="#f76c1b" />
                  <polygon points="48,23 44,28 54,23" fill="#f76c1b" />
                  <circle cx="49" cy="14" r="2" fill="white" />
                  <circle cx="55" cy="14" r="2" fill="white" />
                  <circle cx="61" cy="14" r="2" fill="white" />
                </svg>
                <div>
                  <h2 style={{ fontFamily: 'var(--font-head)', fontSize: 'clamp(1.2rem, 3.5vw, 1.5rem)', color: 'var(--blue-deep)', margin: 0, lineHeight: 1.1 }}>
                    EKTA COMMUNICATION
                  </h2>
                  <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--orange)' }}>
                    Near Sub-Registrar Office, Ekma, Saran, Bihar
                  </div>
                </div>
              </div>

              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#d97706', textTransform: 'uppercase', marginBottom: '4px' }}>
                ★ CERTIFICATE OF TYPING PROFICIENCY ★
              </div>

              <div style={{ fontSize: 'clamp(1.2rem, 3.5vw, 1.5rem)', fontWeight: 800, color: 'var(--blue-deep)', margin: '8px 0 2px', textTransform: 'uppercase' }}>
                {selectedCert.candidateName}
              </div>
              <div style={{ fontSize: '0.85rem', color: '#16a34a', fontWeight: 800, marginBottom: '10px' }}>
                📱 Mobile / WhatsApp: +91 {selectedCert.candidatePhone || 'Not provided'}
              </div>

              {/* 4 Metrics in Mobile Responsive 2x2 or 4x1 grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '6px', margin: '12px 0' }}>
                <div style={{ background: '#fff', border: '1.5px solid #dbeafe', borderRadius: '8px', padding: '8px' }}>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--blue-deep)' }}>{selectedCert.netWpm}</div>
                  <div style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 700 }}>Speed (WPM)</div>
                </div>
                <div style={{ background: '#fff', border: '1.5px solid #dbeafe', borderRadius: '8px', padding: '8px' }}>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#16a34a' }}>{selectedCert.accuracyPct}%</div>
                  <div style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 700 }}>Accuracy</div>
                </div>
                <div style={{ background: '#fff', border: '1.5px solid #dbeafe', borderRadius: '8px', padding: '8px' }}>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#16a34a' }}>{selectedCert.correctCount}</div>
                  <div style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 700 }}>Correct Words</div>
                </div>
                <div style={{ background: '#fff', border: '1.5px solid #dbeafe', borderRadius: '8px', padding: '8px' }}>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#dc2626' }}>{selectedCert.wrongCount}</div>
                  <div style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 700 }}>Errors</div>
                </div>
              </div>

              <div style={{ fontSize: '0.72rem', color: '#475569', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '4px', marginTop: '10px', borderTop: '1px dashed #cbd5e1', paddingTop: '6px' }}>
                <span>ID: {selectedCert.certSerial}</span>
                <span>Date: {selectedCert.date}</span>
                <span>Lang: {selectedCert.language.toUpperCase()} (L{selectedCert.level})</span>
              </div>
            </div>

            {/* Modal Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              {selectedCert.candidatePhone && selectedCert.candidatePhone.length === 10 && (
                <a
                  href={`https://wa.me/91${selectedCert.candidatePhone}?text=Hello%20${encodeURIComponent(selectedCert.candidateName)}%2C%20your%20typing%20certificate%20(${selectedCert.certSerial})%20has%20been%20recorded%20at%20Ekta%20Communication%20Ekma.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    background: '#25d366',
                    color: '#fff',
                    padding: '8px 14px',
                    borderRadius: '8px',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <i className="fa-brands fa-whatsapp"></i> उम्मीदवार को WhatsApp भेजें
                </a>
              )}

              <button
                onClick={() => setSelectedCert(null)}
                style={{
                  background: 'var(--gray-200)',
                  border: 'none',
                  padding: '8px 18px',
                  borderRadius: '8px',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  marginLeft: 'auto'
                }}
              >
                बंद करें (Close)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
