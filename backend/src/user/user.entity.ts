import { Post } from 'src/post/post.entity';
import {
	DataType,
	Model,
	Table,
	Column,
	Default,
	HasMany,
	Unique,
} from 'sequelize-typescript';
import { Follow } from 'src/follow/follow.entity';

@Table
export class User extends Model {
	@Column({
		type: DataType.UUID,
		defaultValue: DataType.UUIDV4,
		allowNull: false,
		primaryKey: true,
	})
	id: string;

	@Unique
	@Column({
		type: DataType.STRING,
		allowNull: false,
	})
	name: string;

	@Unique
	@Column({
		type: DataType.STRING,
		allowNull: false,
	})
	email: string;

	@Column({
		type: DataType.STRING,
		allowNull: false,
	})
	password: string;

	@Default(
		'https://deepgrouplondon.com/wp-content/uploads/2019/06/person-placeholder-5.png',
	)
	@Column({
		type: DataType.TEXT,
		allowNull: false,
	})
	profileImgUrl: string;

	@Default(0)
	@Column({
		type: DataType.INTEGER,
		allowNull: false,
	})
	followersNumber: number;

	@HasMany(() => Follow, { foreignKey: 'followedId', as: 'followers' })
	followers: Follow[];

	@HasMany(() => Follow, { foreignKey: 'followerId', as: 'followings' })
	followings: Follow[];

	@Default('')
	@Column({
		type: DataType.TEXT,
		allowNull: false,
	})
	bio: string;

	@HasMany(() => Post)
	posts: Post[];

	@Column({
		type: DataType.BOOLEAN,
		defaultValue: false,
		allowNull: false,
	})
	isAdmin: boolean;

	@Column({
		type: DataType.DATE,
		allowNull: false,
	})
	createdAt: Date;
}
