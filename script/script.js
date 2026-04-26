// Animasi per huruf untuk title
const title = document.getElementById('animated-title');
const text = title.textContent;
title.textContent = '';

// Buat span untuk setiap huruf
text.split('').forEach((char, index) => {
    const span = document.createElement('span');
    span.textContent = char;
    span.style.animationDelay = `${index * 0.08}s`;
    span.classList.add('letter-animate');
    title.appendChild(span);
});

// const obeserver = new IntersectionObserver((entries) => {
//     entries.forEach((entry)=> {
//         if(entry.isIntersecting){
//             console.log(entry.target)
//             entry.target.classList.add("show")
//         } else {
//             entry.target.classList.remove("show")
//         }
//     })
// })
// const todoElement = document.querySelectorAll("section")
// todoElement.forEach(el => obeserver.observe(el))