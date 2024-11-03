import { renderizarErro } from "../../components/Erro.js";
import { appConfig } from "../../config.js";
import { RequisicaoLogin } from "../../types/types";

(() => {
    const htmlBody: HTMLElement = document.getElementsByTagName('body')[0] as HTMLElement;
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
            credentials: 'include',
            body: JSON.stringify(requisicao),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(resposta => {
                if (resposta.ok) {
                    console.log("Login realizado com sucesso!");
                    window.location.href = '/main';
                } else {
                    resposta.json().then(resposta => {
                        renderizarErro(htmlBody, resposta);
                        console.error(resposta.message);
                    });
                }
            })
            .catch(erro => console.error(erro));
    });
})();