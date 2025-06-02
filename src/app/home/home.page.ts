import { Component } from '@angular/core'; // ViewChild e ElementRef removidos se não mais usados
import { Gesture, GestureController } from '@ionic/angular';
import { Vibration } from '@awesome-cordova-plugins/vibration/ngx';
import { AdMob } from '@capacitor-community/admob';
import { BannerAdOptions, BannerAdSize, BannerAdPosition, BannerAdPluginEvents, AdMobBannerSize } from '@capacitor-community/admob';

export async function AdMobInitialize(): Promise<void> {
  const { status } = await AdMob.trackingAuthorizationStatus();

  if (status === 'notDetermined') {

  }
 
  AdMob.initialize({
    requestTrackingAuthorization: true,
    testingDevices: ['2077ef9a63d2b398840261c8221a0c9b'],
    initializeForTesting: true,
  });

  AdMob.addListener(BannerAdPluginEvents.Loaded, () => {
    // Inscrever-se no Ouvinte de Eventos do Banner
  });

  AdMob.addListener(BannerAdPluginEvents.SizeChanged, (size: AdMobBannerSize) => {
    // Inscrever-se na Mudança de Tamanho do Banner
  });

  const options: BannerAdOptions = {
    adId: 'ca-app-pub-3940256099942544/6300978111',
    adSize: BannerAdSize.BANNER,
    position: BannerAdPosition.BOTTOM_CENTER,
    margin: 0,
    // isTesting: true
    // npa: true
  };
  AdMob.showBanner(options);

}
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  lastTime = 0;
  vendors = ['webkit', 'moz'];
  g: any = {}; 

  gestureControl = true;
  gestureX : any;
  gestureY : any;
  isPlaying = 0;
  score = 0;
  previousState = 0;

  sfx = true; // Permanece para compatibilidade com HTML, mas será inerte
  music = true; // Permanece para compatibilidade com HTML, mas será inerte
  vibration = true;

  howToScreen = true;

  egLottieConfig = {
    loop: true,
    prerender: true,
    autoplay: true,
    path: 'assets/animations/endgame.json'
  }

  howtoLottieConfig = {
    loop: true,
    prerender: true,
    autoplay: true,
    path: 'assets/animations/swipe-right.json'
  }

  GESTURE_CONTROL_KEY = "gestureControl";
  // SFX_KEY removido
  // MUSIC_KEY removido
  VIBRATION_KEY = "vibration";
  HOWTO_KEY = "howto";

  // bgMusic removido
  // myCanvas e @ViewChild removidos

  constructor(private gestureCtrl: GestureController, private vibrtn: Vibration) {
    
    AdMobInitialize();

    // Carregamento de sfx do localStorage removido
    // Carregamento de music do localStorage removido

    const vibration = localStorage.getItem(this.VIBRATION_KEY);
    vibration ? this.vibration = JSON.parse(vibration) : this.vibration = true;

    const gestureControl = localStorage.getItem(this.GESTURE_CONTROL_KEY);
    gestureControl ? this.gestureControl = JSON.parse(gestureControl) : this.gestureControl = true;

    const howToScreen = localStorage.getItem(this.HOWTO_KEY);
    howToScreen ? this.howToScreen = JSON.parse(howToScreen) : this.howToScreen = true;

    // Inicialização de bgMusic removida
    // Chamada para setMusic() removida
  }

  // Método setMusic() removido

  doVibrate (value) {
    if(this.vibration) this.vibrtn.vibrate(value);
  }

  getPoint () {
    // Lógica de reprodução de áudio removida
    // if(this.sfx){
    //   var gP = new Audio('assets/score.mp3');
    //   gP.volume = 0.4;
    //   gP.play();
    // }
  }

  ionViewDidEnter(){ 
    this.requestAnimationFrame();
    this.gInit();
  }

  startGame () {
    this.score = 0;
    this.isPlaying = 1;
    // Chamada para audioVisualizer removida: if(this.music) this.audioVisualizer();
    if(this.gestureControl) {
      this.enableGestures();
    }
    else {
      this.disableGestures();
    } 
  }

  endGame () {
    this.isPlaying = 2;
  }

  showMenu () {
    this.isPlaying = 0;
  }

  showSettings () {
    this.previousState = this.isPlaying;
    this.isPlaying = 3;
  }

  hideSettings () {
    this.isPlaying = this.previousState;
  }

  enableGestures () {
    this.gestureX = this.gestureCtrl.create({
      el: document.getElementById("contentM"),
      // threshold: 15,
      direction: 'x',
      disableScroll: true,
      gestureName: "panX",
      // onMove: (detail) => { this.onMove(detail); },
      onEnd: (detail) => { this.onMove(detail);}
    })
    this.gestureY = this.gestureCtrl.create({
      el: document.getElementById("contentM"),
      // threshold: 15,
      direction: 'y',
      disableScroll: true,
      gestureName: "panY",
      // onMove: ,
      onEnd: (detail) => { this.onMove(detail);}

    })
    this.gestureY.enable();
    this.gestureX.enable();
  }

  disableGestures () {
    this.gestureX ? this.gestureX.destroy() : null;
    this.gestureY ? this.gestureY.destroy() : null;
  }

  private onMove(detail) {
    const deltaX = detail.deltaX;
    const deltaY = detail.deltaY;

    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);

    if(absX >= absY) {
      deltaX < 0 ? this.buttonPressLeft() : this.buttonPressRight() ;
    } else {
      deltaY < 0 ? this.buttonPressUp() : this.buttonPressDown() ;
    }

    // console.log(detail);
  }

  changeControls () {
    this.gestureControl = !this.gestureControl;
    localStorage.setItem(this.GESTURE_CONTROL_KEY,this.gestureControl.toString());
  }

  changeSettings (type) {
    switch (type) {
      case 1:
        // Lógica de configuração de SFX e localStorage.setItem(this.SFX_KEY,...) removida
        break;
      case 2:
        // Lógica de configuração de Música (setMusic) e localStorage.setItem(this.MUSIC_KEY,...) removida
        break;
      case 3:
        localStorage.setItem(this.VIBRATION_KEY,this.vibration.toString());
        break;
      case 4:
        this.gestureControl = !this.gestureControl;
        localStorage.setItem(this.GESTURE_CONTROL_KEY,this.gestureControl.toString());
        break;
      default:
        break;
    }
  }

  requestAnimationFrame(){
    for (var x = 0; x < this.vendors.length && !window.requestAnimationFrame; ++x) {
      window.requestAnimationFrame =
        window[this.vendors[x] + 'RequestAnimationFrame'];
      window.cancelAnimationFrame =
        window[this.vendors[x] + 'CancelAnimationFrame'] ||
        window[this.vendors[x] + 'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame) {
      window.requestAnimationFrame = function (callback) {
        var currTime = new Date().getTime();
        var timeToCall = Math.max(0, 16 - (currTime - this.lastTime));
        var id = window.setTimeout(function () {
          callback(currTime + timeToCall);
        }, timeToCall);
        this.lastTime = currTime + timeToCall;
        return id;
      };
    }

    if (!window.cancelAnimationFrame) {
      window.cancelAnimationFrame = function (id) {
        clearTimeout(id);
      };
    }
  }

  hasClass(elem, className) {
    return new RegExp(' ' + className + ' ').test(' ' + elem.className + ' ');
  }

  addClass(elem, className) {
    if (!this.hasClass(elem, className)) {
      elem.className += ' ' + className;
    }
  }

  removeClass(elem, className) {
    var newClass = ' ' + elem.className.replace(/[\t\r\n]/g, ' ') + ' ';
    if (this.hasClass(elem, className)) {
      while (newClass.indexOf(' ' + className + ' ') >= 0) {
        newClass = newClass.replace(' ' + className + ' ', ' ');
      }
      elem.className = newClass.replace(/^\s+|\s+$/g, '');
    }
  }

  toggleClass(elem, className) {
    var newClass = ' ' + elem.className.replace(/[\t\r\n]/g, ' ') + ' ';
    if (this.hasClass(elem, className)) {
      while (newClass.indexOf(' ' + className + ' ') >= 0) {
        newClass = newClass.replace(' ' + className + ' ', ' ');
      }
      elem.className = newClass.replace(/^\s+|\s+$/g, '');
    } else {
      elem.className += ' ' + className;
    }
  }

  closeHowTo () {
    this.howToScreen = false;
    localStorage.setItem(this.HOWTO_KEY,this.howToScreen.toString());
  }

  gInit() {
    
      /*================================================
    
      Matemática
    
      ================================================*/
      var THAT = this; // THAT (this) ainda é usado por gInit e é chamado em ionViewDidEnter
      THAT.g.m = Math;
      THAT.g.mathProps =
        'E LN10 LN2 LOG2E LOG10E PI SQRT1_2 SQRT2 abs acos asin atan ceil cos exp floor log round sin sqrt tan atan2 pow max min'.split(
          ' '
        );
      for (var i = 0; i < THAT.g.mathProps.length; i++) {
        THAT.g[THAT.g.mathProps[i]] = THAT.g.m[THAT.g.mathProps[i]];
      }
      THAT.g.m.TWO_PI = THAT.g.m.PI * 2;

      /*================================================
    
      Diversos
    
      ================================================*/

      THAT.g.isset = function (prop) {
        return typeof prop != 'undefined';
      };

      THAT.g.log = function () {
        if (THAT.g.isset(THAT.g.config) && THAT.g.config.debug && window.console) {
          console.log(Array.prototype.slice.call(arguments));
        }
      };

      /*================================================
    
      Grupo
    
      ================================================*/

      THAT.g.Group = function () {
        this.collection = [];
        this.length = 0;
      };
    
      THAT.g.Group.prototype.add = function (item) {
        this.collection.push(item);
        this.length++;
      };
    
      THAT.g.Group.prototype.remove = function (index) {
        if (index < this.length) {
          this.collection.splice(index, 1);
          this.length--;
        }
      };
    
      THAT.g.Group.prototype.empty = function () {
        this.collection.length = 0;
        this.length = 0;
      };
    
      THAT.g.Group.prototype.each = function (action, asc) {
        var asc = asc || 0,
          i;
        if (asc) {
          for (i = 0; i < this.length; i++) {
            this.collection[i][action](i);
          }
        } else {
          i = this.length;
          while (i--) {
            this.collection[i][action](i);
          }
        }
      };

      THAT.g.util = {};

      /*================================================
    
      Aleatório
    
      ================================================*/
    
      THAT.g.util.rand = function (min, max) {
        return THAT.g.m.random() * (max - min) + min;
      };
    
      THAT.g.util.randInt = function (min, max) {
        return THAT.g.m.floor(THAT.g.m.random() * (max - min + 1)) + min;
      };

      /*================================================
    
      Estado
    
      ================================================*/

      THAT.g.states = {};
      // var states : any = {};

      THAT.g.addState =  function (state) {
        THAT.g.states[state.name] = state;
      };

      THAT.g.setState =  function (name) {
        if (THAT.g.state) {
          THAT.g.states[THAT.g.state].exit();
        }
        THAT.g.state = name;
        THAT.g.states[THAT.g.state].init();
      };

      THAT.g.currentState =  function () {
        return THAT.g.states[THAT.g.state];
      };

      /*================================================
    
      Tempo
    
      ================================================*/

      THAT.g.Time = function () {
        this.reset();
      };
    
      THAT.g.Time.prototype.reset = function () {
        this.now = Date.now();
        this.last = Date.now();
        this.delta = 60;
        this.ndelta = 1;
        this.elapsed = 0;
        this.nelapsed = 0;
        this.tick = 0;
      };
    
      THAT.g.Time.prototype.update = function () {
        this.now = Date.now();
        this.delta = this.now - this.last;
        this.ndelta = Math.min(Math.max(this.delta / (1000 / 60), 0.0001), 10);
        this.elapsed += this.delta;
        this.nelapsed += this.ndelta;
        this.last = this.now;
        this.tick++;
      };

      /*================================================
    
      Entidade Grade
    
      ================================================*/

      THAT.g.Grid = function (cols, rows) {
        this.cols = cols;
        this.rows = rows;
        this.tiles = [];
        for (var x = 0; x < cols; x++) {
          this.tiles[x] = [];
          for (var y = 0; y < rows; y++) {
            this.tiles[x].push('empty');
          }
        }
      };
    
      THAT.g.Grid.prototype.get = function (x, y) {
        return this.tiles[x][y];
      };
    
      THAT.g.Grid.prototype.set = function (x, y, val) {
        this.tiles[x][y] = val;
      };

      /*================================================
    
      Entidade Peça do Tabuleiro
    
      ================================================*/

      THAT.g.BoardTile = function (opt) {
        this.parentState = opt.parentState;
        this.parentGroup = opt.parentGroup;
        this.col = opt.col;
        this.row = opt.row;
        this.x = opt.x;
        this.y = opt.y;
        this.z = 0;
        this.w = opt.w;
        this.h = opt.h;
        this.elem = document.createElement('div');
        this.elem.style.position = 'absolute';
        this.elem.className = 'tile';
        this.parentState.stageElem.appendChild(this.elem);
        this.classes = {
          pressed: 0,
          path: 0,
          up: 0,
          down: 0,
          left: 0,
          right: 0,
        };
        this.updateDimensions();
      };
    
      THAT.g.BoardTile.prototype.update = function () {
        for (var k in this.classes) {
          if (this.classes[k]) {
            this.classes[k]--;
          }
        }
    
        if (
          this.parentState.food.tile.col == this.col ||
          this.parentState.food.tile.row == this.row
        ) {
          this.classes.path = 1;
          if (this.col < this.parentState.food.tile.col) {
            this.classes.right = 1;
          } else {
            this.classes.right = 0;
          }
          if (this.col > this.parentState.food.tile.col) {
            this.classes.left = 1;
          } else {
            this.classes.left = 0;
          }
          if (this.row > this.parentState.food.tile.row) {
            this.classes.up = 1;
          } else {
            this.classes.up = 0;
          }
          if (this.row < this.parentState.food.tile.row) {
            this.classes.down = 1;
          } else {
            this.classes.down = 0;
          }
        } else {
          this.classes.path = 0;
        }
    
        if (this.parentState.food.eaten) {
          this.classes.path = 0;
        }
      };
    
      THAT.g.BoardTile.prototype.updateDimensions = function () {
        this.x = this.col * this.parentState.tileWidth;
        this.y = this.row * this.parentState.tileHeight;
        this.w = this.parentState.tileWidth - this.parentState.spacing;
        this.h = this.parentState.tileHeight - this.parentState.spacing;
        this.elem.style.left = this.x + 'px';
        this.elem.style.top = this.y + 'px';
        this.elem.style.width = this.w + 'px';
        this.elem.style.height = this.h + 'px';
      };
    
      THAT.g.BoardTile.prototype.render = function () {
        var classString = '';
        for (var k in this.classes) {
          if (this.classes[k]) {
            classString += k + ' ';
          }
        }
        this.elem.className = 'tile ' + classString;
      };

      /*================================================
    
      Entidade Peça da Cobra
    
      ================================================*/

      THAT.g.SnakeTile = function (opt) {
        this.parentState = opt.parentState;
        this.parentGroup = opt.parentGroup;
        this.col = opt.col;
        this.row = opt.row;
        this.x = opt.x;
        this.y = opt.y;
        this.w = opt.w;
        this.h = opt.h;
        this.color = null;
        this.scale = 1;
        this.rotation = 0;
        this.blur = 0;
        this.alpha = 1;
        this.borderRadius = 0;
        this.borderRadiusAmount = 0;
        this.elem = document.createElement('div');
        this.elem.style.position = 'absolute';
        this.parentState.stageElem.appendChild(this.elem);
      };
    
      THAT.g.SnakeTile.prototype.update = function (i) {
        this.x = this.col * this.parentState.tileWidth;
        this.y = this.row * this.parentState.tileHeight;
        if (i == 0) {
          this.color = '#fff';
          this.blur =
            this.parentState.dimAvg * 0.03 +
            Math.sin(this.parentState.time.elapsed / 200) *
            this.parentState.dimAvg *
            0.015;
          if (this.parentState.snake.dir == 'n') {
            this.borderRadius =
              this.borderRadiusAmount + '% ' + this.borderRadiusAmount + '% 0 0';
          } else if (this.parentState.snake.dir == 's') {
            this.borderRadius =
              '0 0 ' +
              this.borderRadiusAmount +
              '% ' +
              this.borderRadiusAmount +
              '%';
          } else if (this.parentState.snake.dir == 'e') {
            this.borderRadius =
              '0 ' +
              this.borderRadiusAmount +
              '% ' +
              this.borderRadiusAmount +
              '% 0';
          } else if (this.parentState.snake.dir == 'w') {
            this.borderRadius =
              this.borderRadiusAmount + '% 0 0 ' + this.borderRadiusAmount + '%';
          }
        } else {
          this.color = '#fff';
          this.blur = 0;
          this.borderRadius = '0';
        }
        this.alpha = 1 - (i / this.parentState.snake.tiles.length) * 0.6;
        this.rotation =
          (this.parentState.snake.justAteTick /
            this.parentState.snake.justAteTickMax) *
          90;
        this.scale =
          1 +
          (this.parentState.snake.justAteTick /
            this.parentState.snake.justAteTickMax) *
          1;
      };
    
      THAT.g.SnakeTile.prototype.updateDimensions = function () {
        this.w = this.parentState.tileWidth - this.parentState.spacing;
        this.h = this.parentState.tileHeight - this.parentState.spacing;
      };
    
      THAT.g.SnakeTile.prototype.render = function (i) {
        this.elem.style.left = this.x + 'px';
        this.elem.style.top = this.y + 'px';
        this.elem.style.width = this.w + 'px';
        this.elem.style.height = this.h + 'px';
        this.elem.style.backgroundColor = 'rgba(255, 255, 255, ' + this.alpha + ')';
        this.elem.style.boxShadow = '0 0 ' + this.blur + 'px #fff';
        this.elem.style.borderRadius = this.borderRadius;
      };

      /*================================================
    
      Entidade Peça de Comida
    
      ================================================*/

      THAT.g.FoodTile = function (opt) {
        this.parentState = opt.parentState;
        this.parentGroup = opt.parentGroup;
        this.col = opt.col;
        this.row = opt.row;
        this.x = opt.x;
        this.y = opt.y;
        this.w = opt.w;
        this.h = opt.h;
        this.blur = 0;
        this.scale = 1;
        this.hue = 1;
        this.opacity = 0;
        this.elem = document.createElement('div');
        this.elem.style.position = 'absolute';
        this.parentState.stageElem.appendChild(this.elem);
        
      };
    
      THAT.g.FoodTile.prototype.update = function () {
        this.x = this.col * this.parentState.tileWidth;
        this.y = this.row * this.parentState.tileHeight;
        this.blur =
          this.parentState.dimAvg * 0.03 +
          Math.sin(this.parentState.time.elapsed / 200) *
          this.parentState.dimAvg *
          0.015;
        this.scale = 0.8 + Math.sin(this.parentState.time.elapsed / 200) * 0.2;
    
        if (this.parentState.food.birthTick || this.parentState.food.deathTick) {
          if (this.parentState.food.birthTick) {
            this.opacity = 1 - (this.parentState.food.birthTick / 1) * 1;
          } else {
            this.opacity = (this.parentState.food.deathTick / 1) * 1;
          }
        } else {
          this.opacity = 1;
        }
      };
    
      THAT.g.FoodTile.prototype.updateDimensions = function () {
        this.w = this.parentState.tileWidth - this.parentState.spacing;
        this.h = this.parentState.tileHeight - this.parentState.spacing;
      };
    
      THAT.g.FoodTile.prototype.render = function () {
        this.elem.style.left = this.x + 'px';
        this.elem.style.top = this.y + 'px';
        this.elem.style.width = this.w + 'px';
        this.elem.style.height = this.h + 'px';
        this.elem.style['transform'] = 'translateZ(0) scale(' + this.scale + ')';
        this.elem.style.backgroundColor = 'hsla(' + this.hue + ', 100%, 60%, 1)';
        this.elem.style.boxShadow =
          '0 0 ' + this.blur + 'px hsla(' + this.hue + ', 100%, 60%, 1)';
        this.elem.style.opacity = this.opacity;
      };

      /*================================================
    
      Entidade Cobra
    
      ================================================*/

      THAT.g.Snake = function (opt) {
        this.parentState = opt.parentState;
        (this.dir = 'e'), (this.currDir = this.dir);
        this.tiles = [];
        for (var i = 0; i < 5; i++) {
          this.tiles.push(
            new THAT.g.SnakeTile({
              parentState: this.parentState,
              parentGroup: this.tiles,
              col: 8 - i,
              row: 3,
              x: (8 - i) * opt.parentState.tileWidth,
              y: 3 * opt.parentState.tileHeight,
              w: opt.parentState.tileWidth - opt.parentState.spacing,
              h: opt.parentState.tileHeight - opt.parentState.spacing,
            })
          );
        }
        this.last = 0;
        this.updateTick = 10;
        this.updateTickMax = this.updateTick;
        this.updateTickLimit = 3;
        this.updateTickChange = 0.2;
        this.deathFlag = 0;
        this.justAteTick = 0;
        this.justAteTickMax = 1;
        this.justAteTickChange = 0.05;
    
        // sincronizar grade de dados do estado de jogo
        var x = this.tiles.length;
    
        while (x--) {
          this.parentState.grid.set(this.tiles[x].col, this.tiles[x].row, 'snake');
        }
      };
    
      THAT.g.Snake.prototype.updateDimensions = function () {
        var i = this.tiles.length;
        while (i--) {
          this.tiles[i].updateDimensions();
        }
      };
    
      THAT.g.Snake.prototype.update = function () {
        if (this.parentState.keys.up) {
          if (
            this.dir != 's' &&
            this.dir != 'n' &&
            this.currDir != 's' &&
            this.currDir != 'n'
          ) {
            this.dir = 'n';
          }
        } else if (this.parentState.keys.down) {
          if (
            this.dir != 'n' &&
            this.dir != 's' &&
            this.currDir != 'n' &&
            this.currDir != 's'
          ) {
            this.dir = 's';
          }
        } else if (this.parentState.keys.right) {
          if (
            this.dir != 'w' &&
            this.dir != 'e' &&
            this.currDir != 'w' &&
            this.currDir != 'e'
          ) {
            this.dir = 'e';
          }
        } else if (this.parentState.keys.left) {
          if (
            this.dir != 'e' &&
            this.dir != 'w' &&
            this.currDir != 'e' &&
            this.currDir != 'w'
          ) {
            this.dir = 'w';
          }
        }
    
        this.parentState.keys.up = 0;
        this.parentState.keys.down = 0;
        this.parentState.keys.right = 0;
        this.parentState.keys.left = 0;
    
        this.updateTick += this.parentState.time.ndelta;
        if (this.updateTick >= this.updateTickMax) {
          // redefinir o temporizador de atualização para 0, ou o que sobrar
          this.updateTick = this.updateTick - this.updateTickMax;
    
          // rotacionar array de blocos da cobra
          this.tiles.unshift(
            new THAT.g.SnakeTile({
              parentState: this.parentState,
              parentGroup: this.tiles,
              col: this.tiles[0].col,
              row: this.tiles[0].row,
              x: this.tiles[0].col * this.parentState.tileWidth,
              y: this.tiles[0].row * this.parentState.tileHeight,
              w: this.parentState.tileWidth - this.parentState.spacing,
              h: this.parentState.tileHeight - this.parentState.spacing,
            })
          );
          this.last = this.tiles.pop();
          this.parentState.stageElem.removeChild(this.last.elem);
    
          this.parentState.boardTiles.collection[
            this.last.col + this.last.row * this.parentState.cols
          ].classes.pressed = 2;
    
          // sincronizar grade de dados do estado de jogo
          var i = this.tiles.length;
    
          while (i--) {
            this.parentState.grid.set(
              this.tiles[i].col,
              this.tiles[i].row,
              'snake'
            );
          }
          this.parentState.grid.set(this.last.col, this.last.row, 'empty');
    
          // mover a cabeça da cobra
          if (this.dir == 'n') {
            this.currDir = 'n';
            this.tiles[0].row -= 1;
          } else if (this.dir == 's') {
            this.currDir = 's';
            this.tiles[0].row += 1;
          } else if (this.dir == 'w') {
            this.currDir = 'w';
            this.tiles[0].col -= 1;
          } else if (this.dir == 'e') {
            this.currDir = 'e';
            this.tiles[0].col += 1;
          }
    
          // atravessar paredes
          this.wallFlag = false;
          if (this.tiles[0].col >= this.parentState.cols) {
            this.tiles[0].col = 0;
            this.wallFlag = true;
          }
          if (this.tiles[0].col < 0) {
            this.tiles[0].col = this.parentState.cols - 1;
            this.wallFlag = true;
          }
          if (this.tiles[0].row >= this.parentState.rows) {
            this.tiles[0].row = 0;
            this.wallFlag = true;
          }
          if (this.tiles[0].row < 0) {
            this.tiles[0].row = this.parentState.rows - 1;
            this.wallFlag = true;
          }
    
          // verificar morte por comer a si mesma
          if (
            this.parentState.grid.get(this.tiles[0].col, this.tiles[0].row) ==
            'snake'
          ) {
            this.deathFlag = 1;
            clearTimeout(this.foodCreateTimeout);
          }
    
          // verificar se comeu a comida
          if (
            this.parentState.grid.get(this.tiles[0].col, this.tiles[0].row) ==
            'food'
          ) {
            THAT.getPoint(); // Chamada para getPoint mantida, mas getPoint não tocará som
            THAT.doVibrate(200);
            this.tiles.push(
              new THAT.g.SnakeTile({
                parentState: this.parentState,
                parentGroup: this.tiles,
                col: this.last.col,
                row: this.last.row,
                x: this.last.col * this.parentState.tileWidth,
                y: this.last.row * this.parentState.tileHeight,
                w: this.parentState.tileWidth - this.parentState.spacing,
                h: this.parentState.tileHeight - this.parentState.spacing,
              })
            );
            if (this.updateTickMax - this.updateTickChange > this.updateTickLimit) {
              this.updateTickMax -= this.updateTickChange;
            }
            this.parentState.score++;
            THAT.score = this.parentState.score;
            this.parentState.scoreElem.innerHTML = "Score: " + this.parentState.score;
            this.justAteTick = this.justAteTickMax;
    
            this.parentState.food.eaten = 1;
            this.parentState.stageElem.removeChild(this.parentState.food.tile.elem);
    
            var _this = this;
    
            this.foodCreateTimeout = setTimeout(function () {
              _this.parentState.food = new THAT.g.Food({
                parentState: _this.parentState,
              });
            }, 300);
          }
    
          // verificar morte por comer a si mesma
          if (this.deathFlag) {
            THAT.endGame();
            THAT.doVibrate(500);
            THAT.g.setState('play');
          }
        }
    
        // atualizar peças individuais da cobra
        var i = this.tiles.length;
        while (i--) {
          this.tiles[i].update(i);
        }
    
        if (this.justAteTick > 0) {
          this.justAteTick -= this.justAteTickChange;
        } else if (this.justAteTick < 0) {
          this.justAteTick = 0;
        }
      };
    
      THAT.g.Snake.prototype.render = function () {
        // renderizar peças individuais da cobra
        var i = this.tiles.length;
        while (i--) {
          this.tiles[i].render(i);
        }
      };

      /*================================================
    
      Entidade Comida
    
      ================================================*/

      THAT.g.Food = function (opt) {
        this.parentState = opt.parentState;
        this.tile = new THAT.g.FoodTile({
          parentState: this.parentState,
          col: 0,
          row: 0,
          x: 0,
          y: 0,
          w: opt.parentState.tileWidth - opt.parentState.spacing,
          h: opt.parentState.tileHeight - opt.parentState.spacing,
        });
        this.reset();
        this.eaten = 0;
        this.birthTick = 1;
        this.deathTick = 0;
        this.birthTickChange = 0.025;
        this.deathTickChange = 0.05;
      };
    
      THAT.g.Food.prototype.reset = function () {
        var empty = [];
        for (var x = 0; x < this.parentState.cols; x++) {
          for (var y = 0; y < this.parentState.rows; y++) {
            var tile = this.parentState.grid.get(x, y);
            if (tile == 'empty') {
              empty.push({ x: x, y: y });
            }
          }
        }
        var newTile = empty[THAT.g.util.randInt(0, empty.length - 1)];
        this.tile.col = newTile.x;
        this.tile.row = newTile.y;
      };
    
      THAT.g.Food.prototype.updateDimensions = function () {
        this.tile.updateDimensions();
      };
    
      THAT.g.Food.prototype.update = function () {
        // atualizar peça de comida
        this.tile.update();
    
        if (this.birthTick > 0) {
          this.birthTick -= this.birthTickChange;
        } else if (this.birthTick < 0) {
          this.birthTick = 0;
        }
    
        // sincronizar grade de dados do estado de jogo
        this.parentState.grid.set(this.tile.col, this.tile.row, 'food');
      };
    
      THAT.g.Food.prototype.render = function () {
        this.tile.render();
      };

      /*================================================
    
      Estado de Jogo (Play)
    
      ================================================*/

      function StatePlay() {
        this.name = 'play';
      }

      var scoreElem = document.getElementById('score');
      var stageElem = document.getElementById('stage'); 
    
      StatePlay.prototype.init = function () {
        this.scoreElem = scoreElem; //document.querySelector('.score');
        this.stageElem = stageElem; //document.querySelector('.stage');
        this.dimLong = 22;
        this.dimShort = 18;
        this.padding = 0.1;
        this.boardTiles = new THAT.g.Group();
        this.keys = {};
        this.foodCreateTimeout = null;
        this.score = 0;
        this.scoreElem.innerHTML = "Score: " + this.score;
        this.time = new THAT.g.Time();
        this.getDimensions();
        if (this.winWidth < this.winHeight) {
          this.rows = this.dimLong;
          this.cols = this.dimShort;
        } else {
          this.rows = this.dimShort;
          this.cols = this.dimLong;
        }
        this.spacing = 1;
        this.grid = new THAT.g.Grid(this.cols, this.rows);
        this.resize();
        this.createBoardTiles();
        this.bindEvents();
        this.snake = new THAT.g.Snake({
          parentState: this,
        });
        this.food = new THAT.g.Food({
          parentState: this,
        });
        
      };
    
      StatePlay.prototype.getDimensions = function () {
        this.winWidth = window.innerWidth;
        this.winHeight = window.innerHeight;
        this.activeWidth = this.winWidth - this.winWidth * this.padding;
        this.activeHeight = this.winHeight - this.winHeight * this.padding;
      };
    
      StatePlay.prototype.resize = function () {
        var _this = THAT.g.currentState();
    
        _this.getDimensions();
    
        _this.stageRatio = _this.rows / _this.cols;
    
        if (_this.activeWidth > _this.activeHeight / _this.stageRatio) {
          _this.stageHeight = _this.activeHeight;
          _this.stageElem.style.height = _this.stageHeight + 'px';
          _this.stageWidth = Math.floor(_this.stageHeight / _this.stageRatio);
          _this.stageElem.style.width = _this.stageWidth + 'px';
        } else {
          _this.stageWidth = _this.activeWidth;
          _this.stageElem.style.width = _this.stageWidth + 'px';
          _this.stageHeight = Math.floor(_this.stageWidth * _this.stageRatio);
          _this.stageElem.style.height = _this.stageHeight + 'px';
        }
    
        _this.tileWidth = ~~(_this.stageWidth / _this.cols);
        _this.tileHeight = ~~(_this.stageHeight / _this.rows);
        _this.dimAvg = (_this.activeWidth + _this.activeHeight) / 2;
        _this.spacing = Math.max(1, ~~(_this.dimAvg * 0.0025));
    
        _this.stageElem.style.marginTop =
          -_this.stageElem.offsetHeight / 2 + _this.headerHeight / 2 + 'px';
    
        _this.boardTiles.each('updateDimensions');
        _this.snake !== undefined && _this.snake.updateDimensions();
        _this.food !== undefined && _this.food.updateDimensions();
      };
    
      StatePlay.prototype.createBoardTiles = function () {
        for (var y = 0; y < this.rows; y++) {
          for (var x = 0; x < this.cols; x++) {
            this.boardTiles.add(
              new THAT.g.BoardTile({
                parentState: this,
                parentGroup: this.boardTiles,
                col: x,
                row: y,
                x: x * this.tileWidth,
                y: y * this.tileHeight,
                w: this.tileWidth - this.spacing,
                h: this.tileHeight - this.spacing,
              })
            );
          }
        }
      };
    
      StatePlay.prototype.upOn = function () {
        THAT.g.currentState().keys.up = 1;
      };
      StatePlay.prototype.downOn = function () {
        THAT.g.currentState().keys.down = 1;
      };
      StatePlay.prototype.rightOn = function () {
        THAT.g.currentState().keys.right = 1;
      };
      StatePlay.prototype.leftOn = function () {
        THAT.g.currentState().keys.left = 1;
      };
      StatePlay.prototype.upOff = function () {
        THAT.g.currentState().keys.up = 0;
      };
      StatePlay.prototype.downOff = function () {
        THAT.g.currentState().keys.down = 0;
      };
      StatePlay.prototype.rightOff = function () {
        THAT.g.currentState().keys.right = 0;
      };
      StatePlay.prototype.leftOff = function () {
        THAT.g.currentState().keys.left = 0;
      };
    
      StatePlay.prototype.keydown = function (e) {
        e.preventDefault();
        var e = e.keyCode ? e.keyCode : e.which,
          _this = THAT.g.currentState();
        if (e === 38 || e === 87) {
          _this.upOn();
        }
        if (e === 39 || e === 68) {
          _this.rightOn();
        }
        if (e === 40 || e === 83) {
          _this.downOn();
        }
        if (e === 37 || e === 65) {
          _this.leftOn();
        }
      };
    
      StatePlay.prototype.bindEvents = function () {
        var _this = THAT.g.currentState();
        window.addEventListener('keydown', _this.keydown, false);
        window.addEventListener('resize', _this.resize, false);
      };
    
      StatePlay.prototype.step = function () {
        this.boardTiles.each('update');
        this.boardTiles.each('render');
        this.snake.update();
        this.snake.render();
        this.food.update();
        this.food.render();
        this.time.update();
      };
    
      StatePlay.prototype.exit = function () {
        window.removeEventListener('keydown', this.keydown, false);
        window.removeEventListener('resize', this.resize, false);
        this.stageElem.innerHTML = '';
        this.grid.tiles = null;
        this.time = null;
      };
    
      THAT.g.addState(new StatePlay());

      /*================================================
    
      Jogo
    
      ================================================*/

      THAT.g.config = {
        title: 'Snakely',
        debug: window.location.hash == '#debug' ? 1 : 0,
        state: 'play',
      };

      THAT.g.setState(THAT.g.config.state);
    
      THAT.g.time = new THAT.g.Time();
    
      THAT.g.step = function () {
        requestAnimationFrame(THAT.g.step);
        THAT.g.states[THAT.g.state].step();
        THAT.g.time.update();
      };
      
    setTimeout(() => {
      THAT.g.step();
    }, 100);
      // window.addEventListener('load', THAT.g.step, false);
  }

  // Método audioVisualizer() removido

  buttonPressUp () {
    this.g.currentState().keys.up = 1;
  }

  buttonPressDown () {
    this.g.currentState().keys.down = 1;
  }

  buttonPressLeft () {
    this.g.currentState().keys.left = 1;
  }

  buttonPressRight () {
    this.g.currentState().keys.right = 1;
  }
}