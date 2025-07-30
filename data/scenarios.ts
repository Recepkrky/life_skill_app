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
          { id: 'c', text: 'Açım', isCorrect: false, feedback: 'Aç olduğunu kasiyere söyleme. Teşekkür edip raflara gidebilirsin.' },
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
          { id: 'd', text: 'Üstü kalsın', isCorrect: false, feedback: 'Bu genelde restoranda bahşiş için söylenir, burada uygun değil.' }
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
          { id: 'b', text: 'Bir uygulama aç', isCorrect: true, feedback: 'Harika! Telefonu kullanmaya başladın.' },
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
          { id: 'a', text: 'Yeni mesaj butonuna bas', isCorrect: true, feedback: 'Mükemmel! Yeni mesaj yazmaya başlayabilirsin.' },
          { id: 'b', text: 'Telefonu salla', isCorrect: false, feedback: 'Telefonu sallamak mesaj yazmaz. Yeni mesaj butonuna bas.' },
          { id: 'c', text: 'Hiçbir şey yapma', isCorrect: false, feedback: 'Yeni mesaj yazmak için yeni mesaj butonuna basman gerek.' },
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
          { id: 'a', text: 'Gönder butonuna bas', isCorrect: true, feedback: 'Harika! Mesajını başarıyla gönderdin.' },
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
    maxScore: 70,
    steps: [
      {
        id: 'step1',
        question: 'Kütüphaneye girdin. Görevli sana "Merhaba" dedi. Sen ne dersin?',
        imageUrl: 'https://images.pexels.com/photos/590493/pexels-photo-590493.jpeg?auto=compress&cs=tinysrgb&w=800',
        options: [
          { id: 'a', text: 'Merhaba', isCorrect: true, feedback: 'Harika! Nazikçe selam verdin.' },
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
          { id: 'a', text: 'Yemek', isCorrect: false, feedback: 'Kütüphanede yemek satılmaz. Kitap aradığını söyle.' },
          { id: 'b', text: 'Kitap arıyorum', isCorrect: true, feedback: 'Mükemmel! Ne aradığını net bir şekilde söyledin.' },
          { id: 'c', text: 'Hiçbir şey söyleme', isCorrect: false, feedback: 'Ne aradığını söylemen gerek.' },
          { id: 'd', text: 'Görüşürüz', isCorrect: false, feedback: 'Henüz ayrılmıyorsun. Ne aradığını söyle.' }
        ],
        correctOptionId: 'b',
        nextStepId: 'step3',
        previousStepId: 'step1'
      },
      {
        id: 'step3',
        question: 'Görevli "Hangi tür kitap arıyorsunuz?" diye sordu. Sen ne dersin?',
        imageUrl: 'https://images.pexels.com/photos/590493/pexels-photo-590493.jpeg?auto=compress&cs=tinysrgb&w=800',
        options: [
          { id: 'a', text: 'Yemek', isCorrect: false, feedback: 'Yemek kitap türü değil. Roman, bilim kurgu gibi bir tür söyle.' },
          { id: 'b', text: 'Hiçbir şey söyleme', isCorrect: false, feedback: 'Hangi tür kitap istediğini söylemen gerek.' },
          { id: 'c', text: 'Roman', isCorrect: true, feedback: 'Harika! Kitap türünü belirttin.' },
          { id: 'd', text: 'Görüşürüz', isCorrect: false, feedback: 'Henüz ayrılmıyorsun. Kitap türünü söyle.' }
        ],
        correctOptionId: 'c',
        nextStepId: 'step4',
        previousStepId: 'step2'
      },
      {
        id: 'step4',
        question: 'Kitabı buldun. Ödünç almak için ne yaparsın?',
        imageUrl: 'https://images.pexels.com/photos/590493/pexels-photo-590493.jpeg?auto=compress&cs=tinysrgb&w=800',
        options: [
          { id: 'a', text: 'Kitabı al ve git', isCorrect: false, feedback: 'Kitabı çalmak yanlış. Görevliye götür ve ödünç al.' },
          { id: 'b', text: 'Kitabı yere bırak', isCorrect: false, feedback: 'Kitabı yere bırakma. Görevliye götür.' },
          { id: 'c', text: 'Hiçbir şey yapma', isCorrect: false, feedback: 'Kitabı ödünç almak için görevliye götürmen gerek.' },
          { id: 'd', text: 'Görevliye götür', isCorrect: true, feedback: 'Mükemmel! Kitabı düzgün bir şekilde ödünç alıyorsun.' }
        ],
        correctOptionId: 'd',
        nextStepId: 'step5',
        previousStepId: 'step3'
      },
      {
        id: 'step5',
        question: 'Görevli "Kütüphane kartınız var mı?" diye sordu. Sen ne dersin?',
        imageUrl: 'https://images.pexels.com/photos/590493/pexels-photo-590493.jpeg?auto=compress&cs=tinysrgb&w=800',
        options: [
          { id: 'a', text: 'Evet, var', isCorrect: true, feedback: 'Harika! Kütüphane kartını çıkar.' },
          { id: 'b', text: 'Hayır, yok', isCorrect: true, feedback: 'Kütüphane kartı olmadan kitap ödünç alamazsın.Görevli sana kart verdi.' },
          { id: 'c', text: 'Hiçbir şey söyleme', isCorrect: false, feedback: 'Görevliye cevap vermen gerek.' },
          { id: 'd', text: 'Görüşürüz', isCorrect: false, feedback: 'Henüz ayrılmıyorsun. Kartın olup olmadığını söyle.' }
        ],
        correctOptionId: ['a', 'b'],
        nextStepId: 'step6',
        previousStepId: 'step4'
      },
      {
        id: 'step6',
        question: 'Kitap ödünç alındı. Şimdi ne yaparsın?',
        imageUrl: 'https://images.pexels.com/photos/590493/pexels-photo-590493.jpeg?auto=compress&cs=tinysrgb&w=800',
        options: [
          { id: 'a', text: 'Teşekkür ederim', isCorrect: true, feedback: 'Mükemmel! Nazikçe teşekkür ettin.' },
          { id: 'b', text: 'Hiçbir şey söyleme', isCorrect: false, feedback: 'Teşekkür etmek nazik olur.' },
          { id: 'c', text: 'Kitabı geri ver', isCorrect: false, feedback: 'Kitabı yeni aldın, geri verme.' },
          { id: 'd', text: 'Görüşürüz', isCorrect: true , feedback: 'Bunu demekte doğru ama teşekkür etmek daha iyi.' }
        ],
        correctOptionId: ['d','a'],
        previousStepId: 'step5'
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
    maxScore: 40,
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
    maxScore: 110,
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
          { id: 'c', text: 'Adımı söylerim',              isCorrect: true,  feedback: 'Doğru, adını söyledin.' },
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
    maxScore: 80,
    steps: [
      {
        id: 'rest-1',
        question: 'Garson "Hoş geldiniz" diyor. Ne söylersin?',
        imageUrl: 'https://cdnlnd.adisyo.com/_next/image?url=%2Fstatic%2Fblog%2Fblog-47.png&w=1080&q=100',
        options: [
          { id: 'a', text: 'Sessiz kalırım',              isCorrect: false, feedback: 'Nazikçe cevap vermek iletişimi başlatır.' },
          { id: 'b', text: 'Merhaba, bir masa istiyorum', isCorrect: true,  feedback: 'Nazikçe masa istediğin için çok iyi.' },
          { id: 'c', text: 'Gitmek istiyorum',            isCorrect: false, feedback: 'İçeri girdin, masa istemen gerekir.' },
          { id: 'd', text: 'Fiyatlar ne?',                isCorrect: false, feedback: 'Önce selam verip masa isteyebilirsin.' }
        ],
        correctOptionId: 'b',
        nextStepId: 'rest-2'
      },
      {
        id: 'rest-2',
        question: 'Garson menüyü veriyor. Ne yaparsın?',
        imageUrl: 'https://cdnlnd.adisyo.com/_next/image?url=%2Fstatic%2Fblog%2Fblog-47.png&w=1080&q=100',
        options: [
          { id: 'a', text: 'Menüyü yere atarım',         isCorrect: false, feedback: 'Nazik olmak önemli, menüyü düzgünce al.' },
          { id: 'b', text: 'Hiç bakmadan sipariş veririm', isCorrect: false, feedback: 'Ne istediğini görmek için menüye bakmalısın.' },
          { id: 'c', text: 'Teşekkür ederim, bakıyorum', isCorrect: true,  feedback: 'Menüyü alıp teşekkür ettin, harika.' },
          { id: 'd', text: 'Menüyü garsona geri veririm', isCorrect: false, feedback: 'Önce yiyeceğini seçmelisin.' }
        ],
        correctOptionId: 'c',
        previousStepId: 'rest-1',
        nextStepId: 'rest-3'
      },
      {
        id: 'rest-3',
        question: 'Sipariş vermek istiyorsun. Ne söylersin?',
        imageUrl: 'https://marketplace.canva.com/EAGRGRmCFk4/1/0/1131w/canva-siyah-modern-restoran-kafe-menü-CpsLI_OGchQ.jpg',
        options: [
          { id: 'a', text: 'Hiçbir şey istemiyorum',     isCorrect: false, feedback: 'Bir şey yemek için geldin, sipariş ver.' },
          { id: 'b', text: 'Sadece bakıyorum',           isCorrect: false, feedback: 'Hazırsan sipariş verebilirsin.' },
          { id: 'c', text: 'Parayı şimdi veririm',       isCorrect: false, feedback: 'Önce sipariş, sonra ödeme gelir.' },
          { id: 'd', text: 'Bir tavuk istiyorum', isCorrect: true,  feedback: 'Siparişini net verdin, güzel.' }
        ],
        correctOptionId: 'd',
        previousStepId: 'rest-2',
        nextStepId: 'rest-4'
      },
      {
        id: 'rest-4',
        question: 'Garson "İçecek ister misiniz?" diyor. Ne dersin?',
        imageUrl: 'https://marketplace.canva.com/EAGRGRmCFk4/1/0/1131w/canva-siyah-modern-restoran-kafe-menü-CpsLI_OGchQ.jpg',
        options: [
          { id: 'a', text: 'Hiç konuşmam',      isCorrect: false, feedback: 'Cevap vermek siparişi tamamlar.' },
          { id: 'b', text: 'Evet, su alırım',   isCorrect: true,  feedback: 'İçecek isteğini net belirttin.' },
          { id: 'c', text: 'Sadece tatlı istiyorum', isCorrect: false, feedback: 'Şu an içecek soruldu, ona cevap ver.' },
          { id: 'd', text: 'Masayı değiştir',   isCorrect: false, feedback: 'Şu an içecek hakkında konuşuyorsunuz.' }
        ],
        correctOptionId: 'b',
        previousStepId: 'rest-3',
        nextStepId: 'rest-5'
      },
      {
        id: 'rest-5',
        question: 'Yemeğin geldi. Ne söylersin?',
        imageUrl: 'https://i.ytimg.com/vi/3wo7qr6PIU4/sddefault.jpg',
        options: [
          { id: 'a', text: 'Hiçbir şey söylemem', isCorrect: false, feedback: 'Teşekkür etmek nazik bir davranıştır.' },
          { id: 'b', text: 'Neden bu geldi?',   isCorrect: false, feedback: 'Siparişini aldın, teşekkür edebilirsin.' },
          { id: 'c', text: 'Teşekkür ederim',   isCorrect: true,  feedback: 'Nazik bir teşekkür ettin.' },
          { id: 'd', text: 'Yemeği ittiririm',  isCorrect: false, feedback: 'Nazik olmak her zaman önemlidir.' }
        ],
        correctOptionId: 'c',
        previousStepId: 'rest-4',
        nextStepId: 'rest-6'
      },
      {
        id: 'rest-6',
        question: 'Garson "Başka bir şey ister misiniz?" diyor. Ne dersin?',
        imageUrl: 'https://i.ytimg.com/vi/3wo7qr6PIU4/sddefault.jpg',
        options: [
          { id: 'a', text: 'Seni ilgilendirmez',  isCorrect: false, feedback: 'Nazikçe cevap vermek daha uygun.' },
          { id: 'b', text: 'Yemeği değiştir',     isCorrect: false, feedback: 'Nazikçe cevap vermek daha uygun.' },
          { id: 'c', text: 'Konuşmak istemiyorum', isCorrect: false, feedback: 'Soruyu nazikçe cevaplamalısın.' },
          { id: 'd', text: 'Hayır, teşekkürler',  isCorrect: true,  feedback: 'Nazikçe reddettin.' }
        ],
        correctOptionId: 'd',
        previousStepId: 'rest-5',
        nextStepId: 'rest-7'
      },
      {
        id: 'rest-7',
        question: 'Hesap istiyorsun. Ne söylersin?',
        imageUrl: 'https://productimages.hepsiburada.net/s/40/375-375/10654823710770.jpg',
        options: [
          { id: 'a', text: 'Gitmek istiyorum',       isCorrect: false, feedback: 'Hesabı istemek daha doğru olur.' },
          { id: 'b', text: 'Hesabı alabilir miyim?', isCorrect: true,  feedback: 'Nazikçe hesabı istedin.' },
          { id: 'c', text: 'Bana menü ver',          isCorrect: false, feedback: 'Artık ödeme zamanı, menü değil.' },
          { id: 'd', text: 'Sessizce kalkarım',      isCorrect: false, feedback: 'Önce hesabı istemelisin.' }
        ],
        correctOptionId: 'b',
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
    maxScore: 150,
    steps: [
      {
        id: 'ecz-1',
        question: 'Eczaneye girdin, görevli "Buyurun" diyor. Ne dersin?',
        imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQknxtVELycC01Ql7z_ddOUOFdfY5241ViDXg&s',
        options: [
          { id: 'a', text: 'Sessizce dolaşırım',    isCorrect: false, feedback: 'İhtiyacını söylemek için konuşmalısın.' },
          { id: 'b', text: 'Merhaba, ilacim var', isCorrect: true,  feedback: 'Nazikçe ihtiyacını belirttin.' },
          { id: 'c', text: 'İlaç yok',              isCorrect: false, feedback: 'İlaç almaya geldiğini belirtmelisin.' },
          { id: 'd', text: 'Çıkıyorum',             isCorrect: false, feedback: 'Daha yeni girdin, ihtiyacını söyle.' }
        ],
        correctOptionId: ['b'],
        nextStepId: 'ecz-2'
      },
      {
        id: 'ecz-2',
        question: 'Eczacı "Reçeteniz var mı?" diyor. Ne yaparsın?',
        imageUrl: 'https://eczacininsesi.com/haber/kucuk/058466ea71665d709fb2c5a093e297c3.jpg',
        options: [
          { id: 'a', text: 'Saklarım',            isCorrect: false, feedback: 'Reçeteyi göstermek gerekir.' },
          { id: 'b', text: 'Başka ilacı sorarım', isCorrect: false, feedback: 'Önce bu ilacı halletmelisin.' },
          { id: 'c', text: 'Reçetemi gösteririm', isCorrect: true,  feedback: 'Doğru, reçeteyi gösterdin.' },
          { id: 'd', text: 'Hiç cevap vermem',    isCorrect: false, feedback: 'Nazikçe cevap verip reçeteyi göster.' }
        ],
        correctOptionId: ['c'],
        previousStepId: 'ecz-1',
        nextStepId: 'ecz-3'
      },
      {
        id: 'ecz-3',
        question: 'Eczacı "Bu ilacı günde kaç kez kullanacaksın?" diye soruyor. Ne dersin?',
        imageUrl: 'https://eczacininsesi.com/haber/kucuk/058466ea71665d709fb2c5a093e297c3.jpg',
        options: [
          { id: 'a', text: 'Bilmiyorum, rastgele içerim',    isCorrect: false, feedback: 'Doz bilgisi önemlidir, doktorun dediğini söyle.' },
          { id: 'b', text: 'Her saat içerim',                isCorrect: false, feedback: 'Aşırı kullanım zararlıdır, doğru dozu söyle.' },
          { id: 'c', text: 'Hiç içmem',                      isCorrect: false, feedback: 'İlaç doktorun dediği şekilde kullanılmalı.' },
          { id: 'd', text: 'Doktor günde iki kez dedi',      isCorrect: true,  feedback: 'Doğru dozu aktardın, güvenli.' }
        ],
        correctOptionId: ['d'],
        previousStepId: 'ecz-2',
        nextStepId: 'ecz-4'
      },
      {
        id: 'ecz-4',
        question: 'Eczacı "İlacı nasıl saklayacaksın?" diye soruyor. Ne dersin?',
        imageUrl: 'https://eczacininsesi.com/haber/kucuk/058466ea71665d709fb2c5a093e297c3.jpg',
        options: [
          { id: 'a', text: 'Güneşte bırakırım',              isCorrect: false, feedback: 'Güneş ışığı ilacı bozabilir.' },
          { id: 'b', text: 'Serin ve kuru yerde saklayacağım', isCorrect: true,  feedback: 'Doğru saklama koşullarını biliyorsun.' },
          { id: 'c', text: 'Banyoda saklarım',               isCorrect: false, feedback: 'Nemli ortam ilacı bozabilir.' },
          { id: 'd', text: 'Buzdolabına koyarım',            isCorrect: false, feedback: 'Her ilaç buzdolabında saklanmaz.' }
        ],
        correctOptionId: ['b'],
        previousStepId: 'ecz-3',
        nextStepId: 'ecz-5'
      },
      {
        id: 'ecz-5',
        question: 'Eczacı "Yan etki olursa ne yapacaksınız?" diye soruyor. Ne dersin?',
        imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSSpWeMi82L4ArChb8lrNPTipeIGvI3xRsnjg&s',
        options: [
          { id: 'a', text: 'Hiç fark etmez',                 isCorrect: false, feedback: 'Yan etkileri ciddiye almak gerekir.' },
          { id: 'b', text: 'Yanıt vermem',                   isCorrect: false, feedback: 'Eczacıya bilgi vermek önemlidir.' },
          { id: 'c', text: 'Yan etki olursa sizi veya doktorumu ararım', isCorrect: true,  feedback: 'Yan etkide ne yapacağını biliyorsun.' },
          { id: 'd', text: 'Her yan etki iyidir',            isCorrect: false, feedback: 'Yan etkiler iyi değildir, dikkat etmelisin.' }
        ],
        correctOptionId: ['c'],
        previousStepId: 'ecz-4',
        nextStepId: 'ecz-6'
      },
      {
        id: 'ecz-6',
        question: 'Eczacı "Başka ilaç kullanıyor musunuz?" diyor.',
        imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSSpWeMi82L4ArChb8lrNPTipeIGvI3xRsnjg&s',
        options: [
          { id: 'a', text: 'Söylemem',                   isCorrect: false, feedback: 'Kullandığın ilaçları söylemek gerekir.' },
          { id: 'b', text: 'Yalan söylerim',             isCorrect: false, feedback: 'Doğru bilgi vermek sağlığın için şart.' },
          { id: 'c', text: 'Hepsini bırakırım',          isCorrect: false, feedback: 'Eczacıya danışmadan bırakma.' },
          { id: 'd', text: 'Evet, başka ilaçta kullanıyorum', isCorrect: true,  feedback: 'Doğru bilgi vermek güvenli.' }
        ],
        correctOptionId: ['d'],
        previousStepId: 'ecz-5',
        nextStepId: 'ecz-7'
      },
      {
        id: 'ecz-7',
        question: 'Eczacı "İlaç bitince tekrar gel" diyor. Ne dersin?',
        imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSSpWeMi82L4ArChb8lrNPTipeIGvI3xRsnjg&s',
        options: [
          { id: 'a', text: 'Hayır gelmem',           isCorrect: false, feedback: 'Gerekirse tekrar gelmek önemlidir.' },
          { id: 'b', text: 'Tamam, teşekkür ederim', isCorrect: true,  feedback: 'Nazikçe teşekkür ettin.' },
          { id: 'c', text: 'İstemiyorum',            isCorrect: false, feedback: 'Nazikçe cevap vermelisin.' },
          { id: 'd', text: 'Sessizce giderim',       isCorrect: false, feedback: 'Cevap vermek daha uygundur.' }
        ],
        correctOptionId: ['b'],
        previousStepId: 'ecz-6',
        nextStepId: 'ecz-8'
      },
      {
        id: 'ecz-8',
        question: 'Ödeme zamanı. "Kart mı nakit mi?" deniyor.',
        imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_dclpcf6s33MgMlubcwcPuMi31GlIj5CpKA&s',
        options: [
          { id: 'a', text: 'Ödemem',              isCorrect: false, feedback: 'İlaç için ödeme yapmak gerekir.' },
          { id: 'b', text: 'Sonra öderim',        isCorrect: false, feedback: 'Şimdi ödemen daha doğru.' },
          { id: 'c', text: 'Kart ile ödeyeyim',   isCorrect: true,  feedback: 'Kartla ödemeyi seçtin.' },
          { id: 'd', text: 'Nakit ödeyeceğim',    isCorrect: true,  feedback: 'Nakit ödemeyi seçtin.' }
        ],
        correctOptionId: ['c', 'd'],
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
          { id: 'a', text: 'Kartı cebime saklarım',       isCorrect: false, feedback: 'Ödeme için kartı kullanmalısın.' },
          { id: 'b', text: 'Kartımı cihaza dokundururum', isCorrect: true,  feedback: 'Ödemeyi başlattın.' },
          { id: 'c', text: 'Kartı kasiyere atarım',       isCorrect: false, feedback: 'Nazikçe kartını okutmalısın.' },
          { id: 'd', text: 'Hiçbir şey yapmam',           isCorrect: false, feedback: 'Ödeme tamamlanmaz, hareket etmelisin.' }
        ],
        correctOptionId: ['b'],
        nextStepId: 'ecz-10_pin'
      },
      {
        id: 'ecz-10_pin',
        question: 'Şifre istendi. Ne yaparsın?',
        imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_dclpcf6s33MgMlubcwcPuMi31GlIj5CpKA&s',
        options: [
          { id: 'a', text: 'Şifreyi yüksek sesle söylerim', isCorrect: false, feedback: 'Şifren gizli kalmalı, sadece tuşla.' },
          { id: 'b', text: 'Şifreyi yanlış girerim',     isCorrect: false, feedback: 'Doğru şifreyi girmelisin.' },
          { id: 'c', text: 'Şifremi girerim',            isCorrect: true,  feedback: 'Şifreni gizli şekilde girdin.' },
          { id: 'd', text: 'Kartı çıkarırım',            isCorrect: false, feedback: 'İşlem bitmeden kartı çıkarmamalısın.' }
        ],
        correctOptionId: ['c'],
        nextStepId: 'ecz-11_receipt',
        previousStepId: 'ecz-9_card'
      },
      {
        id: 'ecz-9_cash',
        question: 'Eczacı toplam tutarı söyledi. Ne yaparsın?',
        imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_dclpcf6s33MgMlubcwcPuMi31GlIj5CpKA&s',
        options: [
          { id: 'a', text: 'Kartımı okutayım',                 isCorrect: false, feedback: 'Nakit seçmiştin, tutarlı olmalısın.' },
          { id: 'b', text: 'Hiçbir şey söylemeden beklerim',    isCorrect: false, feedback: 'Kasiyerin anlaması için parayı vermelisin.' },
          { id: 'c', text: 'Üstü kalsın',                      isCorrect: false, feedback: 'Bu durumda uygun değil.' },
          { id: 'd', text: 'Parayı uzatır ve "Buyurun" derim', isCorrect: true,  feedback: 'Doğru, parayı verirsin.' }
        ],
        correctOptionId: ['d'],
        nextStepId: 'ecz-9b_cash_change',
        previousStepId: 'ecz-8'
      },
      {
        id: 'ecz-9b_cash_change',
        question: 'Eczacı para üstünü verdi ve "Buyurun" dedi. Ne dersin?',
        imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_dclpcf6s33MgMlubcwcPuMi31GlIj5CpKA&s',
        options: [
          { id: 'a', text: 'Para üstünü saymam',     isCorrect: false, feedback: 'Kısaca kontrol etmek iyi olur ama teşekkür etmeyi unutma.' },
          { id: 'b', text: 'Teşekkür ederim',        isCorrect: true,  feedback: 'Nazikçe teşekkür ettin.' },
          { id: 'c', text: 'Hiçbir şey söyleme',     isCorrect: false, feedback: 'Teşekkür etmek önemli bir sosyal beceridir.' },
          { id: 'd', text: 'Para yetmedi mi?',       isCorrect: false, feedback: 'Kasiyer sana para üstünü verdi, karışıklık yok.' }
        ],
        correctOptionId: ['b'],
        nextStepId: 'ecz-11_receipt'
      },
      {
        id: 'ecz-11_receipt',
        question: 'Ödeme tamam. Eczacı "Fiş ister misiniz?" diyor.',
        imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_dclpcf6s33MgMlubcwcPuMi31GlIj5CpKA&s',
        options: [
          { id: 'a', text: 'Çöpe atın',          isCorrect: false, feedback: 'Fiş gerekebilir, almak iyi olur.' },
          { id: 'b', text: 'Ne fişi?',           isCorrect: false, feedback: 'Fiş ödeme belgesidir, isteyebilirsin.' },
          { id: 'c', text: 'Evet, lütfen verin', isCorrect: true,  feedback: 'Fiş almak gelecekte işe yarayabilir.' },
          { id: 'd', text: 'Konuşmam',           isCorrect: false, feedback: 'Nazikçe cevap ver.' }
        ],
        correctOptionId: ['c'],
        nextStepId: 'ecz-12_check'
      },
      {
        id: 'ecz-12_check',
        question: 'Poşeti alırken ilacını kontrol eder misin?',
        imageUrl: 'https://www.eczanesitesi.com/assets/uploads/7087-r6ae64.webp',
        options: [
          { id: 'a', text: 'Bakmadan çıkarım',                  isCorrect: false, feedback: 'Kontrol etmek önemli.' },
          { id: 'b', text: 'Poşeti bırakırım',                  isCorrect: false, feedback: 'İlacını almadan çıkmamalısın.' },
          { id: 'c', text: 'Başka ilaç eklerim',                isCorrect: false, feedback: 'Gereksiz ilaç almamalısın.' },
          { id: 'd', text: 'Evet, doğru ilacı kontrol ederim', isCorrect: true,  feedback: 'Kontrol etmek hata riskini azaltır.' }
        ],
        correctOptionId: ['d'],
        nextStepId: 'ecz-13_goodbye'
      },
      {
        id: 'ecz-13_goodbye',
        question: 'Eczacı "Geçmiş olsun" diyor. Ne söylersin?',
        imageUrl: 'https://www.eczanesitesi.com/assets/uploads/7087-r6ae64.webp',
        options: [
          { id: 'a', text: 'Cevap vermem',               isCorrect: false, feedback: 'Nazikçe teşekkür etmek uygun olur.' },
          { id: 'b', text: 'Teşekkür ederim, iyi günler', isCorrect: true,  feedback: 'Nazikçe teşekkür ettin.' },
          { id: 'c', text: 'Kızarım',                    isCorrect: false, feedback: 'Nazik bir söze nazikçe cevap vermelisin.' },
          { id: 'd', text: 'Poşeti bırakırım',           isCorrect: false, feedback: 'Poşetini alıp teşekkür edebilirsin.' }
        ],
        correctOptionId: ['b'],
        nextStepId: 'ecz-14_exit'
      },
      {
        id: 'ecz-14_exit',
        question: 'Eczaneden çıkmadan önce ne yaparsın?',
        imageUrl: 'https://www.eczanesitesi.com/assets/uploads/7087-r6ae64.webp',
        options: [
          { id: 'a', text: 'Koşarak çıkarım',         isCorrect: false, feedback: 'Sakin ve dikkatli çıkmak daha güvenlidir.' },
          { id: 'b', text: 'Poşeti bırakırım',        isCorrect: false, feedback: 'İlacını yanında götürmelisin.' },
          { id: 'c', text: 'Kapıdan dikkatle çıkarım', isCorrect: true,  feedback: 'Dikkatli çıkmak güvenlidir.' },
          { id: 'd', text: 'Eczanede otururum',       isCorrect: false, feedback: 'İşin bitti, çıkabilirsin.' }
        ],
        correctOptionId: ['c'],
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
    maxScore: 240,
    steps: [
      {
        id: 'tren-1',
        question: 'Gara girdin. Gişeyi bulman gerekiyor. Ne yaparsın?',
        imageUrl: 'https://images.unsplash.com/photo-1505842465776-3f8a8e0aebf2',
        options: [
          { id: 'a', text: 'Sessizce dolaşırım',       isCorrect: false, feedback: 'Sormak daha hızlı ve doğru olur.' },
          { id: 'b', text: 'Görevliye gişeyi sorarım', isCorrect: true,  feedback: 'Yardım istemek zamanı kazandırır.' },
          { id: 'c', text: 'Yanlış yöne giderim',      isCorrect: false, feedback: 'Sormak yerine rastgele gitmek zaman kaybettirir.' },
          { id: 'd', text: 'Hemen dışarı çıkarım',     isCorrect: false, feedback: 'Bilet almak için içeride kalmalısın.' }
        ],
        correctOptionId: 'b',
        nextStepId: 'tren-2'
      },
      {
        id: 'tren-2',
        question: 'Gişeye geldin. "Nereye gideceksiniz?" diye soruyorlar.',
        imageUrl: 'https://images.unsplash.com/photo-1562184552-08a38e5bc198',
        options: [
          { id: 'a', text: 'Bilmiyorum',                isCorrect: false, feedback: 'Nereye gideceğini söylemelisin.' },
          { id: 'b', text: 'Para yok',                  isCorrect: false, feedback: 'Önce nereye gideceğini söyle.' },
          { id: 'c', text: "İzmir'e gitmek istiyorum", isCorrect: true,  feedback: 'Hedefini net söyledin.' },
          { id: 'd', text: 'Sessiz kalırım',            isCorrect: false, feedback: 'Cevap vermen gerekiyor.' }
        ],
        correctOptionId: 'c',
        previousStepId: 'tren-1',
        nextStepId: 'tren-3'
      },
      {
        id: 'tren-3',
        question: 'Gişe "Tek yön mü, gidiş-dönüş mü?" diye soruyor.',
        imageUrl: 'https://images.unsplash.com/photo-1518544887878-6d5ceaf2d6c5',
        options: [
          { id: 'a', text: 'Hiçbiri',                 isCorrect: false, feedback: 'Birini seçmelisin.' },
          { id: 'b', text: 'Ben karar vermem',        isCorrect: false, feedback: 'Gitmek için karar vermelisin.' },
          { id: 'c', text: 'Hemen gidiyorum',         isCorrect: false, feedback: 'Bilet almadan gidemezsin.' },
          { id: 'd', text: 'Tek yön bilet istiyorum', isCorrect: true,  feedback: 'Seçimini net yaptın.' }
        ],
        correctOptionId: 'd',
        previousStepId: 'tren-2',
        nextStepId: 'tren-4'
      },
      {
        id: 'tren-4',
        question: 'Ödeme zamanı. "Kart mı nakit mi?" diye soruluyor.',
        imageUrl: 'https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1',
        options: [
          { id: 'a', text: 'Ödemek istemiyorum', isCorrect: false, feedback: 'Bir ödeme yöntemi seçmelisin.' },
          { id: 'b', text: 'Kart ile ödeyeyim', isCorrect: true,  feedback: 'Kartla ödemeyi seçtin.' },
          { id: 'c', text: 'Sonra öderim',     isCorrect: false, feedback: 'Şimdi ödemen gerekiyor.' },
          { id: 'd', text: 'Parayı saklarım',  isCorrect: false, feedback: 'Ödeme yapmalısın.' }
        ],
        correctOptionId: 'b',
        previousStepId: 'tren-3',
        nextStepId: 'tren-5'
      },
      {
        id: 'tren-5',
        question: 'POS cihazı kartı okutmanı istiyor. Ne yaparsın?',
        imageUrl: 'https://images.unsplash.com/photo-1523289333742-be1143f6b766',
        options: [
          { id: 'a', text: 'Kartı vermem',           isCorrect: false, feedback: 'Ödeme için kartı kullanmalısın.' },
          { id: 'b', text: 'Yanlış kart kullanırım', isCorrect: false, feedback: 'Doğru kartı kullanmak gerekir.' },
          { id: 'c', text: 'Kartımı cihaza tutarım', isCorrect: true,  feedback: 'Ödemeyi başlattın.' },
          { id: 'd', text: 'Hiçbir şey yapmam',      isCorrect: false, feedback: 'Ödeme tamamlanmaz, işlem yapmalısın.' }
        ],
        correctOptionId: 'c',
        previousStepId: 'tren-4',
        nextStepId: 'tren-6'
      },
      {
        id: 'tren-6',
        question: 'Biletini aldın. "Peron 3" yazıyor. Ne yaparsın?',
        imageUrl: 'https://images.unsplash.com/photo-1505842465776-3f8a8e0aebf2',
        options: [
          { id: 'a', text: "Peron 1'e giderim", isCorrect: false, feedback: 'Biletindeki perona gitmelisin.' },
          { id: 'b', text: 'Otobüse binerim',   isCorrect: false, feedback: 'Trenle gidiyorsun, perona git.' },
          { id: 'c', text: 'Bekleme salonuna saklanırım', isCorrect: false, feedback: 'Treni kaçırmamak için perona gitmelisin.' },
          { id: 'd', text: "Peron 3'e giderim", isCorrect: true,  feedback: 'Doğru perona gidiyorsun.' }
        ],
        correctOptionId: 'd',
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
          { id: 'a', text: 'İterek geçerim',        isCorrect: false, feedback: 'Nazikçe sıranı beklemelisin.' },
          { id: 'b', text: 'Hiç binmem',            isCorrect: false, feedback: 'Trene binmen gerekiyor.' },
          { id: 'c', text: 'Yanlış vagona koşarım', isCorrect: false, feedback: 'Doğru vagona sakin gir.' },
          { id: 'd', text: 'Sırayla içeri girerim', isCorrect: true,  feedback: 'Sıraya saygı göstermek gerekir.' }
        ],
        correctOptionId: 'd',
        previousStepId: 'tren-7',
        nextStepId: 'tren-9'
      },
      {
        id: 'tren-9',
        question: 'Koltuk numaran 12A. Ne yaparsın?',
        imageUrl: 'https://images.unsplash.com/photo-1605727216803-18c3b4bcd7d0',
        options: [
          { id: 'a', text: 'Rastgele bir koltuğa otururum', isCorrect: false, feedback: 'Numarana oturman gerekir.' },
          { id: 'b', text: '12A koltuğunu bulup otururum', isCorrect: true,  feedback: 'Doğru koltuğuna oturdun.' },
          { id: 'c', text: 'Ayakta dururum',               isCorrect: false, feedback: 'Boş koltuğun var, oturabilirsin.' },
          { id: 'd', text: 'Pencereye yaslanırım',         isCorrect: false, feedback: 'Önce koltuğunu bulmalısın.' }
        ],
        correctOptionId: 'b',
        previousStepId: 'tren-8',
        nextStepId: 'tren-10'
      },
      {
        id: 'tren-10',
        question: 'Bilet kontrolü geliyor. Görevli bilet istiyor. Ne yaparsın?',
        imageUrl: 'https://images.unsplash.com/photo-1518544887878-6d5ceaf2d6c5',
        options: [
          { id: 'a', text: 'Biletimi saklarım',   isCorrect: false, feedback: 'Görevliye göstermek zorundasın.' },
          { id: 'b', text: 'Başka birine veririm', isCorrect: false, feedback: 'Kendi biletini göstermelisin.' },
          { id: 'c', text: 'Biletimi gösteririm', isCorrect: true,  feedback: 'Görevliye biletini gösterdin.' },
          { id: 'd', text: 'Konuşmam',            isCorrect: false, feedback: 'Nazikçe biletini göster.' }
        ],
        correctOptionId: 'c',
        previousStepId: 'tren-9',
        nextStepId: 'tren-11'
      },
      {
        id: 'tren-11',
        question: 'Görevli "İyi yolculuklar" diyor. Ne dersin?',
        imageUrl: 'https://images.unsplash.com/photo-1526413232644-2b6d2d2b6b86',
        options: [
          { id: 'a', text: 'Cevap vermem',    isCorrect: false, feedback: 'Nazik bir söze cevap vermek gerekir.' },
          { id: 'b', text: 'Kızarım',         isCorrect: false, feedback: 'Nazikçe teşekkür etmek gerekir.' },
          { id: 'c', text: 'Bileti geri isterim', isCorrect: false, feedback: 'Bilet sende, teşekkür edebilirsin.' },
          { id: 'd', text: 'Teşekkür ederim', isCorrect: true,  feedback: 'Nazikçe teşekkür ettin.' }
        ],
        correctOptionId: 'd',
        previousStepId: 'tren-10',
        nextStepId: 'tren-12'
      },
      {
        id: 'tren-12',
        question: 'Yanındaki yolcu konuşmak istiyor. Ne yaparsın?',
        imageUrl: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb',
        options: [
          { id: 'a', text: 'Bağırırım',                  isCorrect: false, feedback: 'Nazik olmak önemli.' },
          { id: 'b', text: 'Nazikçe kısa sohbet ederim', isCorrect: true,  feedback: 'Nazikçe iletişim kurdun.' },
          { id: 'c', text: 'Hiç dinlemem',               isCorrect: false, feedback: 'Kısaca cevap verebilirsin.' },
          { id: 'd', text: 'Yerini değiştir',            isCorrect: false, feedback: 'Rahatsız değilsen yer değiştirmen gerekmez.' }
        ],
        correctOptionId: 'b',
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
          { id: 'a', text: 'Panik yaparım',        isCorrect: false, feedback: 'Panik yapmak çözüm değil.' },
          { id: 'b', text: 'Trenden inerim',       isCorrect: false, feedback: 'Varış yerine henüz gelmedin.' },
          { id: 'c', text: 'Görevlilere kızarım',  isCorrect: false, feedback: 'Sakin kalman gerekir.' },
          { id: 'd', text: 'Sakin kalıp beklerim', isCorrect: true,  feedback: 'Sakin olmak en iyisi.' }
        ],
        correctOptionId: 'd',
        previousStepId: 'tren-13',
        nextStepId: 'tren-15'
      },
      {
        id: 'tren-15',
        question: 'Açlık hissettin. Ne yaparsın?',
        imageUrl: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b',
        options: [
          { id: 'a', text: "Başkalarının yemeğini alırım",  isCorrect: false, feedback: "Başkasının eşyasını almak doğru değil." },
          { id: 'b', text: 'Atıştırmalık çantamdan alırım', isCorrect: true,  feedback: 'Kendi yiyeceğini yemekte sorun yok.' },
          { id: 'c', text: 'Koltukta yemek dökerim',        isCorrect: false, feedback: 'Dökmeden dikkatlice yiyebilirsin.' },
          { id: 'd', text: 'Yemek için bağırırım',          isCorrect: false, feedback: 'Sakin kalmak gerekir.' }
        ],
        correctOptionId: 'b',
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
          { id: 'a', text: 'Panik yaparım',                        isCorrect: false, feedback: 'Sakin ol ve yardım iste.' },
          { id: 'b', text: 'Koşarak kaçırım',                      isCorrect: false, feedback: 'Sakince doğru yeri bul.' },
          { id: 'c', text: 'Koltukta kalırım',                     isCorrect: false, feedback: 'Doğru vagona geçmek daha uygundur.' },
          { id: 'd', text: 'Görevliye sorup doğru vagona geçerim', isCorrect: true,  feedback: 'Yardım isteyip doğru yere gitmek en iyisi.' }
        ],
        correctOptionId: 'd',
        previousStepId: 'tren-16',
        nextStepId: 'tren-18'
      },
      {
        id: 'tren-18',
        question: 'Varışa 10 dakika kaldı. Ne yaparsın?',
        imageUrl: 'https://images.unsplash.com/photo-1505842465776-3f8a8e0aebf2',
        options: [
          { id: 'a', text: 'Eşyaları bırakırım',    isCorrect: false, feedback: 'Eşyalarını unutmamak için toparla.' },
          { id: 'b', text: 'Eşyalarımı toparlarım', isCorrect: true,  feedback: 'Hazırlıklı olmak iyi fikirdir.' },
          { id: 'c', text: 'Uyumaya başlarım',      isCorrect: false, feedback: 'Varış yaklaştı, hazırlıklı ol.' },
          { id: 'd', text: 'Yerimi kirletirim',     isCorrect: false, feedback: 'Temiz bırakmak önemlidir.' }
        ],
        correctOptionId: 'b',
        previousStepId: 'tren-17',
        nextStepId: 'tren-19'
      },
      {
        id: 'tren-19',
        question: 'Tren durdu. Kapı açılınca ne yaparsın?',
        imageUrl: 'https://images.unsplash.com/photo-1526413232644-2b6d2d2b6b86',
        options: [
          { id: 'a', text: 'İterek çıkarım',           isCorrect: false, feedback: 'Sırayla ve nazikçe inmelisin.' },
          { id: 'b', text: 'İnmem, otururum',          isCorrect: false, feedback: 'Varış yerindesin, inmelisin.' },
          { id: 'c', text: 'Sakinçe inip yolu açarım', isCorrect: true,  feedback: 'Nazikçe inmek doğru davranış.' },
          { id: 'd', text: 'Panikle koşarım',          isCorrect: false, feedback: 'Sakin olmak güvenlidir.' }
        ],
        correctOptionId: 'c',
        previousStepId: 'tren-18',
        nextStepId: 'tren-20'
      },
      {
        id: 'tren-20',
        question: 'İstasyonda çıkış tabelası görüyorsun. Ne yaparsın?',
        imageUrl: 'https://images.unsplash.com/photo-1505842465776-3f8a8e0aebf2',
        options: [
          { id: 'a', text: 'Rastgele yürürüm',      isCorrect: false, feedback: 'Tabelaları takip etmek daha doğru.' },
          { id: 'b', text: 'Yanlış kapıya giderim', isCorrect: false, feedback: 'Doğru çıkışı bulmalısın.' },
          { id: 'c', text: 'Geri trene binerim',    isCorrect: false, feedback: 'Artık çıkışa gitmelisin.' },
          { id: 'd', text: 'Tabelayı takip ederim', isCorrect: true,  feedback: 'Tabelaları takip etmek kolaylaştırır.' }
        ],
        correctOptionId: 'd',
        previousStepId: 'tren-19',
        nextStepId: 'tren-21'
      },
      {
        id: 'tren-21',
        question: 'Danışma gördün, yol sorabilir misin?',
        imageUrl: 'https://images.unsplash.com/photo-1519751138087-5ac7f42f7f19',
        options: [
          { id: 'a', text: 'Bağırırım',             isCorrect: false, feedback: 'Nazik olmak her zaman iyidir.' },
          { id: 'b', text: 'Nazikçe adres sorarım', isCorrect: true,  feedback: 'Nazikçe sormak doğru.' },
          { id: 'c', text: 'Hiç kimseye sormam',    isCorrect: false, feedback: 'Gerekirse sorup öğrenebilirsin.' },
          { id: 'd', text: 'O kişiye kızarım', isCorrect: false, feedback: 'Sakin ve saygılı ol.' }
        ],
        correctOptionId: 'b',
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
        question: 'Çıkışta turnike var. Biletin geçerli mi?',
        imageUrl: 'https://images.unsplash.com/photo-1505842465776-3f8a8e0aebf2',
        options: [
          { id: 'a', text: 'Turnikeyi atlarım',           isCorrect: false, feedback: 'Turnikeyi atlamak yanlış davranış.' },
          { id: 'b', text: 'Biletimi kaybettim',          isCorrect: false, feedback: 'Biletini dikkatli kullanmalısın.' },
          { id: 'c', text: 'Başkasının biletini kullanırım', isCorrect: false, feedback: 'Kendi biletini kullanmalısın.' },
          { id: 'd', text: 'Biletimi turnikeye okuturum', isCorrect: true,  feedback: 'Biletini doğru şekilde kullandın.' }
        ],
        correctOptionId: 'd',
        previousStepId: 'tren-22',
        nextStepId: 'tren-24'
      },
      {
        id: 'tren-24',
        question: 'İstasyondan çıktın. Yolculuk bitti. Ne yaparsın?',
        imageUrl: 'https://images.unsplash.com/photo-1526413232644-2b6d2d2b6b86',
        options: [
          { id: 'a', text: 'Geri dönerim',                  isCorrect: false, feedback: 'Artık hedefe doğru ilerlemelisin.' },
          { id: 'b', text: 'Hedefime doğru sakinçe yürürüm', isCorrect: true,  feedback: 'Sakin ve dikkatli ilerlemek iyi.' },
          { id: 'c', text: 'Eşyaları bırakırım',            isCorrect: false, feedback: 'Eşyalarını yanında tutmalısın.' },
          { id: 'd', text: 'Koşarak kaybolurum',            isCorrect: false, feedback: 'Sakin ve dikkatli ilerle.' }
        ],
        correctOptionId: 'b',
        previousStepId: 'tren-23'
      }
    ]
  },

  // Yeni Senaryo: Postaneden Kargo Gönderme
  {
    id: 'post-office-shipment',
    title: 'Postaneden Kargo Gönderme',
    description: 'Görevliyle iletişim kurarak kargo gönderimi yapmak',
    difficulty: 'Zor',
    icon: Briefcase,
    color: '#FF9800',
    completed: false,
    category: 'Günlük',
    maxScore: 130,
    steps: [
      {
        id: 'step1',
        question: 'Postaneye girdin, görevli "Hoş geldiniz" dedi. Ne söylersin?',
        imageUrl: 'https://images.unsplash.com/photo-1607083203389-8429b47c86a8',
        options: [
          { id: 'a', text: 'Fiyatlar ne kadar?', isCorrect: false, feedback: 'Önce ne yapmak istediğini belirtmelisin.' },
          { id: 'b', text: 'Sessiz kalırım', isCorrect: false, feedback: 'İlk adımda konuşmak önemli.' },
          { id: 'c', text: 'Kargo yollamak istiyorum', isCorrect: true, feedback: 'Amacını net bir şekilde ifade ettin.' },
          { id: 'd', text: 'Kargo alacağım', isCorrect: false, feedback: 'Bu senaryoda sen kargo gönderiyorsun.' }
        ],
        correctOptionId: 'c',
        nextStepId: 'step2'
      },
      {
        id: 'step2',
        question: 'Görevli "Ne göndereceksiniz?" diye sordu. Ne dersin?',
        imageUrl: 'https://images.unsplash.com/photo-1599470136316-1e1a4f6fda63',
        options: [
          { id: 'a', text: 'Hiçbir şey', isCorrect: false, feedback: 'Bir şey gönderiyorsun, belirtmen gerekir.' },
          { id: 'b', text: 'Bir kutu belge göndereceğim', isCorrect: true, feedback: 'Ne göndereceğini net belirttin.' },
          { id: 'c', text: 'Ne fark eder', isCorrect: false, feedback: 'Görevlinin bilgisi olması gerekir.' },
          { id: 'd', text: 'Evimi gönderiyorum', isCorrect: false, feedback: 'Bu mantıklı bir cevap değil.' }
        ],
        correctOptionId: 'b',
        nextStepId: 'step3'
      },
      {
        id: 'step3',
        question: 'Görevli "Alıcı adresini yazar mısınız?" dedi. Ne yaparsın?',
        imageUrl: 'https://images.unsplash.com/photo-1610484826967-0f4263c8077e',
        options: [
          { id: 'a', text: 'Yazmak istemem', isCorrect: false, feedback: 'Adres olmadan gönderim yapılamaz.' },
          { id: 'b', text: 'Kendi adresimi yazarım', isCorrect: false, feedback: 'Alıcının adresi gerekli.' },
          { id: 'c', text: 'Adresi söylerim ama yazmam', isCorrect: false, feedback: 'Yazılı olması gereklidir.' },
          { id: 'd', text: 'Adres bilgilerini yazarım', isCorrect: true, feedback: 'Doğru, adres yazımı önemli.' }
        ],
        correctOptionId: 'd',
        nextStepId: 'step4'
      },
      {
        id: 'step4',
        question: 'Görevli "Hızlı mı normal kargo mu?" dedi. Ne dersin?',
        imageUrl: 'https://images.unsplash.com/photo-1633780350701-d3f926da0a6d',
        options: [
          { id: 'a', text: 'Hiç fark etmez', isCorrect: false, feedback: 'Bir tercih belirtmelisin.' },
          { id: 'b', text: 'Normal olsun', isCorrect: true, feedback: 'Teslim süresine karar verdin.' },
          { id: 'c', text: 'İkisini de istiyorum', isCorrect: false, feedback: 'Sadece biri seçilmeli.' },
          { id: 'd', text: 'Kargoyu iptal edin', isCorrect: false, feedback: 'Gönderim yapacaksın, iptal değil.' }
        ],
        correctOptionId: 'b',
        nextStepId: 'step5'
      },
      {
        id: 'step5',
        question: 'Görevli "Gönderinizin içinde belge olduğunu belirttiniz. Islanmaya karşı önlem alınmasını ister misiniz?" diye soruyor. Ne dersin?',
        imageUrl: 'https://images.unsplash.com/photo-1611251086975-62b6f38ccdb7',
        options: [
          { id: 'a', text: 'Evet, su geçirmez poşete koyabilir misiniz?', isCorrect: true, feedback: 'Doğru, belgelerin zarar görmemesi için önlem almak önemlidir.' },
          { id: 'b', text: 'Hayır, bir şey olmaz', isCorrect: false, feedback: 'Belge gönderilerinde önlem almak her zaman daha güvenlidir.' },
          { id: 'c', text: 'Fark etmez', isCorrect: false, feedback: 'Kararsız cevaplar yerine net talimat vermelisin.' },
          { id: 'd', text: 'Ne demek istediğinizi anlamadım', isCorrect: false, feedback: 'Görevliye açıklattıktan sonra tercihini belirtebilirsin.' }
        ],
        correctOptionId: 'a',
        nextStepId: 'step6'
      },
      {
        id: 'step6',
        question: 'Görevli paketi tarttı ve fiyat söyledi. Ne yaparsın?',
        imageUrl: 'https://images.unsplash.com/photo-1606744824166-455ed8855795',
        options: [
          { id: 'a', text: 'Paket ağırmış', isCorrect: false, feedback: 'Görevliye ödeme şekli söylemelisin.' },
          { id: 'b', text: 'Gitmekten vazgeçerim', isCorrect: false, feedback: 'Gönderimi tamamlamak için ödeme yapmalısın.' },
          { id: 'c', text: 'Ödeme yöntemimi söylerim', isCorrect: true, feedback: 'Doğru, bir ödeme yöntemi seçmelisin.' },
          { id: 'd', text: 'Hiçbir şey yapmam', isCorrect: false, feedback: 'Cevap vermen gerekiyor.' }
        ],
        correctOptionId: 'c',
        nextStepId: 'step7'
      },
      {
        id: 'step7',
        question: 'Ödeme yapıldı. Görevli "Fiş ister misiniz?" diyor. Ne dersin?',
        imageUrl: 'https://images.unsplash.com/photo-1611421718082-f21c305c5a0c',
        options: [
          { id: 'a', text: 'Evet, alayım', isCorrect: true, feedback: 'Fiş almak ileride lazım olabilir.' },
          { id: 'b', text: 'İstemez', isCorrect: false, feedback: 'Fiş alman önerilir.' },
          { id: 'c', text: 'Bilmiyorum', isCorrect: false, feedback: 'Tercihini net belirtmelisin.' },
          { id: 'd', text: 'Ne fişi?', isCorrect: false, feedback: 'Ödeme sonrası fiş almak yaygındır.' }
        ],
        correctOptionId: 'a',
        nextStepId: 'step8'
      },
      {
        id: 'step8',
        question: 'Paketin üstüne barkod etiketi yapıştırılıyor. Ne yaparsın?',
        imageUrl: 'https://images.unsplash.com/photo-1603126857091-9ff23a86a106',
        options: [
          { id: 'a', text: 'Bana ne', isCorrect: false, feedback: 'Nazik olmalısın.' },
          { id: 'b', text: 'O ne işe yarıyor?', isCorrect: false, feedback: 'Şüphelenmeden işlemi takip et.' },
          { id: 'c', text: 'Hiçbir şey söylemem', isCorrect: false, feedback: 'Nazikçe karşılık vermek iyidir.' },
          { id: 'd', text: 'Teşekkür ederim', isCorrect: true, feedback: 'Nazikçe teşekkür ettin.' }
        ],
        correctOptionId: 'd',
        nextStepId: 'step9'
      },
      {
        id: 'step9',
        question: 'Görevli "Teslimat takip numaranız budur" diyor. Ne yaparsın?',
        imageUrl: 'https://images.unsplash.com/photo-1605283164920-542cf3a65d8a',
        options: [
          { id: 'a', text: 'Gerek yok derim', isCorrect: false, feedback: 'Bu bilgi önemli.' },
          { id: 'b', text: 'Kime lazım?', isCorrect: false, feedback: 'Sana lazım olacak.' },
          { id: 'c', text: 'Kaybederim', isCorrect: false, feedback: 'Kaybetmemeye çalışmalısın.' },
          { id: 'd', text: 'Numarayı not alırım', isCorrect: true, feedback: 'Doğru, takip için gerekli.' }
        ],
        correctOptionId: 'd',
        nextStepId: 'step10'
      },
      {
        id: 'step10',
        question: 'Görevli, kargonun tahmini teslim süresini bildiriyor. Ne yaparsın?',
        imageUrl: 'https://images.unsplash.com/photo-1589998059171-988d3b4a1aa5',
        options: [
          { id: 'a', text: 'Beni ilgilendirmez', isCorrect: false, feedback: 'Teslim süresi alıcının planı için önemlidir.' },
          { id: 'b', text: 'Boşverin söylemeyin', isCorrect: false, feedback: 'Bilgi almak senin hakkın ve önemli.' },
          { id: 'c', text: 'Hemen ulaşsın, acelem var', isCorrect: false, feedback: 'Teslim süresi değiştiremezsin. Sabırla bekle.' },
          { id: 'd', text: 'Teşekkür ederim, not alıyorum', isCorrect: true, feedback: 'Nazik bir şekilde bilgiye karşılık verdin.' }
        ],
        correctOptionId: 'd',
        nextStepId: 'step11'
      },
      {
        id: 'step11',
        question: 'Çıkışa doğru yürüyorsun. Ne yaparsın?',
        imageUrl: 'https://images.unsplash.com/photo-1578873372346-1572f26fb9c4',
        options: [
          { id: 'a', text: 'Koşarak çıkarım', isCorrect: false, feedback: 'Sakin olmalısın.' },
          { id: 'b', text: 'Kapıdan dikkatlice çıkarım', isCorrect: true, feedback: 'Dikkatli olmak önemli.' },
          { id: 'c', text: 'Yerlere bakmam', isCorrect: false, feedback: 'Çevrene dikkat etmelisin.' },
          { id: 'd', text: 'Yolumu şaşırırım', isCorrect: false, feedback: 'Yönünü bilmelisin.' }
        ],
        correctOptionId: 'b',
        nextStepId: 'step12'
      },
      {
        id: 'step12',
        question: 'Postaneden çıktın. Şimdi ne yaparsın?',
        imageUrl: 'https://images.unsplash.com/photo-1524678714210-9917a6c619c1',
        options: [
          { id: 'a', text: 'Teslimat sürecini takip ederim', isCorrect: true, feedback: 'Kargonun durumunu bilmek önemlidir.' },
          { id: 'b', text: 'Hiç ilgilenmem', isCorrect: false, feedback: 'Takip etmek önemlidir.' },
          { id: 'c', text: 'Unuturum', isCorrect: false, feedback: 'Bilgileri kaydetmelisin.' },
          { id: 'd', text: 'Başkasına sorarım', isCorrect: false, feedback: 'Kendi kargonun sorumluluğu sende.' }
        ],
        correctOptionId: 'a'
      }
    ]
  },

  // Yeni Senaryo: Sinema Bileti Alma
  {
    id: 'cinema-ticket-purchase',
    title: 'Sinema Bileti Alma',
    description: 'Giședen bilet alma ve filme hazırlık',
    difficulty: 'Zor',
    icon: Calendar,
    color: '#673AB7',
    completed: false,
    category: 'Toplum',
    maxScore: 130,
    steps: [
      {
        id: 'step1',
        question: 'Sinema gișesine geldin. Görevli "Hoș geldiniz" dedi. Ne söylersin?',
        imageUrl: 'https://images.unsplash.com/photo-1596477602103-c6d3bbf4be5b',
        options: [
          { id: 'a', text: 'Ne var?', isCorrect: false, feedback: 'Nazik olmalısın.' },
          { id: 'b', text: 'Bir bilet almak istiyorum', isCorrect: true, feedback: 'Doğrudan isteğini belirttin.' },
          { id: 'c', text: 'Film yok mu?', isCorrect: false, feedback: 'Önce bilet isteğini söylemelisin.' },
          { id: 'd', text: 'Konuşmam', isCorrect: false, feedback: 'İletişim kurmak önemlidir.' }
        ],
        correctOptionId: 'b',
        nextStepId: 'step2'
      },
      {
        id: 'step2',
        question: 'Görevli "Hangi filme bilet istiyorsunuz?" diye soruyor. Ne dersin?',
        imageUrl: 'https://images.unsplash.com/photo-1464983953574-0892a716854b',
        options: [
          { id: 'a', text: 'Avatar filmine', isCorrect: true, feedback: 'Hangi filmi izlemek istediğini belirttin.' },
          { id: 'b', text: 'Bilmiyorum', isCorrect: false, feedback: 'Film seçmelisin.' },
          { id: 'c', text: 'Farketmez', isCorrect: false, feedback: 'Bir film seçmelisin.' },
          { id: 'd', text: 'Hiçbir şey söylemem', isCorrect: false, feedback: 'Cevap vermelisin.' }
        ],
        correctOptionId: 'a',
        nextStepId: 'step3'
      },
      {
        id: 'step3',
        question: 'Görevli "Kaç kişilik bilet alacaksınız?" diyor. Ne dersin?',
        imageUrl: 'https://images.unsplash.com/photo-1517602302552-471fe67acf66',
        options: [
          { id: 'a', text: 'Bir kişilik', isCorrect: true, feedback: 'Kişi sayısını net belirttin.' },
          { id: 'b', text: 'Bilmiyorum', isCorrect: false, feedback: 'Kişi sayısını belirtmelisin.' },
          { id: 'c', text: 'Çok', isCorrect: false, feedback: 'Net sayı vermelisin.' },
          { id: 'd', text: 'Hiçbir şey söylemem', isCorrect: false, feedback: 'Cevap vermelisin.' }
        ],
        correctOptionId: 'a',
        nextStepId: 'step4'
      },
      {
        id: 'step4',
        question: 'Görevli hangi saat için bilet istediğini soruyor. Ne cevap verirsin?',
        imageUrl: 'https://images.unsplash.com/photo-1570824109366-0f0aa488c925',
        options: [
          { id: 'a', text: 'Bilmiyorum, siz seçin', isCorrect: false, feedback: 'Tercihini senin yapman gerekiyor.' },
          { id: 'b', text: 'Bugün değil, yarın', isCorrect: false, feedback: 'Bugünün saatleri sorulmuştu, günü değiştirme doğru değil.' },
          { id: 'c', text: 'Gece 3.00 ', isCorrect: false, feedback: 'Bu saatte film olmaz.' },
          { id: 'd', text: 'Saat 19:00 seansı için lütfen', isCorrect: true, feedback: 'Net bir şekilde saat belirttin, çok iyi.' }
        ],
        correctOptionId: 'd',
        nextStepId: 'step5'
      },
      {
        id: 'step5',
        question: 'Görevli, 3 boyutlu gözlük istersen ekstra ücret alınacağını söylüyor. Ne yaparsın?',
        imageUrl: 'https://images.unsplash.com/photo-1603297631957-6f8ae5b6c2a9',
        options: [
          { id: 'a', text: 'Evet, gözlük almak istiyorum', isCorrect: true, feedback: 'Doğru, 3D film için gözlük gerekir.' },
          { id: 'b', text: 'Hayır, gözlüğüm zaten var', isCorrect: true, feedback: 'Eğer gözlüğün varsa ekstra ödeme yapmana gerek yok.' },
          { id: 'c', text: 'Ne gözlüğü, anlamadım', isCorrect: false, feedback: 'Film formatı hakkında bilgi almalısın.' },
          { id: 'd', text: '3D filmi gözlüksüz izlerim', isCorrect: false, feedback: '3D film gözlüksüz sağlıklı şekilde izlenemez.' }
        ],
        correctOptionId: ['a', 'b'],
        nextStepId: 'step6'
      },
      {
        id: 'step6',
        question: 'Bilet ücreti söylendi. Ne yaparsın?',
        imageUrl: 'https://images.unsplash.com/photo-1509228468518-180dd4864904',
        options: [
          { id: 'a', text: 'Nakit vereyim', isCorrect: true, feedback: 'Nakit ödeme de uygun.' },
          { id: 'b', text: 'Param yok', isCorrect: false, feedback: 'Ödeme yapmalısın.' },
          { id: 'c', text: 'Kartla ödeyeyim', isCorrect: true, feedback: 'Ödeme yöntemi belirttin.' },
          { id: 'd', text: 'Hiçbir şey yapmam', isCorrect: false, feedback: 'Ödeme yapmalısın.' }
        ],
        correctOptionId: ['a', 'c'],
        nextStepId: 'step7'
      },
      {
        id: 'step7',
        question: 'Ödeme sonrası görevli "Biletinizi alınız" diyor. Ne yaparsın?',
        imageUrl: 'https://images.unsplash.com/photo-1464983953574-0892a716854b',
        options: [
          { id: 'a', text: 'Bileti almam', isCorrect: false, feedback: 'Bileti mutlaka almalısın.' },
          { id: 'b', text: 'Hiçbir şey söylemem', isCorrect: false, feedback: 'Nazik olmak iyi olur.' },
          { id: 'c', text: 'Bileti yere atarım', isCorrect: false, feedback: 'Bileti saklamalısın.' },
          { id: 'd', text: 'Teşekkür ederim', isCorrect: true, feedback: 'Nazikçe teşekkür ettin.' }
        ],
        correctOptionId: 'd',
        nextStepId: 'step8'
      },
      {
        id: 'step8',
        question: 'Filme girmeden önce kontrol var. Ne yaparsın?',
        imageUrl: 'https://images.unsplash.com/photo-1517602302552-471fe67acf66',
        options: [
          { id: 'a', text: 'Bileti saklarım', isCorrect: false, feedback: 'Bileti göstermek gerekir.' },
          { id: 'b', text: 'Hiçbir şey yapmam', isCorrect: false, feedback: 'Bilet kontrolü için biletini göstermelisin.' },
          { id: 'c', text: 'Başkasının biletini gösteririm', isCorrect: false, feedback: 'Kendi biletini göstermelisin.' },
          { id: 'd', text: 'Biletimi gösteririm', isCorrect: true, feedback: 'Doğru, biletini göstermelisin.' }
        ],
        correctOptionId: 'd',
        nextStepId: 'step9'
      },
      {
        id: 'step9',
        question: 'Salon girişinde görevli "İyi seyirler" diyor. Ne dersin?',
        imageUrl: 'https://images.unsplash.com/photo-1464983953574-0892a716854b',
        options: [
          { id: 'a', text: 'Hiçbir şey söylemem', isCorrect: false, feedback: 'Nazik olmak iyi olur.' },
          { id: 'b', text: 'Kızarım', isCorrect: false, feedback: 'Nazikçe karşılık vermelisin.' },
          { id: 'c', text: 'Bileti atarım', isCorrect: false, feedback: 'Bileti saklamalısın.' },
          { id: 'd', text: 'Teşekkür ederim', isCorrect: true, feedback: 'Nazikçe teşekkür ettin.' }
        ],
        correctOptionId: 'd',
        nextStepId: 'step10'
      },
      {
        id: 'step10',
        question: 'Salonda yerini buldun. Ne yaparsın?',
        imageUrl: 'https://images.unsplash.com/photo-1517602302552-471fe67acf66',
        options: [
          { id: 'a', text: 'Koltuk numarama otururum', isCorrect: true, feedback: 'Doğru koltuğa oturdun.' },
          { id: 'b', text: 'Rastgele otururum', isCorrect: false, feedback: 'Kendi koltuğuna oturmalısın.' },
          { id: 'c', text: 'Hiç oturmam', isCorrect: false, feedback: 'Film izlemek için oturmalısın.' },
          { id: 'd', text: 'Başkasının yerine otururum', isCorrect: false, feedback: 'Kendi yerin önemli.' }
        ],
        correctOptionId: 'a',
        nextStepId: 'step11'
      },
      {
        id: 'step11',
        question: 'Film başlamadan önce telefonun çalıyor. Ne yaparsın?',
        imageUrl: 'https://images.unsplash.com/photo-1509228468518-180dd4864904',
        options: [
          { id: 'a', text: 'Telefonu sessize alırım', isCorrect: true, feedback: 'Çevrendekileri rahatsız etmemek için doğru.' },
          { id: 'b', text: 'Yüksek sesle konuşurum', isCorrect: false, feedback: 'Diğer izleyicileri rahatsız etmemelisin.' },
          { id: 'c', text: 'Telefonu kapatmam', isCorrect: false, feedback: 'Sessize almak daha iyi.' },
          { id: 'd', text: 'Bağırırım', isCorrect: false, feedback: 'Sessiz olmalısın.' }
        ],
        correctOptionId: 'a',
        nextStepId: 'step12'
      },
      {
        id: 'step12',
        question: 'Film başladı. Yanındaki kişi yüksek sesle konuşuyor. Ne yaparsın?',
        imageUrl: 'https://images.unsplash.com/photo-1464983953574-0892a716854b',
        options: [
          { id: 'a', text: 'Kavga çıkarırım', isCorrect: false, feedback: 'Nazikçe uyarmak yeterlidir.' },
          { id: 'b', text: 'Hiçbir şey yapmam', isCorrect: false, feedback: 'Rahatsız oluyorsan nazikçe uyarabilirsin.' },
          { id: 'c', text: 'Bağırırım', isCorrect: false, feedback: 'Sakin ve nazik olmak gerekir.' },
          { id: 'd', text: 'Nazikçe sessiz olmasını isterim', isCorrect: true, feedback: 'Nazikçe uyarmak doğru.' }
        ],
        correctOptionId: 'd'
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