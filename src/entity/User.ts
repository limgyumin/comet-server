import { Entity, BaseEntity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("user")
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  idx: number;

  @Column({
    nullable: false,
    length: 45,
  })
  user_id: string;

  @Column({
    nullable: false,
    length: 255,
  })
  profile: string;

  @Column({
    nullable: false,
    length: 255,
  })
  bio: string;

  @Column({
    nullable: false,
  })
  total_commit: number;

  @Column({
    nullable: false,
  })
  today_commit: number;

  @Column({
    nullable: false,
  })
  week_commit: number;

  @Column({
    nullable: false,
  })
  week_avg: number;
}
