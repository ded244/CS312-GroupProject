CREATE TABLE IF NOT EXISTS users (
	user_id varchar(50) NOT NULL,
	"password" varchar(50) NOT NULL,
	first_name varchar(50) NOT NULL,
	last_name varchar(50) NOT NULL,
	CONSTRAINT users_pkey PRIMARY KEY (user_id)
);


CREATE TABLE IF NOT EXISTS accounts (
	account_number varchar(20) NOT NULL,
	routing_number varchar(9) NOT NULL,
	user_id varchar(50) NOT NULL,
	account_name varchar(100) NOT NULL,
	account_type varchar(50) NOT NULL,
	balance numeric(15, 2) DEFAULT 0.00 NOT NULL,
	CONSTRAINT accounts_pkey PRIMARY KEY (account_number, routing_number),
	CONSTRAINT fk_account_owner FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);


CREATE TABLE IF NOT EXISTS transactions (
	transaction_id serial4 NOT NULL,
	account_number varchar(20) NOT NULL,
	routing_number varchar(9) NOT NULL,
	transaction_type varchar(20) NOT NULL,
	amount numeric(15, 2) NOT NULL,
	location_of_purchase varchar(255) NULL,
	category varchar(100) NULL,
	transfer_destination_account varchar(20) NULL,
	transaction_date timestamptz DEFAULT CURRENT_TIMESTAMP NULL,
	CONSTRAINT transactions_pkey PRIMARY KEY (transaction_id),
	CONSTRAINT transactions_transaction_type_check CHECK (((transaction_type)::text = ANY ((ARRAY['deposit'::character varying, 'withdrawal'::character varying, 'transfer'::character varying])::text[]))),
	CONSTRAINT fk_transaction_account FOREIGN KEY (account_number,routing_number) REFERENCES accounts(account_number,routing_number) ON DELETE CASCADE
);
