let eth = ["模拟chrome的dino","贪吃蛇","2048","俄罗斯方块","弹球(打砖块)","赛车","3D赛车","svg赛车","见缝插针","跑酷","超高难度跑酷","飞机大战","小行星战斗","飞行的小球","球球大作战（模拟）","拯救兔子","spacePi","井字棋","破坏方块","旋转消除","塔防","低跑"];
let eth_href = ["chromedino/index.html","Snake-Game-HTML5-master/snake.html","2048/index.html","eluosifangkuai.html","tianqiou.html","car%20race/(index).html","https://js13kgames.com/games/racer/index.html","highway/index.html","coreball.html","ziyoucuangguan.html","Wander/index.html","plane/99/index.html","canvasgame/index.html","heliblob20161109/index.html","jqueryballbattle/index.html","theRabbit/index.html","space/(index).html","tictactoe/tictactoe.html","gamelft/index.html","hextris-gh-pages/index.html","tafang/index.html","underrun/index.html"];
let search = require('./search.min.js')
function addgame(name,url){
    this.sum = 0;
    for(let i = 0 ;i < eth.length;i++){
        if(eth[i] != name){
            this.sum++;
        }
    }
    if(this.sum != eth.length){
        eth.push(name);
        eth_href.push(url);
        console("add success");
    }else{
        console("add failure");
    }
}

function searchgame(query){
    return search(eth,query)
}

searchgame()