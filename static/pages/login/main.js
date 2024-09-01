(() => {
    const nomeUsuario = document.getElementById('nome-usuario');
    const senha = document.getElementById('senha');
    const botaoLogin = document.querySelector('#botao-entrar');
    const formularioLogin = document.getElementById('formulario-login');
    formularioLogin.addEventListener('submit', (e) => {
        e.preventDefault();
        console.log("Tentando fazer login...");
        const requisicao = {
            nomeUsuario: nomeUsuario.value,
            senha: senha.value
        };
        fetch('/api/v1/login', {
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
