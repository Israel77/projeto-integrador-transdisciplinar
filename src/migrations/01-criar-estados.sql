-- Tabela de estados
CREATE TABLE IF NOT EXISTS KANBAN.estados (
    id SERIAL PRIMARY KEY,
    quadro_id INT NOT NULL,
    nome_estado VARCHAR(50) NOT NULL,
    ordem INT NOT NULL,  -- Coluna para indicar a ordem do estado
    UNIQUE (quadro_id, ordem),  -- Garante que a ordem seja única dentro de cada quadro
    FOREIGN KEY (quadro_id) REFERENCES KANBAN.quadros(id) ON DELETE CASCADE
);

ALTER TABLE KANBAN.tarefas ADD COLUMN estado_id INT;
ALTER TABLE KANBAN.tarefas ADD CONSTRAINT fk_tarefas_estados FOREIGN KEY (estado_id) REFERENCES KANBAN.estados(id) ON DELETE SET NULL;