# Garden Route Integrated AgriHub — Investor Portal Update

This package preserves the supplied `index(3).html` as the master website and makes only the requested addition/replacement:

- Removes the old Institutional Data Room block.
- Replaces it with the Investor Portal section supplied by the project owner.
- Links every document card directly to its source document in the Garden-Route GitHub repository.
- Adds the Verified Source block and repository link.
- Preserves the existing dashboard, graphs, Seed-to-Shelf interactions, phase modals, roadmap, branding and animations.
- Cleans the JavaScript so the new direct-link document cards do not depend on GitHub iframe embedding.

## Required structure

```text
index.html
css/style.css
js/script.js
assets/GR.png
assets/GRnb.png
```

The existing website already references the logo files above. Keep those assets in the `assets` directory.
