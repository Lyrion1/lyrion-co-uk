(function(){
 const root = document.documentElement;
 const toggle = document.querySelector('[data-nav-toggle]');
 if (toggle){
 toggle.addEventListener('click', ()=> root.classList.toggle('nav-open'));
 }
})();
