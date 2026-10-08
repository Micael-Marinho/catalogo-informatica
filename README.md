# Catálogo de Produtos de Informática com Avaliações

Projeto 1 da disciplina **Programação Web Back-End**, desenvolvido com Node.js e Express. A aplicação permite gerenciar categorias, vendedores e produtos no PostgreSQL e registrar avaliações dos produtos no MongoDB.

## Integrantes

| Integrante | Registro acadêmico |
| --- | --- |
| Micael Marinho Souza | 2819457 |
| Wagner Lourenço de Oliveira Junior | 2819473 |
| João Victor Queiroz de Lima | 2051524 |

**Instituição:** Universidade Tecnológica Federal do Paraná, Câmpus Cornélio Procópio.  
**Curso:** Tecnologia em Análise e Desenvolvimento de Sistemas.  
**Disciplina:** Programação Web Back-End, Projeto 1.

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
| HTML, CSS e JavaScript no navegador | Interface Bancada, formulários, tabelas e requisições com fetch |
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

As rotas de consulta retornam JSON. A interface Bancada, em `paginas/`, utiliza JavaScript e `fetch()` para exibir esses dados em tabelas, preencher seletores e carregar os dados no formulário ao clicar em **Editar**. Os cadastros e alterações são enviados por POST. O nome informado na avaliação é um campo de texto, sem autenticação de usuário. O navegador precisa estar com JavaScript habilitado.

## Organização dos arquivos

| Caminho | Responsabilidade |
| --- | --- |
| `app.js` | Configuração do Express, rotas, validações e inicialização dos bancos |
| `config/db_sequelize.exemplo.js` | Modelo de configuração do PostgreSQL, sem senha real |
| `config/db_sequelize.js` | Configuração local criada a partir do exemplo, com conexão, models e relacionamentos |
| `config/db_mongoose.js` | Endereço de conexão com o MongoDB |
| `models/categoria.js` | Model de Categoria |
| `models/vendedor.js` | Model de Vendedor |
| `models/produto.js` | Model de Produto |
| `models/avaliacao.js` | Schema e model de Avaliação |
| `registrarErro.js` | Classe RegistroErro e função de gravação de logs |
| `logs/errors.log` | Histórico de exceções; criado na primeira gravação |
| `paginas/index.html` | Página inicial com acesso aos formulários |
| `paginas/categorias.html` | Formulários de categorias |
| `paginas/vendedores.html` | Formulários de vendedores |
| `paginas/produtos.html` | Formulários de produtos e consultas |
| `paginas/avaliacoes.html` | Formulários de avaliações |
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

## Instalação e configuração do zero (Windows)

Este roteiro usa os bancos locais, sem MongoDB Atlas e sem hospedagem. Execute as etapas na ordem apresentada. Se os programas já estiverem instalados, confira suas versões e avance para a configuração do projeto.

### 1. O que baixar

| Programa | Download oficial | Para que serve |
| --- | --- | --- |
| Node.js | [nodejs.org](https://nodejs.org/pt-br/download) | Executar o servidor; o instalador inclui o npm |
| PostgreSQL | [Instalador para Windows](https://www.postgresql.org/download/windows/) | Armazenar categorias, vendedores e produtos |
| pgAdmin | Incluído entre os componentes do instalador do PostgreSQL | Criar e consultar o banco relacional |
| MongoDB Community Server | [Download do servidor](https://www.mongodb.com/try/download/community) | Armazenar as avaliações |
| MongoDB Compass | [Download do Compass](https://www.mongodb.com/try/download/compass) | Visualizar o banco MongoDB e seus documentos |
| Visual Studio Code | [Download do VS Code](https://code.visualstudio.com/download) | Abrir os arquivos e usar o terminal; pode ser substituído por outro editor |
| Git (opcional) | [Git para Windows](https://git-scm.com/downloads/win) | Clonar o repositório; dispensável se usar Download ZIP |

**Compatibilidade:** o projeto utiliza Mongoose 9, que exige **Node.js 20.19.0 ou superior**. Para uma instalação nova, utilize uma versão LTS ainda suportada, como Node.js 24.x. O requisito mínimo não significa que qualquer versão antiga ainda receba suporte. Consulte a [documentação de migração do Mongoose 9](https://mongoosejs.com/docs/migrating_to_9.html).

Para acompanhar este roteiro, utilize PostgreSQL 17.x e MongoDB Community Server 8.0.x, com versões de manutenção disponíveis para seu sistema. Essas linhas orientam a preparação dos bancos; não representam uma exigência de versão da professora nem uma declaração de teste de todas as versões possíveis. As versões exatas das dependências JavaScript estão registradas no `package-lock.json`.

**Atenção:** Compass é a interface de consulta. Instalar apenas o Compass não instala necessariamente o servidor MongoDB. O projeto precisa do **Community Server em execução**.

### 2. Instalar e conferir o Node.js

1. Baixe o instalador do Node.js para Windows, na versão LTS compatível.
2. Execute o instalador e mantenha os componentes padrão, incluindo npm e inclusão no PATH.
3. Conclua a instalação. Feche e abra novamente o VS Code, caso já estivesse aberto.
4. Abra um terminal e execute, separadamente:

```powershell
node -v
npm -v
```

Os dois comandos devem mostrar números de versão. Confira se o Node atende ao requisito indicado acima.

Se o PowerShell apresentar bloqueio de `npm.ps1`, use `npm.cmd -v`. Nos demais comandos deste guia, também é possível substituir `npm` por `npm.cmd`, sem alterar a política de execução do Windows.

### 3. Instalar o PostgreSQL

1. No site oficial, abra o link do instalador para Windows fornecido pela EDB.
2. Execute o instalador e mantenha os componentes **PostgreSQL Server**, **pgAdmin 4** e **Command Line Tools**.
3. Mantenha os diretórios padrão, salvo se precisar de outro local.
4. Defina e guarde a senha do usuário `postgres`. Essa senha será utilizada na configuração local do projeto.
5. Mantenha a porta **5432**, se estiver livre.
6. Na opção de localidade, mantenha **Default locale**, se disponível.
7. Conclua a instalação. O **Stack Builder é opcional**: este projeto não precisa instalar nenhum complemento por ele.

Se já houver PostgreSQL instalado, utilize o servidor existente e confira usuário, senha e porta. Não é necessário instalar outra instância apenas para este projeto.

### 4. Criar o banco no pgAdmin

1. Abra o **pgAdmin 4**.
2. Expanda **Servers** e abra o servidor PostgreSQL instalado. Informe a senha do usuário `postgres` quando solicitada.
3. Clique com o botão direito em **Databases**.
4. Selecione **Create > Database**.
5. No campo **Database**, digite exatamente `catalogo_informatica`.
6. Mantenha `postgres` como proprietário, se esse for o usuário utilizado.
7. Clique em **Save**.

Se o servidor não aparecer, clique com o botão direito em **Servers > Register > Server**. Na aba **General**, informe um nome, como `PostgreSQL local`. Em **Connection**, preencha host `localhost`, porta `5432`, maintenance database `postgres`, usuário `postgres` e a senha definida na instalação. Salve e crie o banco pelos passos acima.

Não crie as tabelas manualmente. Na primeira inicialização, `db.sequelize.sync()` cria as tabelas dos models que ainda não existem. O banco `catalogo_informatica`, porém, precisa existir antes de executar o projeto.

### 5. Instalar o MongoDB Community Server

1. Baixe o instalador **MSI** do MongoDB Community Server para Windows, compatível com seu sistema.
2. Execute o instalador e selecione a instalação **Complete**.
3. Mantenha a opção **Install MongoD as a Service**, para executar o banco como serviço do Windows.
4. Mantenha a conta de serviço e os diretórios padrão sugeridos pelo instalador.
5. Se houver a opção de instalar o Compass, pode mantê-la selecionada. Caso contrário, instale o Compass pelo link da etapa 1.
6. Conclua a instalação.

Para conferir o serviço, pressione `Win + R`, digite `services.msc` e pressione Enter. Procure **MongoDB** ou **MongoDB Server**. O serviço deve estar em execução; se estiver parado, use **Iniciar**. Os nomes das telas podem variar conforme a versão.

### 6. Preparar o banco no Compass

1. Abra o **MongoDB Compass**.
2. Crie uma conexão local usando a URI abaixo e clique em **Connect**:

```text
mongodb://127.0.0.1:27017
```

3. Após conectar, utilize **Create Database** ou o botão de criação de banco disponível na interface.
4. Preencha **Database Name** com `catalogo_avaliacoes`.
5. Preencha **Collection Name** com `avaliacoes`.
6. Confirme a criação.

Se o banco e a coleção já existirem, utilize-os. Não é necessário cadastrar documentos manualmente: as avaliações serão inseridas pela aplicação. Criar o banco pelo Compass torna a preparação visível; o MongoDB também pode criar o banco e a coleção quando a aplicação grava os dados.

### 7. Baixar e abrir o projeto

**Opção A — ZIP, sem precisar instalar Git:**

1. Acesse [o repositório do projeto](https://github.com/Micael-Marinho/catalogo-informatica).
2. Clique em **Code > Download ZIP**.
3. Extraia o ZIP para uma pasta do computador. Não execute os arquivos dentro do ZIP.
4. No VS Code, utilize **File > Open Folder** ou **Arquivo > Abrir Pasta**.
5. Selecione a pasta extraída que contém diretamente `app.js` e `package.json`.
6. Abra **Terminal > New Terminal** ou **Terminal > Novo Terminal**.

**Opção B — Git, caso esteja instalado:**

```powershell
git clone https://github.com/Micael-Marinho/catalogo-informatica.git
cd catalogo-informatica
```

Em ambas as opções, os comandos seguintes devem ser executados na pasta que contém `app.js` e `package.json`.

Os cinco HTMLs ficam na pasta **`paginas/`**: `index.html`, `categorias.html`, `vendedores.html`, `produtos.html` e `avaliacoes.html`. O `app.js` permanece na raiz e suas cinco rotas de páginas usam `path.join(__dirname, 'paginas', ...)`. Preserve essa estrutura ao extrair ou copiar o projeto. O CSS e o JavaScript da interface estão nos próprios HTMLs.

### 8. Instalar as dependências do projeto

No terminal da pasta do projeto, execute:

```powershell
npm ci
```

Esse comando instala as dependências conforme o `package-lock.json`, sem atualizar suas versões. Requer que o arquivo de lock esteja presente e corresponda ao `package.json`. Em uma cópia que já contém `node_modules`, essa pasta é substituída pela instalação.

Se ocorrer bloqueio de `npm.ps1`, execute:

```powershell
npm.cmd ci
```

Aguarde a conclusão. A pasta `node_modules` será criada automaticamente. Não é necessário instalar Express, Sequelize ou Mongoose um por um. Não modifique as versões das dependências para seguir este roteiro.

### 9. Configurar a conexão com o PostgreSQL

O arquivo `config/db_sequelize.js` contém a senha local e não acompanha o repositório. Para criá-lo:

1. Abra a pasta `config`.
2. Copie `db_sequelize.exemplo.js`.
3. Renomeie **a cópia** para `db_sequelize.js`, mantendo o arquivo de exemplo original.

Se a configuração local ainda não existir, a cópia também pode ser feita pelo PowerShell, na raiz do projeto:

```powershell
Copy-Item config/db_sequelize.exemplo.js config/db_sequelize.js
```

Abra **somente `config/db_sequelize.js`** e substitua `SUA_SENHA_AQUI` pela senha definida ao instalar o PostgreSQL. Confira:

| Informação | Valor padrão do projeto |
| --- | --- |
| Banco | `catalogo_informatica` |
| Usuário | `postgres` |
| Senha | A senha do PostgreSQL instalado no computador |
| Host | `localhost` |
| Porta | `5432` |
| Dialeto | `postgres` |

Se seu servidor utiliza outro usuário ou porta, ajuste esses valores no arquivo local. A senha precisa permanecer uma string JavaScript válida; se contiver aspas ou barras invertidas, esses caracteres precisam ser escapados corretamente.

**Preserve o restante do arquivo:** ele carrega os models e define os relacionamentos. Não substitua todo o conteúdo apenas por um trecho de conexão. Mantenha o marcador `SUA_SENHA_AQUI` no arquivo de exemplo e não publique a senha real.

### 10. Conferir a conexão com o MongoDB

O arquivo `config/db_mongoose.js` já deve conter:

```javascript
const db_mongoose = {
    connection: 'mongodb://127.0.0.1:27017/catalogo_avaliacoes'
};

module.exports = db_mongoose;
```

No ambiente local padrão preparado neste guia, não é necessário alterar esse arquivo. O endereço utiliza o mesmo servidor da conexão feita no Compass, acrescentando o nome do banco.

### 11. Criar a pasta de logs

Na raiz do projeto, ao lado de `app.js` e `registrarErro.js`, crie uma pasta chamada `logs`.

Se ela ainda não existir, execute:

```powershell
mkdir logs
```

A pasta é ignorada pelo Git e precisa ser criada em cada nova instalação. Não crie `errors.log` manualmente: `fs.appendFile()` cria o arquivo na primeira gravação de erro bem-sucedida. A pasta pode permanecer vazia enquanto nenhuma exceção for registrada. Sem a pasta, a gravação do log falha.

### 12. Iniciar o sistema

Confira se os serviços PostgreSQL e MongoDB estão em execução. No terminal, dentro da pasta do projeto, execute:

```powershell
node app.js
```

A aplicação sincroniza os models do PostgreSQL, conecta ao MongoDB e só então inicia o Express. Entre as mensagens do terminal, devem aparecer:

```text
PostgreSQL conectado e models sincronizados!
MongoDB conectado!
Servidor iniciado!
Acesse: http://localhost:8081
```

Também podem aparecer comandos SQL gerados pelo Sequelize; isso faz parte da saída normal da configuração utilizada.

Abra no navegador:

```text
http://localhost:8081
```

Mantenha o terminal e os serviços dos bancos em execução durante o uso. O projeto é iniciado com `node app.js`; **não possui script `npm start` configurado**. Não use Live Server nem abra os HTMLs por duplo clique.

Para encerrar, pressione `Ctrl + C` no terminal do servidor. Após alterar arquivos JavaScript, salve e reinicie a aplicação. Mantenha apenas uma execução na porta 8081.

O GitHub disponibiliza o código; ele não executa o servidor nem transfere os dados dos bancos. Em uma instalação nova, cadastre os dados pela aplicação.

### 13. Fazer o primeiro teste

1. Na página inicial, abra o formulário de categorias e cadastre `Periféricos`.
2. Consulte as categorias e anote o ID retornado.
3. Cadastre o vendedor `Loja de demonstração`, consulte e anote seu ID.
4. Cadastre `Monitor de demonstração`, descrição `Monitor para estudos`, preço `800` e selecione a categoria e o vendedor cadastrados nos campos correspondentes.
5. Consulte os produtos e anote o ID do monitor.
6. Cadastre uma avaliação selecionando esse produto, usuário `Equipe`, nota `5` e comentário `Produto adequado para estudos`.
7. Consulte as avaliações e confira o documento no Compass, em `catalogo_avaliacoes > avaliacoes`. Atualize a visualização se necessário.

Não presuma que os IDs serão `1`: utilize os valores apresentados nas consultas. Na interface, as consultas aparecem em tabelas. Acessar diretamente `/produtos` ou `/avaliacoes`, por exemplo, mostra o JSON retornado pelo servidor. Uma lista `[]` nessas rotas indica que a consulta não encontrou registros.

Para testar o log, mantenha o servidor em execução e abra **outro terminal PowerShell**. A interface exclui pelo botão da linha e não oferece um campo livre para digitar um ID inválido. Por isso, envie esta requisição de teste diretamente à rota:

```powershell
curl.exe -i -X POST http://localhost:8081/avaliacoes/excluir -d "id=abc"
```

O resultado esperado é HTTP `400`, a mensagem de ID inválido e um registro de `CastError` em `logs/errors.log`. Esse teste usa um identificador inválido e não seleciona uma avaliação existente.

A seção **Verificação manual**, abaixo, apresenta a sequência completa de testes de alteração, filtros e exclusões.

### Problemas comuns

| Mensagem ou situação | O que conferir |
| --- | --- |
| `node` ou `npm` não é reconhecido | Instalação do Node.js e inclusão no PATH. Feche e abra novamente o terminal e o VS Code. |
| PowerShell bloqueia `npm.ps1` | Use `npm.cmd ci` e `npm.cmd -v`. |
| `EBADENGINE` ou requisito de versão incompatível | Confira `node -v` e instale uma versão LTS compatível com o Mongoose 9. |
| npm não encontra `package.json` | O terminal deve estar na pasta extraída que contém `app.js` e `package.json`. |
| `npm ci` informa divergência entre pacote e lock | Baixe uma cópia completa do repositório, mantendo `package.json` e `package-lock.json` da mesma revisão. |
| `Cannot find module 'express'` ou outra dependência | Execute `npm ci` na pasta do projeto e confira se a instalação terminou sem erro. |
| `Cannot find module './config/db_sequelize'` | Crie `config/db_sequelize.js` a partir do arquivo de exemplo. Confira o nome e a extensão. |
| Falha de autenticação no PostgreSQL | Confira usuário e senha em `config/db_sequelize.js`; use a senha do servidor, não uma eventual senha mestra do pgAdmin. |
| Banco `catalogo_informatica` não existe | Crie o banco no mesmo servidor e porta usados na configuração. |
| Conexão recusada na porta 5432 | Confira o serviço PostgreSQL, o host e a porta configurada. |
| Conexão recusada na porta 27017 ou `MongooseServerSelectionError` | Confira se o MongoDB Community Server está instalado e em execução. Compass sozinho não substitui o servidor. |
| `EADDRINUSE` na porta 8081 | Outra aplicação ou execução já utiliza a porta. Pare a execução conhecida com `Ctrl + C` antes de iniciar outra. |
| `ENOENT` ao abrir um HTML | Confira se os cinco HTMLs estão em `paginas/`, conforme os caminhos de `res.sendFile()` no `app.js`. |
| `ENOENT` ao gravar `errors.log` | Crie a pasta `logs` na raiz e confira a permissão de escrita. |
| Pasta `logs` vazia | Nenhuma exceção pode ter sido registrada. Execute o teste com `abc`; validações comuns não gravam log automaticamente. |
| Não é possível cadastrar um produto | Cadastre primeiro categoria e vendedor e use IDs existentes; o preço deve ser maior que zero. |
| Não é possível excluir um produto com avaliações | Exclua primeiro as avaliações associadas ao produto de teste. |

O `sync()` utilizado cria tabelas ausentes, sem `force: true`. Ele não apaga os dados a cada execução nem funciona como migração automática de estruturas antigas. Para uma avaliação em ambiente novo, utilize um banco criado especificamente para este projeto.


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

Nas requisições de alteração e exclusão de avaliações, `id` recebe o valor de `_id`. A interface preenche esse identificador automaticamente ao clicar em **Editar** ou **Excluir**. Ele não deve ser confundido com `produtoId`.

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

## Verificação manual

1. Cadastrar uma categoria e um vendedor.
2. Consultar os identificadores gerados.
3. Cadastrar um produto com essa categoria e esse vendedor.
4. Consultar, alterar e filtrar o produto.
5. Cadastrar uma avaliação usando o identificador do produto.
6. Conferir o documento no MongoDB Compass.
7. Clicar em **Editar** na avaliação, alterar a nota e o comentário e salvar. A interface envia o `_id` correto.
8. Tentar excluir o produto enquanto possui avaliação e conferir o bloqueio.
9. Excluir a avaliação e depois excluir o produto de teste.
10. Excluir a categoria e o vendedor de teste quando não possuírem produtos associados.
11. Executar o comando `curl.exe` da etapa 13 de instalação para enviar `id=abc` à rota de exclusão de avaliação. Conferir HTTP 400 e o registro em `logs/errors.log`.

O projeto não possui uma suíte de testes automatizados configurada. A verificação das funcionalidades é manual.

Utilizar registros de teste para exclusões. Os identificadores devem ser consultados, pois não se deve presumir que terão valores específicos.

## Arquivos locais e versionamento

O repositório inclui o código-fonte, os HTMLs, `package.json`, `package-lock.json`, a configuração de exemplo e esta documentação.

O `.gitignore` mantém fora do versionamento:

- `node_modules/`: dependências instaladas pelo npm.
- `config/db_sequelize.js`: configuração local com a senha do PostgreSQL.
- `logs/` e arquivos de log: histórico gerado durante a execução.

Os dados dos bancos não acompanham o repositório. Em uma instalação nova, prepare os bancos, configure a conexão e cadastre os registros pela aplicação.

## Base do desenvolvimento

O projeto foi organizado a partir do enunciado Projeto BACK-END e dos conteúdos de Node.js, Express, módulos CommonJS, Sequelize, relacionamentos, consultas e MongoDB com Mongoose. O registro de erros utiliza uma implementação própria com a classe `RegistroErro` e os módulos nativos `fs` e `path`; essa escolha de implementação não é uma afirmação de que o mesmo código consta no material de aula.

O projeto mantém as rotas em `app.js`, configurações em `config`, models em `models` e a interface Bancada em `paginas`. A interface utiliza HTML, CSS e JavaScript, sem framework de front-end; os scripts tratam consultas, tabelas, filtros e formulários.

## Referências de instalação

- [Downloads oficiais do Node.js](https://nodejs.org/pt-br/download).
- [Requisito de Node.js do Mongoose 9](https://mongoosejs.com/docs/migrating_to_9.html).
- [Instaladores do PostgreSQL para Windows](https://www.postgresql.org/download/windows/).
- [Instalação do PostgreSQL no Windows pela EDB](https://www.enterprisedb.com/docs/dev-guides/deploy/windows/).
- [Instalação do MongoDB Community 8.0 no Windows](https://www.mongodb.com/docs/v8.0/tutorial/install-mongodb-on-windows/).

Os passos de instalação se referem ao Windows. Os nomes de botões podem variar conforme idioma e versão das ferramentas.
