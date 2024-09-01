import { criarQuadro } from "./components/QuadroKanban.js";


(async () => {
    let resposta = (await fetch("http://localhost:8080/api/v1/quadro/1"));

    if (resposta.ok) {
        const corpoResposta = await resposta.json() as Quadro;
        criarQuadro(corpoResposta);
    } else {
        const corpoResposta = await resposta.json() as MensagemErro;
        console.error(corpoResposta.message);
    }
})()





