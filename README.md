<script>
    const textarea = document.getElementById('essayBox');
    const wordCountDisplay = document.getElementById('wordCount');

    // 'input' captures every single keystroke, including backspaces and enters
    textarea.addEventListener('input', () => {
        const text = textarea.value.trim();
        
        // This line is the magic: it looks for any whitespace (spaces or new lines)
        // and filters out the empty results.
        const words = text ? text.split(/\s+/) : [];
        
        wordCountDisplay.innerText = words.length;
    });
</script>
