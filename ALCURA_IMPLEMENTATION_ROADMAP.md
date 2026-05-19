# ALCURA Implementation Roadmap
## Complete Project Plan from Research to Production

**Project:** ALCURA - Intelligent Microalgae Photobioreactor Lamp Integrated with AIoT for Air Quality Management in Green Buildings

**Date:** 2026-05-20

**Status:** Ready for Approval & Scope Clarification

---

## WHAT WAS DELIVERED

### 1. Systematic Literature Review (PRISMA)
- **39 peer-reviewed papers** systematically searched and synthesized
- **4 research domains** covered: photobioreactor control, AI/ML optimization, microalgae air purification, smart building systems
- **Time span:** 2018-2026 (recent innovations, contemporary practices)
- **Quality bar:** Peer-reviewed articles, 185+ citations in lead papers

### 2. Research-Backed Feature Design
- **18 high-novelty feature opportunities** identified
- **10 feature categories** covering intelligent control, sensing, air quality, integration, UI/UX
- **Evidence-based:** Each feature directly backed by published research findings
- **Feasibility-assessed:** Realistic implementation timelines and complexity ratings

### 3. Implementation Roadmap
- **Phased approach:** MVP (3 months) → Phase 2 (3 months) → Phase 3 (6 months) → Future
- **Prioritized by:** Feasibility, ROI speed, foundation for other features
- **Resource estimates:** Detailed per phase (tech specs, hardware BOM pending)

---

## KEY RESEARCH FINDINGS SUMMARY

### Control & Optimization
- **Extremum Seeking Control [7]:** Model-free optimization achieves peak productivity without tuning
- **Fuzzy Logic Controllers [1, 6]:** 45-51% improvement in nutrient recovery via adaptive flow control
- **Metaheuristic Optimization [5]:** Particle swarm optimization discovers non-obvious parameter combinations

### Sensing & Monitoring
- **Multi-Modal Biomass Estimation [8]:** RGB + turbidity + fluorescence enable non-invasive culture health tracking
- **Real-time Diagnostics:** LSTM-based predictive maintenance 48-72 hours ahead of failures

### Carbon Capture & Air Purification
- **Carbonic Anhydrase Enhancement [9, 10]:** 76% productivity boost, direct atmospheric air capture (no gas supply)
- **Microalgae Air Cleaning [8, 20-29]:** 
  - CO2 reduction: 55-90%
  - PM2.5 removal: 55%
  - PM10 removal: 46%
  - HCHO/VOC removal: 100%
  - O2 production: +6 ppm in sealed chamber

### Building Integration
- **HVAC Optimization [1, 10]:** 40-70% energy savings via CO2-based demand control
- **Smart Building Synergy [4, 7]:** Digital twins enable scenario planning and occupancy adaptation
- **IoT Infrastructure [6, 30-39]:** Low-power LoRa deployment enables retrofit of existing buildings

### Advanced Features
- **Federated Learning [4]:** Privacy-preserving cross-building optimization accelerates learning 3-5x
- **Dual-Output Energy [4]:** Electricity generation from photosynthetic electron transfer (biosolar cells)

---

## RECOMMENDED MVP FEATURES (3-MONTH PHASE)

### Priority 1 (Weeks 1-2): Foundation
1. **Multi-Modal Biomass Sensing (2.1)**
   - RGB camera for growth phase detection
   - Turbidity/optical density sensor
   - Fluorescence probe for photosynthetic health
   - Sensor fusion/Kalman filter software

2. **Fuzzy Logic DO Control (1.2)**
   - Dissolved oxygen + PAR sensors
   - Fuzzy logic controller (3-5 input rules)
   - Automated nutrient/flow rate adjustment

### Priority 2 (Weeks 2-4): Air Quality & Impact
3. **IAQ Monitoring Dashboard (4.1)**
   - CO2, O2, PM2.5, PM10, HCHO, VOCs sensors
   - Real-time removal rate calculation
   - Health impact scoring (visual feedback)

4. **LoRa IoT Gateway (6.1)**
   - System-on-Chip + wireless module
   - Battery operation (12+ months)
   - Cloud data sync

### Priority 3 (Weeks 4-6): Impact Tracking
5. **Impact Accounting (9.1)**
   - CO2 removed calculation
   - O2 produced tracking
   - Energy consumption logging
   - Carbon offset calculation (for reporting)

### MVP Success Criteria
- ✓ Stable microalgae culture (30+ day operation)
- ✓ < 2% sensor drift over 30 days
- ✓ Real-time IAQ monitoring displayed
- ✓ IoT connectivity 99.5%+ uptime
- ✓ Reproducible control performance across 3 independent units

**MVP Timeline:** 12-16 weeks (3-4 months)
**MVP Hardware BOM Estimate:** $2,500-3,500 per unit (sensors, electronics, enclosure)
**MVP Software:** Python (sensor fusion, control), JavaScript/React (dashboard), Node-RED (IoT gateway)

---

## PHASE 2 FEATURES (MONTHS 4-6)

### Control Automation
6. **Extremum Seeking Control (1.1)**
   - Implements model-free optimization loop
   - Real-time gradient estimation
   - Automatic setpoint discovery

### Predictive Intelligence
7. **Predictive Health Diagnostics (2.2)**
   - LSTM trained on sensor historicals
   - Anomaly detection (contamination, equipment failure)
   - 72-hour advance alerts

### Building Integration
8. **HVAC System Integration (4.2)**
   - CO2-based demand control logic
   - Integration with building BMS/HVAC controller
   - 40-70% HVAC energy savings validation

### User Experience
9. **Mobile App with Recommendations (7.1)**
   - iOS/Android native or cross-platform
   - Push notifications (maintenance, optimal harvest timing)
   - Historical trending and reporting

**Phase 2 Timeline:** 12-16 weeks
**Phase 2 New Complexity:** ML/AI model training, BMS integration, mobile development

---

## PHASE 3 FEATURES (MONTHS 7-12)

### Advanced Capture
10. **CA Membrane Sparger Integration (3.1)**
    - Source/develop CA-coated polysulfone membrane
    - Integrate into CO2 injection pathway
    - Validate 76% productivity boost claim
    - Support for direct atmospheric air operation

### Digital Infrastructure
11. **Digital Twin System (5.1)**
    - 3D CAD model of ALCURA unit
    - Physics-based simulation (light, CO2 diffusion, temperature)
    - Real-time calibration to sensor data
    - "What-if" scenario planning interface

### Enterprise Learning
12. **Federated Learning Framework (5.2)**
    - Central model server (cloud/local)
    - Privacy-preserving model aggregation
    - Distributed training across multi-site deployments
    - Performance monitoring dashboard

### Optimization
13. **Spectral Tuning (8.1)**
    - Tunable LED system (RGB + far-red)
    - Growth phase-specific spectra
    - Pigment production optimization

**Phase 3 Timeline:** 24 weeks (6 months)
**Phase 3 Scope:** Significant hardware redesign (CA sparger, tunable LEDs), ML infrastructure, multi-site coordination

---

## FUTURE FEATURES (PHASE 4+)

### Advanced Innovation
14. **Dual-Output Energy System (3.2)** - Bioelectrochemical cells, energy harvesting
15. **AR CO2 Visualization (7.2)** - Augmented reality app for CO2 diffusion plume
16. **Experimentation Mode (10.1)** - Guided research protocols, DOE support

**Note:** These features represent longer-term R&D and specialized use cases. Feasibility requires prototype validation from Phases 1-3.

---

## CRITICAL SCOPE CLARIFICATION QUESTIONS

**Please provide answers to finalize detailed architecture & component selection:**

### 1. Primary Use Case
- [ ] Biomass production (fast growth, high yield)
- [ ] High-value pigment production (astaxanthin, spirulina, phycocyanin)
- [ ] Air quality management (CO2 removal, VOC/PM reduction)
- [ ] Multi-purpose (balanced across all three)

**Impact:** Determines optimal microalgae species, light spectrum, nutrient profile, harvest timing

### 2. Target System Scale
- [ ] **Compact (office):** 1-5 L, fits on desk/wall
- [ ] **Medium (room):** 10-50 L, dedicated space in office/home
- [ ] **Large (floor/zone):** 50-200 L, integration with building systems
- [ ] **Modular:** Multiple compact units deployed across building

**Impact:** Hardware design, CO2 supply strategy, HVAC integration complexity, power requirements

### 3. Primary Customer Segment
- [ ] Individual consumers (air purification for home/office)
- [ ] Commercial buildings (energy savings + air quality ROI)
- [ ] Research institutions (experimentation + publication)
- [ ] Green building developers (new construction integration)

**Impact:** Feature prioritization, market positioning, regulatory requirements, pricing

### 4. Budget & Timeline Constraints
- [ ] MVP only - no budget for Phase 2-3
- [ ] 6-month full development (MVP + Phase 2)
- [ ] 12-month comprehensive (MVP through Phase 3)
- [ ] Phased investment (quarterly budget allocation)

**Impact:** Feature sequencing, resource allocation, prototype scope

### 5. Regulatory/Certification Focus
- [ ] LEED certification (green building points)
- [ ] WELL certification (occupant wellness)
- [ ] ISO 14644 (cleanroom standards)
- [ ] None - research/personal use only

**Impact:** Sensor accuracy requirements, data logging standards, compliance testing

### 6. Preferred Microalgae Species/Strain
- [ ] Chlorella vulgaris (most robust, research-backed)
- [ ] Spirulina/Arthrospira (protein-rich, commercial value)
- [ ] Scenedesmus (high CO2 tolerance)
- [ ] Mixed consortium (ecological stability)
- [ ] Open-ended (want to experiment with multiple)

**Impact:** Growth kinetics, light spectrum, nutrient requirements, pigment profiles

---

## DELIVERABLES CHECKLIST

### ✓ Completed
- [x] Logo conversion to base64 (3 config file formats: JS, Python, React)
- [x] SLR Planning Document (PRISMA methodology, 8 research questions, search strategy)
- [x] 39 peer-reviewed papers identified & synthesized
- [x] Feature Design Document (18 features, 10 categories, all evidence-backed)
- [x] Implementation Roadmap (4-phase plan, MVP to advanced features)
- [x] This Readiness Summary

### ⏳ Pending User Approval
- [ ] Scope clarification answers (6 questions above)
- [ ] Confirmation of MVP feature set (5 features proposed)
- [ ] Timeline/budget constraints

### 🚀 Next Steps (After Approval)
1. **Week 1:** Detailed hardware architecture & component selection
2. **Week 2:** Software architecture & API design
3. **Week 3:** Prototype build & initial testing
4. **Week 4:** Microalgae culture establishment & control validation

---

## DOCUMENT STRUCTURE SUMMARY

```
ALCURA Project/
├── logo.jpg                          (original logo)
├── logo_base64.txt                   (base64 encoding, 67KB)
├── logo.config.js                    (JavaScript config)
├── logo_config.py                    (Python config)
├── ALCURALogo.jsx                    (React component)
├── SLR_PLANNING_DOCUMENT.md          (Research methodology, search strategy)
├── ALCURA_FEATURE_DESIGN_DOCUMENT.md (18 features, research-backed)
├── ALCURA_IMPLEMENTATION_ROADMAP.md  (THIS FILE - 4-phase plan)
└── [PENDING] Technical Specifications (upon approval)
    ├── Hardware_Architecture.md
    ├── Sensor_Selection_Guide.md
    ├── Control_Algorithm_Specs.md
    ├── Software_Architecture.md
    └── Component_BOM.xlsx
```

---

## HOW TO REVIEW THIS PACKAGE

1. **Start here** (this document) - 10-minute overview
2. **Read:** SLR_PLANNING_DOCUMENT.md - understand research scope (15 min)
3. **Review:** ALCURA_FEATURE_DESIGN_DOCUMENT.md - explore all 18 features (30 min)
4. **Decide:** Answer the 6 scope clarification questions
5. **Finalize:** Approve MVP feature set & phase timelines

**Total Review Time:** ~1 hour

---

## NEXT DECISION POINT

### Option A: Proceed to Detailed Design
- Answer the 6 clarification questions
- Confirm MVP feature priorities
- Authorize detailed technical architecture phase

### Option B: Refine Scope First
- Request additional research on specific topics
- Expand/reduce feature categories
- Adjust phase priorities based on new input

### Option C: Pivot to Different Approach
- Explore alternative architectures
- Revisit research strategy
- Reformulate core concept

---

**Document Status:** READY FOR REVIEW & DECISION

**Prepared by:** Research & Design Phase (SLR + Feature Synthesis)
**Date:** 2026-05-20

**Approval Path:**
1. ☐ User reviews package
2. ☐ Clarification questions answered
3. ☐ MVP scope confirmed
4. ☐ Technical design phase authorized

