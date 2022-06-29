//#include "usart.h"
#include "sd.h"
#include <asf.h>
#include <stdint.h>
#include <stdio.h>
#include <stdarg.h>

const char log_file[] = {LOG_FILENAME};
/* FATFS variables */
static FATFS fs;
static FIL file_object;


/*
* Saves a datapoint to the file.
*/
void sd_log(const char *fmt, ...){
	volatile uint8_t lun = LUN_ID_USB;
	memset(&fs, 0, sizeof(FATFS));
	
	FRESULT res = f_mount(lun, &fs); // Mount drive
	if (FR_INVALID_DRIVE == res) {
		//debug_print("Mount Failed!\n\r");
		return;
	}
	res = f_open(&file_object, log_file, FA_WRITE);
	f_lseek(&file_object, file_object.fsize);  //Move to the end of the file
	if (res == FR_NOT_READY) { // LUN not ready
		//debug_print("File open failed!\n\r");
		f_close(&file_object);
		return;
	}
	if (res != FR_OK) { // LUN test error
		f_close(&file_object);
		//debug_print("LUN Test Error!\n\r");
		return;
	}
	
	// Print the data to the file
	va_list argptr;
	char buff[MAX_PRINT_LEN];
	va_start(argptr, fmt);
	int numchars = vsprintf(buff, fmt, argptr);
	va_end(argptr);
	
	f_write(&file_object, buff, numchars, NULL);
	f_close(&file_object);
	f_mount(lun, NULL); //unmount the device
}