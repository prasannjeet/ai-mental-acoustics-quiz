CREATE DATABASE notenirvana;
CREATE USER 'notenirvana'@'%' IDENTIFIED BY 'notenirvana';
GRANT ALL PRIVILEGES ON notenirvana.* TO 'notenirvana'@'%' IDENTIFIED BY 'notenirvana';