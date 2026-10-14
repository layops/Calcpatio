# Calcpatio

Veranda ve pergola (patio) sistemleri için malzeme hesaplama, yazdırma ve Excel'e aktarma uygulaması.

---

## 🛠 Teknoloji Yığını

- **Frontend:** React 17, Material-UI (v4), Redux + Redux Thunk, React Router (v6), XLSX (Excel çıktısı), React-to-Print
- **Backend:** Node.js, Express 4, SQLite (`better-sqlite3`), JWT, bcryptjs, Helmet, express-rate-limit
- **Veritabanı:** SQLite (Yerel dosya tabanlı, sıfır yapılandırma)

---

## 📁 Proje Yapısı

```
Calcpatio/
├── -CaclpatioClient/       # React önyüz uygulaması
│   ├── .env.example        # Client ortam değişkenleri şablonu
│   ├── src/
│   │   ├── views/calculate/  # Polycarbon ve Glass hesaplayıcıları
│   │   ├── layouts/          # Dashboard ve Navigasyon
│   │   ├── redux/            # Auth ve oturum yönetimi
│   │   └── utils/            # Excel export ve session yardımcıları
└── CaclpatioServer/        # Express REST API sunucusu
    ├── .env.example        # Server ortam değişkenleri şablonu
    ├── controllers/        # Auth & kullanıcı kontrolleri
    ├── db.js               # SQLite veritabanı bağlantısı & tablolar
    ├── database.sqlite     # Yerel SQLite veritabanı dosyası (otomatik oluşur)
    ├── routes/             # API rotaları & rate limit
    └── index.js            # Sunucu giriş noktası
```

---

## 🚀 Yerel Kurulum & Çalıştırma

### 1. Sunucu (Backend)

Herhangi bir harici veritabanı kurulumuna gerek yoktur. SQLite otomatik olarak proje içinde çalışır:

```bash
cd CaclpatioServer

# Sunucuyu başlatın
npm start
```

Sunucu ilk çalıştığında `database.sqlite` dosyasını kendisi oluşturacaktır. Port: `5000`.

### 2. İstemci (Frontend)

```bash
cd ../-CaclpatioClient

# Bağımlılıkları yükleyin
npm install

# .env dosyasını oluşturun
cp .env.example .env
```

`.env` dosyanızı düzenleyin:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

İstemciyi başlatın:
```bash
# Node 16 ve öncesi:
npm start   # http://localhost:3000

# Node 17+ / Node 18+ / Node 20+ (Webpack 4 OpenSSL desteği için):
# Windows PowerShell:
$env:NODE_OPTIONS="--openssl-legacy-provider"; npm start
# Linux / macOS / Git Bash:
NODE_OPTIONS=--openssl-legacy-provider npm start
```

---

## 🔒 Güvenlik & Mimari İyileştirmeleri

- **Şifreleme:** Düz metin şifreler yerine `bcryptjs` ile hashleme; eski kullanıcılar için ilk girişte otomatik bcrypt migrasyonu.
- **NoSQL Injection Koruması:** Girdi tipi doğrulamaları (string kontrolü) ile operatör enjeksiyonları engellendi.
- **JWT Süresi:** Token'lar için varsayılan 7 günlük süre (`expiresIn: '7d'`); süresi dolan veya geçersiz token'lar 401 ile reddedilir ve oturum otomatik kapatılır.
- **Brute-Force Koruması:** Giriş, kayıt ve şifre güncelleme uç noktalarında `express-rate-limit` (15 dakikada en fazla 20 deneme).
- **Session Sürekliliği:** Sayfa yenilendiğinde oturumun `localStorage` üzerinden doğrulanıp otomatik yüklenmesi.
- **Kullanıcı Kaydı:** Yeni kullanıcılar için arayüze entegre Formik/Yup doğrulamalı [RegisterView](file:///c:/Project/Calcpatio/-CaclpatioClient/src/views/auth/RegisterView.js) ekranı.
- **Hesaplama Güvenliği:** Sıfıra bölme (`Infinity`) ve negatif parça adetleri engellendi; minimum 50 cm genişlik/yükseklik doğrulama uyarıları eklendi.
- **Windows Uyumlu Excel:** Yasaklı karakterler (`:`, `*`, `?` vb.) sanitize edildi, tarih formatı `YYYY-MM-DD_HH-mm-ss` yapıldı ve sütun genişlikleri otomatik uyarlandı.
- **Hata Yönetimi:** Asılı kalan istekleri önleyen global error handler ve `asyncHandler`.
