import dayjs from 'dayjs';
import updateLocale from 'dayjs/plugin/updateLocale';
import 'dayjs/locale/ms'; // Malay
import 'dayjs/locale/en'; // English
import 'dayjs/locale/zh'; // Chinese
import 'dayjs/locale/ta'; // Tamil

import { languageTag } from '$lib/paraglide/runtime';


let currentLanguage = languageTag(); 
console.log('dayjs currentLanguage', currentLanguage);
dayjs.extend(updateLocale);

// Define custom configurations for each language
const languageConfigs = {
  ms: {
    months: [
      "Januari", "Februari", "Mac", "April", "Mei", "Jun", "Julai",
      "Ogos", "September", "Oktober", "November", "Disember"
    ],
    monthsShort: [
      "Jan", "Feb", "Mac", "Apr", "Mei", "Jun", "Jul",
      "Ogo", "Sep", "Okt", "Nov", "Dis"
    ],
    weekdays: [
      "Ahad", "Isnin", "Selasa", "Rabu", "Khamis", "Jumaat", "Sabtu"
    ],
    meridiem: (hour) => (hour < 12 ? 'pagi' : hour === 12 ? 'tengahari' : hour < 20 ? 'petang' : 'malam')
  },
  en: {}, // English uses default configuration
  zh: {}, // Chinese uses default configuration
  ta: {}  // Tamil uses default configuration
};

// Set the default locale
dayjs.locale(currentLanguage, languageConfigs[currentLanguage]);


// $effect(() => {
//   if (languageConfigs[currentLanguage]) {
//     dayjs.updateLocale(currentLanguage, languageConfigs[currentLanguage]); // Update locale with custom configuration
//   }
//   dayjs.locale(currentLanguage); // Set Day.js locale globally
// });

// Initialize the locale
export function setLanguage(lang) {
  if (languageConfigs[lang]) {
    dayjs.updateLocale(lang, languageConfigs[lang]); // Update locale with custom configuration
  }
  dayjs.locale(lang); // Set Day.js locale globally
}

export default dayjs;
