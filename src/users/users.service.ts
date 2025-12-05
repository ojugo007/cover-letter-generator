import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UserEntity } from './models/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
    constructor(@InjectRepository(UserEntity) private readonly repo: Repository<UserEntity>) { }

    async findByEmail(email: string) {
        if (!email) {
            throw new BadRequestException('email is required')
        }
        return this.repo.findOne({
            where: { email }
        })
    }

    async getUserByEmailOrFail(email: string) {
        const user = await this.findByEmail(email)

        if (!user) {
            throw new NotFoundException('user with the email was not found')
        }

        return user
    }

    async findById(id: string) {
        const user = await this.repo.findOne({ where: { id } })
        if (!user) {
            throw new NotFoundException(" User not found")
        }
        return {
            id: user.id,
            fullname: user.fullname,
            email: user.email,
            skills: user.skills,
            years_of_exp: user.years_of_exp,
            work_exp: user.work_exp,
            bio: user.bio,
            address: user.address,
            phone: user.phone,
            role: user.role,
            created_at: user.created_at
        }
    }

    async createUser(data: Partial<UserEntity>) {
        if (!data.email || !data.fullname || !data.password) {
            throw new BadRequestException('All fields are required')
        }

        const isUser = await this.findByEmail(data.email)

        if (isUser) {
            throw new BadRequestException('user with the email, already exist')
        }
        const user = this.repo.create(data)

        return await this.repo.save(user)
    }

    async UpdateProfile(id: string, data: Partial<UserEntity>) {
        const user = await this.findById(id)
        Object.assign(user, data)
        return this.repo.save(user)
    }
}
