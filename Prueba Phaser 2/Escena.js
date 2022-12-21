class Escena extends Phaser.Scene {
    constructor() {
        super("inicio");
    }
    preload() {
        this.load.image("fondo1","img/plx-1.png");
        this.load.image("fondo2","img/plx-2.png");
        this.load.image("fondo3","img/plx-3.png");
        this.load.image("fondo4","img/plx-4.png");
        this.load.image("fondo5","img/plx-5.png");
        this.load.spritesheet("guacamaya","img/SpritesGuacamaya.png",{
            frameWidth: 5800/4,
            frameHeight: 2100/2,
        });
        this.load.spritesheet("muro","img/jungleTileset.png",{
            frameWidth: 16,
            frameHeight: 16,
        });
        this.agujero = Phaser.Math.Between(0,config.height / (16*config.scale) - 2);
    }
    create() {
        this.fondo = {
            capa1: this.add.tileSprite(0,0,config.width,config.height,"fondo1"),
            capa2: this.add.tileSprite(0,0,config.width,config.height,"fondo2"),
            capa3: this.add.tileSprite(0,0,config.width,config.height,"fondo3"),
            capa4: this.add.tileSprite(0,0,config.width,config.height,"fondo4"),
            capa5: this.add.tileSprite(0,0,config.width,config.height,"fondo5")
        }
        for (let key in this.fondo) {
            this.fondo[key].setOrigin(0,0);
            this.fondo[key].setScale(2);
        }
        this.muros = this.add.group();
        this.input.keyboard.on('keyup',
         (event) =>{
            if (event.keyCode === 32) {
                console.log("salto");
                this.guacamaya.play("guacamaya_vuelo");
                this.guacamaya.setVelocityY(-200);
            }
        })
        this.puntaje = 0
        this.texto = this.add.text(20,20,this.puntaje);
        this.guacamaya = this.physics.add.sprite(config.width / 4, config.height / 2,"guacamaya");
        this.guacamaya.setScale(1/10);
        
        this.anims.create({
            key: "guacamaya_vuelo",
            frames: this.anims.generateFrameNumbers("guacamaya"),
            frameRate: 40,
            repeat: 0
        });
        this.guacamaya.setInteractive();
        this.dibujarMuro(2);
        //this.guacamaya.play("guacamaya_vuelo");
    }
    update() {
        let puntajeObtenido = false;
        this.texto.setText(this.puntaje);
        console.log("Tamaño: "+this.muros.children.getArray().length);
        let index = 5;
        for (let key in this.fondo) {
            this.fondo[key].tilePositionX += config.speed/index;
            index -= 1; 
        }
        for (let i = 0; i < this.muros.children.getArray().length; i++){
            this.muros.children.getArray()[i].x -= config.speed*2;
            if(this.muros.children.getArray()[i].x === this.guacamaya.x && !puntajeObtenido) {
                this.puntaje += 1;
                puntajeObtenido = true;
            }
            if(this.colision(this.muros.children.getArray()[i])) {
                console.log("changos");
                this.guacamaya.destroy();
                this.scene.restart();
            }
            //console.log("hola");
        }
        if (this.muros.children.getArray()[this.muros.children.getArray().length - 1].x <= config.width*0.7) {
            const min = this.agujero <= 0 ? 0 : -1;
            const max = this.agujero >= config.height / (16 * config.scale) - 2 ? 0 : 1;
            this.agujero += Phaser.Math.Between(min,max);
            this.dibujarMuro();
        }
        if (this.muros.children.getArray()[0].x <= -100) {
            this.muros.children.getArray()[0].destroy();
            this.jugando
        }
        if (this.guacamaya.y >= config.height) {
            this.guacamaya.y = 0;
        }

    }
    dibujarMuro() {
        for (let i = 0; i < config.height / (16 * config.scale); i++) {
            if(i < this.agujero || i > this.agujero + 2) {
            const muro = this.add.image(config.width,16 * config.scale * i,"muro",67+48);
            muro.setOrigin(0,0);
            muro.setScale(config.scale);
            this.muros.add(muro);
            }
        }
    }
    colision(muro) {
        if (muro.x > this.guacamaya.x - 70 &&
            muro.x < this.guacamaya.x + 20 &&
            muro.y >= this.guacamaya.y - 70 &&
            muro.y <= this.guacamaya.y + 20) {
                return true;
            }
        return false;
    }
}

