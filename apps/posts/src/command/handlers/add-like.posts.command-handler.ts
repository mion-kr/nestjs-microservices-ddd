import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { UserId } from '../../../../../libs/common/src';
import { NotFoundPostException } from '../../exception/not-found-post.exception';
import { PostRepositoryImpl } from '../../infra/post.repository.impl';
import { Post } from '../domain/entities/post.entity';
import { PostId } from '../domain/entities/post.id';
import { PostRepository } from '../domain/repository/post.repository';
import { AddLikePostsCommand } from '../impl/add-like.posts.command';

@CommandHandler(AddLikePostsCommand)
export class AddLikePostsCommandHandler
  implements ICommandHandler<AddLikePostsCommand>
{
  private readonly postRepository: PostRepository;

  constructor(
    postRepositoryImpl: PostRepositoryImpl,
    private readonly eventPublisher: EventPublisher,
  ) {
    this.postRepository = postRepositoryImpl;
  }

  async execute(command: AddLikePostsCommand): Promise<PostId> {
    const postId = PostId.of({ id: command.id });

    const post = this.eventPublisher.mergeObjectContext(
      await this.postRepository.findById(postId),
    );

    await this.validate(command, post);

    await this.addLike(post, command);

    await this.postRepository.save(post);

    this.publishEvent(post);

    return post.id;
  }

  private async validate(command: AddLikePostsCommand, post: Post) {
    if (!post) {
      throw new NotFoundPostException(post.id);
    }
  }

  private async addLike(post: Post, command: AddLikePostsCommand) {
    await post.addLike({ userId: UserId.of({ id: command.userId }) });
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
