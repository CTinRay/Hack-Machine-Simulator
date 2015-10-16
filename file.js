var File = File || {};

File.loadToString = function ( file ){
    var fileReader = new FileReader();

    fileReader.onError = function(e){
	window.alert("file.js: Load File Error");
    };

    fileReader.onload = function( load ){
	File.fileString = load.target.result;
	UI.onFileLoaded();
    };


    fileReader.readAsText(file);
};

File.createROM = function(){
    if( !File.fileString ){
	window.alert( "Please select a file first!!" );
	return -1;
    }
    var rom = {};
    rom.arrStrBin = {};
    rom.storage = new Uint16Array( Definitions.romSize );
    for( var i = 17 ; i <= File.fileString.length ; i+=17 ){
	var binString = rom.arrStrBin[ i/17 - 1 ] = File.fileString.slice( i - 17 , i - 1  );
	rom.storage[ i/17 -1 ] = parseInt( binString , 2 );
    }  
    return rom;
 
};
