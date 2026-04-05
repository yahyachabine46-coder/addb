<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>GastroAI - Système de Caisse</title>
    <style>
        :root {
            --maroc-rouge: #c1272d;
            --maroc-vert: #006233;
            --glass: rgba(255, 255, 255, 0.9);
        }

        body {
            background: linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), 
                        url('https://images.unsplash.com/photo-1539667468225-8df66742d132?q=80&w=2000') no-repeat center center fixed;
            background-size: cover;
            font-family: 'Segoe UI', sans-serif;
            margin: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
        }

        .container {
            width: 90%;
            max-width: 1000px;
            background: var(--glass);
            backdrop-filter: blur(10px);
            border-radius: 20px;
            padding: 30px;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
        }

        h1 { grid-column: 1 / -1; text-align: center; color: var(--maroc-rouge); text-transform: uppercase; }

        .carte {
            background: white;
            padding: 20px;
            border-radius: 12px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }

        button {
            width: 100%;
            padding: 12px;
            margin: 8px 0;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-weight: bold;
        }

        .btn-bleu { background-color: #3498db; color: white; }
        .btn-vert { background-color: var(--maroc-vert); color: white; }
        .btn-or { background-color: #d4af37; color: white; }

        .alerte { color: #e67e22; font-weight: bold; }
    </style>
</head>
<body>

<div class="container">
    <h1>🇲🇦 GastroAI : Terminal de Gestion</h1>

    <div class="carte">
        <h3>🎙️ Saisie Vocale IA</h3>
        <p><i>Exemple : "Un Couscous Royal et trois boissons."</i></p>
        <button class="btn-vert" onclick="traiterCommande()">Traiter par l'IA</button>
        
        <div id="panier" style="margin-top: 15px;">
            <p style="color: #888; text-align: center;">Panier vide</p>
        </div>
    </div>

    <div class="carte">
        <h3>🔌 Connexion Bluetooth</h3>
        <button class="btn-bleu" id="btnBluetooth">🔗 Connecter Imprimante</button>
        <p id="statut" style="font-size: 0.9em; text-align: center;">Statut : Déconnecté</p>
        
        <hr>
        
        <h3>📊 Analyse Prédictive</h3>
        <div id="stocks">
            🌿 Menthe : Stock Optimal <br>
            <span class="alerte">⚠️ Semoule : Stock Faible</span><br>
            <small>Prédiction IA : Rush prévu pour vendredi (Couscous). Commandez +15kg.</small>
        </div>
    </div>
</div>

<script>
    let appareilBluetooth;

    // --- CONNEXION BLUETOOTH ---
    document.getElementById('btnBluetooth').addEventListener('click', async () => {
        const statut = document.getElementById('statut');
        try {
            statut.innerText = "Recherche en cours...";
            appareilBluetooth = await navigator.bluetooth.requestDevice({
                acceptAllDevices: true,
                optionalServices: ['000018f0-0000-1000-8000-00805f9b34fb']
            });
            await appareilBluetooth.gatt.connect();
            statut.innerText = "Connecté à : " + appareilBluetooth.name;
            statut.style.color = "green";
        } catch (err) {
            statut.innerText = "Erreur : " + err.message;
            statut.style.color = "red";
        }
    });

    // --- LOGIQUE DE COMMANDE ---
    function traiterCommande() {
        const panier = document.getElementById('panier');
        panier.innerHTML = `
            <div style="background:#f9f9f9; padding:10px; border-radius:8px;">
                <div style="display:flex; justify-content:space-between;"><span>1x Couscous Royal</span> <b>120 DH</b></div>
                <div style="display:flex; justify-content:space-between;"><span>3x Coca-Cola</span> <b>45 DH</b></div>
                <hr>
                <div style="display:flex; justify-content:space-between; font-size:1.1em;">
                    <b>TOTAL :</b> <b>165 DH</b>
                </div>
            </div>
            <button class="btn-or" style="margin-top:10px;" onclick="imprimerRecu()">🖨️ Imprimer le Ticket</button>
        `;
    }

    function imprimerRecu() {
        if (!appareilBluetooth) {
            alert("Veuillez connecter l'imprimante Bluetooth d'abord !");
            return;
        }
        alert("Impression lancée vers l'imprimante caisse.");
    }
</script>

</body>
</html>
