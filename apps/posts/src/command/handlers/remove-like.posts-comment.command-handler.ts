import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { UserId } from '../../../../../libs/common/src';
import { NotFoundPostCommentException } from '../../exception/not-found-post-comment.exception';
import { PostCommentRepositoryImpl } from '../../infra/post-comment.repository.impl';
import { PostRepositoryImpl } from '../../infra/post.repository.impl';
import { PostComment } from '../domain/entities/post-comment.entity';
import { PostCommentId } from '../domain/entities/post-comment.id';
import { Post } from '../domain/entities/post.entity';
import { PostId } from '../domain/entities/post.id';
import { PostCommentRepository } from '../domain/repository/post-comment.repository';
import { PostRepository } from '../domain/repository/post.repository';
import { RemoveLikePostsCommentCommand } from '../impl/remove-like.posts-comment.command';

@CommandHandler(RemoveLikePostsCommentCommand)
export class RemoveLikePostCommentsCommandHandler
  implements ICommandHandler<RemoveLikePostsCommentCommand>
{
  private readonly postRepository: PostRepository;
  private readonly postCommentRepository: PostCommentRepository;

  constructor(
    postRepositoryImpl: PostRepositoryImpl,
    postCommentRepositoryImpl: PostCommentRepositoryImpl,
    private readonly eventPublisher: EventPublisher,
  ) {
    this.postRepository = postRepositoryImpl;
    this.postCommentRepository = postCommentRepositoryImpl;
  }

  async execute(command: RemoveLikePostsCommentCommand): Promise<PostId> {
    const post = await this.postRepository.findById(
      PostId.of({ id: command.postId }),
    );

    const postComment = this.eventPublisher.mergeObjectContext(
      await this.postCommentRepository.findById(
        PostCommentId.of({ id: command.postCommentId }),
      ),
    );

    await this.validate(command, { post, postComment });

    await this.removeLike(postComment, command);

    await this.postCommentRepository.save(postComment);

    this.publishEvent(postComment);

    return postComment.id;
  }

  private async validate(
    command: RemoveLikePostsCommentCommand,
    params: { post: Post; postComment: PostComment },
  ) {
    const { post, postComment } = params;
    if (!post) throw new NotFoundPostCommentException(post.id);

    if (!postComment)
      throw new NotFoundPostCommentException(
        PostCommentId.of({ id: command.postCommentId }),
      );
  }

  private async removeLike(
    post: PostComment,
    command: RemoveLikePostsCommentCommand,
  ) {
    await post.removeLike({ userId: UserId.of({ id: command.userId }) });
  }

  /**
   * 이벤트 발생
   * @param user
   */
  private publishEvent(post: PostComment) {
    // post.apply(new EditdUserEvent(post.id));
    post.commit();
  }
}
