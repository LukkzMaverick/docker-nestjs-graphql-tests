import { Test, TestingModule } from '@nestjs/testing';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';
import { User } from './user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('UserResolver', () => {
    let resolver: UserResolver;
    let service: UserService;

    const mockRepository = {
        find: jest.fn(),
        findOne: jest.fn(),
        create: jest.fn(),
        findUserById: jest.fn(),
        update: jest.fn(),
        save: jest.fn(),
        delete: jest.fn()
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UserResolver,
                UserService,
                {
                    provide: getRepositoryToken(User),
                    useValue: mockRepository
                }
            ]
        }).compile();

        resolver = module.get<UserResolver>(UserResolver);
        service = module.get<UserService>(UserService);
    });

    it('should be defined', () => {
        expect(resolver).toBeDefined();
    });
});
