import { useEffect, useState } from 'react';
import { portfoyApi } from '../api/portfoyApi';
import { ilanApi } from '../api/ilanApi';

const BOSLUK = { ad: '', aciklama: '', renk: '#E8570A', ilanIdleri: [] };
const RENKLER = ['#E8570A','#2563eb','#16a34a','#7c3aed','#dc2626','#d97706'];
const fmt = n => new Intl.NumberFormat('tr-TR').format(n);

export default function PortfoylerPage() {
  const [portfoyler, setPortfoyler] = useState([]);
  const [ilanlar, setIlanlar] = useState([]);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [modal, setModal] = useState(false);
  const [duzenle, setDuzenle] = useState(null);
  const [form, setForm] = useState(BOSLUK);
  const [kayit, setKayit] = useState(false);

  const yukle = async () => {
    try {
      const [pRes, iRes] = await Promise.all([portfoyApi.getAll(), ilanApi.getAll()]);
      setPortfoyler(pRes.data);
      setIlanlar(iRes.data);
    } catch {}
    setYukleniyor(false);
  };

  useEffect(() => { yukle(); }, []);

  const aciModal = (p = null) => {
    setDuzenle(p);
    setForm(p ? { ad: p.ad, aciklama: p.aciklama || '', renk: p.renk, ilanIdleri: (p.ilanlar || []).map(i => i.id) } : BOSLUK);
    setModal(true);
  };

  const toggleIlan = (id) => {
    setForm(f => ({
      ...f, ilanIdleri: f.ilanIdleri.includes(id) ? f.ilanIdleri.filter(x => x !== id) : [...f.ilanIdleri, id]
    }));
  };

  const kaydet = async (e) => {
    e.preventDefault();
    setKayit(true);
    try {
      if (duzenle) await portfoyApi.update(duzenle.id, form);
      else await portfoyApi.create(form);
      setModal(false);
      yukle();
    } catch (err) {
      alert('Hata: ' + (err.response?.data?.message || err.message));
    }
    setKayit(false);
  };

  const sil = async (id) => {
    if (!confirm('Bu portföyü silmek istiyor musunuz?')) return;
    await portfoyApi.delete(id);
    yukle();
  };

  return (
    <div style={{ fontFamily: 'system-ui,sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
        <button onClick={() => aciModal()} style={styles.btnPrimary}>+ Yeni Portföy</button>
      </div>

      {yukleniyor ? <div style={styles.empty}>Yükleniyor...</div> : portfoyler.length === 0 ? (
        <div style={styles.empty}>Henüz portföy yok. İlanlarınızı gruplandırmak için portföy oluşturun.</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 14 }}>
          {portfoyler.map(p => {
            const pIlanlar = p.ilanlar || [];
            const toplam = pIlanlar.filter(i => i.ilanTuru === 'Satilik').reduce((s, i) => s + i.fiyat, 0);
            return (
              <div key={p.id} style={{ ...styles.card, borderTop: `3px solid ${p.renk}` }}>
                <div style={{ fontWeight: 500, fontSize: 14, marginBottom: 4 }}>{p.ad}</div>
                {p.aciklama && <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 12 }}>{p.aciklama}</div>}
                <div style={{ display: 'flex', gap: 20, marginBottom: 10 }}>
                  <div>
                    <div style={{ fontSize: 11, color: '#9ca3af' }}>İlan</div>
                    <div style={{ fontSize: 24, fontWeight: 500, color: p.renk }}>{pIlanlar.length}</div>
                  </div>
                  {toplam > 0 && (
                    <div>
                      <div style={{ fontSize: 11, color: '#9ca3af' }}>Toplam Değer</div>
                      <div style={{ fontSize: 18, fontWeight: 500 }}>₺{fmt(Math.round(toplam / 1000000))}M</div>
                    </div>
                  )}
                </div>
                {pIlanlar.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 10 }}>
                    {pIlanlar.slice(0, 4).map(i => (
                      <span key={i.id} style={{ fontSize: 10, background: '#f0ede8', color: '#6b7280', padding: '2px 8px', borderRadius: 10 }}>
                        {i.ilce}
                      </span>
                    ))}
                    {pIlanlar.length > 4 && <span style={{ fontSize: 10, color: '#9ca3af' }}>+{pIlanlar.length - 4}</span>}
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 6 }}>
                  <button onClick={() => aciModal(p)} style={styles.btnIcon}>✏️</button>
                  <button onClick={() => sil(p.id)} style={styles.btnIcon}>🗑️</button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {modal && (
        <div style={styles.overlay} onClick={e => e.target === e.currentTarget && setModal(false)}>
          <div style={styles.modal}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ margin: 0, fontSize: 16, fontWeight: 500 }}>{duzenle ? 'Portföyü Düzenle' : 'Yeni Portföy'}</h2>
              <button onClick={() => setModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18 }}>✕</button>
            </div>
            <form onSubmit={kaydet}>
              <div style={{ marginBottom: 14 }}>
                <label style={styles.label}>Portföy Adı *</label>
                <input required value={form.ad} onChange={e => setForm({ ...form, ad: e.target.value })} style={styles.formInput} placeholder="Örn: Karşıyaka Satılıklar" />
              </div>
              <div style={{ marginBottom: 14 }}>
                <label style={styles.label}>Açıklama</label>
                <input value={form.aciklama} onChange={e => setForm({ ...form, aciklama: e.target.value })} style={styles.formInput} />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={styles.label}>Renk</label>
                <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
                  {RENKLER.map(r => (
                    <div key={r} onClick={() => setForm({ ...form, renk: r })} style={{ width: 28, height: 28, borderRadius: 14, background: r, cursor: 'pointer', border: form.renk === r ? '3px solid #333' : '2px solid transparent', transition: '.1s' }} />
                  ))}
                </div>
              </div>
              <div style={{ marginBottom: 14 }}>
                <label style={styles.label}>İlanları Seç ({form.ilanIdleri.length} seçili)</label>
                <div style={{ maxHeight: 200, overflowY: 'auto', border: '0.5px solid #ddd', borderRadius: 8, padding: 8, display: 'flex', flexDirection: 'column', gap: 3 }}>
                  {ilanlar.map(i => (
                    <label key={i.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 7px', borderRadius: 6, cursor: 'pointer', background: form.ilanIdleri.includes(i.id) ? '#fff4ee' : 'transparent' }}>
                      <input type="checkbox" checked={form.ilanIdleri.includes(i.id)} onChange={() => toggleIlan(i.id)} style={{ accentColor: form.renk }} />
                      <span style={{ fontSize: 12, flex: 1 }}>{i.baslik}</span>
                      <span style={{ fontSize: 11, color: '#9ca3af' }}>₺{fmt(i.fiyat)}</span>
                    </label>
                  ))}
                  {ilanlar.length === 0 && <div style={{ fontSize: 12, color: '#9ca3af', padding: 8 }}>Önce ilan ekleyin</div>}
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, paddingTop: 18, borderTop: '0.5px solid #eee' }}>
                <button type="button" onClick={() => setModal(false)} style={styles.btnSec}>İptal</button>
                <button type="submit" disabled={kayit} style={styles.btnPrimary}>{kayit ? 'Kaydediliyor...' : 'Kaydet'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  btnPrimary: { background: '#E8570A', color: '#fff', border: 'none', padding: '9px 16px', borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: 'pointer' },
  btnSec: { background: 'transparent', color: '#374151', border: '0.5px solid #ddd', padding: '9px 14px', borderRadius: 8, fontSize: 13, cursor: 'pointer' },
  btnIcon: { background: 'none', border: 'none', cursor: 'pointer', padding: '4px 6px', borderRadius: 6, fontSize: 14 },
  card: { background: '#fff', border: '0.5px solid rgba(0,0,0,.08)', borderRadius: 10, padding: 16 },
  empty: { textAlign: 'center', padding: 40, color: '#9ca3af', fontSize: 13 },
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,.45)', zIndex: 1000, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', overflowY: 'auto', padding: 20 },
  modal: { background: '#fff', borderRadius: 14, padding: 24, width: '100%', maxWidth: 520, marginTop: 16 },
  label: { display: 'block', fontSize: 11, color: '#6b7280', marginBottom: 5, fontWeight: 500 },
  formInput: { width: '100%', padding: '8px 11px', border: '0.5px solid #ddd', borderRadius: 8, fontSize: 13, boxSizing: 'border-box', outline: 'none', fontFamily: 'inherit' },
};