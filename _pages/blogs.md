---
layout: archive
title: "Blogs"
permalink: /blogs/
entries_layout: list
---
{% for post in site.posts %}
  {% include archive-single.html %}
{% endfor %}
