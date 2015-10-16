var Screen = Screen || {};
Screen.initialize = function(){
    Screen.canvas = document.getElementById("screen");
    Screen.contex = Screen.canvas.getContext("2d");
    Screen.offScreenCanvas = document.createElement("canvas");
    Screen.offScreenCanvas.width = Definitions.screenWidth;
    Screen.offScreenCanvas.height = Definitions.screenHeight;
    Screen.offScreenContex = Screen.offScreenCanvas.getContext("2d");
    if( ! Screen.contex ){
	window.alert("screen.js: Screen.initialize: Cannot get canvas contex!!");
	return -1;
    }
    Screen.blackPixel = Screen.offScreenContex.createImageData( 1, 1);
    Screen.whitePixel = Screen.offScreenContex.createImageData( 1, 1);
 
    Screen.blackPixel.data[ 0 ] = 0;
    Screen.blackPixel.data[ 1 ] = 0;
    Screen.blackPixel.data[ 2 ] = 0;
    Screen.blackPixel.data[ 3 ] = 255;

    Screen.whitePixel.data[ 0 ] = 255;
    Screen.whitePixel.data[ 1 ] = 255;
    Screen.whitePixel.data[ 2 ] = 255;
    Screen.whitePixel.data[ 3 ] = 255;
    return 0;
};

Screen.drawCanvas = function (){
    UI.fps += 1;
    Screen.contex.drawImage( Screen.offScreenCanvas , 0 , 0 );
    if( UI.Control.run ){
	requestAnimationFrame( Screen.drawCanvas );
//	window.setTimeout( Screen.drawCanvas , 50 );
    }
};

Screen.writeScreen = function ( address , value ){
    var relativeAddr = address - Definitions.addressScreenStart;
    var y = parseInt( (relativeAddr*16)  / Definitions.screenWidth);
    var x = (relativeAddr*16) % Definitions.screenWidth;
    
    for( var i = 15 ; i >= 0 ; --i ){


	if( ( value & 1 ) != 0 ){	    
	    Screen.offScreenContex.putImageData( Screen.blackPixel , x + i , y);
//	    Screen.offScreenContex.fillStyle = "rgb(0,0,0)";  	
	}else{
	    Screen.offScreenContex.putImageData( Screen.whitePixel , x + i , y);
//	    Screen.offScreenContex.fillStyle = "rgb(255,255,255)";  
	}
//	Screen.offScreenContex.fillRect( x + i , y , 1 , 1);
	value = value >>> 1;
    }
};
