export interface UniFiConfig {

}

export interface UniFiHostDevice {

}

export interface UniFiUserDevices {
    type: string,
    id: string,
    name: string,
    connectedAt: string,
    ipAddress: string,
    macAddress:string,
    uplinkDeviceId: string,
    access: object
}

export interface UnifiISPStatus {
    
}



// {
//             "type": "WIRELESS",
//             "id": "42fff0b2-1d89-39cb-a004-249c2310a7f7",
//             "name": "Nintendo Switch 2",
//             "connectedAt": "2025-07-26T20:33:12Z",
//             "ipAddress": "192.168.1.70",
//             "macAddress": "3c:a9:ab:f5:dd:3b",
//             "uplinkDeviceId": "0a67d4c0-f564-39d3-9699-4b4ff81911fc",
//             "access": {
//                 "type": "DEFAULT"
//             }
//         },