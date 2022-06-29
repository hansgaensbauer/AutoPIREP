
#include <asf.h>
#include <stdbool.h>

#include "sd.h"
#include "main.h"

int main (void)
{
	system_init();
	delay_init();

	sd_log("hello lonely world");
}

// Nonrecoverable software error handler. Flashes red LED. 
void error(){
	while(true){
		PORT->Group[0].OUTTGL.reg = LED_RED | LED_GREEN;
		delay_ms(200);
	}
	
}