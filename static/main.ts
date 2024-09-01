import { verificarLogin } from "./services/verificarLogin.js"

(async () => {
    if ((await verificarLogin()).hasOwnProperty("id")) {
        window.location.href = "/main"
    } else {
        window.location.href = "/login"
    }
})()





