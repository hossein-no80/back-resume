import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export default class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: false })
  email: string;

  @Column({ length: 25, nullable: true })
  lastname: string;

  @Column({ length: 25, nullable: true })
  firstname: string;

  @Column({ nullable: true })
  age: number;

  @Column({ select: false, nullable: false })
  password: string;

  @Column({ type: 'varchar', nullable: true, select: false })
  refreshToken: string | null;
}
