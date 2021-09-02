import Head from "next/head";
import styles from "./styles.module.scss";

export default function Posts() {
  return (
    <>
      <Head>
        <title>Posts | ig.news</title>
      </Head>
      <main className={styles.container}>
        <div className={styles.posts}>
          <a href="#">
            <time>02 de setembro de 2021</time>
            <strong>Título do post</strong>
            <p>Nunca, em toda a história cristã, a filosofia do cidadão comum esteve tão desesperadora.</p>
          </a>
          <a href="#">
            <time>02 de setembro de 2021</time>
            <strong>Título do post</strong>
            <p>Nunca, em toda a história cristã, a filosofia do cidadão comum esteve tão desesperadora.</p>
          </a>
          <a href="#">
            <time>02 de setembro de 2021</time>
            <strong>Título do post</strong>
            <p>Nunca, em toda a história cristã, a filosofia do cidadão comum esteve tão desesperadora.</p>
          </a>
        </div>
      </main>
    </>
  );
}