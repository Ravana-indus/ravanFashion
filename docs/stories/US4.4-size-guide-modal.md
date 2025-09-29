# US4.4: Size Guide Modal

**Story Points:** 3 **Section:** Collection & Product Pages **Priority:** Medium **Status:** Ready

## User Story

As a shopper, I want a size guide modal so I can confirm fit before purchase.

## Acceptance Criteria

✅ **Primary Acceptance:** Modal opens/closes smoothly, responsive layout, includes measurements.

### Detailed Acceptance Criteria:

1. **Modal Functionality**
   - [ ] Opens from "Size Guide" trigger on product page
   - [ ] Smooth open/close animations
   - [ ] Keyboard navigation support (ESC to close)
   - [ ] Background click to close
   - [ ] Focus management for accessibility

2. **Size Guide Content**
   - [ ] Comprehensive measurement charts
   - [ ] Both metric (cm) and imperial (inches) units
   - [ ] Tamil measurement labels where appropriate
   - [ ] Fit recommendations (loose, regular, tight)
   - [ ] Model information for reference

3. **Responsive Design**
   - [ ] Mobile-optimized layout
   - [ ] Scrollable content within modal
   - [ ] Touch-friendly interaction
   - [ ] Readable font sizes on all devices

4. **Cultural Integration**
   - [ ] Bilingual sizing terminology
   - [ ] Inclusive body size representation
   - [ ] Cultural fit preferences noted
   - [ ] Respectful measurement guidance

## Design Specifications

### Size Guide Modal Layout

```
┌─────────────────────────────────────┐
│ Size Guide                     [×]  │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ Find Your Perfect Fit           │ │
│ │ சரியான அளவை கண்டறியுங்கள்        │ │
│ └─────────────────────────────────┘ │
│                                     │
│ Measurements in: ○ CM ● INCHES      │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ Size │ Chest │ Length │ Sleeve │ │
│ │ XS   │ 34"   │ 26"    │ 8"    │ │
│ │ S    │ 36"   │ 27"    │ 8.5"  │ │
│ │ M    │ 38"   │ 28"    │ 9"    │ │
│ │ L    │ 40"   │ 29"    │ 9.5"  │ │
│ │ XL   │ 42"   │ 30"    │ 10"   │ │
│ │ XXL  │ 44"   │ 31"    │ 10.5" │ │
│ └─────────────────────────────────┘ │
│                                     │
│ How to Measure:                     │
│ 📏 Instructions with diagrams       │
│                                     │
│ Need help? Contact us for personal  │
│ fitting advice: support@ravan.com   │
│                                     │
│          [Close] [Contact Us]       │
└─────────────────────────────────────┘
```

### Mobile Responsive

- **Full screen modal** on mobile devices
- **Swipe gestures** for closing
- **Large touch targets** for unit toggle
- **Optimized table** layout for small screens

## Technical Implementation

### Size Guide Modal (snippets/size-guide-modal.liquid)

```liquid
<!-- Size Guide Modal -->
<div id="size-guide-modal"
     class="size-guide-modal fixed inset-0 bg-black/50 z-50 hidden flex items-center justify-center p-4"
     role="dialog"
     aria-labelledby="size-guide-title"
     aria-hidden="true">

  <div class="modal-content bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
    <!-- Modal Header -->
    <header class="modal-header flex items-center justify-between p-6 border-b border-gray-200">
      <div>
        <h2 id="size-guide-title" class="text-2xl font-bold text-charcoal-black">
          {{ 'size_guide.title' | t }}
        </h2>
        <p class="text-lg font-tamil text-deep-maroon mt-1">
          {{ 'size_guide.subtitle_tamil' | t }}
        </p>
      </div>

      <button class="close-modal p-2 text-gray-500 hover:text-charcoal-black transition-colors"
              aria-label="{{ 'size_guide.close' | t }}">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
    </header>

    <!-- Modal Body -->
    <div class="modal-body overflow-y-auto max-h-[calc(90vh-140px)]">
      <div class="p-6">

        <!-- Unit Toggle -->
        <div class="unit-toggle mb-6">
          <div class="flex items-center justify-center">
            <span class="text-sm text-muted-teal mr-3">{{ 'size_guide.measurements_in' | t }}:</span>

            <div class="toggle-group flex bg-gray-100 rounded-lg p-1">
              <button class="unit-btn active"
                      data-unit="inches"
                      aria-pressed="true">
                {{ 'size_guide.inches' | t }}
              </button>
              <button class="unit-btn"
                      data-unit="cm"
                      aria-pressed="false">
                {{ 'size_guide.cm' | t }}
              </button>
            </div>
          </div>
        </div>

        <!-- Size Chart -->
        <div class="size-chart mb-8">
          <div class="chart-container bg-gray-50 rounded-lg p-4 overflow-x-auto">

            <!-- Inches Chart -->
            <table class="size-table inches-table w-full text-sm" data-unit="inches">
              <thead>
                <tr class="border-b border-gray-300">
                  <th class="text-left py-3 px-2 font-bold text-charcoal-black">
                    {{ 'size_guide.size' | t }}
                  </th>
                  <th class="text-center py-3 px-2 font-bold text-charcoal-black">
                    {{ 'size_guide.chest' | t }}
                    <span class="block text-xs font-normal text-muted-teal font-tamil">
                      ({{ 'size_guide.chest_tamil' | t }})
                    </span>
                  </th>
                  <th class="text-center py-3 px-2 font-bold text-charcoal-black">
                    {{ 'size_guide.length' | t }}
                    <span class="block text-xs font-normal text-muted-teal font-tamil">
                      ({{ 'size_guide.length_tamil' | t }})
                    </span>
                  </th>
                  <th class="text-center py-3 px-2 font-bold text-charcoal-black">
                    {{ 'size_guide.sleeve' | t }}
                    <span class="block text-xs font-normal text-muted-teal font-tamil">
                      ({{ 'size_guide.sleeve_tamil' | t }})
                    </span>
                  </th>
                  <th class="text-center py-3 px-2 font-bold text-charcoal-black">
                    {{ 'size_guide.fit' | t }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr class="border-b border-gray-200 hover:bg-white transition-colors">
                  <td class="py-3 px-2 font-bold text-charcoal-black">XS</td>
                  <td class="py-3 px-2 text-center">34"</td>
                  <td class="py-3 px-2 text-center">26"</td>
                  <td class="py-3 px-2 text-center">8"</td>
                  <td class="py-3 px-2 text-center text-xs text-muted-teal">{{ 'size_guide.regular' | t }}</td>
                </tr>
                <tr class="border-b border-gray-200 hover:bg-white transition-colors">
                  <td class="py-3 px-2 font-bold text-charcoal-black">S</td>
                  <td class="py-3 px-2 text-center">36"</td>
                  <td class="py-3 px-2 text-center">27"</td>
                  <td class="py-3 px-2 text-center">8.5"</td>
                  <td class="py-3 px-2 text-center text-xs text-muted-teal">{{ 'size_guide.regular' | t }}</td>
                </tr>
                <tr class="border-b border-gray-200 hover:bg-white transition-colors">
                  <td class="py-3 px-2 font-bold text-charcoal-black">M</td>
                  <td class="py-3 px-2 text-center">38"</td>
                  <td class="py-3 px-2 text-center">28"</td>
                  <td class="py-3 px-2 text-center">9"</td>
                  <td class="py-3 px-2 text-center text-xs text-muted-teal">{{ 'size_guide.regular' | t }}</td>
                </tr>
                <tr class="border-b border-gray-200 hover:bg-white transition-colors">
                  <td class="py-3 px-2 font-bold text-charcoal-black">L</td>
                  <td class="py-3 px-2 text-center">40"</td>
                  <td class="py-3 px-2 text-center">29"</td>
                  <td class="py-3 px-2 text-center">9.5"</td>
                  <td class="py-3 px-2 text-center text-xs text-muted-teal">{{ 'size_guide.regular' | t }}</td>
                </tr>
                <tr class="border-b border-gray-200 hover:bg-white transition-colors">
                  <td class="py-3 px-2 font-bold text-charcoal-black">XL</td>
                  <td class="py-3 px-2 text-center">42"</td>
                  <td class="py-3 px-2 text-center">30"</td>
                  <td class="py-3 px-2 text-center">10"</td>
                  <td class="py-3 px-2 text-center text-xs text-muted-teal">{{ 'size_guide.regular' | t }}</td>
                </tr>
                <tr class="hover:bg-white transition-colors">
                  <td class="py-3 px-2 font-bold text-charcoal-black">XXL</td>
                  <td class="py-3 px-2 text-center">44"</td>
                  <td class="py-3 px-2 text-center">31"</td>
                  <td class="py-3 px-2 text-center">10.5"</td>
                  <td class="py-3 px-2 text-center text-xs text-muted-teal">{{ 'size_guide.regular' | t }}</td>
                </tr>
              </tbody>
            </table>

            <!-- CM Chart -->
            <table class="size-table cm-table w-full text-sm hidden" data-unit="cm">
              <thead>
                <tr class="border-b border-gray-300">
                  <th class="text-left py-3 px-2 font-bold text-charcoal-black">{{ 'size_guide.size' | t }}</th>
                  <th class="text-center py-3 px-2 font-bold text-charcoal-black">{{ 'size_guide.chest' | t }}</th>
                  <th class="text-center py-3 px-2 font-bold text-charcoal-black">{{ 'size_guide.length' | t }}</th>
                  <th class="text-center py-3 px-2 font-bold text-charcoal-black">{{ 'size_guide.sleeve' | t }}</th>
                  <th class="text-center py-3 px-2 font-bold text-charcoal-black">{{ 'size_guide.fit' | t }}</th>
                </tr>
              </thead>
              <tbody>
                <tr class="border-b border-gray-200 hover:bg-white transition-colors">
                  <td class="py-3 px-2 font-bold text-charcoal-black">XS</td>
                  <td class="py-3 px-2 text-center">86cm</td>
                  <td class="py-3 px-2 text-center">66cm</td>
                  <td class="py-3 px-2 text-center">20cm</td>
                  <td class="py-3 px-2 text-center text-xs text-muted-teal">{{ 'size_guide.regular' | t }}</td>
                </tr>
                <tr class="border-b border-gray-200 hover:bg-white transition-colors">
                  <td class="py-3 px-2 font-bold text-charcoal-black">S</td>
                  <td class="py-3 px-2 text-center">91cm</td>
                  <td class="py-3 px-2 text-center">69cm</td>
                  <td class="py-3 px-2 text-center">22cm</td>
                  <td class="py-3 px-2 text-center text-xs text-muted-teal">{{ 'size_guide.regular' | t }}</td>
                </tr>
                <tr class="border-b border-gray-200 hover:bg-white transition-colors">
                  <td class="py-3 px-2 font-bold text-charcoal-black">M</td>
                  <td class="py-3 px-2 text-center">97cm</td>
                  <td class="py-3 px-2 text-center">71cm</td>
                  <td class="py-3 px-2 text-center">23cm</td>
                  <td class="py-3 px-2 text-center text-xs text-muted-teal">{{ 'size_guide.regular' | t }}</td>
                </tr>
                <tr class="border-b border-gray-200 hover:bg-white transition-colors">
                  <td class="py-3 px-2 font-bold text-charcoal-black">L</td>
                  <td class="py-3 px-2 text-center">102cm</td>
                  <td class="py-3 px-2 text-center">74cm</td>
                  <td class="py-3 px-2 text-center">24cm</td>
                  <td class="py-3 px-2 text-center text-xs text-muted-teal">{{ 'size_guide.regular' | t }}</td>
                </tr>
                <tr class="border-b border-gray-200 hover:bg-white transition-colors">
                  <td class="py-3 px-2 font-bold text-charcoal-black">XL</td>
                  <td class="py-3 px-2 text-center">107cm</td>
                  <td class="py-3 px-2 text-center">76cm</td>
                  <td class="py-3 px-2 text-center">25cm</td>
                  <td class="py-3 px-2 text-center text-xs text-muted-teal">{{ 'size_guide.regular' | t }}</td>
                </tr>
                <tr class="hover:bg-white transition-colors">
                  <td class="py-3 px-2 font-bold text-charcoal-black">XXL</td>
                  <td class="py-3 px-2 text-center">112cm</td>
                  <td class="py-3 px-2 text-center">79cm</td>
                  <td class="py-3 px-2 text-center">27cm</td>
                  <td class="py-3 px-2 text-center text-xs text-muted-teal">{{ 'size_guide.regular' | t }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- How to Measure -->
        <div class="measuring-guide mb-8">
          <h3 class="text-xl font-bold text-charcoal-black mb-4">
            {{ 'size_guide.how_to_measure' | t }}
          </h3>

          <div class="measurement-steps grid md:grid-cols-2 gap-6">
            <div class="step">
              <h4 class="font-medium text-charcoal-black mb-2 flex items-center">
                <span class="w-6 h-6 bg-deep-maroon text-cream-white rounded-full text-xs flex items-center justify-center mr-3">1</span>
                {{ 'size_guide.chest_measurement' | t }}
              </h4>
              <p class="text-sm text-muted-teal ml-9">
                {{ 'size_guide.chest_instruction' | t }}
              </p>
            </div>

            <div class="step">
              <h4 class="font-medium text-charcoal-black mb-2 flex items-center">
                <span class="w-6 h-6 bg-deep-maroon text-cream-white rounded-full text-xs flex items-center justify-center mr-3">2</span>
                {{ 'size_guide.length_measurement' | t }}
              </h4>
              <p class="text-sm text-muted-teal ml-9">
                {{ 'size_guide.length_instruction' | t }}
              </p>
            </div>

            <div class="step">
              <h4 class="font-medium text-charcoal-black mb-2 flex items-center">
                <span class="w-6 h-6 bg-deep-maroon text-cream-white rounded-full text-xs flex items-center justify-center mr-3">3</span>
                {{ 'size_guide.sleeve_measurement' | t }}
              </h4>
              <p class="text-sm text-muted-teal ml-9">
                {{ 'size_guide.sleeve_instruction' | t }}
              </p>
            </div>

            <div class="step">
              <h4 class="font-medium text-charcoal-black mb-2 flex items-center">
                <span class="w-6 h-6 bg-deep-maroon text-cream-white rounded-full text-xs flex items-center justify-center mr-3">4</span>
                {{ 'size_guide.fit_preference' | t }}
              </h4>
              <p class="text-sm text-muted-teal ml-9">
                {{ 'size_guide.fit_instruction' | t }}
              </p>
            </div>
          </div>
        </div>

        <!-- Model Information -->
        <div class="model-info bg-gold/10 rounded-lg p-4 mb-6">
          <h4 class="font-medium text-charcoal-black mb-2">
            {{ 'size_guide.model_info' | t }}
          </h4>
          <p class="text-sm text-muted-teal">
            {{ 'size_guide.model_details' | t }}
          </p>
        </div>

        <!-- Support Contact -->
        <div class="support-contact text-center">
          <p class="text-sm text-muted-teal mb-4">
            {{ 'size_guide.need_help' | t }}
          </p>
          <p class="text-sm font-tamil text-deep-maroon mb-4">
            {{ 'size_guide.personal_fitting' | t }}
          </p>
        </div>
      </div>
    </div>

    <!-- Modal Footer -->
    <footer class="modal-footer flex items-center justify-between p-6 border-t border-gray-200">
      <button class="btn btn-outline close-modal">
        {{ 'size_guide.close' | t }}
      </button>

      <a href="{{ routes.contact_url }}" class="btn btn-gold">
        {{ 'size_guide.contact_us' | t }}
      </a>
    </footer>
  </div>
</div>
```

### JavaScript Modal Logic (assets/size-guide-modal.js)

```javascript
class SizeGuideModal {
  constructor() {
    this.modal = document.getElementById('size-guide-modal');
    this.isOpen = false;

    this.init();
  }

  init() {
    this.setupEventListeners();
    this.setupUnitToggle();
  }

  setupEventListeners() {
    // Open modal triggers
    document.addEventListener('click', e => {
      if (e.target.matches('.size-guide-trigger, .size-guide-trigger *')) {
        e.preventDefault();
        this.openModal();
      }
    });

    if (!this.modal) return;

    // Close modal triggers
    this.modal.addEventListener('click', e => {
      if (e.target === this.modal || e.target.matches('.close-modal, .close-modal *')) {
        this.closeModal();
      }
    });

    // Keyboard events
    document.addEventListener('keydown', e => {
      if (this.isOpen && e.key === 'Escape') {
        this.closeModal();
      }
    });

    // Prevent body scroll when modal is open
    this.modal.addEventListener(
      'wheel',
      e => {
        const modalContent = this.modal.querySelector('.modal-content');
        const modalBody = this.modal.querySelector('.modal-body');

        if (!modalBody.contains(e.target)) {
          e.preventDefault();
        }
      },
      { passive: false }
    );
  }

  setupUnitToggle() {
    const unitButtons = this.modal?.querySelectorAll('.unit-btn');
    if (!unitButtons) return;

    unitButtons.forEach(button => {
      button.addEventListener('click', () => {
        const unit = button.dataset.unit;
        this.switchUnit(unit);

        // Update button states
        unitButtons.forEach(btn => {
          btn.classList.remove('active');
          btn.setAttribute('aria-pressed', 'false');
        });

        button.classList.add('active');
        button.setAttribute('aria-pressed', 'true');
      });
    });
  }

  switchUnit(unit) {
    const tables = this.modal.querySelectorAll('.size-table');

    tables.forEach(table => {
      if (table.dataset.unit === unit) {
        table.classList.remove('hidden');
      } else {
        table.classList.add('hidden');
      }
    });

    // Analytics
    this.trackUnitChange(unit);
  }

  openModal() {
    if (!this.modal) return;

    this.modal.classList.remove('hidden');
    this.modal.setAttribute('aria-hidden', 'false');
    this.isOpen = true;

    // Focus management
    const firstFocusable = this.modal.querySelector(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (firstFocusable) {
      firstFocusable.focus();
    }

    // Prevent background scroll
    document.body.style.overflow = 'hidden';

    // Analytics
    this.trackModalOpen();

    // Add animation class
    requestAnimationFrame(() => {
      this.modal.classList.add('modal-open');
    });
  }

  closeModal() {
    if (!this.modal) return;

    this.modal.classList.add('modal-closing');

    setTimeout(() => {
      this.modal.classList.add('hidden');
      this.modal.classList.remove('modal-open', 'modal-closing');
      this.modal.setAttribute('aria-hidden', 'true');
      this.isOpen = false;

      // Restore background scroll
      document.body.style.overflow = '';

      // Return focus to trigger
      const trigger = document.querySelector('.size-guide-trigger');
      if (trigger) {
        trigger.focus();
      }
    }, 200);
  }

  trackModalOpen() {
    if (typeof gtag !== 'undefined') {
      gtag('event', 'size_guide_open', {
        event_category: 'engagement',
        event_label: 'product_page',
      });
    }
  }

  trackUnitChange(unit) {
    if (typeof gtag !== 'undefined') {
      gtag('event', 'size_guide_unit_change', {
        event_category: 'engagement',
        event_label: unit,
      });
    }
  }
}

// Initialize when DOM loads
document.addEventListener('DOMContentLoaded', () => {
  new SizeGuideModal();
});
```

### CSS Styling (assets/size-guide-modal.css)

```css
.size-guide-modal {
  @apply transition-all duration-300 ease-out;
  backdrop-filter: blur(4px);
}

.size-guide-modal.modal-open {
  @apply opacity-100;
}

.size-guide-modal.modal-closing {
  @apply opacity-0;
}

.modal-content {
  @apply transform transition-all duration-300 ease-out;
  transform: scale(0.95) translateY(20px);
}

.modal-open .modal-content {
  @apply transform-none;
}

.modal-closing .modal-content {
  @apply transform scale-95 translate-y-5;
}

.unit-btn {
  @apply px-4 py-2 text-sm font-medium rounded-md transition-all duration-200;
  @apply text-muted-teal hover:text-charcoal-black;
}

.unit-btn.active {
  @apply bg-white text-charcoal-black shadow-sm;
}

.size-table th {
  @apply sticky top-0 bg-gray-50;
}

.size-table tr:hover {
  @apply bg-cream-white;
}

/* Mobile optimizations */
@media (max-width: 768px) {
  .modal-content {
    @apply rounded-none;
    height: 100vh;
    max-height: 100vh;
  }

  .modal-body {
    max-height: calc(100vh - 160px);
  }

  .size-table {
    @apply text-xs;
  }

  .size-table th,
  .size-table td {
    @apply px-1 py-2;
  }
}

/* Print styles */
@media print {
  .size-guide-modal {
    @apply static block bg-transparent;
  }

  .modal-content {
    @apply shadow-none;
  }

  .close-modal {
    @apply hidden;
  }
}
```

## Localization Support

```json
// locales/en.default.json
{
  "size_guide": {
    "title": "Size Guide",
    "subtitle_tamil": "சரியான அளவை கண்டறியுங்கள்",
    "close": "Close",
    "measurements_in": "Measurements in",
    "inches": "Inches",
    "cm": "CM",
    "size": "Size",
    "chest": "Chest",
    "chest_tamil": "மார்பு",
    "length": "Length",
    "length_tamil": "நீளம்",
    "sleeve": "Sleeve",
    "sleeve_tamil": "கை",
    "fit": "Fit",
    "regular": "Regular",
    "how_to_measure": "How to Measure",
    "chest_measurement": "Chest Measurement",
    "chest_instruction": "Measure around the fullest part of your chest, keeping the tape parallel to the ground.",
    "length_measurement": "Length Measurement",
    "length_instruction": "Measure from the highest point of the shoulder down to the desired length.",
    "sleeve_measurement": "Sleeve Measurement",
    "sleeve_instruction": "Measure from the shoulder seam to the end of the sleeve.",
    "fit_preference": "Fit Preference",
    "fit_instruction": "Consider if you prefer a looser or more fitted style when choosing your size.",
    "model_info": "Model Information",
    "model_details": "Model is 6'0\" (183cm), chest 38\" (97cm), wearing size Medium for a regular fit.",
    "need_help": "Need help finding the right size?",
    "personal_fitting": "தனிப்பட்ட பொருத்த ஆலோசனைக்கு எங்களை தொடர்பு கொள்ளுங்கள்",
    "contact_us": "Contact Us"
  }
}

// locales/ta.json
{
  "size_guide": {
    "title": "அளவு வழிகாட்டி",
    "close": "மூடு",
    "measurements_in": "அளவீடுகள்",
    "inches": "அங்குலங்கள்",
    "cm": "செ.மீ",
    "size": "அளவு",
    "chest": "மார்பு",
    "length": "நீளம்",
    "sleeve": "கை",
    "fit": "பொருத்தம்",
    "regular": "வழக்கமான",
    "how_to_measure": "எப்படி அளவிடுவது",
    "contact_us": "எங்களை தொடர்பு கொள்ளுங்கள்"
  }
}
```

## Definition of Done

- [ ] Size guide modal opens and closes smoothly
- [ ] Unit toggle (inches/cm) functional
- [ ] Comprehensive measurement charts displayed
- [ ] Mobile responsive design tested
- [ ] Keyboard navigation and accessibility working
- [ ] Tamil labels and instructions displayed
- [ ] Contact integration for sizing help
- [ ] Analytics tracking implemented

## Dependencies

- Product variant selector integration (for trigger placement)
- Contact page/form for sizing help
- Tamil translations and measurement terminology
- Model photography and measurements

## Files Created/Modified

- `snippets/size-guide-modal.liquid`
- `assets/size-guide-modal.js`
- `assets/size-guide-modal.css`
- `templates/product.liquid` (trigger integration)
- `locales/en.default.json` (size guide keys)
- `locales/ta.json` (Tamil translations)

## Measurement Data Structure

```json
{
  "size_charts": {
    "mens_tshirts": {
      "XS": {
        "chest_in": 34,
        "chest_cm": 86,
        "length_in": 26,
        "length_cm": 66,
        "sleeve_in": 8,
        "sleeve_cm": 20
      },
      "S": {
        "chest_in": 36,
        "chest_cm": 91,
        "length_in": 27,
        "length_cm": 69,
        "sleeve_in": 8.5,
        "sleeve_cm": 22
      },
      "M": {
        "chest_in": 38,
        "chest_cm": 97,
        "length_in": 28,
        "length_cm": 71,
        "sleeve_in": 9,
        "sleeve_cm": 23
      },
      "L": {
        "chest_in": 40,
        "chest_cm": 102,
        "length_in": 29,
        "length_cm": 74,
        "sleeve_in": 9.5,
        "sleeve_cm": 24
      },
      "XL": {
        "chest_in": 42,
        "chest_cm": 107,
        "length_in": 30,
        "length_cm": 76,
        "sleeve_in": 10,
        "sleeve_cm": 25
      },
      "XXL": {
        "chest_in": 44,
        "chest_cm": 112,
        "length_in": 31,
        "length_cm": 79,
        "sleeve_in": 10.5,
        "sleeve_cm": 27
      }
    }
  }
}
```

## Accessibility Requirements

- [ ] Proper ARIA labels and roles
- [ ] Keyboard navigation support
- [ ] Focus management
- [ ] Screen reader compatibility
- [ ] High contrast mode support
- [ ] ESC key to close modal

## Performance Considerations

- [ ] Lazy loading of modal content
- [ ] Efficient table rendering
- [ ] Minimal CSS animations
- [ ] Optimized for mobile performance

## Testing Checklist

- [ ] Modal opens from product page trigger
- [ ] Unit toggle switches measurements correctly
- [ ] Responsive design on all devices
- [ ] Keyboard navigation functional
- [ ] Close functionality working (X, ESC, background click)
- [ ] Tamil text renders correctly
- [ ] Contact integration working
- [ ] Analytics events firing

## Estimate Breakdown

- Modal markup and styling: 1 hour
- JavaScript functionality: 1 hour
- Responsive design and accessibility: 45 min
- Testing and refinement: 15 min
- **Total: 3 story points**
