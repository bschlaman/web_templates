window.onload=function(){
    // setInterval(updateWidthNo, 1000/5);

    window.onresize = checkSide;
    document.querySelector('.hamburger').onclick = () => {
        let side = document.querySelector(".side");
        if (side.classList.contains('ham-show')){
            side.style.transform = 'translateX(-300px)';
            side.classList.remove('ham-show');
        } else {
            side.style.transform = 'translateX(0)';
            side.classList.add('ham-show');
        }
    }

}

var checkSide = function(){
	let side = document.querySelector(".side");
	if(window.innerWidth > 768){
        side.style.transform = '';
        side.classList.remove('ham-show');
	}
}

var menu1 = function(){
    window.onresize = checkMenuHidden;
    document.querySelector('.hamburger').onclick = () => {
    	let main = document.querySelector(".main");
    	let menu = document.querySelector(".menu");
    	if(menu.style.visibility == 'visible'){
    		menu.style.visibility = 'hidden';
    		menu.style.opacity = 0;
    		main.innerHTML = 'hidden';
    	} else {
    		menu.style.visibility = 'visible';
    		menu.style.opacity = 1;
    		main.innerHTML = 'visible';
    	}
    }
    let hamAnchors = document.querySelectorAll('.menu a');
    for(let i = 0 ; i < hamAnchors.length ; i++){
        hamAnchors[i].onclick = () => {
            let menu = document.querySelector(".menu");
            menu.style.visibility = 'hidden';
            menu.style.opacity = 0;
        }
    }
}

var updateWidthNo = function(){
    let main = document.querySelector(".main");
    main.innerHTML = window.innerWidth;
}

function myFunction() {
    var x = document.getElementById("myLinks");
    if (x.style.display === "block") {
        x.style.display = "none";
    } else {
        x.style.display = "block";
    }
}

function checkMenuHidden(){
	let menu = document.querySelector(".menu");
	if(window.innerWidth > 768){
		menu.style.visibility = 'hidden';
		menu.style.opacity = 0;
	}
}

function slideMenu(){
    document.querySelector(".hamburger").onclick = function(){
        let mmenu = document.querySelector(".mmenu");
        //if mmenu.offsetTop
        mmenu.style.transform = 'translateY(0)';
        let main = document.querySelector(".main");
        main.innerHTML = mmenu.offsetTop;
    }
}
