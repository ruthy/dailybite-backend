CREATE TABLE public.step_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  steps INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, date)
);

CREATE INDEX idx_step_logs_user_date ON public.step_logs(user_id, date);
ALTER TABLE public.step_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read step logs" ON public.step_logs FOR SELECT USING (true);
CREATE POLICY "Anyone can insert step logs" ON public.step_logs FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update step logs" ON public.step_logs FOR UPDATE USING (true);
