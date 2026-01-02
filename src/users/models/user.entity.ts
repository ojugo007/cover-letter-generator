import { BeforeInsert, BeforeUpdate, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import * as bcrypt from 'bcrypt'


@Entity({name: 'users'})
export class UserEntity {

    @PrimaryGeneratedColumn('uuid')
    id:string

    @Column({type:'varchar', length: 225})
    fullname: string

    @Column({unique:true})
    email:string

    @Column()
    password: string

    @Column('text', {array:true, nullable: true})
    skills: string[];

    @Column({type:'int', nullable: true})
    years_of_exp: number;

    @Column({type:'varchar' , length: 350, nullable: true})
    work_exp: string;
    
    @Column({type:'varchar', length: 500, nullable: true})
    bio: string

    @Column({type:'varchar', length: 150, nullable: true})
    address: string

    @Column({type:'varchar', length: 20, nullable: true})
    phone: string

    @Column({type:'varchar', length: 255, nullable: true})
    linkedin_url: string

    @Column({type:'varchar', length: 255, nullable: true})
    personal_url: string

    @Column({ type: 'enum', enum: ['user', 'admin'], default: 'user' })
    role: string;

    @Column({ default: false })
    profileCompleted: boolean;


    @CreateDateColumn({type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date

    @UpdateDateColumn({type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    updated_at: Date

    @BeforeInsert()
    async hashPassword(){
        if(this.password){
            this.password = bcrypt.hashSync(this.password, 10)
        }
    }
    
}