#!/bin/bash
#
# create_repo.sh
# Bootstraps the "NACIRFA DREAM" repository locally and pushes it to GitHub.
#
# Usage:
#   chmod +x create_repo.sh
#   ./create_repo.sh
#
# Requirements:
#   - git installed and configured (git config --global user.name/user.email)
#   - GitHub CLI (gh) installed and authenticated (gh auth login)
#     Install via: brew install gh
#
# What this script does:
#   1. Creates a local project folder "nacirfa-dream"
#   2. Writes README.md, VISION_AND_MISSION.md, BUSINESS_MODEL.md,
#      CONTRIBUTING.md, and LICENSE into it
#   3. Initializes a git repository and makes the initial commit
#   4. Creates a matching remote repository on GitHub (via gh CLI)
#   5. Pushes the initial commit to GitHub
#

set -e  # Exit immediately if a command fails

# ------------------------------------------------------------------
# Configuration — edit these if you want different defaults
# ------------------------------------------------------------------
REPO_NAME="nacirfa-dream"
REPO_DESCRIPTION="NACIRFA DREAM - Building Climate-Resilient Communities Through Agriculture, Water and Innovation"
REPO_VISIBILITY="public"   # change to "private" if preferred
DEFAULT_BRANCH="main"

# ------------------------------------------------------------------
# Pre-flight checks
# ------------------------------------------------------------------
echo "==> Checking prerequisites..."

if ! command -v git &> /dev/null; then
    echo "Error: git is not installed. Install it first (e.g. 'brew install git')."
    exit 1
fi

if ! command -v gh &> /dev/null; then
    echo "Warning: GitHub CLI (gh) is not installed."
    echo "Install it with: brew install gh"
    echo "Then authenticate with: gh auth login"
    echo ""
    echo "This script will still create the local repo and files,"
    echo "but will NOT be able to create the GitHub remote or push automatically."
    HAS_GH=false
else
    HAS_GH=true
fi

# ------------------------------------------------------------------
# Create project directory
# ------------------------------------------------------------------
echo "==> Creating project directory: $REPO_NAME"

if [ -d "$REPO_NAME" ]; then
    echo "Directory '$REPO_NAME' already exists."
    read -p "Continue and write files into it anyway? (y/n): " CONFIRM
    if [ "$CONFIRM" != "y" ]; then
        echo "Aborted."
        exit 1
    fi
else
    mkdir "$REPO_NAME"
fi

cd "$REPO_NAME"

# ------------------------------------------------------------------
# Write README.md
# ------------------------------------------------------------------
echo "==> Writing README.md"
cat > "README.md" << 'FILEEOF'
<div align="center">

# 🌱 NACIRFA DREAM

### Building Climate-Resilient Communities Through Agriculture, Water and Innovation

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Status](https://img.shields.io/badge/status-active--development-brightgreen)](#)
[![Region](https://img.shields.io/badge/region-Garden%20Route%2C%20South%20Africa-blue)](#)
[![Focus](https://img.shields.io/badge/focus-AgriTech%20%7C%20Water%20%7C%20Renewable%20Energy-orange)](#)
[![Contributions Welcome](https://img.shields.io/badge/contributions-welcome-ff69b4.svg)](CONTRIBUTING.md)

</div>

---

## 📖 Overview

**NACIRFA DREAM** is the operating repository for the **Garden Route Integrated AgriHub** — a climate-smart agribusiness ecosystem that unites food production, water security, and renewable energy under a single, scalable model.

This repo serves as the central hub for the project's documentation, planning artifacts, operational tools, and technical resources as the venture grows from concept to a replicable regional enterprise.

> 🇿🇦 Built for South Africa's realities — food insecurity, water shortages, load shedding, and youth unemployment — and designed as a blueprint that can scale to other underserved regions.

---

## 🎯 Vision

To become one of Southern Africa's leading integrated agricultural enterprises by combining sustainable food production, renewable energy, water security, and innovative farming systems — improving livelihoods, strengthening food security, and creating long-term economic opportunity.

## 🚀 Mission

To develop scalable climate-smart farming systems that produce affordable, nutritious food, improve access to clean water, create employment, empower youth, and generate sustainable returns for investors — while protecting natural resources.

📄 Full details: [`VISION_AND_MISSION.md`](VISION_AND_MISSION.md)

---

## 🧩 The Problem We're Solving

| Challenge | Local Impact |
|---|---|
| 🍽️ Food insecurity | Rising costs, limited access to fresh produce |
| 💧 Water shortages | Unreliable municipal supply, drought exposure |
| 📈 Rising food prices | Strain on low-income households |
| 👩🏾‍🎓 Youth unemployment | Limited entry points into skilled work |
| ⚡ Load shedding | Disrupted production and cold-chain reliability |
| 🌍 Climate change | Unpredictable yields, resource stress |

---

## 🏗️ The AgriHub Ecosystem

The Garden Route Integrated AgriHub is designed as a **closed-loop system** — energy powers water treatment and irrigation, water and energy power food production, and food production funds reinvestment and community distribution.

```
                              ☀️  SOLAR ENERGY
                                    │
                 ┌──────────────────┼──────────────────┐
                 ▼                  ▼                  ▼
        ┌─────────────────┐ ┌──────────────┐ ┌─────────────────┐
        │  WATER SECURITY  │ │  IRRIGATION  │ │   FACILITIES    │
        │ ─────────────── │ │  (Solar-Pwrd)│ │  (Cold Storage,  │
        │ • Borehole        │ └──────┬───────┘ │   Packhouse)    │
        │ • Rainwater        │        │         └─────────────────┘
        │   Harvesting       │        │
        │ • Purification     │        ▼
        │ • Bulk Storage    │ ┌──────────────────────────┐
        └────────┬──────────┘ │     FOOD PRODUCTION       │
                  │            │ ────────────────────────  │
                  │            │ • Vegetables & Herbs       │
                  │            │ • Seedlings                │
                  │            │ • Greenhouses (future)     │
                  │            │ • Industrial Hemp (future) │
                  │            └─────────────┬──────────────┘
                  │                          │
                  ▼                          ▼
        ┌───────────────────┐     ┌────────────────────────┐
        │   WATER DELIVERY    │     │      DISTRIBUTION        │
        │  to Communities      │     │ ─────────────────────── │
        └───────────────────┘     │ • Subscription Veg Boxes │
                                    │ • Direct-to-Community    │
                                    │ • Schools & Businesses   │
                                    │ • Agri Consulting/Training│
                                    └────────────┬──────────────┘
                                                 ▼
                                     ┌──────────────────────┐
                                     │   COMMUNITY IMPACT     │
                                     │ ───────────────────── │
                                     │ • Jobs & Livelihoods    │
                                     │ • Food Security         │
                                     │ • Clean Water Access    │
                                     │ • Youth Empowerment     │
                                     │ • Investor Returns      │
                                     └──────────────────────┘
```

---

## 🌾 Core Business Pillars

1. **Food Production** — Vegetables, herbs, seedlings
2. **Water Security** — Purification, bulk storage, rainwater harvesting, borehole
3. **Renewable Energy** — Solar-powered irrigation and purification
4. **Distribution** — Subscription boxes, water delivery, direct-to-community sales
5. **Future Expansion** — Greenhouses, value-added products, industrial hemp

📄 Full breakdown: [`BUSINESS_MODEL.md`](BUSINESS_MODEL.md)

---

## 📊 Five-Year Goals

- 🏠 **300+** household subscription customers
- 🏫 Supply local **schools and businesses**
- 👷 Create **20–30 direct jobs**
- 🥬 Produce **100+ tonnes** of vegetables annually
- 💧 Distribute **clean drinking water** to surrounding communities
- ⚡ Install **renewable-energy-powered irrigation**
- 🌍 Build a **resilient, replicable model** for other regions

---

## 📁 Repository Structure

```
nacirfa-dream/
├── README.md                  # You are here
├── VISION_AND_MISSION.md      # Philosophy, context, and impact metrics
├── BUSINESS_MODEL.md          # Revenue streams and roadmap
├── CONTRIBUTING.md            # How to get involved
├── LICENSE                    # MIT License
└── create_repo.sh             # Repo bootstrap script
```

---

## 🤝 Get Involved

We welcome community partners, investors, agricultural consultants, and technical contributors. See [`CONTRIBUTING.md`](CONTRIBUTING.md) for how to plug in.

## 📜 License

This project is licensed under the [MIT License](LICENSE).

---

<div align="center">

**NACIRFA DREAM** — *Growing food, water, and opportunity — together.* 🌾💧⚡

</div>
FILEEOF

# ------------------------------------------------------------------
# Write VISION_AND_MISSION.md
# ------------------------------------------------------------------
echo "==> Writing VISION_AND_MISSION.md"
cat > "VISION_AND_MISSION.md" << 'FILEEOF'
# 🎯 Vision & Mission

## NACIRFA DREAM — Building Climate-Resilient Communities Through Agriculture, Water and Innovation

---

## 1. Our Vision

> To become one of Southern Africa's leading integrated agricultural enterprises by combining sustainable food production, renewable energy, water security, and innovative farming systems to improve livelihoods, strengthen food security, and create long-term economic opportunities for underserved communities.

We see a future where the Garden Route region — and eventually communities across Southern Africa — no longer treat food, water, and energy as three separate crises to be solved individually, but as **one interconnected system** that can be designed, managed, and scaled together.

## 2. Our Mission

> To develop scalable climate-smart farming systems that produce affordable nutritious food, improve access to clean water, create employment, empower youth, and generate sustainable returns for investors while protecting natural resources.

Our mission is deliberately dual-purpose: **commercial viability** and **social impact** are not in tension in this model — they are designed to reinforce one another. Every revenue stream is built to also advance a community outcome.

---

## 3. The South African Context

South Africa's agricultural and resource landscape presents a specific set of compounding challenges that NACIRFA DREAM is directly designed to address:

### 🍽️ Food Insecurity & Rising Prices
Millions of South African households experience regular food insecurity, and inflation on staple produce continues to outpace wage growth in many communities. Local, decentralized production shortens supply chains and stabilizes access to fresh vegetables.

### 💧 Water Shortages
Municipal water infrastructure across many regions — including the Garden Route, which has experienced severe historical drought (notably the 2017–2018 Day Zero crisis in the Western Cape) — is under strain. Diversified water sourcing (borehole, rainwater harvesting, purification) reduces dependency on a single, vulnerable supply.

### ⚡ Load Shedding
Scheduled power outages disrupt irrigation timing, cold storage, and water purification — all of which are time- and temperature-sensitive. Solar-powered infrastructure insulates core operations from grid instability.

### 👩🏾‍🎓 Youth Unemployment
South Africa's youth unemployment rate remains among the highest in the world. Agriculture, water management, and renewable energy are all sectors requiring hands-on, teachable skills — creating a natural pipeline for training and employment.

### 🌍 Climate Change
Shifting rainfall patterns and increasing temperature volatility threaten conventional farming timelines. Climate-smart techniques — water-efficient irrigation, greenhouse buffering, and diversified crops — build resilience into the production model itself.

---

## 4. Our Guiding Principles

1. **Integration over isolation** — food, water, and energy systems are designed as one ecosystem, not separate business lines.
2. **Community-first distribution** — pricing and access models prioritize local households, schools, and small businesses.
3. **Climate-smart by design** — every technical decision is evaluated against water efficiency, energy resilience, and soil health.
4. **Scalability and replicability** — systems and processes are documented so the model can be transplanted to new regions.
5. **Shared value** — investor returns, employee livelihoods, and community access are treated as co-equal success metrics, not trade-offs.

---

## 5. Long-Term Impact Metrics

NACIRFA DREAM measures success across four dimensions:

### 🥬 Food Security Impact
- Tonnes of fresh produce delivered to underserved households annually
- Number of subscription vegetable box customers
- Number of schools and community organizations supplied

### 💧 Water Access Impact
- Litres of clean water distributed to surrounding communities
- Number of households with improved water access
- Reduction in community reliance on strained municipal supply

### 👷 Economic & Social Impact
- Number of direct jobs created (target: 20–30 within five years)
- Number of youth enrolled in training/consulting programs
- Number of downstream livelihoods supported (delivery, retail, services)

### 🌍 Environmental Impact
- Percentage of operations powered by renewable energy
- Water efficiency gains from purification and harvesting systems
- Progress toward carbon and sustainability project certification

---

## 6. Long-Term Vision Beyond Five Years

Once the Garden Route AgriHub reaches operational maturity, NACIRFA DREAM's long-term ambition is to:

- **Replicate the model** in additional underserved regions across South Africa and Southern Africa
- Expand into **value-added food processing** to extend shelf life and market reach
- Develop **industrial hemp cultivation and processing** as a diversified, high-value crop line
- Formalize **carbon and sustainability project participation** as a recurring revenue and impact stream
- Establish NACIRFA DREAM as a **reference model** for climate-resilient, community-integrated agribusiness in the region

---

*Together, food, water, and energy are not three problems — they are one solution.*
FILEEOF

# ------------------------------------------------------------------
# Write BUSINESS_MODEL.md
# ------------------------------------------------------------------
echo "==> Writing BUSINESS_MODEL.md"
cat > "BUSINESS_MODEL.md" << 'FILEEOF'
# 💼 Business Model

## NACIRFA DREAM — The Garden Route Integrated AgriHub

---

## 1. Business Architecture

NACIRFA DREAM operates as an **integrated multi-revenue agribusiness**, where core infrastructure (water, energy, land) supports multiple complementary product and service lines. This diversification reduces reliance on any single revenue stream and strengthens overall resilience against seasonal, climate, or market shocks.

---

## 2. Revenue Streams

| # | Revenue Stream | Description | Stage |
|---|---|---|---|
| 1 | 🥬 **Vegetable Sales** | Wholesale and retail sale of fresh produce | Core |
| 2 | 💧 **Water Sales** | Purified/bulk water sold to households and businesses | Core |
| 3 | 🌱 **Seedling Sales** | Seedlings sold to home growers, smallholders, and farms | Core |
| 4 | 🚿 **Irrigation Installation Services** | Design and installation of solar-powered irrigation systems | Growth |
| 5 | 🧪 **Water Purification Contracts** | B2B/B2G purification service agreements | Growth |
| 6 | 🏡 **Greenhouse Produce** | Higher-margin, climate-controlled crop production | Expansion |
| 7 | 📋 **Agricultural Consulting** | Advisory services for climate-smart farming adoption | Expansion |
| 8 | 🎓 **Training Programs** | Paid and sponsored skills training in agri/water/energy | Expansion |
| 9 | 🌍 **Carbon & Sustainability Projects** | Participation in carbon credit and sustainability initiatives | Future |
| 10 | 🌿 **Hemp-Derived Products** | Industrial hemp cultivation and value-added processing | Future |

### Revenue Stream Tiering

- **Core** — Active from launch; primary near-term cash flow
- **Growth** — Introduced as operational capacity and reputation build
- **Expansion** — Layered in as infrastructure (e.g., greenhouses) comes online
- **Future** — Longer-horizon, higher-complexity streams requiring regulatory/scale groundwork

---

## 3. Community Distribution Model

NACIRFA DREAM's distribution strategy is built around **shortening the path between production and the household**, while keeping pricing accessible.

### 🥬 Subscription Vegetable Boxes
- Recurring weekly/bi-weekly boxes delivered directly to households
- Tiered box sizes for individuals, families, and bulk buyers
- Predictable demand → predictable production planning

### 💧 Water Delivery
- Bulk and household-scale delivery of purified water
- Priority access for communities most affected by supply instability
- Optional refill/subscription model to reduce packaging waste

### 🏫 Institutional Supply
- Direct supply agreements with local schools and businesses
- Volume-based pricing to support consistent institutional demand
- Positions NACIRFA DREAM as embedded local infrastructure, not just a vendor

### 🛒 Direct-to-Community Sales
- On-site and pop-up sales for walk-in/local buyers
- Strengthens community relationships and brand trust
- Acts as a real-time demand signal for production planning

---

## 4. Cost & Infrastructure Foundations

The business model is anchored by shared infrastructure investments that reduce marginal costs across multiple revenue lines:

- **Solar energy systems** power both irrigation and water purification — a single capital investment supporting two revenue streams
- **Water infrastructure** (borehole, rainwater harvesting, storage) supports both food production and direct water sales
- **Land and greenhouse infrastructure** scales incrementally, allowing phased capital deployment aligned to demand growth

This shared-infrastructure approach is core to the model's efficiency and long-term margin profile.

---

## 5. Five-Year Roadmap

### Year 1 — Foundation
- Establish core water infrastructure (borehole, purification, storage)
- Launch initial vegetable and seedling production
- Begin subscription vegetable box pilot with early community customers
- Install first phase of solar-powered irrigation

### Year 2 — Stabilization
- Expand subscription customer base
- Formalize water delivery service to surrounding community
- Initiate irrigation installation services as an external offering
- Begin structured job creation and training program design

### Year 3 — Growth
- Scale production toward annual tonnage targets
- Secure supply agreements with local schools and businesses
- Launch water purification contracts for institutional/commercial clients
- Begin greenhouse infrastructure development

### Year 4 — Expansion
- Bring greenhouse production online
- Launch agricultural consulting services
- Formalize training programs with certification pathways
- Explore carbon and sustainability project partnerships

### Year 5 — Maturity & Replication
- Reach 300+ household subscription customers
- Reach 20–30 direct jobs created
- Reach 100+ tonnes of annual vegetable production
- Evaluate industrial hemp cultivation feasibility
- Package the operating model for replication in additional regions

---

## 6. Five-Year Target Summary

| Metric | Target |
|---|---|
| Household subscription customers | 300+ |
| Institutional customers (schools/businesses) | Multiple active supply agreements |
| Direct jobs created | 20–30 |
| Annual vegetable production | 100+ tonnes |
| Water distribution | Ongoing clean water access for surrounding communities |
| Energy infrastructure | Renewable-energy-powered irrigation fully installed |
| Replicability | Documented, transferable model for new regions |

---

## 7. Investor Value Proposition

- **Diversified revenue** across food, water, energy services, and future high-value crops
- **Shared infrastructure** reduces marginal cost of scaling new revenue lines
- **Community-anchored demand** provides more predictable, recurring revenue than export/commodity-only models
- **Impact-aligned returns** — financial performance is directly tied to measurable community and environmental outcomes
- **Replicable model** — successful execution in the Garden Route creates a template for regional expansion, increasing long-term enterprise value

---

*A single investment in infrastructure. Multiple streams of return — financial, social, and environmental.*
FILEEOF

# ------------------------------------------------------------------
# Write CONTRIBUTING.md
# ------------------------------------------------------------------
echo "==> Writing CONTRIBUTING.md"
cat > "CONTRIBUTING.md" << 'FILEEOF'
# 🤝 Contributing to NACIRFA DREAM

Thank you for your interest in NACIRFA DREAM and the Garden Route Integrated AgriHub. This project grows through partnership — whether you're a community organization, investor, agricultural consultant, developer, or volunteer, there's a place for you here.

This document outlines how different types of contributors can get involved.

---

## 🌍 Who We're Looking to Partner With

- **Community organizations & local leaders** — helping shape distribution, pricing, and access models that genuinely serve local needs
- **Investors & funders** — aligned with long-term, impact-linked agribusiness growth
- **Agricultural consultants & agronomists** — climate-smart farming, soil health, and crop planning expertise
- **Water & renewable energy specialists** — borehole, purification, rainwater harvesting, and solar system expertise
- **Developers & technical contributors** — tools for operations, tracking, subscriptions, and reporting
- **Trainers & educators** — supporting the youth employment and skills development mission
- **Volunteers** — hands-on support during planting, harvest, and community distribution cycles

---

## 📋 General Contribution Principles

1. **Community impact first.** Every contribution should be evaluated against whether it strengthens food security, water access, or livelihoods in the communities we serve.
2. **Transparency.** Proposals, partnerships, and technical contributions should be clearly documented so others can understand and build on them.
3. **Sustainability over shortcuts.** We prioritize solutions that hold up over years, not just immediate wins.
4. **Respect for local context.** Contributors should engage with humility and a willingness to learn from the communities and conditions on the ground.

---

## 💰 For Investors & Funders

We welcome conversations with individuals and organizations interested in supporting the AgriHub's growth.

**To start a conversation, please provide:**
- A brief background on your organization or investment focus
- The type of support you're considering (capital, equipment, grant funding, in-kind resources)
- Any specific interest area (food production, water infrastructure, renewable energy, youth training, etc.)

Please reach out through the contact channel listed in the repository or organization profile to begin a discussion. Formal investment terms, financial projections, and due diligence materials are shared directly with serious inquiries and are not published in this public repository.

---

## 🌱 For Agricultural Consultants & Technical Specialists

If you have expertise in any of the following areas, we'd love to hear from you:

- Climate-smart crop planning and soil health
- Greenhouse design and operation
- Water purification and bulk storage systems
- Borehole development and rainwater harvesting
- Solar-powered irrigation design
- Industrial hemp cultivation and processing (future expansion)

**How to contribute:**
1. Open an issue in this repository describing your area of expertise and proposed contribution
2. Where relevant, include references to prior work, certifications, or case studies
3. We'll follow up to discuss scope — whether that's a one-time advisory session, an ongoing consulting relationship, or a documented best-practice contribution to this repository

---

## 💻 For Developers & Technical Contributors

As NACIRFA DREAM grows, we anticipate needs for lightweight internal tools — subscription management, delivery logistics tracking, water/production reporting dashboards, and similar operational tooling.

**If you'd like to contribute code:**
1. Fork this repository
2. Create a feature branch (`git checkout -b feature/your-feature-name`)
3. Make your changes with clear, well-commented code
4. Submit a pull request with a clear description of the change and its purpose
5. Be responsive to review feedback — we aim for constructive, collaborative reviews

**Guidelines:**
- Favor simple, maintainable solutions over complex ones
- Document any new tools or scripts clearly (a short README section or inline comments)
- Flag any dependencies or costs associated with proposed technical solutions

---

## 🎓 For Trainers, Educators & Volunteers

Youth empowerment and skills development are core to our mission. If you're interested in contributing training content, running workshops, or volunteering during planting/harvest cycles, please open an issue describing:

- The type of support you'd like to offer
- Your availability (one-time, seasonal, ongoing)
- Any relevant experience or materials you'd bring

---

## 📬 How to Reach Us

- **Issues:** Use the GitHub Issues tab for questions, proposals, or expressions of interest
- **Pull Requests:** For direct contributions to documentation or tooling in this repository
- **Direct Contact:** For investment, partnership, or sensitive inquiries, please use the contact details provided in the project's official communications

---

## 🙏 A Note of Thanks

NACIRFA DREAM is built on the belief that food, water, and opportunity should not be scarce for any community. Every contributor — from a first-time volunteer to a long-term investor — is helping build something designed to outlast any one season or setback.

Thank you for being part of this.
FILEEOF

# ------------------------------------------------------------------
# Write LICENSE
# ------------------------------------------------------------------
echo "==> Writing LICENSE"
cat > "LICENSE" << 'FILEEOF'
MIT License

Copyright (c) 2026 Nacirfa Dream

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
FILEEOF

# ------------------------------------------------------------------
# Initialize git repository
# ------------------------------------------------------------------
echo "==> Initializing git repository"

if [ ! -d ".git" ]; then
    git init -b "$DEFAULT_BRANCH"
else
    echo "Git repository already initialized."
fi

git add README.md VISION_AND_MISSION.md BUSINESS_MODEL.md CONTRIBUTING.md LICENSE
git commit -m "Initial commit: NACIRFA DREAM project foundation" || echo "Nothing new to commit."

# ------------------------------------------------------------------
# Create GitHub remote repository and push
# ------------------------------------------------------------------
if [ "$HAS_GH" = true ]; then
    echo "==> Creating GitHub repository via gh CLI"

    if gh repo view "$REPO_NAME" &> /dev/null; then
        echo "A GitHub repo named '$REPO_NAME' already exists under your account."
        echo "Skipping remote creation. Attempting to push to existing remote..."
        git remote add origin "$(gh repo view "$REPO_NAME" --json url -q .url).git" 2> /dev/null || true
    else
        gh repo create "$REPO_NAME" \
            --description "$REPO_DESCRIPTION" \
            --"$REPO_VISIBILITY" \
            --source=. \
            --remote=origin
    fi

    echo "==> Pushing to GitHub"
    git push -u origin "$DEFAULT_BRANCH"

    echo ""
    echo "✅ Done! Your repository is live at:"
    gh repo view --web --json url -q .url 2> /dev/null || gh repo view "$REPO_NAME"
else
    echo ""
    echo "✅ Local repository created and committed successfully."
    echo "To push to GitHub manually:"
    echo "  1. Create a new repository at https://github.com/new named '$REPO_NAME'"
    echo "  2. Run:"
    echo "     git remote add origin https://github.com/<your-username>/$REPO_NAME.git"
    echo "     git push -u origin $DEFAULT_BRANCH"
fi

echo ""
echo "==> All done. NACIRFA DREAM repository is ready."# Garden-Route
