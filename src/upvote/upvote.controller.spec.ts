import { Test, TestingModule } from '@nestjs/testing';
import { UpvoteController } from './upvote.controller';

describe('UpvoteController', () => {
  let controller: UpvoteController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UpvoteController],
    }).compile();

    controller = module.get<UpvoteController>(UpvoteController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
