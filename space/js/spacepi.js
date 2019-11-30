var SpacePi = function(){
    // reference to the game
    var self = this;
    var doc = document;

    /*============================================================================================*/
    /* Utility / Mathematical / Miscellaneous */
    /*============================================================================================*/
    // random range
    self.rand = function(a,b){return ~~(Math.random()*(b-a+1))+a;}

    // instersection check - source: http://www.kevlindev.com/gui/math/intersection/Intersection.js
    self.intersection = function(a1, a2, b1, b2) {
        var result;
        var ua_t = (b2.x - b1.x) * (a1.y - b1.y) - (b2.y - b1.y) * (a1.x - b1.x);
        var ub_t = (a2.x - a1.x) * (a1.y - b1.y) - (a2.y - a1.y) * (a1.x - b1.x);
        var u_b  = (b2.y - b1.y) * (a2.x - a1.x) - (b2.x - b1.x) * (a2.y - a1.y);
        if ( u_b != 0 ) {
            var ua = ua_t / u_b;
            var ub = ub_t / u_b;
            if ( 0 <= ua && ua <= 1 && 0 <= ub && ub <= 1 ) {
                result = {
                    x: a1.x + ua * (a2.x - a1.x),
                    y: a1.y + ua * (a2.y - a1.y)
                };
            } else {
                result = false;
            }
        } else {
            result = false;
        }
        return result;
    };

    // degrees to radians
    self.dToR = function(degrees){
        return degrees * (Math.PI / 180);
    }

    // radians to degrees
    self.rToD = function(radians){
        return radians / (Math.PI / 180);
    }

    // arc in rectangle collision detection
    self.arcInRect = function(arcx, arcy, arcr, rectx, recty, rectw, recth){
        return !(arcx + arcr <= rectx || arcx - arcr >= rectx + rectw || arcy + arcr <= recty || arcy - arcr >= recty + recth);
    };

    // pi2 for arcs
    self.pi2 = Math.PI * 2;

    // update, render, or destroy an entire array
    self.updateAll = function(a){
        var i = a.length;
        while(i--){
            a[i] && a[i].update(i);
        }
    }

    self.renderAll = function(a){
        var i = a.length;
        while(i--){
            a[i] && a[i].render(i);
        }
    }

    self.destroyAll = function(a){
        var i = a.length;
        while(i--){
            a[i] && a[i].destroy(i);
        }
    }

    // clear the canvas
    self.clear = function(){
        self.ctx.clearRect(0, 0, self.cw, self.ch);
    }

    // add commas to large numbers - source: http://stackoverflow.com/questions/6392102/add-commas-to-javascript-output
    self.commas = function(nStr){
        nStr += '';
        x = nStr.split('.');
        x1 = x[0];
        x2 = x.length > 1 ? '.' + x[1] : '';
        var rgx = /(\d+)(\d{3})/;
        while(rgx.test(x1)) {
            x1 = x1.replace(rgx, '$1' + ',' + '$2');
        }
        return x1 + x2;
    }

    // class helpers - source: http://rockycode.com/blog/addremove-classes-raw-javascript/
    self.hasClass = function(ele,cls){
        return ele.className.match(new RegExp('(\\s|^)'+cls+'(\\s|$)'));
    }

    self.addClass = function(ele,cls){
        if (!self.hasClass(ele,cls)) ele.className += " "+cls;

    }

    self.rmvClass = function(ele,cls){
        if (self.hasClass(ele,cls)) {
            var reg = new RegExp('(\\s|^)'+cls+'(\\s|$)');
            ele.className=ele.className.replace(reg,' ');
        }
    }

    // getElementById() shortener
    self.get = function(a){
        return doc.getElementById(a);
    }

    // local storage helpers - source: http://stackoverflow.com/questions/2010892/storing-objects-in-html5-localstorage/3146971#3146971
    Storage.prototype.setObject = function(key, value) {
        this.setItem(key, JSON.stringify(value));
    }

    Storage.prototype.getObject = function(key) {
        var value = this.getItem(key);
        return value && JSON.parse(value);
    }

    Storage.prototype.removeObject = function(key) {
        this.removeItem(key);
    }

    /*============================================================================================*/
    /* DOM Object */
    /*============================================================================================*/
    self.dom = {};

    /*============================================================================================*/
    /* Initialize Game */
    /*============================================================================================*/
    self.initGame = function(){
        self.gameWrap = self.get('game-wrap');
        doc.onselectstart = function(){ return false };

        self.c = self.get('c');
        self.cw = c.width;
        self.ch = c.height;
        self.ctx = c.getContext('2d');
        self.ctx.lineWidth = 1.5;
        self.ctx.globalCompositeOperation = 'lighter';

        self.settings = {
            music: false,
            sound: false,
            hud: true
        };
        self.setupUser();
        self.bindMenuEvents();
        self.bindGameplayEvents();
        self.initialDelay = 160;
        self.menuMode = true;
        self.animationSpeed = 300;
    };

    /*============================================================================================*/
    /* User */
    /*============================================================================================*/
    self.setupUser = function(){
        // get the user or create a user with defaults
        self.user = localStorage.getObject('spacePiUser') || {
            highestLevelBeaten: 0,
            levels: [
                {score: 0, perfect: false},
                {score: 0, perfect: false},
                {score: 0, perfect: false},
                {score: 0, perfect: false},
                {score: 0, perfect: false},
                {score: 0, perfect: false},
                {score: 0, perfect: false},
                {score: 0, perfect: false},
                {score: 0, perfect: false},
                {score: 0, perfect: false},
                {score: 0, perfect: false},
                {score: 0, perfect: false}
            ],
            funds: 0,
            upgrades: {
                power: {
                    capacity: 0,
                    generation: 0
                },
                base: {
                    resistance: 0,
                    generation: 0
                },
                magnet: {
                    range: 0,
                    power: 0
                },
                coins: {
                    chance: 0,
                    amount: 0
                },
                powerups: {
                    chance: 0,
                    duration: 0
                }
            },
            overall: {
                linesCreated: 0,
                lineLength: 0,
                baseHits: 0,
                levelsPlayed: 0,
                timePlayed: 0
            },
            settings: {
            }
        };
        self.syncDOM();
    }

    self.updateUser = function(){
        localStorage.setObject('spacePiUser', self.user);
        self.syncDOM();

        var completeAllPerfect = true;

        for(var i = 0; i < self.user.levels.length; i++){
            if(self.user.levels[i].perfect == false){
                completeAllPerfect = false;
            }
        }
    }

    self.clearUser = function(){
        localStorage.removeObject('spacePiUser');
        self.setupUser();
        self.syncDOM();
    }

    /*============================================================================================*/
    /* Upgrade Reference */
    /*============================================================================================*/
    self.upgrades = {
        power: {
            capacity: {
                value: [100, 200, 350, 500, 750, 1000],
                cost: [100, 1000, 2000, 8000, 12000]
            },
            generation: {
                value: [.5, 1, 1.5, 2, 2.5, 3],
                cost: [100, 1000, 2000, 8000, 12000]
            }
        },
        base: {
            resistance: {
                value: [0, 1, 2, 3, 4, 5],
                cost: [100, 1000, 2000, 8000, 12000]
            },
            generation: {
                value: [.02, .03, .04, .05, .06, .07],
                cost: [100, 1000, 2000, 8000, 12000]
            }
        },
        powerups: {
            chance: {
                value: [2, 3, 4, 5, 6, 7],
                cost: [50, 500, 2000, 4000, 8000]
            },
            duration: {
                value: [3, 3.5, 4, 4.5, 5, 5.5],
                cost: [50, 500, 2000, 4000, 8000]
            }
        },
        magnet: {
            range: {
                value: [50, 100, 150, 200, 300, 400],
                cost: [50, 500, 2000, 4000, 8000]
            },
            power: {
                value: [1, 2, 3, 4, 5, 6],
                cost: [50, 500, 2000, 4000, 8000]
            }
        },
        coins: {
            chance: {
                value: [50, 55, 60, 65, 70, 75],
                cost: [50, 500, 2000, 4000, 8000]
            },
            amount: {
                value: [1, 2, 3, 4, 5, 6],
                cost: [50, 500, 2000, 4000, 8000]
            }
        }
    }

    self.checkMaxUpgrades = function(){
        // coins are disabled once all upgrades are purchased
        return (
            self.user.upgrades.power.capacity === 5
            && self.user.upgrades.power.generation === 5
            && self.user.upgrades.base.resistance === 5
            && self.user.upgrades.base.generation === 5
            && self.user.upgrades.powerups.chance === 5
            && self.user.upgrades.powerups.duration === 5
            && self.user.upgrades.magnet.range === 5
            && self.user.upgrades.magnet.power === 5
            && self.user.upgrades.coins.chance === 5
            && self.user.upgrades.coins.amount === 5
        );
    }

    /*============================================================================================*/
    /* Powerup Reference */
    /*============================================================================================*/
    self.powerupRef = [
        {
            name: 'Slow Enemies',
            hue: 205
        },
        {
            name: 'Unlimited Power',
            hue: 0
        },
        {
            name: 'Base Generation Boost',
            hue: 300
        },
        {
            name: 'Coin Scatter',
            hue: 60
        }
    ];

    /*============================================================================================*/
    /* Level Reference */
    /*============================================================================================*/
    self.levels = [];
    for(var z = 0; z < 12; z++){
        self.levels.push({
            badTick: 0,
            badTickMax: 90 - (z*6),
            badSpeedMin: 80 + (z*17),
            badSpeedMax: 120 + (z*17),
            badLengthMin: 142 - (z*8),
            badLengthMax: 132 - (z*8),
            badDamage: 7 + z,
            goal: 30 + (z*10)
        });
    }

    /*============================================================================================*/
    /* Initialize Level */
    /*============================================================================================*/
    self.initLevel = function(level){
        self.level = level;
        self.levelPlaying = true;
        self.menuMode = false;

        // mouse
        self.mousedown = false;
        self.mx = self.cw/2;
        self.my = self.ch/2;

        // delta
        self.dt = 0;
        self.oldTime = Date.now();

        // rumble
        self.rumble = false;
        self.rumbleLevel = 0;

        // entities
        self.tempPointLength = 0;
        self.tempPointStart = {x: 0, y: 0};
        self.tempPointEnd = {x: 0, y: 0};
        self.goodLines = [];
        self.goodLines.length = 0;
        self.badLines = [];
        self.badLines.length = 0;
        self.coins = [];
        self.coins.length = 0;
        self.powerups = [];
        self.powerups.length = 0;
        self.blasts = [];
        self.blasts.length = 0;
        self.debris = [];
        self.debris.length = 0;
        self.stars = [];
        self.stars.length = 0;
        self.orbs = [];
        self.orbs.length = 0;

        // base
        self.base = {
            x: self.cw / 2,
            y: self.ch / 2,
            radius: 2.1,
            goal: self.levels[self.level].goal,
            goalPulseAngle: 0,
            generation: self.upgrades.base.generation.value[self.user.upgrades.base.generation],
            flicker: 0
        }

        // user interface
        self.ui = {};

        // line power
        self.power = {
            capacity: self.upgrades.power.capacity.value[self.user.upgrades.power.capacity],
            current: self.upgrades.power.capacity.value[self.user.upgrades.power.capacity],
            rate: self.upgrades.power.generation.value[self.user.upgrades.power.generation]
        }

        // powerups
        self.pwrupTimer = 0;
        self.pwrupTimerMax = 0;
        self.pwrupActive = false;

        if(self.checkMaxUpgrades()){
            self.upgradesMaxed = true;
        } else {
            self.upgradesMaxed = false;
        }

        // create starfield
        self.makeStarfield();

        // level stats
        self.levelStats = {
            startTime: Date.now(),
            endTime: 0,
            pauseStartTime: 0,
            pauseTimeTotal: 0,
            goodLineTotal: 0,
            goodLineLength: 0,
            coinsCollected: 0,
            profit: 0,
            baseHits: 0,
            powerupsCollected: 0,
            score: 0,
            ticks: 0
        }

        // coin powerup timing
        self.coinPowerupTick = 0;
        self.coinPowerupTickMax = 8;

        // set level hue
        self.levelHue = (self.level+1)*(360/12);

        // set level end timing
        self.levelEndStatus = [false, false];
        self.levelEndTick = 0;
        self.levelEndTickMax = 200;

        self.syncDOM();
        self.loop();

        //audio.playSound('start-1', self.settings.sound);
        audio.play( 'start', self.settings.sound );

    }

    /*============================================================================================*/
    /* Delta */
    /*============================================================================================*/
    self.updateDelta = function(){
        // attempt to normalize game speed across multiple FPS levels
        var newTime = Date.now();
        self.dt = (newTime - self.oldTime)/16;
        self.dt = (self.dt > 10) ? 10 : self.dt;
        self.oldTime = newTime;
    }

    /*============================================================================================*/
    /* Rumble */
    /*============================================================================================*/
    self.updateRumble = function(){
        if((!self.levelEndStatus[0] || (self.levelEndStatus[0] && !self.levelEndStatus[1])) && self.rumbleLevel > 0){
            self.rumbleLevel -= 1 * self.dt;
        }
    }

    /*============================================================================================*/
    /* Base */
    /*============================================================================================*/
    self.updateBase = function(){
        // update pulse angle
        if(self.base.goalPulseAngle < 360){
            self.base.goalPulseAngle += 10 * (self.base.radius/self.base.goal) * self.dt;
        } else {
            self.base.goalPulseAngle = 0;
        }

        // grow the radius if it is smaller than max
        if(self.levelStats.ticks > self.initialDelay){
            if(self.base.radius < self.base.goal && !self.levelEndStatus[0]){
                var generation = (self.pwrupActive && self.powerupType === 2) ? (self.base.generation + (self.base.generation/2)) : self.base.generation;
                self.base.radius += generation * self.dt;
            }
        }

        // check for bad line collisions
        var i = self.badLines.length;
        while(i--){
            var badLine = self.badLines[i];
            var badPoint = badLine.p1;
            var dx = self.base.x - badPoint.x;
            var dy = self.base.y - badPoint.y;
            var dist = Math.sqrt(dx * dx + dy * dy);
            if(dist <= self.base.radius && !self.levelEndStatus[0]){
                //var randSound = self.rand(1, audioMax.hit);
                //audio.playSound('hit-'+randSound, self.settings.sound);
                audio.play( 'hit', self.settings.sound );

                self.base.radius -= badLine.damage;

                // rumble
                self.rumbleLevel = 50;

                // good debris
                self.makeDebrisGroup(self.badLines[i].p1.x, self.badLines[i].p1.y, self.levelHue, 50, 1, 10);
                //bad debris
                self.makeDebrisGroup(self.badLines[i].p1.x, self.badLines[i].p1.y, (self.pwrupActive && self.powerupType === 0) ? 205 : 0, 50, 1, 10);
                self.makeDebrisLine(self.badLines[i].p1.x, self.badLines[i].p1.y, (self.pwrupActive && self.powerupType === 0) ? 205 : 0, 50, self.badLines[i].angle, self.badLines[i].length, 20);

                // blast
                self.makeBlastgroup(badPoint.x, badPoint.y);

                self.base.flicker = self.rand(5, 12);
                self.levelStats.baseHits++;
                self.badLines.splice(i, 1);
            }
        }

        // make orbs
        if(self.rand(0, 2) === 0){
            self.orbs.push(new self.Orb());
        }

        // decrement flicker
        if(self.base.flicker > 0){
            self.base.flicker -= (1 * self.dt);
        }

        // level end success
        if(!self.levelEndStatus[0] && self.base.radius >= self.base.goal){
            //audio.playSound('success-1', self.settings.sound);
            audio.play( 'success', self.settings.sound );
            self.levelEndStatus = [true, true];
        }

        // level end fail
        if(!self.levelEndStatus[0] && self.base.radius <= 2){
            //audio.playSound('failure-1', self.settings.sound);
            audio.play( 'failure', self.settings.sound );
            self.levelEndStatus = [true, false];
        }
    }

    self.renderBase = function(){
        // render base
        var newX = (self.base.flicker >= 1) ? self.base.x+self.rand(0, 3)-1.5 : self.base.x;
        var newY = (self.base.flicker >= 1) ? self.base.y+self.rand(0, 3)-1.5 : self.base.y;
        self.ctx.beginPath();
        self.ctx.arc(newX, newY, (self.base.radius < 0) ? 0 : self.base.radius, 0, self.pi2, false);
        if(self.pwrupActive && self.powerupType === 2){
            self.ctx.fillStyle = 'hsl('+360*((self.levelStats.ticks%20)/20)+', '+(50+(self.base.radius/self.base.goal)*50)+'%, '+(50+((Math.abs(180-self.base.goalPulseAngle))/180)*20)+'%)';
        } else {
            self.ctx.fillStyle = 'hsl('+self.levelHue+', '+(50+(self.base.radius/self.base.goal)*50)+'%, '+(50+((Math.abs(180-self.base.goalPulseAngle))/180)*20)+'%)';
        }
        self.ctx.fill();

        // base highlight
        self.ctx.save();
        self.ctx.beginPath();
        self.ctx.arc(newX, newY, (self.base.radius < 0) ? 0 : self.base.radius, 0, self.pi2, false);
        self.ctx.clip();
        self.ctx.beginPath();
        self.ctx.arc(newX-self.base.radius/3, newY-self.base.radius/3, (self.base.radius < 0) ? 0 : self.base.radius*1.3, 0, self.pi2, false);
        var grad = self.ctx.createRadialGradient(newX-self.base.radius/3, newY-self.base.radius/3, 0, newX-self.base.radius/3, newY-self.base.radius/2, (self.base.radius < 0) ? 0 : self.base.radius*1.3);
        grad.addColorStop(0, 'rgba(255,255,255,.3)');
        grad.addColorStop(1, 'rgba(255,255,255,0)');
        self.ctx.fillStyle = grad;
        self.ctx.fill();
        self.ctx.restore();

        if(self.pwrupActive && self.powerupType === 2){
            // extra powerup indication
            var newRadius = self.base.radius * ((self.base.goalPulseAngle)/360);
            newRadius = (newRadius <= 0) ? .01 : newRadius;
            self.ctx.beginPath();
            self.ctx.arc(self.base.x, self.base.y, (newRadius < 0) ? 0 : newRadius, 0, self.pi2, false);
            self.ctx.strokeStyle = 'rgba(255,255,255,.5)';
            self.ctx.stroke();
        }

        if(self.base.flicker >= 1){
            self.ctx.beginPath();
            self.ctx.arc(newX, newY, (self.base.radius < 0) ? 0 : self.base.radius, 0, self.pi2, false);
            self.ctx.fillStyle = 'hsla(0, 0%, 100%, '+self.rand(25, 100)/100+')';
            self.ctx.fill();
            self.ctx.fillStyle = 'hsla(0, 0%, 100%, '+self.rand(1, 10)/100+')';
            self.ctx.fillRect(0,0,self.cw, self.ch);
        }
    }

    self.renderBaseGoal = function(){
        var goalRadius = 0;
        if(self.levelStats.ticks <= self.initialDelay){
            goalRadius = (self.levelStats.ticks/self.initialDelay) * self.base.goal;
        } else {
            goalRadius = self.base.goal;
        }

        // render goal
        self.ctx.beginPath();
        self.ctx.arc(self.base.x, self.base.y, (goalRadius < 0) ? 0 : goalRadius, 0, self.pi2, false);
        self.ctx.strokeStyle = 'hsla('+self.levelHue+', 100%, 20%, .35)';
        self.ctx.stroke();

        // render goal pulse
        self.ctx.lineWidth = 2;
        self.ctx.beginPath();
        self.ctx.arc(self.base.x, self.base.y, (goalRadius < 0) ? 0 : goalRadius, self.dToR(self.base.goalPulseAngle), self.dToR(self.base.goalPulseAngle) + (Math.PI / 3), false);
        self.ctx.strokeStyle = 'hsl('+self.levelHue+', 100%, '+(10+((Math.abs(180-self.base.goalPulseAngle))/180)*20)+'%)';
        self.ctx.stroke();

        self.ctx.beginPath();
        self.ctx.arc(self.base.x, self.base.y, (goalRadius < 0) ? 0 : goalRadius, self.dToR(self.base.goalPulseAngle+180), self.dToR(self.base.goalPulseAngle+180) + (Math.PI / 3), false);
        self.ctx.stroke();
        self.ctx.lineWidth = 1.5;
    }

    /*============================================================================================*/
    /* Power */
    /*============================================================================================*/
    self.updatePower = function(){
        if(self.power.current < 0){
            self.power.current = 0;
        }

        if(self.power.current < self.power.capacity){
            self.power.current += self.power.rate * self.dt;
        }

        if(self.power.current > self.power.capacity){
            self.power.current = self.power.capacity;
        }

        if(self.pwrupActive && self.powerupType === 1){
            self.power.current = self.power.capacity;
        }

        if(self.mousedown){
            var dx = self.mx - self.tempPointStart.x;
            var dy = self.my - self.tempPointStart.y;
            var dist = Math.sqrt(dx * dx + dy * dy);
            if(dist <= self.power.current || (self.pwrupActive && self.powerupType === 1)){
                self.tempPointEnd = {x: self.mx, y: self.my};
                self.tempPointLength = dist;
            } else {
                var angle = Math.atan2(dy, dx);

                // set second point based on first point, angle, and length
                self.tempPointEnd = {
                    x: self.tempPointStart.x + Math.cos(angle) * self.power.current,
                    y: self.tempPointStart.y + Math.sin(angle) * self.power.current
                };

                var dx2 = self.tempPointEnd.x - self.tempPointStart.x;
                var dy2 = self.tempPointEnd.y - self.tempPointStart.y;
                self.temptPointLength = Math.sqrt(dx2 * dx2 + dy2 * dy2);

            }
        }
    }

    /*============================================================================================*/
    /* Tracer Line */
    /*============================================================================================*/
    self.renderTracer = function(){
        if(self.mousedown){
            // potential
            self.ctx.beginPath();
            self.ctx.moveTo(self.tempPointStart.x, self.tempPointStart.y);
            self.ctx.lineTo(self.mx, self.my);
            self.ctx.strokeStyle = '#222';
            self.ctx.stroke();

            // actual
            self.ctx.beginPath();
            self.ctx.moveTo(self.tempPointStart.x, self.tempPointStart.y);
            self.ctx.lineTo(self.tempPointEnd.x, self.tempPointEnd.y);
            self.ctx.strokeStyle = '#fff';
            self.ctx.stroke();
        }
    }

    /*============================================================================================*/
    /* Good Lines */
    /*============================================================================================*/
    self.goodLine = function(p1, p2){
        this.p1 = p1;
        this.p2 = p2;

        var dx = p1.x - p2.x;
        var dy = p1.y - p2.y;
        this.length = Math.sqrt(dx * dx + dy * dy);
        this.angle = Math.atan2(dy, dx);

        // set pulse tracking
        this.pulse = 100;
        this.pulseToggle = false;
        this.pulseMin = 70;
        this.pulseMax = 100;

        self.levelStats.goodLineTotal++;
        self.levelStats.goodLineLength += this.length;
    }

    self.goodLine.prototype = {
        update: function(s){
            // pulse toggling and tracking
            if(this.pulseToggle){
                this.pulse += 2;
                if(this.pulse >= this.pulseMax){
                    this.pulseToggle = false;
                }
            } else {
                this.pulse -= 2;
                if(this.pulse <= this.pulseMin){
                    this.pulseToggle = true;
                }
            }

            var i = self.badLines.length;
            while(i--){
                // check for intersection between good and bad line
                var intersection = self.intersection(this.p1, this.p2, self.badLines[i].p1, self.badLines[i].p2);
                if(intersection){
                    //var randSound = self.rand(1, audioMax.hit);
                    //audio.playSound('hit-'+randSound, self.settings.sound);
                    audio.play( 'hit', self.settings.sound );

                    // add rumble
                    //self.rumbleLevel = 20;

                    // create blasts
                    self.makeBlastgroup(intersection.x, intersection.y);

                    // destroy lines
                    self.badLines[i].destroy(i, intersection.x, intersection.y);
                    this.destroy(s, intersection.x, intersection.y);
                }
            }
        },
        render: function(){
            self.ctx.beginPath();
            self.ctx.moveTo(this.p1.x, this.p1.y);
            self.ctx.lineTo(this.p2.x, this.p2.y);
            self.ctx.strokeStyle = 'hsl(0, 0%, '+this.pulse+'%)';
            self.ctx.lineWidth = 1.5;
            self.ctx.stroke();
        },
        destroy: function(i, x, y){
            // create debris
            if(x && y){
                self.makeDebrisGroup(x, y, 0, 100, 1, 10);
            }
            self.makeDebrisLine(this.p1.x, this.p1.y, 0, 100, this.angle, this.length, 20);

            // remove from array
            self.goodLines.splice(i, 1);
        }
    }

    /*============================================================================================*/
    /* bad Lines */
    /*============================================================================================*/
    self.badLine = function(){
        // determine random starting quadrant
        // 1 = top
        // 2 = right
        // 3 = bottom
        // 4 = left
        var quadrant = self.rand(1, 4);

        // plot random start point
        switch(quadrant){
            case 1:
                this.p1 = {
                    x: self.rand(0, self.cw),
                    y: 0
                }
                break;
            case 2:
                this.p1 = {
                    x: self.cw,
                    y: self.rand(0, self.ch)
                }
                break;
            case 3:
                this.p1 = {
                    x: self.rand(0, self.cw),
                    y: self.ch
                }
                break;
            case 4:
                this.p1 = {
                    x: 0,
                    y: self.rand(0, self.ch)
                }
        }

        // get angle from start point to center point
        var dx = self.cw/2 - this.p1.x;
        var dy = self.ch/2 - this.p1.y;
        this.angle = Math.atan2(dy, dx);

        // set random length
        this.length = self.rand(self.levels[self.level].badLengthMin, self.levels[self.level].badLengthMax);

        // set second point based on first point, angle, and length
        this.p2 = {
            x: this.p1.x - Math.cos(this.angle) * this.length,
            y: this.p1.y - Math.sin(this.angle) * this.length
        };

        // set the speed and acceleration
        this.speed = self.rand(self.levels[self.level].badSpeedMin, self.levels[self.level].badSpeedMax)/100;

        // set the damage
        this.damage = self.levels[self.level].badDamage - self.upgrades.base.resistance.value[self.user.upgrades.base.resistance];
        if(this.damage < 1){
            this.damage = 1;
        }

        // set pulse tracking
        this.pulse = 45;
        this.pulseToggle = false;
        this.pulseMin = 30;
        this.pulseMax = 70;

    }

    self.badLine.prototype = {
        update: function(){
            // update both line points simultaneously based on angle and speed
            var speed = (self.pwrupActive && self.powerupType === 0) ? this.speed/2 : this.speed;
            this.p1.x += (Math.cos(this.angle) * speed) * self.dt;
            this.p2.x += (Math.cos(this.angle) * speed) * self.dt;
            this.p1.y += (Math.sin(this.angle) * speed) * self.dt;
            this.p2.y += (Math.sin(this.angle) * speed) * self.dt;
            this.speed += ((self.base.radius/self.base.goal)/100);

            // pulse toggling and tracking
            if(this.pulseToggle){
                this.pulse += 2;
                if(this.pulse >= this.pulseMax){
                    this.pulseToggle = false;
                }
            } else {
                this.pulse -= 2;
                if(this.pulse <= this.pulseMin){
                    this.pulseToggle = true;
                }
            }
        },
        render: function(){
            self.ctx.beginPath();
            self.ctx.moveTo(this.p1.x, this.p1.y);
            self.ctx.lineTo(this.p2.x, this.p2.y);
            self.ctx.strokeStyle = (self.pwrupActive && self.powerupType === 0) ? 'hsl('+self.powerupRef[self.powerupType].hue+', 100%, '+this.pulse+'%)' : 'hsl(0, 100%, '+this.pulse+'%)';
            self.ctx.lineWidth = 1.5;
            self.ctx.stroke();

            // sparks
            if(self.rand(0, 4) === 0){
                self.makeDebrisLine(this.p1.x, this.p1.y, (self.pwrupActive && self.powerupType === 0) ? 205 : 0, 50, this.angle, this.length, 1);
            }
        },
        destroy: function(i, x, y){
            // create debris
            if(x && y){
                self.makeDebrisGroup(x, y, (self.pwrupActive && self.powerupType === 0) ? 205 : 0, 50, 1, 10);
            }
            self.makeDebrisLine(this.p1.x, this.p1.y, (self.pwrupActive && self.powerupType === 0) ? 205 : 0, 50, this.angle, this.length, 20);

            // create coins
            if(self.rand(1, 100) <= self.upgrades.coins.chance.value[self.user.upgrades.coins.chance] && !self.upgradesMaxed){
                self.makeCoins(x || this.p1.x, y || this.p1.y, (self.level+1)*5, self.rand(1, self.upgrades.coins.amount.value[self.user.upgrades.coins.amount]));
            }
            // create powerups
            if(x && y){
                if(self.rand(1, 100) <= self.upgrades.powerups.chance.value[self.user.upgrades.powerups.chance] && !self.pwrupActive){
                    var newType = (self.upgradesMaxed) ? self.rand(0,2) : self.rand(0,3);
                    self.powerups.push(new self.Powerup(x, y, newType));
                }
            }

            // remove from array
            self.badLines.splice(i, 1);
        }
    }

    self.makebadLines = function(){
        if(self.levelStats.ticks > self.initialDelay){
            var newMax = (self.pwrupActive && self.powerupType === 0) ? self.levels[self.level].badTickMax*2 : self.levels[self.level].badTickMax;
            if(self.levels[self.level].badTick >= newMax){
                self.badLines.push(new self.badLine());
                self.levels[self.level].badTick = 0;
            } else {
                self.levels[self.level].badTick += 1 * self.dt;
            }
        }
    }

    /*============================================================================================*/
    /* Coins */
    /*============================================================================================*/
    self.Coin = function(x, y, value){
        this.x = x;
        this.y = y;
        this.vx = (self.rand(0, 100)-50)/100;
        this.vy = (self.rand(0, 100)-50)/100;
        this.radius = 4;
        this.value = value;
        this.magnetized = false;
        this.xScale = 1;
        this.xScaleGrow = true;
        this.collected = false;
        this.alpha = 0;
    }

    self.Coin.prototype = {
        update: function(i){
            // fade in
            if(this.alpha < 1){
                this.alpha += .05;
            }

            // update the xScale to create spinning effect
            if(this.xScaleGrow && this.xScale >= 1){
                this.xScaleGrow = false;
            } else if(!this.xScaleGrow && this.xScale <= .1){
                this.xScaleGrow = true;
            }

            if(this.xScaleGrow){
                this.xScale += .05;
            } else {
                this.xScale -= .05;
            }

            // if the coin has not been collected yet
            if(!this.collected){
                // handle magnet power
                var dx = self.mx - this.x;
                var dy = self.my - this.y;
                var dist = Math.sqrt(dx * dx + dy * dy);
                if(dist <= self.upgrades.magnet.range.value[self.user.upgrades.magnet.range]){
                    this.magnetized = true;
                    var angle = Math.atan2(dy, dx);
                    var mvx = Math.cos(angle);
                    var mvy = Math.sin(angle);
                    this.x += (mvx * self.upgrades.magnet.power.value[self.user.upgrades.magnet.power]) * self.dt;
                    this.y += (mvy * self.upgrades.magnet.power.value[self.user.upgrades.magnet.power]) * self.dt;
                } else {
                    this.magnetized = false;
                    this.x += this.vx * self.dt;
                    this.y += this.vy * self.dt;
                }

                // collect the coin
                if(dist <= 15){
                    //var randSound = self.rand(1, audioMax.coin);
                    //audio.playSound('coin-'+randSound, self.settings.sound);
                    audio.play( 'coin', self.settings.sound );
                    self.levelStats.coinsCollected++;
                    self.levelStats.profit += this.value;
                    this.collected = true;
                    this.magnetized = false;
                }

                // out of bounds, destroy coin
                if(!self.arcInRect(this.x, this.y, this.radius, 0, 0, self.cw, self.ch)){
                    self.coins.splice(i, 1);
                }

            } else {
                var dx = self.cw+4 - this.x;
                var dy = -4 - this.y;
                var dist = Math.sqrt(dx * dx + dy * dy);
                var angle = Math.atan2(dy, dx);
                var mvx = Math.cos(angle);
                var mvy = Math.sin(angle);
                this.x += (mvx*40) * self.dt;
                this.y += (mvy*40) * self.dt;

                if(!self.arcInRect(this.x, this.y, this.radius, 0, 0, self.cw, self.ch)){
                    self.coins.splice(i, 1);
                }
            }

        },
        render: function(){
            // draw magnetized line
            /*
            if(this.magnetized){
                self.ctx.beginPath();
                self.ctx.moveTo(self.mx, self.my);
                self.ctx.lineTo(this.x, this.y);
                self.ctx.strokeStyle = 'hsla(0, 0%, 100%, .01)';
                self.ctx.lineWidth = 10;
                self.ctx.lineCap = 'round';
                self.ctx.stroke();
            }
            */

            self.ctx.save();
            self.ctx.translate(this.x, this.y);
            self.ctx.scale(this.xScale, 1)
            self.ctx.beginPath();
            self.ctx.arc(0, 0, (this.radius < 0) ? 0 : this.radius, 0, self.pi2, false);
            self.ctx.fillStyle = (this.magnetized) ? 'hsla(60, 0%, '+(this.xScale*140)+'%, '+this.alpha+')' : 'hsla('+self.levelHue+', 100%, '+(this.xScale*70)+'%, '+this.alpha+')';
            self.ctx.fill();
            self.ctx.restore();

        }
    }

    self.makeCoins = function(x, y, value, count){
        while(count--){
            setTimeout(function(){
                self.coins.push(new self.Coin(x+self.rand(0,100)-50, y+self.rand(0,100)-50, value));
            }, 10 * count);
        }
    }

    self.checkCoinPowerup = function(){
        if(self.pwrupActive && self.powerupType === 3 && !self.upgradesMaxed){
            if(self.coinPowerupTick < self.coinPowerupTickMax){
                self.coinPowerupTick += 1 * self.dt;
            } else {
                self.coinPowerupTick = 0;
                self.makeCoins(self.rand(0, self.cw), self.rand(0, self.ch), (self.level+1)*5, 1);
            }
        } else {
            self.coinPowerupTick = 0;
        }
    }

    /*============================================================================================*/
    /* Powerups */
    /*============================================================================================*/
    self.Powerup = function(x, y, type){
        this.x = x;
        this.y = y;
        this.vx = (self.rand(0, 100)-50)/50;
        this.vy = (self.rand(0, 100)-50)/50;
        this.radius = 12;
        this.type = type;
        this.magnetized = false;
        this.angle = 0;
        this.alpha = 0;
    }

    self.Powerup.prototype = {
        update: function(i){
            // fade in
            if(this.alpha < 1){
                this.alpha += .05;
            }

            if(this.angle < 360){
                this.angle += 5;
            } else {
                this.angle = 0;
            }

            // handle magnet power
            var dx = self.mx - this.x;
            var dy = self.my - this.y;
            var dist = Math.sqrt(dx * dx + dy * dy);
            if(dist <= self.upgrades.magnet.range.value[self.user.upgrades.magnet.range]){
                this.magnetized = true;
                var angle = Math.atan2(dy, dx);
                var mvx = Math.cos(angle);
                var mvy = Math.sin(angle);
                this.x += (mvx * (self.upgrades.magnet.power.value[self.user.upgrades.magnet.power])/4) * self.dt;
                this.y += (mvy * (self.upgrades.magnet.power.value[self.user.upgrades.magnet.power])/4) * self.dt;
            } else {
                this.magnetized = false;
                this.x += this.vx * self.dt;
                this.y += this.vy * self.dt;
            }

            // collect the powerup
            if(dist <= 15){
                //var randSound = self.rand(1, audioMax.powerup);
                //audio.playSound('powerup-1', self.settings.sound);
                audio.play( 'powerup', self.settings.sound );
                self.levelStats.powerupsCollected++;
                self.pwrupActive = true;
                self.powerupType = this.type;
                self.pwrupTimer = self.upgrades.powerups.duration.value[self.user.upgrades.powerups.duration] * 60;
                self.pwrupTimerMax = self.upgrades.powerups.duration.value[self.user.upgrades.powerups.duration] * 60;
                self.powerups.length = 0;
            }

            // out of bounds, destroy powerup
            if(!self.arcInRect(this, this.y, this.radius, 0, 0, self.cw, self.ch)){
                self.powerups.splice(i, 1);
            }

        },
        render: function(){
            self.ctx.save();
            self.ctx.translate(this.x, this.y);
            self.ctx.rotate(self.dToR(this.angle));
            self.ctx.lineWidth = 6;
            var lightness = (50+(Math.abs(180-this.angle)/180)*15);
            self.ctx.strokeStyle = 'hsla('+self.powerupRef[this.type].hue+', 100%, '+lightness+'%, '+this.alpha+')';
            self.ctx.beginPath();
            self.ctx.arc(0, 0, (this.radius < 0) ? 0 : this.radius, 0, self.dToR(60), false);
            self.ctx.stroke();
            self.ctx.beginPath();
            self.ctx.arc(0, 0, (this.radius < 0) ? 0 : this.radius, self.dToR(120), self.dToR(180), false);
            self.ctx.stroke();
            self.ctx.beginPath();
            self.ctx.arc(0, 0,(this.radius < 0) ? 0 : this.radius, self.dToR(240), self.dToR(300), false);
            self.ctx.stroke();
            self.ctx.restore();
        }
    }

    self.updateActivePowerup = function(){
        if(self.pwrupActive){
            if(self.pwrupTimer > 0){
                self.pwrupTimer -= 1 * self.dt;
            } else {
                self.pwrupTimer = 0;
                self.pwrupTimerMax = 0;
                self.pwrupActive = false;
            }
        }
    };

    /*============================================================================================*/
    /* Blasts */
    /*============================================================================================*/
    self.Blast = function(x, y){
        this.x = x;
        this.y = y;
        this.radius = self.rand(4, 18);
    }

    self.Blast.prototype = {
        update: function(i){
            this.radius -= (.65 * self.dt);
            if(this.radius <= 0){
                self.blasts.splice(i, 1);
            }
        },
        render: function(){
            var newRadius = this.radius+self.rand(0,2)/3;
            self.ctx.beginPath();
            self.ctx.arc(this.x+self.rand(0,2)-1, this.y+self.rand(0,2)-1, (newRadius < 0) ? 0 : newRadius, 0, self.pi2, false);
            self.ctx.fillStyle = 'hsla('+self.levelHue+', 100%, '+self.rand(50, 80)+'%, '+self.rand(30, 75)/100+')';
            self.ctx.fill();
        }
    }

    self.makeBlastgroup = function(x, y){
        self.blasts.push(new self.Blast(x, y));
        self.blasts.push(new self.Blast(x+self.rand(0,10)-5, y+self.rand(0,10)-5));
        self.blasts.push(new self.Blast(x+self.rand(0,10)-5, y+self.rand(0,10)-5));
    }

    /*============================================================================================*/
    /* Debris */
    /*============================================================================================*/
    self.Debris = function(x, y, hue, lightness, power){
        this.x = x;
        this.y = y;
        this.size = self.rand(1, 3)/2;
        this.speed = (self.rand(0, power)-(power/2))/20;
        this.angle = self.rand(0, 360);
        this.hue = hue;
        this.saturation = 100;
        this.lightness = lightness;
        this.alpha = self.rand(50, 100)/100;
        this.decay = self.rand(50, 100)/5000;
    }

    self.Debris.prototype = {
        update: function(i){

            var radians = self.dToR(this.angle);
            var vx = Math.cos(radians) * (this.speed * this.alpha);
            var vy = Math.sin(radians) * (this.speed * this.alpha);

            this.x += vx * self.dt;
            this.y += vy * self.dt;

            this.alpha -= (this.decay * self.dt);

            if(this.alpha <= 0){
                self.debris.splice(i, 1);
            }
        },
        render: function(){
            self.ctx.fillStyle = 'hsla('+this.hue+', '+this.saturation+'%, '+this.lightness+'%, '+this.alpha+')';
            self.ctx.fillRect(this.x, this.y, this.size, this.size);
        }
    }

    self.makeDebrisGroup = function(x, y, hue, lightness, maxRadius, count){
        while(count--){
            var newRadius = Math.random() * maxRadius;
            var newAngle = Math.random() * self.pi2;
            var newX = x + Math.cos(newAngle) * newRadius;
            var newY = y + Math.sin(newAngle) * newRadius;
            self.debris.push(new self.Debris(newX, newY, hue, lightness, 100));
        }
    }

    self.makeDebrisLine = function(x, y, hue, lightness, angle, maxLength, count){
        while(count--){
            var newLength = self.rand(0, maxLength);
            var newX = x - Math.cos(angle) * newLength;
            var newY = y - Math.sin(angle) * newLength;
            self.debris.push(new self.Debris(newX, newY, hue, lightness, 20));
        }
    }

    /*============================================================================================*/
    /* Orbs */
    /*============================================================================================*/
    self.Orb = function(x, y){
        this.x = self.base.x;
        this.y = self.base.y;
        this.vx = ((self.rand(0, 100)-50)/15000) * (self.base.radius);
        this.vy = ((self.rand(0, 100)-50)/15000) * (self.base.radius);
        this.radius = self.rand(1,4)/3;
        this.alpha = 0;
        this.alphaMax = self.rand(50, 100)/100;
        this.alphaTrigger = false;
        this.decay = self.rand(50, 100)/3000;
        this.growth = self.rand(50, 100)/5000;
    }

    self.Orb.prototype = {
        update: function(i){

            this.x += this.vx * self.dt;
            this.y += this.vy * self.dt;

            if(this.alphaTrigger){
                this.alpha -= (this.decay * self.dt);
                if(this.alpha <= 0){
                    self.orbs.splice(i, 1);
                }
            } else {
                this.alpha += (this.growth * self.dt);
                if(this.alpha >= this.alphaMax){
                    this.alphaTrigger = true;
                }
            }

        },
        render: function(){
            self.ctx.beginPath();
            self.ctx.arc(this.x, this.y, (this.radius < 0) ? 0 : this.radius, 0, self.pi2, false);
            self.ctx.fillStyle = 'hsla('+self.levelHue+', '+(50+(self.base.radius/self.base.goal)*50)+'%, '+(50+((Math.abs(180-self.base.goalPulseAngle))/180)*20)+'%, '+this.alpha+')';
            self.ctx.fill();
        }
    }

    /*============================================================================================*/
    /* Stars */
    /*============================================================================================*/
    self.Star = function(x, y, radius, speed){
        this.x = x;
        this.y = y;
        this.speed = (speed/25);
        this.radius = radius;
        this.saturation = (30+(this.radius)*5);
        this.lightness = (10+this.radius*3);
        this.angle = self.rToD(Math.atan2(self.ch/2 - this.y, self.cw/2 - this.x));
        this.angleSpeed =  this.radius/16;
        this.orbitRadius = Math.sqrt(Math.pow(self.cw/2 - this.x, 2) + Math.pow(self.ch/2 - this.y, 2));
    }

    self.Star.prototype = {
        update: function(i){
            // orbital
            this.x = (self.cw/2) + Math.sin(self.dToR(this.angle)) * this.orbitRadius;
            this.y = (self.ch/2) + Math.cos(self.dToR(this.angle)) * this.orbitRadius;
            this.angle += .01 + this.angleSpeed * (self.base.radius/self.base.goal);

            if(this.angle >= 360){
                this.angle = 0;
            }
        },
        render: function(){
            self.ctx.beginPath();
            self.ctx.arc(this.x, this.y, (this.radius < 0) ? 0 : this.radius, 0, self.pi2, false);
            var flickerAdd = (self.rand(0, 30) === 0) ? self.rand(5, 15) : 0;
            self.ctx.fillStyle = 'hsl('+self.levelHue+', '+this.saturation+'%, '+(this.lightness+flickerAdd)+'%)';
            self.ctx.fill();
        }
    }

    self.makeStarfield = function(){
        var base = .6;
        var inc = .2;
        var count = 9;
        while(count--){
            var radius = base + inc;
            self.stars.push(new self.Star(self.rand(0, self.cw-radius), self.rand(0, self.cw-radius), radius, .75));

            radius += inc;
            self.stars.push(new self.Star(self.rand(0, self.cw-radius), self.rand(0, self.cw-radius), radius, 2));

            radius += inc;
            self.stars.push(new self.Star(self.rand(0, self.cw-radius), self.rand(0, self.cw-radius), radius, 3.25));

            radius += inc;
            self.stars.push(new self.Star(self.rand(0, self.cw-radius), self.rand(0, self.cw-radius), radius, 4.5));

            radius += inc;
            self.stars.push(new self.Star(self.rand(0, self.cw-radius), self.rand(0, self.cw-radius), radius, 5.75));

            radius += inc;
            self.stars.push(new self.Star(self.rand(0, self.cw-radius), self.rand(0, self.cw-radius), radius, 7));
        }
    }

    /*============================================================================================*/
    /* User Interface */
    /*============================================================================================*/
    self.updateUI = function(){
        var baseRadius = (self.base.radius >= 2) ? Math.round(self.base.radius) : 0;
        self.ui.ratioComplete = baseRadius+'/'+self.base.goal;
        self.ui.percentComplete = Math.round((baseRadius / self.base.goal) * 100);
    }

    self.renderUI = function(){
        // level start label
        if(self.levelStats.ticks <= self.initialDelay){
            self.ctx.save();
            var alpha = (self.initialDelay - self.levelStats.ticks)/100;
            self.ctx.globalAlpha = (alpha > 1) ? 1 : alpha;
            self.ctx.globalCompositeOperation = 'source-over';
            var labelH = 32 + self.level;
            self.ctx.font = 'bold '+labelH+'px arial';
            self.ctx.textBaseline = 'middle';
            self.ctx.textAlign = 'center';

            self.ctx.beginPath();
            self.ctx.arc(self.cw/2, self.ch/2, (self.base.goal < 0) ? 0 : self.base.goal, 0, self.pi2, false);
            self.ctx.fillStyle = 'hsla(0, 0%, 0%, .75)';
            self.ctx.fill();
            self.ctx.strokeStyle = '#171717';
            self.ctx.stroke();

            var grad = self.ctx.createLinearGradient(self.cw/2, self.ch/2 - labelH/2, self.cw/2, self.ch/2 + labelH/2);
            grad.addColorStop(0, 'hsla('+self.levelHue+', 100%, 70%, 1)');
            grad.addColorStop(1, 'hsla('+self.levelHue+', 100%, 40%, 1)');
            self.ctx.fillStyle = grad;
            self.ctx.fillText(self.level+1, self.cw/2, self.ch/2);
            self.ctx.restore();
        }

        // render top left text
        self.ctx.fillStyle = '#aaa';
        self.ctx.textAlign = 'left';
        self.ctx.font = 'bold 10px arial';
        self.ctx.fillText('Completion: '+self.ui.ratioComplete+' ('+self.ui.percentComplete+'%)', 12, 20);
        self.ctx.fillText('Power: '+Math.round(self.power.current)+'/'+self.power.capacity+' ('+Math.round((self.power.current/self.power.capacity) * 100)+'%)', 156, 20);

        // render top right text
        // determine current score
        var milliseconds = Date.now() - self.levelStats.startTime - self.levelStats.pauseTimeTotal;
        var minutes = Math.floor(milliseconds / 1000 / 60);
        var seconds = Math.floor(milliseconds / 1000) % 60;
        var displayScore = '';
        displayScore = 0;
        displayScore += seconds * 100;
        displayScore += self.levelStats.goodLineTotal * 100;
        displayScore += self.levelStats.goodLineLength;
        displayScore += self.levelStats.baseHits * 500;

        // render profit
        var maxProfitW = 0;
        self.ctx.fillStyle = '#aaa';
        self.ctx.textAlign = 'right';
        self.ctx.font = 'bold 10px arial';
        var profitLabelW = self.ctx.measureText('Profit');
        self.ctx.fillText('Profit', self.cw-12, 20);

        self.ctx.fillStyle = '#fff';
        self.ctx.font = 'bold 12px arial';
        var profitValueW = self.ctx.measureText('$'+self.commas(self.levelStats.profit));
        self.ctx.fillText('$'+self.commas(self.levelStats.profit), self.cw-12, 37);

        maxProfitW = Math.max(profitLabelW.width, profitValueW.width);

        // render score
        self.ctx.fillStyle = '#aaa';
        self.ctx.textAlign = 'right';
        self.ctx.font = 'bold 10px arial';
        self.ctx.fillText('Score', self.cw-maxProfitW-36, 20);

        self.ctx.fillStyle = '#fff';
        self.ctx.font = 'bold 12px arial';
        self.ctx.fillText(self.commas(Math.round(displayScore)), self.cw-maxProfitW-36, 37);

        // render level bar
        self.ctx.fillStyle = '#222';
        self.ctx.fillRect(12, 30, 120, 8);
        self.ctx.fillStyle = 'hsl('+self.levelHue+', '+(50+(self.base.radius/self.base.goal)*50)+'%, '+(50+((Math.abs(180-self.base.goalPulseAngle))/180)*20)+'%)';
        self.ctx.fillRect(12, 30, (self.base.radius/self.base.goal)*120, 8);
        // bar highlight
        var grad = self.ctx.createLinearGradient(12, 30, 12, 34);
        grad.addColorStop(0, 'rgba(255,255,255,0)');
        grad.addColorStop(1, 'rgba(255,255,255,.2)');
        self.ctx.fillStyle = grad;
        self.ctx.fillRect(12, 30, 120, 4);

        // render power bar
        self.ctx.fillStyle = '#222';
        self.ctx.fillRect(156, 30, 120, 8);
        self.ctx.fillStyle = 'hsl(0, 0%, '+(((self.power.current/self.power.capacity)*60))+'%)';
        self.ctx.fillRect(156, 30, (self.power.current/self.power.capacity)*120, 8);
        // bar highlight
        grad = self.ctx.createLinearGradient(156, 30, 156, 34);
        grad.addColorStop(0, 'rgba(255,255,255,0)');
        grad.addColorStop(1, 'rgba(255,255,255,.2)');
        self.ctx.fillStyle = grad;
        self.ctx.fillRect(156, 30, 120, 4);

        // render powerup bar and text
        if(self.pwrupActive){
            self.ctx.fillStyle = '#aaa';
            self.ctx.textAlign = 'left';
            self.ctx.font = 'bold 10px arial';
            self.ctx.fillText(self.powerupRef[self.powerupType].name, 300, 20);

            self.ctx.fillStyle = '#222';
            self.ctx.fillRect(300, 30, 120, 8);
            self.ctx.fillStyle = 'hsl('+self.powerupRef[self.powerupType].hue+', 100%, '+(20+((self.pwrupTimer/self.pwrupTimerMax)*30))+'%)';
            self.ctx.fillRect(300, 30, (self.pwrupTimer/self.pwrupTimerMax)*120, 8);
            // bar highlight
            grad = self.ctx.createLinearGradient(300, 30, 300, 34);
            grad.addColorStop(0, 'rgba(255,255,255,0)');
            grad.addColorStop(1, 'rgba(255,255,255,.2)');
            self.ctx.fillStyle = grad;
            self.ctx.fillRect(300, 30, 120, 4);
        }
    }

    /*============================================================================================*/
    /* Level Ending */
    /*============================================================================================*/
    self.levelEndCycle = function(){
        if(self.levelEndStatus[0]){

            self.ctx.globalCompositeOperation = 'source-over';
            if(self.levelEndStatus[1]){
                self.destroyAll(self.badLines);
                self.rumbleLevel += .1 * self.dt;
                self.ctx.fillStyle = 'rgba(255,255,255,'+self.levelEndTick/self.levelEndTickMax+')';
            } else {
                self.destroyAll(self.goodLines);
                self.ctx.fillStyle = 'rgba(70,0,0,'+self.levelEndTick/self.levelEndTickMax+')';
            }
            self.ctx.fillRect(0, 0, self.cw, self.ch);
            self.ctx.globalCompositeOperation = 'lighter';

            if(self.levelEndTick >= self.levelEndTickMax){
                self.endLevel();
                self.ctx.restore();
                self.clear();
            } else {
                self.levelEndTick += 1 * self.dt;
            }

        }
    }

    self.endLevel = function(){
        cancelAnimationFrame(self.loopRAF);
        self.levelPlaying = false;
        self.levelStats.endTime = Date.now();
        self.levelStatsCB(self.levelEndStatus[1]);

        if(self.level >= self.user.highestLevelBeaten && self.levelEndStatus[1]){
            self.user.highestLevelBeaten = self.level+1;
        }

        if(self.levelEndStatus[1] && self.levelStats.baseHits === 0){
            self.user.levels[self.level].perfect = true;
        }

        self.user.funds += self.levelStats.profit;

        self.user.overall.linesCreated += self.levelStats.goodLineTotal;
        self.user.overall.lineLength += Math.round(self.levelStats.goodLineLength);
        self.user.overall.baseHits += self.levelStats.baseHits;
        self.user.overall.levelsPlayed += 1;
        self.user.overall.timePlayed += (self.levelStats.endTime - self.levelStats.startTime - self.levelStats.pauseTimeTotal);

        self.updateUser();
    }

    /*============================================================================================*/
    /* Gameplay Interaction / Event Binding */
    /*============================================================================================*/
    self.mousedownCB = function(){
        self.mousedown = true;
        if(!self.menuMode){
            self.tempPointStart = {x: self.mx, y: self.my};
        }
    }

    self.mouseupCB = function(){
        self.mousedown = false;
        if(!self.menuMode){
            // Make sure the mouse has moved
            if(self.tempPointStart.x != self.tempPointEnd.x || self.tempPointStart.y != self.tempPointEnd.y){
                //var randSound = self.rand(1, audioMax.endLine);
                //audio.playSound('endLine-'+randSound, self.settings.sound);
                audio.play( 'endLine', self.settings.sound );
                self.goodLines.push(new self.goodLine(self.tempPointStart, self.tempPointEnd));
                self.power.current -= self.tempPointLength;
            }
        }
    }

    self.mousemoveCB = function(e){
        self.mx = e.pageX - self.c.offsetLeft - self.gameWrap.offsetLeft;
        self.my = e.pageY - self.c.offsetTop - self.gameWrap.offsetTop;
    }

    self.bindGameplayEvents = function(){
        doc.addEventListener('mousedown', self.mousedownCB, false);
        doc.addEventListener('mouseup', self.mouseupCB, false);
        doc.addEventListener('mousemove', self.mousemoveCB, false);
    }

    /*============================================================================================*/
    /* Sync Level and Upgrade DOM Elements to user object */
    /*============================================================================================*/
    self.syncDOM = function(){
        // funds
        self.fundsDisplay.innerHTML = (self.checkMaxUpgrades()) ? '$ Maxed' : '$'+self.commas(self.user.funds);

        // upgrades
        var i = self.upgradeButtons.length;
        while(i--){
            var _this = self.upgradeButtons[i];
            var upgradeParent = _this.getAttribute('data-parent');
            var upgradeSpecific = _this.getAttribute('data-specific');
            var upgradeLevel = self.user.upgrades[upgradeParent][upgradeSpecific];
            var nextLevelCost = self.upgrades[upgradeParent][upgradeSpecific].cost[upgradeLevel] || false;

            // set level class
            self.rmvClass(_this, 'upg0');
            self.rmvClass(_this, 'upg1');
            self.rmvClass(_this, 'upg2');
            self.rmvClass(_this, 'upg3');
            self.rmvClass(_this, 'upg4');
            self.rmvClass(_this, 'upg5');
            self.addClass(_this, 'upg'+upgradeLevel);

            // set cost display
            var costSpan = _this.querySelectorAll('.cost');
            var availability = (!nextLevelCost || nextLevelCost <= self.user.funds);
            var availabilityText = (availability) ? '<i class="available">Available</i>' : '<i class="unavailable">Unavailable</i>';
            costSpan[0].innerHTML = (!nextLevelCost) ? 'Maxed' : '$'+self.commas(nextLevelCost)+' - '+availabilityText;

            // disable if can't afford
            if(!availability){
                self.addClass(_this, 'disabled');
            } else {
                self.rmvClass(_this, 'disabled')	;
            }

            // set max class if maxed
            if(!nextLevelCost){
                self.addClass(_this, 'max');
            } else {
                self.rmvClass(_this, 'max');
            }
        }

        // levels
        i = self.levelButtons.length;
        while(i--){
            if(i > self.user.highestLevelBeaten){
                self.addClass(self.levelButtons[i], 'disabled');
            } else {
                self.rmvClass(self.levelButtons[i], 'disabled');
            }

            if(self.user.levels[i].perfect){
                self.addClass(self.levelButtons[i], 'perfect-level');
            } else {
                self.rmvClass(self.levelButtons[i], 'perfect-level');
            }

            self.levelScores[i].innerHTML = (self.user.levels[i].score == 0) ? '&#8709;' : self.commas(self.user.levels[i].score);
        }

        // set completed levels and perfect levels display
        var levelsPerfect = 0;
        var levelLength = self.user.levels.length;
        for(i = 0; i < levelLength; i++){
            if(self.user.levels[i].perfect){
                levelsPerfect++;
            }
        }

        self.completedLevelsDisplay.innerHTML = self.user.highestLevelBeaten;
        self.perfectLevelsDisplay.innerHTML = levelsPerfect;

    }

    /*============================================================================================*/
    /* Menu Interaction / Event Binding */
    /*============================================================================================*/
    // menu content
    self.menus = doc.querySelectorAll('.menu');
    self.dom.menuAudio = $('#audio-select');
    self.dom.bottomNav = $('#bottom-nav');
    self.mainMenu = self.get('main');
    self.pauseMenu = self.get('pause');
    self.upgradesLevelsMenu = self.get('upgrades-levels');
    self.levelStatsMenu = self.get('level-stats');
    self.overallStatsMenu = self.get('overall-stats');

    // level stats content
    self.statsStatus = self.get('stats-status');
    self.statsDuration = self.get('stats-duration');
    self.statsLinesCreated = self.get('stats-lines-created');
    self.statsTotalLineLength = self.get('stats-total-line-length');
    self.statsBaseHits = self.get('stats-base-hits');
    self.statsPowerupsCollected = self.get('stats-powerups-collected');
    self.statsCoinsCollected = self.get('stats-coins-collected');
    self.statsProfit = self.get('stats-profit');
    self.statsScore = self.get('stats-score');

    // overall stats content
    self.overallStatsLinesCreated = self.get('overall-lines-created');
    self.overallStatsLineLength = self.get('overall-line-length');
    self.overallStatsLevelsPlayed = self.get('overall-levels-played');
    self.overallStatsTimePlayed = self.get('overall-time-played');
    self.overallStatsBaseHits = self.get('overall-base-hits');

    self.dom.buttonAudioTrue = $('#audio-true');
    self.dom.buttonAudioFalse = $('#audio-false');
    self.playGameButton = self.get('play-game-button');
    self.retryLevelButton = self.get('retry-level-button');
    self.returnToMenuButton = self.get('return-to-menu-button');
    self.returnToMenuButton2 = self.get('return-to-menu-button2');
    self.returnToUpgradesLevelsButton = self.get('return-to-upgrades-levels-button');
    self.resumeLevelButton = self.get('resume-level-button');
    self.quitLevelButton = self.get('quit-level-button');
    self.resetGameDataButton = self.get('reset-game-data-button');
    self.overallStatsButton = self.get('overall-stats-button');
    self.upgradeButtons = doc.querySelectorAll('.upgrade');
    self.levelButtons = doc.querySelectorAll('.level');
    self.levelScoreButtons = doc.querySelectorAll('.level-scores');

    // misc
    self.levelScores = doc.querySelectorAll('.level-score');
    self.completedLevelsDisplay = self.get('completed-levels');
    self.perfectLevelsDisplay = self.get('perfect-levels');
    self.fundsDisplay = self.get('funds');
    self.pausedTitle = self.get('paused-title');
    self.musicElem = $('#music');

    // hide all menus
    self.hideMenus = function(){
        /*var i = self.menus.length;
        while(i--){
            self.menus[i].style.display = 'none';
        }*/
        $(self.menus).fadeTo(self.animationSpeed, 0, function(){
            $(this).hide();
        });
    }

    // button/menu callbacks
    self.playGameCB = function(e){
        e.preventDefault();
        self.hideMenus();
        //self.upgradesLevelsMenu.style.display = 'block';
        $(self.upgradesLevelsMenu).stop().fadeTo(self.animationSpeed, 1);
    }

    self.startLevelCB = function(e){
        e.preventDefault();
        if(!self.hasClass(this, 'disabled')){
            self.hideMenus();
            var levelNumber = parseInt(this.getAttribute('rel'), 10);
            self.initLevel(levelNumber);
        }
    }

    self.pauseLevelCB = function(e){
        if(e.keyCode == '32'){
            e.preventDefault();
            self.pauseLevel();
        }
    }

    self.pauseLevel = function(e){
        if(e){
            e.preventDefault();
        }
        if(self.levelPlaying){
            $('#toggle-pause').toggleClass('off');
            if(!self.menuMode){
                // pause title
                self.pausedTitle.innerHTML = 'Level '+(self.level+1)+' Paused';
                self.levelStats.pauseStartTime = Date.now();
                self.menuMode = true;
                $(self.pauseMenu).stop().fadeTo(self.animationSpeed, 1);
            } else {
                self.hideMenus();
                setTimeout(function(){
                    self.menuMode = false;
                    self.oldTime = Date.now();
                    self.loop();
                    self.levelStats.pauseTimeTotal += Date.now() - self.levelStats.pauseStartTime;
                }, 500);
            }
        }
    }

    self.retryLevelCB = function(e){
        e.preventDefault();
        //clearTimeout(self.loopTimeout);
        cancelAnimationFrame(self.loopRAF);
        self.hideMenus();
        self.initLevel(self.level);
    };

    self.returnToMenuCB = function(e){
        e.preventDefault();
        //clearTimeout(self.loopTimeout);
        cancelAnimationFrame(self.loopRAF);
        self.hideMenus();
        //self.mainMenu.style.display = 'block';
        $(self.mainMenu).stop().fadeTo(self.animationSpeed, 1);
    };

    self.returnToUpgradesLevelsCB = function(e){
        e.preventDefault();
        //clearTimeout(self.loopTimeout);
        cancelAnimationFrame(self.loopRAF);
        self.hideMenus();
        //self.upgradesLevelsMenu.style.display = 'block';
        $(self.upgradesLevelsMenu).stop().fadeTo(self.animationSpeed, 1);
    };

    self.quitLevelCB = function(e){
        e.preventDefault();
        $('#toggle-pause').toggleClass('off');
        self.hideMenus();
        self.menuMode = false;
        //self.levelEndTick = self.levelEndTickMax;
        self.loop();
        self.base.radius = 0;
    };

    self.resetGameDataCB = function(e){
        e.preventDefault();
        var confirmation = confirm('Are you sure you want to reset your game data? This cannot be undone.');
        if(confirmation){
            self.clearUser();
        }
    }

    self.upgradeButtonCB = function(e){
        e.preventDefault();
        if(e.target.className != 'tip'){
            if(self.hasClass(this, 'disabled')){
                //var randSound = self.rand(1, audioMax.error);
                //audio.playSound('error-1', self.settings.sound);
                audio.play( 'error', self.settings.sound );
                self.addClass(self.fundsDisplay, 'not-enough');
                setTimeout(function(){
                    self.rmvClass(self.fundsDisplay, 'not-enough');
                }, 300);
            }

            if(!self.hasClass(this, 'disabled') && !self.hasClass(this, 'max')){
                //var randSound = self.rand(1, audioMax.upgrade);
                //audio.playSound('upgrade-1', self.settings.sound);
                audio.play( 'upgrade', self.settings.sound );
                var upgradeParent = this.getAttribute('data-parent');
                var upgradeSpecific = this.getAttribute('data-specific');
                var upgradeLevel = self.user.upgrades[upgradeParent][upgradeSpecific];
                var nextLevelCost = self.upgrades[upgradeParent][upgradeSpecific].cost[upgradeLevel] || false;
                self.user.upgrades[upgradeParent][upgradeSpecific]++;
                self.user.funds-= nextLevelCost;

                self.updateUser();
            }
        }
    }

    self.levelStatsCB = function(status){
        self.menuMode = true;
        self.hideMenus();

        var milliseconds = self.levelStats.endTime - self.levelStats.startTime - self.levelStats.pauseTimeTotal;
        var minutes = Math.floor(milliseconds / 1000 / 60);
        var seconds = Math.floor(milliseconds / 1000) % 60;

        var newBestScore = '';
        self.levelStats.score = 0;
        self.levelStats.score += seconds * 100;
        self.levelStats.score += self.levelStats.goodLineTotal * 100;
        self.levelStats.score += self.levelStats.goodLineLength;
        self.levelStats.score += self.levelStats.baseHits * 500;

        // re render after score to display correctly
        seconds = (seconds < 10) ? '0'+seconds : seconds;

        if(status){
            if(self.user.levels[self.level].score == 0 || (self.levelStats.score < self.user.levels[self.level].score)){
                self.user.levels[self.level].score = Math.round(self.levelStats.score);
                newBestScore = '<br /><span class="best-score">New Personal Best!</span>';
            }
        }

        self.retryLevelButton.style.display = (status) ? 'none' : 'block';
        self.statsStatus.innerHTML = (status) ? '<span class="level-success">Level '+(self.level+1)+' Completed Successfully' : '<span class="level-fail">Level '+(self.level+1)+' Failed</span>';
        self.statsDuration.innerHTML = minutes+':'+seconds;
        self.statsLinesCreated.innerHTML = self.levelStats.goodLineTotal;
        self.statsTotalLineLength.innerHTML = (self.levelStats.goodLineTotal >= 1) ? Math.round(self.levelStats.goodLineLength)+'px <span class="td-note">('+Math.round(self.levelStats.goodLineLength / self.levelStats.goodLineTotal)+' Avg.)<\/span>' : 0;
        self.statsBaseHits.innerHTML = (status && self.levelStats.baseHits === 0) ? self.levelStats.baseHits+' <span class="perfect">Perfect!</span>' : self.levelStats.baseHits;
        self.statsPowerupsCollected.innerHTML = self.levelStats.powerupsCollected;
        self.statsCoinsCollected.innerHTML = self.levelStats.coinsCollected;
        self.statsProfit.innerHTML = '$'+self.commas(self.levelStats.profit);
        self.statsScore.innerHTML = (status) ? self.commas(Math.round(self.levelStats.score))+' <span class="td-note">(Lower is Better)</span>'+newBestScore : self.commas(Math.round(self.levelStats.score))+' <span class="td-note na">(Not Applied)</span>';

        $(self.levelStatsMenu).stop().fadeTo(self.animationSpeed, 1);

    }

    self.overallStatsCB = function(e){
        e.preventDefault();
        self.menuMode = true;
        self.hideMenus();
        var milliseconds = self.user.overall.timePlayed;
        var minutes = Math.floor(milliseconds / 1000 / 60);
        var seconds = Math.floor(milliseconds / 1000) % 60;
        seconds = (seconds < 10) ? '0'+seconds : seconds;

        self.overallStatsLinesCreated.innerHTML = self.commas(self.user.overall.linesCreated);
        self.overallStatsLineLength.innerHTML = self.commas(self.user.overall.lineLength)+' <em class="td-note">(pixels)</em><br /><em class="td-note">That\'s</em> '+((self.user.overall.lineLength / 72) / 12).toFixed(1)+' <em class="td-note">feet at 72ppi</em>';
        self.overallStatsLevelsPlayed.innerHTML = self.commas(self.user.overall.levelsPlayed);
        self.overallStatsTimePlayed.innerHTML = minutes+':'+seconds+' <em class="td-note">(minutes:seconds)</em>';
        self.overallStatsBaseHits.innerHTML = self.commas(self.user.overall.baseHits);

        $(self.overallStatsMenu).stop().fadeTo(self.animationSpeed, 1);
    }

    // bind button events
    self.bindMenuEvents = function(){
        doc.addEventListener('keydown', self.pauseLevelCB, false);
        self.playGameButton.addEventListener('click', self.playGameCB, false);
        self.retryLevelButton.addEventListener('click', self.retryLevelCB, false);
        self.returnToMenuButton.addEventListener('click', self.returnToMenuCB, false);
        self.returnToMenuButton2.addEventListener('click', self.returnToMenuCB, false);
        self.returnToUpgradesLevelsButton.addEventListener('click', self.returnToUpgradesLevelsCB, false);
        self.resumeLevelButton.addEventListener('click', self.pauseLevel, false);
        self.quitLevelButton.addEventListener('click', self.quitLevelCB, false);
        self.resetGameDataButton.addEventListener('click', self.resetGameDataCB, false);
        self.overallStatsButton.addEventListener('click', self.overallStatsCB, false);

        // set intial audio and go to main menu
        self.dom.buttonAudioTrue.on('click', function(e){
            e.preventDefault();
            self.settings.sound = true;
            self.hideMenus();
            self.dom.bottomNav.stop().fadeTo(self.animationSpeed, 1);
            $(self.mainMenu).stop().fadeTo(self.animationSpeed, 1, function(){
                self.settings.music = true;
                $('#music')[0].play();
            });
        });

        self.dom.buttonAudioFalse.on('click', function(e){
            e.preventDefault();
            $('#toggle-music').addClass('off');
            $('#toggle-sound').addClass('off');
            self.hideMenus();
            self.dom.bottomNav.stop().fadeTo(self.animationSpeed, 1);
            $(self.mainMenu).stop().fadeTo(self.animationSpeed, 1);
        });

        // bind all upgrade buttons
        var i = self.upgradeButtons.length;
        while(i--){
            self.upgradeButtons[i].addEventListener('click', self.upgradeButtonCB, false);
        }

        // bind all levels
        i = self.levelButtons.length;
        while(i--){
            self.levelButtons[i].addEventListener('click', self.startLevelCB, false);
        }

        $('#game-wrap').on('mouseenter', '.button:not(.disabled, .max), #bottom-nav a', function(){
            //var randSound = self.rand(1, audioMax.hover);
            //audio.playSound('hover-1', self.settings.sound);
            audio.play( 'hover', self.settings.sound );
        });

        $('#game-wrap').on('click', '.button:not(.disabled, .max), #bottom-nav a', function(){
            //var randSound = self.rand(1, audioMax.click);
            //audio.playSound('click-1', self.settings.sound);
            audio.play( 'click', self.settings.sound );
        });

        $('#toggle-pause').on('click', function(e){
            e.preventDefault();
            self.pauseLevel();
        });

        $('#toggle-music').on('click', function(e){
            e.preventDefault();
            self.settings.music = !self.settings.music;
            $(this).toggleClass('off');
            if(self.settings.music){
                $('#music')[0].currentTime = 0;
                $('#music')[0].play();
            } else {
                $('#music')[0].pause();
            }
            self.updateUser();
        });

        $('#toggle-sound').on('click', function(e){
            e.preventDefault();
            self.settings.sound = !self.settings.sound;
            $(this).toggleClass('off');
            self.updateUser();
        });

        $('#toggle-hud').on('click', function(e){
            e.preventDefault();
            self.settings.hud = !self.settings.hud;
            $(this).toggleClass('off');
            self.updateUser();
        });

    }

    /*============================================================================================*/
    /* Game Loop */
    /*============================================================================================*/
    self.loop = function(){

        if(!self.menuMode){
            self.loopRAF = requestAnimationFrame(self.loop, self.c);
        }

        // delta
        self.updateDelta();

        //save before rumble
        if(self.rumbleLevel > 0){
            self.rumble = true;
            self.updateRumble();

            var xRand = self.rand(0, self.rumbleLevel/4)-self.rumbleLevel/8;
            var yRand = self.rand(0, self.rumbleLevel/4)-self.rumbleLevel/8;

            self.ctx.save();
            self.ctx.translate(xRand, yRand);

        }

        // clear
        self.clear();

        // stars
        self.updateAll(self.stars);
        self.renderAll(self.stars);

        // base goal below everything else
        self.renderBaseGoal()

        // coins
        self.updateAll(self.coins);
        self.renderAll(self.coins);
        self.checkCoinPowerup();

        // powerups
        self.updateAll(self.powerups);
        self.renderAll(self.powerups);
        self.updateActivePowerup();

        // bad lines
        self.makebadLines();
        self.updateAll(self.badLines);
        self.renderAll(self.badLines);

        // power
        self.updatePower();

        // good lines
        self.updateAll(self.goodLines);
        self.renderAll(self.goodLines);

        // base
        self.updateBase();
        self.renderBase();

        // orbs
        self.updateAll(self.orbs);
        self.renderAll(self.orbs);

        // blasts
        self.updateAll(self.blasts);
        self.renderAll(self.blasts);

        // debris
        self.updateAll(self.debris);
        self.renderAll(self.debris);

        // level end cycle
        self.levelEndCycle();

        // restore after rumble
        if(self.rumble){
            self.ctx.restore();
            self.rumble = false;
        }

        // tracer
        self.renderTracer();

        // user interface
        self.updateUI();
        if(self.settings.hud && self.levelPlaying){
            self.renderUI();
        }

        // increase level tick count
        self.levelStats.ticks++;

        // Array length debugging
        //console.log('Orbs: ' + self.orbs.length);
        //console.log('Debris: ' + self.debris.length);
        //console.log('goodLines: ' + self.goodLines.length);
        //console.log('badLines: ' + self.badLines.length);
        //console.log('Blasts: ' + self.blasts.length);
        //console.log('Stars: ' + self.stars.length);
        //console.log('Powerups: ' + self.powerups.length);
        //console.log('Coins: ' + self.coins.length);

    } // end loop

} // end game

$(window).load(function(){
    $('#loading').fadeTo(800, 0, function(){
        $(this).remove();
        setTimeout(function(){
            $('#cover').fadeTo(800, 0, function(){
                $(this).remove();
            });
            var sp = new SpacePi();
            sp.initGame();
        }, 3000);
    });


});