import { criarQuadro } from "../../components/QuadroKanban.js";
import { fazerLogout } from "../../services/fazerLogout.js";
import { RespostaLogin, verificarLogin } from "../../services/verificarLogin.js";
import type { MensagemErro, Quadro } from "../../types/types";


(async () => {
    const dadosLogin = await verificarLogin();

    if (!dadosLogin.hasOwnProperty("id")) {
        window.location.href = "/";
        return;
    }

    // Por enquanto, cada usuário terá apenas um quadro
    const idQuadro = (dadosLogin as RespostaLogin).quadros[0];
    const resposta = await fetch(`/api/v1/quadro/${idQuadro}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    });

    if (resposta.ok) {
        const corpoResposta = await resposta.json() as Quadro;
        criarQuadro(corpoResposta);
    } else {
        const corpoResposta = await resposta.json() as MensagemErro;
        console.error(corpoResposta.message);
    }

    const botaoLogout = document.getElementById("botao-logout") as HTMLButtonElement;
    botaoLogout.addEventListener("click", async () => {
        await fazerLogout();
        window.location.href = "/";
    })
})()