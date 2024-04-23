#ifndef WEBANT_H
#define WEBANT_H

typedef unsigned char uint8_t;
typedef unsigned short int uint16_t;
typedef unsigned int uint32_t;

typedef char int8_t;
typedef short int int16_t;
typedef int int32_t;

typedef unsigned int size_t;

#define false 0
#define true 1

#define null 0
#define nullptr (void*)0

#define GAME_WIDTH 1000
#define GAME_HEIGHT 10000

#define RENDER_WIDTH 200
#define RENDER_HEIGHT 200

#define GAME_COORD( x, y ) ((x)+(y)*GAME_WIDTH)
#define RENDER_COORD( x, y ) ((x)+(y)*RENDER_WIDTH)

extern void set_render_data(void* image, uint32_t width, uint32_t height);

#endif