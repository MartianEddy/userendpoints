

CREATE  TABLE Users(
id VARCHAR(50),
fullname VARCHAR(50),
email VARCHAR(250) ,
password VARCHAR(250)
);

CREATE PROCEDURE insertUser(@id VARCHAR(50) , @fullname VARCHAR(50) ,@email VARCHAR(150)  , @password VARCHAR(300))
AS
BEGIN

INSERT INTO Users(id,fullname,email,password)
VALUES(@id,@fullname,@email ,@password)

END




CREATE PROCEDURE getUsers
AS
BEGIN

SELECT id ,fullname,email FROM Users
END


CREATE PROCEDURE getUser(@id VARCHAR (50))
AS
BEGIN

SELECT id ,fullname,email FROM Users WHERE id =@id
END




CREATE PROCEDURE updateUser(@id VARCHAR(50) , @fullname VARCHAR(50) ,@email VARCHAR(150))
AS
BEGIN
UPDATE Users SET fullname = @fullname , email =@email WHERE id=@id

END


CREATE PROCEDURE deleteUser(@id VARCHAR (50))
AS
BEGIN
DELETE FROM Users WHERE id =@id
END