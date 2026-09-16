from urllib.parse import quote_plus
from typing import List

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=(".env", "backend/.env"), extra="ignore")

    app_name: str = "Orbita API"
    secret_key: str = "dev-only-secret-do-not-use-in-production"
    mongodb_uri: str = (
        "mongodb+srv://anshunishadhamptons_db_user:<db_password>"
        "@job-automation.es2fo8i.mongodb.net/?appName=job-automation"
    )
    mongodb_db: str = "orbita"
    mongodb_password: str = ""
    access_token_minutes: int = 30
    refresh_token_days: int = 7
    cors_origins: str = "http://localhost:5174,http://localhost:5173"
    seed_demo_data: bool = True
    allow_public_read: bool = True
    demo_email: str = "prabhhav@zintellix.com"
    demo_password: str = "orbita-demo-123"
    frontend_url: str = "http://localhost:5173"
    api_public_url: str = "http://localhost:8000"
    google_client_id: str = ""
    google_client_secret: str = ""
    github_client_id: str = ""
    github_client_secret: str = ""
    microsoft_client_id: str = ""
    microsoft_client_secret: str = ""
    microsoft_tenant: str = "common"

    @property
    def cors_origin_list(self) -> List[str]:
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]

    @property
    def mongodb_uri_resolved(self) -> str:
        uri = self.mongodb_uri
        password = (self.mongodb_password or "").strip()
        if password:
            uri = uri.replace("<db_password>", quote_plus(password))
        return uri


settings = Settings()
