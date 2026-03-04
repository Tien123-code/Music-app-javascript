const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const player = $('.player');
const heading = $('header h2');
const cd = $('.cd');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const playBtn = $('.btn-toggle-play');
const progress = $('#progress');
const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');
const playlist =  $('.playlist');

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,

    song: [
    {
        name: "Âm  thầm bên em",
        singer: "Sơn Tùng M-TP",
        path: "songs/AmThamBenEm-SonTungMTP-4066476.mp3",
        image: "images/amthambenem.jpg"
    },
    {
        name: "Cơn mưa ngang qua",
        singer: "Sơn Tùng M-TP",
        path: "songs/ConMuaNgangQua-SonTungMTP-1142953.mp3",
        image: "images/conmuangangqua.jpg"
    },
    {
        name: "Một năm mới bình an",
        singer: "Sơn Tùng M-TP",
        path: "songs/MotNamMoiBinhAn-SonTungMTP-4315569.mp3",
        image: "images/motnammoibinhan.jpg"
    },
    {
        name: "Bình yên những phút giây",
        singer: "Sơn Tùng M-TP",
        path: "songs/BinhYenNhungPhutGiay-SonTungMTP-4915711.mp3",
        image: "images/binhyennhungphutgiay.jpg"
    },
    {
        name: "Chúng ta không thuộc về nhau",  
        singer: "Sơn Tùng M-TP",
        path: "songs/ChungTaKhongThuocVeNhau-SonTungMTP-4528181.mp3",
        image: "images/chungtakhongthuocvenhau.webp"
    },
    {
        name: "Nơi này có anh",
        singer: "Sơn Tùng M-TP",    
        path: "songs/NoiNayCoAnh-SonTungMTP-4772041.mp3",
        image: "images/noinaycoanh.jpg"
    },
    
   ],
   render: function() {
        const htmls = this.song.map((song,index) => {
            return `
                <div class="song ${index === this.currentIndex ? 'active' : ''} " data-index= "${index}">
                    <div class="thumb" style="background-image: url('${song.image}')"></div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                    </div>`
        })
       playlist.innerHTML = htmls.join('');
   },
    defineProperties: function() {
    Object.defineProperty(this,'currentSong', {
        get: function() {
            return this.song[this.currentIndex];
        }
    })
},
   handleEvents: function() {
        const cdWidth = cd.offsetWidth;
        const _this = this;
        // Xử lý quay cd / dừng
        cdThumbAnimate = cdThumb.animate([
            { transform: 'rotate(360deg)' }
        ], {
            duration: 10000, // 10 giây
            iterations: Infinity // Lặp vô hạn
        })
        cdThumbAnimate.pause();

        document.onscroll = function() {
           const scrollTop = window.scrollY || document.documentElement.scrollTop;
           const newCdWidth = cdWidth - scrollTop;
           cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0;
           cd.style.opacity  = newCdWidth / cdWidth;
        }

        playBtn.onclick = function() {
           if(_this.isPlaying){
              audio.pause();
           }
           else{
               audio.play();
           }
           
        }
        // Khi song được play
        audio.onplay = function() {
            _this.isPlaying = true;
            player.classList.add('playing');
            cdThumbAnimate.play();
        }
        // Khi song bị pause
        audio.onpause = function() {
            _this.isPlaying = false;
            player.classList.remove('playing');
            cdThumbAnimate.pause();
        }

        // Khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function() {
             if(audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100);
                progress.value = progressPercent;
             }
        }

        // Khi tua song
        progress.oninput = function(e) {
            const seekTime = audio.duration * e.target.value / 100;
            audio.currentTime = seekTime;
        }

        // Khi next song
        nextBtn.onclick = function() {
           if(_this.isRandom) {
                _this.playRandomSong();
            }
            else{
                _this.nextSong();
                
            }
            audio.play();
            _this.render();
             _this.scrollToActiveSong();
           
        }
        // khi prev song
        prevBtn.onclick = function() {
            if(_this.isRandom) {
                _this.playRandomSong();
            }
            else{
            _this.prevSong();
                }
        audio.play();
        _this.render();
        _this.scrollToActiveSong();

    }
        // Khi random song
        randomBtn.onclick = function( ) {
           
            
            _this.isRandom = !_this.isRandom;
            randomBtn.classList.toggle('active', _this.isRandom);
            
        }
        // Khi kết thúc bài hát
        audio.onended = function() {
            if(_this.isRandom) {
                _this.playRandomSong();
            }
            else{
                _this.nextSong();
            }
            audio.play();
        }
        // Khi click vào repeat song
        repeatBtn.onclick = function() {
          
            _this.isRepeat = !_this.isRepeat;
            repeatBtn.classList.toggle('active', _this.isRepeat);
             if(_this.isRepeat) {
                audio.loop = true;
             }
             else{
                audio.loop = false;
             }
        }
      // Lang nghe hanh vi click vao playlist
      playlist.onclick = function (e) {
            const songNode =  e.target.closest('.song:not(.active)');
            if ( 
                songNode || e.target.closest('.option')
            )  {
                // Xu ly khi click vao song
                if(songNode) {
                        _this.currentIndex = Number(songNode.dataset.index);
                        _this.loadCurrentSong();
                         _this.render();
                        audio.play();
                        _this.scrollToActiveSong();

                       
                    }
                
                // Xu ly khi click vao song option
                if (e.target.closest('.option')) {

                }
            }
      }
       
   },
  
   loadCurrentSong: function() {
        
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;
   },
    nextSong: function() {
         this.currentIndex ++;
      if(this.currentIndex > this.song.length -1 ) {
            this.currentIndex = 0;
      }
    this.loadCurrentSong();
},
    prevSong: function() {
        this.currentIndex --;
        if(this.currentIndex < 0) {
            this.currentIndex = this.song.length - 1;
        }
        this.loadCurrentSong();
    },
    playRandomSong: function() {
       
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * this.song.length);
        }
        while(newIndex === this.currentIndex);
        
        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },
    scrollToActiveSong: function() {
        const length = (this.song.length - 1 ) / 2 ;
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block:  'center',
            })
        }, 500)
    },
    start: function() {
        // Định nghĩa các thuộc tính cho object
        this.defineProperties();

        // Render playlist
        this.render();
     
        // Lắng nghe / xử lý các sự kiện (DOM events)
        this.handleEvents();

        // Tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
        this.loadCurrentSong();

   }
}

app.start();
