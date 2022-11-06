import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export type ChannelType = 'PUBLIC' | 'PRIVATE' | 'PROTECTED';

@Entity({ name: 'channels' })
export class Channel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 255,
  })
  name: string;

  @Column({
    type: 'int',
    nullable: false,
  })
  owner_id: number;

  @Column({
    type: 'enum',
    enum: ['PUBLIC', 'PRIVATE', 'PROTECTED'],
    default: 'PUBLIC',
  })
  type: ChannelType;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  password: string;
}