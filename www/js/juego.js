var app = {
    inicio: function(){
        DIAMETRO_BOLA = 50;
        velocidadNave = 4;
        velocidadX = 0;
        velocidadY = 0;
        puntuacion = 0;
        dificultad = 0;
        
        alto = document.documentElement.clientHeight;
        ancho = document.documentElement.clientWidth;
        
        app.vigilaSensores();
        app.iniciaJuego();
    },
    
    iniciaJuego: function(){
        
        function preload(){
            game.physics.startSystem(Phaser.Physics.ARCADE);
            
            game.stage.backgroundColor = '#40E0D0';
            game.load.image('objetivo', 'imagenes/objetivo.png');
            game.load.image('bola', 'imagenes/bola.png');
            game.load.image('nave', 'imagenes/toad.png');
            game.load.audio('punto', 'imagenes/punto.ogg');
            //game.load.image('toad', 'imagenes/toad.png');
        }
        
        function create(){
            scoreText = game.add.text(16, 16, puntuacion, {fontSize: '100px', fill: '#98FB98'});
            punto = game.add.audio('punto');
            punto.allowMultiple = true;
            bola = game.add.sprite(app.inicioX(), app.inicioY(), 'bola');
            nave = game.add.sprite(game.with/2, game.height/2,'nave');
            game.physics.arcade.enable(bola);
            game.physics.arcade.enable(nave);
            nave.body.collideWorldBounds = true;
            nave.body.onWorldBounds = new Phaser.Signal(); 
            bola.body.collideWorldBounds = true;
            bola.body.onWorldBounds = new Phaser.Signal();
            bola.body.onWorldBounds.add(app.decrementaPuntuacion, this);
            nave.checkWorldBouns = true;
            nave.outOfBoundsKill = true;
        }
        
        function update(){
            var factorDificultad = (300 + (dificultad*100));
            bola.body.velocity.y = (velocidadY * factorDificultad);
            bola.body.velocity.x = (velocidadX * (-1*factorDificultad));
            nave.position.y += velocidadNave;
            game.physics.arcade.overlap(bola, nave, app.colisionNave, null, this);
            nave.body.onWorldBounds.add(app.fueraBorde,this);
        }
        
        var estados = {preload: preload, create: create, update: update};
        var game = new Phaser.Game(ancho, alto, Phaser.CANVAS, 'phaser', estados);
    },
    
    decrementaPuntuacion: function(){
        puntuacion = puntuacion-1;
        scoreText.text = puntuacion;
    },
    
    nuevaNave: function(){
        nueva = game.add.sprite(app.inicioX(), app.inicioY(),'nave');
    },
    

    fueraBorde: function(){
        nave.body.x = app.inicioX();
        nave.body.y = app.inicioY();
    },
    
    colisionNave: function(){
        velocidadNave = app.getRandomArbitrary(4,15);
        puntuacion = puntuacion +10;
        scoreText.text = puntuacion;
        nave.body.x = app.inicioX();
        nave.body.y = app.inicioY();
        punto.play();
    },

    
    inicioX: function(){
        return app.numeroAleatorioHasta(ancho - DIAMETRO_BOLA);
    },
    
    inicioY: function(){
        return 1;
    },
    
    numeroAleatorioHasta: function(limite){
        return Math.floor(Math.random() * limite);
    },
    
    getRandomArbitrary: function(min, max) {
      return Math.random() * (max - min) + min;
    },
    
    vigilaSensores: function(){
        function onError(){
            console.log('onError!');
        }
        
        function onSucces(datosAceleracion){
            app.detectaAgitacion(datosAceleracion);
            app.registraDireccion(datosAceleracion);
        }
        
        navigator.accelerometer.watchAcceleration(onSucces, onError, {frequency: 10});          
    },

    
    detectaAgitacion: function(datosAceleracion){
        agitacionX = datosAceleracion.x >10;
        agitacionY = datosAceleracion.y >10;
        
        if (agitacionX || agitacionY){
            setTimeout(app.recomienza, 1000);
        }
    },
    
    recomienza: function(){
        document.location.reload(true);
    },
    
    registraDireccion: function(datosAceleracion){
        velocidadX = datosAceleracion.x;
        velocidadY = datosAceleracion.y;
    }
    
};

if('addEventListener' in document){
    document.addEventListener('deviceready', function(){
        app.inicio();
    }, false);
}