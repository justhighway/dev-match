import { ideas, users } from './schema';

import { db } from './index'; // 이제 import 순서 상관 없음!

async function main() {
  console.log('🌱 Seeding start...');

  const TEST_USER_ID = 'b466d3a8-4444-4444-4444-444444444444';

  await db
    .insert(users)
    .values({
      id: TEST_USER_ID,
      email: 'test@devmatch.com',
      nickname: '코딩하는고양이',
      avatarUrl: 'https://api.dicebear.com/9.x/notionists/svg?seed=Felix',
      githubUrl: 'https://github.com/test',
      workStyleTags: ['#새벽반', '#문서화중시'],
    })
    .onConflictDoNothing();

  await db.insert(ideas).values([
    {
      authorId: TEST_USER_ID,
      title: '개발자들을 위한 소개팅 앱',
      content: 'GitHub 잔디 심은 횟수로 매칭해주는 앱입니다. 반응 어떨까요?',
    },
    {
      authorId: TEST_USER_ID,
      title: 'AI가 짜주는 다이어트 식단',
      content: '냉장고 사진 찍으면 레시피 추천해주는 서비스 만들어보고 싶어요.',
    },
  ]);

  console.log('🌱 Seeding finished!');
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
