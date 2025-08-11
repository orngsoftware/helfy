import urllib.parse
import httpx
import jwt
from ..config import get_settings

settings = get_settings()

def generate_google_auth_redirect_uri():
    query_params = {
        "client_id": settings.oauth_google_client_id,
        "redirect_uri": "http://localhost:5173/auth/google",
        "response_type": "code",
        "scope": " ".join(["openid", "email", "profile"])
        # state: ...
    }

    query_string = urllib.parse.urlencode(query_params, quote_via=urllib.parse.quote)
    base_url = "https://accounts.google.com/o/oauth2/v2/auth"
    return f"{base_url}?{query_string}"

def handle_code(code: str, key: str | None = None):
    """Handles Google code and returns decoded data"""

    google_token_url = "https://oauth2.googleapis.com/token"
    response = httpx.post(url=google_token_url, data={
            "client_id": settings.oauth_google_client_id,
            "client_secret": settings.oauth_google_client_secret,
            "grant_type": "authorization_code",
            "redirect_uri": "http://localhost:5173/auth/google",
            "code": code
    })

    decoded = jwt.decode(response.json()['id_token'], 
                         algorithms=['RS256'], 
                         options={"verify_signature": False }) # decode_jwt(token, algorithms) verify signature (google public key)
    if not key:
        return decoded
    return decoded.get(key)