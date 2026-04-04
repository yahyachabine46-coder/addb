<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>GastroAI - Système de Caisse Intelligent</title>
    <style>
        :root {
            --morocco-red: #c1272d;
            --morocco-green: #006233;
            --glass-bg: rgba(255, 255, 255, 0.85);
        }

        body {
            background: linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), 
                        url('https://images.unsplash.com/photo-1539667468225-8df66742d132?q=80&w=2000') no-repeat center center fixed;
            background-size: cover;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            color: #333;
            margin: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
        }

        .app-container {
            width: 90%;
            max-width: 1000px;
            background: var(--glass-bg);
            backdrop-filter: blur(10px);
            border-radius: 20px;
            padding: 30px;
            box-shadow: 0 15px 35px rgba(0,0,0,0.3);
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 25px;
        }

        h1 { grid-column: 1 / -1; text-align: center; color: var(--morocco-red); margin-top: 0; }

        .card {
            background: white;
            padding: 20px;
            border-radius: 15px;
            border-left: 5px solid var(--morocco-green);
            box-shadow: 0 4px 6px rgba(0,0,0,0.05);
        }

        button {
            width: 100%;
            padding: 12px;
            margin: 10px 0;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-weight: bold;
            transition: 0.3s;
        }

        .btn-bluetooth { background-color: #2196F3; color: white; }
        .btn-order { background-color: var(--morocco-green); color: white; }

        #status { font-size: 0.9em; text-align: center; font-weight: bold; }
    </style>
</head>
<body>

<div class="app-container">
    <h1>🇲🇦 GastroAI : Terminal Intelligent</h1>

    <div class="card">
        <h3>🛒 Saisie Rapide</h3>
        <p>Simulation IA : "Un Tajine et deux Thés"</p>
        <button class="btn-order" onclick="simulerCommande()">Simuler Commande IA</button>
        <div id="panier">
            <p><i>Panier vide...</i></p>
        </div>
    </div>

    <div class="card">
        <h3>🔌 Connexion Bluetooth</h3>
        <button class="btn-bluetooth" id="connectBT">🔗 Rechercher Imprimante</button>
        <p id="status">Statut : Non connecté</p>
        
        <hr>
        
        <h3>📊 État des Stocks</h3>
        <div id="stocks">
            ✅ Viande : OK <br>
            ⚠️ Semoule : Niveau Bas (IA suggère +5kg)
        </div>
    </div>
</div>

<script>
    let bluetoothDevice;
    let characteristic;

    // --- LOGIQUE BLUETOOTH ---
    document.getElementById('connectBT').addEventListener('click', async () => {
        const status = document.getElementById('status');
        try {
            // Recherche d'appareils supportant le service d'écriture (standard pour imprimantes)
            bluetoothDevice = await navigator.bluetooth.requestDevice({
                acceptAllDevices: true,
                optionalServices: ['000018f0-0000-1000-8000-00805f9b34fb'] // UUID générique SPP
            });

            status.innerText = "Connexion...";
            const server = await bluetoothDevice.gatt.connect();
            status.innerText = "Connecté à : " + bluetoothDevice.name;
            status.style.color = "green";
        } catch (error) {
            status.innerText = "Erreur : " + error;
            status.style.color = "red";
        }
    });

    // --- LOGIQUE COMMANDE ---
    function simulerCommande() {
        const panier = document.getElementById('panier');
        panier.innerHTML = `
            <div style="background:#f9f9f9; padding:10px; border-radius:5px;">
                <b>1x Tajine Agneau</b> : 85 DH<br>
                <b>2x Thé à la menthe</b> : 20 DH<br>
                <hr>
                <b>Total : 105 DH</b>
            </div>
            <button class="btn-order" style="margin-top:10px;" onclick="imprimerTicket()">🖨️ Imprimer Ticket</button>
        `;
    }

    async function imprimerTicket() {
        if (!bluetoothDevice) {
            alert("Veuillez d'abord connecter l'imprimante Bluetooth !");
            return;
        }
        // Ici, on enverrait les octets ESC/POS à la caractéristique Bluetooth
        console.log("Envoi des données d'impression...");
        alert("Données envoyées à l'imprimante !");
    }
</script>

</body>
</html>
