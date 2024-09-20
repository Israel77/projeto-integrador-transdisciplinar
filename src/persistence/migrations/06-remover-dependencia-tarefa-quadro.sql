-- Remover dependência transitória entre as tabelas tarefas e quadros

BEGIN;
ALTER TABLE kanban.tarefas DROP COLUMN id_quadro;
COMMIT;