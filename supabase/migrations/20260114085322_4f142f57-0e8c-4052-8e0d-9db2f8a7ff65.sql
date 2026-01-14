-- Create markers table
CREATE TABLE public.markers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  color_type TEXT NOT NULL CHECK (color_type IN ('blue', 'green', 'split')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + INTERVAL '30 minutes'),
  client_id TEXT NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.markers ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read markers (public app)
CREATE POLICY "Anyone can view markers" 
ON public.markers 
FOR SELECT 
USING (true);

-- Allow anyone to insert markers (anonymous users)
CREATE POLICY "Anyone can create markers" 
ON public.markers 
FOR INSERT 
WITH CHECK (true);

-- Enable realtime for markers table
ALTER PUBLICATION supabase_realtime ADD TABLE public.markers;

-- Create index for faster expired marker queries
CREATE INDEX idx_markers_expires_at ON public.markers (expires_at);

-- Create function to delete expired markers
CREATE OR REPLACE FUNCTION public.delete_expired_markers()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.markers WHERE expires_at <= now();
END;
$$;

-- Create function to check rate limit (1 marker per 2 minutes per client)
CREATE OR REPLACE FUNCTION public.check_rate_limit(p_client_id TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  last_marker_time TIMESTAMP WITH TIME ZONE;
BEGIN
  SELECT created_at INTO last_marker_time
  FROM public.markers
  WHERE client_id = p_client_id
  ORDER BY created_at DESC
  LIMIT 1;
  
  IF last_marker_time IS NULL THEN
    RETURN TRUE;
  END IF;
  
  IF now() - last_marker_time >= INTERVAL '2 minutes' THEN
    RETURN TRUE;
  END IF;
  
  RETURN FALSE;
END;
$$;