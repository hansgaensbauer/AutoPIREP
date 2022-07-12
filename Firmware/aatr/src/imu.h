/*
 * imu.h
 *
 * Created: 7/5/2022 9:59:21 PM
 *  Author: hansg
 */ 


#ifndef IMU_H_
#define IMU_H_

	#include "main.h"
	
	#define IMU_NCS PORT_PA09 //Chip select
	#define IMU_INT1 PORT_PA00 //INT1
	#define IMU_INT2 PORT_PA01 //INT2
	#define IMU_WHO_AM_I_Val 0x6C
	#define IMU_FIFO_SIZE 428 //CHECK THIS
	
	//Register definitions
	#define IMU_FUNC_CFG_ACCESS 0x01
	#define IMU_PIN_CTRL 0x02
	#define IMU_FIFO_CTRL1 0x07
	#define IMU_FIFO_CTRL2 0x08
	#define IMU_FIFO_CTRL3 0x09
	#define IMU_FIFO_CTRL4 0x0A
	#define IMU_COUNTER_BDR_REG1 0x0B
	#define IMU_COUNTER_BDR_REG2 0x0C
	#define IMU_INT1_CTRL 0x0D
	#define IMU_INT2_CTRL 0x0E
	#define IMU_WHO_AM_I 0x0F
	#define IMU_CTRL1_XL 0x10
	#define IMU_CTRL2_G 0x11
	#define IMU_CTRL3_C 0x12
	#define IMU_CTRL4_C 0x13
	#define IMU_CTRL5_C 0x14
	#define IMU_CTRL6_C 0x15
	#define IMU_CTRL7_G 0x16
	#define IMU_CTRL8_XL 0x17
	#define IMU_CTRL9_XL 0x18
	#define IMU_CTRL10_C 0x19
	#define IMU_ALL_INT_SRC 0x1A
	#define IMU_WAKE_UP_SRC 0x1B
	#define IMU_TAP_SRC 0x1C
	#define IMU_D6D_SRC 0x1D
	#define IMU_STATUS_REG 0x1E
	#define IMU_OUT_TEMP_L 0x20
	#define IMU_OUT_TEMP_H 0x21
	#define IMU_OUTX_L_G 0x22
	#define IMU_OUTX_H_G 0x23
	#define IMU_OUTY_L_G 0x24
	#define IMU_OUTY_H_G 0x25
	#define IMU_OUTZ_L_G 0x26
	#define IMU_OUTZ_H_G 0x27
	#define IMU_OUTX_L_A 0x28
	#define IMU_OUTX_H_A 0x29
	#define IMU_OUTY_L_A 0x2A
	#define IMU_OUTY_H_A 0x2B
	#define IMU_OUTZ_L_A 0x2C
	#define IMU_OUTZ_H_A 0x2D
	#define IMU_EMB_FUNC_STATUS_MAINPAGE 0x35
	#define IMU_FSM_STATUS_A_MAINPAGE 0x36
	#define IMU_FSM_STATUS_B_MAINPAGE 0x37
	#define IMU_STATUS_MASTER_MAINPAGE 0x39
	#define IMU_FIFO_STATUS1 0x3A
	#define IMU_FIFO_STATUS2 0x3B
	#define IMU_TIMESTAMP0 0x40
	#define IMU_TIMESTAMP1 0x41
	#define IMU_TIMESTAMP2 0x42
	#define IMU_TIMESTAMP3 0x43
	#define IMU_TAP_CFG0 0x56
	#define IMU_TAP_CFG1 0x57
	#define IMU_TAP_CFG2 0x58
	#define IMU_TAP_THS_6D 0x59
	#define IMU_INT_DUR2 0x5A
	#define IMU_WAKE_UP_THS 0x5B
	#define IMU_WAKE_UP_DUR 0x5C
	#define IMU_FREE_FALL 0x5D
	#define IMU_MD1_CFG 0x5E
	#define IMU_MD2_CFG 0x5F
	#define IMU_I3C_BUS_AVB 0x62
	#define IMU_INTERNAL_FREQ_FINE 0x63
	#define IMU_X_OFS_USR 0x73
	#define IMU_Y_OFS_USR 0x74
	#define IMU_Z_OFS_USR 0x75
	#define IMU_FIFO_DATA_OUT_TAG 0x78
	#define IMU_FIFO_DATA_OUT_X_L 0x79
	#define IMU_FIFO_DATA_OUT_X_H 0x7A
	#define IMU_FIFO_DATA_OUT_Y_L 0x7B
	#define IMU_FIFO_DATA_OUT_Y_H 0x7C
	#define IMU_FIFO_DATA_OUT_Z_L 0x7D
	#define IMU_FIFO_DATA_OUT_Z_H 0x7E
	
	#define IMU_SW_RESET 1
	
	typedef struct imu_data{
		int16_t A_x;
		int16_t A_y;
		int16_t A_z;
		int16_t G_x;
		int16_t G_y;
		int16_t G_z;
	} imu_data;
	
	//IMU data rates
	typedef enum imu_datarate{
		IMU_DR_PD,
		IMU_DR_12_5_HZ,
		IMU_DR_26_HZ,
		IMU_DR_52_HZ,
		IMU_DR_104_HZ,
		IMU_DR_208_HZ,
		IMU_DR_416_HZ,
		IMU_DR_833_HZ,
		IMU_DR_1660_HZ,
		IMU_DR_3330_HZ,
		IMU_DR_6660_HZ
	} imu_datarate;
		
	#define IMU_XL_ODR_POS 4
	#define IMU_XL_ODR(val) (val << IMU_XL_ODR_POS)
	
	#define IMU_GYRO_ODR_POS 4
	#define IMU_GYRO_ODR(val) (val << IMU_GYRO_ODR_POS)
	
	#define IMU_XL_BDR_POS 0
	#define IMU_XL_BDR(val) (val << IMU_XL_BDR_POS)
	
	#define IMU_GYRO_BDR_POS 4
	#define IMU_GYRO_BDR(val) (val << IMU_GYRO_BDR_POS)
	
	//IMU FIFO Modes
	typedef enum imu_fifo_mode{
		IMU_FIFO_MODE_BYPASS = 0b000,
		IMU_FIFO_MODE_FIFO = 0b001,
		IMU_FIFO_MODE_CONTINUOUS_TO_FIFO = 0b011,
		IMU_FIFO_MODE_BYPASS_TO_CONTINUOUS = 0b100,
		IMU_FIFO_MODE_CONTINUOUS = 0b110,
		IMY_FIFO_MODE_BYPASS_TO_FIFO = 0b111
	} imu_fifo_mode;
	
	typedef enum fifo_timestamp_batching{
		IMU_FIFO_TS_NOT_BATCHED,
		IMU_FIFO_TS_BATCH_DIV1, 
		IMU_FIFO_TS_BATCH_DIV8,
		IMU_FIFO_TS_BATCH_DIV32
	} fifo_timestamp_batching;
	
	typedef enum fifo_temp_batching{
		IMU_FIFO_TEMP_NOT_BATCHED,
		IMU_FIFO_TEMP_BATCH_1_6Hz,
		IMU_FIFO_TEMP_BATCH_12_5Hz,
		IMU_FIFO_TEMP_BATCH_52Hz
	} fifo_temp_batching;
		
	typedef enum imu_int_ctrl{
		IMU_DEN_DRDY		= 0b10000000,
		IMU_CNT_BDR			= 0b01000000,
		IMU_FIFO_FULL		= 0b00100000,
		IMU_FIFO_OVR		= 0b00010000,
		IMU_FIFO_TH			= 0b00001000,
		IMU_BOOT			= 0b00000100,
		IMU_DRDY_TEMP		= 0b00000100,
		IMU_DRDY_G			= 0b00000010,
		IMU_DRDY_XL			= 0b00000001
	} imu_int_ctrl;
	
	//Accelerometer range
	typedef enum imu_xl_fs {
		IMU_XL_FS_4_G,
		IMU_XL_FS_32_G,
		IMU_XL_FS_8_G,
		IMU_XL_FS_16_G
	} imu_xl_fs;
	
	#define IMU_XL_FS_POS 2
	#define IMU_XL_FS(val) (val << IMU_XL_FS_POS)
	
	//Gyroscope range
	typedef enum imu_gyro_fs {
		IMU_GYRO_FS_125_DPS = 0b001,
		IMU_GYRO_FS_250_DPS = 0b000,
		IMU_GYRO_FS_500_DPS = 0b010,
		IMU_GYRO_FS_1000_DPS = 0b100,
		IMU_GYRO_FS_2000_DPS = 0b110
	} imu_gyro_fs;
	
	#define IMU_GYRO_FS_POS 1
	#define IMU_GYRO_FS(value) (value << IMU_GYRO_FS_POS)
	
	typedef enum imu_hpf_range {
		LSM6DS_HPF_ODR_DIV_50 = 0,
		LSM6DS_HPF_ODR_DIV_100 = 1,
		LSM6DS_HPF_ODR_DIV_9 = 2,
		LSM6DS_HPF_ODR_DIV_400 = 3,
	} _imu_hpf_range;

	//function prototypes
	aatr_state imu_init(void);
	void imu_spi_init(void);
	void imu_spi_write(uint8_t, uint8_t);
	uint8_t imu_spi_read(uint8_t);
	aatr_state imu_readdata(imu_data * );
	void clear_rxc(void);
	void print_imu_data(imu_data);
	aatr_state imu_datalog_init(void);
	aatr_state empty_fifo(imu_data *);

#endif /* IMU_H_ */