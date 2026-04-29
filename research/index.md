---
layout: default
title: Research
description: "Six interconnected themes spanning vibrotactile perception, prosthetic feedback, sensory substitution, spatial audio, room acoustics, and human attention."
---

<section class="page-hero page-hero--slides">
  <div class="page-hero__slideshow">
    <img class="page-hero__slide" src="{{ '/images/lab_equipment.jpg' | relative_url }}" srcset="{{ '/images/responsive/lab_equipment-480w.jpg' | relative_url }} 480w, {{ '/images/responsive/lab_equipment-800w.jpg' | relative_url }} 800w, {{ '/images/lab_equipment.jpg' | relative_url }} 1200w" sizes="100vw" alt="">
    <img class="page-hero__slide" src="{{ '/images/kemar.jpg' | relative_url }}" srcset="{{ '/images/responsive/kemar-480w.jpg' | relative_url }} 480w, {{ '/images/responsive/kemar-800w.jpg' | relative_url }} 800w, {{ '/images/kemar.jpg' | relative_url }} 1200w" sizes="100vw" alt="">
    <img class="page-hero__slide" src="{{ '/images/lobes_mold.jpg' | relative_url }}" srcset="{{ '/images/responsive/lobes_mold-480w.jpg' | relative_url }} 480w, {{ '/images/responsive/lobes_mold-800w.jpg' | relative_url }} 800w, {{ '/images/lobes_mold.jpg' | relative_url }} 1200w" sizes="100vw" alt="">
  </div>
  <div class="page-hero__inner">
    <p class="page-hero__eyebrow">What we study</p>
    <h1 class="page-hero__title">Research</h1>
    <p class="page-hero__sub">Six interconnected themes spanning vibrotactile perception, prosthetic feedback, sensory substitution, spatial audio, room acoustics, and human attention — each grounded in formal experiments and informing device design.</p>
  </div>
</section>

{% for area in site.data.research %}
{% assign num = forloop.index | prepend: "0" | slice: -2, 2 %}
<div class="ra{% if forloop.index == 2 or forloop.index == 4 or forloop.index == 6 %} ra--flip{% endif %}">
  {% assign ra_name = area.image | split: '/' | last | split: '.' | first %}
  <div class="ra__img">
    <img src="{{ area.image | relative_url }}" srcset="{{ '/images/responsive/' | append: ra_name | append: '-480w.jpg' | relative_url }} 480w, {{ '/images/responsive/' | append: ra_name | append: '-800w.jpg' | relative_url }} 800w, {{ area.image | relative_url }} 1200w" sizes="(max-width: 768px) 100vw, 50vw" alt="{{ area.image_alt }}" loading="lazy">
  </div>
  <div class="ra__txt">
    <div class="ra__num">{{ num }}</div>
    <h2>{{ area.title }}</h2>
    {% for p in area.description %}
    <p>{{ p }}</p>
    {% endfor %}
    <div class="ra__pubs">
      <p class="ra__pubs-label">Key publications</p>
      <ul>
        {% for pub in area.pubs %}
        <li>{{ pub.text }} <a href="https://doi.org/{{ pub.doi }}" target="_blank" rel="noopener">doi:{{ pub.doi }}</a></li>
        {% endfor %}
      </ul>
    </div>
  </div>
</div>
{% endfor %}
