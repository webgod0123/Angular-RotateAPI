DELIMITER //

Create procedure AddNewUser (Name varchar(30), 
    Hash varchar(255)
)
BEGIN
	INSERT INTO User
	VALUES(Name,
    Name,
    Hash
    );
END //

DELIMITER ;