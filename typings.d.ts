type Base = {
  _createdAt: string;
  _id: string;
  _rev: string;
  _type: string;
  _updatedAt: string;
};

type Item = {
  title: string;
  slug: string;
  price: number;
  quantity: number;
  image: Image;
  checked: boolean;
}

interface Image {
  _type: "image";
  asset: Reference;
}

interface Reference {
  _type: "reference";
  _ref: string;
}

interface Slug {
  _type: "slug";
  current: string;
}

interface Title {
  _type: "string";
  current: string;
}

interface Category extends Base {
  description: string;
  title: string;
}

interface Post extends Base {
  price: number;
  body: Block[];
  categories: Category[];
  images: Image[];
  slug: Slug;
  title: string;
  description: string;
}

interface Block {
  _key: string;
  _type: "block";
  children: Span[];
  markDefs: any[];
  style: "normal" | "h1" | "h2" | "h3" | "h4" | "blockquote";
}

