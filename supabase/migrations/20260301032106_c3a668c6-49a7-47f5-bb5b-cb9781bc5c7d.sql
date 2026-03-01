
-- Allow anonymous users to check if any admin exists (for setup flow)
CREATE POLICY "Anyone can check admin existence" ON public.user_roles
  FOR SELECT USING (role = 'admin');
