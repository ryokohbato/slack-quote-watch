export type Lang = "en" | "jp";

interface Vocabulary {
  [key: string]: {
    // eslint-disable-next-line no-unused-vars
    [lang in Lang]: string;
  };
}

const vocabulary: Vocabulary = {
  "'s post was quoted": {
    en: "'s post was quoted",
    jp: "さんの投稿が引用されました",
  },
  "The post was cited": {
    en: "The post was cited",
    jp: "投稿が引用されました",
  },
};

export default vocabulary;
