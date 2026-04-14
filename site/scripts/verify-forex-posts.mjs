import Zernio from '@zernio/node';
const z = new Zernio();

const IDS = {
  carousel: '69da4cb9a73ff01a847edccc',
  reel: '69da4d15da20982ae6d015bc',
};

for (const [name, id] of Object.entries(IDS)) {
  const res = await z.posts.getPost({ path: { postId: id } });
  const post = res?.data?.post ?? res?.data ?? res;
  console.log(`\n=== ${name.toUpperCase()} (${id}) ===`);
  console.log('status:', post?.status ?? '?');
  console.log('mediaType:', post?.mediaType ?? '?');
  console.log('publishedAt:', post?.publishedAt ?? '?');
  console.log('platformPostUrl:', post?.platformPostUrl ?? '?');
  if (post?.platforms) {
    for (const p of post.platforms) {
      console.log(`  platform=${p.platform} accountId=${p.accountId} status=${p.status ?? p.publishStatus ?? '?'} url=${p.platformPostUrl ?? p.url ?? '?'} error=${p.error ?? p.errorMessage ?? ''}`);
    }
  }
}
