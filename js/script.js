$(document).ready(function(){

        var raj=$(".gameBox"), life = 3, flag = 0, boxWidth = raj.width(), boxRelativeWidth = 0, boxRelativeHeight = 0, boxHeight = raj.height(), boxLeft = 0, boxTop = 0;

        const setPos = function(){$(document).off("mousemove");};

        const lives = function(){
                if(flag == 1){
                        life--;
                        flag=0;
                        setPos();
                }
                $(".lives").text("lives x "+ life);
        }

        const move = function(event){         
                if($(".main").is(":visible")){
                        var touchLeft = parseInt(event.pageX);
                        var touchTop = parseInt(event.pageY);
                        const boxMove = function (a,b){
                                raj.css({"left":touchLeft-a,"top":touchTop-b, "background":"rgb("+Math.round(Math.random()*255) +","+Math.round(Math.random()*255) +","+Math.round(Math.random()*255) +")"});
                        }
                        if(event.type === "touchmove"){
                                touchLeft = event.originalEvent.changedTouches[0].clientX;
                                touchTop = event.originalEvent.changedTouches[0].clientY;
                                boxMove(boxWidth/5,boxHeight/5);
                        }
                        
                        boxMove(boxWidth/3,boxHeight/3);
                                              
                        if(boxRelativeWidth >= $(".main").width()){
                                $(".main").hide();
                                $(".result").show();
                                $(".resultText").html("Congrats..U Won.!!").css("color","blue");
                                raj.css({"left":"3%" ,"top":"48%"});
                        }
                }
                
        }

        $(".container").hide();
        $(".play").click(function(){
                $(".main").fadeIn(300);
                $(".entrance").slideUp(200);
                $(".helpPage").slideUp(200);
                life = 3;
                $(".lives").text("lives x "+ life);
        });
        
        $(".help").click(function(){
                $(".helpPage").fadeIn(300);$(".entrance").hide(200);
        });
        
        $(".fullScreen").on('click',function(){
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

        $(".back").click(function(){
                $(".entrance").show(300);$(".helpPage").fadeOut(200);
        });

        $(".exit").click(function(){
                let confirm = confirm("Do you want to exit??");
                if(confirm){
                        window.open('','_self');
                        window.close();
                }
                else{
                        alert("why did u press exit then??ha?");
                }
        });
        $(".retry").click(function(){
                life = 3;
                $(".result").slideToggle(200);
                $(".main").slideToggle(300);
                $(".lives").text("lives x "+ life);
                raj.css({"left":"3%" ,"top":"48%"});
        });

        $(".menu").click(function(){
                $(".entrance").toggle(300);
                $(".result").fadeToggle(200);
        });		
        
        $(window).on('resize', function(){
                
        });

        setInterval(function(){
                if($(".main").is(":visible")){
                        $(".bars .bar:odd").animate({top:"100px"},200).animate({top:0},500);
                        $(".bars .bar:even").animate({top:"-100px"},200).animate({top:0},500);
                        
                }
        },1000);

        $(window).keypress(function(a){
                if($(".main").is(":visible")){
                        if(a.which === 120){
                                a.preventDefault();
                                $(".main").hide();
                                $(".entrance").show();
                                return 0;
                        }
                        if(a.which === 32 && $(".main").data("paused") === "off"){
                                $(".main").data("paused","on");
                                $("body").css("opacity",0.5);
                                setPos();
                                raj.hide();
                                jQuery.fx.off=true;
                        }
                        else{
                                $(".main").data("paused","off");
                                $("body").css("opacity",1);
                                jQuery.fx.off=false;
                                raj.show();
                        }              
                }
        });   

        $(document).bind("contextmenu",function(q){return false;});

        $(document).on("mouseleave touchend",function(){setPos();});

        raj.on("mouseenter touchstart",function(event){
                raj.on("mousemove touchmove",move);
        });
        raj.on("mousemove touchmove", move);
                
        
        setInterval(function(){
                if($(".main").is(":visible")){
                        $(".bars .bar").each(function(){
                                boxLeft = raj.offset().left;
                                boxTop = raj.offset().top;
                                boxRelativeWidth = boxLeft + raj.innerWidth();
                                boxRelativeHeight = boxTop + raj.innerHeight(); 
                                let lineLeft = $(this).offset().left;
                                let lineTop = $(this).offset().top;
                                let lineWidth = lineLeft+$(this).innerWidth();
                                let lineHeight = lineTop+$(this).innerHeight();
                                if(boxRelativeWidth > lineLeft && boxLeft < lineWidth && boxRelativeHeight > lineTop && boxTop < lineHeight){
                                        flag = 1;
                                        raj.unbind("touchmove");
                                        raj.css({"left":"3%" ,"top":"48%"});
                                }
                        });
                }
        },10);

        raj.on("mouseleave touchend",function(event){
                raj.unbind("touchmove");
                lives();
                flag = 0;
                if(life == 0){
                        life = 3;
                        $(".main").hide();
                        $(".result").show();
                        $(".resultText").html("GAME OVER...!!");
                        raj.css({"left":"3%" ,"top":"48%"});
                }
        });
});