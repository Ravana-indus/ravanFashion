# US3.3: Tamil Proverbs Rotator

**Story Points:** 3 **Section:** Homepage Experience **Priority:** Medium **Status:** Ready

## User Story

As a shopper, I want Tamil proverbs with English translations so I understand the cultural
storytelling.

## Acceptance Criteria

✅ **Primary Acceptance:** Proverbs rotate every 3–5 seconds, accessible with aria-live
announcements.

### Detailed Acceptance Criteria:

1. **Content Display**
   - [ ] Tamil proverb displayed in authentic Tamil script
   - [ ] English translation provided below or alongside
   - [ ] Cultural context or meaning explanation available
   - [ ] Elegant typography respecting Tamil writing system

2. **Rotation Behavior**
   - [ ] Automatic rotation every 3-5 seconds
   - [ ] Smooth fade transitions between proverbs
   - [ ] Pause rotation on hover for reading
   - [ ] Manual navigation arrows/dots for user control

3. **Accessibility Features**
   - [ ] Screen reader announcements via aria-live
   - [ ] Proper heading structure and semantic markup
   - [ ] Keyboard navigation support
   - [ ] Reduced motion preference respected

4. **Administrative Control**
   - [ ] Proverbs editable through Shopify admin
   - [ ] Ability to add/remove proverbs from rotation
   - [ ] Control rotation timing
   - [ ] Enable/disable the entire section

## Cultural Content Examples

### Proverb Collection

1. **Tamil:** "கல்வி கரந்து கொடுக்குது" **English:** "Education never hides itself" **Context:**
   Education and knowledge should be shared freely

2. **Tamil:** "அறம் செய்ய விரும்பு" **English:** "Desire to do righteousness" **Context:** Always
   strive to do what is morally right

3. **Tamil:** "நல்லது செய், தீயது விடு" **English:** "Do good, avoid evil" **Context:** Simple
   wisdom for ethical living

4. **Tamil:** "கூடி வாழ்ந்தால் கோடி நன்மை" **English:** "Living together brings countless benefits"
   **Context:** Unity and community bring prosperity

## Design Specifications

### Layout Structure

```
┌─────────────────────────────────────┐
│                                     │
│    "கல்வி கரந்து கொடுக்குது"           │
│                                     │
│      "Education never hides        │
│         itself"                     │
│                                     │
│   — Tamil wisdom for modern life —  │
│                                     │
│        ● ○ ○ ○ ○  [◀ ▶]           │
└─────────────────────────────────────┘
```

### Visual Design

- **Background**: Subtle gradient or cultural pattern
- **Typography**: Large Tamil text with serif font
- **Colors**: Gold accent for Tamil, charcoal for English
- **Spacing**: Generous whitespace for readability
- **Indicators**: Subtle dots showing current/total proverbs

## Technical Implementation

### Section Structure (sections/proverbs-rotator.liquid)

```liquid
<section class="proverbs-section bg-gradient-to-br from-cream-white to-gold/10 py-16">
  <div class="container mx-auto px-4">
    <div class="max-w-4xl mx-auto text-center">
      <h2 class="sr-only">Tamil Wisdom and Proverbs</h2>

      <div id="proverbs-rotator"
           class="proverbs-container relative"
           data-rotation-speed="{{ section.settings.rotation_speed | default: 4000 }}"
           data-auto-rotate="{{ section.settings.auto_rotate | default: true }}">

        {% for block in section.blocks %}
          <div class="proverb-slide {% if forloop.first %}active{% endif %}"
               data-slide="{{ forloop.index0 }}"
               {% if forloop.first %}aria-live="polite"{% else %}aria-hidden="true"{% endif %}>

            <blockquote class="proverb-content space-y-6">
              <p class="proverb-tamil text-3xl md:text-4xl lg:text-5xl font-tamil text-deep-maroon leading-relaxed">
                "{{ block.settings.tamil_text }}"
              </p>

              <p class="proverb-english text-lg md:text-xl text-charcoal-black font-light">
                "{{ block.settings.english_translation }}"
              </p>

              {% if block.settings.cultural_context %}
                <p class="proverb-context text-sm text-muted-teal italic max-w-2xl mx-auto">
                  {{ block.settings.cultural_context }}
                </p>
              {% endif %}
            </blockquote>
          </div>
        {% endfor %}

        <!-- Navigation Controls -->
        {% if section.blocks.size > 1 %}
          <div class="proverb-controls mt-8 flex items-center justify-center space-x-6">
            <!-- Dots Indicator -->
            <div class="dots-container flex space-x-2">
              {% for block in section.blocks %}
                <button class="dot w-3 h-3 rounded-full bg-muted-teal/30 transition-colors hover:bg-muted-teal {% if forloop.first %}active bg-muted-teal{% endif %}"
                        data-slide="{{ forloop.index0 }}"
                        aria-label="Go to proverb {{ forloop.index }}"></button>
              {% endfor %}
            </div>

            <!-- Arrow Navigation -->
            <div class="arrow-controls flex space-x-4">
              <button class="prev-btn p-2 text-muted-teal hover:text-deep-maroon transition-colors"
                      aria-label="Previous proverb">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                </svg>
              </button>

              <button class="next-btn p-2 text-muted-teal hover:text-deep-maroon transition-colors"
                      aria-label="Next proverb">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path>
                </svg>
              </button>
            </div>
          </div>
        {% endif %}

        <!-- Pause/Play Control -->
        <button id="rotation-toggle"
                class="mt-4 text-sm text-muted-teal hover:text-deep-maroon transition-colors"
                aria-label="Pause automatic rotation">
          <span class="pause-text">⏸ Pause</span>
          <span class="play-text hidden">▶ Play</span>
        </button>
      </div>

      <footer class="mt-8 text-center">
        <p class="text-sm text-muted-teal italic">
          — Tamil wisdom for modern life —
        </p>
      </footer>
    </div>
  </div>
</section>
```

### JavaScript Rotator Logic (assets/proverbs-rotator.js)

```javascript
class ProverbsRotator {
  constructor(container) {
    this.container = container;
    this.slides = container.querySelectorAll('.proverb-slide');
    this.dots = container.querySelectorAll('.dot');
    this.currentIndex = 0;
    this.isPlaying = true;
    this.interval = null;

    this.rotationSpeed = parseInt(container.dataset.rotationSpeed) || 4000;
    this.autoRotate = container.dataset.autoRotate === 'true';

    this.init();
  }

  init() {
    this.setupEventListeners();
    if (this.autoRotate && this.slides.length > 1) {
      this.startRotation();
    }

    // Pause on hover
    this.container.addEventListener('mouseenter', () => this.pauseRotation());
    this.container.addEventListener('mouseleave', () => this.resumeRotation());
  }

  setupEventListeners() {
    // Dot navigation
    this.dots.forEach((dot, index) => {
      dot.addEventListener('click', () => this.goToSlide(index));
    });

    // Arrow navigation
    const prevBtn = this.container.querySelector('.prev-btn');
    const nextBtn = this.container.querySelector('.next-btn');

    if (prevBtn) prevBtn.addEventListener('click', () => this.previousSlide());
    if (nextBtn) nextBtn.addEventListener('click', () => this.nextSlide());

    // Play/pause toggle
    const toggleBtn = document.getElementById('rotation-toggle');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => this.toggleRotation());
    }

    // Keyboard navigation
    this.container.addEventListener('keydown', e => {
      if (e.key === 'ArrowLeft') this.previousSlide();
      if (e.key === 'ArrowRight') this.nextSlide();
      if (e.key === ' ') {
        e.preventDefault();
        this.toggleRotation();
      }
    });

    // Respect reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.pauseRotation();
    }
  }

  goToSlide(index) {
    // Hide current slide
    this.slides[this.currentIndex].classList.remove('active');
    this.slides[this.currentIndex].setAttribute('aria-hidden', 'true');
    this.slides[this.currentIndex].removeAttribute('aria-live');

    if (this.dots[this.currentIndex]) {
      this.dots[this.currentIndex].classList.remove('active');
    }

    // Show new slide
    this.currentIndex = index;
    this.slides[this.currentIndex].classList.add('active');
    this.slides[this.currentIndex].setAttribute('aria-live', 'polite');
    this.slides[this.currentIndex].removeAttribute('aria-hidden');

    if (this.dots[this.currentIndex]) {
      this.dots[this.currentIndex].classList.add('active');
    }

    // Analytics
    if (typeof gtag !== 'undefined') {
      gtag('event', 'proverb_view', {
        event_category: 'engagement',
        event_label: `proverb_${index + 1}`,
      });
    }
  }

  nextSlide() {
    const nextIndex = (this.currentIndex + 1) % this.slides.length;
    this.goToSlide(nextIndex);
  }

  previousSlide() {
    const prevIndex = this.currentIndex === 0 ? this.slides.length - 1 : this.currentIndex - 1;
    this.goToSlide(prevIndex);
  }

  startRotation() {
    if (this.slides.length <= 1) return;
    this.interval = setInterval(() => this.nextSlide(), this.rotationSpeed);
  }

  pauseRotation() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
      this.isPlaying = false;
      this.updateToggleButton();
    }
  }

  resumeRotation() {
    if (!this.interval && this.autoRotate && this.isPlaying) {
      this.startRotation();
    }
  }

  toggleRotation() {
    if (this.interval) {
      this.pauseRotation();
    } else {
      this.isPlaying = true;
      this.startRotation();
    }
    this.updateToggleButton();
  }

  updateToggleButton() {
    const toggleBtn = document.getElementById('rotation-toggle');
    if (toggleBtn) {
      const pauseText = toggleBtn.querySelector('.pause-text');
      const playText = toggleBtn.querySelector('.play-text');

      if (this.isPlaying && this.interval) {
        pauseText.classList.remove('hidden');
        playText.classList.add('hidden');
        toggleBtn.setAttribute('aria-label', 'Pause automatic rotation');
      } else {
        pauseText.classList.add('hidden');
        playText.classList.remove('hidden');
        toggleBtn.setAttribute('aria-label', 'Resume automatic rotation');
      }
    }
  }
}

// Initialize when DOM loads
document.addEventListener('DOMContentLoaded', () => {
  const rotator = document.getElementById('proverbs-rotator');
  if (rotator) {
    new ProverbsRotator(rotator);
  }
});
```

## Shopify Section Schema

```json
{
  "name": "Tamil Proverbs Rotator",
  "tag": "section",
  "class": "proverbs-section",
  "settings": [
    {
      "type": "checkbox",
      "id": "auto_rotate",
      "label": "Auto-rotate proverbs",
      "default": true
    },
    {
      "type": "range",
      "id": "rotation_speed",
      "label": "Rotation speed (seconds)",
      "min": 2,
      "max": 10,
      "step": 1,
      "default": 4,
      "unit": "s"
    }
  ],
  "blocks": [
    {
      "type": "proverb",
      "name": "Proverb",
      "settings": [
        {
          "type": "text",
          "id": "tamil_text",
          "label": "Tamil Proverb",
          "info": "Enter the proverb in Tamil script"
        },
        {
          "type": "text",
          "id": "english_translation",
          "label": "English Translation",
          "info": "Provide an accurate English translation"
        },
        {
          "type": "textarea",
          "id": "cultural_context",
          "label": "Cultural Context (Optional)",
          "info": "Brief explanation of the proverb's meaning or cultural significance"
        }
      ]
    }
  ],
  "presets": [
    {
      "name": "Tamil Proverbs",
      "blocks": [
        {
          "type": "proverb",
          "settings": {
            "tamil_text": "கல்வி கரந்து கொடுக்குது",
            "english_translation": "Education never hides itself",
            "cultural_context": "Knowledge and wisdom should be shared freely with others"
          }
        },
        {
          "type": "proverb",
          "settings": {
            "tamil_text": "அறம் செய்ய விரும்பு",
            "english_translation": "Desire to do righteousness",
            "cultural_context": "Always strive to do what is morally right and just"
          }
        }
      ]
    }
  ]
}
```

## Definition of Done

- [ ] Proverbs rotate automatically with smooth transitions
- [ ] Manual navigation controls working
- [ ] Screen reader accessibility implemented
- [ ] Hover pause functionality working
- [ ] Admin can add/edit proverbs easily
- [ ] Tamil fonts render correctly
- [ ] Reduced motion preference respected
- [ ] Cross-browser compatibility verified

## Dependencies

- US1.2: Tailwind CSS configuration
- US2.2: Language toggle (for consistent bilingual experience)
- Tamil font loading and Unicode support
- Cultural content and translations

## Files Created/Modified

- `sections/proverbs-rotator.liquid`
- `assets/proverbs-rotator.js`
- `assets/proverbs-rotator.css`
- Schema embedded in section file

## Accessibility Compliance

- [ ] ARIA live regions for screen reader announcements
- [ ] Keyboard navigation support
- [ ] Focus management
- [ ] Reduced motion support
- [ ] Semantic HTML structure
- [ ] Alt text for decorative elements

## Performance Considerations

- [ ] Efficient DOM manipulation
- [ ] Proper event listener cleanup
- [ ] Minimal CSS animations
- [ ] Lazy loading for below-fold content

## Testing Checklist

- [ ] Automatic rotation timing accurate
- [ ] Manual controls functional
- [ ] Accessibility features working
- [ ] Tamil text displays correctly
- [ ] Cross-device responsive design
- [ ] Performance impact minimal

## Cultural Quality Assurance

- [ ] Proverbs reviewed by Tamil speaker
- [ ] Translations culturally appropriate
- [ ] Context explanations accurate
- [ ] Typography respects Tamil writing system

## Estimate Breakdown

- Section markup and styling: 1 hour
- JavaScript rotator functionality: 1 hour
- Accessibility implementation: 45 min
- Testing and refinement: 15 min
- **Total: 3 story points**
