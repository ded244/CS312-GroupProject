-- DROP SCHEMA public;

CREATE SCHEMA public AUTHORIZATION pg_database_owner;

-- DROP SEQUENCE transactions_transaction_id_seq;

CREATE SEQUENCE transactions_transaction_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;-- public.users definition

-- Drop table

-- DROP TABLE users;

CREATE TABLE users (
	user_id varchar(50) NOT NULL,
	"password" varchar(50) NOT NULL,
	first_name varchar(50) NOT NULL,
	last_name varchar(50) NOT NULL,
	CONSTRAINT users_first_name_not_null NOT NULL first_name,
	CONSTRAINT users_last_name_not_null NOT NULL last_name,
	CONSTRAINT users_password_not_null NOT NULL password,
	CONSTRAINT users_pkey PRIMARY KEY (user_id),
	CONSTRAINT users_user_id_not_null NOT NULL user_id
);


-- public.accounts definition

-- Drop table

-- DROP TABLE accounts;

CREATE TABLE accounts (
	account_number varchar(20) NOT NULL,
	routing_number varchar(9) NOT NULL,
	user_id varchar(50) NOT NULL,
	account_name varchar(100) NOT NULL,
	account_type varchar(50) NOT NULL,
	balance numeric(15, 2) DEFAULT 0.00 NOT NULL,
	CONSTRAINT accounts_account_name_not_null NOT NULL account_name,
	CONSTRAINT accounts_account_number_not_null NOT NULL account_number,
	CONSTRAINT accounts_account_type_not_null NOT NULL account_type,
	CONSTRAINT accounts_balance_not_null NOT NULL balance,
	CONSTRAINT accounts_pkey PRIMARY KEY (account_number, routing_number),
	CONSTRAINT accounts_routing_number_not_null NOT NULL routing_number,
	CONSTRAINT accounts_user_id_not_null NOT NULL user_id,
	CONSTRAINT fk_account_owner FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);


-- public.transactions definition

-- Drop table

-- DROP TABLE transactions;

CREATE TABLE transactions (
	transaction_id serial4 NOT NULL,
	account_number varchar(20) NOT NULL,
	routing_number varchar(9) NOT NULL,
	transaction_type varchar(20) NOT NULL,
	amount numeric(15, 2) NOT NULL,
	location_of_purchase varchar(255) NULL,
	category varchar(100) NULL,
	transfer_destination_account varchar(20) NULL,
	transaction_date timestamptz DEFAULT CURRENT_TIMESTAMP NULL,
	CONSTRAINT transactions_account_number_not_null NOT NULL account_number,
	CONSTRAINT transactions_amount_not_null NOT NULL amount,
	CONSTRAINT transactions_pkey PRIMARY KEY (transaction_id),
	CONSTRAINT transactions_routing_number_not_null NOT NULL routing_number,
	CONSTRAINT transactions_transaction_id_not_null NOT NULL transaction_id,
	CONSTRAINT transactions_transaction_type_check CHECK (((transaction_type)::text = ANY ((ARRAY['deposit'::character varying, 'withdrawal'::character varying, 'transfer'::character varying])::text[]))),
	CONSTRAINT transactions_transaction_type_not_null NOT NULL transaction_type,
	CONSTRAINT fk_transaction_account FOREIGN KEY (account_number,routing_number) REFERENCES accounts(account_number,routing_number) ON DELETE CASCADE
);