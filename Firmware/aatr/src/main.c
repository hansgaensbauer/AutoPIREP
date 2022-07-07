
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
	imu_init();

	irq_initialize_vectors();
	cpu_irq_enable();
	
	sd_mmc_init();
	delay_ms(100);
	do{
		status = sd_mmc_test_unit_ready(0);
	} while (CTRL_GOOD != status);
	
	sd_log("hello lonely world");
	PORT->Group[0].OUTSET.reg = LED_1;
}

// Nonrecoverable software error handler. Flashes red LED. 
void error(){
	while(true){
		PORT->Group[0].OUTTGL.reg = LED_1 | LED_2;
		delay_ms(200);
	}
	
}