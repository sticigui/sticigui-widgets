/**
 * Built-in datasets for SticiGui widgets
 * 
 * Data sourced from original SticiGui applet pages.
 */

/**
 * GRAVITY - 100 measurements of acceleration due to gravity
 * 
 * Measured at Piñon Flat Observatory in 1989 (day 229, between 5:29:52pm and 5:48:08pm).
 * Base g value is 9.792838 meters/s². 
 * These values are deviations from that reference value.
 * 
 * Source: https://www.stat.berkeley.edu/~stark/Java/Html/NormApprox.htm
 * Measurements by Glen Sasagawa and Mark Zumberge.
 */
export const GRAVITY = [
  -0.00000001, 0.00000002, -0.00000074, -0.00000044, -0.00000019,
  -0.00000060, -0.00000106, -0.00000083, -0.00000086, -0.00000079,
  -0.00000024, -0.00000012, 0.00000014, -0.00000074, -0.00000050,
  0.00000041, 0.00000014, 0.00000072, -0.00000015, -0.00000107,
  -0.00000071, -0.00000128, -0.00000035, -0.00000120, 0.00000018,
  -0.00000101, -0.00000019, -0.00000067, 0.00000024, -0.00000027,
  -0.00000106, -0.00000000, -0.00000150, 0.00000000, 0.00000014,
  -0.00000132, -0.00000014, 0.00000018, -0.00000014, 0.00000051,
  -0.00000037, -0.00000034, -0.00000059, -0.00000113, 0.00000029,
  -0.00000083, -0.00000038, -0.00000108, -0.00000061, -0.00000016,
  0.00000045, -0.00000069, -0.00000034, -0.00000004, -0.00000071,
  -0.00000132, -0.00000089, -0.00000055, -0.00000024, 0.00000019,
  -0.00000099, 0.00000155, 0.00000001, -0.00000012, -0.00000067,
  0.00000014, -0.00000112, -0.00000012, -0.00000016, -0.00000060,
  -0.00000043, -0.00000062, -0.00000019, -0.00000080, -0.00000019,
  -0.00000122, -0.00000049, 0.00000029, -0.00000101, -0.00000074,
  0.00000007, -0.00000018, -0.00000105, -0.00000121, -0.00000027,
  -0.00000016, -0.00000048, -0.00000029, -0.00000065, -0.00000048,
  -0.00000080, -0.00000152, -0.00000052, -0.00000026, -0.00000087,
  -0.00000107, -0.00000054, -0.00000054, -0.00000047, -0.00000106
];

/**
 * CITIES - 50 US cities with homeless, unemployment, and vacancy data
 * 
 * Fields:
 * - city: City name and state
 * - homeless_rate: Homeless per 1000 population
 * - homeless_count: Total number of homeless
 * - unemployment_rate: Unemployed per 1000 population
 * - population: Population in thousands
 * - vacancy_rate: Vacancies per 1000 housing units
 */
export const CITIES = [
  {
    "city": "Miami FL",
    "homeless_rate": 15.9,
    "homeless_count": 5950,
    "unemployment_rate": 7.5,
    "population": 372,
    "vacancy_rate": 7
  },
  {
    "city": "St. Louis MO",
    "homeless_rate": 11.6,
    "homeless_count": 5000,
    "unemployment_rate": 8.4,
    "population": 429,
    "vacancy_rate": 8.5
  },
  {
    "city": "San Francisco CA",
    "homeless_rate": 11.5,
    "homeless_count": 8250,
    "unemployment_rate": 6,
    "population": 712,
    "vacancy_rate": 1.6
  },
  {
    "city": "Worcester MA",
    "homeless_rate": 10.6,
    "homeless_count": 1700,
    "unemployment_rate": 3.7,
    "population": 160,
    "vacancy_rate": 3
  },
  {
    "city": "Los Angeles CA",
    "homeless_rate": 10.5,
    "homeless_count": 32600,
    "unemployment_rate": 7.9,
    "population": 3097,
    "vacancy_rate": 2.2
  },
  {
    "city": "Santa Monica CA",
    "homeless_rate": 10.2,
    "homeless_count": 900,
    "unemployment_rate": 7,
    "population": 88,
    "vacancy_rate": 1.8
  },
  {
    "city": "Newark NJ",
    "homeless_rate": 9.5,
    "homeless_count": 3000,
    "unemployment_rate": 5.9,
    "population": 314,
    "vacancy_rate": 2.3
  },
  {
    "city": "Hartford CT",
    "homeless_rate": 8.8,
    "homeless_count": 1200,
    "unemployment_rate": 7.1,
    "population": 136,
    "vacancy_rate": 2.6
  },
  {
    "city": "Washington DC",
    "homeless_rate": 7.5,
    "homeless_count": 4700,
    "unemployment_rate": 8.4,
    "population": 623,
    "vacancy_rate": 2
  },
  {
    "city": "Detroit MI",
    "homeless_rate": 6.8,
    "homeless_count": 7500,
    "unemployment_rate": 9.1,
    "population": 1088,
    "vacancy_rate": 5.4
  },
  {
    "city": "Yonkers NY",
    "homeless_rate": 6.8,
    "homeless_count": 1300,
    "unemployment_rate": 4.9,
    "population": 191,
    "vacancy_rate": 2.1
  },
  {
    "city": "Chicago IL",
    "homeless_rate": 6.6,
    "homeless_count": 19800,
    "unemployment_rate": 8.3,
    "population": 2992,
    "vacancy_rate": 6
  },
  {
    "city": "Seattle WA",
    "homeless_rate": 6.5,
    "homeless_count": 3200,
    "unemployment_rate": 6.6,
    "population": 488,
    "vacancy_rate": 5.5
  },
  {
    "city": "Las Vegas NV",
    "homeless_rate": 6,
    "homeless_count": 1100,
    "unemployment_rate": 8.9,
    "population": 183,
    "vacancy_rate": 9
  },
  {
    "city": "Boston MA",
    "homeless_rate": 5.6,
    "homeless_count": 3200,
    "unemployment_rate": 4.6,
    "population": 571,
    "vacancy_rate": 2.6
  },
  {
    "city": "Richmond VA",
    "homeless_rate": 5.3,
    "homeless_count": 1175,
    "unemployment_rate": 5.3,
    "population": 219,
    "vacancy_rate": 5.5
  },
  {
    "city": "New York NY",
    "homeless_rate": 5,
    "homeless_count": 36000,
    "unemployment_rate": 7.4,
    "population": 7165,
    "vacancy_rate": 2.2
  },
  {
    "city": "Dallas-Fort Worth TX",
    "homeless_rate": 5,
    "homeless_count": 7000,
    "unemployment_rate": 4.7,
    "population": 1388,
    "vacancy_rate": 16
  },
  {
    "city": "Denver CO",
    "homeless_rate": 4.9,
    "homeless_count": 2500,
    "unemployment_rate": 5,
    "population": 504,
    "vacancy_rate": 14
  },
  {
    "city": "Charleston WV",
    "homeless_rate": 4.7,
    "homeless_count": 300,
    "unemployment_rate": 10.7,
    "population": 63,
    "vacancy_rate": 5.9
  },
  {
    "city": "Atlanta GA",
    "homeless_rate": 4.6,
    "homeless_count": 2000,
    "unemployment_rate": 5,
    "population": 426,
    "vacancy_rate": 9
  },
  {
    "city": "Fort Wayne IN",
    "homeless_rate": 4.3,
    "homeless_count": 725,
    "unemployment_rate": 6.3,
    "population": 165,
    "vacancy_rate": 9.2
  },
  {
    "city": "Portland OR",
    "homeless_rate": 4.2,
    "homeless_count": 1550,
    "unemployment_rate": 7.4,
    "population": 366,
    "vacancy_rate": 5.5
  },
  {
    "city": "Houston TX",
    "homeless_rate": 3.7,
    "homeless_count": 6400,
    "unemployment_rate": 8.4,
    "population": 1706,
    "vacancy_rate": 17
  },
  {
    "city": "San Diego CA",
    "homeless_rate": 3.1,
    "homeless_count": 3000,
    "unemployment_rate": 5.3,
    "population": 960,
    "vacancy_rate": 5.3
  },
  {
    "city": "Salt Lake City UT",
    "homeless_rate": 3.1,
    "homeless_count": 525,
    "unemployment_rate": 6.3,
    "population": 165,
    "vacancy_rate": 14.5
  },
  {
    "city": "Little Rock AR",
    "homeless_rate": 2.9,
    "homeless_count": 500,
    "unemployment_rate": 5.8,
    "population": 170,
    "vacancy_rate": 6.5
  },
  {
    "city": "New Orleans LA",
    "homeless_rate": 2.8,
    "homeless_count": 1600,
    "unemployment_rate": 11,
    "population": 559,
    "vacancy_rate": 18
  },
  {
    "city": "Charleston SC",
    "homeless_rate": 2.8,
    "homeless_count": 200,
    "unemployment_rate": 4.4,
    "population": 69,
    "vacancy_rate": 9
  },
  {
    "city": "Albuquerque NM",
    "homeless_rate": 2.8,
    "homeless_count": 1000,
    "unemployment_rate": 6.3,
    "population": 351,
    "vacancy_rate": 9.7
  },
  {
    "city": "Tucson AZ",
    "homeless_rate": 2.7,
    "homeless_count": 1000,
    "unemployment_rate": 5.3,
    "population": 365,
    "vacancy_rate": 12
  },
  {
    "city": "Burlington VT",
    "homeless_rate": 2.7,
    "homeless_count": 100,
    "unemployment_rate": 3.4,
    "population": 37,
    "vacancy_rate": 6
  },
  {
    "city": "Baltimore MD",
    "homeless_rate": 2.4,
    "homeless_count": 1900,
    "unemployment_rate": 7,
    "population": 763,
    "vacancy_rate": 8.6
  },
  {
    "city": "Cincinnati OH",
    "homeless_rate": 2.3,
    "homeless_count": 875,
    "unemployment_rate": 7.2,
    "population": 370,
    "vacancy_rate": 8.5
  },
  {
    "city": "Syracuse NY",
    "homeless_rate": 2.3,
    "homeless_count": 380,
    "unemployment_rate": 6.7,
    "population": 164,
    "vacancy_rate": 9.5
  },
  {
    "city": "Tampa FL",
    "homeless_rate": 2.3,
    "homeless_count": 650,
    "unemployment_rate": 5,
    "population": 275,
    "vacancy_rate": 14.7
  },
  {
    "city": "Pittsburgh PA",
    "homeless_rate": 2.2,
    "homeless_count": 900,
    "unemployment_rate": 9.4,
    "population": 403,
    "vacancy_rate": 5.8
  },
  {
    "city": "Philadelphia PA",
    "homeless_rate": 2.1,
    "homeless_count": 3600,
    "unemployment_rate": 7,
    "population": 1646,
    "vacancy_rate": 4
  },
  {
    "city": "Birmingham AL",
    "homeless_rate": 2,
    "homeless_count": 584,
    "unemployment_rate": 7.2,
    "population": 280,
    "vacancy_rate": 7.1
  },
  {
    "city": "Louisville KY",
    "homeless_rate": 1.9,
    "homeless_count": 575,
    "unemployment_rate": 6.7,
    "population": 290,
    "vacancy_rate": 7.3
  },
  {
    "city": "Grand Rapids MI",
    "homeless_rate": 1.9,
    "homeless_count": 350,
    "unemployment_rate": 8.6,
    "population": 183,
    "vacancy_rate": 7.5
  },
  {
    "city": "Minneapolis-St.Paul MN",
    "homeless_rate": 1.6,
    "homeless_count": 1000,
    "unemployment_rate": 4.5,
    "population": 624,
    "vacancy_rate": 6.1
  },
  {
    "city": "Milwaukee WI",
    "homeless_rate": 1.6,
    "homeless_count": 1000,
    "unemployment_rate": 6.4,
    "population": 621,
    "vacancy_rate": 6
  },
  {
    "city": "Providence RI",
    "homeless_rate": 1.6,
    "homeless_count": 250,
    "unemployment_rate": 4.9,
    "population": 157,
    "vacancy_rate": 5
  },
  {
    "city": "Cleveland OH",
    "homeless_rate": 1.4,
    "homeless_count": 800,
    "unemployment_rate": 12.4,
    "population": 547,
    "vacancy_rate": 6.5
  },
  {
    "city": "Phoenix AZ",
    "homeless_rate": 1.2,
    "homeless_count": 1050,
    "unemployment_rate": 5.1,
    "population": 853,
    "vacancy_rate": 12.2
  },
  {
    "city": "Kansas City MO",
    "homeless_rate": 0.9,
    "homeless_count": 400,
    "unemployment_rate": 4.6,
    "population": 443,
    "vacancy_rate": 7.2
  },
  {
    "city": "Charlotte NC",
    "homeless_rate": 0.8,
    "homeless_count": 275,
    "unemployment_rate": 3.7,
    "population": 331,
    "vacancy_rate": 8.8
  },
  {
    "city": "Lincoln NE",
    "homeless_rate": 0.7,
    "homeless_count": 135,
    "unemployment_rate": 3.6,
    "population": 180,
    "vacancy_rate": 6.5
  },
  {
    "city": "Rochester NY",
    "homeless_rate": 0.6,
    "homeless_count": 150,
    "unemployment_rate": 7,
    "population": 243,
    "vacancy_rate": 9
  }
];

/**
 * CCV - California Clean Vehicle emissions data (96 tests)
 * 
 * Fields:
 * - test: Test number
 * - HC: Hydrocarbons (ppm)
 * - CO: Carbon monoxide (ppm)
 * - NOx: Nitrogen oxides (ppm)
 */
export const CCV = [
  {
    "test": 229,
    "HC": 1069,
    "CO": 10397,
    "NOx": 2348
  },
  {
    "test": 232,
    "HC": 1042,
    "CO": 11697,
    "NOx": 2490
  },
  {
    "test": 233,
    "HC": 1008,
    "CO": 11055,
    "NOx": 2420
  },
  {
    "test": 237,
    "HC": 1025,
    "CO": 11167,
    "NOx": 2332
  },
  {
    "test": 238,
    "HC": 1052,
    "CO": 11246,
    "NOx": 2337
  },
  {
    "test": 239,
    "HC": 1065,
    "CO": 11687,
    "NOx": 2392
  },
  {
    "test": 240,
    "HC": 1018,
    "CO": 10910,
    "NOx": 2352
  },
  {
    "test": 246,
    "HC": 1024,
    "CO": 11211,
    "NOx": 2326
  },
  {
    "test": 247,
    "HC": 1033,
    "CO": 10914,
    "NOx": 2306
  },
  {
    "test": 248,
    "HC": 1001,
    "CO": 10528,
    "NOx": 2306
  },
  {
    "test": 249,
    "HC": 1008,
    "CO": 10656,
    "NOx": 2344
  },
  {
    "test": 254,
    "HC": 1367,
    "CO": 11978,
    "NOx": 2386
  },
  {
    "test": 255,
    "HC": 1402,
    "CO": 11888,
    "NOx": 2399
  },
  {
    "test": 257,
    "HC": 1317,
    "CO": 11565,
    "NOx": 2398
  },
  {
    "test": 258,
    "HC": 1361,
    "CO": 11197,
    "NOx": 2368
  },
  {
    "test": 259,
    "HC": 1380,
    "CO": 11770,
    "NOx": 2333
  },
  {
    "test": 278,
    "HC": 1057,
    "CO": 13262,
    "NOx": 2457
  },
  {
    "test": 279,
    "HC": 1096,
    "CO": 13162,
    "NOx": 2459
  },
  {
    "test": 291,
    "HC": 1079,
    "CO": 13112,
    "NOx": 2396
  },
  {
    "test": 292,
    "HC": 1045,
    "CO": 12772,
    "NOx": 2357
  },
  {
    "test": 293,
    "HC": 1057,
    "CO": 12925,
    "NOx": 2335
  },
  {
    "test": 308,
    "HC": 1023,
    "CO": 12525,
    "NOx": 2397
  },
  {
    "test": 309,
    "HC": 1024,
    "CO": 12374,
    "NOx": 2414
  },
  {
    "test": 313,
    "HC": 1007,
    "CO": 12439,
    "NOx": 2309
  },
  {
    "test": 314,
    "HC": 1064,
    "CO": 12572,
    "NOx": 2305
  },
  {
    "test": 315,
    "HC": 1047,
    "CO": 12247,
    "NOx": 2294
  },
  {
    "test": 349,
    "HC": 953,
    "CO": 11832,
    "NOx": 2359
  },
  {
    "test": 350,
    "HC": 999,
    "CO": 11560,
    "NOx": 2323
  },
  {
    "test": 351,
    "HC": 1017,
    "CO": 11616,
    "NOx": 2319
  },
  {
    "test": 372,
    "HC": 1018,
    "CO": 12775,
    "NOx": 2421
  },
  {
    "test": 376,
    "HC": 1136,
    "CO": 12460,
    "NOx": 2431
  },
  {
    "test": 377,
    "HC": 1100,
    "CO": 11928,
    "NOx": 2403
  },
  {
    "test": 456,
    "HC": 1028,
    "CO": 13723,
    "NOx": 2363
  },
  {
    "test": 457,
    "HC": 1037,
    "CO": 13845,
    "NOx": 2322
  },
  {
    "test": 458,
    "HC": 1011,
    "CO": 13680,
    "NOx": 2365
  },
  {
    "test": 459,
    "HC": 1022,
    "CO": 13723,
    "NOx": 2404
  },
  {
    "test": 461,
    "HC": 1002,
    "CO": 14290,
    "NOx": 2422
  },
  {
    "test": 462,
    "HC": 1011,
    "CO": 13980,
    "NOx": 2351
  },
  {
    "test": 463,
    "HC": 968,
    "CO": 13411,
    "NOx": 2364
  },
  {
    "test": 464,
    "HC": 1018,
    "CO": 13611,
    "NOx": 2376
  },
  {
    "test": 466,
    "HC": 1079,
    "CO": 13964,
    "NOx": 2496
  },
  {
    "test": 467,
    "HC": 1051,
    "CO": 14068,
    "NOx": 2434
  },
  {
    "test": 468,
    "HC": 1026,
    "CO": 13638,
    "NOx": 2441
  },
  {
    "test": 469,
    "HC": 1039,
    "CO": 13703,
    "NOx": 2449
  },
  {
    "test": 483,
    "HC": 1011,
    "CO": 12307,
    "NOx": 2477
  },
  {
    "test": 484,
    "HC": 1060,
    "CO": 12478,
    "NOx": 2446
  },
  {
    "test": 485,
    "HC": 1064,
    "CO": 12448,
    "NOx": 2482
  },
  {
    "test": 486,
    "HC": 1010,
    "CO": 12515,
    "NOx": 2480
  },
  {
    "test": 609,
    "HC": 1010,
    "CO": 13607,
    "NOx": 2618
  },
  {
    "test": 610,
    "HC": 1005,
    "CO": 12563,
    "NOx": 2513
  },
  {
    "test": 654,
    "HC": 943,
    "CO": 12208,
    "NOx": 2334
  },
  {
    "test": 684,
    "HC": 978,
    "CO": 11992,
    "NOx": 2237
  },
  {
    "test": 695,
    "HC": 939,
    "CO": 11929,
    "NOx": 2341
  },
  {
    "test": 700,
    "HC": 995,
    "CO": 11751,
    "NOx": 2303
  },
  {
    "test": 706,
    "HC": 1004,
    "CO": 12891,
    "NOx": 2240
  },
  {
    "test": 768,
    "HC": 1007,
    "CO": 11345,
    "NOx": 2256
  },
  {
    "test": 769,
    "HC": 968,
    "CO": 10957,
    "NOx": 2218
  },
  {
    "test": 791,
    "HC": 1005,
    "CO": 11551,
    "NOx": 2256
  },
  {
    "test": 793,
    "HC": 963,
    "CO": 11017,
    "NOx": 2246
  },
  {
    "test": 802,
    "HC": 954,
    "CO": 11057,
    "NOx": 2271
  },
  {
    "test": 803,
    "HC": 1047,
    "CO": 11042,
    "NOx": 2278
  },
  {
    "test": 815,
    "HC": 1056,
    "CO": 12528,
    "NOx": 2336
  },
  {
    "test": 816,
    "HC": 1103,
    "CO": 12242,
    "NOx": 2381
  },
  {
    "test": 858,
    "HC": 1017,
    "CO": 11636,
    "NOx": 2320
  },
  {
    "test": 862,
    "HC": 1029,
    "CO": 11500,
    "NOx": 2277
  },
  {
    "test": 863,
    "HC": 1042,
    "CO": 11490,
    "NOx": 2262
  },
  {
    "test": 1181,
    "HC": 1057,
    "CO": 11845,
    "NOx": 2637
  },
  {
    "test": 1182,
    "HC": 1059,
    "CO": 11975,
    "NOx": 2390
  },
  {
    "test": 1183,
    "HC": 1056,
    "CO": 12171,
    "NOx": 2412
  },
  {
    "test": 1185,
    "HC": 1103,
    "CO": 11940,
    "NOx": 2480
  },
  {
    "test": 1186,
    "HC": 1103,
    "CO": 11896,
    "NOx": 2473
  },
  {
    "test": 1187,
    "HC": 1102,
    "CO": 11948,
    "NOx": 2499
  },
  {
    "test": 1197,
    "HC": 953,
    "CO": 11610,
    "NOx": 2527
  },
  {
    "test": 1199,
    "HC": 1005,
    "CO": 11567,
    "NOx": 2628
  },
  {
    "test": 1200,
    "HC": 1053,
    "CO": 11750,
    "NOx": 2674
  },
  {
    "test": 1201,
    "HC": 1013,
    "CO": 11749,
    "NOx": 2642
  },
  {
    "test": 1202,
    "HC": 974,
    "CO": 11439,
    "NOx": 2549
  },
  {
    "test": 1203,
    "HC": 964,
    "CO": 11510,
    "NOx": 2549
  },
  {
    "test": 1204,
    "HC": 978,
    "CO": 11790,
    "NOx": 2528
  },
  {
    "test": 1225,
    "HC": 1156,
    "CO": 12862,
    "NOx": 2487
  },
  {
    "test": 1226,
    "HC": 1115,
    "CO": 12822,
    "NOx": 2437
  },
  {
    "test": 1227,
    "HC": 1189,
    "CO": 13664,
    "NOx": 2275
  },
  {
    "test": 1239,
    "HC": 1131,
    "CO": 12570,
    "NOx": 2375
  },
  {
    "test": 1240,
    "HC": 1114,
    "CO": 12443,
    "NOx": 2383
  },
  {
    "test": 1242,
    "HC": 1222,
    "CO": 12671,
    "NOx": 2391
  },
  {
    "test": 1243,
    "HC": 1259,
    "CO": 13101,
    "NOx": 2405
  },
  {
    "test": 1244,
    "HC": 1200,
    "CO": 13206,
    "NOx": 2368
  },
  {
    "test": 1247,
    "HC": 1134,
    "CO": 12890,
    "NOx": 2389
  },
  {
    "test": 2180,
    "HC": 1130,
    "CO": 13523,
    "NOx": 2399
  },
  {
    "test": 2196,
    "HC": 1057,
    "CO": 11947,
    "NOx": 2160
  },
  {
    "test": 2213,
    "HC": 1018,
    "CO": 12250,
    "NOx": 2300
  },
  {
    "test": 2224,
    "HC": 1460,
    "CO": 14049,
    "NOx": 2202
  },
  {
    "test": 2233,
    "HC": 1125,
    "CO": 14306,
    "NOx": 2361
  },
  {
    "test": 2885,
    "HC": 990,
    "CO": 10898,
    "NOx": 2495
  },
  {
    "test": 2886,
    "HC": 1245,
    "CO": 11074,
    "NOx": 2552
  },
  {
    "test": 2929,
    "HC": 1228,
    "CO": 9373,
    "NOx": 2093
  }
];

/**
 * GMAT - 913 MBA students with GPA and GMAT scores
 * 
 * Fields:
 * - school: School identifier (1-3)
 * - mgpa: First year MBA GPA
 * - verbal: Verbal GMAT score
 * - quant: Quantitative GMAT score
 * - ugpa: Undergraduate GPA
 */
export const GMAT = [
  {
    "school": 1,
    "mgpa": 3.155,
    "verbal": 31,
    "quant": 37,
    "ugpa": 3.53
  },
  {
    "school": 1,
    "mgpa": 3.665,
    "verbal": 38,
    "quant": 40,
    "ugpa": 3.38
  },
  {
    "school": 1,
    "mgpa": 3.685,
    "verbal": 35,
    "quant": 36,
    "ugpa": 3.71
  },
  {
    "school": 1,
    "mgpa": 3.305,
    "verbal": 41,
    "quant": 25,
    "ugpa": 3.15
  },
  {
    "school": 1,
    "mgpa": 3.065,
    "verbal": 36,
    "quant": 42,
    "ugpa": 3.54
  },
  {
    "school": 1,
    "mgpa": 3.1,
    "verbal": 43,
    "quant": 43,
    "ugpa": 3.59
  },
  {
    "school": 1,
    "mgpa": 4.13,
    "verbal": 46,
    "quant": 48,
    "ugpa": 4
  },
  {
    "school": 1,
    "mgpa": 3.165,
    "verbal": 42,
    "quant": 37,
    "ugpa": 2.63
  },
  {
    "school": 1,
    "mgpa": 2.605,
    "verbal": 33,
    "quant": 28,
    "ugpa": 3.09
  },
  {
    "school": 1,
    "mgpa": 3.64,
    "verbal": 28,
    "quant": 40,
    "ugpa": 3.39
  },
  {
    "school": 1,
    "mgpa": 2.24,
    "verbal": 35,
    "quant": 28,
    "ugpa": 3.14
  },
  {
    "school": 1,
    "mgpa": 2.92,
    "verbal": 36,
    "quant": 38,
    "ugpa": 3.25
  },
  {
    "school": 1,
    "mgpa": 3.07,
    "verbal": 37,
    "quant": 32,
    "ugpa": 2.09
  },
  {
    "school": 1,
    "mgpa": 2.805,
    "verbal": 41,
    "quant": 38,
    "ugpa": 2.86
  },
  {
    "school": 1,
    "mgpa": 3.4,
    "verbal": 40,
    "quant": 31,
    "ugpa": 3.78
  },
  {
    "school": 1,
    "mgpa": 3.63,
    "verbal": 35,
    "quant": 32,
    "ugpa": 4
  },
  {
    "school": 1,
    "mgpa": 2.5,
    "verbal": 38,
    "quant": 40,
    "ugpa": 3.27
  },
  {
    "school": 1,
    "mgpa": 3.645,
    "verbal": 44,
    "quant": 46,
    "ugpa": 2.87
  },
  {
    "school": 1,
    "mgpa": 3.085,
    "verbal": 44,
    "quant": 36,
    "ugpa": 3.01
  },
  {
    "school": 1,
    "mgpa": 4.13,
    "verbal": 47,
    "quant": 32,
    "ugpa": 2.84
  },
  {
    "school": 1,
    "mgpa": 3.36,
    "verbal": 37,
    "quant": 43,
    "ugpa": 2.41
  },
  {
    "school": 1,
    "mgpa": 2.805,
    "verbal": 38,
    "quant": 33,
    "ugpa": 3.41
  },
  {
    "school": 1,
    "mgpa": 3.53,
    "verbal": 37,
    "quant": 41,
    "ugpa": 3.57
  },
  {
    "school": 1,
    "mgpa": 3.6,
    "verbal": 40,
    "quant": 34,
    "ugpa": 3.16
  },
  {
    "school": 1,
    "mgpa": 3.66,
    "verbal": 28,
    "quant": 44,
    "ugpa": 3.25
  },
  {
    "school": 1,
    "mgpa": 2.4,
    "verbal": 37,
    "quant": 32,
    "ugpa": 3
  },
  {
    "school": 1,
    "mgpa": 2.775,
    "verbal": 40,
    "quant": 37,
    "ugpa": 3.28
  },
  {
    "school": 1,
    "mgpa": 3.075,
    "verbal": 38,
    "quant": 46,
    "ugpa": 3.09
  },
  {
    "school": 1,
    "mgpa": 3.645,
    "verbal": 39,
    "quant": 50,
    "ugpa": 3.63
  },
  {
    "school": 1,
    "mgpa": 3.94,
    "verbal": 39,
    "quant": 41,
    "ugpa": 3.87
  },
  {
    "school": 1,
    "mgpa": 2.55,
    "verbal": 30,
    "quant": 26,
    "ugpa": 3.02
  },
  {
    "school": 1,
    "mgpa": 2.95,
    "verbal": 39,
    "quant": 32,
    "ugpa": 3.52
  },
  {
    "school": 1,
    "mgpa": 3.95,
    "verbal": 40,
    "quant": 34,
    "ugpa": 3.63
  },
  {
    "school": 1,
    "mgpa": 3.565,
    "verbal": 44,
    "quant": 42,
    "ugpa": 3.89
  },
  {
    "school": 1,
    "mgpa": 3.135,
    "verbal": 25,
    "quant": 38,
    "ugpa": 3.57
  },
  {
    "school": 1,
    "mgpa": 3.715,
    "verbal": 35,
    "quant": 32,
    "ugpa": 3.65
  },
  {
    "school": 1,
    "mgpa": 3.635,
    "verbal": 40,
    "quant": 37,
    "ugpa": 3.27
  },
  {
    "school": 1,
    "mgpa": 3.03,
    "verbal": 36,
    "quant": 33,
    "ugpa": 3.05
  },
  {
    "school": 1,
    "mgpa": 3.58,
    "verbal": 27,
    "quant": 37,
    "ugpa": 3.22
  },
  {
    "school": 1,
    "mgpa": 3.125,
    "verbal": 33,
    "quant": 40,
    "ugpa": 2.67
  },
  {
    "school": 1,
    "mgpa": 3,
    "verbal": 34,
    "quant": 38,
    "ugpa": 2.65
  },
  {
    "school": 1,
    "mgpa": 3.885,
    "verbal": 33,
    "quant": 40,
    "ugpa": 3.73
  },
  {
    "school": 1,
    "mgpa": 2.61,
    "verbal": 44,
    "quant": 42,
    "ugpa": 3.5
  },
  {
    "school": 1,
    "mgpa": 2.9,
    "verbal": 32,
    "quant": 30,
    "ugpa": 3.66
  },
  {
    "school": 1,
    "mgpa": 3.105,
    "verbal": 44,
    "quant": 40,
    "ugpa": 3.09
  },
  {
    "school": 1,
    "mgpa": 3.205,
    "verbal": 34,
    "quant": 33,
    "ugpa": 3.29
  },
  {
    "school": 1,
    "mgpa": 3.115,
    "verbal": 39,
    "quant": 42,
    "ugpa": 2.47
  },
  {
    "school": 1,
    "mgpa": 3.135,
    "verbal": 30,
    "quant": 35,
    "ugpa": 3.43
  },
  {
    "school": 1,
    "mgpa": 2.75,
    "verbal": 30,
    "quant": 38,
    "ugpa": 2.49
  },
  {
    "school": 1,
    "mgpa": 3.715,
    "verbal": 32,
    "quant": 38,
    "ugpa": 3.94
  },
  {
    "school": 1,
    "mgpa": 3.08,
    "verbal": 35,
    "quant": 33,
    "ugpa": 3.38
  },
  {
    "school": 1,
    "mgpa": 2.87,
    "verbal": 38,
    "quant": 31,
    "ugpa": 2.78
  },
  {
    "school": 1,
    "mgpa": 2.97,
    "verbal": 29,
    "quant": 31,
    "ugpa": 3.7
  },
  {
    "school": 1,
    "mgpa": 2.935,
    "verbal": 39,
    "quant": 36,
    "ugpa": 3.47
  },
  {
    "school": 1,
    "mgpa": 2.24,
    "verbal": 35,
    "quant": 44,
    "ugpa": 2.22
  },
  {
    "school": 1,
    "mgpa": 3.935,
    "verbal": 42,
    "quant": 42,
    "ugpa": 2.89
  },
  {
    "school": 1,
    "mgpa": 2.695,
    "verbal": 37,
    "quant": 31,
    "ugpa": 3.04
  },
  {
    "school": 1,
    "mgpa": 3.52,
    "verbal": 37,
    "quant": 42,
    "ugpa": 2.42
  },
  {
    "school": 1,
    "mgpa": 2.7,
    "verbal": 36,
    "quant": 40,
    "ugpa": 3.06
  },
  {
    "school": 1,
    "mgpa": 2.595,
    "verbal": 44,
    "quant": 35,
    "ugpa": 2.15
  },
  {
    "school": 1,
    "mgpa": 3.205,
    "verbal": 38,
    "quant": 46,
    "ugpa": 2.68
  },
  {
    "school": 1,
    "mgpa": 3.565,
    "verbal": 33,
    "quant": 36,
    "ugpa": 3.53
  },
  {
    "school": 1,
    "mgpa": 3.385,
    "verbal": 44,
    "quant": 38,
    "ugpa": 3.4
  },
  {
    "school": 1,
    "mgpa": 3.275,
    "verbal": 36,
    "quant": 35,
    "ugpa": 3.09
  },
  {
    "school": 1,
    "mgpa": 2.66,
    "verbal": 32,
    "quant": 36,
    "ugpa": 2.83
  },
  {
    "school": 1,
    "mgpa": 3.335,
    "verbal": 38,
    "quant": 37,
    "ugpa": 3.09
  },
  {
    "school": 1,
    "mgpa": 2.675,
    "verbal": 37,
    "quant": 32,
    "ugpa": 3.12
  },
  {
    "school": 1,
    "mgpa": 3.325,
    "verbal": 38,
    "quant": 33,
    "ugpa": 3.24
  },
  {
    "school": 1,
    "mgpa": 2.57,
    "verbal": 33,
    "quant": 37,
    "ugpa": 3.15
  },
  {
    "school": 1,
    "mgpa": 2.895,
    "verbal": 32,
    "quant": 30,
    "ugpa": 2.99
  },
  {
    "school": 1,
    "mgpa": 3.985,
    "verbal": 33,
    "quant": 40,
    "ugpa": 3.76
  },
  {
    "school": 1,
    "mgpa": 3.235,
    "verbal": 37,
    "quant": 31,
    "ugpa": 3.47
  },
  {
    "school": 1,
    "mgpa": 3.81,
    "verbal": 38,
    "quant": 47,
    "ugpa": 2.88
  },
  {
    "school": 1,
    "mgpa": 3.915,
    "verbal": 35,
    "quant": 39,
    "ugpa": 3.97
  },
  {
    "school": 1,
    "mgpa": 2.615,
    "verbal": 34,
    "quant": 39,
    "ugpa": 3.12
  },
  {
    "school": 1,
    "mgpa": 3.115,
    "verbal": 36,
    "quant": 35,
    "ugpa": 3.39
  },
  {
    "school": 1,
    "mgpa": 2.985,
    "verbal": 45,
    "quant": 43,
    "ugpa": 3.04
  },
  {
    "school": 1,
    "mgpa": 2.835,
    "verbal": 34,
    "quant": 36,
    "ugpa": 2.93
  },
  {
    "school": 1,
    "mgpa": 3.365,
    "verbal": 37,
    "quant": 33,
    "ugpa": 2.97
  },
  {
    "school": 1,
    "mgpa": 2.85,
    "verbal": 39,
    "quant": 32,
    "ugpa": 3.46
  },
  {
    "school": 1,
    "mgpa": 3.805,
    "verbal": 35,
    "quant": 39,
    "ugpa": 3.6
  },
  {
    "school": 1,
    "mgpa": 3,
    "verbal": 32,
    "quant": 34,
    "ugpa": 3.51
  },
  {
    "school": 1,
    "mgpa": 2.675,
    "verbal": 33,
    "quant": 38,
    "ugpa": 3
  },
  {
    "school": 1,
    "mgpa": 2.565,
    "verbal": 30,
    "quant": 33,
    "ugpa": 2.4
  },
  {
    "school": 1,
    "mgpa": 3.75,
    "verbal": 39,
    "quant": 52,
    "ugpa": 2.83
  },
  {
    "school": 1,
    "mgpa": 2.515,
    "verbal": 33,
    "quant": 33,
    "ugpa": 2.82
  },
  {
    "school": 1,
    "mgpa": 2.955,
    "verbal": 36,
    "quant": 43,
    "ugpa": 3.17
  },
  {
    "school": 1,
    "mgpa": 3.095,
    "verbal": 32,
    "quant": 40,
    "ugpa": 3.24
  },
  {
    "school": 1,
    "mgpa": 2.72,
    "verbal": 42,
    "quant": 30,
    "ugpa": 3.55
  },
  {
    "school": 1,
    "mgpa": 3.03,
    "verbal": 33,
    "quant": 39,
    "ugpa": 3.23
  },
  {
    "school": 1,
    "mgpa": 3.05,
    "verbal": 30,
    "quant": 33,
    "ugpa": 3.03
  },
  {
    "school": 1,
    "mgpa": 3.63,
    "verbal": 31,
    "quant": 46,
    "ugpa": 3.25
  },
  {
    "school": 1,
    "mgpa": 3.885,
    "verbal": 29,
    "quant": 37,
    "ugpa": 3.63
  },
  {
    "school": 1,
    "mgpa": 3.6,
    "verbal": 37,
    "quant": 47,
    "ugpa": 3.33
  },
  {
    "school": 1,
    "mgpa": 3.195,
    "verbal": 38,
    "quant": 33,
    "ugpa": 3.59
  },
  {
    "school": 1,
    "mgpa": 2.65,
    "verbal": 34,
    "quant": 32,
    "ugpa": 3.19
  },
  {
    "school": 1,
    "mgpa": 3.81,
    "verbal": 45,
    "quant": 47,
    "ugpa": 3.73
  },
  {
    "school": 1,
    "mgpa": 3.64,
    "verbal": 41,
    "quant": 40,
    "ugpa": 3.68
  },
  {
    "school": 1,
    "mgpa": 3.535,
    "verbal": 49,
    "quant": 41,
    "ugpa": 3.45
  },
  {
    "school": 1,
    "mgpa": 3.685,
    "verbal": 44,
    "quant": 43,
    "ugpa": 3.67
  },
  {
    "school": 1,
    "mgpa": 2.69,
    "verbal": 38,
    "quant": 38,
    "ugpa": 3.28
  },
  {
    "school": 1,
    "mgpa": 3.275,
    "verbal": 39,
    "quant": 34,
    "ugpa": 3.88
  },
  {
    "school": 1,
    "mgpa": 2.585,
    "verbal": 24,
    "quant": 38,
    "ugpa": 3.67
  },
  {
    "school": 1,
    "mgpa": 2.985,
    "verbal": 42,
    "quant": 39,
    "ugpa": 3.5
  },
  {
    "school": 1,
    "mgpa": 2.95,
    "verbal": 42,
    "quant": 26,
    "ugpa": 2.67
  },
  {
    "school": 1,
    "mgpa": 3.89,
    "verbal": 44,
    "quant": 46,
    "ugpa": 2.91
  },
  {
    "school": 1,
    "mgpa": 3.43,
    "verbal": 37,
    "quant": 37,
    "ugpa": 3.32
  },
  {
    "school": 1,
    "mgpa": 2.735,
    "verbal": 33,
    "quant": 35,
    "ugpa": 3.51
  },
  {
    "school": 1,
    "mgpa": 3.44,
    "verbal": 43,
    "quant": 47,
    "ugpa": 3.19
  },
  {
    "school": 1,
    "mgpa": 2.765,
    "verbal": 38,
    "quant": 31,
    "ugpa": 3.03
  },
  {
    "school": 1,
    "mgpa": 3.345,
    "verbal": 32,
    "quant": 31,
    "ugpa": 3.57
  },
  {
    "school": 1,
    "mgpa": 3.155,
    "verbal": 37,
    "quant": 33,
    "ugpa": 3.21
  },
  {
    "school": 1,
    "mgpa": 3,
    "verbal": 34,
    "quant": 40,
    "ugpa": 3.68
  },
  {
    "school": 1,
    "mgpa": 3.05,
    "verbal": 30,
    "quant": 43,
    "ugpa": 3.13
  },
  {
    "school": 1,
    "mgpa": 3,
    "verbal": 32,
    "quant": 34,
    "ugpa": 3.5
  },
  {
    "school": 1,
    "mgpa": 3.145,
    "verbal": 30,
    "quant": 40,
    "ugpa": 3.86
  },
  {
    "school": 1,
    "mgpa": 2.985,
    "verbal": 34,
    "quant": 41,
    "ugpa": 2.9
  },
  {
    "school": 1,
    "mgpa": 2.515,
    "verbal": 38,
    "quant": 30,
    "ugpa": 3.66
  },
  {
    "school": 1,
    "mgpa": 2.5,
    "verbal": 42,
    "quant": 33,
    "ugpa": 3.73
  },
  {
    "school": 1,
    "mgpa": 2.415,
    "verbal": 35,
    "quant": 34,
    "ugpa": 2.97
  },
  {
    "school": 1,
    "mgpa": 2.66,
    "verbal": 40,
    "quant": 41,
    "ugpa": 2.89
  },
  {
    "school": 1,
    "mgpa": 2.7,
    "verbal": 34,
    "quant": 34,
    "ugpa": 3.08
  },
  {
    "school": 1,
    "mgpa": 3,
    "verbal": 38,
    "quant": 34,
    "ugpa": 3.1
  },
  {
    "school": 1,
    "mgpa": 2.775,
    "verbal": 35,
    "quant": 37,
    "ugpa": 2.53
  },
  {
    "school": 1,
    "mgpa": 3.415,
    "verbal": 26,
    "quant": 43,
    "ugpa": 3.56
  },
  {
    "school": 1,
    "mgpa": 3.315,
    "verbal": 38,
    "quant": 36,
    "ugpa": 3.3
  },
  {
    "school": 1,
    "mgpa": 3.935,
    "verbal": 37,
    "quant": 41,
    "ugpa": 3.52
  },
  {
    "school": 1,
    "mgpa": 2.955,
    "verbal": 38,
    "quant": 37,
    "ugpa": 3.37
  },
  {
    "school": 1,
    "mgpa": 2.515,
    "verbal": 31,
    "quant": 39,
    "ugpa": 3.37
  },
  {
    "school": 1,
    "mgpa": 3.16,
    "verbal": 38,
    "quant": 43,
    "ugpa": 3.04
  },
  {
    "school": 1,
    "mgpa": 3.815,
    "verbal": 49,
    "quant": 38,
    "ugpa": 2.53
  },
  {
    "school": 1,
    "mgpa": 3.48,
    "verbal": 27,
    "quant": 36,
    "ugpa": 3.67
  },
  {
    "school": 1,
    "mgpa": 3.385,
    "verbal": 36,
    "quant": 43,
    "ugpa": 2.78
  },
  {
    "school": 1,
    "mgpa": 2.78,
    "verbal": 34,
    "quant": 36,
    "ugpa": 2.85
  },
  {
    "school": 1,
    "mgpa": 3.635,
    "verbal": 36,
    "quant": 40,
    "ugpa": 3.32
  },
  {
    "school": 1,
    "mgpa": 3.26,
    "verbal": 33,
    "quant": 33,
    "ugpa": 3.16
  },
  {
    "school": 1,
    "mgpa": 3.13,
    "verbal": 41,
    "quant": 28,
    "ugpa": 3.88
  },
  {
    "school": 1,
    "mgpa": 3.695,
    "verbal": 39,
    "quant": 50,
    "ugpa": 3.26
  },
  {
    "school": 1,
    "mgpa": 3.345,
    "verbal": 33,
    "quant": 36,
    "ugpa": 3.8
  },
  {
    "school": 1,
    "mgpa": 3.115,
    "verbal": 28,
    "quant": 32,
    "ugpa": 3.44
  },
  {
    "school": 1,
    "mgpa": 2.92,
    "verbal": 37,
    "quant": 40,
    "ugpa": 2.64
  },
  {
    "school": 1,
    "mgpa": 4.5,
    "verbal": 34,
    "quant": 33,
    "ugpa": 3.31
  },
  {
    "school": 1,
    "mgpa": 3.2,
    "verbal": 27,
    "quant": 39,
    "ugpa": 2.87
  },
  {
    "school": 1,
    "mgpa": 3.115,
    "verbal": 35,
    "quant": 27,
    "ugpa": 3.74
  },
  {
    "school": 1,
    "mgpa": 2.775,
    "verbal": 39,
    "quant": 36,
    "ugpa": 2.8
  },
  {
    "school": 1,
    "mgpa": 2.765,
    "verbal": 38,
    "quant": 34,
    "ugpa": 3.2
  },
  {
    "school": 1,
    "mgpa": 2.695,
    "verbal": 30,
    "quant": 32,
    "ugpa": 2.9
  },
  {
    "school": 1,
    "mgpa": 3.315,
    "verbal": 24,
    "quant": 38,
    "ugpa": 3.44
  },
  {
    "school": 1,
    "mgpa": 3.36,
    "verbal": 34,
    "quant": 35,
    "ugpa": 3.45
  },
  {
    "school": 1,
    "mgpa": 3.225,
    "verbal": 33,
    "quant": 27,
    "ugpa": 3.44
  },
  {
    "school": 1,
    "mgpa": 3,
    "verbal": 36,
    "quant": 31,
    "ugpa": 3.11
  },
  {
    "school": 1,
    "mgpa": 3.065,
    "verbal": 44,
    "quant": 28,
    "ugpa": 2.65
  },
  {
    "school": 1,
    "mgpa": 2.935,
    "verbal": 35,
    "quant": 36,
    "ugpa": 3.4
  },
  {
    "school": 1,
    "mgpa": 2.63,
    "verbal": 36,
    "quant": 43,
    "ugpa": 3.33
  },
  {
    "school": 1,
    "mgpa": 2.68,
    "verbal": 42,
    "quant": 43,
    "ugpa": 3.68
  },
  {
    "school": 1,
    "mgpa": 3.29,
    "verbal": 28,
    "quant": 34,
    "ugpa": 3.46
  },
  {
    "school": 1,
    "mgpa": 2.67,
    "verbal": 30,
    "quant": 36,
    "ugpa": 3.21
  },
  {
    "school": 1,
    "mgpa": 3.545,
    "verbal": 40,
    "quant": 26,
    "ugpa": 4
  },
  {
    "school": 1,
    "mgpa": 2.72,
    "verbal": 28,
    "quant": 33,
    "ugpa": 3.42
  },
  {
    "school": 1,
    "mgpa": 2.925,
    "verbal": 39,
    "quant": 45,
    "ugpa": 2.65
  },
  {
    "school": 1,
    "mgpa": 3.36,
    "verbal": 44,
    "quant": 37,
    "ugpa": 3.82
  },
  {
    "school": 1,
    "mgpa": 2.5,
    "verbal": 34,
    "quant": 39,
    "ugpa": 2.71
  },
  {
    "school": 1,
    "mgpa": 2.69,
    "verbal": 33,
    "quant": 38,
    "ugpa": 3.76
  },
  {
    "school": 1,
    "mgpa": 3.335,
    "verbal": 40,
    "quant": 45,
    "ugpa": 3.71
  },
  {
    "school": 1,
    "mgpa": 2.63,
    "verbal": 31,
    "quant": 34,
    "ugpa": 2.9
  },
  {
    "school": 1,
    "mgpa": 2.715,
    "verbal": 46,
    "quant": 28,
    "ugpa": 3.93
  },
  {
    "school": 1,
    "mgpa": 3.88,
    "verbal": 34,
    "quant": 33,
    "ugpa": 2.91
  },
  {
    "school": 1,
    "mgpa": 3.285,
    "verbal": 36,
    "quant": 45,
    "ugpa": 3.2
  },
  {
    "school": 1,
    "mgpa": 3.04,
    "verbal": 35,
    "quant": 48,
    "ugpa": 2.75
  },
  {
    "school": 1,
    "mgpa": 3.065,
    "verbal": 41,
    "quant": 29,
    "ugpa": 3.4
  },
  {
    "school": 1,
    "mgpa": 2.5,
    "verbal": 34,
    "quant": 38,
    "ugpa": 3.38
  },
  {
    "school": 1,
    "mgpa": 2.675,
    "verbal": 31,
    "quant": 33,
    "ugpa": 3.5
  },
  {
    "school": 1,
    "mgpa": 2.71,
    "verbal": 34,
    "quant": 35,
    "ugpa": 3.3
  },
  {
    "school": 1,
    "mgpa": 2.92,
    "verbal": 36,
    "quant": 36,
    "ugpa": 2.94
  },
  {
    "school": 1,
    "mgpa": 2.815,
    "verbal": 35,
    "quant": 42,
    "ugpa": 3.1
  },
  {
    "school": 1,
    "mgpa": 3,
    "verbal": 32,
    "quant": 33,
    "ugpa": 3.43
  },
  {
    "school": 1,
    "mgpa": 3.165,
    "verbal": 32,
    "quant": 37,
    "ugpa": 3.3
  },
  {
    "school": 1,
    "mgpa": 2.93,
    "verbal": 33,
    "quant": 37,
    "ugpa": 2.4
  },
  {
    "school": 1,
    "mgpa": 2.84,
    "verbal": 39,
    "quant": 33,
    "ugpa": 2.94
  },
  {
    "school": 1,
    "mgpa": 2.67,
    "verbal": 41,
    "quant": 36,
    "ugpa": 2.39
  },
  {
    "school": 1,
    "mgpa": 2.69,
    "verbal": 29,
    "quant": 39,
    "ugpa": 3.34
  },
  {
    "school": 1,
    "mgpa": 2.4,
    "verbal": 36,
    "quant": 34,
    "ugpa": 2.86
  },
  {
    "school": 1,
    "mgpa": 3.485,
    "verbal": 29,
    "quant": 41,
    "ugpa": 3.7
  },
  {
    "school": 1,
    "mgpa": 3.265,
    "verbal": 35,
    "quant": 41,
    "ugpa": 3.17
  },
  {
    "school": 1,
    "mgpa": 3.13,
    "verbal": 34,
    "quant": 41,
    "ugpa": 3.04
  },
  {
    "school": 1,
    "mgpa": 2.44,
    "verbal": 39,
    "quant": 41,
    "ugpa": 2.79
  },
  {
    "school": 1,
    "mgpa": 3.915,
    "verbal": 33,
    "quant": 41,
    "ugpa": 2.84
  },
  {
    "school": 1,
    "mgpa": 3.085,
    "verbal": 39,
    "quant": 53,
    "ugpa": 3.77
  },
  {
    "school": 1,
    "mgpa": 3,
    "verbal": 34,
    "quant": 34,
    "ugpa": 2.81
  },
  {
    "school": 1,
    "mgpa": 3.29,
    "verbal": 39,
    "quant": 43,
    "ugpa": 3.12
  },
  {
    "school": 1,
    "mgpa": 2.4,
    "verbal": 35,
    "quant": 35,
    "ugpa": 3.02
  },
  {
    "school": 1,
    "mgpa": 3.065,
    "verbal": 34,
    "quant": 44,
    "ugpa": 2.9
  },
  {
    "school": 1,
    "mgpa": 3.705,
    "verbal": 36,
    "quant": 38,
    "ugpa": 3.61
  },
  {
    "school": 1,
    "mgpa": 0.775,
    "verbal": 19,
    "quant": 29,
    "ugpa": 3.28
  },
  {
    "school": 1,
    "mgpa": 3.24,
    "verbal": 39,
    "quant": 33,
    "ugpa": 3.32
  },
  {
    "school": 1,
    "mgpa": 2.87,
    "verbal": 38,
    "quant": 35,
    "ugpa": 3.04
  },
  {
    "school": 1,
    "mgpa": 3.225,
    "verbal": 35,
    "quant": 41,
    "ugpa": 3.14
  },
  {
    "school": 1,
    "mgpa": 3.26,
    "verbal": 41,
    "quant": 40,
    "ugpa": 3.72
  },
  {
    "school": 1,
    "mgpa": 4.065,
    "verbal": 39,
    "quant": 43,
    "ugpa": 3.84
  },
  {
    "school": 1,
    "mgpa": 2.9,
    "verbal": 39,
    "quant": 47,
    "ugpa": 3.19
  },
  {
    "school": 1,
    "mgpa": 1.8,
    "verbal": 30,
    "quant": 32,
    "ugpa": 3.62
  },
  {
    "school": 1,
    "mgpa": 2.365,
    "verbal": 33,
    "quant": 31,
    "ugpa": 3.18
  },
  {
    "school": 1,
    "mgpa": 3.08,
    "verbal": 37,
    "quant": 27,
    "ugpa": 3.35
  },
  {
    "school": 1,
    "mgpa": 3.145,
    "verbal": 38,
    "quant": 32,
    "ugpa": 3.36
  },
  {
    "school": 1,
    "mgpa": 3.58,
    "verbal": 33,
    "quant": 43,
    "ugpa": 3.42
  },
  {
    "school": 1,
    "mgpa": 2.935,
    "verbal": 26,
    "quant": 36,
    "ugpa": 2.98
  },
  {
    "school": 1,
    "mgpa": 2.845,
    "verbal": 45,
    "quant": 45,
    "ugpa": 3.44
  },
  {
    "school": 1,
    "mgpa": 2.485,
    "verbal": 28,
    "quant": 38,
    "ugpa": 2.96
  },
  {
    "school": 1,
    "mgpa": 2.75,
    "verbal": 34,
    "quant": 32,
    "ugpa": 3.33
  },
  {
    "school": 1,
    "mgpa": 4.065,
    "verbal": 38,
    "quant": 51,
    "ugpa": 3.89
  },
  {
    "school": 1,
    "mgpa": 3.21,
    "verbal": 32,
    "quant": 31,
    "ugpa": 3.43
  },
  {
    "school": 1,
    "mgpa": 2.67,
    "verbal": 44,
    "quant": 40,
    "ugpa": 2.77
  },
  {
    "school": 1,
    "mgpa": 3.065,
    "verbal": 37,
    "quant": 41,
    "ugpa": 3.26
  },
  {
    "school": 1,
    "mgpa": 2.9,
    "verbal": 35,
    "quant": 33,
    "ugpa": 3.58
  },
  {
    "school": 1,
    "mgpa": 3.385,
    "verbal": 32,
    "quant": 41,
    "ugpa": 3.28
  },
  {
    "school": 1,
    "mgpa": 3.5,
    "verbal": 34,
    "quant": 41,
    "ugpa": 3.63
  },
  {
    "school": 1,
    "mgpa": 3.455,
    "verbal": 35,
    "quant": 39,
    "ugpa": 3.29
  },
  {
    "school": 1,
    "mgpa": 3.095,
    "verbal": 44,
    "quant": 44,
    "ugpa": 2.85
  },
  {
    "school": 1,
    "mgpa": 3.485,
    "verbal": 30,
    "quant": 32,
    "ugpa": 3.66
  },
  {
    "school": 1,
    "mgpa": 2.515,
    "verbal": 34,
    "quant": 32,
    "ugpa": 2.64
  },
  {
    "school": 1,
    "mgpa": 2.835,
    "verbal": 32,
    "quant": 32,
    "ugpa": 3.59
  },
  {
    "school": 1,
    "mgpa": 2.85,
    "verbal": 31,
    "quant": 41,
    "ugpa": 2.91
  },
  {
    "school": 1,
    "mgpa": 2.405,
    "verbal": 43,
    "quant": 40,
    "ugpa": 3.41
  },
  {
    "school": 1,
    "mgpa": 3.615,
    "verbal": 40,
    "quant": 46,
    "ugpa": 3.38
  },
  {
    "school": 1,
    "mgpa": 3,
    "verbal": 39,
    "quant": 37,
    "ugpa": 3.42
  },
  {
    "school": 1,
    "mgpa": 2.985,
    "verbal": 43,
    "quant": 32,
    "ugpa": 3.7
  },
  {
    "school": 1,
    "mgpa": 3.515,
    "verbal": 44,
    "quant": 36,
    "ugpa": 3.04
  },
  {
    "school": 1,
    "mgpa": 3.14,
    "verbal": 32,
    "quant": 31,
    "ugpa": 3.39
  },
  {
    "school": 1,
    "mgpa": 2.815,
    "verbal": 38,
    "quant": 34,
    "ugpa": 3.16
  },
  {
    "school": 1,
    "mgpa": 3.43,
    "verbal": 33,
    "quant": 37,
    "ugpa": 3.58
  },
  {
    "school": 1,
    "mgpa": 3.305,
    "verbal": 30,
    "quant": 34,
    "ugpa": 3.67
  },
  {
    "school": 1,
    "mgpa": 3.035,
    "verbal": 30,
    "quant": 36,
    "ugpa": 3.59
  },
  {
    "school": 1,
    "mgpa": 2.795,
    "verbal": 43,
    "quant": 24,
    "ugpa": 3.31
  },
  {
    "school": 1,
    "mgpa": 3.655,
    "verbal": 29,
    "quant": 37,
    "ugpa": 3.77
  },
  {
    "school": 1,
    "mgpa": 3,
    "verbal": 37,
    "quant": 30,
    "ugpa": 3.48
  },
  {
    "school": 1,
    "mgpa": 2.55,
    "verbal": 39,
    "quant": 39,
    "ugpa": 3.14
  },
  {
    "school": 1,
    "mgpa": 2.765,
    "verbal": 34,
    "quant": 36,
    "ugpa": 3.58
  },
  {
    "school": 1,
    "mgpa": 2.435,
    "verbal": 36,
    "quant": 39,
    "ugpa": 3.4
  },
  {
    "school": 1,
    "mgpa": 3.15,
    "verbal": 32,
    "quant": 41,
    "ugpa": 2.88
  },
  {
    "school": 1,
    "mgpa": 3.285,
    "verbal": 34,
    "quant": 38,
    "ugpa": 3.61
  },
  {
    "school": 1,
    "mgpa": 2.935,
    "verbal": 34,
    "quant": 38,
    "ugpa": 2.77
  },
  {
    "school": 1,
    "mgpa": 3.565,
    "verbal": 33,
    "quant": 32,
    "ugpa": 3.74
  },
  {
    "school": 1,
    "mgpa": 3.16,
    "verbal": 34,
    "quant": 35,
    "ugpa": 3.15
  },
  {
    "school": 1,
    "mgpa": 2.8,
    "verbal": 35,
    "quant": 35,
    "ugpa": 3.43
  },
  {
    "school": 1,
    "mgpa": 3.315,
    "verbal": 36,
    "quant": 38,
    "ugpa": 3.08
  },
  {
    "school": 1,
    "mgpa": 3.485,
    "verbal": 40,
    "quant": 45,
    "ugpa": 3.39
  },
  {
    "school": 1,
    "mgpa": 3.305,
    "verbal": 35,
    "quant": 37,
    "ugpa": 2.83
  },
  {
    "school": 1,
    "mgpa": 3.465,
    "verbal": 39,
    "quant": 38,
    "ugpa": 3.44
  },
  {
    "school": 1,
    "mgpa": 3.985,
    "verbal": 43,
    "quant": 46,
    "ugpa": 3.38
  },
  {
    "school": 1,
    "mgpa": 3.45,
    "verbal": 33,
    "quant": 36,
    "ugpa": 3.5
  },
  {
    "school": 1,
    "mgpa": 3,
    "verbal": 35,
    "quant": 33,
    "ugpa": 3.09
  },
  {
    "school": 1,
    "mgpa": 2.855,
    "verbal": 35,
    "quant": 44,
    "ugpa": 2.99
  },
  {
    "school": 1,
    "mgpa": 2.945,
    "verbal": 39,
    "quant": 36,
    "ugpa": 3.32
  },
  {
    "school": 1,
    "mgpa": 3.195,
    "verbal": 29,
    "quant": 35,
    "ugpa": 3.79
  },
  {
    "school": 1,
    "mgpa": 3,
    "verbal": 35,
    "quant": 43,
    "ugpa": 3.87
  },
  {
    "school": 1,
    "mgpa": 3.47,
    "verbal": 28,
    "quant": 42,
    "ugpa": 3.34
  },
  {
    "school": 1,
    "mgpa": 3.76,
    "verbal": 32,
    "quant": 34,
    "ugpa": 3.05
  },
  {
    "school": 1,
    "mgpa": 2.745,
    "verbal": 35,
    "quant": 34,
    "ugpa": 3.63
  },
  {
    "school": 1,
    "mgpa": 2.985,
    "verbal": 30,
    "quant": 38,
    "ugpa": 3.14
  },
  {
    "school": 1,
    "mgpa": 3.635,
    "verbal": 38,
    "quant": 42,
    "ugpa": 3.1
  },
  {
    "school": 1,
    "mgpa": 3.015,
    "verbal": 33,
    "quant": 36,
    "ugpa": 3.71
  },
  {
    "school": 1,
    "mgpa": 3.065,
    "verbal": 39,
    "quant": 46,
    "ugpa": 2.97
  },
  {
    "school": 1,
    "mgpa": 2.485,
    "verbal": 37,
    "quant": 27,
    "ugpa": 3.21
  },
  {
    "school": 1,
    "mgpa": 2.555,
    "verbal": 25,
    "quant": 38,
    "ugpa": 3.4
  },
  {
    "school": 1,
    "mgpa": 3.515,
    "verbal": 37,
    "quant": 38,
    "ugpa": 3.79
  },
  {
    "school": 1,
    "mgpa": 3.165,
    "verbal": 36,
    "quant": 30,
    "ugpa": 3.12
  },
  {
    "school": 1,
    "mgpa": 2.64,
    "verbal": 32,
    "quant": 30,
    "ugpa": 3.14
  },
  {
    "school": 1,
    "mgpa": 2.6,
    "verbal": 27,
    "quant": 34,
    "ugpa": 3.15
  },
  {
    "school": 1,
    "mgpa": 2.735,
    "verbal": 35,
    "quant": 32,
    "ugpa": 3.11
  },
  {
    "school": 1,
    "mgpa": 3.195,
    "verbal": 43,
    "quant": 42,
    "ugpa": 3.24
  },
  {
    "school": 1,
    "mgpa": 3.765,
    "verbal": 40,
    "quant": 34,
    "ugpa": 3.53
  },
  {
    "school": 1,
    "mgpa": 3.295,
    "verbal": 32,
    "quant": 41,
    "ugpa": 3.05
  },
  {
    "school": 1,
    "mgpa": 2.92,
    "verbal": 35,
    "quant": 37,
    "ugpa": 3.18
  },
  {
    "school": 1,
    "mgpa": 3.5,
    "verbal": 38,
    "quant": 43,
    "ugpa": 3.41
  },
  {
    "school": 1,
    "mgpa": 3.64,
    "verbal": 31,
    "quant": 44,
    "ugpa": 3.54
  },
  {
    "school": 1,
    "mgpa": 2.95,
    "verbal": 37,
    "quant": 41,
    "ugpa": 3.08
  },
  {
    "school": 1,
    "mgpa": 2.8,
    "verbal": 30,
    "quant": 39,
    "ugpa": 2.88
  },
  {
    "school": 1,
    "mgpa": 3.42,
    "verbal": 37,
    "quant": 46,
    "ugpa": 3.42
  },
  {
    "school": 1,
    "mgpa": 3.015,
    "verbal": 37,
    "quant": 31,
    "ugpa": 3.28
  },
  {
    "school": 1,
    "mgpa": 3.125,
    "verbal": 32,
    "quant": 37,
    "ugpa": 3.55
  },
  {
    "school": 1,
    "mgpa": 3.5,
    "verbal": 37,
    "quant": 27,
    "ugpa": 3.67
  },
  {
    "school": 1,
    "mgpa": 2.63,
    "verbal": 46,
    "quant": 37,
    "ugpa": 2.89
  },
  {
    "school": 1,
    "mgpa": 3.26,
    "verbal": 48,
    "quant": 33,
    "ugpa": 3.42
  },
  {
    "school": 1,
    "mgpa": 2.41,
    "verbal": 38,
    "quant": 28,
    "ugpa": 3.27
  },
  {
    "school": 1,
    "mgpa": 3.485,
    "verbal": 40,
    "quant": 47,
    "ugpa": 3.54
  },
  {
    "school": 1,
    "mgpa": 3.265,
    "verbal": 41,
    "quant": 37,
    "ugpa": 2.91
  },
  {
    "school": 1,
    "mgpa": 2.565,
    "verbal": 38,
    "quant": 40,
    "ugpa": 2.72
  },
  {
    "school": 1,
    "mgpa": 2.985,
    "verbal": 33,
    "quant": 36,
    "ugpa": 3.33
  },
  {
    "school": 1,
    "mgpa": 2.645,
    "verbal": 38,
    "quant": 46,
    "ugpa": 3.28
  },
  {
    "school": 1,
    "mgpa": 2.515,
    "verbal": 37,
    "quant": 46,
    "ugpa": 3
  },
  {
    "school": 1,
    "mgpa": 2.835,
    "verbal": 28,
    "quant": 32,
    "ugpa": 3.23
  },
  {
    "school": 1,
    "mgpa": 2.895,
    "verbal": 38,
    "quant": 33,
    "ugpa": 3.75
  },
  {
    "school": 1,
    "mgpa": 3.465,
    "verbal": 34,
    "quant": 34,
    "ugpa": 3.55
  },
  {
    "school": 1,
    "mgpa": 3.45,
    "verbal": 27,
    "quant": 46,
    "ugpa": 3.16
  },
  {
    "school": 1,
    "mgpa": 2.9,
    "verbal": 34,
    "quant": 38,
    "ugpa": 2.52
  },
  {
    "school": 1,
    "mgpa": 3.305,
    "verbal": 38,
    "quant": 35,
    "ugpa": 3.29
  },
  {
    "school": 1,
    "mgpa": 2.855,
    "verbal": 37,
    "quant": 32,
    "ugpa": 3.1
  },
  {
    "school": 1,
    "mgpa": 2.735,
    "verbal": 39,
    "quant": 38,
    "ugpa": 2.48
  },
  {
    "school": 1,
    "mgpa": 3.26,
    "verbal": 45,
    "quant": 45,
    "ugpa": 2.87
  },
  {
    "school": 1,
    "mgpa": 2.585,
    "verbal": 38,
    "quant": 40,
    "ugpa": 2.62
  },
  {
    "school": 1,
    "mgpa": 3.545,
    "verbal": 35,
    "quant": 41,
    "ugpa": 3.44
  },
  {
    "school": 1,
    "mgpa": 2.78,
    "verbal": 41,
    "quant": 25,
    "ugpa": 3.56
  },
  {
    "school": 1,
    "mgpa": 2.97,
    "verbal": 36,
    "quant": 36,
    "ugpa": 3.12
  },
  {
    "school": 1,
    "mgpa": 3.405,
    "verbal": 34,
    "quant": 40,
    "ugpa": 2.95
  },
  {
    "school": 1,
    "mgpa": 3.415,
    "verbal": 25,
    "quant": 35,
    "ugpa": 3.14
  },
  {
    "school": 1,
    "mgpa": 2.55,
    "verbal": 32,
    "quant": 27,
    "ugpa": 3.57
  },
  {
    "school": 1,
    "mgpa": 3.24,
    "verbal": 37,
    "quant": 30,
    "ugpa": 3.52
  },
  {
    "school": 1,
    "mgpa": 3.185,
    "verbal": 43,
    "quant": 32,
    "ugpa": 2.97
  },
  {
    "school": 1,
    "mgpa": 2.775,
    "verbal": 32,
    "quant": 42,
    "ugpa": 2.83
  },
  {
    "school": 1,
    "mgpa": 3,
    "verbal": 32,
    "quant": 26,
    "ugpa": 3.58
  },
  {
    "school": 1,
    "mgpa": 2.835,
    "verbal": 32,
    "quant": 31,
    "ugpa": 2.78
  },
  {
    "school": 1,
    "mgpa": 2.81,
    "verbal": 31,
    "quant": 35,
    "ugpa": 2.9
  },
  {
    "school": 1,
    "mgpa": 2.765,
    "verbal": 32,
    "quant": 35,
    "ugpa": 2.57
  },
  {
    "school": 1,
    "mgpa": 3.785,
    "verbal": 33,
    "quant": 40,
    "ugpa": 3.5
  },
  {
    "school": 1,
    "mgpa": 2.97,
    "verbal": 37,
    "quant": 34,
    "ugpa": 2.37
  },
  {
    "school": 1,
    "mgpa": 3.15,
    "verbal": 37,
    "quant": 39,
    "ugpa": 2.99
  },
  {
    "school": 1,
    "mgpa": 2.88,
    "verbal": 36,
    "quant": 38,
    "ugpa": 3.66
  },
  {
    "school": 1,
    "mgpa": 3.805,
    "verbal": 32,
    "quant": 38,
    "ugpa": 3.59
  },
  {
    "school": 1,
    "mgpa": 2.965,
    "verbal": 29,
    "quant": 35,
    "ugpa": 3.26
  },
  {
    "school": 1,
    "mgpa": 2.435,
    "verbal": 31,
    "quant": 22,
    "ugpa": 3.19
  },
  {
    "school": 1,
    "mgpa": 2.965,
    "verbal": 39,
    "quant": 31,
    "ugpa": 3.18
  },
  {
    "school": 1,
    "mgpa": 3.375,
    "verbal": 41,
    "quant": 31,
    "ugpa": 3.73
  },
  {
    "school": 1,
    "mgpa": 2.95,
    "verbal": 29,
    "quant": 32,
    "ugpa": 3.63
  },
  {
    "school": 1,
    "mgpa": 2.55,
    "verbal": 38,
    "quant": 27,
    "ugpa": 3.22
  },
  {
    "school": 1,
    "mgpa": 3.015,
    "verbal": 24,
    "quant": 41,
    "ugpa": 3.44
  },
  {
    "school": 1,
    "mgpa": 3.355,
    "verbal": 33,
    "quant": 42,
    "ugpa": 3.3
  },
  {
    "school": 1,
    "mgpa": 2.635,
    "verbal": 36,
    "quant": 35,
    "ugpa": 3.18
  },
  {
    "school": 1,
    "mgpa": 3.165,
    "verbal": 38,
    "quant": 46,
    "ugpa": 2.75
  },
  {
    "school": 1,
    "mgpa": 2.9,
    "verbal": 33,
    "quant": 29,
    "ugpa": 2.49
  },
  {
    "school": 1,
    "mgpa": 3.535,
    "verbal": 33,
    "quant": 29,
    "ugpa": 3.6
  },
  {
    "school": 1,
    "mgpa": 3.45,
    "verbal": 34,
    "quant": 36,
    "ugpa": 3.81
  },
  {
    "school": 1,
    "mgpa": 2.915,
    "verbal": 36,
    "quant": 30,
    "ugpa": 3.22
  },
  {
    "school": 1,
    "mgpa": 2.92,
    "verbal": 39,
    "quant": 42,
    "ugpa": 3.37
  },
  {
    "school": 1,
    "mgpa": 2.925,
    "verbal": 39,
    "quant": 42,
    "ugpa": 3.51
  },
  {
    "school": 1,
    "mgpa": 3.535,
    "verbal": 36,
    "quant": 32,
    "ugpa": 3.94
  },
  {
    "school": 1,
    "mgpa": 3.365,
    "verbal": 30,
    "quant": 37,
    "ugpa": 3.47
  },
  {
    "school": 1,
    "mgpa": 4.275,
    "verbal": 39,
    "quant": 40,
    "ugpa": 4
  },
  {
    "school": 1,
    "mgpa": 2.865,
    "verbal": 34,
    "quant": 41,
    "ugpa": 3.31
  },
  {
    "school": 1,
    "mgpa": 3.8,
    "verbal": 41,
    "quant": 39,
    "ugpa": 3.97
  },
  {
    "school": 1,
    "mgpa": 2.435,
    "verbal": 32,
    "quant": 37,
    "ugpa": 3.21
  },
  {
    "school": 1,
    "mgpa": 3.09,
    "verbal": 35,
    "quant": 32,
    "ugpa": 2.9
  },
  {
    "school": 1,
    "mgpa": 3.565,
    "verbal": 35,
    "quant": 37,
    "ugpa": 3
  },
  {
    "school": 1,
    "mgpa": 3.25,
    "verbal": 34,
    "quant": 40,
    "ugpa": 3.03
  },
  {
    "school": 1,
    "mgpa": 3.57,
    "verbal": 32,
    "quant": 45,
    "ugpa": 3.03
  },
  {
    "school": 1,
    "mgpa": 3.485,
    "verbal": 39,
    "quant": 38,
    "ugpa": 3.92
  },
  {
    "school": 1,
    "mgpa": 3.155,
    "verbal": 29,
    "quant": 34,
    "ugpa": 3.33
  },
  {
    "school": 1,
    "mgpa": 2.885,
    "verbal": 46,
    "quant": 30,
    "ugpa": 3.34
  },
  {
    "school": 1,
    "mgpa": 2.615,
    "verbal": 36,
    "quant": 37,
    "ugpa": 2.71
  },
  {
    "school": 1,
    "mgpa": 3,
    "verbal": 33,
    "quant": 33,
    "ugpa": 2.89
  },
  {
    "school": 2,
    "mgpa": 2,
    "verbal": 32,
    "quant": 35,
    "ugpa": 3.2
  },
  {
    "school": 2,
    "mgpa": 3.63,
    "verbal": 43,
    "quant": 42,
    "ugpa": 3.8
  },
  {
    "school": 2,
    "mgpa": 3.63,
    "verbal": 36,
    "quant": 32,
    "ugpa": 3.5
  },
  {
    "school": 2,
    "mgpa": 2.66,
    "verbal": 34,
    "quant": 22,
    "ugpa": 3.6
  },
  {
    "school": 2,
    "mgpa": 2.2,
    "verbal": 33,
    "quant": 27,
    "ugpa": 2.9
  },
  {
    "school": 2,
    "mgpa": 2,
    "verbal": 39,
    "quant": 38,
    "ugpa": 2.8
  },
  {
    "school": 2,
    "mgpa": 3.9,
    "verbal": 43,
    "quant": 46,
    "ugpa": 3.2
  },
  {
    "school": 2,
    "mgpa": 1.86,
    "verbal": 38,
    "quant": 30,
    "ugpa": 3.2
  },
  {
    "school": 2,
    "mgpa": 2.63,
    "verbal": 18,
    "quant": 45,
    "ugpa": 2.8
  },
  {
    "school": 2,
    "mgpa": 3,
    "verbal": 39,
    "quant": 24,
    "ugpa": 2.2
  },
  {
    "school": 2,
    "mgpa": 2.9,
    "verbal": 38,
    "quant": 28,
    "ugpa": 3.5
  },
  {
    "school": 2,
    "mgpa": 2.5,
    "verbal": 35,
    "quant": 28,
    "ugpa": 3
  },
  {
    "school": 2,
    "mgpa": 2.7,
    "verbal": 19,
    "quant": 25,
    "ugpa": 3
  },
  {
    "school": 2,
    "mgpa": 1.4,
    "verbal": 34,
    "quant": 27,
    "ugpa": 3.5
  },
  {
    "school": 2,
    "mgpa": 3.2,
    "verbal": 31,
    "quant": 32,
    "ugpa": 3.2
  },
  {
    "school": 2,
    "mgpa": 3.4,
    "verbal": 43,
    "quant": 25,
    "ugpa": 3.4
  },
  {
    "school": 2,
    "mgpa": 3.33,
    "verbal": 37,
    "quant": 39,
    "ugpa": 3.2
  },
  {
    "school": 2,
    "mgpa": 3.7,
    "verbal": 28,
    "quant": 24,
    "ugpa": 3.4
  },
  {
    "school": 2,
    "mgpa": 3.6,
    "verbal": 41,
    "quant": 46,
    "ugpa": 3.9
  },
  {
    "school": 2,
    "mgpa": 2.6,
    "verbal": 27,
    "quant": 25,
    "ugpa": 3
  },
  {
    "school": 2,
    "mgpa": 3,
    "verbal": 47,
    "quant": 49,
    "ugpa": 3.3
  },
  {
    "school": 2,
    "mgpa": 1.75,
    "verbal": 20,
    "quant": 21,
    "ugpa": 3.5
  },
  {
    "school": 2,
    "mgpa": 3.25,
    "verbal": 30,
    "quant": 22,
    "ugpa": 2.2
  },
  {
    "school": 2,
    "mgpa": 3.3,
    "verbal": 34,
    "quant": 42,
    "ugpa": 3.1
  },
  {
    "school": 2,
    "mgpa": 3.4,
    "verbal": 41,
    "quant": 36,
    "ugpa": 3.1
  },
  {
    "school": 2,
    "mgpa": 2.4,
    "verbal": 37,
    "quant": 22,
    "ugpa": 2.2
  },
  {
    "school": 2,
    "mgpa": 2.3,
    "verbal": 39,
    "quant": 45,
    "ugpa": 3.3
  },
  {
    "school": 2,
    "mgpa": 3.3,
    "verbal": 36,
    "quant": 47,
    "ugpa": 2.5
  },
  {
    "school": 2,
    "mgpa": 2.3,
    "verbal": 35,
    "quant": 24,
    "ugpa": 3
  },
  {
    "school": 2,
    "mgpa": 0.8,
    "verbal": 38,
    "quant": 27,
    "ugpa": 2.8
  },
  {
    "school": 2,
    "mgpa": 1.25,
    "verbal": 36,
    "quant": 12,
    "ugpa": 3
  },
  {
    "school": 2,
    "mgpa": 2,
    "verbal": 30,
    "quant": 14,
    "ugpa": 3
  },
  {
    "school": 2,
    "mgpa": 2.1,
    "verbal": 28,
    "quant": 35,
    "ugpa": 3.1
  },
  {
    "school": 2,
    "mgpa": 2.9,
    "verbal": 36,
    "quant": 35,
    "ugpa": 3.3
  },
  {
    "school": 2,
    "mgpa": 2.5,
    "verbal": 34,
    "quant": 26,
    "ugpa": 3.2
  },
  {
    "school": 2,
    "mgpa": 2.1,
    "verbal": 33,
    "quant": 36,
    "ugpa": 3.6
  },
  {
    "school": 2,
    "mgpa": 1.66,
    "verbal": 30,
    "quant": 19,
    "ugpa": 3.1
  },
  {
    "school": 2,
    "mgpa": 3,
    "verbal": 43,
    "quant": 38,
    "ugpa": 3.2
  },
  {
    "school": 2,
    "mgpa": 3.78,
    "verbal": 44,
    "quant": 45,
    "ugpa": 2.8
  },
  {
    "school": 2,
    "mgpa": 3,
    "verbal": 29,
    "quant": 39,
    "ugpa": 2.8
  },
  {
    "school": 2,
    "mgpa": 2.9,
    "verbal": 33,
    "quant": 25,
    "ugpa": 3.3
  },
  {
    "school": 2,
    "mgpa": 2.4,
    "verbal": 40,
    "quant": 32,
    "ugpa": 2.3
  },
  {
    "school": 2,
    "mgpa": 2.75,
    "verbal": 31,
    "quant": 22,
    "ugpa": 3.6
  },
  {
    "school": 2,
    "mgpa": 2.4,
    "verbal": 22,
    "quant": 28,
    "ugpa": 3
  },
  {
    "school": 2,
    "mgpa": 3,
    "verbal": 38,
    "quant": 28,
    "ugpa": 3.1
  },
  {
    "school": 2,
    "mgpa": 3.9,
    "verbal": 42,
    "quant": 31,
    "ugpa": 3.3
  },
  {
    "school": 2,
    "mgpa": 1.88,
    "verbal": 37,
    "quant": 32,
    "ugpa": 3.2
  },
  {
    "school": 2,
    "mgpa": 3.2,
    "verbal": 39,
    "quant": 38,
    "ugpa": 3.5
  },
  {
    "school": 2,
    "mgpa": 3,
    "verbal": 45,
    "quant": 42,
    "ugpa": 3.3
  },
  {
    "school": 2,
    "mgpa": 2.63,
    "verbal": 43,
    "quant": 32,
    "ugpa": 3.4
  },
  {
    "school": 2,
    "mgpa": 3.3,
    "verbal": 33,
    "quant": 43,
    "ugpa": 3.2
  },
  {
    "school": 2,
    "mgpa": 2.1,
    "verbal": 40,
    "quant": 31,
    "ugpa": 3.2
  },
  {
    "school": 2,
    "mgpa": 2.5,
    "verbal": 34,
    "quant": 30,
    "ugpa": 2.9
  },
  {
    "school": 2,
    "mgpa": 2,
    "verbal": 38,
    "quant": 36,
    "ugpa": 2.6
  },
  {
    "school": 2,
    "mgpa": 3.1,
    "verbal": 26,
    "quant": 32,
    "ugpa": 3.5
  },
  {
    "school": 2,
    "mgpa": 3,
    "verbal": 40,
    "quant": 30,
    "ugpa": 3.4
  },
  {
    "school": 2,
    "mgpa": 2.2,
    "verbal": 37,
    "quant": 27,
    "ugpa": 3.1
  },
  {
    "school": 2,
    "mgpa": 3,
    "verbal": 39,
    "quant": 38,
    "ugpa": 3
  },
  {
    "school": 2,
    "mgpa": 3.3,
    "verbal": 41,
    "quant": 35,
    "ugpa": 3.2
  },
  {
    "school": 2,
    "mgpa": 2.33,
    "verbal": 44,
    "quant": 32,
    "ugpa": 3.1
  },
  {
    "school": 2,
    "mgpa": 2.7,
    "verbal": 26,
    "quant": 23,
    "ugpa": 3.1
  },
  {
    "school": 2,
    "mgpa": 2.75,
    "verbal": 29,
    "quant": 39,
    "ugpa": 3.7
  },
  {
    "school": 2,
    "mgpa": 1.89,
    "verbal": 17,
    "quant": 25,
    "ugpa": 2.8
  },
  {
    "school": 2,
    "mgpa": 3.1,
    "verbal": 43,
    "quant": 30,
    "ugpa": 3.2
  },
  {
    "school": 2,
    "mgpa": 3.5,
    "verbal": 31,
    "quant": 31,
    "ugpa": 3.4
  },
  {
    "school": 2,
    "mgpa": 3.3,
    "verbal": 34,
    "quant": 40,
    "ugpa": 2.2
  },
  {
    "school": 2,
    "mgpa": 3,
    "verbal": 44,
    "quant": 32,
    "ugpa": 2
  },
  {
    "school": 2,
    "mgpa": 3.3,
    "verbal": 37,
    "quant": 37,
    "ugpa": 3.2
  },
  {
    "school": 2,
    "mgpa": 3.4,
    "verbal": 36,
    "quant": 34,
    "ugpa": 3.8
  },
  {
    "school": 2,
    "mgpa": 3.2,
    "verbal": 37,
    "quant": 32,
    "ugpa": 3.5
  },
  {
    "school": 2,
    "mgpa": 3.3,
    "verbal": 43,
    "quant": 32,
    "ugpa": 2.8
  },
  {
    "school": 2,
    "mgpa": 3,
    "verbal": 39,
    "quant": 41,
    "ugpa": 2.8
  },
  {
    "school": 2,
    "mgpa": 3.37,
    "verbal": 40,
    "quant": 33,
    "ugpa": 3.5
  },
  {
    "school": 2,
    "mgpa": 2.6,
    "verbal": 37,
    "quant": 27,
    "ugpa": 3.6
  },
  {
    "school": 2,
    "mgpa": 3,
    "verbal": 28,
    "quant": 45,
    "ugpa": 3.6
  },
  {
    "school": 2,
    "mgpa": 1,
    "verbal": 14,
    "quant": 15,
    "ugpa": 3.3
  },
  {
    "school": 2,
    "mgpa": 3.2,
    "verbal": 36,
    "quant": 31,
    "ugpa": 3.4
  },
  {
    "school": 2,
    "mgpa": 3.77,
    "verbal": 47,
    "quant": 43,
    "ugpa": 3.3
  },
  {
    "school": 2,
    "mgpa": 2.9,
    "verbal": 39,
    "quant": 41,
    "ugpa": 3
  },
  {
    "school": 2,
    "mgpa": 2.4,
    "verbal": 32,
    "quant": 22,
    "ugpa": 2.9
  },
  {
    "school": 2,
    "mgpa": 3.4,
    "verbal": 44,
    "quant": 27,
    "ugpa": 3.2
  },
  {
    "school": 2,
    "mgpa": 3.6,
    "verbal": 33,
    "quant": 26,
    "ugpa": 3.2
  },
  {
    "school": 2,
    "mgpa": 2.8,
    "verbal": 36,
    "quant": 31,
    "ugpa": 2.5
  },
  {
    "school": 2,
    "mgpa": 3.7,
    "verbal": 28,
    "quant": 33,
    "ugpa": 3.8
  },
  {
    "school": 2,
    "mgpa": 2.8,
    "verbal": 39,
    "quant": 39,
    "ugpa": 2.9
  },
  {
    "school": 2,
    "mgpa": 3.1,
    "verbal": 41,
    "quant": 36,
    "ugpa": 2.6
  },
  {
    "school": 2,
    "mgpa": 3.2,
    "verbal": 31,
    "quant": 40,
    "ugpa": 2.9
  },
  {
    "school": 2,
    "mgpa": 3.5,
    "verbal": 44,
    "quant": 34,
    "ugpa": 3
  },
  {
    "school": 2,
    "mgpa": 2.2,
    "verbal": 26,
    "quant": 28,
    "ugpa": 3.3
  },
  {
    "school": 2,
    "mgpa": 3.1,
    "verbal": 38,
    "quant": 45,
    "ugpa": 2.8
  },
  {
    "school": 2,
    "mgpa": 2.33,
    "verbal": 17,
    "quant": 15,
    "ugpa": 3.3
  },
  {
    "school": 2,
    "mgpa": 2.4,
    "verbal": 25,
    "quant": 19,
    "ugpa": 2.8
  },
  {
    "school": 2,
    "mgpa": 2.4,
    "verbal": 38,
    "quant": 36,
    "ugpa": 3.2
  },
  {
    "school": 2,
    "mgpa": 3,
    "verbal": 33,
    "quant": 28,
    "ugpa": 3.4
  },
  {
    "school": 2,
    "mgpa": 1.8,
    "verbal": 36,
    "quant": 37,
    "ugpa": 3.6
  },
  {
    "school": 2,
    "mgpa": 1.83,
    "verbal": 39,
    "quant": 35,
    "ugpa": 2.4
  },
  {
    "school": 2,
    "mgpa": 2.8,
    "verbal": 26,
    "quant": 39,
    "ugpa": 2.9
  },
  {
    "school": 2,
    "mgpa": 1.9,
    "verbal": 17,
    "quant": 19,
    "ugpa": 3.5
  },
  {
    "school": 2,
    "mgpa": 2.8,
    "verbal": 32,
    "quant": 34,
    "ugpa": 3.4
  },
  {
    "school": 2,
    "mgpa": 2.6,
    "verbal": 35,
    "quant": 31,
    "ugpa": 3.2
  },
  {
    "school": 2,
    "mgpa": 2.8,
    "verbal": 43,
    "quant": 31,
    "ugpa": 3.4
  },
  {
    "school": 2,
    "mgpa": 2.5,
    "verbal": 32,
    "quant": 30,
    "ugpa": 3.1
  },
  {
    "school": 2,
    "mgpa": 2.8,
    "verbal": 35,
    "quant": 24,
    "ugpa": 2.3
  },
  {
    "school": 2,
    "mgpa": 2.8,
    "verbal": 40,
    "quant": 37,
    "ugpa": 2.9
  },
  {
    "school": 2,
    "mgpa": 1.87,
    "verbal": 14,
    "quant": 30,
    "ugpa": 3.4
  },
  {
    "school": 2,
    "mgpa": 2.5,
    "verbal": 44,
    "quant": 29,
    "ugpa": 3.6
  },
  {
    "school": 2,
    "mgpa": 2.9,
    "verbal": 43,
    "quant": 41,
    "ugpa": 3
  },
  {
    "school": 2,
    "mgpa": 3.1,
    "verbal": 40,
    "quant": 32,
    "ugpa": 3.1
  },
  {
    "school": 2,
    "mgpa": 3.18,
    "verbal": 43,
    "quant": 45,
    "ugpa": 2.1
  },
  {
    "school": 2,
    "mgpa": 3.3,
    "verbal": 38,
    "quant": 37,
    "ugpa": 3.5
  },
  {
    "school": 2,
    "mgpa": 3.2,
    "verbal": 32,
    "quant": 33,
    "ugpa": 3.5
  },
  {
    "school": 2,
    "mgpa": 3.1,
    "verbal": 36,
    "quant": 34,
    "ugpa": 3.3
  },
  {
    "school": 2,
    "mgpa": 1.9,
    "verbal": 46,
    "quant": 28,
    "ugpa": 2.7
  },
  {
    "school": 2,
    "mgpa": 3,
    "verbal": 37,
    "quant": 34,
    "ugpa": 3
  },
  {
    "school": 2,
    "mgpa": 3.5,
    "verbal": 38,
    "quant": 39,
    "ugpa": 3.7
  },
  {
    "school": 2,
    "mgpa": 3.7,
    "verbal": 32,
    "quant": 34,
    "ugpa": 3.7
  },
  {
    "school": 2,
    "mgpa": 2.7,
    "verbal": 32,
    "quant": 30,
    "ugpa": 2.8
  },
  {
    "school": 2,
    "mgpa": 3.7,
    "verbal": 41,
    "quant": 39,
    "ugpa": 3.3
  },
  {
    "school": 2,
    "mgpa": 3.1,
    "verbal": 43,
    "quant": 39,
    "ugpa": 3.3
  },
  {
    "school": 2,
    "mgpa": 2.5,
    "verbal": 35,
    "quant": 27,
    "ugpa": 3.2
  },
  {
    "school": 2,
    "mgpa": 3.3,
    "verbal": 36,
    "quant": 28,
    "ugpa": 3.6
  },
  {
    "school": 2,
    "mgpa": 1.8,
    "verbal": 38,
    "quant": 29,
    "ugpa": 2.8
  },
  {
    "school": 2,
    "mgpa": 2.5,
    "verbal": 31,
    "quant": 33,
    "ugpa": 3.4
  },
  {
    "school": 2,
    "mgpa": 3.5,
    "verbal": 17,
    "quant": 40,
    "ugpa": 3.3
  },
  {
    "school": 2,
    "mgpa": 3.4,
    "verbal": 35,
    "quant": 31,
    "ugpa": 2.8
  },
  {
    "school": 2,
    "mgpa": 3.2,
    "verbal": 38,
    "quant": 32,
    "ugpa": 2.9
  },
  {
    "school": 2,
    "mgpa": 2.3,
    "verbal": 33,
    "quant": 20,
    "ugpa": 3.2
  },
  {
    "school": 2,
    "mgpa": 3,
    "verbal": 28,
    "quant": 25,
    "ugpa": 2.8
  },
  {
    "school": 2,
    "mgpa": 3.2,
    "verbal": 43,
    "quant": 33,
    "ugpa": 3.6
  },
  {
    "school": 2,
    "mgpa": 3.5,
    "verbal": 47,
    "quant": 41,
    "ugpa": 3.6
  },
  {
    "school": 2,
    "mgpa": 2.9,
    "verbal": 33,
    "quant": 34,
    "ugpa": 3
  },
  {
    "school": 2,
    "mgpa": 2.6,
    "verbal": 32,
    "quant": 31,
    "ugpa": 2.9
  },
  {
    "school": 2,
    "mgpa": 3.5,
    "verbal": 20,
    "quant": 43,
    "ugpa": 3.3
  },
  {
    "school": 2,
    "mgpa": 3.4,
    "verbal": 38,
    "quant": 33,
    "ugpa": 3.6
  },
  {
    "school": 2,
    "mgpa": 3.3,
    "verbal": 35,
    "quant": 41,
    "ugpa": 3.2
  },
  {
    "school": 2,
    "mgpa": 2.75,
    "verbal": 21,
    "quant": 15,
    "ugpa": 3.3
  },
  {
    "school": 2,
    "mgpa": 2.9,
    "verbal": 24,
    "quant": 40,
    "ugpa": 2.8
  },
  {
    "school": 2,
    "mgpa": 2.67,
    "verbal": 38,
    "quant": 34,
    "ugpa": 3.2
  },
  {
    "school": 2,
    "mgpa": 2.44,
    "verbal": 33,
    "quant": 35,
    "ugpa": 3.3
  },
  {
    "school": 2,
    "mgpa": 2.9,
    "verbal": 29,
    "quant": 34,
    "ugpa": 3.4
  },
  {
    "school": 2,
    "mgpa": 2.6,
    "verbal": 36,
    "quant": 35,
    "ugpa": 3
  },
  {
    "school": 2,
    "mgpa": 2.7,
    "verbal": 27,
    "quant": 32,
    "ugpa": 3.3
  },
  {
    "school": 2,
    "mgpa": 2.3,
    "verbal": 28,
    "quant": 29,
    "ugpa": 3.3
  },
  {
    "school": 2,
    "mgpa": 2,
    "verbal": 25,
    "quant": 28,
    "ugpa": 3.2
  },
  {
    "school": 2,
    "mgpa": 2.7,
    "verbal": 37,
    "quant": 41,
    "ugpa": 2.9
  },
  {
    "school": 2,
    "mgpa": 3.1,
    "verbal": 40,
    "quant": 27,
    "ugpa": 3.3
  },
  {
    "school": 2,
    "mgpa": 2.2,
    "verbal": 34,
    "quant": 23,
    "ugpa": 3.4
  },
  {
    "school": 2,
    "mgpa": 3.2,
    "verbal": 39,
    "quant": 35,
    "ugpa": 3.2
  },
  {
    "school": 2,
    "mgpa": 3.22,
    "verbal": 17,
    "quant": 35,
    "ugpa": 3.6
  },
  {
    "school": 2,
    "mgpa": 2.62,
    "verbal": 39,
    "quant": 32,
    "ugpa": 3.1
  },
  {
    "school": 2,
    "mgpa": 3,
    "verbal": 36,
    "quant": 32,
    "ugpa": 3.2
  },
  {
    "school": 2,
    "mgpa": 3,
    "verbal": 31,
    "quant": 23,
    "ugpa": 3.1
  },
  {
    "school": 2,
    "mgpa": 3.2,
    "verbal": 45,
    "quant": 35,
    "ugpa": 3.1
  },
  {
    "school": 2,
    "mgpa": 2.9,
    "verbal": 37,
    "quant": 37,
    "ugpa": 2.7
  },
  {
    "school": 2,
    "mgpa": 2.88,
    "verbal": 39,
    "quant": 42,
    "ugpa": 3.9
  },
  {
    "school": 2,
    "mgpa": 2.4,
    "verbal": 28,
    "quant": 27,
    "ugpa": 2.7
  },
  {
    "school": 2,
    "mgpa": 3.2,
    "verbal": 28,
    "quant": 26,
    "ugpa": 3.4
  },
  {
    "school": 2,
    "mgpa": 2.55,
    "verbal": 44,
    "quant": 38,
    "ugpa": 3.7
  },
  {
    "school": 2,
    "mgpa": 2.11,
    "verbal": 37,
    "quant": 26,
    "ugpa": 3.1
  },
  {
    "school": 2,
    "mgpa": 2.4,
    "verbal": 33,
    "quant": 34,
    "ugpa": 2.8
  },
  {
    "school": 2,
    "mgpa": 2.1,
    "verbal": 35,
    "quant": 24,
    "ugpa": 3.5
  },
  {
    "school": 2,
    "mgpa": 2.77,
    "verbal": 40,
    "quant": 30,
    "ugpa": 3.5
  },
  {
    "school": 2,
    "mgpa": 2.38,
    "verbal": 38,
    "quant": 32,
    "ugpa": 2.9
  },
  {
    "school": 2,
    "mgpa": 2.75,
    "verbal": 36,
    "quant": 40,
    "ugpa": 3.3
  },
  {
    "school": 2,
    "mgpa": 3.2,
    "verbal": 38,
    "quant": 34,
    "ugpa": 3.8
  },
  {
    "school": 2,
    "mgpa": 3.44,
    "verbal": 45,
    "quant": 43,
    "ugpa": 3.8
  },
  {
    "school": 2,
    "mgpa": 3.5,
    "verbal": 40,
    "quant": 35,
    "ugpa": 3.6
  },
  {
    "school": 2,
    "mgpa": 3,
    "verbal": 31,
    "quant": 46,
    "ugpa": 3.5
  },
  {
    "school": 2,
    "mgpa": 3.1,
    "verbal": 40,
    "quant": 31,
    "ugpa": 3.4
  },
  {
    "school": 2,
    "mgpa": 3.4,
    "verbal": 42,
    "quant": 38,
    "ugpa": 3
  },
  {
    "school": 2,
    "mgpa": 2,
    "verbal": 33,
    "quant": 30,
    "ugpa": 3.7
  },
  {
    "school": 2,
    "mgpa": 2,
    "verbal": 33,
    "quant": 31,
    "ugpa": 2.9
  },
  {
    "school": 2,
    "mgpa": 2.3,
    "verbal": 30,
    "quant": 28,
    "ugpa": 2.6
  },
  {
    "school": 2,
    "mgpa": 2.2,
    "verbal": 39,
    "quant": 40,
    "ugpa": 3.3
  },
  {
    "school": 2,
    "mgpa": 2.55,
    "verbal": 38,
    "quant": 39,
    "ugpa": 3.4
  },
  {
    "school": 2,
    "mgpa": 3.1,
    "verbal": 46,
    "quant": 23,
    "ugpa": 3.5
  },
  {
    "school": 2,
    "mgpa": 3,
    "verbal": 32,
    "quant": 33,
    "ugpa": 3.1
  },
  {
    "school": 2,
    "mgpa": 3.1,
    "verbal": 21,
    "quant": 30,
    "ugpa": 3.8
  },
  {
    "school": 2,
    "mgpa": 2.5,
    "verbal": 18,
    "quant": 21,
    "ugpa": 3.2
  },
  {
    "school": 2,
    "mgpa": 2.4,
    "verbal": 38,
    "quant": 31,
    "ugpa": 2.9
  },
  {
    "school": 2,
    "mgpa": 3.2,
    "verbal": 34,
    "quant": 40,
    "ugpa": 2.1
  },
  {
    "school": 2,
    "mgpa": 2.8,
    "verbal": 43,
    "quant": 36,
    "ugpa": 3.4
  },
  {
    "school": 2,
    "mgpa": 3.7,
    "verbal": 43,
    "quant": 36,
    "ugpa": 4
  },
  {
    "school": 2,
    "mgpa": 2.3,
    "verbal": 37,
    "quant": 30,
    "ugpa": 2.8
  },
  {
    "school": 2,
    "mgpa": 2.4,
    "verbal": 35,
    "quant": 35,
    "ugpa": 3
  },
  {
    "school": 2,
    "mgpa": 2.2,
    "verbal": 27,
    "quant": 36,
    "ugpa": 2.9
  },
  {
    "school": 2,
    "mgpa": 2.4,
    "verbal": 34,
    "quant": 31,
    "ugpa": 2.7
  },
  {
    "school": 2,
    "mgpa": 3,
    "verbal": 37,
    "quant": 33,
    "ugpa": 3.4
  },
  {
    "school": 2,
    "mgpa": 3.5,
    "verbal": 26,
    "quant": 49,
    "ugpa": 3.2
  },
  {
    "school": 2,
    "mgpa": 2.7,
    "verbal": 37,
    "quant": 18,
    "ugpa": 3.2
  },
  {
    "school": 2,
    "mgpa": 3,
    "verbal": 28,
    "quant": 39,
    "ugpa": 3.5
  },
  {
    "school": 2,
    "mgpa": 3.3,
    "verbal": 40,
    "quant": 38,
    "ugpa": 3.4
  },
  {
    "school": 2,
    "mgpa": 1.9,
    "verbal": 34,
    "quant": 31,
    "ugpa": 3.3
  },
  {
    "school": 2,
    "mgpa": 3.1,
    "verbal": 40,
    "quant": 29,
    "ugpa": 2.7
  },
  {
    "school": 2,
    "mgpa": 2.4,
    "verbal": 33,
    "quant": 27,
    "ugpa": 3.4
  },
  {
    "school": 2,
    "mgpa": 1.9,
    "verbal": 34,
    "quant": 27,
    "ugpa": 3.4
  },
  {
    "school": 2,
    "mgpa": 3.1,
    "verbal": 36,
    "quant": 28,
    "ugpa": 3.4
  },
  {
    "school": 2,
    "mgpa": 2.77,
    "verbal": 29,
    "quant": 32,
    "ugpa": 3.4
  },
  {
    "school": 2,
    "mgpa": 2.8,
    "verbal": 36,
    "quant": 35,
    "ugpa": 3.4
  },
  {
    "school": 2,
    "mgpa": 2.56,
    "verbal": 31,
    "quant": 31,
    "ugpa": 2.7
  },
  {
    "school": 2,
    "mgpa": 2.8,
    "verbal": 27,
    "quant": 33,
    "ugpa": 3.7
  },
  {
    "school": 3,
    "mgpa": 3.9,
    "verbal": 49,
    "quant": 51,
    "ugpa": 3.18
  },
  {
    "school": 3,
    "mgpa": 3.66,
    "verbal": 39,
    "quant": 43,
    "ugpa": 3.75
  },
  {
    "school": 3,
    "mgpa": 3.41,
    "verbal": 31,
    "quant": 39,
    "ugpa": 3.55
  },
  {
    "school": 3,
    "mgpa": 2.98,
    "verbal": 43,
    "quant": 41,
    "ugpa": 3.08
  },
  {
    "school": 3,
    "mgpa": 3.64,
    "verbal": 33,
    "quant": 38,
    "ugpa": 3.26
  },
  {
    "school": 3,
    "mgpa": 3.25,
    "verbal": 24,
    "quant": 39,
    "ugpa": 3.47
  },
  {
    "school": 3,
    "mgpa": 2.94,
    "verbal": 36,
    "quant": 38,
    "ugpa": 3.05
  },
  {
    "school": 3,
    "mgpa": 3.56,
    "verbal": 27,
    "quant": 40,
    "ugpa": 3.49
  },
  {
    "school": 3,
    "mgpa": 3.45,
    "verbal": 43,
    "quant": 41,
    "ugpa": 3.53
  },
  {
    "school": 3,
    "mgpa": 3.64,
    "verbal": 42,
    "quant": 44,
    "ugpa": 3.48
  },
  {
    "school": 3,
    "mgpa": 3.39,
    "verbal": 39,
    "quant": 30,
    "ugpa": 3.49
  },
  {
    "school": 3,
    "mgpa": 3.1,
    "verbal": 38,
    "quant": 33,
    "ugpa": 3.3
  },
  {
    "school": 3,
    "mgpa": 3.25,
    "verbal": 40,
    "quant": 60,
    "ugpa": 2.82
  },
  {
    "school": 3,
    "mgpa": 3.49,
    "verbal": 38,
    "quant": 45,
    "ugpa": 3.75
  },
  {
    "school": 3,
    "mgpa": 3.8,
    "verbal": 41,
    "quant": 47,
    "ugpa": 4
  },
  {
    "school": 3,
    "mgpa": 2.94,
    "verbal": 32,
    "quant": 38,
    "ugpa": 3.65
  },
  {
    "school": 3,
    "mgpa": 2.94,
    "verbal": 37,
    "quant": 37,
    "ugpa": 3.15
  },
  {
    "school": 3,
    "mgpa": 3.06,
    "verbal": 36,
    "quant": 34,
    "ugpa": 3.45
  },
  {
    "school": 3,
    "mgpa": 3.16,
    "verbal": 36,
    "quant": 37,
    "ugpa": 3.81
  },
  {
    "school": 3,
    "mgpa": 3.72,
    "verbal": 40,
    "quant": 39,
    "ugpa": 3.38
  },
  {
    "school": 3,
    "mgpa": 3.46,
    "verbal": 36,
    "quant": 35,
    "ugpa": 3.81
  },
  {
    "school": 3,
    "mgpa": 3.05,
    "verbal": 40,
    "quant": 34,
    "ugpa": 3.39
  },
  {
    "school": 3,
    "mgpa": 3.54,
    "verbal": 40,
    "quant": 31,
    "ugpa": 3.26
  },
  {
    "school": 3,
    "mgpa": 3.81,
    "verbal": 41,
    "quant": 38,
    "ugpa": 3.61
  },
  {
    "school": 3,
    "mgpa": 3.32,
    "verbal": 35,
    "quant": 29,
    "ugpa": 3.57
  },
  {
    "school": 3,
    "mgpa": 3.83,
    "verbal": 40,
    "quant": 45,
    "ugpa": 3.64
  },
  {
    "school": 3,
    "mgpa": 3.31,
    "verbal": 47,
    "quant": 30,
    "ugpa": 3.53
  },
  {
    "school": 3,
    "mgpa": 3.11,
    "verbal": 41,
    "quant": 37,
    "ugpa": 3.22
  },
  {
    "school": 3,
    "mgpa": 3.3,
    "verbal": 42,
    "quant": 31,
    "ugpa": 2.98
  },
  {
    "school": 3,
    "mgpa": 3.42,
    "verbal": 38,
    "quant": 28,
    "ugpa": 3.25
  },
  {
    "school": 3,
    "mgpa": 3.49,
    "verbal": 39,
    "quant": 39,
    "ugpa": 3.73
  },
  {
    "school": 3,
    "mgpa": 3.45,
    "verbal": 36,
    "quant": 32,
    "ugpa": 3.44
  },
  {
    "school": 3,
    "mgpa": 3.56,
    "verbal": 34,
    "quant": 37,
    "ugpa": 3.74
  },
  {
    "school": 3,
    "mgpa": 3.45,
    "verbal": 42,
    "quant": 32,
    "ugpa": 3.39
  },
  {
    "school": 3,
    "mgpa": 3.67,
    "verbal": 42,
    "quant": 45,
    "ugpa": 2.69
  },
  {
    "school": 3,
    "mgpa": 3.66,
    "verbal": 36,
    "quant": 36,
    "ugpa": 3.57
  },
  {
    "school": 3,
    "mgpa": 3.7,
    "verbal": 31,
    "quant": 40,
    "ugpa": 3.42
  },
  {
    "school": 3,
    "mgpa": 3.3,
    "verbal": 39,
    "quant": 28,
    "ugpa": 3.62
  },
  {
    "school": 3,
    "mgpa": 3.67,
    "verbal": 42,
    "quant": 25,
    "ugpa": 3.56
  },
  {
    "school": 3,
    "mgpa": 3.58,
    "verbal": 45,
    "quant": 35,
    "ugpa": 3.6
  },
  {
    "school": 3,
    "mgpa": 3.38,
    "verbal": 40,
    "quant": 45,
    "ugpa": 2.93
  },
  {
    "school": 3,
    "mgpa": 3.53,
    "verbal": 38,
    "quant": 33,
    "ugpa": 3.49
  },
  {
    "school": 3,
    "mgpa": 3.04,
    "verbal": 35,
    "quant": 40,
    "ugpa": 3.7
  },
  {
    "school": 3,
    "mgpa": 3.92,
    "verbal": 47,
    "quant": 35,
    "ugpa": 3.11
  },
  {
    "school": 3,
    "mgpa": 3.41,
    "verbal": 24,
    "quant": 36,
    "ugpa": 3.33
  },
  {
    "school": 3,
    "mgpa": 3.26,
    "verbal": 39,
    "quant": 31,
    "ugpa": 3.51
  },
  {
    "school": 3,
    "mgpa": 3.6,
    "verbal": 39,
    "quant": 34,
    "ugpa": 3.36
  },
  {
    "school": 3,
    "mgpa": 3.08,
    "verbal": 36,
    "quant": 47,
    "ugpa": 3.1
  },
  {
    "school": 3,
    "mgpa": 3.3,
    "verbal": 43,
    "quant": 47,
    "ugpa": 3.55
  },
  {
    "school": 3,
    "mgpa": 3.29,
    "verbal": 32,
    "quant": 40,
    "ugpa": 3.91
  },
  {
    "school": 3,
    "mgpa": 3.51,
    "verbal": 44,
    "quant": 38,
    "ugpa": 2.76
  },
  {
    "school": 3,
    "mgpa": 3.03,
    "verbal": 33,
    "quant": 39,
    "ugpa": 3.42
  },
  {
    "school": 3,
    "mgpa": 3.42,
    "verbal": 44,
    "quant": 33,
    "ugpa": 3.57
  },
  {
    "school": 3,
    "mgpa": 3.24,
    "verbal": 25,
    "quant": 30,
    "ugpa": 3.31
  },
  {
    "school": 3,
    "mgpa": 2.97,
    "verbal": 40,
    "quant": 34,
    "ugpa": 3.6
  },
  {
    "school": 3,
    "mgpa": 3.54,
    "verbal": 47,
    "quant": 29,
    "ugpa": 3.72
  },
  {
    "school": 3,
    "mgpa": 2.94,
    "verbal": 28,
    "quant": 40,
    "ugpa": 3.23
  },
  {
    "school": 3,
    "mgpa": 3.16,
    "verbal": 36,
    "quant": 43,
    "ugpa": 2.6
  },
  {
    "school": 3,
    "mgpa": 3.81,
    "verbal": 49,
    "quant": 42,
    "ugpa": 3.8
  },
  {
    "school": 3,
    "mgpa": 3.71,
    "verbal": 28,
    "quant": 34,
    "ugpa": 3.37
  },
  {
    "school": 3,
    "mgpa": 3.59,
    "verbal": 33,
    "quant": 45,
    "ugpa": 3.06
  },
  {
    "school": 3,
    "mgpa": 3.33,
    "verbal": 39,
    "quant": 31,
    "ugpa": 3.36
  },
  {
    "school": 3,
    "mgpa": 2.98,
    "verbal": 34,
    "quant": 38,
    "ugpa": 2.58
  },
  {
    "school": 3,
    "mgpa": 3.86,
    "verbal": 45,
    "quant": 45,
    "ugpa": 3.96
  },
  {
    "school": 3,
    "mgpa": 3.53,
    "verbal": 42,
    "quant": 38,
    "ugpa": 3.42
  },
  {
    "school": 3,
    "mgpa": 3.39,
    "verbal": 40,
    "quant": 34,
    "ugpa": 3.37
  },
  {
    "school": 3,
    "mgpa": 3.29,
    "verbal": 38,
    "quant": 34,
    "ugpa": 3.45
  },
  {
    "school": 3,
    "mgpa": 3.49,
    "verbal": 42,
    "quant": 49,
    "ugpa": 3.57
  },
  {
    "school": 3,
    "mgpa": 3.11,
    "verbal": 36,
    "quant": 36,
    "ugpa": 3.16
  },
  {
    "school": 3,
    "mgpa": 3.76,
    "verbal": 38,
    "quant": 36,
    "ugpa": 3.53
  },
  {
    "school": 3,
    "mgpa": 3.82,
    "verbal": 18,
    "quant": 39,
    "ugpa": 3.94
  },
  {
    "school": 3,
    "mgpa": 3.54,
    "verbal": 37,
    "quant": 41,
    "ugpa": 4
  },
  {
    "school": 3,
    "mgpa": 3.94,
    "verbal": 47,
    "quant": 39,
    "ugpa": 3.83
  },
  {
    "school": 3,
    "mgpa": 2.88,
    "verbal": 32,
    "quant": 34,
    "ugpa": 3.7
  },
  {
    "school": 3,
    "mgpa": 3.24,
    "verbal": 37,
    "quant": 37,
    "ugpa": 3.41
  },
  {
    "school": 3,
    "mgpa": 3.38,
    "verbal": 37,
    "quant": 31,
    "ugpa": 3.85
  },
  {
    "school": 3,
    "mgpa": 3.52,
    "verbal": 44,
    "quant": 33,
    "ugpa": 3.5
  },
  {
    "school": 3,
    "mgpa": 3.28,
    "verbal": 38,
    "quant": 39,
    "ugpa": 3.04
  },
  {
    "school": 3,
    "mgpa": 3.06,
    "verbal": 30,
    "quant": 41,
    "ugpa": 3.4
  },
  {
    "school": 3,
    "mgpa": 3.38,
    "verbal": 42,
    "quant": 33,
    "ugpa": 3.34
  },
  {
    "school": 3,
    "mgpa": 3.64,
    "verbal": 40,
    "quant": 33,
    "ugpa": 2.01
  },
  {
    "school": 3,
    "mgpa": 3.42,
    "verbal": 36,
    "quant": 46,
    "ugpa": 3.23
  },
  {
    "school": 3,
    "mgpa": 2.83,
    "verbal": 44,
    "quant": 43,
    "ugpa": 3.86
  },
  {
    "school": 3,
    "mgpa": 3.2,
    "verbal": 32,
    "quant": 26,
    "ugpa": 3.76
  },
  {
    "school": 3,
    "mgpa": 3.51,
    "verbal": 41,
    "quant": 39,
    "ugpa": 3.5
  },
  {
    "school": 3,
    "mgpa": 2.67,
    "verbal": 39,
    "quant": 46,
    "ugpa": 2.86
  },
  {
    "school": 3,
    "mgpa": 3.2,
    "verbal": 31,
    "quant": 35,
    "ugpa": 3.4
  },
  {
    "school": 3,
    "mgpa": 3.7,
    "verbal": 41,
    "quant": 44,
    "ugpa": 3.91
  },
  {
    "school": 3,
    "mgpa": 3.93,
    "verbal": 38,
    "quant": 43,
    "ugpa": 2.84
  },
  {
    "school": 3,
    "mgpa": 3.58,
    "verbal": 41,
    "quant": 38,
    "ugpa": 3.24
  },
  {
    "school": 3,
    "mgpa": 3.7,
    "verbal": 35,
    "quant": 42,
    "ugpa": 3.13
  },
  {
    "school": 3,
    "mgpa": 3.66,
    "verbal": 41,
    "quant": 41,
    "ugpa": 2.62
  },
  {
    "school": 3,
    "mgpa": 2.99,
    "verbal": 39,
    "quant": 43,
    "ugpa": 3.72
  },
  {
    "school": 3,
    "mgpa": 3.33,
    "verbal": 32,
    "quant": 48,
    "ugpa": 3.15
  },
  {
    "school": 3,
    "mgpa": 3.85,
    "verbal": 45,
    "quant": 52,
    "ugpa": 3.96
  },
  {
    "school": 3,
    "mgpa": 3.4,
    "verbal": 30,
    "quant": 38,
    "ugpa": 3.45
  },
  {
    "school": 3,
    "mgpa": 3,
    "verbal": 36,
    "quant": 45,
    "ugpa": 3.13
  },
  {
    "school": 3,
    "mgpa": 3.48,
    "verbal": 38,
    "quant": 34,
    "ugpa": 3.95
  },
  {
    "school": 3,
    "mgpa": 3.58,
    "verbal": 44,
    "quant": 43,
    "ugpa": 3.47
  },
  {
    "school": 3,
    "mgpa": 3,
    "verbal": 35,
    "quant": 35,
    "ugpa": 3.43
  },
  {
    "school": 3,
    "mgpa": 3.29,
    "verbal": 28,
    "quant": 34,
    "ugpa": 3.5
  },
  {
    "school": 3,
    "mgpa": 3.3,
    "verbal": 43,
    "quant": 45,
    "ugpa": 3.27
  },
  {
    "school": 3,
    "mgpa": 3.29,
    "verbal": 33,
    "quant": 45,
    "ugpa": 3.24
  },
  {
    "school": 3,
    "mgpa": 3.02,
    "verbal": 40,
    "quant": 39,
    "ugpa": 3.25
  },
  {
    "school": 3,
    "mgpa": 3.5,
    "verbal": 33,
    "quant": 44,
    "ugpa": 3.95
  },
  {
    "school": 3,
    "mgpa": 3.96,
    "verbal": 44,
    "quant": 37,
    "ugpa": 3.92
  },
  {
    "school": 3,
    "mgpa": 3.44,
    "verbal": 25,
    "quant": 44,
    "ugpa": 3.58
  },
  {
    "school": 3,
    "mgpa": 3.49,
    "verbal": 41,
    "quant": 41,
    "ugpa": 3.67
  },
  {
    "school": 3,
    "mgpa": 3.49,
    "verbal": 39,
    "quant": 44,
    "ugpa": 2.74
  },
  {
    "school": 3,
    "mgpa": 3.04,
    "verbal": 37,
    "quant": 41,
    "ugpa": 3.4
  },
  {
    "school": 3,
    "mgpa": 3.66,
    "verbal": 36,
    "quant": 37,
    "ugpa": 3.35
  },
  {
    "school": 3,
    "mgpa": 3.54,
    "verbal": 39,
    "quant": 40,
    "ugpa": 3.75
  },
  {
    "school": 3,
    "mgpa": 3.11,
    "verbal": 34,
    "quant": 40,
    "ugpa": 3.84
  },
  {
    "school": 3,
    "mgpa": 3.55,
    "verbal": 42,
    "quant": 33,
    "ugpa": 3.02
  },
  {
    "school": 3,
    "mgpa": 3.31,
    "verbal": 41,
    "quant": 34,
    "ugpa": 3.84
  },
  {
    "school": 3,
    "mgpa": 3.17,
    "verbal": 43,
    "quant": 40,
    "ugpa": 2.99
  },
  {
    "school": 3,
    "mgpa": 3.41,
    "verbal": 40,
    "quant": 48,
    "ugpa": 3.45
  },
  {
    "school": 3,
    "mgpa": 3.2,
    "verbal": 40,
    "quant": 37,
    "ugpa": 3.58
  },
  {
    "school": 3,
    "mgpa": 3.33,
    "verbal": 31,
    "quant": 39,
    "ugpa": 3.49
  },
  {
    "school": 3,
    "mgpa": 3.51,
    "verbal": 41,
    "quant": 45,
    "ugpa": 3.64
  },
  {
    "school": 3,
    "mgpa": 3.01,
    "verbal": 35,
    "quant": 38,
    "ugpa": 3.52
  },
  {
    "school": 3,
    "mgpa": 3.32,
    "verbal": 42,
    "quant": 40,
    "ugpa": 2.9
  },
  {
    "school": 3,
    "mgpa": 3.68,
    "verbal": 48,
    "quant": 39,
    "ugpa": 3.78
  },
  {
    "school": 3,
    "mgpa": 3.64,
    "verbal": 49,
    "quant": 46,
    "ugpa": 3.72
  },
  {
    "school": 3,
    "mgpa": 3.1,
    "verbal": 42,
    "quant": 43,
    "ugpa": 3.04
  },
  {
    "school": 3,
    "mgpa": 3.55,
    "verbal": 37,
    "quant": 33,
    "ugpa": 3.55
  },
  {
    "school": 3,
    "mgpa": 3.27,
    "verbal": 39,
    "quant": 45,
    "ugpa": 3.1
  },
  {
    "school": 3,
    "mgpa": 3.16,
    "verbal": 33,
    "quant": 40,
    "ugpa": 3.33
  },
  {
    "school": 3,
    "mgpa": 3.37,
    "verbal": 36,
    "quant": 42,
    "ugpa": 3.57
  },
  {
    "school": 3,
    "mgpa": 3.97,
    "verbal": 42,
    "quant": 49,
    "ugpa": 4
  },
  {
    "school": 3,
    "mgpa": 3.75,
    "verbal": 36,
    "quant": 35,
    "ugpa": 3.15
  },
  {
    "school": 3,
    "mgpa": 3.58,
    "verbal": 31,
    "quant": 45,
    "ugpa": 3.72
  },
  {
    "school": 3,
    "mgpa": 3.53,
    "verbal": 43,
    "quant": 38,
    "ugpa": 3.6
  },
  {
    "school": 3,
    "mgpa": 3.77,
    "verbal": 46,
    "quant": 35,
    "ugpa": 3.36
  },
  {
    "school": 3,
    "mgpa": 3.91,
    "verbal": 43,
    "quant": 39,
    "ugpa": 3.58
  },
  {
    "school": 3,
    "mgpa": 3.23,
    "verbal": 49,
    "quant": 37,
    "ugpa": 3.49
  },
  {
    "school": 3,
    "mgpa": 2.88,
    "verbal": 34,
    "quant": 39,
    "ugpa": 3.22
  },
  {
    "school": 3,
    "mgpa": 3.19,
    "verbal": 36,
    "quant": 32,
    "ugpa": 3.42
  },
  {
    "school": 3,
    "mgpa": 3.59,
    "verbal": 44,
    "quant": 31,
    "ugpa": 3.59
  },
  {
    "school": 3,
    "mgpa": 3.52,
    "verbal": 33,
    "quant": 34,
    "ugpa": 3.6
  },
  {
    "school": 3,
    "mgpa": 3.39,
    "verbal": 37,
    "quant": 36,
    "ugpa": 3.59
  },
  {
    "school": 3,
    "mgpa": 2.93,
    "verbal": 43,
    "quant": 39,
    "ugpa": 3.35
  },
  {
    "school": 3,
    "mgpa": 3.36,
    "verbal": 43,
    "quant": 35,
    "ugpa": 3.43
  },
  {
    "school": 3,
    "mgpa": 3.19,
    "verbal": 33,
    "quant": 37,
    "ugpa": 3.58
  },
  {
    "school": 3,
    "mgpa": 3.56,
    "verbal": 31,
    "quant": 37,
    "ugpa": 3.85
  },
  {
    "school": 3,
    "mgpa": 3.05,
    "verbal": 25,
    "quant": 36,
    "ugpa": 3.38
  },
  {
    "school": 3,
    "mgpa": 3.11,
    "verbal": 33,
    "quant": 41,
    "ugpa": 3.37
  },
  {
    "school": 3,
    "mgpa": 3.27,
    "verbal": 48,
    "quant": 37,
    "ugpa": 3.3
  },
  {
    "school": 3,
    "mgpa": 3.92,
    "verbal": 44,
    "quant": 41,
    "ugpa": 3.96
  },
  {
    "school": 3,
    "mgpa": 3.04,
    "verbal": 43,
    "quant": 43,
    "ugpa": 3.31
  },
  {
    "school": 3,
    "mgpa": 3.82,
    "verbal": 36,
    "quant": 36,
    "ugpa": 3.45
  },
  {
    "school": 3,
    "mgpa": 3.91,
    "verbal": 46,
    "quant": 43,
    "ugpa": 3.85
  },
  {
    "school": 3,
    "mgpa": 3.24,
    "verbal": 37,
    "quant": 39,
    "ugpa": 3.55
  },
  {
    "school": 3,
    "mgpa": 3.11,
    "verbal": 21,
    "quant": 47,
    "ugpa": 3.86
  },
  {
    "school": 3,
    "mgpa": 3.12,
    "verbal": 38,
    "quant": 37,
    "ugpa": 3.16
  },
  {
    "school": 3,
    "mgpa": 3.55,
    "verbal": 40,
    "quant": 41,
    "ugpa": 3.09
  },
  {
    "school": 3,
    "mgpa": 3.24,
    "verbal": 41,
    "quant": 42,
    "ugpa": 3.28
  },
  {
    "school": 3,
    "mgpa": 3.75,
    "verbal": 41,
    "quant": 41,
    "ugpa": 3.44
  },
  {
    "school": 3,
    "mgpa": 3.83,
    "verbal": 44,
    "quant": 43,
    "ugpa": 3.8
  },
  {
    "school": 3,
    "mgpa": 2.72,
    "verbal": 35,
    "quant": 28,
    "ugpa": 3.19
  },
  {
    "school": 4,
    "mgpa": 3.53,
    "verbal": 46,
    "quant": 29,
    "ugpa": 2.3
  },
  {
    "school": 4,
    "mgpa": 4,
    "verbal": 27,
    "quant": 37,
    "ugpa": 3.3
  },
  {
    "school": 4,
    "mgpa": 3.76,
    "verbal": 32,
    "quant": 28,
    "ugpa": 3
  },
  {
    "school": 4,
    "mgpa": 3.47,
    "verbal": 34,
    "quant": 34,
    "ugpa": 2.7
  },
  {
    "school": 4,
    "mgpa": 3.29,
    "verbal": 26,
    "quant": 28,
    "ugpa": 3
  },
  {
    "school": 4,
    "mgpa": 3.73,
    "verbal": 24,
    "quant": 28,
    "ugpa": 2.9
  },
  {
    "school": 4,
    "mgpa": 3.87,
    "verbal": 35,
    "quant": 31,
    "ugpa": 2.7
  },
  {
    "school": 4,
    "mgpa": 3.58,
    "verbal": 27,
    "quant": 28,
    "ugpa": 3.4
  },
  {
    "school": 4,
    "mgpa": 3,
    "verbal": 19,
    "quant": 25,
    "ugpa": 2.3
  },
  {
    "school": 4,
    "mgpa": 2.88,
    "verbal": 25,
    "quant": 25,
    "ugpa": 3.4
  },
  {
    "school": 4,
    "mgpa": 3.14,
    "verbal": 31,
    "quant": 43,
    "ugpa": 3
  },
  {
    "school": 4,
    "mgpa": 3.15,
    "verbal": 39,
    "quant": 28,
    "ugpa": 3.1
  },
  {
    "school": 4,
    "mgpa": 3.29,
    "verbal": 29,
    "quant": 17,
    "ugpa": 3
  },
  {
    "school": 4,
    "mgpa": 3.4,
    "verbal": 28,
    "quant": 30,
    "ugpa": 3.2
  },
  {
    "school": 4,
    "mgpa": 3.64,
    "verbal": 26,
    "quant": 23,
    "ugpa": 2.6
  },
  {
    "school": 4,
    "mgpa": 3.5,
    "verbal": 29,
    "quant": 29,
    "ugpa": 3.2
  },
  {
    "school": 4,
    "mgpa": 3.11,
    "verbal": 38,
    "quant": 32,
    "ugpa": 2.7
  },
  {
    "school": 4,
    "mgpa": 3.5,
    "verbal": 29,
    "quant": 31,
    "ugpa": 3
  },
  {
    "school": 4,
    "mgpa": 3.31,
    "verbal": 36,
    "quant": 32,
    "ugpa": 2.3
  },
  {
    "school": 4,
    "mgpa": 3.79,
    "verbal": 37,
    "quant": 42,
    "ugpa": 3.3
  },
  {
    "school": 4,
    "mgpa": 2.9,
    "verbal": 15,
    "quant": 28,
    "ugpa": 3.2
  },
  {
    "school": 4,
    "mgpa": 3.67,
    "verbal": 32,
    "quant": 22,
    "ugpa": 3.1
  },
  {
    "school": 4,
    "mgpa": 3,
    "verbal": 32,
    "quant": 24,
    "ugpa": 3
  },
  {
    "school": 4,
    "mgpa": 3.84,
    "verbal": 35,
    "quant": 40,
    "ugpa": 3.4
  },
  {
    "school": 4,
    "mgpa": 3.5,
    "verbal": 18,
    "quant": 20,
    "ugpa": 3.1
  },
  {
    "school": 4,
    "mgpa": 3.11,
    "verbal": 25,
    "quant": 24,
    "ugpa": 2.9
  },
  {
    "school": 4,
    "mgpa": 3.52,
    "verbal": 26,
    "quant": 24,
    "ugpa": 3.1
  },
  {
    "school": 4,
    "mgpa": 3.2,
    "verbal": 24,
    "quant": 31,
    "ugpa": 2
  },
  {
    "school": 4,
    "mgpa": 3.88,
    "verbal": 34,
    "quant": 27,
    "ugpa": 3.5
  },
  {
    "school": 4,
    "mgpa": 3.11,
    "verbal": 29,
    "quant": 31,
    "ugpa": 3.3
  },
  {
    "school": 4,
    "mgpa": 3,
    "verbal": 39,
    "quant": 17,
    "ugpa": 3.8
  },
  {
    "school": 4,
    "mgpa": 3.14,
    "verbal": 28,
    "quant": 23,
    "ugpa": 2.9
  },
  {
    "school": 4,
    "mgpa": 3.26,
    "verbal": 38,
    "quant": 27,
    "ugpa": 2.4
  },
  {
    "school": 4,
    "mgpa": 3,
    "verbal": 19,
    "quant": 22,
    "ugpa": 2.4
  },
  {
    "school": 4,
    "mgpa": 2.88,
    "verbal": 33,
    "quant": 35,
    "ugpa": 1.1
  },
  {
    "school": 4,
    "mgpa": 3,
    "verbal": 21,
    "quant": 37,
    "ugpa": 2.1
  },
  {
    "school": 4,
    "mgpa": 2.57,
    "verbal": 20,
    "quant": 25,
    "ugpa": 2.9
  },
  {
    "school": 4,
    "mgpa": 4,
    "verbal": 44,
    "quant": 39,
    "ugpa": 3.5
  },
  {
    "school": 4,
    "mgpa": 3,
    "verbal": 21,
    "quant": 20,
    "ugpa": 3.2
  },
  {
    "school": 4,
    "mgpa": 2.74,
    "verbal": 32,
    "quant": 33,
    "ugpa": 2.1
  },
  {
    "school": 4,
    "mgpa": 3.36,
    "verbal": 32,
    "quant": 31,
    "ugpa": 3.1
  },
  {
    "school": 4,
    "mgpa": 3,
    "verbal": 30,
    "quant": 25,
    "ugpa": 2.7
  },
  {
    "school": 4,
    "mgpa": 3,
    "verbal": 32,
    "quant": 20,
    "ugpa": 3
  },
  {
    "school": 4,
    "mgpa": 3.59,
    "verbal": 40,
    "quant": 30,
    "ugpa": 3
  },
  {
    "school": 4,
    "mgpa": 2.88,
    "verbal": 33,
    "quant": 35,
    "ugpa": 2.3
  },
  {
    "school": 4,
    "mgpa": 3.42,
    "verbal": 23,
    "quant": 24,
    "ugpa": 3.3
  },
  {
    "school": 4,
    "mgpa": 3.5,
    "verbal": 39,
    "quant": 28,
    "ugpa": 3.9
  },
  {
    "school": 4,
    "mgpa": 2.89,
    "verbal": 34,
    "quant": 32,
    "ugpa": 2.8
  },
  {
    "school": 4,
    "mgpa": 4,
    "verbal": 33,
    "quant": 35,
    "ugpa": 2
  },
  {
    "school": 4,
    "mgpa": 3.5,
    "verbal": 38,
    "quant": 30,
    "ugpa": 3.2
  },
  {
    "school": 4,
    "mgpa": 4,
    "verbal": 22,
    "quant": 17,
    "ugpa": 2.8
  },
  {
    "school": 4,
    "mgpa": 3.82,
    "verbal": 18,
    "quant": 37,
    "ugpa": 3.7
  },
  {
    "school": 4,
    "mgpa": 3.16,
    "verbal": 26,
    "quant": 21,
    "ugpa": 3
  },
  {
    "school": 4,
    "mgpa": 3.37,
    "verbal": 37,
    "quant": 36,
    "ugpa": 2.8
  },
  {
    "school": 4,
    "mgpa": 3.58,
    "verbal": 37,
    "quant": 32,
    "ugpa": 2.1
  },
  {
    "school": 4,
    "mgpa": 3,
    "verbal": 30,
    "quant": 24,
    "ugpa": 2.9
  },
  {
    "school": 4,
    "mgpa": 3.33,
    "verbal": 37,
    "quant": 33,
    "ugpa": 3.4
  },
  {
    "school": 4,
    "mgpa": 3.5,
    "verbal": 25,
    "quant": 23,
    "ugpa": 2.7
  },
  {
    "school": 4,
    "mgpa": 3.19,
    "verbal": 27,
    "quant": 21,
    "ugpa": 2.8
  },
  {
    "school": 4,
    "mgpa": 3.59,
    "verbal": 31,
    "quant": 37,
    "ugpa": 3.3
  },
  {
    "school": 4,
    "mgpa": 3,
    "verbal": 33,
    "quant": 30,
    "ugpa": 2.9
  },
  {
    "school": 4,
    "mgpa": 3.29,
    "verbal": 31,
    "quant": 27,
    "ugpa": 2.9
  },
  {
    "school": 4,
    "mgpa": 3.26,
    "verbal": 31,
    "quant": 29,
    "ugpa": 3.5
  },
  {
    "school": 4,
    "mgpa": 2.83,
    "verbal": 30,
    "quant": 15,
    "ugpa": 3.1
  },
  {
    "school": 4,
    "mgpa": 3.4,
    "verbal": 33,
    "quant": 26,
    "ugpa": 2.4
  },
  {
    "school": 4,
    "mgpa": 4,
    "verbal": 43,
    "quant": 39,
    "ugpa": 2.5
  },
  {
    "school": 4,
    "mgpa": 3.55,
    "verbal": 42,
    "quant": 43,
    "ugpa": 3.1
  },
  {
    "school": 4,
    "mgpa": 3.87,
    "verbal": 33,
    "quant": 39,
    "ugpa": 3.7
  },
  {
    "school": 4,
    "mgpa": 3.56,
    "verbal": 35,
    "quant": 37,
    "ugpa": 2.8
  },
  {
    "school": 4,
    "mgpa": 2.83,
    "verbal": 21,
    "quant": 16,
    "ugpa": 2.5
  },
  {
    "school": 4,
    "mgpa": 3.83,
    "verbal": 20,
    "quant": 15,
    "ugpa": 3.4
  },
  {
    "school": 4,
    "mgpa": 3,
    "verbal": 26,
    "quant": 25,
    "ugpa": 2.7
  },
  {
    "school": 4,
    "mgpa": 2.84,
    "verbal": 33,
    "quant": 26,
    "ugpa": 2.6
  },
  {
    "school": 4,
    "mgpa": 3.17,
    "verbal": 27,
    "quant": 24,
    "ugpa": 2.7
  },
  {
    "school": 4,
    "mgpa": 3.53,
    "verbal": 28,
    "quant": 23,
    "ugpa": 2.8
  },
  {
    "school": 4,
    "mgpa": 3.55,
    "verbal": 31,
    "quant": 30,
    "ugpa": 2.3
  },
  {
    "school": 4,
    "mgpa": 4,
    "verbal": 28,
    "quant": 30,
    "ugpa": 3.2
  },
  {
    "school": 4,
    "mgpa": 3.36,
    "verbal": 26,
    "quant": 27,
    "ugpa": 2.8
  },
  {
    "school": 4,
    "mgpa": 3.55,
    "verbal": 26,
    "quant": 32,
    "ugpa": 3.3
  },
  {
    "school": 4,
    "mgpa": 3.25,
    "verbal": 24,
    "quant": 22,
    "ugpa": 3
  },
  {
    "school": 4,
    "mgpa": 3.23,
    "verbal": 16,
    "quant": 26,
    "ugpa": 2.6
  },
  {
    "school": 4,
    "mgpa": 3.53,
    "verbal": 37,
    "quant": 32,
    "ugpa": 2
  },
  {
    "school": 4,
    "mgpa": 3.33,
    "verbal": 20,
    "quant": 29,
    "ugpa": 3
  },
  {
    "school": 4,
    "mgpa": 3.36,
    "verbal": 29,
    "quant": 28,
    "ugpa": 1.9
  },
  {
    "school": 4,
    "mgpa": 2.73,
    "verbal": 7,
    "quant": 20,
    "ugpa": 2.3
  },
  {
    "school": 4,
    "mgpa": 3.5,
    "verbal": 28,
    "quant": 24,
    "ugpa": 3.2
  },
  {
    "school": 4,
    "mgpa": 3.5,
    "verbal": 34,
    "quant": 28,
    "ugpa": 3.6
  },
  {
    "school": 4,
    "mgpa": 3.5,
    "verbal": 25,
    "quant": 25,
    "ugpa": 2.3
  },
  {
    "school": 5,
    "mgpa": 3.3,
    "verbal": 24,
    "quant": 39,
    "ugpa": 3.68
  },
  {
    "school": 5,
    "mgpa": 3.25,
    "verbal": 34,
    "quant": 33,
    "ugpa": 3.16
  },
  {
    "school": 5,
    "mgpa": 2.65,
    "verbal": 37,
    "quant": 31,
    "ugpa": 3.07
  },
  {
    "school": 5,
    "mgpa": 2.2,
    "verbal": 36,
    "quant": 34,
    "ugpa": 3.82
  },
  {
    "school": 5,
    "mgpa": 3.06,
    "verbal": 25,
    "quant": 38,
    "ugpa": 2.89
  },
  {
    "school": 5,
    "mgpa": 3.41,
    "verbal": 33,
    "quant": 30,
    "ugpa": 2.79
  },
  {
    "school": 5,
    "mgpa": 2.8,
    "verbal": 36,
    "quant": 32,
    "ugpa": 3.47
  },
  {
    "school": 5,
    "mgpa": 2.69,
    "verbal": 32,
    "quant": 28,
    "ugpa": 2.83
  },
  {
    "school": 5,
    "mgpa": 3.51,
    "verbal": 41,
    "quant": 34,
    "ugpa": 3.61
  },
  {
    "school": 5,
    "mgpa": 3.1,
    "verbal": 41,
    "quant": 49,
    "ugpa": 3.31
  },
  {
    "school": 5,
    "mgpa": 2.15,
    "verbal": 39,
    "quant": 35,
    "ugpa": 2.97
  },
  {
    "school": 5,
    "mgpa": 3.3,
    "verbal": 36,
    "quant": 35,
    "ugpa": 3.83
  },
  {
    "school": 5,
    "mgpa": 3.71,
    "verbal": 27,
    "quant": 31,
    "ugpa": 3.7
  },
  {
    "school": 5,
    "mgpa": 3.55,
    "verbal": 38,
    "quant": 30,
    "ugpa": 3.42
  },
  {
    "school": 5,
    "mgpa": 3.54,
    "verbal": 34,
    "quant": 47,
    "ugpa": 3.12
  },
  {
    "school": 5,
    "mgpa": 3.33,
    "verbal": 34,
    "quant": 36,
    "ugpa": 3.23
  },
  {
    "school": 5,
    "mgpa": 3.44,
    "verbal": 38,
    "quant": 32,
    "ugpa": 3.5
  },
  {
    "school": 5,
    "mgpa": 3.11,
    "verbal": 31,
    "quant": 47,
    "ugpa": 3.36
  },
  {
    "school": 5,
    "mgpa": 3.31,
    "verbal": 33,
    "quant": 34,
    "ugpa": 3.4
  },
  {
    "school": 5,
    "mgpa": 3.2,
    "verbal": 36,
    "quant": 32,
    "ugpa": 2.86
  },
  {
    "school": 5,
    "mgpa": 3.71,
    "verbal": 40,
    "quant": 41,
    "ugpa": 3.42
  },
  {
    "school": 5,
    "mgpa": 3.75,
    "verbal": 33,
    "quant": 37,
    "ugpa": 2.94
  },
  {
    "school": 5,
    "mgpa": 2.2,
    "verbal": 15,
    "quant": 40,
    "ugpa": 2.68
  },
  {
    "school": 5,
    "mgpa": 2.6,
    "verbal": 30,
    "quant": 26,
    "ugpa": 3.33
  },
  {
    "school": 5,
    "mgpa": 3.13,
    "verbal": 45,
    "quant": 33,
    "ugpa": 3.12
  },
  {
    "school": 5,
    "mgpa": 2.89,
    "verbal": 42,
    "quant": 28,
    "ugpa": 3.14
  },
  {
    "school": 5,
    "mgpa": 2.85,
    "verbal": 33,
    "quant": 24,
    "ugpa": 3.19
  },
  {
    "school": 5,
    "mgpa": 3.9,
    "verbal": 41,
    "quant": 35,
    "ugpa": 3.07
  },
  {
    "school": 5,
    "mgpa": 2.5,
    "verbal": 36,
    "quant": 30,
    "ugpa": 3.36
  },
  {
    "school": 5,
    "mgpa": 3.09,
    "verbal": 34,
    "quant": 30,
    "ugpa": 3.75
  },
  {
    "school": 5,
    "mgpa": 3.92,
    "verbal": 34,
    "quant": 33,
    "ugpa": 3.09
  },
  {
    "school": 5,
    "mgpa": 3.65,
    "verbal": 37,
    "quant": 31,
    "ugpa": 3.88
  },
  {
    "school": 5,
    "mgpa": 3.88,
    "verbal": 31,
    "quant": 38,
    "ugpa": 2.66
  },
  {
    "school": 5,
    "mgpa": 3.26,
    "verbal": 31,
    "quant": 29,
    "ugpa": 3.38
  },
  {
    "school": 5,
    "mgpa": 3.75,
    "verbal": 41,
    "quant": 43,
    "ugpa": 3.39
  },
  {
    "school": 5,
    "mgpa": 3.1,
    "verbal": 38,
    "quant": 32,
    "ugpa": 3.39
  },
  {
    "school": 5,
    "mgpa": 3.01,
    "verbal": 28,
    "quant": 30,
    "ugpa": 2.95
  },
  {
    "school": 5,
    "mgpa": 3.24,
    "verbal": 41,
    "quant": 40,
    "ugpa": 3.15
  },
  {
    "school": 5,
    "mgpa": 3.5,
    "verbal": 33,
    "quant": 30,
    "ugpa": 3.39
  },
  {
    "school": 5,
    "mgpa": 2.75,
    "verbal": 35,
    "quant": 32,
    "ugpa": 3.3
  },
  {
    "school": 5,
    "mgpa": 3.35,
    "verbal": 33,
    "quant": 40,
    "ugpa": 3.02
  },
  {
    "school": 5,
    "mgpa": 1.9,
    "verbal": 38,
    "quant": 26,
    "ugpa": 2.9
  },
  {
    "school": 5,
    "mgpa": 3.1,
    "verbal": 25,
    "quant": 39,
    "ugpa": 3.53
  },
  {
    "school": 5,
    "mgpa": 2.75,
    "verbal": 31,
    "quant": 31,
    "ugpa": 3.34
  },
  {
    "school": 5,
    "mgpa": 2.25,
    "verbal": 23,
    "quant": 26,
    "ugpa": 2.66
  },
  {
    "school": 5,
    "mgpa": 2.25,
    "verbal": 34,
    "quant": 33,
    "ugpa": 3
  },
  {
    "school": 5,
    "mgpa": 3.6,
    "verbal": 29,
    "quant": 43,
    "ugpa": 3.73
  },
  {
    "school": 5,
    "mgpa": 3.28,
    "verbal": 24,
    "quant": 23,
    "ugpa": 3.77
  },
  {
    "school": 5,
    "mgpa": 3.41,
    "verbal": 33,
    "quant": 36,
    "ugpa": 3.47
  },
  {
    "school": 5,
    "mgpa": 3.2,
    "verbal": 41,
    "quant": 26,
    "ugpa": 2.73
  },
  {
    "school": 5,
    "mgpa": 2.95,
    "verbal": 31,
    "quant": 29,
    "ugpa": 2.88
  },
  {
    "school": 5,
    "mgpa": 3,
    "verbal": 31,
    "quant": 33,
    "ugpa": 3.53
  },
  {
    "school": 5,
    "mgpa": 2.95,
    "verbal": 33,
    "quant": 38,
    "ugpa": 3.11
  },
  {
    "school": 5,
    "mgpa": 3.4,
    "verbal": 33,
    "quant": 35,
    "ugpa": 2.78
  },
  {
    "school": 5,
    "mgpa": 2.85,
    "verbal": 34,
    "quant": 31,
    "ugpa": 3.32
  },
  {
    "school": 5,
    "mgpa": 2.65,
    "verbal": 32,
    "quant": 35,
    "ugpa": 2.76
  },
  {
    "school": 5,
    "mgpa": 2.85,
    "verbal": 30,
    "quant": 24,
    "ugpa": 3.71
  },
  {
    "school": 5,
    "mgpa": 2.6,
    "verbal": 35,
    "quant": 32,
    "ugpa": 3.21
  },
  {
    "school": 5,
    "mgpa": 3.15,
    "verbal": 30,
    "quant": 34,
    "ugpa": 2.62
  },
  {
    "school": 5,
    "mgpa": 3.51,
    "verbal": 39,
    "quant": 29,
    "ugpa": 2.83
  },
  {
    "school": 5,
    "mgpa": 3.47,
    "verbal": 32,
    "quant": 37,
    "ugpa": 3.79
  },
  {
    "school": 5,
    "mgpa": 3.35,
    "verbal": 37,
    "quant": 40,
    "ugpa": 3.55
  },
  {
    "school": 5,
    "mgpa": 3.6,
    "verbal": 45,
    "quant": 46,
    "ugpa": 3.07
  },
  {
    "school": 5,
    "mgpa": 3.85,
    "verbal": 28,
    "quant": 31,
    "ugpa": 3.26
  },
  {
    "school": 5,
    "mgpa": 2.8,
    "verbal": 34,
    "quant": 38,
    "ugpa": 2.95
  },
  {
    "school": 5,
    "mgpa": 2.5,
    "verbal": 32,
    "quant": 26,
    "ugpa": 2.72
  },
  {
    "school": 5,
    "mgpa": 3.9,
    "verbal": 42,
    "quant": 35,
    "ugpa": 3.79
  },
  {
    "school": 5,
    "mgpa": 3.11,
    "verbal": 36,
    "quant": 37,
    "ugpa": 3.1
  },
  {
    "school": 5,
    "mgpa": 2.76,
    "verbal": 36,
    "quant": 26,
    "ugpa": 3.42
  },
  {
    "school": 5,
    "mgpa": 3.68,
    "verbal": 40,
    "quant": 45,
    "ugpa": 3.38
  },
  {
    "school": 5,
    "mgpa": 3.56,
    "verbal": 37,
    "quant": 33,
    "ugpa": 3.49
  },
  {
    "school": 5,
    "mgpa": 3.3,
    "verbal": 34,
    "quant": 40,
    "ugpa": 3.12
  },
  {
    "school": 5,
    "mgpa": 2.55,
    "verbal": 33,
    "quant": 26,
    "ugpa": 3.72
  },
  {
    "school": 5,
    "mgpa": 2.95,
    "verbal": 38,
    "quant": 27,
    "ugpa": 3.2
  },
  {
    "school": 5,
    "mgpa": 3.56,
    "verbal": 28,
    "quant": 34,
    "ugpa": 3.3
  },
  {
    "school": 5,
    "mgpa": 3.17,
    "verbal": 29,
    "quant": 33,
    "ugpa": 2.41
  },
  {
    "school": 5,
    "mgpa": 3,
    "verbal": 37,
    "quant": 29,
    "ugpa": 3.46
  },
  {
    "school": 5,
    "mgpa": 2.5,
    "verbal": 18,
    "quant": 23,
    "ugpa": 3.4
  },
  {
    "school": 5,
    "mgpa": 2.5,
    "verbal": 38,
    "quant": 34,
    "ugpa": 3.41
  },
  {
    "school": 5,
    "mgpa": 2.45,
    "verbal": 33,
    "quant": 35,
    "ugpa": 3.18
  },
  {
    "school": 5,
    "mgpa": 3.14,
    "verbal": 35,
    "quant": 28,
    "ugpa": 3.51
  },
  {
    "school": 5,
    "mgpa": 3.49,
    "verbal": 34,
    "quant": 42,
    "ugpa": 3.5
  },
  {
    "school": 5,
    "mgpa": 2.2,
    "verbal": 24,
    "quant": 28,
    "ugpa": 3.01
  },
  {
    "school": 5,
    "mgpa": 3.15,
    "verbal": 35,
    "quant": 29,
    "ugpa": 3.13
  },
  {
    "school": 5,
    "mgpa": 2.45,
    "verbal": 28,
    "quant": 23,
    "ugpa": 3.05
  },
  {
    "school": 5,
    "mgpa": 2.92,
    "verbal": 33,
    "quant": 28,
    "ugpa": 3.19
  },
  {
    "school": 5,
    "mgpa": 2.35,
    "verbal": 35,
    "quant": 35,
    "ugpa": 3.39
  },
  {
    "school": 5,
    "mgpa": 3.97,
    "verbal": 44,
    "quant": 48,
    "ugpa": 3.45
  },
  {
    "school": 5,
    "mgpa": 2.81,
    "verbal": 27,
    "quant": 41,
    "ugpa": 3.47
  },
  {
    "school": 5,
    "mgpa": 3.05,
    "verbal": 36,
    "quant": 31,
    "ugpa": 3.57
  },
  {
    "school": 5,
    "mgpa": 2.65,
    "verbal": 25,
    "quant": 41,
    "ugpa": 2.92
  },
  {
    "school": 5,
    "mgpa": 2.1,
    "verbal": 30,
    "quant": 28,
    "ugpa": 2.58
  },
  {
    "school": 5,
    "mgpa": 2.45,
    "verbal": 28,
    "quant": 28,
    "ugpa": 2.59
  },
  {
    "school": 5,
    "mgpa": 3.4,
    "verbal": 40,
    "quant": 35,
    "ugpa": 3.51
  },
  {
    "school": 5,
    "mgpa": 3.52,
    "verbal": 33,
    "quant": 31,
    "ugpa": 3.37
  },
  {
    "school": 5,
    "mgpa": 3.35,
    "verbal": 38,
    "quant": 37,
    "ugpa": 3.44
  },
  {
    "school": 5,
    "mgpa": 3.35,
    "verbal": 31,
    "quant": 26,
    "ugpa": 2.77
  },
  {
    "school": 5,
    "mgpa": 2.96,
    "verbal": 39,
    "quant": 44,
    "ugpa": 2.67
  },
  {
    "school": 5,
    "mgpa": 2.6,
    "verbal": 40,
    "quant": 30,
    "ugpa": 3.41
  },
  {
    "school": 5,
    "mgpa": 3.56,
    "verbal": 46,
    "quant": 49,
    "ugpa": 3.31
  },
  {
    "school": 5,
    "mgpa": 3.1,
    "verbal": 35,
    "quant": 36,
    "ugpa": 2.95
  },
  {
    "school": 5,
    "mgpa": 2.55,
    "verbal": 37,
    "quant": 35,
    "ugpa": 2.49
  },
  {
    "school": 5,
    "mgpa": 2.6,
    "verbal": 37,
    "quant": 25,
    "ugpa": 3.15
  },
  {
    "school": 5,
    "mgpa": 3.28,
    "verbal": 25,
    "quant": 43,
    "ugpa": 2.9
  },
  {
    "school": 5,
    "mgpa": 2.7,
    "verbal": 31,
    "quant": 32,
    "ugpa": 2.93
  },
  {
    "school": 5,
    "mgpa": 2.3,
    "verbal": 26,
    "quant": 27,
    "ugpa": 3.35
  },
  {
    "school": 5,
    "mgpa": 3.47,
    "verbal": 33,
    "quant": 32,
    "ugpa": 2.57
  },
  {
    "school": 5,
    "mgpa": 3.8,
    "verbal": 38,
    "quant": 30,
    "ugpa": 3.54
  },
  {
    "school": 5,
    "mgpa": 2.7,
    "verbal": 24,
    "quant": 38,
    "ugpa": 3.6
  },
  {
    "school": 5,
    "mgpa": 2.8,
    "verbal": 30,
    "quant": 31,
    "ugpa": 3.19
  },
  {
    "school": 5,
    "mgpa": 3.73,
    "verbal": 41,
    "quant": 38,
    "ugpa": 3.38
  },
  {
    "school": 5,
    "mgpa": 3.87,
    "verbal": 28,
    "quant": 32,
    "ugpa": 2.77
  },
  {
    "school": 5,
    "mgpa": 3.25,
    "verbal": 32,
    "quant": 40,
    "ugpa": 3.4
  },
  {
    "school": 5,
    "mgpa": 3.28,
    "verbal": 34,
    "quant": 32,
    "ugpa": 2.57
  },
  {
    "school": 5,
    "mgpa": 3.32,
    "verbal": 39,
    "quant": 34,
    "ugpa": 3.73
  }
];
