import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { NotFoundPostCommentException } from '../../exception/not-found-post-comment.exception';
import { NotFoundPostException } from '../../exception/not-found-post.exception';
import { PostCommentRepositoryImpl } from '../../infra/post-comment.repository.impl';
import { PostRepositoryImpl } from '../../infra/post.repository.impl';
import { PostComment } from '../domain/entities/post-comment.entity';
import { PostCommentId } from '../domain/entities/post-comment.id';
import { Post } from '../domain/entities/post.entity';
import { PostId } from '../domain/entities/post.id';
import { PostCommentRepository } from '../domain/repository/post-comment.repository';
import { PostRepository } from '../domain/repository/post.repository';
import { EditCommentPostsCommand } from '../impl/edit-comment.posts.command';

@CommandHandler(EditCommentPostsCommand)
export class EditCommentPostsCommandHandler
  implements ICommandHandler<EditCommentPostsCommand>
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

  async execute(command: EditCommentPostsCommand): Promise<PostId> {
    const post = await this.postRepository.findById(
      PostId.of({ id: command.postId }),
    );

    let postComment = await this.postCommentRepository.findById(
      PostCommentId.of({ id: command.postCommentId }),
    );

    await this.validate(command, { post, postComment });

    postComment = this.eventPublisher.mergeObjectContext(postComment);

    await this.edit(postComment, command);

    await this.postCommentRepository.save(postComment);

    this.publishEvent(postComment);

    return postComment.id;
  }

  private async validate(
    command: EditCommentPostsCommand,
    params: { post: Post; postComment: PostComment },
  ) {
    const { post, postComment } = params;
    if (!post)
      throw new NotFoundPostException(PostId.of({ id: command.postId }));

    if (!postComment)
      throw new NotFoundPostCommentException(
        PostCommentId.of({ id: command.postCommentId }),
      );
  }

  private async edit(
    postComment: PostComment,
    command: EditCommentPostsCommand,
  ) {
    await postComment.editPostComment(command);
  }

  /**
   * 이벤트 발생
   * @param user
   */
  private publishEvent(postComment: PostComment) {
    // post.apply(new EditdUserEvent(post.id));
    postComment.commit();
  }
}
