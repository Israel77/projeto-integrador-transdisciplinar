import * as verificarLoginService from "../../services/verificarLogin.js";
import { inicializarQuadro, type QuadroView } from "./quadro.js";

(async () => {
    let quadroView: QuadroView = {};
    const dadosLogin = await verificarLoginService.verificarLogin() as verificarLoginService.RespostaLogin;

    if (dadosLogin.quadros.length === 0) {
        window.location.href = "/criar-quadro";
    }

    inicializarQuadro(dadosLogin, quadroView);
})()