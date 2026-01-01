from pydantic_settings import BaseSettings, SettingsConfigDict
from functools import lru_cache

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env")
    db_user: str
    db_password: str
    db_name: str
    db_port: int = 5432
    db_host: str = "localhost"

    @property
    def get_db_url(self) -> str:
        return f"postgresql://{self.db_user}:{self.db_password}@{self.db_host}:{self.db_port}/{self.db_name}"
    
    secret_key: str
    algorithm: str
    access_token_exp: int = 30
    refresh_token_exp: int = 20

    oauth_google_client_id: str
    oauth_google_client_secret: str

    aws_s3_bucket_name: str

    stripe_secret: str
    stripe_plus_product_id: str
    stripe_endpoint_secret: str
    
@lru_cache
def get_settings():
    return Settings()