/** Transcend Smart Quarantine API (window.transcend) */
export type TranscendAPI = {
  /** Ready event subscriber */
  ready(callback: (transcend: TranscendAPI) => void): void;
  /** Ready event dispatch queue */
  readyQueue?: ((transcend: TranscendAPI) => void)[];
  /** Consent manager config */
  consentManagerConfig?: Partial<ConsentManagerConfig>;
  /** Show consent manager */
  showConsentManager(): void;
};

/** Consent manager UI configuration */
export type ConsentManagerConfig = Partial<{
  /** Custom CSS */
  customCSS?: string[];
  /** Company name */
  company: string | null;
  /** Company URL */
  companyURL: string | null;
  /** Learn more link label */
  learnMoreLink: string;
  /** Close button ARIA label */
  closeButtonAriaLabel: string;
  /** Primary button (save prefs) label */
  primaryButtonLabel: string;
  /** Bottom close button ARIA label */
  bottomCloseButtonAriaLabel: string;
  /** Bottom close button label */
  bottomCloseButtonLabel: string;
  /** Consent manager title */
  consentManagerTitle: string;
  /** Consent manager dialog body text */
  body: string;
  /** Consent manager dialog header text */
  prefsHeader: string;
  /** Consent manager required disclosures header text */
  requiredDisclosuresHeader: string;
}>;

/** AirgapAuth auth options */
export type AirgapAuthMap = {
  /** A `load` event from a just-loaded airgap.js script element (which implies auth by being loaded before airgap.js) */
  load?: Event;
  /** A user-initiated interaction event that was just dispatched. */
  interaction?: UIEvent;
  /** Automatically reload the page if needed to remove CSP. `false` by default. */
  autoReload?: boolean;
};

/** Airgap authorization proof */
export type AirgapAuth =
  | null
  | AirgapAuthMap
  /** A user-initiated interaction event that was just dispatched. */
  | UIEvent
  /** A `load` event from a just-loaded airgap.js script element (which implies auth by being loaded before airgap.js) */
  | Event;

/**
 * airgap.js settings or load options
 *
 * These can be configured by either defining airgap.loadOptions.* before loading airgap,
 * or by specifying data-* attributes on the airgap script element.
 */
export type AirgapSettings = Partial<{
  /** Enabled log level(s) */
  log: string;
}>;

/** airgap.js API */
export type AirgapAPI = Readonly<{
  /** Get tracking consent */
  getConsent(): TrackingConsentDetails;
  /** Set tracking consent (requires recent UI interaction) */
  setConsent(
    /** Airgap auth proof */
    auth: AirgapAuth,
    /** The tracking consent options. */
    consent: TrackingConsent,
  ): boolean;
  /** Consents the user to all tracking purposes (requires recent UI interaction) */
  optIn(
    /** A user-initiated interaction event that was just dispatched. */
    auth: AirgapAuth,
  ): boolean;
  /** Revokes consent for all tracking purposes (requires recent UI interaction) */
  optOut(
    /** A user-initiated interaction event that was just dispatched. */
    auth: AirgapAuth,
  ): boolean;
  /** Get initialized tracking purposes config */
  getPurposeTypes(): TrackingPurposesTypes;
  /** Ready event subscriber */
  ready(callback: (airgap: AirgapAPI) => void): void;
  /** Ready event dispatch queue */
  readyQueue?: ((airgap: AirgapAPI) => void)[];
}>;

/** Tracking purposes types configuration */
export type TrackingPurposesTypes = {
  /** Tracking purpose type to config */
  [purpose: string]: TrackingPurposeDetails;
};

/** Special `defaultConsent` automatic opt-out value for GDPR-protected users */
export type AutoOptOutForGDPR = 'AutoGDPR';

/** Potential values for `defaultConsent` config */
export type DefaultConsentValue = boolean | AutoOptOutForGDPR;

/** Fully-resolved `defaultConsent` config */
export type DefaultConsentConfig = {
  /** Tracking purpose type to default consent value */
  [purpose: string]: DefaultConsentValue;
};

/** Tracking purposes configuration */
export type TrackingPurposesConfig = {
  /** Inherit default tracking purposes config (Functional, Advertising, Analytics) */
  useDefault: boolean;
  /** Tracking purpose types */
  types: TrackingPurposesTypes;
  /** Default consent states (takes precedence over `TrackingPurposesTypes[purpose].defaultConsent`) */
  defaultConsent?: DefaultConsentValue | DefaultConsentConfig;
};

/** Tracking purpose metadata */
export type TrackingPurposeDetails = {
  /** Tracking purpose name */
  name: string;
  /** Tracking purpose description (used in Consent Manager UI) */
  description: string;
  /** Tracking purpose default consent (default: false) */
  defaultConsent: DefaultConsentValue;
  /** Show tracking purpose in consent manager UI (default: true) */
  showInConsentManager: boolean;
  /** Allow user to configure their consent for this purpose (default: true) */
  configurable: boolean;
  /** Is tracking purpose "essential" - i.e. consent is mandatory / equivalent to 'essential' permission (default: false) */
  essential: boolean;
};

/** Tracking purpose consent config */
export type TrackingConsent = {
  /** Consent to tracking for essential purposes */
  Essential?: true;
  /** Unknown (unable to be consented) */
  Unknown?: false;
  /** Custom tracking purpose */
  [purpose: string]: boolean | undefined;
};

/** Tracking purpose consent config with timestamp & auth metadata */
export type TrackingConsentDetails = {
  /** Tracking consent config */
  purposes: TrackingConsent;
  /** Consent last-modified timestamp (ISO 8601) */
  timestamp: string;
};

/** Tracking purpose type name */
export type TrackingPurpose = string;

/** Tracking purposes */
export type TrackingPurposes = Set<TrackingPurpose>;

declare global {
  /** Expose self.analytics */
  interface Window {
    /** airgap.js interface */
    airgap?: AirgapAPI;
    /** Transcend Consent Manager interface */
    transcend?: TranscendAPI;
  }
}
