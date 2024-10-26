import * as verificarLoginService from "../../services/verificarLogin.js";
import { inicializarQuadro, type QuadroView } from "./quadro.js";

(async () => {
    let quadroView: QuadroView = {};
    const dadosLogin = await verificarLoginService.verificarLogin() as verificarLoginService.RespostaLogin;

    inicializarQuadro(dadosLogin, quadroView);
})()