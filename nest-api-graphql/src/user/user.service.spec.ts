import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './user.entity';
import { giveMeAValidUser } from './test/TestUserUtil';
import {
    InternalServerErrorException,
    NotFoundException
} from '@nestjs/common';
import { UpdateUserInput } from './dto/update-user.input';

describe('UserService', () => {
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

    const resetMocks = async () => {
        mockRepository.find.mockReset();
        mockRepository.findOne.mockReset();
        mockRepository.create.mockReset();
        mockRepository.save.mockReset();
        mockRepository.update.mockReset();
        mockRepository.delete.mockReset();
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UserService,
                {
                    provide: getRepositoryToken(User),
                    useValue: mockRepository
                }
            ]
        }).compile();

        service = module.get<UserService>(UserService);
    });

    test('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('When search all users', () => {
        test('should list all users', async () => {
            const user = giveMeAValidUser();
            mockRepository.find.mockReturnValue([user, user]);
            const users = await service.findAllUsers();
            expect(users).toHaveLength(2);
            expect(mockRepository.find).toBeCalledTimes(1);
        });
    });

    describe('When search user by id', () => {
        beforeEach(resetMocks);
        test('should find a existing user', async () => {
            const user = giveMeAValidUser();
            mockRepository.findOne.mockReturnValue(user);
            const userFound = await service.findUserById('123');
            expect(userFound).toMatchObject(user);
            expect(mockRepository.findOne).toBeCalledTimes(1);
        });

        test('should return a exception when user is not found', async () => {
            mockRepository.findOne.mockReturnValue(null);
            expect(service.findUserById('1')).rejects.toBeInstanceOf(
                NotFoundException
            );
            expect(mockRepository.findOne).toBeCalledTimes(1);
        });
    });

    describe('When create user', () => {
        beforeEach(resetMocks);
        test('should create a user', async () => {
            const user = giveMeAValidUser();
            mockRepository.save.mockReturnValue(user);
            mockRepository.create.mockReturnValue(user);
            const userCreated = await service.createUser(user);
            expect(mockRepository.save).toBeCalledTimes(1);
            expect(mockRepository.create).toBeCalledTimes(1);
            expect(userCreated).toMatchObject(user);
        });

        test('should return a exception when does not create a user', async () => {
            const user = giveMeAValidUser();
            mockRepository.create.mockReturnValue(user);
            mockRepository.save.mockReturnValue(null);
            expect(service.createUser(user)).rejects.toBeInstanceOf(
                InternalServerErrorException
            );
            expect(mockRepository.create).toBeCalledTimes(1);
            expect(mockRepository.save).toBeCalledTimes(1);
        });
    });

    describe('When update user', () => {
        beforeEach(resetMocks);
        test('should update a user', async () => {
            const user = giveMeAValidUser();
            mockRepository.findOne.mockReturnValue(user);
            const data = new UpdateUserInput();
            data.name = 'José';
            mockRepository.create.mockReturnValue({ ...user, ...data });
            const userUpdated = await service.updateUser(user.id, data);
            expect(userUpdated).toMatchObject(data);
            expect(mockRepository.findOne).toBeCalledTimes(1);
            expect(mockRepository.create).toBeCalledTimes(1);
            expect(mockRepository.update).toBeCalledTimes(1);
        });
    });

    describe('When delete user', () => {
        beforeEach(resetMocks);
        test('should delete a existing user', async () => {
            const user = giveMeAValidUser();
            mockRepository.findOne.mockReturnValue(user);
            mockRepository.delete.mockReturnValue(true);
            const userDeleted = await service.deleteUser(user.id);
            expect(userDeleted).toBeTruthy();
            expect(mockRepository.findOne).toBeCalledTimes(1);
            expect(mockRepository.delete).toBeCalledTimes(1);
        });

        test('should not delete a existing user', async () => {
            const user = giveMeAValidUser();
            mockRepository.findOne.mockReturnValue(user);
            mockRepository.delete.mockReturnValue(false);
            const userDeleted = await service.deleteUser(user.id);
            expect(userDeleted).toBeFalsy();
            expect(mockRepository.findOne).toBeCalledTimes(1);
            expect(mockRepository.delete).toBeCalledTimes(1);
        });
    });
});
