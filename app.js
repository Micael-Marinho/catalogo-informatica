const express = require('express');
const path = require('path');
const db = require('./config/db_sequelize');
const { Op } = require('sequelize');

const mongoose = require('mongoose');
const db_mongoose = require('./config/db_mongoose');
const Avaliacao = require('./models/avaliacao');

const registrarErro = require('./registrarErro');

const app = express();

// Permite receber os dados dos formulários.
app.use(express.urlencoded({ extended: true }));

// Página inicial.
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'paginas', 'index.html'));
});

// Mostra o formulário de categorias.
app.get('/categorias/cadastro', (req, res) => {
    res.sendFile(path.join(__dirname, 'paginas', 'categorias.html'));
});

// Recebe o formulário e salva a categoria.
app.post('/categorias/cadastrar', async (req, res) => {
    try {
        const nome = req.body.nome;

        // Confere se o nome foi enviado como texto.
        if (typeof nome !== 'string') {
            return res.status(400).send('Informe o nome da categoria.');
        }

        // Remove espaços do início e do final.
        const nomeTratado = nome.trim();

        if (nomeTratado === '') {
            return res.status(400).send(
                'O nome da categoria não pode ficar vazio.'
            );
        }

        if (nomeTratado.length > 255) {
            return res.status(400).send(
                'O nome deve ter no máximo 255 caracteres.'
            );
        }

        // Aguarda a gravação no PostgreSQL.
        await db.Categoria.create({
            nome: nomeTratado
        });

        res.send(`
            <h1>Categoria cadastrada com sucesso!</h1>
            <p><a href="/categorias/cadastro">Cadastrar outra categoria</a></p>
            <p><a href="/categorias">Consultar categorias</a></p>
            <p><a href="/">Voltar ao início</a></p>
        `);
    } catch (erro) {
        registrarErro(`${req.method} ${req.path}`, erro);

        console.log('Erro ao cadastrar categoria:', erro.message);

        res.status(500).send(
            'Não foi possível cadastrar a categoria.'
        );
    }
});

// Consulta as categorias no PostgreSQL.
app.get('/categorias', async (req, res) => {
    try {
        const categorias = await db.Categoria.findAll();

        res.send(categorias);
    } catch (erro) {
        registrarErro(`${req.method} ${req.path}`, erro);

        console.log('Erro ao consultar categorias:', erro.message);

        res.status(500).send(
            'Não foi possível consultar as categorias.'
        );
    }
});

// Altera o nome de uma categoria.
app.post('/categorias/alterar', async (req, res) => {
    try {
        const id = Number(req.body.id);
        const nome = req.body.nome;

        // Confere se o identificador é um inteiro positivo.
        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).send(
                'Informe um ID inteiro maior que zero.'
            );
        }

        // Confere se o nome foi enviado como texto.
        if (typeof nome !== 'string') {
            return res.status(400).send(
                'Informe o novo nome da categoria.'
            );
        }

        const nomeTratado = nome.trim();

        if (nomeTratado === '' || nomeTratado.length > 255) {
            return res.status(400).send(
                'O nome deve ter entre 1 e 255 caracteres.'
            );
        }

        // Localiza a categoria pela chave primária.
        const categoria = await db.Categoria.findByPk(id);

        if (!categoria) {
            return res.status(404).send(
                'Categoria não encontrada.'
            );
        }

        // Altera o atributo do objeto.
        categoria.nome = nomeTratado;

        // Salva a alteração no PostgreSQL.
        await categoria.save();

        res.send(`
            <h1>Categoria alterada com sucesso!</h1>
            <p><a href="/categorias">Consultar categorias</a></p>
            <p><a href="/categorias/cadastro">Voltar aos formulários</a></p>
        `);
    } catch (erro) {
        registrarErro(`${req.method} ${req.path}`, erro);

        console.log('Erro ao alterar categoria:', erro.message);

        res.status(500).send(
            'Não foi possível alterar a categoria.'
        );
    }
});

// Exclui uma categoria.
app.post('/categorias/excluir', async (req, res) => {
    try {
        const id = Number(req.body.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).send(
                'Informe um ID inteiro maior que zero.'
            );
        }

        const categoria = await db.Categoria.findByPk(id);

        if (!categoria) {
            return res.status(404).send(
                'Categoria não encontrada.'
            );
        }

        // Remove o registro do PostgreSQL.
        await categoria.destroy();

        res.send(`
            <h1>Categoria excluída com sucesso!</h1>
            <p><a href="/categorias">Consultar categorias</a></p>
            <p><a href="/categorias/cadastro">Voltar aos formulários</a></p>
        `);
    } catch (erro) {
        registrarErro(`${req.method} ${req.path}`, erro);

        console.log('Erro ao excluir categoria:', erro.message);

        res.status(500).send(
            'Não foi possível excluir a categoria.'
        );
    }
});

// Mostra os formulários de vendedores.
app.get('/vendedores/cadastro', (req, res) => {
    res.sendFile(path.join(__dirname, 'paginas', 'vendedores.html'));
});

// Cadastra um vendedor.
app.post('/vendedores/cadastrar', async (req, res) => {
    try {
        const nome = req.body.nome;

        if (typeof nome !== 'string') {
            return res.status(400).send(
                'Informe o nome do vendedor.'
            );
        }

        const nomeTratado = nome.trim();

        if (nomeTratado === '' || nomeTratado.length > 255) {
            return res.status(400).send(
                'O nome deve ter entre 1 e 255 caracteres.'
            );
        }

        await db.Vendedor.create({
            nome: nomeTratado
        });

        res.send(`
            <h1>Vendedor cadastrado com sucesso!</h1>
            <p><a href="/vendedores">Consultar vendedores</a></p>
            <p><a href="/vendedores/cadastro">Voltar aos formulários</a></p>
        `);
    } catch (erro) {
        registrarErro(`${req.method} ${req.path}`, erro);

        console.log('Erro ao cadastrar vendedor:', erro.message);

        res.status(500).send(
            'Não foi possível cadastrar o vendedor.'
        );
    }
});

// Consulta todos os vendedores.
app.get('/vendedores', async (req, res) => {
    try {
        const vendedores = await db.Vendedor.findAll();

        res.send(vendedores);
    } catch (erro) {
        registrarErro(`${req.method} ${req.path}`, erro);

        console.log('Erro ao consultar vendedores:', erro.message);

        res.status(500).send(
            'Não foi possível consultar os vendedores.'
        );
    }
});

// Altera o nome de um vendedor.
app.post('/vendedores/alterar', async (req, res) => {
    try {
        const id = Number(req.body.id);
        const nome = req.body.nome;

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).send(
                'Informe um ID inteiro maior que zero.'
            );
        }

        if (typeof nome !== 'string') {
            return res.status(400).send(
                'Informe o novo nome do vendedor.'
            );
        }

        const nomeTratado = nome.trim();

        if (nomeTratado === '' || nomeTratado.length > 255) {
            return res.status(400).send(
                'O nome deve ter entre 1 e 255 caracteres.'
            );
        }

        const vendedor = await db.Vendedor.findByPk(id);

        if (!vendedor) {
            return res.status(404).send(
                'Vendedor não encontrado.'
            );
        }

        vendedor.nome = nomeTratado;
        await vendedor.save();

        res.send(`
            <h1>Vendedor alterado com sucesso!</h1>
            <p><a href="/vendedores">Consultar vendedores</a></p>
            <p><a href="/vendedores/cadastro">Voltar aos formulários</a></p>
        `);
    } catch (erro) {
        registrarErro(`${req.method} ${req.path}`, erro);

        console.log('Erro ao alterar vendedor:', erro.message);

        res.status(500).send(
            'Não foi possível alterar o vendedor.'
        );
    }
});

// Exclui um vendedor.
app.post('/vendedores/excluir', async (req, res) => {
    try {
        const id = Number(req.body.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).send(
                'Informe um ID inteiro maior que zero.'
            );
        }

        const vendedor = await db.Vendedor.findByPk(id);

        if (!vendedor) {
            return res.status(404).send(
                'Vendedor não encontrado.'
            );
        }

        await vendedor.destroy();

        res.send(`
            <h1>Vendedor excluído com sucesso!</h1>
            <p><a href="/vendedores">Consultar vendedores</a></p>
            <p><a href="/vendedores/cadastro">Voltar aos formulários</a></p>
        `);
    } catch (erro) {
        registrarErro(`${req.method} ${req.path}`, erro);

        console.log('Erro ao excluir vendedor:', erro.message);

        res.status(500).send(
            'Não foi possível excluir o vendedor.'
        );
    }
});

// Mostra o formulário de produtos.
app.get('/produtos/cadastro', (req, res) => {
    res.sendFile(path.join(__dirname, 'paginas', 'produtos.html'));
});

// Cadastra um produto.
app.post('/produtos/cadastrar', async (req, res) => {
    try {
        const nome = req.body.nome;
        const descricao = req.body.descricao;
        const preco = Number(req.body.preco);
        const categoriaId = Number(req.body.categoriaId);
        const vendedorId = Number(req.body.vendedorId);

        // Valida o nome.
        if (typeof nome !== 'string') {
            return res.status(400).send(
                'Informe o nome do produto.'
            );
        }

        const nomeTratado = nome.trim();

        if (nomeTratado === '' || nomeTratado.length > 255) {
            return res.status(400).send(
                'O nome deve ter entre 1 e 255 caracteres.'
            );
        }

        // A descrição é opcional, mas deve ser texto se enviada.
        if (
            descricao !== undefined &&
            typeof descricao !== 'string'
        ) {
            return res.status(400).send(
                'A descrição deve ser um texto.'
            );
        }

        // Valida o preço.
        if (!Number.isFinite(preco) || preco <= 0) {
            return res.status(400).send(
                'Informe um preço numérico maior que zero.'
            );
        }

        // Valida os identificadores.
        if (!Number.isInteger(categoriaId) || categoriaId <= 0) {
            return res.status(400).send(
                'Informe um ID de categoria inteiro maior que zero.'
            );
        }

        if (!Number.isInteger(vendedorId) || vendedorId <= 0) {
            return res.status(400).send(
                'Informe um ID de vendedor inteiro maior que zero.'
            );
        }

        // Confere se a categoria existe.
        const categoria = await db.Categoria.findByPk(categoriaId);

        if (!categoria) {
            return res.status(400).send(
                'A categoria informada não existe.'
            );
        }

        // Confere se o vendedor existe.
        const vendedor = await db.Vendedor.findByPk(vendedorId);

        if (!vendedor) {
            return res.status(400).send(
                'O vendedor informado não existe.'
            );
        }

        // Salva o produto com os dois vínculos.
        await db.Produto.create({
            nome: nomeTratado,
            descricao: descricao,
            preco: preco,
            categoriaId: categoriaId,
            vendedorId: vendedorId
        });

        res.send(`
            <h1>Produto cadastrado com sucesso!</h1>
            <p><a href="/produtos">Consultar produtos</a></p>
            <p><a href="/produtos/cadastro">Cadastrar outro produto</a></p>
            <p><a href="/">Voltar ao início</a></p>
        `);
    } catch (erro) {
        registrarErro(`${req.method} ${req.path}`, erro);

        console.log('Erro ao cadastrar produto:', erro.message);

        res.status(500).send(
            'Não foi possível cadastrar o produto.'
        );
    }
});

// Consulta produtos com filtros e ordenação.
app.get('/produtos', async (req, res) => {
    try {
        // Começa sem filtros.
        const filtros = {};

        // Filtro opcional por categoria.
        if (
            req.query.categoriaId !== undefined &&
            req.query.categoriaId !== ''
        ) {
            const categoriaId = Number(req.query.categoriaId);

            if (
                !Number.isInteger(categoriaId) ||
                categoriaId <= 0
            ) {
                return res.status(400).send(
                    'Informe um ID de categoria inteiro maior que zero.'
                );
            }

            filtros.categoriaId = categoriaId;
        }

        // Filtro opcional por preço.
        if (
            req.query.precoMinimo !== undefined &&
            req.query.precoMinimo !== ''
        ) {
            const precoMinimo = Number(req.query.precoMinimo);

            if (
                !Number.isFinite(precoMinimo) ||
                precoMinimo < 0
            ) {
                return res.status(400).send(
                    'Informe um preço de referência válido, maior ou igual a zero.'
                );
            }

            filtros.preco = {
                [Op.gt]: precoMinimo
            };
        }

        const produtos = await db.Produto.findAll({
            where: filtros,
            order: [['nome', 'ASC']]
        });

        res.send(produtos);
    } catch (erro) {
        registrarErro(`${req.method} ${req.path}`, erro);

        console.log('Erro ao consultar produtos:', erro.message);

        res.status(500).send(
            'Não foi possível consultar os produtos.'
        );
    }
});

// Consulta um produto pelo identificador.
app.get('/produtos/buscar', async (req, res) => {
    try {
        const id = Number(req.query.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).send(
                'Informe um ID de produto inteiro maior que zero.'
            );
        }

        const produto = await db.Produto.findByPk(id);

        if (!produto) {
            return res.status(404).send(
                'Produto não encontrado.'
            );
        }

        res.send(produto);
    } catch (erro) {
        registrarErro(`${req.method} ${req.path}`, erro);

        console.log('Erro ao buscar produto:', erro.message);

        res.status(500).send(
            'Não foi possível buscar o produto.'
        );
    }
});

// Altera os dados de um produto.
app.post('/produtos/alterar', async (req, res) => {
    try {
        const id = Number(req.body.id);
        const nome = req.body.nome;
        const descricao = req.body.descricao;
        const preco = Number(req.body.preco);
        const categoriaId = Number(req.body.categoriaId);
        const vendedorId = Number(req.body.vendedorId);

        // Valida o identificador do produto.
        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).send(
                'Informe um ID de produto inteiro maior que zero.'
            );
        }

        // Valida o nome.
        if (typeof nome !== 'string') {
            return res.status(400).send(
                'Informe o nome do produto.'
            );
        }

        const nomeTratado = nome.trim();

        if (nomeTratado === '' || nomeTratado.length > 255) {
            return res.status(400).send(
                'O nome deve ter entre 1 e 255 caracteres.'
            );
        }

        // Valida a descrição, caso tenha sido enviada.
        if (
            descricao !== undefined &&
            typeof descricao !== 'string'
        ) {
            return res.status(400).send(
                'A descrição deve ser um texto.'
            );
        }

        // Valida o preço.
        if (!Number.isFinite(preco) || preco <= 0) {
            return res.status(400).send(
                'Informe um preço numérico maior que zero.'
            );
        }

        // Valida os identificadores dos relacionamentos.
        if (!Number.isInteger(categoriaId) || categoriaId <= 0) {
            return res.status(400).send(
                'Informe um ID de categoria inteiro maior que zero.'
            );
        }

        if (!Number.isInteger(vendedorId) || vendedorId <= 0) {
            return res.status(400).send(
                'Informe um ID de vendedor inteiro maior que zero.'
            );
        }

        // Confere se o produto existe.
        const produto = await db.Produto.findByPk(id);

        if (!produto) {
            return res.status(404).send(
                'Produto não encontrado.'
            );
        }

        // Confere se a categoria existe.
        const categoria = await db.Categoria.findByPk(categoriaId);

        if (!categoria) {
            return res.status(400).send(
                'A categoria informada não existe.'
            );
        }

        // Confere se o vendedor existe.
        const vendedor = await db.Vendedor.findByPk(vendedorId);

        if (!vendedor) {
            return res.status(400).send(
                'O vendedor informado não existe.'
            );
        }

        // Atualiza os atributos do objeto.
        produto.nome = nomeTratado;
        produto.descricao = descricao;
        produto.preco = preco;
        produto.categoriaId = categoriaId;
        produto.vendedorId = vendedorId;

        // Grava as alterações no PostgreSQL.
        await produto.save();

        res.send(`
            <h1>Produto alterado com sucesso!</h1>
            <p><a href="/produtos">Consultar produtos</a></p>
            <p><a href="/produtos/cadastro">Voltar aos formulários</a></p>
        `);
    } catch (erro) {
        registrarErro(`${req.method} ${req.path}`, erro);

        console.log('Erro ao alterar produto:', erro.message);

        res.status(500).send(
            'Não foi possível alterar o produto.'
        );
    }
});

// Exclui um produto.
app.post('/produtos/excluir', async (req, res) => {
    try {
        const id = Number(req.body.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).send(
                'Informe um ID de produto inteiro maior que zero.'
            );
        }

        const produto = await db.Produto.findByPk(id);

        if (!produto) {
            return res.status(404).send(
                'Produto não encontrado.'
            );
        }

        // Verifica se existem avaliações no MongoDB.
        const avaliacoes = await Avaliacao.find({
            produtoId: id
        });

        if (avaliacoes.length > 0) {
            return res.status(400).send(
                'Este produto possui avaliações. Exclua as avaliações antes de remover o produto.'
            );
        }

        await produto.destroy();

        res.send(`
            <h1>Produto excluído com sucesso!</h1>
            <p><a href="/produtos">Consultar produtos</a></p>
            <p><a href="/produtos/cadastro">Voltar aos formulários</a></p>
        `);
    } catch (erro) {
        registrarErro(`${req.method} ${req.path}`, erro);

        console.log('Erro ao excluir produto:', erro.message);

        res.status(500).send(
            'Não foi possível excluir o produto.'
        );
    }
});

// Mostra o formulário de avaliações.
app.get('/avaliacoes/cadastro', (req, res) => {
    res.sendFile(path.join(__dirname, 'paginas', 'avaliacoes.html'));
});

// Cadastra uma avaliação no MongoDB.
app.post('/avaliacoes/cadastrar', async (req, res) => {
    try {
        const produtoId = Number(req.body.produtoId);
        const usuario = req.body.usuario;
        const nota = Number(req.body.nota);
        const comentario = req.body.comentario;

        // Valida o identificador do produto.
        if (!Number.isInteger(produtoId) || produtoId <= 0) {
            return res.status(400).send(
                'Informe um ID de produto inteiro maior que zero.'
            );
        }

        // Valida o nome de quem está avaliando.
        if (typeof usuario !== 'string' || usuario.trim() === '') {
            return res.status(400).send(
                'Informe seu nome.'
            );
        }

        // Aceita somente notas inteiras de 1 a 5.
        if (!Number.isInteger(nota) || nota < 1 || nota > 5) {
            return res.status(400).send(
                'A nota deve ser um número inteiro entre 1 e 5.'
            );
        }

        // Valida o comentário.
        if (
            typeof comentario !== 'string' ||
            comentario.trim() === ''
        ) {
            return res.status(400).send(
                'Informe um comentário.'
            );
        }

        // Consulta o produto no PostgreSQL.
        const produto = await db.Produto.findByPk(produtoId);

        if (!produto) {
            return res.status(400).send(
                'O produto informado não existe.'
            );
        }

        // Cria um objeto de avaliação.
        const avaliacao = new Avaliacao({
            produtoId: produtoId,
            usuario: usuario.trim(),
            nota: nota,
            comentario: comentario.trim()
        });

        // Salva o documento no MongoDB.
        await avaliacao.save();

        res.send(`
            <h1>Avaliação cadastrada com sucesso!</h1>
            <p><a href="/avaliacoes">Consultar avaliações</a></p>
            <p><a href="/avaliacoes/cadastro">Voltar aos formulários</a></p>
            <p><a href="/">Voltar ao início</a></p>
        `);
    } catch (erro) {
        registrarErro(`${req.method} ${req.path}`, erro);

        console.log('Erro ao cadastrar avaliação:', erro.message);

        res.status(500).send(
            'Não foi possível cadastrar a avaliação.'
        );
    }
});

// Consulta todas as avaliações ou filtra por produto.
app.get('/avaliacoes', async (req, res) => {
    try {
        const filtro = {};

        if (
            req.query.produtoId !== undefined &&
            req.query.produtoId !== ''
        ) {
            const produtoId = Number(req.query.produtoId);

            if (!Number.isInteger(produtoId) || produtoId <= 0) {
                return res.status(400).send(
                    'Informe um ID de produto inteiro maior que zero.'
                );
            }

            filtro.produtoId = produtoId;
        }

        const avaliacoes = await Avaliacao.find(filtro);

        res.send(avaliacoes);
    } catch (erro) {
        registrarErro(`${req.method} ${req.path}`, erro);

        console.log('Erro ao consultar avaliações:', erro.message);

        res.status(500).send(
            'Não foi possível consultar as avaliações.'
        );
    }
});

// Altera uma avaliação do MongoDB.
app.post('/avaliacoes/alterar', async (req, res) => {
    try {
        const id = req.body.id;
        const usuario = req.body.usuario;
        const nota = Number(req.body.nota);
        const comentario = req.body.comentario;

        // Confere se o identificador foi preenchido.
        if (typeof id !== 'string' || id.trim() === '') {
            return res.status(400).send(
                'Informe o ID da avaliação.'
            );
        }

        // Valida o nome.
        if (typeof usuario !== 'string' || usuario.trim() === '') {
            return res.status(400).send(
                'Informe seu nome.'
            );
        }

        // Valida a nota.
        if (!Number.isInteger(nota) || nota < 1 || nota > 5) {
            return res.status(400).send(
                'A nota deve ser um número inteiro entre 1 e 5.'
            );
        }

        // Valida o comentário.
        if (
            typeof comentario !== 'string' ||
            comentario.trim() === ''
        ) {
            return res.status(400).send(
                'Informe um comentário.'
            );
        }

        // Localiza pelo _id e atualiza os campos informados.
        const avaliacao = await Avaliacao.findOneAndUpdate(
            { _id: id.trim() },
            {
                usuario: usuario.trim(),
                nota: nota,
                comentario: comentario.trim()
            }
        );

        if (!avaliacao) {
            return res.status(404).send(
                'Avaliação não encontrada.'
            );
        }

        res.send(`
            <h1>Avaliação alterada com sucesso!</h1>
            <p><a href="/avaliacoes">Consultar avaliações</a></p>
            <p><a href="/avaliacoes/cadastro">Voltar aos formulários</a></p>
        `);
    } catch (erro) {
        registrarErro(`${req.method} ${req.path}`, erro);

        // O Mongoose informa CastError quando o ID
        // não pode ser convertido para o formato esperado.
        if (erro.name === 'CastError') {
            return res.status(400).send(
                'ID inválido. Copie o campo _id da consulta de avaliações.'
            );
        }

        console.log('Erro ao alterar avaliação:', erro.message);

        res.status(500).send(
            'Não foi possível alterar a avaliação.'
        );
    }
});

// Exclui uma avaliação do MongoDB.
app.post('/avaliacoes/excluir', async (req, res) => {
    try {
        const id = req.body.id;

        if (typeof id !== 'string' || id.trim() === '') {
            return res.status(400).send(
                'Informe o ID da avaliação.'
            );
        }

        // Localiza pelo _id e remove o documento.
        const avaliacao = await Avaliacao.findOneAndDelete({
            _id: id.trim()
        });

        if (!avaliacao) {
            return res.status(404).send(
                'Avaliação não encontrada.'
            );
        }

        res.send(`
            <h1>Avaliação excluída com sucesso!</h1>
            <p><a href="/avaliacoes">Consultar avaliações</a></p>
            <p><a href="/avaliacoes/cadastro">Voltar aos formulários</a></p>
        `);
    } catch (erro) {
        registrarErro(`${req.method} ${req.path}`, erro);

        if (erro.name === 'CastError') {
            return res.status(400).send(
                'ID inválido. Copie o campo _id da consulta de avaliações.'
            );
        }

        console.log('Erro ao excluir avaliação:', erro.message);

        res.status(500).send(
            'Não foi possível excluir a avaliação.'
        );
    }
});

// Cria as tabelas dos models que ainda não existem.
// Não utiliza force: true.
// Primeiro conecta e sincroniza o PostgreSQL.
db.sequelize.sync()
    .then(() => {
        console.log('PostgreSQL conectado e models sincronizados!');

        // Retorna a Promise para aguardar a conexão do MongoDB.
        return mongoose.connect(db_mongoose.connection);
    })
    .then(() => {
        console.log('MongoDB conectado!');

        // Inicia o servidor depois que os dois bancos responderem.
        app.listen(8081, () => {
            console.log('Servidor iniciado!');
            console.log('Acesse: http://localhost:8081');
        });
    })
    .catch((erro) => {
        registrarErro('Inicialização da aplicação', erro);

        console.log('Erro ao iniciar a aplicação:');
        console.log(erro.message);
    });
