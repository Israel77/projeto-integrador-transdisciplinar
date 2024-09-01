import { criarQuadro } from "./components/QuadroKanban.js";
(async () => {
    let resposta = (await fetch("/api/v1/quadro/1"));
    if (resposta.ok) {
        const corpoResposta = await resposta.json();
        criarQuadro(corpoResposta);
    }
    else {
        const corpoResposta = await resposta.json();
        console.error(corpoResposta.message);
    }
})();
