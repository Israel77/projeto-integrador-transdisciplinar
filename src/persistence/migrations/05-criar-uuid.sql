-- Criar uuids para as tabelas
-- Nova regra: Chaves primárias são identificadas por pk_
-- UUIDs são identificados por id_

ALTER TABLE kanban.tags RENAME COLUMN id_tag TO pk_tag;
ALTER TABLE kanban.tags ADD COLUMN id_tag UUID NOT NULL DEFAULT gen_random_uuid();
UPDATE kanban.tags
SET id_tag =  gen_random_uuid()
WHERE id_tag IS NULL;

ALTER TABLE kanban.tarefas RENAME COLUMN id_tarefa TO pk_tarefa;
ALTER TABLE kanban.tarefas ADD COLUMN id_tarefa UUID NOT NULL DEFAULT gen_random_uuid();
ALTER TABLE kanban.tarefas RENAME COLUMN id_coluna TO pk_coluna;
UPDATE kanban.tarefas 
SET id_tarefa = gen_random_uuid()
WHERE id_tarefa IS NULL;

ALTER TABLE kanban.tarefas_tags RENAME COLUMN id_tarefa TO pk_tarefa;
ALTER TABLE kanban.tarefas_tags RENAME COLUMN id_tag TO pk_tag;

ALTER TABLE kanban.quadros RENAME COLUMN id_quadro TO pk_quadro;
ALTER TABLE kanban.quadros ADD COLUMN id_quadro UUID NOT NULL DEFAULT gen_random_uuid();
ALTER TABLE kanban.quadros RENAME COLUMN id_usuario TO pk_usuario;
UPDATE kanban.quadros 
SET id_quadro = gen_random_uuid()
WHERE id_quadro IS NULL;

ALTER TABLE kanban.colunas RENAME COLUMN id_quadro TO pk_quadro;
ALTER TABLE kanban.colunas RENAME COLUMN id_coluna TO pk_coluna;
ALTER TABLE kanban.colunas ADD COLUMN id_coluna UUID NOT NULL DEFAULT gen_random_uuid();
UPDATE kanban.colunas 
SET id_coluna = gen_random_uuid()
WHERE id_coluna IS NULL;

ALTER TABLE kanban.usuarios RENAME COLUMN id_usuario TO pk_usuario;
ALTER TABLE kanban.usuarios ADD COLUMN id_usuario UUID NOT NULL DEFAULT gen_random_uuid();
UPDATE kanban.usuarios 
SET id_usuario =  gen_random_uuid()
WHERE id_usuario IS NULL;