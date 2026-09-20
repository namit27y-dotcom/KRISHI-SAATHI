export interface LanguageMeta {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  speechCode: string;
  dir: "ltr" | "rtl";
}

export interface TranslationSchema {
  // Common / General
  common: {
    appName: string;
    tagline: string;
    loading: string;
    saving: string;
    error: string;
    retry: string;
    cancel: string;
    confirm: string;
    submit: string;
    reset: string;
    search: string;
    close: string;
    back: string;
    next: string;
    viewAll: string;
    noData: string;
    success: string;
    active: string;
    archived: string;
    verified: string;
    pending: string;
    optional: string;
    step: string;
  };

  // Header & User Banner
  header: {
    guestModeActive: string;
    createRealProfile: string;
    guestModeDesc: string;
    notifications: string;
    markAllAsRead: string;
    noNotifications: string;
    logout: string;
    databaseExport: string;
    databaseExportDesc: string;
    downloadSql: string;
  };

  // Navigation tabs
  nav: {
    dashboard: string;
    farmerBuy: string;
    farmerSell: string;
    orderHistory: string;
    chats: string;
    snap: string;
    academy: string;
    disease: string;
    planners: string;
    schemes: string;
    chat: string;
    charts: string;
    sellerDashboard: string;
    buyerDashboard: string;
    adminDashboard: string;
    regionalWeather: string;
  };

  // User Profile / Farm Metrics Sidebar
  profile: {
    farmMetrics: string;
    totalLand: string;
    convertUnit: string;
    country: string;
    soilProfile: string;
    village: string;
    districtState: string;
    sellerProfile: string;
    company: string;
    gst: string;
    state: string;
    status: string;
    verifiedDealership: string;
    awaitingVerification: string;
    buyerProfile: string;
    representative: string;
    buyerType: string;
    verifiedTrader: string;
    adminCenter: string;
    role: string;
    rootAdmin: string;
    workspaceStatus: string;
    secured: string;
  };

  // Units
  units: {
    acres: string;
    bigha: string;
    hectares: string;
    guntha: string;
  };

  // Weather & Severe Alerts
  weather: {
    liveBlockWeather: string;
    updated: string;
    temperature: string;
    humidity: string;
    windSpeed: string;
    rainfallForecast: string;
    climateAlert: string;
    noImmediateAlert: string;
    realtimeSentinel: string;
    liveMonitor: string;
    severeForecasterTitle: string;
    severeForecasterDesc: string;
    checkNow: string;
    simulateSevere: string;
    cropRecommendationTitle: string;
    cropRecommendationSubtitle: string;
    stateLabel: string;
    districtLabel: string;
    soilTypeLabel: string;
    seasonLabel: string;
    analyzeSuitability: string;
    analyzing: string;
    weatherAnalysis: string;
    rainfallPrediction: string;
    temperatureInsights: string;
    farmingAdvice: string;
    riskAlerts: string;
    recommendedCrops: string;
    sowingWindow: string;
    whyRecommended: string;
    harvestDays: string;
    // Simulated alerts
    hailstormTitle: string;
    hailstormMsg: string;
    floodTitle: string;
    floodMsg: string;
    heatwaveTitle: string;
    heatwaveMsg: string;
    cycloneTitle: string;
    cycloneMsg: string;
    emergencyAction: string;
    toastAlertActive: string;
  };

  // Seasons
  seasons: {
    kharif: string;
    rabi: string;
    zaid: string;
  };

  // Soil types
  soils: {
    alluvial: string;
    black: string;
    redYellow: string;
    laterite: string;
    arid: string;
    loamy: string;
    clayey: string;
    sandy: string;
  };

  // Plant Identification / Snap & Know
  plantId: {
    title: string;
    subtitle: string;
    shortcutTitle: string;
    shortcutDesc: string;
    startSnap: string;
    step1Title: string;
    step1Overlay: string;
    step1Registered: string;
    step2Title: string;
    step2Desc: string;
    addSoilPhoto: string;
    step2Registered: string;
    soilOverlay: string;
    reset: string;
    identifySpecimen: string;
    analyzing: string;
    recentSpecimens: string;
    recentSpecimensDesc: string;
    noSpecimens: string;
    soilMatching: string;
    confidence: string;
    activeWaterFertilizer: string;
    activePlansDesc: string;
    tomatoBaseDose: string;
    tomatoIrrigation: string;
    riceVegStage: string;
    riceWatering: string;
    scientificName: string;
    commonName: string;
    localName: string;
    family: string;
    growthHabit: string;
    nativeRegion: string;
    soilPhRange: string;
    companionPlants: string;
    careGuidance: string;
    envWarning: string;
    readSummaryAloud: string;
    stopSpeech: string;
    saveToRecords: string;
    saved: string;
    printReport: string;
  };

  // Featured Sowing Lessons
  featuredLessons: {
    title: string;
    viewAll: string;
    winterRabi: string;
    wheatTitle: string;
    wheatDesc: string;
    minsLesson: string;
    offSeason: string;
    cucumberTitle: string;
    cucumberDesc: string;
  };

  // Disease Detector
  disease: {
    title: string;
    subtitle: string;
    snapTitle: string;
    snapOverlay: string;
    analyzing: string;
    healthyNotice: string;
    healthyDesc: string;
    diseaseDetected: string;
    confidence: string;
    symptoms: string;
    causes: string;
    organicTreatment: string;
    chemicalTreatment: string;
    preventiveMeasures: string;
    recoveryTime: string;
    tryAgain: string;
  };

  // Planners (Fertilizer & Irrigation)
  planners: {
    title: string;
    subtitle: string;
    fertilizerTab: string;
    irrigationTab: string;
    cropLabel: string;
    growthStageLabel: string;
    fieldSizeLabel: string;
    soilTypeLabel: string;
    calculateFertilizer: string;
    calculateIrrigation: string;
    generating: string;
    recommendedDosage: string;
    npkRatio: string;
    applicationMethod: string;
    ecoImpact: string;
    irrigationFrequency: string;
    waterVolume: string;
    wateringMethod: string;
  };

  // Govt Schemes
  schemes: {
    title: string;
    subtitle: string;
    searchPlaceholder: string;
    allStates: string;
    allCategories: string;
    queryAi: string;
    eligibilityCheck: string;
    benefits: string;
    criteria: string;
    documents: string;
    applyOnPortal: string;
  };

  // Crop Academy
  academy: {
    title: string;
    subtitle: string;
    searchPlaceholder: string;
    allGuides: string;
    seasonalCrops: string;
    offSeasonCrops: string;
    soil: string;
    watering: string;
    viewSteps: string;
    watchLesson: string;
    sowingSteps: string;
    videoTutorial: string;
    step: string;
  };

  // AI Companion & Floating Helper
  aiCompanion: {
    title: string;
    statusActive: string;
    welcome: string;
    placeholder: string;
    listening: string;
    quickTipsTitle: string;
    quickTip1: string;
    quickTip2: string;
    quickTip3: string;
    quickTip4: string;
    readAloud: string;
    stopSpeaking: string;
    clearChat: string;
    chatHistory: string;
    newChat: string;
    networkError: string;
  };

  floatingHelper: {
    title: string;
    welcome: string;
    placeholder: string;
    listening: string;
    close: string;
  };

  // Marketplace (Buy, Sell, Orders, Chats, Checkout)
  marketplace: {
    buyTitle: string;
    buySubtitle: string;
    searchPlaceholder: string;
    allCategories: string;
    inStockOnly: string;
    sortBy: string;
    sortFeatured: string;
    sortPriceLow: string;
    sortPriceHigh: string;
    sortRating: string;
    buyNow: string;
    contactDealer: string;
    viewDetails: string;
    outOfStock: string;
    inStock: string;
    verifiedDealer: string;
    productDetails: string;
    quantity: string;
    deliveryAddress: string;
    addressPlaceholder: string;
    totalAmount: string;
    placeOrder: string;
    orderSuccessTitle: string;
    orderSuccessDesc: string;
    backToMarketplace: string;
    categories: {
      seeds: string;
      fertilizers: string;
      pesticides: string;
      tractors: string;
      waterPumps: string;
      sprayers: string;
      irrigation: string;
      farmTools: string;
    };
    sellTitle: string;
    sellSubtitle: string;
    addListing: string;
    cropName: string;
    pricePerUnit: string;
    stockQuantity: string;
    unit: string;
    description: string;
    uploadPhoto: string;
    submitListing: string;
  };

  // Orders
  orders: {
    title: string;
    orderId: string;
    date: string;
    amount: string;
    status: string;
    trackOrder: string;
    noOrders: string;
    pending: string;
    confirmed: string;
    shipped: string;
    delivered: string;
    cancelled: string;
  };

  // Chats
  chats: {
    title: string;
    selectChat: string;
    typeMessage: string;
    send: string;
    online: string;
    offline: string;
    noMessages: string;
  };

  // Checkout
  checkout: {
    title: string;
    selectPayment: string;
    upi: string;
    netBanking: string;
    cod: string;
    confirmAndPay: string;
    paying: string;
    paymentSuccess: string;
    orderConfirmed: string;
  };

  // Analytics
  analytics: {
    title: string;
    subtitle: string;
    projectedYield: string;
    historicalTrends: string;
    soilHealthIndex: string;
    simulateScenario: string;
    downloadPdf: string;
    yieldForecast: string;
  };

  // Auth Screen
  auth: {
    loginTitle: string;
    registerTitle: string;
    welcomeBack: string;
    startFarming: string;
    fullName: string;
    email: string;
    password: string;
    mobile: string;
    role: string;
    farmer: string;
    seller: string;
    buyer: string;
    country: string;
    state: string;
    district: string;
    village: string;
    landArea: string;
    soilType: string;
    loginBtn: string;
    registerBtn: string;
    dontHaveAccount: string;
    alreadyHaveAccount: string;
    guestExperience: string;
  };
}
