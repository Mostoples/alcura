# ALCURA: Systematic Literature Review (SLR) Planning Document
## PRISMA-P Methodology Framework

**Project:** ALCURA - Intelligent Microalgae Photobioreactor Lamp Integrated with AIoT for Air Quality Management in Green Buildings

**Date Created:** 2026-05-20

**Purpose:** Identify high-novelty feature opportunities through systematic review of microalgae cultivation, photobioreactor systems, and AIoT integration research.

---

## 1. RESEARCH QUESTIONS (PRISMA-P)

### Primary Research Questions:
1. **RQ1:** What are current advances in automated microalgae photobioreactor control systems?
2. **RQ2:** How can AIoT integration improve microalgae cultivation efficiency and monitoring?
3. **RQ3:** What air quality parameters can be effectively managed through microalgae-based systems in built environments?
4. **RQ4:** What sensor technologies and data-driven approaches optimize photobioreactor performance?
5. **RQ5:** What novel features/capabilities distinguish state-of-the-art microalgae cultivation systems?

### Secondary Research Questions:
- RQ6: What are technical challenges in integrating microalgae systems into green building HVAC systems?
- RQ7: How do machine learning/AI approaches optimize growth conditions and biomass yield?
- RQ8: What regulatory/safety considerations apply to indoor microalgae cultivation systems?

---

## 2. INCLUSION/EXCLUSION CRITERIA

### Inclusion Criteria:
- **Publication Type:** Peer-reviewed journal articles, conference papers, systematic reviews, meta-analyses
- **Language:** English
- **Topics:** 
  - Photobioreactor design and automation
  - Microalgae cultivation systems
  - AIoT/IoT integration for environmental control
  - Air quality monitoring and management
  - Smart building systems
  - Machine learning for bioreactor optimization
  - Microalgae-based CO2 capture and air purification
- **Time Frame:** 2018-2026 (recent advances, contemporary approaches)
- **Study Design:** Experimental studies, case studies, design studies, simulation studies

### Exclusion Criteria:
- Non-peer-reviewed sources (blogs, white papers, promotional materials)
- Theoretical reviews without experimental validation
- Papers focused solely on microalgae biology without system/engineering aspects
- Studies not in English
- Papers focused on outdoor large-scale cultivation (unless integration principles apply)
- Studies predating 2018

---

## 3. INFORMATION SOURCES & SEARCH STRATEGY

### Primary Databases:
1. **PubMed** (via MCP PubMed server)
   - Biomedical/biological literature on microalgae, cultivation systems
   - Health/air quality implications

2. **Consensus** (via MCP Consensus server)
   - Peer-reviewed papers across disciplines
   - Meta-analyses and systematic reviews
   - 200M+ papers with academic rigor scoring

3. **Claude Scholar** (research-ideation skill)
   - Cross-disciplinary synthesis
   - Feature design ideation from research

### Search Strategy:

#### Search Set 1 - Core Photobioreactor Technology:
- PubMed: `photobioreactor design automation microalgae`
- Consensus: `photobioreactor control systems cultivation`
- Consensus: `microalgae cultivation efficiency optimization`

#### Search Set 2 - AIoT Integration:
- Consensus: `IoT Internet of Things bioreactor monitoring sensors`
- Consensus: `AI machine learning bioreactor optimization growth`
- Consensus: `intelligent cultivation systems environmental control`

#### Search Set 3 - Air Quality & Green Buildings:
- PubMed: `microalgae air quality purification indoor`
- Consensus: `CO2 capture photosynthesis building systems`
- Consensus: `smart building green building environmental management`

#### Search Set 4 - Sensor Technologies & Data:
- Consensus: `bioreactor sensors real-time monitoring data analytics`
- Consensus: `automated environmental control systems agriculture`

#### Search Set 5 - Integration & Novel Approaches:
- Consensus: `biointegration building materials living systems`
- Consensus: `photobioreactor lamp LED light optimization`

---

## 4. STUDY SELECTION PROCESS

### Phase 1: Screening (Title & Abstract)
- Execute all searches across three databases
- Target: ~150-300 initial results
- Screen for relevance to ALCURA scope
- Document inclusion/exclusion rationale

### Phase 2: Full-Text Review
- Retrieve full texts of included studies
- Extract key data (methodology, findings, technical specs)
- Assess study quality using adapted GRADE criteria
- Identify: innovations, challenges, gaps, opportunities

### Phase 3: Data Extraction & Synthesis
- Create extraction table with:
  - Study details (author, year, type)
  - Research focus (topic, methodology)
  - Key findings
  - Technical parameters (cultivation type, sensors, control methods)
  - Challenges identified
  - Opportunities/gaps for innovation

---

## 5. DATA EXTRACTION FRAMEWORK

### For Each Study - Extract:

**Study Identification:**
- Author(s), Year, Publication type
- Country/Institution
- Paper title, Journal/Conference

**Technical Content:**
- Microalgae species/strain focus
- Cultivation system type (closed photobioreactor, hybrid, etc.)
- Volume/Scale (mL, L, m³)
- Control parameters (light, temperature, pH, CO2, nutrients)
- Monitoring sensors used
- Automation/control approach
- AI/ML methods (if any)

**Key Findings:**
- Productivity metrics (biomass, growth rate, etc.)
- System efficiency gains
- Key innovations
- Integration approaches

**Challenges & Gaps:**
- Technical barriers identified
- System limitations
- Open problems
- Scaling challenges

**Novelty Indicators:**
- Novel control algorithms
- Innovative sensor deployments
- Integration with building systems
- Automation advances
- Data-driven optimization methods

---

## 6. QUALITY ASSESSMENT CRITERIA

Adapted GRADE approach for study quality:

| Criterion | High Quality | Medium | Low |
|-----------|-------------|--------|-----|
| **Methodology** | Clear design, validated methods | Adequate methods | Vague/not validated |
| **Reproducibility** | Full parameters reported | Most parameters | Incomplete data |
| **Sample Size** | Adequate replication | Moderate | Limited |
| **Peer Review** | Published in Q1/Q2 journal | Q3/Q4 or conference | Non-peer-reviewed |
| **Relevance** | Directly applicable | Moderately applicable | Tangential |

---

## 7. SYNTHESIS & FEATURE DESIGN APPROACH

### Analysis Plan:

**Stage 1: Thematic Analysis**
- Categorize findings by topic:
  - Photobioreactor design innovations
  - Sensor/monitoring advances
  - Control algorithm approaches
  - AI/ML integration methods
  - Air quality management
  - Integration challenges/solutions

**Stage 2: Gap Analysis**
- Identify underexplored areas
- Recognize unmet needs in current systems
- Map innovation opportunities

**Stage 3: Feature Ideation**
- From research findings → feature opportunities
- Prioritize by novelty + feasibility + impact
- Map to ALCURA system architecture

---

## 8. EXPECTED OUTCOME CATEGORIES

### Feature Categories to Explore:

#### A. **Intelligent Control & Optimization**
- Adaptive LED light spectrum based on growth phase
- Predictive nutrient/CO2 management via ML
- Multi-parameter optimization algorithms
- Self-learning growth condition profiles

#### B. **Advanced Monitoring & Sensing**
- Non-invasive biomass estimation (optical/spectroscopic)
- Real-time metabolite tracking
- Integrated environmental quality monitoring
- Predictive health/system diagnostics

#### C. **AIoT Integration**
- Cloud-connected cultivation optimization
- Cross-system learning (multiple bioreactors)
- Federated learning for distributed systems
- Smart building HVAC/CO2 management integration

#### D. **Air Quality & Building Integration**
- Dynamic CO2/O2 balance monitoring
- Volatile organic compound (VOC) capture tracking
- Humidity/temperature optimization for building zones
- Real-time air quality index (AQI) integration

#### E. **User Experience & Control**
- Intuitive mobile/web dashboard
- Predictive alerts (maintenance, optimal harvest timing)
- Automated report generation
- Integration with smart home/building systems

#### F. **Sustainability & Efficiency**
- Energy consumption optimization
- Water/nutrient cycling tracking
- Biomass yield prediction
- Environmental impact metrics

---

## 9. REVIEW PROTOCOL & TIMELINE

### Execution Phase (Post-Planning Approval):

1. **Week 1:** Database searches (all search sets)
   - PubMed: ~20-40 initial results per search
   - Consensus: ~50-100 per search (high quality)
   - Claude Scholar: Supplementary searches

2. **Week 1-2:** Title/Abstract screening
   - Apply inclusion/exclusion criteria
   - Target: ~80-120 papers for full review

3. **Week 2-3:** Full-text review & extraction
   - Extract data into structured table
   - Quality assessment
   - Document decisions

4. **Week 3-4:** Synthesis & feature ideation
   - Thematic analysis of findings
   - Gap identification
   - Feature opportunities mapping

5. **Week 4:** Feature design & documentation
   - High-novelty feature list with research backing
   - Implementation feasibility assessment
   - Design planning document

---

## 10. DELIVERABLES FROM SLR

### Output Documents:
1. **Literature Matrix** (Excel/Table)
   - All included studies with extraction data
   - Quality scores
   - Relevance tags

2. **Synthesis Report**
   - Thematic findings summary
   - Research landscape overview
   - Technology gaps and challenges
   - Future research directions

3. **Feature Opportunities Document**
   - High-novelty feature candidates
   - Research backing for each feature
   - Feasibility/complexity assessment
   - Recommendation ranking

4. **ALCURA Feature Design Plan**
   - Selected features for implementation
   - Architecture/technical approach
   - Implementation roadmap
   - Success metrics

---

## 11. RESEARCH TEAM ROLES

- **Literature Researcher:** Execute searches, screen abstracts, extract data
- **Synthesis Expert:** Analyze findings, identify patterns, assess quality
- **Feature Designer:** Map research → features, assess novelty/feasibility
- **Domain Expert (User):** Review quality, provide domain feedback, approve feature selections

---

## 12. NOTES & ASSUMPTIONS

- **Scope:** Literature published 2018-2026 to capture recent advances
- **Languages:** English-language papers only
- **Geographic Focus:** Global research, no geographic restriction
- **Species Focus:** All microalgae species relevant to indoor cultivation (not pre-restricted)
- **Scale Focus:** Lab to pilot-scale systems (commercial-scale approaches included if principles apply)
- **Quality Bar:** Peer-reviewed primary research preferred; reviews/meta-analyses for trend identification

---

## 13. APPROVAL & NEXT STEPS

### Pre-SLR Checklist:
- [ ] User reviews and approves research questions
- [ ] User confirms inclusion/exclusion criteria scope
- [ ] User confirms timeline is acceptable
- [ ] User clarifies any scope questions (microalgae species focus, target scale, primary goal)

### Questions for User Clarification:
1. **Microalgae Focus:** All species, or specific types (chlorella, spirulina, astaxanthin-producing, etc.)?
2. **Target System Scale:** Lab-bench (< 1L), pilot (1-50L), medium (50-500L)?
3. **Primary Goal:** Biomass production, air quality, pigment extraction, other?
4. **Budget/Complexity:** Any constraints on feature complexity or implementation cost?
5. **Timeline:** When needed? Can adjust search scope if urgent.

---

**Document Status:** DRAFT - Awaiting User Approval
**Last Updated:** 2026-05-20
