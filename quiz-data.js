/**
 * Ale French - Quiz Distractors and Tips
 * Generated for Alessandro and Sebastiano
 */
const QUIZ_DISTRACTORS = {
  "une-bibliotheque": {
    "facile": [
      "une bibliotaca",
      "une bibliosono",
      "une bibliocasa"
    ],
    "moyen": [
      "une bibliotec",
      "une bibliothéque",
      "une bibliotek"
    ],
    "difficile": [
      "une bibliothéque",
      "une bibliotheque",
      "une bibliothêque"
    ],
    "tip": "In francese finisce sempre con -thèque (con h e qu), e l'accento sulla prima è è grave: bibliothèque!"
  },
  "une-fenetre": {
    "facile": [
      "une fanatra",
      "une feneporta",
      "une fenosole"
    ],
    "moyen": [
      "une fenetre",
      "une phénêtre",
      "une fenaistre"
    ],
    "difficile": [
      "une fenétre",
      "une fénêtre",
      "une fenëtre"
    ],
    "tip": "Ha il cappellino magico (^) sulla prima e: fenêtre! Sostituisce la s dell'italiano fineStra!"
  },
  "une-regle": {
    "facile": [
      "une ragla",
      "une reglamita",
      "une roglia"
    ],
    "moyen": [
      "une regle",
      "une reigle",
      "une raigle"
    ],
    "difficile": [
      "une régle",
      "un règle",
      "une rêgle"
    ],
    "tip": "L'accento è grave: rè-gle! Ed è femminile: une règle!"
  },
  "un-hopital": {
    "facile": [
      "un opitello",
      "un hopitalo",
      "un ospedalino"
    ],
    "moyen": [
      "un opital",
      "un hospital",
      "un hopital-"
    ],
    "difficile": [
      "un hopital",
      "un hôpîtal",
      "un hòpital"
    ],
    "tip": "Ha la h muta all'inizio e il cappellino magico (^) sulla o: un hôpital!"
  },
  "l-eau": {
    "facile": [
      "l'aqua",
      "l'eula",
      "le bau"
    ],
    "moyen": [
      "l'o",
      "l'eaux",
      "l'ot"
    ],
    "difficile": [
      "le eau",
      "l'eaux",
      "l'eue"
    ],
    "tip": "Si scrive eau (suona come 'o') e vuole l'apostrofo: l'eau!"
  },
  "des-ciseaux": {
    "facile": [
      "des cisotti",
      "des cesoni",
      "des cizolli"
    ],
    "moyen": [
      "des cisaux",
      "des cizeaux",
      "des sciseaux"
    ],
    "difficile": [
      "des cisots",
      "des ciseauxs",
      "des ciseaus"
    ],
    "tip": "Inizia con c, ha la s dolce e finisce con -eaux al plurale: des ciseaux!"
  },
  "un-ordinateur": {
    "facile": [
      "un computero",
      "un ordinatore",
      "un ordinataur"
    ],
    "moyen": [
      "un ordinateure",
      "un ordinatuer",
      "un ordonateur"
    ],
    "difficile": [
      "un ordinatèur",
      "une ordinateur",
      "un ordinatêur"
    ],
    "tip": "È maschile (un) e finisce in -eur: un ordinateur!"
  },
  "un-tableau": {
    "facile": [
      "un tavolau",
      "un tabli",
      "un tablor"
    ],
    "moyen": [
      "un tableu",
      "un tablo",
      "un tabllo"
    ],
    "difficile": [
      "un tablô",
      "un tabliau",
      "une tableau"
    ],
    "tip": "Finisce con il trittico francese -eau: un tableau!"
  },
  "une-table": {
    "facile": [
      "une tabla",
      "une tobola",
      "une tabul"
    ],
    "moyen": [
      "une tabble",
      "une tauble",
      "une tappe"
    ],
    "difficile": [
      "un table",
      "une tâble",
      "une tablee"
    ],
    "tip": "In francese il tavolo è femminile: UNE table!"
  },
  "une-chaise": {
    "facile": [
      "une scieda",
      "une chasa",
      "une chaisina"
    ],
    "moyen": [
      "une cheise",
      "une chaize",
      "une cheze"
    ],
    "difficile": [
      "un chaise",
      "une chaîse",
      "une chayse"
    ],
    "tip": "Si scrive con ai (che fa il suono 'e') e una sola s: une chaise!"
  },
  "une-armoire": {
    "facile": [
      "une armoira",
      "une armadure",
      "une armuare"
    ],
    "moyen": [
      "une armoir",
      "une harmoire",
      "une armoite"
    ],
    "difficile": [
      "un armoire",
      "une armoîre",
      "une armoïre"
    ],
    "tip": "In francese l'armadio è femminile: une armoire con la 'e' finale!"
  },
  "une-poubelle": {
    "facile": [
      "une pubella",
      "une poubello",
      "une poubarla"
    ],
    "moyen": [
      "une poubele",
      "une poubbel",
      "une pubelle"
    ],
    "difficile": [
      "une poubêlle",
      "une poubèlle",
      "un poubelle"
    ],
    "tip": "Ha ou (suono u) e doppia ll: poubelle!"
  },
  "une-porte": {
    "facile": [
      "une portazza",
      "une parta",
      "une purte"
    ],
    "moyen": [
      "une port",
      "une pourte",
      "une phorte"
    ],
    "difficile": [
      "un porte",
      "une pôrte",
      "une portte"
    ],
    "tip": "Ha la 'e' muta alla fine: une porte!"
  },
  "un-cartable": {
    "facile": [
      "un cartobolo",
      "un cartabello",
      "un sacchettone"
    ],
    "moyen": [
      "un quartable",
      "un cartab",
      "un cartablle"
    ],
    "difficile": [
      "une cartable",
      "un cartâble",
      "un cartabele"
    ],
    "tip": "È maschile in francese: UN cartable!"
  },
  "une-trousse": {
    "facile": [
      "une trossa",
      "une tru-tru",
      "une trussone"
    ],
    "moyen": [
      "une trouse",
      "une trusse",
      "une trouce"
    ],
    "difficile": [
      "un trousse",
      "une troûsse",
      "une trouss"
    ],
    "tip": "Ha ou (suono u) e doppia ss per fare il suono 's' sibilante: une trousse!"
  },
  "un-crayon": {
    "facile": [
      "un crayone",
      "un cravone",
      "un crayonzo"
    ],
    "moyen": [
      "un craion",
      "un creyon",
      "un crayun"
    ],
    "difficile": [
      "une crayon",
      "un crayòn",
      "un crâyon"
    ],
    "tip": "Si scrive con la ipsilon (y) e il suono nasale -on: un crayon!"
  },
  "un-stylo": {
    "facile": [
      "un stila",
      "un stylone",
      "un stylino"
    ],
    "moyen": [
      "un stilo",
      "un stilot",
      "un stylot"
    ],
    "difficile": [
      "une stylo",
      "un stylô",
      "un stylò"
    ],
    "tip": "Si scrive con la ipsilon (y): un stylo!"
  },
  "une-colle": {
    "facile": [
      "une colli",
      "une collazza",
      "une colletta"
    ],
    "moyen": [
      "une cole",
      "une caulle",
      "une coule"
    ],
    "difficile": [
      "un colle",
      "une côlle",
      "une collez"
    ],
    "tip": "Doppia ll e desinenza con e muta: une colle!"
  },
  "une-gomme": {
    "facile": [
      "une gommata",
      "une gammi",
      "une gommolina"
    ],
    "moyen": [
      "une gome",
      "une gom",
      "une gaume"
    ],
    "difficile": [
      "un gomme",
      "une gômme",
      "une gomm"
    ],
    "tip": "Doppia mm e desinenza con e muta: une gomme!"
  },
  "regarder": {
    "facile": [
      "regardare",
      "regardoso",
      "regardoni"
    ],
    "moyen": [
      "regarde",
      "regardez",
      "reguarder"
    ],
    "difficile": [
      "régarder",
      "regardér",
      "regardèr"
    ],
    "tip": "L'infinito dei verbi del primo gruppo finisce sempre in -er (regarder)!"
  },
  "ecouter": {
    "facile": [
      "ecoutare",
      "ecoutoso",
      "ecoutini"
    ],
    "moyen": [
      "ecouter",
      "hecouter",
      "ecouté"
    ],
    "difficile": [
      "ècouter",
      "êcouter",
      "écoutèr"
    ],
    "tip": "Ha l'accento acuto (é) iniziale: écouter!"
  },
  "chanter": {
    "facile": [
      "chantare",
      "cantare",
      "chantoso"
    ],
    "moyen": [
      "chanterz",
      "shanter",
      "chanté"
    ],
    "difficile": [
      "chànter",
      "chênter",
      "chantèr"
    ],
    "tip": "Inizia con ch- (suono 'sc') e finisce in -er: chanter!"
  },
  "montrer": {
    "facile": [
      "montrare",
      "mostrare",
      "montrino"
    ],
    "moyen": [
      "monter",
      "montré",
      "moustrer"
    ],
    "difficile": [
      "mòntrer",
      "montrèr",
      "montrér"
    ],
    "tip": "Ha il suono nasale on: montrer!"
  },
  "mimer": {
    "facile": [
      "mimare",
      "mimetti",
      "mimone"
    ],
    "moyen": [
      "mimmer",
      "mymer",
      "mimé"
    ],
    "difficile": [
      "mîmer",
      "mimèr",
      "mimere"
    ],
    "tip": "Ha una sola m centrale e termina in -er: mimer!"
  },
  "decouper": {
    "facile": [
      "decoupare",
      "tagliare",
      "decoupino"
    ],
    "moyen": [
      "decouper",
      "decouppez",
      "découpper"
    ],
    "difficile": [
      "dècouper",
      "dêcouper",
      "découpér"
    ],
    "tip": "Inizia con dé- con accento acuto (é): découper!"
  },
  "lire": {
    "facile": [
      "liri",
      "liro",
      "lirare"
    ],
    "moyen": [
      "lyre",
      "leer",
      "lirre"
    ],
    "difficile": [
      "lîre",
      "lir",
      "liree"
    ],
    "tip": "Verbo del terzo gruppo: finisce in -re (lire)!"
  },
  "ecrire": {
    "facile": [
      "ecrivare",
      "ecrirare",
      "scrivere"
    ],
    "moyen": [
      "ecrire",
      "hecrire",
      "escrire"
    ],
    "difficile": [
      "ècrire",
      "êcrire",
      "écrir"
    ],
    "tip": "Accento acuto iniziale e termina in -re: écrire!"
  },
  "repondre": {
    "facile": [
      "repondare",
      "rispondere",
      "repondone"
    ],
    "moyen": [
      "repondre",
      "reppondre",
      "réponde"
    ],
    "difficile": [
      "rèpondre",
      "rêpondre",
      "répondr"
    ],
    "tip": "Accento acuto iniziale e termina in -re: répondre!"
  },
  "s-habiller": {
    "facile": [
      "se vestire",
      "s'habillare",
      "habilloni"
    ],
    "moyen": [
      "se habiller",
      "s'abiller",
      "s'habiler"
    ],
    "difficile": [
      "s'habillèr",
      "s'hâbiller",
      "s'habilliér"
    ],
    "tip": "Davanti alla h muta si elide in s'habiller, con doppia ll!"
  },
  "se-brosser-les-dents": {
    "facile": [
      "se lavare i denti",
      "se brossare",
      "denti bross"
    ],
    "moyen": [
      "se broser les dents",
      "se brosser les dans",
      "se brosser le dents"
    ],
    "difficile": [
      "se brosser les dent",
      "se brossér les dents",
      "se brossèr les dents"
    ],
    "tip": "Brosser ha la doppia ss, e dents finisce con la s del plurale!"
  },
  "se-reveiller": {
    "facile": [
      "svegliarsi",
      "se reveillare",
      "se reveilloni"
    ],
    "moyen": [
      "se reveiller",
      "se reveiler",
      "se reveillez"
    ],
    "difficile": [
      "se rèveiller",
      "se rêveiller",
      "se réveillér"
    ],
    "tip": "Ha l'accento acuto: ré-veiller, con doppia ll!"
  },
  "se-coucher": {
    "facile": [
      "dormire",
      "se couchare",
      "se couchoni"
    ],
    "moyen": [
      "se cousher",
      "se cussher",
      "se couché"
    ],
    "difficile": [
      "se coûcher",
      "se couchèr",
      "se couchér"
    ],
    "tip": "Ha ou e ch: se coucher!"
  },
  "se-laver-les-mains": {
    "facile": [
      "lavare mani",
      "se lavare le mani",
      "manine belle"
    ],
    "moyen": [
      "se laver le mains",
      "se laver les main",
      "se laver les meins"
    ],
    "difficile": [
      "se lavèr les mains",
      "se lavér les mains",
      "se lâver les mains"
    ],
    "tip": "Mains ha -ains con la s del plurale!"
  },
  "se-doucher": {
    "facile": [
      "farsi la doccia",
      "se douchare",
      "docciona"
    ],
    "moyen": [
      "se dousher",
      "se doushez",
      "se douché"
    ],
    "difficile": [
      "se doûcher",
      "se douchèr",
      "se douchér"
    ],
    "tip": "Ha ou e ch: se doucher!"
  },
  "se-coiffer": {
    "facile": [
      "pettinarsi",
      "se coiffare",
      "capelloni"
    ],
    "moyen": [
      "se coifer",
      "se couaffer",
      "se coiffé"
    ],
    "difficile": [
      "se coiffèr",
      "se coîffer",
      "se coiffér"
    ],
    "tip": "Ha oi (suono ua) e doppia ff: se coiffer!"
  },
  "se-lever": {
    "facile": [
      "alzarsi",
      "se levare",
      "se levoni"
    ],
    "moyen": [
      "se levé",
      "se laiver",
      "se levez"
    ],
    "difficile": [
      "se lévèr",
      "se lèver",
      "se lévé"
    ],
    "tip": "All'infinito non ha accento: se lever!"
  },
  "manger": {
    "facile": [
      "mangiare",
      "mangiucciare",
      "pappa"
    ],
    "moyen": [
      "manjer",
      "mangé",
      "mangez"
    ],
    "difficile": [
      "mànger",
      "mânger",
      "mangèr"
    ],
    "tip": "Si scrive con g e finisce in -er: manger!"
  },
  "boire": {
    "facile": [
      "bevere",
      "boirare",
      "bere"
    ],
    "moyen": [
      "boure",
      "boir",
      "boirr"
    ],
    "difficile": [
      "boîre",
      "boïre",
      "boirë"
    ],
    "tip": "Verbo irregolare del terzo gruppo: boire!"
  },
  "dormir": {
    "facile": [
      "dormiglione",
      "dormicchiere",
      "nanna"
    ],
    "moyen": [
      "dormire",
      "dormyr",
      "dormy"
    ],
    "difficile": [
      "dôrmir",
      "dormîr",
      "dormí"
    ],
    "tip": "Finisce in -ir (secondo/terzo gruppo): dormir!"
  },
  "marcher": {
    "facile": [
      "camminare",
      "passettini",
      "marchiare"
    ],
    "moyen": [
      "marssher",
      "marché",
      "marchez"
    ],
    "difficile": [
      "mârcher",
      "marchèr",
      "marchér"
    ],
    "tip": "Si scrive con ch e desinenza in -er: marcher!"
  },
  "faire": {
    "facile": [
      "facere",
      "faretto",
      "fare"
    ],
    "moyen": [
      "fayre",
      "fere",
      "feire"
    ],
    "difficile": [
      "faîre",
      "fayr",
      "fâire"
    ],
    "tip": "Si scrive con ai: faire!"
  },
  "aller": {
    "facile": [
      "andare",
      "partire",
      "allare"
    ],
    "moyen": [
      "aler",
      "allé",
      "allez"
    ],
    "difficile": [
      "allèr",
      "âller",
      "allié"
    ],
    "tip": "Doppia ll e termina in -er: aller!"
  },
  "etre": {
    "facile": [
      "essere",
      "essenza",
      "etro"
    ],
    "moyen": [
      "etre",
      "estre",
      "eytre"
    ],
    "difficile": [
      "étre",
      "ètre",
      "ëtre"
    ],
    "tip": "Ha il cappellino magico (^) sulla prima e: être!"
  },
  "avoir": {
    "facile": [
      "avere",
      "avetta",
      "possessione"
    ],
    "moyen": [
      "avouar",
      "avware",
      "avoyr"
    ],
    "difficile": [
      "avoîr",
      "avòir",
      "avóir"
    ],
    "tip": "Si scrive con oi: avoir!"
  },
  "prendre-son-petit-dejeuner": {
    "facile": [
      "colazione super",
      "mangiare latte",
      "caffellatte"
    ],
    "moyen": [
      "prendre son petit dejeuner",
      "prendre son peti dejeuner",
      "prendre son petit dejeuné"
    ],
    "difficile": [
      "prendre son petit déjeunér",
      "prendre son petit dèjeuner",
      "prendre son petit dëjeuner"
    ],
    "tip": "Déjeuner ha l'accento acuto: dé-jeuner!"
  }
};
