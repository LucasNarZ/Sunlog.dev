import {
	Table,
	Column,
	Model,
	DataType,
	PrimaryKey,
	ForeignKey,
	BelongsTo,
	CreatedAt,
	AllowNull,
	UpdatedAt,
} from 'sequelize-typescript';
import { User } from 'src/user/user.entity';
import { Post } from 'src/post/post.entity';

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

	@ForeignKey(() => Post)
	@Column({
		type: DataType.UUID,
		allowNull: false,
	})
	postId: string;

	@BelongsTo(() => Post)
	post: Post;

	@ForeignKey(() => Comment)
	@Column({
		type: DataType.UUID,
		allowNull: true,
	})
	commentParentId?: string;

	@BelongsTo(() => Comment)
	parentComment: Comment;
}
