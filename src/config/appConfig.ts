/**
 * Global Application Configuration
 *
 * Centralizes public application parameters, open-source metadata,
 * and ethical donation/support channels.
 */

export const APP_CONFIG = {
  appName: 'RCU Acompanhamento',
  version: '1.0.1',
  isCompletelyFree: true,
  author: {
    name: 'Philipe Efrain Figueiredo Gonzalez',
    email: 'figueiredogonzalez@live.com',
  },
  donations: {
    // PIX key for voluntary support (Brazil)
    pixKey: process.env.EXPO_PUBLIC_PIX_KEY || 'figueiredogonzalez@live.com',
    pixKeyType: 'E-mail',
    pixRecipientName: 'Philipe Efrain Figueiredo Gonzalez',
    // Optional external links for international supporters
    buyMeACoffeeUrl: process.env.EXPO_PUBLIC_BMC_URL || 'https://buymeacoffee.com/philipe.gonzalez',
    githubRepoUrl: 'https://github.com/PhilipeEfrain/rcu-acompanhamento-app',
  },
};
