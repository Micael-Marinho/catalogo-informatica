# Catálogo de Produtos de Informática com Avaliações

Projeto 1 da disciplina **Programação Web Back-End**, desenvolvido com Node.js e Express. A aplicação permite gerenciar categorias, vendedores e produtos no PostgreSQL e registrar avaliações dos produtos no MongoDB.

## Integrantes

- João Victor Queiroz de Lima / RA: 2051524
- Micael Marinho Souza  / RA: 2819457
- Wagner Lourenço de Oliveira Junior / RA: 2819473

## Objetivo

Aplicar os conteúdos de desenvolvimento Back-End e persistência de dados em uma única aplicação, utilizando Sequelize com PostgreSQL e Mongoose com MongoDB. O projeto inclui operações CRUD, relacionamentos, consultas, validação de dados, tratamento de exceções, registro de erros em arquivo e uma classe JavaScript.

## Tecnologias utilizadas

| Tecnologia | Uso no projeto |
| --- | --- |
| Node.js | Execução do JavaScript no servidor |
| Express | Rotas HTTP e recebimento de formulários |
| PostgreSQL | Persistência de categorias, vendedores e produtos |
| Sequelize | Models, relacionamentos e operações no PostgreSQL |
| pg | Comunicação do Sequelize com o PostgreSQL |
| MongoDB Community Server | Persistência dos documentos de avaliação |
| Mongoose | Schema, model e operações no MongoDB |
| HTML | Páginas e formulários |
| fs e path | Gravação de logs e construção de caminhos de arquivos |

As dependências do projeto são registradas em `package.json` e `package-lock.json`. Os módulos `fs` e `path` já fazem parte do Node.js.

## Funcionalidades

- Cadastrar, consultar, alterar e excluir categorias.
- Cadastrar, consultar, alterar e excluir vendedores.
- Cadastrar, consultar, alterar e excluir produtos.
- Buscar produtos pelo identificador.
- Filtrar produtos por categoria e por preço superior ao valor informado.
- Combinar os filtros de categoria e preço.
- Ordenar os produtos pelo nome em ordem crescente.
- Cadastrar, consultar, alterar e excluir avaliações.
- Consultar avaliações de um produto específico.
- Verificar se o produto existe antes de salvar uma avaliação.
- Verificar se há avaliações antes de excluir um produto.
- Registrar exceções em `logs/errors.log`.

As consultas retornam dados em JSON. Os formulários de alteração são preenchidos manualmente com os dados completos; não existe preenchimento automático. O nome informado na avaliação é um campo de texto, sem autenticação de usuário.

## Organização dos arquivos

| Caminho | Responsabilidade |
| --- | --- |
| `app.js` | Configuração do Express, rotas, validações e inicialização dos bancos |
| `config/db_sequelize.js` | Conexão com o PostgreSQL, carregamento dos models e relacionamentos |
| `config/db_mongoose.js` | Endereço de conexão com o MongoDB |
| `models/categoria.js` | Model de Categoria |
| `models/vendedor.js` | Model de Vendedor |
| `models/produto.js` | Model de Produto |
| `models/avaliacao.js` | Schema e model de Avaliação |
| `registrarErro.js` | Classe RegistroErro e função de gravação de logs |
| `logs/errors.log` | Histórico de exceções; criado na primeira gravação |
| `index.html` | Página inicial com acesso aos formulários |
| `categorias.html` | Formulários de categorias |
| `vendedores.html` | Formulários de vendedores |
| `produtos.html` | Formulários de produtos e consultas |
| `avaliacoes.html` | Formulários de avaliações |
| `package.json` | Informações e dependências do projeto |
| `package-lock.json` | Registro das versões resolvidas das dependências |
| `README.md` | Documentação do projeto |

## Modelagem do PostgreSQL

Banco utilizado: `catalogo_informatica`.

### Categoria

| Campo | Tipo no Sequelize | Obrigatório | Características |
| --- | --- | --- | --- |
| id | INTEGER | Sim | Chave primária com incremento automático |
| nome | STRING | Sim | Nome da categoria |

### Vendedor

| Campo | Tipo no Sequelize | Obrigatório | Características |
| --- | --- | --- | --- |
| id | INTEGER | Sim | Chave primária com incremento automático |
| nome | STRING | Sim | Nome do vendedor |

### Produto

| Campo | Tipo no Sequelize | Obrigatório | Características |
| --- | --- | --- | --- |
| id | INTEGER | Sim | Chave primária com incremento automático |
| nome | STRING | Sim | Nome do produto |
| descricao | TEXT | Não | Descrição do produto |
| preco | DOUBLE | Sim | Valor numérico maior que zero |
| categoriaId | INTEGER | Sim | Chave estrangeira para Categoria |
| vendedorId | INTEGER | Sim | Chave estrangeira para Vendedor |

O tipo `DOUBLE` segue o exemplo numérico adotado durante o desenvolvimento com base no material da disciplina. Ele utiliza ponto flutuante; o projeto não implementa cálculos financeiros.

Por padrão, o Sequelize também acrescenta `createdAt` e `updatedAt` aos models para registrar criação e atualização.

### Relacionamentos

| Relacionamento | Cardinalidade | Campo de ligação |
| --- | --- | --- |
| Categoria possui Produtos; Produto pertence a Categoria | 1:N | Produto.categoriaId |
| Vendedor possui Produtos; Produto pertence a Vendedor | 1:N | Produto.vendedorId |

Os relacionamentos são definidos com `hasMany()` e `belongsTo()`. A opção `onDelete: 'RESTRICT'` impede excluir categorias e vendedores que ainda possuam produtos associados. Nessa situação, as rotas atuais retornam uma mensagem genérica de falha e registram a exceção no log.

## Modelagem do MongoDB

Banco utilizado: `catalogo_avaliacoes`.

Collection: `avaliacoes`.

Cada documento representa uma avaliação de um produto.

| Campo | Tipo no Mongoose | Obrigatório | Função |
| --- | --- | --- | --- |
| _id | ObjectId | Automático | Identificador da avaliação |
| produtoId | Number | Sim | Identificador do produto no PostgreSQL |
| usuario | String | Sim | Nome de quem avaliou |
| nota | Number | Sim | Nota inteira entre 1 e 5, validada nas rotas |
| comentario | String | Sim | Texto da avaliação |

Exemplo de dados enviados para cadastro:

```json
{
  "produtoId": 1,
  "usuario": "Aluno",
  "nota": 5,
  "comentario": "Produto adequado para estudos."
}
```

O exemplo pressupõe que o produto de ID 1 exista. O MongoDB gera `_id` ao salvar o documento, e o Mongoose pode incluir seu campo interno `__v`.

### Integração e justificativa dos dois bancos

O PostgreSQL armazena os cadastros com estrutura definida e relacionamentos entre categoria, vendedor e produto. As chaves estrangeiras representam esses vínculos.

O MongoDB armazena cada avaliação como um documento com os dados de seu autor, nota, comentário e referência ao produto. A avaliação pode ser consultada e manipulada como uma unidade, sem duplicar o cadastro completo do produto.

Essa divisão aplica os dois modelos de persistência exigidos na disciplina. As avaliações também poderiam ser representadas em um banco relacional; neste projeto, foram escolhidas para demonstrar a persistência orientada a documentos.

O campo `produtoId` não cria uma chave estrangeira entre PostgreSQL e MongoDB. A integração é realizada no código Node.js:

1. Antes de cadastrar uma avaliação, a aplicação busca o produto no PostgreSQL.
2. Se ele existir, a avaliação é salva no MongoDB com seu identificador.
3. Antes de excluir um produto, a aplicação consulta suas avaliações no MongoDB.
4. Se houver avaliações, a exclusão do produto é recusada.

Essas verificações se aplicam às operações feitas pelas rotas. Não existe uma transação conjunta entre os bancos nem proteção contra todas as situações de acesso simultâneo ou alterações diretas nas ferramentas de banco.

## Preparação do ambiente

É necessário ter:

- Node.js e npm instalados.
- PostgreSQL instalado e em execução.
- MongoDB Community Server instalado e em execução.
- pgAdmin e MongoDB Compass para configurar e visualizar os bancos.

O enunciado do projeto não determina versões específicas. Para reproduzir as dependências JavaScript, mantenha o arquivo `package-lock.json` junto do projeto.

### 1. Instalar as dependências

Abra a pasta do projeto no VS Code e execute no terminal:

```bash
npm install
```

Se o PowerShell bloquear `npm.ps1`, utilize:

```powershell
npm.cmd install
```

Não é necessário enviar a pasta `node_modules` junto com o projeto. Ela é criada pela instalação das dependências.

### 2. Preparar o PostgreSQL

No pgAdmin, crie o banco:

```text
catalogo_informatica
```

Em `config/db_sequelize.js`, configure os dados da conexão existente:

| Informação | Valor do ambiente local |
| --- | --- |
| Banco | catalogo_informatica |
| Usuário | postgres, ou o usuário configurado no ambiente |
| Senha | Senha local desse usuário |
| Host | localhost |
| Porta | 5432 |
| Dialeto | postgres |

Não substitua todo o arquivo de configuração: ele também contém os models e relacionamentos. Antes de compartilhar o código, substitua senhas reais por um marcador e oriente quem for executar a informar a própria senha.

As tabelas dos models são criadas por `db.sequelize.sync()` quando ainda não existem. Não se utiliza `force: true`, evitando recriar e apagar as tabelas a cada execução. O `sync()` utilizado não é uma rotina de migração de estruturas existentes.

### 3. Preparar o MongoDB

No Compass, conecte usando:

```text
mongodb://127.0.0.1:27017
```

Crie o banco `catalogo_avaliacoes` e a collection `avaliacoes`.

O arquivo `config/db_mongoose.js` deve conter:

```javascript
const db_mongoose = {
    connection: 'mongodb://127.0.0.1:27017/catalogo_avaliacoes'
};

module.exports = db_mongoose;
```

Essa configuração utiliza o servidor local preparado para o projeto.

### 4. Preparar o diretório de logs

Crie a pasta `logs` na raiz do projeto, ao lado de `app.js` e `registrarErro.js`, caso ela ainda não exista. O arquivo `errors.log` será criado no primeiro registro de erro.

### 5. Executar a aplicação

No terminal, dentro da pasta do projeto:

```bash
node app.js
```

A aplicação primeiro sincroniza os models do PostgreSQL, depois conecta ao MongoDB e, por fim, inicia o servidor Express na porta 8081.

Abra no navegador:

```text
http://localhost:8081
```

Para encerrar, pressione `Ctrl + C` no terminal que está executando o servidor. Após alterar arquivos JavaScript, salve e reinicie a aplicação. Mantenha apenas uma execução utilizando a porta 8081.

## Rotas

### Páginas HTML

| Método | Rota | Função |
| --- | --- | --- |
| GET | / | Página inicial |
| GET | /categorias/cadastro | Formulários de categorias |
| GET | /vendedores/cadastro | Formulários de vendedores |
| GET | /produtos/cadastro | Formulários de produtos |
| GET | /avaliacoes/cadastro | Formulários de avaliações |

### Categorias

| Método | Rota | Dados recebidos | Função |
| --- | --- | --- | --- |
| GET | /categorias | Nenhum | Listar categorias |
| POST | /categorias/cadastrar | nome | Cadastrar |
| POST | /categorias/alterar | id, nome | Alterar |
| POST | /categorias/excluir | id | Excluir |

### Vendedores

| Método | Rota | Dados recebidos | Função |
| --- | --- | --- | --- |
| GET | /vendedores | Nenhum | Listar vendedores |
| POST | /vendedores/cadastrar | nome | Cadastrar |
| POST | /vendedores/alterar | id, nome | Alterar |
| POST | /vendedores/excluir | id | Excluir |

### Produtos

| Método | Rota | Dados recebidos | Função |
| --- | --- | --- | --- |
| GET | /produtos | categoriaId e precoMinimo opcionais | Listar, filtrar e ordenar pelo nome |
| GET | /produtos/buscar | id | Buscar pela chave primária |
| POST | /produtos/cadastrar | nome, descricao, preco, categoriaId, vendedorId | Cadastrar |
| POST | /produtos/alterar | id, nome, descricao, preco, categoriaId, vendedorId | Alterar |
| POST | /produtos/excluir | id | Excluir quando não houver avaliações |

A descrição é opcional. Os demais dados de cadastro e alteração são obrigatórios.

Exemplos de consultas:

```text
http://localhost:8081/produtos
http://localhost:8081/produtos/buscar?id=1
http://localhost:8081/produtos?categoriaId=1
http://localhost:8081/produtos?precoMinimo=500
http://localhost:8081/produtos?categoriaId=1&precoMinimo=500
```

`precoMinimo` utiliza `Op.gt`: são retornados preços estritamente maiores que o valor informado. Um produto de preço 799 não aparece ao filtrar por `precoMinimo=799`.

### Avaliações

| Método | Rota | Dados recebidos | Função |
| --- | --- | --- | --- |
| GET | /avaliacoes | produtoId opcional | Listar todas ou filtrar por produto |
| POST | /avaliacoes/cadastrar | produtoId, usuario, nota, comentario | Cadastrar |
| POST | /avaliacoes/alterar | id, usuario, nota, comentario | Alterar mantendo o produto associado |
| POST | /avaliacoes/excluir | id | Excluir |

Nos formulários de alteração e exclusão de avaliações, `id` recebe o valor de `_id` mostrado na consulta, sem aspas. Ele não deve ser confundido com `produtoId`.

As consultas GET recebem parâmetros por `req.query`. Os formulários POST enviam dados recebidos por `req.body`, com `express.urlencoded()`. Alteração e exclusão também utilizam POST, mantendo o padrão de formulários trabalhado nas aulas.

## Operações de persistência

| Banco | Operações utilizadas |
| --- | --- |
| PostgreSQL com Sequelize | create(), findAll(), findByPk(), save(), destroy() |
| MongoDB com Mongoose | new Avaliacao(...).save(), find(), findOneAndUpdate(), findOneAndDelete() |

Nas consultas Sequelize, são utilizados `where`, `order` e `Op.gt`.

## Validações e tratamento de erros

As rotas verificam nomes preenchidos, identificadores inteiros positivos, preços válidos maiores que zero, notas inteiras entre 1 e 5 e comentários preenchidos. As rotas de produtos também conferem a existência da categoria e do vendedor.

As respostas distinguem dados inválidos (`400`), registros não encontrados (`404`) e falhas de execução (`500`). Um filtro sem resultados retorna uma lista vazia, `[]`.

As operações de banco estão em blocos `try/catch`. Erros de conversão do identificador de avaliação, chamados `CastError`, recebem uma mensagem específica. A inicialização também possui tratamento com `.catch()`.

## Orientação a objetos e arquivo de log

O arquivo `registrarErro.js` contém a classe `RegistroErro`:

- O construtor recebe o contexto e o erro.
- Os atributos são `data`, `contexto`, `tipo` e `mensagem`.
- O método `formatar()` produz uma linha de texto.
- A função `registrarErro()` instancia a classe com `new RegistroErro(...)` e utiliza `fs.appendFile()` para gravar o resultado.

Os 17 tratamentos de exceção das rotas de dados chamam essa função. Falhas capturadas na inicialização também são registradas.

Exemplo de registro:

```text
[DATA_EM_UTC] POST /avaliacoes/excluir | CastError: mensagem do erro
```

As datas são gravadas em UTC com `toISOString()`. Os novos registros são acrescentados ao arquivo, preservando os anteriores. Validações que retornam uma resposta antes de ocorrer uma exceção não geram automaticamente um registro no log.

## Roteiro de verificação manual

1. Cadastrar uma categoria e um vendedor.
2. Consultar os identificadores gerados.
3. Cadastrar um produto com essa categoria e esse vendedor.
4. Consultar, alterar e filtrar o produto.
5. Cadastrar uma avaliação usando o identificador do produto.
6. Conferir o documento no MongoDB Compass.
7. Alterar a nota e o comentário usando o `_id` da avaliação.
8. Tentar excluir o produto enquanto possui avaliação e conferir o bloqueio.
9. Excluir a avaliação e depois excluir o produto de teste.
10. Excluir a categoria e o vendedor de teste quando não possuírem produtos associados.
11. Enviar `abc` no formulário de exclusão de avaliação e conferir a mensagem de ID inválido e o registro em `logs/errors.log`.

Utilizar registros de teste para exclusões. Os identificadores devem ser consultados, pois não se deve presumir que terão valores específicos.

## Base do desenvolvimento

O desenvolvimento utiliza o enunciado Projeto BACK-END e os materiais da disciplina sobre Node.js, Express, módulos CommonJS, Sequelize, relacionamentos, consultas e MongoDB com Mongoose.

O projeto mantém formulários HTML simples, rotas em `app.js`, configurações em `config` e models em `models`.
