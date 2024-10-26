import * as verificarLoginService from "../../services/verificarLogin.js";
import { inicializarQuadro, type QuadroView } from "./quadro.js";

let quadroView: QuadroView = {};

(async () => {
    const dadosLogin = await verificarLoginService.verificarLogin() as verificarLoginService.RespostaLogin;

    inicializarQuadro(dadosLogin, quadroView);
})()