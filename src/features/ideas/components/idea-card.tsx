import PostCard from '@/shared/components/ui/post-card';

interface IdeaCardProps {
  idea: {
    id: string;
    title: string;
    content: string;
    likeCount: number;
    bookmarkCount: number;
    viewCount: number;
    createdAt: Date;
    author: {
      nickname: string;
      avatarUrl: string | null;
    };
  };
}

export default function IdeaCard({ idea }: IdeaCardProps) {
  return (
    <PostCard
      variant="idea"
      href={`/ideas/${idea.id}`}
      title={idea.title}
      summary={idea.content}
      author={idea.author}
      likeCount={idea.likeCount}
      bookmarkCount={idea.bookmarkCount}
      viewCount={idea.viewCount}
      createdAt={idea.createdAt}
    />
  );
}
