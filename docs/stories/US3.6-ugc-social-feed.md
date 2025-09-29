# US3.6: UGC Social Feed

**Story Points:** 5 **Section:** Homepage Experience **Priority:** Medium **Status:** Ready

## User Story

As a shopper, I want to see UGC feeds (Instagram/TikTok) so I can trust community engagement.

## Acceptance Criteria

✅ **Primary Acceptance:** Social feed displays correctly via app block, responsive on mobile.

### Detailed Acceptance Criteria:

1. **Social Feed Display**
   - [ ] Instagram feed integration with brand hashtags
   - [ ] TikTok content embedding where applicable
   - [ ] Grid layout showcasing customer photos
   - [ ] Responsive design across all devices

2. **Content Curation**
   - [ ] Brand hashtag aggregation (#RavanFashion, #TamilHeritage)
   - [ ] User-generated content featuring products
   - [ ] Moderation system for appropriate content
   - [ ] Cultural representation and authenticity

3. **Interactive Features**
   - [ ] Click-through to original social posts
   - [ ] Product tagging where possible
   - [ ] "Shop the Look" functionality
   - [ ] Social sharing encouragement

4. **Performance & Loading**
   - [ ] Fast loading with lazy loading
   - [ ] Fallback content if API fails
   - [ ] Mobile-optimized image sizes
   - [ ] Minimal impact on page speed

## Design Specifications

### UGC Feed Section Layout

```
┌─────────────────────────────────────┐
│        Community Showcase          │
│     "எங்கள் சமூகம் அணிந்திருப்பது"    │
│                                     │
│  ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐    │
│  │📷 │ │📷 │ │📷 │ │📷 │ │📷 │    │
│  │   │ │   │ │   │ │   │ │   │    │
│  │@u │ │@u │ │@u │ │@u │ │@u │    │
│  └───┘ └───┘ └───┘ └───┘ └───┘    │
│                                     │
│  ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐    │
│  │📱 │ │📱 │ │📱 │ │📱 │ │📱 │    │
│  │TT │ │TT │ │TT │ │TT │ │TT │    │
│  │@u │ │@u │ │@u │ │@u │ │@u │    │
│  └───┘ └───┘ └───┘ └───┘ └───┘    │
│                                     │
│    #RavanFashion #TamilHeritage     │
│                                     │
│        [Follow Us] [Share]          │
└─────────────────────────────────────┘
```

### Mobile Responsive Grid

- **Desktop**: 5 columns
- **Tablet**: 3 columns
- **Mobile**: 2 columns
- **Aspect Ratio**: 1:1 (square format)

## Technical Implementation

### UGC Section (sections/social-feed.liquid)

```liquid
<section class="social-feed-section bg-cream-white py-16">
  <div class="container mx-auto px-4">

    <!-- Section Header -->
    <header class="text-center mb-12">
      <h2 class="text-3xl md:text-4xl font-bold text-charcoal-black mb-4">
        {{ section.settings.heading_english | default: 'Community Showcase' }}
      </h2>

      {% if section.settings.heading_tamil %}
        <p class="text-xl font-tamil text-deep-maroon mb-4">
          {{ section.settings.heading_tamil }}
        </p>
      {% endif %}

      {% if section.settings.description %}
        <p class="text-lg text-muted-teal max-w-2xl mx-auto mb-6">
          {{ section.settings.description }}
        </p>
      {% endif %}

      <!-- Hashtags -->
      <div class="hashtags flex flex-wrap justify-center gap-2 mb-8">
        {% assign hashtags = section.settings.hashtags | split: ',' %}
        {% for hashtag in hashtags %}
          <span class="hashtag bg-deep-maroon/10 text-deep-maroon px-3 py-1 rounded-full text-sm font-medium">
            #{{ hashtag | strip }}
          </span>
        {% endfor %}
      </div>
    </header>

    <!-- Social Feed Grid -->
    <div id="social-feed-grid"
         class="feed-grid grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8"
         data-instagram-token="{{ section.settings.instagram_access_token }}"
         data-hashtag="{{ section.settings.primary_hashtag }}"
         data-post-limit="{{ section.settings.post_limit | default: 10 }}">

      <!-- Loading State -->
      <div class="feed-loading col-span-full text-center py-8">
        <div class="inline-flex items-center">
          <svg class="animate-spin h-6 w-6 text-deep-maroon mr-3" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {{ 'social_feed.loading' | t }}
        </div>
      </div>

      <!-- Fallback Content (shown if API fails) -->
      <div class="feed-fallback hidden col-span-full">
        {% for block in section.blocks %}
          {% if block.type == 'fallback_post' %}
            <div class="fallback-post relative group cursor-pointer bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">

              {% if block.settings.image %}
                <div class="aspect-square overflow-hidden">
                  <img src="{{ block.settings.image | img_url: '400x400' }}"
                       alt="{{ block.settings.alt_text | default: 'Community post' }}"
                       class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300">
                </div>
              {% endif %}

              <!-- Overlay -->
              <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <div class="absolute bottom-4 left-4 right-4 text-white">
                  {% if block.settings.username %}
                    <p class="text-sm font-medium">@{{ block.settings.username }}</p>
                  {% endif %}
                  {% if block.settings.caption %}
                    <p class="text-xs mt-1 line-clamp-2">{{ block.settings.caption }}</p>
                  {% endif %}
                </div>
              </div>

              <!-- Platform Icon -->
              <div class="absolute top-2 right-2 w-6 h-6 bg-white/90 rounded-full flex items-center justify-center">
                {% if block.settings.platform == 'instagram' %}
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                {% elsif block.settings.platform == 'tiktok' %}
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.321 5.562a5.124 5.124 0 01-.443-.258 6.228 6.228 0 01-1.137-.966c-.849-.962-1.319-2.267-1.319-3.668a6.268 6.268 0 00-.011-.67H13.89v14.869c-.059 2.25-1.814 4.131-4.126 4.131-2.312 0-4.184-1.881-4.184-4.131 0-2.25 1.872-4.131 4.184-4.131.254 0 .5.024.738.067V8.155c-.246-.03-.496-.045-.738-.045C4.611 8.11.5 12.221.5 17.374.5 22.527 4.611 26.64 9.764 26.64c5.152 0 9.264-4.113 9.264-9.266V9.67c1.074.677 2.337 1.07 3.685 1.07v-3.521c-.851 0-1.638-.254-2.311-.657z"/>
                  </svg>
                {% endif %}
              </div>
            </div>
          {% endif %}
        {% endfor %}
      </div>
    </div>

    <!-- Call to Action -->
    <div class="text-center">
      <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
        {% if section.settings.instagram_url %}
          <a href="{{ section.settings.instagram_url }}"
             target="_blank"
             rel="noopener"
             class="btn btn-outline flex items-center">

            <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
            {{ 'social_feed.follow_instagram' | t }}
          </a>
        {% endif %}

        <button class="btn btn-gold" onclick="openShareModal()">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"></path>
          </svg>
          {{ 'social_feed.share_yours' | t }}
        </button>
      </div>

      <p class="text-sm text-muted-teal mt-4">
        {{ 'social_feed.encouragement' | t }}
      </p>
    </div>
  </div>
</section>
```

### JavaScript Social Feed Handler (assets/social-feed.js)

```javascript
class SocialFeed {
  constructor() {
    this.container = document.getElementById('social-feed-grid');
    this.loadingElement = this.container?.querySelector('.feed-loading');
    this.fallbackElement = this.container?.querySelector('.feed-fallback');

    this.instagramToken = this.container?.dataset.instagramToken;
    this.hashtag = this.container?.dataset.hashtag || 'RavanFashion';
    this.postLimit = parseInt(this.container?.dataset.postLimit) || 10;

    this.init();
  }

  init() {
    if (!this.container) return;

    this.loadSocialFeed();
  }

  async loadSocialFeed() {
    try {
      // Try Instagram first
      if (this.instagramToken) {
        await this.loadInstagramFeed();
      } else {
        throw new Error('No Instagram token provided');
      }
    } catch (error) {
      console.warn('Social feed failed to load:', error);
      this.showFallbackContent();
    }
  }

  async loadInstagramFeed() {
    const response = await fetch(
      `/apps/social-feed/instagram?token=${this.instagramToken}&hashtag=${this.hashtag}&limit=${this.postLimit}`
    );

    if (!response.ok) {
      throw new Error('Instagram API failed');
    }

    const data = await response.json();
    this.renderInstagramPosts(data.posts);
  }

  renderInstagramPosts(posts) {
    this.hideLoading();

    const feedHtml = posts.map(post => this.createPostHTML(post, 'instagram')).join('');

    const feedContainer = document.createElement('div');
    feedContainer.className = 'contents';
    feedContainer.innerHTML = feedHtml;

    this.container.appendChild(feedContainer);

    // Analytics
    this.trackFeedLoad('instagram', posts.length);
  }

  createPostHTML(post, platform) {
    return `
      <div class="social-post relative group cursor-pointer bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
           onclick="window.open('${post.permalink}', '_blank')">

        <div class="aspect-square overflow-hidden">
          <img src="${post.media_url}"
               alt="${post.caption ? post.caption.substring(0, 100) + '...' : 'Social post'}"
               class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
               loading="lazy">
        </div>

        <!-- Overlay -->
        <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
          <div class="absolute bottom-4 left-4 right-4 text-white">
            ${post.username ? `<p class="text-sm font-medium">@${post.username}</p>` : ''}
            ${post.caption ? `<p class="text-xs mt-1 line-clamp-2">${post.caption.substring(0, 80)}...</p>` : ''}
          </div>
        </div>

        <!-- Platform Icon -->
        <div class="absolute top-2 right-2 w-6 h-6 bg-white/90 rounded-full flex items-center justify-center">
          ${this.getPlatformIcon(platform)}
        </div>

        <!-- Engagement Stats -->
        ${
          post.like_count
            ? `
          <div class="absolute top-2 left-2 bg-white/90 rounded-full px-2 py-1 text-xs font-medium flex items-center">
            <svg class="w-3 h-3 mr-1 text-red-500" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd"></path>
            </svg>
            ${this.formatNumber(post.like_count)}
          </div>
        `
            : ''
        }
      </div>
    `;
  }

  getPlatformIcon(platform) {
    const icons = {
      instagram: `<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>`,
      tiktok: `<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19.321 5.562a5.124 5.124 0 01-.443-.258 6.228 6.228 0 01-1.137-.966c-.849-.962-1.319-2.267-1.319-3.668a6.268 6.268 0 00-.011-.67H13.89v14.869c-.059 2.25-1.814 4.131-4.126 4.131-2.312 0-4.184-1.881-4.184-4.131 0-2.25 1.872-4.131 4.184-4.131.254 0 .5.024.738.067V8.155c-.246-.03-.496-.045-.738-.045C4.611 8.11.5 12.221.5 17.374.5 22.527 4.611 26.64 9.764 26.64c5.152 0 9.264-4.113 9.264-9.266V9.67c1.074.677 2.337 1.07 3.685 1.07v-3.521c-.851 0-1.638-.254-2.311-.657z"/></svg>`,
    };

    return icons[platform] || '';
  }

  formatNumber(num) {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  }

  showFallbackContent() {
    this.hideLoading();

    if (this.fallbackElement) {
      this.fallbackElement.classList.remove('hidden');
    }
  }

  hideLoading() {
    if (this.loadingElement) {
      this.loadingElement.style.display = 'none';
    }
  }

  trackFeedLoad(platform, postCount) {
    if (typeof gtag !== 'undefined') {
      gtag('event', 'social_feed_load', {
        event_category: 'engagement',
        event_label: platform,
        post_count: postCount,
      });
    }
  }
}

// Global function for sharing modal
function openShareModal() {
  // Simple sharing encouragement - could be enhanced with modal
  const shareText = `Check out @RavanFashion's authentic Tamil heritage streetwear! 🔥 #RavanFashion #TamilHeritage`;

  if (navigator.share) {
    navigator.share({
      title: 'Ravan Fashion',
      text: shareText,
      url: window.location.href,
    });
  } else {
    // Fallback - copy to clipboard
    navigator.clipboard.writeText(shareText).then(() => {
      alert('Share text copied to clipboard!');
    });
  }
}

// Initialize when DOM loads
document.addEventListener('DOMContentLoaded', () => {
  new SocialFeed();
});
```

## Shopify Section Schema

```json
{
  "name": "Social Feed (UGC)",
  "tag": "section",
  "class": "social-feed-section",
  "settings": [
    {
      "type": "text",
      "id": "heading_english",
      "label": "Heading (English)",
      "default": "Community Showcase"
    },
    {
      "type": "text",
      "id": "heading_tamil",
      "label": "Heading (Tamil)",
      "default": "எங்கள் சமூகம் அணிந்திருப்பது"
    },
    {
      "type": "textarea",
      "id": "description",
      "label": "Description",
      "default": "See how our community is styling their Tamil heritage pieces"
    },
    {
      "type": "text",
      "id": "hashtags",
      "label": "Display Hashtags",
      "default": "RavanFashion, TamilHeritage, AuthenticStyle",
      "info": "Comma-separated list of hashtags to display"
    },
    {
      "type": "text",
      "id": "primary_hashtag",
      "label": "Primary Hashtag",
      "default": "RavanFashion",
      "info": "Main hashtag for fetching posts"
    },
    {
      "type": "text",
      "id": "instagram_access_token",
      "label": "Instagram Access Token",
      "info": "Instagram Basic Display API access token"
    },
    {
      "type": "url",
      "id": "instagram_url",
      "label": "Instagram Profile URL"
    },
    {
      "type": "range",
      "id": "post_limit",
      "label": "Number of Posts",
      "min": 5,
      "max": 20,
      "step": 1,
      "default": 10
    }
  ],
  "blocks": [
    {
      "type": "fallback_post",
      "name": "Fallback Post",
      "settings": [
        {
          "type": "image_picker",
          "id": "image",
          "label": "Post Image"
        },
        {
          "type": "text",
          "id": "username",
          "label": "Username"
        },
        {
          "type": "textarea",
          "id": "caption",
          "label": "Caption"
        },
        {
          "type": "text",
          "id": "alt_text",
          "label": "Alt Text"
        },
        {
          "type": "select",
          "id": "platform",
          "label": "Platform",
          "options": [
            {
              "value": "instagram",
              "label": "Instagram"
            },
            {
              "value": "tiktok",
              "label": "TikTok"
            }
          ],
          "default": "instagram"
        }
      ]
    }
  ],
  "presets": [
    {
      "name": "Social Feed",
      "blocks": [
        {
          "type": "fallback_post"
        },
        {
          "type": "fallback_post"
        },
        {
          "type": "fallback_post"
        }
      ]
    }
  ]
}
```

## Instagram API Integration

### Backend Route (recommended: Shopify Function or external service)

```javascript
// /apps/social-feed/instagram endpoint
app.get('/instagram', async (req, res) => {
  try {
    const { token, hashtag, limit } = req.query;

    // Instagram Basic Display API call
    const response = await fetch(
      `https://graph.instagram.com/me/media?fields=id,media_type,media_url,permalink,caption,timestamp&access_token=${token}&limit=${limit}`
    );

    const data = await response.json();

    // Filter posts by hashtag if specified
    const filteredPosts = hashtag
      ? data.data.filter(post => post.caption?.includes(`#${hashtag}`))
      : data.data;

    res.json({
      posts: filteredPosts.map(post => ({
        id: post.id,
        media_url: post.media_url,
        permalink: post.permalink,
        caption: post.caption,
        timestamp: post.timestamp,
      })),
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch Instagram posts' });
  }
});
```

## Localization Support

```json
// locales/en.default.json
{
  "social_feed": {
    "loading": "Loading community posts...",
    "follow_instagram": "Follow on Instagram",
    "share_yours": "Share Your Style",
    "encouragement": "Tag us in your photos to be featured! #RavanFashion #TamilHeritage"
  }
}

// locales/ta.json
{
  "social_feed": {
    "loading": "சமூக இடுகைகள் ஏற்றப்படுகின்றன...",
    "follow_instagram": "இன்ஸ்டாகிராமில் பின்தொடரவும்",
    "share_yours": "உங்கள் பாணியைப் பகிரவும்",
    "encouragement": "எங்களைக் குறிப்பிட்டு உங்கள் புகைப்படங்களைப் பகிரவும்!"
  }
}
```

## Definition of Done

- [ ] Social feed displays Instagram posts correctly
- [ ] Responsive grid layout working on all devices
- [ ] Fallback content shows if API fails
- [ ] Click-through to original posts functional
- [ ] Loading states and error handling implemented
- [ ] Analytics tracking for social engagement
- [ ] Cultural hashtags and content curated
- [ ] Performance optimized with lazy loading

## Dependencies

- Instagram Basic Display API setup
- Shopify app or external service for API calls
- Fallback content images and posts
- Brand hashtag strategy and moderation

## Files Created/Modified

- `sections/social-feed.liquid`
- `assets/social-feed.js`
- `assets/social-feed.css`
- `locales/en.default.json` (social feed keys)
- `locales/ta.json` (Tamil translations)

## Instagram API Setup Requirements

1. **Facebook Developer Account**
2. **Instagram Basic Display API**
3. **Access Token Generation**
4. **Webhook Configuration** (for real-time updates)
5. **Content Moderation System**

## Content Moderation Strategy

- [ ] Automated hashtag filtering
- [ ] Manual review process for featured content
- [ ] Community guidelines for brand hashtags
- [ ] Cultural appropriateness checks
- [ ] Legal compliance for user-generated content

## Performance Considerations

- [ ] Lazy loading for images
- [ ] API response caching (15-30 minutes)
- [ ] Optimized image sizes for mobile
- [ ] Graceful degradation if API fails
- [ ] Minimal JavaScript footprint

## Testing Checklist

- [ ] Feed loads with valid Instagram token
- [ ] Fallback content displays if API fails
- [ ] Responsive design across devices
- [ ] Click-through links work correctly
- [ ] Loading states display properly
- [ ] Tamil text and hashtags render correctly
- [ ] Performance impact acceptable

## Estimate Breakdown

- Section markup and styling: 1.5 hours
- JavaScript API integration: 2 hours
- Instagram API setup and testing: 1 hour
- Fallback content and error handling: 30 min
- **Total: 5 story points**
