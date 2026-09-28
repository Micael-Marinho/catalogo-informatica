const fs = require('fs');
const path = require('path');

// Representa um registro de erro da aplicação.
class RegistroErro {
    constructor(contexto, erro) {
        this.data = new Date().toISOString();
        this.contexto = contexto;
        this.tipo = erro.name;
        this.mensagem = erro.message;
    }

    // Transforma os atributos do objeto em uma linha de texto.
    formatar() {
        return `[${this.data}] ${this.contexto} | ${this.tipo}: ${this.mensagem}\n`;
    }
}

// Mantém a função utilizada pelas rotas do app.js.
function registrarErro(contexto, erro) {
    const registro = new RegistroErro(contexto, erro);

    const arquivo = path.join(__dirname, 'logs', 'errors.log');

    fs.appendFile(arquivo, registro.formatar(), 'utf8', (erroArquivo) => {
        if (erroArquivo) {
            console.log(
                'Não foi possível gravar o log:',
                erroArquivo.message
            );
        }
    });
}

module.exports = registrarErro;