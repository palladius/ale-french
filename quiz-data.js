/**
 * Ale French - Quiz Distractors and Tips
 * Calibrato per Alessandro e Sebastiano
 * Trappole fonetiche, falsi amici e inversione di genere (un/une) sistematica
 */
const QUIZ_DISTRACTORS = {
  "une-bibliotheque": {
    "facile": [
      "una biblioteca",
      "une bibliotaca",
      "une bibliocasa"
    ],
    "moyen": [
      "un bibliothèque",
      "une bibliotek",
      "une bibliotec"
    ],
    "difficile": [
      "un bibliothèque",
      "une bibliothéque",
      "une bibliotheque"
    ],
    "tip": "È femminile (UNE bibliothèque), finisce con -thèque (con h e qu), e l'accento è grave sulla prima è!"
  },
  "une-fenetre": {
    "facile": [
      "una finestra",
      "une fanatra",
      "une fenosole"
    ],
    "moyen": [
      "un fenêtre",
      "une fenetre",
      "une fenaistre"
    ],
    "difficile": [
      "un fenêtre",
      "une fenétre",
      "une fénêtre"
    ],
    "tip": "È femminile (UNE fenêtre) e ha il cappellino magico (^) sulla prima e che ricorda la S di fineStra!"
  },
  "une-regle": {
    "facile": [
      "una riga",
      "une ragla",
      "une roglia"
    ],
    "moyen": [
      "un règle",
      "une regle",
      "une reigle"
    ],
    "difficile": [
      "un règle",
      "une régle",
      "une rêgle"
    ],
    "tip": "È femminile (UNE règle), l'accento è grave (è) e non acuto!"
  },
  "un-hopital": {
    "facile": [
      "un ospedale",
      "un opitello",
      "un ospedalino"
    ],
    "moyen": [
      "une hôpital",
      "un opital",
      "un hospital"
    ],
    "difficile": [
      "une hôpital",
      "un hopital",
      "un hòpital"
    ],
    "tip": "È maschile (UN hôpital), ha la H muta e il cappellino magico (^) sulla O!"
  },
  "l-eau": {
    "facile": [
      "l'acqua",
      "l'eula",
      "le bau"
    ],
    "moyen": [
      "le eau",
      "la eau",
      "l'o"
    ],
    "difficile": [
      "le eau",
      "la eau",
      "l'eaux"
    ],
    "tip": "Vuole l'apostrofo obbligatorio (l'eau) e si scrive -eau (suona O)!"
  },
  "des-ciseaux": {
    "facile": [
      "le forbici",
      "des cisotti",
      "des cesoni"
    ],
    "moyen": [
      "les ciseaux",
      "des cisaux",
      "des cizeaux"
    ],
    "difficile": [
      "le ciseaux",
      "des cisots",
      "des ciseauxs"
    ],
    "tip": "Si usa al plurale (des ciseaux), inizia con c, ha la s dolce e finisce con -eaux!"
  },
  "un-ordinateur": {
    "facile": [
      "un computer",
      "un computero",
      "un ordinatore"
    ],
    "moyen": [
      "une ordinateur",
      "un ordinateure",
      "un ordonateur"
    ],
    "difficile": [
      "une ordinateur",
      "un ordinatèur",
      "un ordinatêur"
    ],
    "tip": "È maschile (UN ordinateur) e finisce con -eur senza la e finale!"
  },
  "un-tableau": {
    "facile": [
      "una lavagna",
      "un tavolau",
      "un tabli"
    ],
    "moyen": [
      "une tableau",
      "un tableu",
      "un tablo"
    ],
    "difficile": [
      "une tableau",
      "un tablô",
      "un tabliau"
    ],
    "tip": "In francese la lavagna è maschile: UN tableau, con il trittico -eau!"
  },
  "une-table": {
    "facile": [
      "un tavolo",
      "une tabla",
      "une tobola"
    ],
    "moyen": [
      "un table",
      "une tabble",
      "une tauble"
    ],
    "difficile": [
      "un table",
      "une tâble",
      "une tablee"
    ],
    "tip": "Attenzione al genere! In francese il tavolo è femminile: UNE table!"
  },
  "une-chaise": {
    "facile": [
      "una sedia",
      "une scieda",
      "une chasa"
    ],
    "moyen": [
      "un chaise",
      "une cheise",
      "une chaize"
    ],
    "difficile": [
      "un chaise",
      "une chaîse",
      "une cheze"
    ],
    "tip": "È femminile (UNE chaise), si scrive con ai (suono e) e una sola s dolce!"
  },
  "une-armoire": {
    "facile": [
      "un armadio",
      "une armoira",
      "une armadure"
    ],
    "moyen": [
      "un armoire",
      "une armoir",
      "une harmoire"
    ],
    "difficile": [
      "un armoire",
      "une armoîre",
      "une armoïre"
    ],
    "tip": "Trappola classica! In francese l'armadio è femminile: UNE armoire, con la e finale!"
  },
  "une-poubelle": {
    "facile": [
      "un cestino",
      "une pubella",
      "une poubello"
    ],
    "moyen": [
      "un poubelle",
      "une poubele",
      "une pubelle"
    ],
    "difficile": [
      "un poubelle",
      "une poubêlle",
      "une poubèlle"
    ],
    "tip": "È femminile (UNE poubelle), con ou (suono u) e doppia ll!"
  },
  "une-porte": {
    "facile": [
      "una porta",
      "une portazza",
      "une parta"
    ],
    "moyen": [
      "un porte",
      "une port",
      "une pourte"
    ],
    "difficile": [
      "un porte",
      "une pôrte",
      "une portte"
    ],
    "tip": "È femminile (UNE porte) e vuole la e muta finale!"
  },
  "un-cartable": {
    "facile": [
      "uno zaino",
      "un cartabello",
      "un cartobolo"
    ],
    "moyen": [
      "une cartable",
      "un quartable",
      "un cartab"
    ],
    "difficile": [
      "une cartable",
      "un cartâble",
      "un cartabele"
    ],
    "tip": "In francese la cartella/zaino è maschile: UN cartable (con la c, non la q)!"
  },
  "une-trousse": {
    "facile": [
      "un astuccio",
      "une trossa",
      "une trussone"
    ],
    "moyen": [
      "un trousse",
      "une trouse",
      "une trusse"
    ],
    "difficile": [
      "un trousse",
      "une troûsse",
      "une trouss"
    ],
    "tip": "In francese l'astuccio è femminile: UNE trousse, con ou e doppia ss!"
  },
  "un-crayon": {
    "facile": [
      "una matita",
      "un crayone",
      "un crayonzo"
    ],
    "moyen": [
      "une crayon",
      "un craion",
      "un creyon"
    ],
    "difficile": [
      "une crayon",
      "un crayòn",
      "un crâyon"
    ],
    "tip": "La matita è maschile in francese: UN crayon, e si scrive con la y!"
  },
  "un-stylo": {
    "facile": [
      "una penna",
      "un stila",
      "un stylone"
    ],
    "moyen": [
      "une stylo",
      "un stilo",
      "un stylot"
    ],
    "difficile": [
      "une stylo",
      "un stylô",
      "un stylò"
    ],
    "tip": "La penna è maschile in francese: UN stylo, e si scrive con la y!"
  },
  "une-colle": {
    "facile": [
      "una colla",
      "une colli",
      "une colletta"
    ],
    "moyen": [
      "un colle",
      "une cole",
      "une caulle"
    ],
    "difficile": [
      "un colle",
      "une côlle",
      "une colla"
    ],
    "tip": "È femminile (UNE colle), con doppia ll ed e muta finale!"
  },
  "une-gomme": {
    "facile": [
      "una gomma",
      "une gommata",
      "une gommolina"
    ],
    "moyen": [
      "un gomme",
      "une gome",
      "une gaume"
    ],
    "difficile": [
      "un gomme",
      "une gômme",
      "une gomm"
    ],
    "tip": "È femminile (UNE gomme), con doppia mm ed e muta finale!"
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
