import { ImageUrl, UserId } from '@app/common';
import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import * as dayjs from 'dayjs';
import { nanoid } from 'nanoid';
import { PostRepositoryImpl } from '../../infra/post.repository.impl';
import { Post } from '../domain/entities/post.entity';
import { PostId } from '../domain/entities/post.id';
import { PostRepository } from '../domain/repository/post.repository';
import { CreatePostsCommand } from '../impl/create.posts.command';

@CommandHandler(CreatePostsCommand)
export class CreatePostsCommandHandler
  implements ICommandHandler<CreatePostsCommand>
{
  private readonly postRepository: PostRepository;

  constructor(
    postRepositoryImpl: PostRepositoryImpl,
    private readonly eventPublisher: EventPublisher,
  ) {
    this.postRepository = postRepositoryImpl;
  }

  async execute(command: CreatePostsCommand): Promise<PostId> {
    await this.validate(command);

    const post = await this.createPost(command);

    await this.postRepository.save(post);

    this.publishEvent(post);

    return post.id;
  }

  private async validate(command: CreatePostsCommand) {}

  /**
   * 포스트 객체 생성
   * @param command
   */
  async createPost(command: CreatePostsCommand) {
    const id = nanoid();

    const post = this.eventPublisher.mergeObjectContext(
      await Post.create({
        ...command,
        id: PostId.of({ id }),
        images: command.images.map((image) => ImageUrl.of({ url: image })),
        writer: UserId.of({ id: command.createBy }),
        isUse: true,
        createBy: command.createBy,
        createdAt: dayjs(),
      }),
    );

    return post;
  }

  /**
   * 이벤트 발생
   * @param user
   */
  private publishEvent(post: Post) {
    // post.apply(new CreatedUserEvent(post.id));
    post.commit();
  }
}
