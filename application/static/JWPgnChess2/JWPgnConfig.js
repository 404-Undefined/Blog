/*
 copyright Mathieu Wolff / 2009
 
 beta version 
*/

//----------------------------------
// modifiables
//----------------------------------

var JWC_APPPATH = "../static";
var JWC_LANGUE = "en"; // en ou fr
var JWC_TAILLECASE = 45;

//----------------------------------
// calculees fonctions precedents
// dont touch
//----------------------------------

// path
var JWC_BASEPATH = JWC_APPPATH + "/JWPgnChess2/";
var JWC_IMAGEPATH = JWC_BASEPATH + "jwc_images/";

// constantes des pieces
// anglais defaut (en)
var JWC_ROI = "k";
var JWC_DAME = "q";
var JWC_PION = "p";
var JWC_TOUR = "r";
var JWC_CAVALIER = "n";
var JWC_FOU = "b";
if (JWC_LANGUE == "fr") {
  JWC_ROI = "r";
  JWC_DAME = "d";
  JWC_PION = "p";
  JWC_TOUR = "t";
  JWC_CAVALIER = "c";
  JWC_FOU = "f";
}

//----------------------------------
// include css
//----------------------------------
document.write(
  '<link type="text/css" href="' +
    JWC_BASEPATH +
    'jwc_styles/jwc_styles.css" rel="stylesheet" />'
);

//----------------------------------
// include js
//----------------------------------
document.write('<script src="' + JWC_BASEPATH + '/JWPgnUtils.js"></script>');
document.write('<script src="' + JWC_BASEPATH + '/JWPgnDecodeur.js"></script>');
document.write('<script src="' + JWC_BASEPATH + '/JWPgnFenX.js"></script>');
document.write('<script src="' + JWC_BASEPATH + '/JWPgnPartie.js"></script>');
document.write('<script src="' + JWC_BASEPATH + '/JWPgnChess.js"></script>');
