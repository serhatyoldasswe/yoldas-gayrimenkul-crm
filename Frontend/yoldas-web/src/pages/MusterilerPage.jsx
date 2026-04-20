import { useEffect, useState } from 'react';
import { musteriApi } from '../api/musteriApi';

const BRAND = '#E8570A';
const STATUS_COLOR = { Sicak: '#dc2626', Orta: '#d97706', Soguk: '#6b7280' };

const MERSIN_ILCELERI = [
  'Akdeniz','Mezitli','Toroslar','Yenişehir',
  'Tarsus','Erdemli','Silifke','Mut',
  'Anamur','Aydıncık','Bozyazı','Çamlıyayla','Gülnar'
];

const BOSLUK = {
  adSoyad: '', telefon: '', email: '',
  musteriTipi: 'Alici', durum: 'Orta',
  butce: '', ilgiAlani: 'Daire',
  tercihIlce: '', notlar: ''
};

export default function MusterilerPage() {
  const [musteriler, setMusteriler] = useState([]);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [modal, setModal] = useState(false);
  const [duzenle, setDuzenle] = useState(null);
  const [form, setForm] = useState(BOSLUK);
  const [arama, setArama] = useState('');
  const [filterDurum, setFilterDurum] = useState('');
  const [filterTip, setFilterTip] = useState('');
  const [kayit, setKayit] = useState(false);

  const yukle = async () => {
    try {
      const params = {};
      if (arama) params.arama = arama;
      if (filterDurum) params.durum = filterDurum;
      if (filterTip) params.tip = filterTip;
      const res = await musteriApi.getAll(params);
      setMusteriler(res.data);
    } catch {}
    setYukleniyor(false);
  };

  useEffect(() => { yukle(); }, [arama, filterDurum, filterTip]);

  const initials = s =>
    s?.trim().split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || '??';

  const aciModal = (m = null) => {
    setDuzenle(m);
    setForm(m ? {
      adSoyad: m.adSoyad,
      telefon: m.telefon,
      email: m.email || '',
      musteriTipi: m.musteriTipi,
      durum: m.durum,
      butce: m.butce || '',
      ilgiAlani: m.ilgiAlani || 'Daire',
      tercihIlce: m.tercihIlce || '',
      notlar: m.notlar || ''
    } : BOSLUK);
    setModal(true);
  };

  const kaydet = async (e) => {
    e.preventDefault();
    setKayit(true);
    try {
      if (duzenle) await musteriApi.update(duzenle.id, form);
      else await musteriApi.create(form);
      setModal(false);
      yukle();
    } catch (err) {
      alert('Hata: ' + (err.response?.data?.message || err.message));
    }
    setKayit(false);
  };

  const sil = async (id) => {
    if (!confirm('Bu müşteriyi silmek istiyor musunuz?')) return;
    await musteriApi.delete(id);
    yukle();
  };

  return (
    <div style={{ fontFamily: 'system-ui,sans-serif' }}>

      {/* Filtreler */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          placeholder="Müşteri ara..."
          value={arama}
          onChange={e => setArama(e.target.value)}
          style={styles.input}
        />
        <select value={filterTip} onChange={e => setFilterTip(e.target.value)} style={styles.select}>
          <option value="">Tüm Tipler</option>
          <option value="Alici">Alıcı</option>
          <option value="Satici">Satıcı</option>
          <option value="Kiraci">Kiracı</option>
          <option value="Yatirimci">Yatırımcı</option>
        </select>
        <select value={filterDurum} onChange={e => setFilterDurum(e.target.value)} style={styles.select}>
          <option value="">Tüm Durumlar</option>
          <option value="Sicak">Sıcak</option>
          <option value="Orta">Orta</option>
          <option value="Soguk">Soğuk</option>
        </select>
        <div style={{ flex: 1 }} />
        <button onClick={() => aciModal()} style={styles.btnPrimary}>+ Yeni Müşteri</button>
      </div>

      {/* Müşteri Kartları */}
      {yukleniyor ? (
        <div style={styles.empty}>Yükleniyor...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 12 }}>
          {musteriler.length === 0 ? (
            <div style={styles.empty}>Henüz müşteri yok.</div>
          ) : musteriler.map(m => (
            <div key={m.id} style={styles.card}>
              {/* Kart Başlık */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 20,
                    background: `${BRAND}20`, color: BRAND,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 600, fontSize: 13
                  }}>
                    {initials(m.adSoyad)}
                  </div>
                  <div>
                    <div style={{ fontWeight: 500, fontSize: 14 }}>{m.adSoyad}</div>
                    <div style={{ fontSize: 11, color: '#9ca3af' }}>{m.musteriTipi}</div>
                  </div>
                </div>
                <span style={{
                  background: `${STATUS_COLOR[m.durum] || '#888'}18`,
                  color: STATUS_COLOR[m.durum] || '#888',
                  padding: '3px 9px', borderRadius: 20, fontSize: 11, fontWeight: 500
                }}>
                  {m.durum}
                </span>
              </div>

              {/* Kart Detaylar */}
              <div style={{ fontSize: 12, color: '#6b7280', display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 10 }}>
                <span>📞 {m.telefon}</span>
                {m.email && <span>✉️ {m.email}</span>}
                <span>🏠 {m.ilgiAlani}{m.tercihIlce ? ' · ' + m.tercihIlce : ''}</span>
                {m.butce && <span style={{ color: BRAND, fontWeight: 500 }}>💰 {m.butce} ₺</span>}
              </div>

              {/* Notlar */}
              {m.notlar && (
                <div style={{
                  fontSize: 11, color: '#6b7280', background: '#f9f8f6',
                  padding: '7px 9px', borderRadius: 6, lineHeight: 1.5, marginBottom: 10
                }}>
                  {m.notlar.slice(0, 100)}{m.notlar.length > 100 ? '...' : ''}
                </div>
              )}

              {/* Butonlar */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 6 }}>
                <button onClick={() => aciModal(m)} style={styles.btnIcon}>✏️</button>
                <button onClick={() => sil(m.id)} style={styles.btnIcon}>🗑️</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modal && (
        <div style={styles.overlay} onClick={e => e.target === e.currentTarget && setModal(false)}>
          <div style={styles.modal}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ margin: 0, fontSize: 16, fontWeight: 500 }}>
                {duzenle ? 'Müşteriyi Düzenle' : 'Yeni Müşteri'}
              </h2>
              <button onClick={() => setModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18 }}>✕</button>
            </div>

            <form onSubmit={kaydet}>
              <div style={styles.formGrid}>

                {/* Ad Soyad */}
                <div style={{ gridColumn: '1/-1' }}>
                  <label style={styles.label}>Ad Soyad *</label>
                  <input
                    required
                    value={form.adSoyad}
                    onChange={e => setForm({ ...form, adSoyad: e.target.value })}
                    style={styles.formInput}
                    placeholder="Ad Soyad"
                  />
                </div>

                {/* Telefon */}
                <div>
                  <label style={styles.label}>Telefon *</label>
                  <input
                    required
                    value={form.telefon}
                    onChange={e => setForm({ ...form, telefon: e.target.value })}
                    style={styles.formInput}
                    placeholder="0532 000 0000"
                  />
                </div>

                {/* Email */}
                <div>
                  <label style={styles.label}>Email</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    style={styles.formInput}
                    placeholder="ornek@email.com"
                  />
                </div>

                {/* Müşteri Tipi */}
                <div>
                  <label style={styles.label}>Müşteri Tipi</label>
                  <select value={form.musteriTipi} onChange={e => setForm({ ...form, musteriTipi: e.target.value })} style={styles.formInput}>
                    <option value="Alici">Alıcı</option>
                    <option value="Satici">Satıcı</option>
                    <option value="Kiraci">Kiracı</option>
                    <option value="Yatirimci">Yatırımcı</option>
                  </select>
                </div>

                {/* Durum */}
                <div>
                  <label style={styles.label}>Durum</label>
                  <select value={form.durum} onChange={e => setForm({ ...form, durum: e.target.value })} style={styles.formInput}>
                    <option value="Sicak">Sıcak</option>
                    <option value="Orta">Orta</option>
                    <option value="Soguk">Soğuk</option>
                  </select>
                </div>

                {/* İlgi Alanı */}
                <div>
                  <label style={styles.label}>İlgi Alanı</label>
                  <select value={form.ilgiAlani} onChange={e => setForm({ ...form, ilgiAlani: e.target.value })} style={styles.formInput}>
                    <option value="Daire">Daire</option>
                    <option value="Villa">Villa</option>
                    <option value="Ofis">Ofis</option>
                    <option value="Arsa">Arsa</option>
                    <option value="Dükkan">Dükkan</option>
                    <option value="Tümü">Tümü</option>
                  </select>
                </div>

                {/* Bütçe */}
                <div>
                  <label style={styles.label}>Bütçe</label>
                  <input
                    value={form.butce}
                    onChange={e => setForm({ ...form, butce: e.target.value })}
                    style={styles.formInput}
                    placeholder="Örn: 3M - 5M"
                  />
                </div>

                {/* Tercih İlçe — Mersin İlçeleri */}
                <div style={{ gridColumn: '1/-1' }}>
                  <label style={styles.label}>Tercih İlçe</label>
                  <select value={form.tercihIlce} onChange={e => setForm({ ...form, tercihIlce: e.target.value })} style={styles.formInput}>
                    <option value="">Seçin</option>
                    <option value="Tüm Mersin">Tüm Mersin</option>
                    {MERSIN_ILCELERI.map(il => (
                      <option key={il} value={il}>{il}</option>
                    ))}
                  </select>
                </div>

                {/* Notlar */}
                <div style={{ gridColumn: '1/-1' }}>
                  <label style={styles.label}>Notlar</label>
                  <textarea
                    value={form.notlar}
                    onChange={e => setForm({ ...form, notlar: e.target.value })}
                    style={{ ...styles.formInput, minHeight: 80, resize: 'vertical' }}
                    placeholder="Müşteri hakkında notlar..."
                  />
                </div>

              </div>

              {/* Form Butonları */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 18, paddingTop: 18, borderTop: '0.5px solid #eee' }}>
                <button type="button" onClick={() => setModal(false)} style={styles.btnSec}>İptal</button>
                <button type="submit" disabled={kayit} style={styles.btnPrimary}>
                  {kayit ? 'Kaydediliyor...' : duzenle ? 'Güncelle' : 'Ekle'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  input: {
    padding: '8px 12px', border: '0.5px solid #ddd',
    borderRadius: 8, fontSize: 13, outline: 'none', minWidth: 200
  },
  select: {
    padding: '8px 10px', border: '0.5px solid #ddd',
    borderRadius: 8, fontSize: 13, background: '#fff'
  },
  btnPrimary: {
    background: '#E8570A', color: '#fff', border: 'none',
    padding: '9px 16px', borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: 'pointer'
  },
  btnSec: {
    background: 'transparent', color: '#374151', border: '0.5px solid #ddd',
    padding: '9px 14px', borderRadius: 8, fontSize: 13, cursor: 'pointer'
  },
  btnIcon: {
    background: 'none', border: 'none', cursor: 'pointer',
    padding: '4px 6px', borderRadius: 6, fontSize: 14
  },
  card: {
    background: '#fff', border: '0.5px solid rgba(0,0,0,.08)',
    borderRadius: 10, padding: 15
  },
  empty: {
    textAlign: 'center', padding: 40, color: '#9ca3af', fontSize: 13
  },
  overlay: {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,.45)',
    zIndex: 1000, display: 'flex', alignItems: 'flex-start',
    justifyContent: 'center', overflowY: 'auto', padding: 20
  },
  modal: {
    background: '#fff', borderRadius: 14, padding: 24,
    width: '100%', maxWidth: 540, marginTop: 16
  },
  formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 },
  label: { display: 'block', fontSize: 11, color: '#6b7280', marginBottom: 5, fontWeight: 500 },
  formInput: {
    width: '100%', padding: '8px 11px', border: '0.5px solid #ddd',
    borderRadius: 8, fontSize: 13, boxSizing: 'border-box',
    outline: 'none', fontFamily: 'inherit'
  },
};