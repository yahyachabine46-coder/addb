<div class="panel">
    <h2>Matériel Bluetooth</h2>
    <button id="connectBluetooth" style="background-color: #007bff; color: white; padding: 10px;">
        🔗 Connecter Imprimante Caisse
    </button>
    <p id="status">Statut : Déconnecté</p>
</div>

<script>
document.getElementById('connectBluetooth').addEventListener('click', async () => {
    const statusText = document.getElementById('status');
    
    try {
        statusText.innerText = "Recherche d'appareils...";
        
        // On demande à l'utilisateur de choisir un appareil Bluetooth
        const device = await navigator.bluetooth.requestDevice({
            acceptAllDevices: true,
            optionalServices: ['battery_service'] // Remplacez par le service de votre imprimante
        });

        statusText.innerText = `Tentative de connexion à : ${device.name}...`;
        
        const server = await device.gatt.connect();
        
        statusText.style.color = "green";
        statusText.innerText = `Connecté à ${device.name} ! ✅`;
        
        // Ici, vous pouvez envoyer des données à l'imprimante
        // ex: printReceipt(server);

    } catch (error) {
        console.error("Erreur Bluetooth : ", error);
        statusText.style.color = "red";
        statusText.innerText = "Erreur : " + error.message;
    }
});
</script>
