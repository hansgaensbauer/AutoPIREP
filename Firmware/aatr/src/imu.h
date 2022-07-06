/*
 * imu.h
 *
 * Created: 7/5/2022 9:59:21 PM
 *  Author: hansg
 */ 


#ifndef IMU_H_
#define IMU_H_

		
	#define IMU_NCS PORT_PA09

	//function prototypes
	void imu_init(void);
	void imu_spi_init(void);
	void imu_spi_write(uint8_t, uint8_t);
	uint32_t imu_spi_read(uint8_t);




#endif /* IMU_H_ */