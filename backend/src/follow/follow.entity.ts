import {
	DataType,
	Model,
	Table,
	Column,
	ForeignKey,
	BelongsTo,
} from 'sequelize-typescript';
import { User } from 'src/user/user.entity';

@Table
export class Follow extends Model {
	@Column({
		type: DataType.UUID,
		defaultValue: DataType.UUIDV4,
		allowNull: false,
		primaryKey: true,
	})
	id: string;

	@ForeignKey(() => User)
	@Column({
		type: DataType.UUID,
		allowNull: false,
	})
	followerId: string;

	@ForeignKey(() => User)
	@Column({
		type: DataType.UUID,
		allowNull: false,
	})
	followedId: string;

	@BelongsTo(() => User, { as: 'follower' })
	follower: User;

	@BelongsTo(() => User, { as: 'followed' })
	followed: User;

	@Column({
		type: DataType.DATE,
		allowNull: false,
	})
	createdAt: Date;
}
