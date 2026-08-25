---
layout: default
title: Projects
description: "Active and emerging research projects at ACUTE Lab — from vibrotactile wearables to spatial audio datasets."
---

<section class="page-hero">
  <div class="page-hero__inner">
    <p class="page-hero__eyebrow">Projects</p>
    <h1 class="page-hero__title">What we're<br>building</h1>
    <p class="page-hero__sub">Named research initiatives spanning haptics, acoustics, perception, and wearable technology — each grounded in peer-reviewed work.</p>
  </div>
</section>

<section class="projects">
  <div class="container">
    {% assign all_projects = site.projects | sort: 'order' %}
    {% for project in all_projects %}
    {% assign num = forloop.index | prepend: "0" | slice: -2, 2 %}
    {% assign status_label = project.status | capitalize %}
    <a href="{{ project.url | relative_url }}" class="proj-card proj-card--linked">
      <div class="proj-card__header">
        <span class="proj-card__num">{{ num }}</span>
        <div>
          <h2 class="proj-card__title">{{ project.title }}</h2>
          <span class="proj-card__tag proj-card__tag--{{ project.status }}">{{ status_label }}</span>
          {% for tag in project.tags %}<span class="proj-card__tag">{{ tag }}</span>{% endfor %}
        </div>
      </div>
      <div class="proj-card__body">
        <div class="proj-card__desc">
          {{ project.content }}
        </div>
        <aside class="proj-card__meta">
          {% if project.team and project.team != "" %}
          <div class="proj-card__meta-block">
            <span class="proj-card__meta-label">Team</span>
            <span>{{ project.team }}</span>
          </div>
          {% endif %}
          {% if project.partners and project.partners != "" %}
          <div class="proj-card__meta-block">
            <span class="proj-card__meta-label">Partners</span>
            <span>{{ project.partners }}</span>
          </div>
          {% endif %}
          {% if project.funding and project.funding != "" %}
          <div class="proj-card__meta-block">
            <span class="proj-card__meta-label">Funding</span>
            <span>{{ project.funding }}</span>
          </div>
          {% endif %}
          {%- assign pslug = project.path | split: '/' | last | split: '.' | first -%}
          {%- assign proj_pubs = site.data.publications | where_exp: "pub", "pub.projects contains pslug" | sort: "year" | reverse -%}
          {% if proj_pubs.size > 0 %}
          <div class="proj-card__meta-block">
            <span class="proj-card__meta-label">Key publications</span>
            <ul class="proj-card__pubs">
              {% for pub in proj_pubs %}
              <li>{{ pub.title }}{% if pub.venue %} &middot; <em>{{ pub.venue | strip }}{% if pub.year %} {{ pub.year }}{% endif %}</em>{% endif %}</li>
              {% endfor %}
            </ul>
          </div>
          {% endif %}
        </aside>
      </div>
      {% if project.gallery_enabled and project.gallery and project.gallery.size > 0 %}
      {% assign has_photos = false %}
      {% for item in project.gallery %}{% if item.type != "video" and item.image %}{% assign has_photos = true %}{% endif %}{% endfor %}
      {% if has_photos %}
      <div class="proj-card__gallery">
        {% for item in project.gallery %}
          {% if item.type != "video" and item.image %}
          <img src="{{ item.image | relative_url }}" alt="{{ item.alt | default: item.caption | default: project.title }}" class="proj-card__gallery-img" loading="lazy">
          {% endif %}
        {% endfor %}
      </div>
      {% endif %}
      {% endif %}
    </a>
    {% endfor %}
  </div>
</section>
