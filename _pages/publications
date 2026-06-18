---
layout: archive
title: "Publications"
permalink: /publications/
---

{% assign pubs = site.publications | sort: "date" | reverse %}

{% for pub in pubs %}
<div style="display:flex; gap:14px; align-items:flex-start; margin-bottom:28px;">

  {% if pub.thumbnail %}
    <img src="{{ pub.thumbnail | relative_url }}"
         style="width:160px; height:100px; object-fit:cover; border-radius:6px; flex-shrink:0;">
  {% endif %}

  <div>
    <h3 style="margin:0 0 4px 0;">
      <a href="{{ pub.url | relative_url }}">{{ pub.title }}</a>
    </h3>

    {% if pub.authors %}
      <p style="margin:4px 0;">
        {{ pub.authors }}
      </p>
    {% endif %}

    {% if pub.venue %}
      <p style="margin:4px 0;">
        <em>{{ pub.venue }}</em>
      </p>
    {% endif %}

    {% if pub.summary %}
      <p style="margin-top:6px;">
        {{ pub.summary }}
      </p>
    {% endif %}

    <p>
      {% if pub.paperurl %}
        <a href="{{ pub.paperurl }}" target="_blank" rel="noopener noreferrer">Paper</a>
      {% endif %}

      {% if pub.codeurl %}
        | <a href="{{ pub.codeurl }}" target="_blank" rel="noopener noreferrer">Code</a>
      {% endif %}

      {% if pub.arxivurl %}
        | <a href="{{ pub.arxivurl }}" target="_blank" rel="noopener noreferrer">arXiv</a>
      {% endif %}
    </p>
  </div>

</div>
{% endfor %}
