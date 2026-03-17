<a href="javascript:(function(){
    /* This version looks for DIVs and buttons too! */
    const ans = prompt('What is the answer to find?');
    const tags = ['div', 'span', 'button', 'p', 'li'];
    let found = false;
    tags.forEach(tag => {
        document.querySelectorAll(tag).forEach(el => {
            if(el.innerText.trim() === ans && !found) {
                el.click();
                found = true;
                alert('Clicked the ' + tag + '!');
            }
        });
    });
})();">🚀 UNIVERSAL SOLVER</a>
