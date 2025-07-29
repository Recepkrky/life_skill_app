import { ShoppingCart, Bus, CreditCard, Phone, Hospital, Briefcase, Coffee, Car, Users, Chrome as Home, Utensils, Shirt, BookOpen, Calendar, MapPin, Wifi, Camera, Music, Gamepad2, Heart, Pill, Train } from 'lucide-react-native';

export interface ScenarioStep {
  id: string;
  question: string; // "Şimdi ne yaparsın?" sorusu
  imageUrl?: string; // Senaryo adımına uygun resim URL'i
  options: {
    id: string;
    text: string; // Kısa ve net seçenek
    isCorrect: boolean;
    feedback?: string; // Yanlış seçimde gösterilecek açıklama (opsiyonel)
  }[];
  correctOptionId: string | string[];
  nextStepId?: string; // Bir sonraki adım
  previousStepId?: string; // Bir önceki adım
  nextStepMap?: Record<string, string>; // Dallanma için kullanılır
}

export interface SimpleScenario {
  id: string;
  title: string;
  description: string;
  difficulty: 'Kolay' | 'Orta' | 'Zor';
  icon: any;
  color: string;
  steps: ScenarioStep[];
  completed: boolean;
  category: 'Günlük' | 'Ulaşım' | 'Sağlık' | 'Toplum';
  maxScore: number; // Senaryo tamamlandığında verilecek maksimum puan
}

export const scenarios: SimpleScenario[] = [
  {
    id: 'market-simple',
    title: 'Market Alışverişi',
    description: 'Kasiyerle konuşma ve ödeme yapma',
    difficulty: 'Orta',
    icon: ShoppingCart,
    color: '#4A90E2',
    completed: false,
    category: 'Günlük',
    maxScore: 70,
            steps: [
          {
            id: 'step1',
            question: 'Market kapısından girdin. Kasiyer sana "Merhaba" dedi. Sen ne dersin?',
            imageUrl: 'https://setraf.com/content/images/upload/kapak/market-raf-sistemleri-nedir.jpg',
            options: [
              { id: 'a', text: 'Görüşürüz', isCorrect: false, feedback: '"Görüşürüz" ayrılırken söylenir. Şimdi selam vermen gerekir.' },
              { id: 'b', text: 'Ne kadar?', isCorrect: false, feedback: 'Henüz ürün sormadın. Önce selam ver.' },
              { id: 'c', text: 'Merhaba, nasılsınız?', isCorrect: true,  feedback: 'Harika, nazikçe selam verdin.' },
              { id: 'd', text: 'Hiçbir şey söyleme', isCorrect: false, feedback: 'Selam vermek naziktir. Kasiyerle iletişime geç.' }
            ],
            correctOptionId: ['c'],
            nextStepId: 'step2'
          },
      {
        id: 'step2',
        question: 'Kasiyer "Size nasıl yardımcı olabilirim?" diye sordu. Sen ne dersin?',
        imageUrl: 'https://media.istockphoto.com/id/1482558833/photo/supermarket-worker-helping-customer-find-grocery-items.jpg',
        options: [
          { id: 'a', text: 'Yemek', isCorrect: false, feedback: 'Hangi ürünü istediğini belirtmelisin. Daha spesifik ol.' },
          { id: 'b', text: 'Fiyatları söyle', isCorrect: false, feedback: 'Önce ne aradığını söyle, sonra fiyat sorabilirsin.' },
          { id: 'c', text: 'Ekmek ve süt arıyorum', isCorrect: true, feedback: 'Net ve anlaşılır bir şekilde ifade ettin.' },
          { id: 'd', text: 'Hiçbir şey söyleme', isCorrect: false, feedback: 'Kasiyere ne aradığını söylemelisin.' }
        ],
        correctOptionId: ['c'],
        nextStepId: 'step3',
        previousStepId: 'step1'
      },
      {
        id: 'step3',
        question: 'Kasiyer "Ekmek ve süt şu rafta" dedi. Sen ne dersin?',
        imageUrl: 'https://media.istockphoto.com/id/1399985604/photo/grocery-store-shelves-with-bread.jpg',
        options: [
          { id: 'a', text: 'Tamam', isCorrect: false, feedback: 'Teşekkür etmek daha nazik olur.' },
          { id: 'b', text: 'Teşekkür ederim', isCorrect: true, feedback: 'Nazik bir teşekkür ettin, çok iyi.' },
          { id: 'c', text: 'Nerede?', isCorrect: false, feedback: 'Kasiyer zaten söyledi. Teşekkür edip raflara gidebilirsin.' },
          { id: 'd', text: 'Hiçbir şey söyleme', isCorrect: false, feedback: 'Kısa da olsa teşekkür etmek önemli.' }
        ],
        correctOptionId: ['b'],
        nextStepId: 'step4',
        previousStepId: 'step2'
      },
      {
        id: 'step4',
        question: 'Ürünleri aldın ve kasaya geldin. Kasiyer "Kart mı nakit mi?" diye sordu. Sen ne dersin?',
        imageUrl: 'https://media.istockphoto.com/id/1424626357/tr/fotoğraf/portrait-of-smiling-female-cashier.jpg?s=612x612&w=0&k=20&c=ds2YVliYY0oG9YFvQLqyrTXcnBmJX3khaSGvjyfYe_o=',
        options: [
          { id: 'a', text: 'Kart', isCorrect: true,  feedback: 'Kartla ödemeyi seçtin.' },
          { id: 'b', text: 'Nakit', isCorrect: true, feedback: 'Nakit ödemeyi seçtin.' },
          { id: 'c', text: 'Yemek', isCorrect: false, feedback: 'Bu bir ödeme yöntemi değil. Kart ya da nakit söylemelisin.' },
          { id: 'd', text: 'Hiçbir şey söyleme', isCorrect: false, feedback: 'Ödeme yöntemini belirtmen gerekiyor.' }
        ],
        correctOptionId: ['a', 'b'],
        // Dallanma: kart seçilirse step5_card, nakit seçilirse step5_cash
        nextStepMap: {
          a: 'step5_card',
          b: 'step5_cash'
        },
        previousStepId: 'step3'
      },
      {
        id: 'step5_card',
        question: 'Kasiyer "Kartınızı okutun" dedi. Sen ne dersin/naparsın?',
        imageUrl: 'https://media.istockphoto.com/id/1442172430/photo/contactless-payment-with-credit-card.jpg',
        options: [
          { id: 'a', text: 'Şifre girmem gerekiyor mu?', isCorrect: true,  feedback: 'Kartı okuttuktan sonra şifre sorabilirsin, uygun.' },
          { id: 'b', text: 'Tamam', isCorrect: true, feedback: 'Talimatı kabul ettin, uygulanabilir.' },
          { id: 'c', text: 'Nakit vereyim', isCorrect: false, feedback: 'Kart seçmiştin. Tutarlı olmalısın.' },
          { id: 'd', text: 'Hiçbir şey söyleme', isCorrect: false, feedback: 'Kasiyere kısaca da olsa cevap vermek iyi olur.' }
        ],
        correctOptionId: ['a', 'b'],
        nextStepId: 'step6',
        previousStepId: 'step4'
      },
      {
        id: 'step5_cash',
        question: 'Kasiyer toplam tutarı söyledi. Ne yaparsın?',
        imageUrl: 'https://media.istockphoto.com/id/1216958138/photo/hands-paying-with-cash-at-store.jpg',
        options: [
          { id: 'a', text: 'Parayı uzatır ve "Buyurun" dersin', isCorrect: true,  feedback: 'Doğru, nakit ödemede parayı uzatıp nazikçe verirsin.' },
          { id: 'b', text: 'Kartımı okutayım', isCorrect: false, feedback: 'Nakit seçmiştin. Kartla ödeme söylemin tutarsız.' },
          { id: 'c', text: 'Hiçbir şey söylemeden beklersin', isCorrect: false, feedback: 'Kasiyerin seni anlaması için parayı vermelisin.' },
          { id: 'd', text: 'Üstü kalsın', isCorrect: false, feedback: 'Bu genelde yüksek bahşiş için söylenir, burada uygun değil.' }
        ],
        correctOptionId: ['a'],
        nextStepId: 'step5b_cash_change',
        previousStepId: 'step4'
      },
      {
        id: 'step5b_cash_change',
        question: 'Kasiyer para üstünü verdi ve "Buyurun" dedi. Sen ne dersin?',
        imageUrl: 'https://media.istockphoto.com/id/1034194470/photo/female-cashier-giving-change-at-the-cash-register.jpg',
        options: [
          { id: 'a', text: 'Teşekkür ederim', isCorrect: true, feedback: 'Nazikçe teşekkür ettin, çok iyi.' },
          { id: 'b', text: 'Para üstünü saymam', isCorrect: false, feedback: 'Para üstünü kısaca kontrol etmek iyi olur ama en azından teşekkür etmelisin.' },
          { id: 'c', text: 'Hiçbir şey söyleme', isCorrect: false, feedback: 'Teşekkür etmek önemli bir sosyal beceridir.' },
          { id: 'd', text: 'Para yetmedi mi?', isCorrect: false, feedback: 'Kasiyer sana para üstünü verdi, karışıklık yok.' }
        ],
        correctOptionId: ['a'],
        nextStepId: 'step6',
        previousStepId: 'step5_cash'
      },
      {
        id: 'step6',
        question: 'Ödeme tamamlandı. Kasiyer "İyi günler" dedi. Sen ne dersin?',
        imageUrl: 'https://media.istockphoto.com/id/1424626357/tr/fotoğraf/portrait-of-smiling-female-cashier.jpg?s=612x612&w=0&k=20&c=ds2YVliYY0oG9YFvQLqyrTXcnBmJX3khaSGvjyfYe_o=',
        options: [
          { id: 'a', text: 'Hoşça kalın', isCorrect: true,  feedback: 'Nazik bir veda ifadesi kullandın.' },
          { id: 'b', text: 'Görüşürüz', isCorrect: true, feedback: 'Veda için kullanılabilir, gayet uygun.' },
          { id: 'c', text: 'Teşekkür ederim, iyi günler', isCorrect: true, feedback: 'Harika, teşekkür ve iyi dilek bir arada.' },
          { id: 'd', text: 'Hiçbir şey söyleme', isCorrect: false, feedback: 'Veda etmek sosyal ilişkiler için önemlidir.' }
        ],
        correctOptionId: ['a', 'b', 'c'],
        previousStepId: 'step5_card' // veya 'step5b_cash_change'; uygulamada son adım olduğu için kontrol gerekmeyebilir.
      }
    ]
  },
  {
    id: 'smartphone-basics',
    title: 'Akıllı Telefon Kullanımı',
    description: 'Temel telefon işlemleri ve uygulama kullanımı',
    difficulty: 'Kolay',
    icon: Phone,
    color: '#FF6B35',
    completed: false,
    category: 'Toplum',
    maxScore: 40,
    steps: [
      {
        id: 'step1',
        question: 'Telefonunu açtın. Ana ekranda ne yaparsın?',
        imageUrl: 'https://images.pexels.com/photos/1647976/pexels-photo-1647976.jpeg?auto=compress&cs=tinysrgb&w=800',
        options: [
          { id: 'a', text: 'Hiçbir şey yapma', isCorrect: false, feedback: 'Telefonu kullanmak için bir uygulama açman gerek.' },
          { id: 'b', text: 'Mesaj uygulamasını aç', isCorrect: true },
          { id: 'c', text: 'Telefonu kapat', isCorrect: false, feedback: 'Telefonu yeni açtın, kullanmaya başla.' },
          { id: 'd', text: 'Şifre gir', isCorrect: false, feedback: 'Zaten telefon açık. Uygulama kullanmaya başla.' }
        ],
        correctOptionId: 'b',
        nextStepId: 'step2'
      },
      {
        id: 'step2',
        question: 'Mesaj uygulamasında yeni mesaj yazmak için ne yaparsın?',
        imageUrl: 'https://images.pexels.com/photos/1647976/pexels-photo-1647976.jpeg?auto=compress&cs=tinysrgb&w=800',
        options: [
          { id: 'a', text: 'Kalem ikonuna bas', isCorrect: true },
          { id: 'b', text: 'Telefonu salla', isCorrect: false, feedback: 'Telefonu sallamak mesaj yazmaz. Kalem ikonuna bas.' },
          { id: 'c', text: 'Hiçbir şey yapma', isCorrect: false, feedback: 'Yeni mesaj yazmak için kalem ikonuna basman gerek.' },
          { id: 'd', text: 'Telefonu kapat', isCorrect: false, feedback: 'Mesaj yazmak için telefonu kapatma.' }
        ],
        correctOptionId: 'a',
        nextStepId: 'step3',
        previousStepId: 'step1'
      },
      {
        id: 'step3',
        question: 'Mesaj yazdın. Göndermek için ne yaparsın?',
        imageUrl: 'https://images.pexels.com/photos/1647976/pexels-photo-1647976.jpeg?auto=compress&cs=tinysrgb&w=800',
        options: [
          { id: 'a', text: 'Gönder butonuna bas', isCorrect: true },
          { id: 'b', text: 'Mesajı sil', isCorrect: false, feedback: 'Mesajı silmek yerine gönder.' },
          { id: 'c', text: 'Telefonu kapat', isCorrect: false, feedback: 'Mesajı göndermek için telefonu kapatma.' },
          { id: 'd', text: 'Hiçbir şey yapma', isCorrect: false, feedback: 'Mesajı göndermek için gönder butonuna basman gerek.' }
        ],
        correctOptionId: 'a',
        previousStepId: 'step2'
      }
    ]
  },
  {
    id: 'library-visit',
    title: 'Kütüphane Ziyareti',
    description: 'Kitap arama ve ödünç alma işlemleri',
    difficulty: 'Kolay',
    icon: BookOpen,
    color: '#4ECDC4',
    completed: false,
    category: 'Toplum',
    maxScore: 50,
    steps: [
      {
        id: 'step1',
        question: 'Kütüphaneye girdin. Görevli sana "Merhaba" dedi. Sen ne dersin?',
        imageUrl: 'https://images.pexels.com/photos/590493/pexels-photo-590493.jpeg?auto=compress&cs=tinysrgb&w=800',
        options: [
          { id: 'a', text: 'Merhaba', isCorrect: true },
          { id: 'b', text: 'Kitap ver', isCorrect: false, feedback: 'Önce selam ver, sonra ne istediğini söyle.' },
          { id: 'c', text: 'Hiçbir şey söyleme', isCorrect: false, feedback: 'Selam vermek nazik olur.' },
          { id: 'd', text: 'Görüşürüz', isCorrect: false, feedback: 'Görüşürüz ayrılırken söylenir. Şimdi selam ver.' }
        ],
        correctOptionId: 'a',
        nextStepId: 'step2'
      },
      {
        id: 'step2',
        question: 'Görevli "Size nasıl yardımcı olabilirim?" diye sordu. Sen ne dersin?',
        imageUrl: 'https://images.pexels.com/photos/590493/pexels-photo-590493.jpeg?auto=compress&cs=tinysrgb&w=800',
        options: [
          { id: 'a', text: 'Kitap arıyorum', isCorrect: true },
          { id: 'b', text: 'Yemek', isCorrect: false, feedback: 'Kütüphanede yemek satılmaz. Kitap aradığını söyle.' },
          { id: 'c', text: 'Hiçbir şey söyleme', isCorrect: false, feedback: 'Ne aradığını söylemen gerek.' },
          { id: 'd', text: 'Görüşürüz', isCorrect: false, feedback: 'Henüz ayrılmıyorsun. Ne aradığını söyle.' }
        ],
        correctOptionId: 'a',
        nextStepId: 'step3',
        previousStepId: 'step1'
      },
      {
        id: 'step3',
        question: 'Görevli "Hangi tür kitap arıyorsunuz?" diye sordu. Sen ne dersin?',
        imageUrl: 'https://images.pexels.com/photos/590493/pexels-photo-590493.jpeg?auto=compress&cs=tinysrgb&w=800',
        options: [
          { id: 'a', text: 'Roman', isCorrect: true },
          { id: 'b', text: 'Yemek', isCorrect: false, feedback: 'Yemek kitap türü değil. Roman, bilim kurgu gibi bir tür söyle.' },
          { id: 'c', text: 'Hiçbir şey söyleme', isCorrect: false, feedback: 'Hangi tür kitap istediğini söylemen gerek.' },
          { id: 'd', text: 'Görüşürüz', isCorrect: false, feedback: 'Henüz ayrılmıyorsun. Kitap türünü söyle.' }
        ],
        correctOptionId: 'a',
        nextStepId: 'step4',
        previousStepId: 'step2'
      },
      {
        id: 'step4',
        question: 'Kitabı buldun. Ödünç almak için ne yaparsın?',
        imageUrl: 'https://images.pexels.com/photos/590493/pexels-photo-590493.jpeg?auto=compress&cs=tinysrgb&w=800',
        options: [
          { id: 'a', text: 'Görevliye götür', isCorrect: true },
          { id: 'b', text: 'Kitabı al ve git', isCorrect: false, feedback: 'Kitabı çalmak yanlış. Görevliye götür ve ödünç al.' },
          { id: 'c', text: 'Kitabı yere bırak', isCorrect: false, feedback: 'Kitabı yere bırakma. Görevliye götür.' },
          { id: 'd', text: 'Hiçbir şey yapma', isCorrect: false, feedback: 'Kitabı ödünç almak için görevliye götürmen gerek.' }
        ],
        correctOptionId: 'a',
        previousStepId: 'step3'
      }
    ]
  },
  {
    id: 'bus-simple',
    title: 'Otobüs Yolculuğu',
    description: 'Bilet alma ve inmek isteme',
    difficulty: 'Kolay',
    icon: Bus,
    color: '#7ED321',
    completed: false,
    category: 'Ulaşım',
    maxScore: 30,
    steps: [
      {
        id: 'step1',
        question: 'Otobüse bindin. Şoföre ne dersin?',
        imageUrl: 'https://isinolsun.com/blog/wp-content/uploads/2024/04/otobus-soforu-nasil.jpg',
        options: [
          { id: 'a', text: 'Günaydın',  isCorrect: true,  feedback: 'Nazik bir selam verdin, harika.' },
          { id: 'b', text: 'Görüşürüz', isCorrect: false, feedback: '"Görüşürüz" ayrılırken söylenir. Şimdi selam vermelisin.' },
          { id: 'c', text: 'Merhaba',   isCorrect: true,  feedback: 'Selam vermen çok iyi.' },
          { id: 'd', text: 'Hiçbir şey söyleme', isCorrect: false, feedback: 'Selam vermek nazik olur. Şoföre kısa bir selam ver.' }
        ],
        correctOptionId: ['a', 'c'],
        nextStepId: 'step2'
      },
      {
        id: 'step2',
        question: 'Şoför "Nereye gideceksiniz?" diye sordu. Sen ne dersin?',
        imageUrl: 'https://isinolsun.com/blog/wp-content/uploads/2024/04/otobus-soforu-nasil.jpg',
        options: [
          { id: 'a', text: 'Evet',    isCorrect: false, feedback: '"Evet" yeterli değil. Nereye gideceğini söylemelisin.' },
          { id: 'b', text: 'Merkez',  isCorrect: true,  feedback: 'Hedefini net söyledin.' },
          { id: 'c', text: 'Otobüs',  isCorrect: false, feedback: 'Zaten otobüstesin. Gideceğin yeri söyle.' },
          { id: 'd', text: 'Hiçbir şey söyleme', isCorrect: false, feedback: 'Şoför nereye gideceğini bilmek istiyor.' }
        ],
        correctOptionId: 'b',
        nextStepId: 'step3',
        previousStepId: 'step1'
      },
      {
        id: 'step3',
        question: 'İnmek istediğin yere geldin. Ne dersin?',
        imageUrl: 'https://isinolsun.com/blog/wp-content/uploads/2024/04/otobus-soforu-nasil.jpg',
        options: [
          { id: 'a', text: 'Merhaba',       isCorrect: false, feedback: 'Selam değil, inmek istediğini söylemelisin.' },
          { id: 'b', text: 'Teşekkürler',   isCorrect: false, feedback: 'Önce inmek istediğini söyle, sonra teşekkür edebilirsin.' },
          { id: 'c', text: 'İnecek var',    isCorrect: true,  feedback: 'Doğru, inmek istediğini söyledin.' },
          { id: 'd', text: 'Hiçbir şey söyleme', isCorrect: false, feedback: 'İnmek istediğini söylemen gerek.' }
        ],
        correctOptionId: 'c',
        previousStepId: 'step2'
      }
    ]
  },
  {
    id: 'doctor-visit',
    title: 'Doktor Ziyareti',
    description: 'Randevu alma ve muayene olma',
    difficulty: 'Zor',
    icon: Hospital,
    color: '#E74C3C',
    completed: false,
    category: 'Sağlık',
    maxScore: 100,
    steps: [
      {
        id: 'step1',
        question: 'Hastaneye geldin. Resepsiyonda ne dersin?',
        imageUrl: 'https://png.pngtree.com/background/20230330/original/pngtree-the-young-patient-at-the-reception-in-the-hospital-young-patient-picture-image_2213192.jpg',
        options: [
          { id: 'a', text: 'Doktor nerede?',            isCorrect: false, feedback: 'Önce selam verip randevun olduğunu söylemelisin.' },
          { id: 'b', text: 'Merhaba, randevum var',      isCorrect: true,  feedback: 'Harika, nazikçe randevunu belirttin.' },
          { id: 'c', text: 'Hasta olmak istiyorum',      isCorrect: false, feedback: 'Randevun olduğunu söylemek daha uygun.' },
          { id: 'd', text: 'Hiçbir şey söyleme',         isCorrect: false, feedback: 'Resepsiyonistle iletişim kurman gerekiyor.' }
        ],
        correctOptionId: 'b',
        nextStepId: 'step2'
      },
      {
        id: 'step2',
        question: 'Resepsiyonist "Adınız ve soyadınız?" diye sordu. Sen ne dersin?',
        imageUrl: 'https://png.pngtree.com/background/20230330/original/pngtree-the-young-patient-at-the-reception-in-the-hospital-young-patient-picture-image_2213192.jpg',
        options: [
          { id: 'a', text: 'Merhaba',                   isCorrect: false, feedback: 'Sorulan adın ve soyadın. Onu söylemelisin.' },
          { id: 'b', text: 'Doktor Dr. Mehmet',         isCorrect: false, feedback: 'Senin adını soruyor, doktorun adını değil.' },
          { id: 'c', text: 'Ahmet Yılmaz',              isCorrect: true,  feedback: 'Doğru, adını söyledin.' },
          { id: 'd', text: 'Hiçbir şey söyleme',        isCorrect: false, feedback: 'Adını söylemen gerek.' }
        ],
        correctOptionId: 'c',
        previousStepId: 'step1',
        nextStepId: 'step3'
      },
      {
        id: 'step3',
        question: 'Resepsiyonist "Hangi doktora randevunuz var?" diye sordu. Sen ne dersin?',
        imageUrl: 'https://png.pngtree.com/background/20230330/original/pngtree-the-young-patient-at-the-reception-in-the-hospital-young-patient-picture-image_2213192.jpg',
        options: [
          { id: 'a', text: 'Dr. Mehmet Bey',  isCorrect: true,  feedback: 'Doktorun adını doğru söyledin.' },
          { id: 'b', text: 'Doktor',          isCorrect: false, feedback: 'Hangi doktor olduğunu söylemelisin.' },
          { id: 'c', text: 'Kardiyoloji',     isCorrect: false, feedback: 'Doktorun adını soruyor, bölümünü değil.' },
          { id: 'd', text: 'Hiçbir şey söyleme', isCorrect: false, feedback: 'Doktorun adını belirtmelisin.' }
        ],
        correctOptionId: 'a',
        previousStepId: 'step2',
        nextStepId: 'step4'
      },
      {
        id: 'step4',
        question: 'Resepsiyonist "Saat 14:00\'te randevunuz var. Bekleme salonuna geçebilirsiniz" dedi. Sen ne dersin?',
        imageUrl: 'https://png.pngtree.com/background/20230330/original/pngtree-the-young-patient-at-the-reception-in-the-hospital-young-patient-picture-image_2213192.jpg',
        options: [
          { id: 'a', text: 'Tamam',            isCorrect: false, feedback: 'Teşekkür etmek daha nazik olur.' },
          { id: 'b', text: 'Nerede?',          isCorrect: false, feedback: 'Önce teşekkür edebilir, sonra yerini sorabilirsin.' },
          { id: 'c', text: 'Teşekkür ederim',  isCorrect: true,  feedback: 'Nazikçe teşekkür ettin.' },
          { id: 'd', text: 'Hiçbir şey söyleme', isCorrect: false, feedback: 'Kısa da olsa teşekkür etmek önemli.' }
        ],
        correctOptionId: 'c',
        previousStepId: 'step3',
        nextStepId: 'step5'
      },
      {
        id: 'step5',
        question: 'Bekleme salonunda oturuyorsun. Hemşire "Ahmet Yılmaz" diye seslendi. Sen ne dersin?',
        imageUrl: 'https://media.istockphoto.com/id/1198224204/tr/fotoğraf/hastanede-tablet-kullanan-kadın-hemşire-portresi.jpg?s=612x612&w=0&k=20&c=KC5HuIPyyvVx5THDqlcOpQG1SKmrKSF13dkML0FeeIk=',
        options: [
          { id: 'a', text: 'Evet',       isCorrect: false, feedback: '"Burada" demek daha uygun.' },
          { id: 'b', text: 'Burada',     isCorrect: true,  feedback: 'Doğru, adını duyunca cevap verdin.' },
          { id: 'c', text: 'Merhaba',    isCorrect: false, feedback: 'Daha net olmalısın: "Burada" de.' },
          { id: 'd', text: 'Hiçbir şey söyleme', isCorrect: false, feedback: 'Sana seslenildi, cevap vermelisin.' }
        ],
        correctOptionId: 'b',
        previousStepId: 'step4',
        nextStepId: 'step6'
      },
      {
        id: 'step6',
        question: 'Doktor odasına girdin. Doktor "Merhaba, nasılsınız?" diye sordu. Sen ne dersin?',
        imageUrl: 'https://trthaberstatic.cdn.wp.trt.com.tr/resimler/2202000/down-sendromlu-malatya-aa-2203228.jpg',
        options: [
          { id: 'a', text: 'Hasta',                            isCorrect: false, feedback: 'Önce selam verip nasıl olduğunu söyle.' },
          { id: 'b', text: 'Karnım ağrıyor',                   isCorrect: false, feedback: 'Önce selam ver, sonra şikayetini anlat.' },
          { id: 'c', text: 'Merhaba doktor bey, iyiyim teşekkürler', isCorrect: true,  feedback: 'Nazik bir şekilde yanıt verdin.' },
          { id: 'd', text: 'Hiçbir şey söyleme',               isCorrect: false, feedback: 'Doktorla konuşmalısın.' }
        ],
        correctOptionId: 'c',
        previousStepId: 'step5',
        nextStepId: 'step7'
      },
      {
        id: 'step7',
        question: 'Doktor "Şikayetiniz nedir?" diye sordu. Sen ne dersin?',
        imageUrl: 'https://trthaberstatic.cdn.wp.trt.com.tr/resimler/2202000/down-sendromlu-malatya-aa-2203228.jpg',
        options: [
          { id: 'a', text: 'Hasta',                          isCorrect: false, feedback: 'Hangi şikayetin olduğunu söylemelisin.' },
          { id: 'b', text: 'İlaç ver',                       isCorrect: false, feedback: 'Önce şikayetini anlat, doktor karar verir.' },
          { id: 'c', text: 'Karnım ağrıyor ve mide bulantım var', isCorrect: true,  feedback: 'Şikayetini açıkça belirttin.' },
          { id: 'd', text: 'Hiçbir şey söyleme',             isCorrect: false, feedback: 'Şikayetini söylemen gerek.' }
        ],
        correctOptionId: 'c',
        previousStepId: 'step6',
        nextStepId: 'step8'
      },
      {
        id: 'step8',
        question: 'Doktor "Ne kadar zamandır bu şikayetleriniz var?" diye sordu. Sen ne dersin?',
        imageUrl: 'https://trthaberstatic.cdn.wp.trt.com.tr/resimler/2202000/down-sendromlu-malatya-aa-2203228.jpg',
        options: [
          { id: 'a', text: 'Evet',         isCorrect: false, feedback: 'Süre belirtmelisin.' },
          { id: 'b', text: 'Çok',          isCorrect: false, feedback: 'Daha net bir süre söylemelisin.' },
          { id: 'c', text: '2 gündür',     isCorrect: true,  feedback: 'Süreyi net söyledin.' },
          { id: 'd', text: 'Hiçbir şey söyleme', isCorrect: false, feedback: 'Süre belirtmen gerek.' }
        ],
        correctOptionId: 'c',
        previousStepId: 'step7',
        nextStepId: 'step9'
      },
      {
        id: 'step9',
        question: 'Doktor "Muayene olmanız gerekiyor" dedi. Sen ne dersin?',
        imageUrl: 'https://hukukihabernet.teimg.com/crop/1280x720/hukukihaber-net/images/haberler/2019/03/down_sendromlu_cocuklar_doktor_oldu.jpg',
        options: [
          { id: 'a', text: 'Hayır',              isCorrect: false, feedback: 'Doktorun önerisini kabul etmelisin.' },
          { id: 'b', text: 'İlaç ver',           isCorrect: false, feedback: 'Önce muayene, sonra ilaç.' },
          { id: 'c', text: 'Tamam doktor bey',   isCorrect: true,  feedback: 'Kabul ettin, doğru.' },
          { id: 'd', text: 'Hiçbir şey söyleme', isCorrect: false, feedback: 'Doktora cevap vermelisin.' }
        ],
        correctOptionId: 'c',
        previousStepId: 'step8',
        nextStepId: 'step10'
      },
      {
        id: 'step10',
        question: 'Muayene bitti. Doktor "İlaç yazıyorum, 3 gün kullanacaksınız" dedi. Sen ne dersin?',
        imageUrl: 'https://trthaberstatic.cdn.wp.trt.com.tr/resimler/2202000/down-sendromlu-malatya-aa-2203228.jpg',
        options: [
          { id: 'a', text: 'Tamam',                  isCorrect: false, feedback: 'Teşekkür etmek daha nazik olur.' },
          { id: 'b', text: 'Başka ilaç yok mu?',     isCorrect: false, feedback: 'Önce teşekkür edip sonra sorabilirsin.' },
          { id: 'c', text: 'Teşekkür ederim doktor bey', isCorrect: true,  feedback: 'Nazikçe teşekkür ettin.' },
          { id: 'd', text: 'Hiçbir şey söyleme',     isCorrect: false, feedback: 'Teşekkür etmek uygun olur.' }
        ],
        correctOptionId: 'c',
        previousStepId: 'step9'
      }
    ]
  },
  {
    id: 'restoranda-siparis-verme',
    title: 'Restoranda Sipariş Verme',
    description: 'Garsonla konuşup yemeğini sipariş etme',
    difficulty: 'Kolay',
    icon: Utensils,
    color: '#FFD180',
    completed: false,
    category: 'Günlük',
    maxScore: 60,
    steps: [
      {
        id: 'rest-1',
        question: 'Garson "Hoş geldiniz" diyor. Ne söylersin?',
        imageUrl: 'https://cdnlnd.adisyo.com/_next/image?url=%2Fstatic%2Fblog%2Fblog-47.png&w=1080&q=100',
        options: [
          { id: 'a', text: 'Merhaba, bir masa istiyorum', isCorrect: true,  feedback: 'Nazikçe masa istediğin için çok iyi.' },
          { id: 'b', text: 'Sessiz kalırım',              isCorrect: false, feedback: 'Nazikçe cevap vermek iletişimi başlatır.' },
          { id: 'c', text: 'Gitmek istiyorum',            isCorrect: false, feedback: 'İçeri girdin, masa istemen gerekir.' },
          { id: 'd', text: 'Fiyatlar ne?',                isCorrect: false, feedback: 'Önce selam verip masa isteyebilirsin.' }
        ],
        correctOptionId: 'a',
        nextStepId: 'rest-2'
      },
      {
        id: 'rest-2',
        question: 'Garson menüyü veriyor. Ne yaparsın?',
        imageUrl: 'https://cdnlnd.adisyo.com/_next/image?url=%2Fstatic%2Fblog%2Fblog-47.png&w=1080&q=100',
        options: [
          { id: 'a', text: 'Teşekkür ederim, bakıyorum', isCorrect: true,  feedback: 'Menüyü alıp teşekkür ettin, harika.' },
          { id: 'b', text: 'Menüyü yere atarım',         isCorrect: false, feedback: 'Nazik olmak önemli, menüyü düzgünce al.' },
          { id: 'c', text: 'Hiç bakmadan sipariş veririm', isCorrect: false, feedback: 'Ne istediğini görmek için menüye bakmalısın.' },
          { id: 'd', text: 'Menüyü garsona geri veririm', isCorrect: false, feedback: 'Önce yiyeceğini seçmelisin.' }
        ],
        correctOptionId: 'a',
        previousStepId: 'rest-1',
        nextStepId: 'rest-3'
      },
      {
        id: 'rest-3',
        question: 'Sipariş vermek istiyorsun. Ne söylersin?',
        imageUrl: 'https://marketplace.canva.com/EAGRGRmCFk4/1/0/1131w/canva-siyah-modern-restoran-kafe-menü-CpsLI_OGchQ.jpg',
        options: [
          { id: 'a', text: 'Bir tavuk istiyorum', isCorrect: true,  feedback: 'Siparişini net verdin, güzel.' },
          { id: 'b', text: 'Hiçbir şey istemiyorum',     isCorrect: false, feedback: 'Bir şey yemek için geldin, sipariş ver.' },
          { id: 'c', text: 'Sadece bakıyorum',           isCorrect: false, feedback: 'Hazırsan sipariş verebilirsin.' },
          { id: 'd', text: 'Parayı şimdi veririm',       isCorrect: false, feedback: 'Önce sipariş, sonra ödeme gelir.' }
        ],
        correctOptionId: 'a',
        previousStepId: 'rest-2',
        nextStepId: 'rest-4'
      },
      {
        id: 'rest-4',
        question: 'Garson "İçecek ister misiniz?" diyor. Ne dersin?',
        imageUrl: 'https://marketplace.canva.com/EAGRGRmCFk4/1/0/1131w/canva-siyah-modern-restoran-kafe-menü-CpsLI_OGchQ.jpg',
        options: [
          { id: 'a', text: 'Evet, su alırım',   isCorrect: true,  feedback: 'İçecek isteğini net belirttin.' },
          { id: 'b', text: 'Hiç konuşmam',      isCorrect: false, feedback: 'Cevap vermek siparişi tamamlar.' },
          { id: 'c', text: 'Sadece tatlı istiyorum', isCorrect: false, feedback: 'Şu an içecek soruldu, ona cevap ver.' },
          { id: 'd', text: 'Masayı değiştir',   isCorrect: false, feedback: 'Şu an içecek hakkında konuşuyorsunuz.' }
        ],
        correctOptionId: 'a',
        previousStepId: 'rest-3',
        nextStepId: 'rest-5'
      },
      {
        id: 'rest-5',
        question: 'Yemeğin geldi. Ne söylersin?',
        imageUrl: 'https://i.ytimg.com/vi/3wo7qr6PIU4/sddefault.jpg',
        options: [
          { id: 'a', text: 'Teşekkür ederim',   isCorrect: true,  feedback: 'Nazik bir teşekkür ettin.' },
          { id: 'b', text: 'Hiçbir şey söylemem', isCorrect: false, feedback: 'Teşekkür etmek nazik bir davranıştır.' },
          { id: 'c', text: 'Neden bu geldi?',   isCorrect: false, feedback: 'Siparişini aldın, teşekkür edebilirsin.' },
          { id: 'd', text: 'Yemeği ittiririm',  isCorrect: false, feedback: 'Nazik olmak her zaman önemlidir.' }
        ],
        correctOptionId: 'a',
        previousStepId: 'rest-4',
        nextStepId: 'rest-6'
      },
      {
        id: 'rest-6',
        question: 'Garson "Başka bir şey ister misiniz?" diyor. Ne dersin?',
        imageUrl: 'https://i.ytimg.com/vi/3wo7qr6PIU4/sddefault.jpg',
        options: [
          { id: 'a', text: 'Hayır, teşekkürler',  isCorrect: true,  feedback: 'Nazikçe reddettin.' },
          { id: 'b', text: 'Seni ilgilendirmez',  isCorrect: false, feedback: 'Nazikçe cevap vermek daha uygun.' },
          { id: 'c', text: 'Yemeği değiştir',     isCorrect: false, feedback: 'Memnunsan bunu söylemene gerek yok.' },
          { id: 'd', text: 'Konuşmak istemiyorum', isCorrect: false, feedback: 'Soruyu nazikçe cevaplamalısın.' }
        ],
        correctOptionId: 'a',
        previousStepId: 'rest-5',
        nextStepId: 'rest-7'
      },
      {
        id: 'rest-7',
        question: 'Hesap istiyorsun. Ne söylersin?',
        imageUrl: 'https://productimages.hepsiburada.net/s/40/375-375/10654823710770.jpg',
        options: [
          { id: 'a', text: 'Hesabı alabilir miyim?', isCorrect: true,  feedback: 'Nazikçe hesabı istedin.' },
          { id: 'b', text: 'Gitmek istiyorum',       isCorrect: false, feedback: 'Hesabı istemek daha doğru olur.' },
          { id: 'c', text: 'Bana menü ver',          isCorrect: false, feedback: 'Artık ödeme zamanı, menü değil.' },
          { id: 'd', text: 'Sessizce kalkarım',      isCorrect: false, feedback: 'Önce hesabı istemelisin.' }
        ],
        correctOptionId: 'a',
        previousStepId: 'rest-6'
      }
    ]
  },
  {
    id: 'eczane-ilac-alma',
    title: 'Eczaneden İlaç Alma',
    description: 'Eczacıyla konuşup ilacını güvenle alma',
    difficulty: 'Orta',
    icon: Pill,
    color: '#2196F3',
    completed: false,
    category: 'Sağlık',
    maxScore: 160,
    steps: [
      {
        id: 'ecz-1',
        question: 'Eczaneye girdin, görevli "Buyurun" diyor. Ne dersin?',
        imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQknxtVELycC01Ql7z_ddOUOFdfY5241ViDXg&s',
        options: [
          { id: 'a', text: 'Merhaba, ilacim var', isCorrect: true,  feedback: 'Nazikçe ihtiyacını belirttin.' },
          { id: 'b', text: 'Sessizce dolaşırım',    isCorrect: false, feedback: 'İhtiyacını söylemek için konuşmalısın.' },
          { id: 'c', text: 'İlaç yok',              isCorrect: false, feedback: 'İlaç almaya geldiğini belirtmelisin.' },
          { id: 'd', text: 'Çıkıyorum',             isCorrect: false, feedback: 'Daha yeni girdin, ihtiyacını söyle.' }
        ],
        correctOptionId: ['a'],
        nextStepId: 'ecz-2'
      },
      {
        id: 'ecz-2',
        question: 'Eczacı "Reçeteniz var mı?" diyor. Ne yaparsın?',
        imageUrl: 'https://eczacininsesi.com/haber/kucuk/058466ea71665d709fb2c5a093e297c3.jpg',
        options: [
          { id: 'a', text: 'Reçetemi gösteririm', isCorrect: true,  feedback: 'Doğru, reçeteyi gösterdin.' },
          { id: 'b', text: 'Saklarım',            isCorrect: false, feedback: 'Reçeteyi göstermek gerekir.' },
          { id: 'c', text: 'Başka ilacı sorarım', isCorrect: false, feedback: 'Önce bu ilacı halletmelisin.' },
          { id: 'd', text: 'Hiç cevap vermem',    isCorrect: false, feedback: 'Nazikçe cevap verip reçeteyi göster.' }
        ],
        correctOptionId: ['a'],
        previousStepId: 'ecz-1',
        nextStepId: 'ecz-3'
      },
      {
        id: 'ecz-3',
        question: 'Eczacı ilacı buluyor. "Günde kaç kez kullanacaksın?" diyor.',
        imageUrl: 'https://eczacininsesi.com/haber/kucuk/058466ea71665d709fb2c5a093e297c3.jpg',
        options: [
          { id: 'a', text: 'Doktor günde iki kez dedi', isCorrect: true,  feedback: 'Doğru dozu aktardın.' },
          { id: 'b', text: 'Bilmiyorum, rastgele içerim', isCorrect: false, feedback: 'Doz bilgisi önemlidir, doktorun dediğini söyle.' },
          { id: 'c', text: 'Her saat içerim',            isCorrect: false, feedback: 'Aşırı kullanım zararlıdır, doğru dozu söyle.' },
          { id: 'd', text: 'Hiç içmem',                  isCorrect: false, feedback: 'İlaç doktorun dediği şekilde kullanılmalı.' }
        ],
        correctOptionId: ['a'],
        previousStepId: 'ecz-2',
        nextStepId: 'ecz-4'
      },
      {
        id: 'ecz-4',
        question: 'Eczacı "Yemekten önce mi sonra mı?" diyor. Ne söylersin?',
        imageUrl: 'https://eczacininsesi.com/haber/kucuk/058466ea71665d709fb2c5a093e297c3.jpg',
        options: [
          { id: 'a', text: 'Yemekten sonra kullanacağım', isCorrect: true,  feedback: 'Doğru zamanlamayı söyledin.' },
          { id: 'b', text: 'Hiç bilmiyorum',              isCorrect: false, feedback: 'Bilmiyorsan doktorun dediğini hatırla veya sor.' },
          { id: 'c', text: 'Aç karna 5 kez',              isCorrect: false, feedback: 'Doğru bilgiyi söylemen önemli.' },
          { id: 'd', text: 'İlacımı atarım',              isCorrect: false, feedback: 'İlaçları atmak doğru değil.' }
        ],
        correctOptionId: ['a'],
        previousStepId: 'ecz-3',
        nextStepId: 'ecz-5'
      },
      {
        id: 'ecz-5',
        question: 'Eczacı "Yan etki olursa ne yapacaksınız?" diye soruyor. Ne dersin?',
        imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSSpWeMi82L4ArChb8lrNPTipeIGvI3xRsnjg&s',
        options: [
          { id: 'a', text: 'Baş dönmesi olursa sizi ararım', isCorrect: true,  feedback: 'Yan etkide ne yapacağını biliyorsun.' },
          { id: 'b', text: 'Hiç fark etmez',                 isCorrect: false, feedback: 'Yan etkileri ciddiye almak gerekir.' },
          { id: 'c', text: 'Yanıt vermem',                   isCorrect: false, feedback: 'Eczacıya bilgi vermek önemlidir.' },
          { id: 'd', text: 'Her yan etki iyidir',            isCorrect: false, feedback: 'Yan etkiler iyi değildir, dikkat etmelisin.' }
        ],
        correctOptionId: ['a'],
        previousStepId: 'ecz-4',
        nextStepId: 'ecz-6'
      },
      {
        id: 'ecz-6',
        question: 'Eczacı "Başka ilaç kullanıyor musunuz?" diyor.',
        imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSSpWeMi82L4ArChb8lrNPTipeIGvI3xRsnjg&s',
        options: [
          { id: 'a', text: 'Evet, vitamin kullanıyorum', isCorrect: true,  feedback: 'Doğru bilgi vermek güvenli.' },
          { id: 'b', text: 'Söylemem',                   isCorrect: false, feedback: 'Kullandığın ilaçları söylemek gerekir.' },
          { id: 'c', text: 'Yalan söylerim',             isCorrect: false, feedback: 'Doğru bilgi vermek sağlığın için şart.' },
          { id: 'd', text: 'Hepsini bırakırım',          isCorrect: false, feedback: 'Eczacıya danışmadan bırakma.' }
        ],
        correctOptionId: ['a'],
        previousStepId: 'ecz-5',
        nextStepId: 'ecz-7'
      },
      {
        id: 'ecz-7',
        question: 'Eczacı "İlaç bitince tekrar gel" diyor. Ne dersin?',
        imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSSpWeMi82L4ArChb8lrNPTipeIGvI3xRsnjg&s',
        options: [
          { id: 'a', text: 'Tamam, teşekkür ederim', isCorrect: true,  feedback: 'Nazikçe teşekkür ettin.' },
          { id: 'b', text: 'Hayır gelmem',           isCorrect: false, feedback: 'Gerekirse tekrar gelmek önemlidir.' },
          { id: 'c', text: 'İstemiyorum',            isCorrect: false, feedback: 'Nazikçe cevap vermelisin.' },
          { id: 'd', text: 'Sessizce giderim',       isCorrect: false, feedback: 'Cevap vermek daha uygundur.' }
        ],
        correctOptionId: ['a'],
        previousStepId: 'ecz-6',
        nextStepId: 'ecz-8'
      },
      {
        id: 'ecz-8',
        question: 'Ödeme zamanı. "Kart mı nakit mi?" deniyor.',
        imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_dclpcf6s33MgMlubcwcPuMi31GlIj5CpKA&s',
        options: [
          { id: 'a', text: 'Kart ile ödeyeyim',   isCorrect: true,  feedback: 'Kartla ödemeyi seçtin.' },
          { id: 'b', text: 'Nakit ödeyeceğim',    isCorrect: true,  feedback: 'Nakit ödemeyi seçtin.' },
          { id: 'c', text: 'Ödemem',              isCorrect: false, feedback: 'İlaç için ödeme yapmak gerekir.' },
          { id: 'd', text: 'Sonra öderim',        isCorrect: false, feedback: 'Şimdi ödemen daha doğru.' }
        ],
        correctOptionId: ['a', 'b'],
        nextStepMap: {
          a: 'ecz-9_card',
          b: 'ecz-9_cash'
        },
        previousStepId: 'ecz-7'
      },
      {
        id: 'ecz-9_card',
        question: 'POS cihazı kartı okumanı istiyor. Ne yaparsın?',
        imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_dclpcf6s33MgMlubcwcPuMi31GlIj5CpKA&s',
        options: [
          { id: 'a', text: 'Kartımı cihaza dokundururum', isCorrect: true,  feedback: 'Ödemeyi başlattın.' },
          { id: 'b', text: 'Kartı cebime saklarım',       isCorrect: false, feedback: 'Ödeme için kartı kullanmalısın.' },
          { id: 'c', text: 'Kartı kasiyere atarım',       isCorrect: false, feedback: 'Nazikçe kartını okutmalısın.' },
          { id: 'd', text: 'Hiçbir şey yapmam',           isCorrect: false, feedback: 'Ödeme tamamlanmaz, hareket etmelisin.' }
        ],
        correctOptionId: ['a'],
        nextStepId: 'ecz-10_pin'
      },
      {
        id: 'ecz-10_pin',
        question: 'Şifre istendi. Ne yaparsın?',
        imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_dclpcf6s33MgMlubcwcPuMi31GlIj5CpKA&s',
        options: [
          { id: 'a', text: 'Şifremi girerim',            isCorrect: true,  feedback: 'Şifreni gizli şekilde girdin.' },
          { id: 'b', text: 'Şifreyi yüksek sesle söylerim', isCorrect: false, feedback: 'Şifren gizli kalmalı, sadece tuşla.' },
          { id: 'c', text: 'Şifreyi yanlış girerim',     isCorrect: false, feedback: 'Doğru şifreyi girmelisin.' },
          { id: 'd', text: 'Kartı çıkarırım',            isCorrect: false, feedback: 'İşlem bitmeden kartı çıkarmamalısın.' }
        ],
        correctOptionId: ['a'],
        nextStepId: 'ecz-11_receipt',
        previousStepId: 'ecz-9_card'
      },
      {
        id: 'ecz-9_cash',
        question: 'Eczacı toplam tutarı söyledi. Ne yaparsın?',
        imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_dclpcf6s33MgMlubcwcPuMi31GlIj5CpKA&s',
        options: [
          { id: 'a', text: 'Parayı uzatır ve "Buyurun" derim', isCorrect: true,  feedback: 'Doğru, parayı verirsin.' },
          { id: 'b', text: 'Kartımı okutayım',                 isCorrect: false, feedback: 'Nakit seçmiştin, tutarlı olmalısın.' },
          { id: 'c', text: 'Hiçbir şey söylemeden beklerim',    isCorrect: false, feedback: 'Kasiyerin anlaması için parayı vermelisin.' },
          { id: 'd', text: 'Üstü kalsın',                      isCorrect: false, feedback: 'Bu durumda uygun değil.' }
        ],
        correctOptionId: ['a'],
        nextStepId: 'ecz-9b_cash_change',
        previousStepId: 'ecz-8'
      },
      {
        id: 'ecz-9b_cash_change',
        question: 'Eczacı para üstünü verdi ve "Buyurun" dedi. Ne dersin?',
        imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_dclpcf6s33MgMlubcwcPuMi31GlIj5CpKA&s',
        options: [
          { id: 'a', text: 'Teşekkür ederim',        isCorrect: true,  feedback: 'Nazikçe teşekkür ettin.' },
          { id: 'b', text: 'Para üstünü saymam',     isCorrect: false, feedback: 'Kısaca kontrol etmek iyi olur ama teşekkür etmeyi unutma.' },
          { id: 'c', text: 'Hiçbir şey söyleme',     isCorrect: false, feedback: 'Teşekkür etmek önemli bir sosyal beceridir.' },
          { id: 'd', text: 'Para yetmedi mi?',       isCorrect: false, feedback: 'Kasiyer sana para üstünü verdi, karışıklık yok.' }
        ],
        correctOptionId: ['a'],
        nextStepId: 'ecz-11_receipt'
      },
      {
        id: 'ecz-11_receipt',
        question: 'Ödeme tamam. Eczacı "Fiş ister misiniz?" diyor.',
        imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_dclpcf6s33MgMlubcwcPuMi31GlIj5CpKA&s',
        options: [
          { id: 'a', text: 'Evet, lütfen verin', isCorrect: true,  feedback: 'Fiş almak gelecekte işe yarayabilir.' },
          { id: 'b', text: 'Çöpe atın',          isCorrect: false, feedback: 'Fiş gerekebilir, almak iyi olur.' },
          { id: 'c', text: 'Ne fişi?',           isCorrect: false, feedback: 'Fiş ödeme belgesidir, isteyebilirsin.' },
          { id: 'd', text: 'Konuşmam',           isCorrect: false, feedback: 'Nazikçe cevap ver.' }
        ],
        correctOptionId: ['a'],
        nextStepId: 'ecz-12_check'
      },
      {
        id: 'ecz-12_check',
        question: 'Poşeti alırken ilacını kontrol eder misin?',
        imageUrl: 'https://www.eczanesitesi.com/assets/uploads/7087-r6ae64.webp',
        options: [
          { id: 'a', text: 'Evet, doğru ilacı kontrol ederim', isCorrect: true,  feedback: 'Kontrol etmek hata riskini azaltır.' },
          { id: 'b', text: 'Bakmadan çıkarım',                  isCorrect: false, feedback: 'Kontrol etmek önemli.' },
          { id: 'c', text: 'Poşeti bırakırım',                  isCorrect: false, feedback: 'İlacını almadan çıkmamalısın.' },
          { id: 'd', text: 'Başka ilaç eklerim',                isCorrect: false, feedback: 'Gereksiz ilaç almamalısın.' }
        ],
        correctOptionId: ['a'],
        nextStepId: 'ecz-13_goodbye'
      },
      {
        id: 'ecz-13_goodbye',
        question: 'Eczacı "Geçmiş olsun" diyor. Ne söylersin?',
        imageUrl: 'https://www.eczanesitesi.com/assets/uploads/7087-r6ae64.webp',
        options: [
          { id: 'a', text: 'Teşekkür ederim, iyi günler', isCorrect: true,  feedback: 'Nazikçe teşekkür ettin.' },
          { id: 'b', text: 'Cevap vermem',               isCorrect: false, feedback: 'Nazikçe teşekkür etmek uygun olur.' },
          { id: 'c', text: 'Kızarım',                    isCorrect: false, feedback: 'Nazik bir söze nazikçe cevap vermelisin.' },
          { id: 'd', text: 'Poşeti bırakırım',           isCorrect: false, feedback: 'Poşetini alıp teşekkür edebilirsin.' }
        ],
        correctOptionId: ['a'],
        nextStepId: 'ecz-14_exit'
      },
      {
        id: 'ecz-14_exit',
        question: 'Eczaneden çıkmadan önce ne yaparsın?',
        imageUrl: 'https://www.eczanesitesi.com/assets/uploads/7087-r6ae64.webp',
        options: [
          { id: 'a', text: 'Kapıdan dikkatle çıkarım', isCorrect: true,  feedback: 'Dikkatli çıkmak güvenlidir.' },
          { id: 'b', text: 'Koşarak çıkarım',         isCorrect: false, feedback: 'Sakin ve dikkatli çıkmak daha güvenlidir.' },
          { id: 'c', text: 'Poşeti bırakırım',        isCorrect: false, feedback: 'İlacını yanında götürmelisin.' },
          { id: 'd', text: 'Eczanede otururum',       isCorrect: false, feedback: 'İşin bitti, çıkabilirsin.' }
        ],
        correctOptionId: ['a'],
        previousStepId: 'ecz-13_goodbye'
      }
    ]
  },
  {
    id: 'tren-yolculugu-bilet-kontrolu',
    title: 'Tren Yolculuğu ve Bilet Kontrolü',
    description: 'Bilet alıp trene binme ve yolculuğu tamamlama',
    difficulty: 'Zor',
    icon: Train,
    color: '#4CAF50',
    completed: false,
    category: 'Toplum',
    maxScore: 200,
    steps: [
      {
        id: 'tren-1',
        question: 'Gara girdin. Gişeyi bulman gerekiyor. Ne yaparsın?',
        imageUrl: 'https://images.unsplash.com/photo-1505842465776-3f8a8e0aebf2',
        options: [
          { id: 'a', text: 'Görevliye gişeyi sorarım', isCorrect: true,  feedback: 'Yardım istemek zamanı kazandırır.' },
          { id: 'b', text: 'Sessizce dolaşırım',       isCorrect: false, feedback: 'Sormak daha hızlı ve doğru olur.' },
          { id: 'c', text: 'Yanlış yöne giderim',      isCorrect: false, feedback: 'Sormak yerine rastgele gitmek zaman kaybettirir.' },
          { id: 'd', text: 'Hemen dışarı çıkarım',     isCorrect: false, feedback: 'Bilet almak için içeride kalmalısın.' }
        ],
        correctOptionId: 'a',
        nextStepId: 'tren-2'
      },
      {
        id: 'tren-2',
        question: 'Gişeye geldin. "Nereye gideceksiniz?" diye soruyorlar.',
        imageUrl: 'https://images.unsplash.com/photo-1562184552-08a38e5bc198',
        options: [
          { id: 'a', text: "İzmir'e gitmek istiyorum", isCorrect: true,  feedback: 'Hedefini net söyledin.' },
          { id: 'b', text: 'Bilmiyorum',                isCorrect: false, feedback: 'Nereye gideceğini söylemelisin.' },
          { id: 'c', text: 'Para yok',                  isCorrect: false, feedback: 'Önce nereye gideceğini söyle.' },
          { id: 'd', text: 'Sessiz kalırım',            isCorrect: false, feedback: 'Cevap vermen gerekiyor.' }
        ],
        correctOptionId: 'a',
        previousStepId: 'tren-1',
        nextStepId: 'tren-3'
      },
      {
        id: 'tren-3',
        question: 'Gişe "Tek yön mü, gidiş-dönüş mü?" diye soruyor.',
        imageUrl: 'https://images.unsplash.com/photo-1518544887878-6d5ceaf2d6c5',
        options: [
          { id: 'a', text: 'Tek yön bilet istiyorum', isCorrect: true,  feedback: 'Seçimini net yaptın.' },
          { id: 'b', text: 'Hiçbiri',                 isCorrect: false, feedback: 'Birini seçmelisin.' },
          { id: 'c', text: 'Ben karar vermem',        isCorrect: false, feedback: 'Gitmek için karar vermelisin.' },
          { id: 'd', text: 'Hemen gidiyorum',         isCorrect: false, feedback: 'Bilet almadan gidemezsin.' }
        ],
        correctOptionId: 'a',
        previousStepId: 'tren-2',
        nextStepId: 'tren-4'
      },
      {
        id: 'tren-4',
        question: 'Ödeme zamanı. "Kart mı nakit mi?" diye soruluyor.',
        imageUrl: 'https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1',
        options: [
          { id: 'a', text: 'Kart ile ödeyeyim', isCorrect: true,  feedback: 'Kartla ödemeyi seçtin.' },
          { id: 'b', text: 'Nakit ödemek istemiyorum', isCorrect: false, feedback: 'Bir ödeme yöntemi seçmelisin.' },
          { id: 'c', text: 'Sonra öderim',     isCorrect: false, feedback: 'Şimdi ödemen gerekiyor.' },
          { id: 'd', text: 'Parayı saklarım',  isCorrect: false, feedback: 'Ödeme yapmalısın.' }
        ],
        correctOptionId: 'a',
        previousStepId: 'tren-3',
        nextStepId: 'tren-5'
      },
      {
        id: 'tren-5',
        question: 'POS cihazı kartı okutmanı istiyor. Ne yaparsın?',
        imageUrl: 'https://images.unsplash.com/photo-1523289333742-be1143f6b766',
        options: [
          { id: 'a', text: 'Kartımı cihaza tutarım', isCorrect: true,  feedback: 'Ödemeyi başlattın.' },
          { id: 'b', text: 'Kartı vermem',           isCorrect: false, feedback: 'Ödeme için kartı kullanmalısın.' },
          { id: 'c', text: 'Yanlış kart kullanırım', isCorrect: false, feedback: 'Doğru kartı kullanmak gerekir.' },
          { id: 'd', text: 'Hiçbir şey yapmam',      isCorrect: false, feedback: 'Ödeme tamamlanmaz, işlem yapmalısın.' }
        ],
        correctOptionId: 'a',
        previousStepId: 'tren-4',
        nextStepId: 'tren-6'
      },
      {
        id: 'tren-6',
        question: 'Biletini aldın. "Peron 3" yazıyor. Ne yaparsın?',
        imageUrl: 'https://images.unsplash.com/photo-1505842465776-3f8a8e0aebf2',
        options: [
          { id: 'a', text: "Peron 3'e giderim", isCorrect: true,  feedback: 'Doğru perona gidiyorsun.' },
          { id: 'b', text: "Peron 1'e giderim", isCorrect: false, feedback: 'Biletindeki perona gitmelisin.' },
          { id: 'c', text: 'Otobüse binerim',   isCorrect: false, feedback: 'Trenle gidiyorsun, perona git.' },
          { id: 'd', text: 'Bekleme salonuna saklanırım', isCorrect: false, feedback: 'Treni kaçırmamak için perona gitmelisin.' }
        ],
        correctOptionId: 'a',
        previousStepId: 'tren-5',
        nextStepId: 'tren-7'
      },
      {
        id: 'tren-7',
        question: 'Peronda tren bekliyorsun. Anons yapılıyor. Ne yaparsın?',
        imageUrl: 'https://images.unsplash.com/photo-1526413232644-2b6d2d2b6b86',
        options: [
          { id: 'a', text: 'Anonsu dikkatle dinlerim', isCorrect: true,  feedback: 'Anonslar önemli bilgi içerir.' },
          { id: 'b', text: 'Kulaklık takıp duymam',     isCorrect: false, feedback: 'Anonsu duyman gerekir.' },
          { id: 'c', text: 'Koşarak perondan çıkarım',  isCorrect: false, feedback: 'Treni kaçırmamak için beklemelisin.' },
          { id: 'd', text: 'Treni kaçırırım',           isCorrect: false, feedback: 'Dikkat etmek gerekir.' }
        ],
        correctOptionId: 'a',
        previousStepId: 'tren-6',
        nextStepId: 'tren-8'
      },
      {
        id: 'tren-8',
        question: 'Tren geldi. Kapı açıldı. Ne yaparsın?',
        imageUrl: 'https://images.unsplash.com/photo-1529119368496-6ca1711b4946',
        options: [
          { id: 'a', text: 'Sırayla içeri girerim', isCorrect: true,  feedback: 'Sıraya saygı göstermek gerekir.' },
          { id: 'b', text: 'İterek geçerim',        isCorrect: false, feedback: 'Nazikçe sıranı beklemelisin.' },
          { id: 'c', text: 'Hiç binmem',            isCorrect: false, feedback: 'Trene binmen gerekiyor.' },
          { id: 'd', text: 'Yanlış vagona koşarım', isCorrect: false, feedback: 'Doğru vagona sakin gir.' }
        ],
        correctOptionId: 'a',
        previousStepId: 'tren-7',
        nextStepId: 'tren-9'
      },
      {
        id: 'tren-9',
        question: 'Koltuk numaran 12A. Ne yaparsın?',
        imageUrl: 'https://images.unsplash.com/photo-1605727216803-18c3b4bcd7d0',
        options: [
          { id: 'a', text: '12A koltuğunu bulup otururum', isCorrect: true,  feedback: 'Doğru koltuğuna oturdun.' },
          { id: 'b', text: 'Rastgele bir koltuğa otururum', isCorrect: false, feedback: 'Numarana oturman gerekir.' },
          { id: 'c', text: 'Ayakta dururum',               isCorrect: false, feedback: 'Boş koltuğun var, oturabilirsin.' },
          { id: 'd', text: 'Pencereye yaslanırım',         isCorrect: false, feedback: 'Önce koltuğunu bulmalısın.' }
        ],
        correctOptionId: 'a',
        previousStepId: 'tren-8',
        nextStepId: 'tren-10'
      },
      {
        id: 'tren-10',
        question: 'Bilet kontrolü geliyor. Görevli bilet istiyor. Ne yaparsın?',
        imageUrl: 'https://images.unsplash.com/photo-1518544887878-6d5ceaf2d6c5',
        options: [
          { id: 'a', text: 'Biletimi gösteririm', isCorrect: true,  feedback: 'Görevliye biletini gösterdin.' },
          { id: 'b', text: 'Biletimi saklarım',   isCorrect: false, feedback: 'Görevliye göstermek zorundasın.' },
          { id: 'c', text: 'Başka birine veririm', isCorrect: false, feedback: 'Kendi biletini göstermelisin.' },
          { id: 'd', text: 'Konuşmam',            isCorrect: false, feedback: 'Nazikçe biletini göster.' }
        ],
        correctOptionId: 'a',
        previousStepId: 'tren-9',
        nextStepId: 'tren-11'
      },
      {
        id: 'tren-11',
        question: 'Görevli "İyi yolculuklar" diyor. Ne dersin?',
        imageUrl: 'https://images.unsplash.com/photo-1526413232644-2b6d2d2b6b86',
        options: [
          { id: 'a', text: 'Teşekkür ederim', isCorrect: true,  feedback: 'Nazikçe teşekkür ettin.' },
          { id: 'b', text: 'Cevap vermem',    isCorrect: false, feedback: 'Nazik bir söze cevap vermek gerekir.' },
          { id: 'c', text: 'Kızarım',         isCorrect: false, feedback: 'Nazikçe teşekkür etmek gerekir.' },
          { id: 'd', text: 'Bileti geri isterim', isCorrect: false, feedback: 'Bilet sende, teşekkür edebilirsin.' }
        ],
        correctOptionId: 'a',
        previousStepId: 'tren-10',
        nextStepId: 'tren-12'
      },
      {
        id: 'tren-12',
        question: 'Yanındaki yolcu konuşmak istiyor. Ne yaparsın?',
        imageUrl: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb',
        options: [
          { id: 'a', text: 'Nazikçe kısa sohbet ederim', isCorrect: true,  feedback: 'Nazikçe iletişim kurdun.' },
          { id: 'b', text: 'Bağırırım',                  isCorrect: false, feedback: 'Nazik olmak önemli.' },
          { id: 'c', text: 'Hiç dinlemem',               isCorrect: false, feedback: 'Kısaca cevap verebilirsin.' },
          { id: 'd', text: 'Yerini değiştir',            isCorrect: false, feedback: 'Rahatsız değilsen yer değiştirmen gerekmez.' }
        ],
        correctOptionId: 'a',
        previousStepId: 'tren-11',
        nextStepId: 'tren-13'
      },
      {
        id: 'tren-13',
        question: 'Tuvalete gitmek istiyorsun. Ne yaparsın?',
        imageUrl: 'https://images.unsplash.com/photo-1582813611290-7f0c2d6c1b2a',
        options: [
          { id: 'a', text: 'Tuvaleti bulup sırayla girerim', isCorrect: true,  feedback: 'Sıranı beklemek doğru davranış.' },
          { id: 'b', text: 'Vagonda bağırırım',              isCorrect: false, feedback: 'Sakin ol ve tuvaleti bul.' },
          { id: 'c', text: 'Pencereyi açarım',               isCorrect: false, feedback: 'Tuvalet için pencere işe yaramaz.' },
          { id: 'd', text: 'Tuvaleti kirli bırakırım',       isCorrect: false, feedback: 'Hijyen önemli, dikkat et.' }
        ],
        correctOptionId: 'a',
        previousStepId: 'tren-12',
        nextStepId: 'tren-14'
      },
      {
        id: 'tren-14',
        question: 'Anons: "Tren 5 dakika geç kalacak." Ne yaparsın?',
        imageUrl: 'https://images.unsplash.com/photo-1526413232644-2b6d2d2b6b86',
        options: [
          { id: 'a', text: 'Sakin kalıp beklerim', isCorrect: true,  feedback: 'Sakin olmak en iyisi.' },
          { id: 'b', text: 'Panik yaparım',        isCorrect: false, feedback: 'Panik yapmak çözüm değil.' },
          { id: 'c', text: 'Trenden inerim',       isCorrect: false, feedback: 'Varış yerine henüz gelmedin.' },
          { id: 'd', text: 'Görevlilere kızarım',  isCorrect: false, feedback: 'Sakin kalman gerekir.' }
        ],
        correctOptionId: 'a',
        previousStepId: 'tren-13',
        nextStepId: 'tren-15'
      },
      {
        id: 'tren-15',
        question: 'Açlık hissettin. Ne yaparsın?',
        imageUrl: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b',
        options: [
          { id: 'a', text: 'Atıştırmalık çantamdan alırım', isCorrect: true,  feedback: 'Kendi yiyeceğini yemekte sorun yok.' },
          { id: 'b', text: "Başkalarının yemeğini alırım",  isCorrect: false, feedback: "Başkasının eşyasını almak doğru değil." },
          { id: 'c', text: 'Koltukta yemek dökerim',        isCorrect: false, feedback: 'Dökmeden dikkatlice yiyebilirsin.' },
          { id: 'd', text: 'Yemek için bağırırım',          isCorrect: false, feedback: 'Sakin kalmak gerekir.' }
        ],
        correctOptionId: 'a',
        previousStepId: 'tren-14',
        nextStepId: 'tren-16'
      },
      {
        id: 'tren-16',
        question: 'Telefonun çalıyor. Ne yaparsın?',
        imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9',
        options: [
          { id: 'a', text: 'Sessiz konuşurum',       isCorrect: true,  feedback: 'Diğer yolcuları rahatsız etmemek önemli.' },
          { id: 'b', text: 'Yüksek sesle bağırırım', isCorrect: false, feedback: 'Diğer yolcuları rahatsız etme.' },
          { id: 'c', text: 'Trenden inerim',         isCorrect: false, feedback: 'Sadece telefon, inmene gerek yok.' },
          { id: 'd', text: 'Hiç açmam',              isCorrect: false, feedback: 'Gerekliyse sessizce konuşabilirsin.' }
        ],
        correctOptionId: 'a',
        previousStepId: 'tren-15',
        nextStepId: 'tren-17'
      },
      {
        id: 'tren-17',
        question: 'Yanlış vagonda olduğunu fark ettin. Ne yaparsın?',
        imageUrl: 'https://images.unsplash.com/photo-1529119368496-6ca1711b4946',
        options: [
          { id: 'a', text: 'Görevliye sorup doğru vagona geçerim', isCorrect: true,  feedback: 'Yardım isteyip doğru yere gitmek en iyisi.' },
          { id: 'b', text: 'Panik yaparım',                        isCorrect: false, feedback: 'Sakin ol ve yardım iste.' },
          { id: 'c', text: 'Koşarak kaçırım',                      isCorrect: false, feedback: 'Sakince doğru yeri bul.' },
          { id: 'd', text: 'Koltukta kalırım',                     isCorrect: false, feedback: 'Doğru vagona geçmek daha uygundur.' }
        ],
        correctOptionId: 'a',
        previousStepId: 'tren-16',
        nextStepId: 'tren-18'
      },
      {
        id: 'tren-18',
        question: 'Varışa 10 dakika kaldı. Ne yaparsın?',
        imageUrl: 'https://images.unsplash.com/photo-1505842465776-3f8a8e0aebf2',
        options: [
          { id: 'a', text: 'Eşyalarımı toparlarım', isCorrect: true,  feedback: 'Hazırlıklı olmak iyi fikirdir.' },
          { id: 'b', text: 'Eşyaları bırakırım',    isCorrect: false, feedback: 'Eşyalarını unutmamak için toparla.' },
          { id: 'c', text: 'Uyumaya başlarım',      isCorrect: false, feedback: 'Varış yaklaştı, hazırlıklı ol.' },
          { id: 'd', text: 'Yerimi kirletirim',     isCorrect: false, feedback: 'Temiz bırakmak önemlidir.' }
        ],
        correctOptionId: 'a',
        previousStepId: 'tren-17',
        nextStepId: 'tren-19'
      },
      {
        id: 'tren-19',
        question: 'Tren durdu. Kapı açılınca ne yaparsın?',
        imageUrl: 'https://images.unsplash.com/photo-1526413232644-2b6d2d2b6b86',
        options: [
          { id: 'a', text: 'Sakinçe inip yolu açarım', isCorrect: true,  feedback: 'Nazikçe inmek doğru davranış.' },
          { id: 'b', text: 'İterek çıkarım',           isCorrect: false, feedback: 'Sırayla ve nazikçe inmelisin.' },
          { id: 'c', text: 'İnmem, otururum',          isCorrect: false, feedback: 'Varış yerindesin, inmelisin.' },
          { id: 'd', text: 'Panikle koşarım',          isCorrect: false, feedback: 'Sakin olmak güvenlidir.' }
        ],
        correctOptionId: 'a',
        previousStepId: 'tren-18',
        nextStepId: 'tren-20'
      },
      {
        id: 'tren-20',
        question: 'İstasyonda çıkış tabelası görüyorsun. Ne yaparsın?',
        imageUrl: 'https://images.unsplash.com/photo-1505842465776-3f8a8e0aebf2',
        options: [
          { id: 'a', text: 'Tabelayı takip ederim', isCorrect: true,  feedback: 'Tabelaları takip etmek kolaylaştırır.' },
          { id: 'b', text: 'Rastgele yürürüm',      isCorrect: false, feedback: 'Tabelaları takip etmek daha doğru.' },
          { id: 'c', text: 'Yanlış kapıya giderim', isCorrect: false, feedback: 'Doğru çıkışı bulmalısın.' },
          { id: 'd', text: 'Geri trene binerim',    isCorrect: false, feedback: 'Artık çıkışa gitmelisin.' }
        ],
        correctOptionId: 'a',
        previousStepId: 'tren-19',
        nextStepId: 'tren-21'
      },
      {
        id: 'tren-21',
        question: 'Danışma gördün, yol sorabilir misin?',
        imageUrl: 'https://images.unsplash.com/photo-1519751138087-5ac7f42f7f19',
        options: [
          { id: 'a', text: 'Nazikçe adres sorarım', isCorrect: true,  feedback: 'Nazikçe sormak doğru.' },
          { id: 'b', text: 'Bağırırım',             isCorrect: false, feedback: 'Nazik olmak her zaman iyidir.' },
          { id: 'c', text: 'Hiç kimseye sormam',    isCorrect: false, feedback: 'Gerekirse sorup öğrenebilirsin.' },
          { id: 'd', text: 'Yanlış kişiye kızarım', isCorrect: false, feedback: 'Sakin ve saygılı ol.' }
        ],
        correctOptionId: 'a',
        previousStepId: 'tren-20',
        nextStepId: 'tren-22'
      },
      {
        id: 'tren-22',
        question: 'Çantanı kontrol ettin mi?',
        imageUrl: 'https://images.unsplash.com/photo-1514088930629-2c4f79937d35',
        options: [
          { id: 'a', text: 'Evet, her şey yanımda', isCorrect: true,  feedback: 'Eşyalarını kontrol etmek önemli.' },
          { id: 'b', text: 'Kontrol etmem',         isCorrect: false, feedback: 'Eşyalarını kontrol etmelisin.' },
          { id: 'c', text: 'Birini suçlarım',       isCorrect: false, feedback: 'Önce kontrol etmelisin.' },
          { id: 'd', text: 'Çantayı bırakırım',     isCorrect: false, feedback: 'Eşyalarını yanında tutmalısın.' }
        ],
        correctOptionId: 'a',
        previousStepId: 'tren-21',
        nextStepId: 'tren-23'
      },
      {
        id: 'tren-23',
        question: 'Çıkış kapısında güvenlik var. Ne yaparsın?',
        imageUrl: 'https://images.unsplash.com/photo-1505842465776-3f8a8e0aebf2',
        options: [
          { id: 'a', text: 'Gerekirse bileti gösteririm', isCorrect: true,  feedback: 'Sorulursa göstermek doğru davranış.' },
          { id: 'b', text: 'Gizlenirim',                  isCorrect: false, feedback: 'Gizlenmek yerine sorulana cevap ver.' },
          { id: 'c', text: 'Koşarak kaçarım',             isCorrect: false, feedback: 'Sakin davranmak en iyisi.' },
          { id: 'd', text: 'Konuşmam',                    isCorrect: false, feedback: 'Nazikçe cevap ver.' }
        ],
        correctOptionId: 'a',
        previousStepId: 'tren-22',
        nextStepId: 'tren-24'
      },
      {
        id: 'tren-24',
        question: 'İstasyondan çıktın. Yolculuk bitti. Ne yaparsın?',
        imageUrl: 'https://images.unsplash.com/photo-1526413232644-2b6d2d2b6b86',
        options: [
          { id: 'a', text: 'Hedefime doğru sakinçe yürürüm', isCorrect: true,  feedback: 'Sakin ve dikkatli ilerlemek iyi.' },
          { id: 'b', text: 'Geri dönerim',                  isCorrect: false, feedback: 'Artık hedefe doğru ilerlemelisin.' },
          { id: 'c', text: 'Eşyaları bırakırım',            isCorrect: false, feedback: 'Eşyalarını yanında tutmalısın.' },
          { id: 'd', text: 'Koşarak kaybolurum',            isCorrect: false, feedback: 'Sakin ve dikkatli ilerle.' }
        ],
        correctOptionId: 'a',
        previousStepId: 'tren-23'
      }
    ]
  },
  {
    id: 'yeni-senaryo-ornegi',
    title: 'Yeni Senaryo Örneği',
    description: 'Bu nasıl yeni senaryo eklendiğini gösterir',
    difficulty: 'Orta',
    icon: Users,
    color: '#9B59B6',
    completed: false,
    category: 'Günlük',
    maxScore: 80,
    steps: [
      {
        id: 'yeni-step1',
        question: 'Bu yeni senaryonun ilk sorusu. Ne yaparsın?',
        imageUrl: 'https://images.pexels.com/photos/1647976/pexels-photo-1647976.jpeg?auto=compress&cs=tinysrgb&w=800',
        options: [
          { id: 'a', text: 'Doğru cevap', isCorrect: true, feedback: 'Harika! Doğru seçim yaptın.' },
          { id: 'b', text: 'Yanlış cevap 1', isCorrect: false, feedback: 'Bu seçim uygun değil. Tekrar dene.' },
          { id: 'c', text: 'Yanlış cevap 2', isCorrect: false, feedback: 'Daha iyi bir seçenek var.' },
          { id: 'd', text: 'Yanlış cevap 3', isCorrect: false, feedback: 'Bu durumda başka bir seçenek daha uygun.' }
        ],
        correctOptionId: 'a',
        nextStepId: 'yeni-step2'
      },
      {
        id: 'yeni-step2',
        question: 'İkinci adım sorusu. Şimdi ne yaparsın?',
        imageUrl: 'https://images.pexels.com/photos/1647976/pexels-photo-1647976.jpeg?auto=compress&cs=tinysrgb&w=800',
        options: [
          { id: 'a', text: 'Yanlış seçenek', isCorrect: false, feedback: 'Bu seçim uygun değil.' },
          { id: 'b', text: 'Doğru cevap', isCorrect: true, feedback: 'Mükemmel! Doğru karar verdin.' },
          { id: 'c', text: 'Yanlış seçenek', isCorrect: false, feedback: 'Daha iyi bir seçenek var.' },
          { id: 'd', text: 'Yanlış seçenek', isCorrect: false, feedback: 'Bu durumda başka bir seçenek daha uygun.' }
        ],
        correctOptionId: 'b',
        previousStepId: 'yeni-step1'
      }
    ]
  },
  {
    id: 'online-alisveris',
    title: 'Online Alışveriş',
    description: 'Güvenli online alışveriş yapma',
    difficulty: 'Orta',
    icon: CreditCard,
    color: '#8B5CF6',
    completed: false,
    category: 'Toplum',
    maxScore: 120,
    steps: [
      {
        id: 'online-1',
        question: 'Online alışveriş sitesine girdin. İlk olarak ne yaparsın?',
        imageUrl: 'https://images.pexels.com/photos/34577/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=800',
        options: [
          { id: 'a', text: 'Hemen ürün aramaya başlarım', isCorrect: false, feedback: 'Önce güvenlik kontrolü yapmalısın.' },
          { id: 'b', text: 'Site güvenli mi kontrol ederim', isCorrect: true, feedback: 'Güvenlik kontrolü çok önemli!' },
          { id: 'c', text: 'Kredi kartı bilgilerini girerim', isCorrect: false, feedback: 'Henüz güvenlik kontrolü yapmadın.' },
          { id: 'd', text: 'Siteyi kapatırım', isCorrect: false, feedback: 'Güvenlik kontrolü yapabilirsin.' }
        ],
        correctOptionId: 'b',
        nextStepId: 'online-2'
      },
      {
        id: 'online-2',
        question: 'Sitede "https://" yazısını gördün. Bu ne anlama gelir?',
        imageUrl: 'https://images.pexels.com/photos/34577/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=800',
        options: [
          { id: 'a', text: 'Site hızlı demektir', isCorrect: false, feedback: 'HTTPS güvenlik ile ilgilidir.' },
          { id: 'b', text: 'Site güvenli demektir', isCorrect: true, feedback: 'HTTPS güvenli bağlantı demektir.' },
          { id: 'c', text: 'Site ücretsiz demektir', isCorrect: false, feedback: 'HTTPS güvenlik ile ilgilidir.' },
          { id: 'd', text: 'Site yavaş demektir', isCorrect: false, feedback: 'HTTPS güvenlik ile ilgilidir.' }
        ],
        correctOptionId: 'b',
        previousStepId: 'online-1',
        nextStepId: 'online-3'
      },
      {
        id: 'online-3',
        question: 'Ürün aradın ve buldun. Fiyatı 100 TL. Ne yaparsın?',
        imageUrl: 'https://images.pexels.com/photos/34577/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=800',
        options: [
          { id: 'a', text: 'Hemen satın alırım', isCorrect: false, feedback: 'Önce ürün detaylarını okumalısın.' },
          { id: 'b', text: 'Ürün detaylarını okurum', isCorrect: true, feedback: 'Ürün detaylarını okumak önemli!' },
          { id: 'c', text: 'Başka siteye geçerim', isCorrect: false, feedback: 'Bu sitede devam edebilirsin.' },
          { id: 'd', text: 'Fiyatı pazarlık ederim', isCorrect: false, feedback: 'Online alışverişte pazarlık olmaz.' }
        ],
        correctOptionId: 'b',
        previousStepId: 'online-2',
        nextStepId: 'online-4'
      },
      {
        id: 'online-4',
        question: 'Ürünü sepete ekledin. Şimdi ne yaparsın?',
        imageUrl: 'https://images.pexels.com/photos/34577/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=800',
        options: [
          { id: 'a', text: 'Hemen ödeme yaparım', isCorrect: false, feedback: 'Önce sepeti kontrol etmelisin.' },
          { id: 'b', text: 'Sepeti kontrol ederim', isCorrect: true, feedback: 'Sepeti kontrol etmek önemli!' },
          { id: 'c', text: 'Başka ürün ararım', isCorrect: false, feedback: 'Önce bu ürünü tamamla.' },
          { id: 'd', text: 'Siteyi kapatırım', isCorrect: false, feedback: 'Alışverişi tamamlamalısın.' }
        ],
        correctOptionId: 'b',
        previousStepId: 'online-3',
        nextStepId: 'online-5'
      },
      {
        id: 'online-5',
        question: 'Ödeme sayfasına geldin. Kredi kartı bilgilerini girerken ne yaparsın?',
        imageUrl: 'https://images.pexels.com/photos/34577/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=800',
        options: [
          { id: 'a', text: 'Bilgileri yüksek sesle söylerim', isCorrect: false, feedback: 'Kart bilgilerini gizli tutmalısın.' },
          { id: 'b', text: 'Bilgileri gizli şekilde girerim', isCorrect: true, feedback: 'Kart bilgilerini gizli tutmak güvenli!' },
          { id: 'c', text: 'Bilgileri unuturum', isCorrect: false, feedback: 'Bilgileri hatırlamalısın.' },
          { id: 'd', text: 'Başkasına söylerim', isCorrect: false, feedback: 'Kart bilgilerini kimseyle paylaşmamalısın.' }
        ],
        correctOptionId: 'b',
        previousStepId: 'online-4',
        nextStepId: 'online-6'
      },
      {
        id: 'online-6',
        question: 'Ödeme tamamlandı. Sipariş numarası geldi. Ne yaparsın?',
        imageUrl: 'https://images.pexels.com/photos/34577/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=800',
        options: [
          { id: 'a', text: 'Sipariş numarasını kaydederim', isCorrect: true, feedback: 'Sipariş numarasını kaydetmek önemli!' },
          { id: 'b', text: 'Numarayı silerim', isCorrect: false, feedback: 'Sipariş numarasına ihtiyacın olabilir.' },
          { id: 'c', text: 'Başkasına veririm', isCorrect: false, feedback: 'Sipariş numarasını kendine saklamalısın.' },
          { id: 'd', text: 'Hiçbir şey yapmam', isCorrect: false, feedback: 'Sipariş numarasını kaydetmelisin.' }
        ],
        correctOptionId: 'a',
        previousStepId: 'online-5'
      }
    ]
  },
  {
    id: 'sosyal-medya-guvenligi',
    title: 'Sosyal Medya Güvenliği',
    description: 'Güvenli sosyal medya kullanımı',
    difficulty: 'Zor',
    icon: Users,
    color: '#06B6D4',
    completed: false,
    category: 'Toplum',
    maxScore: 150,
    steps: [
      {
        id: 'sosyal-1',
        question: 'Sosyal medya hesabına giriş yaparken ne yaparsın?',
        imageUrl: 'https://images.pexels.com/photos/1647976/pexels-photo-1647976.jpeg?auto=compress&cs=tinysrgb&w=800',
        options: [
          { id: 'a', text: 'Şifremi güçlü yaparım', isCorrect: true, feedback: 'Güçlü şifre kullanmak güvenli!' },
          { id: 'b', text: 'Şifremi basit yaparım', isCorrect: false, feedback: 'Basit şifreler güvenli değil.' },
          { id: 'c', text: 'Şifre kullanmam', isCorrect: false, feedback: 'Şifre kullanmak zorunlu.' },
          { id: 'd', text: 'Şifremi herkese söylerim', isCorrect: false, feedback: 'Şifreni kimseyle paylaşmamalısın.' }
        ],
        correctOptionId: 'a',
        nextStepId: 'sosyal-2'
      },
      {
        id: 'sosyal-2',
        question: 'Biri sana mesaj gönderdi. Tanımıyorsun. Ne yaparsın?',
        imageUrl: 'https://images.pexels.com/photos/1647976/pexels-photo-1647976.jpeg?auto=compress&cs=tinysrgb&w=800',
        options: [
          { id: 'a', text: 'Hemen cevap veririm', isCorrect: false, feedback: 'Tanımadığın kişilerle dikkatli olmalısın.' },
          { id: 'b', text: 'Mesajı görmezden gelirim', isCorrect: true, feedback: 'Tanımadığın kişilerden uzak durmak güvenli!' },
          { id: 'c', text: 'Kişisel bilgilerimi veririm', isCorrect: false, feedback: 'Kişisel bilgilerini vermemelisin.' },
          { id: 'd', text: 'Adresimi söylerim', isCorrect: false, feedback: 'Adres gibi bilgileri vermemelisin.' }
        ],
        correctOptionId: 'b',
        previousStepId: 'sosyal-1',
        nextStepId: 'sosyal-3'
      },
      {
        id: 'sosyal-3',
        question: 'Fotoğraf paylaşmak istiyorsun. Ne yaparsın?',
        imageUrl: 'https://images.pexels.com/photos/1647976/pexels-photo-1647976.jpeg?auto=compress&cs=tinysrgb&w=800',
        options: [
          { id: 'a', text: 'Her fotoğrafı paylaşırım', isCorrect: false, feedback: 'Her fotoğrafı paylaşmak güvenli değil.' },
          { id: 'b', text: 'Dikkatli seçerim', isCorrect: true, feedback: 'Fotoğrafları dikkatli seçmek önemli!' },
          { id: 'c', text: 'Adres fotoğrafı paylaşırım', isCorrect: false, feedback: 'Adres fotoğrafı paylaşmamalısın.' },
          { id: 'd', text: 'Kart bilgilerini paylaşırım', isCorrect: false, feedback: 'Kart bilgilerini asla paylaşmamalısın.' }
        ],
        correctOptionId: 'b',
        previousStepId: 'sosyal-2',
        nextStepId: 'sosyal-4'
      },
      {
        id: 'sosyal-4',
        question: 'Biri seni takip etmek istiyor. Tanımıyorsun. Ne yaparsın?',
        imageUrl: 'https://images.pexels.com/photos/1647976/pexels-photo-1647976.jpeg?auto=compress&cs=tinysrgb&w=800',
        options: [
          { id: 'a', text: 'Hemen kabul ederim', isCorrect: false, feedback: 'Tanımadığın kişileri kabul etmemelisin.' },
          { id: 'b', text: 'Reddederim', isCorrect: true, feedback: 'Tanımadığın kişileri reddetmek güvenli!' },
          { id: 'c', text: 'Kişisel bilgilerimi veririm', isCorrect: false, feedback: 'Kişisel bilgilerini vermemelisin.' },
          { id: 'd', text: 'Adresimi söylerim', isCorrect: false, feedback: 'Adres gibi bilgileri vermemelisin.' }
        ],
        correctOptionId: 'b',
        previousStepId: 'sosyal-3',
        nextStepId: 'sosyal-5'
      },
      {
        id: 'sosyal-5',
        question: 'Hesabından çıkış yaparken ne yaparsın?',
        imageUrl: 'https://images.pexels.com/photos/1647976/pexels-photo-1647976.jpeg?auto=compress&cs=tinysrgb&w=800',
        options: [
          { id: 'a', text: 'Hesabı açık bırakırım', isCorrect: false, feedback: 'Hesabı açık bırakmak güvenli değil.' },
          { id: 'b', text: 'Çıkış yaparım', isCorrect: true, feedback: 'Çıkış yapmak güvenli!' },
          { id: 'c', text: 'Şifremi değiştiririm', isCorrect: false, feedback: 'Her seferinde şifre değiştirmene gerek yok.' },
          { id: 'd', text: 'Hesabı silerim', isCorrect: false, feedback: 'Çıkış yapmak yeterli.' }
        ],
        correctOptionId: 'b',
        previousStepId: 'sosyal-4'
      }
    ]
  },
  {
    id: 'acil-durum-cagirma',
    title: 'Acil Durum Çağırma',
    description: 'Polis, ambulans ve itfaiye çağırma',
    difficulty: 'Zor',
    icon: Phone,
    color: '#DC2626',
    completed: false,
    category: 'Sağlık',
    maxScore: 180,
    steps: [
      {
        id: 'acil-1',
        question: 'Bir kaza gördün. Ne yaparsın?',
        imageUrl: 'https://images.pexels.com/photos/1647976/pexels-photo-1647976.jpeg?auto=compress&cs=tinysrgb&w=800',
        options: [
          { id: 'a', text: 'Hemen ambulans çağırırım', isCorrect: true, feedback: 'Acil durumda ambulans çağırmak doğru!' },
          { id: 'b', text: 'Hiçbir şey yapmam', isCorrect: false, feedback: 'Acil durumda yardım etmelisin.' },
          { id: 'c', text: 'Fotoğraf çekerim', isCorrect: false, feedback: 'Önce yardım etmelisin.' },
          { id: 'd', text: 'Uzaklaşırım', isCorrect: false, feedback: 'Yardım etmek önemli.' }
        ],
        correctOptionId: 'a',
        nextStepId: 'acil-2'
      },
      {
        id: 'acil-2',
        question: 'Ambulansı çağırırken ne söylersin?',
        imageUrl: 'https://images.pexels.com/photos/1647976/pexels-photo-1647976.jpeg?auto=compress&cs=tinysrgb&w=800',
        options: [
          { id: 'a', text: 'Adresimi söylerim', isCorrect: true, feedback: 'Adres söylemek çok önemli!' },
          { id: 'b', text: 'Sadece merhaba derim', isCorrect: false, feedback: 'Adres söylemen gerekir.' },
          { id: 'c', text: 'Hiçbir şey söylemem', isCorrect: false, feedback: 'Adres söylemen gerekir.' },
          { id: 'd', text: 'Yemek siparişi veririm', isCorrect: false, feedback: 'Bu ambulans çağırma değil.' }
        ],
        correctOptionId: 'a',
        previousStepId: 'acil-1',
        nextStepId: 'acil-3'
      },
      {
        id: 'acil-3',
        question: 'Yangın gördün. Ne yaparsın?',
        imageUrl: 'https://images.pexels.com/photos/1647976/pexels-photo-1647976.jpeg?auto=compress&cs=tinysrgb&w=800',
        options: [
          { id: 'a', text: 'İtfaiyeyi çağırırım', isCorrect: true, feedback: 'Yangında itfaiye çağırmak doğru!' },
          { id: 'b', text: 'Yangına su atarım', isCorrect: false, feedback: 'Önce itfaiyeyi çağırmalısın.' },
          { id: 'c', text: 'Hiçbir şey yapmam', isCorrect: false, feedback: 'Yangında yardım etmelisin.' },
          { id: 'd', text: 'Fotoğraf çekerim', isCorrect: false, feedback: 'Önce itfaiyeyi çağırmalısın.' }
        ],
        correctOptionId: 'a',
        previousStepId: 'acil-2',
        nextStepId: 'acil-4'
      },
      {
        id: 'acil-4',
        question: 'Hırsızlık gördün. Ne yaparsın?',
        imageUrl: 'https://images.pexels.com/photos/1647976/pexels-photo-1647976.jpeg?auto=compress&cs=tinysrgb&w=800',
        options: [
          { id: 'a', text: 'Polisi çağırırım', isCorrect: true, feedback: 'Hırsızlıkta polis çağırmak doğru!' },
          { id: 'b', text: 'Hırsızla konuşurum', isCorrect: false, feedback: 'Tehlikeli olabilir.' },
          { id: 'c', text: 'Hiçbir şey yapmam', isCorrect: false, feedback: 'Polisi çağırmalısın.' },
          { id: 'd', text: 'Hırsıza yardım ederim', isCorrect: false, feedback: 'Hırsıza yardım etmemelisin.' }
        ],
        correctOptionId: 'a',
        previousStepId: 'acil-3',
        nextStepId: 'acil-5'
      },
      {
        id: 'acil-5',
        question: 'Acil durum numaralarını biliyor musun?',
        imageUrl: 'https://images.pexels.com/photos/1647976/pexels-photo-1647976.jpeg?auto=compress&cs=tinysrgb&w=800',
        options: [
          { id: 'a', text: 'Evet, 112 ambulans, 110 polis, 112 itfaiye', isCorrect: true, feedback: 'Acil numaraları bilmek çok önemli!' },
          { id: 'b', text: 'Hayır, bilmiyorum', isCorrect: false, feedback: 'Acil numaralarını öğrenmelisin.' },
          { id: 'c', text: 'Sadece 911 biliyorum', isCorrect: false, feedback: 'Türkiye\'de farklı numaralar var.' },
          { id: 'd', text: 'Hiçbir numara bilmiyorum', isCorrect: false, feedback: 'Acil numaralarını öğrenmelisin.' }
        ],
        correctOptionId: 'a',
        previousStepId: 'acil-4'
      }
    ]
  },
  {
    id: 'is-gorusmesi',
    title: 'İş Görüşmesi',
    description: 'İş görüşmesinde nasıl davranılır',
    difficulty: 'Zor',
    icon: Briefcase,
    color: '#059669',
    completed: false,
    category: 'Günlük',
    maxScore: 200,
    steps: [
      {
        id: 'is-1',
        question: 'İş görüşmesine giderken ne giyersin?',
        imageUrl: 'https://images.pexels.com/photos/1647976/pexels-photo-1647976.jpeg?auto=compress&cs=tinysrgb&w=800',
        options: [
          { id: 'a', text: 'Temiz ve düzenli kıyafet', isCorrect: true, feedback: 'Temiz ve düzenli kıyafet önemli!' },
          { id: 'b', text: 'Kirli kıyafet', isCorrect: false, feedback: 'Kirli kıyafet uygun değil.' },
          { id: 'c', text: 'Pijama', isCorrect: false, feedback: 'Pijama iş görüşmesi için uygun değil.' },
          { id: 'd', text: 'Hiçbir şey giymem', isCorrect: false, feedback: 'Kıyafet giymen gerekir.' }
        ],
        correctOptionId: 'a',
        nextStepId: 'is-2'
      },
      {
        id: 'is-2',
        question: 'Görüşme yerine geldin. Ne yaparsın?',
        imageUrl: 'https://images.pexels.com/photos/1647976/pexels-photo-1647976.jpeg?auto=compress&cs=tinysrgb&w=800',
        options: [
          { id: 'a', text: 'Hemen içeri girerim', isCorrect: false, feedback: 'Önce selam vermelisin.' },
          { id: 'b', text: 'Selam verip kendimi tanıtırım', isCorrect: true, feedback: 'Selam verip kendini tanıtmak önemli!' },
          { id: 'c', text: 'Hiçbir şey söylemem', isCorrect: false, feedback: 'Selam vermelisin.' },
          { id: 'd', text: 'Bağırırım', isCorrect: false, feedback: 'Nazik olmalısın.' }
        ],
        correctOptionId: 'b',
        previousStepId: 'is-1',
        nextStepId: 'is-3'
      },
      {
        id: 'is-3',
        question: 'Mülakatçı "Kendinizi tanıtın" dedi. Ne söylersin?',
        imageUrl: 'https://images.pexels.com/photos/1647976/pexels-photo-1647976.jpeg?auto=compress&cs=tinysrgb&w=800',
        options: [
          { id: 'a', text: 'Adımı ve deneyimlerimi söylerim', isCorrect: true, feedback: 'Kendini tanıtmak önemli!' },
          { id: 'b', text: 'Hiçbir şey söylemem', isCorrect: false, feedback: 'Kendini tanıtmalısın.' },
          { id: 'c', text: 'Sadece adımı söylerim', isCorrect: false, feedback: 'Daha detaylı bilgi verebilirsin.' },
          { id: 'd', text: 'Başka konulardan bahsederim', isCorrect: false, feedback: 'Kendini tanıtmalısın.' }
        ],
        correctOptionId: 'a',
        previousStepId: 'is-2',
        nextStepId: 'is-4'
      },
      {
        id: 'is-4',
        question: 'Mülakatçı "Neden bu işi istiyorsunuz?" dedi. Ne söylersin?',
        imageUrl: 'https://images.pexels.com/photos/1647976/pexels-photo-1647976.jpeg?auto=compress&cs=tinysrgb&w=800',
        options: [
          { id: 'a', text: 'Sadece para için', isCorrect: false, feedback: 'Daha iyi bir cevap verebilirsin.' },
          { id: 'b', text: 'Deneyim kazanmak ve gelişmek için', isCorrect: true, feedback: 'Gelişim odaklı cevap çok iyi!' },
          { id: 'c', text: 'Hiçbir şey söylemem', isCorrect: false, feedback: 'Cevap vermelisin.' },
          { id: 'd', text: 'Başka iş bulamadım', isCorrect: false, feedback: 'Daha olumlu bir cevap verebilirsin.' }
        ],
        correctOptionId: 'b',
        previousStepId: 'is-3',
        nextStepId: 'is-5'
      },
      {
        id: 'is-5',
        question: 'Görüşme bitti. Ne yaparsın?',
        imageUrl: 'https://images.pexels.com/photos/1647976/pexels-photo-1647976.jpeg?auto=compress&cs=tinysrgb&w=800',
        options: [
          { id: 'a', text: 'Teşekkür edip el sıkarım', isCorrect: true, feedback: 'Nazik bir veda etmek önemli!' },
          { id: 'b', text: 'Hiçbir şey söylemem', isCorrect: false, feedback: 'Teşekkür etmelisin.' },
          { id: 'c', text: 'Bağırırım', isCorrect: false, feedback: 'Nazik olmalısın.' },
          { id: 'd', text: 'Kapıyı çarparım', isCorrect: false, feedback: 'Nazik olmalısın.' }
        ],
        correctOptionId: 'a',
        previousStepId: 'is-4'
      }
    ]
  }
];

export const getScenarioById = (id: string): SimpleScenario | undefined => {
  return scenarios.find(scenario => scenario.id === id);
};

export const getScenariosByCategory = (category: string): SimpleScenario[] => {
  return scenarios.filter(scenario => scenario.category === category);
};

export const getScenariosByDifficulty = (difficulty: string): SimpleScenario[] => {
  return scenarios.filter(scenario => scenario.difficulty === difficulty);
};

// Senaryo tamamlandığında puan hesaplama fonksiyonu
export const calculateScore = (scenario: SimpleScenario, correctAnswers: number): number => {
  const totalSteps = scenario.steps.length;
  const percentage = (correctAnswers / totalSteps) * 100;
  return Math.round((percentage / 100) * scenario.maxScore);
}; 