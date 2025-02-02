import serial
import time


# Replace 'COMX' with your Arduino's port (Windows: COM3, COM4, etc., Linux/Mac: /dev/ttyUSB0 or /dev/ttyACM0)
def runarduino():
    arduino_port = "COM4"  # Change this to your actual port
    baud_rate = 115200  # Must match the Arduino baud rate

    try:
        # Open serial connection
        ser = serial.Serial(arduino_port, baud_rate, timeout=1)
        time.sleep(2)  # Wait for Arduino to initialize

        # Send the "run" command to Arduino
        print("Sending command to Arduino...")
        ser.write(b"r\n")  # Send 'run' command with newline

        # Read and print Arduino responses
        while True:
            response = ser.readline().decode().strip()
            if response:
                print("Arduino:", response)
            
            if "Cycle complete" in response:
                break  # Stop when the cycle finishes

        ser.close()  # Close serial connection
        print("Process completed.")

    except serial.SerialException as e:
        print(f"Error: {e}")
    return