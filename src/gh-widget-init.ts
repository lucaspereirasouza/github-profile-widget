import { GitHubCardWidget } from './gh-profile-card';

import './css/base.scss';

declare global {
  interface Window {
    GitHubCard: typeof GitHubCardWidget;
  }
}

window.GitHubCard = GitHubCardWidget;

document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const usernameFromUrl = urlParams.get('username') || window.location.search.substring(1).split('&')[0]; // Support ?username=lucas OR just ?lucas
  const themeFromUrl = urlParams.get('theme') as 'light' | 'black';

  const $defaultTemplate = document.querySelector('#github-card') as HTMLElement;

  if (usernameFromUrl || $defaultTemplate) {
    try {
      const options = {
        username: usernameFromUrl || undefined,
        theme: themeFromUrl || undefined,
      };
      const widget = new GitHubCardWidget(options);
      widget.init().catch((error) => {
        console.error('Failed to initialize GitHub Card widget:', error);
      });
    } catch (error) {
      console.error('Failed to construct GitHub Card widget:', error);
    }
  }
});
