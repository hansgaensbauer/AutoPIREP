
#include <asf.h>
#include <stdbool.h>

#include "sd.h"
#include "main.h"
#include "usart.h"
#include "imu.h"

const char header1[] = "\n*******************************************************\nAATR Datalogger Configuration\nHardware Version 0\nDevice Serial #: ";
const char header2[] = "Data Start Point: ";

int main (void)
{
	Ctrl_status status;
	system_init();
	delay_init();
	usart_init();

	/* Datalogger Functionality */
	
	// SD Card Initialization
	irq_initialize_vectors();
	cpu_irq_enable();
	
	PORT->Group[0].OUTSET.reg = LED_2;
		
	sd_mmc_init();
	delay_ms(100);
	do{
		status = sd_mmc_test_unit_ready(0);
	} while (CTRL_GOOD != status);
		
	////////////////////// Print Header to SD Card //////////////////////////
	sd_log(header1);
	
	uint32_t val1, val2, val3, val4;
	volatile uint32_t *ptr1 = (volatile uint32_t *)0x0080A00C;
	val1 = *ptr1;
	volatile uint32_t *ptr = (volatile uint32_t *)0x0080A040;
	val2 = *ptr;
	ptr++;
	val3 = *ptr;
	ptr++;
	val4 = *ptr;
	
	sd_log("0x%02x%02x%02x%02x\n", 
		(unsigned int) val1,
		(unsigned int) val2,
		(unsigned int) val3,
		(unsigned int) val4
	);
		
	sd_log(header2);
	sd_log("%d", sd_find_data_endpoint());
	
	/////////////////////////////////////////////////////////////////////////
	
	//Massive buffer to hold all the IMU data until it is saved
	uint8_t dataframe[(IMU_TARGET_READ_SIZE + IMU_READ_SIZE_BUFFER) * IMU_FIFO_BYTES_PER_FRAME + 1];
	uint16_t framesize;
	
	imu_datalog_init();
	
	//Break data captures with a bunch of zeros
	uint8_t zarr[14] = {0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0};
	sd_write_bytes(zarr, 14);
	
	/*
	// Data read unit test 
	while(!(PORT->Group[0].IN.reg & IMU_INT1)); //Wait on IMU_INT1
	framesize = empty_fifo(dataframe);
	dump_imu_data(&dataframe[1], framesize);
	sd_write_bytes(&dataframe[1], framesize * IMU_FIFO_BYTES_PER_FRAME);
	*/
	
	PORT->Group[0].OUTCLR.reg = LED_2;
	
	//Datalogger main loop
	while(true){
		for(int i = 0; i < 20; i++){
			while(!(PORT->Group[0].IN.reg & IMU_INT1)); //Wait on IMU_INT1
			framesize = empty_fifo(dataframe);
			sd_write_bytes(&dataframe[1], framesize * IMU_FIFO_BYTES_PER_FRAME);
		}
		PORT->Group[0].OUTTGL.reg = LED_1;
	}
	
}

// Nonrecoverable software error handler. Flashes red LED. 
void error(){
	while(true){
		PORT->Group[0].OUTTGL.reg = LED_1 | LED_2;
		delay_ms(200);
	}
	
}