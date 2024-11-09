/**
 * Primeiro arquivo a ser executado.
 * Inicializa as configurações do servidor.
 */
const path = require("path");
const fs = require("fs");

const backendUrl = process.env.BACKEND_URL;
const urlPrefix = process.env.URL_PREFIX;
const importPrefix = process.env.IMPORT_PREFIX;

if (backendUrl) {
    console.log(`Atualizando o arquivo de configuração com a URL do backend ${backendUrl}`);
    const configPath = path.join(__dirname, "config.js");
    const configContent = fs.readFileSync(configPath, 'utf-8');
    const updatedConfigContent = configContent.replace(/baseApiUrl: ".*?"/g, `baseApiUrl: "${backendUrl}"`);
    // console.log("Escrevendo no arquivo de configuração:\n", updatedConfigContent);
    fs.writeFileSync(configPath, updatedConfigContent);
}

(function atualizarArquivos() {
    for (const arquivo of encontrarArquivosHTML(__dirname)) {
        atualizarArquivoHTML(arquivo);
    }
    for (const arquivo of encontrarArquivosJS(__dirname)) {
        atualizarArquivoJS(arquivo);
    }
})()


/**
 * Encontra todos os arquivos HTML em um diretório e seus subdiretórios.
 * 
 * @param {string} diretorio - O diretório a ser pesquisado.
 * @returns {string[]} - Uma lista de caminhos absolutos para os arquivos HTML encontrados.
 */
function encontrarArquivosHTML(diretorio) {
    const arquivosHTML = [];
    const arquivos = fs.readdirSync(diretorio);

    for (const arquivo of arquivos) {
        const filePath = path.join(diretorio, arquivo);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
            arquivosHTML.push(...encontrarArquivosHTML(filePath));
        } else if (arquivo.endsWith('.html')) {
            arquivosHTML.push(filePath);
        }
    }

    return arquivosHTML;
}

function atualizarArquivoHTML(arquivo) {
    if (urlPrefix) {
        const conteudo = fs.readFileSync(arquivo, 'utf-8');
        const conteudoAtualizado = conteudo
            .replace(/href="\/(.*)"/g, `href="${urlPrefix}/$1"`)
            .replace(/src="\/(.*\.js)"/g, `src="${urlPrefix}/$1"`);
        // console.log(conteudoAtualizado);
        fs.writeFileSync(arquivo, conteudoAtualizado);
    }
}

function encontrarArquivosJS(diretorio) {
    const arquivosJS = [];
    const arquivos = fs.readdirSync(diretorio);

    for (const arquivo of arquivos) {
        const filePath = path.join(diretorio, arquivo);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory() && !filePath.includes('node_modules')) {
            arquivosJS.push(...encontrarArquivosJS(filePath));
        } else if (arquivo.endsWith('.js') || arquivo.endsWith('.mjs')) {
            arquivosJS.push(filePath);
        }
    }

    return arquivosJS;
}

function atualizarArquivoJS(arquivo) {
    const conteudo = fs.readFileSync(arquivo, 'utf-8');
    let conteudoAtualizado = conteudo;
    if (importPrefix) {
        conteudoAtualizado = conteudoAtualizado
            .replace(/import (.*) from "\/(.*)"/g, `import $1 from "/${importPrefix}/$2"`);
    }
    if (urlPrefix) {
        conteudoAtualizado = conteudoAtualizado
            .replace(/window.location.href += [\'|\"]+\/*(.*)[\'|\"]/g, `window.location.href="${urlPrefix}/$1"`);
    }
    // console.log(conteudoAtualizado);
    fs.writeFileSync(arquivo, conteudoAtualizado);
}