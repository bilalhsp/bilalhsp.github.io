---
layout: archive
title: "Blogs"
permalink: /blogs/
entries_layout: list
---

{% include base_path %}

{% for post in site.posts %}
  {% include archive-single.html %}
{% endfor %}
