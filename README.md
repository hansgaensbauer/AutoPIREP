# Automatic Aerial Turbulence Reports

Automatic Airborne Turbulence Reporting (AATR) is an electronic system that identifies turbulence in small aircraft and submits PIREP-like reports to a publically accessible database without any intervention by the pilot. The AATR hardware includes an accelerometer for detecting turbulence, a GPS for recording the aircraft's position, and a satcom modem for sending reports to the ground in real time. AATR will not require any connection to the aircraft - it can be placed in a glove compartment or stowed anywhere and it will power itself and transmit reports whenever necessary.

## Prototype Hardware
<img src="https://github.com/hansgaensbauer/AATR/blob/main/Documentation/aatr-sensor-v0.jpg?raw=true" width="480">

## Avionics Open Questions
- Do small aircraft have avionics? If not, what aircraft do?
- Are angle of attack and airspeed transmitted to the ground? 
- Can AATR data be incorporated into existing avionics systems without AATR being physically connected to the aircraft?
- If these aircraft already have accelerometers, is it possible to get access to some of that data from past flights?

## General Open Questions
- Is is possible to differentiate turbulence from maneuvers without knowing the flight plan or the state of the controls in real time?
- How long is a report useful? After a report is submitted, how long should it persist before it is considered "out of date"?
- What information should be included with the report? Is it necessary to include actual acceleration data, or just a classification of the severity of the turbulence
- Should all turbulence be reported, or is there a certain threshold where turbulence is too small to be worth reporting?
- What should we do with the data? Do we need to create our own service for pilots to view the data, or is it better to just make that data available to other flight planning services?
