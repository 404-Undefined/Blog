/*
 copyright Mathieu Wolff / 2009
 
 beta version 
*/
//------------------------------------------------------------------------------

function JWPgnChess_trim(str, chars) 
{
	return JWPgnChess_ltrim(JWPgnChess_rtrim(str, chars), chars);
}

//------------------------------------------------------------------------------
 
function JWPgnChess_ltrim(str, chars)
{
	chars = chars || "\\s";
	return str.replace(new RegExp("^[" + chars + "]+", "g"), "");
}
 
//------------------------------------------------------------------------------
 
function JWPgnChess_rtrim(str, chars) 
{
	chars = chars || "\\s";
	return str.replace(new RegExp("[" + chars + "]+$", "g"), "");
}

//------------------------------------------------------------------------------

function JWPgnChess_d(str) 
{
	document.write(str+"<br/>");
}

//------------------------------------------------------------------------------

function JWPgnChess_dTab(tab) 
{
    for(var i=0; i < tab.length; i++)
    document.write("tab [" + i + "] : " + tab[i] + "<br/>");
}

//------------------------------------------------------------------------------
