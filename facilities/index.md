---
layout: default
title: Facilities
description: "Hire ACUTE Lab's research infrastructure — anechoic chamber, KEMAR manikin, Brüel & Kjær acquisition, multichannel audio, 3D scanning, and e-textile fabrication."
---

<section class="page-hero page-hero--image">
  <div class="page-hero__bg">
    <img class="page-hero__bg-img" src="{{ '/images/facilities/absorption-tube/absortpion-tube-2.jpg' | relative_url }}" alt="" loading="eager">
  </div>
  <div class="page-hero__inner">
    <p class="page-hero__eyebrow">Facilities</p>
    <h1 class="page-hero__title">Hire the lab</h1>
    <p class="page-hero__sub">ACUTE's acoustic, audio, and fabrication infrastructure is open to collaborators, visiting researchers, and artists. Explore what's available and get in touch to discuss access.</p>
  </div>
</section>

<section class="facilities-list">
  <div class="container">
    {% assign all_facilities = site.facilities | sort: 'order' %}
    {% for f in all_facilities %}
    <a href="{{ f.url | relative_url }}" class="facility-row">
      {% if f.image and f.image != "" %}
      <div class="facility-row__img-wrap">
        <img class="facility-row__img" src="{{ f.image | relative_url }}" alt="{{ f.title }}" loading="lazy">
      </div>
      {% endif %}
      <div class="facility-row__body">
        <span class="facility-card__tag">{{ f.tag }}</span>
        <h2 class="facility-row__name">{{ f.title }}</h2>
        <p class="facility-row__summary">{{ f.summary }}</p>
        <span class="facility-row__link">Learn more &rarr;</span>
      </div>
    </a>
    {% endfor %}
  </div>
</section>

<section class="facilities-cta">
  <div class="container">
    <h2>Interested in using our facilities?</h2>
    <p>Tell us about your project and what you need, and we'll help you get set up.</p>
    <a href="{{ '/contact/' | relative_url }}" class="facilities-cta__btn">Get in touch &rarr;</a>
  </div>
</section>
