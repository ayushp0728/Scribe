#include <Stepper.h>
#include <Servo.h>

const int stepsPerRevolution = 2048; // For 28BYJ-48
Servo servo;
Stepper myStepper(stepsPerRevolution, 8, 10, 9, 11);
//Stepper step2(stepsPerRevolution, 4, 5, 6, 7);


void setup() {
  myStepper.setSpeed(10); 
  //step2.setSpeed(10); 
  Serial.begin(115200);
  servo.attach(12);
  servo.write(0);
 // step2.step(stepsPerRevolution/2);
  Serial.println("Type 'r' in the serial monitor to start the process.");
}

void loop() {
  if (Serial.available() > 0) { 
    String input = Serial.readStringUntil('\n'); 
    input.trim();

    if (input == "r") {
      Serial.println("Running process...");

      // Stepper moves left to drop off a page
      servo.write(-30);
      myStepper.step(800);
      //step2.step(stepsPerRevolution);

      delay(1000);

      // Move the servo to stretch the paper
      servo.write(170);
      delay(1000);

      // Stepper moves right to pick up the page
      myStepper.step(-800);
      servo.write(-20);
      delay(1000);

      Serial.println("Cycle complete. Type 'r' to start again.");
    }
  }
}
