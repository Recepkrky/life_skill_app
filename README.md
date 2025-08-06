# Life Skill App (Down Sendromlu Özel Bireyler İçin)

Bu uygulama, down sendromlu özel bireyler için günlük yaşamda karşılaşılabilecek durumlara yönelik senaryolar ve pratikler sunarak kullanıcıların yaşam becerilerini geliştirmesini amaçlar. 

### Tanıtım Videosu
[YouTube'da İzle](https://youtu.be/dDQOIa85ScM)
Video dikey yatay oranı formatından kaynaklı garip durmuş ama normalde uygulamanın dikey yatay oranı normaldir.

## Özellikler

- **Senaryolar:** Gerçek hayata uygun, dallanabilen ve adım adım ilerleyen interaktif senaryolar.
- **Kategori Sistemi:** Günlük yaşam, ulaşım, sağlık, toplum ve teknoloji gibi farklı kategorilerde içerik.
- **Zorluk Seviyesi:** Kolay, Orta, Zor olarak üç farklı zorluk seçeneği.
- **İlerleme Takibi:** Kullanıcıların tamamladığı senaryolar, puanlar ve başarımlar kaydedilir.
- **Görsel ve İkon Desteği:** Her senaryo için uygun ikon ve renkler.
- **AI Asistan:** Kullanıcılara kişisel öneriler ve motivasyon mesajları sunan yapay zeka destekli asistan.
- **Profil ve İstatistikler:** Kullanıcıya özel gelişim grafikleri ve rozetler.
- **Kategoriye Göre Filtreleme:** Senaryoları kategoriye göre filtreleyip arayabilirsiniz.

## Kurulum

1. **Depoyu Klonlayın:**
   ```
   git clone https://github.com/Recepkrky/life_skill_app.git
   cd life_skill_app-main
   ```

2. **Bağımlılıkları Yükleyin:**
   ```
   npm install
   # veya
   yarn install
   ```

3. **Projeyi Başlatın:**
   ```
   npx expo start
   ```
   veya
   ```
   yarn start
   ```

   Başlattıktan sonra terminalde çıkan QR kodunu **Expo Go** uygulamasıyla (Android) veya kamera uygulamasıyla (iOS) okutarak projeyi telefonunuzda açabilirsiniz.

## Kullanılan Teknolojiler

- **React Native** (Expo)
- **TypeScript**
- **Supabase** (Backend ve kullanıcı yönetimi)
- **Lucide-react-native** (ikonlar)
- **AI/ML** (AI Asistan için)

## Dosya Yapısı

```
├── app/
│   ├── (tabs)/         # Ana sekmeler (index, profile, scenarios, ai-assistant, settings)
│   ├── components/     # Ortak bileşenler
│   ├── data/           # Senaryo ve veri dosyaları
│   ├── utils/          # Yardımcı fonksiyonlar ve servisler
│   └── contexts/       # Context provider dosyaları
├── assets/             # Görseller ve ikonlar
├── .gitignore
├── README.md
└── package.json
```

## Katkıda Bulunma

Katkıda bulunmak için lütfen bir fork oluşturun ve pull request gönderin. Hataları veya önerileri Issues sekmesinden bildirebilirsiniz. Hata ve öneriler için maide yollayabilirsiniz. * karakayarecepk@gmail.com * Oyundakiilim@gmail.com

