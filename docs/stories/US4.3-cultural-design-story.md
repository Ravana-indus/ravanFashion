# US4.3: Cultural Design Story Section

**Story Points:** 3 **Section:** Collection & Product Pages **Priority:** Medium **Status:** Ready

## User Story

As a shopper, I want to read the cultural design story so I know the meaning behind the piece.

## Acceptance Criteria

✅ **Primary Acceptance:** Design Story section shows Tamil term, English translation, and
description.

### Detailed Acceptance Criteria:

1. **Content Structure**
   - [ ] Tamil term/phrase prominently displayed
   - [ ] English translation provided
   - [ ] Cultural context and meaning explained
   - [ ] Historical or contemporary significance included

2. **Visual Design**
   - [ ] Dedicated section on product page
   - [ ] Cultural styling with brand elements
   - [ ] Readable typography hierarchy
   - [ ] Optional imagery or cultural motifs

3. **Content Management**
   - [ ] Editable through Shopify admin (metafields)
   - [ ] Template for consistent story structure
   - [ ] Support for products without cultural stories
   - [ ] Rich text formatting support

4. **Cultural Authenticity**
   - [ ] Accurate Tamil terminology and translations
   - [ ] Respectful cultural representation
   - [ ] Educational value for diaspora community
   - [ ] Authentic storytelling voice

## Design Specifications

### Design Story Section Layout

```
┌─────────────────────────────────────┐
│        Design Story                 │
│                                     │
│   ┌─────────────────────────────┐   │
│   │                             │   │
│   │  "கோலம்"                    │   │
│   │  (Kolam)                    │   │
│   │                             │   │
│   │  Sacred geometric patterns  │   │
│   │  drawn at doorsteps to      │   │
│   │  welcome prosperity and     │   │
│   │  ward off negative energy.  │   │
│   │                             │   │
│   │  This design celebrates     │   │
│   │  the daily ritual that      │   │
│   │  connects Tamil families    │   │
│   │  to their heritage.         │   │
│   │                             │   │
│   │  [Cultural Icon]            │   │
│   │                             │   │
│   └─────────────────────────────┘   │
│                                     │
│     Learn more about Tamil culture  │
│            [Explore →]              │
└─────────────────────────────────────┘
```

### Content Examples

1. **Kolam Patterns**: Sacred geometric designs for prosperity
2. **Thirukkural**: Ancient Tamil wisdom sayings
3. **Temple Architecture**: Gopuram-inspired design elements
4. **Traditional Colors**: Significance of maroon, gold, saffron
5. **Festival Elements**: Pongal, Diwali, Thaipusam references

## Technical Implementation

### Product Template Integration (templates/product.liquid)

```liquid
<!-- Cultural Design Story Section -->
{% assign cultural_story = product.metafields.custom.cultural_story %}
{% assign tamil_term = product.metafields.custom.tamil_term %}
{% assign english_translation = product.metafields.custom.english_translation %}

{% if cultural_story != blank or tamil_term != blank %}
  <section class="cultural-design-story bg-gradient-to-br from-cream-white to-gold/5 py-12 my-8">
    <div class="container mx-auto px-4">
      <div class="max-w-4xl mx-auto">

        <!-- Section Header -->
        <header class="text-center mb-8">
          <h2 class="text-2xl md:text-3xl font-bold text-charcoal-black mb-2">
            {{ 'product.design_story.title' | t }}
          </h2>
          <p class="text-muted-teal">
            {{ 'product.design_story.subtitle' | t }}
          </p>
        </header>

        <!-- Story Content Card -->
        <div class="story-card bg-white rounded-xl shadow-sm border border-gold/20 overflow-hidden">
          <div class="story-content p-8">

            <!-- Tamil Term & Translation -->
            {% if tamil_term != blank %}
              <div class="cultural-term text-center mb-6">
                <h3 class="tamil-text text-4xl md:text-5xl font-tamil text-deep-maroon mb-2 leading-relaxed">
                  "{{ tamil_term }}"
                </h3>

                {% if english_translation != blank %}
                  <p class="english-translation text-xl text-charcoal-black font-medium">
                    ({{ english_translation }})
                  </p>
                {% endif %}
              </div>
            {% endif %}

            <!-- Cultural Story Content -->
            {% if cultural_story != blank %}
              <div class="story-description prose prose-lg mx-auto text-center">
                <div class="text-muted-teal leading-relaxed">
                  {{ cultural_story | metafield_text }}
                </div>
              </div>
            {% endif %}

            <!-- Cultural Context Badges -->
            {% assign cultural_tags = product.metafields.custom.cultural_tags.value %}
            {% if cultural_tags != blank %}
              <div class="cultural-tags flex flex-wrap justify-center gap-2 mt-6">
                {% for tag in cultural_tags %}
                  <span class="cultural-tag bg-deep-maroon/10 text-deep-maroon px-3 py-1 rounded-full text-sm font-medium">
                    {{ tag }}
                  </span>
                {% endfor %}
              </div>
            {% endif %}

            <!-- Cultural Icon/Symbol -->
            {% assign cultural_icon = product.metafields.custom.cultural_icon %}
            {% if cultural_icon != blank %}
              <div class="cultural-icon text-center mt-6">
                <img src="{{ cultural_icon | img_url: '120x120' }}"
                     alt="{{ 'product.design_story.cultural_symbol' | t }}"
                     class="w-16 h-16 mx-auto opacity-60">
              </div>
            {% endif %}
          </div>

          <!-- Story Footer -->
          <footer class="story-footer bg-deep-maroon/5 px-8 py-4">
            <div class="flex items-center justify-between">
              <div class="heritage-note text-sm text-muted-teal">
                <svg class="w-4 h-4 inline mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
                </svg>
                {{ 'product.design_story.heritage_note' | t }}
              </div>

              <a href="{{ pages.cultural-heritage.url | default: '/pages/heritage' }}"
                 class="learn-more-link text-deep-maroon hover:text-gold transition-colors text-sm font-medium flex items-center">
                {{ 'product.design_story.learn_more' | t }}
                <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </a>
            </div>
          </footer>
        </div>

        <!-- Related Cultural Information -->
        {% assign related_stories = collections['cultural-heritage'].products | where: 'metafields.custom.cultural_category', product.metafields.custom.cultural_category %}
        {% if related_stories.size > 1 %}
          <div class="related-stories mt-8">
            <h3 class="text-lg font-bold text-charcoal-black text-center mb-4">
              {{ 'product.design_story.related_stories' | t }}
            </h3>

            <div class="related-grid grid grid-cols-2 md:grid-cols-4 gap-4">
              {% for related_product in related_stories limit: 4 %}
                {% unless related_product.id == product.id %}
                  <a href="{{ related_product.url }}"
                     class="related-item block text-center group">
                    <div class="related-image mb-2">
                      <img src="{{ related_product.featured_image | img_url: '150x150' }}"
                           alt="{{ related_product.title }}"
                           class="w-full aspect-square object-cover rounded-lg group-hover:scale-105 transition-transform">
                    </div>
                    <p class="text-xs text-muted-teal group-hover:text-deep-maroon transition-colors">
                      {{ related_product.title | truncate: 30 }}
                    </p>
                  </a>
                {% endunless %}
              {% endfor %}
            </div>
          </div>
        {% endif %}
      </div>
    </div>
  </section>
{% endif %}
```

### Metafield Configuration (Shopify Admin)

```json
{
  "metafields": [
    {
      "namespace": "custom",
      "key": "cultural_story",
      "name": "Cultural Story",
      "description": "Rich text description of the cultural significance",
      "type": "rich_text_field"
    },
    {
      "namespace": "custom",
      "key": "tamil_term",
      "name": "Tamil Term",
      "description": "Tamil word or phrase (in Tamil script)",
      "type": "single_line_text_field"
    },
    {
      "namespace": "custom",
      "key": "english_translation",
      "name": "English Translation",
      "description": "English translation of the Tamil term",
      "type": "single_line_text_field"
    },
    {
      "namespace": "custom",
      "key": "cultural_tags",
      "name": "Cultural Tags",
      "description": "Related cultural concepts (comma-separated)",
      "type": "list.single_line_text_field"
    },
    {
      "namespace": "custom",
      "key": "cultural_category",
      "name": "Cultural Category",
      "description": "Category for grouping related cultural items",
      "type": "single_line_text_field"
    },
    {
      "namespace": "custom",
      "key": "cultural_icon",
      "name": "Cultural Symbol/Icon",
      "description": "Optional icon or symbol image",
      "type": "file_reference"
    }
  ]
}
```

### Cultural Content Examples (JSON Template)

```json
{
  "cultural_stories": [
    {
      "tamil_term": "கோலம்",
      "english_translation": "Kolam",
      "story": "Sacred geometric patterns traditionally drawn with rice flour at the entrance of Tamil homes. These intricate designs are created daily by women to welcome prosperity, ward off negative energy, and honor the goddess Lakshmi. Each pattern tells a story of mathematical precision and spiritual devotion.",
      "tags": ["sacred geometry", "daily ritual", "prosperity", "tradition"],
      "category": "traditional_art"
    },
    {
      "tamil_term": "திருக்குறள்",
      "english_translation": "Thirukkural",
      "story": "Ancient Tamil wisdom literature consisting of 1,330 couplets that guide ethical living. Written by the sage Thiruvalluvar over 2,000 years ago, these teachings on virtue, prosperity, and love remain relevant for modern Tamil identity and global wisdom.",
      "tags": ["wisdom", "ethics", "literature", "philosophy"],
      "category": "literature"
    },
    {
      "tamil_term": "கோபுரம்",
      "english_translation": "Gopuram",
      "story": "Towering temple gateways that serve as architectural marvels and spiritual beacons. These pyramidal structures are adorned with intricate sculptures depicting stories from Hindu mythology, representing the connection between earth and divine realms.",
      "tags": ["architecture", "spirituality", "art", "mythology"],
      "category": "architecture"
    },
    {
      "tamil_term": "பொங்கல்",
      "english_translation": "Pongal",
      "story": "Harvest festival celebrating the abundance of nature and gratitude to the sun god. The festival represents the Tamil relationship with agriculture, community celebration, and the cyclical nature of life and prosperity.",
      "tags": ["harvest", "celebration", "community", "gratitude"],
      "category": "festivals"
    }
  ]
}
```

### CSS Styling (assets/cultural-design-story.css)

```css
.cultural-design-story {
  position: relative;
}

.cultural-design-story::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, #d4af37, #6a1b1b, #d4af37, transparent);
}

.story-card {
  @apply relative;
  backdrop-filter: blur(10px);
}

.story-card::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 3px;
  background: linear-gradient(90deg, #6a1b1b, #d4af37, #6a1b1b);
  border-radius: 2px;
}

.tamil-text {
  @apply font-tamil;
  text-shadow: 0 2px 4px rgba(106, 27, 27, 0.1);
  letter-spacing: 0.05em;
}

.cultural-tag {
  @apply transition-all duration-300;
}

.cultural-tag:hover {
  @apply bg-deep-maroon text-cream-white transform scale-105;
}

.related-item img {
  @apply transition-transform duration-300;
}

.related-item:hover img {
  @apply transform scale-105;
}

/* Tamil font loading optimization */
@font-display swap;

/* Responsive adjustments */
@media (max-width: 768px) {
  .tamil-text {
    @apply text-3xl;
  }

  .story-content {
    @apply p-6;
  }
}
```

## Localization Support

```json
// locales/en.default.json
{
  "product": {
    "design_story": {
      "title": "Design Story",
      "subtitle": "Discover the cultural heritage behind this piece",
      "cultural_symbol": "Cultural Symbol",
      "heritage_note": "Authentic Tamil heritage design",
      "learn_more": "Learn more about Tamil culture",
      "related_stories": "More from this cultural tradition"
    }
  }
}

// locales/ta.json
{
  "product": {
    "design_story": {
      "title": "வடிவமைப்பு கதை",
      "subtitle": "இந்த துண்டின் பின்னால் உள்ள கலாச்சார பாரம்பரியத்தை கண்டறியுங்கள்",
      "cultural_symbol": "கலாச்சார சின்னம்",
      "heritage_note": "உண்மையான தமிழ் பாரம்பரிய வடிவமைப்பு",
      "learn_more": "தமிழ் கலாச்சாரத்தைப் பற்றி மேலும் அறியுங்கள்",
      "related_stories": "இந்த கலாச்சார பாரம்பரியத்திலிருந்து மேலும்"
    }
  }
}
```

## Definition of Done

- [ ] Cultural story section displays correctly on product pages
- [ ] Tamil terms and translations render properly
- [ ] Metafields system working for content management
- [ ] Related cultural products linking correctly
- [ ] Mobile responsive design tested
- [ ] Cultural authenticity and accuracy verified
- [ ] Rich text formatting supported
- [ ] Performance impact minimal

## Dependencies

- Product metafields configuration in Shopify admin
- Cultural content creation and review process
- Tamil fonts and Unicode support
- Cultural heritage page/collection setup

## Files Created/Modified

- `templates/product.liquid` (design story section)
- `assets/cultural-design-story.css`
- `snippets/cultural-story.liquid` (if separated)
- `locales/en.default.json` (design story keys)
- `locales/ta.json` (Tamil translations)

## Content Creation Workflow

1. **Research Phase**
   - Cultural expert consultation
   - Historical accuracy verification
   - Community feedback integration

2. **Content Development**
   - Tamil terminology research
   - Translation accuracy review
   - Cultural sensitivity check

3. **Implementation**
   - Metafield data entry
   - Visual asset creation
   - Cross-referencing setup

## Cultural Quality Assurance

- [ ] Tamil terms reviewed by native speakers
- [ ] Cultural stories verified for accuracy
- [ ] Respectful representation maintained
- [ ] Educational value provided
- [ ] Community feedback incorporated

## Performance Considerations

- [ ] Conditional loading (only if content exists)
- [ ] Optimized images for cultural symbols
- [ ] Efficient metafield queries
- [ ] Minimal CSS impact

## Accessibility Requirements

- [ ] Screen reader friendly Tamil text
- [ ] Proper heading hierarchy
- [ ] High contrast text readability
- [ ] Alternative text for cultural symbols
- [ ] Keyboard navigation support

## Testing Checklist

- [ ] Cultural story displays correctly
- [ ] Tamil text renders properly
- [ ] English translations accurate
- [ ] Related products link correctly
- [ ] Mobile responsive design
- [ ] Metafields management working
- [ ] Cultural tags display properly
- [ ] Learn more links functional

## Estimate Breakdown

- Template integration and styling: 1 hour
- Metafields configuration: 45 min
- Content examples and documentation: 45 min
- Testing and refinement: 30 min
- **Total: 3 story points**
