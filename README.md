# Projeto integrador de competências
> ⚠️🚧 Projeto em construção

Projeto de faculdade implementando um quadro kanban como um monolito, com o intuito de fazer uma pesquisa com usuários e avaliar sua usabilidade.

# Como executar

## Pré-requisitos
As seguintes dependências devem estar devidamente instaladas e configuradas:

- PostgreSQL
- docker/podman
- docker-compose/podman-compose
- chave e certificado ssl, para criptografia https

Certifique-se de possuir um usuário do Postgres habilitado com permissão de leitura, escrita, alteração e deleção de tabelas. Se for primeira vez executando o projeto, é necessário preparar o banco de dados executando **todos** os scripts contidos no diretório src/persistence/migrations.

Estes scripts são responsáveis por criar um SCHEMA chamado "kanban" com todas as tabelas necessárias para a execução do projeto, bem como inserir alguns dados para testes.

## Executar com Docker compose

### Preencher a variáveis de ambiente
Algumas variáveis de ambiente são utilizadas no projeto para configurar parâmetros utilizados tanto pelo backend, quanto pelo frontend. O repositório possui alguns valores padrão usados como exemplo, mas provavelmente eles deverão ser alterados na sua máquina (especialmente no ambiente de produção) para refletir as configuração do seu ambiente.

Preencha as variáveis de ambiente localizadas na pasta env/.env_backend_des, com os seguintes dados:
```
DATABASE_URL=(URL completa do banco de dados, incluindo usuário e senha)
REDIS_URL=(Url do redis - dentro da rede docker)
```
Preencha as variáveis de ambiente localizadas na pasta env/.env_frontend_des, com os seguintes dados:
```
BACKEND_URL=(URL do service de backend)
SSL_CERT=(Seu certificado SSL para o ambiente)
SSL_KEY=(Sua chave SSL para o ambiente)
```

Após fazer os devidos ajustes nas variáveis de ambiente, use o arquivo docker-compose.yml para iniciar o projeto com Docker compose.
```bash
sudo docker compose up
```
Acesse o projeto em https://localhost:443.

Para terminar a execução do projeto, pressione Ctrl+C no terminal.