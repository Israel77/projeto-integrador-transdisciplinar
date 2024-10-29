(() => {
    const nomeUsuario: HTMLInputElement = document.getElementById('nome-usuario') as HTMLInputElement;
    const senha: HTMLInputElement = document.getElementById('senha') as HTMLInputElement;

    const formularioConta: HTMLFormElement = document.getElementById('formulario-criar-conta') as HTMLFormElement;

    formularioConta.addEventListener('submit', (ev: Event) => {
        ev.preventDefault();
        window.location.href = '/criar-quadro';
    });
})()