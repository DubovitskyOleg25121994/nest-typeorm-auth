CREATE USER super_user;

CREATE DATABASE super_user;
ALTER USER super_user WITH PASSWORD 'super_user';
GRANT ALL PRIVILEGES ON DATABASE dev_db TO super_user;
