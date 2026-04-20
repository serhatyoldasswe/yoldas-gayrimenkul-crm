import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', sifre: '' });
  const [hata, setHata] = useState('');
  const [yukleniyor, setYukleniyor] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setHata('');
    setYukleniyor(true);
    try {
      await login(form.email, form.sifre);
      navigate('/');
    } catch {
      setHata('Email veya şifre hatalı. Önce /api/auth/kayit ile kullanıcı oluştur.');
    } finally {
      setYukleniyor(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'system-ui,sans-serif' }}>
      <div style={{ background: '#fff', borderRadius: 16, padding: '40px 36px', width: '100%', maxWidth: 400 }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 32 }}>
          <div style={{ width: 52, height: 52, background: '#E8570A', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 20, letterSpacing: 1 }}>YOLDAŞ</div>
            <div style={{ color: '#E8570A', fontSize: 10, letterSpacing: 3, fontWeight: 500 }}>GAYRİMENKUL</div>
          </div>
        </div>

        <h2 style={{ fontSize: 20, fontWeight: 500, marginBottom: 24, marginTop: 0 }}>Giriş Yap</h2>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 12, color: '#6b7280', marginBottom: 6, fontWeight: 500 }}>Email</label>
            <input type="email" required value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              placeholder="email@yoldasgayrimenkul.com"
              style={{ width: '100%', padding: '10px 13px', border: '0.5px solid #ddd', borderRadius: 8, fontSize: 14, boxSizing: 'border-box', outline: 'none' }} />
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontSize: 12, color: '#6b7280', marginBottom: 6, fontWeight: 500 }}>Şifre</label>
            <input type="password" required value={form.sifre}
              onChange={e => setForm({ ...form, sifre: e.target.value })}
              placeholder="••••••••"
              style={{ width: '100%', padding: '10px 13px', border: '0.5px solid #ddd', borderRadius: 8, fontSize: 14, boxSizing: 'border-box', outline: 'none' }} />
          </div>
          {hata && (
            <div style={{ background: '#fef2f2', color: '#dc2626', padding: '10px 13px', borderRadius: 8, fontSize: 13, marginBottom: 16 }}>
              {hata}
            </div>
          )}
          <button type="submit" disabled={yukleniyor} style={{
            width: '100%', background: '#E8570A', color: '#fff', border: 'none',
            padding: 12, borderRadius: 8, fontSize: 14, fontWeight: 500, cursor: 'pointer'
          }}>
            {yukleniyor ? 'Giriş yapılıyor...' : 'Giriş Yap'}
          </button>
        </form>
        <p style={{ fontSize: 12, color: '#9ca3af', marginTop: 20, textAlign: 'center' }}>
          İlk kullanımda önce Swagger'dan kayıt ol
        </p>
      </div>
    </div>
  );
}