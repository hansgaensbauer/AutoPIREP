
#include <asf.h>
#include <stdbool.h>

#include "sd.h"
#include "main.h"
#include "usart.h"
#include "imu.h"

int main (void)
{
	Ctrl_status status;
	system_init();
	delay_init();
	usart_init();

	/* SD Card Initialization */
	irq_initialize_vectors();
	cpu_irq_enable();
	
	sd_mmc_init();
	delay_ms(100);
	do{
		status = sd_mmc_test_unit_ready(0);
	} while (CTRL_GOOD != status);
	
	sd_log("hello lonely world");
	
	/* Datalogger Functionality */
	
	//Massive buffer to hold all the IMU data until it is saved
	uint8_t dataframe[(IMU_TARGET_READ_SIZE + IMU_READ_SIZE_BUFFER) * IMU_FIFO_BYTES_PER_FRAME + 1];
	uint16_t framesize;
	
	imu_datalog_init();
	
	/* Data read unit test */
	while(!(PORT->Group[0].IN.reg & IMU_INT1)); //Wait on IMU_INT1
	framesize = empty_fifo(dataframe);
	dump_imu_data(&dataframe[1], framesize);
	
	/*
	while(true){
		while(!(PORT->Group[0].IN.reg & IMU_INT1)); //Wait on IMU_INT1
		framesize = empty_fifo(dataframe);
			
		sd_write_bytes(&dataframe[1], framesize);
	}
	
	*/
}

// Nonrecoverable software error handler. Flashes red LED. 
void error(){
	while(true){
		PORT->Group[0].OUTTGL.reg = LED_1 | LED_2;
		delay_ms(200);
	}
	
}