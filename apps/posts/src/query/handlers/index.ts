import { FindByIdsUsersQueryHandler } from '@app/common';
import { FindAllPostsQueryHandler } from './find-all.posts.query-handler';

export const QueryHandlers = [
  FindAllPostsQueryHandler,
  FindByIdsUsersQueryHandler,
];
