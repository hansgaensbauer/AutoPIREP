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
	
	//Check that it's the right chip
	if(imu_spi_read(IMU_WHO_AM_I) != IMU_WHO_AM_I_Val){
		debug_print("IMU Unresponsive.\n\r");
		return AATR_STATE_FAIL;
	}
	
	//Set accelerometer data rate and full scale
	uint8_t ctrl1_value = (
		IMU_XL_DR(IMU_DR_104_HZ) |
		IMU_XL_FS(IMU_XL_FS_4_G)
	);
	imu_spi_write(IMU_CTRL1_XL, ctrl1_value);
	
	//Set gyroscope data rate and full scale
	uint8_t ctrl2_value = (
		IMU_GYRO_DR(IMU_DR_104_HZ) |
		IMU_GYRO_FS(IMU_GYRO_FS_2000_DPS)
	);
	imu_spi_write(IMU_CTRL2_G, ctrl2_value);

	return AATR_STATE_PASS;
}

aatr_state imu_readdata(imu_data * databuf){
	debug_print("Reading IMU Data:\n\r");
	debug_print("Temp: 0x%02x", imu_spi_read(IMU_OUT_TEMP_L));
	
	uint8_t rx_buf[14];
	
	while(!SERCOM2->SPI.INTFLAG.bit.DRE);	//Wait for data ready
	PORT->Group[0].OUTCLR.reg = IMU_NCS; // Drive NCS low
	delay_us(8);
	
	SERCOM2->SPI.DATA.reg = IMU_OUT_TEMP_L | 0x80; //Start with temp
	while(!SERCOM2->SPI.INTFLAG.bit.DRE);	//Wait for data ready
	rx_buf[0] = SERCOM2->SPI.DATA.reg; //Clear by reading
	SERCOM2->SPI.DATA.reg = 0x00; //Start sending zeroes
	
	while(!SERCOM2->SPI.INTFLAG.bit.RXC);	//Wait for received data
	rx_buf[0] = SERCOM2->SPI.DATA.reg;
	rx_buf[0] = SERCOM2->SPI.DATA.reg;
	
	for(int i = 1; i < 14; i++){
		
		SERCOM2->SPI.DATA.reg = 0x00;
		while(!SERCOM2->SPI.INTFLAG.bit.RXC);	//Wait for received data
		rx_buf[i] = SERCOM2->SPI.DATA.reg;
		rx_buf[i] = SERCOM2->SPI.DATA.reg;
		while(!SERCOM2->SPI.INTFLAG.bit.DRE);	//Wait for data ready

	}
	while(!SERCOM2->SPI.INTFLAG.bit.TXC); //wait for transaction to finish
	delay_us(8);
	PORT->Group[0].OUTSET.reg = IMU_NCS; // Drive NCS high
	
	print_arr(rx_buf, 14);
	
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
	
	PORT->Group[0].DIRSET.reg = PORT_PA10 | PORT_PA09 | PORT_PA11; //DO, NCS & SCK
	PORT->Group[0].DIRCLR.reg = PORT_PA08;
	PORT->Group[0].OUTSET.reg = IMU_NCS; // Drive NCS high
	
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
	while(!SERCOM2->SPI.INTFLAG.bit.DRE);	//Wait for data ready
	PORT->Group[0].OUTCLR.reg = IMU_NCS; // Drive NCS low
	delay_us(8);
	SERCOM2->SPI.DATA.reg = address;
	while(!SERCOM2->SPI.INTFLAG.bit.DRE);	//Wait for data ready
	SERCOM2->SPI.DATA.reg = data;
	while(!SERCOM2->SPI.INTFLAG.bit.DRE);	//Wait for data ready
	delay_us(8);
	PORT->Group[0].OUTSET.reg = IMU_NCS; // Drive NCS high
}

uint8_t imu_spi_read(uint8_t address){
	/*
	clear_rxc();
	clear_rxc();
	while(!SERCOM2->SPI.INTFLAG.bit.DRE);//Wait for data ready
	PORT->Group[0].OUTCLR.reg = IMU_NCS; // Drive NCS low
	delay_us(8);
	
	SERCOM2->SPI.DATA.reg = address | 0x80;
	while(!SERCOM2->SPI.INTFLAG.bit.DRE);	//Wait for data ready
	clear_rxc();
	SERCOM2->SPI.DATA.reg = 0x00;
	while(!SERCOM2->SPI.INTFLAG.bit.RXC);	//Wait for received data from first byte
	clear_rxc();
	while(!SERCOM2->SPI.INTFLAG.bit.RXC | !SERCOM2->SPI.INTFLAG.bit.TXC);	//Wait for received data from second byte
	clear_rxc();
	delay_us(8);
	PORT->Group[0].OUTSET.reg = IMU_NCS; // Drive NCS high
	
	return SERCOM2->SPI.DATA.reg;
	*/
	PORT->Group[0].OUTCLR.reg = IMU_NCS; // Drive NCS low
	delay_us(8);
	SERCOM2->SPI.DATA.reg = address | 0x80;
	while(!SERCOM2->SPI.INTFLAG.bit.RXC);
	clear_rxc();
	SERCOM2->SPI.DATA.reg = 0x00;
	while(!SERCOM2->SPI.INTFLAG.bit.RXC);
	return SERCOM2->SPI.DATA.reg;
	delay_us(8);
	PORT->Group[0].OUTSET.reg = IMU_NCS; // Drive NCS high
	
}

void clear_rxc(void){
  asm volatile ("" : : "r" (*(unsigned int *)0x42001028)); //Force a read of the DATA register
}