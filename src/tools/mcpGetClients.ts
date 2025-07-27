
import { unifiLocalClient, UNIFI_SITE_ID } from '../common/headers';

export const getClientsSchema = {
    title:"Get Connected Clients",
    description:"Get all clients currently connected to the network"
}

export const getClientsHandler = async () => {
    try {
        const response = await unifiLocalClient.get(`${UNIFI_SITE_ID}/clients`)
        
        return { 
            content: [
                { 
                type:"text" as const,
                text:JSON.stringify(response.data, null, 2)
                }
            ]
        }
    } catch (error) {
        throw new Error(`Network error: ${(error as Error).message}`);
    }
}