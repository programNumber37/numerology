// ============================================
// EUROPE GEOGRAPHIC & NUMEROLOGICAL DATABASE
// ============================================
// This file is modular. You can add new countries and cities here over time.
// - For countries: The 'name' property must match standard English names (e.g. "Croatia")
//   so that the TopoJSON data can match and draw its borders automatically.
// - For cities: You only need to provide the 'lat' and 'lon' coordinates, 
//   and the engine will automatically project them correctly onto the map.

const EUROPE_DATA = {
    countries: {
        FR: {
            name: "France",
            type: "Country",
            capital: "Paris",
            number: 7,
            vibration: "Mystic & Analytical Knowledge",
            landmarks: ["Eiffel Tower", "Mont Saint-Michel", "Louvre", "Chartres Cathedral"],
            description: "France has long been associated with the 7 vibration—the seeker of truth, philosophy, and sacred geometry. Its ancient ley lines connect sacred sites like Chartres Cathedral and Mont Saint-Michel to northern European grid points.",
            energySummary: "Rooted in analytical intellect, artistic alchemy, and deep esoteric traditions."
        },
        DE: {
            name: "Germany",
            type: "Country",
            capital: "Berlin",
            number: 4,
            vibration: "Structure & Foundation",
            landmarks: ["Brandenburg Gate", "Black Forest", "Neuschwanstein", "Cologne Cathedral"],
            description: "Germany resonates with the number 4—representing order, precision, structure, and foundational engineering. It forms a crucial anchor point in Europe's geographic and energetic grid.",
            energySummary: "Embodying discipline, craftsmanship, architectural mastery, and systemic thought."
        },
        IT: {
            name: "Italy",
            type: "Country",
            capital: "Rome",
            number: 3,
            vibration: "Creative Expression & History",
            landmarks: ["Colosseum", "Vatican City", "Venice Canals", "Mount Vesuvius"],
            description: "Italy radiates the vibrant 3 energy—expressive, artistic, passionate, and historically influential. From Rome's ancient heart to Venice's waterways, it acts as a cultural resonance chamber.",
            energySummary: "Flowing with artistic brilliance, theatrical storytelling, and ancient Roman imperium."
        },
        ES: {
            name: "Spain",
            type: "Country",
            capital: "Madrid",
            number: 5,
            vibration: "Freedom & Exploration",
            landmarks: ["Sagrada Família", "Alhambra", "Camino de Santiago", "Prado Museum"],
            description: "Spain carries the dynamic number 5 vibration of movement, exploration, passion, and transformation. The ancient pilgrimage path of Camino de Santiago follows starry telluric currents across northern Spain.",
            energySummary: "A conduit of movement, spirited adventure, Moorish-Gothic synthesis, and pilgrims' journeys."
        },
        GB: {
            name: "United Kingdom",
            type: "Country",
            capital: "London",
            number: 11,
            vibration: "Master Intuition & Illumination",
            landmarks: ["Stonehenge", "Glastonbury Tor", "Big Ben", "Edinburgh Castle"],
            description: "The British Isles host famous ley line intersections, notably the St. Michael Line passing through Glastonbury Tor and Avebury. The UK holds a Master 11 vibration of spiritual guardianship and historical leadership.",
            energySummary: "Intermingled with megalithic stone circles, royal heritage, and ancient Druidic mysteries."
        },
        PT: {
            name: "Portugal",
            type: "Country",
            capital: "Lisbon",
            number: 9,
            vibration: "Wisdom & Universal Completion",
            landmarks: ["Tower of Belém", "Sintra National Palace", "Douro Valley"],
            description: "Portugal, sitting on the western edge of continental Europe facing the vast Atlantic ocean, reflects the 9 vibration—completion, maritime horizon exploration, and oceanic wisdom.",
            energySummary: "Sintra's mist-shrouded palaces and Lisbon's seven hills capture profound mystical enchantment."
        },
        NL: {
            name: "Netherlands",
            type: "Country",
            capital: "Amsterdam",
            number: 8,
            vibration: "Balance & Flowing Commerce",
            landmarks: ["Canals of Amsterdam", "Kinderdijk Windmills", "Keukenhof"],
            description: "Mastering water and trade, the Netherlands vibrates to 8—the number of manifestation, balance between land and sea, and pioneering social innovation.",
            energySummary: "Harmonizing water management, open trade corridors, and golden age painting."
        },
        BE: {
            name: "Belgium",
            type: "Country",
            capital: "Brussels",
            number: 2,
            vibration: "Harmony & Diplomacy",
            landmarks: ["Grand Place", "Atomium", "Brugge Canals"],
            description: "Belgium sits at the crossroads of Western Europe as a mediator and diplomatic heart, embodying the cooperative and diplomatic number 2 vibration.",
            energySummary: "A peaceful intersection linking Germanic and Romance European heritage."
        },
        CH: {
            name: "Switzerland",
            type: "Country",
            capital: "Bern",
            number: 6,
            vibration: "Stability, Harmony & Sanctuary",
            landmarks: ["Matterhorn", "Lake Geneva", "Chillon Castle"],
            description: "Encircled by the soaring Alps, Switzerland represents the 6 vibration—sanctuary, neutrality, protection, and refined craftsmanship.",
            energySummary: "High-altitude alpine clarity, crystalline mountain reservoirs, and steadfast peace."
        },
        AT: {
            name: "Austria",
            type: "Country",
            capital: "Vienna",
            number: 6,
            vibration: "Symphonic Harmony & Elegance",
            landmarks: ["Schönbrunn Palace", "St. Stephen's Cathedral", "Tyrol Alps"],
            description: "Austria's musical heritage and imperial architecture reflect harmonious mathematical proportions, radiating elegance and classical resonance.",
            energySummary: "Home to Mozart and Beethoven's symphonies, classical architecture, and Danube currents."
        },
        PL: {
            name: "Poland",
            type: "Country",
            capital: "Warsaw",
            number: 1,
            vibration: "Resilience & New Beginnings",
            landmarks: ["Wawel Royal Castle", "Main Square Kraków", "Białowieża Forest"],
            description: "Poland carries the pioneer 1 vibration of strength, rebirth, and independent spirit through centuries of historical transformations.",
            energySummary: "Enduring fortitude, rich folklore, and vibrant rebirth along the Vistula river."
        },
        SE: {
            name: "Sweden",
            type: "Country",
            capital: "Stockholm",
            number: 9,
            vibration: "Humanitarian Innovation",
            landmarks: ["Stockholm Archipelago", "Gamla Stan", "Icehotel Jukkasjärvi"],
            description: "Sweden's vast forests and archipelago embody the serene, forward-looking 9 vibration, focused on balance with nature and progressive innovation.",
            energySummary: "Nordic serenity, aurora borealis reflections, and harmonious living."
        },
        NO: {
            name: "Norway",
            type: "Country",
            capital: "Oslo",
            number: 7,
            vibration: "Elemental Wilderness & Solitude",
            landmarks: ["Geirangerfjord", "Lofoten Islands", "Nidaros Cathedral"],
            description: "Carved by ancient glaciers and dramatic fjords, Norway carries the 7 energy of deep solitude, elemental majesty, and Viking sea legend.",
            energySummary: "Glacial fjords, midnight sun wisdom, and majestic Nordic landscapes."
        },
        IE: {
            name: "Ireland",
            type: "Country",
            capital: "Dublin",
            number: 3,
            vibration: "Celtic Magic & Storytelling",
            landmarks: ["Newgrange Megalith", "Cliffs of Moher", "Giant's Causeway", "Rock of Cashel"],
            description: "Ireland's ancient Newgrange passage tomb aligns precisely with the winter solstice sunrise. The emerald isle pulses with 3 energy—bards, folklore, and Celtic sacred geometry.",
            energySummary: "Saturated with ancient mist, solstitial stone temples, and bardic traditions."
        },
        GR: {
            name: "Greece",
            type: "Country",
            capital: "Athens",
            number: 22,
            vibration: "Master Architect of Philosophy",
            landmarks: ["Parthenon", "Oracle of Delphi", "Santorini Caldera", "Meteor Monasteries"],
            description: "As the birthplace of Western logic, geometry, and philosophy, Greece holds the Master Architect 22 vibration. Sites like Delphi were revered as the navel of the earth (Omphalos).",
            energySummary: "Classical temples, Pythagorean numerology roots, and Aegean sunlight."
        },
        CZ: {
            name: "Czechia",
            type: "Country",
            capital: "Prague",
            number: 11,
            vibration: "Alchemical Gateway",
            landmarks: ["Charles Bridge", "Prague Castle", "Astronomical Clock"],
            description: "Prague has been famed as the alchemy capital of medieval Europe under Emperor Rudolf II. It carries an intuitive 11 Master vibration.",
            energySummary: "Bohemian alchemical towers, esoteric court mysteries, and Gothic spires."
        },
        HU: {
            name: "Hungary",
            type: "Country",
            capital: "Budapest",
            number: 5,
            vibration: "Thermal Energy & Flow",
            landmarks: ["Hungarian Parliament", "Buda Castle", "Thermal Baths"],
            description: "Budapest rests upon rich thermal mineral springs fed by deep subterranean Earth currents, reflecting the dynamic 5 vibration of vitality.",
            energySummary: "Danube river split, healing thermal springs, and majestic architecture."
        },
        DK: {
            name: "Denmark",
            type: "Country",
            capital: "Copenhagen",
            number: 6,
            vibration: "Warmth & Design Balance",
            landmarks: ["Nyhavn", "Tivoli Gardens", "Little Mermaid"],
            description: "Denmark embodies cozy harmony and design precision, reflecting 6 vibration living through architectural balance.",
            energySummary: "Scandinavian design purity, coastal islands, and welcoming warmth."
        },
        AL: {
            name: "Albania",
            type: "Country",
            capital: "Tirana",
            number: 9,
            vibration: "Ancient Illyrian Mystery",
            landmarks: ["Rozafa Castle", "Butrint", "Albanian Alps"],
            description: "Albania holds ancient Illyrian secrets and untamed mountainous energy, reflecting the 9 vibration of enduring wisdom and completion.",
            energySummary: "Untamed nature, ancient castles, and Mediterranean resilience."
        },
        AD: {
            name: "Andorra",
            type: "Country",
            capital: "Andorra la Vella",
            number: 8,
            vibration: "High Altitude Sanctuary",
            landmarks: ["Casa de la Vall", "Madriu-Perafita-Claror", "Pyrenees"],
            description: "Nestled high in the Pyrenees, Andorra resonates with the 8 vibration of material independence, balance, and sheltered sanctuary between great powers.",
            energySummary: "Mountain fortresses, deep valleys, and self-reliant endurance."
        },
        BY: {
            name: "Belarus",
            type: "Country",
            capital: "Minsk",
            number: 4,
            vibration: "Enduring Foundations",
            landmarks: ["Mir Castle", "Brest Fortress", "Belovezhskaya Pushcha"],
            description: "Rooted in deep ancient forests and marshlands, Belarus holds the 4 energy of deep structure, history, and natural foundational preservation.",
            energySummary: "Primeval forests, monumental architecture, and stoic history."
        },
        BA: {
            name: "Bosnia and Herz.",
            type: "Country",
            capital: "Sarajevo",
            number: 11,
            vibration: "Crossroads of Civilizations",
            landmarks: ["Stari Most", "Baščaršija", "Kravice Waterfalls"],
            description: "Bosnia and Herzegovina acts as a Master 11 bridge between East and West, carrying intuitive energy forged through historic convergence.",
            energySummary: "Bridging cultures, Ottoman-Austro-Hungarian synthesis, and mystical mountains."
        },
        BG: {
            name: "Bulgaria",
            type: "Country",
            capital: "Sofia",
            number: 7,
            vibration: "Thracian Mysticism",
            landmarks: ["Rila Monastery", "Alexander Nevsky Cathedral", "Balkan Mountains"],
            description: "Sitting atop ancient Thracian tombs and mineral springs, Bulgaria carries the 7 energy of deep esoteric wisdom and mystical natural forces.",
            energySummary: "Rose valleys, ancient orthodox chants, and buried gold."
        },
        HR: {
            name: "Croatia",
            type: "Country",
            capital: "Zagreb",
            number: 3,
            vibration: "Adriatic Expression",
            landmarks: ["Dubrovnik City Walls", "Plitvice Lakes", "Diocletian's Palace"],
            description: "With its stunning coastline and islands, Croatia vibrates with 3 energy—expressive, vibrant, and steeped in Venetian and Roman history.",
            energySummary: "Sapphire waters, cascading lakes, and walled coastal citadels."
        },
        CY: {
            name: "Cyprus",
            type: "Country",
            capital: "Nicosia",
            number: 6,
            vibration: "Aphrodite's Embrace",
            landmarks: ["Petra tou Romiou", "Kourion", "Troodos Mountains"],
            description: "Legendary birthplace of Aphrodite, Cyprus radiates the 6 vibration of beauty, love, harmony, and Mediterranean crossroads.",
            energySummary: "Sun-drenched ruins, mythological shores, and enduring love."
        },
        EE: {
            name: "Estonia",
            type: "Country",
            capital: "Tallinn",
            number: 5,
            vibration: "Digital & Natural Flow",
            landmarks: ["Tallinn Old Town", "Lahemaa National Park", "Toompea Castle"],
            description: "Estonia balances ancient pagan forest traditions with cutting-edge digital society, capturing the transformative and progressive 5 vibration.",
            energySummary: "Medieval spires, vast bogs, and forward-thinking innovation."
        },
        FI: {
            name: "Finland",
            type: "Country",
            capital: "Helsinki",
            number: 7,
            vibration: "Silence & Inner Seeking",
            landmarks: ["Suomenlinna", "Lapland", "Helsinki Cathedral"],
            description: "The land of a thousand lakes and endless forests, Finland embodies the introspective 7 vibration of silence, nature, and profound inner knowledge.",
            energySummary: "Arctic auroras, deep lakes, and tranquil sisu (inner strength)."
        },
        IS: {
            name: "Iceland",
            type: "Country",
            capital: "Reykjavik",
            number: 1,
            vibration: "Elemental Creation",
            landmarks: ["Blue Lagoon", "Gullfoss", "Vatnajökull"],
            description: "Forged by fire and ice, Iceland is a young, dynamic landmass carrying the 1 energy of raw pioneer spirit, creation, and volcanic power.",
            energySummary: "Geothermal force, glacial stillness, and unbridled elemental birth."
        },
        XK: {
            name: "Kosovo",
            type: "Country",
            capital: "Pristina",
            number: 5,
            vibration: "Dynamic Transition",
            landmarks: ["Gračanica Monastery", "Rugova Canyon", "Prizren Fortress"],
            description: "A land in transition with a young, vibrant population, Kosovo vibrates to the dynamic 5—representing movement, change, and energetic potential.",
            energySummary: "Cultural crossroads, rugged canyons, and youthful momentum."
        },
        LV: {
            name: "Latvia",
            type: "Country",
            capital: "Riga",
            number: 2,
            vibration: "Baltic Harmony",
            landmarks: ["Riga Old Town", "Gauja National Park", "Rundāle Palace"],
            description: "Latvia's rich traditions of choir singing and deep connection to nature resonate with the harmonious and cooperative 2 vibration.",
            energySummary: "Art Nouveau elegance, amber coasts, and folk song festivals."
        },
        LI: {
            name: "Liechtenstein",
            type: "Country",
            capital: "Vaduz",
            number: 8,
            vibration: "Alpine Abundance",
            landmarks: ["Vaduz Castle", "Gutenberg Castle", "Rhine River"],
            description: "Tucked between Switzerland and Austria, Liechtenstein reflects the 8 vibration of concentrated wealth, banking, and structural manifestation.",
            energySummary: "Quiet prosperity, alpine slopes, and princely heritage."
        },
        LT: {
            name: "Lithuania",
            type: "Country",
            capital: "Vilnius",
            number: 9,
            vibration: "Pagan Roots & Completion",
            landmarks: ["Hill of Crosses", "Trakai Island Castle", "Curonian Spit"],
            description: "As the last European country to adopt Christianity, Lithuania holds deep ancestral pagan roots and the 9 vibration of historical completion.",
            energySummary: "Mystical hills, amber forests, and spiritual endurance."
        },
        LU: {
            name: "Luxembourg",
            type: "Country",
            capital: "Luxembourg City",
            number: 22,
            vibration: "Master Builder of Unity",
            landmarks: ["Vianden Castle", "Bock Casemates", "Mullerthal"],
            description: "A founding member of the EU and a fortress city, Luxembourg holds the Master 22 vibration, anchoring diplomatic architecture and grand vision.",
            energySummary: "Deep river gorges, fortified walls, and European integration."
        },
        MT: {
            name: "Malta",
            type: "Country",
            capital: "Valletta",
            number: 3,
            vibration: "Megalithic Expression",
            landmarks: ["Ħaġar Qim", "St. John's Co-Cathedral", "Mdina"],
            description: "Home to some of the oldest freestanding structures on Earth, Malta vibrates with 3 energy—vibrant, historic, and energetically expressive.",
            energySummary: "Sun-baked limestone, knights' legacy, and prehistoric temples."
        },
        MD: {
            name: "Moldova",
            type: "Country",
            capital: "Chișinău",
            number: 6,
            vibration: "Harvest & Hearth",
            landmarks: ["Cricova Winery", "Orheiul Vechi", "Capriana Monastery"],
            description: "Rich in fertile soil and vast underground wine cellars, Moldova embodies the nurturing 6 vibration of family, harvest, and traditional hospitality.",
            energySummary: "Rolling vineyards, ancient monasteries, and earthy warmth."
        },
        MC: {
            name: "Monaco",
            type: "Country",
            capital: "Monaco",
            number: 8,
            vibration: "Glamour & Manifestation",
            landmarks: ["Monte Carlo Casino", "Prince's Palace", "Oceanographic Museum"],
            description: "Perched on the French Riviera, Monaco is the ultimate expression of the 8 vibration—power, luxury, material success, and focused manifestation.",
            energySummary: "Mediterranean wealth, grand prix circuits, and royal exclusivity."
        },
        ME: {
            name: "Montenegro",
            type: "Country",
            capital: "Podgorica",
            number: 7,
            vibration: "Black Mountain Mysticism",
            landmarks: ["Kotor Bay", "Durmitor National Park", "Ostrog Monastery"],
            description: "Where rugged mountains drop into the sea, Montenegro holds a 7 energy of fierce independence, dramatic isolation, and spiritual retreat.",
            energySummary: "Dramatic fjords, orthodox hermitages, and untamed peaks."
        },
        MK: {
            name: "Macedonia",
            type: "Country",
            capital: "Skopje",
            number: 4,
            vibration: "Balkan Foundation",
            landmarks: ["Lake Ohrid", "Matka Canyon", "Stone Bridge"],
            description: "At the heart of the Balkans, North Macedonia represents the 4 vibration, acting as a structural, historical crossroads with deep roots.",
            energySummary: "Ancient lakes, Byzantine frescoes, and layered antiquity."
        },
        RO: {
            name: "Romania",
            type: "Country",
            capital: "Bucharest",
            number: 9,
            vibration: "Carpathian Magic",
            landmarks: ["Bran Castle", "Palace of the Parliament", "Transfăgărășan"],
            description: "Romania, with its dense Transylvanian forests and Carpathian peaks, pulses with the 9 energy of deep folklore, completion, and spiritual mysticism.",
            energySummary: "Gothic legends, vast wilderness, and Latin heritage in the East."
        },
        RU: {
            name: "Russia",
            type: "Country",
            capital: "Moscow",
            number: 8,
            vibration: "Vast Power & Endurance",
            landmarks: ["Red Square", "Hermitage Museum", "Lake Baikal"],
            description: "Spanning multiple time zones, the European part of Russia grounds immense 8 energy—a massive force of history, endurance, and material scale.",
            energySummary: "Orthodox domes, imperial grandeur, and boundless winters."
        },
        SM: {
            name: "San Marino",
            type: "Country",
            capital: "San Marino",
            number: 1,
            vibration: "Independent Pioneer",
            landmarks: ["Guaita Tower", "Mount Titano", "Palazzo Pubblico"],
            description: "The world's oldest surviving sovereign state, San Marino fiercely holds the 1 vibration of absolute independence, pioneer spirit, and self-rule.",
            energySummary: "Mountaintop fortresses, unyielding freedom, and ancient republic."
        },
        RS: {
            name: "Serbia",
            type: "Country",
            capital: "Belgrade",
            number: 5,
            vibration: "Dynamic Crossroads",
            landmarks: ["Kalemegdan Fortress", "Church of Saint Sava", "Đerdap National Park"],
            description: "Belgrade, sitting at the confluence of the Sava and Danube rivers, channels the dynamic, constantly shifting 5 energy of resilience and change.",
            energySummary: "River confluences, vibrant spirit, and turbulent, enduring history."
        },
        SK: {
            name: "Slovakia",
            type: "Country",
            capital: "Bratislava",
            number: 2,
            vibration: "Heart of Europe Harmony",
            landmarks: ["Bratislava Castle", "High Tatras", "Spiš Castle"],
            description: "Nestled in the geographical center of Europe, Slovakia carries the 2 vibration of quiet cooperation, natural harmony, and subtle beauty.",
            energySummary: "Alpine peaks, medieval ruins, and tranquil forests."
        },
        SI: {
            name: "Slovenia",
            type: "Country",
            capital: "Ljubljana",
            number: 6,
            vibration: "Green Harmony",
            landmarks: ["Lake Bled", "Postojna Cave", "Triglav National Park"],
            description: "Slovenia represents the perfect 6 balance between alpine mountains, the Mediterranean, and lush green forests—a true natural sanctuary.",
            energySummary: "Emerald rivers, dragon bridges, and pristine ecology."
        },
        UA: {
            name: "Ukraine",
            type: "Country",
            capital: "Kyiv",
            number: 4,
            vibration: "Agricultural Foundation & Resilience",
            landmarks: ["Kyiv Pechersk Lavra", "Carpathian Mountains", "Saint Sophia Cathedral"],
            description: "The breadbasket of Europe, Ukraine resonates with the 4 vibration of foundational earth energy, agricultural wealth, and unbreakable resilience.",
            energySummary: "Golden wheat fields, deep roots, and indomitable spirit."
        },
        VA: {
            name: "Vatican",
            type: "Country",
            capital: "Vatican City",
            number: 11,
            vibration: "Master Spiritual Guardian",
            landmarks: ["St. Peter's Basilica", "Sistine Chapel", "Vatican Museums"],
            description: "The spiritual center of the Catholic world, the Vatican operates on the Master 11 vibration—channeling illumination, faith, and divine inspiration.",
            energySummary: "Sacred geometry, Renaissance masterpieces, and absolute faith."
        }
    },
    cities: {
        london: {
            name: "London",
            country: "United Kingdom",
            type: "Major City",
            lat: 51.5,
            lon: -0.12,
            number: 8,
            vibration: "Global Apex & Power Center",
            description: "London sits along key meridians. The Greenwich Meridian (0° Longitude) defines global time standardization.",
            landmarks: ["Big Ben", "Tower of London", "Westminster Abbey"]
        },
        paris: {
            name: "Paris",
            country: "France",
            type: "Major City",
            lat: 48.85,
            lon: 2.35,
            number: 3,
            vibration: "City of Light & Romance",
            description: "Built along the Seine river, Paris aligned its grand axis (Historical Axis) from the Louvre through the Arc de Triomphe with solar alignments.",
            landmarks: ["Eiffel Tower", "Notre-Dame Cathedral", "Sacré-Cœur"]
        },
        berlin: {
            name: "Berlin",
            country: "Germany",
            type: "Major City",
            lat: 52.52,
            lon: 13.4,
            number: 1,
            vibration: "Transformation & Rebirth",
            description: "Berlin stands as a beacon of unification and modern cultural rebirth, holding the number 1 pioneer energy.",
            landmarks: ["Brandenburg Gate", "Museum Island", "Reichstag"]
        },
        rome: {
            name: "Rome",
            country: "Italy",
            type: "Major City",
            lat: 41.9,
            lon: 12.5,
            number: 9,
            vibration: "Eternal City of Empire",
            description: "Founded upon seven sacred hills, Rome is called the Eternal City. It carries centuries of imperial and spiritual history.",
            landmarks: ["Colosseum", "Pantheon", "St. Peter's Basilica"]
        },
        madrid: {
            name: "Madrid",
            country: "Spain",
            type: "Major City",
            lat: 40.41,
            lon: -3.7,
            number: 5,
            vibration: "High Plateau Energy Center",
            description: "Located on the high central Iberian plateau, Madrid serves as Spain's vibrant political and cultural nexus.",
            landmarks: ["Royal Palace", "Plaza Mayor", "Retiro Park"]
        },
        lisbon: {
            name: "Lisbon",
            country: "Portugal",
            type: "Major City",
            lat: 38.72,
            lon: -9.13,
            number: 7,
            vibration: "Oceanic Gateway & Mysticism",
            description: "Built across seven coastal hills facing the Tagus estuary, Lisbon is a sun-drenched city of mariners and fado music.",
            landmarks: ["Belém Tower", "Jerónimos Monastery", "St. George Castle"]
        },
        amsterdam: {
            name: "Amsterdam",
            country: "Netherlands",
            type: "Major City",
            lat: 52.37,
            lon: 4.89,
            number: 4,
            vibration: "Concentric Canal Geometry",
            description: "Famed for its 17th-century concentric semicircular canal belt, Amsterdam is a masterpiece of urban geometry.",
            landmarks: ["Rijksmuseum", "Anne Frank House", "Prinsengracht"]
        },
        vienna: {
            name: "Vienna",
            country: "Austria",
            type: "Major City",
            lat: 48.2,
            lon: 16.37,
            number: 6,
            vibration: "Imperial Music & Architecture",
            description: "Vienna's historic center radiates baroque majesty along the Danube, famous for classical music and philosophical salons.",
            landmarks: ["St. Stephen's Cathedral", "Hofburg Palace", "Opera House"]
        },
        prague: {
            name: "Prague",
            country: "Czechia",
            type: "Major City",
            lat: 50.07,
            lon: 14.43,
            number: 11,
            vibration: "Golden City of Alchemists",
            description: "Prague's medieval streets and Astronomical Clock have intrigued mystics and astronomers for centuries.",
            landmarks: ["Charles Bridge", "Prague Castle", "Old Town Square"]
        },
        athens: {
            name: "Athens",
            country: "Greece",
            type: "Major City",
            lat: 37.98,
            lon: 23.72,
            number: 22,
            vibration: "Cradle of Sacred Geometry",
            description: "Crowned by the Acropolis, Athens is the cradle of democracy, Western philosophy, and golden ratio architecture.",
            landmarks: ["Parthenon", "Acropolis Museum", "Ancient Agora"]
        },
        dublin: {
            name: "Dublin",
            country: "Ireland",
            type: "Major City",
            lat: 53.34,
            lon: -6.26,
            number: 3,
            vibration: "Literary & Celtic Resonance",
            description: "Nestled on Dublin Bay, this literary city is illuminated by the illuminated manuscripts of Trinity College.",
            landmarks: ["Trinity College", "Trinity Library", "Dublin Castle"]
        },
        stockholm: {
            name: "Stockholm",
            country: "Sweden",
            type: "Major City",
            lat: 59.32,
            lon: 18.06,
            number: 9,
            vibration: "Venice of the North",
            description: "Spanning 14 islands where Lake Mälaren meets the Baltic Sea, Stockholm radiates clean waters and light.",
            landmarks: ["Gamla Stan", "Royal Palace", "Vasa Museum"]
        },
        oslo: {
            name: "Oslo",
            country: "Norway",
            type: "Major City",
            lat: 59.91,
            lon: 10.75,
            number: 7,
            vibration: "Fjord Sanctuary",
            description: "Situated at the head of the Oslofjord, Oslo blends modern sustainable design with vast pine forests.",
            landmarks: ["Vigeland Park", "Akershus Fortress", "Oslo Opera House"]
        },
        copenhagen: {
            name: "Copenhagen",
            country: "Denmark",
            type: "Major City",
            lat: 55.67,
            lon: 12.56,
            number: 6,
            vibration: "Nordic Balance",
            description: "Copenhagen blends fairytale canals with modern sustainable architecture and Scandinavian bicycle culture.",
            landmarks: ["Nyhavn", "Round Tower", "Amalienborg Palace"]
        },
        warsaw: {
            name: "Warsaw",
            country: "Poland",
            type: "Major City",
            lat: 52.23,
            lon: 21.01,
            number: 1,
            vibration: "Phoenix Rebirth",
            description: "Meticulously restored following WWII, Warsaw represents the triumphant resurrection of culture and history.",
            landmarks: ["Royal Castle", "Old Town Market Place", "Palace of Culture"]
        },
        budapest: {
            name: "Budapest",
            country: "Hungary",
            type: "Major City",
            lat: 47.49,
            lon: 19.04,
            number: 5,
            vibration: "Pearl of the Danube",
            description: "Buda and Pest, united across the majestic Danube, sit atop subterranean thermal energy channels.",
            landmarks: ["Parliament Building", "Buda Castle", "Chain Bridge"]
        },
        geneva: {
            name: "Geneva",
            country: "Switzerland",
            type: "Major City",
            lat: 46.2,
            lon: 6.14,
            number: 6,
            vibration: "Global Peace Sanctuary",
            description: "Set against Lake Geneva and the Alps, Geneva is a global center for international diplomacy and scientific inquiry.",
            landmarks: ["Jet d'Eau", "St. Pierre Cathedral", "Palais des Nations"]
        }
    }
};
