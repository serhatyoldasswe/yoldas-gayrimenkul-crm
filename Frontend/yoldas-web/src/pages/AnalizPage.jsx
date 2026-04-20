import { useEffect, useState } from 'react';
import { analizApi } from '../api/analizApi';

const BRAND = '#E8570A';
const catColors = [BRAND,'#2563eb','#16a34a','#d97706','#7c3aed','#6b7280'];
const fmt = n => new Intl.NumberFormat('tr-TR').format(n);

export default function AnalizPage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    analizApi.getAnaliz().then(r => setData(r.data)).catch(() => {});
  }, []);

  if (!data) return <div style={{ textAlign: 'center', padding: 60, color: '#9ca3af' }}>Yükleniyor...</div>;

  const maxIlce = Math.max(...(data.ilceIlanDagilimi?.map(d => d.sayi) || [1]), 1);
  const maxKat = Math.max(...(data.kategoriDagilimi?.map(d => d.sayi) || [1]), 1);
  const kapanmaOrani = data.toplamIlan > 0 ? Math.round(data.kapananIslem / data.toplamIlan * 100) : 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, fontFamily: 'system-ui,sans-serif' }}>
      {/* Özet kartlar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }}>
        {[
          { label: 'Toplam İlan', val: data.toplamIlan, color: BRAND },
          { label: 'Toplam Müşteri', val: data.toplamMusteri, color: '#2563eb' },
          { label: 'Kapanma Oranı', val: `%${kapanmaOrani}`, color: '#16a34a' },
          { label: 'Portföy Değeri', val: `₺${fmt(Math.round((data.toplamPortfoyDegeri || 0) / 1000000))}M`, color: '#7c3aed' },
        ].map(s => (
          <div key={s.label} style={styles.statCard}>
            <div style={styles.statLabel}>{s.label}</div>
            <div style={{ fontSize: 26, fontWeight: 500, color: s.color, marginTop: 4 }}>{s.val}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        {/* İlçe bazlı ortalama fiyat */}
        <div style={styles.card}>
          <div style={styles.cardTitle}>Ortalama Satış Fiyatı — İlçeye Göre</div>
          {(data.ilceIlanDagilimi || []).map(d => (
            <div key={d.ilce} style={{ marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 3 }}>
                <span>{d.ilce}</span>
                <span style={{ color: BRAND, fontWeight: 500 }}>₺{fmt(Math.round(d.ortalamaFiyat / 1000))}K</span>
              </div>
              <div style={styles.barTrack}>
                <div style={{ ...styles.barFill, width: `${Math.round(d.sayi / maxIlce * 100)}%`, background: BRAND }} />
              </div>
            </div>
          ))}
          {(!data.ilceIlanDagilimi || data.ilceIlanDagilimi.length === 0) && <div style={styles.empty}>Veri yok</div>}
        </div>

        {/* Kategori dağılımı */}
        <div style={styles.card}>
          <div style={styles.cardTitle}>Kategori Dağılımı</div>
          {(data.kategoriDagilimi || []).map((d, i) => (
            <div key={d.kategori} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <div style={{ width: 10, height: 10, borderRadius: 2, background: catColors[i % catColors.length], flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 3 }}>
                  <span>{d.kategori}</span>
                  <span style={{ fontWeight: 500 }}>{d.sayi}</span>
                </div>
                <div style={styles.barTrack}>
                  <div style={{ ...styles.barFill, width: `${Math.round(d.sayi / maxKat * 100)}%`, background: catColors[i % catColors.length] }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Özet kutu */}
      <div style={styles.card}>
        <div style={styles.cardTitle}>Genel Özet</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
          {[
            { label: 'Aktif İlan', val: data.aktifIlan, color: BRAND },
            { label: 'Sıcak Müşteri', val: data.sicakMusteri, color: '#dc2626' },
            { label: 'Kapanan İşlem', val: data.kapananIslem, color: '#16a34a' },
          ].map(s => (
            <div key={s.label} style={{ textAlign: 'center', padding: '16px', background: '#f9f8f6', borderRadius: 10 }}>
              <div style={{ fontSize: 32, fontWeight: 500, color: s.color }}>{s.val}</div>
              <div style={{ fontSize: 12, color: '#6b7280', marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  statCard: { background: '#fff', border: '0.5px solid rgba(0,0,0,.08)', borderRadius: 10, padding: '14px 16px' },
  statLabel: { fontSize: 11, color: '#6b7280' },
  card: { background: '#fff', border: '0.5px solid rgba(0,0,0,.08)', borderRadius: 12, padding: 18 },
  cardTitle: { fontSize: 13, fontWeight: 500, marginBottom: 16 },
  barTrack: { height: 7, background: '#f0ede8', borderRadius: 4, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 4 },
  empty: { textAlign: 'center', padding: 20, color: '#9ca3af', fontSize: 12 },
};