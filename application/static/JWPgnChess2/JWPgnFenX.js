/*
 copyright Mathieu Wolff / 2009
 
 beta version 
*/


// -----------------------------------------------------------------------------
// Class JWPgnFenX
// -----------------------------------------------------------------------------

// Constructeur de la classe
function JWPgnFenX(positionDepart)
{
    //--------------------------------------------------------------------------
    // propriétés classe - init
    //--------------------------------------------------------------------------

    // params
    this.paramPositionDepart = positionDepart;

    // vars
    this.strFenX = '';
    
    // constantes
    this.refCols = "abcdefgh";
    
   
    //--------------------------------------------------------------------------
    // fonctions classe
    //--------------------------------------------------------------------------
    
    //init
    JWPgnFenX.prototype.init = function()
    {
        this.strFenX = JWC_TOUR+JWC_CAVALIER+JWC_FOU+JWC_DAME+JWC_ROI+JWC_FOU+JWC_CAVALIER+JWC_TOUR+JWC_PION+JWC_PION+JWC_PION+JWC_PION+JWC_PION+JWC_PION+JWC_PION+JWC_PION+"                                "+JWC_PION.toUpperCase()+JWC_PION.toUpperCase()+JWC_PION.toUpperCase()+JWC_PION.toUpperCase()+JWC_PION.toUpperCase()+JWC_PION.toUpperCase()+JWC_PION.toUpperCase()+JWC_PION.toUpperCase()+JWC_TOUR.toUpperCase()+JWC_CAVALIER.toUpperCase()+JWC_FOU.toUpperCase()+JWC_DAME.toUpperCase()+JWC_ROI.toUpperCase()+JWC_FOU.toUpperCase()+JWC_CAVALIER.toUpperCase()+JWC_TOUR.toUpperCase();
        if (this.paramPositionDepart)
            this.strFenX = this.paramPositionDepart;
    }
    
    //--------------------------------------------------------------------------
 
    // setPiece
    JWPgnFenX.prototype.setPiece = function(ligne,colonne,piece)
    {
        //JWPgnChess_d("setPiece ["+piece+"] ligne ["+ ligne +"] col ["+colonne+"]");
    
        if (ligne < 1) return "";
        if (ligne > 8) return "";
        var posColonne= this.refCols.indexOf(colonne);
        if (posColonne == -1) return "";        
        var ligneFen = 8 - ligne + 1;
        var posCaractereCherche = (ligneFen-1) * 8 +  posColonne;
        this.strFenX = this.strFenX.substring(0,posCaractereCherche) + piece + this.strFenX.substr(posCaractereCherche+1);
    };
    
    //--------------------------------------------------------------------------
 
    // getPiece
    JWPgnFenX.prototype.getPiece = function(ligne,colonne)
    {
        
        if (ligne < 1) return "";
        if (ligne > 8) return "";
        var posColonne= this.refCols.indexOf(colonne);
        if (posColonne == -1) return "";
        var ligneFen = 8 - ligne + 1;
        var posCaractereCherche = (ligneFen-1) * 8 +  posColonne;
        var res = this.strFenX.charAt(posCaractereCherche);
        
        //JWPgnChess_d("getPiece ligne ["+ ligne +"] col ["+colonne+"] res : ["+res+"]");
        
        return res;
    };
    
    
    //--------------------------------------------------------------------------
 
    // getStr
    JWPgnFenX.prototype.getStr = function()
    {
        return this.strFenX;
    };
    
    //--------------------------------------------------------------------------
 
    // getPositions -- ne traite pas les coups speciaux...genre prise passant, promotion, prise pion...
    JWPgnFenX.prototype.getPositions = function(coupPgn,typePieceAChercherFen,boolCroix,boolDiag,boolL,boolEtendu)
    {
        //-------------------
        // RES multi valeurs
        // : tab [0]= ligne depart [1] colonne Depart  [2] ligne arrrive [3] colonne arrivee
        //-------------------
        var res = new Array(); 
        
        //-------------------
        // but trouver ces 4 valeurs
        //-------------------
        var finColonne = "";
        var finLigne = -1;
        var departColonne = "";
        var departLigne = -1;
        var indicDepart = "";
        var indicIntDepart = -1; 
        var modeIndic = false;

        //-------------------
        // soit longueur 3 = deplacement normal
        //-------------------
        finColonne = coupPgn.substr(1,1);
        finLigne = parseInt(coupPgn.substr(2,1));
        
        //-------------------
        // soit longueur 4 = deplacement avec ambiguité, debut precise
        //-------------------
        if(coupPgn.length == 4)
        {
            indicDepart = coupPgn.substr(1,1);
            indicIntDepart = parseInt(indicDepart);
            modeIndic=true;
            finColonne = coupPgn.substr(2,1);
            finLigne = parseInt(coupPgn.substr(3,1));
        }
        // convertion colonne fin en nombre, pour faire du +1 - 1...
        posColonne= this.refCols.indexOf(finColonne);
                
        //-------------------
        // A ce stade il ne nous reste plus qu'a trouve departLigne et departColonne
        // selon le type de deplacement...on cherche en faisant des hypotheses
        // puis on verifie sur le plateau
        //-------------------
        var boolTrouve=false;
        
        
        //-------------------
        // recherche deplacement en L
        //-------------------
        if (boolL)
        {
            // 2 bas
            if (! boolTrouve)
            {
                departColonne = this.refCols.substr(posColonne-1,1);
                departLigne = finLigne-2;
                
                if (  (!modeIndic) || (departLigne == indicIntDepart || departColonne == indicDepart) )
                {
                    var contenuCase = this.getPiece(departLigne,departColonne);
                    if ( contenuCase == typePieceAChercherFen)
                         boolTrouve=true;
                }
            } 
            if (! boolTrouve)
            {
                departColonne = this.refCols.substr(posColonne+1,1);
                departLigne = finLigne-2;
                if (  (!modeIndic) || (departLigne == indicIntDepart || departColonne == indicDepart) )
                {
                    var contenuCase = this.getPiece(departLigne,departColonne);
                    if ( contenuCase == typePieceAChercherFen)
                         boolTrouve=true;
                }
            }
            // 2 haut
            if (! boolTrouve)
            {
                departColonne = this.refCols.substr(posColonne-1,1);
                departLigne = finLigne+2;
                if (  (!modeIndic) || (departLigne == indicIntDepart || departColonne == indicDepart) )
                {
                    var contenuCase = this.getPiece(departLigne,departColonne);
                    if ( contenuCase == typePieceAChercherFen)
                         boolTrouve=true;
                }
            } 
            if (! boolTrouve)
            {
                departColonne = this.refCols.substr(posColonne+1,1);
                departLigne = finLigne+2;
                if (  (!modeIndic) || (departLigne == indicIntDepart || departColonne == indicDepart) )
                {
                    var contenuCase = this.getPiece(departLigne,departColonne);
                    if ( contenuCase == typePieceAChercherFen)
                         boolTrouve=true;
                }
            }
            // 2 droite
            if (! boolTrouve)
            {
                departColonne = this.refCols.substr(posColonne+2,1);
                departLigne = finLigne-1;
                if (  (!modeIndic) || (departLigne == indicIntDepart || departColonne == indicDepart) )
                {
                    var contenuCase = this.getPiece(departLigne,departColonne);
                    if ( contenuCase == typePieceAChercherFen)
                         boolTrouve=true;
                }
            } 
            if (! boolTrouve)
            {
                departColonne = this.refCols.substr(posColonne+2,1);
                departLigne = finLigne+1;
                if (  (!modeIndic) || (departLigne == indicIntDepart || departColonne == indicDepart) )
                {
                    var contenuCase = this.getPiece(departLigne,departColonne);
                    if ( contenuCase == typePieceAChercherFen)
                         boolTrouve=true;
                }
            }
            // 2 gauche
            if (! boolTrouve)
            {
                departColonne = this.refCols.substr(posColonne-2,1);
                departLigne = finLigne+1;
                if (  (!modeIndic) || (departLigne == indicIntDepart || departColonne == indicDepart) )
                {
                    var contenuCase = this.getPiece(departLigne,departColonne);
                    if ( contenuCase == typePieceAChercherFen)
                         boolTrouve=true;
                }
            } 
            if (! boolTrouve)
            {
                departColonne = this.refCols.substr(posColonne-2,1);
                departLigne = finLigne-1;
                if (  (!modeIndic) || (departLigne == indicIntDepart || departColonne == indicDepart) )
                {
                    var contenuCase = this.getPiece(departLigne,departColonne);
                    if ( contenuCase == typePieceAChercherFen)
                         boolTrouve=true;
                }
            }
        }
        
        
        //-------------------
        // recherche deplacement en croix
        // attention cas etendu ou non, indic ou non
        //-------------------
        if (boolCroix)
        {
            // haut
            if (!boolTrouve)
            {
                var finBoucle = 8;
                if ( ! boolEtendu )
                    finBoucle = (finLigne+1);
                for(var i = (finLigne+1); i <= finBoucle ; ++i)
        		{
        			departColonne = finColonne;
                    departLigne = i;
                    if (  (!modeIndic) || (departLigne == indicIntDepart || departColonne == indicDepart) )
                    {
                        var contenuCase = this.getPiece(departLigne,departColonne);
                        if ( contenuCase == typePieceAChercherFen)
                        {
                             boolTrouve=true;
                             break;
                        }
                        else if (contenuCase != " ") // si obstacle stop
                        {
                            break;
                        }
                    }
        		}
        	}
        	// gauche
            if (!boolTrouve)
            {
                var finBoucle = 0;
                if ( ! boolEtendu )
                    finBoucle = (posColonne-1);
                for(var i = (posColonne-1); i >= finBoucle ; --i)
        		{
        			departColonne = this.refCols.substr(i,1);
                    departLigne = finLigne;
                    if (  (!modeIndic) || (departLigne == indicIntDepart || departColonne == indicDepart) )
                    {
                        var contenuCase = this.getPiece(departLigne,departColonne);
                        if ( contenuCase == typePieceAChercherFen)
                        {
                             boolTrouve=true;
                             break;
                        }
                        else if (contenuCase != " ") // si obstacle stop
                        {
                            break;
                        }
                    }
        		}
        	}
            //droite
            if (!boolTrouve)
            {
                var finBoucle = 7;
                if ( ! boolEtendu )
                    finBoucle = (posColonne+1);
                for(var i = (posColonne+1); i <= finBoucle ; ++i)
        		{
        			departColonne = this.refCols.substr(i,1);
                    departLigne = finLigne;
                    if (  (!modeIndic) || (departLigne == indicIntDepart || departColonne == indicDepart) )
                    {
                        var contenuCase = this.getPiece(departLigne,departColonne);
                        if ( contenuCase == typePieceAChercherFen)
                        {
                             boolTrouve=true;
                             break;
                        }
                        else if (contenuCase != " ") // si obstacle stop
                        {
                            break;
                        }
                    }
        		}
        	}
            //bas
            if (!boolTrouve)
            {
                var finBoucle = 1;
                if ( ! boolEtendu )
                    finBoucle = (finLigne-1);
                for(var i = (finLigne-1); i >= finBoucle ; --i)
        		{
        			departColonne = finColonne;
                    departLigne = i;
                    if (  (!modeIndic) || (departLigne == indicIntDepart || departColonne == indicDepart) )
                    {
                        var contenuCase = this.getPiece(departLigne,departColonne);
                        if ( contenuCase == typePieceAChercherFen)
                        {
                             boolTrouve=true;
                             break;
                        }
                        else if (contenuCase != " ") // si obstacle stop
                        {
                            break;
                        }
                    }
        		}
        	}
        }
        
        //-------------------
        // recherche deplacement en diag
        // attention etendu
        //-------------------
        if ( boolDiag)
        {
            // haut à gauche
            if (!boolTrouve)
            {
                var finBoucle = 0;
                if ( ! boolEtendu )
                    finBoucle = (posColonne-1);
                var ligneDest = finLigne;
        		for(var i = (posColonne-1); i >= finBoucle ; --i)
        		{                    		  
        			++ligneDest;
        			if (ligneDest <= 8)
        			{
                        departColonne = this.refCols.substr(i,1);
                        departLigne = ligneDest;
                        if (  (!modeIndic) || (departLigne == indicIntDepart || departColonne == indicDepart) )
                        {
                            var contenuCase = this.getPiece(departLigne,departColonne);
                            if ( contenuCase == typePieceAChercherFen)
                            {
                                 boolTrouve=true;
                                 break;
                            }
                            else if (contenuCase != " ") // si obstacle stop
                            {
                                break;
                            }
                        }
                    }
        		}
        	}
        	//haut droite
            if (!boolTrouve)
            {
                var finBoucle = 7;
                if ( ! boolEtendu )
                    finBoucle = (posColonne+1);
                var ligneDest = finLigne;
                ligneDest = finLigne;
        		for(var i = (posColonne+1); i <= finBoucle ; ++i)
        		{
        			++ligneDest;
        			if (ligneDest <= 8)
        			{
                        departColonne = this.refCols.substr(i,1);
                        departLigne = ligneDest;
                        if (  (!modeIndic) || (departLigne == indicIntDepart || departColonne == indicDepart) )
                        {
                            var contenuCase = this.getPiece(departLigne,departColonne);
                            if ( contenuCase == typePieceAChercherFen)
                            {
                                 boolTrouve=true;
                                 break;
                            }
                            else if (contenuCase != " ") // si obstacle stop
                            {
                                break;
                            }
                        }
                    }
        		}
        	}
            //bas gauche
            if (!boolTrouve)
            {
                var finBoucle = 0;
                if ( ! boolEtendu )
                    finBoucle = (posColonne-1);
                var ligneDest = finLigne;
        		for(var i = (posColonne-1); i >= finBoucle ; --i)
        		{
        			--ligneDest;
        			if (ligneDest >= 1)
        			{
                        departColonne = this.refCols.substr(i,1);
                        departLigne = ligneDest;
                        if (  (!modeIndic) || (departLigne == indicIntDepart || departColonne == indicDepart) )
                        {
                            var contenuCase = this.getPiece(departLigne,departColonne);
                            if ( contenuCase == typePieceAChercherFen)
                            {
                                 boolTrouve=true;
                                 break;
                            }
                            else if (contenuCase != " ") // si obstacle stop
                            {
                                break;
                            }
                        }
                    }
        		}
        	}
            //bas droite
            if (!boolTrouve)
            {
                var finBoucle = 7;
                if ( ! boolEtendu )
                    finBoucle = (posColonne+1);
                var ligneDest = finLigne;
        		for(var i = (posColonne+1); i <= finBoucle ; ++i)
        		{
        			--ligneDest;
        			if (ligneDest >= 1)
        			{
                        departColonne = this.refCols.substr(i,1);
                        departLigne = ligneDest;
                        if (  (!modeIndic) || (departLigne == indicIntDepart || departColonne == indicDepart) )
                        {
                            var contenuCase = this.getPiece(departLigne,departColonne);
                            if ( contenuCase == typePieceAChercherFen)
                            {
                                 boolTrouve=true;
                                 break;
                            }
                            else if (contenuCase != " ") // si obstacle stop
                            {
                                break;
                            }
                        }
                    }
        		}
        	}
        }
        
        //-------------------
        // si pas trouve gros die
        //-------------------
        if (! boolTrouve)
        {
            alert("erreur mouvement non trouve "+coupPgn +" "+typePieceAChercherFen);
            return;      
        }
        
        
        //-------------------
        // assin et res
        //-------------------
        res[0] = departLigne;
        res[1] = departColonne;
        res[2] = finLigne;
        res[3] = finColonne;
        return res;

    };
    
    //--------------------------------------------------------------------------
    // suite constructeur
    //--------------------------------------------------------------------------
    this.init();
}
