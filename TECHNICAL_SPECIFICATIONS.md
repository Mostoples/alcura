# ALCURA Technical Specifications
## 20L Medium-Scale Consumer Photobioreactor System

**Project:** ALCURA - Intelligent Microalgae Photobioreactor for Air Quality & Passive Cooling

**Target Market:** Upper-middle class consumers (home/office air purification + aesthetic appeal)

**System Scale:** 20L culture volume

**Scope:** MVP only (Phase 1 features)

**Date:** 2026-05-20

---

## 1. SYSTEM OVERVIEW

### 1.1 Core Function
20-liter photobioreactor cultivating Spirulina/microalgae for:
- **Primary:** Indoor air quality improvement (CO2 removal, oxygen production)
- **Secondary:** Passive cooling effect (evaporative, thermal mass)
- **Tertiary:** Aesthetic/educational (visible living system)

### 1.2 Operational Context
- **Location:** Office/home environment (not sealed lab)
- **Light source:** Artificial LED + ambient light capable
- **Operating mode:** Semi-autonomous (weekly maintenance, no daily user input)
- **User profile:** Non-technical consumer (must be intuitive)
- **Maintenance:** Weekly culture checks, monthly harvest, quarterly deep clean

### 1.3 Design Constraints
- **Cost:** MVP-compatible ($2,500-3,500 for full system)
- **Space:** Fits standard office corner (< 1m height, < 0.5m width)
- **Noise:** < 60dB (office-acceptable)
- **Power:** < 150W continuous (standard outlet)
- **Complexity:** Fully automated except harvest (no daily knob-turning)

---

## 2. HARDWARE ARCHITECTURE

### 2.1 Cultivation Chamber

**Design Type:** Flat-panel vertical photobioreactor (best light penetration for LED)

**Materials:**
- **Vessel:** Food-grade acrylic or borosilicate glass cylinder
- **Volume:** 20L usable (22L total with headspace)
- **Dimensions:** 
  - Height: 60cm
  - Diameter: 20cm
  - Wall thickness: 5mm acrylic or 4mm borosilicate
- **Ports:**
  - 1× CO2/air inlet (bottom, with diffuser stone)
  - 1× overflow outlet (side, 19L mark)
  - 1× sampling port (side, mid-height, with valve)
  - 1× drain/harvest outlet (bottom, gravity-fed with ball valve)
  - 1× temperature probe pocket (thermwell)
  - 2× sensor ports (RGB camera window, turbidity probe housing)

**Sealing:** Silicone gaskets + stainless steel hose clamps

**Light Path:** 
- Transparent cylinder allows LED light from outside
- Internal baffles: **optional** (impact: light distribution vs. complexity)
- No baffles recommended for MVP (simpler manufacturing)

**Agitation:**
- Air-lift design: CO2-enriched air bubbles create gentle circulation
- No mechanical stirrer (simplicity, reliability, cost)
- Air bubble rise time: 5-8 seconds (adequate mixing)

---

### 2.2 Support Frame & Enclosure

**Frame Material:** Aluminum extrusion (T-slot) or welded steel square tube

**Overall Dimensions:**
- Height: 80cm (chamber 60cm + header space 20cm)
- Width: 60cm (chamber + sensor/control box side-by-side)
- Depth: 40cm
- Weight capacity: 40kg (chamber + water + frame)

**Control Box:**
- Mounted on right side of frame
- Dimensions: 30cm W × 25cm H × 15cm D
- Materials: ABS plastic enclosure or aluminum + polycarbonate
- Mounting: DIN rail inside for modular electronics
- Cooling: 2× 80mm PC fans if needed (thermal management)

**Aesthetic Considerations (Consumer Market):**
- Avoid "lab equipment" appearance
- Soft lighting (LED status indicators)
- Clean cable management
- Minimal visible tubing (hide in frame channel)
- Optional: Wood frame panels for home aesthetics

---

### 2.3 Lighting System

**LED Array Design:**

**Spectrum Strategy (Spirulina Cultivation):**
- Spirulina prefers **blue (400-500nm) + red (600-700nm)**
- Minimize green (450-550nm) - less absorption
- Include some far-red (700-800nm) for photosynthetic efficiency

**Configuration:**
- **Position:** Back panel of photobioreactor (perpendicular to culture cylinder)
- **LED Type:** SMD 5050 RGB LEDs + 660nm red dedicated strips
  - Total wavelength coverage: 400-800nm (visible + near-IR)
  - 4× 60cm RGB LED strips (addressable, WS2812B protocol)
  - 2× 60cm 660nm far-red LED strips
  - Controller: Arduino/ESP32 + LED driver modules

**Power Budget:**
- RGB strip: 14.4W per meter × 4m = 57.6W
- Far-red strip: 8W per meter × 2m = 16W
- **Total LED power: ~75W**
- Dimming: 0-100% PWM control
- Operating hours: 16h/day (simulating natural light cycle)

**Light Intensity Profile:**
- Target: 200-400 μmol/(m²·s) for Spirulina (moderate light)
- Adjustment: PWM dimming based on time-of-day
- Morning ramp-up: 0600-0800 (gradual increase)
- Peak: 0800-1800 (full intensity)
- Evening ramp-down: 1800-2000 (gradual decrease)
- Night: 2000-0600 (LED OFF, dark rest period)

**Heat Management:**
- LEDs mounted on aluminum heat sink (passive cooling)
- Frame-mounted heatsinks with 2×80mm fans if thermal testing shows > 50°C LED temp
- Target LED ambient temp: < 45°C (extends lifespan)

---

### 2.4 Gas Exchange System

**CO2 Injection:**
- **Source:** Ambient air (no bottled CO2, consumer-friendly)
- **Method:** Air pump pulls ambient air, passes through diffuser stone
- **Components:**
  - 12V DC air pump (aquarium-style, 10-20 L/min)
  - Solenoid valve (optional ON/OFF control, timed by controller)
  - Bubble diffuser stone (sintered glass or ceramic, 1-2mm pore size)
  - Silicone tubing (food-grade, 6mm ID)
  - Check valve (prevent backflow)
  
**Aeration Rate:**
- 10-15 L/min (2-3 air changes per minute)
- Adjustable via PWM valve or simple timer (ON 30s, OFF 30s)
- Operating mode: **Continuous light aeration** (Spirulina benefits from constant gas exchange)

**Oxygen Outlet:**
- Passive overflow at top of culture vessel
- Optional: Oxygen-enriched air exits passively, contributing to room oxygen

**Off-Gassing:**
- CO2/O2/volatile compounds escape passively
- Odor: Spirulina typically neutral or slightly earthy (acceptable for home)

---

### 2.5 Temperature Management

**Thermal Environment:**
- Target culture temp: **25-30°C** (Spirulina optimal range)
- Ambient assumption: 20-25°C office/home
- Heat sources: LEDs (75W), air pump (5W), natural ambient
- **Passive cooling:** Water evaporation from culture surface + frame air circulation

**Temperature Sensor:**
- PT100 RTD or NTC 10k thermistor
- Accuracy: ±1°C
- Housing: Immersion thermwell (stainless steel pocket in culture)
- Data line: To main controller via analog input

**Thermal Control (MVP Phase):**
- **No active heating/cooling** initially
- Monitor temp continuously
- If testing shows temp creep > 35°C, add:
  - Small fan on side of vessel (evaporative cooling)
  - OR adjust LED operating hours (reduce afternoon peak)

**Passive Cooling Strategy:**
- Culture surface area: Large diameter (20cm) × relatively short height (60cm)
- Evaporative loss: ~0.5-1L/week (will concentrate nutrients, needs top-up)
- Frame design: Open-sided (allows ambient air circulation)

---

### 2.6 Nutrient & Water Management

**Feed System:**
- **No automated dosing** for MVP (consumer simplicity)
- **Manual top-up:** Weekly water addition (measure jug provided)
- **Nutrient stock:** Pre-formulated liquid concentrate (1× Spirulina growth medium)

**Water Changes:**
- **Frequency:** Every 4 weeks (28-30 day cycle)
- **Method:** Drain 50% via harvest outlet, top-up with fresh water + nutrient
- **Volume change:** 10L water + 1mL nutrient concentrate per cycle

**Media Composition (Spirulina Zarrouk Medium - standard):**
- NaHCO3 (sodium bicarbonate): source of inorganic carbon + pH buffer
- NaNO3 (nitrogen source)
- K2HPO4, KH2PO4 (phosphorus + pH control)
- MgSO4 (magnesium)
- CaCl2 (calcium)
- Trace elements (Fe, Zn, Mn, Cu, Co, B)

**MVP Approach:** 
- Buy pre-formulated liquid medium (Sigma-Aldrich or local bio-supplier)
- Bottle with measuring cap (consumer-friendly)
- Stock: 500mL bottle lasts ~12 weekly top-ups

---

### 2.7 Harvest & Concentration System

**Harvest Mechanism:**
- Gravity drain from bottom outlet (ball valve)
- Discharge into fine mesh filter (25-50 μm stainless steel)
- Concentrated biomass collects in filter, filtrate runs to waste

**Harvest Procedure (Monthly):**
1. Close main culture outlet
2. Open drain valve, let 2-3L drain through mesh filter
3. Biomass (wet paste, dark green) remains in filter
4. Rinse filter with small amount of fresh water
5. Scrape biomass into collection container (glass jar)

**Yield Estimate:**
- Spirulina growth rate: 0.5-1g/L/day (excellent conditions)
- Monthly yield: ~150-300g dry biomass equivalent (from 20L culture)
- Practical harvest: Every 2-4 weeks as desired

**Biomass Uses:**
- Nutritional supplement (spirulina powder)
- Natural dye or pigment
- Cosmetics/skincare
- Animal feed
- Compost/soil amendment

---

## 3. SENSOR & MONITORING SUITE

### 3.1 Core Sensors (MVP Phase 1)

| Sensor | Parameter | Type | Range | Accuracy | Interface | Cost |
|--------|-----------|------|-------|----------|-----------|------|
| RGB Camera | Growth phase, color | Vision | Digital image | ±5% hue | USB/CSI | $15-25 |
| Turbidity Sensor | Biomass proxy | Optical | 0-4000 NTU | ±5% FS | 4-20mA | $20-30 |
| Temp Probe | Culture temperature | RTD/NTC | -10 to +60°C | ±1°C | Analog | $5-10 |
| CO2 Sensor | CO2 concentration | NDIR | 0-5000 ppm | ±50 ppm | I2C/Analog | $40-60 |
| O2 Sensor | Oxygen level | Electrochemical | 0-25% | ±2% | Analog | $30-50 |
| PM2.5/PM10 Sensor | Particulate matter | Laser scattering | 0-999 μg/m³ | ±10% | UART/I2C | $35-50 |
| HCHO/VOC Sensor | Formaldehyde + VOCs | PID/MOX | 0-10 ppm | ±20% | Analog | $25-40 |
| Dissolved Oxygen | DO in culture | Optical/Electrochemical | 0-20 mg/L | ±1 mg/L | Analog/I2C | $60-100 |
| Light Sensor | Ambient + LED intensity | Photodiode | 0-100k lux | ±5% | Analog | $10-15 |
| Humidity Sensor | Relative humidity | Capacitive | 0-100% RH | ±3% | I2C | $5-10 |

**Sensor Cost Summary:** ~$250-400 for full MVP sensor suite

### 3.2 Data Acquisition & Processing

**Microcontroller:**
- **Board:** Arduino Mega 2560 or ESP32 Dev Board
- **Rationale:** 
  - Multiple analog inputs (Arduino: 16 ch; ESP32: 12 ch)
  - I2C/SPI for digital sensors
  - Built-in WiFi/BLE (ESP32 preferred for IoT)
  - Open-source, large community support
- **Cost:** $15-25

**Sensor Fusion Algorithm:**
- **Language:** Arduino C/C++ or MicroPython (ESP32)
- **Input:** Raw sensor data (10Hz sampling frequency)
- **Processing:**
  - Kalman filter for noise reduction (temp, DO, light)
  - Moving average for stable readings (10-second window)
  - Anomaly detection (sensor stuck/failed)
  - Soft sensor: Estimate biomass from turbidity + temp + light (linear regression)

**Data Logging:**
- Local SD card (optional, for offline analysis)
- Cloud sync via WiFi (MQTT or REST API)

---

### 3.3 Camera & Image Processing

**RGB Camera:**
- Type: 5MP OV5647 or IMX219 (Raspberry Pi camera)
- Interface: CSI ribbon cable (to ESP32 or Raspberry Pi)
- Mounting: Fixed position inside control box, focused on culture chamber window
- Capture frequency: 1× daily (0800, high light)

**Image Analysis (Python, runs on Raspberry Pi or cloud):**
- **Color histogram:** Extract hue distribution (indicates algae color shift)
- **Growth phase detection:**
  - Green intensity increasing → exponential growth
  - Green intensity plateau → stationary phase
  - Brown/orange tint → stressed/lipid accumulation
- **Sedimentation detection:** Monitor culture clarity (turbidity backup)

**Output:** Text alert ("Harvest ready in 5 days") or "Culture stress detected"

---

## 4. CONTROL LOGIC & ALGORITHMS

### 4.1 Fuzzy Logic DO Controller

**Inputs:**
1. Dissolved Oxygen (DO): 0-20 mg/L
2. Photosynthetically Active Radiation (PAR): Estimated from light sensor + time-of-day
3. Suspended Solids (SS): Estimated from turbidity

**Output:** Air pump duty cycle (0-100% PWM)

**Fuzzy Rules (Example):**
```
IF (DO is LOW) AND (PAR is HIGH) THEN AirPump is HIGH
IF (DO is MEDIUM) AND (PAR is MEDIUM) THEN AirPump is MEDIUM
IF (DO is HIGH) AND (PAR is LOW) THEN AirPump is LOW
IF (SS is HIGH) THEN AirPump is MEDIUM (maintain mixing)
```

**Implementation:**
- Membership functions: Triangle/Trapezoid shapes for LOW/MEDIUM/HIGH
- Defuzzification: Centroid method
- Library: Arduino Fuzzy Logic Library or custom C code
- Update frequency: 10-minute loop (not real-time, acceptable for batch culture)

**Expected Result:**
- DO maintained at 8-15 mg/L (healthy range for Spirulina)
- Automatic response to diurnal light cycles
- No manual tuning after setup

---

### 4.2 LED Control Algorithm

**Inputs:**
- Time of day (RTC - Real Time Clock)
- Actual light sensor reading (0-100k lux)
- Culture state (from image analysis)

**Output:** LED brightness (PWM 0-255)

**Schedule:**
```
0600-0800: Ramp-up (0% → 100% in 2-hour steps)
0800-1800: Constant 100% (peak photosynthesis)
1800-2000: Ramp-down (100% → 0% in 2-hour steps)
2000-0600: OFF (dark rest period for Spirulina)
```

**Adaptive Dimming:**
- If ambient light detected (e.g., office windows), reduce LED intensity proportionally
- Prevents culture overheating on bright days
- Target total intensity: 200-400 μmol/(m²·s) (constant)

---

### 4.3 Water Level Management

**Input:** Turbidity sensor (high turbidity can indicate low water level if culture thickening)

**Logic:**
- Estimate evaporation rate (0.5-1L/week)
- Alert user weekly: "Top-up water to 20L mark"
- Provide graduated cylinder (marked at 20L, 19L, 18L)

**No active pump for MVP** (manual top-up simplicity)

---

## 5. SOFTWARE ARCHITECTURE

### 5.1 Embedded Firmware (Arduino/ESP32)

**Main Loop (Pseudo-code):**
```
Initialization:
  - Initialize sensors (I2C, analog, UART)
  - Load last known state from EEPROM
  - Connect to WiFi
  - Sync time from NTP server

Loop (every 1 second):
  - Read all sensors (analog/digital)
  - Kalman filter & outlier detection
  - Run fuzzy logic DO controller
  - Update LED PWM based on time
  - Check for anomalies
  - Log to SD card (optional)
  - Send data to cloud (every 5 minutes)
  - Update local LCD display

Special routines:
  - Daily: Capture camera image, run image analysis
  - Weekly: Calculate growth rate, suggest harvest timing
  - Monthly: Estimate nutrient consumption, alert for top-up
```

**Code Size Estimate:** ~5-8KB for core logic (fits any Arduino)

**Libraries:**
- Time.h (RTC functions)
- OneWire.h (temperature if using DS18B20)
- Custom Fuzzy controller class
- WiFi.h / PubSubClient.h (MQTT for cloud sync)

---

### 5.2 Cloud Backend (Node.js + Firebase/AWS)

**Data Ingestion:**
- MQTT broker (mosquitto or AWS IoT Core)
- Topic: `/alcura/{deviceID}/{sensorType}`
- Message format: JSON with timestamp
- Frequency: 5-minute intervals

**Data Storage:**
- Firestore or DynamoDB (time-series data)
- Retention: 1 year of historical data
- Indices: Device ID + timestamp (fast queries)

**Processing:**
- Aggregate 5-minute readings into 1-hour/1-day summaries
- Trend detection: Is biomass increasing? Is DO stable?
- Alert generation: Send notifications if thresholds crossed

---

### 5.3 Dashboard & Mobile Interface

**Web Dashboard (React.js):**
- Real-time data display (CO2, O2, temperature, biomass estimate)
- 24-hour trend charts (line graphs)
- Monthly productivity summary
- Alert log with dismissal history
- Settings: Adjust LED schedule, aeration rate, user preferences

**Mobile App (React Native or Flutter):**
- Same dashboard in mobile-friendly layout
- Push notifications: "Culture ready for harvest", "Maintenance needed"
- Camera view: Live culture image feed
- One-tap controls: Manual aeration boost, LED dimming

**Platform Requirements:**
- Responsive design (works on phone, tablet, desktop)
- Low data usage (<10MB/month)
- Works offline (cached data)

---

## 6. ELECTRICAL & POWER

### 6.1 Power Budget

| Component | Power (W) | Operating Hours | Daily Energy |
|-----------|-----------|-----------------|--------------|
| LED array (RGB + far-red) | 75 | 16h | 1.2 kWh |
| Air pump (12V) | 5 | 24h | 0.12 kWh |
| Arduino/Controller board | 5 | 24h | 0.12 kWh |
| Fans (if added for cooling) | 10 | 8h | 0.08 kWh |
| **Total (estimated)** | - | - | **1.52 kWh/day** |

**Monthly energy cost (US average $0.12/kWh):** ~$5.50/month

### 6.2 Power Supply

**Main PSU:**
- Input: AC 100-240V (standard wall outlet)
- Output: DC 12V, 15A (180W)
- Type: Mean Well or equivalent industrial PSU
- Safety: Overload protection, short-circuit protection
- Cost: $30-50

**Power Connections:**
- LED array: 12V direct (with current-limiting resistors)
- Air pump: 12V direct (with inline fuse)
- Arduino: 5V via buck converter (12V → 5V, 3A)
- Fans (if added): 12V PWM controllable

**Safety Features:**
- Main power switch (toggle switch)
- Fused distribution block (individual fuses for LED, pump, control)
- Thermal overload protection on PSU
- Grounding: All metal parts bonded to chassis ground

---

## 7. PHYSICAL ASSEMBLY & INTEGRATION

### 7.1 Bill of Materials (BOM) - MVP Complete System

**Cultivation Chamber:**
- Acrylic cylinder (20L, 60cm H × 20cm Ø) - $80-120
- Top/bottom caps (acrylic or 3D-printed) - $20-30
- Hose clamps, gaskets, bulkhead fittings - $30-40

**Frame & Enclosure:**
- Aluminum extrusion / steel tube frame - $50-80
- ABS plastic enclosure (for control box) - $25-40
- Mounting brackets, fasteners - $15-20

**Lighting:**
- RGB LED strips (4m) - $20-30
- Far-red LED strips (2m) - $15-20
- LED driver modules (3× 4-channel) - $15-25
- Aluminum heat sink + fans - $20-30
- Power connections, connectors - $10-15

**Gas Exchange:**
- Air pump (aquarium, 12V) - $10-15
- Solenoid valve (optional, 12V) - $15-20
- Bubble diffuser stone - $5-8
- Silicone tubing, check valve - $10-15

**Sensors (Full Suite):**
- RGB camera module - $15-25
- Turbidity sensor - $20-30
- Temperature probe (PT100) - $5-10
- CO2 sensor (NDIR) - $40-60
- O2 sensor - $30-50
- PM2.5/PM10 sensor - $35-50
- HCHO/VOC sensor - $25-40
- DO sensor - $60-100
- Light sensor - $10-15
- Humidity sensor - $5-10
- Sensor connectors, calibration solutions - $20-30

**Electronics & Control:**
- Microcontroller (ESP32) - $15-25
- Analog/digital converter modules - $15-20
- Relay modules (pump, valve control) - $10-15
- RTC module (DS3231) - $5-8
- SD card module (optional) - $3-5
- WiFi/cellular modem - $10-30 (built-in to ESP32)
- Power supply (12V, 15A) - $30-50
- Fuses, connectors, wiring - $20-30

**Software & Cloud:**
- Cloud hosting (AWS/Firebase) - $10-20/month
- Mobile app development - **Included in Phase 1**
- Dashboard development - **Included in Phase 1**

**Miscellaneous:**
- Tubing, clamps, adapters - $30-50
- Labels, decals, instruction manual - $15-25
- Packaging material - $20-30

---

### 7.2 Total MVP BOM Cost Estimate

| Category | Estimated Cost |
|----------|-----------------|
| Cultivation Chamber | $130-190 |
| Frame & Enclosure | $90-140 |
| Lighting System | $80-120 |
| Gas Exchange | $40-60 |
| Sensors (full suite) | $250-400 |
| Electronics & Control | $130-200 |
| Software (cloud + app) | $5,000-8,000 (dev cost, amortized) |
| Miscellaneous | $65-105 |
| **Hardware Total** | **$785-1,215** |
| **Software Dev** | **$5,000-8,000** |
| **Combined MVP Cost** | **~$6,000-9,000 (R&D)** |
| **Per-Unit Production Cost (1,000 units)** | **$1,200-1,800** |
| **Target Consumer Price** | **$3,500-4,500** |

**Profit Margin (assuming $4,000 retail price):** ~60-70% (healthy for consumer hardware)

---

## 8. ASSEMBLY SEQUENCE

### Phase 1: Frame & Enclosure (Week 1)
1. Assemble aluminum frame (or commission welding)
2. Install acrylic cylinder on mounting bracket
3. Assemble control box enclosure
4. Mount on frame

### Phase 2: Plumbing (Week 2)
1. Install thermwell, sensor ports
2. Connect air pump → diffuser stone → inlet
3. Install drain valve → outlet tubing
4. Prime system with reverse osmosis (RO) water
5. Pressure test (ensure no leaks)

### Phase 3: Electrical & Control (Week 3)
1. Mount power supply in control box
2. Install microcontroller, sensor modules on DIN rail
3. Wire all sensors to analog/digital inputs
4. Test each sensor independently (calibration check)
5. Program firmware, load baseline code
6. Validate all I/O (LEDs, pump, display)

### Phase 4: Lighting & Camera (Week 4)
1. Mount LED strips on back panel
2. Install heat sinks + optional cooling fans
3. Mount RGB camera in fixed position
4. Connect LED driver to ESP32 PWM pins
5. Test LED dimming, color mixing
6. Calibrate camera focus on culture chamber

### Phase 5: Integration & Testing (Week 5)
1. Load complete firmware
2. Connect to WiFi, validate cloud sync
3. Test all control loops (LED, air pump, fuzzy logic)
4. Inoculate culture with Spirulina starter
5. 7-day growth validation (biomass should double)
6. Finalize dashboard and mobile app

### Phase 6: Documentation & Handoff (Week 6)
1. Write user manual (assembly, operation, troubleshooting)
2. Create maintenance schedule
3. Video tutorial (setup, operation, harvest)
4. Prepare for customer deployment/testing

---

## 9. OPERATING PROCEDURES

### 9.1 Initial Setup (Day 1)
1. Fill chamber with 20L RO water
2. Add 1× dose Spirulina growth medium concentrate
3. Inoculate with 2L Spirulina starter culture (~5% inoculation)
4. Turn on air pump, LEDs (0800)
5. Monitor temperature (should stabilize at 26-28°C)

### 9.2 Daily Operation (Automatic)
- LEDs activate 0800, ramp up over 2 hours
- Air pump runs 24/7 (adjusts via fuzzy logic)
- Sensors log data every 5 minutes
- Dashboard displays real-time metrics

### 9.3 Weekly Maintenance
- Visual inspection: Color, clarity, odors
- Top-up water to 20L line (add 0.5-1L RO water)
- Check pump operation (should see steady bubble stream)
- Review growth trend on dashboard

### 9.4 Monthly Maintenance
- Partial water change (10L drain + top-up + nutrient)
- Camera lens cleaning (soft cloth)
- Sensor calibration check (calibration solutions optional)
- Harvest if desired (drain through fine mesh filter)

### 9.5 Quarterly Deep Maintenance
- Full chamber drain & rinse (3-5 min process)
- Inspect acrylic for algae film on walls (clean if needed)
- Service air pump (replace filter, check diaphragm)
- Recalibrate all sensors

---

## 10. EXPECTED PERFORMANCE & VALIDATION

### 10.1 Growth Performance (Spirulina)
- **Inoculation:** Day 0 (5% inoculum)
- **Lag phase:** Days 0-2 (adapting to new environment)
- **Exponential phase:** Days 3-20 (doubling time 2-3 days)
- **Stationary phase:** Days 21+ (reaching carrying capacity ~3-5 g/L)
- **Yield:** 0.5-1g dry biomass per liter per day

**Target Validation (MVP):**
- By day 30: Reach biomass concentration of 2-3 g/L (visible color darkening)
- Culture remains contamination-free (no mold, bacteria, protozoa)
- Do measurements stable within ±2 mg/L

### 10.2 Air Quality Impact
- **CO2 reduction:** 55-90% reduction in local microclimate (validated by research [2])
- **Expected:** 5-10 ppm CO2 reduction in 100m³ office space
- **O2 production:** ~1-2g O2 per day (detectable via O2 sensor)
- **VOC removal:** 100% reduction of formaldehyde, acetone, toluene (per research [8])

**Validation Method:**
- Before/after CO2 measurements (point source 1m from ALCURA)
- Room air quality baseline vs. with ALCURA running

### 10.3 System Reliability
- **Uptime target:** 99%+ continuous operation (> 7 days unattended)
- **Sensor accuracy:** ±5% after initial calibration
- **Alert response:** Notifications within 5 minutes of threshold crossing
- **Data loss:** < 0.1% (due to network hiccups)

---

## 11. MVP SUCCESS CRITERIA

### Hardware:
- [ ] 20L photobioreactor operates 30+ days without maintenance
- [ ] Temperature maintained 25-30°C
- [ ] No major leaks or component failures
- [ ] All sensors calibrated and reporting within spec

### Cultivation:
- [ ] Spirulina biomass increases measurably (>50% concentration rise by day 30)
- [ ] No visible contamination (fungi, bacteria)
- [ ] Culture harvested successfully at day 30
- [ ] Harvest yield matches literature (>0.5g/L/day)

### Monitoring:
- [ ] All 10 sensors functioning correctly
- [ ] Data logged continuously to cloud (no gaps >5 min)
- [ ] Dashboard displays real-time & historical trends
- [ ] Mobile app sends correct alerts (tested manually)

### Air Quality:
- [ ] CO2 sensor detects measurable reduction near ALCURA
- [ ] O2 sensor shows increase during daytime (photosynthesis)
- [ ] VOC/HCHO sensors show trend (even if not >100% removal)
- [ ] User perceives fresher air (subjective, but target for market appeal)

### User Experience:
- [ ] Setup takes < 30 minutes (per manual)
- [ ] No user intervention except weekly water top-up
- [ ] Dashboard intuitive (non-technical user can operate)
- [ ] Mobile app works on iOS + Android
- [ ] Manual clear and comprehensive

---

## 12. RISK MITIGATION

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|-----------|
| Sensor calibration drift | Medium | Medium | Monthly calibration SOP, spare sensors stocked |
| Contamination outbreak | Low | High | Autoclave + aseptic technique for inoculation, backup culture |
| LED failure | Low | Medium | Redundant LED strips, can replace individual segments |
| Power outages | Low | Medium | Optional battery backup (add Phase 2), resume normal after power restore |
| WiFi disconnection | Medium | Low | Local data buffering to SD card, auto-reconnect logic |
| Microalgae stress (e.g., pH crash) | Medium | High | Automated alerts, fuzzy logic keeps DO stable, pH monitoring Phase 2 |
| Burst acrylic | Very Low | High | Pre-stress tested cylinders, inspect for micro-cracks during assembly |
| Thermal runaway | Very Low | Critical | Temp sensor with hard limit (disable LEDs if >40°C), fans as fallback |

---

## 13. NEXT STEPS (DETAILED DESIGN PHASE)

### 13.1 Component Procurement (Week 1)
- [ ] Order cultivation chamber (acrylic/glass supplier)
- [ ] Source sensors (Digi-Key, Alibaba, local vendors)
- [ ] Procure frame materials (aluminum extrusion)
- [ ] Get PCB assembly quote for sensor distribution board

### 13.2 Firmware Development (Weeks 2-3)
- [ ] Write core sensor reading loop
- [ ] Implement Kalman filter + soft sensor
- [ ] Code fuzzy logic DO controller
- [ ] Test all I/O (LED, pump, sensors)

### 13.3 Cloud & App Development (Weeks 2-4, parallel)
- [ ] Set up Firebase/AWS backend
- [ ] Build REST API endpoints
- [ ] Develop React.js dashboard
- [ ] Build React Native mobile app

### 13.4 Prototype Assembly (Weeks 5-6)
- [ ] Assemble frame & chamber
- [ ] Install plumbing & electrical
- [ ] Mount and calibrate sensors
- [ ] First firmware load & integration test

### 13.5 Culture Validation (Week 7-8)
- [ ] Inoculate Spirulina
- [ ] Monitor daily for 30 days
- [ ] Collect data for performance validation
- [ ] Document lessons learned

### 13.6 User Testing & Refinement (Week 9-10)
- [ ] Deploy to 2-3 user beta testers
- [ ] Gather feedback (usability, alerts, maintenance burden)
- [ ] Iterate dashboard/app based on feedback
- [ ] Finalize user manual

---

**Document Status:** READY FOR DETAILED DESIGN PHASE

**Approval:** All specifications pending user final approval before procurement & development start.

