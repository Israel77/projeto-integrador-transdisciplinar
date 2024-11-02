import { criarNovoUsuario } from "../../services/criarNovoUsuario.js";

(() => {
    const nomeUsuarioInput: HTMLInputElement = document.getElementById('nome-usuario') as HTMLInputElement;
    const emailUsuarioInput: HTMLInputElement = document.getElementById('email') as HTMLInputElement;
    const senhaInput: HTMLInputElement = document.getElementById('senha') as HTMLInputElement;
    const confirmarSenhaInput: HTMLInputElement = document.getElementById('confirmar-senha') as HTMLInputElement;
    const pIndicadorSenha: HTMLParagraphElement = document.getElementById('indicador-senhas-diferentes') as HTMLParagraphElement;

    const formularioConta: HTMLFormElement = document.getElementById('formulario-criar-conta') as HTMLFormElement;

    let senhaValida = false;
    const usuarioValido = nomeUsuarioInput.value.length >= 3;
    const emailValido = (emailUsuarioInput.value.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/) ?? [])
        .length > 0;

    confirmarSenhaInput.addEventListener("input", () => {
        if (confirmarSenhaInput.value !== senhaInput.value) {
            pIndicadorSenha.style.color = 'red';
            pIndicadorSenha.classList.remove("hidden")
            senhaValida = false;
        } else {
            pIndicadorSenha.classList.add("hidden")
            senhaValida = true;
        }
    });

    formularioConta.addEventListener('submit', (ev: Event) => {
        ev.preventDefault();

        if (!senhaValida || !usuarioValido || !emailValido) {
            return;
        }

        criarNovoUsuario(nomeUsuarioInput.value, emailUsuarioInput.value, senhaInput.value).then(resposta => {
            if (resposta.ok) {
                window.location.href = '/criar-quadro';
            }
        });
    });
})()