# 7) Snippets (placeholders)

## snippets/variant-pickers.liquid

```liquid
{% for option in product.options_with_values %}
  <label class="block text-sm font-medium mt-4">{{ option.name }}</label>
  <select name="options[{{ option.name }}]" class="border rounded p-2 w-full">
    {% for value in option.values %}<option value="{{ value }}">{{ value }}</option>{% endfor %}
  </select>
{% endfor %}
```

## snippets/reviews-app-slot.liquid

```liquid
<!-- App block placeholder: insert Loox/Judge.me widget here via app block UI -->
<div id="reviews-slot"></div>
```

---
