import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/shared/components/ui/avatar';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';

import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';

interface IdeaCardProps {
  idea: {
    id: string;
    title: string;
    content: string;
    likeCount: number;
    createdAt: Date;
    author: {
      nickname: string;
      avatarUrl: string | null;
    };
  };
}

export default function IdeaCard({ idea }: IdeaCardProps) {
  return (
    <Card className="hover:bg-muted/50 cursor-pointer transition-colors">
      <CardHeader className="gpa-4 flex flex-row items-center pb-2">
        <Avatar className="size-10 border">
          <AvatarImage src={idea.author.avatarUrl || ''} />
          <AvatarFallback>{idea.author.nickname[0]}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <CardTitle className="text-base font-semibold">
            {idea.title}
          </CardTitle>
          <span className="text-muted-foreground text-xs">
            {idea.author.nickname} ·{' '}
            {formatDistanceToNow(new Date(idea.createdAt), {
              addSuffix: true,
              locale: ko,
            })}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-3 line-clamp-2 text-sm">
          {idea.content}
        </p>
        <div className="flex items-center gap-2">
          <div className="focus:ring-ring bg-secondary text-secondary-foreground hover:bg-secondary/80 inline-flex items-center rounded-full border border-transparent px-2.5 py-0.5 text-xs font-semibold transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none">
            좋아요 {idea.likeCount}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
