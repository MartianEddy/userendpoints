

--create table
CREATE  TABLE Users(
id VARCHAR(50),
fullname VARCHAR(50),
email VARCHAR(250) ,
password VARCHAR(250)
);

 --Stored proceedings
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


CREATE PROCEDURE getUser(@email VARCHAR(150))
AS
BEGIN

SELECT id ,fullname,email FROM Users WHERE email = @email
END


--DROP PROCEDURE getUser;

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


CREATE PROCEDURE getUserbyid(@id VARCHAR(50))
AS BEGIN
SELECT id,fullname,email FROM Users WHERE id=@id
END

CREATE PROCEDURE logInUser(@email VARCHAR (250), @password VARCHAR (250))
AS BEGIN
SELECT fullname,email,password FROM Users
WHERE email=@email AND password=@password
END



CREATE PROCEDURE resetUserPassword(@id VARCHAR(50), @password VARCHAR(250))
AS BEGIN
UPDATE Users SET password=@password WHERE id=@id
END