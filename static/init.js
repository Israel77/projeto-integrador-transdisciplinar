/**
 * Primeiro arquivo a ser executado.
 * Inicializa as configurações do servidor.
 */
const path = require("path");
const fs = require("fs");

if (process.env.BACKEND_URL) {
    const configPath = path.join(__dirname, "config.js");
    const configContent = fs.readFileSync(configPath, 'utf-8');
    const updatedConfigContent = configContent.replace(/baseApiUrl: ".*?"/g, `baseApiUrl: "${process.env.BACKEND_URL}"`);
    console.log("Escrevendo no arquivo de configuração:\n", updatedConfigContent);
    fs.writeFileSync(configPath, updatedConfigContent);
}