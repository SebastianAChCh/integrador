CREATE DATABASE UDesEv;

USE UDesEv;

CREATE TABLE users (
	ID INT PRIMARY KEY AUTO_INCREMENT,
	Names VARCHAR(60),
	LastNames VARCHAR(60),
	Email VARCHAR(70) UNIQUE,
	Description VARCHAR(300),
	Password VARCHAR(255),
	Phone VARCHAR(20),
	IsSeller Boolean
);

CREATE TABLE profile(
	ID INT PRIMARY KEY AUTO_INCREMENT,
	ID_USER INT,
	AVATAR VARCHAR(255),
	FOREIGN KEY (ID_USER) REFERENCES users(ID)
);

CREATE TABLE seller (
	ID INT PRIMARY KEY AUTO_INCREMENT,
	ID_USER INT,
	Birth_Date DATE,
	ClaveElector BLOB,
	Curp BLOB,
	NoIne BLOB,
	NoEmision BLOB,
	Calificaciones INT,
    Profession VARCHAR(60),
	FOREIGN KEY (ID_USER) REFERENCES users(ID)
);

CREATE TABLE opinions (
	ID INT PRIMARY KEY AUTO_INCREMENT,
	Email_Seller VARCHAR(70),
	Email_User VARCHAR(70),
	Opinion VARCHAR(300),
	FOREIGN KEY (Email_Seller) REFERENCES users(Email),
	FOREIGN KEY (Email_User) REFERENCES users(Email)
);

CREATE TABLE raiting_sellers (
	ID INT PRIMARY KEY AUTO_INCREMENT,
	Description VARCHAR(140),
	Raiting INT,
	Email_SELLER VARCHAR(70),
	EMAIL_USER VARCHAR(70),
	FOREIGN KEY (EMAIL_SELLER) REFERENCES seller(Email),
	FOREIGN KEY (EMAIL_USER) REFERENCES users(Email)
);

CREATE TABLE messages (
	ID INT PRIMARY KEY AUTO_INCREMENT,
	EMAIL_USER VARCHAR(70),
	EMAIL_SELLER VARCHAR(70),
	Message VARCHAR (100),
	Type VARCHAR(10),
	OriginalName VARCHAR(50),
	Date DATE,
	FOREIGN KEY (EMAIL_USER) REFERENCES users(Email),
	FOREIGN KEY (EMAIL_SELLER) REFERENCES users(Email)
);

CREATE TABLE bank_details (
	ID INT PRIMARY KEY AUTO_INCREMENT,
	ID_SELLER INT,
	Number_Card VARCHAR(20),
	Name_Card VARCHAR(20),
	FOREIGN KEY (ID_SELLER) REFERENCES seller(ID)
);

CREATE TABLE catalog_designs (
	ID INT PRIMARY KEY AUTO_INCREMENT,
	Type VARCHAR(20),
	Active Boolean
);

CREATE TABLE designs(
	ID INT PRIMARY KEY AUTO_INCREMENT,
	ID_SELLER INT,
	Name_product VARCHAR(40),	
	Description VARCHAR(150),
	Model_Route VARCHAR(254),
	Screen_Model_Route VARCHAR(254),
	Cost VARCHAR(20),
	Type_Design INT,
	FOREIGN KEY (ID_SELLER) REFERENCES seller(ID),
	FOREIGN KEY (Type_Design) REFERENCES catalog_designs(ID)
);

CREATE TABLE images (
	ID INT PRIMARY KEY AUTO_INCREMENT,
	ID_PROJECT INT,
	Route VARCHAR(254),
	FOREIGN KEY (ID_PROJECT) REFERENCES designs(ID)
);

CREATE TABLE transactionsuserseller (
	ID INT PRIMARY KEY AUTO_INCREMENT,
	Email_user VARCHAR(70),
	Email_seller VARCHAR(70),
	ID_DESIGN INT,
	Date DATE,
	Quantity VARCHAR(20),
	FOREIGN KEY (Email_user) REFERENCES users(Email),
	FOREIGN KEY (Email_seller) REFERENCES users(Email),
	FOREIGN KEY (ID_DESIGN) REFERENCES designs(ID)
);

/*Esta vas mas para el comprador*/
CREATE TABLE purchase_history (
	ID INT PRIMARY KEY AUTO_INCREMENT,
	EMAIL_USER VARCHAR(70),
	EMAIL_USER_SELLER VARCHAR(70),
	ID_DESIGN INT,
	FOREIGN KEY (EMAIL_USER) REFERENCES users(Email),
	FOREIGN KEY (EMAIL_USER_SELLER) REFERENCES users(Email),
	FOREIGN KEY (ID_DESIGN) REFERENCES designs(ID)
);



/*Esta va mas para el vendedor*/
CREATE TABLE sales_history (
	ID INT PRIMARY KEY AUTO_INCREMENT,
	EMAIL_USER VARCHAR(70),
	EMAIL_USER_SELLER VARCHAR(70),
	ID_DESIGN INT,
	FOREIGN KEY (EMAIL_USER) REFERENCES users(Email),
	FOREIGN KEY (EMAIL_USER_SELLER) REFERENCES users(Email),
	FOREIGN KEY (ID_DESIGN) REFERENCES designs(ID)
);

CREATE TABLE card (
	ID INT PRIMARY KEY AUTO_INCREMENT,
	ID_USER INT,
	Card_Number VARCHAR(20),
	Card_Name VARCHAR(22),
	DAY VARCHAR(2),
	YEAR VARCHAR(4),
	FOREIGN KEY (ID_USER) REFERENCES users(ID)
);

CREATE TABLE key_words (
	ID INT PRIMARY KEY AUTO_INCREMENT,
	Word VARCHAR(30)
);


CREATE FULLTEXT INDEX email_index ON users(Email);


CREATE INDEX id_normal_users ON seller(ID_USER);


DELIMITER //
CREATE PROCEDURE getUserID(IN Email VARCHAR(70), OUT User INT)
	BEGIN
		SELECT ID into User FROM users WHERE users.Email = Email;
	END //
	
	
	
	
/*Extrae los datos del vendedor cuando un usuario entra hacia su perfil*/	
DELIMITER //
CREATE PROCEDURE profile_seller_user_opinions(IN Email VARCHAR(75))
BEGIN
DECLARE rows_count INT;

SELECT users.Names, users.Email, seller.Profession, users.Description, seller.Calificaciones, profile.AVATAR, opinions.Opinion
FROM users
JOIN seller ON seller.ID_USER = users.ID 
JOIN profile ON profile.ID_USER = users.ID
JOIN opinions ON users.Email = opinions.Email_Seller
WHERE users.Email = Email;

SELECT FOUND_ROWS() INTO rows_count;

IF rows_count = 0 THEN
	CALL profile_seller_user(Email);
END IF;
END //


DELIMITER //
CREATE PROCEDURE profile_seller_user(IN Email VARCHAR(75))
BEGIN
SELECT users.Names, users.Email, seller.Profession, users.Description, seller.Calificaciones, profile.AVATAR
FROM users
JOIN seller ON seller.ID_USER = users.ID 
JOIN profile ON profile.ID_USER = users.ID
WHERE users.Email = Email;
END //




/*Extrae los datos del usuario cuando un usuario entra hacia su perfil*/
DELIMITER //
CREATE PROCEDURE profile_user(IN Email VARCHAR(75))
BEGIN
SELECT users.Names, users.Email, profile.AVATAR, users.IsSeller
FROM users
JOIN profile ON profile.ID_USER = users.ID 
WHERE users.Email = Email;
END //


DELIMITER //
CREATE PROCEDURE DeleteUsers(In Email VARCHAR(75))
BEGIN
DECLARE rows_count INT;
CALL profile_seller_user(Email);

SELECT FOUND_ROWS() INTO rows_count;

IF rows_count = 0 THEN
	DELETE FROM profile WHERE ID_USER = (SELECT ID FROM users WHERE users.Email = Email);
	DELETE FROM seller WHERE ID_USER = (SELECT ID FROM users WHERE users.Email = Email);
	DELETE FROM users WHERE users.Email = Email;
ELSE
	DELETE FROM profile WHERE ID_USER = (SELECT ID FROM users WHERE users.Email = Email);
	DELETE FROM users WHERE users.Email = Email;
END IF;

END //
	

/*Esta es una vista*/
CREATE VIEW posts AS 
SELECT designs.ID, users.Email, designs.Name_product, designs.Description, designs.Model_Route, designs.Screen_Model_Route, images.Route, catalog_designs.Type FROM designs JOIN catalog_designs ON catalog_designs.ID = designs.Type_Design JOIN images ON images.ID_PROJECT = designs.ID JOIN seller ON seller.ID = designs.ID_SELLER JOIN users ON users.ID = seller.ID_USER;



CREATE VIEW SellerByType AS
SELECT users.Names, users.Email, seller.Profession, users.Description, seller.Calificaciones, profile.AVATAR
FROM users
JOIN seller ON seller.ID_USER = users.ID 
JOIN profile ON profile.ID_USER = users.ID;

/*Esto es un trigger*/
CREATE TRIGGER updateIsSeller AFTER INSERT ON seller
FOR EACH ROW
UPDATE users SET IsSeller = TRUE WHERE ID = NEW.ID_USER;


/*Esto es un trigger*/
CREATE TRIGGER profileuser AFTER INSERT ON users
FOR EACH ROW 
INSERT INTO profile (ID_USER, AVATAR) VALUES (NEW.ID, 'avatar\\userDefault.png');


/*Esto es la unica transaccion que tenemos actualmente*/
START TRANSACTION;
INSERT INTO transactionsuserseller (EMAIL_SELLER, EMAIL_USER, ID_DESIGN, Quantity, Date) VALUES ('sebastianantoniochavira@gmail.com', 'chavirasebastian513@gmail.com', 10, '2', NOW());

COMMIT;


/*Esto es un trigger*/
DELIMITER //
CREATE TRIGGER purchase_sales_history AFTER INSERT ON transactionsuserseller
FOR EACH ROW
BEGIN
	INSERT INTO purchase_history (EMAIL_USER, EMAIL_USER_SELLER, ID_DESIGN) VALUES (NEW.EMAIL_SELLER, NEW.EMAIL_USER, NEW.ID_DESIGN);
	INSERT INTO sales_history (EMAIL_USER, EMAIL_USER_SELLER, ID_DESIGN) VALUES (NEW.EMAIL_SELLER, NEW.EMAIL_USER, NEW.ID_DESIGN);
END //
DELIMITER ; 






























