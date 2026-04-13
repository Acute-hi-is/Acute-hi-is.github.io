---
layout: default
title: Home
---

<!-- HERO -->
<section class="hero" id="hero-slideshow">
  <div class="hero__slideshow">
    <div class="hero__slide is-active">
      <img src="{{ '/images/lab_group.jpg' | relative_url }}" alt="ACUTE Lab">
    </div>
    <div class="hero__slide">
      <img src="{{ '/images/sensory_substitution.jpg' | relative_url }}" alt="Sensory substitution research">
    </div>
    <div class="hero__slide">
      <img src="{{ '/images/kemar.jpg' | relative_url }}" alt="KEMAR mannequin in anechoic chamber">
    </div>
    <div class="hero__slide">
      <img src="{{ '/images/room_acoustics.jpg' | relative_url }}" alt="Room acoustics simulation">
    </div>
    <div class="hero__slide hero__slide--logo">
      <img src="{{ '/images/logo.svg' | relative_url }}" alt="ACUTE" class="hero__slide-logo">
    </div>
    <div class="hero__slide">
      <img src="{{ '/images/mannequin.jpg' | relative_url }}" alt="Prosthetic feedback mannequin">
    </div>
    <div class="hero__slide">
      <img src="{{ '/images/scan_pattern.png' | relative_url }}" alt="Attention and foraging research">
    </div>
    <div class="hero__slide">
      <img src="{{ '/images/KRI_sound_of_vision_170908_027.jpg' | relative_url }}" alt="Sound of Vision sensory substitution device">
    </div>
    <div class="hero__slide hero__slide--award">
      <img src="{{ '/images/carousel_ICT-2018-Sound-of-Vision-Award-652x1024.jpg' | relative_url }}" alt="ICT 2018 Sound of Vision Award">
    </div>
  </div>
  <div class="hero__inner">
    <div class="hero__label">ACoUstic and Tactile Engineering · University of Iceland</div>
    <h1 class="hero__title">
      We decode<br>
      <em>the senses —</em><br>
      and put them<br>
      to work.
    </h1>
    <p class="hero__sub">Vibrotactile interfaces. Spatial audio. Room acoustics.<br>
      Research that bridges perception science and engineering.</p>
    <div class="hero__actions">
      <a href="{{ '/research/' | relative_url }}" class="btn btn--primary">Explore our research</a>
      <a href="{{ '/contact/' | relative_url }}" class="btn btn--ghost">Get in touch</a>
    </div>
  </div>
</section>

<!-- ABOUT -->
<section class="about">
  <div class="container">
    <div class="about__grid">
      <div class="about__intro">
        <span class="section-label">About the lab</span>
        <h2>Engineering at the boundary of human perception</h2>
      </div>
      <div class="about__body">
        <p>ACUTE is an interdisciplinary research group at the University of Iceland. We sit at the intersection of human perception science, engineering design, and applied acoustics.</p>
        <p>We collaborate with prosthetics manufacturer <strong>Össur ehf.</strong>, spatial audio company <strong>Treble Technologies</strong>, and clinicians at <strong>Landspítali — National University Hospital</strong>. Funded by RANNÍS, NordForsk, and the European Union.</p>
      </div>
    </div>
  </div>
</section>

<!-- RESEARCH HIGHLIGHTS -->
<section class="highlights" id="research">
  <div class="container">
    <div class="highlights__header">
      <span class="section-label">Research areas</span>
      <h2>Six interconnected themes</h2>
    </div>
    <div class="highlights__grid">
      {% for area in site.data.research %}
      {% assign num = forloop.index | prepend: "0" | slice: -2, 2 %}
      <article class="highlight-card">
        <div class="highlight-card__img-wrap">
          <img class="highlight-card__img" loading="lazy" src="{{ area.highlight_image | relative_url }}" alt="{{ area.title }}">
        </div>
        <div class="highlight-card__body">
          <div class="highlight-card__number">{{ num }}</div>
          <h3>{{ area.title }}</h3>
          <p>{{ area.summary }}</p>
          <a href="{{ '/research/' | relative_url }}" class="highlight-card__link">Read more →</a>
        </div>
      </article>
      {% endfor %}
    </div>
  </div>
</section>

<!-- STATS TICKER -->
<section class="stats">
  <div class="stats-ticker" aria-label="Research highlights">
    <div class="stats-ticker__track">
      {% for stat in site.data.stats %}
      <a href="{{ stat.link }}" class="stats__item" target="_blank" rel="noopener">
        <span class="stats__number">{{ stat.number }}</span><span class="stats__label">{{ stat.label }}</span>
      </a>
      {% endfor %}
      <!-- duplicate set for seamless CSS loop -->
      {% for stat in site.data.stats %}
      <a href="{{ stat.link }}" class="stats__item" target="_blank" rel="noopener">
        <span class="stats__number">{{ stat.number }}</span><span class="stats__label">{{ stat.label }}</span>
      </a>
      {% endfor %}
    </div>
  </div>
</section>

<!-- GALLERY -->
<section class="gallery">
  <div class="container">
    <div class="gallery__header">
      <span class="section-label">Inside the lab</span>
      <h2>Equipment &amp; environment</h2>
    </div>
    <div class="gallery__strip">
      {% for item in site.data.gallery %}
      <figure class="gallery__item">
        <img src="{{ item.image | relative_url }}" alt="{{ item.alt }}" loading="lazy">
        <figcaption class="gallery__caption">{{ item.caption }}</figcaption>
      </figure>
      {% endfor %}
    </div>
  </div>
</section>

<!-- FEATURED RESEARCH -->
<section class="feature">
  {% for feat in site.data.features %}
  <div class="feature__row{% if feat.reverse %} feature__row--reverse{% endif %}">
    <div class="feature__img-col">
      <img src="{{ feat.image | relative_url }}" alt="{{ feat.image_alt }}" loading="lazy">
    </div>
    <div class="feature__text-col">
      <span class="section-label">{{ feat.label }}</span>
      <h3>{{ feat.title }}</h3>
      <p>{{ feat.text }}</p>
      <span class="feature__meta">{{ feat.meta }}</span>
      <a href="https://doi.org/{{ feat.doi }}" class="feature__link" target="_blank" rel="noopener">Read the paper →</a>
    </div>
  </div>
  {% endfor %}
</section>

<!-- TEAM -->
<section class="team" id="team">
  <div class="container">
    <div class="team__header">
      <span class="section-label">The people</span>
      <h2>Our team</h2>
    </div>
    <div class="team__grid">
      {% assign current_members = site.team | where: "status", "current" | sort: "order" %}
      {% for member in current_members %}
      <div class="person-card" data-bio="{{ member.excerpt | strip_html | strip_newlines }}" data-url="{{ member.url | relative_url }}">
        <div class="person-card__photo-wrap">
          <img src="{{ member.photo | relative_url }}" alt="{{ member.title }}" loading="lazy">
        </div>
        <div class="person-card__name">{{ member.title }}</div>
        <div class="person-card__role">{{ member.role }}</div>
        {% if member.email or member.profile %}
        <div class="person-card__links">
          {% if member.email %}<a href="mailto:{{ member.email }}">Email</a>{% endif %}
          {% if member.profile %}<a href="{{ member.profile }}" target="_blank" rel="noopener">Profile</a>{% endif %}
        </div>
        {% endif %}
      </div>
      {% endfor %}
    </div>

    <!-- Bio drawer — inserted by JS below the grid row of the clicked card -->
    <div class="bio-drawer" id="bio-drawer" hidden>
      <button class="bio-drawer__close" aria-label="Close bio">&times;</button>
      <div class="bio-drawer__inner">
        <img class="bio-drawer__photo" src="" alt="">
        <div>
          <div class="bio-drawer__name"></div>
          <div class="bio-drawer__role"></div>
          <p class="bio-drawer__text"></p>
          <a class="bio-drawer__more" href="">Read more &rarr;</a>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- NEWS -->
{% if site.posts.size > 0 %}
<section class="news-preview">
  <div class="container">
    <div class="news-preview__header">
      <div>
        <span class="section-label">News</span>
        <h2>Latest from the lab</h2>
      </div>
      <a href="{{ '/news/' | relative_url }}" class="news-preview__all">All news &rarr;</a>
    </div>
    <div class="news-preview__grid">
      {% for post in site.posts limit:3 %}
      <a href="{{ post.url | relative_url }}" class="news-card">
        <div class="news-card__date">
          <span class="news-card__month">{{ post.date | date: "%b" }}</span>
          <span class="news-card__day">{{ post.date | date: "%d" }}</span>
        </div>
        <div class="news-card__body">
          {% if post.category %}
          <span class="news-card__cat">{{ post.category }}</span>
          {% endif %}
          <h3 class="news-card__title">{{ post.title }}</h3>
          <p class="news-card__excerpt">{{ post.excerpt | strip_html | truncatewords: 20 }}</p>
        </div>
      </a>
      {% endfor %}
    </div>
  </div>
</section>
{% endif %}

<!-- PARTNERS -->
<section class="partners">
  <div class="container">
    <div class="partners__header">
      <div>
        <span class="section-label">Collaboration &amp; funding</span>
        <h2>Partners &amp; funders</h2>
      </div>
    </div>
    {% include partners-block.html %}
  </div>
</section>
