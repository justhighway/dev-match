import { db } from './index';
import { ideasTable, recruitmentsTable, usersTable } from './schema';

async function main() {
  console.log('🌱 Seeding start...');

  const TEST_USER_ID = 'b466d3a8-4444-4444-4444-444444444444';
  const USER_2_ID = 'b466d3a8-5555-5555-5555-555555555555';
  const USER_3_ID = 'b466d3a8-6666-6666-6666-666666666666';

  await db
    .insert(usersTable)
    .values([
      {
        id: TEST_USER_ID,
        email: 'test@devmatch.com',
        nickname: '코딩하는고양이',
        avatarUrl: 'https://api.dicebear.com/9.x/notionists/svg?seed=Felix',
        githubUrl: 'https://github.com/test',
        workStyleTags: ['#새벽반', '#문서화중시'],
      },
      {
        id: USER_2_ID,
        email: 'dev2@devmatch.com',
        nickname: '밤새는개발자',
        avatarUrl: 'https://api.dicebear.com/9.x/notionists/svg?seed=Coco',
        githubUrl: 'https://github.com/dev2',
        workStyleTags: ['#야작가능', '#빠른피드백'],
      },
      {
        id: USER_3_ID,
        email: 'dev3@devmatch.com',
        nickname: '사이드킥',
        avatarUrl: 'https://api.dicebear.com/9.x/notionists/svg?seed=Mochi',
        githubUrl: 'https://github.com/dev3',
        workStyleTags: ['#주말개발', '#꼼꼼한코드리뷰'],
      },
    ])
    .onConflictDoNothing();

  await db
    .insert(ideasTable)
    .values([
      {
        authorId: TEST_USER_ID,
        title: '개발자들을 위한 소개팅 앱',
        content: 'GitHub 잔디 심은 횟수로 매칭해주는 앱입니다. 반응 어떨까요?',
      },
      {
        authorId: TEST_USER_ID,
        title: 'AI가 짜주는 다이어트 식단',
        content:
          '냉장고 사진 찍으면 레시피 추천해주는 서비스 만들어보고 싶어요.',
      },
    ])
    .onConflictDoNothing();

  // 기존 모집 데이터 삭제 후 재삽입 (새 컬럼 포함)
  await db.delete(recruitmentsTable);

  await db.insert(recruitmentsTable).values([
    {
      leaderId: TEST_USER_ID,
      title: '감성 독서 기록 앱 팀원 모집',
      summary:
        '책 읽는 사람들을 위한 감성적인 독서 기록 & 공유 앱을 만들고 있어요. 디자인 감각 있는 분 환영!',
      content:
        '독서 기록을 예쁘게 남기고 친구들과 공유할 수 있는 앱입니다. React Native 기반으로 개발 중이며 현재 기획/디자인은 완료된 상태입니다.',
      projectType: 'app',
      techStacks: ['React Native', 'TypeScript', 'Supabase', 'Expo'],
      roles: ['frontend', 'design'],
      headcount: 3,
      openChatUrl: 'https://open.kakao.com/o/test1',
      isClosed: 'FALSE',
    },
    {
      leaderId: USER_2_ID,
      title: 'AI 기반 코드리뷰 자동화 툴 개발',
      summary:
        'PR을 올리면 AI가 자동으로 코드리뷰를 달아주는 개발자 도구입니다. 백엔드/ML 엔지니어 구합니다.',
      content:
        'GitHub Actions와 연동해 PR 생성 시 AI가 코드를 분석하고 리뷰 코멘트를 자동으로 달아주는 서비스입니다.',
      projectType: 'ai',
      techStacks: ['Python', 'FastAPI', 'OpenAI', 'GitHub Actions', 'Docker'],
      roles: ['backend', 'data'],
      headcount: 2,
      openChatUrl: 'https://open.kakao.com/o/test2',
      isClosed: 'FALSE',
    },
    {
      leaderId: USER_3_ID,
      title: '로컬 맛집 큐레이션 웹서비스 MVP',
      summary:
        '동네 숨은 맛집을 동네 주민이 직접 큐레이션하는 서비스예요. 풀스택 개발자 1명 모집!',
      content:
        '네이버/카카오 지도 API를 활용해 동네 주민이 직접 맛집을 등록하고 추천하는 플랫폼입니다.',
      projectType: 'web',
      techStacks: ['Next.js', 'TypeScript', 'Supabase', 'Tailwind CSS'],
      roles: ['fullstack'],
      headcount: 2,
      openChatUrl: 'https://open.kakao.com/o/test3',
      isClosed: 'FALSE',
    },
    {
      leaderId: TEST_USER_ID,
      title: '개발자 포트폴리오 자동생성 SaaS',
      summary:
        'GitHub 연동만 하면 포트폴리오 사이트가 자동으로 만들어지는 서비스입니다. 디자이너 & PM 구해요.',
      content:
        'GitHub API로 기여도, 언어, 프로젝트를 분석해 자동으로 개인 포트폴리오 페이지를 생성해주는 SaaS입니다.',
      projectType: 'web',
      techStacks: ['Next.js', 'TypeScript', 'GitHub API', 'Vercel', 'Prisma'],
      roles: ['design', 'pm'],
      headcount: 3,
      openChatUrl: 'https://open.kakao.com/o/test4',
      isClosed: 'FALSE',
    },
    {
      leaderId: USER_2_ID,
      title: '헬스 루틴 공유 커뮤니티 앱',
      summary:
        '운동 루틴을 공유하고 서로 응원해주는 소셜 피트니스 앱이에요. iOS/Android 개발자 모집 중!',
      content:
        '나만의 운동 루틴을 기록하고 다른 사용자와 공유하며 동기부여를 받는 앱입니다.',
      projectType: 'app',
      techStacks: ['Flutter', 'Dart', 'Firebase', 'Riverpod'],
      roles: ['ios', 'android'],
      headcount: 4,
      openChatUrl: 'https://open.kakao.com/o/test5',
      isClosed: 'FALSE',
    },
    {
      leaderId: USER_3_ID,
      title: '유니티 기반 멀티플레이 캐주얼 게임',
      summary:
        '친구들과 함께 즐기는 파티 게임을 만들어요. 게임 클라이언트 개발자 & 아티스트를 찾습니다!',
      content:
        'Unity로 개발하는 모바일 멀티플레이 파티 게임입니다. 서버는 Mirror Networking을 활용할 예정입니다.',
      projectType: 'game',
      techStacks: ['Unity', 'C#', 'Blender'],
      roles: ['frontend', 'design'],
      headcount: 4,
      openChatUrl: 'https://open.kakao.com/o/test6',
      isClosed: 'FALSE',
    },
    {
      leaderId: TEST_USER_ID,
      title: 'LLM 기반 개인 학습 도우미 서비스',
      summary:
        'AI가 내 학습 패턴을 분석해 맞춤 커리큘럼을 짜주는 서비스입니다. ML 엔지니어 모집!',
      content:
        'LangChain과 OpenAI를 활용해 사용자의 학습 이력을 분석하고 최적의 학습 경로를 제안합니다.',
      projectType: 'ai',
      techStacks: ['Python', 'LangChain', 'OpenAI', 'FastAPI', 'PostgreSQL'],
      roles: ['data', 'backend'],
      headcount: 3,
      openChatUrl: 'https://open.kakao.com/o/test7',
      isClosed: 'FALSE',
    },
    {
      leaderId: USER_2_ID,
      title: '사이드 프로젝트 매칭 플랫폼',
      summary:
        '개발자, 디자이너, 기획자가 모여 사이드 프로젝트를 함께 만드는 매칭 플랫폼입니다.',
      content:
        '스택, 관심사, 작업 스타일을 기반으로 사이드 프로젝트 팀을 매칭해주는 서비스입니다.',
      projectType: 'web',
      techStacks: ['React', 'Node.js', 'PostgreSQL', 'Redis', 'AWS'],
      roles: ['backend', 'devops'],
      headcount: 5,
      openChatUrl: 'https://open.kakao.com/o/test8',
      isClosed: 'TRUE',
    },
  ]);

  console.log('🌱 Seeding finished!');
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
