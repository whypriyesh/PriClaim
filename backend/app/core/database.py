from supabase import create_client, Client
from app.core.config import settings


def get_supabase_client() -> Client:
    """Get Supabase client with anon key (for auth flows)"""
    return create_client(settings.supabase_url, settings.supabase_key)


def get_supabase_admin() -> Client:
    """Get Supabase client with service role key (for backend operations)"""
    return create_client(settings.supabase_url, settings.supabase_service_key)


# Default admin client for backend operations
supabase: Client = get_supabase_admin()