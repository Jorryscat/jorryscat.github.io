console.log("\n %c HeoMusic 开源静态音乐播放器 v1.3.1 %c https://github.com/zhheo/HeoMusic \n", "color: #fadfa3; background: #030307; padding:5px 0;", "background: #fadfa3; padding:5px 0;")
var volume = 0.8;

// 获取地址栏参数
// 创建URLSearchParams对象并传入URL中的查询字符串
const params = new URLSearchParams(window.location.search);
var heo = {
  // 音乐节目切换背景
  changeMusicBg: function (isChangeBg = true) {
    const heoMusicBg = document.getElementById("music_bg")
    

    if (isChangeBg) {
      // player loadeddata 会进入此处
      const musiccover = document.querySelector("#heoMusic-page .aplayer-pic");
      var img = new Image();
      img.src = extractValue(musiccover.style.backgroundImage);
      img.onload = function () {
        heoMusicBg.style.backgroundImage = musiccover.style.backgroundImage;
      };
    } else {
      // 第一次进入，绑定事件，改背景
      let timer = setInterval(() => {
        const musiccover = document.querySelector("#heoMusic-page .aplayer-pic");
        // 确保player加载完成
        // console.info(heoMusicBg);
        if (musiccover) {
          clearInterval(timer)
          //初始化音量
          document.querySelector('meting-js').aplayer.volume(0.8, true);
          // 绑定事件
          heo.addEventListenerChangeMusicBg();
        }
      }, 100)
    }
  },
  addEventListenerChangeMusicBg: function () {
    var currentAngle = 0; // 当前旋转角度
    const heoMusicPage = document.getElementById("heoMusic-page");
    const musicCover = heoMusicPage.querySelector("#heoMusic-page .aplayer-pic");
    
    heoMusicPage.querySelector("meting-js").aplayer.on('loadeddata', function () {
      heo.changeMusicBg();
    });
  
    heoMusicPage.querySelector("meting-js").aplayer.on('play', function () {
      console.log("kaishi",currentAngle)
      musicCover.classList.add('rotating'); // 开始旋转
      musicCover.classList.remove('slow-stop'); // 移除慢停动画
  
      // 更新当前角度
      setInterval(() => {
        if(musicCover.classList.contains('rotating')) {
          const computedStyle = getComputedStyle(musicCover);
          const matrix = new WebKitCSSMatrix(computedStyle.transform);
          currentAngle = Math.round(Math.atan2(matrix.b, matrix.a) * (180 / Math.PI));
          musicCover.style.setProperty('--current-angle', `${currentAngle}deg`);
        }
      }, 100); // 每100毫秒更新一次
    });
  
    heoMusicPage.querySelector("meting-js").aplayer.on('pause', function () {
      
      musicCover.classList.remove('rotating'); // 移除旋转类
      // const computedStyle = getComputedStyle(musicCover);
      // const matrix = new WebKitCSSMatrix(computedStyle.transform);
      // currentAngle = Math.round(Math.atan2(matrix.b, matrix.a) * (180 / Math.PI)); 
      console.log("angle",currentAngle)
      // 设置 CSS 变量
      musicCover.style.setProperty('--current-angle', `${currentAngle}deg`);
      musicCover.style.setProperty('--stop-angle', `${currentAngle + 60}deg`); // 可以保持当前角度
      musicCover.classList.add('slow-stop'); // 添加减速停止类

      musicCover.addEventListener('animationend', function() {
        musicCover.style.transform = `rotate(${currentAngle}deg)`; // 保持当前角度
        // currentAngle = currentAngle
        // musicCover.classList.remove('slow-stop');
        // 也可以根据需求重置currentAngle，便于下次使用
      });
    });
  },
  getCustomPlayList: function () {
    const heoMusicPage = document.getElementById("heoMusic-page");
    if (params.get("id") && params.get("server")) {
      console.log("获取到自定义内容")
      var id = params.get("id")
      var server = params.get("server")
      heoMusicPage.innerHTML = `<meting-js id="${id}" server=${server} type="playlist" mutex="true" preload="auto" order="random"></meting-js>`;
    } else {
      console.log("无自定义内容")
      heoMusicPage.innerHTML = `<meting-js id="${userId}" server="${userServer}" type="playlist" mutex="true" preload="auto" order="random"></meting-js>`;
    }
    heo.changeMusicBg(false);
  }
}

// 调用
heo.getCustomPlayList();


// 改进vh
const vh = window.innerHeight * 1;
document.documentElement.style.setProperty('--vh', `${vh}px`);

window.addEventListener('resize', () => {
  let vh = window.innerHeight * 1;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
});

//获取图片url
function extractValue(input) {
  var valueRegex = /\("([^\s]+)"\)/g;
  var match = valueRegex.exec(input);
  return match[1];
}

//空格控制音乐
document.addEventListener("keydown", function (event) {
  //暂停开启音乐
  if (event.code === "Space") {
    event.preventDefault();
    document.querySelector('meting-js').aplayer.toggle();
  };
  //切换下一曲
  if (event.keyCode === 39) {
    event.preventDefault();
    document.querySelector('meting-js').aplayer.skipForward();
  };
  //切换上一曲
  if (event.keyCode === 37) {
    event.preventDefault();
    document.querySelector('meting-js').aplayer.skipBack();
  }
  //增加音量
  if (event.keyCode === 38) {
    if (volume <= 1) {
      volume += 0.1;
      document.querySelector('meting-js').aplayer.volume(volume, true);
    }
  }
  //减小音量
  if (event.keyCode === 40) {
    if (volume >= 0) {
      volume += -0.1;
      document.querySelector('meting-js').aplayer.volume(volume, true);
    }
  }
});
