-- Add recurring transaction columns to transactions
ALTER TABLE transactions
  ADD COLUMN recurrence_frequency text NOT NULL DEFAULT 'never',
  ADD COLUMN recurring_next_date timestamptz,
  ADD COLUMN recurring_parent_id uuid REFERENCES transactions(id) ON DELETE SET NULL,
  ADD COLUMN is_recurring_instance boolean NOT NULL DEFAULT false;

-- Add recurring transaction columns to income_transactions
ALTER TABLE income_transactions
  ADD COLUMN recurrence_frequency text NOT NULL DEFAULT 'never',
  ADD COLUMN recurring_next_date timestamptz,
  ADD COLUMN recurring_parent_id uuid REFERENCES income_transactions(id) ON DELETE SET NULL,
  ADD COLUMN is_recurring_instance boolean NOT NULL DEFAULT false;
