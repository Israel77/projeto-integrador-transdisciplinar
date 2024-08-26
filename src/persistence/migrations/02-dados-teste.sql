-- criar usuário teste
INSERT INTO kanban.usuarios (nome_usuario, email, senha_hash) VALUES ('test', 'test@example.com', '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08');

-- criar quadro de teste
INSERT INTO kanban.quadros (titulo, usuario_id) VALUES ('Quadro de Teste', 1);

-- criar estados de teste
INSERT INTO kanban.estados (nome_estado, quadro_id, ordem) VALUES ('Backlog', 1, 1);
INSERT INTO kanban.estados (nome_estado, quadro_id, ordem) VALUES ('Em andamento', 1, 2);
INSERT INTO kanban.estados (nome_estado, quadro_id, ordem) VALUES ('Concluída', 1, 3);

-- criar tarefas de teste
INSERT INTO kanban.tarefas (quadro_id, estado_id, titulo, descricao, data_criacao) VALUES
    (1, 1, 'Tarefa 1', 'Descrição da Tarefa 1', '2023-01-01 10:00:00'),
    (1, 1, 'Tarefa 2', 'Descrição da Tarefa 2', '2023-01-02 11:00:00'),
    (1, 2, 'Tarefa 3', 'Descrição da Tarefa 3', '2023-01-03 12:00:00'),
    (1, 2, 'Tarefa 4', 'Descrição da Tarefa 4', '2023-01-04 13:00:00'),
    (1, 3, 'Tarefa 5', 'Descrição da Tarefa 5', '2023-01-05 14:00:00');