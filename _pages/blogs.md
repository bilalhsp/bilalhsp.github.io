---
layout: archive
title: "Blogs"
permalink: /blogs/
entries_layout: list
---
{% assign all_posts = site.posts %}

{% for post in site.posts %}
<div style="display:flex; gap:14px; align-items:flex-start; margin-bottom:28px;">

  {% if post.thumbnail %}
    <img src="{{ post.thumbnail | relative_url }}"
         style="width:140px; height:90px; object-fit:cover; border-radius:6px; flex-shrink:0;">
  {% endif %}

  <div>
    <h3 style="margin:0 0 4px 0;">
      <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
    </h3>
    <p style="margin-top:6px;">
      {{ post.summary | default: post.excerpt | strip_html | truncate: 140 }}
    </p>
    <!-- <small>{{ post.date | date: "%b %d, %Y" }}</small> -->
  </div>

</div>
{% endfor %}


{% for post in site.data.external_blogs %}
<div style="display:flex; gap:14px; align-items:flex-start; margin-bottom:28px;">

  {% if post.thumbnail %}
    <img src="{{ post.thumbnail | relative_url }}"
         style="width:140px; height:90px; object-fit:cover; border-radius:6px; flex-shrink:0;">
  {% endif %}

  <div>
    <h3 style="margin:0 0 4px 0;">
      <a href="{{ post.url }}" target="_blank" rel="noopener noreferrer">{{ post.title }}</a>
    </h3>
    <p style="margin-top:6px;">
      {{ post.summary }}
    </p>
  </div>

</div>
{% endfor %}


