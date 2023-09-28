import type { ConsentManagerConfig } from 'src/@types/airgap.js';

export const airgapInit = window.airgap;
export const transcendInit = window.transcend;

export const consentManagerConfigDefaults = {
  learnMoreLink: 'Learn more in our Privacy Center',
  closeButtonAriaLabel: 'Close modal',
  primaryButtonLabel: 'Save Preferences',
  bottomCloseButtonAriaLabel: 'Close this dialog window',
  bottomCloseButtonLabel: 'Close',
  requiredDisclosuresHeader:
    'We also collect information for the following purposes:',

  company: null,
  companyURL: null,
  consentManagerTitle: 'You control your data.',
};

const transcendConfig = transcendInit?.consentManagerConfig;

if (!transcendConfig || Object.keys(transcendConfig).length === 0) {
  console.error(
    'Consent manager config missing! Make sure transcend.consentManagerConfig is set correctly.\ntranscend.consentManagerConfig =',
    transcendConfig,
  );
}

const config: ConsentManagerConfig = {
  ...consentManagerConfigDefaults,
  ...transcendConfig,
};

config.body =
  config.body ||
  `${config.company || 'Our'} products are designed to protect your privacy. \n
We won't collect data about you for advertising, analytics, or other non-essential things unless you give us permission to.\n
You can change your preferences at any time from this window or from our Privacy Center.`;
config.prefsHeader =
  config.prefsHeader ||
  `Choose how ${config.company || 'we'} may collect and use data about you`;

export { config };
