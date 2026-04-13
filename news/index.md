---
layout: default
title: News
description: "Latest news, publications, and updates from the ACUTE Lab."
---

<section class="page-hero">
  <div class="page-hero__inner">
    <p class="page-hero__eyebrow">News</p>
    <h1 class="page-hero__title">Latest updates</h1>
  </div>
</section>

<section class="news-page">
  <div class="container">
    {% for post in site.posts %}
    <article class="news-item">
      <div class="news-item__date-col">
        <time class="news-item__date" datetime="{{ post.date | date: '%Y-%m-%d' }}">
          <span class="news-item__day">{{ post.date | date: "%b %-d" }}</span>
          <span class="news-item__year">{{ post.date | date: "%Y" }}</span>
        </time>
        {% if post.category %}
        <span class="news-item__cat">{{ post.category }}</span>
        {% endif %}
      </div>
      <div class="news-item__body">
        <h2 class="news-item__title"><a href="{{ post.url | relative_url }}">{{ post.title }}</a></h2>
        <p class="news-item__excerpt">{{ post.excerpt | strip_html | truncatewords: 40 }}</p>
        <a href="{{ post.url | relative_url }}" class="news-item__link">Read more &rarr;</a>
      </div>
    </article>
    {% endfor %}
  </div>
</section>
