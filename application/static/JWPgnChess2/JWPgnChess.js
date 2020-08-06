/*
 copyright Mathieu Wolff / 2009
 
 beta version 
*/

// -----------------------------------------------------------------------------
// Class JWPgnChess
// -----------------------------------------------------------------------------
// Constructeur de la classe
function JWPgnChess(idDiv,tailleCase,positionDepart)
{
    //--------------------------------------------------------------------------
    // propriétés classe - init
    //--------------------------------------------------------------------------
    
    // params
    this.paramIdDiv = idDiv;
    this.paramTailleCase = JWC_TAILLECASE;
    if (tailleCase)
        this.paramTailleCase = tailleCase;
    this.paramPositionDepart = positionDepart;
    
    // objs structure
    this.objPartie = "";
    
    // look
    this.flipBoard = false;
    this.tailleImage = this.paramTailleCase * 90/100;
    this.tailleBoard = this.paramTailleCase * 11;
    this.tailleCoups = 150;
    
    // raccourci pour widget
    this.prefixUnique = "";
    this.pointeurDiv = "";
    this.pointeurDivCoupleJeuCoups ="";
    this.pointeurDivPlateau ="";
    this.pointeurDivListeCoups ="";
    this.pointeurDivNav ="";
    this.pointeurDivFen ="";
    this.pointeurDivPgn ="";
    this.pointeurDivCommentaires ="";
    
    
    //--------------------------------------------------------------------------
    // fonctions classe
    //--------------------------------------------------------------------------
    
    // decoder la partie, regexp dans tous les sens
    JWPgnChess.prototype.init = function()
    {
        // init htmls
        this.pointeurDiv = $('#'+this.paramIdDiv);
        var contenuDiv = this.pointeurDiv.html();
        this.prefixUnique = this.paramIdDiv+'_cp_';
    
        // creation partie
        this.objPartie = new JWPgnPartie(contenuDiv, this.paramPositionDepart);
        
    }
    
    //--------------------------------------------------------------------------
    
    JWPgnChess.prototype.drawInitial = function()
    {
        // style 500 px
        this.pointeurDiv.css("width",(this.tailleBoard+this.tailleCoups+JWC_TAILLECASE)+"px");
        this.pointeurDiv.addClass("jwc_zoneGlobale");
        
        // affiche vide
        this.pointeurDiv.html('');
        
        // ajout CSS pour le board
        // style board
        var res = '';
        res += "<style>";
        res += "#"+this.prefixUnique+"plateau .white {";
        res += "background-image: url('"+JWC_IMAGEPATH+"case_blanche.png');";
        res += "background-color: #FFCE9E;";
        res += "width: "+this.paramTailleCase+"px;";
        res += "height: "+this.paramTailleCase+"px;";
        res += "}";
        res += "#"+this.prefixUnique+"plateau .black {";
        res += "background-image: url('"+JWC_IMAGEPATH+"case_noire.png');";
        res += "background-color: #D18B47;";
        res += "width: "+this.paramTailleCase+"px;";
        res += "height: "+this.paramTailleCase+"px;";
        res += "}";
        res += "#"+this.prefixUnique+"plateau .chessnostyle {";
        res += "background-color: #CCCCCC;";
        res += "width: "+this.paramTailleCase+"px;";
        res += "height: "+this.paramTailleCase+"px;";
        res += "}";
        res += '#'+this.prefixUnique+'plateau {';
        res += "text-align: center;";
        res += "vertical-align: center;";
        res += "}";
        res += "</style>";
        this.pointeurDiv.append(res);
        
        // zone englobant echiquier et liste coups
        var idDivCoupleJeuCoups = this.prefixUnique+'coupleCoups';
        this.pointeurDiv.append('<div class="jwc_zoneBoard" id="'+idDivCoupleJeuCoups+'" style="width:'+(this.tailleBoard+this.tailleCoups+JWC_TAILLECASE)+'px"></div>');
        this.pointeurDivCoupleJeuCoups = $('#'+this.prefixUnique+'coupleCoups');
        
        // creer echiquier
        this.create_ZonePlateau();
        
        // creer zone liste coups
        this.create_ZoneListeCoups();
        
        // fermeture div englobant
        this.pointeurDivCoupleJeuCoups.append("<div style=\"clear:both\"></div>");
        
        // nav
        this.create_ZoneNav();
        
        // creer zone commentaires
        this.create_ZoneCommentaire();
        
        // creer zone fen
        this.create_ZoneFen();
        
        // creer zone pgn
        this.create_ZonePgn();
        
        // draw
        this.draw();
    }
    
    
    //--------------------------------------------------------------------------
 
    // draw
    JWPgnChess.prototype.draw = function()
    {
        // afficher echiquier
        this.draw_ZonePlateau();
        
        // afficher listes de coups
        this.draw_ZoneListeCoups();
        
        // afficher NAV
        this.draw_ZoneNav();
        
        // afficher nav
        this.draw_ZoneNav();
        
        // afficher commentaires
        this.draw_ZoneCommentaire();
        
        // afficher FEN
        this.draw_ZoneFen();
        
        // afficher PGN
        this.draw_ZonePgn();
        
    };
    
    //--------------------------------------------------------------------------
 
    // draw
    JWPgnChess.prototype.drawBoard = function()
    {
        // afficher echiquier
        $("#"+this.prefixUnique+'plateau').html(this.getPlateauHTML());
    };
    
    
    //--------------------------------------------------------------------------
    
    // afficher une situation de jeu
    JWPgnChess.prototype.afficherPiece= function(colonne,ligne)
    {
        var nomColsRef = "abcdefgh";
        var idPlateau = this.prefixUnique+'plateau';
        var fenX = this.objPartie.getFenXCourant();

        var ligneReelle = 8-ligne + 1;
        
        // recuperer piece presente
        var colonneNum = nomColsRef.indexOf(colonne);
        var indiceCourant = 8*(ligneReelle-1)+colonneNum;
        var nomColCourante = colonne;
        
        var pieceCourante = fenX.substring(indiceCourant, indiceCourant+1);
        
        // affiche image pour cette piece presente, si pas vide
        switch(pieceCourante) // rnbqkbnr
        {
            // ajouter noirs
            case JWC_ROI :
                return "<img src=\""+JWC_IMAGEPATH+"roi_noir.png\" id=\""+ligneReelle+nomColCourante+"\" border=\"0\" width=\""+this.tailleImage+"\">";
            break;
            
            case JWC_DAME :
                return "<img src=\""+JWC_IMAGEPATH+"dame_noir.png\" id=\""+ligneReelle+nomColCourante+"\" border=\"0\" width=\""+this.tailleImage+"\">";
            break;
            
            case JWC_FOU :
                return "<img src=\""+JWC_IMAGEPATH+"fou_noir.png\" id=\""+ligneReelle+nomColCourante+"\" border=\"0\" width=\""+this.tailleImage+"\">";
            break;
            
            case JWC_CAVALIER :
                return "<img src=\""+JWC_IMAGEPATH+"cavalier_noir.png\" id=\""+ligneReelle+nomColCourante+"\" border=\"0\" width=\""+this.tailleImage+"\">";
            break;
            
            case JWC_TOUR :
                return "<img src=\""+JWC_IMAGEPATH+"tour_noir.png\" id=\""+ligneReelle+nomColCourante+"\" border=\"0\" width=\""+this.tailleImage+"\">";
            break;
            
            case JWC_PION :
                return "<img src=\""+JWC_IMAGEPATH+"pion_noir.png\" id=\""+ligneReelle+nomColCourante+"\" border=\"0\" width=\""+this.tailleImage+"\">";
            break;
            
            
            // ajouter blancs
            case JWC_ROI.toUpperCase() :
                return "<img src=\""+JWC_IMAGEPATH+"roi_blanc.png\" id=\""+ligneReelle+nomColCourante+"\" border=\"0\" width=\""+this.tailleImage+"\">";
            break;
            
            case JWC_DAME.toUpperCase() :
                return "<img src=\""+JWC_IMAGEPATH+"dame_blanc.png\" id=\""+ligneReelle+nomColCourante+"\" border=\"0\" width=\""+this.tailleImage+"\">";
            break;
            
            case JWC_FOU.toUpperCase() :
                return "<img src=\""+JWC_IMAGEPATH+"fou_blanc.png\" id=\""+ligneReelle+nomColCourante+"\" border=\"0\" width=\""+this.tailleImage+"\">";
            break;
            
            case JWC_CAVALIER.toUpperCase() :
                return "<img src=\""+JWC_IMAGEPATH+"cavalier_blanc.png\" id=\""+ligneReelle+nomColCourante+"\" border=\"0\" width=\""+this.tailleImage+"\">";
            break;
            
            case JWC_TOUR.toUpperCase() :
                return "<img src=\""+JWC_IMAGEPATH+"tour_blanc.png\" id=\""+ligneReelle+nomColCourante+"\" border=\"0\" width=\""+this.tailleImage+"\">";
            break;
            
            case JWC_PION.toUpperCase() :
                return "<img src=\""+JWC_IMAGEPATH+"pion_blanc.png\" id=\""+ligneReelle+nomColCourante+"\" border=\"0\" width=\""+this.tailleImage+"\">";
            break;
 
        }
        
        return "";
    }
    
    //--------------------------------------------------------------------------

    // get plateau html
    JWPgnChess.prototype.getPlateauHTML = function()
    {
        var res = '';
        
        res += '<table class=\"jwc_board\" style=\"float:left\">';
        res += '<tbody>';
            res += '<tr class="9">';
                res += '<td class="chessnostyle"></td>';
                res += '<td class="chessnostyle">a</td>';
                res += '<td class="chessnostyle">b</td>';
                res += '<td class="chessnostyle">c</td>';
                res += '<td class="chessnostyle">d</td>';
                res += '<td class="chessnostyle">e</td>';
                res += '<td class="chessnostyle">f</td>';
                res += '<td class="chessnostyle">g</td>';
                res += '<td class="chessnostyle">h</td>';
                res += '<td class="chessnostyle"></td>';
            res += '</tr>';
            
            var tabClassCss = new Array("white", "black");
            var j= 2;
            if (! this.flipBoard)
                ++j;
                
            for(var i= 8 ; i >= 1 ; --i)
            {
                var iFlipped = i;
                if (this.flipBoard)
                    iFlipped  = 8-i + 1;
            
                res += '<tr class="'+iFlipped+'">';
                res += '<td class="chessnostyle">'+iFlipped+'</td>';
                res += '<td class="a '+tabClassCss[(++j % 2)]+'">'+this.afficherPiece("a",iFlipped)+'</td>';
                res += '<td class="b '+tabClassCss[(++j % 2)]+'">'+this.afficherPiece("b",iFlipped)+'</td>';
                res += '<td class="c '+tabClassCss[(++j % 2)]+'">'+this.afficherPiece("c",iFlipped)+'</td>';
                res += '<td class="d '+tabClassCss[(++j % 2)]+'">'+this.afficherPiece("d",iFlipped)+'</td>';
                res += '<td class="e '+tabClassCss[(++j % 2)]+'">'+this.afficherPiece("e",iFlipped)+'</td>';
                res += '<td class="f '+tabClassCss[(++j % 2)]+'">'+this.afficherPiece("f",iFlipped)+'</td>';
                res += '<td class="g '+tabClassCss[(++j % 2)]+'">'+this.afficherPiece("g",iFlipped)+'</td>';
                res += '<td class="h '+tabClassCss[(++j % 2)]+'">'+this.afficherPiece("h",iFlipped)+'</td>';
                res += '<td class="chessnostyle">'+iFlipped+'</td>';
                res += '</tr>';
                j++;
            }
           
            res += '<tr class="0">';
                res += '<td class="chessnostyle"></td>';
                res += '<td class="chessnostyle">a</td>';
                res += '<td class="chessnostyle">b</td>';
                res += '<td class="chessnostyle">c</td>';
                res += '<td class="chessnostyle">d</td>';
                res += '<td class="chessnostyle">e</td>';
                res += '<td class="chessnostyle">f</td>';
                res += '<td class="chessnostyle">g</td>';
                res += '<td class="chessnostyle">h</td>';
                res += '<td class="chessnostyle"></td>';
            res += '</tr>';
        res += '</tbody>';
        res += '</table>';
        
        return res;
    
    };
    
    
    //--------------------------------------------------------------------------
    
    JWPgnChess.prototype.event_coupSuivant = function()
    {
        this.objPartie.coupSuivant();
        this.draw();
    };
    
    //--------------------------------------------------------------------------
    
    JWPgnChess.prototype.event_coupPrecedent = function()
    {
       this.objPartie.coupPrecedent();
       this.draw();
    };
    
    //--------------------------------------------------------------------------
    
    JWPgnChess.prototype.event_coupDebut = function()
    {
       this.objPartie.coupDepart();
       this.draw();
    };
    
    //--------------------------------------------------------------------------
    
    JWPgnChess.prototype.event_coupFin = function()
    {
       this.objPartie.coupFin();
       this.draw();
    };
    
    //--------------------------------------------------------------------------
    
    JWPgnChess.prototype.event_flipBoard = function()
    {
       this.flipBoard = ! this.flipBoard;
       this.draw();
    };
    
    
    //--------------------------------------------------------------------------
    
    // afficher notation fenX
    JWPgnChess.prototype.event_toggleFen = function()
    {   
        $("#"+this.prefixUnique+"fenX").toggleClass("jwc_masquer") ;

    };
    
    //------------------------------------------------------------------------

     // afficher pgn originale
    JWPgnChess.prototype.event_toggleOri = function()
    {
        $("#"+this.prefixUnique+"originale").toggleClass("jwc_masquer") ;
    };
    
    //--------------------------------------------------------------------------
    
    JWPgnChess.prototype.event_allerCoup = function(idCoup)
    {
        this.objPartie.allerACoup(idCoup);
        this.draw();
        
        if (this.idCoupSelPrec != "")
        {
            $("#"+this.prefixUnique+"coup"+this.idCoupSelPrec).removeClass("jwc_coupSelectionne");    
        }
        $("#"+this.prefixUnique+"coup"+idCoup).addClass("jwc_coupSelectionne");
    };
    
    //--------------------------------------------------------------------------
    
    // 
    JWPgnChess.prototype.create_ZonePlateau = function()
    {   
        // creer div pour plateau
        this.pointeurDivCoupleJeuCoups.append("<div id=\""+this.prefixUnique+"plateau\"></div>");
        this.pointeurDivPlateau = $("#"+this.prefixUnique+"plateau");
    };
    
    //--------------------------------------------------------------------------
    
    // 
    JWPgnChess.prototype.draw_ZonePlateau= function()
    {
        // afficher plateau courant
        this.pointeurDivPlateau.html(this.getPlateauHTML()) ;
    };
    
    
    
    //--------------------------------------------------------------------------
    
    // 
    JWPgnChess.prototype.create_ZoneCommentaire = function()
    {   
        // creer div pour commentaires
        this.pointeurDiv.append("<div id=\""+this.prefixUnique+"comments"+"\" class=\"jwc_ZoneCommentaires\"></div>");
        this.pointeurDivCommentaires = $("#"+this.prefixUnique+"comments");
    };
    
    //--------------------------------------------------------------------------
    
    // 
    JWPgnChess.prototype.draw_ZoneCommentaire = function()
    {
        // afficher commentaire courant
        this.pointeurDivCommentaires.html(this.objPartie.getStrCommentaire(this.objPartie.getCoupCourant())) ;

    };
    
    //--------------------------------------------------------------------------
    
    // 
    JWPgnChess.prototype.create_ZoneListeCoups = function()
    {   
        // creer div pour listeCoups
        this.pointeurDivCoupleJeuCoups.append("<div id=\""+this.prefixUnique+"listeCoups"+"\" class=\"jwc_zoneListeCoups\" ></div>");
        this.pointeurDivListeCoups = $('#'+this.prefixUnique+"listeCoups");
        this.pointeurDivListeCoups.html('');
        var compteurEchec = 0;
        var classeCss="blanc";
        var nbCoups = this.objPartie.getNbCoups();
        for(i = 0 ; i < nbCoups ; ++i)
        {
            if (classeCss == "noir")
                classeCss = "blanc";
            else
                classeCss = "noir";
            if (i%2!=0)
            {
                $('#'+this.prefixUnique+"listeCoups").append("<br/>");
                ++compteurEchec;
                $('#'+this.prefixUnique+"listeCoups").append("<i>"+compteurEchec+".</i>");
            }
            $('#'+this.prefixUnique+"listeCoups").append("<a href=\"#\" id=\""+this.prefixUnique+"coup"+i+"\" class=\""+classeCss+"\">"+this.objPartie.getStrCoup(i)+"</a> &nbsp;");
        }
        this.pointeurDivListeCoups.css("height",(this.tailleBoard-15)+"px");

        // bind events aux coups
        for(i = 0 ; i < nbCoups ; ++i)
        {
            $('#'+this.prefixUnique+"coup"+i).bind("click", new Array(this, i), 
                                                    function(e)
                                                    {
                                                        var idCoup = e.data[1];
                                                        e.data[0].event_allerCoup(idCoup);
                                                        return false;
                                                    } 
             );
        }
        this.pointeurDivListeCoups.append("<br/><br/>");
        
    };
    
    //--------------------------------------------------------------------------
    
    // 
    JWPgnChess.prototype.draw_ZoneListeCoups = function()
    {
        // mettre surbrillance coup courant
        $('#'+this.prefixUnique+"listeCoups a").removeClass("jwc_coupSelectionne");
        $('#'+this.prefixUnique+"coup"+this.objPartie.getCoupCourant() ).addClass("jwc_coupSelectionne");
    };
    
    
    //--------------------------------------------------------------------------
    
    // 
    JWPgnChess.prototype.create_ZoneFen = function()
    {
        // creer div
        this.pointeurDiv.append("<div id=\""+this.prefixUnique+"fenX\" class=\"jwc_zoneFenX jwc_masquer\"></div>");
        this.pointeurDivFen = $('#'+this.prefixUnique+"fenX");
    };
    
    //--------------------------------------------------------------------------
    
    // 
    JWPgnChess.prototype.draw_ZoneFen = function()
    {
        // afficher fen
        var fenX = this.objPartie.getFenXCourant();
        var fenXAffichable = fenX.replace(new RegExp(" ","g"), "&nbsp;"); 
        this.pointeurDivFen.html("["+fenXAffichable+"]");
    };
    
    //--------------------------------------------------------------------------
    
    // 
    JWPgnChess.prototype.create_ZonePgn = function()
    {
        // creer div
        this.pointeurDiv.append("<div id=\""+this.prefixUnique+"originale\" class=\"jwc_zonePgn jwc_masquer\"></div>");
        this.pointeurDivPgn = $('#'+this.prefixUnique+"originale");
    };
    
    //--------------------------------------------------------------------------
    
    // 
    JWPgnChess.prototype.draw_ZonePgn = function()
    {
        // afficher fen
        this.pointeurDivPgn.html(this.objPartie.getPgnOriginal());
    };
    
   
    //--------------------------------------------------------------------------
    
    // 
    JWPgnChess.prototype.create_ZoneNav = function()
    {
        // creer div et assign events
        this.pointeurDiv.append("<div id=\""+this.prefixUnique+"nav\" class=\"jwc_zoneNav\">");
        this.pointeurDivNav = $('#'+this.prefixUnique+"nav");
        
        this.pointeurDivNav.append("<div class=\"jwc_navItem\"><a href=\"#\" id=\""+this.prefixUnique+"nav_debut"+"\"  ><<</a></div>");
        this.pointeurDivNav.append("<div class=\"jwc_navItem\"><a href=\"#\" id=\""+this.prefixUnique+"nav_prec"+"\" ><</a></div>");
        this.pointeurDivNav.append("<div class=\"jwc_navItem\"><a href=\"#\" id=\""+this.prefixUnique+"nav_suiv"+"\" >></a></div>");
        this.pointeurDivNav.append("<div class=\"jwc_navItem\"><a href=\"#\" id=\""+this.prefixUnique+"nav_fin"+"\" >>></a></div>");
        this.pointeurDivNav.append("<div class=\"jwc_navItem\"><a href=\"#\" id=\""+this.prefixUnique+"nav_toggleFen"+"\" >Fen</a></div>");
        this.pointeurDivNav.append("<div class=\"jwc_navItem\"><a href=\"#\" id=\""+this.prefixUnique+"nav_toggleOriginal"+"\" >Pgn</a></div>");
        this.pointeurDivNav.append("<div class=\"jwc_navItem\"><a href=\"#\" id=\""+this.prefixUnique+"nav_toggleBoard"+"\" >Flip</a></div>");
        this.pointeurDivNav.append("<div style=\"clear:both\"></div></div>");
        
        $('#'+this.prefixUnique+"nav .jwc_navItem").css("background-image","url('"+JWC_IMAGEPATH+"fond_nav.png')");
        
        // taille selon params
        $('#'+this.prefixUnique+"nav"+" .jwc_navItem").css("width",((this.tailleBoard+this.tailleCoups)/7)+"px");


        // assign events aux boutons
        $('#'+this.prefixUnique+"nav_debut").bind("click", this, function(e){ e.data.event_coupDebut(); return false;} );
        $('#'+this.prefixUnique+"nav_prec").bind("click", this, function(e){ e.data.event_coupPrecedent(); return false;} );
        $('#'+this.prefixUnique+"nav_suiv").bind("click", this, function(e){ e.data.event_coupSuivant(); return false;} );
        $('#'+this.prefixUnique+"nav_fin").bind("click", this, function(e){ e.data.event_coupFin(); return false;} );
        $('#'+this.prefixUnique+"nav_toggleFen").bind("click", this, function(e){ e.data.event_toggleFen(); return false;} );
        $('#'+this.prefixUnique+"nav_toggleOriginal").bind("click", this, function(e){ e.data.event_toggleOri(); return false;} );
        $('#'+this.prefixUnique+"nav_toggleBoard").bind("click", this, function(e){ e.data.event_flipBoard(); return false;} );
    };
    
    //--------------------------------------------------------------------------
    
    // 
    JWPgnChess.prototype.draw_ZoneNav = function()
    {
        //rien
    };
    
    //--------------------------------------------------------------------------
    // suite constructeur
    //--------------------------------------------------------------------------
    this.init();
    this.drawInitial();
    
    
    
    
}
