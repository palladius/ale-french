// seby-data.js - Vocabolario, Numeri, Saluti e Forme per Sebastian (Primary 1 / A1)
// Allineato al programma scolastico Tandem IMS e al test di Francese di Mme Conde.

const SEBY_DATA = {
  salutations: [
    {
      id: "bonjour",
      fr: "Bonjour",
      it: "Buongiorno / Ciao",
      phonetic: "bon-giùr",
      icon: "☀️",
      example_fr: "Bonjour maîtresse !",
      example_it: "Buongiorno maestra!",
      category: "saluti"
    },
    {
      id: "salut",
      fr: "Salut",
      it: "Ciao (informale)",
      phonetic: "sa-lü",
      icon: "👋",
      example_fr: "Salut les amis !",
      example_it: "Ciao amici!",
      category: "saluti"
    },
    {
      id: "au-revoir",
      fr: "Au revoir",
      it: "Arrivederci",
      phonetic: "o re-vuàr",
      icon: "👋",
      example_fr: "Au revoir, à demain !",
      example_it: "Arrivederci, a domani!",
      category: "saluti"
    },
    {
      id: "bonsoir",
      fr: "Bonsoir",
      it: "Buonasera",
      phonetic: "bon-suàr",
      icon: "🌆",
      example_fr: "Bonsoir papa !",
      example_it: "Buonasera papà!",
      category: "saluti"
    },
    {
      id: "bonne-nuit",
      fr: "Bonne nuit",
      it: "Buonanotte",
      phonetic: "bon nüì",
      icon: "🌙",
      example_fr: "Bonne nuit et fais de beaux rêves !",
      example_it: "Buonanotte e fai bei sogni!",
      category: "saluti"
    },
    {
      id: "comment-tu-tappelles",
      fr: "Comment tu t'appelles ?",
      it: "Come ti chiami?",
      phonetic: "co-man tü tap-pèl?",
      icon: "❓",
      example_fr: "Comment tu t'appelles ? — Je m'appelle Sebastian.",
      example_it: "Come ti chiami? — Mi chiamo Sebastian.",
      category: "presentazione"
    },
    {
      id: "je-mappelle-sebastian",
      fr: "Je m'appelle Sebastian",
      it: "Mi chiamo Sebastian",
      phonetic: "je map-pèl Se-bas-tian",
      icon: "🧒",
      example_fr: "Bonjour, je m'appelle Sebastian !",
      example_it: "Ciao, mi chiamo Sebastian!",
      category: "presentazione"
    },
    {
      id: "quel-age-as-tu",
      fr: "Quel âge as-tu ?",
      it: "Quanti anni hai?",
      phonetic: "kèl ag-ia-tü?",
      icon: "🎂",
      example_fr: "Quel âge as-tu ? — J'ai 6 ans.",
      example_it: "Quanti anni hai? — Ho 6 anni.",
      category: "presentazione"
    },
    {
      id: "jai-6-ans",
      fr: "J'ai 6 ans",
      it: "Ho 6 anni",
      phonetic: "jè sis an",
      icon: "🎈",
      example_fr: "Moi, j'ai 6 ans !",
      example_it: "Io ho 6 anni!",
      category: "presentazione"
    },
    {
      id: "comment-ca-va",
      fr: "Comment ça va ?",
      it: "Come va?",
      phonetic: "co-man sa va?",
      icon: "😊",
      example_fr: "Salut ! Comment ça va ?",
      example_it: "Ciao! Come va?",
      category: "presentazione"
    },
    {
      id: "ca-va-bien",
      fr: "Ça va bien, merci !",
      it: "Va bene, grazie!",
      phonetic: "sa va bien, mair-sì!",
      icon: "👍",
      example_fr: "Ça va très bien, merci !",
      example_it: "Va molto bene, grazie!",
      category: "presentazione"
    },
    {
      id: "merci",
      fr: "Merci",
      it: "Grazie",
      phonetic: "mair-sì",
      icon: "🙏",
      example_fr: "Merci beaucoup !",
      example_it: "Grazie mille!",
      category: "cortesia"
    },
    {
      id: "sil-te-plait",
      fr: "S'il te plaît",
      it: "Per favore",
      phonetic: "sil te plè",
      icon: "✨",
      example_fr: "Une pomme, s'il te plaît.",
      example_it: "Una mela, per favore.",
      category: "cortesia"
    },
    {
      id: "oui-non",
      fr: "Oui / Non",
      it: "Sì / No",
      phonetic: "uì / no",
      icon: "⚖️",
      example_fr: "Oui, s'il vous plaît. Non, merci.",
      example_it: "Sì, per favore. No, grazie.",
      category: "cortesia"
    }
  ],

  nombres: [
    { num: 0, fr: "zéro", it: "zero", phonetic: "ze-rò", dots: 0, icon: "0️⃣" },
    { num: 1, fr: "un", it: "uno", phonetic: "an", dots: 1, icon: "1️⃣" },
    { num: 2, fr: "deux", it: "due", phonetic: "dö", dots: 2, icon: "2️⃣" },
    { num: 3, fr: "trois", it: "tre", phonetic: "truà", dots: 3, icon: "3️⃣" },
    { num: 4, fr: "quatre", it: "quattro", phonetic: "catr", dots: 4, icon: "4️⃣" },
    { num: 5, fr: "cinq", it: "cinque", phonetic: "sank", dots: 5, icon: "5️⃣" },
    { num: 6, fr: "six", it: "sei", phonetic: "sis", dots: 6, icon: "6️⃣" },
    { num: 7, fr: "sept", it: "sette", phonetic: "sèt", dots: 7, icon: "7️⃣" },
    { num: 8, fr: "huit", it: "otto", phonetic: "üìt", dots: 8, icon: "8️⃣" },
    { num: 9, fr: "neuf", it: "nove", phonetic: "nöf", dots: 9, icon: "9️⃣" },
    { num: 10, fr: "dix", it: "dieci", phonetic: "dis", dots: 10, icon: "🔟" },
    { num: 11, fr: "onze", it: "undici", phonetic: "onz", dots: 11, icon: "1️⃣1️⃣" },
    { num: 12, fr: "douze", it: "dodici", phonetic: "duz", dots: 12, icon: "1️⃣2️⃣" }
  ],

  couleurs: [
    { id: "rouge", fr: "rouge", it: "rosso", hex: "#ef4444", icon: "🔴", phonetic: "ruj" },
    { id: "bleu", fr: "bleu", it: "blu", hex: "#3b82f6", icon: "🔵", phonetic: "blö" },
    { id: "vert", fr: "vert", it: "verde", hex: "#10b981", icon: "🟢", phonetic: "vair" },
    { id: "jaune", fr: "jaune", it: "giallo", hex: "#eab308", icon: "🟡", phonetic: "jon" },
    { id: "orange", fr: "orange", it: "arancione", hex: "#f97316", icon: "🟠", phonetic: "o-ranj" },
    { id: "rose", fr: "rose", it: "rosa", hex: "#ec4899", icon: "🌸", phonetic: "roz" },
    { id: "violet", fr: "violet", it: "viola", hex: "#8b5cf6", icon: "🟣", phonetic: "vio-lè" },
    { id: "noir", fr: "noir", it: "nero", hex: "#1e293b", icon: "⚫", phonetic: "nuàr" },
    { id: "blanc", fr: "blanc", it: "bianco", hex: "#f8fafc", icon: "⚪", border: "#cbd5e1", phonetic: "blan" }
  ],

  formes: [
    { id: "le-cercle", fr: "le cercle", it: "il cerchio", icon: "⭕", phonetic: "le sercl" },
    { id: "le-carre", fr: "le carré", it: "il quadrato", icon: "⬛", phonetic: "le car-rè" },
    { id: "le-triangle", fr: "le triangle", it: "il triangolo", icon: "🔺", phonetic: "le tri-angl" },
    { id: "le-rectangle", fr: "le rectangle", it: "il rettangolo", icon: "🟩", phonetic: "le rèk-tangl" }
  ]
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = SEBY_DATA;
}
