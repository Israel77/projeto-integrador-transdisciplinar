import { criarQuadro } from "./components/QuadroKanban";
(async () => {
    let login = await fetch("http://localhost:8080/api/v1/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "nome_usuario": "test",
            "senha": "test"
        })
    });
    let resposta = (await fetch("http://localhost:8080/api/v1/quadro/1"));
    let corpoResposta = await resposta.json();
    criarQuadro(corpoResposta);
})();
