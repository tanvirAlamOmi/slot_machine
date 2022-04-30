import { Exclude } from 'class-transformer'
import { IsDate, Length } from 'class-validator'
import { Entity, Column, CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @Length(4, 10)
    username: string;

    @Column()
    email: string;
 
    @Column()
    @Exclude()
    password: string;

    @Column({ default: true })
    isActive: boolean;
 
    @CreateDateColumn()
    @IsDate()
    createdAt : Date;
 
    @UpdateDateColumn()
    @IsDate()
    updtedAt : Date;

}
