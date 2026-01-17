import {
	Table,
	Column,
	Model,
	DataType,
	PrimaryKey,
	ForeignKey,
	BelongsTo,
} from 'sequelize-typescript';
import { User } from 'src/user/user.entity';
import { DevlogEvent } from 'src/devlog-event/devlog-event.entity';

@Table({ tableName: 'Comments', timestamps: true })
export class Comment extends Model {
	@PrimaryKey
	@Column({
		type: DataType.UUID,
		defaultValue: DataType.UUIDV4,
		allowNull: false,
	})
	id: string;

	@Column({
		type: DataType.TEXT,
		allowNull: false,
	})
	content: string;

	@ForeignKey(() => User)
	@Column({
		type: DataType.UUID,
		allowNull: false,
	})
	authorId: string;

	@BelongsTo(() => User)
	author: User;

	@ForeignKey(() => DevlogEvent)
	@Column({
		type: DataType.UUID,
		allowNull: false,
	})
	postId: string;

	@BelongsTo(() => DevlogEvent)
	post: DevlogEvent;

	@ForeignKey(() => Comment)
	@Column({
		type: DataType.UUID,
		allowNull: true,
	})
	commentParentId?: string;

	@BelongsTo(() => Comment)
	parentComment: Comment;
}
