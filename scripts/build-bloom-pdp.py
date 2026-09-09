from pathlib import Path
import json, re, hashlib
root = Path(__file__).resolve().parents[1]
section = root / 'sections/product-seamoss.liquid'
source = section.read_text(encoding='utf-8')
if 'hx-bloom-pdp' in source:
    raise SystemExit('Migration already applied. Edit the generated files directly.')
checkpoint = root / 'staging/pre-bloom-pdp-20260909'
checkpoint.mkdir(exist_ok=True)
for name in ['sections/product-seamoss.liquid', 'templates/product.seamoss.json']:
    destination = checkpoint / Path(name).name
    if not destination.exists():
        destination.write_bytes((root / name).read_bytes())
source = source.replace("{{ 'hx-pdp-playful.css' | asset_url | stylesheet_tag }}", "{{ 'hx-pdp-playful.css' | asset_url | stylesheet_tag }}\n{{ 'hx-bloom-pdp.css' | asset_url | stylesheet_tag }}")
source = source.replace('class="product-seamoss product-seamoss--gruns"', 'class="product-seamoss product-seamoss--gruns hx-bloom-pdp"')
source = source.replace('<div class="product-seamoss__details">', '<div class="product-seamoss__details">\n        <div class="hx-buybox">\n        <a class="hx-pdp-review-link" href="#customer-voices">Customer photos &amp; reviews ↗</a>')
source = source.replace('<div class="product-seamoss__purchase">', '<div class="product-seamoss__purchase">\n            <p class="hx-purchase-label">One-time purchase<small>Your selected jar, delivered once.</small></p>')
source = source.replace('{% if forloop.first %}open{% endif %}', '')
source = source.replace('{%- endform -%}\n      </div>', '{%- endform -%}\n        </div>\n        {% render \'hx-pair-with\', product: product, section: section %}\n      </div>')
needle = "    const variantDataEl = section.querySelector('[data-product-variants]');"
source = source.replace(needle, '''    section.querySelectorAll('.product-seamoss__flavor-grid').forEach((grid, index) => {
      if (grid.children.length <= 10) return;
      const toggle = document.createElement('button');
      toggle.type = 'button'; toggle.className = 'hx-flavors-toggle';
      grid.id = grid.id || `${section.id}-flavors-${index}`;
      toggle.setAttribute('aria-controls', grid.id);
      toggle.setAttribute('aria-expanded', 'false');
      toggle.textContent = `Explore all ${grid.children.length} flavors +`;
      toggle.addEventListener('click', () => {
        const expanded = grid.classList.toggle('is-expanded');
        toggle.setAttribute('aria-expanded', String(expanded));
        toggle.textContent = expanded ? 'Show fewer flavors −' : `Explore all ${grid.children.length} flavors +`;
      });
      grid.after(toggle);
    });
''' + needle)
section.write_text(source, encoding='utf-8')
template_path = root / 'templates/product.seamoss.json'
template = json.loads(re.sub(r'^/\*.*?\*/\s*', '', template_path.read_text(encoding='utf-8'), flags=re.S))
settings = template['sections']['main']['settings']
settings.update(eyebrow_text='HEALISTIX · FIND YOUR DAILY GOODNESS', support_points='Fruit flavors|Spoon, blend, enjoy|Your daily ritual', flavor_heading='Pick your flavor:', flavor_subheading='')
template['sections']['main']['blocks']['info_tab_1']['settings']['title'] = 'Tell me more'
template['sections']['main']['blocks']['info_tab_3']['settings']['title'] = 'How to enjoy'
reviews = template['sections']['reviews_grid']
reviews['type'] = 'hx-pdp-reviews'
reviews['settings']['heading'] = 'A little love from our community'
reviews['settings']['subheading'] = 'Selected customer reviews from Amazon. Explore their photos, videos and experiences across our flavors.'
template['sections']['product_steps']['disabled'] = True
template['sections']['benefits_list']['disabled'] = True
template['sections']['related-products']['disabled'] = True
template['order'] = ['main', 'product_faq', 'reviews_grid', 'product_steps', 'benefits_list', 'reviews_widget', 'related-products']
template_path.write_text(json.dumps(template, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
schema = (root / 'sections/product-reviews-grid.liquid').read_text(encoding='utf-8').split('{% schema %}')[1]
markup = '''{{ 'hx-pdp-reviews.css' | asset_url | stylesheet_tag }}
<script src="{{ 'hx-pdp-reviews.js' | asset_url }}" defer></script>
<section class="hx-pdp-reviews" id="customer-voices" data-pdp-reviews aria-labelledby="ReviewsTitle-{{ section.id }}">
  <div class="hx-pdp-reviews__inner">
    <div class="hx-pdp-reviews__intro">
      <div><h2 id="ReviewsTitle-{{ section.id }}">{{ section.settings.heading | escape }}</h2><p>{{ section.settings.subheading | escape }}</p><p>These are selected excerpts, not an overall product rating. Each review identifies its flavor and source.</p></div>
      {% if section.settings.source_url != blank %}<a class="hx-pdp-reviews__source" href="{{ section.settings.source_url }}" target="_blank" rel="noopener">See all on Amazon ↗</a>{% endif %}
    </div>
    <div class="hx-pdp-reviews__media" aria-label="Customer photos and videos">
      {% for block in section.blocks %}{% if block.settings.image_asset != blank %}
        <a href="#Review-{{ section.id }}-{{ block.id }}" data-review-jump aria-label="See review by {{ block.settings.badge | escape }}"><img src="{{ block.settings.image_asset | asset_url }}" width="96" height="96" loading="lazy" alt="Customer photo by {{ block.settings.badge | escape }}">{% if block.settings.video_asset != blank %}<span aria-hidden="true">▶</span>{% endif %}</a>
      {% endif %}{% endfor %}
    </div>
    <div class="hx-pdp-reviews__tools">
      <label>Flavor <select data-review-flavor><option value="">All flavors</option></select></label>
      <label>Sort <select data-review-sort><option value="featured">Featured</option><option value="recent">Most recent</option><option value="high">Highest rating</option><option value="low">Lowest rating</option></select></label>
      <label><input type="checkbox" data-review-media> Photos &amp; videos</label>
      <span class="hx-pdp-reviews__count" data-review-count role="status" aria-live="polite">{{ section.blocks.size }} selected reviews</span>
    </div>
    <div data-review-list>
    {% for block in section.blocks %}
      {% assign review_flavor = block.settings.footer | split: '·' | first | strip %}
      {% assign review_date = block.settings.footer | split: '·' | last | strip %}
      {% assign review_rating = block.settings.rating | split: '·' | last | strip | plus: 0 %}
      <article class="hx-review-row" id="Review-{{ section.id }}-{{ block.id }}" tabindex="-1" data-review-row data-flavor="{{ review_flavor | escape }}" data-date="{{ review_date | escape }}" data-rating="{{ review_rating }}" data-order="{{ forloop.index }}" data-media="{% if block.settings.image_asset != blank or block.settings.video_asset != blank %}true{% else %}false{% endif %}" {{ block.shopify_attributes }}>
        <div class="hx-review-row__author"><span class="hx-review-row__avatar" aria-hidden="true">{{ block.settings.badge | slice: 0 | escape }}</span><strong>{{ block.settings.badge | escape }}</strong><p>{{ block.settings.footer | escape }}</p></div>
        <div>
          {% if block.settings.rating != blank %}<div class="hx-review-row__rating">{{ block.settings.rating | escape }}</div>{% endif %}
          <h3>{{ block.settings.title | escape }}</h3>
          {% if block.settings.text != blank %}<blockquote>“{{ block.settings.text | escape | newline_to_br }}”</blockquote>{% endif %}
          {% if block.settings.video_asset != blank %}<div class="hx-review-row__attachment"><video controls playsinline preload="none" poster="{{ block.settings.image_asset | asset_url }}" aria-label="Customer video by {{ block.settings.badge | escape }}"><source src="{{ block.settings.video_asset | asset_url }}" type="video/mp4">{% if block.settings.captions_asset != blank %}<track kind="captions" src="{{ block.settings.captions_asset | asset_url }}" srclang="en" label="English" default>{% endif %}</video></div>
          {% elsif block.settings.image_asset != blank %}<a class="hx-review-row__attachment" href="{{ block.settings.source_url | default: section.settings.source_url }}" target="_blank" rel="noopener"><img src="{{ block.settings.image_asset | asset_url }}" alt="{{ block.settings.media_alt | default: block.settings.badge | escape }}" width="132" height="176" loading="lazy"></a>{% endif %}
          {% if block.settings.disclosure != blank %}<p class="hx-review-row__disclosure">{{ block.settings.disclosure | escape }}</p>{% endif %}
          <a class="hx-review-row__source" href="{{ block.settings.source_url | default: section.settings.source_url }}" target="_blank" rel="noopener">{% if block.settings.source_url != blank %}Read original review{% else %}Browse source reviews{% endif %} ↗</a>
        </div>
      </article>
    {% endfor %}
    </div>
    <p class="hx-pdp-reviews__empty" data-review-empty hidden>No selected reviews match these filters. Try another flavor or include reviews without photos.</p>
    <button class="hx-pdp-reviews__more" type="button" data-review-more hidden>Show more reviews</button>
  </div>
</section>
'''
(root / 'sections/hx-pdp-reviews.liquid').write_text(markup + '\n{% schema %}' + schema.replace('Product Reviews Grid', 'PDP Customer Reviews'), encoding='utf-8')
print('Updated Sea Moss template and generated dedicated review section.')
