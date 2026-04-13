**I**oT-**B**ased **R**eal-**T**ime **G**PS **T**racking **S**ystem **f**or **A**lzheimer's **P**atient **S**afety

 A compact, low-cost IoT system for continuous real-time location monitoring of Alzheimer's patients to prevent life-threatening wandering incidents.
 <br>
 <img width="600" height="200" alt="image" src="https://github.com/user-attachments/assets/00795c64-e31d-40e7-addc-095c0f37225a" />
<br>
**OverView**
<br>
Alzheimer's disease causes progressive memory loss and spatial disorientation, making patient wandering one of the most critical safety challenges for caregivers. This project presents a low-cost IoT-based real-time GPS tracking system designed to continuously monitor patient location and enable rapid caregiver response.

The system is built around the **ESP32-S3 microcontroller** on the VVM601
development board, integrated with the **Quectel EC200U cellular module** providing
built-in GNSS capability (GPS/GLONASS/BeiDou) for rapid satellite fix acquisition.
Wi-Fi is used during development and validation, while LTE Category-4 cellular
connectivity enables standalone real-world deployment with low idle power consumption.

GPS coordinates are transmitted to a **Google Firebase** backend — leveraging
Firestore's real-time NoSQL capabilities and Cloud Functions for serverless
event-driven processing — and visualized through a cross-platform mobile application
with live map integration and **geofencing-based caregiver alerts**.

Experimental results confirm reliable GPS coordinate acquisition (sub-20-meter
accuracy) and successful end-to-end data delivery, demonstrating a compact,
power-aware solution suitable for assisted healthcare environments.


**System Architecture ** 
<br>
<img width="600" height="200" alt="image" src="https://github.com/user-attachments/assets/d722da4e-31e9-4594-9da8-ffd479f42f37" />
<br>
The system follows a layered IoT architecture spanning hardware, 
connectivity, and application layers.

**Power & Input Layer**
A 5V power source feeds through a voltage regulation circuit to supply 
stable power to the entire system. A push button provides manual control 
for start/stop operations and triggering emergency SOS alerts.

**Processing Layer (ESP32-S3)**
The ESP32-S3 acts as the central processing unit, responsible for:
- System control and task scheduling
- Sending AT commands to the EC200U for GPS data retrieval
- Fall detection logic processing
- Emergency trigger handling on SOS button press

**Communication Layer (Quectel EC200U)**
The EC200U module handles two communication channels simultaneously:
- **GNSS → GPS Antenna** — acquires real-time satellite positioning data
- **LTE → 4G Antenna** — transmits GPS coordinates to the remote server 
  over cellular network

**Application Layer (Mobile Application)**
Processed data is delivered via LTE to a mobile application providing:
- Live location tracking on map
- Emergency alerts to caregivers
- Call notifications on SOS trigger

<br>

**Hardware Components**

| Component | Model | Purpose |
|-----------|-------|---------|
| Microcontroller | ESP32-S3 (VVM601) | Main processing unit |
| Cellular + GNSS Module | Quectel EC200U | GPS acquisition & LTE transmission |
| Power Supply | Li-Po Battery | Portable, power-aware deployment |
| Connectivity | Wi-Fi / LTE | Data transmission to remote app |
<br>

 **Network & Protocol Stack**

| Layer | Protocol | Usage |
|-------|----------|-------|
| Application | HTTP / MQTT | GPS data delivery to remote server |
| Transport | TCP / UDP | Reliable / lightweight transmission |
| Network | IP | Addressing and routing |
| Physical | Wi-Fi 802.11 / LTE | Development / standalone deployment |

<br>

 **IoT Security Considerations**

> This section analyzes the attack surface of the system — 
> relevant to IoT penetration testing and security research.

- **Unencrypted transmission risk** — GPS coordinates sent over unencrypted 
  channels can be intercepted; TLS/SSL recommended for production deployment.
- **MQTT broker security** — unauthenticated MQTT brokers expose data to 
  unauthorized subscribers; broker authentication and ACLs are essential.
- **Firmware attack surface** — ESP32-S3 firmware can be extracted and 
  reverse-engineered; secure boot and flash encryption mitigate this.
- **Physical attack vector** — compact wearable form factor is vulnerable to 
  device theft and hardware tampering.
- **Cellular module vulnerabilities** — EC200U AT command interface must be 
  restricted to prevent unauthorized command injection.

  
