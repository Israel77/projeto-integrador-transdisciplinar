import { renderizarErro } from "/components/Erro.js";
import { criarNovoUsuario } from "/services/criarNovoUsuario.js";
import { MensagemErro } from "/types/types";

(() => {
    const containerFormulario: HTMLDivElement = document.getElementById('sign-up') as HTMLDivElement;
    const nomeUsuarioInput: HTMLInputElement = document.getElementById('nome-usuario') as HTMLInputElement;
    const emailUsuarioInput: HTMLInputElement = document.getElementById('email') as HTMLInputElement;
    const senhaInput: HTMLInputElement = document.getElementById('senha') as HTMLInputElement;
    const confirmarSenhaInput: HTMLInputElement = document.getElementById('confirmar-senha') as HTMLInputElement;
    const formularioConta: HTMLFormElement = document.getElementById('formulario-criar-conta') as HTMLFormElement;


    nomeUsuarioInput.addEventListener("input", reavaliarValidacoes);
    emailUsuarioInput.addEventListener("input", reavaliarValidacoes);
    senhaInput.addEventListener("input", reavaliarValidacoes);
    confirmarSenhaInput.addEventListener("input", reavaliarValidacoes);

    formularioConta.addEventListener('submit', (ev: Event) => {
        ev.preventDefault();

        criarNovoUsuario(nomeUsuarioInput.value, emailUsuarioInput.value, senhaInput.value).then(resposta => {
            if (resposta.ok) {
                window.location.href = '/criar-quadro';
            } else {
                resposta.json().then((err: MensagemErro) => {
                    renderizarErro(containerFormulario, err);
                });
            }
        });
    });
})()

function reavaliarValidacoes(): boolean {
    const nomeUsuarioInput: HTMLInputElement = document.getElementById('nome-usuario') as HTMLInputElement;
    const emailUsuarioInput: HTMLInputElement = document.getElementById('email') as HTMLInputElement;
    const senhaInput: HTMLInputElement = document.getElementById('senha') as HTMLInputElement;
    const confirmarSenhaInput: HTMLInputElement = document.getElementById('confirmar-senha') as HTMLInputElement;
    const botaoCriarConta: HTMLButtonElement = document.getElementById('botao-criar-conta') as HTMLButtonElement;

    const pMensagemNomeUsuario = document.getElementById('msg-nome-usuario') as HTMLParagraphElement;
    const pMensagemEmail = document.getElementById('msg-email') as HTMLParagraphElement;
    const pMensagemSenha: HTMLParagraphElement = document.getElementById('msg-senha') as HTMLParagraphElement;
    const pMensagemVerificadorSenha: HTMLParagraphElement = document.getElementById('msg-verificador-senha') as HTMLParagraphElement;

    const usuarioValido = validarUsuario(nomeUsuarioInput.value);
    const emailValido = validarEmail(emailUsuarioInput.value);
    const senhasIguais = validarSenhasIguais(senhaInput.value, confirmarSenhaInput.value);
    const senhaValida = validarSenha(senhaInput.value);

    console.log(`Usuário válido: ${usuarioValido}`);

    // Nome de usuário
    if (!usuarioValido) {
        pMensagemNomeUsuario.innerText = "Nome de usuário muito curto."
        pMensagemNomeUsuario.classList.remove("hidden")
    } else {
        pMensagemNomeUsuario.classList.add("hidden")
    }

    // Email
    if (!emailValido) {
        pMensagemEmail.innerText = "Email inválido."
        pMensagemEmail.classList.remove("hidden")
    } else {
        pMensagemEmail.classList.add("hidden")
    }

    // Senha
    if (!senhaValida) {
        pMensagemSenha.innerText = "Senha muito curta."
        pMensagemSenha.classList.remove("hidden")
    } else {
        pMensagemSenha.classList.add("hidden")
    }

    if (!senhasIguais) {
        pMensagemVerificadorSenha.innerText = "As senhas não coincidem."
        pMensagemVerificadorSenha.classList.remove("hidden")
    } else {
        pMensagemVerificadorSenha.classList.add("hidden")
    }

    const resultado = usuarioValido && emailValido && senhaValida && senhasIguais;

    botaoCriarConta.disabled = !resultado;
    return resultado;
}

function validarUsuario(nomeUsuario: string): boolean {
    return nomeUsuario.length > 0;
}

function validarEmail(email: string): boolean {
    return (email.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/) ?? [])
        .length > 0;
}

function validarSenha(senha: string): boolean {
    return senha.length >= 8;
}

function validarSenhasIguais(senha: string, confirmacaoSenha: string): boolean {
    return senha === confirmacaoSenha;
}