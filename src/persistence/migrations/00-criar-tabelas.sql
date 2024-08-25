-- Criação do schema KANBAN, se não existir
CREATE SCHEMA IF NOT EXISTS KANBAN;

-- Tabela de usuários
CREATE TABLE IF NOT EXISTS KANBAN.usuarios (
    id SERIAL PRIMARY KEY,
    nome_usuario VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    senha_hash VARCHAR(255) NOT NULL,
    ip_criacao INET,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de quadros
CREATE TABLE IF NOT EXISTS KANBAN.quadros (
    id SERIAL PRIMARY KEY,
    usuario_id INT NOT NULL,
    titulo VARCHAR(100) NOT NULL,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES KANBAN.usuarios(id) ON DELETE CASCADE
);

-- Tabela de tarefas
CREATE TABLE IF NOT EXISTS KANBAN.tarefas (
    id SERIAL PRIMARY KEY,
    quadro_id INT NOT NULL,
    titulo VARCHAR(100) NOT NULL,
    descricao TEXT,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (quadro_id) REFERENCES KANBAN.quadros(id) ON DELETE CASCADE
);

-- Tabela de tags
CREATE TABLE IF NOT EXISTS KANBAN.tags (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(50) NOT NULL UNIQUE
);

-- Tabela de associação entre tarefas e tags (muitos-para-muitos)
CREATE TABLE IF NOT EXISTS KANBAN.tarefa_tags (
    tarefa_id INT NOT NULL,
    tag_id INT NOT NULL,
    PRIMARY KEY (tarefa_id, tag_id),
    FOREIGN KEY (tarefa_id) REFERENCES KANBAN.tarefas(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES KANBAN.tags(id) ON DELETE CASCADE
);