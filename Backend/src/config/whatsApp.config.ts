// whatsApp.config.ts
import { Client, LocalAuth } from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';

const createWhatsAppClient = (): Client => {
    try {
       // const wwebVersion = '2.2412.54';

        const client = new Client({
            authStrategy: new LocalAuth({
                clientId: "client-one" // Puedes usar un ID para diferenciar sesiones si tienes múltiples clientes
            }),
            webVersionCache: {
                type: "remote",
                remotePath: "https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2412.54.html",
            },
        });

        // When the client is ready, run this code (only once)
        client.once('ready', async () => {
            console.log('Client is ready!');

            async function enviarMensaje() {
                try {
                    const destinatarios = ['5491130331440', '5491149719704', '5491126097955', '5491173663711', '5491160206455']; // Lista de números de teléfono
                    const message = 'Enviado por altanto. Sobre whatsap, o pagamos una api o un server'; // Mensaje a enviar

                    for (const to of destinatarios) {
                        const chatId = `${to}@c.us`;

                        // Verificar si el número de teléfono es válido
                        const isValidNumber = await client.isRegisteredUser(chatId);
                        if (!isValidNumber) {
                            console.error('El número no está registrado en WhatsApp:', to);
                            continue; // Saltar al siguiente número
                        }

                        await client.sendMessage(chatId, message);
                        console.log(`Mensaje enviado correctamente a ${to}`);
                    }
                } catch (error) {
                    console.error('Error al enviar el mensaje:', error);
                }
            }

            // Llama a la función enviarMensaje cuando sea necesario
            await enviarMensaje();
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
