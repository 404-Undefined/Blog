/*
 copyright Mathieu Wolff / 2009
 
 beta version 
*/


// -----------------------------------------------------------------------------
// Class JWPgnDecodeur
// -----------------------------------------------------------------------------


// Constructeur de la classe
function JWPgnDecodeur(contenuPgn)
{

    //--------------------------------------------------------------------------
    // propriétés classe - init
    //--------------------------------------------------------------------------
    
    // params
    this.paramPgn = contenuPgn;

    // epuree
    this.sourcePgn = '';
    this.sourcePgnEpureeAvecCommentaires = '';
    this.sourcePgnEpuree = '';
    
    // structure, liste des coups etcs
    this.listeCoupsPgn = new Array();
    this.listeCommentaires = new Array();
    this.nbCoups = 0;
    
    //--------------------------------------------------------------------------
    // fonctions classe
    //--------------------------------------------------------------------------
    
    // init
    JWPgnDecodeur.prototype.init = function()
    {
        //------------
        // supprimer caracteres non geres
        //------------
        
        this.sourcePgn = this.paramPgn;
        
        // epurer espaces, fin de lignes
        this.sourcePgn = this.sourcePgn.replace(new RegExp("  ","g"), " ");
        this.sourcePgn = this.sourcePgn.replace(new RegExp("\\n","g"), " ");
        this.sourcePgn = this.sourcePgn.replace(new RegExp("\\r","g"), " ");
        
        // version epuree de pgn avancee, commentaires etc
        this.sourcePgnEpuree = this.sourcePgn;
        
        // suppression variantes (paranthèses)
        this.sourcePgnEpuree = this.sourcePgnEpuree.replace(new RegExp("\\(.*?\\)","g"), "");
        
        // suppression (crochets debut de partie)
        this.sourcePgnEpuree = this.sourcePgnEpuree.replace(new RegExp("\\[.*?\\]","g"), "");

        // suppression notes de coups +/-?
        this.sourcePgnEpuree = this.sourcePgnEpuree.replace(new RegExp("\\+\\/\\-","g"), "");

        // suppression des ...21  (reprise de coup apres un commentaire)
        this.sourcePgnEpuree = this.sourcePgnEpuree.replace(new RegExp("[0-9]+\\.\\.\\.","g"), "" );

        // suppression des notes avec $
        this.sourcePgnEpuree = this.sourcePgnEpuree.replace(new RegExp("\\$[0-9]+","g"), "");
        
        // on garde une version avec juste les commentaires
        this.sourcePgnEpureeAvecCommentaires = this.sourcePgnEpuree;
        
        // suppression commentaires {comme ça}
        this.sourcePgnEpuree = this.sourcePgnEpuree.replace(new RegExp("\\{.*?\\}","g"), "");

        // suppression de tous les doubles espaces
        while (this.sourcePgnEpuree.indexOf("  ") != -1 )
        {
            this.sourcePgnEpuree = this.sourcePgnEpuree.replace(new RegExp("  ","g"), " ");
            this.sourcePgnEpureeAvecCommentaires = this.sourcePgnEpureeAvecCommentaires.replace(new RegExp("  ","g"), " ");
        }

        //------------
        // recuperer liste coups
        //------------
        
        // explode sur 1. 2. 3. ...
        var tabTemp = new Array();
        var reg=new RegExp("[0-9]+\\.", "g");
        tabTemp = this.sourcePgnEpuree.split(reg);
        // on degage le premier si vide (ie / pas ie...)
        if (JWPgnChess_trim(tabTemp[0]) == "" )
            tabTemp.shift(); 
        // trims
        for(var i = 0 ; i < tabTemp.length; ++i)
            tabTemp[i] = JWPgnChess_trim(tabTemp[i]);

        // on divise chaque coup en 2, attention 1er coup = "start" 
        var compteurCoups = 0;
        this.listeCoupsPgn[compteurCoups++] = "start";
        for(var i = 0 ; i < tabTemp.length; ++i)
        {
            var tab2coups = tabTemp[i].split(" ");
            this.listeCoupsPgn[compteurCoups++] = tab2coups[0];
            this.listeCoupsPgn[compteurCoups++] = tab2coups[1];
        }
        
        //------------
        // recuperer liste commentaires
        //------------
        // special 1er commentaire, vide
        this.listeCommentaires[0] = '';
        
        // nb coup total    
        this.nbCoups = this.listeCoupsPgn.length;
        var compteurCoupEchec = 0;
        for(var coupAPlayCnt = 1 ; coupAPlayCnt < this.nbCoups; ++coupAPlayCnt)
        {
            if (coupAPlayCnt% 2 != 0)
                ++compteurCoupEchec;
                
            // recherches des eventuels commentaires sur le coup
            this.listeCommentaires[this.listeCommentaires.length] = '';
            var regexp = "";
            regexp+= compteurCoupEchec; // num coup en cours .
            regexp+= "\\.";
            regexp+= ".*";  // nimporte quoi
            regexp+= "\\{"; // parentheses ouvrante
            regexp+= ".*?"; // nimporte quoi pas gourmand
            regexp+= "\\}"; // parentheses fermante
            regexp+= ".*";  // nimporte quoi
            regexp+= " "+(compteurCoupEchec+1); // num coup suivant ESPACE.
            regexp+= "\\.";
            //document.write(compteurCoupEchec + "---> " +regexp+ "<br>");
            var objReg= new RegExp(regexp,"");
            
            if (this.sourcePgnEpureeAvecCommentaires.match(objReg ) )
            {
                var res = objReg.exec(this.sourcePgnEpureeAvecCommentaires);
                var regexpAcco = "\\{.*\\}";
                var objRegAcco = new RegExp(regexpAcco,"");
                var commentaire = ""+objRegAcco.exec(res);
                // on supprime les caracteres externes
                commentaire = commentaire.replace(new RegExp("\\{","g"), "");
                commentaire = commentaire.replace(new RegExp("\\}","g"), "");
                this.listeCommentaires[this.listeCommentaires.length-1] = commentaire;
            }
      
        }
    
        //------------
        // Debug
        //------------
        //JWPgnChess_d(this.sourcePgnEpuree);
        //JWPgnChess_dTab(this.listeCoupsPgn);
        //JWPgnChess_dTab(this.listeCommentaires);
        
    };
    
    //--------------------------------------------------------------------------
    
    // getNbCoups
    JWPgnDecodeur.prototype.getNbCoups = function()
    {
        return this.nbCoups;
    };
    
    //--------------------------------------------------------------------------
 
    // getCoups(i)
    JWPgnDecodeur.prototype.getCoup = function(i)
    {
        return this.listeCoupsPgn[i];
    };
    
    //--------------------------------------------------------------------------
 
    // getCommentaire(i)
    JWPgnDecodeur.prototype.getCommentaire = function(i)
    {
        return this.listeCommentaires[i];
    };
    
     //--------------------------------------------------------------------------
 
    // getPgnOrignal
    JWPgnDecodeur.prototype.getPgnOrignal = function()
    {
        return this.sourcePgn;
    };
    
    
    
    //--------------------------------------------------------------------------
    // suite constructeur
    //--------------------------------------------------------------------------
    this.init();
 
      
    
}
