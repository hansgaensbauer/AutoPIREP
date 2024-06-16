import time
import board
import adafruit_fxos8700
import adafruit_fxas21002c
from os.path import exists

#Timing
sample_period = 0.0125 #80Hz
last_sample_time = time.time()

i2c = board.I2C()  # uses board.SCL and board.SDA
fxo = adafruit_fxos8700.FXOS8700(i2c, accel_range=adafruit_fxos8700.ACCEL_RANGE_8G)
fxa = adafruit_fxas21002c.FXAS21002C(i2c)

#Set up the .csv file
#Find the first available filename
file_idx = 0
while(exists("data/datafile_" + str(file_idx) + ".csv")):
        file_idx += 1;

filename = "data/datafile_" + str(file_idx) + ".csv"

with open(filename, "w") as df:
    df.write("Time, A_x, A_y, A_z, M_x, M_y, M_z, G_x, G_y, G_z\n")

while True:
    # Read acceleration & magnetometer.
    accel_x, accel_y, accel_z = fxo.accelerometer
    mag_x, mag_y, mag_z = fxo.magnetometer
    gyr_x, gyr_y, gyr_z = fxa.gyroscope

    # Save them to a file
    with open(filename, 'a') as df:
        df.write(
        "{0:0.7f},"
        "{1:0.3f}, {2:0.3f}, {3:0.3f}, "
        "{4:0.3f}, {5:0.3f}, {6:0.3f},"
        "{7:0.3f}, {8:0.3f}, {9:0.3f}\n"
        .format(
            time.time(),
            accel_x, accel_y, accel_z,
            mag_x, mag_y, mag_z,
            gyr_x, gyr_y, gyr_z
        )
        )

    #Hold for correct sample rate
    while(time.time() - last_sample_time < sample_period):
        pass
    last_sample_time = time.time()
