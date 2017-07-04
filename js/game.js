var Games = {};
var Times = [7, 10, 15];

Games.Preloader = function (game) {
};

Games.Preloader.prototype = {
    preload: function () {
        // Common
        this.game.load.image('retry', "images/retry.png");
        this.game.load.image('return', "images/return.png");
        this.game.load.image('fail', "images/fail.png");
        this.game.load.image('finish', "images/finish.png");
        this.game.load.image('continue', "images/continue.png");
        this.game.load.image('record', "images/record.png");
        this.game.load.image('back', "images/back.png");
        this.game.load.image('copyright', "images/copyright.png");
        this.game.load.image('logo', "images/logo.png");

        // Jump
        this.game.load.image('maskJump', "images/maskjump.jpg");
        this.game.load.image('bgJump', "images/bgjump.jpg");
        this.game.load.image('bg2Jump', "images/bg2jump.png");
        this.game.load.atlas('ledgeJump', "images/ledgejump.png", "images/ledgejump.json");
        this.game.load.image('playerJump', "images/playerjump.png");
        this.game.load.image('boundJump', "images/boundjump.png");
        // Color
        this.game.load.image('maskColor', "images/maskcolor.jpg");
        this.game.load.image('bgColor', "images/bgcolor.jpg");
        this.game.load.image('trollColor', "images/objcolor.png");
        this.game.load.atlas('partsColor', "images/partscolor.png", "images/partscolor.json");
        this.game.load.image('completeColor', "images/completecolor.png");
        // Share
        this.game.load.image('maskShare', "images/maskshare.jpg");
        this.game.load.image('bgShare', "images/bgshare.jpg");
        this.game.load.atlas('boxesShare', "images/box.png", "images/box.json");
        this.game.load.image('carShare', "images/carshare.png");
        this.game.load.physics("physicsShare", "images/physicsshare.json");
        this.game.load.spritesheet('carmanShare', "images/carman.png", 107, 152, 10);
        // Music
        this.game.load.image('maskMusic', "images/maskmusic.jpg");
        this.game.load.image('bgMusic', "images/bgmusic.jpg");
        this.game.load.atlas('notesMusic', "images/notesmusic.png", "images/notesmusic.json");
        this.game.load.image('groundMusic', "images/groundmusic.png");
        this.game.load.image('trollMusic', "images/trollmusic.png");
        this.game.load.image('clockMusic', "images/clockmusic.png");
        this.game.load.audio('effect1Music', 'images/effect1.mp3');
        this.game.load.audio('effect2Music', 'images/effect2.mp3');
        this.game.load.audio('effect3Music', 'images/effect3.mp3');
        this.game.load.audio('effect4Music', 'images/effect4.mp3');
    },

    create: function () {
        load2 = true;
        if (gameShow > 0) showGame(gameShow);
    }
};

Games.Game1 = function (game) {

};

Games.Game1.prototype = {
    player: null,
    ledges: null,
    compa: null,
    cursors: null,
    gameOver: false,
    timeText: null,
    timeLeft: 30,
    win: false,

    initVar: function () {
        this.player = null;
        this.ledges = null;
        this.compa = null;
        this.cursors = null;
        this.gameOver = false;
    },

    create: function () {
        this.initVar();
        this.game.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.gamePaused();
        this.game.stage.backgroundColor = "#279DDB";
        this.game.add.sprite(0,0, 'bgJump');
        this.game.camera.bounds = null;
        this.ledges = this.game.add.group();
        this.ledges.enableBody = true;
        this.ledges.physicsBodyTypes = Phaser.Physics.ARCADE;
        this.cursors = this.game.input.keyboard.createCursorKeys();
        this.spawnPlayer();
        //this.loadLedge();

        this.timeText = this.game.add.text(this.world.width - 30, 40, '00:30', { font: "36px Arial", fill: '#FA485B' });
        this.timeText.anchor.setTo(1, 0);
        this.timeText.fixedToCamera = true;
        var clock = this.game.add.sprite(this.world.width - 144, 45, 'clockMusic');
        clock.anchor.setTo(1, 0);
        clock.fixedToCamera = true;
        this.game.time.events.start();
        this.game.time.events.loop(Phaser.Timer.SECOND, this.updateTime, this);

        // Copyright & Logo
        var logo = this.game.add.sprite(310, 40, 'logo');
        logo.fixedToCamera = true;
        var copyright = this.game.add.sprite(this.world.width / 2, this.world.height - 38, 'copyright');
        copyright.anchor.setTo(0.5, 1);
        copyright.fixedToCamera = true;

        // Add Back Button
        this.back = this.game.add.sprite(30, 40, 'back');
        this.back.inputEnabled = true;
        this.back.fixedToCamera = true;
        this.back.events.onInputDown.add(function () {
            $('#game').hide();
            game.state.remove('Game1');
        });
    },

    update: function () {
        if (this.gameOver) return;
        this.game.physics.arcade.collide(this.player, this.ledges, this.jump, null , this);
        this.game.physics.arcade.collide(this.player, this.bottomBound, this.jumpHight, null, this);

        if(this.game.camera.y < this.compa) {
            this.spawnLedge(this.game.camera.y);
            this.compa = this.game.camera.y - 350;
        }

        var nextY = this.player.y - 350;
        if(nextY < this.game.camera.y) {
            this.game.camera.y = nextY;
        }
        if(this.game.physics.arcade.distanceBetween(this.game.camera, this.player) > 1206) {
            this.killPlayer();
        }

        if(this.player.x > 750) {
            this.player.x = 0;
        }
        if(this.player.x < 0) {
            this.player.x = 750;
        }

        if (this.cursors.left.isDown || direction === "left") {
            this.player.body.velocity.x = -600;
            this.win = true;
        }
        else if (this.cursors.right.isDown || direction === "right") {
            this.player.body.velocity.x = 600;
            this.win = true;
        }
        else {
            this.player.body.velocity.x = 0;
        }

        if(this.game.physics.arcade.distanceBetween(this.ledges.getAt(0), this.camera) > 1206) {
            this.ledges.getAt(0).destroy();
        }
    },

    spawnPlayer : function() {
        this.player = this.game.add.sprite(444, this.world.height - 550, 'playerJump');
        this.player.anchor.setTo(0.5,0.5);
        this.game.physics.arcade.enable(this.player);
        this.player.body.gravity.y = 1800;
        this.player.body.setSize(50, 20, 22, 230);
        var ledge = this.ledges.create(380, this.world.height - 400, 'ledgeJump');
        ledge.body.immovable = true;
        ledge.body.setSize(168, 33, 50, 0);
        ledge.body.checkCollision.down = false;
        var ledge2 = this.ledges.create(100, 450, 'ledgeJump');
        ledge2.body.setSize(168, 33, 50, 0);
        ledge2.body.checkCollision.down = false;
        ledge2.body.immovable = true;
        this.bottomBound = this.game.add.sprite(0, 0, 'boundJump');
        this.bottomBound.y = this.game.height - this.bottomBound.height;
        this.game.physics.arcade.enable(this.bottomBound);
        this.bottomBound.body.immovable = true;
    },

    jump : function() {
        this.player.body.velocity.y = -1300;
    },

    jumpHight: function () {
        this.player.body.velocity.y = -1600;
    },

    // loadLedge : function() {
    //     for(var i = 0; i < 4; i++) {
    //         var x = this.game.rnd.integerInRange(10, 560);
    //         var ledge = this.ledges.create(x, 500 - i*700, 'ledgeJump');
    //         ledge.body.setSize(266, 33, 0, 0);
    //         ledge.body.checkCollision.down = false;
    //         ledge.body.immovable = true;
    //     }
    // },

    spawnLedge : function(y) {
        var x = this.game.rnd.integerInRange(10, 560);
        var ledge = this.ledges.create(x,y, 'ledgeJump');
        ledge.frameName = 'ledge'+this.game.rnd.integerInRange(1, 4)+'jump.png';
        ledge.body.setSize(ledge.width - 60, ledge.height / 2, 30, 0);
        ledge.body.checkCollision.down = false;
        ledge.body.immovable = true;
    },

    updateTime: function () {
        if (this.timeLeft <= 0) {
            this.killPlayer();
        } else {
            this.timeLeft--;
            this.timeText.setText("00:"+(this.timeLeft < 10 ? '0' + this.timeLeft : this.timeLeft));
        }
    },

    killPlayer : function() {
        this.gameOver = true;
        this.game.time.events.stop();
        this.player.kill();
        this.back.kill();
        var finishLayer = this.game.add.group();
        finishLayer.fixedToCamera = true;
        var background = new Phaser.Graphics(this.game, 0, 0);
        background.beginFill(0x000000, 0);
        background.drawRect(0, 0, this.world.width, this.world.height);
        background.endFill();
        background.inputEnabled = true;
        finishLayer.add(background);
        if (this.win && this.timeLeft < 23) {
            this.frame = finishLayer.create(64, this.world.height - 104, 'finish');
            this.frame.anchor.setTo(0, 1);
            var newTime = Times[this.game.rnd.integerInRange(0, 2)];
            recordTime = recordTime > newTime ? recordTime : newTime;
            var recTime = this.game.add.text(520, 830, recordTime, {font: "36px Arial", fill: '#FA485B'});
            recTime.fixedToCamera = true;
            var contTravel = finishLayer.create(298, this.world.height - 214, 'continue');
            contTravel.anchor.setTo(0, 1);
            contTravel.inputEnabled = true;
            contTravel.events.onInputDown.add(function () {
                $('#game').hide();
                game.state.remove('Game1');
            }, this);
            var record = finishLayer.create(451, contTravel.y, 'record');
            record.anchor.setTo(0, 1);
            record.inputEnabled = true;
            record.events.onInputDown.add(function () {
                $('#game').hide();
                game.state.remove('Game1');
                window.location.href = 'share.html#' + recordTime + '&' + openid + '&' + source;
            });
        } else {
            finishLayer.create(25, 275, 'fail');
            var retHome = finishLayer.create(352, 618, 'return');
            retHome.inputEnabled = true;
            retHome.events.onInputDown.add(function () {
                $('#game').hide();
                game.state.remove('Game2');
            });
            var retry = finishLayer.create(503, 618, 'retry');
            retry.inputEnabled = true;
            retry.events.onInputDown.add(function () {
                game.state.remove('Game1');
                $('#game').hide();
                showGame(1);
            }, this);
        }
    }
};

Games.Game2 = function (game) {

};

Games.Game2.prototype = {
    parts:
        [
            'bluehair', 'body',      'clothes', 'cyanhair',   'darkbluehair',
            'face',     'greenhair', 'palette', 'purplehair', 'redhair'
        ],
    pos:
        [
            {x: 385,y: 609}, {x: 305,y: 747}, {x: 318,y: 780}, {x: 508,y: 638}, {x: 406,y: 554},
            {x: 331,y: 675}, {x: 366,y: 577}, {x: 440,y: 761}, {x: 406,y: 523}, {x: 301,y: 557}
        ],

    partsInitPos:
        [
            {x: 422,y:1003}, {x:  54,y: 244}, {x: 600,y:1021}, {x: 136,y: 700}, {x: 554,y: 868},
            {x: 534,y: 568}, {x: 284,y:1000}, {x: 406,y: 830}, {x: 506,y: 368}, {x: 174,y: 977}
        ],

    ready: [],

    create: function() {
        this.game.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
        this.game.gamePaused();
        this.game.add.sprite(0, 0, 'bgColor');
        this.game.add.sprite(194, 446, 'trollColor');
        var complete = this.game.add.sprite(this.world.width - 30, this.world.height - 170, 'completeColor');
        complete.anchor.setTo(1, 1);
        complete.inputEnabled = true;
        complete.events.onInputDown.add(this.finish, this);
        for (var i = 0; i < this.parts.length; i++) {
            var part = this.game.add.sprite(0, 0, 'partsColor');
            part.anchor.setTo(0.5, 0.5);
            part.partID = i;
            this.ready[i] = false;
            part.frameName = this.parts[i]+'.png';
            part.x = this.partsInitPos[i].x + part.width / 2;
            part.y = this.partsInitPos[i].y + part.height / 2;
            part.inputEnabled = true;
            part.input.enableDrag();
            part.input.pixelPerfectClick = true;
            part.events.onDragStop.add(this.stopDrag, this);
        }

        // Add Back Button
        this.back = this.game.add.sprite(30, 40, 'back');
        this.back.inputEnabled = true;
        this.back.fixedToCamera = true;
        this.back.events.onInputDown.add(function () {
            $('#game').hide();
            game.state.remove('Game2');
        });
    },

    stopDrag: function(part) {
        this.game.world.bringToTop(part);
        if (this.calcDistance(part.x, part.y, this.pos[part.partID].x, this.pos[part.partID].y) < 100) {
            part.x = this.pos[part.partID].x;
            part.y = this.pos[part.partID].y;
            this.ready[part.partID] = true;
        } else {
            this.ready[part.partID] = false;
            if (part.x < 100) part.x = 100;
            if (part.x > 650) part.x = 650;
            if (part.y < 100) part.y = 100;
            if (part.y > 1100) part.y = 1100;
        }
    },

    calcDistance: function(x1, y1, x2, y2) {
        return Math.abs(x1 - x2) + Math.abs(y1 -y2);
    },

    finish: function () {
        this.back.kill();
        var finishLayer = this.game.add.group();
        var background = new Phaser.Graphics(this.game, 0,0);
        background.beginFill(0x000000,0.4);
        background.drawRect(0, 0, this.world.width, this.world.height);
        background.endFill();
        background.inputEnabled = true;
        finishLayer.add(background);
        var ready = true;
        if (this.ready.length < this.parts.length)
            ready = false;
        else
            for (var i = 0; i < this.ready.length; i++) {
                if (!this.ready[i]) {
                    ready = false;
                    break;
                }
            }
        if (ready) {
            var frame = finishLayer.create(64, this.world.height - 284, 'finish');
            frame.anchor.setTo(0, 1);
            var newTime = Times[this.game.rnd.integerInRange(0, 2)];
            recordTime = recordTime > newTime ? recordTime : newTime;
            this.game.add.text(520, 650, recordTime, { font: "36px Arial", fill: '#FA485B' });
            var contTravel = finishLayer.create(298, this.world.height - 394, 'continue');
            contTravel.anchor.setTo(0, 1);
            contTravel.inputEnabled = true;
            contTravel.events.onInputDown.add(function () {
                $('#game').hide();
                game.state.remove('Game2');
            });
            var record = finishLayer.create(451, contTravel.y, 'record');
            record.anchor.setTo(0, 1);
            record.inputEnabled = true;
            record.events.onInputDown.add(function () {
                $('#game').hide();
                game.state.remove('Game2');
                console.log("Go To Record");
                window.location.href='share.html#'+recordTime + '&' + openid + '&' + source;
            });
        } else {
            finishLayer.create(25, 275, 'fail');
            var retHome = finishLayer.create(352, 618, 'return');
            retHome.inputEnabled = true;
            retHome.events.onInputDown.add(function () {
                $('#game').hide();
                game.state.remove('Game2');
            });
            var retry = finishLayer.create(503, 618, 'retry');
            retry.inputEnabled = true;
            retry.events.onInputDown.add(function () {
                game.state.remove('Game2');
                $('#game').hide();
                showGame(2);
            }, this);
        }
    }
};

Games.Game3 = function (game) {
};

Games.Game3.prototype = {
    car: null,
    box: null,
    boxTween: null,
    boxes: [],
    boxMaterial: null,
    gameOver: false,
    timeText: null,
    timeLeft: 30,
    tweenTime: 4000,
    win: false,

    create: function() {
        this.game.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
        this.game.gamePaused();
        this.world.setBounds(0, 0, this.world.bounds.width, 1600);
        this.game.physics.startSystem(Phaser.Physics.P2JS);
        this.game.physics.p2.gravity.y = 5000;
        this.game.physics.p2.world.defaultContactMaterial.friction = 0.6;
        this.game.physics.p2.world.setGlobalStiffness(1e999999);
        var worldMaterial = this.game.physics.p2.createMaterial('worldMaterial');
        this.boxMaterial = this.game.physics.p2.createMaterial('worldMaterial');
        this.game.physics.p2.createContactMaterial(worldMaterial, this.boxMaterial, { friction: 0.8 });
        this.game.physics.p2.setWorldMaterial(worldMaterial, true, true, true, true);
        var bg = this.game.add.sprite(this.game.width / 2, this.game.height / 2, 'bgShare');
        this.game.physics.p2.enable(bg);
        bg.body.static = true;
        bg.body.clearShapes();
        bg.body.loadPolygon("physicsShare", "bgshare");
        bg.body.setMaterial(worldMaterial);

        this.car = this.game.add.sprite(18, 146, 'carShare');
        var carTween = this.game.add.tween(this.car).to( { x: 750 }, this.tweenTime);
        carTween.onComplete.add(this.spawnCar, this);
        this.carman = this.game.add.sprite(270, 146, 'carmanShare');
        var walk = this.carman.animations.add('walk');
        this.carman.animations.play('walk', 5, true);
        var carmanTween = this.game.add.tween(this.carman).to( {x: this.carman.x + 732}, this.tweenTime);

        this.box = this.game.add.sprite(0, 0, 'boxesShare');
        this.box.boxType = game.rnd.integerInRange(1, 4);
        this.box.frameName = 'box'+this.box.boxType+'.png';
        this.box.x = (200 - this.box.width) /2;
        this.box.y = 164 - this.box.height;
        this.box.originY = this.box.y;
        this.boxTween = this.game.add.tween(this.box).to( { x: this.box.x + 732 }, this.tweenTime);
        this.boxTween.onComplete.add(this.spawnBox, this);
        this.box.inputEnabled = true;
        this.box.events.onInputDown.addOnce(this.onBox, this);

        carTween.start();
        carmanTween.start();
        this.boxTween.start();

        this.timeText = this.game.add.text(this.world.width - 30, 40, '00:30', { font: "36px Arial", fill: '#FA485B' });
        this.timeText.anchor.setTo(1, 0);
        var clock = this.game.add.sprite(this.world.width - 144, 45, 'clockMusic');
        clock.anchor.setTo(1, 0);
        this.game.time.events.start();
        this.game.time.events.loop(Phaser.Timer.SECOND, this.updateTime, this);

        // Add Back Button
        this.back = this.game.add.sprite(30, 40, 'back');
        this.back.inputEnabled = true;
        this.back.fixedToCamera = true;
        this.back.events.onInputDown.add(function () {
            $('#game').hide();
            game.state.remove('Game3');
			game.world.setBounds(0, 0, 750, 1206);
        });
    },

    update: function() {
        for (var i = 0; i < this.boxes.length; i++) {
            var box = this.boxes[i];
            if (box.y > 1300) {
                box.destroy();
                this.boxes.splice(i, 1);
            }
        }
    },

    spawnCar: function() {
        if (this.gameOver) return;
        this.car.x = 18;
        this.carman.x = 270;
        var carTween = game.add.tween(this.car).to( { x: 750 }, this.tweenTime);
        var carmanTween = this.game.add.tween(this.carman).to( {x: this.carman.x + 732}, this.tweenTime);
        carTween.onComplete.add(this.spawnCar, this);
        if (this.box.y > this.box.originY) {
            this.box = game.add.sprite(0, 0, 'boxesShare');
            this.box.boxType = game.rnd.integerInRange(1, 4);
            this.box.frameName = 'box'+this.box.boxType+'.png';
            this.box.x = (200 - this.box.width) /2;
            this.box.y = 164 - this.box.height;
            this.box.originY = this.box.y;
            this.boxTween = game.add.tween(this.box).to( { x: this.box.x + 732 }, this.tweenTime);
            this.boxTween.onComplete.add(this.spawnBox, this);
            this.box.inputEnabled = true;
            this.box.events.onInputDown.addOnce(this.onBox, this);
            this.boxTween.start();
        }
        carTween.start();
        carmanTween.start();
    },

    spawnBox: function() {
        if (this.gameOver) return;
        this.box.boxType = game.rnd.integerInRange(1, 4);
        this.box.frameName = 'box'+this.box.boxType+'.png';
        this.box.x = (200 - this.box.width) /2;
        this.box.y = 164 - this.box.height;
        this.box.originY = this.box.y;
        this.boxTween = game.add.tween(this.box).to( { x: this.box.x + 732 }, this.tweenTime);
        this.boxTween.onComplete.add(this.spawnBox, this);
        this.box.inputEnabled = true;
        this.box.events.onInputDown.addOnce(this.onBox, this);
        this.boxTween.start();
    },

    onBox: function(box) {
        game.tweens.remove(this.boxTween);
        box.x += box.width / 2;
        box.y += box.height / 2;
        game.physics.p2.enable(box);
        switch(box.frameName) {
            case 'box1.png':
                box.body.mass = 350;
                break;
            case 'box2.png':
                box.body.mass = 400;
                break;
            case 'box3.png':
                box.body.mass = 400;
                break;
            case 'box4.png':
                box.body.mass = 300;
        }
        box.body.setMaterial(this.boxMaterial);
        this.boxes.push(box);
        this.win = true;
    },

    updateTime: function () {
        if (this.timeLeft <= 0) {
            this.finish();
        } else {
            this.timeLeft--;
            this.timeText.setText("00:"+(this.timeLeft < 10 ? '0' + this.timeLeft : this.timeLeft));
        }
    },

    finish: function () {
        this.gameOver = true;
        this.game.time.events.stop();
        this.back.kill();
        var finishLayer = this.game.add.group();
        var background = new Phaser.Graphics(this.game, 0, 0);
        background.beginFill(0x000000, 0);
        background.drawRect(0, 0, this.world.width, this.world.height);
        background.endFill();
        background.inputEnabled = true;
        finishLayer.add(background);
        if (this.win) {
            var frame = finishLayer.create(64, this.world.height - 454, 'finish');
            frame.anchor.setTo(0, 1);
            var newTime = Times[this.game.rnd.integerInRange(0, 2)];
            recordTime = recordTime > newTime ? recordTime : newTime;
            this.game.add.text(520, 870, recordTime, {font: "36px Arial", fill: '#FA485B'});
            var contTravel = finishLayer.create(298, this.world.height - 564, 'continue');
            contTravel.anchor.setTo(0, 1);
            contTravel.inputEnabled = true;
            contTravel.events.onInputDown.add(function () {
                $('#game').hide();
                game.state.remove('Game3');
				game.world.setBounds(0, 0, 750, 1206);
            });
            var record = finishLayer.create(451, contTravel.y, 'record');
            record.anchor.setTo(0, 1);
            record.inputEnabled = true;
            record.events.onInputDown.add(function () {
                $('#game').hide();
                game.state.remove('Game3');
                game.world.setBounds(0, 0, 750, 1206);
                window.location.href = 'share.html#' + recordTime + '&' + openid + '&' + source;
            });
        } else {
            finishLayer.create(25, 275, 'fail');
            var retHome = finishLayer.create(352, 618, 'return');
            retHome.inputEnabled = true;
            retHome.events.onInputDown.add(function () {
                $('#game').hide();
                game.state.remove('Game2');
				game.world.setBounds(0, 0, 750, 1206);
            });
            var retry = finishLayer.create(503, 618, 'retry');
            retry.inputEnabled = true;
            retry.events.onInputDown.add(function () {
                game.state.remove('Game3');
                $('#game').hide();
				game.world.setBounds(0, 0, 750, 1206);
                showGame(3);
            }, this);
        }
    }
};

Games.Game4 = function (game) {
};

Games.Game4 = {

    effect: [],
    ground: null,
    notes: null,
    timeText: null,
    timeLeft: 15,
    gameOver: false,
    turn: 0,
    win: false,

    initVar: function () {
        this.ground = null;
        this.notes = null;
        this.timeText = null;
        this.timeLeft = 15;
        this.gameOver = false;
    },

    create: function () {
        this.initVar();
        this.game.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
        this.physics.startSystem(Phaser.Physics.ARCADE);
        this.world.setBounds(0, 0, this.game.width, this.game.height+100);
        this.camera.y += 100;

        this.game.gamePaused();
        this.ground = this.game.add.sprite(0, this.world.height, 'groundMusic');
        this.ground.anchor.setTo(0,1);
        this.physics.arcade.enable(this.ground);
        this.ground.body.immovable = true;

        this.game.add.sprite(0, 100, 'bgMusic');

        this.timeText = this.game.add.text(this.world.width - 30, 140, '00:15', { font: "36px Arial", fill: '#FA485B' });
        this.timeText.anchor.setTo(1, 0);
        var clock = this.game.add.sprite(this.world.width - 144, 145, 'clockMusic');
        clock.anchor.setTo(1, 0);
        this.notes = this.game.add.group();
        this.notes.enableBody = true;
        this.game.time.events.start();
        this.game.time.events.loop(Phaser.Timer.SECOND, this.updateTime, this);
        var troll = this.game.add.sprite(202, this.world.height - 54, 'trollMusic');
        troll.anchor.setTo(0, 1);

        this.effect[59] = game.add.audio('effect1Music');
        this.effect[60] = game.add.audio('effect2Music');
        this.effect[61] = game.add.audio('effect3Music');
        this.effect[62] = game.add.audio('effect4Music');

        // Add Back Button
        this.back = this.game.add.sprite(30, 140, 'back');
        this.back.inputEnabled = true;
        this.back.events.onInputDown.add(function () {
            $('#game').hide();
            game.state.remove('Game4');
			game.world.setBounds(0, 0, 750, 1206);
            toggleMusic('on');
        });
    },

    update: function () {
        if (this.gameOver) return;
        this.turn++;
        this.physics.arcade.overlap(this.ground, this.notes, this.killNote, null, this);
        var note,key;
        if (Math.random() > 0.5) {
            key = this.game.rnd.integerInRange(1, 58);
            note = this.notes.create(game.world.width / 2, 0, 'notesMusic');
            note.frameName = key + ".png";
            note.body.gravity.y = Math.random() * 300;
            note.body.gravity.x = Math.random() * 80 - 40;
            note.body.collideWorldBounds = true;
        }
        if (this.turn === 10) {
            key = this.game.rnd.integerInRange(59, 62);
            note = this.game.add.sprite(game.world.width / 2 + this.game.rnd.integerInRange(-300, 100), 0, 'notesMusic');
            note.frameName = key + ".png";
            note.effectName = key;
            note.inputEnabled = true;
            note.events.onInputDown.addOnce(this.pickSpecNote, this);
            var noteTween = this.game.add.tween(note).to({ x: this.game.rnd.integerInRange(50, 700), y: 1100 }, 3000);
            noteTween.onComplete.add(function (note) {
                note.destroy();
            });
            noteTween.start();
            this.turn = 0;
        }
    },

    pickSpecNote: function (note) {
        note.destroy();
        this.win = true;
        this.effect[note.effectName].play();
    },

    killNote: function (ground, note) {
        note.destroy();
    },

    updateTime: function () {
        if (this.timeLeft <= 0) {
            this.finish();
        } else {
            this.timeLeft--;
            this.timeText.setText("00:"+(this.timeLeft < 10 ? '0' + this.timeLeft : this.timeLeft));
        }
    },

    finish: function () {
        this.gameOver = true;
        this.game.time.events.stop();
        this.notes.callAll('kill');
        this.back.kill();
        var finishLayer = this.game.add.group();
        var background = new Phaser.Graphics(this.game, 0, 0);
        background.beginFill(0x000000, 0);
        background.drawRect(0, 0, this.world.width, this.world.height);
        background.endFill();
        background.inputEnabled = true;
        finishLayer.add(background);
        if (this.win) {
            var frame = finishLayer.create(64, this.world.height - 40, 'finish');
            frame.anchor.setTo(0, 1);
            var newTime = Times[this.game.rnd.integerInRange(0, 2)];
            recordTime = recordTime > newTime ? recordTime : newTime;
            this.game.add.text(520, 994, recordTime, {font: "36px Arial", fill: '#FA485B'});
            var contTravel = finishLayer.create(298, this.world.height - 164, 'continue');
            contTravel.anchor.setTo(0, 1);
            contTravel.inputEnabled = true;
            contTravel.events.onInputDown.add(function () {
                $('#game').hide();
                game.state.remove('Game4');
				game.world.setBounds(0, 0, 750, 1206);
                toggleMusic('on');
            });
            var record = finishLayer.create(451, contTravel.y, 'record');
            record.anchor.setTo(0, 1);
            record.inputEnabled = true;
            record.events.onInputDown.add(function () {
                $('#game').hide();
                game.state.remove('Game4');
				game.world.setBounds(0, 0, 750, 1206);
                window.location.href = 'share.html#' + recordTime + '&' + openid + '&' + source;
            });
        } else {
            finishLayer.create(25, 275, 'fail');
            var retHome = finishLayer.create(352, 618, 'return');
            retHome.inputEnabled = true;
            retHome.events.onInputDown.add(function () {
                $('#game').hide();
				game.world.setBounds(0, 0, 750, 1206);
                game.state.remove('Game4');
            });
            var retry = finishLayer.create(503, 618, 'retry');
            retry.inputEnabled = true;
            retry.events.onInputDown.add(function () {
                game.state.remove('Game4');
				game.world.setBounds(0, 0, 750, 1206);
                $('#game').hide();
                showGame(4);
            }, this);
        }
    }
};
