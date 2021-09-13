import { GetStaticProps } from "next";
import Head from "next/head";
import Prismic from "@prismicio/client";
import { RichText } from "prismic-dom";

import { getPrismicClient } from "../../services/prismic";

import styles from "./styles.module.scss";

type Post = {
  slug: string;
  title: string;
  excerpt: string;
  updatedAt: string;
}

interface PostsProps {
  posts: Post[];
}

export default function Posts({ posts }: PostsProps) {
  return (
    <>
      <Head>
        <title>Posts | ig.news</title>
      </Head>
      <main className={styles.container}>
        <div className={styles.posts}>
          { posts.map(post => (
            <a key={post.slug} href="#">
              <time>{post.updatedAt}</time>
              <strong>{post.title}</strong>
              <p>{post.excerpt}</p>
            </a>
          )) }
        </div>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();

  const response = await prismic.query([
    Prismic.Predicates.at("document.type", "post")
  ], {
    fetch: ["post.title", "post.content"],
    pageSize: 100,
  });

  const posts = response.results.map(post => {
    const excerpt = post.data.content.find(content => {
      return content.type === "paragraph"
    })?.text ?? "";

    const updatedAt = new Date(post.last_publication_date).toLocaleDateString(
      "pt-BR", { day: "2-digit", month: "long", year: "numeric", }
    );

    return {
      slug: post.uid,
      // Em vez de post.data.title[0].text
      title: RichText.asText(post.data.title),
      excerpt,
      updatedAt,
    };
  });

  return {
    props: { posts },
  };
}