import { appConfig } from "/config.js";

export const fazerLogout = async () =>
    await fetch(`${appConfig.baseApiUrl}/api/v1/logout`, {
        method: "POST",
        credentials: "include",
        mode: "cors",
        headers: {
            "Content-Type": "application/json"
        }
    })