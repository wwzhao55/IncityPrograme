var hideLoading = function () {
    if (load1 && load3) {
        $('#loading').hide();
        $('#guide').show();
        $('#yl_logo').hide();
        setTimeout(function () {
            $('#guide').hide();
        }, 2000);
    }
};

var direction = "no";
var recordTime = 7;
function handleOrientation(orientData) {
    var gamma = orientData.gamma;
    if (gamma>=10) {
        direction = "right";
    }
    if (gamma<=-10) {
        direction = "left";
    }
    if (gamma<10&&gamma>-10) {
        direction = "no";
    }
}
window.addEventListener('deviceorientation',handleOrientation,true);

var stat = function (id) {
    wx.getLocation({
        type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
        success: function (res) {
            var latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
            var longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
            $.ajax({
                url:'/weixin/record.php',
                data:{
                    latitude:latitude,
                    longitude:longitude,
                    openid:openid,
                    source:source,
                    game:id,
                    page:1
                },
                type:'post',
                dataType:'json',
                success:function(result){
                    if(result.status=='success'){

                    }else{
                        //alert('记录失败');
                    }
                }
            });
        }
    });
};

var Audio, timer, time = 1;

var musicStatus = {
    userSet: null,
    status: 'on'
};

var toggleMusic = function (status) {
    if (status === undefined) {
        if (musicStatus.status === 'on') {
            // Stop music, change icon
            Audio.pause();
            $('#music_btn').attr("src","images/music_off.png");
            $('#music_btn').css('transform','rotate(0deg)');
            clearInterval(timer);
            musicStatus.status = 'off';
            musicStatus.userSet = 'off';
        } else {
            // Start music, change icon
            Audio.play();
            $('#music_btn').attr("src","images/music_on.png");
            timer=setInterval(function(){
                time=time+1;
                $('#music_btn').css('transform','rotate('+time+'deg)')
            },20);
            musicStatus.status = 'on';
            musicStatus.userSet = 'on';
        }
        return;
    }
    if (status === musicStatus.status) return;
    if (!musicStatus.userSet || musicStatus.userSet === 'on') {
        if (status === 'on') {
            // Start music, change icon
            Audio.play();
            $('#music_btn').attr("src","images/music_on.png");
            timer=setInterval(function(){
                time=time+1;
                $('#music_btn').css('transform','rotate('+time+'deg)')
            },20);
            musicStatus.status = 'on';
        } else {
            Audio.pause();
            $('#music_btn').attr("src","images/music_off.png");
            $('#music_btn').css('transform','rotate(0deg)');
            clearInterval(timer);
            // Stop music, change icon
            musicStatus.status = 'off';
        }
    }
};

$(function (){
    $('#music_btn').click(function () {
        toggleMusic();
    });
    $('#video_btn').click(function () {
        window.location.href = 'http://incity.dataguiding.com/ruleindex.html';
    });
    timer = setInterval(function(){
        time=time+1;
        $('#music_btn').css('transform','rotate('+time+'deg)')
    }, 20);
    Audio = document.getElementById('bg_audio');
    Audio.myPlay = function () {
        var ua = navigator.userAgent.toLowerCase();
        if (/micromessenger/.test(ua)) {
            wx.ready(function () {
                Audio.play();
            })
        } else {
            this.play();
        }
    };
    Audio.myPause = function () {
        var ua = navigator.userAgent.toLowerCase();
        if (/micromessenger/.test(ua)) {
            wx.ready(function () {
                Audio.pause();
            })
        } else {
            this.pause();
        }
    };
    setTimeout(function () {
        game.state.start('Preloader');
    }, 2000);
});

var showGame = function (gameId) {
    if (load2) {
        switch (gameId) {
            case 1:
                var game1E = $('#game1');
                game1E.show();
                game.state.add('Game1', Games.Game1);
                game.state.start('Game1');
                game1E.click(function () {
                    game1E.hide();
                    game.gameResumed();
                });
                stat(1);
                break;
            case 2:
                var game2E = $('#game2');
                game2E.show();
                game.state.add('Game2', Games.Game2);
                game.state.start('Game2');
                game2E.click(function () {
                    game2E.hide();
                    game.gameResumed();
                });
                stat(2);
                break;
            case 3:
                var game3E = $('#game3');
                game3E.show();
                game.state.add('Game3', Games.Game3);
                game.state.start('Game3');
                game3E.click(function () {
                    game3E.hide();
                    game.gameResumed();
                });
                stat(3);
                break;
            case 4:
                var game4E = $('#game4');
                game4E.show();
                game.state.add('Game4', Games.Game4);
                game.state.start('Game4');
                toggleMusic('off');
                game4E.click(function () {
                    game4E.hide();
                    game.gameResumed();
                });
                stat(4);
                break;
            default:
                console.error("Unknown Game ID" + gameId);
        }
        $('#game').show();
    } else {
        gameShow = gameId;
    }
};

var gameShow = -1;
var game = new Phaser.Game(750, 1206, Phaser.CANVAS, 'game');
game.state.add('Preloader', Games.Preloader);