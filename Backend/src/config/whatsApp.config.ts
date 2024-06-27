// whatsApp.config.ts
import { Client, LocalAuth } from 'whatsapp-web.js';

import qrcode from 'qrcode-terminal';

const createWhatsAppClient = (): Client => {
    try {
        const wwebVersion = '2.2412.54'; 

        const client = new Client({
            authStrategy: new LocalAuth({
                clientId: "client-one"
            }),
            puppeteer: {
                args: ["--no-sandbox"],

            },
            webVersionCache: {
                type: 'remote',
                remotePath: `https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/${wwebVersion}.html`,
            },
        });

        // When the client is ready, run this code (only once)
        client.once('ready', () => {
            console.log('Client is ready!');
        });
        
        // When the client received QR-Code
        client.on('qr', (qr) => {
            qrcode.generate(qr, { small: true });
        });
        
        // Start your client
        client.initialize();

        return client; // Devuelve el objeto Client creado
    } catch (error) {
        console.error('Error creating WhatsApp client:', error);
        throw error; // Lanza el error para que sea manejado por el código que llama a createWhatsAppClient
    }
};

export default createWhatsAppClient;
