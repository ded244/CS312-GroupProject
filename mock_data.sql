-- Demo data for users, accounts, and transactions

INSERT INTO users (user_id, "password", first_name, last_name)
VALUES
    ('admin', 'password', 'Admin', 'User'),
    ('john.doe', 'password', 'John', 'Doe'),
    ('riley.chen', 'password', 'Riley', 'Chen')
ON CONFLICT (user_id) DO NOTHING;

INSERT INTO accounts (
    account_number,
    routing_number,
    user_id,
    account_name,
    account_type,
    balance
)
VALUES
    ('0000000001', '000000001', 'admin', 'Checking', 'checking', 1250.00),
    ('0000000002', '000000001', 'admin', 'Rainy Day Savings', 'savings', 4800.50),
    ('0000000003', '000000001', 'john.doe', 'Main Checking', 'checking', 925.75)
ON CONFLICT (account_number, routing_number) DO NOTHING;

INSERT INTO transactions (
    account_number,
    routing_number,
    transaction_type,
    amount,
    location_of_purchase,
    category,
    transaction_date
)
SELECT
    seed.account_number,
    seed.routing_number,
    seed.transaction_type,
    seed.amount,
    seed.location_of_purchase,
    seed.category,
    seed.transaction_date
FROM (VALUES
    ('0000000001', '000000001', 'deposit', 1500.00, NULL, 'payroll', '2026-10-01 09:00:00+00'::timestamptz),
    ('0000000001', '000000001', 'withdrawal', 42.50, 'Sample Grocery Store', 'groceries', '2026-10-03 14:30:00+00'::timestamptz),
    ('0000000002', '000000001', 'deposit', 200.00, NULL, 'savings', '2026-10-05 10:00:00+00'::timestamptz),
    ('0000000003', '000000001', 'withdrawal', 18.25, 'Sample Coffee Shop', 'dining', '2026-10-06 08:15:00+00'::timestamptz)
) AS seed(
    account_number,
    routing_number,
    transaction_type,
    amount,
    location_of_purchase,
    category,
    transaction_date
)
WHERE NOT EXISTS (
    SELECT 1
    FROM transactions AS existing
    WHERE existing.account_number = seed.account_number
      AND existing.routing_number = seed.routing_number
      AND existing.transaction_type = seed.transaction_type
      AND existing.amount = seed.amount
      AND existing.transaction_date = seed.transaction_date
);
