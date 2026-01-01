import { loadStripe } from "@stripe/stripe-js";

const STRIPE_PUBLIC = "pk_test_51SWEcHEAmky5NJk1aiXK2uRCn5gdYg58055GYqQfDUuD69R4eN5SyEHZpLIiZxOuLDCKeGNCds1zQSMxDhhcfbFr00hPJP6QW9"

export const stripe = await loadStripe(STRIPE_PUBLIC);
