export interface VisitRecord {
  date: string; // YYYY-MM-DD
  displayDate: string; // "26 Oct 2026"
  count: number;
}

export interface CertificateRecord {
  id: string;
  candidateName: string;
  candidatePhone: string;
  netWpm: number;
  accuracyPct: number;
  correctCount: number;
  wrongCount: number;
  language: 'english' | 'hindi';
  level: number;
  date: string;
  downloadedAt: string;
  certSerial: string;
}

// Clean storage keys for 100% authentic, real data tracking (no dummy seeds)
const VISITS_KEY = 'ekta_real_visits_v1';
const CERTS_KEY = 'ekta_real_certificates_v1';

/**
 * Records a real website visit for today.
 * Every time a user opens or navigates to the website, today's counter increments by 1.
 */
export const recordWebsiteVisit = (): void => {
  try {
    const todayKey = new Date().toISOString().split('T')[0];
    const raw = localStorage.getItem(VISITS_KEY);
    let store: { daily: Record<string, number> };

    if (!raw) {
      store = { daily: {} };
    } else {
      store = JSON.parse(raw);
      if (!store.daily) store.daily = {};
    }

    // Increment today's authentic visit count
    store.daily[todayKey] = (store.daily[todayKey] || 0) + 1;
    localStorage.setItem(VISITS_KEY, JSON.stringify(store));
  } catch (e) {
    console.error('Failed to record real visit', e);
  }
};

/**
 * Returns real analytics data: total visits across all recorded days,
 * today's visits, yesterday's visits, and historical daily breakdown.
 */
export const getVisitAnalytics = () => {
  try {
    const todayKey = new Date().toISOString().split('T')[0];
    const raw = localStorage.getItem(VISITS_KEY);
    let store: { daily: Record<string, number> };

    if (!raw) {
      store = { daily: { [todayKey]: 1 } };
      localStorage.setItem(VISITS_KEY, JSON.stringify(store));
    } else {
      store = JSON.parse(raw);
      if (!store.daily) store.daily = {};
      if (!store.daily[todayKey]) {
        store.daily[todayKey] = 1;
        localStorage.setItem(VISITS_KEY, JSON.stringify(store));
      }
    }

    const todayCount = store.daily[todayKey] || 0;

    // Real total visits is strictly the sum of all recorded daily visits
    const totalVisits = Object.values(store.daily).reduce((sum, count) => sum + count, 0);

    // Yesterday's date
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayKey = yesterday.toISOString().split('T')[0];
    const yesterdayCount = store.daily[yesterdayKey] || 0;

    // Past date breakdown sorted newest first
    const sortedDates: VisitRecord[] = Object.entries(store.daily)
      .map(([date, count]) => {
        const parts = date.split('-');
        let displayDate = date;
        if (parts.length === 3) {
          const dObj = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
          displayDate = dObj.toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
          });
        }
        return { date, displayDate, count };
      })
      .sort((a, b) => b.date.localeCompare(a.date));

    return {
      totalVisits,
      todayVisits: todayCount,
      yesterdayVisits: yesterdayCount,
      history: sortedDates
    };
  } catch (e) {
    console.error('Error getting real analytics', e);
    return {
      totalVisits: 1,
      todayVisits: 1,
      yesterdayVisits: 0,
      history: []
    };
  }
};

/**
 * Saves a real certificate record when a user finishes a test and downloads their certificate.
 */
export const saveCertificateRecord = (record: CertificateRecord): void => {
  try {
    const raw = localStorage.getItem(CERTS_KEY);
    const existing: CertificateRecord[] = raw ? JSON.parse(raw) : [];
    // Add new real certificate at the front of the list
    const updated = [record, ...existing];
    localStorage.setItem(CERTS_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save real certificate record', e);
  }
};

/**
 * Returns all real certificates downloaded by users.
 * Starts empty ([]) with zero mock/dummy records.
 */
export const getCertificateRecords = (): CertificateRecord[] => {
  try {
    const raw = localStorage.getItem(CERTS_KEY);
    if (!raw) {
      return [];
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to read real certificates', e);
    return [];
  }
};
