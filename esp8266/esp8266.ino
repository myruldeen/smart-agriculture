#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>
#include <OneWire.h>
#include <DallasTemperature.h>
#include "DHT.h"

const char* ssid = "MY Wi-Fi";
const char* password =  "Shuhaizal19";
const char* mqtt_server = "driver.cloudmqtt.com";
const int   mqtt_port = 18685;
const char* mqtt_user = "spvjjkqq";
const char* mqtt_pass = "hc_7fOQmGQaE";

#define ONE_WIRE_BUS 2

#define DHTTYPE DHT11   // DHT 11
#define dht_dpin D6      //GPIO-0 D3 pin of nodemcu
//SoftwareSerial nodemcu(3, 1);
OneWire oneWire(ONE_WIRE_BUS);
DallasTemperature sensors(&oneWire);

WiFiClient espClient;
PubSubClient client(espClient);

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

// Setup wifi
void setup_wifi() {
  delay(10);
  // We start by connecting to a WiFi network
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.print("WiFi connected - ESP IP address: ");
  Serial.println(WiFi.localIP());
}

// MQTT callback
void callback(String topic, byte* message, unsigned int length) {
  Serial.print("Message arrived on topic: ");
  Serial.print(topic);
  Serial.print(". Message: ");
  String messageTemp;
  for (int i = 0; i < length; i++) {
    Serial.print((char)message[i]);
    messageTemp += (char)message[i];
  }
  Serial.println();
}

void reconnect() {
  // Loop until we're reconnected
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    // Attempt to connect
    if (client.connect("ESP8266Ultrasonic", mqtt_user, mqtt_pass)) {
      Serial.println("connected");
    }
    else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      // Wait 5 seconds before retrying
      delay(5000);
    }
  }
}

void setup() {
  // Debug console
  Serial.begin(115200);
  sensors.begin();
  setup_wifi();
  pinMode(S0, OUTPUT);
  pinMode(S1, OUTPUT);
  pinMode(S2, OUTPUT);
  pinMode(S3, OUTPUT);
  pinMode(LED_BUILTIN, OUTPUT);
  pinMode(ON_OFF, OUTPUT);
  pinMode(SW, OUTPUT);
  dht.begin();
  client.setServer(mqtt_server, mqtt_port);
  client.setCallback(callback);
  client.setKeepAlive(300);
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
  
  // Reconnecting.......  
  if (!client.connected()) {
    reconnect();
  }
  if (!client.loop()) {
    client.connect("ESP8266lights", mqtt_user, mqtt_pass);
  }

  // Send JSON to mqtt broker
  StaticJsonBuffer<300> JSONbuffer;
  JsonObject& root = JSONbuffer.createObject();

  root["macAddress"] = WiFi.macAddress();
  JsonObject& data = root.createNestedObject("data");
  data["Soil1"] = sensorValue1;
  data["Soil2"] = sensorValue2;
  data["Light"] = light;
  data["Temp"] = t;
  data["Humd"] = h;
  data["SoilTemp1"] = sensors.getTempCByIndex(0);
  data["SoilTemp2"] = sensors.getTempCByIndex(1);

  char JSONmessageBuffer[200];
  root.printTo(JSONmessageBuffer, sizeof(JSONmessageBuffer));
  Serial.println("Sending message to MQTT topic..");
  Serial.println(JSONmessageBuffer);

  if (client.publish("esp/sada", JSONmessageBuffer) == true) {
    Serial.println("Success sending message");
  } else {
    Serial.println("Error sending message");
  }

  Serial.println("-------------");
  delay(1000);

}