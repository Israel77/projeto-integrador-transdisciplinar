-- Mudar algoritmo de criptografia da senha
UPDATE kanban.usuarios
SET senha_hash_usuario = '$2b$13$aFkfx7g2vulUVTS12FeWKeRqHYb4kkytrhGsdTlZXsSwcvDaA8aPW'
WHERE id_usuario = 1;

ALTER TABLE kanban.usuarios
ADD CONSTRAINT unique_nome_usuario_key
UNIQUE (nome_usuario);
