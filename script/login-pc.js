let users = [];
let passwords = [];
let admins = [];
let adminps = [];
let setcookie = false;
function browserRedirect() {
    let sUserAgent = navigator.userAgent.toLowerCase();
    let bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
    let bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
    let bIsMidp = sUserAgent.match(/midp/i) == "midp";
    let bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
    let bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
    let bIsAndroid = sUserAgent.match(/android/i) == "android";
    let bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
    let bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
    if (bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM) {
        return true;
    } else {
        return false;
    }
}
function d_h() {
    let id3 = document.getElementById('display-hide');
    let id2 = document.getElementById('password');
    if (id2.type == "password") {
        id2.type = "text";
        id3.value = "Hide";
        id3.title = "Click to Hidden Password";
    } else {
        id2.type = "password";
        id3.value = "Display";
        id3.title = "Click to Display Password";
    }
}

function createCode() {

    code = "";

    let codeLength = 4;//验证码的长度

    const checkCode = document.getElementById("code");

    const random = new Array(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'A', 'B', 'C', 'D', 'E', 'F', 'G',

        'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y',

        'Z');//随机数

    for (let i = 0; i < codeLength; i++) {//循环操作

        let index = Math.floor(Math.random() * 36);//取得随机数的索引（0~35）

        code += random[index];//根据索引取得随机数加到code上

    }

    checkCode.value = code;//把code值赋给验证码

}

function check() {

    let inputCode = document.getElementById("input-code").value.toUpperCase();

    //取得输入的验证码并转化为大写

    if (inputCode.length <= 0) { //若输入的验证码长度为0

        alert("Please enter the verification code!"); //则弹出请输入验证码

        createCode();

    } else if (inputCode != code) { //若输入的验证码与产生的验证码不一致时

        alert("Verification code error!"); //则弹出验证码输入错误

        createCode();//刷新验证码

        document.getElementById("input").value = "";//清空文本框

    } else { //输入正确时
        checkaccount()
    }
}

function checkaccount() {
    let id1 = document.getElementById('username');
    let id2 = document.getElementById('password');
    if (checkUserByNP(id1.value, id2.value)) {
        setcookie = confirm("Do you want to save your username and password? If it is a public computer, it is not recommended to save it!");
        if (setcookie == true) {
            cname = id1.value;
            cpsw = id2.value;
            setCookie("name", cname, 2);
            setCookie("password", cpsw, 2);
            setCookie("cookiebool", 1, 2);
            setCookie("user", 1, 2);
            if (CanNotSetCookie()) {
                window.location.href = "game_cann'tsetcookie.html";
            } else {
                if (browserRedirect()) {
                    window.location.href = "../mobile/mainpage.html";
                } else {
                    window.location.href = "mainpage.html";
                }
            }
        } else {
            if (browserRedirect()) {
                window.location.href = "../mobile/mainpage.html";
            } else {
                setCookie("user", 1, 2);
                window.location.href = "mainpage.html";
            }
        }
    } else {
        alert("Error in username or password!");
    }
}
function admin() {
    let id1 = document.getElementById('username');
    let id2 = document.getElementById('password');
    if (checkAdminByNP(id1.value, id2.value)) {
        setCookie("admin", 1, 2);
        console.log(`welcome please wait some times to jump......`);
        window.location.href = "mainpage.html";
    } else {
        console.log(`hello,error username or password!`);
    }
}
function checkUserByNP(username, password) {
    let u = username,
        p = password;
    this.bool = false;
    for (let index = 0; index < users.length; index++) {
        if (vu(vu(users[index])) == u && vu(vu(passwords[index])) == p) {
            this.bool = true;
        }
    }
    return this.bool;
}

function checkAdminByNP(adminn, adminp) {
    let u = adminn,
        p = adminp;
    this.bool = false;
    for (let index = 0; index < admins.length; index++) {
        if (vu(vu(admins[index])) == u && vu(vu(adminps[index])) == p) {
            this.bool = true;
        }
    }
    return this.bool;
}

function addUser(username, password) {
    this.username = username;
    this.password = password;
    if (this.username && this.password) {
        users.push(this.username);
        passwords.push(this.password);
    }
}

function addAdmin(adminname, adminpassword) {
    this.adminname = adminname;
    this.adminpassword = adminpassword;
    if (this.adminname && this.adminpassword) {
        admins.push(this.adminname);
        adminps.push(this.adminpassword);
    }
}

function encode() {
    for (let i = 0; i < users.length; i++) {
        users[i] = ve(users[i]);
        passwords[i] = ve(passwords[i]);
    }
    for (let i = 0; i < admins.length; i++) {
        admins[i] = ve(admins[i]);
        adminps[i] = ve(adminps[i]);
    }
}

function vucode() {
    for (let i = 0; i < users.length; i++) {
        users[i] = vu(users[i]);
        passwords[i] = vu(passwords[i]);
    }
    for (let i = 0; i < admins.length; i++) {
        admins[i] = vu(admins[i]);
        adminps[i] = vu(adminps[i]);
    }
}
function clear() {
    let id1 = document.getElementById('username');
    let id2 = document.getElementById('password');
    let id3 = document.getElementById('input-code');
    id1.value = "";
    id2.value = "";
    id3.value = "";
}
function hasOperate(callback, second = 60000) { //second是检测未操作的时间，秒为单位，callback是该时间段未点击需要执行的函数
    var status = true;
    var timer;

    document.body.onmousedown = function () {
        status = true;
    }
    document.body.onmouseup = function () {
        countTime();
    }

    function countTime() {

        setInterval(function () {
            if (!status) {
                callback();
                status = true;
            }
        }, 1);

        if (timer) {
            clearInterval(timer);
        }

        timer = setInterval(function () {
            status = false;
        }, second);
    }
    countTime();
}
function wait() {
    window.location.href = "pingbao.html";
}


function keydown() {
    let index = 1;
    document.onkeydown = function (ev) {
        if (ev.keyCode == 13) {
            check();
        } else if (ev.keyCode == 40) {
            if (index == 1) {
                document.getElementById('username').focus();
                index++;
            } else if (index == 2) {
                document.getElementById('password').focus();
                index++;
            } else if (index == 3) {
                document.getElementById('input-code').focus();
                index = 1;
            }
        }

        if (ev.keyCode == 38) {
            if (index == 1) {
                document.getElementById('input-code').focus();
                index = 3;
            } else if (index == 2) {
                document.getElementById('username').focus();
                index--;
            } else if (index == 3) {
                document.getElementById('password').focus();
                index--;
            }
        }
    }
}

function getCookie(cname) {
    let name = cname + "=";
    let ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i].trim();
        if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
    }
    return "";
}
//checkCookie：
function checkCookie() {
    let password = getCookie("password");
    if (password != "") {
        alert("Welcome again ");
        window.location.href = "game.html";
    }
}

function setCookie(cname, cvalue, exdays) {
    let d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires=" + d.toGMTString();
    document.cookie = cname + "=" + cvalue + "; " + expires + "path=./";

}

function CanNotSetCookie() {
    let password = getCookie("password");
    if (password != "") {
        return false;
    } else {
        return true;
    }
}

function clearAllCookie() {
    let keys = document.cookie.match(/[^ =;]+(?=\=)/g);
    if (keys) {
        for (let i = keys.length; i--;)
            document.cookie = keys[i] + '=0;expires=' + new Date(0).toUTCString()
    }
}

function ak(v) {
    this.v = v;
    this.time = "";
    this.time = ve(time + new Date().getFullYear() + new Date().getMonth() + new Date().getDay() + new Date().getHours() + new Date().getMinutes());
    if (this.time = this.v) {
        Click('#admin');
    }
}

function tester() {
    setCookie("developer", 1, 365);
}

function testerexit() {
    setCookie("developer", 0, -365);
}

function Click(id){
    this.id = id;
    $(`${this.id}`).click();
}
