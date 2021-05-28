const {ADMIN_KEY} = process.env;

export default async ({i18n, session, replyWithMarkdown}, next) => {
  // return next();

  if (session.adminKey === ADMIN_KEY) {
    return next();
  }

  await replyWithMarkdown(i18n.t('denied'));
};
