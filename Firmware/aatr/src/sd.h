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
	#define MAX_PRINT_LEN 128
	
	//Funtion prototypes
	void sd_log(const char *, ...) __attribute__ ((format (gnu_printf, 1, 2)));



#endif /* SD_H_ */