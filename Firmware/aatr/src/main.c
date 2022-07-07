
#include <asf.h>
#include <stdbool.h>

#include "sd.h"
#include "main.h"
#include "usart.h"
#include "imu.h"

int main (void)
{
	system_init();
	delay_init();
	usart_init();
	imu_init();

	//irq_initialize_vectors();
	//cpu_irq_enable();
	//sd_mmc_init();

	//sd_log("hello lonely world");
	
	imu_data cdata;
	

	PORT->Group[0].OUTSET.reg = LED_1;
	
	while(true) {
		imu_readdata(&cdata);
		print_imu_data(cdata);
		delay_s(1);
	}
}

// Nonrecoverable software error handler. Flashes red LED. 
void error(){
	while(true){
		PORT->Group[0].OUTTGL.reg = LED_1 | LED_2;
		delay_ms(200);
	}
	
}