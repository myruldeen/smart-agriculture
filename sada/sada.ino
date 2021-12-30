#include <OneWire.h>
#include <DallasTemperature.h>
#include <Blynk.h>
#include <SoftwareSerial.h>
#include <BlynkSimpleEsp8266.h>
#include "DHT.h"        // DHT11 temperature and humidity sensor Predefined library
#include <ArduinoJson.h>

#define ONE_WIRE_BUS 2

#define DHTTYPE DHT11   // DHT 11
#define dht_dpin D6      //GPIO-0 D3 pin of nodemcu
//SoftwareSerial nodemcu(3, 1);
OneWire oneWire(ONE_WIRE_BUS);
DallasTemperature sensors(&oneWire);

char auth[] = "juWQCZFKcQMfG0OzmVdhmhhVOr7PEIKN";    // You should get Auth Token in the Blynk App.
char ssid[] = "MY Wi-Fi";                           // Your WiFi credentials.
char pass[] = "Shuhaizal19";

int sensorPin = A0;
int sensorValue1 = 0;
int sensorValue2 = 0;
int sensorValue3 = 0;
int sensorValue4 = 0;
int sensorValue5 = 0;
int light = 0;
#define S0 D0
#define S1 D1
#define S2 D2
#define S3 D3
#define ON_OFF   D5  // Relay 1 Solenoid
#define SW       D7  // Relay 2 Light
//#define Relay3   D3
DHT dht(dht_dpin, DHTTYPE);

void setup(void)
{
  Serial.begin(115200);
  sensors.begin();
  pinMode(S0, OUTPUT);
  pinMode(S1, OUTPUT);
  pinMode(S2, OUTPUT);
  pinMode(S3, OUTPUT);
  pinMode(LED_BUILTIN, OUTPUT);
  pinMode(ON_OFF, OUTPUT);
  pinMode(SW, OUTPUT);
  Blynk.begin(auth, ssid, pass);
  dht.begin();
  delay(10);

}

void loop() {
  sensors.requestTemperatures();
  //digitalWrite(ON_OFF, HIGH);
  float h = 0.0; //Humidity level
  float t = 0.0; //Temperature in celcius
  float f = 0.0; //Temperature in fahrenheit
  float m = 0.0; // moisture from soil sensor
  // Match the request
  int i = 0;
  int moisture_percentage = 0;

  int m1 = 0;
  int m2 = 0;

  h = dht.readHumidity();    //Read humidity level
  t = dht.readTemperature(); //Read temperature in celcius
  // f = (h * 1.8) + 32;        //Temperature converted to Fahrenheit

  digitalWrite(S0, LOW);
  digitalWrite(S1, LOW);
  digitalWrite(S2, LOW);
  digitalWrite(S3, LOW);
  // Serial.print("Sensor 1 ");
  // Serial.println(analogRead(sensorPin));
  sensorValue1 = ( 100 - ( (analogRead(sensorPin) / 1024) * 100 ) ); delay(1);
  m1 = analogRead(sensorPin);
  //  sensorValue1 = (analogRead(sensorPin)); delay(1);
  digitalWrite(S0, HIGH);
  digitalWrite(S1, LOW);
  digitalWrite(S2, LOW);
  digitalWrite(S3, LOW);
  digitalWrite(LED_BUILTIN, HIGH);
  //  Serial.print("Sensor 2 ");
  // Serial.println(analogRead(sensorPin));
  sensorValue2 = ( 100 - ( (analogRead(sensorPin) / 1024) * 100 ) ); delay(1);
  m2 = analogRead(sensorPin);
  //  sensorValue2 = (analogRead(sensorPin)); delay(1);
  digitalWrite(S0, LOW);
  digitalWrite(S1, HIGH);
  digitalWrite(S2, LOW);
  digitalWrite(S3, LOW);
  // Serial.print("Sensor 3 ");
  // Serial.println(analogRead(sensorPin));
  //   sensorValue3 = ( 100 - ( (analogRead(sensorPin)/1024) * 100 ) );
  sensorValue3 = (analogRead(sensorPin)); delay(1);
  light = map(sensorValue3, 0, 1023, 10, 0);


  if (m1 > 700)
  {
    digitalWrite(SW, LOW);
  }
  else
  {
    digitalWrite(SW, HIGH);
  }

  delay(10);
  // int j;
  if (m2 > 700)
  {
    digitalWrite(ON_OFF, LOW);
    // j=1;digitalWrite(ON_OFF, HIGH);
  } else {
    digitalWrite(ON_OFF, HIGH);
    //   j=0;digitalWrite(ON_OFF, LOW);
  }



  Blynk.run(); // Initiates Blynk
  Blynk.virtualWrite(V0, sensorValue1);
  Blynk.virtualWrite(V1, sensorValue2);
  Blynk.virtualWrite(V2, map(sensorValue3, 0, 1023, 10, 0));
  Blynk.virtualWrite(V3, t);
  Blynk.virtualWrite(V4, h);
  Blynk.virtualWrite(V5, sensors.getTempCByIndex(0));
  Blynk.virtualWrite(V6, sensors.getTempCByIndex(1));



  delay(1000);


}
