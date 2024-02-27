import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { UserId } from '../../../../../libs/common/src';
import { NotFoundPostException } from '../../exception/not-found-post.exception';
import { PostRepositoryImpl } from '../../infra/post.repository.impl';
import { Post } from '../domain/entities/post.entity';
import { PostId } from '../domain/entities/post.id';
import { PostRepository } from '../domain/repository/post.repository';
import { RemoveLikePostsCommand } from '../impl/remove-like.posts.command';

@CommandHandler(RemoveLikePostsCommand)
export class RemoveLikePostsCommandHandler
  implements ICommandHandler<RemoveLikePostsCommand>
{
  private readonly postRepository: PostRepository;

  constructor(
    postRepositoryImpl: PostRepositoryImpl,
    private readonly eventPublisher: EventPublisher,
  ) {
    this.postRepository = postRepositoryImpl;
  }

  async execute(command: RemoveLikePostsCommand): Promise<PostId> {
    const postId = PostId.of({ id: command.id });

    let post = await this.postRepository.findById(postId);

    await this.validate(command, post);

    post = this.eventPublisher.mergeObjectContext(post);

    await this.removeLike(post, command);

    await this.postRepository.save(post);

    this.publishEvent(post);

    return post.id;
  }

  private async validate(command: RemoveLikePostsCommand, post: Post) {
    if (!post) {
      throw new NotFoundPostException(post.id);
    }
  }

  private async removeLike(post: Post, command: RemoveLikePostsCommand) {
    await post.removeLike({ userId: UserId.of({ id: command.userId }) });
  }

  /**
   * 이벤트 발생
   * @param user
   */
  private publishEvent(post: Post) {
    // post.apply(new EditdUserEvent(post.id));
    post.commit();
  }
}
