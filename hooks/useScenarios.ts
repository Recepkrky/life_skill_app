import { useState, useEffect } from 'react';
import { Scenario } from '@/types';
import { 
  ShoppingCart,
  Bus,
  CreditCard,
  Phone,
  Hospital,
  Briefcase 
} from 'lucide-react-native';

const initialScenarios: Scenario[] = [
  {
    id: 'market-shopping',
    title: 'Market Alışverişi',
    description: 'Kasiyerle konuşma, ürün sorma, ödeme yapma',
    category: 'daily',
    difficulty: 'Kolay',
    duration: '10-15 dk',
    icon: ShoppingCart,
    color: '#4A90E2',
    completed: false,
  },
  {
    id: 'bus-travel',
    title: 'Otobüs Yolculuğu',
    description: 'Bilet alma, şoförle konuşma, inmek isteme',
    category: 'transport',
    difficulty: 'Orta',
    duration: '15-20 dk',
    icon: Bus,
    color: '#7ED321',
    completed: false,
  },
  {
    id: 'bank-visit',
    title: 'Banka Ziyareti',
    description: 'Hesap açma, para çekme, bilgi alma',
    category: 'finance',
    difficulty: 'Zor',
    duration: '20-25 dk',
    icon: CreditCard,
    color: '#F5A623',
    completed: false,
  },
  {
    id: 'phone-call',
    title: 'Telefon Görüşmesi',
    description: 'Randevu alma, bilgi sorma, kibarca kapama',
    category: 'daily',
    difficulty: 'Orta',
    duration: '10-15 dk',
    icon: Phone,
    color: '#9013FE',
    completed: false,
  },
  {
    id: 'doctor-visit',
    title: 'Doktor Randevusu',
    description: 'Şikayetleri anlatma, soruları cevaplama',
    category: 'health',
    difficulty: 'Orta',
    duration: '15-20 dk',
    icon: Hospital,
    color: '#E74C3C',
    completed: false,
  },
  {
    id: 'job-interview',
    title: 'İş Görüşmesi',
    description: 'Kendini tanıtma, sorulara cevap verme',
    category: 'work',
    difficulty: 'Zor',
    duration: '25-30 dk',
    icon: Briefcase,
    color: '#2ECC71',
    completed: false,
  },
];

export function useScenarios() {
  const [scenarios, setScenarios] = useState<Scenario[]>(initialScenarios);
  const [loading, setLoading] = useState(false);

  const updateScenarioProgress = (scenarioId: string, completed: boolean) => {
    setScenarios(prev => 
      prev.map(scenario => 
        scenario.id === scenarioId 
          ? { ...scenario, completed }
          : scenario
      )
    );
  };

  const getScenarioById = (id: string): Scenario | undefined => {
    return scenarios.find(scenario => scenario.id === id);
  };

  const getScenariosByCategory = (category: string): Scenario[] => {
    if (category === 'all') return scenarios;
    return scenarios.filter(scenario => scenario.category === category);
  };

  const getCompletedScenariosCount = (): number => {
    return scenarios.filter(scenario => scenario.completed).length;
  };

  const getSuccessRate = (): number => {
    const completed = getCompletedScenariosCount();
    const total = scenarios.length;
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  };

  return {
    scenarios,
    loading,
    updateScenarioProgress,
    getScenarioById,
    getScenariosByCategory,
    getCompletedScenariosCount,
    getSuccessRate,
  };
}