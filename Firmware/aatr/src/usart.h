#ifndef USART_H_
#define USART_H_
	
	#define BAUDRATE 9600

	//Function declarations
	void usart_init(void);
	void write_char(char);
	void write_str(const char *);
	void debug_print(const char *, ...) __attribute__ ((format (gnu_printf, 1, 2)));

#endif /* USART_H_ */