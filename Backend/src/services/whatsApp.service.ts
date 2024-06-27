// whatsApp.service.ts
import { Client } from 'whatsapp-web.js';
import createWhatsAppClient from '../config/whatsApp.config';

export class WhatsAppService {
    private client: Client;

    constructor() {
        this.client = createWhatsAppClient();
    }

    async sendMessage(to: string, message: string): Promise<void> {
        console.log("Sending message to:", to);
        console.log("Message content:", message);
        try {
            if (!this.client) {
                throw new Error('WhatsApp client not initialized.');
            }
            await this.client.sendMessage(`${to}@c.us`, message);
            console.log('Message sent to', to);
        } catch (error) {
            console.error('Error sending message:', error);
            throw error; // Lanza el error para manejarlo más arriba, si es necesario
        }
    }
}

export default WhatsAppService;
