# 6) Sections (Skeletons)

## sections/hero.liquid

```liquid
{% schema %}{
  "name":"Hero",
  "settings":[
    {"type":"image_picker","id":"bg","label":"Background"},
    {"type":"text","id":"title","label":"Title"},
    {"type":"text","id":"subtitle","label":"Subtitle"},
    {"type":"url","id":"cta_link","label":"CTA Link"},
    {"type":"text","id":"cta_label","label":"CTA Label","default":"{{ 'general.shop_now' | t }}"}
  ]
}{% endschema %}
<section class="relative grid place-items-center text-center py-16">
  {% if section.settings.bg %}
    <img src="{{ section.settings.bg | image_url: width:2000 }}" alt="" class="absolute inset-0 w-full h-full object-cover" loading="eager">
  {% endif %}
  <div class="relative z-10 max-w-3xl px-6">
    <h1 class="text-4xl md:text-6xl font-extrabold tamil-font text-maroon">{{ section.settings.title }}</h1>
    <p class="mt-4 text-lg text-charcoal/80">{{ section.settings.subtitle }}</p>
    {% if section.settings.cta_link %}
      <a href="{{ section.settings.cta_link }}" class="mt-6 inline-block bg-gold text-charcoal font-bold px-6 py-3 rounded-xl">{{ section.settings.cta_label }}</a>
    {% endif %}
  </div>
</section>
```

## sections/drop-countdown.liquid

```liquid
{% schema %}{"name":"Drop Countdown","settings":[{"type":"text","id":"target_iso","label":"Target ISO","default":"2025-11-01T00:00:00Z"}]}{% endschema %}
<div id="drop-countdown" data-target="{{ section.settings.target_iso }}" class="text-2xl md:text-3xl font-black"></div>
<script>
(function(){const el=document.currentScript.previousElementSibling;const t=new Date(el.dataset.target);function pad(n){return String(n).padStart(2,'0')}function tick(){const d=t-new Date();if(d<=0){el.textContent='Live Now';return}const days=Math.floor(d/864e5),h=Math.floor(d/36e5)%24,m=Math.floor(d/6e4)%60,s=Math.floor(d/1e3)%60;el.textContent=`${days}d ${pad(h)}h ${pad(m)}m ${pad(s)}s`;setTimeout(tick,1000)}tick()})();
</script>
```

## sections/proverb-rotator.liquid

```liquid
{% schema %}{
  "name":"Proverb Rotator",
  "settings":[{"type":"richtext","id":"items","label":"Tamil/English lines","default":"<p>ஒன்றுபட்டால் உயர்வு — United we rise</p>"}]
}{% endschema %}
<div class="prose text-center">
  {{ section.settings.items }}
</div>
```

## sections/product-main.liquid (slot for app blocks)

```liquid
{% schema %}{"name":"Product Main","settings":[],"blocks":[{"type":"reviews","name":"Reviews","limit":1,"settings":{}}],"target":"section"}{% endschema %}
<section class="grid md:grid-cols-2 gap-8">
  {% render 'gallery' %}
  <div>
    <h1 class="text-3xl font-bold">{{ product.title }}</h1>
    {% render 'variant-pickers', product: product %}
    <button class="mt-4 bg-gold text-charcoal font-bold px-6 py-3 rounded-xl">Add to cart</button>
    {% section 'design-story' %}
    {% for block in section.blocks %}
      {% if block.type == 'reviews' %}
        {% render 'reviews-app-slot' %}
      {% endif %}
    {% endfor %}
  </div>
</section>
```

## sections/design-story.liquid

```liquid
{% assign ds = product.metafields.custom.design_story.value %}
{% if ds %}
<section class="mt-10 border-t border-cream pt-6">
  <h2 class="text-2xl tamil-font text-maroon">{{ ds.tamil_term }}</h2>
  <p class="text-sm text-neutral-700">{{ ds.translation }}</p>
  <div class="prose mt-4">{{ ds.story_md | metafield_tag }}</div>
  {% if ds.artist_credit %}<p class="mt-2 text-xs">Artist: {{ ds.artist_credit }}</p>{% endif %}
</section>
{% endif %}
```

## sections/collection-grid.liquid (simplified)

```liquid
{% schema %}{"name":"Collection Grid","settings":[{"type":"collection","id":"coll","label":"Collection"}]}{% endschema %}
{% assign coll = section.settings.coll | default: collection %}
<div class="grid grid-cols-2 md:grid-cols-3 gap-6">
  {% for product in coll.products %}
    <a href="{{ product.url }}" class="block">
      {{ product.featured_image | image_url: width:800 | image_tag: class: 'w-full h-auto' }}
      <div class="mt-2 flex items-center justify-between">
        <span class="text-sm">{{ product.title }}</span>
        <span class="text-sm font-semibold">{{ product.price | money }}</span>
      </div>
    </a>
  {% endfor %}
</div>
```

---
