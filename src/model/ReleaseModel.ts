export interface Release {
  tag_name: string;
  author: author;
  assets: asset[];
}

interface author {
  login: string;
  avatar_url: string;
}

interface asset {
  name: string;
  size: number;
  download_count: number;
  created_at: Date;
  updated_at: Date;
}
