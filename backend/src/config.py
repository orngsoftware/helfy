from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import BaseModel
from functools import lru_cache

class DBSettings(BaseModel):
    db_user: str
    db_password: str
    db_name: str
    db_port: int = 5432
    db_host: str = "localhost"

    @property
    def get_db_url(self) -> str:
        return f"postgresql://{self.db_user}:{self.db_password}@{self.db_host}:{self.db_port}/{self.db_name}"

class AuthSettings(BaseModel):
    secret_key: str
    algorithm: str
    access_token_exp: int = 30
    
class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env")

    db: DBSettings = DBSettings()
    auth: AuthSettings = AuthSettings()

@lru_cache
def get_settings():
    return Settings()