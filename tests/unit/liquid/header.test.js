// Unit tests for header.liquid template
import { jest } from '@jest/globals';

describe('Header Template', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <header class="header" role="banner">
        <div class="header__content">
          <a href="/" class="header__logo-link">
            <img src="logo.png" alt="Ravan Fashion" class="header__logo">
          </a>

          <nav class="header__nav" role="navigation">
            <ul class="header__nav-list">
              <li class="header__nav-item">
                <a href="/collections" class="header__nav-link">Collections</a>
              </li>
              <li class="header__nav-item">
                <a href="/pages/cultural-guide" class="header__nav-link">Cultural Guide</a>
              </li>
              <li class="header__nav-item">
                <a href="/pages/about" class="header__nav-link">About</a>
              </li>
            </ul>
          </nav>

          <div class="header__actions">
            <button class="header__search-toggle" aria-label="Search">
              <svg class="icon-search" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M8 3a5 5 0 100 10A5 5 0 008 3zm0 2a3 3 0 100 6 3 3 0 000-6z" fill="currentColor"/>
                <path d="M13.293 14.707a1 1 0 001.414-1.414l-3-3a1 1 0 10-1.414 1.414l3 3z" fill="currentColor"/>
              </svg>
            </button>

            <button class="header__cart-toggle" aria-label="Cart">
              <svg class="icon-cart" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" fill="currentColor"/>
              </svg>
              <span class="header__cart-count">0</span>
            </button>

            <div class="header__language-toggle">
              <button class="lang-toggle">
                <span class="lang-toggle__item active" data-lang="en">EN</span>
                <span class="lang-toggle__item" data-lang="ta">தமிழ்</span>
              </button>
            </div>
          </div>
        </div>
      </header>
    `;
  });

  test('should render header with all required elements', () => {
    const header = document.querySelector('.header');
    expect(header).toBeInTheDocument();
    expect(header).toHaveAttribute('role', 'banner');
  });

  test('should include logo with proper alt text', () => {
    const logo = document.querySelector('.header__logo');
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute('alt', 'Ravan Fashion');
  });

  test('should have navigation menu with cultural guide link', () => {
    const nav = document.querySelector('.header__nav');
    expect(nav).toBeInTheDocument();
    expect(nav).toHaveAttribute('role', 'navigation');

    const culturalGuideLink = document.querySelector('a[href="/pages/cultural-guide"]');
    expect(culturalGuideLink).toBeInTheDocument();
    expect(culturalGuideLink).toHaveTextContent('Cultural Guide');
  });

  test('should have search toggle with accessibility attributes', () => {
    const searchToggle = document.querySelector('.header__search-toggle');
    expect(searchToggle).toBeInTheDocument();
    expect(searchToggle).toHaveAttribute('aria-label', 'Search');
  });

  test('should have cart toggle with count display', () => {
    const cartToggle = document.querySelector('.header__cart-toggle');
    expect(cartToggle).toBeInTheDocument();
    expect(cartToggle).toHaveAttribute('aria-label', 'Cart');

    const cartCount = document.querySelector('.header__cart-count');
    expect(cartCount).toBeInTheDocument();
    expect(cartCount).toHaveTextContent('0');
  });

  test('should have language toggle with English and Tamil options', () => {
    const langToggle = document.querySelector('.lang-toggle');
    expect(langToggle).toBeInTheDocument();

    const enButton = document.querySelector('[data-lang="en"]');
    const taButton = document.querySelector('[data-lang="ta"]');

    expect(enButton).toBeInTheDocument();
    expect(taButton).toBeInTheDocument();
    expect(enButton).toHaveTextContent('EN');
    expect(taButton).toHaveTextContent('தமிழ்');
    expect(enButton).toHaveClass('active');
  });

  test('should have proper semantic HTML structure', () => {
    const header = document.querySelector('header');
    const nav = document.querySelector('nav');
    const buttons = document.querySelectorAll('button');

    expect(header).toBeInTheDocument();
    expect(nav).toBeInTheDocument();
    expect(buttons.length).toBeGreaterThan(0);
  });

  test('should have accessible button icons', () => {
    const buttons = document.querySelectorAll('button[aria-label]');
    buttons.forEach(button => {
      expect(button).toHaveAttribute('aria-label');
      const ariaLabel = button.getAttribute('aria-label');
      expect(ariaLabel).toBeTruthy();
    });
  });

  test('should have responsive class structure', () => {
    const header = document.querySelector('.header');
    const content = document.querySelector('.header__content');
    const nav = document.querySelector('.header__nav');
    const actions = document.querySelector('.header__actions');

    expect(header).toBeInTheDocument();
    expect(content).toBeInTheDocument();
    expect(nav).toBeInTheDocument();
    expect(actions).toBeInTheDocument();
  });
});