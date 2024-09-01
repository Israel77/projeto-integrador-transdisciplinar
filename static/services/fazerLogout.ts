export const fazerLogout = async () => {
    const resposta = await fetch("/api/v1/logout", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        }
    });
}