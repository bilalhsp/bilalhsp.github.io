---
layout: archive
title: "Blogs"
permalink: /blogs/
entries_layout: list
---


{% for post in site.posts %}
  <div style="display:flex; gap:12px; margin-bottom:20px;">
    
    {% if post.thumbnail %}
      <img src="{{ post.thumbnail | relative_url }}" 
           style="width:120px; height:80px; object-fit:cover;">
    {% endif %}
    
    <div>
      <h3 style="margin:0;">
        <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
      </h3>
      <small>{{ post.date | date: "%b %d, %Y" }}</small>
      <p>{{ post.summary | default: post.excerpt }}</p>
    </div>
    
  </div>
{% endfor %}
