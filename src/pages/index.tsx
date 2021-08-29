import { GetServerSideProps } from "next";

import Head from "next/head";
import Image from "next/image";

import { SubscribeButton } from "../components/SubscribeButton";
import { stripe } from "../services/stripe";

import avatarImg from "../../public/images/avatar.svg";

import styles from "./home.module.scss";

interface HomeProps {
  product: {
    priceId: string;
    amount: number;
  }
}

export default function Home({ product }: HomeProps) {
  return (
    <>
      <Head>
        <title>Home | ig.news</title>
      </Head>

      <main className={styles.contentContainer}>
        <section className={styles.hero}>
          <span>👏 Hey, welcome</span>
          <h1>News about the <span>React</span> world.</h1>
          <p>
            Get access to all the publications <br />
            <span>for {product.amount} month</span>
          </p>
          <SubscribeButton priceId={product.priceId} />
        </section>

        <Image src={avatarImg} alt="Girl coding" />
      </main>
    </>
  )
}

// Todo que é retornado do getServerSideProps fica acessível no props de Home
// Todo código desta função é executado no servidor node do Next, que está rodando no terminal
export const getServerSideProps: GetServerSideProps = async () => {
  const price = await stripe.prices.retrieve("price_1JTvjfDdy2UnATVa4J34sl19", {
    expand: ["product"], // Para ter acesso às informações do produto, não apenas o preço
  });

  const product = {
    priceId: price.id,
    amount: new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price.unit_amount / 100), // preço é em centavos
  };

  return {
    props: {
      product,
    }
  }
}