var Definitions = Definitions || {};
Definitions.instructionLength = 16; //16 bit
Definitions.instructionNFormat = 2;
Definitions.aluOPLength = 6;
Definitions.ramSize = 32768;//32K
Definitions.romSize = 32768;//32K
Definitions.addressScreenStart = 16384;
Definitions.addressScreenEnd = 24575;
Definitions.screenWidth = 512;
Definitions.screenHeight = 256;

Definitions.addressKeyboard = 24576;
Definitions.formatIndicator = { "position" : 15 , "length" : 1 };
Definitions.formatInfo = {};
Definitions.formatInfo[0] = {
    "immediate" : { "position" : 0 , "length" : 15 }
};
Definitions.formatInfo[1] = {
    "muxAM" : { "position" : 12 , "length" : 1 },
    "aluOP" : { "position" : 6 , "length" : 6 },
    "writeA" : { "position" : 5 , "length" : 1 },
    "writeD" : { "position" : 4 , "length" : 1 },
    "writeM" : { "position" : 3 , "length" : 1 },
    "jmpL" : { "position" : 2 , "length" : 1 },
    "jmpE" : { "position" : 1 , "length" : 1 },
    "jmpG" : { "position" : 0 , "length" : 1 }
};
