/********* START OF SCRIPT *********/

$(function(){

        //This is only for storing static and dynamic UI Elements
    const UIController = (() => {
        
        //Add static UI Elements here
        const DOMElements = {
            window : $(window),
            documentEle : $(document),
            document : document,
            bodyEle : $('body'),

            // Page blocks
            entranceEle : $('.entrance'),
            resultEle : $('.result'),
            helpPageEle : $('.help-page'),
            

            // Buttons
            allButtons : $('button'),
            playBtn : $('.play-btn'),
            mainMenuBtn : $('.main-menu-btn'),
            fullscreenBtn : $('.full-screen-btn'),
            backBtn : $('.back-btn'),

            // game elements
            gameArena : $('.game-arena'),
            gameBox : $('.gameBox'), 
            livesSpan : $('.lives span'),
            levelSpan : $('.level span'),
            resultText : $('.result-text'),
            enemy : $('[data-enemy="true"]'),
            barsOdd : $('.bars .bar:odd'), 
            barsEven : $('.bars .bar:even'),
            gameCover : $('.game-cover'),

            //Dynamically added UI Elements should be handled as functions
        };

        // Return the DOMElements object to be used by controller function
        return {
            getDOMElements : () => DOMElements
        }
    })();

    // This is only for UI manipulation
    const gameController = (() => {
        return {

            // This will add html content to the element passed
            addContent : function (ele, content) {
                ele.html(content);
                return this;
            },

            //Add or remove the class for ele element. If there is no class to add, pass "addcls" as false
            addRemoveCls : function (ele, addcls, removecls){
                addcls && $(ele).addClass(addcls);
                removecls && $(ele).removeClass(removecls);
                return this;
            },

            // Change attribute value for an element
            attrChange : function (ele, atrname, atrval) {
                $(ele).attr(atrname, atrval);
                return this;
            },

            // Add passed css json object for the element
            addCSS : function (ele, css) {
                const cssObj = JSON.parse(css);
                ele.css(cssObj);
                return this;
            },

            // Returns parent/s sibling element for an element
            returnParentSibling : function (ele, parent, sibling) {
                if(parent && sibling) {
                    return $(ele.parents(`.${parent}`).siblings(`.${sibling}`));
                }
            },

            // Returns parent/s element for an element
            returnParent : function (ele, data) {
                if(data) {
                    return $(ele.parents(`.${data}`));
                }
                return $(ele.parent());
            },

            //animates the element
            animateElement : function(ele, animation){
                const animationObj = JSON.parse(animation);
                ele.animate(animationObj);
                return this;
            }
        }
    })();

    // GLOBAL APP CONTROLLER
    const controller = ((gameCtrl, UICtrl) => {

        // Storing DOM elements
        const DOM = UICtrl.getDOMElements();

        // Setting initial values for gameObj, which will be created by gameObject class, once game is started
        const gameObj = {
            start : null,
            over : true,
            lives : 3,
            lifeLost : false,
            level : 1,
            levelUp : false
        };

        // game object class
        class gameObject {
            constructor() {

                this.mouseMoveOff = function(){
                        DOM.gameBox.off("mousemove touchmove");
                };

                this.resetGame = function(won, play) {
                        gameObj.lives = 3;
                        play ? gameObj.over = false : gameObj.over = true;
                        gameObj.level = 1;
                        gameObj.lifeLost = false;
                        
                        gameCtrl.addCSS(DOM.gameBox, `{"left":"3%" ,"top":"48%"}`)
                                        .addContent(DOM.livesSpan, gameObj.lives)
                                        .addContent(DOM.levelSpan, gameObj.level)
                                        .attrChange(DOM.gameArena, 'data-level', gameObj.level);
                        
                        if(!play){
                                gameCtrl.addRemoveCls(DOM.gameArena,'d-none')
                                        .addRemoveCls(DOM.resultEle,false,'d-none');
                        
                                won ? gameCtrl.addContent(DOM.resultText, 'Congratulations, You Won!') : gameCtrl.addContent(DOM.resultText, 'GAME OVER!');
                                gameObj.start = null;
                        }
                        
                }

                this.lifeCount = function() {
                        if(gameObj.lifeLost === true){
                                gameObj.lives--;
                                gameObj.lifeLost = false;
                                this.mouseMoveOff();
                        }
                        gameCtrl.addContent(DOM.livesSpan, gameObj.lives);
                }

                this.boxMovement = function(event){   
                        if(!gameObj.over){
                                let touchLeft = parseInt(event.pageX);
                                let touchTop = parseInt(event.pageY);
                                let boxLeft = DOM.gameBox.offset().left;
                                let boxRelativeWidth = boxLeft + DOM.gameBox.innerWidth();
                                const boxMove = function (a,b){
                                        DOM.gameBox.css({"left":touchLeft-a,"top":touchTop-b, "background":"rgb("+Math.round(Math.random()*255) +","+Math.round(Math.random()*255) +","+Math.round(Math.random()*255) +")"});
                                }
                                if(event.type === "touchmove"){
                                        touchLeft = event.originalEvent.changedTouches[0].clientX;
                                        touchTop = event.originalEvent.changedTouches[0].clientY;
                                        boxMove(10,10);
                                }
                                
                                boxMove(20,20);
                                                
                                if(boxRelativeWidth >= DOM.gameArena.width()){
                                        gameObj.start.levelUp = true;
                                        gameCtrl.addCSS(DOM.gameBox, `{"left":"3%" ,"top":"48%"}`);
                                        !gameObj.over && gameObj.start.mouseMoveOff();
                                        gameCtrl.animateElement(DOM.gameCover, `{"width": "100%"}`).animateElement(DOM.gameCover, `{"width": "0"}`);
                                }
                        }
                }
            }
        }

        // This functions is for all User interactions events
        const setupEvents = () => {

                // This will reset all the values to beginning values
                
                DOM.fullscreenBtn.on('click',function(){
                let de = document.documentElement;
                if(this.dataset.fullscreen === 'off'){
                        if(de.requestFullscreen){
                                de.requestFullscreen();
                        }
                        else if(de.mozRequestFullscreen){de.mozRequestFullscreen();}
                        else if(de.webkitRequestFullscreen){de.webkitRequestFullscreen();}
                        else if(de.msRequestFullscreen){de.msRequestFullscreen();}
                        screen.orientation.lock('landscape');
                        $(this).attr("data-fullscreen","on")
                        $(this).text("Exit Full Screen");
                }
                else {
                        screen.orientation.unlock();
                        if(document.fullscreen){
                        document.exitFullscreen();
                        }
                        $(this).attr("data-fullscreen","off")
                        $(this).text("Full Screen");
                }
                });

                // Hide current page and show specific page for all buttons
                DOM.allButtons.on('click', function(event) {
                //event.preventDefault();

                if(this.dataset.parent && this.dataset.show) {
                        gameCtrl.addRemoveCls(gameCtrl.returnParentSibling($(this), this.dataset.parent, this.dataset.show), false, 'd-none')
                                .addRemoveCls(gameCtrl.returnParent($(this), this.dataset.parent), 'd-none');
                }
                });

                DOM.playBtn.on('click', function(){
                        gameObj.start = gameObj.start || new gameObject();
                        gameObj.start.resetGame(null, true);
                        gameObj.over = false;
                });

                DOM.documentEle.bind("contextmenu",function(event){return false;});

                DOM.gameBox.on("mouseenter touchstart",function(event){
                        DOM.gameBox.on("mousemove touchmove", function(event){!gameObj.over && gameObj.start.boxMovement(event)});
                });
                DOM.gameBox.on("mousemove touchmove", function(event){
                        !gameObj.over && gameObj.start.boxMovement(event);
                });

                DOM.gameBox.on("mouseleave touchend",function(event){
                        gameObj.start.lifeCount();
                        gameObj.lifeLost = false;
                        gameObj.lives && gameObj.start.levelUp && ++gameObj.level;
                        gameObj.start.levelUp = false;
                        gameCtrl.attrChange(DOM.gameArena, 'data-level', gameObj.level)
                                .addContent(DOM.levelSpan, gameObj.level);
                        !gameObj.lives && gameObj.start.resetGame(false);
                });
            
                setInterval(function(){
                        if(!gameObj.over){
                                DOM.enemy.each(function(){
                                        let boxLeft = DOM.gameBox.offset().left;
                                        let boxTop = DOM.gameBox.offset().top;
                                        let boxRelativeWidth = boxLeft + DOM.gameBox.innerWidth();
                                        let boxRelativeHeight = boxTop + DOM.gameBox.innerHeight(); 
                                        let lineLeft = $(this).offset().left;
                                        let lineTop = $(this).offset().top;
                                        let lineWidth = lineLeft+$(this).innerWidth();
                                        let lineHeight = lineTop+$(this).innerHeight();
                                        if(boxRelativeWidth > lineLeft && boxLeft < lineWidth && boxRelativeHeight > lineTop && boxTop < lineHeight){
                                                gameObj.lifeLost = true;
                                                DOM.gameBox.unbind("touchmove");
                                                gameCtrl.addCSS(DOM.gameBox, `{"left":"3%" ,"top":"48%"}`);
                                        }
                                });
                        }
                },10);
            
        };

        // returning only init function
        return {
            init: () => {
                console.info('Welcome to %cPOSITION CHANGE GAME', "color: yellow; font-weight: bold; background-color: blue;padding: 2px");
                setupEvents();
            }
        }
    })(gameController, UIController);

    // init function triggers setupEvents, which has events functions.
    controller.init();

});

/********* END OF SCRIPT *********/