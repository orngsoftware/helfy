from pydantic_settings import BaseSettings, SettingsConfigDict
from functools import lru_cache

class Settings(BaseSettings):
    project_name: str = "Helfy"
    db_user: str
    db_password: str
    db_name: str
    db_port: int = 5432
    db_host: str = "localhost"

    model_config = SettingsConfigDict(env_file=".env")

    @property
    def db_url(self) -> str:
        return f"postgresql://{self.db_user}:{self.db_password}@{self.db_host}:{self.db_port}/{self.db_name}"
    
@lru_cache
def get_settings():
    return Settings()