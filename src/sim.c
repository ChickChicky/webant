#include "webant.h"

uint8_t board[GAME_HEIGHT*GAME_WIDTH] = { 0 };

uint32_t image[RENDER_WIDTH*RENDER_HEIGHT] = { 0 };

int32_t ant_x;
int32_t ant_y;

uint8_t ant_d;

uint32_t speed = 1;

void tick(void) {
    for (size_t i = 0; i < speed; i++) {
        int32_t nx = ant_x;
        int32_t ny = ant_y;

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

        if (nx < 0)
            nx = GAME_WIDTH-1;
        if (nx >= GAME_WIDTH)
            nx = 0;
        if (ny < 0)
            ny = GAME_HEIGHT-1;
        if (ny >= GAME_HEIGHT)
            ny = 0;

        ant_x = MOD(nx,GAME_WIDTH);
        ant_y = MOD(ny,GAME_HEIGHT);

        *cell = !(*cell);
    }
}

void render(int32_t view_x, int32_t view_y) {
    for (int32_t rx = 0; rx < (signed)RENDER_WIDTH; rx++) {
        for (int32_t ry = 0; ry < (signed)RENDER_HEIGHT; ry++) {
            int32_t x = -RENDER_WIDTH/2 +GAME_WIDTH/2 + view_x + rx;
            int32_t y = -RENDER_HEIGHT/2 +GAME_HEIGHT/2 + view_y +  ry;
            uint32_t c;
            if (x < 0 || y < 0 || x >= (signed)GAME_WIDTH || y >= (signed)GAME_HEIGHT)
                c = 0xFFFF00FF;
            else
                c = ( x == (signed)ant_x && y == (signed)ant_y ) ? 0xFF0000FF : ( board[GAME_COORD(x,y)] ? 0xFFFFFFFF : 0xFF000000 );
            image[RENDER_COORD(rx,ry)] = c;
        }
    }
    set_render_data(image,RENDER_WIDTH,RENDER_HEIGHT);
}

void init(void) {
    ant_x = GAME_WIDTH / 2;
    ant_y = GAME_HEIGHT / 2;
    ant_d = 0;
}
