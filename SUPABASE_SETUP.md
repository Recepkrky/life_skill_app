# Supabase Kurulum Talimatları

## 1. Supabase Projesi Oluşturma

1. [Supabase](https://supabase.com) sitesine gidin
2. "Start your project" butonuna tıklayın
3. GitHub ile giriş yapın
4. Yeni bir proje oluşturun:
   - **Organization**: Kendi organizasyonunuzu seçin
   - **Name**: `life-skill-app` (veya istediğiniz bir isim)
   - **Database Password**: Güçlü bir şifre belirleyin
   - **Region**: Size en yakın bölgeyi seçin

## 2. Veritabanı Şemasını Kurma

1. Supabase Dashboard'da projenizi açın
2. Sol menüden **SQL Editor**'a tıklayın
3. **New Query** butonuna tıklayın
4. `supabase-schema.sql` dosyasının içeriğini kopyalayıp yapıştırın
5. **Run** butonuna tıklayın

## 3. API Anahtarlarını Alma

1. Sol menüden **Settings** > **API**'ye tıklayın
2. **Project URL** ve **anon public** anahtarını kopyalayın
3. `utils/supabase.ts` dosyasını açın
4. Aşağıdaki değerleri güncelleyin:

```typescript
const supabaseUrl = 'YOUR_PROJECT_URL';
const supabaseAnonKey = 'YOUR_ANON_KEY';
```

## 4. Auth Ayarları

1. Sol menüden **Authentication** > **Settings**'e tıklayın
2. **Site URL**'yi güncelleyin:
   - Development: `exp://localhost:8081`
   - Production: Uygulamanızın URL'si
3. **Redirect URLs**'e şunları ekleyin:
   - `exp://localhost:8081/*`
   - `your-app://*`

## 5. Email Ayarları (Opsiyonel)

1. **Authentication** > **Settings** > **SMTP Settings**
2. Kendi SMTP sunucunuzu yapılandırın veya Supabase'in ücretsiz SMTP'sini kullanın
3. Email şablonlarını özelleştirin

## 6. RLS (Row Level Security) Kontrolü

1. **Table Editor**'a gidin
2. Tüm tabloların **RLS**'nin aktif olduğunu kontrol edin
3. Politikaların doğru şekilde uygulandığını kontrol edin

## 7. Test Etme

1. Uygulamayı çalıştırın: `npx expo start`
2. Giriş sayfasına gidin
3. Yeni bir hesap oluşturun
4. Senaryo tamamlayın ve ilerlemenin kaydedildiğini kontrol edin

## 8. Güvenlik Kontrolleri

1. **Authentication** > **Users**'da kullanıcıların oluştuğunu kontrol edin
2. **Table Editor**'da verilerin doğru şekilde kaydedildiğini kontrol edin
3. **Logs** bölümünde hata olup olmadığını kontrol edin

## 9. Production Hazırlığı

1. **Settings** > **General**'da production URL'lerini ayarlayın
2. **Settings** > **API**'de production anahtarlarını kullanın
3. Environment variables'ları production ortamında ayarlayın

## 10. Monitoring

1. **Dashboard**'da kullanım istatistiklerini takip edin
2. **Logs** bölümünde hataları izleyin
3. **Database** > **Backups**'da otomatik yedekleme ayarlarını kontrol edin

## Sorun Giderme

### Hata: "Invalid API key"
- API anahtarlarının doğru kopyalandığından emin olun
- Project URL'nin doğru olduğunu kontrol edin

### Hata: "RLS policy violation"
- Tabloların RLS politikalarının doğru ayarlandığını kontrol edin
- Kullanıcının authenticate olduğundan emin olun

### Hata: "Email not confirmed"
- Email doğrulama ayarlarını kontrol edin
- SMTP ayarlarının doğru olduğunu kontrol edin

## Ek Özellikler

### Real-time Subscriptions
```typescript
// Kullanıcı ilerlemesini gerçek zamanlı dinleme
const subscription = supabase
  .channel('user_progress')
  .on('postgres_changes', 
    { event: '*', schema: 'public', table: 'user_progress' },
    (payload) => {
      console.log('Progress updated:', payload);
    }
  )
  .subscribe();
```

### Storage (Gelecekte)
- Kullanıcı avatar'ları
- Senaryo görselleri
- Ses dosyaları

### Edge Functions (Gelecekte)
- Otomatik rozet verilmesi
- Email bildirimleri
- Analitik raporları 