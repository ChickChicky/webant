#include "webant.h"

uint8_t board[GAME_HEIGHT*GAME_WIDTH] = { 0 };

uint32_t image[RENDER_WIDTH*RENDER_HEIGHT] = { 0 };

uint32_t ant_x;
uint32_t ant_y;

uint8_t ant_d;

void tick(int32_t view_x, int32_t view_y) {
    uint32_t nx = ant_x;
    uint32_t ny = ant_y;

    uint8_t* cell = &board[GAME_COORD(ant_x,ant_y)];

    if (*cell)
        ant_d = (ant_d + 1) % 4;
    else
        ant_d = (ant_d - 1) % 4;

    if (ant_d == 0)
        nx++;
    else if (ant_d == 1)
        ny++;
    else if (ant_d == 2)
        nx--;
    else
        ny--;

    if (nx > 0 && nx < GAME_WIDTH && ny > 0 && ny < GAME_HEIGHT) {
        ant_x = nx;
        ant_y = ny;
    }

    *cell = !(*cell);

    for (int32_t rx = 0; rx < (signed)RENDER_WIDTH; rx++) {
        for (int32_t ry = 0; ry < (signed)RENDER_HEIGHT; ry++) {
            int32_t x = RENDER_WIDTH/2 + view_x + rx;
            int32_t y = RENDER_HEIGHT/2 + view_y + ry;
            uint32_t c;
            if (x < 0 || y < 0 || x > (signed)GAME_WIDTH || y > (signed)GAME_HEIGHT)
                c = 0xFFFF00FF;
            else
                c = board[GAME_COORD(x,y)] ? 0xFFFFFFFF : 0xFF000000;
            image[RENDER_COORD(rx,ry)] = c;
        }
    }
}

void init(void) {
    ant_x = GAME_WIDTH / 2;
    ant_y = GAME_HEIGHT / 2;
    ant_d = 0;
    set_render_data(image,RENDER_WIDTH,RENDER_HEIGHT);
}
