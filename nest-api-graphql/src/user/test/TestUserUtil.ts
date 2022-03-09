import { User } from '../user.entity';
export const giveMeAValidUser = (): User => {
    const user = new User();
    user.email = 'valid@email.com';
    user.id = '123';
    user.name = 'Lucas João Silva';
    return user;
};
