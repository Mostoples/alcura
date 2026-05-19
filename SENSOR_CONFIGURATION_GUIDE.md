# ALCURA Sensor Configuration Guide
## 7-Sensor MVP Suite Specifications

**Project:** ALCURA 20L Spirulina Photobioreactor

**Date:** 2026-05-20

---

## SENSOR LIST (USER-SPECIFIED)

| # | Sensor | Parameter | Range | Type | Cost |
|---|--------|-----------|-------|------|------|
| 1 | DHT22 | Room temp + humidity | -40 to +80°C, 0-100% RH | Digital | $5-8 |
| 2 | DS18B20 | Culture water temp | -55 to +125°C | 1-Wire | $2-3 |
| 3 | Turbidity | Biomass proxy | 0-4000 NTU | Analog | $20-30 |
| 4 | pH Sensor | Culture pH | 0-14 (2-12 practical) | Analog | $40-60 |
| 5 | DO Sensor | Dissolved oxygen | 0-20 mg/L | Analog/I2C | $60-100 |
| 6 | CO2 Sensor | CO2 concentration | 0-5000 ppm | I2C/NDIR | $40-60 |
| 7 | PM Sensor | PM2.5 + PM10 | 0-999 μg/m³ | UART | $35-50 |
| 8 | UV Sensor | UV radiation (A+B) | 0-15 mW/cm² | Analog | $15-25 |
| 9 | Lux Sensor | Light intensity | 0-188,000 lux | I2C/Analog | $10-20 |

**Total Sensor Cost:** $235-360 (9 sensors vs. original 10-sensor $250-400 spec)
**Cost-Effective Mix:** Removed RGB camera/fluorescence, added UV/Lux for LED management

---

## 1. DHT22 - ROOM TEMPERATURE & HUMIDITY SENSOR

### Specifications
- **Manufacturer:** Aosong (DHT22 / AM2302)
- **Temperature Range:** -40 to +80°C, accuracy ±0.5°C
- **Humidity Range:** 0-100% RH, accuracy ±2%
- **Output:** Digital signal (DHT protocol)
- **Power:** 3.3-5V, current ~0.5-2.5mA
- **Sampling:** One reading every 2 seconds max
- **Cost:** $5-8

### Purpose
Measures ambient office/home conditions (separate from culture).
- Track room temperature impact on system
- Detect if air conditioning running (affects culture indirectly)
- Context for air quality improvements (baseline before ALCURA)

### Wiring (Arduino/ESP32)

```
DHT22 Pin 1 (VCC) → ESP32 3.3V
DHT22 Pin 2 (DATA) → ESP32 GPIO 4 (with 10k pull-up resistor to 3.3V)
DHT22 Pin 3 (GND) → ESP32 GND
DHT22 Pin 4 → Not used
```

**Pull-up Resistor:** 10kΩ between DATA pin and 3.3V (required for reliable communication)

### Firmware (Arduino IDE)

```cpp
#include "DHT.h"

#define DHTPIN 4       // GPIO 4
#define DHTTYPE DHT22  // DHT22 (AM2302)

DHT dht(DHTPIN, DHTTYPE);

void setup() {
  Serial.begin(115200);
  dht.begin();
}

void loop() {
  delay(2000); // DHT22 max frequency 0.5Hz (every 2 sec)
  
  float roomHumidity = dht.readHumidity();
  float roomTemp = dht.readTemperature();
  
  if (isnan(roomHumidity) || isnan(roomTemp)) {
    Serial.println("DHT22 Read Error");
    return;
  }
  
  Serial.print("Room Temp: ");
  Serial.print(roomTemp);
  Serial.print(" °C, Room Humidity: ");
  Serial.print(roomHumidity);
  Serial.println(" %");
}
```

### Calibration
- **Factory calibrated** ✓ (no adjustment needed)
- **Verification:** Compare reading to known thermometer/hygrometer
- **Expected accuracy:** ±1°C, ±3% RH in typical range

### Troubleshooting
| Issue | Cause | Solution |
|-------|-------|----------|
| Reads NaN | Missing pull-up resistor | Add 10kΩ resistor |
| Frequent errors | Sampling too fast | Increase delay to 2+ seconds |
| Consistently high/low | Sensor placement | Move away from heat/cold sources |

---

## 2. DS18B20 - CULTURE WATER TEMPERATURE SENSOR

### Specifications
- **Manufacturer:** Maxim Integrated (DS18B20)
- **Range:** -55 to +125°C, accuracy ±0.5°C
- **Waterproof Variant:** Steel probe, stainless steel housing
- **Output:** 1-Wire digital protocol
- **Power:** Parasitic (power from data line, no VCC) or external 3.3-5V
- **Resolution:** Configurable 9-12 bits (0.5°C to 0.0625°C)
- **Cost:** $2-3 (regular), $8-12 (waterproof probe)

### Purpose
Continuous culture temperature monitoring.
- **Setpoint:** 25-30°C (Spirulina optimal)
- **Alert threshold:** >32°C (thermal stress)
- **Used by:** Fuzzy logic controller for adaptive aeration

### Wiring (Arduino/ESP32)

```
DS18B20 VCC (red) → ESP32 3.3V or 5V
DS18B20 GND (black) → ESP32 GND
DS18B20 DATA (yellow) → ESP32 GPIO 5 (with 4.7kΩ pull-up to VCC)
```

**Pull-up Resistor:** 4.7kΩ between DATA and VCC (1-Wire protocol requirement)

**Immersion:** 
- Insert probe into culture via thermwell (stainless steel pocket, 1cm diameter)
- Mount on side of chamber at mid-height
- Ensure probe tip fully submerged

### Firmware (Arduino IDE)

```cpp
#include <OneWire.h>
#include <DallasTemperature.h>

#define ONE_WIRE_BUS 5  // GPIO 5

OneWire oneWire(ONE_WIRE_BUS);
DallasTemperature sensors(&oneWire);

void setup() {
  Serial.begin(115200);
  sensors.begin();
}

void loop() {
  sensors.requestTemperatures(); // Non-blocking request
  delay(750); // Wait for conversion (750ms for 12-bit)
  
  float cultureTemp = sensors.getTempCByIndex(0);
  
  if (cultureTemp == DEVICE_DISCONNECTED_C) {
    Serial.println("DS18B20 Error: Device disconnected");
    return;
  }
  
  Serial.print("Culture Temp: ");
  Serial.print(cultureTemp);
  Serial.println(" °C");
  
  // Thermal alert
  if (cultureTemp > 32.0) {
    Serial.println("WARNING: Culture temperature too high!");
    // Trigger cooling response (reduce LEDs or increase ventilation)
  }
}
```

### Calibration
1. **Offset calibration** (optional):
   - Measure temperature simultaneously with calibrated thermometer
   - Record difference: `offset = actual - DS18B20_reading`
   - Store offset in EEPROM, apply during reads

2. **One-point calibration:**
   - Submerge probe in ice water (0°C), record reading
   - Adjust offset if reading ≠ 0°C

### Troubleshooting
| Issue | Cause | Solution |
|-------|-------|----------|
| Reads 85°C | Pull-up missing or disconnected | Check 4.7kΩ resistor |
| DEVICE_DISCONNECTED | Loose connection | Reseat probe connector |
| Slow response | Probe thermwell filled with air | Add thermal compound to thermwell |

---

## 3. TURBIDITY SENSOR - BIOMASS CONCENTRATION

### Specifications
- **Type:** Analog infrared turbidity sensor (3.3V compatible)
- **Manufacturer:** DFRobot or similar (e.g., DF-ROBOT SEN0189)
- **Range:** 0-4000 NTU (Nephelometric Turbidity Units)
- **Output:** Analog voltage 0-3.3V (via analog-to-digital converter)
- **Accuracy:** ±5% full scale
- **Power:** 3.3-5V, 40mA max
- **Cost:** $20-30

### Purpose
**Soft sensor for biomass estimation:**
- Turbidity correlates with microalgae cell concentration
- Real-time proxy for culture density
- Input to fuzzy logic controller (combined with DO)
- Harvest readiness indicator

### Wiring (Arduino/ESP32)

```
Sensor VCC (red) → ESP32 5V
Sensor GND (black) → ESP32 GND
Sensor AO (analog out) → ESP32 GPIO 35 (ADC1_7, analog input)
```

**ADC Configuration (ESP32):**
- Resolution: 12-bit (0-4095 digital counts = 0-3.3V)
- Reference voltage: 3.3V

### Firmware (Arduino IDE)

```cpp
#define TURBIDITY_PIN 35  // Analog input

// Calibration: turbidity vs. ADC count
// Calibrate against known turbidity standards (buy 0, 100, 400 NTU solutions)
const float CALIBRATION_0NTU = 2.8;   // Voltage in RO water (clear)
const float CALIBRATION_400NTU = 0.5; // Voltage at 400 NTU
const float ADC_RESOLUTION = 4095.0;

float readTurbidity() {
  int rawADC = analogRead(TURBIDITY_PIN);
  float voltage = (rawADC / ADC_RESOLUTION) * 3.3; // Convert to voltage
  
  // Linear interpolation
  float ntu = (CALIBRATION_0NTU - voltage) / 
              (CALIBRATION_0NTU - CALIBRATION_400NTU) * 400.0;
  
  return constrain(ntu, 0, 4000); // Clamp to 0-4000 NTU range
}

void loop() {
  float turbidity = readTurbidity();
  
  Serial.print("Turbidity: ");
  Serial.print(turbidity);
  Serial.println(" NTU");
  
  // Biomass estimation: 1 NTU ≈ 0.1-0.2 g/L (Spirulina-specific)
  float estimatedBiomass = turbidity * 0.0015; // g/L
  Serial.print("Estimated Biomass: ");
  Serial.print(estimatedBiomass);
  Serial.println(" g/L");
}
```

### Calibration (CRITICAL)

**Materials Needed:**
- Deionized/RO water (0 NTU reference)
- Turbidity calibration solutions: 100 NTU, 400 NTU (buy from supplier)
- Small cuvettes or test tubes

**Procedure:**
1. Measure voltage in RO water → record as `CALIBRATION_0NTU`
2. Measure voltage in 100 NTU solution → intermediate reference
3. Measure voltage in 400 NTU solution → record as `CALIBRATION_400NTU`
4. Use 2-point linear calibration (0 NTU & 400 NTU)
5. Verify with intermediate point (should read ~100 NTU)

**Expected Calibration Range:**
- Clear water (0 NTU): 2.8-3.0V
- 400 NTU: 0.3-0.6V
- Spirulina culture at harvest (~2.5 g/L): 1500-2000 NTU

### Troubleshooting
| Issue | Cause | Solution |
|-------|-------|----------|
| Stuck at high value | Sensor window dirty/cloudy | Clean with distilled water, optical wipe |
| Erratic readings | Sensor clogged with algae | Rinse daily, consider glycerin coating |
| No voltage change | ADC not reading | Check wiring, verify ADC pin (GPIO 35) |
| Poor calibration fit | Standards contaminated | Use fresh calibration solutions |

---

## 4. pH SENSOR - CULTURE ACIDITY CONTROL

### Specifications
- **Type:** Analog glass electrode pH probe + controller module
- **Manufacturer:** DFRobot or generic (e.g., DFR0169)
- **Range:** 0-14 pH (practical 2-12)
- **Accuracy:** ±0.1 pH
- **Output:** Analog voltage 0-3.3V (linear, typically 0V at pH0, 3.3V at pH14)
- **Power:** 3.3-5V, 15mA max
- **Electrode lifespan:** 6-12 months (depends on storage, cleaning)
- **Cost:** $40-60 (includes probe + controller board)

### Purpose
**Critical for Spirulina cultivation:**
- Spirulina optimal pH: **8.5-9.5** (alkaline)
- Alerts for pH drift (culture crash indicator)
- Long-term culture stability monitoring
- Input to fuzzy logic (if implementing Phase 2)

### Wiring (Arduino/ESP32)

```
pH Module VCC → ESP32 5V
pH Module GND → ESP32 GND
pH Module AO (analog) → ESP32 GPIO 34 (ADC1_6)
pH Electrode (probe) → Supplied with module, submerse in culture
```

**Electrode Care:**
- **Storage:** Keep probe wet in storage solution (not dry!)
- **Cleaning:** Rinse with distilled water after each use
- **Mounting:** Fixed via probe holder, tip submerged 2-3cm in culture

### Firmware (Arduino IDE)

```cpp
#define PH_PIN 34  // Analog input

// Calibration: pH vs. voltage
// Calibrate against pH 7.0 and pH 10.0 buffer solutions (buy from supplier)
const float PH7_VOLTAGE = 1.65;  // ~1.65V at pH 7
const float PH10_VOLTAGE = 2.8;  // ~2.8V at pH 10
const float ADC_RESOLUTION = 4095.0;

float readPH() {
  int rawADC = analogRead(PH_PIN);
  float voltage = (rawADC / ADC_RESOLUTION) * 3.3;
  
  // Linear interpolation
  float pH = 7.0 + (voltage - PH7_VOLTAGE) / 
             (PH10_VOLTAGE - PH7_VOLTAGE) * 3.0;
  
  return constrain(pH, 0, 14);
}

void loop() {
  float pH = readPH();
  
  Serial.print("Culture pH: ");
  Serial.println(pH);
  
  // pH control alerts
  if (pH < 7.5) {
    Serial.println("WARNING: pH too acidic (risk of culture crash)");
    // Manual action: add NaOH or buffer solution
  } else if (pH > 10.0) {
    Serial.println("WARNING: pH too alkaline");
    // Manual action: add acid or CO2
  } else if (pH >= 8.5 && pH <= 9.5) {
    Serial.println("pH OPTIMAL for Spirulina");
  }
}
```

### Calibration (REQUIRED MONTHLY)

**Materials Needed:**
- pH 7.0 buffer solution (neutral reference)
- pH 10.0 buffer solution (alkaline reference)
- pH 4.0 buffer solution (optional, acidic reference)
- Small cups for calibration
- Probe cleaning solution (distilled water)

**Procedure:**
1. **Rinse probe** with distilled water, dry with lint-free cloth
2. **Measure pH 7.0 solution:**
   - Submerge probe, wait 30 seconds
   - Record voltage: should be ~1.65V (adjust `PH7_VOLTAGE` if different)
3. **Measure pH 10.0 solution:**
   - Rinse probe, submerge in pH 10.0
   - Record voltage: should be ~2.8V (adjust `PH10_VOLTAGE`)
4. **Optional: pH 4.0 check** (verify linearity)
5. **Store probe** in buffer solution or storage bottle

**Calibration Frequency:** Every 4 weeks (monthly)

### Troubleshooting
| Issue | Cause | Solution |
|-------|-------|----------|
| Stuck at 3.3V | Probe dried out | Soak in distilled water 12+ hours, recalibrate |
| No voltage change | Electrode dead | Replace probe (~$15-20) |
| Calibration drifts | Electrode aging | Recalibrate monthly, replace every 6-12 months |
| Inconsistent readings | Protein coating on electrode | Clean with 0.1M HCl, then rinse distilled water |

---

## 5. DO SENSOR - DISSOLVED OXYGEN

### Specifications
- **Type:** Electrochemical or optical dissolved oxygen sensor
- **Manufacturer:** Atlas Scientific or similar (e.g., Gravity: Optical DO Sensor)
- **Range:** 0-20 mg/L (or 0-200% saturation)
- **Accuracy:** ±2 mg/L or ±5%
- **Output:** Analog (0-3.3V) or I2C digital
- **Power:** 3.3-5V, 30-50mA
- **Response time:** 15-30 seconds
- **Cost:** $60-100

### Purpose
**Critical for aeration control:**
- Spirulina needs 8-15 mg/L DO (optimal photosynthesis)
- Input to fuzzy logic controller
- Detect pump failure (DO crashes if aeration stops)
- Correlate with light intensity (expected DO rise during day)

### Wiring (I2C variant, recommended)

```
DO Sensor VCC → ESP32 3.3V
DO Sensor GND → ESP32 GND
DO Sensor SDA → ESP32 GPIO 21 (I2C SDA)
DO Sensor SCL → ESP32 GPIO 22 (I2C SCL)
```

**Pull-up Resistors:** 4.7kΩ on both SDA/SCL (usually built-in on sensor module)

### Firmware (Arduino IDE)

```cpp
#include <Wire.h>

#define DO_I2C_ADDRESS 0x66  // Atlas Scientific default (verify with sensor)

float readDO() {
  Wire.beginTransmission(DO_I2C_ADDRESS);
  Wire.write("R\r");  // Request reading
  Wire.endTransmission();
  
  delay(1000);  // Wait for conversion
  
  Wire.requestFrom(DO_I2C_ADDRESS, 20, 1);
  String response = "";
  while (Wire.available()) {
    response += (char)Wire.read();
  }
  
  // Parse response: "*XX.XX\r" format
  float doValue = response.substring(1, 6).toFloat();
  return doValue;
}

void loop() {
  float do_mg_L = readDO();
  
  Serial.print("Dissolved Oxygen: ");
  Serial.print(do_mg_L);
  Serial.println(" mg/L");
  
  // Control logic
  if (do_mg_L < 5.0) {
    Serial.println("DO LOW - Increase aeration");
    digitalWrite(PUMP_PIN, HIGH); // Turn on pump
  } else if (do_mg_L > 15.0) {
    Serial.println("DO HIGH - Decrease aeration");
    digitalWrite(PUMP_PIN, LOW); // Turn off pump
  } else {
    Serial.println("DO OPTIMAL (8-15 mg/L)");
  }
}
```

### Calibration (Annually or after sensor replacement)

**Materials Needed:**
- Distilled water (for zero oxygen reference)
- Aerated water in open bowl (for saturation reference)
- Sodium sulfite solution (optional, lab-grade zero DO)

**Procedure:**
1. **Zero calibration** (anaerobic solution):
   - Use sodium sulfite (removes all O2)
   - Submerge probe, wait 3-5 minutes
   - Sensor should read 0.0 mg/L
   - If not, adjust sensor calibration menu

2. **Saturation calibration** (air-saturated water):
   - Leave distilled water aerated (bubbling air) for 10 minutes
   - Submerge probe
   - At ~25°C, saturation ≈ 8.4 mg/L
   - Sensor should read within ±5%

3. **High point** (100% oxygen):
   - Optional: calibrate with pure O2 gas (~20.9% = 20.9 mg/L at STP)

### Troubleshooting
| Issue | Cause | Solution |
|-------|-------|----------|
| Reads 0 always | Membrane hole | Replace membrane (consumable part, ~$20) |
| Slow response | Membrane fouled | Clean gently, or replace |
| Drifts over time | Electrode degradation | Perform annual recalibration |
| Spikes | Bubble hitting sensor | Mount probe away from air inlet |

---

## 6. CO2 SENSOR - CARBON DIOXIDE MONITORING

### Specifications
- **Type:** NDIR (Non-Dispersive Infrared) CO2 sensor
- **Manufacturer:** SenseAir or MH-Z19B variant
- **Range:** 0-5000 ppm
- **Accuracy:** ±50 ppm + 5% of reading
- **Output:** PWM, UART, or I2C (check model)
- **Power:** 5V, 50-150mA
- **Warmup time:** 60 seconds (before stable readings)
- **Cost:** $40-60

### Purpose
**Key air quality metric:**
- Track CO2 removal by ALCURA (target: 55-90% reduction)
- Validate system effectiveness for marketing
- Alert if CO2 injection (gas supply) needed
- Compare with outdoor CO2 baseline (~420 ppm)

### Wiring (UART variant, e.g., MH-Z19B)

```
Sensor VCC → ESP32 5V
Sensor GND → ESP32 GND
Sensor RX → ESP32 GPIO 16 (TX from ESP32)
Sensor TX → ESP32 GPIO 17 (RX to ESP32)
```

**UART Configuration:** 9600 baud, 8 data bits, no parity

### Firmware (Arduino IDE)

```cpp
#include <SoftwareSerial.h>

SoftwareSerial co2Serial(17, 16); // RX, TX (ESP32 GPIO pins)

byte cmd[9] = {0xFF, 0x01, 0x86, 0x00, 0x00, 0x00, 0x00, 0x00, 0x79};
byte response[9];

int readCO2() {
  // Send read command
  co2Serial.write(cmd, 9);
  
  delay(100);
  
  // Read response
  if (co2Serial.available() >= 9) {
    for (int i = 0; i < 9; i++) {
      response[i] = co2Serial.read();
    }
    
    // Parse: bytes[2] & [3] contain CO2 value
    int co2 = (response[2] << 8) | response[3];
    return co2;
  }
  
  return -1; // Error
}

void setup() {
  Serial.begin(115200);
  co2Serial.begin(9600);
  delay(2000); // Warmup time
}

void loop() {
  int co2_ppm = readCO2();
  
  if (co2_ppm > 0) {
    Serial.print("CO2: ");
    Serial.print(co2_ppm);
    Serial.println(" ppm");
    
    // Air quality assessment
    if (co2_ppm < 400) {
      Serial.println("Excellent - ALCURA working (below outdoor level)");
    } else if (co2_ppm < 600) {
      Serial.println("Good");
    } else if (co2_ppm < 1000) {
      Serial.println("Moderate - ventilation recommended");
    } else {
      Serial.println("Poor - high CO2 levels");
    }
  } else {
    Serial.println("CO2 Sensor Error");
  }
  
  delay(5000); // Read every 5 seconds
}
```

### Calibration (Every 6-12 months)

**Method 1: Outdoor Air Calibration (Recommended)**
- Take sensor outside in clear air
- At sea level, outdoor CO2 ≈ 415-420 ppm
- Use sensor calibration command to set reference
- See MH-Z19B datasheet for calibration sequence

**Method 2: Zero Calibration** (if pure CO2-free air available)
- Use nitrogen gas (N2) or very pure air
- Set to 0 ppm reference
- Less practical for consumer use

### Troubleshooting
| Issue | Cause | Solution |
|-------|-------|----------|
| Always reads ~420 ppm | Needs warmup or calibration | Wait 5-10 min after power-on, recalibrate |
| No response from sensor | UART wiring error | Check baud rate (9600), pin assignment |
| Drifts slowly | Sensor aging | Recalibrate every 6 months |

---

## 7. PM2.5 + PM10 SENSOR - PARTICULATE MATTER

### Specifications
- **Type:** Laser-based particle counter
- **Manufacturer:** Plantower PMS7003 or SDS011
- **Range:** 0-999 μg/m³ (both PM2.5 and PM10)
- **Accuracy:** ±10% or ±5 μg/m³ (whichever larger)
- **Output:** UART serial
- **Power:** 5V, 100mA peak
- **Response time:** 1-2 seconds
- **Cost:** $35-50

### Purpose
**Air quality component:**
- Measure particulate matter (dust, pollen, microplastics)
- Validate building IAQ before/after ALCURA
- Research data: microalgae removes ~55% PM2.5, ~46% PM10
- Complement CO2/O2 metrics for complete air quality picture

### Wiring (UART, e.g., PMS7003)

```
Sensor VCC → ESP32 5V
Sensor GND → ESP32 GND
Sensor RX → ESP32 GPIO 16 (TX from ESP32)
Sensor TX → ESP32 GPIO 17 (RX to ESP32)
Sensor SET (optional) → ESP32 GPIO 26 (for sleep mode control)
```

**UART Configuration:** 9600 baud, 8 data bits, 1 stop bit

### Firmware (Arduino IDE)

```cpp
#include <SoftwareSerial.h>

SoftwareSerial pmSerial(17, 16); // RX, TX

struct {
  uint16_t pm1_0;   // PM1.0 (rarely used)
  uint16_t pm2_5;   // PM2.5 (important)
  uint16_t pm10;    // PM10
} pmData;

void readPMSensor() {
  while (pmSerial.available()) {
    uint8_t c = pmSerial.read();
    
    // PMS7003 sends 32-byte frames starting with 0x42, 0x4D
    if (c == 0x42) {
      uint8_t b = pmSerial.read();
      if (b == 0x4D) {
        // Start of valid frame
        uint8_t frame[30];
        pmSerial.readBytes(frame, 30);
        
        // Parse frame
        pmData.pm1_0 = (frame[3] << 8) | frame[4];
        pmData.pm2_5 = (frame[5] << 8) | frame[6];
        pmData.pm10 = (frame[7] << 8) | frame[8];
        
        printPMData();
      }
    }
  }
}

void printPMData() {
  Serial.print("PM1.0: ");
  Serial.print(pmData.pm1_0);
  Serial.print(" μg/m³ | PM2.5: ");
  Serial.print(pmData.pm2_5);
  Serial.print(" μg/m³ | PM10: ");
  Serial.print(pmData.pm10);
  Serial.println(" μg/m³");
  
  // EPA AQI classification
  if (pmData.pm2_5 < 12) {
    Serial.println("Good");
  } else if (pmData.pm2_5 < 35.5) {
    Serial.println("Moderate");
  } else if (pmData.pm2_5 < 55.5) {
    Serial.println("Unhealthy for Sensitive Groups");
  } else {
    Serial.println("Unhealthy");
  }
}

void setup() {
  Serial.begin(115200);
  pmSerial.begin(9600);
}

void loop() {
  readPMSensor();
  delay(2000);
}
```

### Sensor Placement
- **Intake side:** 30cm away from ALCURA (measures room air quality)
- **Exhaust side:** (Optional second unit) near air exit for removal % calculation
- **Height:** Mid-height (not floor dust, not ceiling)
- **Avoid:** Direct LED light on sensor (affects readings)

### Calibration
- **Factory calibrated** ✓ (no manual calibration needed)
- **Verification:** Compare to reference monitor (EPA certified) if available
- **Maintenance:** Clean sensor window monthly with soft brush

### Troubleshooting
| Issue | Cause | Solution |
|-------|-------|----------|
| Always reads 0 | UART disconnected | Check TX/RX wiring |
| Erratic spikes | Dust buildup on lens | Clean with soft brush |
| Data frame errors | Baud rate mismatch | Verify 9600 baud |

---

## COMPLETE WIRING DIAGRAM (ALL 7 SENSORS)

### ESP32 Pin Assignments

| Sensor | Function | ESP32 Pin | Type | Pull-up |
|--------|----------|-----------|------|---------|
| DHT22 | Room T/H | GPIO 4 | Digital | 10kΩ |
| DS18B20 | Culture T | GPIO 5 | 1-Wire | 4.7kΩ |
| Turbidity | Biomass | GPIO 35 | Analog ADC | None |
| pH | Acidity | GPIO 34 | Analog ADC | None |
| DO | Oxygen | GPIO 21/22 | I2C | Built-in |
| CO2 | Carbon | GPIO 16/17 | UART | None |
| PM Sensor | Particles | GPIO 16/17 | UART | None |

**Important:** GPIO 16 & 17 shared by CO2 + PM sensors (time-multiplex queries)

### Power Budget

| Sensor | Voltage | Current | Power |
|--------|---------|---------|-------|
| DHT22 | 3.3V | 2.5mA max | 8mW |
| DS18B20 | 3.3V | <1mA | <3mW |
| Turbidity | 5V | 40mA | 200mW |
| pH | 5V | 15mA | 75mW |
| DO (I2C) | 3.3V | 30mA | 100mW |
| CO2 (NDIR) | 5V | 100mA | 500mW |
| PM Sensor | 5V | 100mA | 500mW |
| **Total** | - | ~290mA @ 5V | **~1.4W** |

**PSU Requirement:** 5V, 0.5A minimum (we have 15A = 3W in spec, adequate)

---

## SENSOR INTEGRATION CHECKLIST

### Pre-Assembly
- [ ] All components purchased & verified
- [ ] Arduino IDE + required libraries installed (DHT, OneWire, DallasTemperature, Wire)
- [ ] Development board (ESP32) flashed & tested
- [ ] All pull-up resistors (10kΩ, 4.7kΩ) in hand

### Assembly & Wiring
- [ ] DHT22 mounted on control box exterior (room air access)
- [ ] DS18B20 probe in culture thermwell (with thermal paste)
- [ ] Turbidity sensor cuvette/flow chamber mounted (immersion depth 2-3cm)
- [ ] pH probe holder installed, electrode submerged
- [ ] DO probe mounted (tip 2-3cm below water surface)
- [ ] CO2 sensor mounted (avoid direct LED/IR light)
- [ ] PM sensor intake positioned 30cm from ALCURA

### Firmware Setup
- [ ] Load baseline sensor reading sketch (test each sensor individually)
- [ ] Verify all sensors report data without errors
- [ ] Create sensor data structure (struct with all 7 parameters)
- [ ] Implement 5-minute logging loop (SD card or cloud sync)

### Calibration
- [ ] DHT22: Verify against thermometer (no adjustment needed)
- [ ] DS18B20: Offset calibration if needed
- [ ] Turbidity: 2-point calibration (0 NTU, 400 NTU standards)
- [ ] pH: Monthly calibration (pH 7.0 & 10.0 buffers)
- [ ] DO: Annual zero & saturation calibration
- [ ] CO2: Outdoor air reference calibration
- [ ] PM: Visual verification (no calibration needed)

### Testing
- [ ] All sensors read independently
- [ ] All sensors read simultaneously (no data collision)
- [ ] UART multiplexing works (CO2 & PM sensor alternating)
- [ ] ADC readings stable (< ±5% drift over 30 seconds)
- [ ] Cloud data sync working

---

## TOTAL SENSOR BOM (7 SENSORS)

| Item | Part # | Qty | Unit Cost | Total |
|------|--------|-----|-----------|-------|
| DHT22 Module | AM2302 | 1 | $6 | $6 |
| DS18B20 Probe | DS18B20 | 1 | $10 | $10 |
| Turbidity Sensor | SEN0189 | 1 | $25 | $25 |
| pH Sensor Module | DFR0169 | 1 | $50 | $50 |
| DO Sensor (I2C) | Gravity DO | 1 | $80 | $80 |
| CO2 Sensor (NDIR) | MH-Z19B | 1 | $50 | $50 |
| PM Sensor | PMS7003 | 1 | $45 | $45 |
| **Subtotal Sensors** | - | - | - | **$266** |
| Pull-up Resistors (10k, 4.7k) | Mix | 5 | $0.50 | $2.50 |
| Connectors, Cables, Headers | - | - | $10 | $10 |
| Calibration Solutions (pH, DO) | - | - | $30 | $30 |
| **Total Sensor Suite** | - | - | - | **$308.50** |

**Cost savings vs. original 10-sensor spec:** $100+ (no RGB camera, fluorescence, extra sensors)

---

## MAINTENANCE SCHEDULE

| Task | Frequency | Time | Priority |
|------|-----------|------|----------|
| Visual sensor check | Daily | 2 min | Medium |
| DHT22 verification | Weekly | 1 min | Low |
| Turbidity window clean | Weekly | 2 min | High |
| pH probe rinse | After each use | 2 min | High |
| pH calibration | Monthly | 10 min | Critical |
| DO membrane check | Monthly | 1 min | High |
| CO2 outdoor calibration | Every 6 months | 5 min | Medium |
| PM sensor lens clean | Monthly | 2 min | Medium |
| DS18B20 thermwell flush | Quarterly | 3 min | Low |

**Annual sensor replacement (wear items):**
- pH electrode: Every 6-12 months (~$20)
- DO membrane: Every 1-2 years (~$20)

---

## 8. UV SENSOR - ULTRAVIOLET RADIATION DETECTION

### Specifications
- **Type:** Analog UV sensor (UVA + UVB)
- **Manufacturer:** GY-ML8511 or Adafruit UV Light Sensor (GUVA-S12SD)
- **Range:** 0-15 mW/cm² (or 0-16 UV index equivalent)
- **Accuracy:** ±5% (typical)
- **Output:** Analog voltage 0-3.3V (proportional to UV intensity)
- **Power:** 3.3-5V, 2mA
- **Response:** 200-400 nm wavelength (UVA: 315-400nm, UVB: 280-315nm)
- **Cost:** $15-25

### Purpose
**LED spectrum monitoring + plant health indicator:**
- Verify LED spectrum reaching microalgae (red/blue/UV balance)
- Monitor LED degradation over time (UV output declines with hours)
- Detect imbalance: If UV low, adjust LED channels
- Research: Spirulina responds to UV (triggers pigment production)

### Wiring (Arduino/ESP32)

```
UV Sensor VCC → ESP32 5V
UV Sensor GND → ESP32 GND
UV Sensor OUT → ESP32 GPIO 32 (ADC1_4, analog input)
```

### Firmware (Arduino IDE)

```cpp
#define UV_PIN 32  // Analog input

// Calibration (per datasheet, GY-ML8511)
// 0.99V @ 0 mW/cm²
// 2.8V @ 15 mW/cm²
const float UV_0_VOLTAGE = 0.99;
const float UV_15_VOLTAGE = 2.8;
const float ADC_RESOLUTION = 4095.0;

float readUV_mW_cm2() {
  int rawADC = analogRead(UV_PIN);
  float voltage = (rawADC / ADC_RESOLUTION) * 3.3;
  
  // Linear interpolation: voltage → UV intensity
  float uv_intensity = (voltage - UV_0_VOLTAGE) / 
                       (UV_15_VOLTAGE - UV_0_VOLTAGE) * 15.0;
  
  return constrain(uv_intensity, 0, 15);
}

// Convert to UV Index (EPA standard)
float uvIntensityToIndex(float intensity_mW_cm2) {
  // UV Index = intensity_mW_cm2 × 0.67 (approximately)
  return intensity_mW_cm2 * 0.67;
}

void loop() {
  float uv_mW = readUV_mW_cm2();
  float uv_index = uvIntensityToIndex(uv_mW);
  
  Serial.print("UV Intensity: ");
  Serial.print(uv_mW);
  Serial.print(" mW/cm² | UV Index: ");
  Serial.println(uv_index);
  
  // LED health monitoring
  if (uv_mW < 3.0) {
    Serial.println("WARNING: UV output LOW (LEDs may be degrading)");
    // Trigger: increase LED PWM or replace LED array
  } else if (uv_mW > 8.0) {
    Serial.println("UV output HEALTHY");
  }
}
```

### Calibration
- **Factory calibrated** ✓ (minimal adjustment usually needed)
- **Verification:** Compare voltage reading to datasheet curve at known light
- **Optional:** Use UV meter reference if available (lab equipment)
- **Maintenance:** Clean sensor window monthly (dust blocks UV)

### Sensor Placement
- Mount on control box exterior, facing LED array
- Position: 10-20cm from LEDs (typical culture distance)
- Angle: Perpendicular to LED light rays
- Avoid: Direct sunlight (will saturate sensor)

### Troubleshooting
| Issue | Cause | Solution |
|-------|-------|----------|
| Stuck at 0V | Sensor disconnected | Check wiring, ADC pin |
| Stuck at 3.3V | No UV reaching sensor | Check LED operation, clean window |
| Drifts over time | UV sensor aging | Recalibrate every 12 months |

---

## 9. LUX SENSOR - LIGHT INTENSITY MEASUREMENT

### Specifications
- **Type:** Ambient light sensor (full spectrum visible)
- **Manufacturer:** BH1750FVI (I2C) or TEMT6000 (Analog)
- **Range:** 0-188,000 lux (full spectrum, including IR)
- **Accuracy:** ±20% (typical)
- **Output:** I2C digital (preferred) or analog voltage
- **Power:** 3.3V, 0.2mA (I2C variant, very low power)
- **Response:** 400-1100 nm (visible + some IR)
- **Cost:** $10-20

### Purpose
**LED control + adaptive light management:**
- Measure actual light reaching culture (not just LED setpoint)
- Detect ambient light interference (windows, other lights)
- Adaptive dimming: Reduce LEDs if high ambient light detected
- Research: Correlate lux with photosynthetic activity
- Validate: Confirm light distribution to culture surface

### Wiring (I2C variant, e.g., BH1750FVI)

```
Lux Sensor VCC → ESP32 3.3V
Lux Sensor GND → ESP32 GND
Lux Sensor SCL → ESP32 GPIO 22 (I2C clock, shared with DO sensor)
Lux Sensor SDA → ESP32 GPIO 21 (I2C data, shared with DO sensor)
```

**I2C Address:** 0x23 (default) or 0x5C (if ADDR pin grounded)

### Firmware (Arduino IDE)

```cpp
#include <Wire.h>

#define BH1750_ADDR_LOW 0x23   // Default I2C address
#define BH1750_ADDR_HIGH 0x5C  // Alternative address

class BH1750 {
private:
  uint8_t address;
  
public:
  BH1750(uint8_t addr = BH1750_ADDR_LOW) : address(addr) {}
  
  void begin() {
    Wire.begin();
    // Start measurement
    Wire.beginTransmission(address);
    Wire.write(0x10); // Continuous High Resolution Mode
    Wire.endTransmission();
  }
  
  float readLux() {
    Wire.beginTransmission(address);
    Wire.requestFrom(address, 2);
    
    if (Wire.available() >= 2) {
      uint16_t raw = (Wire.read() << 8) | Wire.read();
      // BH1750 raw value to lux: divide by 1.2
      return raw / 1.2;
    }
    return -1;
  }
};

BH1750 luxSensor(BH1750_ADDR_LOW);

void setup() {
  Serial.begin(115200);
  luxSensor.begin();
}

void loop() {
  float lux = luxSensor.readLux();
  
  if (lux >= 0) {
    Serial.print("Light Intensity: ");
    Serial.print(lux);
    Serial.println(" lux");
    
    // Light quality assessment
    if (lux < 100) {
      Serial.println("Very dim (night/minimal ambient)");
    } else if (lux < 500) {
      Serial.println("Dim (office lighting)");
    } else if (lux < 2000) {
      Serial.println("Moderate (good office light)");
    } else if (lux < 10000) {
      Serial.println("Bright (outdoor shade)");
    } else {
      Serial.println("Very bright (direct sunlight)");
    }
    
    // Adaptive LED control
    // If lux > 5000 (bright ambient), reduce LED PWM to avoid overheating
    // If lux < 200 (dark), increase LED PWM to compensate
    
  } else {
    Serial.println("BH1750 Read Error");
  }
  
  delay(1000);
}
```

### Calibration
- **Factory calibrated** ✓ (no manual calibration needed)
- **Verification:** Compare readings to reference light meter if available
- **Typical Reference Points:**
  - Moonlit night: 1 lux
  - Indoor office: 200-500 lux
  - Outdoor shade: 10,000 lux
  - Direct sunlight: 100,000+ lux

### Sensor Placement
- Mount on control box interior, facing culture chamber
- Position: 10cm away from LED array
- Angle: Pointing toward center of culture (average light)
- Avoid: Direct LED line-of-sight (measure diffuse light, not spot)

### Troubleshooting
| Issue | Cause | Solution |
|-------|-------|----------|
| Stuck at 0 lux | Sensor not responding on I2C | Check address (0x23 vs 0x5C), verify SCL/SDA |
| Drifts slowly | Sensor window dusty | Clean optical surface |
| Readings too low | Sensor pointing away from light | Reposition facing LEDs |
| I2C collision | Competing with DO sensor | Stagger I2C requests (read DO, delay, read Lux) |

---

## UPDATED WIRING DIAGRAM (ALL 9 SENSORS)

### ESP32 Pin Assignments (Consolidated)

| Sensor | Function | ESP32 Pin | Type | Pull-up |
|--------|----------|-----------|------|---------|
| DHT22 | Room T/H | GPIO 4 | Digital | 10kΩ |
| DS18B20 | Culture T | GPIO 5 | 1-Wire | 4.7kΩ |
| Turbidity | Biomass | GPIO 35 | Analog ADC | None |
| pH | Acidity | GPIO 34 | Analog ADC | None |
| DO | Oxygen | GPIO 21/22 | I2C | Built-in |
| CO2 | Carbon | GPIO 16/17 | UART | None |
| PM Sensor | Particles | GPIO 16/17 | UART | None |
| UV | Radiation | GPIO 32 | Analog ADC | None |
| Lux | Light | GPIO 21/22 | I2C | Built-in |

**I2C Bus:** GPIO 21 (SDA) + GPIO 22 (SCL) shared by DO + Lux sensors
**UART Bus:** GPIO 16/17 shared by CO2 + PM sensors (time-multiplex)

### Updated Power Budget

| Sensor | Voltage | Current | Power |
|--------|---------|---------|-------|
| DHT22 | 3.3V | 2.5mA | 8mW |
| DS18B20 | 3.3V | <1mA | <3mW |
| Turbidity | 5V | 40mA | 200mW |
| pH | 5V | 15mA | 75mW |
| DO (I2C) | 3.3V | 30mA | 100mW |
| CO2 (NDIR) | 5V | 100mA | 500mW |
| PM Sensor | 5V | 100mA | 500mW |
| UV Sensor | 5V | 2mA | 10mW |
| Lux Sensor (I2C) | 3.3V | 0.2mA | 0.6mW |
| **Total** | - | ~290mA @ 5V | **~1.4W** |

**PSU Requirement:** 5V, 0.5A minimum (no change, still adequate with 15A supply)

---

## UPDATED TOTAL SENSOR BOM (9 SENSORS)

| Item | Part # | Qty | Unit Cost | Total |
|------|--------|-----|-----------|-------|
| DHT22 Module | AM2302 | 1 | $6 | $6 |
| DS18B20 Probe | DS18B20 | 1 | $10 | $10 |
| Turbidity Sensor | SEN0189 | 1 | $25 | $25 |
| pH Sensor Module | DFR0169 | 1 | $50 | $50 |
| DO Sensor (I2C) | Gravity DO | 1 | $80 | $80 |
| CO2 Sensor (NDIR) | MH-Z19B | 1 | $50 | $50 |
| PM Sensor | PMS7003 | 1 | $45 | $45 |
| UV Sensor | GY-ML8511 | 1 | $20 | $20 |
| Lux Sensor (I2C) | BH1750FVI | 1 | $15 | $15 |
| **Subtotal Sensors** | - | - | - | **$301** |
| Pull-up Resistors (10k, 4.7k) | Mix | 5 | $0.50 | $2.50 |
| Connectors, Cables, Headers | - | - | $10 | $10 |
| Calibration Solutions (pH, DO) | - | - | $30 | $30 |
| **Total Sensor Suite (9 sensors)** | - | - | - | **$343.50** |

**Cost vs. specs:**
- Original 10-sensor spec: $250-400
- Your 9-sensor spec: $344
- Optimization: Removed RGB camera + fluorescence, added UV + Lux (better for LED management)

---

## UPDATED MAINTENANCE SCHEDULE (9 SENSORS)

| Task | Frequency | Time | Priority |
|-------|-----------|------|----------|
| Visual sensor check | Daily | 2 min | Medium |
| DHT22 verification | Weekly | 1 min | Low |
| Turbidity window clean | Weekly | 2 min | High |
| pH probe rinse | After each use | 2 min | High |
| UV window clean | Weekly | 1 min | Medium |
| Lux sensor window clean | Monthly | 1 min | Low |
| pH calibration | Monthly | 10 min | Critical |
| DO membrane check | Monthly | 1 min | High |
| CO2 outdoor calibration | Every 6 months | 5 min | Medium |
| PM sensor lens clean | Monthly | 2 min | Medium |
| DS18B20 thermwell flush | Quarterly | 3 min | Low |

---

**Document Status:** ✅ COMPLETE (Updated with UV + Lux sensors)

**Next:** Connect all 9 sensors via I2C/UART/Analog, write integration firmware, test sensor fusion.

