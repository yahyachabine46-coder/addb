// 1. Request the Bluetooth Device
const device = await navigator.bluetooth.requestDevice({
    filters: [{ services: ['heart_rate'] }] 
});

const server = await device.gatt.connect();

// 2. Receive Data
const service = await server.getPrimaryService('heart_rate');
const characteristic = await service.getCharacteristic('heart_rate_measurement');

characteristic.addEventListener('characteristicvaluechanged', (event) => {
    const value = event.target.value;
    // 3. Send this value to your Python Backend with the TPU
    sendToTPUBackend(value); 
});
