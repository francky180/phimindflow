import Zernio from '@zernio/node';

const zernio = new Zernio();

try {
  const res = await zernio.messages.listInboxConversations({
    query: { platform: 'instagram', limit: 10 },
  });

  const items = res?.data ?? res?.conversations ?? res ?? [];
  const list = Array.isArray(items) ? items : (items.data ?? []);

  if (!list.length) {
    console.log('No inbound Instagram conversations returned.');
    console.log('Raw response keys:', Object.keys(res ?? {}));
    console.log(JSON.stringify(res, null, 2).slice(0, 2000));
    process.exit(0);
  }

  console.log(`Last ${list.length} Instagram conversations (most recent first):\n`);
  list.forEach((c, i) => {
    const name = c.participantName ?? c.username ?? c.from?.username ?? c.participant?.username ?? '(unknown)';
    const handle = c.participantHandle ?? c.handle ?? c.from?.handle ?? '';
    const ts = c.updatedTime ?? c.lastMessageTime ?? c.timestamp ?? '';
    const unread = c.unreadCount ?? 0;
    const preview = (c.lastMessage?.text ?? c.lastMessage ?? c.snippet ?? '').toString().slice(0, 80);
    console.log(`${i + 1}. ${name}${handle ? ' @' + handle : ''}  |  unread: ${unread}  |  ${ts}`);
    if (preview) console.log(`   "${preview}"`);
  });
} catch (err) {
  console.error('Zernio call failed:', err?.message ?? err);
  if (err?.response) console.error('response:', JSON.stringify(err.response, null, 2).slice(0, 1500));
  process.exit(1);
}
