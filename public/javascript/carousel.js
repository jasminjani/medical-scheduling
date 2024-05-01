function carousel(){

    
    let prev = document.querySelector('.left-swipe')
    let next = document.querySelector('.right-swipe')
    let carousel = document.querySelector('.cards')
    let cards = document.querySelectorAll('.card')
    let cardLength = cards.length;
    let currIndex = 0;
    
    next.addEventListener('click',function(){
        currIndex = (currIndex + 1) % (cardLength-2);
        showTestimonials(currIndex);
    })
    
    prev.addEventListener('click',function(){
        currIndex = (cardLength + currIndex - 3) % (cardLength-2);
        showTestimonials(currIndex);
    })
    
    
    function showTestimonials(index){
        let position = -index*250 + 'px';
        carousel.style = `transition:all .5s ease-in-out;`
        carousel.style.transform = 'translateX('+ position +')'
        
      }
    
    
    carousel?.addEventListener('transitioned',function(){
        carousel.style.transition = 'none'
     })
}