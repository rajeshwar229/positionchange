$(document).ready(function(){

        var raj=$(".raj"), life = 3, flag = 0, boxWidth = raj.width(), boxRelativeWidth = 0, boxRelativeHeight = 0, boxHeight = raj.height(), x = 0, move = null, boxLeft = 0, boxTop = 0;

        const setPos = function(){$(document).off("mousemove");};

        const lives = function(){
                if(flag == 1){
                        life--;
                        flag=0;
                        setPos();
                }
                $(".lives").text("lives x "+ life);
        }
        $(".main,.helpPage,.game").hide();

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
                $(".game").slideToggle(200);
                $(".main").slideToggle(300);
                $(".lives").text("lives x "+ life);
                raj.css({"left":"3%" ,"top":"48%"});
        });

        $(".menu").click(function(){
                $(".entrance").toggle(300);
                $(".game").fadeToggle(200);
        });		
                        
        setInterval(function(){
                $("li:odd").animate({top:boxHeight*2},200).animate({top:boxHeight*(-1)},500);
                $("li:even").animate({top:boxHeight*(-1)},200).animate({top:boxHeight*(-3)},500);
        },1000);

        $(window).keypress(function(a){
                if($(".main").css("display")!=='none'){
                if(a.which==120){
                        a.preventDefault();
                        $(".main").hide();
                        $(".entrance").show();
                        return 0;
                }
                if(a.which==32 && x == 0){
                        x = 1;
                        $("body").css("opacity",0.5);
                        setPos();
                        raj.hide();
                        jQuery.fx.off=true;
                }
                else{
                        x = 0;
                        $("body").css("opacity",1);
                        jQuery.fx.off=false;
                        raj.show();}              
                }
        });   

        $(document).bind("contextmenu",function(q){return false;});

        $(document).on("mouseleave touchend",function(){setPos();});

        raj.on("mouseenter touchstart",function(event){
                raj.on("mousemove touchmove",move);
        });
        $(document).one("mousemove touchmove",move=function(event){         
                if($(".main").is(":visible")){
                        var touchLeft = parseInt(event.pageX);
                        var touchTop = parseInt(event.pageY);
                        if(event.type === "touchmove"){
                                touchLeft = event.originalEvent.changedTouches[0].clientX;
                                touchTop = event.originalEvent.changedTouches[0].clientY;
                        }
                }
                const boxMove = function (a,b){
                        raj.css({"left":touchLeft-a,"top":touchTop-b, "background":"rgb("+Math.round(Math.random()*255) +","+Math.round(Math.random()*255) +","+Math.round(Math.random()*255) +")"});
                }
                if(boxWidth >= 70){
                        boxMove(boxWidth/1.5,boxHeight/1.5);
                }
                else {
                        boxMove(boxWidth/3,boxHeight/3);
                }
                                      
                if(boxRelativeWidth >= $(".main").width()){
                        $(".main").hide();
                        $(".game").show();
                        $(".gameText").html("Congrats..U Won.!!").css("color","blue");
        }});
                
        if($(".main").is(":visible")){
                setInterval(function(){
                        $("li").each(function(){
                                boxLeft = raj.position().left;
                                boxTop = raj.position().top;
                                boxRelativeWidth = boxLeft + raj.width();
                                boxRelativeHeight = boxTop + raj.height(); 
                                let lineLeft = $(this).position().left;
                                let lineTop = $(this).position().top;
                                let lineWidth = lineLeft+$(this).width();
                                let lineHeight = lineTop+$(this).height();
                                if(boxRelativeWidth > lineLeft && boxLeft < lineWidth && boxRelativeHeight > lineTop && boxTop < lineHeight){
                                        flag = 1;
                                        raj.unbind("touchmove");
                                        raj.css({"left":"3%" ,"top":"48%"});
                                }
                        });
                },10);
        }

        raj.on("mouseleave touchend",function(event){
                raj.unbind("touchmove");
                if(event.type === "touchend"){
                        //alert(flag);
                }
                lives();
                flag = 0;
                if(life == 0){
                        life = 3;
                        $(".main").hide();
                        $(".game").show();
                        $(".gameText").html("GAME OVER...!!");
                }
        });
});