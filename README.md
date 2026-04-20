# 🏠 Yoldaş Gayrimenkul

Emlak ofisleri için geliştirilmiş **tam kapsamlı yönetim sistemi**. İlan takibi, müşteri yönetimi, portföy organizasyonu ve iş analitiği tek bir platformda.

---

## 📸 Genel Bakış

| Modül | Açıklama |
|-------|----------|
| **Dashboard** | Özet istatistikler, ilçe bazlı ilan dağılımı, kategori grafikleri ve hızlı erişim butonları |
| **İlanlar** | Satılık/Kiralık ilan ekleme, düzenleme, silme ve gelişmiş filtreleme (tür, kategori, ilçe, fiyat aralığı, arama) |
| **Müşteriler** | Müşteri kaydı, ilgi alanı takibi, bütçe ve tercih yönetimi, sıcaklık durumu (Sıcak/Orta/Soğuk) |
| **Portföyler** | İlanları gruplara ayırma, renkli etiketleme, portföy bazlı organizasyon |
| **Analizler** | İlçelere göre ilan dağılımı, ortalama fiyat analizi, kategori dağılımı, portföy değeri |

---

## 🏗️ Teknoloji Yığını

### Backend
| Teknoloji | Versiyon | Kullanım |
|-----------|----------|----------|
| **.NET** | 8.0 | Web API framework |
| **Entity Framework Core** | 8.0 | ORM — Code-First yaklaşımı |
| **SQL Server** | — | İlişkisel veritabanı |
| **JWT Bearer** | 8.0 | Token tabanlı kimlik doğrulama |
| **AutoMapper** | 12.0 | DTO ↔ Entity dönüşümleri |
| **BCrypt.Net** | 4.0 | Şifre hashleme |
| **Swagger / Swashbuckle** | 6.5 | API dokümantasyonu |

### Frontend
| Teknoloji | Versiyon | Kullanım |
|-----------|----------|----------|
| **React** | 19.x | UI kütüphanesi |
| **Vite** | 8.x | Build aracı ve dev server |
| **React Router DOM** | 7.x | SPA routing |
| **Axios** | 1.x | HTTP client |

### Araçlar
| Teknoloji | Kullanım |
|-----------|----------|
| **concurrently** | Backend + Frontend'i tek komutla çalıştırma |
| **ESLint** | Kod kalite kontrolü |

---

## 📁 Proje Yapısı

```
YoldasGayrimenkul/
├── package.json                  # Root — tek komutla çalıştırma (concurrently)
├── .gitignore
│
├── backend/
│   └── YoldasGayrimenkul.API/
│       └── YoldasGayrimenkul.API/
│           ├── Program.cs                # Uygulama giriş noktası, DI, middleware
│           ├── appsettings.json          # Veritabanı & JWT yapılandırması
│           │
│           ├── Controllers/              # RESTful API endpoint'leri
│           │   ├── AuthController.cs     #   POST /api/auth/login, /api/auth/kayit
│           │   ├── IlanlarController.cs  #   CRUD /api/ilanlar
│           │   ├── MusterilerController.cs  # CRUD /api/musteriler
│           │   ├── PortfoylerController.cs  # CRUD /api/portfoyler
│           │   └── AnalizController.cs   #   GET  /api/analiz
│           │
│           ├── Models/                   # EF Core entity sınıfları
│           │   ├── Kullanici.cs          #   Kullanıcı (emlakçı) modeli
│           │   ├── Ilan.cs              #   Gayrimenkul ilanı modeli
│           │   ├── Musteri.cs           #   Müşteri modeli
│           │   ├── Portfoy.cs           #   Portföy modeli
│           │   ├── PortfoyIlan.cs       #   Portföy-İlan ara tablosu (M:N)
│           │   └── MusteriIlanIlgi.cs   #   Müşteri-İlan ilgi kaydı
│           │
│           ├── DTOs/                     # Data Transfer Objects
│           │   ├── AuthDto.cs           #   Login, Kayıt, Analiz DTO'ları
│           │   ├── IlanDto.cs           #   İlan CRUD + filtre DTO'ları
│           │   ├── MusteriDto.cs        #   Müşteri DTO'ları
│           │   └── PortfolyoDto.cs      #   Portföy DTO'ları
│           │
│           ├── Services/                 # İş mantığı katmanı
│           │   ├── IAuthService.cs / AuthService.cs      # Kimlik doğrulama
│           │   ├── IIlanService.cs / IlanService.cs      # İlan işlemleri
│           │   ├── IMusteriService.cs / MusteriService.cs # Müşteri işlemleri
│           │   └── IAnalizService.cs / AnalizService.cs  # Analiz hesaplamaları
│           │
│           ├── Repositories/             # Veri erişim katmanı
│           │   ├── IIlanRepository.cs / IlanRepository.cs
│           │   ├── IMusteriRepository.cs / MusteriRepository.cs
│           │   └── IPortfoyRepository.cs / PortfoyRepository.cs
│           │
│           ├── Data/
│           │   └── AppDbContext.cs       # EF Core DbContext, ilişki tanımları
│           │
│           └── Mappings/
│               └── MappingProfile.cs    # AutoMapper profili
│
└── Frontend/
    └── yoldas-web/
        ├── package.json
        ├── vite.config.js
        ├── index.html
        │
        └── src/
            ├── main.jsx                  # React giriş noktası
            ├── App.jsx                   # Routing yapısı, ProtectedRoute
            ├── App.css / index.css       # Global stiller
            │
            ├── api/                      # Backend iletişim katmanı
            │   ├── axiosInstance.js      #   Axios config, JWT interceptor
            │   ├── authApi.js           #   Login/Kayıt API çağrıları
            │   ├── ilanApi.js           #   İlan CRUD API çağrıları
            │   ├── musteriApi.js        #   Müşteri API çağrıları
            │   ├── portfoyApi.js        #   Portföy API çağrıları
            │   └── analizApi.js         #   Analiz API çağrıları
            │
            ├── components/
            │   └── Layout.jsx           #   Sidebar, header, navigasyon
            │
            ├── context/
            │   └── AuthContext.jsx       #   JWT token & kullanıcı state yönetimi
            │
            ├── hooks/                    #   (Genişlemeye hazır)
            │
            └── pages/
                ├── LoginPage.jsx        #   Giriş ekranı
                ├── DashboardPage.jsx    #   Ana panel, istatistikler
                ├── IlanlarPage.jsx      #   İlan listesi & yönetim
                ├── MusterilerPage.jsx   #   Müşteri listesi & yönetim
                ├── PortfoylerPage.jsx   #   Portföy listesi & yönetim
                └── AnalizPage.jsx       #   Analiz & raporlama
```

---

## 🚀 Kurulum & Çalıştırma

### Ön Gereksinimler

- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [Node.js](https://nodejs.org/) (v18+)
- [SQL Server](https://www.microsoft.com/sql-server) (LocalDB veya Express)

### 1. Repoyu Klonla

```bash
git clone https://github.com/kullanici-adi/YoldasGayrimenkul.git
cd YoldasGayrimenkul
```

### 2. Veritabanını Yapılandır

`backend/YoldasGayrimenkul.API/YoldasGayrimenkul.API/appsettings.json` dosyasındaki connection string'i kendi SQL Server ayarlarınıza göre güncelleyin:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=YoldasGayrimenkul;Trusted_Connection=True;TrustServerCertificate=True;"
  }
}
```

### 3. EF Core Migration

```bash
cd backend/YoldasGayrimenkul.API/YoldasGayrimenkul.API
dotnet ef database update
```

### 4. Bağımlılıkları Kur

```bash
# Root dizinde (hem concurrently hem frontend bağımlılıkları)
cd YoldasGayrimenkul
npm install
npm run install:frontend
```

### 5. Projeyi Çalıştır

```bash
# Tek komutla backend + frontend
npm run dev
```

| Servis | Adres |
|--------|-------|
| **Frontend** | `http://localhost:5173` |
| **Backend API** | `https://localhost:7183` |
| **Swagger UI** | `https://localhost:7183/swagger` |

### Ayrı Çalıştırma (Opsiyonel)

```bash
npm run dev:backend    # Sadece .NET API
npm run dev:frontend   # Sadece React dev server
```

---

## 🔌 API Endpoint'leri

### Kimlik Doğrulama
| Method | Endpoint | Açıklama |
|--------|----------|----------|
| `POST` | `/api/auth/login` | Giriş yap → JWT token döner |
| `POST` | `/api/auth/kayit` | Yeni kullanıcı kaydı |

### İlanlar *(JWT gerekli)*
| Method | Endpoint | Açıklama |
|--------|----------|----------|
| `GET` | `/api/ilanlar` | Tüm ilanları listele (filtre desteği) |
| `GET` | `/api/ilanlar/{id}` | İlan detayı |
| `POST` | `/api/ilanlar` | Yeni ilan oluştur |
| `PUT` | `/api/ilanlar/{id}` | İlan güncelle |
| `DELETE` | `/api/ilanlar/{id}` | İlan sil |

**Filtre Parametreleri:** `?ilanTuru=Satilik&kategori=Daire&ilce=Karsiyaka&minFiyat=100000&maxFiyat=500000&arama=deniz`

### Müşteriler *(JWT gerekli)*
| Method | Endpoint | Açıklama |
|--------|----------|----------|
| `GET` | `/api/musteriler` | Tüm müşterileri listele |
| `POST` | `/api/musteriler` | Yeni müşteri ekle |
| `PUT` | `/api/musteriler/{id}` | Müşteri güncelle |
| `DELETE` | `/api/musteriler/{id}` | Müşteri sil |

### Portföyler *(JWT gerekli)*
| Method | Endpoint | Açıklama |
|--------|----------|----------|
| `GET` | `/api/portfoyler` | Tüm portföyleri listele |
| `POST` | `/api/portfoyler` | Yeni portföy oluştur |
| `PUT` | `/api/portfoyler/{id}` | Portföy güncelle |
| `DELETE` | `/api/portfoyler/{id}` | Portföy sil |

### Analiz *(JWT gerekli)*
| Method | Endpoint | Açıklama |
|--------|----------|----------|
| `GET` | `/api/analiz` | Dashboard analiz verileri |

---

## 🏛️ Mimari

```
┌─────────────────────────────────────────────────────────┐
│                    React Frontend                        │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────────┐ │
│  │  Pages   │ │Components│ │ Context  │ │  API Layer │ │
│  └────┬─────┘ └──────────┘ └──────────┘ └─────┬──────┘ │
│       │            Axios + JWT Interceptor      │       │
└───────┼────────────────────────────────────────┼───────┘
        │              HTTPS / REST              │
┌───────┼────────────────────────────────────────┼───────┐
│       ▼          .NET 8 Web API                ▼       │
│  ┌──────────┐    ┌──────────┐    ┌──────────────────┐  │
│  │Controller│───▶│ Services │───▶│  Repositories    │  │
│  └──────────┘    └──────────┘    └────────┬─────────┘  │
│       │                                    │            │
│  ┌────┴─────┐    ┌──────────┐    ┌────────▼─────────┐  │
│  │   JWT    │    │AutoMapper│    │  EF Core DbCtx   │  │
│  │  Auth    │    │ Profiles │    └────────┬──────────┘  │
│  └──────────┘    └──────────┘             │             │
└───────────────────────────────────────────┼─────────────┘
                                            │
                                   ┌────────▼─────────┐
                                   │   SQL Server     │
                                   │  ┌────────────┐  │
                                   │  │ Kullanicilar│  │
                                   │  │ Ilanlar     │  │
                                   │  │ Musteriler  │  │
                                   │  │ Portfoyler  │  │
                                   │  │ PortfoyIlan │  │
                                   │  │ MusteriIlan │  │
                                   │  └────────────┘  │
                                   └──────────────────┘
```

### Katmanlı Mimari (Backend)

| Katman | Sorumluluk |
|--------|------------|
| **Controller** | HTTP isteklerini karşılar, yetkilendirme kontrolü yapar |
| **Service** | İş mantığını uygular, DTO dönüşümlerini yönetir |
| **Repository** | Veritabanı sorgularını yürütür (EF Core LINQ) |
| **Data** | DbContext, entity ilişkileri, composite key tanımları |

### Veritabanı İlişkileri

- **Kullanici → Ilan**: 1:N (bir emlakçı birçok ilan oluşturabilir)
- **Kullanici → Musteri**: 1:N (bir emlakçı birçok müşteri yönetebilir)
- **Kullanici → Portfoy**: 1:N (bir emlakçı birçok portföy oluşturabilir)
- **Portfoy ↔ Ilan**: M:N (`PortfoyIlan` ara tablosu ile)
- **Musteri ↔ Ilan**: M:N (`MusteriIlanIlgi` ara tablosu ile)

---

## 🔐 Güvenlik

- **JWT Authentication** — Tüm API endpoint'leri (auth hariç) token gerektirir
- **BCrypt** — Şifreler hash'lenerek saklanır
- **CORS** — Sadece izin verilen origin'lerden erişim
- **Kullanıcı İzolasyonu** — Her emlakçı sadece kendi verilerini görür

---

## 📜 Mevcut Script'ler

```bash
npm run dev              # Backend + Frontend birlikte çalıştır
npm run dev:backend      # Sadece .NET API çalıştır
npm run dev:frontend     # Sadece React dev server çalıştır
npm run install:frontend # Frontend bağımlılıklarını kur
npm run build:frontend   # Frontend production build
```

---

## 📝 Lisans

Bu proje özel kullanım içindir.


![img alt](https://github.com/serhatyoldasswe/yoldas-gayrimenkul-crm/blob/efff5f27f003a32f60b9a7b8ee6ffc23c14d6a31/G%C4%B0R%C4%B0%C5%9E.png)
