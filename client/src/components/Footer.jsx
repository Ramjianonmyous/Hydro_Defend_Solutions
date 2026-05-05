import { useState, useRef } from 'react';
import useScrollReveal from './useScrollReveal';
import emailjs from '@emailjs/browser';

const SERVICE_ID = 'service_jul90m6';
const TEMPLATE_ID = 'template_vq2ttg9';
const PUBLIC_KEY = '077Ao5SU2hbPAQhjU';

const SERVICES_LIST = [
  'Fire Safety Audit', 'Hazard Risk Assessment', 'Fire NOC Consultancy',
  'Fire Suppression Design Review', 'Emergency Evacuation Planning',
  'Industrial Safety Compliance', 'Fire Safety Training', 'Other',
];

const FACILITY_TYPES = [
  'Industrial / Manufacturing', 'Healthcare / Hospital', 'Commercial / IT Park',
  'Educational Institution', 'Warehouse / Logistics', 'Hospitality / Hotel',
  'Residential Complex', 'Food Processing', 'Other',
];

// ── UPDATE THESE WITH YOUR ACTUAL LINKS ──
const SOCIALS = [
  {
    label: 'Portfolio',
    href: 'https://ramjianonmyous.github.io/My_Portfolio/',   // ← replace with your portfolio URL
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>
        <path d="M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20"/>
      </svg>
    ),
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/ram-kaithwas-329419257/',  // ← replace
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
        <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/>
      </svg>
    ),
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/ram_ji_madboy',   // ← replace
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
      </svg>
    ),
  },
  {
    label: 'WhatsApp',
    href: 'https://wa.me/7972148516/',   // ← replace with your number
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
    ),
  },
  {
    label: 'Email',
    href: 'mailto:contact@hydrodefend.in',   // ← replace
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
      </svg>
    ),
  },
];

const inputStyle = {
  width: '100%', background: 'var(--bg2)', border: '1px solid var(--border2)',
  borderRadius: 8, padding: '12px 14px', color: 'var(--text)',
  fontFamily: 'var(--font-body)', fontSize: 14, outline: 'none',
  transition: 'border-color 0.2s',
};

export default function Footer() {
  const brandRef = useScrollReveal();
  const formRef = useScrollReveal();
  const socialsRef = useRef(null);   // ref for scroll-to-socials

  const [form, setForm] = useState({ fullName: '', phone: '', email: '', service: '', facilityType: '', message: '' });
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [errMsg, setErrMsg] = useState('');

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleFocus = e => { e.target.style.borderColor = 'var(--accent)'; };
  const handleBlur  = e => { e.target.style.borderColor = 'var(--border2)'; };

  const handleSubmit = async () => {
    if (!form.fullName || !form.phone || !form.email || !form.service || !form.facilityType || !form.message) {
      setErrMsg('Please fill in all fields.');
      return;
    }
    setErrMsg('');
    setStatus('loading');

    const templateParams = {
      from_name: form.fullName,
      from_email: form.email,
      phone: form.phone,
      service: form.service,
      facility_type: form.facilityType,
      message: `Phone: ${form.phone}\nService: ${form.service}\nFacility Type: ${form.facilityType}\n\nMessage: ${form.message}`,
    };

    try {
      await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY);
      setStatus('success');
      setForm({ fullName: '', phone: '', email: '', service: '', facilityType: '', message: '' });
    } catch (err) {
      setStatus('error');
      setErrMsg('Failed to send message. Please try again later.');
      console.error('EmailJS Error:', err);
    }
  };


  // Scroll to socials section
  const scrollToSocials = e => {
    e.preventDefault();
    socialsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <footer id="contact" style={{ background: 'var(--bg)', borderTop: '1px solid var(--border)', padding: '100px 6% 0' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 80, paddingBottom: 64, borderBottom: '1px solid var(--border)' }} className="footer-top">

        {/* Brand + Socials */}
        <div ref={brandRef}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <div style={{ width: 34, height: 34, background: 'var(--accent)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#fff">
                <path d="M12 2C8.5 6 6 9 6 13c0 3.31 2.69 6 6 6s6-2.69 6-6c0-4-2.5-7-6-11zm0 15c-2.21 0-4-1.79-4-4 0-2 1.5-4.5 4-7 2.5 2.5 4 5 4 7 0 2.21-1.79 4-4 4z"/>
              </svg>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: 17, color: 'var(--text)' }}>HydroDefendSolution</div>
              <div style={{ fontSize: 10, color: 'var(--text2)', letterSpacing: '0.5px' }}>Fire Safety & Hazard Management</div>
            </div>
          </div>

          <h2 style={{ fontFamily: 'var(--font-head)', fontSize: 32, fontWeight: 800, letterSpacing: '-0.5px', marginBottom: 12, lineHeight: 1.1 }}>
            Let's Work Together
          </h2>
          <p style={{ fontSize: 14.5, color: 'var(--text2)', lineHeight: 1.7, maxWidth: 320, marginBottom: 32 }}>
            Have a project, audit request, or compliance question? Reach out and our team will respond within 24 hours.
          </p>

          {/* Scroll-to-socials shortcut */}
          <a href="#socials" onClick={scrollToSocials} style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            fontSize: 13, color: 'var(--accent2)', fontWeight: 500,
            textDecoration: 'none', marginBottom: 24,
            borderBottom: '1px dashed rgba(255,122,69,0.4)', paddingBottom: 2,
          }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 17l10-10M7 7h10v10"/></svg>
            View my socials & portfolio
          </a>

          {/* Socials */}
          <div id="socials" ref={socialsRef} style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {SOCIALS.map(({ label, href, icon }) => (
              <a key={label} href={href} target={href.startsWith('mailto') ? '_self' : '_blank'} rel="noopener noreferrer"
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '9px 16px', border: '1px solid var(--border2)',
                  borderRadius: 8, textDecoration: 'none', color: 'var(--text2)',
                  fontSize: 13, fontWeight: 500, transition: 'all 0.2s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'var(--accent)';
                  e.currentTarget.style.color = 'var(--text)';
                  e.currentTarget.style.background = 'var(--accent-glow)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'var(--border2)';
                  e.currentTarget.style.color = 'var(--text2)';
                  e.currentTarget.style.background = 'none';
                }}
              >
                {icon}{label}
              </a>
            ))}
          </div>
        </div>

        {/* Contact Form */}
        <div ref={formRef}>
          <h3 style={{ fontFamily: 'var(--font-head)', fontSize: 22, fontWeight: 700, marginBottom: 24, color: 'var(--text)' }}>
            Send Us a Message
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
            <FormField label="Full Name">
              <input style={inputStyle} placeholder="Your full name" value={form.fullName}
                onChange={set('fullName')} onFocus={handleFocus} onBlur={handleBlur} />
            </FormField>
            <FormField label="Phone Number">
              <input style={inputStyle} placeholder="+91 XXXXX XXXXX" value={form.phone}
                onChange={set('phone')} onFocus={handleFocus} onBlur={handleBlur} />
            </FormField>
          </div>

          <FormField label="Email Address" mb={14}>
            <input style={inputStyle} type="email" placeholder="your@email.com" value={form.email}
              onChange={set('email')} onFocus={handleFocus} onBlur={handleBlur} />
          </FormField>

          <FormField label="Service Required" mb={14}>
            <select style={{ ...inputStyle, appearance: 'none', cursor: 'pointer' }} value={form.service}
              onChange={set('service')} onFocus={handleFocus} onBlur={handleBlur}>
              <option value="">Select a service...</option>
              {SERVICES_LIST.map(s => <option key={s}>{s}</option>)}
            </select>
          </FormField>

          <FormField label="Facility Type" mb={14}>
            <select style={{ ...inputStyle, appearance: 'none', cursor: 'pointer' }} value={form.facilityType}
              onChange={set('facilityType')} onFocus={handleFocus} onBlur={handleBlur}>
              <option value="">Select facility type...</option>
              {FACILITY_TYPES.map(f => <option key={f}>{f}</option>)}
            </select>
          </FormField>

          <FormField label="Message" mb={6}>
            <textarea style={{ ...inputStyle, resize: 'vertical' }} rows={4}
              placeholder="Tell us about your facility and requirements..."
              value={form.message} onChange={set('message')} onFocus={handleFocus} onBlur={handleBlur} />
          </FormField>

          {errMsg && (
            <div style={{ fontSize: 13, color: '#ff6b6b', marginBottom: 10, padding: '8px 12px', background: 'rgba(255,107,107,0.08)', borderRadius: 6, border: '1px solid rgba(255,107,107,0.2)' }}>
              {errMsg}
            </div>
          )}

          {status === 'success' && (
            <div style={{ fontSize: 13.5, color: '#4caf82', marginBottom: 10, padding: '10px 14px', background: 'rgba(76,175,130,0.08)', borderRadius: 6, border: '1px solid rgba(76,175,130,0.25)' }}>
              ✓ Message sent! We'll get back to you within 24 hours.
            </div>
          )}

          <button onClick={handleSubmit} disabled={status === 'loading'} style={{
            width: '100%', padding: 14,
            background: status === 'loading' ? '#8a3a1c' : 'var(--accent)',
            color: '#fff', fontFamily: 'var(--font-body)', fontSize: 15,
            fontWeight: 600, border: 'none', borderRadius: 8, cursor: status === 'loading' ? 'not-allowed' : 'pointer',
            transition: 'background 0.2s, transform 0.15s', letterSpacing: '0.3px',
          }}
          onMouseEnter={e => { if (status !== 'loading') { e.currentTarget.style.background = 'var(--accent2)'; e.currentTarget.style.transform = 'translateY(-1px)'; } }}
          onMouseLeave={e => { e.currentTarget.style.background = status === 'loading' ? '#8a3a1c' : 'var(--accent)'; e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            {status === 'loading' ? 'Sending...' : 'Send Message →'}
          </button>
        </div>
      </div>

      {/* Footer bottom */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '32px 0 40px', flexWrap: 'wrap', gap: 16 }}>
        <p style={{ fontSize: 13, color: 'var(--text2)' }}>© 2025 HydroDefendSolution. All rights reserved.</p>
        <div style={{ display: 'flex', gap: 24 }}>
          {['Features', 'Services', 'Impacts', 'Team', 'FAQ'].map(label => (
            <a key={label} href={`#${label.toLowerCase()}`}
              onClick={e => { e.preventDefault(); document.querySelector(`#${label.toLowerCase()}`)?.scrollIntoView({ behavior: 'smooth' }); }}
              style={{ fontSize: 13, color: 'var(--text2)', textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={e => e.target.style.color = 'var(--text)'}
              onMouseLeave={e => e.target.style.color = 'var(--text2)'}
            >
              {label}
            </a>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) { .footer-top { grid-template-columns: 1fr !important; gap: 48px !important; } }
      `}</style>
    </footer>
  );
}

function FormField({ label, children, mb = 0 }) {
  return (
    <div style={{ marginBottom: mb }}>
      <label style={{ display: 'block', fontSize: 12, color: 'var(--text2)', marginBottom: 6, letterSpacing: '0.5px', fontWeight: 500 }}>{label}</label>
      {children}
    </div>
  );
}
