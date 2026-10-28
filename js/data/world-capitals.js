const WORLD_CAPITALS = {
    "dhaka": {
        "name": "Dhaka",
        "country": "Bangladesh",
        "type": "Major City",
        "lat": 23.43,
        "lon": 90.24
    },
    "brussels": {
        "name": "Brussels",
        "country": "Belgium",
        "type": "Major City",
        "lat": 50.5,
        "lon": 4.2
    },
    "ouagadougou": {
        "name": "Ouagadougou",
        "country": "Burkina Faso",
        "type": "Major City",
        "lat": 12.22,
        "lon": -1.31
    },
    "sofia": {
        "name": "Sofia",
        "country": "Bulgaria",
        "type": "Major City",
        "lat": 42.41,
        "lon": 23.19
    },
    "sarajevo": {
        "name": "Sarajevo",
        "country": "Bosnia and Herz.",
        "type": "Major City",
        "lat": 43.52,
        "lon": 18.25
    },
    "bridgetown": {
        "name": "Bridgetown",
        "country": "Barbados",
        "type": "Major City",
        "lat": 13.06,
        "lon": -59.37
    },
    "mata_utu": {
        "name": "Mata-Utu",
        "country": "Wallis and Futuna Is.",
        "type": "Major City",
        "lat": -13.57,
        "lon": -171.56
    },
    "gustavia": {
        "name": "Gustavia",
        "country": "Saint Barthelemy",
        "type": "Major City",
        "lat": 17.53,
        "lon": -62.51
    },
    "hamilton": {
        "name": "Hamilton",
        "country": "Bermuda",
        "type": "Major City",
        "lat": 32.17,
        "lon": -64.47
    },
    "bandar_seri_begawan": {
        "name": "Bandar Seri Begawan",
        "country": "Brunei",
        "type": "Major City",
        "lat": 4.53,
        "lon": 114.56
    },
    "la_paz": {
        "name": "La Paz",
        "country": "Bolivia",
        "type": "Major City",
        "lat": -16.3,
        "lon": -68.09
    },
    "manama": {
        "name": "Manama",
        "country": "Bahrain",
        "type": "Major City",
        "lat": 26.14,
        "lon": 50.34
    },
    "bujumbura": {
        "name": "Bujumbura",
        "country": "Burundi",
        "type": "Major City",
        "lat": -3.22,
        "lon": 29.21
    },
    "porto_novo": {
        "name": "Porto-Novo",
        "country": "Benin",
        "type": "Major City",
        "lat": 6.29,
        "lon": 2.37
    },
    "thimphu": {
        "name": "Thimphu",
        "country": "Bhutan",
        "type": "Major City",
        "lat": 27.29,
        "lon": 89.36
    },
    "kingston": {
        "name": "Kingston",
        "country": "Norfolk Island",
        "type": "Major City",
        "lat": -29.03,
        "lon": 167.58
    },
    "gaborone": {
        "name": "Gaborone",
        "country": "Botswana",
        "type": "Major City",
        "lat": -24.45,
        "lon": 25.55
    },
    "apia": {
        "name": "Apia",
        "country": "Samoa",
        "type": "Major City",
        "lat": -13.5,
        "lon": -171.44
    },
    "brasilia": {
        "name": "Brasilia",
        "country": "Brazil",
        "type": "Major City",
        "lat": -15.47,
        "lon": -47.55
    },
    "nassau": {
        "name": "Nassau",
        "country": "Bahamas",
        "type": "Major City",
        "lat": 25.05,
        "lon": -77.21
    },
    "saint_helier": {
        "name": "Saint Helier",
        "country": "Jersey",
        "type": "Major City",
        "lat": 49.11,
        "lon": -2.06
    },
    "minsk": {
        "name": "Minsk",
        "country": "Belarus",
        "type": "Major City",
        "lat": 53.54,
        "lon": 27.34
    },
    "belmopan": {
        "name": "Belmopan",
        "country": "Belize",
        "type": "Major City",
        "lat": 17.15,
        "lon": -88.46
    },
    "moscow": {
        "name": "Moscow",
        "country": "Russia",
        "type": "Major City",
        "lat": 55.45,
        "lon": 37.35
    },
    "kigali": {
        "name": "Kigali",
        "country": "Rwanda",
        "type": "Major City",
        "lat": -1.57,
        "lon": 30.04
    },
    "belgrade": {
        "name": "Belgrade",
        "country": "Serbia",
        "type": "Major City",
        "lat": 44.5,
        "lon": 20.3
    },
    "dili": {
        "name": "Dili",
        "country": "Timor-Leste",
        "type": "Major City",
        "lat": -8.35,
        "lon": 125.36
    },
    "ashgabat": {
        "name": "Ashgabat",
        "country": "Turkmenistan",
        "type": "Major City",
        "lat": 37.57,
        "lon": 58.23
    },
    "dushanbe": {
        "name": "Dushanbe",
        "country": "Tajikistan",
        "type": "Major City",
        "lat": 38.35,
        "lon": 68.48
    },
    "bucharest": {
        "name": "Bucharest",
        "country": "Romania",
        "type": "Major City",
        "lat": 44.26,
        "lon": 26.06
    },
    "bissau": {
        "name": "Bissau",
        "country": "Guinea-Bissau",
        "type": "Major City",
        "lat": 11.51,
        "lon": -15.35
    },
    "hagatna": {
        "name": "Hagatna",
        "country": "Guam",
        "type": "Major City",
        "lat": 13.28,
        "lon": 144.44
    },
    "guatemala_city": {
        "name": "Guatemala City",
        "country": "Guatemala",
        "type": "Major City",
        "lat": 14.37,
        "lon": -90.31
    },
    "athens": {
        "name": "Athens",
        "country": "Greece",
        "type": "Major City",
        "lat": 37.59,
        "lon": 23.44
    },
    "malabo": {
        "name": "Malabo",
        "country": "Eq. Guinea",
        "type": "Major City",
        "lat": 3.45,
        "lon": 8.47
    },
    "tokyo": {
        "name": "Tokyo",
        "country": "Japan",
        "type": "Major City",
        "lat": 35.41,
        "lon": 139.45
    },
    "georgetown": {
        "name": "Georgetown",
        "country": "Guyana",
        "type": "Major City",
        "lat": 6.48,
        "lon": -58.1
    },
    "saint_peter_port": {
        "name": "Saint Peter Port",
        "country": "Guernsey",
        "type": "Major City",
        "lat": 49.27,
        "lon": -2.32
    },
    "t_bilisi": {
        "name": "T'bilisi",
        "country": "Georgia",
        "type": "Major City",
        "lat": 41.43,
        "lon": 44.47
    },
    "saint_george_s": {
        "name": "Saint George's",
        "country": "Grenada",
        "type": "Major City",
        "lat": 12.03,
        "lon": -61.45
    },
    "london": {
        "name": "London",
        "country": "United Kingdom",
        "type": "Major City",
        "lat": 51.3,
        "lon": -0.1
    },
    "libreville": {
        "name": "Libreville",
        "country": "Gabon",
        "type": "Major City",
        "lat": 0.23,
        "lon": 9.27
    },
    "san_salvador": {
        "name": "San Salvador",
        "country": "El Salvador",
        "type": "Major City",
        "lat": 13.42,
        "lon": -89.12
    },
    "conakry": {
        "name": "Conakry",
        "country": "Guinea",
        "type": "Major City",
        "lat": 9.33,
        "lon": -13.42
    },
    "banjul": {
        "name": "Banjul",
        "country": "Gambia",
        "type": "Major City",
        "lat": 13.27,
        "lon": -16.34
    },
    "nuuk": {
        "name": "Nuuk",
        "country": "Greenland",
        "type": "Major City",
        "lat": 64.11,
        "lon": -51.45
    },
    "gibraltar": {
        "name": "Gibraltar",
        "country": "Gibraltar",
        "type": "Major City",
        "lat": 36.08,
        "lon": -5.21
    },
    "accra": {
        "name": "Accra",
        "country": "Ghana",
        "type": "Major City",
        "lat": 5.33,
        "lon": -0.13
    },
    "muscat": {
        "name": "Muscat",
        "country": "Oman",
        "type": "Major City",
        "lat": 23.37,
        "lon": 58.35
    },
    "tunis": {
        "name": "Tunis",
        "country": "Tunisia",
        "type": "Major City",
        "lat": 36.48,
        "lon": 10.11
    },
    "amman": {
        "name": "Amman",
        "country": "Jordan",
        "type": "Major City",
        "lat": 31.57,
        "lon": 35.56
    },
    "zagreb": {
        "name": "Zagreb",
        "country": "Croatia",
        "type": "Major City",
        "lat": 45.48,
        "lon": 16
    },
    "port_au_prince": {
        "name": "Port-au-Prince",
        "country": "Haiti",
        "type": "Major City",
        "lat": 18.32,
        "lon": -72.2
    },
    "budapest": {
        "name": "Budapest",
        "country": "Hungary",
        "type": "Major City",
        "lat": 47.3,
        "lon": 19.05
    },
    "hong_kong": {
        "name": "Hong Kong",
        "country": "Hong Kong",
        "type": "Major City",
        "lat": 22.15,
        "lon": 114.1
    },
    "tegucigalpa": {
        "name": "Tegucigalpa",
        "country": "Honduras",
        "type": "Major City",
        "lat": 14.06,
        "lon": -87.13
    },
    "caracas": {
        "name": "Caracas",
        "country": "Venezuela",
        "type": "Major City",
        "lat": 10.3,
        "lon": -66.56
    },
    "san_juan": {
        "name": "San Juan",
        "country": "Puerto Rico",
        "type": "Major City",
        "lat": 18.28,
        "lon": -66.07
    },
    "melekeok": {
        "name": "Melekeok",
        "country": "Palau",
        "type": "Major City",
        "lat": 7.29,
        "lon": 134.38
    },
    "lisbon": {
        "name": "Lisbon",
        "country": "Portugal",
        "type": "Major City",
        "lat": 38.43,
        "lon": -9.08
    },
    "longyearbyen": {
        "name": "Longyearbyen",
        "country": "Svalbard",
        "type": "Major City",
        "lat": 78.13,
        "lon": 15.33
    },
    "asuncion": {
        "name": "Asuncion",
        "country": "Paraguay",
        "type": "Major City",
        "lat": -25.16,
        "lon": -57.4
    },
    "baghdad": {
        "name": "Baghdad",
        "country": "Iraq",
        "type": "Major City",
        "lat": 33.2,
        "lon": 44.23
    },
    "panama_city": {
        "name": "Panama City",
        "country": "Panama",
        "type": "Major City",
        "lat": 8.58,
        "lon": -79.32
    },
    "papeete": {
        "name": "Papeete",
        "country": "French Polynesia",
        "type": "Major City",
        "lat": -17.32,
        "lon": -149.34
    },
    "port_moresby": {
        "name": "Port Moresby",
        "country": "Papua New Guinea",
        "type": "Major City",
        "lat": -9.3,
        "lon": 147.1
    },
    "lima": {
        "name": "Lima",
        "country": "Peru",
        "type": "Major City",
        "lat": -12.03,
        "lon": -77.03
    },
    "islamabad": {
        "name": "Islamabad",
        "country": "Pakistan",
        "type": "Major City",
        "lat": 33.42,
        "lon": 73.1
    },
    "manila": {
        "name": "Manila",
        "country": "Philippines",
        "type": "Major City",
        "lat": 14.35,
        "lon": 121
    },
    "adamstown": {
        "name": "Adamstown",
        "country": "Pitcairn Is.",
        "type": "Major City",
        "lat": -25.04,
        "lon": -130.05
    },
    "warsaw": {
        "name": "Warsaw",
        "country": "Poland",
        "type": "Major City",
        "lat": 52.15,
        "lon": 21
    },
    "saint_pierre": {
        "name": "Saint-Pierre",
        "country": "Saint Pierre and Miquelon",
        "type": "Major City",
        "lat": 46.46,
        "lon": -56.11
    },
    "lusaka": {
        "name": "Lusaka",
        "country": "Zambia",
        "type": "Major City",
        "lat": -15.25,
        "lon": 28.17
    },
    "tallinn": {
        "name": "Tallinn",
        "country": "Estonia",
        "type": "Major City",
        "lat": 59.26,
        "lon": 24.43
    },
    "cairo": {
        "name": "Cairo",
        "country": "Egypt",
        "type": "Major City",
        "lat": 30.03,
        "lon": 31.15
    },
    "pretoria": {
        "name": "Pretoria",
        "country": "South Africa",
        "type": "Major City",
        "lat": -25.42,
        "lon": 28.13
    },
    "quito": {
        "name": "Quito",
        "country": "Ecuador",
        "type": "Major City",
        "lat": -0.13,
        "lon": -78.3
    },
    "rome": {
        "name": "Rome",
        "country": "Italy",
        "type": "Major City",
        "lat": 41.54,
        "lon": 12.29
    },
    "hanoi": {
        "name": "Hanoi",
        "country": "Vietnam",
        "type": "Major City",
        "lat": 21.02,
        "lon": 105.51
    },
    "honiara": {
        "name": "Honiara",
        "country": "Solomon Is.",
        "type": "Major City",
        "lat": -9.26,
        "lon": 159.57
    },
    "addis_ababa": {
        "name": "Addis Ababa",
        "country": "Ethiopia",
        "type": "Major City",
        "lat": 9.02,
        "lon": 38.42
    },
    "mogadishu": {
        "name": "Mogadishu",
        "country": "Somalia",
        "type": "Major City",
        "lat": 2.04,
        "lon": 45.22
    },
    "harare": {
        "name": "Harare",
        "country": "Zimbabwe",
        "type": "Major City",
        "lat": -17.5,
        "lon": 31.03
    },
    "riyadh": {
        "name": "Riyadh",
        "country": "Saudi Arabia",
        "type": "Major City",
        "lat": 24.38,
        "lon": 46.43
    },
    "madrid": {
        "name": "Madrid",
        "country": "Spain",
        "type": "Major City",
        "lat": 40.24,
        "lon": -3.41
    },
    "asmara": {
        "name": "Asmara",
        "country": "Eritrea",
        "type": "Major City",
        "lat": 15.2,
        "lon": 38.56
    },
    "podgorica": {
        "name": "Podgorica",
        "country": "Montenegro",
        "type": "Major City",
        "lat": 42.26,
        "lon": 19.16
    },
    "chisinau": {
        "name": "Chisinau",
        "country": "Moldova",
        "type": "Major City",
        "lat": 47,
        "lon": 28.51
    },
    "antananarivo": {
        "name": "Antananarivo",
        "country": "Madagascar",
        "type": "Major City",
        "lat": -18.55,
        "lon": 47.31
    },
    "marigot": {
        "name": "Marigot",
        "country": "Saint Martin",
        "type": "Major City",
        "lat": 18.04,
        "lon": -63.05
    },
    "rabat": {
        "name": "Rabat",
        "country": "Morocco",
        "type": "Major City",
        "lat": 34.01,
        "lon": -6.49
    },
    "monaco": {
        "name": "Monaco",
        "country": "Monaco",
        "type": "Major City",
        "lat": 43.44,
        "lon": 7.25
    },
    "tashkent": {
        "name": "Tashkent",
        "country": "Uzbekistan",
        "type": "Major City",
        "lat": 41.2,
        "lon": 69.18
    },
    "rangoon": {
        "name": "Rangoon",
        "country": "Myanmar",
        "type": "Major City",
        "lat": 16.48,
        "lon": 96.09
    },
    "bamako": {
        "name": "Bamako",
        "country": "Mali",
        "type": "Major City",
        "lat": 12.39,
        "lon": -8
    },
    "ulaanbaatar": {
        "name": "Ulaanbaatar",
        "country": "Mongolia",
        "type": "Major City",
        "lat": 47.55,
        "lon": 106.55
    },
    "majuro": {
        "name": "Majuro",
        "country": "Marshall Islands",
        "type": "Major City",
        "lat": 7.06,
        "lon": 171.23
    },
    "skopje": {
        "name": "Skopje",
        "country": "Macedonia",
        "type": "Major City",
        "lat": 42,
        "lon": 21.26
    },
    "port_louis": {
        "name": "Port Louis",
        "country": "Mauritius",
        "type": "Major City",
        "lat": -20.09,
        "lon": 57.29
    },
    "valletta": {
        "name": "Valletta",
        "country": "Malta",
        "type": "Major City",
        "lat": 35.53,
        "lon": 14.3
    },
    "lilongwe": {
        "name": "Lilongwe",
        "country": "Malawi",
        "type": "Major City",
        "lat": -13.59,
        "lon": 33.47
    },
    "male": {
        "name": "Male",
        "country": "Maldives",
        "type": "Major City",
        "lat": 4.1,
        "lon": 73.3
    },
    "saipan": {
        "name": "Saipan",
        "country": "Northern Mariana Islands",
        "type": "Major City",
        "lat": 15.12,
        "lon": 145.45
    },
    "plymouth": {
        "name": "Plymouth",
        "country": "Montserrat",
        "type": "Major City",
        "lat": 16.42,
        "lon": -62.13
    },
    "nouakchott": {
        "name": "Nouakchott",
        "country": "Mauritania",
        "type": "Major City",
        "lat": 18.07,
        "lon": -16.02
    },
    "douglas": {
        "name": "Douglas",
        "country": "Isle of Man",
        "type": "Major City",
        "lat": 54.09,
        "lon": -4.29
    },
    "kampala": {
        "name": "Kampala",
        "country": "Uganda",
        "type": "Major City",
        "lat": 0.19,
        "lon": 32.25
    },
    "kuala_lumpur": {
        "name": "Kuala Lumpur",
        "country": "Malaysia",
        "type": "Major City",
        "lat": 3.1,
        "lon": 101.42
    },
    "mexico_city": {
        "name": "Mexico City",
        "country": "Mexico",
        "type": "Major City",
        "lat": 19.26,
        "lon": -99.08
    },
    "jerusalem": {
        "name": "Jerusalem",
        "country": "Israel",
        "type": "Major City",
        "lat": 31.46,
        "lon": 35.14
    },
    "paris": {
        "name": "Paris",
        "country": "France",
        "type": "Major City",
        "lat": 48.52,
        "lon": 2.2
    },
    "jamestown": {
        "name": "Jamestown",
        "country": "Saint Helena",
        "type": "Major City",
        "lat": -15.56,
        "lon": -5.44
    },
    "helsinki": {
        "name": "Helsinki",
        "country": "Finland",
        "type": "Major City",
        "lat": 60.1,
        "lon": 24.56
    },
    "suva": {
        "name": "Suva",
        "country": "Fiji",
        "type": "Major City",
        "lat": -18.08,
        "lon": 178.25
    },
    "stanley": {
        "name": "Stanley",
        "country": "Falkland Is.",
        "type": "Major City",
        "lat": -51.42,
        "lon": -57.51
    },
    "palikir": {
        "name": "Palikir",
        "country": "Micronesia",
        "type": "Major City",
        "lat": 6.55,
        "lon": 158.09
    },
    "torshavn": {
        "name": "Torshavn",
        "country": "Faroe Islands",
        "type": "Major City",
        "lat": 62.01,
        "lon": -6.46
    },
    "managua": {
        "name": "Managua",
        "country": "Nicaragua",
        "type": "Major City",
        "lat": 12.09,
        "lon": -86.17
    },
    "amsterdam": {
        "name": "Amsterdam",
        "country": "Netherlands",
        "type": "Major City",
        "lat": 52.23,
        "lon": 4.54
    },
    "oslo": {
        "name": "Oslo",
        "country": "Norway",
        "type": "Major City",
        "lat": 59.55,
        "lon": 10.45
    },
    "windhoek": {
        "name": "Windhoek",
        "country": "Namibia",
        "type": "Major City",
        "lat": -22.34,
        "lon": 17.05
    },
    "port_vila": {
        "name": "Port-Vila",
        "country": "Vanuatu",
        "type": "Major City",
        "lat": -17.44,
        "lon": 168.19
    },
    "noumea": {
        "name": "Noumea",
        "country": "New Caledonia",
        "type": "Major City",
        "lat": -22.16,
        "lon": 166.27
    },
    "niamey": {
        "name": "Niamey",
        "country": "Niger",
        "type": "Major City",
        "lat": 13.31,
        "lon": 2.07
    },
    "abuja": {
        "name": "Abuja",
        "country": "Nigeria",
        "type": "Major City",
        "lat": 9.05,
        "lon": 7.32
    },
    "wellington": {
        "name": "Wellington",
        "country": "New Zealand",
        "type": "Major City",
        "lat": -41.28,
        "lon": 174.51
    },
    "kathmandu": {
        "name": "Kathmandu",
        "country": "Nepal",
        "type": "Major City",
        "lat": 27.43,
        "lon": 85.19
    },
    "alofi": {
        "name": "Alofi",
        "country": "Niue",
        "type": "Major City",
        "lat": -19.01,
        "lon": -169.55
    },
    "avarua": {
        "name": "Avarua",
        "country": "Cook Islands",
        "type": "Major City",
        "lat": -21.12,
        "lon": -159.46
    },
    "yamoussoukro": {
        "name": "Yamoussoukro",
        "country": "Côte d'Ivoire",
        "type": "Major City",
        "lat": 6.49,
        "lon": -5.17
    },
    "bern": {
        "name": "Bern",
        "country": "Switzerland",
        "type": "Major City",
        "lat": 46.57,
        "lon": 7.26
    },
    "bogota": {
        "name": "Bogota",
        "country": "Colombia",
        "type": "Major City",
        "lat": 4.36,
        "lon": -74.05
    },
    "beijing": {
        "name": "Beijing",
        "country": "China",
        "type": "Major City",
        "lat": 39.55,
        "lon": 116.23
    },
    "yaounde": {
        "name": "Yaounde",
        "country": "Cameroon",
        "type": "Major City",
        "lat": 3.52,
        "lon": 11.31
    },
    "santiago": {
        "name": "Santiago",
        "country": "Chile",
        "type": "Major City",
        "lat": -33.27,
        "lon": -70.4
    },
    "west_island": {
        "name": "West Island",
        "country": "Cocos Islands",
        "type": "Major City",
        "lat": -12.1,
        "lon": 96.5
    },
    "ottawa": {
        "name": "Ottawa",
        "country": "Canada",
        "type": "Major City",
        "lat": 45.25,
        "lon": -75.42
    },
    "brazzaville": {
        "name": "Brazzaville",
        "country": "Congo",
        "type": "Major City",
        "lat": -4.15,
        "lon": 15.17
    },
    "bangui": {
        "name": "Bangui",
        "country": "Central African Rep.",
        "type": "Major City",
        "lat": 4.22,
        "lon": 18.35
    },
    "kinshasa": {
        "name": "Kinshasa",
        "country": "Congo",
        "type": "Major City",
        "lat": -4.19,
        "lon": 15.18
    },
    "prague": {
        "name": "Prague",
        "country": "Czechia",
        "type": "Major City",
        "lat": 50.05,
        "lon": 14.28
    },
    "nicosia": {
        "name": "Nicosia",
        "country": "Cyprus",
        "type": "Major City",
        "lat": 35.1,
        "lon": 33.22
    },
    "the_settlement": {
        "name": "The Settlement",
        "country": "Christmas Island",
        "type": "Major City",
        "lat": -10.25,
        "lon": 105.43
    },
    "san_jose": {
        "name": "San Jose",
        "country": "Costa Rica",
        "type": "Major City",
        "lat": 9.56,
        "lon": -84.05
    },
    "praia": {
        "name": "Praia",
        "country": "Cape Verde",
        "type": "Major City",
        "lat": 14.55,
        "lon": -23.31
    },
    "havana": {
        "name": "Havana",
        "country": "Cuba",
        "type": "Major City",
        "lat": 23.07,
        "lon": -82.21
    },
    "mbabane": {
        "name": "Mbabane",
        "country": "Swaziland",
        "type": "Major City",
        "lat": -26.18,
        "lon": 31.06
    },
    "damascus": {
        "name": "Damascus",
        "country": "Syria",
        "type": "Major City",
        "lat": 33.3,
        "lon": 36.18
    },
    "bishkek": {
        "name": "Bishkek",
        "country": "Kyrgyzstan",
        "type": "Major City",
        "lat": 42.52,
        "lon": 74.36
    },
    "nairobi": {
        "name": "Nairobi",
        "country": "Kenya",
        "type": "Major City",
        "lat": -1.17,
        "lon": 36.49
    },
    "paramaribo": {
        "name": "Paramaribo",
        "country": "Suriname",
        "type": "Major City",
        "lat": 5.5,
        "lon": -55.1
    },
    "tarawa": {
        "name": "Tarawa",
        "country": "Kiribati",
        "type": "Major City",
        "lat": 1.19,
        "lon": 172.58
    },
    "phnom_penh": {
        "name": "Phnom Penh",
        "country": "Cambodia",
        "type": "Major City",
        "lat": 11.33,
        "lon": 104.55
    },
    "basseterre": {
        "name": "Basseterre",
        "country": "St. Kitts and Nevis",
        "type": "Major City",
        "lat": 17.18,
        "lon": -62.43
    },
    "moroni": {
        "name": "Moroni",
        "country": "Comoros",
        "type": "Major City",
        "lat": -11.42,
        "lon": 43.14
    },
    "sao_tome": {
        "name": "Sao Tome",
        "country": "São Tomé and Principe",
        "type": "Major City",
        "lat": 0.12,
        "lon": 6.39
    },
    "bratislava": {
        "name": "Bratislava",
        "country": "Slovakia",
        "type": "Major City",
        "lat": 48.09,
        "lon": 17.07
    },
    "seoul": {
        "name": "Seoul",
        "country": "Korea South",
        "type": "Major City",
        "lat": 37.33,
        "lon": 126.59
    },
    "ljubljana": {
        "name": "Ljubljana",
        "country": "Slovenia",
        "type": "Major City",
        "lat": 46.03,
        "lon": 14.31
    },
    "pyongyang": {
        "name": "Pyongyang",
        "country": "Korea North",
        "type": "Major City",
        "lat": 39.01,
        "lon": 125.45
    },
    "kuwait_city": {
        "name": "Kuwait City",
        "country": "Kuwait",
        "type": "Major City",
        "lat": 29.22,
        "lon": 47.58
    },
    "dakar": {
        "name": "Dakar",
        "country": "Senegal",
        "type": "Major City",
        "lat": 14.4,
        "lon": -17.26
    },
    "san_marino": {
        "name": "San Marino",
        "country": "San Marino",
        "type": "Major City",
        "lat": 43.56,
        "lon": 12.25
    },
    "freetown": {
        "name": "Freetown",
        "country": "Sierra Leone",
        "type": "Major City",
        "lat": 8.3,
        "lon": -13.15
    },
    "victoria": {
        "name": "Victoria",
        "country": "Seychelles",
        "type": "Major City",
        "lat": -4.38,
        "lon": 55.27
    },
    "astana": {
        "name": "Astana",
        "country": "Kazakhstan",
        "type": "Major City",
        "lat": 51.1,
        "lon": 71.25
    },
    "george_town": {
        "name": "George Town",
        "country": "Cayman Islands",
        "type": "Major City",
        "lat": 19.18,
        "lon": -81.23
    },
    "singapore": {
        "name": "Singapore",
        "country": "Singapore",
        "type": "Major City",
        "lat": 1.17,
        "lon": 103.51
    },
    "stockholm": {
        "name": "Stockholm",
        "country": "Sweden",
        "type": "Major City",
        "lat": 59.2,
        "lon": 18.03
    },
    "khartoum": {
        "name": "Khartoum",
        "country": "Sudan",
        "type": "Major City",
        "lat": 15.36,
        "lon": 32.32
    },
    "santo_domingo": {
        "name": "Santo Domingo",
        "country": "Dominican Rep.",
        "type": "Major City",
        "lat": 18.28,
        "lon": -69.54
    },
    "roseau": {
        "name": "Roseau",
        "country": "Dominica",
        "type": "Major City",
        "lat": 15.18,
        "lon": -61.24
    },
    "djibouti": {
        "name": "Djibouti",
        "country": "Djibouti",
        "type": "Major City",
        "lat": 11.35,
        "lon": 43.09
    },
    "copenhagen": {
        "name": "Copenhagen",
        "country": "Denmark",
        "type": "Major City",
        "lat": 55.4,
        "lon": 12.35
    },
    "road_town": {
        "name": "Road Town",
        "country": "British Virgin Islands",
        "type": "Major City",
        "lat": 18.27,
        "lon": -64.37
    },
    "berlin": {
        "name": "Berlin",
        "country": "Germany",
        "type": "Major City",
        "lat": 52.31,
        "lon": 13.24
    },
    "sanaa": {
        "name": "Sanaa",
        "country": "Yemen",
        "type": "Major City",
        "lat": 15.21,
        "lon": 44.12
    },
    "algiers": {
        "name": "Algiers",
        "country": "Algeria",
        "type": "Major City",
        "lat": 36.45,
        "lon": 3.03
    },
    "washington,_dc": {
        "name": "Washington, DC",
        "country": "United States of America",
        "type": "Major City",
        "lat": 38.53,
        "lon": -77.02
    },
    "montevideo": {
        "name": "Montevideo",
        "country": "Uruguay",
        "type": "Major City",
        "lat": -34.53,
        "lon": -56.11
    },
    "mamoudzou": {
        "name": "Mamoudzou",
        "country": "Mayotte",
        "type": "Major City",
        "lat": -12.46,
        "lon": 45.13
    },
    "beirut": {
        "name": "Beirut",
        "country": "Lebanon",
        "type": "Major City",
        "lat": 33.52,
        "lon": 35.3
    },
    "castries": {
        "name": "Castries",
        "country": "Saint Lucia",
        "type": "Major City",
        "lat": 14.01,
        "lon": -61
    },
    "vientiane": {
        "name": "Vientiane",
        "country": "Laos",
        "type": "Major City",
        "lat": 17.58,
        "lon": 102.36
    },
    "funafuti": {
        "name": "Funafuti",
        "country": "Tuvalu",
        "type": "Major City",
        "lat": -8.3,
        "lon": 179.12
    },
    "taipei": {
        "name": "Taipei",
        "country": "Taiwan",
        "type": "Major City",
        "lat": 25.03,
        "lon": 121.3
    },
    "port_of_spain": {
        "name": "Port-of-Spain",
        "country": "Trinidad and Tobago",
        "type": "Major City",
        "lat": 10.39,
        "lon": -61.31
    },
    "ankara": {
        "name": "Ankara",
        "country": "Turkey",
        "type": "Major City",
        "lat": 39.56,
        "lon": 32.52
    },
    "colombo": {
        "name": "Colombo",
        "country": "Sri Lanka",
        "type": "Major City",
        "lat": 6.56,
        "lon": 79.51
    },
    "vaduz": {
        "name": "Vaduz",
        "country": "Liechtenstein",
        "type": "Major City",
        "lat": 47.08,
        "lon": 9.31
    },
    "riga": {
        "name": "Riga",
        "country": "Latvia",
        "type": "Major City",
        "lat": 56.57,
        "lon": 24.06
    },
    "nuku_alofa": {
        "name": "Nuku'alofa",
        "country": "Tonga",
        "type": "Major City",
        "lat": -21.08,
        "lon": -175.12
    },
    "vilnius": {
        "name": "Vilnius",
        "country": "Lithuania",
        "type": "Major City",
        "lat": 54.41,
        "lon": 25.19
    },
    "luxembourg": {
        "name": "Luxembourg",
        "country": "Luxembourg",
        "type": "Major City",
        "lat": 49.36,
        "lon": 6.07
    },
    "monrovia": {
        "name": "Monrovia",
        "country": "Liberia",
        "type": "Major City",
        "lat": 6.18,
        "lon": -10.48
    },
    "maseru": {
        "name": "Maseru",
        "country": "Lesotho",
        "type": "Major City",
        "lat": -29.19,
        "lon": 27.29
    },
    "bangkok": {
        "name": "Bangkok",
        "country": "Thailand",
        "type": "Major City",
        "lat": 13.45,
        "lon": 100.31
    },
    "lome": {
        "name": "Lome",
        "country": "Togo",
        "type": "Major City",
        "lat": 6.08,
        "lon": 1.13
    },
    "n_djamena": {
        "name": "N'Djamena",
        "country": "Chad",
        "type": "Major City",
        "lat": 12.06,
        "lon": 15.02
    },
    "grand_turk": {
        "name": "Grand Turk",
        "country": "Turks and Caicos Islands",
        "type": "Major City",
        "lat": 21.28,
        "lon": -71.08
    },
    "tripoli": {
        "name": "Tripoli",
        "country": "Libya",
        "type": "Major City",
        "lat": 32.53,
        "lon": 13.1
    },
    "vatican_city": {
        "name": "Vatican City",
        "country": "Holy See",
        "type": "Major City",
        "lat": 41.54,
        "lon": 12.27
    },
    "kingstown": {
        "name": "Kingstown",
        "country": "St. Vin. and Gren.",
        "type": "Major City",
        "lat": 13.09,
        "lon": -61.14
    },
    "abu_dhabi": {
        "name": "Abu Dhabi",
        "country": "United Arab Emirates",
        "type": "Major City",
        "lat": 24.28,
        "lon": 54.22
    },
    "andorra_la_vella": {
        "name": "Andorra la Vella",
        "country": "Andorra",
        "type": "Major City",
        "lat": 42.3,
        "lon": 1.31
    },
    "saint_john_s": {
        "name": "Saint John's",
        "country": "Antigua and Barb.",
        "type": "Major City",
        "lat": 17.07,
        "lon": -61.51
    },
    "kabul": {
        "name": "Kabul",
        "country": "Afghanistan",
        "type": "Major City",
        "lat": 34.31,
        "lon": 69.11
    },
    "the_valley": {
        "name": "The Valley",
        "country": "Anguilla",
        "type": "Major City",
        "lat": 18.13,
        "lon": -63.03
    },
    "charlotte_amalie": {
        "name": "Charlotte Amalie",
        "country": "Virgin Islands",
        "type": "Major City",
        "lat": 18.21,
        "lon": -64.56
    },
    "reykjavik": {
        "name": "Reykjavik",
        "country": "Iceland",
        "type": "Major City",
        "lat": 64.09,
        "lon": -21.57
    },
    "tehran": {
        "name": "Tehran",
        "country": "Iran",
        "type": "Major City",
        "lat": 35.4,
        "lon": 51.25
    },
    "yerevan": {
        "name": "Yerevan",
        "country": "Armenia",
        "type": "Major City",
        "lat": 40.1,
        "lon": 44.3
    },
    "tirana": {
        "name": "Tirana",
        "country": "Albania",
        "type": "Major City",
        "lat": 41.19,
        "lon": 19.49
    },
    "luanda": {
        "name": "Luanda",
        "country": "Angola",
        "type": "Major City",
        "lat": -8.5,
        "lon": 13.14
    },
    "willemstad": {
        "name": "Willemstad",
        "country": "Netherlands",
        "type": "Major City",
        "lat": 12.06,
        "lon": -68.56
    },
    "pago_pago": {
        "name": "Pago Pago",
        "country": "American Samoa",
        "type": "Major City",
        "lat": -14.16,
        "lon": -170.42
    },
    "buenos_aires": {
        "name": "Buenos Aires",
        "country": "Argentina",
        "type": "Major City",
        "lat": -34.36,
        "lon": -58.4
    },
    "canberra": {
        "name": "Canberra",
        "country": "Australia",
        "type": "Major City",
        "lat": -35.17,
        "lon": 149.13
    },
    "vienna": {
        "name": "Vienna",
        "country": "Austria",
        "type": "Major City",
        "lat": 48.12,
        "lon": 16.22
    },
    "oranjestad": {
        "name": "Oranjestad",
        "country": "Aruba",
        "type": "Major City",
        "lat": 12.31,
        "lon": -70.02
    },
    "new_delhi": {
        "name": "New Delhi",
        "country": "India",
        "type": "Major City",
        "lat": 28.36,
        "lon": 77.12
    },
    "dar_es_salaam": {
        "name": "Dar es Salaam",
        "country": "Tanzania",
        "type": "Major City",
        "lat": -6.48,
        "lon": 39.17
    },
    "baku": {
        "name": "Baku",
        "country": "Azerbaijan",
        "type": "Major City",
        "lat": 40.23,
        "lon": 49.52
    },
    "dublin": {
        "name": "Dublin",
        "country": "Ireland",
        "type": "Major City",
        "lat": 53.19,
        "lon": -6.14
    },
    "jakarta": {
        "name": "Jakarta",
        "country": "Indonesia",
        "type": "Major City",
        "lat": -6.1,
        "lon": 106.49
    },
    "kiew": {
        "name": "Kiew",
        "country": "Ukraine",
        "type": "Major City",
        "lat": 50.441,
        "lon": 30.554
    },
    "doha": {
        "name": "Doha",
        "country": "Qatar",
        "type": "Major City",
        "lat": 25.17,
        "lon": 51.32
    },
    "maputo": {
        "name": "Maputo",
        "country": "Mozambique",
        "type": "Major City",
        "lat": -25.57,
        "lon": 32.35
    }
};

if (typeof EUROPE_DATA !== 'undefined') {
    Object.assign(EUROPE_DATA.cities, WORLD_CAPITALS);
}
