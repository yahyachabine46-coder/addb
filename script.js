<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Span Solver Pro</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #0d1117; color: #c9d1d9; text-align: center; padding: 50px; }
        .box { border: 1px solid #30363d; background: #161b22; padding: 30px; border-radius: 12px; display: inline-block; max-width: 600px; }
        h1 { color: #58a6ff; }
        .bookmarklet {
            display: inline-block;
            background: #238636;
            color: white;
            padding: 15px 25px;
            text-decoration: none;
            border-radius: 50px;
            font-weight: bold;
            cursor: move;
            border: 2px solid #2ea043;
            margin: 20px 0;
        }
        .instructions { text-align: left; line-height: 1.6; }
        code { background: #21262d; padding: 2px 5px; border-radius: 4px; color: #ff7b72; }
    </style>
</head>
<body>

<div class="box">
    <h1>Quiz Span Solver</h1>
    <p>Drag the green button below to your <b>Bookmarks Bar</b>:</p>

    <a class="bookmarklet" href="javascript:(function(){
        const quizDatabase = {
            'What is the capital of France?': 'Paris',
            'What is 5 + 5?': '10'
        };
        const questionText = document.querySelector('h1, h2, .question, .q-text')?.innerText.trim();
        const answer = quizDatabase[questionText];
        if (answer) {
            const spans = document.querySelectorAll('span');
            for (let s of spans) {
                if (s.innerText.trim() === answer) {
                    s.click();
                    s.dispatchEvent(new MouseEvent('click', {bubbles: true}));
                    console.log('✅ Clicked: ' + answer);
                    break;
                }
            }
        } else {
            alert('Question not found in database!');
        }
    })();">🚀 SOLVE QUIZ</a>

    <div class="instructions">
        <h3>How to use:</h3>
        <ol>
            <li>Drag that <b>🚀 SOLVE QUIZ</b> button up to your bookmarks bar.</li>
            <li>Open your quiz website.</li>
            <li>When a question appears, click the bookmark in your bar.</li>
            <li>The script will find the correct <code>&lt;span&gt;</code> and click it!</li>
        </ol>
    </div>
</div>

</body>
</html>
