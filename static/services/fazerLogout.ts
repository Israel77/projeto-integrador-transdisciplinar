export const fazerLogout = async () =>
    await fetch("/api/v1/logout", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        }
    })