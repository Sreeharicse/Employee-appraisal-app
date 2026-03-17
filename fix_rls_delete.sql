-- ============================================================
-- FIX: Add RLS DELETE policies for cycles and related tables
-- Run this in your Supabase SQL Editor
-- ============================================================

-- 1. Allow only admin users to DELETE cycles
CREATE POLICY "Allow admin to delete cycles"
ON public.cycles
FOR DELETE
USING (
    (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);

-- 2. Allow admin users to DELETE self_reviews
CREATE POLICY "Allow admin to delete self_reviews"
ON public.self_reviews
FOR DELETE
USING (
    (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);

-- 3. Allow admin users to DELETE evaluations
CREATE POLICY "Allow admin to delete evaluations"
ON public.evaluations
FOR DELETE
USING (
    (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);

-- 4. Allow admin users to DELETE approvals
CREATE POLICY "Allow admin to delete approvals"
ON public.approvals
FOR DELETE
USING (
    (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);
