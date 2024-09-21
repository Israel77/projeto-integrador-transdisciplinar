# Projeto integrador de competências
> ⚠️🚧 Projeto em construção

Projeto de faculdade implementando um quadro kanban como um monolito, com o intuito de fazer uma pesquisa com usuários e avaliar sua usabilidade.

# Como executar

## Pré-requisitos
As seguintes dependências devem estar devidamente instaladas e configuradas:

- PostgreSQL
- Rust e Cargo
- Cargo watch (opcional)
- Node e NPM
- Redis/Valkey
- Docker/podman (opcional)
- Docker compose (opcional)
- Visual Studio Code/VSCodium (opcional)

Certifique-se de possuir um usuário do Postgres habilitado com permissão de leitura, escrita, alteração e deleção de tabelas. Se for primeira vez executando o projeto, é necessário preparar o banco de dados executando **todos** os scripts contidos no diretório src/persistence/migrations.

Estes scripts são responsáveis por criar um SCHEMA chamado "kanban" com todas as tabelas necessárias para a execução do projeto, bem como inserir alguns dados para testes.

## Executar em modo de desenvolvimento

Compile os arquivos TypeScript para gerar o JavaScript correspondente:
```
$ cd static
$ npm run compile
``` 

Na raiz do projeto, crie um arquivo .env contendo as seguintes variáveis de ambiente:
```
DATABASE_URL=(url do postgres - incluindo as informações de usuário e senha)
REDIS_URL=(url do redis)
```

Também na raiz do projeto, execute o comando para compilar os arquivos Rust e iniciar o servidor:
```
$ cargo run
```

### Compilação automática

É possível compilar automáticamente os arquivos TypeScript para JavaScript quando eles forem editados, executando o seguinte comando no diretório static:
```
$ npm run compile-watch
```

Similarmente, com a extensão cargo-watch instalada, é possível recompilar os arquivos Rust quando o projeto for alterado, com o comando:
```
$ cargo watch -x run
```

Se você está utilizando o VSCodium ou Visual Studio Code como editor de texto/IDE, há uma task pré-configurada no arquivo .vscode/tasks.json chamada Start App, que irá automaticamente baixar e inicializar uma imagem do Redis, além de executar o Cargo em modo watch (requer podman e cargo-watch instalados).