import { type ParsedUrlQuery } from "querystring";

type GetStaticPropsReturnType<P> = {
  props: P;
  revalidate?: number | boolean;
};

export type InferredStaticProps<T> = T extends (ctx?: {
  params?: ParsedUrlQuery;
  preview?: boolean;
}) => Promise<GetStaticPropsReturnType<infer P>>
  ? GetStaticPropsReturnType<P>["props"]
  : never;
