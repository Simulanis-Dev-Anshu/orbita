from typing import List

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    app_name: str = "Orbita API"
    secret_key: str = "dev-only-secret-do-not-use-in-production"
    database_url: str = "sqlite+aiosqlite:///./orbita.db"
    access_token_minutes: int = 30
    refresh_token_days: int = 7
    cors_origins: str = "http://localhost:5174,http://localhost:5173"
    seed_demo_data: bool = True
    allow_public_read: bool = True
    demo_email: str = "prabhhav@zintellix.com"
    demo_password: str = "orbita-demo-123"

    @property
    def cors_origin_list(self) -> List[str]:
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]


settings = Settings()
