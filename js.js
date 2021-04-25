"use strict";

let p = document.querySelector(".ohki");
p.innerText = "0";


let RECT_WIDTH = 60;
let RECT_HEIGHT = 60;

let canvas = document.querySelector("canvas");
let ctx = canvas.getContext("2d");

let dx = RECT_WIDTH;
let dy = 0;
let dangle = 90;
let promises = [];

let count = 0;

let speed = 30;
let deg;
let x = 450;
let y = 270;
let checkFood = false;
let doneMove = false;
let drawX = 0;
let drawY = 10;
let time = 150;
let interval;
let foodX = 330;
let foodY = 450;
let doStep = false;
let score = 0;
let game_ON = true;
let pic_food = new Image();


//еда-объект
let food = {
    img: new Image(),
    x: 60,
    y: 60,
    //инициализация переменных объекта
    init: function() {
        this.img.src = "food.svg";
    },
    //рисование картинки еды
    draw: function() {
        ctx.drawImage(this.img, this.x, this.y, RECT_WIDTH, RECT_HEIGHT);
    },
    //рондомайзер
    randomazer: function() {
        let randomY = Math.floor(Math.random() * (10));
        let randomX = Math.floor(Math.random() * (15));
        this.y = randomY * 60;
        this.x = randomX * 60;

    },
    //стирание картинки
    clear: function() {
        ctx.clearRect(this.x, this.y, RECT_WIDTH, RECT_HEIGHT);
    }
}

//объект змейка
let snake_new = {
    tail: new Image(),
    body: new Image(),
    body_p_right: new Image(),
    body_p_left: new Image(),
    head: new Image(),
    round: new Image(),
    size: 3,
    x: [],
    y: [],
    angle: [],
    //инициализация переменных объекта
    init: function() {
        this.head.src = "head.svg";
        this.body.src = "body.svg";
        this.tail.src = "tail.svg";
        this.body_p_right.src = "body_p_right.svg";
        this.body_p_left.src = "body_p_left.svg";
        this.round.src = "round.svg";
        for (let i = 0; i < this.size; i++) {
            this.x.push(420 - i * RECT_WIDTH);
            this.y.push(240);
            this.angle.push(90);
        }
    },
    //рисование картинки в которой заключается часть змейка
    draw: function(x, y, img, angle) {
        let dir = (angle - 90) * Math.PI / 180;
        ctx.save();
        ctx.translate(x, y);
        ctx.translate(RECT_WIDTH / 2, RECT_HEIGHT / 2);
        ctx.rotate(dir);
        ctx.drawImage(img, -RECT_WIDTH / 2, -RECT_HEIGHT / 2, RECT_WIDTH, RECT_HEIGHT);
        ctx.restore();

    },
    //стирание картинки
    clear: function(x, y) {
        ctx.clearRect(x, y, RECT_WIDTH, RECT_HEIGHT);
    },
    //для получения новых координат головы
    new_cord: function(dx, dy, da) {
        for (let i = this.size - 1; i > 0; i--) {
            this.x[i] = this.x[i - 1];
            this.y[i] = this.y[i - 1];
            this.angle[i] = this.angle[i - 1];

        }
        this.x[0] += dx;
        this.y[0] += dy;
        this.angle[0] = da;

    }
};

snake_new.init();
food.init();
//создаём элемент в который помещаем кратинки и ждём их загрузки-промис
for (let key in snake_new) {
    if (snake_new[key] instanceof Image) {
        promises.push(new Promise(resolve => {
            snake_new[key].onload = function() {
                resolve();
            }
        }));
    }
}

promises.push(new Promise(resolve => {
    food.img.onload = function() {
        resolve();
    }
}));

//
Promise.all(promises)
    //после того как картинки загрузились рисуем змейку и еду на начальных позицияx
    .then(function() {
        snake_new.draw(snake_new.x[0], snake_new.y[0], snake_new.head, snake_new.angle[0]);
        for (let i = 1; i < snake_new.size - 1; i++) {
            snake_new.draw(snake_new.x[i], snake_new.y[i], snake_new.body, snake_new.angle[i]);
        }
        snake_new.draw(snake_new.x[snake_new.size - 1], snake_new.y[snake_new.size - 1], snake_new.tail, snake_new.angle[snake_new.size - 1]);
        do {
            checkFood = false;
            food.randomazer();
            for (let i = 0; i < snake_new.size; i++) {
                if ((food.x == snake_new.x[i]) && (food.y == snake_new.y[i])) {
                    checkFood = true;
                }
            }
        } while (checkFood);

        food.draw();
    })
    .then(function draw() {
        //задержка в рисовании
        let frame = requestAnimationFrame(draw);
        if (++count < speed) {
            return
        }

        count = 0;
        //стирание змейки
        snake_new.clear(snake_new.x[0], snake_new.y[0]);
        snake_new.clear(snake_new.x[snake_new.size - 1], snake_new.y[snake_new.size - 1]);
        snake_new.clear(snake_new.x[snake_new.size - 2], snake_new.y[snake_new.size - 2]);
        snake_new.new_cord(dx, dy, dangle);
        //перерисовка еды, после сЪедания
        if ((snake_new.x[0] == food.x) && (snake_new.y[0] == food.y)) {
            snake_new.size++;
            p.innerText = snake_new.size - 3;
            if (snake_new.size % 5 == 0) {
                speed = speed - 1;
            }

            food.clear();

            do {
                checkFood = false;
                food.randomazer();
                for (let i = 0; i < snake_new.size; i++) {
                    if ((food.x == snake_new.x[i]) && (food.y == snake_new.y[i])) {
                        checkFood = true;

                    }
                }
            } while (checkFood);

            food.draw();
            //увеличение змейки(добаление нового элементика)
            snake_new.x.push(snake_new.x[snake_new.size - 2]);
            snake_new.y.push(snake_new.y[snake_new.size - 2]);
            snake_new.angle.push(snake_new.angle[snake_new.size - 2]);
        }
        //движение змейки
        snake_new.draw(snake_new.x[0], snake_new.y[0], snake_new.head, snake_new.angle[0]);
        if (snake_new.angle[1] == snake_new.angle[0]) {
            snake_new.draw(snake_new.x[1], snake_new.y[1], snake_new.body, snake_new.angle[1]);

        } else {
            let angle = 0;
            let img = snake_new.body_p_right;
            //*проверка поворота*^
            //                   |
            //поворот вниз
            if (snake_new.y[0] > snake_new.y[1]) {
                if (snake_new.x[1] > snake_new.x[2]) {
                    angle = 180;


                } else {
                    img = snake_new.body_p_left;
                    angle = 270;
                }
            }
            //поворот вправо
            if (snake_new.x[0] > snake_new.x[1]) {
                if (snake_new.y[1] > snake_new.y[2]) {
                    img = snake_new.body_p_left;
                    angle = 180;
                } else {
                    angle = 90;
                }
            }
            //поворот влево
            if (snake_new.x[0] < snake_new.x[1]) {
                if (snake_new.y[1] > snake_new.y[2]) {
                    angle = 270;
                } else {
                    img = snake_new.body_p_left;
                    angle = 0;
                }
            }
            //поворот вверх
            if (snake_new.y[0] < snake_new.y[1]) {
                if (snake_new.x[2] > snake_new.x[1]) {
                    angle = 0;
                } else {
                    angle = 90;
                    img = snake_new.body_p_left;
                }
            }
            //рисуется нужный поворот
            snake_new.angle[1] = snake_new.angle[0];
            snake_new.draw(snake_new.x[1], snake_new.y[1], img, angle);

        }
        //рисуется хвост
        snake_new.draw(snake_new.x[snake_new.size - 1], snake_new.y[snake_new.size - 1], snake_new.tail, snake_new.angle[snake_new.size - 1]);
        doneMove = true;
        //конец игры

        if (snake_new.x[0] < 0) {
            cancelAnimationFrame(frame);
            gameOver();
        }
        if (snake_new.x[0] > canvas.width - RECT_WIDTH / 2) {
            cancelAnimationFrame(frame);
            gameOver();
        }
        if (snake_new.y[0] < 0) {
            cancelAnimationFrame(frame);
            gameOver();
        }
        if (snake_new.y[0] > canvas.height - RECT_HEIGHT / 2) {
            cancelAnimationFrame(frame);
            gameOver();
        }
        for (let i = 1; i < snake_new.size; i++) {
            if ((snake_new.x[0] == snake_new.x[i]) && (snake_new.y[0] == snake_new.y[i])) {
                cancelAnimationFrame(frame);
                gameOver();
            }
        }


    });

async function gameOver() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    RECT_WIDTH = 30;
    RECT_HEIGHT = 30;
    canvas.style.backgroundSize = `${RECT_WIDTH*2}px ${RECT_HEIGHT*2}px `;
    canvas.style.backgroundPosition = `0 0, ${RECT_WIDTH}px ${RECT_HEIGHT}px `;
    await leterG();
    await leterA();
    await leterM_1_();
    await leterM_2_();
    await leterE();
    await leterO();
    await leterV();
    await leterE2();
    await leterR();
};


async function leterG() {
    let time = 250;
    snake_new.size = 3;
    snake_new.x = [];
    snake_new.y = [];
    snake_new.angle = [];
    snake_new.x[0] = 60;
    snake_new.x[1] = 90;
    snake_new.x[2] = 120;
    snake_new.y[0] = 30;
    snake_new.y[1] = 30;
    snake_new.y[2] = 30;
    snake_new.angle[0] = 270;
    snake_new.angle[1] = 270;
    snake_new.angle[2] = 270;
    food.x = 90;
    food.y = 90;

    food.draw()

    snake_new.draw(snake_new.x[0], snake_new.y[0], snake_new.head, snake_new.angle[0]);
    snake_new.draw(snake_new.x[1], snake_new.y[1], snake_new.body, snake_new.angle[1]);
    snake_new.draw(snake_new.x[2], snake_new.y[2], snake_new.tail, snake_new.angle[2]);

    await sleep(time);
    snake_new.clear(snake_new.x[0], snake_new.y[0]);
    dx = -30;
    dy = 0;
    dangle = 270;
    snake_new.new_cord(dx, dy, dangle);
    snake_new.draw(snake_new.x[0], snake_new.y[0], snake_new.head, snake_new.angle[0]);
    snake_new.draw(snake_new.x[1], snake_new.y[1], snake_new.body, snake_new.angle[1]);

    await sleep(time);
    snake_new.clear(snake_new.x[0], snake_new.y[0]);
    dx = 0;
    dy = 30;
    dangle = 180;
    snake_new.new_cord(dx, dy, dangle);
    snake_new.draw(snake_new.x[1], snake_new.y[1], snake_new.body_p_left, 270);
    snake_new.draw(snake_new.x[0], snake_new.y[0], snake_new.head, snake_new.angle[0]);

    await sleep(time);
    snake_new.clear(snake_new.x[0], snake_new.y[0]);
    dx = 0;
    dy = 30;
    dangle = 180;
    snake_new.new_cord(dx, dy, dangle);
    snake_new.draw(snake_new.x[1], snake_new.y[1], snake_new.body, snake_new.angle[1]);
    snake_new.draw(snake_new.x[0], snake_new.y[0], snake_new.head, snake_new.angle[0]);

    await sleep(time);
    snake_new.clear(snake_new.x[0], snake_new.y[0]);
    dx = 0;
    dy = 30;
    dangle = 180;
    snake_new.new_cord(dx, dy, dangle);
    snake_new.draw(snake_new.x[1], snake_new.y[1], snake_new.body, snake_new.angle[1]);
    snake_new.draw(snake_new.x[0], snake_new.y[0], snake_new.head, snake_new.angle[0]);

    await sleep(time);
    snake_new.clear(snake_new.x[0], snake_new.y[0]);
    dx = 0;
    dy = 30;
    dangle = 180;
    snake_new.new_cord(dx, dy, dangle);
    snake_new.draw(snake_new.x[1], snake_new.y[1], snake_new.body, snake_new.angle[1]);
    snake_new.draw(snake_new.x[0], snake_new.y[0], snake_new.head, snake_new.angle[0]);

    await sleep(time);
    snake_new.clear(snake_new.x[0], snake_new.y[0]);
    dx = 30;
    dy = 0;
    dangle = 90;
    snake_new.new_cord(dx, dy, dangle);
    snake_new.draw(snake_new.x[1], snake_new.y[1], snake_new.body_p_left, 180);
    snake_new.draw(snake_new.x[0], snake_new.y[0], snake_new.head, snake_new.angle[0]);

    await sleep(time);
    snake_new.clear(snake_new.x[0], snake_new.y[0]);
    dx = 30;
    dy = 0;
    dangle = 90;
    snake_new.new_cord(dx, dy, dangle);
    snake_new.draw(snake_new.x[1], snake_new.y[1], snake_new.body, snake_new.angle[1]);
    snake_new.draw(snake_new.x[0], snake_new.y[0], snake_new.head, snake_new.angle[0]);

    await sleep(time);
    snake_new.clear(snake_new.x[0], snake_new.y[0]);
    dx = 30;
    dy = 0;
    dangle = 90;
    snake_new.new_cord(dx, dy, dangle);
    snake_new.draw(snake_new.x[1], snake_new.y[1], snake_new.body, snake_new.angle[1]);
    snake_new.draw(snake_new.x[0], snake_new.y[0], snake_new.head, snake_new.angle[0]);

    await sleep(time);
    snake_new.clear(snake_new.x[0], snake_new.y[0]);
    dx = 0;
    dy = -30;
    dangle = 0;
    snake_new.new_cord(dx, dy, dangle);
    snake_new.draw(snake_new.x[1], snake_new.y[1], snake_new.body_p_left, snake_new.angle[1]);
    snake_new.draw(snake_new.x[0], snake_new.y[0], snake_new.head, snake_new.angle[0]);

    await sleep(time);
    snake_new.clear(snake_new.x[0], snake_new.y[0]);
    dx = 0;
    dy = -30;
    dangle = 0;
    snake_new.new_cord(dx, dy, dangle);
    snake_new.draw(snake_new.x[1], snake_new.y[1], snake_new.body, snake_new.angle[1]);
    snake_new.draw(snake_new.x[0], snake_new.y[0], snake_new.head, snake_new.angle[0]);

    await sleep(time);

    food.clear();

    snake_new.clear(snake_new.x[0], snake_new.y[0]);
    dx = -30;
    dy = 0;
    dangle = 270;
    snake_new.new_cord(dx, dy, dangle);
    snake_new.draw(snake_new.x[1], snake_new.y[1], snake_new.body_p_left, snake_new.angle[1]);
    snake_new.draw(snake_new.x[0], snake_new.y[0], snake_new.head, snake_new.angle[0]);




}
async function leterA() {
    let time = 250;
    snake_new.size = 3;
    snake_new.x = [];
    snake_new.y = [];
    snake_new.angle = [];
    snake_new.x[0] = 180;
    snake_new.x[1] = 180;
    snake_new.x[2] = 180;
    snake_new.y[0] = 90;
    snake_new.y[1] = 120;
    snake_new.y[2] = 150;
    snake_new.angle[0] = 0;
    snake_new.angle[1] = 0;
    snake_new.angle[2] = 0;
    food.x = 210;
    food.y = 90;

    // food.draw();

    snake_new.draw(210, 90, snake_new.body, 90);

    snake_new.draw(snake_new.x[0], snake_new.y[0], snake_new.head, snake_new.angle[0]);
    snake_new.draw(snake_new.x[1], snake_new.y[1], snake_new.body, snake_new.angle[1]);
    snake_new.draw(snake_new.x[2], snake_new.y[2], snake_new.tail, snake_new.angle[2]);

    await sleep(time);
    snake_new.clear(snake_new.x[0], snake_new.y[0]);
    dx = 0;
    dy = -30;
    dangle = 0;
    snake_new.new_cord(dx, dy, dangle);
    snake_new.draw(snake_new.x[0], snake_new.y[0], snake_new.head, snake_new.angle[0]);
    snake_new.draw(snake_new.x[1], snake_new.y[1], snake_new.body, snake_new.angle[1]);

    await sleep(time);
    snake_new.clear(snake_new.x[0], snake_new.y[0]);
    dx = 0;
    dy = -30;
    dangle = 0;
    snake_new.new_cord(dx, dy, dangle);
    snake_new.draw(snake_new.x[0], snake_new.y[0], snake_new.head, snake_new.angle[0]);
    snake_new.draw(snake_new.x[1], snake_new.y[1], snake_new.body, snake_new.angle[1]);

    await sleep(time);
    snake_new.clear(snake_new.x[0], snake_new.y[0]);
    dx = 30;
    dy = 0;
    dangle = 90;
    snake_new.new_cord(dx, dy, dangle);
    snake_new.draw(snake_new.x[1], snake_new.y[1], snake_new.body_p_right, 90);
    snake_new.draw(snake_new.x[0], snake_new.y[0], snake_new.head, snake_new.angle[0]);

    await sleep(time);
    snake_new.clear(snake_new.x[0], snake_new.y[0]);
    dx = 30;
    dy = 0;
    dangle = 90;
    snake_new.new_cord(dx, dy, dangle);
    snake_new.draw(snake_new.x[0], snake_new.y[0], snake_new.head, snake_new.angle[0]);
    snake_new.draw(snake_new.x[1], snake_new.y[1], snake_new.body, snake_new.angle[1]);

    await sleep(time);
    snake_new.clear(snake_new.x[0], snake_new.y[0]);
    dx = 0;
    dy = 30;
    dangle = 180;
    snake_new.new_cord(dx, dy, dangle);
    snake_new.draw(snake_new.x[1], snake_new.y[1], snake_new.body_p_right, 180);
    snake_new.draw(snake_new.x[0], snake_new.y[0], snake_new.head, snake_new.angle[0]);

    await sleep(time);
    snake_new.clear(snake_new.x[0], snake_new.y[0]);
    dx = 0;
    dy = 30;
    dangle = 180;
    snake_new.new_cord(dx, dy, dangle);
    snake_new.draw(snake_new.x[0], snake_new.y[0], snake_new.head, snake_new.angle[0]);
    snake_new.draw(snake_new.x[1], snake_new.y[1], snake_new.body, snake_new.angle[1]);

    await sleep(time);
    snake_new.clear(snake_new.x[0], snake_new.y[0]);
    dx = 0;
    dy = 30;
    dangle = 180;
    snake_new.new_cord(dx, dy, dangle);
    snake_new.draw(snake_new.x[0], snake_new.y[0], snake_new.head, snake_new.angle[0]);
    snake_new.draw(snake_new.x[1], snake_new.y[1], snake_new.body, snake_new.angle[1]);

    await sleep(time);
    snake_new.clear(snake_new.x[0], snake_new.y[0]);
    dx = 0;
    dy = 30;
    dangle = 180;
    snake_new.new_cord(dx, dy, dangle);
    snake_new.draw(snake_new.x[0], snake_new.y[0], snake_new.head, snake_new.angle[0]);
    snake_new.draw(snake_new.x[1], snake_new.y[1], snake_new.body, snake_new.angle[1]);

}

async function leterM_1_() {
    let time = 250;
    snake_new.size = 3;
    snake_new.x = [];
    snake_new.y = [];
    snake_new.angle = [];
    snake_new.x[0] = 300;
    snake_new.x[1] = 300;
    snake_new.x[2] = 300;
    snake_new.y[0] = 90;
    snake_new.y[1] = 120;
    snake_new.y[2] = 150;
    snake_new.angle[0] = 0;
    snake_new.angle[1] = 0;
    snake_new.angle[2] = 0;

    snake_new.draw(360, 60, snake_new.round, 90)


    snake_new.draw(snake_new.x[0], snake_new.y[0], snake_new.head, snake_new.angle[0]);
    snake_new.draw(snake_new.x[1], snake_new.y[1], snake_new.body, snake_new.angle[1]);
    snake_new.draw(snake_new.x[2], snake_new.y[2], snake_new.tail, snake_new.angle[2]);

    await sleep(time);
    snake_new.clear(snake_new.x[0], snake_new.y[0]);
    dx = 0;
    dy = -30;
    dangle = 0;
    snake_new.new_cord(dx, dy, dangle);
    snake_new.draw(snake_new.x[0], snake_new.y[0], snake_new.head, snake_new.angle[0]);
    snake_new.draw(snake_new.x[1], snake_new.y[1], snake_new.body, snake_new.angle[1]);

    await sleep(time);
    snake_new.clear(snake_new.x[0], snake_new.y[0]);
    dx = 0;
    dy = -30;
    dangle = 0;
    snake_new.new_cord(dx, dy, dangle);
    snake_new.draw(snake_new.x[0], snake_new.y[0], snake_new.head, snake_new.angle[0]);
    snake_new.draw(snake_new.x[1], snake_new.y[1], snake_new.body, snake_new.angle[1]);

    await sleep(time);
    snake_new.clear(snake_new.x[0], snake_new.y[0]);
    dx = 30;
    dy = 0;
    dangle = 90;
    snake_new.new_cord(dx, dy, dangle);
    snake_new.draw(snake_new.x[1], snake_new.y[1], snake_new.body_p_right, 90);
    snake_new.draw(snake_new.x[0], snake_new.y[0], snake_new.head, snake_new.angle[0]);





}

async function leterM_2_() {
    let time = 250;
    snake_new.size = 3;
    snake_new.x = [];
    snake_new.y = [];
    snake_new.angle = [];
    snake_new.x[0] = 420;
    snake_new.x[1] = 420;
    snake_new.x[2] = 420;
    snake_new.y[0] = 90;
    snake_new.y[1] = 120;
    snake_new.y[2] = 150;
    snake_new.angle[0] = 0;
    snake_new.angle[1] = 0;
    snake_new.angle[2] = 0;

    snake_new.draw(snake_new.x[0], snake_new.y[0], snake_new.head, snake_new.angle[0]);
    snake_new.draw(snake_new.x[1], snake_new.y[1], snake_new.body, snake_new.angle[1]);
    snake_new.draw(snake_new.x[2], snake_new.y[2], snake_new.tail, snake_new.angle[2]);

    await sleep(time);
    snake_new.clear(snake_new.x[0], snake_new.y[0]);
    dx = 0;
    dy = -30;
    dangle = 0;
    snake_new.new_cord(dx, dy, dangle);
    snake_new.draw(snake_new.x[0], snake_new.y[0], snake_new.head, snake_new.angle[0]);
    snake_new.draw(snake_new.x[1], snake_new.y[1], snake_new.body, snake_new.angle[1]);

    await sleep(time);
    snake_new.clear(snake_new.x[0], snake_new.y[0]);
    dx = 0;
    dy = -30;
    dangle = 0;
    snake_new.new_cord(dx, dy, dangle);
    snake_new.draw(snake_new.x[0], snake_new.y[0], snake_new.head, snake_new.angle[0]);
    snake_new.draw(snake_new.x[1], snake_new.y[1], snake_new.body, snake_new.angle[1]);

    await sleep(time);
    snake_new.clear(snake_new.x[0], snake_new.y[0]);
    dx = -30;
    dy = 0;
    dangle = 270;
    snake_new.new_cord(dx, dy, dangle);
    snake_new.draw(snake_new.x[1], snake_new.y[1], snake_new.body_p_left, 360);
    snake_new.draw(snake_new.x[0], snake_new.y[0], snake_new.head, snake_new.angle[0]);

}
async function leterE() {
    let time = 250;
    snake_new.size = 3;
    snake_new.x = [];
    snake_new.y = [];
    snake_new.angle = [];
    snake_new.x[0] = 480;
    snake_new.x[1] = 510;
    snake_new.x[2] = 540;
    snake_new.y[0] = 150;
    snake_new.y[1] = 150;
    snake_new.y[2] = 150;
    snake_new.angle[0] = 270;
    snake_new.angle[1] = 270;
    snake_new.angle[2] = 270;

    snake_new.draw(snake_new.x[0], snake_new.y[0], snake_new.head, snake_new.angle[0]);
    snake_new.draw(snake_new.x[1], snake_new.y[1], snake_new.body, snake_new.angle[1]);
    snake_new.draw(snake_new.x[2], snake_new.y[2], snake_new.tail, snake_new.angle[2]);

    snake_new.draw(510, 90, snake_new.round, 90)


    await sleep(time);
    snake_new.clear(snake_new.x[0], snake_new.y[0]);
    dx = 0;
    dy = -30;
    dangle = 0;
    snake_new.new_cord(dx, dy, dangle);
    snake_new.draw(snake_new.x[0], snake_new.y[0], snake_new.head, snake_new.angle[0]);
    snake_new.draw(snake_new.x[1], snake_new.y[1], snake_new.body_p_right, 0);

    await sleep(time);
    snake_new.clear(snake_new.x[0], snake_new.y[0]);
    dx = 0;
    dy = -30;
    dangle = 0;
    snake_new.new_cord(dx, dy, dangle);
    snake_new.draw(snake_new.x[0], snake_new.y[0], snake_new.head, snake_new.angle[0]);
    snake_new.draw(snake_new.x[1], snake_new.y[1], snake_new.body, 0);

    await sleep(time);
    snake_new.clear(snake_new.x[0], snake_new.y[0]);
    dx = 0;
    dy = -30;
    dangle = 0;
    snake_new.new_cord(dx, dy, dangle);
    snake_new.draw(snake_new.x[0], snake_new.y[0], snake_new.head, snake_new.angle[0]);
    snake_new.draw(snake_new.x[1], snake_new.y[1], snake_new.body, 0);

    await sleep(time);
    snake_new.clear(snake_new.x[0], snake_new.y[0]);
    dx = 0;
    dy = -30;
    dangle = 0;
    snake_new.new_cord(dx, dy, dangle);
    snake_new.draw(snake_new.x[0], snake_new.y[0], snake_new.head, snake_new.angle[0]);
    snake_new.draw(snake_new.x[1], snake_new.y[1], snake_new.body, 0);

    await sleep(time);
    snake_new.clear(snake_new.x[0], snake_new.y[0]);
    dx = 30;
    dy = 0;
    dangle = 90;
    snake_new.new_cord(dx, dy, dangle);
    snake_new.draw(snake_new.x[0], snake_new.y[0], snake_new.head, snake_new.angle[0]);
    snake_new.draw(snake_new.x[1], snake_new.y[1], snake_new.body_p_right, 90);

    await sleep(time);
    snake_new.clear(snake_new.x[0], snake_new.y[0]);
    dx = 30;
    dy = 0;
    dangle = 90;
    snake_new.new_cord(dx, dy, dangle);
    snake_new.draw(snake_new.x[0], snake_new.y[0], snake_new.head, snake_new.angle[0]);
    snake_new.draw(snake_new.x[1], snake_new.y[1], snake_new.body, 90);


}
async function leterO() {
    let time = 250;
    snake_new.size = 3;
    snake_new.x = [];
    snake_new.y = [];
    snake_new.angle = [];
    snake_new.x[0] = 180;
    snake_new.x[1] = 210;
    snake_new.x[2] = 240;
    snake_new.y[0] = 210;
    snake_new.y[1] = 210;
    snake_new.y[2] = 210;
    snake_new.angle[0] = 270;
    snake_new.angle[1] = 270;
    snake_new.angle[2] = 270;

    snake_new.draw(snake_new.x[0], snake_new.y[0], snake_new.head, snake_new.angle[0]);
    snake_new.draw(snake_new.x[1], snake_new.y[1], snake_new.body, snake_new.angle[1]);
    snake_new.draw(snake_new.x[2], snake_new.y[2], snake_new.tail, snake_new.angle[2]);

    await sleep(time);
    snake_new.clear(snake_new.x[0], snake_new.y[0]);
    dx = 0;
    dy = 30;
    dangle = 180;
    snake_new.new_cord(dx, dy, dangle);
    snake_new.draw(snake_new.x[1], snake_new.y[1], snake_new.body_p_left, 270);
    snake_new.draw(snake_new.x[0], snake_new.y[0], snake_new.head, snake_new.angle[0]);

    await sleep(time);
    snake_new.clear(snake_new.x[0], snake_new.y[0]);
    dx = 0;
    dy = 30;
    dangle = 180;
    snake_new.new_cord(dx, dy, dangle);
    snake_new.draw(snake_new.x[1], snake_new.y[1], snake_new.body, 180);
    snake_new.draw(snake_new.x[0], snake_new.y[0], snake_new.head, snake_new.angle[0]);

    await sleep(time);
    snake_new.clear(snake_new.x[0], snake_new.y[0]);
    dx = 0;
    dy = 30;
    dangle = 180;
    snake_new.new_cord(dx, dy, dangle);
    snake_new.draw(snake_new.x[1], snake_new.y[1], snake_new.body, 180);
    snake_new.draw(snake_new.x[0], snake_new.y[0], snake_new.head, snake_new.angle[0]);

    await sleep(time);
    snake_new.clear(snake_new.x[0], snake_new.y[0]);
    dx = 0;
    dy = 30;
    dangle = 180;
    snake_new.new_cord(dx, dy, dangle);
    snake_new.draw(snake_new.x[1], snake_new.y[1], snake_new.body, 180);
    snake_new.draw(snake_new.x[0], snake_new.y[0], snake_new.head, snake_new.angle[0]);

    await sleep(time);
    snake_new.clear(snake_new.x[0], snake_new.y[0]);
    dx = 30;
    dy = 0;
    dangle = 90;
    snake_new.new_cord(dx, dy, dangle);
    snake_new.draw(snake_new.x[1], snake_new.y[1], snake_new.body_p_left, 180);
    snake_new.draw(snake_new.x[0], snake_new.y[0], snake_new.head, snake_new.angle[0]);

    await sleep(time);
    snake_new.clear(snake_new.x[0], snake_new.y[0]);
    dx = 30;
    dy = 0;
    dangle = 90;
    snake_new.new_cord(dx, dy, dangle);
    snake_new.draw(snake_new.x[1], snake_new.y[1], snake_new.body, 90);
    snake_new.draw(snake_new.x[0], snake_new.y[0], snake_new.head, snake_new.angle[0]);

    await sleep(time);
    snake_new.clear(snake_new.x[0], snake_new.y[0]);
    dx = 0;
    dy = -30;
    dangle = 0;
    snake_new.new_cord(dx, dy, dangle);
    snake_new.draw(snake_new.x[1], snake_new.y[1], snake_new.body_p_left, 90);
    snake_new.draw(snake_new.x[0], snake_new.y[0], snake_new.head, snake_new.angle[0]);

    await sleep(time);
    snake_new.clear(snake_new.x[0], snake_new.y[0]);
    dx = 0;
    dy = -30;
    dangle = 0;
    snake_new.new_cord(dx, dy, dangle);
    snake_new.draw(snake_new.x[1], snake_new.y[1], snake_new.body, 0);
    snake_new.draw(snake_new.x[0], snake_new.y[0], snake_new.head, snake_new.angle[0]);

    await sleep(time);
    snake_new.clear(snake_new.x[0], snake_new.y[0]);
    dx = 0;
    dy = -30;
    dangle = 0;
    snake_new.new_cord(dx, dy, dangle);
    snake_new.draw(snake_new.x[1], snake_new.y[1], snake_new.body, 0);
    snake_new.draw(snake_new.x[0], snake_new.y[0], snake_new.head, snake_new.angle[0]);

}
async function leterV() {
    let time = 250;
    food.x = 300;
    food.y = 210;

    food.draw();
    await sleep(time);


    food.x = 300;
    food.y = 240;

    food.draw();
    await sleep(time);

    food.x = 330;
    food.y = 270;

    food.draw();
    await sleep(time);

    food.x = 330;
    food.y = 300;

    food.draw();
    await sleep(time);

    food.x = 360;
    food.y = 330;

    food.draw();
    await sleep(time);

    food.x = 390
    food.y = 300

    food.draw();
    await sleep(time);

    food.x = 390
    food.y = 270

    food.draw();
    await sleep(time);

    food.x = 420
    food.y = 240

    food.draw();
    await sleep(time);

    food.x = 420
    food.y = 210

    food.draw();
    await sleep(time);

    food.x = 420
    food.y = 180
}
async function leterE2() {
    let time = 250;
    snake_new.size = 3;
    snake_new.x = [];
    snake_new.y = [];
    snake_new.angle = [];
    snake_new.x[0] = 480;
    snake_new.x[1] = 510;
    snake_new.x[2] = 540;
    snake_new.y[0] = 330;
    snake_new.y[1] = 330;
    snake_new.y[2] = 330;
    snake_new.angle[0] = 270;
    snake_new.angle[1] = 270;
    snake_new.angle[2] = 270;

    snake_new.draw(snake_new.x[0], snake_new.y[0], snake_new.head, snake_new.angle[0]);
    snake_new.draw(snake_new.x[1], snake_new.y[1], snake_new.body, snake_new.angle[1]);
    snake_new.draw(snake_new.x[2], snake_new.y[2], snake_new.tail, snake_new.angle[2]);

    await sleep(time);
    snake_new.clear(snake_new.x[0], snake_new.y[0]);
    dx = 0;
    dy = -30;
    dangle = 0;
    snake_new.new_cord(dx, dy, dangle);
    snake_new.draw(snake_new.x[1], snake_new.y[1], snake_new.body_p_right, 0);
    snake_new.draw(snake_new.x[0], snake_new.y[0], snake_new.head, snake_new.angle[0]);

    await sleep(time);
    snake_new.clear(snake_new.x[0], snake_new.y[0]);
    dx = 0;
    dy = -30;
    dangle = 0;
    snake_new.new_cord(dx, dy, dangle);
    snake_new.draw(snake_new.x[1], snake_new.y[1], snake_new.body, 0);
    snake_new.draw(snake_new.x[0], snake_new.y[0], snake_new.head, snake_new.angle[0]);

    await sleep(time);
    snake_new.clear(snake_new.x[0], snake_new.y[0]);
    dx = 0;
    dy = -30;
    dangle = 0;
    snake_new.new_cord(dx, dy, dangle);
    snake_new.draw(snake_new.x[1], snake_new.y[1], snake_new.body, 0);
    snake_new.draw(snake_new.x[0], snake_new.y[0], snake_new.head, snake_new.angle[0]);

    await sleep(time);
    snake_new.clear(snake_new.x[0], snake_new.y[0]);
    dx = 0;
    dy = -30;
    dangle = 0;
    snake_new.new_cord(dx, dy, dangle);
    snake_new.draw(snake_new.x[1], snake_new.y[1], snake_new.body, 0);
    snake_new.draw(snake_new.x[0], snake_new.y[0], snake_new.head, snake_new.angle[0]);

    await sleep(time);
    snake_new.clear(snake_new.x[0], snake_new.y[0]);
    dx = 30;
    dy = 0;
    dangle = 90;
    snake_new.new_cord(dx, dy, dangle);
    snake_new.draw(snake_new.x[1], snake_new.y[1], snake_new.body_p_right, 90);
    snake_new.draw(snake_new.x[0], snake_new.y[0], snake_new.head, snake_new.angle[0]);

    await sleep(time);
    snake_new.clear(snake_new.x[0], snake_new.y[0]);
    dx = 30;
    dy = 0;
    dangle = 90;
    snake_new.new_cord(dx, dy, dangle);
    snake_new.draw(snake_new.x[1], snake_new.y[1], snake_new.body, 90);
    snake_new.draw(snake_new.x[0], snake_new.y[0], snake_new.head, snake_new.angle[0]);

    await sleep(time);
    snake_new.draw(510, 270, snake_new.round, 90)
}

async function leterR() {
    let time = 250;
    snake_new.size = 3;
    snake_new.x = [];
    snake_new.y = [];
    snake_new.angle = [];
    snake_new.x[0] = 600;
    snake_new.x[1] = 600;
    snake_new.x[2] = 600;
    snake_new.y[0] = 270;
    snake_new.y[1] = 300;
    snake_new.y[2] = 330;
    snake_new.angle[0] = 0;
    snake_new.angle[1] = 0;
    snake_new.angle[2] = 0;

    snake_new.draw(snake_new.x[0], snake_new.y[0], snake_new.head, snake_new.angle[0]);
    snake_new.draw(snake_new.x[1], snake_new.y[1], snake_new.body, snake_new.angle[1]);
    snake_new.draw(snake_new.x[2], snake_new.y[2], snake_new.tail, snake_new.angle[2]);

    await sleep(time);
    snake_new.clear(snake_new.x[0], snake_new.y[0]);
    dx = 0;
    dy = -30;
    dangle = 0;
    snake_new.new_cord(dx, dy, dangle);
    snake_new.draw(snake_new.x[1], snake_new.y[1], snake_new.body, 0);
    snake_new.draw(snake_new.x[0], snake_new.y[0], snake_new.head, snake_new.angle[0]);

    await sleep(time);
    snake_new.clear(snake_new.x[0], snake_new.y[0]);
    dx = 0;
    dy = -30;
    dangle = 0;
    snake_new.new_cord(dx, dy, dangle);
    snake_new.draw(snake_new.x[1], snake_new.y[1], snake_new.body, 0);
    snake_new.draw(snake_new.x[0], snake_new.y[0], snake_new.head, snake_new.angle[0]);

    await sleep(time);
    snake_new.clear(snake_new.x[0], snake_new.y[0]);
    dx = 30;
    dy = 0;
    dangle = 90;
    snake_new.new_cord(dx, dy, dangle);
    snake_new.draw(snake_new.x[1], snake_new.y[1], snake_new.body_p_right, 90);
    snake_new.draw(snake_new.x[0], snake_new.y[0], snake_new.head, snake_new.angle[0]);

    await sleep(time);
    snake_new.clear(snake_new.x[0], snake_new.y[0]);
    dx = 30;
    dy = 0;
    dangle = 90;
    snake_new.new_cord(dx, dy, dangle);
    snake_new.draw(snake_new.x[1], snake_new.y[1], snake_new.body, 90);
    snake_new.draw(snake_new.x[0], snake_new.y[0], snake_new.head, snake_new.angle[0]);

    await sleep(time);
    snake_new.clear(snake_new.x[0], snake_new.y[0]);
    dx = 0;
    dy = 30;
    dangle = 180;
    snake_new.new_cord(dx, dy, dangle);
    snake_new.draw(snake_new.x[1], snake_new.y[1], snake_new.body_p_right, 180);
    snake_new.draw(snake_new.x[0], snake_new.y[0], snake_new.head, snake_new.angle[0]);

    await sleep(time);
    snake_new.clear(snake_new.x[0], snake_new.y[0]);
    dx = 0;
    dy = 30;
    dangle = 180;
    snake_new.new_cord(dx, dy, dangle);
    snake_new.draw(snake_new.x[1], snake_new.y[1], snake_new.body, 180);
    snake_new.draw(snake_new.x[0], snake_new.y[0], snake_new.head, snake_new.angle[0]);

    await sleep(time);
    snake_new.clear(snake_new.x[0], snake_new.y[0]);
    dx = -30;
    dy = 0;
    dangle = 270;
    snake_new.new_cord(dx, dy, dangle);
    snake_new.draw(snake_new.x[1], snake_new.y[1], snake_new.body_p_right, 270);
    snake_new.draw(snake_new.x[0], snake_new.y[0], snake_new.head, snake_new.angle[0]);

    await sleep(time);
    snake_new.draw(630, 300, snake_new.round, 90)

    await sleep(time);
    snake_new.draw(660, 330, snake_new.round, 90)
}

function sleep(ms) {
    return new Promise(
        resolve => setTimeout(resolve, ms)
    );
}

// функц. нажатой клавиши
document.addEventListener("keydown", function(event) {
    //решение"залипшой кнопки"
    if (event.repeat) {
        return;
    }
    if (doneMove == false) {
        return;
    }
    //кнопки на клаве
    console.log(event.code);
    if (event.code == "KeyW") {
        if (dy > 0) {
            return;
        }

        // if (drawY == -10 || !doStep) {
        // 	return;
        // }
        // doStep = false;
        dy = -RECT_HEIGHT;
        dx = 0;
        dangle = 0;
        // drawX = 0;
        // drawY = 10;
        doneMove = false;
    }
    if (event.code == "KeyS") {
        if (dy < 0) {
            return;
        }
        // if (drawY == 10 || !doStep) {
        // 	return;
        // }
        // doStep = false;
        dy = RECT_HEIGHT;
        dx = 0;
        dangle = 180;
        // drawX = 0;
        // drawY = -10;
        doneMove = false;
    }
    if (event.code == "KeyD") {
        if (dx < 0) {
            return;
        }
        // if (drawX == 10 || !doStep) {
        // 	return;
        // }
        // doStep = false;
        dy = 0;
        dx = RECT_WIDTH;
        dangle = 90;
        // drawX = -10;
        // drawY = 0;
        doneMove = false;
    }
    if (event.code == "KeyA") {
        if (dx > 0) {
            return;
        }
        // if (drawX == -10 || !doStep) {
        // 	return;
        // }
        // doStep = false;
        dy = 0;
        dx = -RECT_WIDTH;
        dangle = 270;
        // drawX = 10;
        // drawY = 0;
        doneMove = false;
    }

    // if (game_ON) {
    // 	clearInterval(interval);
    // interval = setInterval(draw,time);
    // }
});