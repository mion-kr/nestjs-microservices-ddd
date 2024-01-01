import { FindByIdsUsersCommonQueryHandler } from '@app/common';
import { FindAllPostsQueryHandler } from './find-all.posts.query-handler';
import { FindOnePostsQueryHandler } from './find-one.posts.query-handler';

export const QueryHandlers = [
  FindAllPostsQueryHandler,
  FindOnePostsQueryHandler,
  FindByIdsUsersCommonQueryHandler,
];
