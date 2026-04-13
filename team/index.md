---
layout: default
title: Team
description: "The people behind ACUTE Lab — researchers, postdocs, and PhD candidates."
---

<section class="page-hero">
  <div class="page-hero__inner">
    <p class="page-hero__eyebrow">Team</p>
    <h1 class="page-hero__title">The people<br>behind the work</h1>
  </div>
</section>

<section class="team">
  <div class="container">
    <div class="team__grid team__grid--4">
      {% assign current_members = site.team | where: "status", "current" | sort: "order" %}
      {% for member in current_members %}
      <a href="{{ member.url | relative_url }}" class="person-card person-card--linked">
        <div class="person-card__photo-wrap">
          <img src="{{ member.photo | relative_url }}" alt="{{ member.title }}">
        </div>
        <div class="person-card__name">{{ member.title }}</div>
        <div class="person-card__role">{{ member.role }}</div>
      </a>
      {% endfor %}
    </div>
  </div>
</section>

{% assign collaborators = site.team | where: "status", "collaborator" | sort: "order" %}
{% if collaborators.size > 0 %}
<section class="team" style="border-top: 1px solid var(--border);">
  <div class="container">
    <div class="team__header">
      <span class="section-label">Collaborators</span>
    </div>
    <div class="team__grid team__grid--4">
      {% for member in collaborators %}
      <a href="{{ member.url | relative_url }}" class="person-card person-card--linked">
        <div class="person-card__photo-wrap">
          <img src="{{ member.photo | relative_url }}" alt="{{ member.title }}">
        </div>
        <div class="person-card__name">{{ member.title }}</div>
        <div class="person-card__role">{{ member.role }}</div>
      </a>
      {% endfor %}
    </div>
  </div>
</section>
{% endif %}

{% assign past_members = site.team | where: "status", "past" | sort: "order" %}
{% if past_members.size > 0 %}
<section class="team" style="border-top: 1px solid var(--border);">
  <div class="container">
    <div class="team__header">
      <span class="section-label">Past Members</span>
    </div>
    <div class="team__grid team__grid--4">
      {% for member in past_members %}
      <a href="{{ member.url | relative_url }}" class="person-card person-card--linked">
        <div class="person-card__photo-wrap">
          <img src="{{ member.photo | relative_url }}" alt="{{ member.title }}">
        </div>
        <div class="person-card__name">{{ member.title }}</div>
        <div class="person-card__role">{{ member.role }}</div>
      </a>
      {% endfor %}
    </div>
  </div>
</section>
{% endif %}
