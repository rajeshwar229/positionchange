$(document).ready(function(){
		var raj=$(".raj"),l=3,flag=0,me,bw=50,bh=300,bleft,btop;
		var w=raj.css("width"),lw,lh,lra,lrb;
		var h=raj.css("height"),move=0,x=0;bw,bh,boxLeft=0,boxTop=0;
		$(".main,.helpPage,.game").hide();
                $(".play").click(function(){$(".main").fadeIn(300);$(".entrance").slideUp(200);$(".helpPage").slideUp(200);l=3;$(".lives").text("lives x "+ l);});
                $(".help").click(function(){$(".helpPage").fadeIn(300);$(".entrance").hide(200);});
                $(".back").click(function(){$(".entrance").show(300);$(".helpPage").fadeOut(200);});
                $(".exit").click(function(){var c=confirm("Do you want to exit??");if(c==true){ window.open('','_self');window.close();}else{alert("y did u press exit then??ha?");}});
                $(".retry").click(function(){$(".game").slideToggle(200);$(".main").slideToggle(300);$(".lives").text("lives x "+ l);raj.css({"left":50 ,"top":300});});
                $(".menu").click(function(){$(".entrance").toggle(300);$(".game").fadeToggle(200);});		
                                
                setInterval(function(){
		$("li:odd").animate({top:"-70px"},200).animate({top:"30px"},500);
		$("li:even").animate({top:"-50px"},200).animate({top:"-200px"},500);
		},1000);
                                $(window).keypress(function(a){
                                                if($(".main").css("display")!=='none'){
                                                x++;
                                                if(a.which==120){a.preventDefault();$(".main").hide();$(".entrance").show();return 0;}
                                                if(a.which==32 && x%2!=0){
                                                        $("body").css("opacity",0.5);setPos();raj.hide();jQuery.fx.off=true;
                                                }
                                                else{$("body").css("opacity",1);jQuery.fx.off=false;raj.show();}              
                                                }
                                                });
                               
		var setPos=function(){$(document).off("mousemove");};
                $(document).bind("contextmenu",function(q){return false;});
                function boxMove(a,b){raj.css({"left":bl-a,"top":bt-b,
"background":"rgb("+Math.round(Math.random()*255) +","+Math.round(Math.random()*255) +","+Math.round(Math.random()*255) +")"});} 
                function lives(){if(flag==1){l--;flag=0;setPos();}$(".lives").text("lives x "+ l);}
                $(document).on("mouseleave",function(){setPos();});
                raj.on("mouseenter",function(){$(document).on("mousemove",move);});
                $(document).one("mousemove",move=function(e){         
			bl=parseInt(e.pageX);
			bt=parseInt(e.pageY);
        switch(raj.width()){
	case 50:switch(raj.height()){case 50:boxMove(20,20);break;}break;
	case 45:switch(raj.height()){case 45:boxMove(5,15);break;}break;
	case 40:switch(raj.height()){case 40:boxMove(-5,10);break;}break;
}if(flag==1)flag=0;		                      
if(bw>=$(".main").width()){$(".main").hide();$(".game").show();$(".gameText").html("Congrats..U Won.!!").css("color","blue");}});
                
                setInterval(function(){
                                $("li").each(function(){
                                boxLeft=raj.position().left;boxTop=raj.position().top;
                                bw=boxLeft+raj.width();bh=boxTop+raj.height(); 
				 ll=$(this).position().left;
				 lt=$(this).position().top;
				 lw=ll+$("li").width();
				 lh=lt+$("li").height();
                                if(bw>ll && boxLeft<lw && bh>lt && boxTop<lh){flag=1;raj.css({"left":50 ,"top":300});}});},1);
                raj.on("mouseleave",function(){lives();flag=0;if(l==0){l=3;$(".main").hide();$(".game").show();$(".gameText").html("GAME OVER...!!");}});
		
	});