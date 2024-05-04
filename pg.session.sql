ALTER TABLE todos
ADD CONSTRAINT fk_todos_userId
FOREIGN KEY (idUser) REFERENCES users(id);

SELECT * from todos;

