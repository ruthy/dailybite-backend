-- Add missing UNIQUE constraint on bloating_logs for upsert to work
ALTER TABLE public.bloating_logs ADD CONSTRAINT bloating_logs_user_date_unique UNIQUE(user_id, date);
