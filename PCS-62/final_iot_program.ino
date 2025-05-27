#include <WiFi.h>
#include <EEPROM.h>
#include <DHT.h>
DHT dht(33, DHT11);


volatile int interruptCounter;  //for counting interrupt
int totalInterruptCounter;    //total interrupt counting

hw_timer_t * timer = NULL;      //H/W timer defining (Pointer to the Structure)

portMUX_TYPE timerMux = portMUX_INITIALIZER_UNLOCKED;

void IRAM_ATTR onTimer() {      //Defining Inerrupt function with IRAM_ATTR for faster access
 portENTER_CRITICAL_ISR(&timerMux);
 interruptCounter++;
 portEXIT_CRITICAL_ISR(&timerMux);
}

int timep = 0;




void writeString(char add,String data);
String read_String(char add);



const char* ssidh     = "Vinay's Home";
const char* passwordh = "#12345678";
 
const char* ssid = "Iqoo z9";
const char* password =  "piyushkumar";
 
IPAddress staticIP(192,168,29,51);
IPAddress gateway(192, 168, 29, 1);
IPAddress subnet(255, 255, 255, 0);
IPAddress dns(192, 168, 29, 1);
// Set web server port number to 80
WiFiServer server(80);

// Variable to store the HTTP request
String header;
int PIR = 25;



// Assign output variables to GPIO pins
const int output26 = 26;
const int output27 = 27;

// Current time
unsigned long currentTime = millis();
// Previous time
unsigned long previousTime = 0; 
// Define timeout time in milliseconds (example: 2000ms = 2s)
const long timeoutTime = 2000;

    
void setup(){
  Serial.begin(115200);
  EEPROM.begin(512);
  dht.begin();
  pinMode(PIR , INPUT);
 
  timer = timerBegin(0, 80, true);             // timer 0, prescalar: 80, UP counting
  timerAttachInterrupt(timer, &onTimer, true);   // Attach interrupt
  timerAlarmWrite(timer, 1000000, true);     // Match value= 1000000 for 1 sec. delay.
  timerAlarmEnable(timer); 
  
  // Initialize the output variables as outputs
  pinMode(output26, OUTPUT);
  pinMode(output27, OUTPUT);
  // Set outputs to LOW
  if(read_String(10)=="ON"){
     digitalWrite(output26, HIGH);
    }
  if(read_String(10)=="OFF"){
    digitalWrite(output26, LOW);
  }
  if(read_String(50)=="ON"){
    digitalWrite(output27, HIGH);
  }
   if(read_String(50)=="OFF"){
    digitalWrite(output27, LOW);
  }

  WiFi.softAP(ssidh, passwordh);

  IPAddress IP = WiFi.softAPIP();
  Serial.print("AP IP address: ");
  Serial.println(IP);

  server.begin();

  
 
  
}
     

    
void loop(){
  float temp = dht.readTemperature();
  String temps;
  temps = String(temp);
  
 float humidity = dht.readHumidity();
 String hum;
 hum = String(humidity);
int PIR_input = digitalRead(PIR);
Serial.println(PIR_input);
Serial.println(read_String(10));
Serial.println(read_String(60));
Serial.println(counter1());
Serial.println(timep);
Serial.println(timep + 60);

 

 
 if(PIR_input == 1 && read_String(10)=="OFF" && read_String(60)=="ON" ){
  digitalWrite(output26, HIGH);
  timep = counter1();
  writeString(10, "ON");
 }else if(PIR_input ==0 && read_String(10)=="ON" && read_String(60)=="ON" && (timep + 60) == counter1()) {
  digitalWrite(output26, LOW);
  writeString(10, "OFF"); 
 }
 if(PIR_input ==1 && read_String(10)=="OFF" && read_String(60)=="ON"  && temp > 20.00){
  digitalWrite(output27, HIGH);
  writeString(50, "ON");
 }
 delay(1000);
  
  WiFiClient client = server.available();   // Listen for incoming clients

  if (client) {                             // If a new client connects,
    currentTime = millis();
    previousTime = currentTime;
    Serial.println("New Client.");          // print a message out in the serial port
    String currentLine = "";                // make a String to hold incoming data from the client
    while (client.connected() && currentTime - previousTime <= timeoutTime) {  // loop while the client's connected
      currentTime = millis();
      if (client.available()) {             // if there's bytes to read from the client,
        char c = client.read();             // read a byte, then
        Serial.write(c);                    // print it out the serial monitor
        header += c;
        if (c == '\n') {                    // if the byte is a newline character
          // if the current line is blank, you got two newline characters in a row.
          // that's the end of the client HTTP request, so send a response:
          if (currentLine.length() == 0) {
            // HTTP headers always start with a response code (e.g. HTTP/1.1 200 OK)
            // and a content-type so the client knows what's coming, then a blank line:
            client.println("HTTP/1.1 200 OK");
            client.println("Content-type:text/html");
            client.println("Connection: close");
            client.println();

            
            
            // turns the GPIOs on and off
            if (header.indexOf("GET /26/on") >= 0) {
              Serial.println("GPIO 26 on");
              writeString(10, "ON");
              digitalWrite(output26, HIGH);
            } else if (header.indexOf("GET /26/off") >= 0) {
              Serial.println("GPIO 26 off");
              writeString(10, "OFF");
              digitalWrite(output26, LOW);
            } else if (header.indexOf("GET /27/on") >= 0) {
              Serial.println("GPIO 27 on");
              writeString(50, "ON");
              digitalWrite(output27, HIGH);
            } else if (header.indexOf("GET /27/off") >= 0) {
              Serial.println("GPIO 27 off");
              writeString(50, "OFF");
              digitalWrite(output27, LOW);
            }else if (header.indexOf("GET /32/on") >= 0) {
              Serial.println("GPIO 32 on");
              writeString(60, "ON");
            }else if (header.indexOf("GET /32/off") >= 0) {
              Serial.println("GPIO 32 off");
              writeString(60, "OFF");
            }
            
            // Display the HTML web page
            client.println("<!DOCTYPE html><html>");
            client.println("<head><meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">");
            client.println("<link rel=\"icon\" href=\"data:,\">");
            // CSS to style the on/off buttons 
            // Feel free to change the background-color and font-size attributes to fit your preferences
            client.println("<style>html { font-family: Helvetica; display: inline-block; margin: 0px auto; text-align: center;}");
            client.println(".button { background-color: #4CAF50; border: none; color: white; padding: 16px 40px;");
            client.println("text-decoration: none; font-size: 30px; margin: 2px; cursor: pointer;}");
            client.println(".button2 {background-color: #555555;}</style></head>");
            
            // Web Page Heading
            client.println("<body><h1>Vinay's Home</h1>");
            
            // Display current state, and ON/OFF buttons for GPIO 26  
            client.println("<p>Light 1 - State " + read_String(10) + "</p>");
            // If the output26State is off, it displays the ON button       
            if (read_String(10)=="OFF") {
              client.println("<p><a href=\"/26/on\"><button class=\"button\">ON</button></a></p>");
            } else {
              client.println("<p><a href=\"/26/off\"><button class=\"button button2\">OFF</button></a></p>");
            } 
               
            // Display current state, and ON/OFF buttons for GPIO 27  
            client.println("<p>Ceiling Fan - State " + read_String(50) + "</p>");
            // If the output27State is off, it displays the ON button       
            if (read_String(50)=="OFF") {
              client.println("<p><a href=\"/27/on\"><button class=\"button\">ON</button></a></p>");
            } else {
              client.println("<p><a href=\"/27/off\"><button class=\"button button2\">OFF</button></a></p>");
            }

            client.println("<p>Room Temperature in " + temps + " </p>");
            client.println("<p>Room humidity % " + hum + " </p>");
            client.println("</body></html>");

            client.println("<p>Motion Sensor - State " + read_String(60) + "</p>");
            // If the output26State is off, it displays the ON button       
            if (read_String(60)=="OFF") {
              client.println("<p><a href=\"/32/on\"><button class=\"button\">ON</button></a></p>");
            } else {
              client.println("<p><a href=\"/32/off\"><button class=\"button button2\">OFF</button></a></p>");
            } 
            
            // The HTTP response ends with another blank line1
            client.println();
            // Break out of the while loop
            break;
          } else { // if you got a newline, then clear currentLine
            currentLine = "";
          }
        } else if (c != '\r') {  // if you got anything else but a carriage return character,
          currentLine += c;      // add it to the end of the currentLine
        }
      }
    }
    // Clear the header variable
    header = "";
    // Close the connection
    client.stop();
    Serial.println("Client disconnected.");
    Serial.println("");
  
}
  }

  void writeString(char add,String data)
{
  int _size = data.length();
  int i;
  for(i=0;i<_size;i++)
  {
    EEPROM.put(add+i,data[i]);
  }
  EEPROM.write(add+_size,'\0');   //Add termination null character for String Data
  EEPROM.commit();
}


String read_String(char add)
{
  int i;
  char data[100]; //Max 100 Bytes
  int len=0;
  unsigned char k;
  k=EEPROM.read(add);
  while(k != '\0' && len<500)   //Read until null character
  {    
    k=EEPROM.read(add+len);
    data[len]=k;
    len++;
  }
  data[len]='\0';
  return String(data);
}

int counter1(){
    if (interruptCounter > 0) {
 
   portENTER_CRITICAL(&timerMux);
   interruptCounter--;
   portEXIT_CRITICAL(&timerMux);
 
   totalInterruptCounter++;           //counting total interrupt

   return totalInterruptCounter;
 }
}
