/*
 * sd.h
 *
 * Created: 6/29/2022 10:20:47 AM
 *  Author: hansg
 */ 


#ifndef SD_H_
#define SD_H_

	#include "string.h"
	#include <stdint.h>
	
	#define MAX_DRIVE _VOLUMES
	#define LOG_FILENAME "log.txt"
	#define DATA_FILENAME "data.ned"
	
	//Function prototypes
	void sd_log(const char *, ...) __attribute__ ((format (gnu_printf, 1, 2)));
	void sd_write_bytes(uint8_t *, uint16_t);



#endif /* SD_H_ */