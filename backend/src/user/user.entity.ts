import { DevlogEvent } from 'src/devlog-event/devlog-event.entity';
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
import { Project } from 'src/project/project.entity';

@Table
export class User extends Model {
	@Column({
		type: DataType.UUID,
		defaultValue: DataType.UUIDV4,
		allowNull: false,
		primaryKey: true,
	})
	id: string;

	@Column({
		type: DataType.STRING,
		allowNull: false,
	})
	name: string;

	@Column({
		type: DataType.STRING,
		allowNull: false,
		unique: true,
	})
	slug: string;

	@Unique
	@Column({
		type: DataType.STRING,
		allowNull: false,
	})
	email: string;

	@Column({
		type: DataType.STRING,
		allowNull: true,
	})
	password: string;

	@Column({
		type: DataType.STRING,
		allowNull: true,
		unique: true,
	})
	googleId: string;

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

	@HasMany(() => Project)
	projects: Project[];

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
