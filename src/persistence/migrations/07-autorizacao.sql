-- Trocar pk_usuario por id_usuario para facilitar queries
ALTER TABLE kanban.usuarios ADD CONSTRAINT unique_id UNIQUE(id_usuario);

ALTER TABLE kanban.quadros 
ADD COLUMN id_usuario uuid;

ALTER TABLE kanban.quadros ADD FOREIGN KEY (id_usuario) REFERENCES kanban.usuarios (id_usuario) ON DELETE CASCADE;

UPDATE kanban.quadros q
SET id_usuario = u.id_usuario
FROM kanban.usuarios u
WHERE q.pk_usuario = u.pk_usuario;

ALTER TABLE kanban.quadros ALTER COLUMN id_usuario SET NOT NULL;
ALTER TABLE kanban.quadros DROP COLUMN pk_usuario;
-- Colunas
ALTER TABLE kanban.colunas
ADD COLUMN id_usuario uuid;

ALTER TABLE kanban.colunas ADD FOREIGN KEY (id_usuario) REFERENCES kanban.usuarios (id_usuario) ON DELETE CASCADE;

UPDATE kanban.colunas c
SET id_usuario = q.id_usuario
FROM kanban.quadros q
WHERE c.pk_quadro = q.pk_quadro;

ALTER TABLE kanban.colunas ALTER COLUMN id_usuario SET NOT NULL;
-- Tarefas
ALTER TABLE kanban.tarefas
ADD COLUMN id_usuario uuid;

ALTER TABLE kanban.tarefas ADD FOREIGN KEY (id_usuario) REFERENCES kanban.usuarios (id_usuario) ON DELETE CASCADE;

UPDATE kanban.tarefas t
SET id_usuario = c.id_usuario
FROM kanban.colunas c
WHERE t.pk_coluna = c.pk_coluna; 

ALTER TABLE kanban.tarefas ALTER COLUMN id_usuario SET NOT NULL;
-- Tags
ALTER TABLE kanban.tags 
ADD COLUMN id_usuario uuid;

ALTER TABLE kanban.tags ADD FOREIGN KEY (id_usuario) REFERENCES kanban.usuarios (id_usuario) ON DELETE CASCADE;

ALTER TABLE kanban.tags ALTER COLUMN id_usuario SET NOT NULL;