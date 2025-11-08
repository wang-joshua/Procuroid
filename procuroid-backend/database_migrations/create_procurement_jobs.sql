-- Create procurement_jobs table
CREATE TABLE IF NOT EXISTS public.procurement_jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    job_info JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '30 minutes'),
    status TEXT NOT NULL DEFAULT 'pending',
    output_result JSONB,
    
    -- Add constraints
    CONSTRAINT valid_status CHECK (status IN ('pending', 'in_progress', 'completed', 'failed', 'cancelled'))
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_procurement_jobs_user_id ON public.procurement_jobs(user_id);
CREATE INDEX IF NOT EXISTS idx_procurement_jobs_status ON public.procurement_jobs(status);
CREATE INDEX IF NOT EXISTS idx_procurement_jobs_created_at ON public.procurement_jobs(created_at);

-- Enable Row Level Security
ALTER TABLE public.procurement_jobs ENABLE ROW LEVEL SECURITY;

-- Create policy: Users can only see their own jobs
CREATE POLICY "Users can view own jobs" ON public.procurement_jobs
    FOR SELECT
    USING (auth.uid() = user_id);

-- Create policy: Users can insert their own jobs
CREATE POLICY "Users can insert own jobs" ON public.procurement_jobs
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Create policy: Users can update their own jobs
CREATE POLICY "Users can update own jobs" ON public.procurement_jobs
    FOR UPDATE
    USING (auth.uid() = user_id);

-- Create policy: Users can delete their own jobs (optional)
CREATE POLICY "Users can delete own jobs" ON public.procurement_jobs
    FOR DELETE
    USING (auth.uid() = user_id);

-- Add comment to table
COMMENT ON TABLE public.procurement_jobs IS 'Stores procurement job information for users';
COMMENT ON COLUMN public.procurement_jobs.job_info IS 'Full job details from the requirement form as JSON';
COMMENT ON COLUMN public.procurement_jobs.output_result IS 'Stores API/supplier call responses or computed results';

