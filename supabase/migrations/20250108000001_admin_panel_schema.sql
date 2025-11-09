-- Admin Panel Database Schema
-- This migration adds tables for dynamic configuration management

-- Create admin_users table with role-based access
CREATE TABLE IF NOT EXISTS public.admin_users (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    role TEXT CHECK (role IN ('super_admin', 'content_admin', 'support_admin', 'creator_admin')) NOT NULL DEFAULT 'support_admin',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    last_login_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true NOT NULL
);

-- Create app_config table for key-value configuration
CREATE TABLE IF NOT EXISTS public.app_config (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    key TEXT UNIQUE NOT NULL,
    value JSONB NOT NULL,
    description TEXT,
    category TEXT DEFAULT 'general',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_by UUID REFERENCES public.admin_users(id)
);

-- Create ai_prompts table with version control
CREATE TABLE IF NOT EXISTS public.ai_prompts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    key TEXT NOT NULL,
    version INTEGER NOT NULL DEFAULT 1,
    prompt_text TEXT NOT NULL,
    model TEXT DEFAULT 'gpt-4o-mini',
    temperature NUMERIC(3,2) DEFAULT 0.7,
    max_tokens INTEGER DEFAULT 500,
    is_active BOOLEAN DEFAULT false,
    rollout_percentage INTEGER DEFAULT 0 CHECK (rollout_percentage >= 0 AND rollout_percentage <= 100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    created_by UUID REFERENCES public.admin_users(id),

    UNIQUE(key, version)
);

-- Create content_templates table with multi-language support
CREATE TABLE IF NOT EXISTS public.content_templates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    key TEXT NOT NULL,
    language TEXT DEFAULT 'en',
    content TEXT NOT NULL,
    variables JSONB DEFAULT '[]'::jsonb,
    category TEXT DEFAULT 'general',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_by UUID REFERENCES public.admin_users(id),

    UNIQUE(key, language)
);

-- Create feature_flags table
CREATE TABLE IF NOT EXISTS public.feature_flags (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    key TEXT UNIQUE NOT NULL,
    is_enabled BOOLEAN DEFAULT false,
    rollout_percentage INTEGER DEFAULT 0 CHECK (rollout_percentage >= 0 AND rollout_percentage <= 100),
    target_user_ids JSONB DEFAULT '[]'::jsonb,
    description TEXT,
    scheduled_enable_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_by UUID REFERENCES public.admin_users(id)
);

-- Create font_packs_meta table for dynamic pack management
CREATE TABLE IF NOT EXISTS public.font_packs_meta (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    pack_id TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    price_usd NUMERIC(10,2) DEFAULT 0.00,
    is_free BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    download_count INTEGER DEFAULT 0,
    pack_data_url TEXT,
    thumbnail_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_by UUID REFERENCES public.admin_users(id)
);

-- Create system_notifications table
CREATE TABLE IF NOT EXISTS public.system_notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT CHECK (type IN ('info', 'warning', 'error', 'success')) DEFAULT 'info',
    platforms JSONB DEFAULT '["web", "mobile"]'::jsonb,
    action_url TEXT,
    start_date TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    created_by UUID REFERENCES public.admin_users(id)
);

-- Create admin_audit_log table
CREATE TABLE IF NOT EXISTS public.admin_audit_log (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    admin_id UUID REFERENCES public.admin_users(id) ON DELETE SET NULL,
    action_type TEXT NOT NULL,
    resource_type TEXT NOT NULL,
    resource_id TEXT,
    old_value JSONB,
    new_value JSONB,
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create indexes for admin tables
CREATE INDEX IF NOT EXISTS idx_admin_users_role ON public.admin_users(role);
CREATE INDEX IF NOT EXISTS idx_app_config_key ON public.app_config(key);
CREATE INDEX IF NOT EXISTS idx_app_config_category ON public.app_config(category);
CREATE INDEX IF NOT EXISTS idx_ai_prompts_key ON public.ai_prompts(key);
CREATE INDEX IF NOT EXISTS idx_ai_prompts_is_active ON public.ai_prompts(is_active);
CREATE INDEX IF NOT EXISTS idx_content_templates_key ON public.content_templates(key);
CREATE INDEX IF NOT EXISTS idx_content_templates_language ON public.content_templates(language);
CREATE INDEX IF NOT EXISTS idx_feature_flags_key ON public.feature_flags(key);
CREATE INDEX IF NOT EXISTS idx_feature_flags_is_enabled ON public.feature_flags(is_enabled);
CREATE INDEX IF NOT EXISTS idx_font_packs_meta_pack_id ON public.font_packs_meta(pack_id);
CREATE INDEX IF NOT EXISTS idx_font_packs_meta_is_active ON public.font_packs_meta(is_active);
CREATE INDEX IF NOT EXISTS idx_system_notifications_is_active ON public.system_notifications(is_active);
CREATE INDEX IF NOT EXISTS idx_system_notifications_dates ON public.system_notifications(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_admin_audit_log_admin_id ON public.admin_audit_log(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_audit_log_created_at ON public.admin_audit_log(created_at DESC);

-- Enable Row Level Security on admin tables
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feature_flags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.font_packs_meta ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_audit_log ENABLE ROW LEVEL SECURITY;

-- RLS Policies for admin_users
CREATE POLICY "Admin users can view other admins"
    ON public.admin_users FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.admin_users
            WHERE id = auth.uid() AND is_active = true
        )
    );

-- RLS Policies for app_config (admin read/write)
CREATE POLICY "Admins can view config"
    ON public.app_config FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.admin_users
            WHERE id = auth.uid() AND is_active = true
        )
    );

CREATE POLICY "Admins can update config"
    ON public.app_config FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.admin_users
            WHERE id = auth.uid() AND is_active = true
        )
    );

CREATE POLICY "Admins can insert config"
    ON public.app_config FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.admin_users
            WHERE id = auth.uid() AND is_active = true
        )
    );

-- Similar policies for other admin tables
CREATE POLICY "Admins can manage AI prompts"
    ON public.ai_prompts FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.admin_users
            WHERE id = auth.uid() AND is_active = true
        )
    );

CREATE POLICY "Admins can manage content templates"
    ON public.content_templates FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.admin_users
            WHERE id = auth.uid() AND is_active = true
        )
    );

CREATE POLICY "Admins can manage feature flags"
    ON public.feature_flags FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.admin_users
            WHERE id = auth.uid() AND is_active = true
        )
    );

CREATE POLICY "Admins can manage font packs meta"
    ON public.font_packs_meta FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.admin_users
            WHERE id = auth.uid() AND is_active = true
        )
    );

CREATE POLICY "Everyone can view active font packs meta"
    ON public.font_packs_meta FOR SELECT
    USING (is_active = true);

CREATE POLICY "Admins can manage system notifications"
    ON public.system_notifications FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.admin_users
            WHERE id = auth.uid() AND is_active = true
        )
    );

CREATE POLICY "Everyone can view active notifications"
    ON public.system_notifications FOR SELECT
    USING (
        is_active = true
        AND start_date <= timezone('utc'::text, now())
        AND (end_date IS NULL OR end_date >= timezone('utc'::text, now()))
    );

CREATE POLICY "Admins can view audit log"
    ON public.admin_audit_log FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.admin_users
            WHERE id = auth.uid() AND is_active = true AND role = 'super_admin'
        )
    );

CREATE POLICY "Admins can insert audit log"
    ON public.admin_audit_log FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.admin_users
            WHERE id = auth.uid() AND is_active = true
        )
    );

-- Triggers for updated_at timestamps
CREATE TRIGGER on_admin_user_updated
    BEFORE UPDATE ON public.admin_users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER on_app_config_updated
    BEFORE UPDATE ON public.app_config
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER on_content_template_updated
    BEFORE UPDATE ON public.content_templates
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER on_feature_flag_updated
    BEFORE UPDATE ON public.feature_flags
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER on_font_pack_meta_updated
    BEFORE UPDATE ON public.font_packs_meta
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Seed initial app configuration
INSERT INTO public.app_config (key, value, description, category) VALUES
    ('max_input_length', '200', 'Maximum character length for text input', 'general'),
    ('free_styles_limit', '10', 'Number of styles available to free users', 'monetization'),
    ('pro_monthly_price_usd', '2.99', 'Monthly subscription price in USD', 'monetization'),
    ('enable_ai_suggestions', 'true', 'Enable AI-powered style suggestions', 'features'),
    ('maintenance_mode', 'false', 'Enable maintenance mode', 'system')
ON CONFLICT (key) DO NOTHING;

-- Seed initial feature flags
INSERT INTO public.feature_flags (key, is_enabled, rollout_percentage, description) VALUES
    ('cloud_sync', true, 100, 'Enable cloud favorites synchronization'),
    ('analytics_tracking', true, 100, 'Enable analytics event tracking'),
    ('ai_recommendations', false, 0, 'Enable AI-powered style recommendations'),
    ('premium_packs', false, 0, 'Enable premium font pack purchases')
ON CONFLICT (key) DO NOTHING;
