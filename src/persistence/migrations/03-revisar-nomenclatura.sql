-- Revisar nomenclatura
-- Regras:
-- 1. Nomes de tabelas e colunas devem ser em português.
-- 2. Nomes de tabelas e colunas devem ser em minúsculas e separados por underline (snake_case).
-- 3. Nomes de tabelas e colunas devem ser descritivos e significativos.
-- 4. Nomes de tabelas e colunas devem ser únicos.
-- 5. Nomes de tabelas e colunas devem ser consistentes.
-- 6. Ids devem seguir o padrão id_<nome_da_tabela> (singular).
-- 7. Nomes de tabelas devem ser no plural.
-- 8. Nomes de colunas devem ser no singular.
-- 9. Nomes de colunas devem ser o mais próximo possível do que será exibido no frontend (linguagem do domínio).

ALTER TABLE kanban.quadros ADD COLUMN descricao TEXT;

-- Estados -> Colunas
ALTER TABLE kanban.estados RENAME COLUMN nome_estado TO nome_coluna;

ALTER TABLE kanban.estados RENAME TO colunas;

ALTER TABLE kanban.colunas
RENAME COLUMN quadro_id TO id_quadro;

ALTER TABLE kanban.colunas 
RENAME COLUMN id TO id_coluna;

ALTER TABLE kanban.colunas 
RENAME COLUMN ordem TO ordem_coluna;

-- Quadros
ALTER TABLE kanban.quadros 
RENAME COLUMN id TO id_quadro;

ALTER TABLE kanban.quadros 
RENAME COLUMN usuario_id TO id_usuario;

ALTER TABLE kanban.quadros 
RENAME COLUMN titulo TO titulo_quadro;

ALTER TABLE kanban.quadros 
RENAME COLUMN descricao TO descricao_quadro;

ALTER TABLE kanban.quadros 
RENAME COLUMN data_criacao TO data_criacao_quadro;

-- Tags
ALTER TABLE kanban.tags
RENAME COLUMN id TO id_tag;

ALTER TABLE kanban.tags
RENAME COLUMN nome TO nome_tag;

-- Tarefas
ALTER TABLE kanban.tarefas
RENAME COLUMN id TO id_tarefa;

ALTER TABLE kanban.tarefas
RENAME COLUMN quadro_id TO id_quadro;

ALTER TABLE kanban.tarefas
RENAME COLUMN estado_id TO id_coluna;

ALTER TABLE kanban.tarefas
RENAME COLUMN titulo TO titulo_tarefa;

ALTER TABLE kanban.tarefas
RENAME COLUMN descricao TO descricao_tarefa;

ALTER TABLE kanban.tarefas
RENAME COLUMN data_criacao TO data_criacao_tarefa;

-- Usuários
ALTER TABLE kanban.usuarios
RENAME COLUMN id TO id_usuario;

ALTER TABLE kanban.usuarios
RENAME COLUMN email TO email_usuario;

ALTER TABLE kanban.usuarios
RENAME COLUMN senha_hash TO senha_hash_usuario;

ALTER TABLE kanban.usuarios
RENAME COLUMN data_criacao TO data_criacao_usuario;

ALTER TABLE kanban.usuarios
RENAME COLUMN ip_criacao TO ip_criacao_usuario;

-- Relacionamentos
ALTER TABLE kanban.tarefa_tags
RENAME TO tarefas_tags;

ALTER TABLE kanban.tarefas_tags
RENAME COLUMN tarefa_id TO id_tarefa;

ALTER TABLE kanban.tarefas_tags
RENAME COLUMN tag_id TO id_tag;