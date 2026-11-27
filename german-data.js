(function (root) {
  const GERMAN_CATEGORIES = {
    Menschen: { id: 'Menschen', label: 'Menschen', it: 'Persone', color: '#dc2626', bg: '#fef2f2', border: '#fca5a5', emoji: '🧑' },
    Tiere: { id: 'Tiere', label: 'Tiere', it: 'Animali', color: '#2563eb', bg: '#eff6ff', border: '#93c5fd', emoji: '🐾' },
    Pflanzen: { id: 'Pflanzen', label: 'Pflanzen', it: 'Piante', color: '#16a34a', bg: '#f0fdf4', border: '#86efac', emoji: '🌿' },
    Dinge: { id: 'Dinge', label: 'Dinge', it: 'Cose', color: '#92400e', bg: '#fefce8', border: '#fcd34d', emoji: '📦' }
  };

  const GERMAN_ARTICLES = {
    der: { article: 'der', indef: 'ein', akk: 'einen', dat: 'einem', label: 'Maskulin (der)', color: '#2563eb', bg: '#dbeafe', border: '#60a5fa' },
    die: { article: 'die', indef: 'eine', akk: 'eine', dat: 'einer', label: 'Feminin (die)', color: '#db2777', bg: '#fce7f3', border: '#f472b6' },
    das: { article: 'das', indef: 'ein', akk: 'ein', dat: 'einem', label: 'Neutrum (das)', color: '#16a34a', bg: '#dcfce7', border: '#4ade80' }
  };

  // Curated nouns extracted from Alessandro's 3 Tandem IMS Deutschwissen worksheets
  // + Riccardo's favorites (der Uhu, das Auto, Tiere).
  const GERMAN_NOUNS = [
    // === SCHEDA 1: Nomen (Einzahl und Mehrzahl) ===
    {
      id: 'der-apfel',
      article: 'der',
      singular: 'Apfel',
      plural: 'Äpfel',
      pluralRule: 'Umlaut',
      category: 'Pflanzen',
      it: 'la mela',
      itPlural: 'le mele',
      emoji: '🍎',
      image: 'images/de/der-apfel.jpg',
      worksheet: 1,
      phonics: ['vokale', 'umlaute'],
      distractors: ['Apfeln', 'Apfels', 'Äpfele']
    },
    {
      id: 'das-haus',
      article: 'das',
      singular: 'Haus',
      plural: 'Häuser',
      pluralRule: 'Umlaut + -er',
      category: 'Dinge',
      it: 'la casa',
      itPlural: 'le case',
      emoji: '🏠',
      image: 'images/de/das-haus.jpg',
      worksheet: 1,
      phonics: ['zwielaute', 'umlaute'],
      distractors: ['Hause', 'Hauser', 'Häusen']
    },
    {
      id: 'die-maus',
      article: 'die',
      singular: 'Maus',
      plural: 'Mäuse',
      pluralRule: 'Umlaut + -e',
      category: 'Tiere',
      it: 'il topo',
      itPlural: 'i topi',
      emoji: '🐭',
      image: 'images/de/die-maus.jpg',
      worksheet: 1,
      phonics: ['zwielaute', 'umlaute'],
      distractors: ['Mausen', 'Mäuser', 'Mausse']
    },
    {
      id: 'der-igel',
      article: 'der',
      singular: 'Igel',
      plural: 'Igel',
      pluralRule: 'Invariabile (-)',
      category: 'Tiere',
      it: 'il riccio',
      itPlural: 'i ricci',
      emoji: '🦔',
      image: 'images/de/der-igel.jpg',
      worksheet: 1,
      phonics: ['vokale'],
      distractors: ['Igeln', 'Igels', 'Igele']
    },
    {
      id: 'das-blatt',
      article: 'das',
      singular: 'Blatt',
      plural: 'Blätter',
      pluralRule: 'Umlaut + -er',
      category: 'Pflanzen',
      it: 'la foglia',
      itPlural: 'le foglie',
      emoji: '🍃',
      image: 'images/de/das-blatt.jpg',
      worksheet: 1,
      phonics: ['vokale', 'umlaute'],
      spellingTrap: 'Attento alla doppia T (Blatt → Blätter) e alla B maiuscola!',
      distractors: ['Blatte', 'Blatter', 'Blätten']
    },
    {
      id: 'die-wolke',
      article: 'die',
      singular: 'Wolke',
      plural: 'Wolken',
      pluralRule: '-n',
      category: 'Dinge',
      it: 'la nuvola',
      itPlural: 'le nuvole',
      emoji: '☁️',
      image: 'images/de/die-wolke.jpg',
      worksheet: 1,
      phonics: ['vokale'],
      spellingTrap: 'Si scrive con la K (Wolke), non con la C, e con la W maiuscola!',
      distractors: ['Wölke', 'Wolkes', 'Wolker']
    },
    {
      id: 'der-kuerbis',
      article: 'der',
      singular: 'Kürbis',
      plural: 'Kürbisse',
      pluralRule: '-se',
      category: 'Pflanzen',
      it: 'la zucca',
      itPlural: 'le zucche',
      emoji: '🎃',
      image: 'images/de/der-kuerbis.jpg',
      worksheet: 1,
      phonics: ['umlaute'],
      spellingTrap: 'Ricorda la ü e la doppia s al plurale: Kürbisse!',
      distractors: ['Kürbise', 'Kürbissen', 'Kurbisse']
    },
    {
      id: 'das-kind',
      article: 'das',
      singular: 'Kind',
      plural: 'Kinder',
      pluralRule: '-er',
      category: 'Menschen',
      it: 'il bambino',
      itPlural: 'i bambini',
      emoji: '🧒',
      image: 'images/de/das-kind.jpg',
      worksheet: 1,
      phonics: ['vokale'],
      distractors: ['Kinde', 'Kinden', 'Kinds']
    },
    {
      id: 'das-pferd',
      article: 'das',
      singular: 'Pferd',
      plural: 'Pferde',
      pluralRule: '-e',
      category: 'Tiere',
      it: 'il cavallo',
      itPlural: 'i cavalli',
      emoji: '🐴',
      image: 'images/de/das-pferd.jpg',
      worksheet: 1,
      phonics: ['vokale'],
      spellingTrap: 'Inizia con Pf- (Pferd)!',
      distractors: ['Pferden', 'Pferder', 'Pferds']
    },
    {
      id: 'der-loewe',
      article: 'der',
      singular: 'Löwe',
      plural: 'Löwen',
      pluralRule: '-n',
      category: 'Tiere',
      it: 'il leone',
      itPlural: 'i leoni',
      emoji: '🦁',
      image: 'images/de/der-loewe.jpg',
      worksheet: 1,
      phonics: ['umlaute'],
      spellingTrap: 'Con la ö (Löwe → Löwen)!',
      distractors: ['Löwe', 'Löwes', 'Löwer']
    },
    {
      id: 'der-schrank',
      article: 'der',
      singular: 'Schrank',
      plural: 'Schränke',
      pluralRule: 'Umlaut + -e',
      category: 'Dinge',
      it: 'l\'armadio',
      itPlural: 'gli armadi',
      emoji: '🚪',
      image: 'images/de/der-schrank.jpg',
      worksheet: 1,
      phonics: ['vokale', 'umlaute'],
      distractors: ['Schranke', 'Schränken', 'Schranker']
    },
    {
      id: 'die-jahreszeit',
      article: 'die',
      singular: 'Jahreszeit',
      plural: 'Jahreszeiten',
      pluralRule: '-en',
      category: 'Dinge',
      it: 'la stagione',
      itPlural: 'le stagioni',
      emoji: '🗓️',
      worksheet: 1,
      phonics: ['zwielaute'],
      distractors: ['Jahreszeite', 'Jahreszeits', 'Jahreszeiter']
    },
    {
      id: 'der-fuss',
      article: 'der',
      singular: 'Fuß',
      plural: 'Füße',
      pluralRule: 'Umlaut + -e',
      category: 'Menschen',
      it: 'il piede',
      itPlural: 'i piedi',
      emoji: '🦶',
      worksheet: 1,
      phonics: ['vokale', 'umlaute'],
      spellingTrap: 'Usa la ß (Eszett): Fuß → Füße!',
      distractors: ['Fuße', 'Füßen', 'Füßer']
    },
    {
      id: 'die-ampel',
      article: 'die',
      singular: 'Ampel',
      plural: 'Ampeln',
      pluralRule: '-n',
      category: 'Dinge',
      it: 'il semaforo',
      itPlural: 'i semafori',
      emoji: '🚦',
      worksheet: 1,
      phonics: ['vokale'],
      distractors: ['Ampel', 'Ampels', 'Ampele']
    },

    // === EXTRA RICCARDO FAVORITES & SCHEDA 2 (Nomen sortieren) ===
    {
      id: 'der-drache',
      article: 'der',
      singular: 'Drache',
      plural: 'Drachen',
      pluralRule: '-n',
      category: 'Tiere',
      it: 'il drago',
      itPlural: 'i draghi',
      emoji: '🐉',
      image: 'images/de/der-drache.jpg',
      worksheet: 'extra',
      phonics: ['vokale'],
      spellingTrap: 'Ricorda ch in Drache → die Drachen!',
      distractors: ['Drache', 'Draches', 'Drächer']
    },
    {
      id: 'der-papageientaucher',
      article: 'der',
      singular: 'Papageientaucher',
      plural: 'Papageientaucher',
      pluralRule: 'Invariabile (-)',
      category: 'Tiere',
      it: 'il puffino (pulcinella di mare)',
      itPlural: 'i puffini',
      emoji: '🐧',
      image: 'images/de/der-papageientaucher.jpg',
      worksheet: 'extra',
      phonics: ['zwielaute'],
      spellingTrap: 'Parola composta: Papageien + taucher (ha due Zwielaute: ei + au)!',
      distractors: ['Papageientauchern', 'Papageientauchers', 'Papageientäucher']
    },
    {
      id: 'der-uhu',
      article: 'der',
      singular: 'Uhu',
      plural: 'Uhus',
      pluralRule: '-s',
      category: 'Tiere',
      it: 'il gufo reale',
      itPlural: 'i gufi reali',
      emoji: '🦉',
      image: 'images/de/der-uhu.jpg',
      worksheet: 'extra',
      phonics: ['vokale'],
      distractors: ['Uhue', 'Uhun', 'Uhuer']
    },
    {
      id: 'das-auto',
      article: 'das',
      singular: 'Auto',
      plural: 'Autos',
      pluralRule: '-s',
      category: 'Dinge',
      it: 'l\'automobile',
      itPlural: 'le automobili',
      emoji: '🚗',
      image: 'images/de/das-auto.jpg',
      worksheet: 2,
      phonics: ['zwielaute'],
      distractors: ['Auton', 'Autoe', 'Äutos']
    },
    {
      id: 'der-vogel',
      article: 'der',
      singular: 'Vogel',
      plural: 'Vögel',
      pluralRule: 'Umlaut',
      category: 'Tiere',
      it: 'l\'uccello',
      itPlural: 'gli uccelli',
      emoji: '🐦',
      image: 'images/de/der-vogel.jpg',
      worksheet: 2,
      phonics: ['vokale', 'umlaute'],
      spellingTrap: 'Si scrive con la V (Vogel), anche se si legge F!',
      distractors: ['Vogeln', 'Vogels', 'Vögele']
    },
    {
      id: 'der-tiger',
      article: 'der',
      singular: 'Tiger',
      plural: 'Tiger',
      pluralRule: 'Invariabile (-)',
      category: 'Tiere',
      it: 'la tigre',
      itPlural: 'le tigri',
      emoji: '🐯',
      image: 'images/de/der-tiger.jpg',
      worksheet: 2,
      phonics: ['vokale'],
      distractors: ['Tigers', 'Tigern', 'Tigere']
    },
    {
      id: 'der-wal',
      article: 'der',
      singular: 'Wal',
      plural: 'Wale',
      pluralRule: '-e',
      category: 'Tiere',
      it: 'la balena',
      itPlural: 'le balene',
      emoji: '🐋',
      image: 'images/de/der-wal.jpg',
      worksheet: 2,
      phonics: ['vokale', 'konsonanten'],
      distractors: ['Walen', 'Wals', 'Wäle']
    },
    {
      id: 'die-schnecke',
      article: 'die',
      singular: 'Schnecke',
      plural: 'Schnecken',
      pluralRule: '-n',
      category: 'Tiere',
      it: 'la lumaca',
      itPlural: 'le lumache',
      emoji: '🐌',
      image: 'images/de/die-schnecke.jpg',
      worksheet: 2,
      phonics: ['vokale'],
      spellingTrap: 'Ricorda Sch- e -ck- in Schnecke!',
      distractors: ['Schnecke', 'Schneckes', 'Schnecker']
    },
    {
      id: 'der-baecker',
      article: 'der',
      singular: 'Bäcker',
      plural: 'Bäcker',
      pluralRule: 'Invariabile (-)',
      category: 'Menschen',
      it: 'il fornaio',
      itPlural: 'i fornai',
      emoji: '👨‍🍳',
      worksheet: 2,
      phonics: ['umlaute'],
      distractors: ['Bäckers', 'Bäckern', 'Bäckere']
    },
    {
      id: 'das-baby',
      article: 'das',
      singular: 'Baby',
      plural: 'Babys',
      pluralRule: '-s',
      category: 'Menschen',
      it: 'il bebè',
      itPlural: 'i bebè',
      emoji: '👶',
      worksheet: 2,
      phonics: ['vokale'],
      distractors: ['Babyen', 'Babye', 'Babies']
    },
    {
      id: 'die-pilotin',
      article: 'die',
      singular: 'Pilotin',
      plural: 'Pilotinnen',
      pluralRule: '-nen',
      category: 'Menschen',
      it: 'la pilota',
      itPlural: 'le pilote',
      emoji: '👩‍✈️',
      worksheet: 2,
      phonics: ['vokale'],
      distractors: ['Piloten', 'Pilotins', 'Pilotine']
    },
    {
      id: 'die-tante',
      article: 'die',
      singular: 'Tante',
      plural: 'Tanten',
      pluralRule: '-n',
      category: 'Menschen',
      it: 'la zia',
      itPlural: 'le zie',
      emoji: '👩',
      worksheet: 2,
      phonics: ['vokale'],
      distractors: ['Tantes', 'Tante', 'Tänten']
    },
    {
      id: 'die-rose',
      article: 'die',
      singular: 'Rose',
      plural: 'Rosen',
      pluralRule: '-n',
      category: 'Pflanzen',
      it: 'la rosa',
      itPlural: 'le rose',
      emoji: '🌹',
      worksheet: 2,
      phonics: ['vokale'],
      distractors: ['Roses', 'Röse', 'Roser']
    },
    {
      id: 'die-tulpe',
      article: 'die',
      singular: 'Tulpe',
      plural: 'Tulpen',
      pluralRule: '-n',
      category: 'Pflanzen',
      it: 'il tulipano',
      itPlural: 'i tulipani',
      emoji: '🌷',
      worksheet: 2,
      phonics: ['vokale'],
      distractors: ['Tulpes', 'Tülpen', 'Tulper']
    },
    {
      id: 'die-tanne',
      article: 'die',
      singular: 'Tanne',
      plural: 'Tannen',
      pluralRule: '-n',
      category: 'Pflanzen',
      it: 'l\'abete',
      itPlural: 'gli abeti',
      emoji: '🌲',
      worksheet: 2,
      phonics: ['vokale'],
      distractors: ['Tannes', 'Tänner', 'Tanne']
    },
    {
      id: 'die-petersilie',
      article: 'die',
      singular: 'Petersilie',
      plural: 'Petersilien',
      pluralRule: '-n',
      category: 'Pflanzen',
      it: 'il prezzemolo',
      itPlural: 'i prezzemoli',
      emoji: '🌿',
      worksheet: 2,
      phonics: ['vokale'],
      distractors: ['Petersilies', 'Petersilie', 'Petersilier']
    },
    {
      id: 'der-kalender',
      article: 'der',
      singular: 'Kalender',
      plural: 'Kalender',
      pluralRule: 'Invariabile (-)',
      category: 'Dinge',
      it: 'il calendario',
      itPlural: 'i calendari',
      emoji: '📅',
      worksheet: 2,
      phonics: ['vokale'],
      distractors: ['Kalendern', 'Kalenders', 'Kalendere']
    },
    {
      id: 'die-huette',
      article: 'die',
      singular: 'Hütte',
      plural: 'Hütten',
      pluralRule: '-n',
      category: 'Dinge',
      it: 'la capanna',
      itPlural: 'le capanne',
      emoji: '🛖',
      worksheet: 2,
      phonics: ['umlaute'],
      distractors: ['Hüttes', 'Hütter', 'Hutten']
    },
    {
      id: 'das-buch',
      article: 'das',
      singular: 'Buch',
      plural: 'Bücher',
      pluralRule: 'Umlaut + -er',
      category: 'Dinge',
      it: 'il libro',
      itPlural: 'i libri',
      emoji: '📘',
      worksheet: 2,
      phonics: ['vokale', 'umlaute'],
      distractors: ['Buche', 'Buchen', 'Buchs']
    },
    {
      id: 'der-ball',
      article: 'der',
      singular: 'Ball',
      plural: 'Bälle',
      pluralRule: 'Umlaut + -e',
      category: 'Dinge',
      it: 'la palla',
      itPlural: 'le palle',
      emoji: '⚽',
      worksheet: 2,
      phonics: ['vokale', 'umlaute'],
      distractors: ['Balle', 'Bällen', 'Balls']
    },
    {
      id: 'das-flugzeug',
      article: 'das',
      singular: 'Flugzeug',
      plural: 'Flugzeuge',
      pluralRule: '-e',
      category: 'Dinge',
      it: 'l\'aereo',
      itPlural: 'gli aerei',
      emoji: '✈️',
      image: 'images/de/das-flugzeug.jpg',
      worksheet: 2,
      phonics: ['zwielaute'],
      distractors: ['Flugzeugen', 'Flugzeugs', 'Flugzeiger']
    },
    {
      id: 'der-schmetterling',
      article: 'der',
      singular: 'Schmetterling',
      plural: 'Schmetterlinge',
      pluralRule: '-e',
      category: 'Tiere',
      it: 'la farfalla',
      itPlural: 'le farfalle',
      emoji: '🦋',
      image: 'images/de/der-schmetterling.jpg',
      worksheet: 2,
      phonics: ['vokale'],
      distractors: ['Schmetterlingen', 'Schmetterlings', 'Schmetterlinger']
    },
    {
      id: 'die-giraffe',
      article: 'die',
      singular: 'Giraffe',
      plural: 'Giraffen',
      pluralRule: '-n',
      category: 'Tiere',
      it: 'la giraffa',
      itPlural: 'le giraffe',
      emoji: '🦒',
      image: 'images/de/die-giraffe.jpg',
      worksheet: 2,
      phonics: ['vokale'],
      distractors: ['Giraffes', 'Giraffe', 'Giräffen']
    },

    // === SCHEDA 3: Vokale, Umlaute, Zwielaute, Konsonanten (Tiere) ===
    {
      id: 'die-gans',
      article: 'die',
      singular: 'Gans',
      plural: 'Gänse',
      pluralRule: 'Umlaut + -e',
      category: 'Tiere',
      it: 'l\'oca',
      itPlural: 'le oche',
      emoji: '🪿',
      worksheet: 3,
      phonics: ['vokale', 'umlaute'],
      distractors: ['Ganse', 'Gansen', 'Gänser']
    },
    {
      id: 'das-huhn',
      article: 'das',
      singular: 'Huhn',
      plural: 'Hühner',
      pluralRule: 'Umlaut + -er',
      category: 'Tiere',
      it: 'la gallina',
      itPlural: 'le galline',
      emoji: '🐔',
      worksheet: 3,
      phonics: ['vokale', 'umlaute'],
      distractors: ['Huhne', 'Huhner', 'Hühne']
    },
    {
      id: 'der-frosch',
      article: 'der',
      singular: 'Frosch',
      plural: 'Frösche',
      pluralRule: 'Umlaut + -e',
      category: 'Tiere',
      it: 'la rana',
      itPlural: 'le rane',
      emoji: '🐸',
      image: 'images/de/der-frosch.jpg',
      worksheet: 3,
      phonics: ['vokale', 'umlaute'],
      distractors: ['Frosche', 'Fröschen', 'Froschs']
    },
    {
      id: 'der-fisch',
      article: 'der',
      singular: 'Fisch',
      plural: 'Fische',
      pluralRule: '-e',
      category: 'Tiere',
      it: 'il pesce',
      itPlural: 'i pesci',
      emoji: '🐟',
      worksheet: 3,
      phonics: ['vokale'],
      distractors: ['Fischen', 'Fischs', 'Fischer']
    },
    {
      id: 'der-kaefer',
      article: 'der',
      singular: 'Käfer',
      plural: 'Käfer',
      pluralRule: 'Invariabile (-)',
      category: 'Tiere',
      it: 'il coleottero',
      itPlural: 'i coleotteri',
      emoji: '🪲',
      worksheet: 3,
      phonics: ['umlaute'],
      distractors: ['Käfern', 'Käfers', 'Käfere']
    },
    {
      id: 'die-schildkroete',
      article: 'die',
      singular: 'Schildkröte',
      plural: 'Schildkröten',
      pluralRule: '-n',
      category: 'Tiere',
      it: 'la tartaruga',
      itPlural: 'le tartarughe',
      emoji: '🐢',
      image: 'images/de/die-schildkroete.jpg',
      worksheet: 3,
      phonics: ['umlaute'],
      spellingTrap: 'Ha la ö in kröte: Schildkröte!',
      distractors: ['Schildkröte', 'Schildkrötes', 'Schildkrote']
    },
    {
      id: 'das-kueken',
      article: 'das',
      singular: 'Küken',
      plural: 'Küken',
      pluralRule: 'Invariabile (-)',
      category: 'Tiere',
      it: 'il pulcino',
      itPlural: 'i pulcini',
      emoji: '🐥',
      worksheet: 3,
      phonics: ['umlaute'],
      distractors: ['Kükens', 'Kükene', 'Kuken']
    },
    {
      id: 'die-eule',
      article: 'die',
      singular: 'Eule',
      plural: 'Eulen',
      pluralRule: '-n',
      category: 'Tiere',
      it: 'la civetta',
      itPlural: 'le civette',
      emoji: '🦉',
      image: 'images/de/die-eule.jpg',
      worksheet: 3,
      phonics: ['zwielaute'],
      distractors: ['Eules', 'Eule', 'Euler']
    },
    {
      id: 'der-hai',
      article: 'der',
      singular: 'Hai',
      plural: 'Haie',
      pluralRule: '-e',
      category: 'Tiere',
      it: 'lo squalo',
      itPlural: 'gli squali',
      emoji: '🦈',
      worksheet: 3,
      phonics: ['zwielaute'],
      distractors: ['Haien', 'Hais', 'Häie']
    },
    {
      id: 'das-schwein',
      article: 'das',
      singular: 'Schwein',
      plural: 'Schweine',
      pluralRule: '-e',
      category: 'Tiere',
      it: 'il maiale',
      itPlural: 'i maiali',
      emoji: '🐷',
      worksheet: 3,
      phonics: ['zwielaute'],
      distractors: ['Schweinen', 'Schweins', 'Schweiner']
    },
    {
      id: 'das-zebra',
      article: 'das',
      singular: 'Zebra',
      plural: 'Zebras',
      pluralRule: '-s',
      category: 'Tiere',
      it: 'la zebra',
      itPlural: 'le zebre',
      emoji: '🦓',
      image: 'images/de/das-zebra.jpg',
      worksheet: 3,
      phonics: ['konsonanten'],
      distractors: ['Zebren', 'Zebrae', 'Zebrar']
    },
    {
      id: 'der-hamster',
      article: 'der',
      singular: 'Hamster',
      plural: 'Hamster',
      pluralRule: 'Invariabile (-)',
      category: 'Tiere',
      it: 'il criceto',
      itPlural: 'i criceti',
      emoji: '🐹',
      worksheet: 3,
      phonics: ['konsonanten'],
      distractors: ['Hamstern', 'Hamsters', 'Hämster']
    },
    {
      id: 'der-delfin',
      article: 'der',
      singular: 'Delfin',
      plural: 'Delfine',
      pluralRule: '-e',
      category: 'Tiere',
      it: 'il delfino',
      itPlural: 'i delfini',
      emoji: '🐬',
      image: 'images/de/der-delfin.jpg',
      worksheet: 3,
      phonics: ['konsonanten'],
      distractors: ['Delfinen', 'Delfins', 'Delfiner']
    },
    {
      id: 'der-clownfisch',
      article: 'der',
      singular: 'Clownfisch',
      plural: 'Clownfische',
      pluralRule: '-e',
      category: 'Tiere',
      it: 'il pesce pagliaccio',
      itPlural: 'i pesci pagliaccio',
      emoji: '🐠',
      image: 'images/de/der-clownfisch.jpg',
      worksheet: 3,
      phonics: ['konsonanten'],
      distractors: ['Clownfischen', 'Clownfischs', 'Clownfischer']
    }
  ];

  // Extract German phonics spans (Vokale, Umlaute, Zwielaute) for Level 4 (Scheda 3)
  const ZWIELAUTE = ['äu', 'eu', 'ei', 'ai', 'au'];
  const UMLAUTE = ['ä', 'ö', 'ü'];
  const VOKALE = ['a', 'e', 'i', 'o', 'u'];

  function tokenizeGermanPhonics(word) {
    const tokens = [];
    const str = String(word || '');
    let i = 0;
    while (i < str.length) {
      const two = str.slice(i, i + 2).toLowerCase();
      if (ZWIELAUTE.includes(two)) {
        tokens.push({ text: str.slice(i, i + 2), type: 'zwielaut' });
        i += 2;
        continue;
      }
      const one = str[i].toLowerCase();
      if (UMLAUTE.includes(one)) {
        tokens.push({ text: str[i], type: 'umlaut' });
      } else if (VOKALE.includes(one)) {
        tokens.push({ text: str[i], type: 'vokal' });
      } else {
        tokens.push({ text: str[i], type: 'konsonant' });
      }
      i += 1;
    }
    return tokens;
  }

  function evaluateGermanTyping(input, targetNoun, mode) {
    const cleanInput = String(input || '').trim().replace(/\s+/g, ' ');
    const expectedWord = mode === 'plural' ? targetNoun.plural : targetNoun.singular;
    const expectedWithArticle =
      mode === 'plural'
        ? `die ${targetNoun.plural}`
        : `${targetNoun.article} ${targetNoun.singular}`;
    const expectedViele = mode === 'plural' ? `viele ${targetNoun.plural}` : null;

    if (!cleanInput) {
      return { ok: false, reason: 'empty', hint: 'Scrivi la parola con la tastiera!' };
    }

    // Exact match (with or without article, or "viele ..." for plural)
    if (
      cleanInput === expectedWord ||
      cleanInput === expectedWithArticle ||
      (expectedViele && cleanInput === expectedViele)
    ) {
      return { ok: true, reason: 'exact', expected: expectedWithArticle };
    }

    // Check capitalization mistake (Nomen must start with uppercase!)
    const lowerInput = cleanInput.toLowerCase();
    const lowerWord = expectedWord.toLowerCase();
    const lowerWithArt = expectedWithArticle.toLowerCase();
    const lowerViele = expectedViele ? expectedViele.toLowerCase() : null;

    if (
      lowerInput === lowerWord ||
      lowerInput === lowerWithArt ||
      (lowerViele && lowerInput === lowerViele)
    ) {
      return {
        ok: false,
        reason: 'capitalization',
        expected: expectedWithArticle,
        hint: `Quasi! I Nomen tedeschi iniziano SEMPRE con la lettera MAIUSCOLA: "${expectedWord}"!`
      };
    }

    // Check umlaut omission (e.g. Haus -> Hauser instead of Häuser)
    const stripUmlaut = (s) =>
      s
        .replace(/ä/g, 'a')
        .replace(/ö/g, 'o')
        .replace(/ü/g, 'u')
        .replace(/Ä/g, 'A')
        .replace(/Ö/g, 'O')
        .replace(/Ü/g, 'U')
        .replace(/ß/g, 'ss');

    if (
      stripUmlaut(lowerInput) === stripUmlaut(lowerWord) ||
      stripUmlaut(lowerInput) === stripUmlaut(lowerWithArt)
    ) {
      return {
        ok: false,
        reason: 'umlaut',
        expected: expectedWithArticle,
        hint: `Occhio agli Umlaut (ä, ö, ü) o alla ß! La grafia esatta è "${expectedWord}".`
      };
    }

    return {
      ok: false,
      reason: 'mismatch',
      expected: expectedWithArticle,
      hint: targetNoun.spellingTrap || `Riprova! La parola giusta è "${expectedWithArticle}".`
    };
  }

  const exported = {
    GERMAN_CATEGORIES,
    GERMAN_ARTICLES,
    GERMAN_NOUNS,
    tokenizeGermanPhonics,
    evaluateGermanTyping
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = exported;
  }
  if (root) {
    root.GERMAN_DATA = exported;
  }
})(typeof window !== 'undefined' ? window : globalThis);
