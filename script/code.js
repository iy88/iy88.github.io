function encryption(Str) {
    this.str =Str;
    this.restr = "";
    for(let i=0;i<this.str.length;i++){
        if(this.str[i] == "a"){
            this.restr += "a";
        }else if(this.str[i] == "b"){
            this.restr += "c";
        }else if(this.str[i] == "c"){
            this.restr += "e";
        }else if(this.str[i] == "d"){
            this.restr += "g";
        }else if(this.str[i] == "e"){
            this.restr += "i";
        }else if(this.str[i] == "f"){
            this.restr += "k";
        }else if(this.str[i] == "g"){
            this.restr += "m";
        }else if(this.str[i] == "h"){
            this.restr += "o";
        }else if(this.str[i] == "i"){
            this.restr += "q";
        }else if(this.str[i] == "j"){
            this.restr += "s";
        }else if(this.str[i] == "k"){
            this.restr += "u";
        }else if(this.str[i] == "l"){
            this.restr += "w";
        }else if(this.str[i] == "m"){
            this.restr += "y";
        }else if(this.str[i] == "n"){
            this.restr += "b";
        }else if (this.str[i] == "o"){
            this.restr += "d";
        }else if(this.str[i] == "p"){
            this.restr += "f";
        }else if(this.str[i] == "q"){
            this.restr += "h";
        }else if(this.str[i] == "r"){
            this.restr += "j";
        }else if(this.str[i] == "s"){
            this.restr += "l";
        }else if(this.str[i] == "t"){
            this.restr += "n";
        }else if(this.str[i] == "u"){
            this.restr += "p";
        }else if(this.str[i] == "v"){
            this.restr += "r";
        }else if(this.str[i] == "w"){
            this.restr += "t";
        }else if(this.str[i] == "x"){
            this.restr += "v";
        }else if(this.str[i] == "y"){
            this.restr += "x";
        }else if(this.str[i] == "z"){
            this.restr += "z";
        }else if(this.str[i] == "A"){
            this.restr += "A";
        }else if(this.str[i] == "B"){
            this.restr += "C";
        }else if(this.str[i] == "C"){
            this.restr += "E";
        }else if(this.str[i] == "D"){
            this.restr += "G";
        }else if(this.str[i] == "E"){
            this.restr += "I";
        }else if(this.str[i] == "F"){
            this.restr += "K";
        }else if(this.str[i] == "G"){
            this.restr += "M";
        }else if(this.str[i] == "H"){
            this.restr += "O";
        }else if(this.str[i] == "I"){
            this.restr += "Q";
        }else if(this.str[i] == "J"){
            this.restr += "S";
        }else if(this.str[i] == "K"){
            this.restr += "U";
        }else if(this.str[i] == "L"){
            this.restr += "W";
        }else if(this.str[i] == "M"){
            this.restr += "Y";
        }else if(this.str[i] == "N"){
            this.restr += "B";
        }else if (this.str[i] == "O"){
            this.restr += "D";
        }else if(this.str[i] == "P"){
            this.restr += "F";
        }else if(this.str[i] == "Q"){
            this.restr += "H";
        }else if(this.str[i] == "R"){
            this.restr += "J";
        }else if(this.str[i] == "S"){
            this.restr += "L";
        }else if(this.str[i] == "T"){
            this.restr += "N";
        }else if(this.str[i] == "U"){
            this.restr += "P";
        }else if(this.str[i] == "V"){
            this.restr += "R";
        }else if(this.str[i] == "W"){
            this.restr += "T";
        }else if(this.str[i] == "X"){
            this.restr += "V";
        }else if(this.str[i] == "Y"){
            this.restr += "X";
        }else if(this.str[i] == "Z"){
            this.restr += "Z";
        }else{
            this.restr += this.str[i];
        }
    }
    return this.restr
}

function unencryption(Str) {
    this.str = Str;
    this.restr = "";
    for(let i=0;i<this.str.length;i++){
        if(this.str[i] == "a"){
            this.restr += "a";
        }else if(this.str[i] == "c"){
            this.restr += "b";
        }else if(this.str[i] == "e"){
            this.restr += "c";
        }else if(this.str[i] == "g"){
            this.restr += "d";
        }else if(this.str[i] == "i"){
            this.restr += "e";
        }else if(this.str[i] == "k"){
            this.restr += "f";
        }else if(this.str[i] == "m"){
            this.restr += "g";
        }else if(this.str[i] == "o"){
            this.restr += "h";
        }else if(this.str[i] == "q"){
            this.restr += "i";
        }else if(this.str[i] == "s"){
            this.restr += "j";
        }else if(this.str[i] == "u"){
            this.restr += "k";
        }else if(this.str[i] == "w"){
            this.restr += "l";
        }else if(this.str[i] == "y"){
            this.restr += "m";
        }else if(this.str[i] == "b"){
            this.restr += "n";
        }else if (this.str[i] == "d"){
            this.restr += "o";
        }else if(this.str[i] == "f"){
            this.restr += "p";
        }else if(this.str[i] == "h"){
            this.restr += "q";
        }else if(this.str[i] == "j"){
            this.restr += "r";
        }else if(this.str[i] == "l"){
            this.restr += "s";
        }else if(this.str[i] == "n"){
            this.restr += "t";
        }else if(this.str[i] == "p"){
            this.restr += "u";
        }else if(this.str[i] == "r"){
            this.restr += "v";
        }else if(this.str[i] == "t"){
            this.restr += "w";
        }else if(this.str[i] == "v"){
            this.restr += "x";
        }else if(this.str[i] == "x"){
            this.restr += "y";
        }else if(this.str[i] == "z"){
            this.restr += "z";
        }else if(this.str[i] == "a"){
            this.restr += "a";
        }else if(this.str[i] == "C"){
            this.restr += "B";
        }else if(this.str[i] == "E"){
            this.restr += "C";
        }else if(this.str[i] == "G"){
            this.restr += "D";
        }else if(this.str[i] == "I"){
            this.restr += "E";
        }else if(this.str[i] == "K"){
            this.restr += "F";
        }else if(this.str[i] == "M"){
            this.restr += "G";
        }else if(this.str[i] == "O"){
            this.restr += "H";
        }else if(this.str[i] == "Q"){
            this.restr += "I";
        }else if(this.str[i] == "S"){
            this.restr += "J";
        }else if(this.str[i] == "U"){
            this.restr += "K";
        }else if(this.str[i] == "W"){
            this.restr += "L";
        }else if(this.str[i] == "Y"){
            this.restr += "M";
        }else if(this.str[i] == "B"){
            this.restr += "N";
        }else if (this.str[i] == "D"){
            this.restr += "O";
        }else if(this.str[i] == "F"){
            this.restr += "P";
        }else if(this.str[i] == "H"){
            this.restr += "Q";
        }else if(this.str[i] == "J"){
            this.restr += "R";
        }else if(this.str[i] == "L"){
            this.restr += "S";
        }else if(this.str[i] == "N"){
            this.restr += "T";
        }else if(this.str[i] == "P"){
            this.restr += "U";
        }else if(this.str[i] == "R"){
            this.restr += "V";
        }else if(this.str[i] == "T"){
            this.restr += "W";
        }else if(this.str[i] == "V"){
            this.restr += "X";
        }else if(this.str[i] == "X"){
            this.restr += "Y";
        }else if(this.str[i] == "Z"){
            this.restr += "Z";
        }else{
            this.restr += this.str[i];
        }
    }
    return this.restr
}
function ve(Str) {
    this.str =Str;
    this.restr = "";
    for(let i=0;i<this.str.length;i++){
        if(this.str[i] == "a"){
            this.restr += "a";
        }else if(this.str[i] == "b"){
            this.restr += "c";
        }else if(this.str[i] == "c"){
            this.restr += "e";
        }else if(this.str[i] == "d"){
            this.restr += "g";
        }else if(this.str[i] == "e"){
            this.restr += "i";
        }else if(this.str[i] == "f"){
            this.restr += "k";
        }else if(this.str[i] == "g"){
            this.restr += "m";
        }else if(this.str[i] == "h"){
            this.restr += "o";
        }else if(this.str[i] == "i"){
            this.restr += "q";
        }else if(this.str[i] == "j"){
            this.restr += "s";
        }else if(this.str[i] == "k"){
            this.restr += "u";
        }else if(this.str[i] == "l"){
            this.restr += "w";
        }else if(this.str[i] == "m"){
            this.restr += "y";
        }else if(this.str[i] == "n"){
            this.restr += "b";
        }else if (this.str[i] == "o"){
            this.restr += "d";
        }else if(this.str[i] == "p"){
            this.restr += "f";
        }else if(this.str[i] == "q"){
            this.restr += "h";
        }else if(this.str[i] == "r"){
            this.restr += "j";
        }else if(this.str[i] == "s"){
            this.restr += "l";
        }else if(this.str[i] == "t"){
            this.restr += "n";
        }else if(this.str[i] == "u"){
            this.restr += "p";
        }else if(this.str[i] == "v"){
            this.restr += "r";
        }else if(this.str[i] == "w"){
            this.restr += "t";
        }else if(this.str[i] == "x"){
            this.restr += "v";
        }else if(this.str[i] == "y"){
            this.restr += "x";
        }else if(this.str[i] == "z"){
            this.restr += "z";
        }else if(this.str[i] == "A"){
            this.restr += "A";
        }else if(this.str[i] == "B"){
            this.restr += "C";
        }else if(this.str[i] == "C"){
            this.restr += "E";
        }else if(this.str[i] == "D"){
            this.restr += "G";
        }else if(this.str[i] == "E"){
            this.restr += "I";
        }else if(this.str[i] == "F"){
            this.restr += "K";
        }else if(this.str[i] == "G"){
            this.restr += "M";
        }else if(this.str[i] == "H"){
            this.restr += "O";
        }else if(this.str[i] == "I"){
            this.restr += "Q";
        }else if(this.str[i] == "J"){
            this.restr += "S";
        }else if(this.str[i] == "K"){
            this.restr += "U";
        }else if(this.str[i] == "L"){
            this.restr += "W";
        }else if(this.str[i] == "M"){
            this.restr += "Y";
        }else if(this.str[i] == "N"){
            this.restr += "B";
        }else if (this.str[i] == "O"){
            this.restr += "D";
        }else if(this.str[i] == "P"){
            this.restr += "F";
        }else if(this.str[i] == "Q"){
            this.restr += "H";
        }else if(this.str[i] == "R"){
            this.restr += "J";
        }else if(this.str[i] == "S"){
            this.restr += "L";
        }else if(this.str[i] == "T"){
            this.restr += "N";
        }else if(this.str[i] == "U"){
            this.restr += "P";
        }else if(this.str[i] == "V"){
            this.restr += "R";
        }else if(this.str[i] == "W"){
            this.restr += "T";
        }else if(this.str[i] == "X"){
            this.restr += "V";
        }else if(this.str[i] == "Y"){
            this.restr += "X";
        }else if(this.str[i] == "Z"){
            this.restr += "Z";
        }else if(this.str[i] == "1"){
            this.restr += "!";
        }else if(this.str[i] == "2"){
            this.restr += "@";
        }else if(this.str[i] == "3"){
            this.restr += "#";
        }else if(this.str[i] == "4"){
            this.restr += "$";
        }else if(this.str[i] == "5"){
            this.restr += "%";
        }else if(this.str[i] == "6"){
            this.restr += "^";
        }else if(this.str[i] == "7"){
            this.restr += "&";
        }else if(this.str[i] == "8"){
            this.restr += "*";
        }else if(this.str[i] == "9"){
            this.restr += "~";
        }else if(this.str[i] == "0"){
            this.restr += "-";
        }else{
            this.restr += this.str[i];
        }
    }
    return this.restr
}

function vu(Str) {
    this.str = Str;
    this.restr = "";
    for(let i=0;i<this.str.length;i++){
        if(this.str[i] == "a"){
            this.restr += "a";
        }else if(this.str[i] == "c"){
            this.restr += "b";
        }else if(this.str[i] == "e"){
            this.restr += "c";
        }else if(this.str[i] == "g"){
            this.restr += "d";
        }else if(this.str[i] == "i"){
            this.restr += "e";
        }else if(this.str[i] == "k"){
            this.restr += "f";
        }else if(this.str[i] == "m"){
            this.restr += "g";
        }else if(this.str[i] == "o"){
            this.restr += "h";
        }else if(this.str[i] == "q"){
            this.restr += "i";
        }else if(this.str[i] == "s"){
            this.restr += "j";
        }else if(this.str[i] == "u"){
            this.restr += "k";
        }else if(this.str[i] == "w"){
            this.restr += "l";
        }else if(this.str[i] == "y"){
            this.restr += "m";
        }else if(this.str[i] == "b"){
            this.restr += "n";
        }else if (this.str[i] == "d"){
            this.restr += "o";
        }else if(this.str[i] == "f"){
            this.restr += "p";
        }else if(this.str[i] == "h"){
            this.restr += "q";
        }else if(this.str[i] == "j"){
            this.restr += "r";
        }else if(this.str[i] == "l"){
            this.restr += "s";
        }else if(this.str[i] == "n"){
            this.restr += "t";
        }else if(this.str[i] == "p"){
            this.restr += "u";
        }else if(this.str[i] == "r"){
            this.restr += "v";
        }else if(this.str[i] == "t"){
            this.restr += "w";
        }else if(this.str[i] == "v"){
            this.restr += "x";
        }else if(this.str[i] == "x"){
            this.restr += "y";
        }else if(this.str[i] == "z"){
            this.restr += "z";
        }else if(this.str[i] == "a"){
            this.restr += "a";
        }else if(this.str[i] == "C"){
            this.restr += "B";
        }else if(this.str[i] == "E"){
            this.restr += "C";
        }else if(this.str[i] == "G"){
            this.restr += "D";
        }else if(this.str[i] == "I"){
            this.restr += "E";
        }else if(this.str[i] == "K"){
            this.restr += "F";
        }else if(this.str[i] == "M"){
            this.restr += "G";
        }else if(this.str[i] == "O"){
            this.restr += "H";
        }else if(this.str[i] == "Q"){
            this.restr += "I";
        }else if(this.str[i] == "S"){
            this.restr += "J";
        }else if(this.str[i] == "U"){
            this.restr += "K";
        }else if(this.str[i] == "W"){
            this.restr += "L";
        }else if(this.str[i] == "Y"){
            this.restr += "M";
        }else if(this.str[i] == "B"){
            this.restr += "N";
        }else if (this.str[i] == "D"){
            this.restr += "O";
        }else if(this.str[i] == "F"){
            this.restr += "P";
        }else if(this.str[i] == "H"){
            this.restr += "Q";
        }else if(this.str[i] == "J"){
            this.restr += "R";
        }else if(this.str[i] == "L"){
            this.restr += "S";
        }else if(this.str[i] == "N"){
            this.restr += "T";
        }else if(this.str[i] == "P"){
            this.restr += "U";
        }else if(this.str[i] == "R"){
            this.restr += "V";
        }else if(this.str[i] == "T"){
            this.restr += "W";
        }else if(this.str[i] == "V"){
            this.restr += "X";
        }else if(this.str[i] == "X"){
            this.restr += "Y";
        }else if(this.str[i] == "Z"){
            this.restr += "Z";
        }else if(this.str[i] == "!"){
            this.restr += "1";
        }else if(this.str[i] == "@"){
            this.restr += "2";
        }else if(this.str[i] == "#"){
            this.restr += "3";
        }else if(this.str[i] == "$"){
            this.restr += "4";
        }else if(this.str[i] == "%"){
            this.restr += "5";
        }else if(this.str[i] == "^"){
            this.restr += "6";
        }else if(this.str[i] == "&"){
            this.restr += "7";
        }else if(this.str[i] == "*"){
            this.restr += "8";
        }else if(this.str[i] == "~"){
            this.restr += "9";
        }else if(this.str[i] == "-"){
            this.restr += "0";
        }else{
            this.restr += this.str[i];
        }
    }
    return this.restr
}


