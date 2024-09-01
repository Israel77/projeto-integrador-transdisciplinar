export type RespostaLogin = {
    id: number;
    quadros: number[];
}

export const verificarLogin = async (): Promise<RespostaLogin | MensagemErro> => {
    const resposta = await fetch("/api/v1/verificar-login", {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    });

    return await resposta.json() as RespostaLogin | MensagemErro;
}