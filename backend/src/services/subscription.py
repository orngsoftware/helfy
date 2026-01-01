import stripe
from sqlalchemy.orm import Session
from sqlalchemy import select
from ..config import get_settings
from ..models import Users
from fastapi.exceptions import HTTPException

settings = get_settings()

stripe.api_key = settings.stripe_secret

def create_plus_checkout_session(customer_id: str) -> str:
    """Creates Stripe checkout session for Plus subscription and returns session id"""

    checkout_session = stripe.checkout.Session.create(
        customer=customer_id,
        success_url="http://localhost:5173/dashboard",
        cancel_url="http://localhost:5173/dashboard",
        payment_method_types=["card"],
        mode="subscription",
        line_items=[{
            "price": "price_1SWITYEAmky5NJk1mKhzvRHX", # this is test one 
            "quantity": 1
        }]
    )
    return checkout_session["url"]

def create_stripe_customer(db: Session, user: Users) -> None:
    """Creates new Stripe customer and sets stripe_customer_id"""
    customer = stripe.Customer.create(
        email=user.email
    )
    user.stripe_customer_id = customer.id
    db.commit()
    return None

def handle_stripe_event(db: Session, event: dict) -> None:
    if event.type == "checkout.session.completed":
        session = event.data.object
        user = db.execute(select(Users).where(
            Users.stripe_customer_id == session.customer)).scalar_one_or_none()
        user.subscription_status = "active"
    elif event.type == "invoice.paid":
        invoice = event.data.object
        user = db.execute(select(Users).where(
            Users.stripe_customer_id == invoice.customer)).scalar_one_or_none()
        if user.subscription_status != "active":
            user.subscription_status = "active"
    elif event.type == "invoice.payment_failed":
        invoice = event.data.object
        user = db.execute(select(Users).where(
            Users.stripe_customer_id == invoice.customer)).scalar_one_or_none()
        user.subscription_status = "past_due"
    elif event.type == "customer.subscription.deleted":
        subscription = event.data.object
        user = db.execute(select(Users).where(
            Users.stripe_customer_id == subscription.customer)).scalar_one_or_none()
        user.subscription_status = "canceled"

    db.commit()
    return None
        



