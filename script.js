<script>
    // 1. We grab the text box (id="BOX") and the number display (id="COUNT")
    const myBox = document.getElementById('BOX');
    const myCount = document.getElementById('COUNT');

    // 2. We tell the browser to "listen" every time you type (input)
    myBox.addEventListener('input', function() {
        
        // 3. We take the text, trim the extra spaces from the start/end
        const text = myBox.value.trim();
        
        // 4. This line splits the text by ANY whitespace (spaces, enters, tabs)
        // If the box is empty, it returns 0. If not, it counts the pieces.
        const words = text ? text.split(/\s+/) : [];
        
        // 5. We update the number on the screen
        myCount.innerText = words.length;
    });
</script>
