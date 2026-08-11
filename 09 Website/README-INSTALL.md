# Garden Route AgriHub — Safe Multi-Page Add-On

This package is designed specifically for the situation where the existing `index.html` is already working and must NOT be replaced.

## What is included

- `pages/business.html` — business overview
- `pages/finance.html` — financial intelligence and capital deployment
- `pages/operations.html` — operating model / technical scope
- `pages/impact.html` — impact and resilience framework
- `pages/investor.html` — investor intelligence, documents, scenario model, form and FAQ
- `pages/contact.html` — contact / partnership page
- `css/multipage.css` — supplemental styles only
- `js/multipage.js` — supplemental JavaScript only

## Install into the existing `09 Website/`

Copy these folders into your existing website:

```text
09 Website/
├── index.html                 ← KEEP YOUR EXISTING FILE UNCHANGED
├── css/
│   ├── style.css              ← KEEP YOUR EXISTING FILE
│   └── multipage.css          ← ADD THIS FILE
├── js/
│   ├── script.js              ← KEEP YOUR EXISTING FILE
│   └── multipage.js           ← ADD THIS FILE
├── assets/
│   ├── GR.png                 ← keep existing
│   └── GRnb.png               ← keep existing
└── pages/
    ├── business.html
    ├── finance.html
    ├── operations.html
    ├── impact.html
    ├── investor.html
    └── contact.html
```

The secondary pages already load both `../css/style.css` and `../css/multipage.css`, so they inherit the existing Garden Route visual system and only add the page-specific layer.

They use `../js/multipage.js`, deliberately keeping the main `js/script.js` untouched.

## Important

If your existing `index.html` already contains links such as `pages/business.html`, `pages/finance.html`, `pages/investor.html`, etc., no index change is required.

If those links are not present, add them later as normal links — but do not replace the index just to install this package.

## GitHub Pages

All page-to-page links are relative. This means the package works at:

`https://qamataomkhulu.github.io/Garden-Route/`

and when opened locally from the website folder.

GitHub remains the source-of-truth documentation layer; source links deliberately open the repository documents when the user chooses to verify them.
