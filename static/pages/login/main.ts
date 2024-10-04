import { appConfig } from "../../config.js";
import { RequisicaoLogin } from "../../types/types";

(() => {
    const nomeUsuario: HTMLInputElement = document.getElementById('nome-usuario') as HTMLInputElement;
    const senha: HTMLInputElement = document.getElementById('senha') as HTMLInputElement;

    const formularioLogin: HTMLFormElement = document.getElementById('formulario-login') as HTMLFormElement;

    formularioLogin.addEventListener('submit', (e) => {
        e.preventDefault();

        console.log("Tentando fazer login...");
        const requisicao: RequisicaoLogin = {
            nomeUsuario: nomeUsuario.value,
            senha: senha.value
        };

        fetch(`${appConfig.baseApiUrl}/api/v1/login`, {
            method: 'POST',
            body: JSON.stringify(requisicao),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(resposta => {
                if (resposta.ok) {
                    console.log("Login realizado com sucesso!");
                    window.location.href = '/';
                }
            })
            .catch(erro => console.error(erro));
    });
})();