import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { ImageUrl } from '../../../../../libs/common/src';
import { NotFoundPostsException } from '../../exception/not-found.posts.exception';
import { PostRepositoryImpl } from '../../infra/post.repository.impl';
import { Post } from '../domain/entities/post.entity';
import { PostId } from '../domain/entities/post.id';
import { PostRepository } from '../domain/repository/post.repository';
import { EditPostsCommand } from '../impl/edit.posts.command';

@CommandHandler(EditPostsCommand)
export class EditPostsCommandHandler
  implements ICommandHandler<EditPostsCommand>
{
  private readonly postRepository: PostRepository;

  constructor(
    postRepositoryImpl: PostRepositoryImpl,
    private readonly eventPublisher: EventPublisher,
  ) {
    this.postRepository = postRepositoryImpl;
  }

  async execute(command: EditPostsCommand): Promise<PostId> {
    const postId = PostId.of({ id: command.id });

    let post = await this.postRepository.findById(postId);

    await this.validate(command, post);

    post = this.eventPublisher.mergeObjectContext(post);

    await this.editPost(command, post);

    await this.postRepository.save(post);

    this.publishEvent(post);

    return post.id;
  }

  private async validate(command: EditPostsCommand, post: Post) {
    if (!post) {
      throw new NotFoundPostsException(post.id);
    }
  }

  /**
   * 포스트 객체 생성
   * @param command
   */
  async editPost(command: EditPostsCommand, post: Post) {
    const images: ImageUrl[] = command.images.map((image) =>
      ImageUrl.of({ url: image }),
    );

    await post.editPost({ ...command, images });
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
