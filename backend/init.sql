-- Define the enum type for state
CREATE TYPE transaction_outbox_state AS ENUM ('failed', 'succeeded');

-- Create the transaction_outbox table
CREATE TABLE transaction_outbox (
    correlation_id UUID NOT NULL PRIMARY KEY,
    state transaction_outbox_state NOT NULL,
    is_finalized BOOLEAN NOT NULL DEFAULT FALSE
);

-- Create an index
CREATE INDEX idx_transaction_outbox_is_finalized ON transaction_outbox(is_finalized);

-- Create a publication for the table
CREATE PUBLICATION transaction_outbox_pub FOR TABLE transaction_outbox;
