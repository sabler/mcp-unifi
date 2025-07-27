import { unifiClient, UNIFI_SITE_ID } from "../common/headers";
import { z } from 'zod'


export const getClientDetailsSchema = {
    title:"Get Client Details",
    description:"With a provided client ID, returns granular details about the client device",
    inputSchema: { clientid: z.string() }
}


export const getClientDetailsHandler = async ({ clientid }: { clientid: string }) => {
    try {
        const response = await unifiClient.get(`sites/${UNIFI_SITE_ID}/clients/${clientid}`)

        return {
            content: [
                {
                    type: "text" as const,
                    text: JSON.stringify(response.data, null, 2)
                }
            ]
        }
    }

    catch(error) {
         throw new Error(`Network error: ${(error as Error).message}`);
    }
}
