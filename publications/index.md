---
layout: default
title: Publications
description: "Peer-reviewed publications from ACUTE Lab — vibrotactile perception, prosthetic feedback, spatial audio, room acoustics, and sensory substitution."
---

<section class="page-hero page-hero--image">
  <div class="page-hero__bg">
    <img class="page-hero__bg-img" src="{{ '/images/lobes_mold.jpg' | relative_url }}" alt="" loading="eager">
  </div>
  <div class="page-hero__inner">
    <p class="page-hero__eyebrow">Publications</p>
    <h1 class="page-hero__title">Research output</h1>
  </div>
</section>

<section style="padding:5rem 0;">
  <div class="pub-list">

    <div class="pub-filters">
      <button class="pub-filter is-active" data-filter="all">All</button>
      <button class="pub-filter" data-filter="haptics">Vibrotactile &amp; Haptics</button>
      <button class="pub-filter" data-filter="acoustics">Acoustics &amp; Spatial Audio</button>
      <button class="pub-filter" data-filter="perception">Perception &amp; Foraging</button>
    </div>

    {%- comment -%}
      Sort by year descending here, instead of relying on the YAML being in order.
      The CMS appends new pubs, so the file can easily fall out of order; this
      keeps the year headings monotonic regardless of insertion order.
    {%- endcomment -%}
    {% assign sorted_pubs = site.data.publications | sort: 'year' | reverse %}
    {% assign current_year = "" %}
    {% for pub in sorted_pubs %}
    {% assign pub_year = pub.year | toString %}
    {% if pub_year != current_year %}
      {% assign current_year = pub_year %}
      <h2 class="pub-year-heading" data-year="{{ pub.year }}">{{ pub.year }}</h2>
    {% endif %}
    {%- assign doi_clean = pub.doi | remove_first: 'https://doi.org/' | remove_first: 'http://doi.org/' | remove_first: 'doi:' -%}
    {%- assign has_image = false -%}{%- if pub.image and pub.image != "" -%}{%- assign has_image = true -%}{%- endif -%}
    {%- assign has_pdf = false -%}{%- if pub.pdf and pub.pdf != "" -%}{%- assign has_pdf = true -%}{%- endif -%}
    <div class="pub-item{% unless has_image %} pub-item--no-img{% endunless %}" data-topic="{{ pub.topic }}" data-year="{{ pub.year }}">
      {% if has_image %}
      <img class="pub-thumb" src="{{ pub.image | relative_url }}" alt="" loading="lazy">
      {% endif %}
      <div>
        <div class="pub-title"><a href="https://doi.org/{{ doi_clean }}" target="_blank" rel="noopener">{{ pub.title }}</a></div>
        <div class="pub-authors">{{ pub.authors }}</div>
        <div class="pub-venue"><span>{{ pub.venue }}</span> · {{ pub.year }}</div>
        <a href="https://doi.org/{{ doi_clean }}" class="pub-doi" target="_blank" rel="noopener">doi:{{ doi_clean }} →</a>{% if has_pdf %}<a href="{{ pub.pdf | relative_url }}" class="pub-doi pub-pdf" target="_blank" rel="noopener">PDF</a>{% endif %}
        {% if pub.summary %}
          <p class="pub-summary">{{ pub.summary }}</p>
        {% endif %}
      </div>
    </div>
    {% endfor %}

  </div>
</section>

<script>
document.addEventListener('DOMContentLoaded', function () {
  // Topic filters
  var buttons = document.querySelectorAll('.pub-filter');
  var items = document.querySelectorAll('.pub-item[data-topic]');
  var yearHeadings = document.querySelectorAll('.pub-year-heading');

  buttons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var filter = btn.getAttribute('data-filter');
      buttons.forEach(function (b) { b.classList.remove('is-active'); });
      btn.classList.add('is-active');
      items.forEach(function (item) {
        if (filter === 'all' || item.getAttribute('data-topic') === filter) {
          item.style.display = '';
        } else {
          item.style.display = 'none';
        }
      });
      // Show/hide year headings based on whether any items in that year are visible
      yearHeadings.forEach(function (heading) {
        var year = heading.getAttribute('data-year');
        var hasVisible = false;
        items.forEach(function (item) {
          if (item.getAttribute('data-year') === year && item.style.display !== 'none') {
            hasVisible = true;
          }
        });
        heading.style.display = hasVisible ? '' : 'none';
      });
    });
  });
});
</script>
