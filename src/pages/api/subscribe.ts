import { NextApiRequest, NextApiResponse } from "next";
import { query as q } from "faunadb";
import { getSession } from "next-auth/client";
import { fauna } from "../../services/fauna";
import { stripe } from "../../services/stripe";

type User = {
  ref: {
    id: string;
  }
  data: {
    stripe_customer_id: string;
  }
}

const subscribe = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") { // Criando uma checkout session
    const session = await getSession({ req });

    const user = await fauna.query<User>(
      q.Get(
        q.Match(
          q.Index("user_by_email"),
          q.Casefold(session.user.email)
        )
      )
    )

    let customerId = user.data.stripe_customer_id

    if (!customerId) {
      // Criar um customer dentro do stripe
      const stripeCustomer = await stripe.customers.create({
        email: session.user.email,
        // metadata:
      });

      await fauna.query(
        q.Update(
          q.Ref(q.Collection("users"), user.ref.id),
          {
            data: {
              stripe_customer_id: stripeCustomer.id,
            }
          }
        )
      )

      customerId = stripeCustomer.id
    }

    const stripeCheckoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ["card"],
      billing_address_collection: "required", // Obriga o usuário a preencher o endereço
      line_items: [
        { price: "price_1JTvjfDdy2UnATVa4J34sl19", quantity: 1 }
      ],
      mode: "subscription", // Pagamento recorrente
      allow_promotion_codes: true, // Cupom de desconto
      success_url: process.env.STRIPE_SUCCESS_URL,
      cancel_url: process.env.STRIPE_CANCEL_URL,
    });

    return res.status(200).json({ sessionId: stripeCheckoutSession.id });
  } else {
    res.setHeader("Allow", "POST"); // Explicando para o front que essa rota só aceita POST
    res.status(405).end("Method not allowed");
  }
}

export default subscribe;