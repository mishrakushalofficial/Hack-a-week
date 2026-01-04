#include <XPT2046_Touchscreen.h>
#include <ESP32Servo.h>
#include <SPI.h>

// ---------------- SCREEN ----------------
#define SCREEN_WIDTH 480
#define SCREEN_HEIGHT 320

// ---------------- TOUCH -----------------
#define CS_TOUCH 22
#define IRQ_TOUCH 26
#define TOUCH_MOSI 23
#define TOUCH_MISO 25
#define TOUCH_SCLK 21

#define TS_MINX 90
#define TS_MINY 887
#define TS_MAXX 3458
#define TS_MAXY 3800

// ---------------- SERVOS ----------------
#define SERVO1_PIN 27  // LOCK
#define SERVO2_PIN 14  // AUX
#define SERVO_OPEN_ANGLE 0
#define SERVO_CLOSE_ANGLE 180

Servo servo1;
Servo servo2;

// ---------------- TFT OBJECT ----------------
TFT_eSPI tft = TFT_eSPI();  // Using manual pins
XPT2046_Touchscreen ts(CS_TOUCH, IRQ_TOUCH);

// ---------------- COLORS ----------------
uint16_t COL_BG, COL_BTN, COL_TEXT, COL_FRAME;

// ---------------- STATE -----------------
enum LockState { LOCK_CLOSED,
                 LOCK_OPEN };
LockState lockState = LOCK_CLOSED;

// ---------------- SMOOTH SERVO MOVE -----
void moveServoSmooth(Servo &servo, int fromA, int toA, int delayMs) {
  if (fromA < toA) {
    for (int a = fromA; a <= toA; a++) {
      servo.write(a);
      delay(delayMs);
    }
  } else {
    for (int a = fromA; a >= toA; a--) {
      servo.write(a);
      delay(delayMs);
    }
  }
}

// ---------------- DRAW UI -----------------
void drawMainUI() {
  tft.fillScreen(COL_BG);

  // Title bar
  tft.fillRect(0, 0, SCREEN_WIDTH, 50, COL_BTN);
  tft.setTextColor(COL_TEXT);
  tft.setTextSize(2);
  tft.setCursor(140, 15);
  tft.print("LOCK CONTROL");

  // Placeholder rectangle for future animation
  int animX = 90, animY = 65, animW = 300, animH = 130;
  tft.drawRoundRect(animX, animY, animW, animH, 12, COL_FRAME);
  tft.setTextColor(COL_FRAME);
  tft.setTextSize(2);
  tft.setCursor(animX + 55, animY + animH / 2 - 8);
  tft.print("ANIMATION AREA");

  // OPEN button
  tft.fillRoundRect(60, 220, 140, 60, 10, COL_BTN);
  tft.setCursor(105, 245);
  tft.setTextColor(COL_TEXT);
  tft.print("OPEN");

  // CLOSE button
  tft.fillRoundRect(280, 220, 140, 60, 10, COL_BTN);
  tft.setCursor(310, 245);
  tft.print("CLOSE");

  // Status text
  tft.setTextColor(COL_BTN);
  tft.setTextSize(2);
  tft.setCursor(160, 190);
  if (lockState == LOCK_OPEN) tft.print("Status: OPEN");
  else tft.print("Status: CLOSED");
}

// ---------------- TOUCH MAPPING -----------------
bool getTouch(int &x, int &y) {
  if (!ts.touched()) return false;
  TS_Point p = ts.getPoint();
  if (p.x == 0 && p.y == 0) return false;
  x = map(p.x, TS_MINX, TS_MAXX, 0, SCREEN_WIDTH);
  y = map(p.y, TS_MINY, TS_MAXY, 0, SCREEN_HEIGHT);
  return true;
}

// ---------------- SETUP -----------------
void setup() {
  Serial.begin(115200);

  // TFT SPI pins (manual override)
  SPI.begin(18, -1, 23);  // SCLK=18, MISO=unused, MOSI=23
  tft.init();
  tft.setRotation(1);

  // Colors
  COL_BG = tft.color565(0xF4, 0xEC, 0xD6);
  COL_BTN = tft.color565(0x31, 0x0A, 0x31);
  COL_TEXT = tft.color565(0xFF, 0xFF, 0xFF);
  COL_FRAME = tft.color565(0x88, 0xB7, 0xB5);

  // Servo init
  servo1.setPeriodHertz(50);
  servo2.setPeriodHertz(50);
  servo1.attach(SERVO1_PIN, 500, 2400);
  servo2.attach(SERVO2_PIN, 500, 2400);
  servo1.write(SERVO_CLOSE_ANGLE);
  servo2.write(90);

  // Backlight on (if your TFT has BL pin)
  pinMode(19, OUTPUT);
  digitalWrite(19, HIGH);

  drawMainUI();
}

// ---------------- LOOP -----------------
void loop() {
  int x, y;
  if (getTouch(x, y)) {
    // OPEN button
    if (x >= 60 && x <= 200 && y >= 220 && y <= 280) {
      if (lockState != LOCK_OPEN) {
        moveServoSmooth(servo1, SERVO_CLOSE_ANGLE, SERVO_OPEN_ANGLE, 8);
        moveServoSmooth(servo2, 90, 180, 8);
        lockState = LOCK_OPEN;
        drawMainUI();
      }
    }
    // CLOSE button
    if (x >= 280 && x <= 420 && y >= 220 && y <= 280) {
      if (lockState != LOCK_CLOSED) {
        moveServoSmooth(servo1, SERVO_OPEN_ANGLE, SERVO_CLOSE_ANGLE, 8);
        moveServoSmooth(servo2, 180, 90, 8);
        lockState = LOCK_CLOSED;
        drawMainUI();
      }
    }
    delay(250);  // debounce
  }
}
