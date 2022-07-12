/*
 * imu.c
 *
 * Created: 7/5/2022 9:59:08 PM
 *  Author: hansg
 */ 
#include <asf.h>

#include "imu.h"
#include "samd21.h"
#include "main.h"
#include "usart.h"

aatr_state imu_init(){
	debug_print("Initializing IMU\n\r");
	imu_spi_init();
	
	PORT->Group[0].DIRCLR.reg = IMU_INT1 | IMU_INT2; //interrupts high Z
	
	//Check that it's the right chip
	if(imu_spi_read(IMU_WHO_AM_I) != IMU_WHO_AM_I_Val){
		debug_print("IMU Unresponsive.\n\r");
		return AATR_STATE_FAIL;
	}
	
	imu_spi_write(IMU_CTRL3_C, IMU_SW_RESET);
	
	//Set accelerometer data rate and full scale
	uint8_t ctrl1_value = (
		IMU_XL_ODR(IMU_DR_6660_HZ) |
		IMU_XL_FS(IMU_XL_FS_4_G)
	);
	imu_spi_write(IMU_CTRL1_XL, ctrl1_value);
	
	//Set gyroscope data rate and full scale
	uint8_t ctrl2_value = (
		IMU_GYRO_ODR(IMU_DR_6660_HZ) |
		IMU_GYRO_FS(IMU_GYRO_FS_2000_DPS)
	);
	imu_spi_write(IMU_CTRL2_G, ctrl2_value);

	return AATR_STATE_PASS;
}

aatr_state imu_datalog_init(){
	
	imu_init(); //Initialize the IMU first
	
	//Configure the FIFO for continuous mode
	//Write WTM[8:0]
	//imu_spi_write(IMU_FIFO_CTRL1, IMU_FIFO_HALF_FULL & 0xFF);
	//imu_spi_write(IMU_FIFO_CTRL2, IMU_FIFO_HALF_FULL >> 8);
	
	imu_spi_write(IMU_FIFO_CTRL4, IMU_FIFO_MODE_CONTINUOUS); //Set FIFO to continuous  mode
	imu_spi_write(IMU_INT1_CTRL, IMU_FIFO_FULL); //Configure interrupt 1 pin
	
	//Write gyro and xl to fifo at this rate
	imu_spi_write(IMU_FIFO_CTRL3, IMU_XL_BDR(IMU_DR_6660_HZ) | IMU_GYRO_BDR(IMU_DR_6660_HZ));
	
	//imu_spi_write(IMU_CTRL3_C, IMU_SW_RESET); //Software reset
	
	return AATR_STATE_PASS;
}

aatr_state imu_readdata(imu_data * databuf){
	uint8_t rx_buf[14];
	
	PORT->Group[0].OUTCLR.reg = IMU_NCS; // Drive NCS low
	delay_us(8);
	
	SERCOM2->SPI.DATA.reg = IMU_OUT_TEMP_L | 0x80;
	while(!SERCOM2->SPI.INTFLAG.bit.RXC);
	clear_rxc();
	for(int i = 0; i < 14; i++){
		SERCOM2->SPI.DATA.reg = 0x00;
		while(!SERCOM2->SPI.INTFLAG.bit.RXC);
		rx_buf[i] = SERCOM2->SPI.DATA.reg;
	}
	delay_us(8);
	PORT->Group[0].OUTSET.reg = IMU_NCS; // Drive NCS high
	
	//print_arr(rx_buf, 14); //DEBUG
	
	//Populate the databuf struct
	databuf->temp = rx_buf[0] | (rx_buf[1] << 8);
	databuf->G_x = rx_buf[2] | (rx_buf[3] << 8);
	databuf->G_y = rx_buf[4] | (rx_buf[5] << 8);
	databuf->G_z = rx_buf[6] | (rx_buf[7] << 8);
	databuf->A_x = rx_buf[8] | (rx_buf[9] << 8);
	databuf->A_y = rx_buf[10] | (rx_buf[11] << 8);
	databuf->A_z = rx_buf[12] | (rx_buf[13] << 8);
	
	return AATR_STATE_PASS;
}

void imu_spi_init(){

	//Enable Advanced Peripheral Bus Clock for SERCOM1
	REG_PM_APBCMASK |= PM_APBCMASK_SERCOM2;
	
	//Set up Generic Clock Generator 0 for SPI
	GCLK->CLKCTRL.reg = (
	GCLK_CLKCTRL_ID(SERCOM2_GCLK_ID_CORE) |
	GCLK_CLKCTRL_CLKEN |
	GCLK_CLKCTRL_GEN(0)
	);
	
	SERCOM2->USART.CTRLA.reg = ~SERCOM_SPI_CTRLA_ENABLE; //disable the SPI
	
	//Set up IO pins
	PORT->Group[0].PINCFG[8].reg |= PORT_PINCFG_PMUXEN; //Enable PMUX
	PORT->Group[0].PINCFG[10].reg |= PORT_PINCFG_PMUXEN; //Enable PMUX
	PORT->Group[0].PINCFG[11].reg |= PORT_PINCFG_PMUXEN; //Enable PMUX
	
	PORT->Group[0].PMUX[8>>1].bit.PMUXE = PORT_PMUX_PMUXE_D_Val; //Peripheral function D
	PORT->Group[0].PMUX[10>>1].bit.PMUXE = PORT_PMUX_PMUXE_D_Val; //Peripheral function D
	PORT->Group[0].PMUX[11>>1].bit.PMUXO = PORT_PMUX_PMUXO_D_Val; //Peripheral function D
	
	PORT->Group[0].OUTSET.reg = IMU_NCS; // Drive NCS high
	PORT->Group[0].DIRSET.reg = PORT_PA10 | PORT_PA09 | PORT_PA11; //DO, NCS & SCK
	PORT->Group[0].DIRCLR.reg = PORT_PA08;
	
	//Set operating mode
	//Set PAD[0] = DI
	//Set PAD[1] = NCS
	//Set PAD[2] = DO
	//Set PAD[3] = SCK
	SERCOM2->SPI.CTRLA.reg = (
		SERCOM_SPI_CTRLA_MODE_SPI_MASTER |
		SERCOM_SPI_CTRLA_DOPO(0x1)
	);
	
	//Receive enable
	SERCOM2->SPI.CTRLB.reg = SERCOM_SPI_CTRLB_RXEN;
	
	uint64_t baudRate = (uint64_t)65536 * (F_CPU - 16 * BAUDRATE) / F_CPU;
	SERCOM2->SPI.BAUD.reg = (uint32_t)baudRate; //write baud register
	
	//Enable the SPI
	SERCOM2->SPI.CTRLA.reg |= SERCOM_SPI_CTRLA_ENABLE;
}

void imu_spi_write(uint8_t address, uint8_t data){
	PORT->Group[0].OUTCLR.reg = IMU_NCS; // Drive NCS low
	delay_us(8);
	SERCOM2->SPI.DATA.reg = address;
	while(!SERCOM2->SPI.INTFLAG.bit.RXC);
	clear_rxc();
	SERCOM2->SPI.DATA.reg = data;
	while(!SERCOM2->SPI.INTFLAG.bit.RXC);
	clear_rxc();
	delay_us(8);
	PORT->Group[0].OUTSET.reg = IMU_NCS; // Drive NCS high
}

uint8_t imu_spi_read(uint8_t address){
	PORT->Group[0].OUTCLR.reg = IMU_NCS; // Drive NCS low
	delay_us(8);
	SERCOM2->SPI.DATA.reg = address | 0x80;
	while(!SERCOM2->SPI.INTFLAG.bit.RXC);
	clear_rxc();
	SERCOM2->SPI.DATA.reg = 0x00;
	while(!SERCOM2->SPI.INTFLAG.bit.RXC);
	delay_us(8);
	PORT->Group[0].OUTSET.reg = IMU_NCS; // Drive NCS high
	return SERCOM2->SPI.DATA.reg;
}

/* helper function for imu_spi_read */
void clear_rxc(void){
  asm volatile ("" : : "r" (*(unsigned int *)0x42001028)); //Force a read of the DATA register
}

/* Pretty prints IMU data */
void print_imu_data(imu_data databuf){
	debug_print("IMU Data:\n\r");
	debug_print("\tTemp: %d\n\r", databuf.temp);
	debug_print("\tAx: %5d\tAy: %5d\tAz: %5d\n\r", databuf.A_x, databuf.A_y, databuf.A_z);
	debug_print("\tGx: %5d\tGy: %5d\tGz: %5d\n\n\r", databuf.G_x, databuf.G_y, databuf.G_z);
}