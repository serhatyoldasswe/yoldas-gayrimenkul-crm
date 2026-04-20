import { useEffect, useState } from 'react';
import { analizApi } from '../api/analizApi';
import { useNavigate } from 'react-router-dom';

const BRAND = '#E8570A';
const fmt = n => new Intl.NumberFormat('tr-TR').format(n);

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [yukleniyor, setYukleniyor] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    analizApi.getAnaliz()
      .then(res => setData(res.data))
      .catch(() => {})
      .finally(() => setYukleniyor(false));
  }, []);

  if (yukleniyor) return <div style={styles.loading}>Yükleniyor...</div>;
  if (!data) return <div style={styles.loading}>Veri alınamadı. Backend çalışıyor mu?</div>;

  const maxIlce = Math.max(...(data.ilceIlanDagilimi?.map(d => d.sayi) || [1]), 1);
  const maxKat = Math.max(...(data.kategoriDagilimi?.map(d => d.sayi) || [1]), 1);
  const catColors = [BRAND, '#2563eb', '#16a34a', '#d97706', '#7c3aed', '#6b7280'];

  const stats = [
    { label: 'Aktif İlan', val: data.aktifIlan, sub: `${data.toplamIlan} toplam`, color: BRAND },
    { label: 'Toplam Müşteri', val: data.toplamMusteri, sub: `${data.sicakMusteri} sıcak`, color: '#dc2626' },
    { label: 'Portföy Değeri', val: `₺${fmt(Math.round((data.toplamPortfoyDegeri || 0) / 1000000))}M`, sub: 'aktif satılıklar', color: '#16a34a' },
    { label: 'Kapanan İşlem', val: data.kapananIslem, sub: 'tüm zamanlar', color: '#2563eb' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Stat kartları */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }}>
        {stats.map(s => (
          <div key={s.label} style={styles.statCard}>
            <div style={styles.statLabel}>{s.label}</div>
            <div style={{ fontSize: 26, fontWeight: 500, color: s.color }}>{s.val}</div>
            <div style={styles.statSub}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Grafikler */}
      <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: 14 }}>
        {/* İlçe dağılımı */}
        <div style={styles.card}>
          <div style={styles.cardTitle}>İlçelere Göre İlan Dağılımı</div>
          {(data.ilceIlanDagilimi || []).map(d => (
            <div key={d.ilce} style={{ marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 3 }}>
                <span>{d.ilce}</span>
                <span style={{ color: BRAND, fontWeight: 500 }}>{d.sayi} ilan · ₺{fmt(Math.round(d.ortalamaFiyat / 1000))}K ort.</span>
              </div>
              <div style={styles.barTrack}>
                <div style={{ ...styles.barFill, width: `${Math.round(d.sayi / maxIlce * 100)}%`, background: BRAND }} />
              </div>
            </div>
          ))}
        </div>

        {/* Kategori */}
        <div style={styles.card}>
          <div style={styles.cardTitle}>Kategori Dağılımı</div>
          {(data.kategoriDagilimi || []).map((d, i) => (
            <div key={d.kategori} style={{ marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 3 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ width: 8, height: 8, borderRadius: 2, background: catColors[i % catColors.length], display: 'inline-block' }}/>
                  {d.kategori}
                </span>
                <span style={{ fontWeight: 500 }}>{d.sayi}</span>
              </div>
              <div style={styles.barTrack}>
                <div style={{ ...styles.barFill, width: `${Math.round(d.sayi / maxKat * 100)}%`, background: catColors[i % catColors.length] }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Hızlı erişim */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
        {[
          { label: 'Yeni İlan Ekle', path: '/ilanlar', color: BRAND },
          { label: 'Müşteri Ekle', path: '/musteriler', color: '#2563eb' },
          { label: 'Portföy Oluştur', path: '/portfoyler', color: '#16a34a' },
        ].map(b => (
          <button key={b.label} onClick={() => navigate(b.path)} style={{
            background: b.color, color: '#fff', border: 'none', borderRadius: 10,
            padding: '14px', fontSize: 14, fontWeight: 500, cursor: 'pointer'
          }}>
            {b.label}
          </button>
        ))}
      </div>
    </div>
  );
}

const styles = {
  loading: { display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300, color: '#6b7280', fontSize: 14 },
  statCard: { background: '#fff', border: '0.5px solid rgba(0,0,0,.08)', borderRadius: 10, padding: '14px 16px' },
  statLabel: { fontSize: 11, color: '#6b7280', marginBottom: 6 },
  statSub: { fontSize: 11, color: '#9ca3af', marginTop: 4 },
  card: { background: '#fff', border: '0.5px solid rgba(0,0,0,.08)', borderRadius: 12, padding: 18 },
  cardTitle: { fontSize: 13, fontWeight: 500, marginBottom: 14 },
  barTrack: { height: 7, background: '#f0ede8', borderRadius: 4, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 4, transition: 'width .4s' },
};