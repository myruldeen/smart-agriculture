#include <ESP8266WiFi.h>
#include <SoftwareSerial.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>

const char* ssid = "SHA-256";
const char* password =  "pass1234";
const char* mqtt_server = "192.168.30.244";
const int mqtt_port = 1883;
const char* mqttUser = "";
const char* mqttPassword = "";

String myString; // complete message from arduino, which consistors of snesors data
char rdata; // received charactors

String humidity, temperature, soil1, soil2, light, temp1, temp2; // sensors

WiFiClient espClient;
PubSubClient client(espClient);

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
    if (client.connect("ESP8266Ultrasonic")) {
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
  setup_wifi();
  client.setServer(mqtt_server, mqtt_port);
  client.setCallback(callback);

}

void loop() {
  if (!client.connected()) {
    reconnect();
  }
  if (!client.loop()) {
    client.connect("ESP8266lights");
  }

  if (Serial.available() > 0 ) {

    rdata = Serial.read();
    myString = myString + rdata;
    // Serial.print(rdata);
    if ( rdata == '\n') {
      //  Serial.println(myString);

      // new code
      humidity = getValue(myString, ',', 0);
      temperature = getValue(myString, ',', 1);
      soil1 = getValue(myString, ',', 2);
      soil2 = getValue(myString, ',', 3);
      light = getValue(myString, ',', 4);
      temp1 = getValue(myString, ',', 5);
      temp2 = getValue(myString, ',', 6);

      // Send JSON to mqtt broker
      StaticJsonBuffer<300> JSONbuffer;
      JsonObject& root = JSONbuffer.createObject();

      root["macAddress"] = WiFi.macAddress();
      JsonObject& data = root.createNestedObject("data");
      data["humidity"] = humidity;
      data["temperature"] = temperature;
      data["soil1"] = soil1;
      data["soil2"] = soil2;
      data["light"] = light;
      data["temp1"] = temp1;
      data["temp2"] = temp2;

      char JSONmessageBuffer[200];
      root.printTo(JSONmessageBuffer, sizeof(JSONmessageBuffer));
      Serial.println("Sending message to MQTT topic..");
      Serial.println(JSONmessageBuffer);

      if (client.publish("esp8266/agriculture", JSONmessageBuffer) == true) {
        Serial.println("Success sending message");
      } else {
        Serial.println("Error sending message");
      }

      Serial.println("-------------");

      myString = "";
      // end new code
    }
  }

  delay(1000);

}

String getValue(String data, char separator, int index) {

  int found = 0;
  int strIndex[] = { 0, -1 };
  int maxIndex = data.length() - 1;

  for (int i = 0; i <= maxIndex && found <= index; i++) {
    if (data.charAt(i) == separator || i == maxIndex) {
      found++;
      strIndex[0] = strIndex[1] + 1;
      strIndex[1] = (i == maxIndex) ? i + 1 : i;
    }
  }
  return found > index ? data.substring(strIndex[0], strIndex[1]) : "";
}
