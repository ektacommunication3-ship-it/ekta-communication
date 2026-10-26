import React, { useState, useEffect, useRef } from 'react';
import { ToolsPage } from './components/ToolsPage';
import { AdminPanel } from './components/AdminPanel';
import { recordWebsiteVisit } from './utils/analyticsStore';

export default function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'tools' | 'admin'>('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Automatically record website visit on initial page landing
  useEffect(() => {
    recordWebsiteVisit();
  }, []);

  // Sync hash routing
  useEffect(() => {
    const handleHash = () => {
      if (window.location.hash === '#tools') {
        setCurrentPage('tools');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (window.location.hash === '#admin') {
        setCurrentPage('admin');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setCurrentPage('home');
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  // Form states
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [service, setService] = useState('');
  const [fileName, setFileName] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Navbar scroll listener & reveal observer
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);

    // Ensure all reveal elements are made visible immediately
    const revealEls = document.querySelectorAll('.reveal');
    revealEls.forEach((el) => el.classList.add('visible'));

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [currentPage]);

  const buildWaMessage = (customerName: string, customerPhone: string, selectedService: string) => {
    const n = customerName || 'Customer';
    const p = customerPhone || 'Not provided';
    const s = selectedService || 'General Inquiry';
    const msg = `Hello Ekta Communication, I want to submit my document for ${s}. My Name: ${n}, Phone: ${p}`;
    return 'https://wa.me/919472460132?text=' + encodeURIComponent(msg);
  };

  const handleOpenWa = (e: React.MouseEvent, svc: string = '') => {
    e.preventDefault();
    window.open(buildWaMessage(name, phone, svc), '_blank');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name);
    } else {
      setFileName('');
    }
  };

  const handleFormSubmit = () => {
    if (!name.trim()) {
      alert('Please enter your name.');
      return;
    }
    const cleanPhone = phone.trim();
    if (!cleanPhone || !/^[6-9]\d{9}$/.test(cleanPhone)) {
      alert('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (!service) {
      alert('Please select a service.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      const waUrl = buildWaMessage(name, phone, service);
      window.open(waUrl, '_blank');
    }, 400);
  };

  const handleResetForm = () => {
    setName('');
    setPhone('');
    setService('');
    setFileName('');
    setIsSubmitted(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const navigateToTools = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    window.location.hash = 'tools';
    setCurrentPage('tools');
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToAdmin = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    window.location.hash = 'admin';
    setCurrentPage('admin');
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (currentPage === 'admin') {
    return (
      <AdminPanel
        onBackToHome={() => {
          window.location.hash = '';
          setCurrentPage('home');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onGoToTools={() => {
          window.location.hash = 'tools';
          setCurrentPage('tools');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    );
  }

  if (currentPage === 'tools') {
    return (
      <ToolsPage
        onBackToHome={() => {
          window.location.hash = '';
          setCurrentPage('home');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    );
  }

  return (
    <div>
      {/* ============================================================
          NAVBAR
      ============================================================ */}
      <nav id="navbar" className={isScrolled ? 'scrolled' : ''}>
        <div className="container">
          <div className="nav-inner">
            <a href="#hero" className="nav-logo" aria-label="Ekta Communication Home">
              {/* Inline SVG logo matching the uploaded PNG */}
              <svg className="nav-logo-icon" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Printer body */}
                <rect x="12" y="28" width="46" height="30" rx="6" fill="#3a7bd5" />
                {/* Printer top slot */}
                <rect x="22" y="14" width="26" height="16" rx="3" fill="#1b4fa8" />
                {/* Paper coming out top */}
                <rect x="27" y="8" width="16" height="12" rx="2" fill="#f0f4ff" stroke="#1b4fa8" strokeWidth="1.5" />
                {/* Paper coming out bottom */}
                <rect x="24" y="50" width="22" height="16" rx="2" fill="#f0f4ff" stroke="#1b4fa8" strokeWidth="1.5" />
                {/* Lines on bottom paper */}
                <line x1="28" y1="56" x2="42" y2="56" stroke="#1b4fa8" strokeWidth="2" strokeLinecap="round" />
                <line x1="28" y1="60" x2="40" y2="60" stroke="#1b4fa8" strokeWidth="2" strokeLinecap="round" />
                {/* Printer dot */}
                <circle cx="50" cy="38" r="3" fill="#1b4fa8" />
                {/* Orange speech bubble */}
                <rect x="42" y="6" width="22" height="17" rx="5" fill="#f76c1b" />
                <polygon points="48,23 44,28 54,23" fill="#f76c1b" />
                {/* Bubble dots */}
                <circle cx="49" cy="14" r="2" fill="white" />
                <circle cx="55" cy="14" r="2" fill="white" />
                <circle cx="61" cy="14" r="2" fill="white" />
              </svg>
              <div className="nav-logo-text">
                <strong>EKTA COMMUNICATION</strong>
                <span>Photocopy &amp; Document Service</span>
              </div>
            </a>

            <ul className="nav-links">
              <li><a href="#services">Services</a></li>
              <li>
                <a
                  href="#tools"
                  onClick={navigateToTools}
                  style={{ color: 'var(--orange)', fontWeight: 700, cursor: 'pointer' }}
                >
                  <i className="fa-solid fa-screwdriver-wrench" style={{ marginRight: '5px' }}></i>Online Tools
                </a>
              </li>
              <li><a href="#upload">Upload Doc</a></li>
              <li><a href="#about">About</a></li>
              <li>
                <a
                  href="#software"
                  style={{ color: '#0d9488', fontWeight: 700 }}
                  onClick={(e) => {
                    const el = document.getElementById('software-services');
                    if (el) {
                      e.preventDefault();
                      el.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                >
                  <i className="fa-solid fa-code" style={{ marginRight: '4px' }}></i>Web &amp; Software
                </a>
              </li>
              <li><a href="#contact">Contact</a></li>
              <li>
                <a
                  className="nav-cta"
                  href="https://wa.me/919472460132?text=Hello%20Ekta%20Communication%2C%20I%20need%20help%20with%20document%20services."
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="fa-brands fa-whatsapp"></i> WhatsApp
                </a>
              </li>
            </ul>

            <button
              className="hamburger"
              id="hamburgerBtn"
              aria-label="Toggle menu"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <i className={mobileMenuOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-bars'} id="hamburgerIcon"></i>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`} id="mobileMenu">
          <a href="#services" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>Services</a>
          <a
            href="#tools"
            className="mobile-nav-link"
            onClick={navigateToTools}
            style={{ color: 'var(--orange)', fontWeight: 700, cursor: 'pointer' }}
          >
            <i className="fa-solid fa-screwdriver-wrench"></i> Online Tools
          </a>
          <a href="#upload" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>Upload Document</a>
          <a href="#about" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>About Us</a>
          <a
            href="#software-services"
            className="mobile-nav-link"
            onClick={() => setMobileMenuOpen(false)}
            style={{ color: '#0d9488', fontWeight: 700 }}
          >
            <i className="fa-solid fa-code"></i> Web &amp; Software Development
          </a>
          <a href="#contact" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>Contact</a>
          <a
            href="https://wa.me/919472460132?text=Hello%20Ekta%20Communication%2C%20I%20need%20help%20with%20document%20services."
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#25d366' }}
            onClick={() => setMobileMenuOpen(false)}
          >
            <i className="fa-brands fa-whatsapp"></i> Chat on WhatsApp
          </a>
        </div>
      </nav>

      {/* ============================================================
          HERO
      ============================================================ */}
      <section id="hero">
        <div className="container">
          <div className="hero-grid">
            {/* Left: Text */}
            <div>
              <div className="hero-badge">
                <i className="fa-solid fa-location-dot"></i>
                Near Registry Office, Ekma, Saran, Bihar
              </div>
              <h1 className="hero-title">
                Ekta<br /><span>Communication</span>
              </h1>
              <p className="hero-tagline">Photocopy &amp; Document Service</p>
              <p className="hero-sub">
                All Bihar Registry &amp; Document Work Done Here.<br />
                Trusted by thousands of customers in Ekma &amp; surrounding areas.
              </p>
              <div className="hero-buttons">
                <a
                  className="btn-wa"
                  id="heroWaBtn"
                  href="#"
                  onClick={(e) => handleOpenWa(e, '')}
                >
                  <i className="fa-brands fa-whatsapp"></i>
                  Send Document on WhatsApp
                </a>
                <a className="btn-outline" href="#services">
                  <i className="fa-solid fa-list-check"></i>
                  Our Services
                </a>
              </div>
            </div>

            {/* Right: Card */}
            <div className="hero-card-wrap">
              <div className="hero-card">
                <div className="hero-card-logo">
                  <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="12" y="28" width="46" height="30" rx="6" fill="#3a7bd5" />
                    <rect x="22" y="14" width="26" height="16" rx="3" fill="rgba(255,255,255,.25)" />
                    <rect x="27" y="8" width="16" height="12" rx="2" fill="rgba(255,255,255,.85)" stroke="rgba(255,255,255,.5)" strokeWidth="1.5" />
                    <rect x="24" y="50" width="22" height="16" rx="2" fill="rgba(255,255,255,.85)" stroke="rgba(255,255,255,.5)" strokeWidth="1.5" />
                    <line x1="28" y1="56" x2="42" y2="56" stroke="#1b4fa8" strokeWidth="2" strokeLinecap="round" />
                    <line x1="28" y1="60" x2="40" y2="60" stroke="#1b4fa8" strokeWidth="2" strokeLinecap="round" />
                    <circle cx="50" cy="38" r="3" fill="rgba(255,255,255,.4)" />
                    <rect x="42" y="6" width="22" height="17" rx="5" fill="#f76c1b" />
                    <polygon points="48,23 44,28 54,23" fill="#f76c1b" />
                    <circle cx="49" cy="14" r="2" fill="white" />
                    <circle cx="55" cy="14" r="2" fill="white" />
                    <circle cx="61" cy="14" r="2" fill="white" />
                  </svg>
                  <div className="hero-card-logo-text">
                    <strong>EKTA COMMUNICATION</strong>
                    <span>Ekma, Saran, Bihar</span>
                  </div>
                </div>
                <div className="hero-services-list">
                  <div className="hero-svc-item">
                    <i className="fa-solid fa-file-signature"></i>
                    Online Registry Apply
                  </div>
                  <div className="hero-svc-item">
                    <i className="fa-solid fa-heart"></i>
                    Marriage Registration Apply
                  </div>
                  <div className="hero-svc-item">
                    <i className="fa-solid fa-copy"></i>
                    Online Nakal / Certified Copy
                  </div>
                  <div className="hero-svc-item">
                    <i className="fa-solid fa-map"></i>
                    Online Khatiyan / Register 2
                  </div>
                  <div className="hero-svc-item">
                    <i className="fa-solid fa-credit-card"></i>
                    PAN &amp; Aadhaar Printing
                  </div>
                </div>
                <div className="hero-stats">
                  <div className="stat"><strong>1000+</strong><span>Happy Customers</span></div>
                  <div className="stat"><strong>6+</strong><span>Services</span></div>
                  <div className="stat"><strong>Fast</strong><span>Turnaround</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          MARQUEE STRIP
      ============================================================ */}
      <div className="marquee-strip" aria-hidden="true">
        <div className="marquee-track">
          <span className="marquee-item"><i className="fa-solid fa-star"></i> Online Registry Apply</span>
          <span className="marquee-item"><i className="fa-solid fa-star"></i> Marriage Registration Apply</span>
          <span className="marquee-item"><i className="fa-solid fa-star"></i> Online Nakal / Certified Copy</span>
          <span className="marquee-item"><i className="fa-solid fa-star"></i> Online Registry Searching</span>
          <span className="marquee-item"><i className="fa-solid fa-star"></i> Online Khatiyan</span>
          <span className="marquee-item"><i className="fa-solid fa-star"></i> Online Register 2 (Jamabandi)</span>
          <span className="marquee-item"><i className="fa-solid fa-star"></i> Jameen Rasid Karna</span>
          <span className="marquee-item"><i className="fa-solid fa-star"></i> Online Registry Chalan Apply</span>
          <span className="marquee-item"><i className="fa-solid fa-star"></i> PAN Card Printing</span>
          <span className="marquee-item"><i className="fa-solid fa-star"></i> Aadhaar Card Printing</span>
          <span className="marquee-item"><i className="fa-solid fa-star"></i> Online Registry Apply</span>
          <span className="marquee-item"><i className="fa-solid fa-star"></i> Marriage Registration Apply</span>
          <span className="marquee-item"><i className="fa-solid fa-star"></i> Online Nakal / Certified Copy</span>
          <span className="marquee-item"><i className="fa-solid fa-star"></i> Online Registry Searching</span>
          <span className="marquee-item"><i className="fa-solid fa-star"></i> Online Khatiyan</span>
          <span className="marquee-item"><i className="fa-solid fa-star"></i> Online Register 2 (Jamabandi)</span>
          <span className="marquee-item"><i className="fa-solid fa-star"></i> Jameen Rasid Karna</span>
          <span className="marquee-item"><i className="fa-solid fa-star"></i> Online Registry Chalan Apply</span>
          <span className="marquee-item"><i className="fa-solid fa-star"></i> PAN Card Printing</span>
          <span className="marquee-item"><i className="fa-solid fa-star"></i> Aadhaar Card Printing</span>
        </div>
      </div>

      {/* ============================================================
          SERVICES SECTION
      ============================================================ */}
      <section id="services">
        <div className="container">
          <div className="services-header reveal">
            <div className="pill-label">What We Offer</div>
            <h2 className="section-title">Our Services</h2>
            <p className="section-sub">Bihar Registry &amp; Land Record services + ID Card printing — all in one place at Ekma.</p>
          </div>

          {/* Category 1: Bihar Registry & Land Services */}
          <div className="cat-label reveal">
            <span className="cat-label-pill cat-blue">
              <i className="fa-solid fa-building-columns"></i>&nbsp; Bihar Registry &amp; Land Services
            </span>
            <div className="cat-line cat-line-blue"></div>
          </div>

          <div className="svc-grid-4">
            <div className="svc-card svc-blue reveal reveal-delay-1">
              <div className="svc-icon-wrap"><i className="fa-solid fa-file-signature"></i></div>
              <h3>Online Registry Apply</h3>
              <p>Bihar property registry application done online — fast, accurate and hassle-free process.</p>
              <span className="svc-tag">Registry Work</span>
            </div>

            <div className="svc-card svc-blue reveal reveal-delay-2">
              <div className="svc-icon-wrap"><i className="fa-solid fa-heart"></i></div>
              <h3>Marriage Registration Apply</h3>
              <p>Online marriage registration application under Bihar government portal with full assistance.</p>
              <span className="svc-tag">Registration</span>
            </div>

            <div className="svc-card svc-blue reveal reveal-delay-3">
              <div className="svc-icon-wrap"><i className="fa-solid fa-copy"></i></div>
              <h3>Online Nakal / Certified Copy</h3>
              <p>Get certified copy (Nakal) of property documents and registry records from Bihar portal.</p>
              <span className="svc-tag">Nakal Copy</span>
            </div>

            <div className="svc-card svc-blue reveal reveal-delay-4">
              <div className="svc-icon-wrap"><i className="fa-solid fa-magnifying-glass-location"></i></div>
              <h3>Online Registry Searching</h3>
              <p>Search and verify any property registration, deed or document in Bihar registry records.</p>
              <span className="svc-tag">Search Records</span>
            </div>

            <div className="svc-card svc-blue reveal reveal-delay-1">
              <div className="svc-icon-wrap"><i className="fa-solid fa-map"></i></div>
              <h3>Online Khatiyan</h3>
              <p>Get Khatiyan (Record of Rights) of your land from Bihar Bhumi portal instantly.</p>
              <span className="svc-tag">Land Record</span>
            </div>

            <div className="svc-card svc-blue reveal reveal-delay-2">
              <div className="svc-icon-wrap"><i className="fa-solid fa-book-open"></i></div>
              <h3>Online Register 2</h3>
              <p>Access and print Register-II (Jamabandi) details for your land holding in Bihar.</p>
              <span className="svc-tag">Jamabandi</span>
            </div>

            <div className="svc-card svc-blue reveal reveal-delay-3">
              <div className="svc-icon-wrap"><i className="fa-solid fa-receipt"></i></div>
              <h3>Jameen Rasid Karna</h3>
              <p>Land receipt (Rasid) generation for your plot or agricultural land through Bihar government portal.</p>
              <span className="svc-tag">Land Receipt</span>
            </div>

            <div className="svc-card svc-blue reveal reveal-delay-4">
              <div className="svc-icon-wrap"><i className="fa-solid fa-money-check-dollar"></i></div>
              <h3>Online Registry Chalan Apply</h3>
              <p>Generate and apply for registry challan (payment slip) for property registration online.</p>
              <span className="svc-tag">Chalan / Payment</span>
            </div>
          </div>

          {/* Category 2: ID Card Printing */}
          <div className="cat-label reveal" style={{ marginTop: '2.2rem' }}>
            <span className="cat-label-pill cat-orange">
              <i className="fa-solid fa-id-card"></i>&nbsp; ID Card Printing Services
            </span>
            <div className="cat-line cat-line-orange"></div>
          </div>

          <div className="svc-grid-2">
            <div className="svc-card svc-orange reveal reveal-delay-1">
              <div className="svc-icon-wrap"><i className="fa-solid fa-credit-card"></i></div>
              <h3>PAN Card Printing</h3>
              <p>Print your PAN card on the spot. Bring e-PAN PDF or Aadhaar for fast physical print.</p>
              <span className="svc-tag">Printing Only</span>
            </div>

            <div className="svc-card svc-orange reveal reveal-delay-2">
              <div className="svc-icon-wrap"><i className="fa-solid fa-fingerprint"></i></div>
              <h3>Aadhaar Card Printing</h3>
              <p>Print your Aadhaar card (regular or masked) from UIDAI — colour or black &amp; white.</p>
              <span className="svc-tag">Printing Only</span>
            </div>
          </div>

          {/* Note */}
          <div className="svc-note reveal">
            <i className="fa-solid fa-circle-info"></i>
            <p><strong>Note:</strong> We provide PAN Card &amp; Aadhaar Card <u>printing only</u>. New application and correction services are <u>not available</u> here.</p>
          </div>
        </div>
      </section>

      {/* ============================================================
          UPLOAD / SUBMIT DOCUMENT SECTION
      ============================================================ */}
      <section id="upload">
        <div className="container">
          <div className="upload-grid">
            {/* Left: Info */}
            <div className="upload-info reveal">
              <div
                className="pill-label"
                style={{
                  background: 'rgba(247,108,27,.18)',
                  color: '#ffc08a',
                  border: '1px solid rgba(247,108,27,.35)'
                }}
              >
                Send Your Document
              </div>
              <h2>Submit Your <span>Document</span><br />Directly to Us</h2>
              <p>Can't visit the shop right now? No problem! Upload your document here and we'll get in touch on WhatsApp to confirm your service request.</p>
              
              <div className="upload-steps">
                <div className="u-step">
                  <div className="u-step-num">1</div>
                  <div className="u-step-text">
                    <strong>Fill Your Details</strong>
                    <span>Enter your name, phone number and select service</span>
                  </div>
                </div>
                <div className="u-step">
                  <div className="u-step-num">2</div>
                  <div className="u-step-text">
                    <strong>Upload Document</strong>
                    <span>Attach a photo or PDF of your document</span>
                  </div>
                </div>
                <div className="u-step">
                  <div className="u-step-num">3</div>
                  <div className="u-step-text">
                    <strong>Get Confirmation</strong>
                    <span>We'll contact you on WhatsApp within minutes</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Form */}
            <div className="reveal reveal-delay-2">
              <div className="upload-form-card">
                <h3>
                  <i className="fa-solid fa-file-arrow-up" style={{ color: 'var(--orange)', marginRight: '.4rem' }}></i>
                  Submit Document
                </h3>

                {!isSubmitted ? (
                  <div id="formArea">
                    <div className="form-group">
                      <label htmlFor="userName">Full Name <span>*</span></label>
                      <input
                        type="text"
                        id="userName"
                        placeholder="Enter your full name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="userPhone">Phone / WhatsApp Number <span>*</span></label>
                      <input
                        type="tel"
                        id="userPhone"
                        placeholder="10-digit mobile number"
                        maxLength={10}
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="serviceSelect">Select Service <span>*</span></label>
                      <select
                        id="serviceSelect"
                        value={service}
                        onChange={(e) => setService(e.target.value)}
                        required
                      >
                        <option value="" disabled>-- Choose a service --</option>
                        <optgroup label="Bihar Registry &amp; Land Services">
                          <option value="Online Registry Apply">Online Registry Apply</option>
                          <option value="Marriage Registration Apply">Marriage Registration Apply</option>
                          <option value="Online Nakal / Certified Copy">Online Nakal / Certified Copy</option>
                          <option value="Online Registry Searching">Online Registry Searching</option>
                          <option value="Online Khatiyan">Online Khatiyan</option>
                          <option value="Online Register 2 (Jamabandi)">Online Register 2 (Jamabandi)</option>
                          <option value="Jameen Rasid Karna">Jameen Rasid Karna</option>
                          <option value="Online Registry Chalan Apply">Online Registry Chalan Apply</option>
                        </optgroup>
                        <optgroup label="ID Card Printing">
                          <option value="PAN Card Printing">PAN Card Printing</option>
                          <option value="Aadhaar Card Printing">Aadhaar Card Printing</option>
                        </optgroup>
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Upload Document (optional)</label>
                      <div
                        className="file-upload-area"
                        id="fileUploadArea"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <input
                          type="file"
                          id="docFile"
                          ref={fileInputRef}
                          accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                          onChange={handleFileChange}
                          style={{ display: 'none' }}
                        />
                        <i className="fa-solid fa-cloud-arrow-up"></i>
                        <p>Tap to upload or drag &amp; drop</p>
                        <p style={{ fontSize: '.73rem', color: '#8aabcf', marginTop: '.15rem' }}>
                          PDF, JPG, PNG, DOC up to 10MB
                        </p>
                        <div className="file-name-display" id="fileNameDisplay">
                          {fileName ? `✓ ${fileName}` : ''}
                        </div>
                      </div>
                    </div>

                    <button
                      className="btn-submit"
                      id="submitBtn"
                      disabled={isSubmitting}
                      onClick={handleFormSubmit}
                    >
                      {isSubmitting ? (
                        <>
                          <i className="fa-solid fa-spinner fa-spin"></i> Submitting…
                        </>
                      ) : (
                        <>
                          <i className="fa-solid fa-paper-plane"></i> Submit &amp; Send on WhatsApp
                        </>
                      )}
                    </button>
                  </div>
                ) : (
                  /* Success state */
                  <div className="form-success" id="formSuccess" style={{ display: 'block' }}>
                    <i className="fa-solid fa-circle-check"></i>
                    <h4>Submitted Successfully!</h4>
                    <p>Your request has been received. We'll contact you on WhatsApp shortly.</p>
                    <button
                      onClick={handleResetForm}
                      style={{
                        marginTop: '1rem',
                        background: 'var(--blue-mid)',
                        color: '#fff',
                        border: 'none',
                        padding: '.65rem 1.4rem',
                        borderRadius: '8px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        fontSize: '.9rem'
                      }}
                    >
                      Submit Another
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          ABOUT SECTION
      ============================================================ */}
      <section id="about">
        <div className="container">
          <div className="about-grid">
            {/* Left: Visual */}
            <div className="about-img-wrap reveal">
              <div className="about-visual">
                <div className="about-visual-icon"><i className="fa-solid fa-print"></i></div>
                <h3>Trusted Since Day One</h3>
                <p>We provide fast and trusted photocopy, document, and Bihar registry related services near Registry Office Ekma, serving the people of Saran district with dedication.</p>
                <div className="about-badges">
                  <span className="about-badge">Fast Service</span>
                  <span className="about-badge">Affordable Price</span>
                  <span className="about-badge">Expert Team</span>
                  <span className="about-badge">Trusted by 1000+</span>
                </div>
              </div>
              <div className="about-float-card">
                <i className="fa-solid fa-shield-halved"></i>
                <div>
                  <strong>100% Trusted</strong>
                  <span>Verified &amp; Reliable Shop</span>
                </div>
              </div>
            </div>

            {/* Right: Text */}
            <div className="about-text reveal reveal-delay-2">
              <div className="pill-label">About Us</div>
              <h2>Your Trusted <span>Document</span> Partner in Ekma</h2>
              <p>
                Ekta Communication is a leading document service center located near the Registry Office in Ekma, Saran, Bihar. We specialize in photocopy, printing, scanning, lamination, and all Bihar registry-related documentation work.
              </p>
              <p>
                Our team provides fast, accurate, and affordable services for individuals, businesses, and government document needs. Whether you need a photocopy or complete registry assistance — we've got you covered.
              </p>
              <div className="about-features">
                <div className="about-feat">
                  <i className="fa-solid fa-clock"></i>
                  Fast Turnaround – Documents ready in minutes
                </div>
                <div className="about-feat">
                  <i className="fa-solid fa-rupee-sign"></i>
                  Affordable Pricing – Best rates in Ekma
                </div>
                <div className="about-feat">
                  <i className="fa-solid fa-map-location-dot"></i>
                  Conveniently located near Registry Office
                </div>
                <div className="about-feat">
                  <i className="fa-brands fa-whatsapp"></i>
                  WhatsApp document submission available
                </div>
                <div className="about-feat">
                  <i className="fa-solid fa-user-tie"></i>
                  Experienced staff for all document types
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          WEBSITE & SOFTWARE DEVELOPMENT SERVICES (Directly above Get In Touch)
      ============================================================ */}
      <section id="software-services" style={{
        background: 'linear-gradient(135deg, #0a2463 0%, #17387a 100%)',
        color: '#ffffff',
        padding: '5rem 0',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Subtle decorative background glow */}
        <div style={{
          position: 'absolute',
          top: '-60px',
          right: '-60px',
          width: '260px',
          height: '260px',
          borderRadius: '50%',
          background: 'rgba(247,108,27,0.15)',
          filter: 'blur(50px)',
          pointerEvents: 'none'
        }}></div>

        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 3rem' }}>
            <div className="pill-label" style={{ background: 'rgba(255,255,255,0.15)', color: '#fed7aa' }}>
              <i className="fa-solid fa-code"></i> Tech &amp; Digital Solutions
            </div>
            <h2 className="section-title" style={{ color: '#ffffff', fontSize: 'clamp(1.8rem, 4vw, 2.4rem)' }}>
              हम <span style={{ color: 'var(--orange)' }}>Website Development</span> एवं <span style={{ color: '#38bdf8' }}>Software Development</span> की सेवा भी देते हैं
            </h2>
            <p style={{ color: '#cbd5e1', fontSize: '1.02rem', lineHeight: 1.7, marginTop: '0.8rem' }}>
              अपने बिज़नेस, स्कूल, दुकान या संस्थान को डिजिटल बनाएं। हम एकमा, सारण एवं पूरे बिहार में व्यापारियों और संस्थानों के लिए उच्च गुणवत्ता की वेबसाइट एवं कस्टमाइज्ड बिलिंग/मैनेजमेंट सॉफ्टवेयर तैयार करते हैं।
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1.4rem',
            marginBottom: '3rem'
          }}>
            {/* Service 1 */}
            <div style={{
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.16)',
              borderRadius: '16px',
              padding: '24px',
              backdropFilter: 'blur(8px)',
              transition: 'transform 0.25s',
              boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
            }}>
              <div style={{
                width: '52px',
                height: '52px',
                borderRadius: '12px',
                background: 'rgba(247,108,27,0.2)',
                color: 'var(--orange)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.4rem',
                marginBottom: '14px'
              }}>
                <i className="fa-solid fa-globe"></i>
              </div>
              <h3 style={{ fontFamily: 'var(--font-head)', fontSize: '1.25rem', color: '#fff', marginBottom: '8px' }}>
                Business Websites (वेबसाइट निर्माण)
              </h3>
              <p style={{ color: '#cbd5e1', fontSize: '0.88rem', lineHeight: 1.6 }}>
                दुकानों, कंपनियों, क्लीनिक, वकीलों एवं प्रोफेशनल्स के लिए मोबाइल-फ्रेंडली, सुपर-फास्ट और आधुनिक वेबसाइट्स।
              </p>
            </div>

            {/* Service 2 */}
            <div style={{
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.16)',
              borderRadius: '16px',
              padding: '24px',
              backdropFilter: 'blur(8px)',
              transition: 'transform 0.25s',
              boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
            }}>
              <div style={{
                width: '52px',
                height: '52px',
                borderRadius: '12px',
                background: 'rgba(56,189,248,0.2)',
                color: '#38bdf8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.4rem',
                marginBottom: '14px'
              }}>
                <i className="fa-solid fa-calculator"></i>
              </div>
              <h3 style={{ fontFamily: 'var(--font-head)', fontSize: '1.25rem', color: '#fff', marginBottom: '8px' }}>
                Billing &amp; GST Software (बिलिंग सॉफ्टवेयर)
              </h3>
              <p style={{ color: '#cbd5e1', fontSize: '0.88rem', lineHeight: 1.6 }}>
                किराना, थोक, मेडिकल, हार्डवेयर व गारमेंट दुकानों के लिए बारकोड, बिल प्रिंटिंग और आसान स्टॉक इन्वेंटरी सॉफ्टवेयर।
              </p>
            </div>

            {/* Service 3 */}
            <div style={{
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.16)',
              borderRadius: '16px',
              padding: '24px',
              backdropFilter: 'blur(8px)',
              transition: 'transform 0.25s',
              boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
            }}>
              <div style={{
                width: '52px',
                height: '52px',
                borderRadius: '12px',
                background: 'rgba(74,222,128,0.2)',
                color: '#4ade80',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.4rem',
                marginBottom: '14px'
              }}>
                <i className="fa-solid fa-school"></i>
              </div>
              <h3 style={{ fontFamily: 'var(--font-head)', fontSize: '1.25rem', color: '#fff', marginBottom: '8px' }}>
                School &amp; Coaching Portal (स्कूल पोर्टल)
              </h3>
              <p style={{ color: '#cbd5e1', fontSize: '0.88rem', lineHeight: 1.6 }}>
                छात्र उपस्थिति, फीस रसीद, आईडी कार्ड, एडमिट कार्ड व परिणाम तैयार करने हेतु सम्पूर्ण स्कूल/कोचिंग मैनेजमेंट सॉफ्टवेयर।
              </p>
            </div>

            {/* Service 4 */}
            <div style={{
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.16)',
              borderRadius: '16px',
              padding: '24px',
              backdropFilter: 'blur(8px)',
              transition: 'transform 0.25s',
              boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
            }}>
              <div style={{
                width: '52px',
                height: '52px',
                borderRadius: '12px',
                background: 'rgba(168,85,247,0.2)',
                color: '#c084fc',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.4rem',
                marginBottom: '14px'
              }}>
                <i className="fa-solid fa-laptop-code"></i>
              </div>
              <h3 style={{ fontFamily: 'var(--font-head)', fontSize: '1.25rem', color: '#fff', marginBottom: '8px' }}>
                Custom Software &amp; Apps (कस्टम ऐप्स)
              </h3>
              <p style={{ color: '#cbd5e1', fontSize: '0.88rem', lineHeight: 1.6 }}>
                आपकी दुकान, ऑफिस या संस्था की विशेष आवश्यकताओं के अनुकूल कस्टमाइज्ड वेब व डेस्कटॉप सॉफ्टवेयर सॉल्यूशन्स।
              </p>
            </div>
          </div>

          {/* CTA Box */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(247,108,27,0.18) 0%, rgba(58,123,213,0.2) 100%)',
            border: '1.5px solid rgba(247,108,27,0.4)',
            borderRadius: '16px',
            padding: '24px 30px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '18px'
          }}>
            <div>
              <h4 style={{ fontFamily: 'var(--font-head)', fontSize: '1.35rem', color: '#fff', margin: '0 0 4px' }}>
                वेबसाइट या सॉफ्टवेयर बनवाने के लिए संपर्क करें
              </h4>
              <p style={{ color: '#cbd5e1', fontSize: '0.9rem', margin: 0 }}>
                किफायती दाम, तेज़ डिलीवरी और निरंतर सपोर्ट — एकता कम्युनिकेशन, रजिस्ट्री ऑफिस के पास, एकमा (सारण)।
              </p>
            </div>

            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <a
                href="https://wa.me/919472460132?text=Hello%20Ekta%20Communication%2C%20I%20am%20interested%20in%20Website%20and%20Software%20Development%20service."
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  background: '#25d366',
                  color: '#ffffff',
                  padding: '12px 24px',
                  borderRadius: '10px',
                  fontWeight: 800,
                  fontSize: '0.95rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  textDecoration: 'none',
                  boxShadow: '0 4px 14px rgba(37,211,102,0.4)'
                }}
              >
                <i className="fa-brands fa-whatsapp" style={{ fontSize: '1.2rem' }}></i>
                WhatsApp पर बात करें
              </a>

              <a
                href="tel:+919472460132"
                style={{
                  background: 'rgba(255,255,255,0.16)',
                  color: '#ffffff',
                  border: '1px solid rgba(255,255,255,0.3)',
                  padding: '12px 20px',
                  borderRadius: '10px',
                  fontWeight: 700,
                  fontSize: '0.92rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  textDecoration: 'none'
                }}
              >
                <i className="fa-solid fa-phone"></i> +91 94724 60132
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          CONTACT SECTION
      ============================================================ */}
      <section id="contact">
        <div className="container">
          <div className="contact-header reveal">
            <div className="pill-label">Get In Touch</div>
            <h2 className="section-title">Contact Us</h2>
            <p className="section-sub">Visit us at the shop or send your documents directly on WhatsApp.</p>
          </div>
          <div className="contact-grid">
            {/* Info card */}
            <div className="contact-info-card reveal">
              <div className="contact-item">
                <div className="contact-item-icon"><i className="fa-solid fa-phone"></i></div>
                <div>
                  <strong>Phone / WhatsApp</strong>
                  <a href="tel:+919472460132">+91 94724 60132</a>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-item-icon"><i className="fa-solid fa-location-dot"></i></div>
                <div>
                  <strong>Address</strong>
                  <p>Near Registry Office, Ekma,<br />Saran, Bihar, India</p>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-item-icon"><i className="fa-solid fa-clock"></i></div>
                <div>
                  <strong>Working Hours</strong>
                  <p>Mon – Sat: 9:00 AM – 7:00 PM<br />Sunday: 10:00 AM – 4:00 PM</p>
                </div>
              </div>

              <a
                className="btn-wa-contact"
                href="https://wa.me/919472460132?text=Hello%20Ekta%20Communication%2C%20I%20want%20document%20service."
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fa-brands fa-whatsapp" style={{ fontSize: '1.2rem' }}></i>
                Chat on WhatsApp Now
              </a>
            </div>

            {/* Map */}
            <div className="map-card reveal reveal-delay-2">
              <iframe
                title="Ekma, Saran, Bihar – Google Map"
                src="https://maps.google.com/maps?q=Ekma+Registry+Office+Saran+Bihar&t=&z=15&ie=UTF8&iwloc=&output=embed"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          FOOTER
      ============================================================ */}
      <footer>
        <div className="container">
          <div className="footer-inner">
            <div className="footer-brand">
              <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="12" y="28" width="46" height="30" rx="6" fill="#3a7bd5" />
                <rect x="22" y="14" width="26" height="16" rx="3" fill="rgba(255,255,255,.2)" />
                <rect x="27" y="8" width="16" height="12" rx="2" fill="rgba(255,255,255,.8)" stroke="rgba(255,255,255,.4)" strokeWidth="1.5" />
                <rect x="24" y="50" width="22" height="16" rx="2" fill="rgba(255,255,255,.8)" stroke="rgba(255,255,255,.4)" strokeWidth="1.5" />
                <line x1="28" y1="56" x2="42" y2="56" stroke="#1b4fa8" strokeWidth="2" strokeLinecap="round" />
                <line x1="28" y1="60" x2="40" y2="60" stroke="#1b4fa8" strokeWidth="2" strokeLinecap="round" />
                <circle cx="50" cy="38" r="3" fill="rgba(255,255,255,.3)" />
                <rect x="42" y="6" width="22" height="17" rx="5" fill="#f76c1b" />
                <polygon points="48,23 44,28 54,23" fill="#f76c1b" />
                <circle cx="49" cy="14" r="2" fill="white" />
                <circle cx="55" cy="14" r="2" fill="white" />
                <circle cx="61" cy="14" r="2" fill="white" />
              </svg>
              <div className="footer-brand-text">
                <strong>EKTA COMMUNICATION</strong>
                <span>Ekma, Saran, Bihar</span>
              </div>
            </div>

            <nav className="footer-links">
              <a href="#services">Services</a>
              <a
                href="#tools"
                onClick={navigateToTools}
                style={{ color: 'var(--orange)', fontWeight: 700, cursor: 'pointer' }}
              >
                Tools
              </a>
              <a href="#upload">Upload Doc</a>
              <a href="#about">About</a>
              <a
                href="#software-services"
                onClick={(e) => {
                  const el = document.getElementById('software-services');
                  if (el) {
                    e.preventDefault();
                    el.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                style={{ color: '#0d9488', fontWeight: 600 }}
              >
                Web &amp; Software
              </a>
              <a href="#contact">Contact</a>
              <a
                href="#admin"
                onClick={navigateToAdmin}
                style={{ color: '#94a3b8', fontWeight: 700, cursor: 'pointer' }}
                title="Admin Portal"
              >
                Admin 🔐
              </a>
              <a
                href="https://wa.me/919472460132"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#25d366' }}
              >
                <i className="fa-brands fa-whatsapp"></i> WhatsApp
              </a>
            </nav>
          </div>

          <div className="footer-bottom">
            &copy; 2025 <span>Ekta Communication</span>. All rights reserved. &nbsp;|&nbsp;
            Near Registry Office, Ekma, Saran, Bihar &nbsp;|&nbsp;
            <a href="tel:+919472460132" style={{ color: 'var(--orange)' }}>+91 94724 60132</a>
          </div>
        </div>
      </footer>

      {/* ============================================================
          FLOATING WHATSAPP BUTTON
      ============================================================ */}
      <a
        className="float-wa"
        href="https://wa.me/919472460132?text=Hello%20Ekta%20Communication%2C%20I%20want%20document%20service."
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
      >
        <i className="fa-brands fa-whatsapp"></i>
        <span className="float-wa-tooltip">Chat on WhatsApp</span>
      </a>
    </div>
  );
}
