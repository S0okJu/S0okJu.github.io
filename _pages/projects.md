---
layout: page
title: projects
permalink: /projects/
description: A growing collection of your cool projects.
nav: true
nav_order: 3
display_categories: []
horizontal: false
---

<!-- pages/projects.md -->
<div class="projects">
  {%- assign on_track_projects = site.projects | where: "status", "on track" -%}
  {%- assign other_projects = site.projects | reject: "status", "on track" -%}
  {%- assign sorted_projects = on_track_projects | concat: other_projects -%}
  {% include projects_list.liquid projects=sorted_projects %}
</div>