import type { sciboQuestion } from "./app/_components/quiz";

export const exampleData: sciboQuestion[] = [
  {
    bonus: false,
    number: 1,
    topic: "biology",
    type: "shortAnswer",
    question:
      "What is the most common term used in genetics to describe theobservable physical characteristics of an organism caused by the expression of a gene or set ofgenes?",
    answer: "PHENOTYPE",
    htmlUrl:
      "https://science.osti.gov/-/media/wdts/nsb/pdf/HS-Sample-Questions/Sample-Set-1/round1.pdf#page=1",
    originalText:
      "TOSS-UP1) BIOLOGY Short Answer What is the most common term used in genetics to describe theobservable physical characteristics of an organism caused by the expression of a gene or set ofgenes?ANSWER: PHENOTYPE",
  },
  {
    bonus: true,
    number: 1,
    topic: "biology",
    type: "shortAnswer",
    question:
      "What is the biological term most often used for the act of a cellengulfing a particle by extending its pseudopodia (read as: SU-doe-POH-dee-ah) atheparticle?",
    answer: "PHAGOCYTOSIS",
    htmlUrl:
      "https://science.osti.gov/-/media/wdts/nsb/pdf/HS-Sample-Questions/Sample-Set-1/round1.pdf#page=1",
    originalText:
      "BONUS1) BIOLOGY Short Answer What is the biological term most often used for the act of a cellengulfing a particle by extending its pseudopodia (read as: SU-doe-POH-dee-ah) atheparticle?ANSWER: PHAGOCYTOSIS",
  },
  {
    bonus: false,
    number: 2,
    topic: "chemistry",
    type: "multipleChoice",
    question:
      "An aqueous solution in which the concentration of OH– ions isgreater than that of H+ ions is:",
    answer: [
      { answer: "basic", letter: "W", correct: true },
      { answer: "acidic", letter: "X", correct: false },
      { answer: "neutral", letter: "Y", correct: false },
      { answer: "in equilibrium", letter: "Z", correct: false },
    ],
    htmlUrl:
      "https://science.osti.gov/-/media/wdts/nsb/pdf/HS-Sample-Questions/Sample-Set-1/round1.pdf#page=1",
    originalText:
      "TOSS-UP2) CHEMISTRY Multiple Choice An aqueous solution in which the concentration of OH– ions isgreater than that of H+ ions is:W) basicX) acidicY) neutralZ) in equilibriumANSWER: W) BASIC",
  },
  {
    bonus: true,
    number: 2,
    topic: "chemistry",
    type: "shortAnswer",
    question:
      "Find the mass of 1 mole of cuprous oxide, or Cu 2 O. Assume theatomic mass of copper is 64 and oxygen is 16.",
    answer: "144",
    htmlUrl:
      "https://science.osti.gov/-/media/wdts/nsb/pdf/HS-Sample-Questions/Sample-Set-1/round1.pdf#page=1",
    originalText:
      "BONUS2) CHEMISTRY Short Answer Find the mass of 1 mole of cuprous oxide, or Cu 2 O. Assume theatomic mass of copper is 64 and oxygen is 16.ANSWER: 144",
  },
  {
    bonus: false,
    number: 3,
    topic: "physics",
    type: "shortAnswer",
    question:
      "What property of a sound wave is most commonly associated withloudness?",
    answer: "AMPLITUDE",
    htmlUrl:
      "https://science.osti.gov/-/media/wdts/nsb/pdf/HS-Sample-Questions/Sample-Set-1/round1.pdf#page=2",
    originalText:
      "TOSS-UP3) PHYSICS Short Answer What property of a sound wave is most commonly associated withloudness?ANSWER: AMPLITUDE",
  },
  {
    bonus: true,
    number: 3,
    topic: "physics",
    type: "shortAnswer",
    question:
      "What is the MOST common term for the behavior of light where itappears to bend asmall obstacles or the spreading out of waves as light passes throughpinholes or slits?",
    answer: "DIFFRACTION",
    htmlUrl:
      "https://science.osti.gov/-/media/wdts/nsb/pdf/HS-Sample-Questions/Sample-Set-1/round1.pdf#page=2",
    originalText:
      "BONUS3) PHYSICS Short Answer What is the MOST common term for the behavior of light where itappears to bend asmall obstacles or the spreading out of waves as light passes throughpinholes or slits?ANSWER: DIFFRACTION",
  },
  {
    bonus: false,
    number: 4,
    topic: "math",
    type: "shortAnswer",
    question:
      "What term BEST describes 2 angles with 90º as the sum of theirmeasurements?",
    answer: "COMPLEMENTARY",
    htmlUrl:
      "https://science.osti.gov/-/media/wdts/nsb/pdf/HS-Sample-Questions/Sample-Set-1/round1.pdf#page=2",
    originalText:
      "TOSS-UP4) MATH Short Answer What term BEST describes 2 angles with 90º as the sum of theirmeasurements?ANSWER: COMPLEMENTARY",
  },
  {
    bonus: true,
    number: 4,
    topic: "math",
    type: "shortAnswer",
    question:
      "Divide the following and give your answer in scientific notation:2147)104(108××",
    answer: "4 × 10 5",
    htmlUrl:
      "https://science.osti.gov/-/media/wdts/nsb/pdf/HS-Sample-Questions/Sample-Set-1/round1.pdf#page=2",
    originalText:
      "BONUS4) MATH Short Answer Divide the following and give your answer in scientific notation:2147)104(108××ANSWER: 4 × 10 5",
  },
  {
    bonus: false,
    number: 5,
    topic: "earth science",
    type: "multipleChoice",
    question:
      "The overall charge at the top and bottom, respectively, of atowering cumulonimbus cloud during a thunderstorm is:",
    answer: [
      { answer: "positive, positive", letter: "W", correct: false },
      { answer: "positive, negative", letter: "X", correct: true },
      { answer: "negative, positive", letter: "Y", correct: false },
      { answer: "negative, negative", letter: "Z", correct: false },
    ],
    htmlUrl:
      "https://science.osti.gov/-/media/wdts/nsb/pdf/HS-Sample-Questions/Sample-Set-1/round1.pdf#page=3",
    originalText:
      "TOSS-UP5) EARTH SCIENCE Multiple Choice The overall charge at the top and bottom, respectively, of atowering cumulonimbus cloud during a thunderstorm is:W) positive, positiveX) positive, negativeY) negative, positiveZ) negative, negativeANSWER: X) POSITIVE, NEGATIVE",
  },
  {
    bonus: true,
    number: 5,
    topic: "earth science",
    type: "multipleChoice",
    question:
      "A lightning bolt is seen and its accompanying thunder isheard 15 seconds later. This means the storm is most likely how many miles away:",
    answer: [
      { answer: "3", letter: "W", correct: true },
      { answer: "6", letter: "X", correct: false },
      { answer: "9", letter: "Y", correct: false },
      { answer: "15", letter: "Z", correct: false },
    ],
    htmlUrl:
      "https://science.osti.gov/-/media/wdts/nsb/pdf/HS-Sample-Questions/Sample-Set-1/round1.pdf#page=3",
    originalText:
      "BONUS5) EARTH SCIENCE Multiple Choice A lightning bolt is seen and its accompanying thunder isheard 15 seconds later. This means the storm is most likely how many miles away:W) 3X) 6Y) 9Z) 15ANSWER: W) 3",
  },
  {
    bonus: false,
    number: 6,
    topic: "general science",
    type: "shortAnswer",
    question: "How many significant figures are in the number 0.00750?",
    answer: "3",
    htmlUrl:
      "https://science.osti.gov/-/media/wdts/nsb/pdf/HS-Sample-Questions/Sample-Set-1/round1.pdf#page=3",
    originalText:
      "TOSS-UP6) GENERAL SCIENCE Short Answer How many significant figures are in the number 0.00750?ANSWER: 3",
  },
  {
    bonus: true,
    number: 6,
    topic: "general science",
    type: "shortAnswer",
    question:
      "Subtract the following 2 numbers and give your answerwith the proper significant figures: 25.101 – 0.9608",
    answer: "24.140",
    htmlUrl:
      "https://science.osti.gov/-/media/wdts/nsb/pdf/HS-Sample-Questions/Sample-Set-1/round1.pdf#page=3",
    originalText:
      "BONUS6) GENERAL SCIENCE Short Answer Subtract the following 2 numbers and give your answerwith the proper significant figures: 25.101 – 0.9608ANSWER: 24.140",
  },
  {
    bonus: false,
    number: 7,
    topic: "astronomy",
    type: "shortAnswer",
    question:
      "What is the proper name of the star that is most commonly notedto have coordinates closest to the north celestial pole?",
    answer: "NORTH STAR (ACCEPT: POLARIS or ALPHA URSA MINORIS)",
    htmlUrl:
      "https://science.osti.gov/-/media/wdts/nsb/pdf/HS-Sample-Questions/Sample-Set-1/round1.pdf#page=4",
    originalText:
      "TOSS-UP7) ASTRONOMY Short Answer What is the proper name of the star that is most commonly notedto have coordinates closest to the north celestial pole?ANSWER: NORTH STAR (ACCEPT: POLARIS or ALPHA URSA MINORIS)",
  },
  {
    bonus: true,
    number: 7,
    topic: "astronomy",
    type: "shortAnswer",
    question: "What is the most well-known asterism in Ursa Major?",
    answer: "BIG DIPPER",
    htmlUrl:
      "https://science.osti.gov/-/media/wdts/nsb/pdf/HS-Sample-Questions/Sample-Set-1/round1.pdf#page=4",
    originalText:
      "BONUS7) ASTRONOMY Short Answer What is the most well-known asterism in Ursa Major?ANSWER: BIG DIPPER",
  },
  {
    bonus: false,
    number: 8,
    topic: "biology",
    type: "multipleChoice",
    question:
      "Human epidermis is mostly composed of which of the followingbasic animal tissues types:",
    answer: [
      { answer: "epithelial", letter: "W", correct: true },
      { answer: "connective", letter: "X", correct: false },
      { answer: "nervous", letter: "Y", correct: false },
      { answer: "muscle", letter: "Z", correct: false },
    ],
    htmlUrl:
      "https://science.osti.gov/-/media/wdts/nsb/pdf/HS-Sample-Questions/Sample-Set-1/round1.pdf#page=4",
    originalText:
      "TOSS-UP8) BIOLOGY Multiple Choice Human epidermis is mostly composed of which of the followingbasic animal tissues types:W) epithelialX) connectiveY) nervousZ) muscleANSWER: W) EPITHELIAL",
  },
  {
    bonus: true,
    number: 8,
    topic: "biology",
    type: "shortAnswer",
    question: "What are the 2 basic categories of lymphocyte cells?",
    answer: "T AND B (ACCEPT: B AND T CELLS)",
    htmlUrl:
      "https://science.osti.gov/-/media/wdts/nsb/pdf/HS-Sample-Questions/Sample-Set-1/round1.pdf#page=4",
    originalText:
      "BONUS8) BIOLOGY Short Answer What are the 2 basic categories of lymphocyte cells?ANSWER: T AND B (ACCEPT: B AND T CELLS)",
  },
  {
    bonus: false,
    number: 9,
    topic: "chemistry",
    type: "shortAnswer",
    question:
      "What general type of bonding is found in molecules in whichelectrons are shared by nuclei?",
    answer: "COVALENT",
    htmlUrl:
      "https://science.osti.gov/-/media/wdts/nsb/pdf/HS-Sample-Questions/Sample-Set-1/round1.pdf#page=5",
    originalText:
      "TOSS-UP9) CHEMISTRY Short Answer What general type of bonding is found in molecules in whichelectrons are shared by nuclei?ANSWER: COVALENT",
  },
  {
    bonus: true,
    number: 9,
    topic: "chemistry",
    type: "shortAnswer",
    question:
      "Name all of the following 4 processes where latent heat isabsorbed: evaporation; condensation; water melts; water freezes",
    answer: "EVAPORATION; WATER MELTS",
    htmlUrl:
      "https://science.osti.gov/-/media/wdts/nsb/pdf/HS-Sample-Questions/Sample-Set-1/round1.pdf#page=5",
    originalText:
      "BONUS9) CHEMISTRY Short Answer Name all of the following 4 processes where latent heat isabsorbed: evaporation; condensation; water melts; water freezesANSWER: EVAPORATION; WATER MELTS",
  },
  {
    bonus: false,
    number: 10,
    topic: "physics",
    type: "shortAnswer",
    question:
      "Although not known as such at the time, what was the first form ofspectacular electric discharge seen by humans?",
    answer: "LIGHTNING",
    htmlUrl:
      "https://science.osti.gov/-/media/wdts/nsb/pdf/HS-Sample-Questions/Sample-Set-1/round1.pdf#page=5",
    originalText:
      "TOSS-UP10) PHYSICS Short Answer Although not known as such at the time, what was the first form ofspectacular electric discharge seen by humans?ANSWER: LIGHTNING",
  },
  {
    bonus: true,
    number: 10,
    topic: "physics",
    type: "multipleChoice",
    question:
      "A constant force acting on a body experiencing no change in itsenvironment will give the body:",
    answer: [
      { answer: "constant acceleration", letter: "W", correct: true },
      { answer: "constant speed", letter: "X", correct: false },
      { answer: "constant velocity", letter: "Y", correct: false },
      { answer: "zero acceleration", letter: "Z", correct: false },
    ],
    htmlUrl:
      "https://science.osti.gov/-/media/wdts/nsb/pdf/HS-Sample-Questions/Sample-Set-1/round1.pdf#page=5",
    originalText:
      "BONUS10) PHYSICS Multiple Choice A constant force acting on a body experiencing no change in itsenvironment will give the body:W) constant accelerationX) constant speedY) constant velocityZ) zero accelerationANSWER: W) CONSTANT ACCELERATION",
  },
  {
    bonus: false,
    number: 11,
    topic: "math",
    type: "shortAnswer",
    question:
      "Simplify the following expression, where a is not equal to zero if b = 0or if b = –1: ))(( 2 bb aa",
    answer: "bba +2",
    htmlUrl:
      "https://science.osti.gov/-/media/wdts/nsb/pdf/HS-Sample-Questions/Sample-Set-1/round1.pdf#page=6",
    originalText:
      "TOSS-UP11) MATH Short Answer Simplify the following expression, where a is not equal to zero if b = 0or if b = –1: ))(( 2 bb aaANSWER: bba +2",
  },
  {
    bonus: true,
    number: 11,
    topic: "math",
    type: "shortAnswer",
    question:
      "Giving your answer in inches and in simplest radical form, if thehypotenuse of a 45-45-90º triangle is 10 inches, find the length of the other sides:",
    answer: "5 2 (ACCEPT: BOTH 5 2 )",
    htmlUrl:
      "https://science.osti.gov/-/media/wdts/nsb/pdf/HS-Sample-Questions/Sample-Set-1/round1.pdf#page=6",
    originalText:
      "BONUS11) MATH Short Answer Giving your answer in inches and in simplest radical form, if thehypotenuse of a 45-45-90º triangle is 10 inches, find the length of the other sides:ANSWER: 5 2 (ACCEPT: BOTH 5 2 )",
  },
  {
    bonus: false,
    number: 12,
    topic: "earth science",
    type: "multipleChoice",
    question: "Which of the following is a sedimentary rock:",
    answer: [
      { answer: "slate", letter: "W", correct: false },
      { answer: "marble", letter: "X", correct: false },
      { answer: "basalt", letter: "Y", correct: false },
      { answer: "sandstone", letter: "Z", correct: true },
    ],
    htmlUrl:
      "https://science.osti.gov/-/media/wdts/nsb/pdf/HS-Sample-Questions/Sample-Set-1/round1.pdf#page=6",
    originalText:
      "TOSS-UP12) EARTH SCIENCE Multiple Choice Which of the following is a sedimentary rock:W) slateX) marbleY) basaltZ) sandstoneANSWER: Z) SANDSTONE",
  },
  {
    bonus: true,
    number: 12,
    topic: "earth science",
    type: "multipleChoice",
    question: "Which of the following is LEAST accurate aboutminerals:",
    answer: [
      {
        answer:
          "calcite has a hardness of 3 on most of its surfaces but a hardness of 4 along the crystal faceperpendicular to its long axis",
        letter: "W",
        correct: false,
      },
      {
        answer: "the Moh’s scale measures the absolute hardness of minerals",
        letter: "X",
        correct: false,
      },
      {
        answer:
          "a mineral’s chemical composition largely determines its crystal shape and cleavage pattern",
        letter: "Y",
        correct: false,
      },
      {
        answer: "a mineral’s color is the same as its streak",
        letter: "Z",
        correct: true,
      },
    ],
    htmlUrl:
      "https://science.osti.gov/-/media/wdts/nsb/pdf/HS-Sample-Questions/Sample-Set-1/round1.pdf#page=6",
    originalText:
      "BONUS12) EARTH SCIENCE Multiple Choice Which of the following is LEAST accurate aboutminerals:W) calcite has a hardness of 3 on most of its surfaces but a hardness of 4 along the crystal faceperpendicular to its long axisX) the Moh’s scale measures the absolute hardness of mineralsY) a mineral’s chemical composition largely determines its crystal shape and cleavage patternZ) a mineral’s color is the same as its streakANSWER: Z) A MINERAL’S COLOR IS THE SAME AS ITS STREAK",
  },
  {
    bonus: false,
    number: 13,
    topic: "general science",
    type: "multipleChoice",
    question:
      "Which of the following is closest to the meaning of thesuffix ‘lith’:",
    answer: [
      { answer: "outside", letter: "W", correct: false },
      { answer: "stone", letter: "X", correct: true },
      { answer: "side", letter: "Y", correct: false },
      { answer: "surface", letter: "Z", correct: false },
    ],
    htmlUrl:
      "https://science.osti.gov/-/media/wdts/nsb/pdf/HS-Sample-Questions/Sample-Set-1/round1.pdf#page=7",
    originalText:
      "TOSS-UP13) GENERAL SCIENCE Multiple Choice Which of the following is closest to the meaning of thesuffix ‘lith’:W) outsideX) stoneY) sideZ) surfaceANSWER: X) STONE",
  },
  {
    bonus: true,
    number: 13,
    topic: "general science",
    type: "shortAnswer",
    question:
      "Rounded to the nearest whole number, how many feetdoes light travel in one-billionth of one second?",
    answer: "1",
    htmlUrl:
      "https://science.osti.gov/-/media/wdts/nsb/pdf/HS-Sample-Questions/Sample-Set-1/round1.pdf#page=7",
    originalText:
      "BONUS13) GENERAL SCIENCE Short Answer Rounded to the nearest whole number, how many feetdoes light travel in one-billionth of one second?ANSWER: 1",
  },
  {
    bonus: false,
    number: 14,
    topic: "astronomy",
    type: "shortAnswer",
    question: "What star has the greatest apparent magnitude?",
    answer: "SUN",
    htmlUrl:
      "https://science.osti.gov/-/media/wdts/nsb/pdf/HS-Sample-Questions/Sample-Set-1/round1.pdf#page=7",
    originalText:
      "TOSS-UP14) ASTRONOMY Short Answer What star has the greatest apparent magnitude?ANSWER: SUN",
  },
  {
    bonus: true,
    number: 14,
    topic: "astronomy",
    type: "shortAnswer",
    question: "What planet is known to be most like Earth in size and density?",
    answer: "VENUS",
    htmlUrl:
      "https://science.osti.gov/-/media/wdts/nsb/pdf/HS-Sample-Questions/Sample-Set-1/round1.pdf#page=7",
    originalText:
      "BONUS14) ASTRONOMY Short Answer What planet is known to be most like Earth in size and density?ANSWER: VENUS",
  },
  {
    bonus: false,
    number: 15,
    topic: "biology",
    type: "shortAnswer",
    question: "How many embryonic seed leaves does a bean seedling have?",
    answer: "2",
    htmlUrl:
      "https://science.osti.gov/-/media/wdts/nsb/pdf/HS-Sample-Questions/Sample-Set-1/round1.pdf#page=8",
    originalText:
      "TOSS-UP15) BIOLOGY Short Answer How many embryonic seed leaves does a bean seedling have?ANSWER: 2",
  },
  {
    bonus: true,
    number: 15,
    topic: "biology",
    type: "shortAnswer",
    question:
      "Name all of the following 5 plants that are dicots:wheat; geranium; garlic; bamboo; rose",
    answer: "GERANIUM; ROSE",
    htmlUrl:
      "https://science.osti.gov/-/media/wdts/nsb/pdf/HS-Sample-Questions/Sample-Set-1/round1.pdf#page=8",
    originalText:
      "BONUS15) BIOLOGY Short Answer Name all of the following 5 plants that are dicots:wheat; geranium; garlic; bamboo; roseANSWER: GERANIUM; ROSE",
  },
  {
    bonus: false,
    number: 16,
    topic: "chemistry",
    type: "multipleChoice",
    question:
      "Which of the following is a metallic element, composes about5% of the Earth’s crust, oxidizes very easily, and when pure is a dark, silver-grey metal:",
    answer: [
      { answer: "cobalt", letter: "W", correct: false },
      { answer: "nickel", letter: "X", correct: false },
      { answer: "iron", letter: "Y", correct: true },
      { answer: "titanium", letter: "Z", correct: false },
    ],
    htmlUrl:
      "https://science.osti.gov/-/media/wdts/nsb/pdf/HS-Sample-Questions/Sample-Set-1/round1.pdf#page=8",
    originalText:
      "TOSS-UP16) CHEMISTRY Multiple Choice Which of the following is a metallic element, composes about5% of the Earth’s crust, oxidizes very easily, and when pure is a dark, silver-grey metal:W) cobaltX) nickelY) ironZ) titaniumANSWER: Y) IRON",
  },
  {
    bonus: true,
    number: 16,
    topic: "chemistry",
    type: "shortAnswer",
    question:
      "In general, metals are relatively hard except for what group ofmetals in the Periodic Table?",
    answer: "ONE (ACCEPT: GROUP 1A or ALKALI METALS)",
    htmlUrl:
      "https://science.osti.gov/-/media/wdts/nsb/pdf/HS-Sample-Questions/Sample-Set-1/round1.pdf#page=8",
    originalText:
      "BONUS16) CHEMISTRY Short Answer In general, metals are relatively hard except for what group ofmetals in the Periodic Table?ANSWER: ONE (ACCEPT: GROUP 1A or ALKALI METALS)",
  },
  {
    bonus: false,
    number: 17,
    topic: "physics",
    type: "multipleChoice",
    question:
      "Upon which of the following does the mass of a body MOSTdirectly depend:",
    answer: [
      { answer: "its magnetic properties", letter: "W", correct: false },
      { answer: "how much volume it has", letter: "X", correct: false },
      {
        answer: "the amount of matter it contains",
        letter: "Y",
        correct: true,
      },
      { answer: "its location", letter: "Z", correct: false },
    ],
    htmlUrl:
      "https://science.osti.gov/-/media/wdts/nsb/pdf/HS-Sample-Questions/Sample-Set-1/round1.pdf#page=9",
    originalText:
      "TOSS-UP17) PHYSICS Multiple Choice Upon which of the following does the mass of a body MOSTdirectly depend:W) its magnetic propertiesX) how much volume it hasY) the amount of matter it containsZ) its locationANSWER: Y) THE AMOUNT OF MATTER IT CONTAINS",
  },
  {
    bonus: true,
    number: 17,
    topic: "physics",
    type: "multipleChoice",
    question:
      "Mary and Joe are on a merry-go-round. Mary is seated near thecenter of rotation and Joe is on the outer edge. Which of the following BEST describes their motion:",
    answer: [
      {
        answer: "Mary has a greater acceleration than Joe",
        letter: "W",
        correct: false,
      },
      {
        answer: "Joe has a greater acceleration than Mary",
        letter: "X",
        correct: true,
      },
      {
        answer: "neither Mary nor Joe are accelerating",
        letter: "Y",
        correct: false,
      },
      {
        answer: "both Mary and Joe have the same acceleration",
        letter: "Z",
        correct: false,
      },
    ],
    htmlUrl:
      "https://science.osti.gov/-/media/wdts/nsb/pdf/HS-Sample-Questions/Sample-Set-1/round1.pdf#page=9",
    originalText:
      "BONUS17) PHYSICS Multiple Choice Mary and Joe are on a merry-go-round. Mary is seated near thecenter of rotation and Joe is on the outer edge. Which of the following BEST describes their motion:W) Mary has a greater acceleration than JoeX) Joe has a greater acceleration than MaryY) neither Mary nor Joe are acceleratingZ) both Mary and Joe have the same accelerationANSWER: X) JOE HAS A GREATER ACCELERATION THAN MARY",
  },
  {
    bonus: false,
    number: 18,
    topic: "math",
    type: "shortAnswer",
    question:
      "Giving your answer in terms of π and in inches, what is the arc-length ofa semi-circle whose diameter is 18 inches?",
    answer: "9π(Solution: C = πd; ½(18π) = 9π)",
    htmlUrl:
      "https://science.osti.gov/-/media/wdts/nsb/pdf/HS-Sample-Questions/Sample-Set-1/round1.pdf#page=9",
    originalText:
      "TOSS-UP18) MATH Short Answer Giving your answer in terms of π and in inches, what is the arc-length ofa semi-circle whose diameter is 18 inches?ANSWER: 9π(Solution: C = πd; ½(18π) = 9π)",
  },
  {
    bonus: true,
    number: 18,
    topic: "math",
    type: "shortAnswer",
    question:
      "What is the area, in square feet, of a triangle whose perpendicular heightis 20 feet with a base of 12 feet?",
    answer: "120(Solution: A = ½ bh = ½ (12)(20) = 120 ft 2 )",
    htmlUrl:
      "https://science.osti.gov/-/media/wdts/nsb/pdf/HS-Sample-Questions/Sample-Set-1/round1.pdf#page=9",
    originalText:
      "BONUS18) MATH Short Answer What is the area, in square feet, of a triangle whose perpendicular heightis 20 feet with a base of 12 feet?ANSWER: 120(Solution: A = ½ bh = ½ (12)(20) = 120 ft 2 )",
  },
  {
    bonus: false,
    number: 19,
    topic: "earth science",
    type: "multipleChoice",
    question:
      "Which of the following terms best describes the albedo ofa planet:",
    answer: [
      { answer: "electromagnetic energy", letter: "W", correct: false },
      { answer: "density", letter: "X", correct: false },
      { answer: "reflectivity", letter: "Y", correct: true },
      { answer: "absorption", letter: "Z", correct: false },
    ],
    htmlUrl:
      "https://science.osti.gov/-/media/wdts/nsb/pdf/HS-Sample-Questions/Sample-Set-1/round1.pdf#page=10",
    originalText:
      "TOSS-UP19) EARTH SCIENCE Multiple Choice Which of the following terms best describes the albedo ofa planet:W) electromagnetic energyX) densityY) reflectivityZ) absorptionANSWER: Y) REFLECTIVITY",
  },
  {
    bonus: true,
    number: 19,
    topic: "earth science",
    type: "multipleChoice",
    question:
      "Which of the following is NOT true of what occurs duringan equinox:",
    answer: [
      {
        answer: "equal length of day and night except at the poles",
        letter: "W",
        correct: false,
      },
      {
        answer: "the Earth is not tilted with respect to the ecliptic",
        letter: "X",
        correct: false,
      },
      {
        answer: "the Sun is directly overhead at the equator",
        letter: "Y",
        correct: false,
      },
      {
        answer: "the Moon is directly overhead at the poles",
        letter: "Z",
        correct: true,
      },
    ],
    htmlUrl:
      "https://science.osti.gov/-/media/wdts/nsb/pdf/HS-Sample-Questions/Sample-Set-1/round1.pdf#page=10",
    originalText:
      "BONUS19) EARTH SCIENCE Multiple Choice Which of the following is NOT true of what occurs duringan equinox:W) equal length of day and night except at the polesX) the Earth is not tilted with respect to the eclipticY) the Sun is directly overhead at the equatorZ) the Moon is directly overhead at the polesANSWER: Z) THE MOON IS DIRECTLY OVERHEAD AT THE POLES",
  },
  {
    bonus: false,
    number: 20,
    topic: "general science",
    type: "shortAnswer",
    question:
      "What gas is most directly responsible for the bends ordecompression sickness that divers may experience?",
    answer: "NITROGEN (ACCEPT: N2 )",
    htmlUrl:
      "https://science.osti.gov/-/media/wdts/nsb/pdf/HS-Sample-Questions/Sample-Set-1/round1.pdf#page=10",
    originalText:
      "TOSS-UP20) GENERAL SCIENCE Short Answer What gas is most directly responsible for the bends ordecompression sickness that divers may experience?ANSWER: NITROGEN (ACCEPT: N2 )",
  },
  {
    bonus: true,
    number: 20,
    topic: "general science",
    type: "shortAnswer",
    question:
      "In degrees Celsius to the nearest whole number, what isthe normal core body temperature of a human being?",
    answer: "37",
    htmlUrl:
      "https://science.osti.gov/-/media/wdts/nsb/pdf/HS-Sample-Questions/Sample-Set-1/round1.pdf#page=10",
    originalText:
      "BONUS20) GENERAL SCIENCE Short Answer In degrees Celsius to the nearest whole number, what isthe normal core body temperature of a human being?ANSWER: 37",
  },
  {
    bonus: false,
    number: 21,
    topic: "astronomy",
    type: "shortAnswer",
    question: "What is the declination of the north celestial pole?",
    answer: "90 (ACCEPT: +90)",
    htmlUrl:
      "https://science.osti.gov/-/media/wdts/nsb/pdf/HS-Sample-Questions/Sample-Set-1/round1.pdf#page=11",
    originalText:
      "TOSS-UP21) ASTRONOMY Short Answer What is the declination of the north celestial pole?ANSWER: 90 (ACCEPT: +90)",
  },
  {
    bonus: true,
    number: 21,
    topic: "astronomy",
    type: "shortAnswer",
    question: "The Sagittarius Arm is part of what galaxy?",
    answer: "THE MILKY WAY",
    htmlUrl:
      "https://science.osti.gov/-/media/wdts/nsb/pdf/HS-Sample-Questions/Sample-Set-1/round1.pdf#page=11",
    originalText:
      "BONUS21) ASTRONOMY Short Answer The Sagittarius Arm is part of what galaxy?ANSWER: THE MILKY WAY",
  },
  {
    bonus: false,
    number: 22,
    topic: "biology",
    type: "multipleChoice",
    question: "If a plant had a taproot, it would also most likely have:",
    answer: [
      { answer: "parallel leaf venation", letter: "W", correct: false },
      {
        answer: "two cotyledons in its seedling stage",
        letter: "X",
        correct: true,
      },
      {
        answer: "diffusely arranged vascular bundles in its stem",
        letter: "Y",
        correct: false,
      },
      {
        answer: "no stomata on the upper surfaces of its leaves",
        letter: "Z",
        correct: false,
      },
    ],
    htmlUrl:
      "https://science.osti.gov/-/media/wdts/nsb/pdf/HS-Sample-Questions/Sample-Set-1/round1.pdf#page=11",
    originalText:
      "TOSS-UP22) BIOLOGY Multiple Choice If a plant had a taproot, it would also most likely have:W) parallel leaf venationX) two cotyledons in its seedling stageY) diffusely arranged vascular bundles in its stemZ) no stomata on the upper surfaces of its leavesANSWER: X) TWO COTYLEDONS IN ITS SEEDLING STAGE",
  },
  {
    bonus: true,
    number: 22,
    topic: "biology",
    type: "shortAnswer",
    question:
      "Using the traditional system of classification, when organismsbelong to the same class, name all of the following 4 taxonomic categories to which they must alsobelong: order; family; phylum; kingdom",
    answer: "PHYLUM; KINGDOM",
    htmlUrl:
      "https://science.osti.gov/-/media/wdts/nsb/pdf/HS-Sample-Questions/Sample-Set-1/round1.pdf#page=11",
    originalText:
      "BONUS22) BIOLOGY Short Answer Using the traditional system of classification, when organismsbelong to the same class, name all of the following 4 taxonomic categories to which they must alsobelong: order; family; phylum; kingdomANSWER: PHYLUM; KINGDOM",
  },
  {
    bonus: false,
    number: 23,
    topic: "chemistry",
    type: "shortAnswer",
    question:
      "According to standard chemical nomenclature and indicating theproper charge, what is the formula for hydrogen sulfide?",
    answer: "H2S",
    htmlUrl:
      "https://science.osti.gov/-/media/wdts/nsb/pdf/HS-Sample-Questions/Sample-Set-1/round1.pdf#page=12",
    originalText:
      "TOSS-UP23) CHEMISTRY Short Answer According to standard chemical nomenclature and indicating theproper charge, what is the formula for hydrogen sulfide?ANSWER: H2S",
  },
  {
    bonus: true,
    number: 23,
    topic: "chemistry",
    type: "shortAnswer",
    question:
      "Of the following group of 4 cations, which are the LARGESTand SMALLEST ions, respectively: K+ ; Na+ ; Rb + ; Li +",
    answer: "LARGEST = Rb+ ; SMALLEST = Li + (ACCEPT: RUBIDIUM AND LITHIUM)",
    htmlUrl:
      "https://science.osti.gov/-/media/wdts/nsb/pdf/HS-Sample-Questions/Sample-Set-1/round1.pdf#page=12",
    originalText:
      "BONUS23) CHEMISTRY Short Answer Of the following group of 4 cations, which are the LARGESTand SMALLEST ions, respectively: K+ ; Na+ ; Rb + ; Li +ANSWER: LARGEST = Rb+ ; SMALLEST = Li + (ACCEPT: RUBIDIUM AND LITHIUM)",
  },
  {
    bonus: false,
    number: 24,
    topic: "physics",
    type: "multipleChoice",
    question:
      "Martin is swinging a yo-yo in a large room with a circular motionperpendicular to a level floor. If the yo-yo breaks away from its string at the top of the yo-yo’scircular path, in what direction will the yo-yo initially move:",
    answer: [
      {
        answer: "at an angle between horizontal and vertical",
        letter: "W",
        correct: false,
      },
      {
        answer: "straight up, toward the ceiling",
        letter: "X",
        correct: false,
      },
      { answer: "straight down, to the floor", letter: "Y", correct: false },
      {
        answer: "horizontally, tangent to its original circular path",
        letter: "Z",
        correct: true,
      },
    ],
    htmlUrl:
      "https://science.osti.gov/-/media/wdts/nsb/pdf/HS-Sample-Questions/Sample-Set-1/round1.pdf#page=12",
    originalText:
      "TOSS-UP24) PHYSICS Multiple Choice Martin is swinging a yo-yo in a large room with a circular motionperpendicular to a level floor. If the yo-yo breaks away from its string at the top of the yo-yo’scircular path, in what direction will the yo-yo initially move:W) at an angle between horizontal and verticalX) straight up, toward the ceilingY) straight down, to the floorZ) horizontally, tangent to its original circular pathANSWER: Z) HORIZONTALLY, TANGENT TO ITS ORIGINAL CIRCULAR PATH",
  },
];
