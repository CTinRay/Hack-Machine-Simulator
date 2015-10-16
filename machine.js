var Machine = Machine || {} ;
(function(){
    var Decoder = Decoder || {} ;
    Decoder.getElementValue = function( binary , eleAttr ){
	var mask = 1 << eleAttr["length"];
	mask -= 1;
	binary = binary >> eleAttr["position"];
	return binary & mask ;
    }

    Decoder.decode = function( binary ){
	var oDecoded = {};
	var nFormatType = Decoder.getElementValue( binary , Definitions.formatIndicator );
	var formatInfo = Definitions.formatInfo[ nFormatType ];
	oDecoded.nFormatType = nFormatType;
	for(var index in formatInfo){
	    oDecoded[index] = Decoder.getElementValue( binary , formatInfo[ index ] );
	} 
	return oDecoded;
    }				  
    Machine.Decoder = Decoder;
})();


Machine.initialize = function(){
    console.log("Machine start to initialize...");
    this.programCounter = 0;
    this.regA = 0;
    this.regB = 0;
    this.rom = {};
    this.ram = new Uint16Array( Definitions.ramSize ); 
    this.rom = File.createROM();
    this.rom.arrDecoded = {};
    for( var i = 0 ; i < Definitions.romSize ; ++i ){
	this.rom.arrDecoded[i] = Machine.Decoder.decode( this.rom.storage[i] );
    }
    if( this.rom == -1 ){ return -1; }
    if( Screen.initialize() == -1 ){ return -1; }
    if( Keyboard.initialize() == -1 ){ return -1; }
    console.log("Machine initialization finished!!");
};

Machine.ALU = Machine.ALU || {};

Machine.ALU.compute = function( op, in1, in2 ){
    switch( op ){
    case 42://101010
	return 0;
    
    case 63://111111
	return 1;
    
    case 58://111010
	return -1;
    
    case 12://001100
	return in2;
    
    case 48://110000
	return in1;
    
    case 13://001101
	return (~in2);
    
    case 51://110011
	return (~A);
    
    case 15://001111
	return -in2;
    
    case 51://110011
	return -in1;
    
    case 31://011111
	return in2+1;
    
    case 55://110111
	return in1 + 1;
    
    case 14://001110
	return in2 - 1;
    
    case 50://110010
	return in1 - 1;
    
    case 2://000010
	return in1 + in2;
    
    case 19://010011
	return in2 - in1;
    
    case 7://000111
	return in1 - in2;
    
    case 0://000000
	return in1 & in2;
    
    case 21://010101
	return in1 | in2;
    
    }
};


Machine.execute = function(){

    //fetch instructions
    var pc = Machine.programCounter;
    var oDecoded = Machine.rom.arrDecoded[ pc ];
    var regA = Machine.regA;
    var regD = Machine.regD;
    Machine.programCounter += 1;
    //Process instruction
    if( oDecoded["nFormatType"] == 1 ){
	var muxAM = oDecoded.muxAM;
	var aluIn1 = muxAM ? Machine.ram[ regA ]: regA ; //Decide alu-input-1 is A or M
	var aluIn2 = regD;
	var aluResult = Machine.ALU.compute( oDecoded.aluOP , aluIn1 , aluIn2 );
	//Decide where to write the result
	if( oDecoded.writeA ){ 
	    Machine.regA = aluResult;
	}
	if( oDecoded.writeD ){ 
	    Machine.regD = aluResult;
	}
	if( oDecoded.writeM ){ 
	    Machine.ram[ regA ] = aluResult;

	    //Update Screen dynamicly.
	    if( regA >= Definitions.addressScreenStart &&  
		regA <= Definitions.addressScreenEnd ){
//		window.setTimeout(Screen.writeScreen, 0, regA, aluResult );
		Screen.writeScreen( regA, aluResult );
	    }
	}

	//Decide wheather or not to jump. ( jump = set programcounter )
	if( (oDecoded.jmpL && aluResult < 0) ||
	    (oDecoded.jmpE && aluResult == 0) ||
	    (oDecoded.jmpG && aluResult > 0)    ){
	    Machine.programCounter = Machine.regA ;
	}
	
    }else{//Process @ instructions
	Machine.regA = oDecoded.immediate;
    }
};




/*
//Legacy
Machine.ALU.compute = function( op , in1, in2 ){
    var mask = 1 << ( Definitions.aluOPLength - 1 );
    var result;
    //0
    if( mask & op ){
	in1 = 0;
    }

    mask >>> 1;//1
    if( mask & op ){
	in1 = ~in1;
    }

    mask >>> 1;//2
    if( mask & op ){
	in2 = 0;
    }

    mask >>> 1;//3
    if( mask & op ){
	in2 = ~in2;
    }

    mask >>> 1;//4
    result = ( mask & op ) ? ( in1 + in2 ) : ( in1 & in2 );

    mask >>> 1;//5
    if( mask & op ){
	result = ~result;
    }

    return result;
};
*/
