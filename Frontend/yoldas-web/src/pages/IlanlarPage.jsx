import { useEffect, useState } from 'react';
import { ilanApi } from '../api/ilanApi';

const BRAND = '#E8570A';
const fmt = n => new Intl.NumberFormat('tr-TR').format(n);
const STATUS_COLOR = { Aktif: '#16a34a', Satildi: '#2563eb', Kiralik: '#7c3aed', Opsiyon: '#d97706', Pasif: '#9ca3af' };
const ILCELER = [
  'Akdeniz','Mezitli','Toroslar','Yenişehir',
  'Tarsus','Erdemli','Silifke','Mut',
  'Anamur','Aydıncık','Bozyazı','Çamlıyayla','Gülnar'
];

const BOSLUK = { baslik:'', ilanTuru:'Satilik', kategori:'Daire', fiyat:'', alan:'', odaSayisi:'3+1', ilce:'', adres:'', aciklama:'', durum:'Aktif', malSahibiAd:'', malSahibiTel:'' };

export default function IlanlarPage() {
  const [ilanlar, setIlanlar] = useState([]);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [modal, setModal] = useState(false);
  const [duzenle, setDuzenle] = useState(null);
  const [form, setForm] = useState(BOSLUK);
  const [arama, setArama] = useState('');
  const [filterTur, setFilterTur] = useState('');
  const [filterDurum, setFilterDurum] = useState('');
  const [kayit, setKayit] = useState(false);

  const yukle = async () => {
    try {
      const params = {};
      if (arama) params.arama = arama;
      if (filterTur) params.ilanTuru = filterTur;
      if (filterDurum) params.durum = filterDurum;
      const res = await ilanApi.getAll(params);
      setIlanlar(res.data);
    } catch {}
    setYukleniyor(false);
  };

  useEffect(() => { yukle(); }, [arama, filterTur, filterDurum]);

  const aciModal = (ilan = null) => {
    setDuzenle(ilan);
    setForm(ilan ? {
      baslik: ilan.baslik, ilanTuru: ilan.ilanTuru, kategori: ilan.kategori,
      fiyat: ilan.fiyat, alan: ilan.alan || '', odaSayisi: ilan.odaSayisi || '3+1',
      ilce: ilan.ilce, adres: ilan.adres || '', aciklama: ilan.aciklama || '',
      durum: ilan.durum, malSahibiAd: ilan.malSahibiAd || '', malSahibiTel: ilan.malSahibiTel || ''
    } : BOSLUK);
    setModal(true);
  };

  const kaydet = async (e) => {
    e.preventDefault();
    setKayit(true);
    try {
      const payload = { ...form, fiyat: Number(form.fiyat), alan: Number(form.alan) || null };
      if (duzenle) await ilanApi.update(duzenle.id, payload);
      else await ilanApi.create(payload);
      setModal(false);
      yukle();
    } catch (err) {
      alert('Hata: ' + (err.response?.data?.message || err.message));
    }
    setKayit(false);
  };

  const sil = async (id) => {
    if (!confirm('Bu ilanı silmek istediğinize emin misiniz?')) return;
    await ilanApi.delete(id);
    yukle();
  };

  return (
    <div style={{ fontFamily: 'system-ui,sans-serif' }}>
      {/* Başlık + Filtreler */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
        <input placeholder="İlan ara..." value={arama} onChange={e => setArama(e.target.value)}
          style={styles.input} />
        <select value={filterTur} onChange={e => setFilterTur(e.target.value)} style={styles.select}>
          <option value="">Tüm Türler</option>
          <option value="Satilik">Satılık</option>
          <option value="Kiralik">Kiralık</option>
        </select>
        <select value={filterDurum} onChange={e => setFilterDurum(e.target.value)} style={styles.select}>
          <option value="">Tüm Durumlar</option>
          <option value="Aktif">Aktif</option>
          <option value="Opsiyon">Opsiyon</option>
          <option value="Satildi">Satıldı</option>
          <option value="Kiralik">Kiralık</option>
          <option value="Pasif">Pasif</option>
        </select>
        <div style={{ flex: 1 }} />
        <button onClick={() => aciModal()} style={styles.btnPrimary}>+ Yeni İlan</button>
      </div>

      {/* Tablo */}
      {yukleniyor ? <div style={styles.empty}>Yükleniyor...</div> : (
        <div style={{ background: '#fff', borderRadius: 12, border: '0.5px solid rgba(0,0,0,.08)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f9f8f6' }}>
                {['İlan Başlığı','Tür','İlçe','Fiyat','Durum',''].map(h => (
                  <th key={h} style={styles.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ilanlar.length === 0 ? (
                <tr><td colSpan={6} style={styles.empty}>Henüz ilan yok. Yeni İlan ekleyin.</td></tr>
              ) : ilanlar.map(i => (
                <tr key={i.id} style={{ borderBottom: '0.5px solid #f3f3f0' }}>
                  <td style={styles.td}>
                    <div style={{ fontWeight: 500 }}>{i.baslik}</div>
                    <div style={{ fontSize: 11, color: '#9ca3af' }}>{i.malSahibiAd} · {i.alan}m²{i.odaSayisi && i.odaSayisi !== '-' ? ' · ' + i.odaSayisi : ''}</div>
                  </td>
                  <td style={styles.td}>{i.ilanTuru}</td>
                  <td style={styles.td}>{i.ilce}</td>
                  <td style={{ ...styles.td, fontWeight: 500, color: BRAND }}>
                    ₺{fmt(i.fiyat)}{i.ilanTuru === 'Kiralik' ? '/ay' : ''}
                  </td>
                  <td style={styles.td}>
                    <span style={{ background: `${STATUS_COLOR[i.durum] || '#888'}18`, color: STATUS_COLOR[i.durum] || '#888', padding: '3px 9px', borderRadius: 20, fontSize: 11, fontWeight: 500 }}>
                      {i.durum}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button onClick={() => aciModal(i)} style={styles.btnIcon}>✏️</button>
                      <button onClick={() => sil(i.id)} style={styles.btnIcon}>🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {modal && (
        <div style={styles.overlay} onClick={e => e.target === e.currentTarget && setModal(false)}>
          <div style={styles.modal}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ margin: 0, fontSize: 16, fontWeight: 500 }}>{duzenle ? 'İlanı Düzenle' : 'Yeni İlan Ekle'}</h2>
              <button onClick={() => setModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18 }}>✕</button>
            </div>
            <form onSubmit={kaydet}>
              <div style={styles.formGrid}>
                <div style={{ gridColumn: '1/-1' }}>
                  <label style={styles.label}>Başlık *</label>
                  <input required value={form.baslik} onChange={e => setForm({ ...form, baslik: e.target.value })} style={styles.formInput} placeholder="Örn: Karşıyaka 3+1 Deniz Manzaralı Daire" />
                </div>
                <div>
                  <label style={styles.label}>İlan Türü</label>
                  <select value={form.ilanTuru} onChange={e => setForm({ ...form, ilanTuru: e.target.value })} style={styles.formInput}>
                    <option value="Satilik">Satılık</option>
                    <option value="Kiralik">Kiralık</option>
                  </select>
                </div>
                <div>
                  <label style={styles.label}>Kategori</label>
                  <select value={form.kategori} onChange={e => setForm({ ...form, kategori: e.target.value })} style={styles.formInput}>
                    {['Daire','Villa','Ofis','Arsa','Dükkan','Bina'].map(k => <option key={k}>{k}</option>)}
                  </select>
                </div>
                <div>
                  <label style={styles.label}>Fiyat (₺) *</label>
                  <input required type="number" value={form.fiyat} onChange={e => setForm({ ...form, fiyat: e.target.value })} style={styles.formInput} placeholder="0" />
                </div>
                <div>
                  <label style={styles.label}>Alan (m²)</label>
                  <input type="number" value={form.alan} onChange={e => setForm({ ...form, alan: e.target.value })} style={styles.formInput} placeholder="0" />
                </div>
                <div>
                  <label style={styles.label}>Oda Sayısı</label>
                  <select value={form.odaSayisi} onChange={e => setForm({ ...form, odaSayisi: e.target.value })} style={styles.formInput}>
                    {['1+0','1+1','2+1','3+1','4+1','5+1','5+2','-'].map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
                <div>
                  <label style={styles.label}>İlçe *</label>
                  <select required value={form.ilce} onChange={e => setForm({ ...form, ilce: e.target.value })} style={styles.formInput}>
                    <option value="">Seçin</option>
                    {ILCELER.map(il => <option key={il}>{il}</option>)}
                  </select>
                </div>
                <div>
                  <label style={styles.label}>Durum</label>
                  <select value={form.durum} onChange={e => setForm({ ...form, durum: e.target.value })} style={styles.formInput}>
                    {['Aktif','Opsiyon','Satildi','Kiralik','Pasif'].map(d => <option key={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label style={styles.label}>Mal Sahibi</label>
                  <input value={form.malSahibiAd} onChange={e => setForm({ ...form, malSahibiAd: e.target.value })} style={styles.formInput} placeholder="Ad Soyad" />
                </div>
                <div>
                  <label style={styles.label}>Mal Sahibi Tel</label>
                  <input value={form.malSahibiTel} onChange={e => setForm({ ...form, malSahibiTel: e.target.value })} style={styles.formInput} placeholder="0532 000 0000" />
                </div>
                <div style={{ gridColumn: '1/-1' }}>
                  <label style={styles.label}>Açıklama</label>
                  <textarea value={form.aciklama} onChange={e => setForm({ ...form, aciklama: e.target.value })} style={{ ...styles.formInput, minHeight: 70, resize: 'vertical' }} />
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 18, paddingTop: 18, borderTop: '0.5px solid #eee' }}>
                <button type="button" onClick={() => setModal(false)} style={styles.btnSec}>İptal</button>
                <button type="submit" disabled={kayit} style={styles.btnPrimary}>{kayit ? 'Kaydediliyor...' : duzenle ? 'Güncelle' : 'İlan Ekle'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  input: { padding: '8px 12px', border: '0.5px solid #ddd', borderRadius: 8, fontSize: 13, outline: 'none', minWidth: 200 },
  select: { padding: '8px 10px', border: '0.5px solid #ddd', borderRadius: 8, fontSize: 13, background: '#fff' },
  btnPrimary: { background: '#E8570A', color: '#fff', border: 'none', padding: '9px 16px', borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: 'pointer' },
  btnSec: { background: 'transparent', color: '#374151', border: '0.5px solid #ddd', padding: '9px 14px', borderRadius: 8, fontSize: 13, cursor: 'pointer' },
  btnIcon: { background: 'none', border: 'none', cursor: 'pointer', padding: '4px 6px', borderRadius: 6, fontSize: 14 },
  th: { padding: '9px 14px', textAlign: 'left', fontSize: 11, fontWeight: 500, color: '#6b7280' },
  td: { padding: '12px 14px', fontSize: 13, color: '#1a1a1a' },
  empty: { textAlign: 'center', padding: 40, color: '#9ca3af', fontSize: 13 },
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,.45)', zIndex: 1000, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', overflowY: 'auto', padding: 20 },
  modal: { background: '#fff', borderRadius: 14, padding: 24, width: '100%', maxWidth: 560, marginTop: 16 },
  formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 },
  label: { display: 'block', fontSize: 11, color: '#6b7280', marginBottom: 5, fontWeight: 500 },
  formInput: { width: '100%', padding: '8px 11px', border: '0.5px solid #ddd', borderRadius: 8, fontSize: 13, boxSizing: 'border-box', outline: 'none', fontFamily: 'inherit' },
};