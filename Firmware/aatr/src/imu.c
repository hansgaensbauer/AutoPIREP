/*
 * imu.c
 *
 * Created: 7/5/2022 9:59:08 PM
 *  Author: hansg
 */ 

#include <stdio.h>
#include <stdarg.h>
#include <asf.h>

#include "imu.h"
#include "samd21.h"
#include "main.h"
#include "usart.h"

void imu_init(){
	debug_print("Initializing IMU\n\r");
	
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
	PORT->Group[0].DIRSET.reg = PORT_PA10 | PORT_PA09 | PORT_PA11; //DO, NCS & SCK
	PORT->Group[0].DIRCLR.reg = PORT_PA08;
	
	PORT->Group[0].PINCFG[8].reg |= PORT_PINCFG_PMUXEN; //Enable PMUX
	PORT->Group[0].PINCFG[9].reg |= PORT_PINCFG_PMUXEN; //Enable PMUX
	PORT->Group[0].PINCFG[10].reg |= PORT_PINCFG_PMUXEN; //Enable PMUX
	PORT->Group[0].PINCFG[11].reg |= PORT_PINCFG_PMUXEN; //Enable PMUX
	
	PORT->Group[0].PMUX[8>>1].bit.PMUXE = PORT_PMUX_PMUXE_D_Val; //Peripheral function D
	PORT->Group[0].PMUX[9>>1].bit.PMUXO = PORT_PMUX_PMUXO_D_Val; //Peripheral function D
	PORT->Group[0].PMUX[10>>1].bit.PMUXE = PORT_PMUX_PMUXE_D_Val; //Peripheral function D
	PORT->Group[0].PMUX[11>>1].bit.PMUXO = PORT_PMUX_PMUXO_D_Val; //Peripheral function D
	
	//Set operating mode
	//Set PAD[0] = DI
	//Set PAD[1] = NCS
	//Set PAD[2] = DO
	//Set PAD[3] = SCK
	SERCOM2->SPI.CTRLA.reg = (
		SERCOM_SPI_CTRLA_MODE_SPI_MASTER |
		SERCOM_SPI_CTRLA_DOPO(0x1)
	);
	
	//Configure hardware chip select
	SERCOM2->SPI.CTRLB.reg = (
		SERCOM_SPI_CTRLB_MSSEN | 
		SERCOM_SPI_CTRLB_RXEN
		
	);
	
	uint64_t baudRate = (uint64_t)65536 * (F_CPU - 16 * BAUDRATE) / F_CPU;
	SERCOM2->SPI.BAUD.reg = (uint32_t)baudRate; //write baud register
	
	//Enable the SPI
	SERCOM2->SPI.CTRLA.reg |= SERCOM_SPI_CTRLA_ENABLE;
}

void imu_spi_write(uint8_t address, uint8_t data){
	while(!SERCOM2->SPI.INTFLAG.bit.DRE);	//Wait for data ready
	SERCOM2->SPI.DATA.reg = address;
	while(!SERCOM2->SPI.INTFLAG.bit.DRE);	//Wait for data ready
	SERCOM2->SPI.DATA.reg = data;
}