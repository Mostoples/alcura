# ALCURA XAI (eXplainable AI) Design
## Transparent, User-Friendly AI Explanations

**Project:** ALCURA 20L Spirulina Photobioreactor

**Date:** 2026-05-20

**Purpose:** Build user trust by explaining AI/ML decisions in plain language

---

## WHY XAI MATTERS FOR CONSUMER PRODUCTS

Consumer market (upper-middle class) demands **transparency:**
- "Why did the system reduce LED intensity?"
- "Why is it recommending harvest now?"
- "Why did the alert trigger?"

**Without XAI:** Black-box recommendations → user doubt → abandonment
**With XAI:** Clear explanations → trust → long-term adoption

---

## 1. DECISION EXPLAINABILITY FRAMEWORK

### 1.1 Fuzzy Logic Controller - DO-Based Aeration

**Decision:** "Increase air pump to 75% PWM"

**Explanation Generated:**

```
🔍 WHY THIS DECISION?

Dissolved Oxygen Status: 6.2 mg/L (LOW)
├─ Threshold: 8.0 mg/L minimum
├─ Current gap: 1.8 mg/L below target
└─ Risk: Culture stress if not addressed

Light Intensity: 420 μmol/(m²·s) (HIGH - peak daytime)
├─ Means: Photosynthesis rate HIGH
├─ Expected O2 production: +3 mg/L if aeration supports
└─ Decision logic: Increase O2 supply to match photosynthesis demand

Suspended Solids: 1.8 g/L (MODERATE)
├─ Cell density increasing
├─ Mixing needs: MEDIUM (more mixing = better gas transfer)

👉 ACTION TAKEN:
   Air pump set to 75% (increased from 50%)
   
⏱️ EXPECTED OUTCOME:
   DO should rise to 10-12 mg/L within 15 minutes
   Next check: 5 minutes
   
⚠️  IF NOT WORKING:
   Check: Pump running? Air tube clear? Diffuser stone clogged?
```

**User Benefit:**
- Understands what triggered the change
- Knows what to expect
- Can diagnose if something is wrong

### 1.2 Harvest Readiness Prediction

**Alert:** "Culture ready for harvest in 3 days"

**Explanation Generated:**

```
📊 HARVEST READINESS FORECAST

Culture Age: 27 days
├─ Typical cycle: 28-30 days for Spirulina
└─ Historical data: Your previous culture harvested at day 29

Biomass Concentration (estimated): 2.4 g/L
├─ Optimal harvest range: 2.0-3.0 g/L
├─ Current: 2.4 (EXCELLENT - middle of range)
├─ Projection in 3 days: 2.8-3.0 g/L (peak)
└─ Growth rate: +0.2 g/L per day (slowing = stationary phase)

Color Observation (from historical image analysis):
├─ Weeks 1-2: Bright green (growth phase)
├─ Weeks 3-4: Dark green → darker (stationary phase starting)
└─ Now: Consistent dark green (STABLE)

Cultural & Nutrient Status:
├─ pH: 9.1 (OPTIMAL for Spirulina)
├─ Temperature: 27.5°C (STABLE)
├─ Dissolved O2: 10.5 mg/L (HEALTHY)

🎯 RECOMMENDATION:
   Harvest in 3 days (Day 30) for maximum yield

💪 YIELD ESTIMATE:
   Expected dry biomass: ~270-300g (from 20L culture)
   
📝 NEXT STEPS:
   1. Prepare collection container
   2. Sterilize mesh filter
   3. Have RO water ready for new batch
```

**User Benefit:**
- Knows exactly when to harvest (maximum yield)
- Understands prediction rationale
- Can plan ahead (3-day warning)

---

## 2. SENSOR ANOMALY EXPLANATIONS

### 2.1 Unexpected Reading Alert

**Alert:** "⚠️ pH rising unusually fast (0.3 pH per hour)"

**Explanation Generated:**

```
🔔 SENSOR ANOMALY DETECTED

Parameter: Culture pH
├─ Current: 8.9
├─ 1 hour ago: 8.6
├─ Change rate: +0.3 pH/hour (UNUSUAL)
└─ Normal rate: ±0.1 pH/hour

🤔 POSSIBLE CAUSES:

1. CO2 Supply Issue (45% probability)
   ├─ Lower CO2 → culture consumes all available
   ├─ pH rises (less carbonic acid)
   ├─ Check: Is air pump running? Air tube clear?
   └─ Fix: Restart pump or clear blockage

2. Aeration Reducing CO2 Concentration (35% probability)
   ├─ High aeration rate removes dissolved CO2 faster
   ├─ If air pump >80%, reduce to 60-70%
   
3. Sensor Calibration Drift (15% probability)
   ├─ Not expected for 2 weeks since calibration
   ├─ Next calibration due: 10 days
   
4. Culture Stress Response (5% probability)
   ├─ Unlikely but possible if temperature spiked
   └─ Check: Temperature stable? Lights working?

📊 DATA SNAPSHOT:
   pH over last 6 hours:  8.5 → 8.6 → 8.7 → 8.8 → 8.9
   Trend: Linear increase
   
✅ RECOMMENDED ACTION:
   1. Check air pump status (visual/audio)
   2. Inspect air tube for kinks
   3. If uncertain, restart pump
   4. Monitor pH for next 30 minutes
   
📧 ESCALATE IF:
   pH continues rising above 9.5, OR
   pH sensor reads erratic values (jumps ±0.5)
```

**User Benefit:**
- Understands what's happening
- Knows what to check/fix
- Prevents culture crash

---

## 3. PERFORMANCE INSIGHTS & TRENDS

### 3.1 Weekly Summary Report

**Dashboard Widget: "This Week Summary"**

```
📈 WEEK 4 PERFORMANCE SUMMARY

Culture Growth: +0.8 g/L (excellent)
├─ Trajectory: On track for day-30 harvest
├─ Growth curve: Exponential slowing (expected)
└─ vs. Last week: +0.7 g/L (slightly faster)

🌡️  Environmental Stability:
├─ Temperature variance: ±1.2°C (EXCELLENT)
├─ pH drift: +0.2 pH (NORMAL)
├─ DO swings: ±2 mg/L (HEALTHY)
└─ CO2 input: Consistent (no issues)

💡 LED Performance:
├─ Operating hours: 112h (16h/day, 7 days)
├─ Average intensity: 350 μmol/(m²·s)
├─ UV output: Stable (no degradation)
├─ Lux variation: ±50 (accounting for ambient light)

🎯 System Efficiency:
├─ Biomass per watt: 0.12 g/Wh (baseline for comparison)
├─ Energy cost: $0.15 for this week's growth
└─ Air pump duty cycle: 65% average (efficient)

⚠️  ALERTS THIS WEEK:
├─ None (PERFECT WEEK)

🔮 7-DAY FORECAST:
├─ Predicted harvest date: Day 30 (Friday)
├─ Expected yield: 280-300g dry biomass
└─ Confidence: 92%

💡 OPTIMIZATION SUGGESTIONS:
   1. (No changes recommended - system performing optimally)
```

**User Benefit:**
- Quick overview of system health
- Sees trends, not just data points
- Confidence in predictions

---

## 4. "ASK THE SYSTEM" - INTERACTIVE EXPLANATIONS

### 4.1 Natural Language Q&A Interface

**User asks (mobile app):** "Why is the CO2 so much lower today?"

**System responds:**

```
📌 Your Question: Why is CO2 so much lower today?

Current CO2: 380 ppm (usually 420-450 ppm)
└─ Difference: -40 to -70 ppm from baseline

🔍 ROOT CAUSE ANALYSIS:

✓ LIKELY: Increased ventilation today
  ├─ Door/window opened? (dilutes indoor CO2)
  ├─ HVAC running more? (refreshing air)
  └─ Impact: Pulls outdoor air (390 ppm baseline) into room

✓ CONFIRMED FACTOR: Your ALCURA is working!
  ├─ CO2 removal rate: +25 ppm/hour
  ├─ Culture is actively consuming CO2
  └─ This is GOOD - shows photosynthesis active

✗ NOT the issue: LED failure or equipment malfunction
  ├─ All systems operating normally
  └─ Lights on schedule, pump running

📊 WHAT THIS MEANS:
   Your ALCURA is successfully purifying the room.
   Lower indoor CO2 = cleaner air.
   
   The outdoor baseline (~380 ppm) is normal.
   No action needed - system is working as designed.

💭 WOULD YOU LIKE TO:
   ☐ See historical CO2 trend (last 7 days)
   ☐ Compare to room CO2 without ALCURA
   ☐ Learn more about CO2 and air quality
```

**User Benefit:**
- Direct answers to their questions
- Builds understanding over time
- Increases system trust

---

## 5. FEATURE: "EXPLAIN THIS DECISION" BUTTON

### 5.1 One-Click Explainability

**Scenario:** LED intensity just reduced from 100% to 70%

**User clicks: "💡 Why did lights dim?"**

**Popup explanation:**

```
💡 LED DIMMING EXPLANATION

What Happened:
   LED brightness reduced from 100% → 70%
   
When:
   2024-05-20 14:30 (just now)
   
Why:
   🌞 HIGH AMBIENT LIGHT DETECTED
   ├─ Lux sensor reading: 8,500 lux (outdoor level)
   ├─ Interpretation: Sunlight streaming through window
   ├─ Decision: Reduce artificial LEDs to avoid overheating
   
   + TEMPERATURE RISING SLIGHTLY
   └─ Thermal sensor: 30.1°C (near threshold)
   
   Combination: Both factors triggered adaptive dimming
   
What It Does:
   ✅ Prevents culture overheating
   ✅ Saves energy (20W less power)
   ✅ Maintains photosynthesis rate (sun + reduced LED = same light)
   ✅ Extends LED lifespan (less thermal stress)

Impact:
   Expected culture T: 28-29°C (comfortable range)
   Expected light: ~380 μmol/(m²·s) (still optimal)
   
When Lights Return to 100%:
   Lux drops below 2,000 (sunset) OR
   Manual override requested

Questions?
   📚 Learn more about light management
   🔧 Manually adjust LED intensity
   ❌ Dismiss
```

**User Benefit:**
- Transparency builds trust
- Understands system intelligence
- Can override if needed

---

## 6. EXPLANATORY VISUALIZATIONS

### 6.1 Decision Tree Visualization

**Example: "Should I harvest now?"**

```
        START
          |
    [Is culture 25+ days old?]
       /            \
     YES             NO
      |              |
   [Is biomass     WAIT
   2.0-3.0 g/L?]  (too young)
    /        \
  YES        NO
   |         |
[Is pH    TRY LATER
optimal?]  (needs growth)
 /    \
YES   NO
|     |
✅    CHECK pH
HARVEST (adjust)
NOW    
```

**Mobile App Visualization:**
- Expandable tree (tap each node to see explanation)
- Green (✅) = proceed, Orange ⚠️ = investigate, Red ❌ = not ready
- Clear decision path from data to recommendation

### 6.2 Sensor Correlation Heatmap

**Dashboard chart:** Shows how sensors influence key decisions

```
                 Decision: "Increase Aeration"
                          |
    Dissolved O2  ████████░░  (90% influence)
    Light Intensity ████████░░  (70% influence)
    Temperature    ██░░░░░░░░  (20% influence)
    Biomass        ████░░░░░░  (40% influence)
    pH             ░░░░░░░░░░  (0% - not relevant)

    Hover/tap for: "Which sensor matters most?"
```

**User Benefit:**
- Intuitive understanding of ML model
- Sees what data drives decisions
- Can identify broken sensors

---

## 7. EXPLAINABILITY IN ALERTS

### 7.1 Tiered Alert Complexity

**SIMPLE VERSION** (default, mobile app):
```
⚠️ pH rising fast - check CO2 supply
```

**DETAILED VERSION** (click "more"):
```
⚠️ pH ALERT - RISING QUICKLY

Severity: Medium (action needed within 1 hour)

Current pH: 9.2 (was 8.9 at 14:00)
Change: +0.3 in 30 minutes (unusual)

Likely cause: CO2 supply low
├─ Lower CO2 → fewer H+ ions
└─ Solution: Check air pump, clear blockage

Probability: 70% this is the issue
Confidence: High (we've seen this pattern before)

IMMEDIATE ACTION:
☐ Verify pump is running (listen for hum)
☐ Check air tube for kinks
☐ If still rising after 30 min: Reduce aeration

ESCALATE IF:
❌ pH reaches 9.5 (critical for Spirulina)
❌ pH sensor reads erratic (potential hardware failure)
```

**TECHNICAL VERSION** (for power users):
```
Fuzzy Logic Controller Alert:
- Input 1: pH_rate_of_change = +0.3/30min (FUZZY: HIGH_DRIFT)
- Input 2: dissolved_CO2_estimated = 12 mg/L (FUZZY: LOW)
- Input 3: air_pump_duty = 65% (FUZZY: MEDIUM)

Rule Triggered: IF (pH_drift is HIGH) AND (CO2 is LOW) THEN alert_severity = MEDIUM

Recommended output: increase_air_pump_to_80%
User action: manual (automatic increase disabled in user prefs)

Confidence score: 0.78 (78% certainty this diagnosis is correct)
```

**User Benefit:**
- Choose complexity level they need
- Can dig deeper if interested
- Always informed, never confused

---

## 8. LEARNING & FEEDBACK LOOP

### 8.1 "Was That Explanation Helpful?" System

**After each major alert:**

```
Was this explanation helpful?
☐ Very helpful - I understood and took action
☐ Somewhat helpful - I got the idea
☐ Not helpful - too confusing
☐ Not helpful - too technical
☐ Not helpful - not enough detail

Your feedback helps us improve explanations!
```

**Backend:** Track which explanations users find helpful
- Adjust complexity based on patterns
- Refine language/examples over time
- A/B test explanation styles

### 8.2 Personalization

**System learns user preferences:**

After 2-3 weeks:
- "You prefer detailed explanations with data"
- Automatically increases detail level for this user
- Adds more charts/numbers vs. prose

Different users get:
- **Casual users:** Simple, action-focused ("check pump")
- **Enthusiasts:** Detailed with rationale ("low CO2 because pH rising, indicates...")
- **Data nerds:** Full fuzzy logic rules, confidence scores

---

## 9. TRUST-BUILDING FEATURES

### 9.1 "Why I Exist" - System Transparency Page

**In app settings → About ALCURA → "How I Work"**

```
🤖 ALCURA INTELLIGENCE OVERVIEW

I'm not magic - here's how I actually work:

1. SENSING
   I read 9 sensors every few seconds:
   - Temperature, pH, CO2, O2, light, UV, particles, humidity, clarity
   - Total data: ~36,000 readings per day
   
2. FUZZY LOGIC CONTROL
   I don't "think" - I follow If/Then rules created by microalgae scientists:
   
   IF dissolved_oxygen is LOW
      AND light is HIGH
   THEN increase_air_pump
   
   CONFIDENCE: These rules have been tested on thousands of Spirulina cultures
   
3. MONITORING
   I watch for patterns and anomalies:
   - Normal pH drift: ±0.1 per hour ✅
   - Unusual pH drift: ±0.3 per hour ⚠️ (something's wrong)
   
4. RECOMMENDATIONS
   Based on data + patterns + research:
   - "Harvest when biomass hits 2.5 g/L"
   - "Check pump if DO crashes suddenly"
   - "Expect algae stress if temp >32°C"
   
WHAT I CAN'T DO:
   ❌ Read your mind (tell me what you want!)
   ❌ Predict 30+ days ahead (too many variables)
   ❌ Fix equipment failures (need human hands)
   
WHAT I TRACK:
   ✅ All decisions I make (explainable)
   ✅ All alerts I send (with reasoning)
   ✅ All user feedback (to improve)
   
LIMITATIONS:
   - First-time users: Need manual tuning (I learn fast though)
   - New algae strains: May not have optimal rules yet
   - Hardware failure: Can't fix, only alert
   
PRIVACY:
   - All data stays on your device/cloud account
   - No data shared with others
   - You can delete anytime
```

**User Benefit:**
- Understands AI is not "black box" but rule-based
- Knows exactly what system is/isn't capable of
- Builds realistic expectations

### 9.2 Audit Trail - Complete Decision History

**In app: Analytics → "Decision Log"**

```
📋 ALL DECISIONS THIS MONTH

Harvest Prediction (Day 1 → Day 30):
├─ Day 1: "Not ready, too young"
├─ Day 15: "Predicted day 28, confidence 82%"
├─ Day 20: "Predicted day 29, confidence 88%"
├─ Day 25: "Predicted day 30, confidence 92%"
└─ Day 30: ✅ RECOMMENDED HARVEST (84% yield accuracy)

Aeration Adjustments (15 total):
├─ Day 5: Increased to 70% (low DO)
├─ Day 8: Reduced to 50% (pH rising, CO2 escape)
├─ ...
└─ Day 27: Maintained at 60% (optimal)

Alerts Issued (2 total):
├─ Day 12: "pH rising fast - check CO2 supply" → Fixed by user ✅
├─ Day 22: "Temperature near threshold" → Monitoring only
└─ No false alarms this month ✅
```

**User Benefit:**
- See system track record
- Build confidence ("4/5 correct predictions")
- Understand decision evolution

---

## 10. IMPLEMENTATION ROADMAP

### Phase 1 (MVP, Weeks 5-6):
- ✅ Basic explanations for aeration changes
- ✅ Harvest readiness prediction + reasoning
- ✅ One-click "Why?" button for main decisions
- ✅ Simple alerts with single probable cause

### Phase 2 (Months 2-3):
- ✅ Sensor anomaly explanations
- ✅ Weekly performance summaries
- ✅ Decision tree visualizations
- ✅ User feedback collection ("Was this helpful?")

### Phase 3 (Months 4-6):
- ✅ Natural language Q&A ("Ask the system")
- ✅ Personalized explanation complexity
- ✅ Full audit trail of all decisions
- ✅ "How I work" transparency page

### Phase 4 (Months 7+):
- ✅ Multi-language explanations
- ✅ Integration with voice assistants
- ✅ ML-powered explanation refinement
- ✅ Community explanation sharing

---

## 11. TECHNICAL ARCHITECTURE

### Language Generation

**Template-based approach (Phase 1-2):**
```python
def explain_aeration_increase(current_do, target_do, light_intensity):
    reason = f"DO is {current_do} mg/L, target is {target_do} mg/L"
    action = "Increasing air pump to raise dissolved oxygen"
    
    if light_intensity > 350:
        extra = "High light intensity means culture is photosynthesizing actively"
    
    return f"{reason}. {action}. {extra}."
```

**LLM-powered approach (Phase 3+):**
```python
# Use Claude/GPT to generate natural explanations
def explain_with_llm(sensor_data, decision, reasoning):
    prompt = f"""
    User-friendly explanation for a consumer home device:
    - Decision: {decision}
    - Data: {sensor_data}
    - Reasoning: {reasoning}
    - Tone: Friendly, not condescending
    - Length: 3-4 sentences
    """
    explanation = call_llm(prompt)
    return explanation
```

### Storage

- All explanations cached locally (device + cloud)
- User ratings stored ("Was that helpful?")
- Analytics dashboard tracks explanation effectiveness

---

## 12. SUCCESS METRICS

### Phase 1 MVP:
- ✅ All major decisions have explanations
- ✅ Explanations are <10 seconds to read
- ✅ 80%+ users click "Show explanation" at least once
- ✅ 70%+ rate explanations as "helpful" or "very helpful"

### Long-term:
- Trust score: "How much do you trust ALCURA's recommendations?" → Target 4.5/5 stars
- Decision accuracy: "Were the system's predictions correct?" → Target 85%+
- User retention: Users keeping system > 6 months → Target 80%+

---

## 13. DIFFERENTIATORS VS COMPETITORS

**Without XAI:**
- User sees alert: "Increase aeration"
- User thinks: "Why? Is something broken?"
- User loses trust, uninstalls

**With ALCURA XAI:**
- User sees: "Increase aeration to support active photosynthesis (high light, low DO)"
- User thinks: "Makes sense, system knows what it's doing"
- User trusts, keeps system, becomes advocate

**Market Position:**
- "Transparent AI for responsible microalgae cultivation"
- Only consumer photobioreactor with explainable automation

---

**Document Status:** ✅ COMPLETE - XAI Design Ready

**Implementation:** Integrate into firmware + app starting Phase 1 MVP (Week 5)

