import { UserId } from '@app/common';
import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import * as dayjs from 'dayjs';
import { nanoid } from 'nanoid';
import { NotFoundPostException } from '../../exception/not-found-post.exception';
import { PostCommentRepositoryImpl } from '../../infra/post-comment.repository.impl';
import { PostRepositoryImpl } from '../../infra/post.repository.impl';
import { PostComment } from '../domain/entities/post-comment.entity';
import { PostCommentId } from '../domain/entities/post-comment.id';
import { PostId } from '../domain/entities/post.id';
import { PostCommentRepository } from '../domain/repository/post-comment.repository';
import { PostRepository } from '../domain/repository/post.repository';
import { CreatePostsCommentCommand } from '../impl/create.posts-comment.command';

@CommandHandler(CreatePostsCommentCommand)
export class CreatePostsCommentCommandHandler
  implements ICommandHandler<CreatePostsCommentCommand>
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

  async execute(command: CreatePostsCommentCommand): Promise<PostId> {
    const post = await this.postRepository.findById(
      PostId.of({ id: command.postId }),
    );
    if (!post)
      throw new NotFoundPostException(PostId.of({ id: command.postId }));

    await this.validate(command);

    const postComment = await this.createPostComment(command);

    await this.postCommentRepository.save(postComment);

    this.publishEvent(postComment);

    return postComment.id;
  }

  private async validate(command: CreatePostsCommentCommand) {}

  /**
   * 포스트 댓글 객체 생성
   * @param command
   */
  async createPostComment(command: CreatePostsCommentCommand) {
    const id = nanoid();

    const postComment = this.eventPublisher.mergeObjectContext(
      await PostComment.create({
        ...command,
        id: PostCommentId.of({ id }),
        postId: PostId.of({ id: command.postId }),
        parentCommentId: command.parentCommentId,
        writer: UserId.of({ id: command.createBy }),
        isUse: true,
        createBy: command.createBy,
        createdAt: dayjs(),
      }),
    );

    return postComment;
  }

  /**
   * 이벤트 발생
   * @param user
   */
  private publishEvent(post: PostComment) {
    // post.apply(new CreatedUserEvent(post.id));
    post.commit();
  }
}
