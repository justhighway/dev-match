export interface PostCardAuthor {
  nickname: string;
  avatarUrl: string | null;
}

interface PostCardBase {
  title: string;
  summary: string;
  href: string;
  author: PostCardAuthor;
  likeCount: number;
  bookmarkCount: number;
  viewCount: number;
  createdAt: Date;
  tags?: string[];
}

export interface RecruitmentPostCardProps extends PostCardBase {
  variant: 'recruitment';
  isClosed: boolean;
}

export interface IdeaPostCardProps extends PostCardBase {
  variant?: 'idea';
  isClosed?: never;
}

export type PostCardProps = RecruitmentPostCardProps | IdeaPostCardProps;
