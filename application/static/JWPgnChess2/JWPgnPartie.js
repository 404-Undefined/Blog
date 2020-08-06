/*
 copyright Mathieu Wolff / 2009
 
 beta version 
*/


// -----------------------------------------------------------------------------
// Class JWPgnPartie
// -----------------------------------------------------------------------------

// Constructeur de la classe
function JWPgnPartie(contenuPgn,positionDepart)
{
    //--------------------------------------------------------------------------
    // propriétés classe - init
    //--------------------------------------------------------------------------

    // params
    this.paramContenuPgn = contenuPgn;
    this.paramPositionDepart = positionDepart;

    // objets composants
    this.objetPgn = '';
    this.listeObjFenX = new Array();
    
    // etat-compteurs
    this.coupCourant = 0;
    this.nbCoups = 0;
    
    
    //--------------------------------------------------------------------------
    // fonctions classe
    //--------------------------------------------------------------------------
    
    // charge les parties FENX depuis les coups PGNs
    // assez complexe
    JWPgnPartie.prototype.init = function()
    {
        //------------------
        // recup pgn
        //------------------
        this.objetPgn = new JWPgnDecodeur(this.paramContenuPgn);
        this.nbCoups  = this.objetPgn.getNbCoups();
        
        //------------------
        // inits plateaux Fenx
        //------------------
        if (this.paramPositionDepart)
            this.listeObjFenX[0] = new JWPgnFenX(this.paramPositionDepart);
        else
            this.listeObjFenX[0] = new JWPgnFenX();
        
        //------------------
        // pour chaque coup, ajout (sauf premier = "debut")
        //------------------
        var compteurCoupEchec = 0;
        for(var coupAPlayCnt = 1 ; coupAPlayCnt < this.nbCoups; ++coupAPlayCnt)
        {
            //------------------
            // init objetPlateau - recup situation de jeu precedente, et on la fait evoluer
            //------------------
            var objNewFen = new JWPgnFenX(this.listeObjFenX[this.listeObjFenX.length-1].getStr());   
            this.listeObjFenX[this.listeObjFenX.length]= objNewFen;
            
            // on fait evoluer le jeu selon le coup joue
            var coupJoue = this.objetPgn.getCoup(coupAPlayCnt);
            var typePiece = coupJoue.substr(0,1);   // piece jouee
            if (typePiece != typePiece.toUpperCase() )  // les pieces sont en maj, si min, cas du pion
                typePiece = JWC_PION;
            var typePieceLower = typePiece.toLowerCase();
            
            //------------------
            // determine infos sur le coup joue
            //------------------
            if (coupAPlayCnt% 2 != 0)
                ++compteurCoupEchec;
            var blanc = (coupAPlayCnt % 2 != 0 ) ; //blanc ou noir ?
            var noir = ! blanc;
            var sens = 1;   // on en deduit le sens des pions (blancs montent, noirs descendent)
            if (noir) sens = -1;
            var typePieceAChercherFen = typePieceLower;
            if (blanc)
                typePieceAChercherFen = typePieceAChercherFen.toUpperCase();
            var prise = (coupJoue.indexOf("x") != -1);  // ya t il eu prise ?
            var echec = (coupJoue.indexOf("+") != -1);  // y a til eu echec ?
            var mat = (coupJoue.indexOf("#") != -1);    // y a til eu mat ?
            var promotion = (coupJoue.indexOf("=") != -1);    // y a til eu promotion ?
            var nul = (coupJoue == "1/2-1/2");    // y a til eu nul ?
            var roque = (coupJoue == "O-O");    // roque ?
            var grandRoque = (coupJoue == "O-O-O"); // grand roque
            var victoireBlancs = (coupJoue == "1-0"); // fin
            var victoireNoirs = (coupJoue == "0-1"); // fin
            var finiSansInfos = (coupJoue == "*"); // fin
            var coupJoueFiltre = coupJoue;  // on filtre le coup joue, de tous les caracteres bonus..
            coupJoueFiltre = coupJoueFiltre.replace("\+","");
            coupJoueFiltre = coupJoueFiltre.replace("x","");
            coupJoueFiltre = coupJoueFiltre.replace("\#","");
            coupJoueFiltre = coupJoueFiltre.replace("=","");

            
            //------------------
            // selon la longeur de la chaine de caractere... on deduire quel coup...
            // traitement de tous les coups spéciaux ici,
            // le reste aidé par la class fenx
            //------------------
            
            
            //------------------
            // faux coups
            //------------------
            if (nul || victoireBlancs || victoireNoirs || finiSansInfos)
            {
                // on ne fait rien
            }
            //------------------
            // roques (deplacement 2 pieces)
            //------------------
            else if (roque)
            {
                if (blanc)
                {
                    // jour le coup...et
                    objNewFen.setPiece(1,'e',' ');
                    objNewFen.setPiece(1,'g',JWC_ROI.toUpperCase() );
                    objNewFen.setPiece(1,'h',' ');
                    objNewFen.setPiece(1,'f',JWC_TOUR.toUpperCase());
                }
                else
                {
                    // jour le coup...et
                    objNewFen.setPiece(8,'e',' ');
                    objNewFen.setPiece(8,'g',JWC_ROI);
                    objNewFen.setPiece(8,'h',' ');
                    objNewFen.setPiece(8,'f',JWC_TOUR);
                }
            }
            else if (grandRoque)
            {
                if (blanc)
                {
                    // jour le coup...et
                    objNewFen.setPiece(1,'e',' ');
                    objNewFen.setPiece(1,'c',JWC_ROI.toUpperCase());
                    objNewFen.setPiece(1,'a',' ');
                    objNewFen.setPiece(1,'d',JWC_TOUR.toUpperCase());
                }
                else
                {
                    // jour le coup...et
                    objNewFen.setPiece(8,'e',' ');
                    objNewFen.setPiece(8,'c',JWC_ROI);
                    objNewFen.setPiece(8,'a',' ');
                    objNewFen.setPiece(8,'d',JWC_TOUR);
                }
            }
            //------------------
            // promotion de pion
            //------------------
            else if (promotion)
            {
                // si prise cas different hxg8=Q+.. filtre hg8Q
                if (prise)
                {
                    var debutColonne = coupJoueFiltre.substr(0,1);
                    var finColonne = coupJoueFiltre.substr(1,1);
                    var finLigne = parseInt(coupJoueFiltre.substr(2,1));
                    var newTypePiece = coupJoueFiltre.substr(3,1);
                    if (noir)
                        newTypePiece = newTypePiece.toLowerCase();
                        
                    objNewFen.setPiece(finLigne - 1*sens,debutColonne,' ');
                    objNewFen.setPiece(finLigne,finColonne,newTypePiece);
                }
                else
                {
                    var finColonne = coupJoueFiltre.substr(0,1);
                    var finLigne = parseInt(coupJoueFiltre.substr(1,1));
                    var newTypePiece = coupJoueFiltre.substr(2,1);
                    if (noir)
                        newTypePiece = newTypePiece.toLowerCase();
                        
                    objNewFen.setPiece(finLigne - 1*sens,finColonne,' ');
                    objNewFen.setPiece(finLigne,finColonne,newTypePiece);
                }   
            }
            //------------------
            // deplacement de pion
            //------------------
            else if (coupJoueFiltre.length == 2 )
            {
                // deplacement de pion
                var finColonne = coupJoueFiltre.substr(0,1);
                var finLigne = parseInt(coupJoueFiltre.substr(1,1));
                var departColonne = finColonne;
                var departLigne = -1; // on cherche celui ci

                // pion -1 ou pion -2
                // si un pion présent sur cette case...c'est celui là sinon cest la case en dessous
                departLigne = finLigne-1*sens;
                var contenuCase = objNewFen.getPiece(departLigne,departColonne);
                if ( contenuCase != typePieceAChercherFen) 
                    departLigne = finLigne-2*sens;

                // jour le coup...
                objNewFen.setPiece(departLigne,departColonne,' ');
                objNewFen.setPiece(finLigne,finColonne,typePieceAChercherFen);    
            }
            //------------------
            // gestion prise pion
            //------------------
            else if (typePieceLower == JWC_PION)
            {
                // exemple  exd4 -> ed4
                var finColonne = coupJoueFiltre.substr(1,1);
                var finLigne = parseInt(coupJoueFiltre.substr(2,1));
                var departColonne = coupJoueFiltre.substr(0,1);
                var departLigne = finLigne-1*sens;  // but trouve ça

                // test si prise en passant
                var prisePassant = (objNewFen.getPiece(finLigne,finColonne) == " ");
                           
                // deplacement
                objNewFen.setPiece(departLigne,departColonne,' ');
                objNewFen.setPiece(finLigne,finColonne,typePieceAChercherFen);
                
                // si prise en passant, suppr piece
                if (prisePassant)
                    objNewFen.setPiece(finLigne-1*sens,finColonne);         
            }
            
            //------------------
            // deplacement normal
            //------------------
            else
            {
                boolCroix = ( (typePieceLower == JWC_TOUR) || (typePieceLower == JWC_DAME) || (typePieceLower == JWC_ROI) ) ;
                boolDiag = ( (typePieceLower == JWC_FOU) || (typePieceLower == JWC_DAME) || (typePieceLower == JWC_ROI) ) ;
                boolL = (typePieceLower == JWC_CAVALIER);
                boolEtendu = (typePieceLower != JWC_ROI);
            
                var tabDataDeplacement = objNewFen.getPositions(coupJoueFiltre,typePieceAChercherFen,boolCroix,boolDiag,boolL,boolEtendu);
                if (!tabDataDeplacement)
                    return;
                var finColonne = tabDataDeplacement[3];
                var finLigne = tabDataDeplacement[2];
                var departColonne = tabDataDeplacement[1];
                var departLigne = tabDataDeplacement[0];
                
                // deplacement
                objNewFen.setPiece(departLigne,departColonne,' ');
                objNewFen.setPiece(finLigne,finColonne,typePieceAChercherFen);
            }
        }
    }
    
    //--------------------------------------------------------------------------
    
    JWPgnPartie.prototype.coupSuivant = function()
    {
        ++this.coupCourant;
        if (this.coupCourant == this.nbCoups )
            --this.coupCourant;
    };
    
    //--------------------------------------------------------------------------
    
    JWPgnPartie.prototype.coupPrecedent = function()
    {
        --this.coupCourant;
        if (this.coupCourant < 0)
            this.coupCourant = 0;
    };
    
    //--------------------------------------------------------------------------
    
    JWPgnPartie.prototype.coupDepart = function()
    {
        this.coupCourant = 0;
    };
    
    //--------------------------------------------------------------------------
    
    JWPgnPartie.prototype.coupFin = function()
    {
        this.coupCourant = this.nbCoups-1;
    };
    
    //--------------------------------------------------------------------------
    
    JWPgnPartie.prototype.allerACoup = function(idCoup)
    {
        this.coupCourant = idCoup;
        if (this.coupCourant < 0)
            this.coupCourant = 0;
        if (this.coupCourant == this.nbCoups )
            --this.coupCourant;
    };
    
    //--------------------------------------------------------------------------
    
    
    JWPgnPartie.prototype.getStrCoup = function(idCoup)
    {
        return this.objetPgn.getCoup(idCoup);
    };
    
    
    //--------------------------------------------------------------------------
    
    JWPgnPartie.prototype.getStrCommentaire = function(idCoup)
    {
        return this.objetPgn.getCommentaire(idCoup);
    };
    
    //--------------------------------------------------------------------------
    
    JWPgnPartie.prototype.getNbCoups = function()
    {
        return this.nbCoups;
    };
    
    //--------------------------------------------------------------------------
    
    JWPgnPartie.prototype.getCoupCourant = function()
    {
        return this.coupCourant;
    };
    
    //--------------------------------------------------------------------------
    
    JWPgnPartie.prototype.getFenXCourant = function()
    {
        return this.listeObjFenX[this.coupCourant].getStr();
    };
    
    
    //--------------------------------------------------------------------------
    
    JWPgnPartie.prototype.getPgnOriginal = function()
    {
        return this.objetPgn.getPgnOrignal();
    };
    
    
    //--------------------------------------------------------------------------
    // suite constructeur
    //--------------------------------------------------------------------------
    this.init();
}
