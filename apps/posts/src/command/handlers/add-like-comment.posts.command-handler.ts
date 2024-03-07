import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { UserId } from '../../../../../libs/common/src';
import { NotFoundCommentPostsException } from '../../exception/not-found-comment.posts.exception';
import { PostCommentRepositoryImpl } from '../../infra/post-comment.repository.impl';
import { PostRepositoryImpl } from '../../infra/post.repository.impl';
import { PostComment } from '../domain/entities/post-comment.entity';
import { PostCommentId } from '../domain/entities/post-comment.id';
import { Post } from '../domain/entities/post.entity';
import { PostId } from '../domain/entities/post.id';
import { PostCommentRepository } from '../domain/repository/post-comment.repository';
import { PostRepository } from '../domain/repository/post.repository';
import { AddLikeCommentPostsCommand } from '../impl/add-like-comment.posts.command';

@CommandHandler(AddLikeCommentPostsCommand)
export class AddLikeCommentPostsCommandHandler
  implements ICommandHandler<AddLikeCommentPostsCommand>
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

  async execute(command: AddLikeCommentPostsCommand): Promise<PostId> {
    const post = await this.postRepository.findById(
      PostId.of({ id: command.postId }),
    );

    let postComment = await this.postCommentRepository.findById(
      PostCommentId.of({ id: command.postCommentId }),
    );

    await this.validate(command, { post, postComment });

    postComment = this.eventPublisher.mergeObjectContext(postComment);

    await this.addLike(postComment, command);

    await this.postCommentRepository.save(postComment);

    this.publishEvent(postComment);

    return postComment.id;
  }

  private async validate(
    command: AddLikeCommentPostsCommand,
    params: { post: Post; postComment: PostComment },
  ) {
    const { post, postComment } = params;
    if (!post) throw new NotFoundCommentPostsException(post.id);

    if (!postComment)
      throw new NotFoundCommentPostsException(
        PostCommentId.of({ id: command.postCommentId }),
      );
  }

  private async addLike(
    postComment: PostComment,
    command: AddLikeCommentPostsCommand,
  ) {
    await postComment.addLike({ userId: UserId.of({ id: command.userId }) });
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
