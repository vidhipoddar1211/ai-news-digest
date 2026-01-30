"""
API route modules.
Each file handles routes for a specific feature area.
"""

from .auth import router as auth_router

__all__ = ["auth_router"]
