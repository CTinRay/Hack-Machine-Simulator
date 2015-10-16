var UI = UI || {};
UI.define = UI.define || {};

UI.define.romPageSize = 50;

UI.initialize = function(){
    UI.machineReady = false
    UI.Control = {};;
    UI.Control.run = false;
    UI.frequency = 0;
    UI.fps = 0;
    UI.eleFreq = $("#frequency");
    window.setInterval( UI.zeroFrequency , 10000 );
    $("#divControls").append("<input type = 'file' id = 'hackFile' ></input>");
    $("#hackFile").attr("onchange", "UI.onFileSelected(this.files[0])");
    $( "#btnRun" ).click( UI.run );			
};	

$(document).ready(UI.initialize);

UI.log = function( string ){
    console.log( string );
};

UI.zeroFrequency = function(){
    var f = UI.frequency;
    var p = UI.fps;
    UI.frequency = 0;
    UI.fps = 0;
    UI.eleFreq.text("Instructions/second:"+f+" ,Frames/second:" + p );    
};

UI.run = function(){
    UI.Control.run = true;
    UI.execute();
    Screen.drawCanvas();
};

UI.execute = function(){
    UI.frequency += 1;
    for( var i = 0 ; i< 1000000 ; ++i ){
	Machine.execute();
    }
    if(UI.Control.run ){
	window.setTimeout( UI.execute , 0 );
    }
};

UI.onFileSelected = function( file ){
    console.log("File loaded!!");
    File.loadToString( file );
};

UI.onFileLoaded = function(){
    if( Machine.initialize() == -1 ){
	window.alert("Machine initialize fail. Simulation abort." );
	UI.machineReady = false;
	return -1;
    }else{
	UI.machineReady = true;
    }
    UI.printROM( Machine.rom );
//    UI.testScreen();
};

UI.testScreen = function(){
    for( var i = Definitions.addressScreenStart ; i <= Definitions.addressScreenEnd ; ++i ){
	Screen.updateScreen( i , -1 );

    }
};

UI.printROM = function(rom){
    for( var i = 0 ; i < UI.define.romPageSize ; ++i ){
	var strTR = "<tr><td>" + i + "</td><td>" + rom.arrStrBin[ i ] + "</td><td>"
 	    + UI.Deassembly.deassembler( rom.arrDecoded[i] ) + "</td></tr>" ;	
	$("#memTable").append(strTR);
    }
};


/*Definitions.formatInfo[0] = {
    "immediate" : { "position" : 0 , "length" : 15 }
};
Definitions.formatInfo[1] = {
    "muxAM" : { "position" : 12 , "length" : 1 },
    "aluOP" : { "position" : 6 , "length" : 6 },
    "writeA" : { "position" : 5 , "length" : 1 },
    "writeD" : { "position" : 4 , "length" : 1 },
    "writeM" : { "position" : 3 , "length" : 1 },
    "cmpL" : { "position" : 2 , "length" : 1 },
    "cmpE" : { "position" : 1 , "length" : 1 },
    "cmpG" : { "position" : 0 , "length" : 1 }
};
*/

UI.Deassembly = UI.Deassembly || {};

UI.Deassembly.jmpTable = {
    "000":"",
    "001":";JGT",
    "010":";JEQ",
    "011":";JGE",
    "100":";JLT",
    "101":";JNE",
    "110":";JLE",
    "111":";JMP"
};

UI.Deassembly.aluOPTable = {
    42:"0",//101010
    63:"1",//111111
    58:"-1",//111010
    12:"D",//001100
    48:"A",//110000
    13:"!D",//001101
    51:"!A",//110011
    15:"-D",//001111
    51:"-A",//110011
    31:"D+1",//011111
    55:"A+1",//110111
    14:"D-1",//001110
    50:"A-1",//110010
    2:"D+A",//000010
    19:"D-A",//010011
    7:"A-D",//000111
    0:"D&A",//000000
    21:"D|A"//010101
};
    
UI.Deassembly.aluOPTableM = {
    42:"0",//101010
    63:"1",//111111
    58:"-1",//111010
    12:"D",//001100
    48:"M",//110000
    13:"!D",//001101
    51:"!M",//110011
    15:"-D",//001111
    51:"-M",//110011
    31:"D+1",//011111
    55:"M+1",//110111
    14:"D-1",//001110
    50:"M-1",//110010
    2:"D+M",//000010
    19:"D-M",//010011
    7:"M-D",//000111
    0:"D&M",//000000
    21:"D|M"//010101
};


UI.Deassembly.deassembler = function ( oDecoded ){
    var strDeassembly = "";
    if( oDecoded.nFormatType == 0 ){
	strDeassembly = "@" + oDecoded["immediate"];
    }else if( oDecoded.nFormatType == 1 ){
	if( oDecoded.writeM ){
	    strDeassembly = "M=";
	}else if( oDecoded.writeA ){
	    strDeassembly = "A=";
	}else if( oDecoded.writeD ){
	    strDeassembly = "D=";
	}
	if( oDecoded.muxAM == 0 ){
	    strDeassembly = strDeassembly + UI.Deassembly.aluOPTable[ oDecoded.aluOP ];
	}else{
	    strDeassembly = strDeassembly + UI.Deassembly.aluOPTableM[ oDecoded.aluOP ];
	}
	var strJMP = "" + oDecoded.jmpL + oDecoded.jmpE + oDecoded.jmpG ;
	strDeassembly = strDeassembly + UI.Deassembly.jmpTable[ strJMP ];
    }
    return strDeassembly;
};


UI.onKeyChange = function( string ){
    $("#pressedKey").text( string );
};
