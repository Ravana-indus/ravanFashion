# US3.2: Countdown Timer

**Story Points:** 3 **Section:** Homepage Experience **Priority:** High **Status:** Ready

## User Story

As a shopper, I want a countdown timer so I know when the next drop launches.

## Acceptance Criteria

✅ **Primary Acceptance:** Timer counts down accurately, shows "Live Now" after target time.

### Detailed Acceptance Criteria:

1. **Timer Display**
   - [ ] Shows days, hours, minutes, seconds remaining
   - [ ] Updates in real-time every second
   - [ ] Displays in both Tamil and English numerals
   - [ ] Responsive design across all devices

2. **Timer States**
   - [ ] **Pre-Launch**: Shows countdown to launch time
   - [ ] **Live**: Shows "Live Now" when time reached
   - [ ] **Post-Launch**: Shows time since launch or next drop
   - [ ] **No Active Drop**: Shows placeholder or next scheduled drop

3. **Visual Design**
   - [ ] Prominent placement on homepage
   - [ ] Uses brand colors and Tamil-inspired styling
   - [ ] Clear visual hierarchy with proper typography
   - [ ] Smooth animations and transitions

4. **Administrative Control**
   - [ ] Launch date/time configurable in Shopify admin
   - [ ] Multiple future drops can be scheduled
   - [ ] Timezone handling for global audience
   - [ ] Preview mode for testing

## Design Specifications

### Timer Layout

```
┌─────────────────────────────────────┐
│     Next Drop: Collection Name      │
│                                     │
│  ██ Days  ██ Hours ██ Min ██ Sec   │
│   DD       HH      MM     SS        │
│                                     │
│         "எங்கள் அடுத்த கலாச்சார      │
│          வெளியீடு விரைவில்"          │
│                                     │
│      [Notify Me] [Shop Now]        │
└─────────────────────────────────────┘
```

### State Variations

1. **Countdown Active**
   - Tamil: "எங்கள் அடுத்த கலாச்சார வெளியீடு விரைவில்"
   - English: "Our next cultural drop launching soon"

2. **Live State**
   - Tamil: "இப்போது கிடைக்கிறது! புதிய கலாச்சார வெளியீடு"
   - English: "Live Now! New Cultural Drop Available"

3. **Post-Launch**
   - Tamil: "புதிய கலாச்சார வெளியீடு இப்போது கிடைக்கிறது"
   - English: "Latest Cultural Drop Available Now"

## Technical Implementation

### Section Structure (sections/countdown-timer.liquid)

```liquid
<section class="countdown-section bg-gradient-to-r from-deep-maroon to-muted-teal text-cream-white py-12">
  <div class="container mx-auto px-4 text-center">
    {% if settings.launch_datetime %}
      <h2 class="text-2xl md:text-3xl font-bold mb-2">
        {{ settings.countdown_title_english }}
      </h2>
      <h3 class="text-lg md:text-xl font-tamil mb-8 text-gold">
        {{ settings.countdown_title_tamil }}
      </h3>

      <div id="countdown-timer"
           data-launch-time="{{ settings.launch_datetime | date: '%s' }}"
           class="flex justify-center space-x-4 md:space-x-8 mb-8">

        <div class="countdown-unit">
          <div class="countdown-number text-4xl md:text-6xl font-bold" data-unit="days">--</div>
          <div class="countdown-label text-sm uppercase tracking-wide">{{ 'countdown.days' | t }}</div>
        </div>

        <div class="countdown-unit">
          <div class="countdown-number text-4xl md:text-6xl font-bold" data-unit="hours">--</div>
          <div class="countdown-label text-sm uppercase tracking-wide">{{ 'countdown.hours' | t }}</div>
        </div>

        <div class="countdown-unit">
          <div class="countdown-number text-4xl md:text-6xl font-bold" data-unit="minutes">--</div>
          <div class="countdown-label text-sm uppercase tracking-wide">{{ 'countdown.minutes' | t }}</div>
        </div>

        <div class="countdown-unit">
          <div class="countdown-number text-4xl md:text-6xl font-bold" data-unit="seconds">--</div>
          <div class="countdown-label text-sm uppercase tracking-wide">{{ 'countdown.seconds' | t }}</div>
        </div>
      </div>

      <div class="countdown-actions space-x-4">
        <button class="btn btn-gold">{{ 'countdown.notify_me' | t }}</button>
        <a href="{{ collections.featured.url }}" class="btn btn-outline">{{ 'countdown.shop_now' | t }}</a>
      </div>

      <div id="live-message" class="hidden">
        <h2 class="text-3xl md:text-4xl font-bold text-gold mb-4">
          {{ 'countdown.live_now' | t }}
        </h2>
        <a href="{{ settings.launch_collection_url }}" class="btn btn-gold btn-lg">
          {{ 'countdown.shop_collection' | t }}
        </a>
      </div>
    {% endif %}
  </div>
</section>
```

### JavaScript Timer Logic (assets/countdown-timer.js)

```javascript
class CountdownTimer {
  constructor(element) {
    this.element = element;
    this.launchTime = parseInt(element.dataset.launchTime) * 1000;
    this.interval = null;
    this.init();
  }

  init() {
    this.updateTimer();
    this.interval = setInterval(() => this.updateTimer(), 1000);
  }

  updateTimer() {
    const now = Date.now();
    const timeLeft = this.launchTime - now;

    if (timeLeft <= 0) {
      this.showLiveState();
      return;
    }

    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

    this.updateDisplay('days', days);
    this.updateDisplay('hours', hours);
    this.updateDisplay('minutes', minutes);
    this.updateDisplay('seconds', seconds);
  }

  updateDisplay(unit, value) {
    const element = this.element.querySelector(`[data-unit="${unit}"]`);
    if (element) {
      element.textContent = value.toString().padStart(2, '0');
    }
  }

  showLiveState() {
    clearInterval(this.interval);
    this.element.style.display = 'none';
    document.getElementById('live-message').classList.remove('hidden');

    // Fire analytics event
    if (typeof gtag !== 'undefined') {
      gtag('event', 'countdown_complete', {
        event_category: 'engagement',
        event_label: 'drop_launch',
      });
    }
  }
}

// Initialize timer when DOM loads
document.addEventListener('DOMContentLoaded', () => {
  const timer = document.getElementById('countdown-timer');
  if (timer && timer.dataset.launchTime) {
    new CountdownTimer(timer);
  }
});
```

## Shopify Admin Configuration

```json
{
  "name": "Countdown Timer",
  "settings": [
    {
      "type": "text",
      "id": "countdown_title_english",
      "label": "Countdown Title (English)",
      "default": "Next Drop: Heritage Collection"
    },
    {
      "type": "text",
      "id": "countdown_title_tamil",
      "label": "Countdown Title (Tamil)",
      "default": "எங்கள் அடுத்த கலாச்சார வெளியீடு விரைவில்"
    },
    {
      "type": "text",
      "id": "launch_datetime",
      "label": "Launch Date & Time",
      "info": "Format: YYYY-MM-DD HH:MM (24-hour time)",
      "placeholder": "2024-02-15 15:00"
    },
    {
      "type": "collection",
      "id": "launch_collection",
      "label": "Launch Collection"
    }
  ]
}
```

## Localization Files

```json
// locales/en.default.json
{
  "countdown": {
    "days": "Days",
    "hours": "Hours",
    "minutes": "Minutes",
    "seconds": "Seconds",
    "notify_me": "Notify Me",
    "shop_now": "Shop Now",
    "live_now": "Live Now!",
    "shop_collection": "Shop the Collection"
  }
}

// locales/ta.json
{
  "countdown": {
    "days": "நாட்கள்",
    "hours": "மணி",
    "minutes": "நிமிடங்கள்",
    "seconds": "விநாடிகள்",
    "notify_me": "எனக்கு அறிவிக்கவும்",
    "shop_now": "இப்போதே வாங்கவும்",
    "live_now": "இப்போது கிடைக்கிறது!",
    "shop_collection": "கலாச்சார தொகுப்பை வாங்கவும்"
  }
}
```

## Definition of Done

- [ ] Timer displays correctly and updates every second
- [ ] Live state triggers when countdown reaches zero
- [ ] Admin can configure launch date/time easily
- [ ] Responsive design works on all devices
- [ ] Tamil and English text displays properly
- [ ] Analytics events fire for countdown completion
- [ ] No JavaScript errors in console
- [ ] Timezone handling works correctly

## Dependencies

- US1.2: Tailwind CSS configuration
- US2.2: Language toggle functionality
- Brand assets and copy for countdown messaging
- Launch collection setup in Shopify

## Files Created/Modified

- `sections/countdown-timer.liquid`
- `assets/countdown-timer.js`
- `assets/countdown-timer.css` (if needed)
- `config/settings_schema.json` (countdown settings)
- `locales/en.default.json` (countdown translations)
- `locales/ta.json` (Tamil translations)

## Performance Considerations

- [ ] Minimal JavaScript footprint
- [ ] Efficient DOM updates (only changed elements)
- [ ] Proper cleanup of intervals
- [ ] Lazy load if below the fold

## Accessibility Requirements

- [ ] ARIA live regions for screen readers
- [ ] High contrast mode compatibility
- [ ] Keyboard accessible buttons
- [ ] Screen reader friendly number updates

## Testing Checklist

- [ ] Timer counts down accurately
- [ ] Live state displays correctly
- [ ] Mobile responsive design
- [ ] Cross-browser compatibility
- [ ] Timezone edge cases handled
- [ ] Admin configuration working
- [ ] Performance impact minimal

## Estimate Breakdown

- Section markup and styling: 1 hour
- JavaScript timer logic: 1 hour
- Admin configuration: 30 min
- Testing and refinement: 30 min
- **Total: 3 story points**
