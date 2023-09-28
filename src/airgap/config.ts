self.transcend = {
  readyQueue: [],
  /**
   * Ready callback registrar
   */
  ready(callback: (transcend: any) => void) {
    this.readyQueue.push(callback);
  },
  consentManagerConfig: {
    company: 'Example Company',
    companyURL: 'https://example.com/',
  },
  ...self.transcend,
} as any;

self.airgap = {
  readyQueue: [],
  /**
   * Ready callback registrar
   */
  ready(callback: (airgap: any) => void) {
    this.readyQueue.push(callback);
  },
  // Uncomment to enable default UI module:
  // ui: 'ui.js',
  loadOptions: {
    csp: 'off',
    log: '*'
  },
  hosts: ['localhost'],
  // Tracking purposes types are tagged onto requests for consent-based request regulation
  purposes: {
    // useDefault: true, // (implicit)
    defaultConsent: "AutoGDPR",
    types: {
      // HighEnergyUse: {
      //   name: 'High energy usage',
      //   description: 'Sites that use a high amount of energy.',
      //   // these are the defaults for any custom purpose:
      //   // defaultConsent: false,
      //   // showInConsentManager: true,
      //   // configurable: true,
      //   // essential: false,
      // },
      RequiredByLaw: {
        name: 'Government-required data collection',
        description:
          'We share relevant information with [government agency here] as pursuant to [jurisdiction] law.',
        defaultConsent: true,
        showInConsentManager: true,
        configurable: false,
        // "essential" purposes override all other purposes
        essential: true,
      },
      Parkinsons_Cursor_Tracking: {
        name: 'Cursor Tracking',
        description:
          "We share your cursor movement with an NGO dedicated to curing Parkinson's Disease.",
        defaultConsent: true,
        showInConsentManager: true,
        configurable: false,
        essential: true,
      },
    },
  },
  regulatedPaths: [
    {
      matcher: '/pageview',
      purposes: ['Analytics'],
    },
  ],
  purposeMap: {
    'ad-provider.example': ['Advertising'],
  },
  ...self.airgap,
} as any;
