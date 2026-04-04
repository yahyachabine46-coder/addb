<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>GastroAI - Saisie Caisse Maroc</title>
    <style>
        body {
            /* On imagine ici le fond d'écran Maroc, flouté */
            background-image: url('fond_maroc.jpg');
            background-size: cover;
            font-family: sans-serif;
            margin: 0;
            padding: 20px;
        }
        .container {
            display: flex;
            gap: 20px;
        }
        .panel {
            background: rgba(255, 255, 255, 0.9); /* Fond semi-transparent */
            border-radius: 10px;
            padding: 20px;
            flex: 1;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        h2 { border-bottom: 2px solid #0056b3; padding-bottom: 10px; }
        .alert { color: red; font-weight: bold; }
    </style>
</head>
<body>

    <header>
        <h1>GastroAI - Commande & Stocks</h1>
    </header>

    <div class="container">
        <div class="panel">
            <h2>Saisie de Commande</h2>
            <p><strong>Commande Vocale (Transcription) :</strong></p>
            <textarea rows="4" style="width:100%;">Je voudrais deux menus du jour, une eau gazeuse et un café s'il vous plaît.</textarea>
            <button>Simuler Saisie Vocale</button>

            <h3>Panier</h3>
            <ul>
                <li>2x Menu du Jour - 50.00€</li>
                <li>1x Eau Gazeuse - 3.50€</li>
                <li>1x Café - 2.00€</li>
            </ul>
            <p><strong>Total : 55.50€</strong></p>
            <button style="background-color: green; color: white;">Valider la Commande</button>
        </div>

        <div class="panel">
            <h2>Gestion des Stocks</h2>
            <p>Farine : 75%</p>
            <p>Viande : <span class="alert">40% - Niveau Bas</span></p>
            <p>Légumes : 85%</p>

            <h2>Prédiction IA</h2>
            <p>Demain (Météo Pluie) : <span class="alert">+20% de Soupes Prévues</span>.</p>
            <p>Recommandation : Commande Légumes +20%.</p>
        </div>
    </div>

</body>
</html>
